import React from 'react';
import Spinner from './Spinner.jsx';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isSubmitting = false,
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  type = 'button',
  onClick,
  ...props
}) {
  const isBusy = isSubmitting || isLoading;
  const isDisabled = disabled || isBusy;

  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    danger: 'btn-danger',
    ghost: 'btn-ghost'
  }[variant] || 'btn-primary';

  const sizeClass = size === 'sm' ? 'btn-sm' : '';

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`btn ${variantClass} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {isBusy ? (
        <>
          <Spinner size={size === 'sm' ? 14 : 16} />
          <span>{typeof children === 'string' ? `${children}...` : children}</span>
        </>
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 14 : 16} />}
          {children}
        </>
      )}
    </button>
  );
}

export default Button;
