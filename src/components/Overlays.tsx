import { useEffect, useState } from 'react';

export function GrainOverlay() {
  return <div aria-hidden className="grain-overlay" />;
}

export function CursorGlow() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!supportsHover) return;
    const onMove = (e: PointerEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  if (!pos) return null;
  return (
    <div
      aria-hidden
      className="cursor-glow"
      style={{ left: pos.x, top: pos.y }}
    />
  );
}
