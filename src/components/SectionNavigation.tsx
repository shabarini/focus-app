import React from 'react';

type Section = 'today' | 'todo' | 'done';

export interface SectionNavigationProps {
  activeSection: Section;
  tasks: Record<Section, any[]>;
  colors: any;
  onSectionChange: (section: Section) => void;
}

const SectionNavigation: React.FC<SectionNavigationProps> = ({
  activeSection,
  tasks,
  colors,
  onSectionChange
}) => {
  const sections = [
    { key: 'today' as Section, label: 'Сегодня', icon: '📅' },
    { key: 'todo' as Section, label: 'В планах', icon: '📋' },
    { key: 'done' as Section, label: 'Сделано', icon: '✅' }
  ];

  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      marginBottom: '24px',
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: `1px solid ${colors.border}`
    }}>
      {sections.map(section => {
        const isActive = activeSection === section.key;
        const taskCount = tasks[section.key]?.length || 0;
        
        return (
          <button
            key={section.key}
            onClick={() => onSectionChange(section.key)}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: isActive ? colors.accent[section.key] : 'transparent',
              color: isActive ? 'white' : colors.text.primary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: isActive ? '600' : '500',
              transition: 'all 0.2s',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = colors.accent[section.key] + '20';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span style={{ fontSize: '16px' }}>{section.icon}</span>
            <span>{section.label}</span>
            {taskCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: isActive ? 'white' : colors.accent[section.key],
                color: isActive ? colors.accent[section.key] : 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px solid ${isActive ? colors.accent[section.key] : 'white'}`
              }}>
                {taskCount > 99 ? '99+' : taskCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default React.memo(SectionNavigation);
