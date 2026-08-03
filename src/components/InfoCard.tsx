import type { ReactNode } from 'react';
import { GlassPanel } from './GlassPanel';

export function InfoCard({
  icon,
  label,
  value,
  hint,
}: {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <GlassPanel
      depth={1}
      bordered
      style={{
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        minHeight: 84,
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 1,
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {icon}
        {label}
      </span>
      <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{value}</span>
      {hint && (
        <span style={{ color: 'var(--color-text-muted)', fontSize: 11, lineHeight: 1.4 }}>
          {hint}
        </span>
      )}
    </GlassPanel>
  );
}
