import type { ReactNode } from 'react';

export function Stat({
  icon,
  value,
  label,
  tone = 'primary',
}: {
  icon?: ReactNode;
  value: ReactNode;
  label: string;
  tone?: 'primary' | 'secondary' | 'gold';
}) {
  const colors: Record<string, string> = {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    gold: 'var(--color-accent-gold)',
  };
  return (
    <div className="hover-lift" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        {icon && <span style={{ color: colors[tone] }}>{icon}</span>}
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(22px, 3vw, 28px)',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.5px',
          }}
        >
          {value}
        </span>
      </div>
      <span style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
        {label}
      </span>
    </div>
  );
}
