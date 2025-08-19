import React, { useState } from 'react';
import { useDataManager } from './DataManager';
import { useTaskState } from './TaskStateProvider';
import { useSettingsManager } from './SettingsManager';
import { exportToJSON, exportTasksToCSV, exportToTXT, exportToHTML, downloadFile } from '../utils/exportUtils';

interface ExportMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExportMenu: React.FC<ExportMenuProps> = ({ isOpen, onClose }) => {
  const dataManager = useDataManager();
  const { state: taskState } = useTaskState();
  const { state: settingsState } = useSettingsManager();
  const [exporting, setExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async (format: string) => {
    setExporting(true);
    try {
      const date = new Date().toISOString().slice(0, 10);
      
      switch (format) {
        case 'json':
          const jsonData = dataManager.exportData();
          downloadFile(jsonData, `focus-all-data-${date}.json`, 'application/json');
          break;
          
        case 'csv':
          const csvData = exportTasksToCSV(taskState.tasks);
          downloadFile(csvData, `focus-tasks-${date}.csv`, 'text/csv');
          break;
          
        case 'txt':
          const txtData = exportToTXT(taskState.tasks, settingsState.projects);
          downloadFile(txtData, `focus-data-${date}.txt`, 'text/plain');
          break;
          
        case 'html':
          const htmlData = exportToHTML(taskState.tasks, settingsState.projects);
          downloadFile(htmlData, `focus-data-${date}.html`, 'text/html');
          break;
      }
      
      onClose();
    } catch (error) {
      console.error('Ошибка при экспорте:', error);
      alert('Ошибка при экспорте данных');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }} onClick={onClose}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
      }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>
          📤 Экспорт данных
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => handleExport('json')}
            disabled={exporting}
            style={{
              padding: '16px',
              backgroundColor: '#28A74520',
              color: '#28A745',
              border: '1px solid #28A745',
              borderRadius: '12px',
              cursor: exporting ? 'not-allowed' : 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
              opacity: exporting ? 0.6 : 1
            }}
            onMouseEnter={(e) => !exporting && (e.currentTarget.style.backgroundColor = '#28A74530')}
            onMouseLeave={(e) => !exporting && (e.currentTarget.style.backgroundColor = '#28A74520')}
          >
            <div style={{ fontWeight: '600' }}>📄 JSON (полный)</div>
            <div style={{ fontSize: '0.9em', opacity: 0.8 }}>
              Все данные в формате JSON для резервного копирования
            </div>
          </button>
          
          <button
            onClick={() => handleExport('csv')}
            disabled={exporting}
            style={{
              padding: '16px',
              backgroundColor: '#17A2B820',
              color: '#17A2B8',
              border: '1px solid #17A2B8',
              borderRadius: '12px',
              cursor: exporting ? 'not-allowed' : 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
              opacity: exporting ? 0.6 : 1
            }}
            onMouseEnter={(e) => !exporting && (e.currentTarget.style.backgroundColor = '#17A2B830')}
            onMouseLeave={(e) => !exporting && (e.currentTarget.style.backgroundColor = '#17A2B820')}
          >
            <div style={{ fontWeight: '600' }}>📊 CSV (задачи)</div>
            <div style={{ fontSize: '0.9em', opacity: 0.8 }}>
              Только задачи в формате CSV для Excel
            </div>
          </button>
          
          <button
            onClick={() => handleExport('txt')}
            disabled={exporting}
            style={{
              padding: '16px',
              backgroundColor: '#6C757D20',
              color: '#6C757D',
              border: '1px solid #6C757D',
              borderRadius: '12px',
              cursor: exporting ? 'not-allowed' : 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
              opacity: exporting ? 0.6 : 1
            }}
            onMouseEnter={(e) => !exporting && (e.currentTarget.style.backgroundColor = '#6C757D30')}
            onMouseLeave={(e) => !exporting && (e.currentTarget.style.backgroundColor = '#6C757D20')}
          >
            <div style={{ fontWeight: '600' }}>📝 TXT (текст)</div>
            <div style={{ fontSize: '0.9em', opacity: 0.8 }}>
              Простой текстовый формат для чтения
            </div>
          </button>
          
          <button
            onClick={() => handleExport('html')}
            disabled={exporting}
            style={{
              padding: '16px',
              backgroundColor: '#FFC10720',
              color: '#FFC107',
              border: '1px solid #FFC107',
              borderRadius: '12px',
              cursor: exporting ? 'not-allowed' : 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
              opacity: exporting ? 0.6 : 1
            }}
            onMouseEnter={(e) => !exporting && (e.currentTarget.style.backgroundColor = '#FFC10730')}
            onMouseLeave={(e) => !exporting && (e.currentTarget.style.backgroundColor = '#FFC10720')}
          >
            <div style={{ fontWeight: '600' }}>🌐 HTML (красивый)</div>
            <div style={{ fontSize: '0.9em', opacity: 0.8 }}>
              Красивый HTML файл для просмотра в браузере
            </div>
          </button>
        </div>
        
        <button
          onClick={onClose}
          disabled={exporting}
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            backgroundColor: '#6C757D',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: exporting ? 'not-allowed' : 'pointer',
            opacity: exporting ? 0.6 : 1
          }}
        >
          {exporting ? 'Экспорт...' : 'Отмена'}
        </button>
      </div>
    </div>
  );
};

export default ExportMenu;
