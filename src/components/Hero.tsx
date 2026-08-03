import { Trees, ArrowRight, Heart, Award, Fish, Leaf, ChevronDown } from 'lucide-react';
import { Button } from './Button';
import { Stat } from './Stat';
import { HeroFishBackground } from '../three/HeroFishBackground';

export interface HeroProps {
  onNavigate: (id: string) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  return (
    <section
      id="home"
      className="hero-shell tank-ambient"
      aria-label="Giới thiệu AquaRealm"
    >
      <HeroFishBackground height="100%" />

      <div className="container hero-content-overlay" style={{ position: 'relative', zIndex: 5 }}>
        <div
          className="grid grid-2 gap-4 align-center"
          style={{ alignItems: 'center' }}
        >
          {/* Hero Left Content */}
          <div className="flex flex-col gap-3">
            <span className="hero-eyebrow">
              <Trees size={14} />
              Bể Thủy Sinh Nhiệt Đới · Trải Nghiệm 3D
            </span>

            <h1 className="hero-title">
              Mang Cả{' '}
              <span className="gradient-text">Thế Giới Thuỷ Sinh</span>{' '}
              Nhiệt Đới<br />
              Vào Không Gian Sống
            </h1>

            <p className="hero-lede">
              AquaRealm mang đến bể cá cảnh, sinh vật thuỷ sinh nhập khẩu và công
              cụ mô phỏng{' '}
              <strong style={{ color: 'var(--color-primary)' }}>cá bơi 3D chân thật</strong> — giúp bạn thiết kế
              hồ thuỷ sinh xanh mát, đầy cây cối và sức sống ngay trên trình duyệt.
            </p>

            <div className="flex gap-2" style={{ marginTop: 8, flexWrap: 'wrap' }}>
              <Button
                variant="primary"
                size="lg"
                iconRight={<ArrowRight size={16} />}
                onClick={() => onNavigate('customizer')}
              >
                Tự thiết kế bể 3D
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => onNavigate('showcase')}
              >
                Xem bể cá 3D sống động
              </Button>
            </div>

            <div className="hero-stats">
              <Stat icon={<Fish size={20} />} value="6+" label="Loài cá 3D" tone="primary" />
              <Stat icon={<Leaf size={20} />} value="100%" label="Cây thuỷ sinh" tone="secondary" />
              <Stat icon={<Award size={20} />} value="500+" label="Khách hàng" tone="gold" />
            </div>
          </div>

          {/* Hero Right Media Panel */}
          <div className="hero-card" aria-hidden>
            <div className="hero-card-scene">
              <HeroFishBackground height="100%" variant="showcase" />
            </div>
            <div className="hero-card-caption">
              <Heart size={20} color="var(--color-accent-coral)" />
              <div>
                <span
                  style={{
                    fontSize: 10,
                    color: 'var(--color-text-secondary)',
                    display: 'block',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    fontWeight: 700,
                  }}
                >
                  Cảm hứng hôm nay
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
                  Iwagumi Aquascape 90L · Cá Neon bơi theo đàn
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => onNavigate('customizer')}
        aria-label="Cuộn xuống thiết kế bể 3D"
        className="scroll-cue"
        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
      >
        <ChevronDown size={28} />
      </button>
    </section>
  );
}
