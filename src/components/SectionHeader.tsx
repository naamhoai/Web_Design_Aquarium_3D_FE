import type { ReactNode } from 'react';

type Size = 'hero' | 'large' | 'compact';

export interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  highlight?: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  size?: Size;
  actions?: ReactNode;
}

export function SectionHeader({
  eyebrow,
  title,
  highlight,
  description,
  align = 'center',
  size = 'large',
  actions,
}: SectionHeaderProps) {
  const fontSize =
    size === 'hero'
      ? 'clamp(2.4rem, 5vw, 4rem)'
      : size === 'large'
        ? 'clamp(24px, 4vw, 38px)'
        : 'clamp(20px, 3vw, 26px)';

  return (
    <div
      style={{
        textAlign: align,
        marginBottom: size === 'hero' ? 36 : 48,
        maxWidth: align === 'center' ? 720 : 'none',
        marginInline: align === 'center' ? 'auto' : undefined,
      }}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2
        className={highlight ? 'gradient-text' : ''}
        style={{
          marginTop: 8,
          fontFamily: 'var(--font-display)',
          fontSize,
          fontWeight: 700,
          color: highlight ? undefined : '#fff',
          lineHeight: 1.15,
          letterSpacing: '-0.5px',
        }}
      >
        {highlight ?? title}
      </h2>
      {description && (
        <p
          style={{
            marginTop: 12,
            color: 'var(--color-text-secondary)',
            fontSize: size === 'compact' ? 13 : 14,
            lineHeight: 1.7,
            maxWidth: 640,
            marginInline: align === 'center' ? 'auto' : undefined,
          }}
        >
          {description}
        </p>
      )}
      {actions && <div style={{ marginTop: 18, display: 'inline-flex', gap: 12, flexWrap: 'wrap' }}>{actions}</div>}
    </div>
  );
}
