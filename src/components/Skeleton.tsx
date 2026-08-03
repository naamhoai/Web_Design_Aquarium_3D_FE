import type { CSSProperties } from 'react';

export function Skeleton({
  width,
  height,
  rounded = 'md',
  style,
}: {
  width?: number | string;
  height?: number | string;
  rounded?: 'sm' | 'md' | 'pill' | 'card';
  style?: CSSProperties;
}) {
  const r =
    rounded === 'pill'
      ? 999
      : rounded === 'card'
        ? 18
        : rounded === 'sm'
          ? 8
          : 12;
  return (
    <span
      aria-hidden
      className="skeleton"
      style={{
        display: 'inline-block',
        width: width ?? '100%',
        height: height ?? 16,
        borderRadius: r,
        ...style,
      }}
    />
  );
}
