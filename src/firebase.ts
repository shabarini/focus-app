import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Конфигурация Firebase из переменных окружения
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
} as const;

// Строгая проверка наличия обязательных переменных окружения
const missingConfigKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingConfigKeys.length > 0) {
  // Подсказка пользователю какие именно ключи отсутствуют
  console.error('❌ Firebase configuration is missing. Missing keys:', missingConfigKeys.join(', '));
  console.error('Создайте файл .env.local в папке focus-app и задайте переменные REACT_APP_FIREBASE_*');
  throw new Error('Firebase configuration is missing');
}

// Инициализация Firebase
const app = initializeApp(firebaseConfig as any);

// Экспорт сервисов Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
