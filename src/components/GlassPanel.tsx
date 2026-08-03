import { createElement } from 'react';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

type Depth = 1 | 2 | 3;

export interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  as?: keyof HTMLElementTagNameMap;
  depth?: Depth;
  interactive?: boolean;
  glowOnHover?: boolean;
  bordered?: boolean;
  children: ReactNode;
  className?: string;
}

export function GlassPanel({
  as = 'div',
  depth = 1,
  interactive,
  glowOnHover,
  bordered,
  className = '',
  children,
  style,
  ...rest
}: GlassPanelProps) {
  const classes = [
    'glass-panel',
    depth > 1 ? `glass-depth-${depth}` : '',
    interactive ? 'glass-panel-interactive' : '',
    glowOnHover ? 'glass-panel-glow' : '',
    bordered ? 'gradient-border' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return createElement(
    as,
    { className: classes, style: style as CSSProperties, ...rest },
    children
  );
}
