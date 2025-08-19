import React from 'react';
import { Search, Filter, X } from 'lucide-react';

type Section = 'today' | 'todo' | 'done';

export interface TaskFiltersProps {
  searchQuery: string;
  showSearch: boolean;
  showFilters: boolean;
  selectedProjectFilter: string;
  selectedTagFilter: string;
  projects: Array<{ id: string; name: string; color: string }>;
  availableTags: string[];
  colors: any;
  onSearchQueryChange: (query: string) => void;
  onShowSearchChange: (show: boolean) => void;
  onShowFiltersChange: (show: boolean) => void;
  onSelectedProjectFilterChange: (project: string) => void;
  onSelectedTagFilterChange: (tag: string) => void;
  onClearFilters: () => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  searchQuery,
  showSearch,
  showFilters,
  selectedProjectFilter,
  selectedTagFilter,
  projects,
  availableTags,
  colors,
  onSearchQueryChange,
  onShowSearchChange,
  onShowFiltersChange,
  onSelectedProjectFilterChange,
  onSelectedTagFilterChange,
  onClearFilters
}) => {
  const hasActiveFilters = searchQuery || selectedProjectFilter || selectedTagFilter;

  return (
    <div style={{ marginBottom: '20px' }}>
      {/* Панель поиска и фильтров */}
      <div style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        {/* Кнопка поиска */}
        <button
          onClick={() => onShowSearchChange(!showSearch)}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: `1px solid ${colors.border}`,
            backgroundColor: showSearch ? colors.accent.primary + '20' : 'white',
            color: showSearch ? colors.accent.primary : colors.text.primary,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!showSearch) {
              e.currentTarget.style.backgroundColor = colors.accent.primary + '10';
              e.currentTarget.style.borderColor = colors.accent.primary;
            }
          }}
          onMouseLeave={(e) => {
            if (!showSearch) {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = colors.border;
            }
          }}
        >
          <Search size={16} />
          Поиск
        </button>

        {/* Кнопка фильтров */}
        <button
          onClick={() => onShowFiltersChange(!showFilters)}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: `1px solid ${colors.border}`,
            backgroundColor: showFilters ? colors.accent.primary + '20' : 'white',
            color: showFilters ? colors.accent.primary : colors.text.primary,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!showFilters) {
              e.currentTarget.style.backgroundColor = colors.accent.primary + '10';
              e.currentTarget.style.borderColor = colors.accent.primary;
            }
          }}
          onMouseLeave={(e) => {
            if (!showFilters) {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = colors.border;
            }
          }}
        >
          <Filter size={16} />
          Фильтры
          {hasActiveFilters && (
            <span style={{
              backgroundColor: colors.accent.primary,
              color: 'white',
              borderRadius: '50%',
              width: '16px',
              height: '16px',
              fontSize: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {(searchQuery ? 1 : 0) + (selectedProjectFilter ? 1 : 0) + (selectedTagFilter ? 1 : 0)}
            </span>
          )}
        </button>

        {/* Кнопка очистки фильтров */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: `1px solid ${colors.border}`,
              backgroundColor: 'white',
              color: colors.text.secondary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FF6B6B10';
              e.currentTarget.style.borderColor = '#FF6B6B';
              e.currentTarget.style.color = '#FF6B6B';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.color = colors.text.secondary;
            }}
          >
            <X size={16} />
            Очистить
          </button>
        )}
      </div>

      {/* Панель поиска */}
      {showSearch && (
        <div style={{
          marginTop: '12px',
          padding: '16px',
          backgroundColor: 'white',
          borderRadius: '12px',
          border: `1px solid ${colors.border}`,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Search size={20} color={colors.text.secondary} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Поиск по названию или заметкам..."
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: `1px solid ${colors.border}`,
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = colors.accent.primary;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.border;
              }}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchQueryChange('')}
                style={{
                  padding: '4px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: colors.text.secondary,
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.border;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Панель фильтров */}
      {showFilters && (
        <div style={{
          marginTop: '12px',
          padding: '16px',
          backgroundColor: 'white',
          borderRadius: '12px',
          border: `1px solid ${colors.border}`,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {/* Фильтр по проекту */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px',
                color: colors.text.primary
              }}>
                Проект:
              </label>
              <select
                value={selectedProjectFilter}
                onChange={(e) => onSelectedProjectFilterChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${colors.border}`,
                  backgroundColor: 'white',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="">Все проекты</option>
                {projects.map(project => (
                  <option key={project.id} value={project.name}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Фильтр по тегу */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px',
                color: colors.text.primary
              }}>
                Тег:
              </label>
              <select
                value={selectedTagFilter}
                onChange={(e) => onSelectedTagFilterChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${colors.border}`,
                  backgroundColor: 'white',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="">Все теги</option>
                {availableTags.map(tag => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Активные фильтры */}
          {hasActiveFilters && (
            <div style={{
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: `1px solid ${colors.border}`
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px',
                color: colors.text.primary
              }}>
                Активные фильтры:
              </div>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {searchQuery && (
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    backgroundColor: colors.accent.primary + '20',
                    color: colors.accent.primary,
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    Поиск: "{searchQuery}"
                    <button
                      onClick={() => onSearchQueryChange('')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: colors.accent.primary,
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedProjectFilter && (
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    backgroundColor: colors.accent.todo + '20',
                    color: colors.accent.todo,
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    Проект: {selectedProjectFilter}
                    <button
                      onClick={() => onSelectedProjectFilterChange('')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: colors.accent.todo,
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedTagFilter && (
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    backgroundColor: colors.accent.done + '20',
                    color: colors.accent.done,
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    Тег: {selectedTagFilter}
                    <button
                      onClick={() => onSelectedTagFilterChange('')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: colors.accent.done,
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(TaskFilters);
