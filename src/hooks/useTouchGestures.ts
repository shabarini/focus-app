import { useCallback, useRef } from 'react';

export interface TouchGestureConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onLongPress?: () => void;
  minSwipeDistance?: number;
  longPressDelay?: number;
}

export interface TouchState {
  isTouching: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export const useTouchGestures = (config: TouchGestureConfig) => {
  const touchState = useRef<TouchState>({
    isTouching: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  });

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const minSwipeDistance = config.minSwipeDistance || 50;
  const longPressDelay = config.longPressDelay || 500;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchState.current = {
      isTouching: true,
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
    };

    // Запускаем таймер для long press
    if (config.onLongPress) {
      longPressTimer.current = setTimeout(() => {
        config.onLongPress?.();
      }, longPressDelay);
    }
  }, [config, longPressDelay]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchState.current.isTouching) return;

    const touch = e.touches[0];
    touchState.current.currentX = touch.clientX;
    touchState.current.currentY = touch.clientY;

    // Отменяем long press при движении
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchState.current.isTouching) return;

    const { startX, startY, currentX, currentY } = touchState.current;
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Отменяем long press
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    // Определяем жест
    if (distance < minSwipeDistance) {
      // Tap
      config.onTap?.();
    } else {
      // Swipe
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (absDeltaX > absDeltaY) {
        // Горизонтальный свайп
        if (deltaX > 0) {
          config.onSwipeRight?.();
        } else {
          config.onSwipeLeft?.();
        }
      } else {
        // Вертикальный свайп
        if (deltaY > 0) {
          config.onSwipeDown?.();
        } else {
          config.onSwipeUp?.();
        }
      }
    }

    touchState.current.isTouching = false;
  }, [config, minSwipeDistance]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    touchState: touchState.current,
  };
};
