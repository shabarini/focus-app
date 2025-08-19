import React from 'react';
import { motion } from 'framer-motion';
import { Inbox, Plus } from 'lucide-react';
import { Button } from './index';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Нет задач',
  description = 'Создайте свою первую задачу, чтобы начать работу',
  icon,
  actionText = 'Добавить задачу',
  onAction,
  className = '',
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    textAlign: 'center',
    minHeight: '200px',
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '48px',
    color: '#ccc',
    marginBottom: '16px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 8px 0',
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 24px 0',
    maxWidth: '300px',
    lineHeight: '1.5',
  };

  const defaultIcon = <Inbox size={48} />;

  return (
    <motion.div
      style={containerStyle}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        style={iconStyle}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        {icon || defaultIcon}
      </motion.div>
      
      <motion.h3
        style={titleStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {title}
      </motion.h3>
      
      <motion.p
        style={descriptionStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {description}
      </motion.p>
      
      {onAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="primary"
            size="md"
            onClick={onAction}
            icon={<Plus size={16} />}
          >
            {actionText}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;
