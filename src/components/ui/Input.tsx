import React, { forwardRef } from 'react';
import { styleUtils, SizeVariant } from '../../design-system/styleUtils';

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'file' | 'search' | 'tel' | 'url';
  size?: SizeVariant;
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  accept?: string;
  multiple?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  label?: string;
  helperText?: string;
  errorText?: string;
  // ARIA атрибуты для доступности
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaRequired?: boolean;
  ariaInvalid?: boolean;
  role?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  size = 'md',
  placeholder,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  onKeyPress,
  onKeyDown,
  disabled = false,
  error = false,
  required = false,
  name,
  id,
  className = '',
  style = {},
  title,
  autoComplete,
  autoFocus = false,
  readOnly = false,
  maxLength,
  minLength,
  pattern,
  accept,
  multiple = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  label,
  helperText,
  errorText,
  ariaLabel,
  ariaDescribedBy,
  ariaRequired,
  ariaInvalid,
  role,
}, ref) => {
  const baseStyles = styleUtils.createInputStyles(size, error, disabled);
  
  const inputStyles: React.CSSProperties = {
    ...baseStyles,
    width: fullWidth ? '100%' : 'auto',
    paddingLeft: icon && iconPosition === 'left' ? '40px' : baseStyles.padding,
    paddingRight: icon && iconPosition === 'right' ? '40px' : baseStyles.padding,
    ...style,
  };

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    width: fullWidth ? '100%' : 'auto',
  };

  const iconStyles: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    left: iconPosition === 'left' ? '12px' : 'auto',
    right: iconPosition === 'right' ? '12px' : 'auto',
    color: error ? '#ef4444' : '#64748b',
    pointerEvents: 'none',
    zIndex: 1,
  };

  const labelStyles: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: error ? '#ef4444' : '#1e293b',
    marginBottom: '4px',
  };

  const helperTextStyles: React.CSSProperties = {
    fontSize: '12px',
    color: error ? '#ef4444' : '#64748b',
    marginTop: '4px',
  };

  return (
    <div style={containerStyles}>
      {label && (
        <label htmlFor={id} style={labelStyles}>
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
        </label>
      )}
      
      <div style={{ position: 'relative' }}>
        {icon && iconPosition === 'left' && (
          <div style={iconStyles}>
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyPress={onKeyPress}
          onKeyDown={onKeyDown}
          disabled={disabled}
          required={required}
          name={name}
          id={id}
          className={className}
          style={inputStyles}
          title={title}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          readOnly={readOnly}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          accept={accept}
          multiple={multiple}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          aria-required={ariaRequired}
          aria-invalid={ariaInvalid}
          role={role}
        />
        
        {icon && iconPosition === 'right' && (
          <div style={iconStyles}>
            {icon}
          </div>
        )}
      </div>
      
      {(helperText || errorText) && (
        <div style={helperTextStyles}>
          {errorText || helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default React.memo(Input);
