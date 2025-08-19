import { useState, useEffect } from 'react';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  onSnapshot,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase';

export const useFirebase = (user: any) => {
  const [loading, setLoading] = useState(true);

  // Сохранение данных в Firebase
  const saveToFirebase = async (data: any, key: string) => {
    if (!user) return;
    
    try {
      const userDoc = doc(db, 'users', user.uid);
      await setDoc(userDoc, {
        [key]: data,
        updatedAt: new Date()
      }, { merge: true });
    } catch (error) {
      console.error('Ошибка сохранения в Firebase:', error);
    }
  };

  // Загрузка данных из Firebase
  const loadFromFirebase = async (key: string, defaultValue: any) => {
    if (!user) return defaultValue;
    
    try {
      const userDoc = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDoc);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return data[key] || defaultValue;
      }
      return defaultValue;
    } catch (error) {
      console.error('Ошибка загрузки из Firebase:', error);
      return defaultValue;
    }
  };

  // Реальное время обновления данных
  const subscribeToData = (key: string, callback: (data: any) => void) => {
    if (!user) return () => {};

    const userDoc = doc(db, 'users', user.uid);
    return onSnapshot(userDoc, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        callback(data[key] || null);
      } else {
        callback(null);
      }
    });
  };

  // Синхронизация с localStorage (для офлайн режима)
  const syncWithLocalStorage = async (key: string, defaultValue: any) => {
    if (!user) return defaultValue;

    try {
      // Сначала загружаем из Firebase
      const firebaseData = await loadFromFirebase(key, defaultValue);
      
      // Если в Firebase есть данные, сохраняем в localStorage
      if (firebaseData) {
        localStorage.setItem(`firebase-${key}`, JSON.stringify(firebaseData));
        return firebaseData;
      }
      
      // Если в Firebase нет данных, пробуем загрузить из localStorage
      const localData = localStorage.getItem(`firebase-${key}`);
      if (localData) {
        const parsedData = JSON.parse(localData);
        // Синхронизируем обратно в Firebase
        await saveToFirebase(parsedData, key);
        return parsedData;
      }
      
      return defaultValue;
    } catch (error) {
      console.error('Ошибка синхронизации:', error);
      // В случае ошибки используем localStorage
      const localData = localStorage.getItem(`firebase-${key}`);
      return localData ? JSON.parse(localData) : defaultValue;
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  return {
    loading,
    saveToFirebase,
    loadFromFirebase,
    subscribeToData,
    syncWithLocalStorage
  };
};
