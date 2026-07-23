import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  disabled = false,
  required = false,
  id,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            letterSpacing: '0.02em',
          }}
        >
          {label}
          {required && <span style={{ color: 'var(--orange-500)', marginLeft: '2px' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <span style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            display: 'flex',
          }}>
            <Icon size={16} />
          </span>
        )}
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          style={{
            width: '100%',
            padding: '10px 14px',
            paddingLeft: Icon ? '40px' : '14px',
            paddingRight: isPassword ? '40px' : '14px',
            fontSize: '14px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 400,
            color: 'var(--text-primary)',
            backgroundColor: 'var(--bg-input)',
            border: error ? '1px solid var(--red-500)' : '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            outline: 'none',
            transition: 'var(--transition-fast)',
            opacity: disabled ? 0.5 : 1,
          }}
          onFocus={e => {
            e.target.style.borderColor = error ? 'var(--red-500)' : 'var(--orange-500)';
          }}
          onBlur={e => {
            e.target.style.borderColor = error ? 'var(--red-500)' : 'var(--border-primary)';
          }}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              padding: 0,
            }}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && (
        <span style={{ fontSize: '12px', color: 'var(--red-500)' }}>{error}</span>
      )}
    </div>
  );
}
