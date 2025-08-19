// Утилиты для валидации данных

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Валидация email
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email обязателен');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Неверный формат email');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Валидация пароля
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Пароль обязателен');
  } else if (password.length < 8) {
    errors.push('Пароль должен содержать минимум 8 символов');
  } else if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Пароль должен содержать строчную букву');
  } else if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Пароль должен содержать заглавную букву');
  } else if (!/(?=.*\d)/.test(password)) {
    errors.push('Пароль должен содержать цифру');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Валидация задачи
export const validateTask = (task: {
  text: string;
  notes?: string;
  files?: any[];
}): ValidationResult => {
  const errors: string[] = [];
  
  if (!task.text || task.text.trim().length === 0) {
    errors.push('Текст задачи обязателен');
  } else if (task.text.length > 500) {
    errors.push('Текст задачи не должен превышать 500 символов');
  }
  
  if (task.notes && task.notes.length > 5000) {
    errors.push('Заметки не должны превышать 5000 символов');
  }
  
  if (task.files && task.files.length > 10) {
    errors.push('Максимум 10 файлов на задачу');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Валидация проекта
export const validateProject = (project: {
  name: string;
  color: string;
}): ValidationResult => {
  const errors: string[] = [];
  
  if (!project.name || project.name.trim().length === 0) {
    errors.push('Название проекта обязательно');
  } else if (project.name.length > 50) {
    errors.push('Название проекта не должно превышать 50 символов');
  }
  
  if (!project.color || !/^#[0-9A-F]{6}$/i.test(project.color)) {
    errors.push('Неверный формат цвета');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Валидация тега
export const validateTag = (tag: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!tag || tag.trim().length === 0) {
    errors.push('Тег обязателен');
  } else if (tag.length > 20) {
    errors.push('Тег не должен превышать 20 символов');
  } else if (!/^[а-яёa-z0-9_-]+$/i.test(tag)) {
    errors.push('Тег может содержать только буквы, цифры, дефисы и подчеркивания');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Валидация файла
export const validateFile = (file: File): ValidationResult => {
  const errors: string[] = [];
  
  // Максимальный размер файла (5MB)
  const maxSize = 5 * 1024 * 1024;
  
  if (file.size > maxSize) {
    errors.push('Размер файла не должен превышать 5MB');
  }
  
  // Разрешенные типы файлов
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    errors.push('Неподдерживаемый тип файла');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Санитизация текста
export const sanitizeText = (text: string): string => {
  return text
    .trim()
    .replace(/[<>]/g, '') // Убираем потенциально опасные символы
    .substring(0, 5000); // Ограничиваем длину
};

// Проверка XSS
export const hasXSS = (text: string): boolean => {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi
  ];
  
  return xssPatterns.some(pattern => pattern.test(text));
};
