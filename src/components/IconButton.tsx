import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Size = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: Size;
  label: string; // required for a11y
  icon: ReactNode;
  badge?: number;
}

export function IconButton({
  size = 'md',
  label,
  icon,
  badge,
  className = '',
  ...rest
}: IconButtonProps) {
  return (
    <button
      {...rest}
      aria-label={label}
      title={label}
      className={`icon-btn icon-btn-${size} ${className}`.trim()}
      style={{ position: 'relative' }}
    >
      {icon}
      {typeof badge === 'number' && badge > 0 && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: -4,
            right: -4,
            minWidth: 18,
            height: 18,
            borderRadius: 999,
            background: 'linear-gradient(135deg, #fb7185, #f87171)',
            color: '#fff',
            fontSize: 10,
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 5px',
            boxShadow: '0 0 0 2px var(--color-bg-deep)',
          }}
        >
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
}
