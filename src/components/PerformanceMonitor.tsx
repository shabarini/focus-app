import React, { useState, useEffect } from 'react';

interface PerformanceMonitorProps {
  taskCount: number;
  isVirtualized: boolean;
  renderTime?: number;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  taskCount,
  isVirtualized,
  renderTime
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Показываем монитор только в режиме разработки и при большом количестве задач
  useEffect(() => {
    setIsVisible(process.env.NODE_ENV === 'development' && taskCount > 20);
  }, [taskCount]);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '12px',
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 1000,
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ marginBottom: '4px' }}>
        <strong>Производительность:</strong>
      </div>
      <div>Задач: {taskCount}</div>
      <div>Виртуализация: {isVirtualized ? '✅' : '❌'}</div>
      {renderTime && (
        <div>Время рендера: {renderTime.toFixed(2)}ms</div>
      )}
      <div style={{ 
        marginTop: '8px', 
        fontSize: '10px', 
        opacity: 0.7,
        cursor: 'pointer'
      }}
      onClick={() => setIsVisible(false)}
      >
        ✕ Скрыть
      </div>
    </div>
  );
};

export default React.memo(PerformanceMonitor);
