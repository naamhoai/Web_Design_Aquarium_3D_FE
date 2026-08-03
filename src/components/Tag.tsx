import type { ReactNode } from 'react';

export type TagVariant = 'premium' | 'new' | 'sale' | 'hot' | 'info';

export function Tag({
  variant = 'info',
  icon,
  children,
}: {
  variant?: TagVariant;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <span className={`tag tag-${variant}`}>
      {icon}
      {children}
    </span>
  );
}

export function Pill({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <span className="pill">
      {icon}
      {children}
    </span>
  );
}
