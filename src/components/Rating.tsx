import { Star } from 'lucide-react';

export function Rating({ value, max = 5, size = 14 }: { value: number; max?: number; size?: number }) {
  const safeValue = Math.max(0, Math.min(value, max));
  return (
    <span
      aria-label={`${safeValue} trên ${max} sao`}
      role="img"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}
    >
      {Array.from({ length: max }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, safeValue - i));
        return (
          <span
            key={i}
            style={{ position: 'relative', display: 'inline-block', width: size, height: size }}
            aria-hidden
          >
            <Star size={size} color="rgba(255,255,255,0.18)" />
            <span
              style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                width: `${fill * 100}%`,
                color: '#fbbf24',
              }}
            >
              <Star size={size} fill="#fbbf24" color="#fbbf24" />
            </span>
          </span>
        );
      })}
    </span>
  );
}
