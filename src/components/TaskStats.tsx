import React from 'react';
import { Award, Clock, CheckCircle2 } from 'lucide-react';

export interface TaskStatsProps {
  completedToday: number;
  completedThisMonth: number;
  totalTasks: number;
  colors: any;
}

const TaskStats: React.FC<TaskStatsProps> = ({
  completedToday,
  completedThisMonth,
  totalTasks,
  colors
}) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {/* Задачи за сегодня */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: colors.accent.today + '20',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Clock size={24} color={colors.accent.today} />
        </div>
        <div>
          <div style={{
            fontSize: '24px',
            fontWeight: '600',
            color: colors.text.primary,
            marginBottom: '4px'
          }}>
            {completedToday}
          </div>
          <div style={{
            fontSize: '14px',
            color: colors.text.secondary
          }}>
            Задач за сегодня
          </div>
        </div>
      </div>

      {/* Задачи за месяц */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: colors.accent.done + '20',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <CheckCircle2 size={24} color={colors.accent.done} />
        </div>
        <div>
          <div style={{
            fontSize: '24px',
            fontWeight: '600',
            color: colors.text.primary,
            marginBottom: '4px'
          }}>
            {completedThisMonth}
          </div>
          <div style={{
            fontSize: '14px',
            color: colors.text.secondary
          }}>
            Задач за месяц
          </div>
        </div>
      </div>

      {/* Общее количество задач */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: colors.accent.primary + '20',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Award size={24} color={colors.accent.primary} />
        </div>
        <div>
          <div style={{
            fontSize: '24px',
            fontWeight: '600',
            color: colors.text.primary,
            marginBottom: '4px'
          }}>
            {totalTasks}
          </div>
          <div style={{
            fontSize: '14px',
            color: colors.text.secondary
          }}>
            Всего задач
          </div>
        </div>
      </div>

      {/* Прогресс (если есть задачи) */}
      {totalTasks > 0 && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: `1px solid ${colors.border}`
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '500',
            color: colors.text.primary,
            marginBottom: '12px'
          }}>
            Прогресс за месяц
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: colors.border,
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '8px'
          }}>
            <div style={{
              width: `${Math.min((completedThisMonth / Math.max(totalTasks, 1)) * 100, 100)}%`,
              height: '100%',
              backgroundColor: colors.accent.primary,
              borderRadius: '4px',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{
            fontSize: '12px',
            color: colors.text.secondary,
            textAlign: 'center'
          }}>
            {Math.round((completedThisMonth / Math.max(totalTasks, 1)) * 100)}% выполнено
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(TaskStats);
