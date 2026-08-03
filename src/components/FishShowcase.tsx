import { Suspense } from 'react';
import { MiniTank } from '../three/MiniTank';
import { Sparkles, Leaf, Move, Wind, Sun } from 'lucide-react';
import { GlassPanel } from './GlassPanel';
import { Skeleton } from './Skeleton';

export function FishShowcase() {
  return (
    <section
      id="showcase"
      className="section tank-ambient"
      style={{ position: 'relative', overflow: 'hidden' }}
      aria-labelledby="showcase-title"
    >
      <div className="container">
        <div
          className="grid grid-2 gap-4 align-center"
          style={{ alignItems: 'center' }}
        >
          <div className="flex flex-col gap-3" style={{ position: 'relative', zIndex: 5 }}>
            <span className="hero-eyebrow">
              <Sparkles size={14} /> Trải Nghiệm Thực Tế
            </span>
            <h2
              id="showcase-title"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(32px, 4vw, 48px)',
                lineHeight: 1.15,
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '-0.5px',
              }}
            >
              Khám Phá <span className="gradient-text">Bể Cá 3D</span> Trong Không Gian Thực
            </h2>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: 16,
                lineHeight: 1.7,
                maxWidth: 520,
              }}
            >
              Xoay, phóng to và ngắm nhìn từng đường vây uyển chuyển của cá
              Barramundi bơi lội trong bể kính — tất cả được tái hiện bằng công
              nghệ 3D chân thật ngay trên trình duyệt, không cần cài đặt.
            </p>

            <div className="grid gap-2" style={{ marginTop: 12 }}>
              <Feature
                icon={<Move size={18} color="var(--color-primary)" />}
                title="Tương tác xoay 360°"
                desc="Dùng chuột hoặc cảm ứng để xoay quanh bể."
                tone="primary"
              />
              <Feature
                icon={<Leaf size={18} color="var(--color-secondary)" />}
                title="Cây thủy sinh sống động"
                desc="Cây đung đưa nhẹ theo dòng nước."
                tone="secondary"
              />
              <Feature
                icon={<Sun size={18} color="var(--color-accent-gold)" />}
                title="Ánh sáng chân thực"
                desc="Phản chiếu mặt nước, bong bóng khí và vật liệu kính."
                tone="gold"
              />
              <Feature
                icon={<Wind size={18} color="var(--color-info)" />}
                title="Hiệu ứng khói nước"
                desc="Hạt bụi nước lấp lánh theo luồng ánh sáng."
                tone="primary"
              />
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 5 }}>
            <Suspense
              fallback={
                <GlassPanel
                  depth={2}
                  bordered
                  style={{
                    height: 460,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  <Skeleton width={120} height={12} />
                  <span style={{ fontSize: 13 }}>Đang tải bể cá 3D…</span>
                </GlassPanel>
              }
            >
              <MiniTank />
            </Suspense>
            <p
              style={{
                marginTop: 16,
                fontSize: 12,
                color: 'var(--color-text-muted)',
                textAlign: 'center',
              }}
            >
              Mô hình 3D: Barramundi Fish · Khronos glTF Sample Assets (CC-BY)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tone: 'primary' | 'secondary' | 'gold';
}

const toneColor: Record<FeatureProps['tone'], string> = {
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  gold: 'var(--color-accent-gold)',
};

const toneBg: Record<FeatureProps['tone'], string> = {
  primary: 'rgba(94, 234, 212, 0.12)',
  secondary: 'rgba(52, 211, 153, 0.12)',
  gold: 'rgba(251, 191, 36, 0.14)',
};

const toneBorder: Record<FeatureProps['tone'], string> = {
  primary: 'rgba(94, 234, 212, 0.3)',
  secondary: 'rgba(52, 211, 153, 0.3)',
  gold: 'rgba(251, 191, 36, 0.35)',
};

function Feature({ icon, title, desc, tone }: FeatureProps) {
  return (
    <div
      className="flex gap-2 align-center"
      style={{
        padding: 12,
        background: toneBg[tone],
        border: `1px solid ${toneBorder[tone]}`,
        borderRadius: 14,
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: 'rgba(6, 26, 20, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: toneColor[tone],
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
          {desc}
        </div>
      </div>
    </div>
  );
}
