import type { ReactNode } from 'react';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

const toneStyles: Record<Tone, { background: string; color: string; border: string }> = {
  neutral: { background: 'rgba(167, 196, 184, 0.12)', color: 'var(--color-text-secondary)', border: 'rgba(167, 196, 184, 0.3)' },
  success: { background: 'rgba(34, 197, 94, 0.18)', color: '#bbf7d0', border: 'rgba(34, 197, 94, 0.45)' },
  warning: { background: 'rgba(251, 191, 36, 0.18)', color: '#fde68a', border: 'rgba(251, 191, 36, 0.45)' },
  danger: { background: 'rgba(248, 113, 113, 0.18)', color: '#fecaca', border: 'rgba(248, 113, 113, 0.5)' },
  info: { background: 'rgba(94, 234, 212, 0.16)', color: '#ccfbf1', border: 'rgba(94, 234, 212, 0.4)' },
};

export function Badge({
  tone = 'neutral',
  children,
  dot,
}: {
  tone?: Tone;
  children: ReactNode;
  dot?: boolean;
}) {
  const t = toneStyles[tone];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.6px',
        background: t.background,
        color: t.color,
        border: `1px solid ${t.border}`,
      }}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: 999, background: 'currentColor' }} />}
      {children}
    </span>
  );
}
