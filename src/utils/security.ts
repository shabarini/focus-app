// Дополнительные утилиты безопасности

// Константы безопасности
export const SECURITY_CONSTANTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_TASKS_PER_USER: 1000,
  MAX_PROJECTS_PER_USER: 50,
  MAX_TAGS_PER_USER: 100,
  MAX_NOTES_LENGTH: 5000,
  MAX_TASK_TEXT_LENGTH: 500,
  MAX_FILE_COUNT_PER_TASK: 10,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 минут
  RATE_LIMIT_WINDOW: 60 * 1000, // 1 минута
  RATE_LIMIT_MAX_REQUESTS: 100
};

// Разрешенные типы файлов
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'text/csv',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

// Проверка размера файла
export const validateFileSize = (file: File): boolean => {
  return file.size <= SECURITY_CONSTANTS.MAX_FILE_SIZE;
};

// Проверка типа файла
export const validateFileType = (file: File): boolean => {
  return ALLOWED_FILE_TYPES.includes(file.type);
};

// Проверка имени файла
export const validateFileName = (fileName: string): boolean => {
  // Запрещаем опасные символы в именах файлов
  const dangerousChars = /[<>:"/\\|?*\x00-\x1f]/;
  return !dangerousChars.test(fileName) && fileName.length <= 255;
};

// Ограничение количества запросов (Rate Limiting)
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  isAllowed(userId: string): boolean {
    const now = Date.now();
    const windowStart = now - SECURITY_CONSTANTS.RATE_LIMIT_WINDOW;
    
    if (!this.requests.has(userId)) {
      this.requests.set(userId, [now]);
      return true;
    }

    const userRequests = this.requests.get(userId)!;
    const recentRequests = userRequests.filter(time => time > windowStart);
    
    if (recentRequests.length >= SECURITY_CONSTANTS.RATE_LIMIT_MAX_REQUESTS) {
      return false;
    }

    recentRequests.push(now);
    this.requests.set(userId, recentRequests);
    return true;
  }

  cleanup(): void {
    const now = Date.now();
    const windowStart = now - SECURITY_CONSTANTS.RATE_LIMIT_WINDOW;
    
    for (const [userId, requests] of this.requests.entries()) {
      const recentRequests = requests.filter(time => time > windowStart);
      if (recentRequests.length === 0) {
        this.requests.delete(userId);
      } else {
        this.requests.set(userId, recentRequests);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();

// Очистка старых записей каждые 5 минут
setInterval(() => {
  rateLimiter.cleanup();
}, 5 * 60 * 1000);

// Проверка сессии
export const checkSessionTimeout = (lastActivity: number): boolean => {
  const now = Date.now();
  return (now - lastActivity) < SECURITY_CONSTANTS.SESSION_TIMEOUT;
};

// Валидация URL
export const validateUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    // Разрешаем только HTTP и HTTPS
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// Санитизация HTML (для TipTap редактора)
export const sanitizeHtml = (html: string): string => {
  // Разрешенные теги и атрибуты
  const allowedTags = ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'a'];
  const allowedAttributes = {
    'a': ['href', 'target', 'rel'],
    'h1': [],
    'h2': [],
    'h3': [],
    'ul': [],
    'ol': [],
    'li': [],
    'p': [],
    'br': [],
    'strong': [],
    'b': [],
    'em': [],
    'i': [],
    'u': []
  };

  // Простая санитизация (в продакшене лучше использовать DOMPurify)
  let sanitized = html;
  
  // Удаляем все скрипты
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Удаляем опасные атрибуты
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Удаляем iframe, object, embed
  sanitized = sanitized.replace(/<(iframe|object|embed)\b[^>]*>/gi, '');
  
  return sanitized;
};

// Проверка сложности пароля
export const checkPasswordStrength = (password: string): {
  score: number; // 0-4
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  else feedback.push('Пароль должен содержать минимум 8 символов');

  if (/[a-z]/.test(password)) score++;
  else feedback.push('Добавьте строчные буквы');

  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Добавьте заглавные буквы');

  if (/\d/.test(password)) score++;
  else feedback.push('Добавьте цифры');

  if (/[^a-zA-Z0-9]/.test(password)) score++;
  else feedback.push('Добавьте специальные символы');

  return { score, feedback };
};

// Генерация безопасного токена
export const generateSecureToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Проверка CSRF токена
export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  return token === storedToken && token.length >= 32;
};

// Логирование безопасности
export const logSecurityEvent = (event: string, details: any): void => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[SECURITY] ${event}:`, details);
  }
  // В продакшене здесь можно отправлять в систему мониторинга
};

// Проверка подозрительной активности
export const detectSuspiciousActivity = (userId: string, action: string): boolean => {
  // Простая проверка (в продакшене лучше использовать ML)
  const suspiciousPatterns = [
    /script/i,
    /javascript/i,
    /<iframe/i,
    /on\w+\s*=/i
  ];

  return suspiciousPatterns.some(pattern => pattern.test(action));
};
