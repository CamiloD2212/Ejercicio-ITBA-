import React from 'react';
import { AlertCircle } from 'lucide-react';

export function Input({
  label,
  error,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  as = 'input',
  rows = 3,
  helperText,
  className = '',
  ...props
}) {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  const hasError = !!error;

  return (
    <div className={`form-group ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          <span>{label} {required && <span style={{ color: 'var(--status-danger)' }}>*</span>}</span>
        </label>
      )}

      {as === 'textarea' ? (
        <textarea
          id={inputId}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={`form-textarea ${hasError ? 'has-error' : ''}`}
          {...props}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`form-input ${hasError ? 'has-error' : ''}`}
          {...props}
        />
      )}

      {hasError && (
        <div className="form-error">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {!hasError && helperText && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {helperText}
        </span>
      )}
    </div>
  );
}

export default Input;
