import { useState, useEffect, useCallback } from 'react';

export interface PWAState {
  isInstalled: boolean;
  isOnline: boolean;
  isUpdateAvailable: boolean;
  isInstallPromptSupported: boolean;
  deferredPrompt: any;
  registration: ServiceWorkerRegistration | null;
}

export interface PWAActions {
  installApp: () => Promise<void>;
  checkForUpdates: () => Promise<void>;
  clearCache: () => Promise<void>;
  requestNotificationPermission: () => Promise<NotificationPermission>;
  sendNotification: (title: string, options?: NotificationOptions) => void;
  registerBackgroundSync: () => Promise<void>;
}

export const usePWA = (): [PWAState, PWAActions] => {
  const [state, setState] = useState<PWAState>({
    isInstalled: false,
    isOnline: navigator.onLine,
    isUpdateAvailable: false,
    isInstallPromptSupported: false,
    deferredPrompt: null,
    registration: null,
  });

  // Проверка установки приложения
  useEffect(() => {
    const checkInstallation = () => {
      const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone === true;
      
      setState(prev => ({ ...prev, isInstalled }));
    };

    checkInstallation();
    window.addEventListener('appinstalled', checkInstallation);
    
    return () => {
      window.removeEventListener('appinstalled', checkInstallation);
    };
  }, []);

  // Отслеживание онлайн/офлайн статуса
  useEffect(() => {
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Регистрация сервис-воркера
  useEffect(() => {
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          setState(prev => ({ ...prev, registration }));

          // Проверка обновлений
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setState(prev => ({ ...prev, isUpdateAvailable: true }));
                }
              });
            }
          });

          // Обработка обновления
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            setState(prev => ({ ...prev, isUpdateAvailable: false }));
            window.location.reload();
          });

        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }
    };

    registerServiceWorker();
  }, []);

  // Обработка установки приложения
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setState(prev => ({ 
        ...prev, 
        isInstallPromptSupported: true,
        deferredPrompt: e 
      }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Установка приложения
  const installApp = useCallback(async () => {
    if (state.deferredPrompt) {
      state.deferredPrompt.prompt();
      const { outcome } = await state.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setState(prev => ({ 
          ...prev, 
          isInstalled: true,
          isInstallPromptSupported: false,
          deferredPrompt: null 
        }));
      }
    }
  }, [state.deferredPrompt]);

  // Проверка обновлений
  const checkForUpdates = useCallback(async () => {
    if (state.registration) {
      await state.registration.update();
    }
  }, [state.registration]);

  // Очистка кеша
  const clearCache = useCallback(async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('Cache cleared successfully');
    }
  }, []);

  // Запрос разрешения на уведомления
  const requestNotificationPermission = useCallback(async (): Promise<NotificationPermission> => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission;
    }
    return 'denied';
  }, []);

  // Отправка уведомления
  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/logo192.png',
        badge: '/logo192.png',
        ...options
      });
    }
  }, []);

  // Регистрация фоновой синхронизации
  const registerBackgroundSync = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        // Проверяем поддержку background sync
        if ('sync' in registration) {
          await (registration as any).sync.register('background-sync');
          console.log('Background sync registered');
        } else {
          console.log('Background sync not supported');
        }
      } catch (error) {
        console.error('Background sync registration failed:', error);
      }
    }
  }, []);

  return [
    state,
    {
      installApp,
      checkForUpdates,
      clearCache,
      requestNotificationPermission,
      sendNotification,
      registerBackgroundSync,
    }
  ];
};
