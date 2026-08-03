import { useState } from 'react';
import {
  MapPin, ShoppingCart, Info,
  Thermometer, Droplet, Wind, FlaskConical, Utensils, Fish as FishIcon, Waves,
  Store, ExternalLink, Fish, Sprout, Mountain, GlassWater,
} from 'lucide-react';
import { assets, categoryLabels } from '../data/assets';
import type { Asset, AssetCategory } from '../data/assets';
import { Button } from './Button';
import { Modal } from './Modal';
import { Segmented } from './Segmented';
import { Badge } from './Badge';
import { SectionHeader } from './SectionHeader';
import { GlassPanel } from './GlassPanel';
import { InfoCard } from './InfoCard';
import { toast } from './Toast';

interface AssetLibraryProps {
  onAddToCart?: (item: any) => void;
}

const difficultyTone: Record<string, 'success' | 'warning' | 'danger'> = {
  'Dễ': 'success',
  'Trung bình': 'warning',
  'Khó': 'danger',
};

const filterOptions: { value: AssetCategory | 'all'; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'Tất cả', icon: <Sparkles /> },
  { value: 'tank', label: 'Bể Kính', icon: <GlassWater size={14} /> },
  { value: 'plant', label: 'Cây Thủy Sinh', icon: <Sprout size={14} /> },
  { value: 'decor', label: 'Trang Trí', icon: <Mountain size={14} /> },
  { value: 'fish', label: 'Cá Cảnh', icon: <Fish size={14} /> },
];

export const AssetLibrary: React.FC<AssetLibraryProps> = ({ onAddToCart }) => {
  const [filter, setFilter] = useState<AssetCategory | 'all'>('all');
  const [selected, setSelected] = useState<Asset | null>(null);

  const filtered = filter === 'all' ? assets : assets.filter((a) => a.category === filter);

  return (
    <section id="library" className="section" aria-labelledby="library-title" style={{ position: 'relative', zIndex: 2 }}>
      <div className="container">
        <div
          className="flex justify-between align-center flex-wrap gap-3"
          style={{ marginBottom: 40 }}
        >
          <SectionHeader
            eyebrow="Thư Viện Thủy Sinh"
            size="large"
            align="left"
            title={
              <>
                Tra Cứu <span className="gradient-text">Bể · Cây · Trang Trí · Cá</span>
              </>
            }
            description="Bấm vào từng vật phẩm để xem nguồn gốc, nơi bán & giá tham khảo. Riêng cá có hướng dẫn chăm sóc: thông số nước, oxy, châm vi sinh và cách cho ăn hợp lý."
          />
          <Segmented<AssetCategory | 'all'>
            value={filter}
            options={filterOptions}
            onChange={setFilter}
            ariaLabel="Lọc vật phẩm"
          />
        </div>

        <div className="grid auto-fit-grid gap-3 stagger">
          {filtered.map((asset, idx) => (
            <GlassPanel
              key={asset.id}
              bordered
              interactive
              glowOnHover
              className="hover-lift"
              style={{
                padding: 0,
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                ['--i' as string]: idx,
              } as React.CSSProperties}
              role="button"
              tabIndex={0}
              onClick={() => setSelected(asset)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelected(asset);
                }
              }}
            >
              <div style={{ position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden' }}>
                <img
                  src={asset.image}
                  alt={asset.name}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s var(--ease-liquid)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
                {asset.fishCare && (
                  <span style={{ position: 'absolute', top: 12, left: 12 }}>
                    <Badge tone={difficultyTone[asset.fishCare.difficulty]} dot>
                      Nuôi: {asset.fishCare.difficulty}
                    </Badge>
                  </span>
                )}
              </div>

              <div
                style={{
                  padding: 18,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: 10,
                      color: 'var(--color-primary)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}
                  >
                    {categoryLabels[asset.category]}
                  </span>
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: '#fff',
                      margin: '6px 0 8px 0',
                      lineHeight: 1.3,
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {asset.name}
                  </h3>
                  <p
                    style={{
                      fontSize: 11,
                      color: 'var(--color-text-muted)',
                      lineHeight: 1.5,
                      display: 'flex',
                      gap: 4,
                      alignItems: 'flex-start',
                    }}
                  >
                    <MapPin size={12} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{asset.origin}</span>
                  </p>
                </div>

                <div
                  className="flex align-center justify-between"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}
                >
                  <div className="flex flex-col">
                    <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>Giá từ</span>
                    <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--color-primary)' }}>
                      {asset.priceFrom.toLocaleString()}₫
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    Chi tiết <Info size={13} />
                  </span>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      </div>

      <AssetDetailModal
        asset={selected}
        onClose={() => setSelected(null)}
        onAddToCart={(a) => {
          onAddToCart?.({
            id: a.id,
            name: a.name,
            price: a.priceFrom,
            image: a.image,
            description: a.origin,
          });
          toast({ kind: 'success', message: `Đã thêm “${a.name}” vào giỏ hàng.` });
        }}
      />
    </section>
  );
};

function AssetDetailModal({
  asset,
  onClose,
  onAddToCart,
}: {
  asset: Asset | null;
  onClose: () => void;
  onAddToCart: (a: Asset) => void;
}) {
  if (!asset) return null;
  return (
    <Modal
      open
      onClose={onClose}
      width="wide"
      labelledBy="asset-modal-title"
    >
      <div
        className="grid"
        style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: 0 }}
      >
        <div style={{ position: 'relative', minHeight: 280 }}>
          <img
            src={asset.image}
            alt={asset.name}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-card) 0 0 var(--radius-card)' }}
          />
        </div>
        <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <span
            style={{
              fontSize: 11,
              color: 'var(--color-primary)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 1.5,
            }}
          >
            {categoryLabels[asset.category]}
          </span>
          <h2
            id="asset-modal-title"
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: '#fff',
              fontFamily: 'var(--font-display)',
              lineHeight: 1.2,
            }}
          >
            {asset.name}
          </h2>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <MapPin size={16} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)', display: 'block' }}>Nguồn gốc</span>
              <span style={{ fontSize: 13, color: 'var(--color-text-primary)' }}>{asset.origin}</span>
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            {asset.description}
          </p>
          <Button
            variant="primary"
            size="md"
            fullWidth
            iconLeft={<ShoppingCart size={16} />}
            onClick={() => onAddToCart(asset)}
          >
            Thêm vào giỏ · từ {asset.priceFrom.toLocaleString()}₫
          </Button>
        </div>
      </div>

      <div style={{ padding: '0 28px 28px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {asset.fishCare && (
          <div>
            <SectionTitle icon={<FishIcon size={18} color="var(--color-primary)" />} title="Hướng Dẫn Chăm Sóc" />
            <div
              className="grid auto-fit-grid"
              style={{ marginTop: 14, gap: 12 }}
            >
              <InfoCard icon={<FishIcon size={14} />} label="Loài" value={asset.fishCare.species} />
              <InfoCard icon={<Info size={14} />} label="Tính nết" value={asset.fishCare.temperament} />
              <InfoCard icon={<Thermometer size={14} />} label="Nhiệt độ nước" value={asset.fishCare.waterTemp} />
              <InfoCard icon={<Droplet size={14} />} label="Độ pH" value={asset.fishCare.ph} />
              <InfoCard icon={<Waves size={14} />} label="Dung tích tối thiểu" value={asset.fishCare.minTank} />
              <InfoCard
                icon={<Info size={14} />}
                label="Độ khó nuôi"
                value={
                  <Badge tone={difficultyTone[asset.fishCare.difficulty]} dot>
                    {asset.fishCare.difficulty}
                  </Badge>
                }
              />
              <InfoCard icon={<Wind size={14} />} label="Oxy / Sục khí" value={asset.fishCare.oxygen} />
              <InfoCard icon={<FlaskConical size={14} />} label="Châm vi sinh & lọc" value={asset.fishCare.bacteria} />
              <InfoCard icon={<Utensils size={14} />} label="Cho ăn" value={asset.fishCare.feeding} />
            </div>
          </div>
        )}

        {asset.careNote && (
          <div
            className="glass-panel"
            style={{
              padding: 16,
              display: 'flex',
              gap: 10,
              background: 'rgba(94, 234, 212, 0.05)',
            }}
          >
            <Info size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', display: 'block', marginBottom: 4 }}>
                Lưu ý sử dụng & chăm sóc
              </span>
              <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                {asset.careNote}
              </span>
            </div>
          </div>
        )}

        <div>
          <SectionTitle icon={<Store size={18} color="var(--color-primary)" />} title="Mua Ở Đâu & Giá Tham Khảo" />
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {asset.stores.map((store, idx) => (
              <GlassPanel
                key={idx}
                bordered
                style={{
                  padding: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: 1, minWidth: 160 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', display: 'block' }}>
                    {store.name}
                  </span>
                  {store.location && (
                    <span
                      style={{
                        fontSize: 11,
                        color: 'var(--color-text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        marginTop: 2,
                      }}
                    >
                      <MapPin size={11} /> {store.location}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-primary)' }}>
                  {store.price.toLocaleString()}₫
                </span>
                {store.url && (
                  <a
                    href={store.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    <span>Xem</span>
                    <span className="btn-icon"><ExternalLink size={13} /></span>
                  </a>
                )}
              </GlassPanel>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div
      className="flex align-center gap-2"
      style={{ borderBottom: '1px solid rgba(94, 234, 212, 0.15)', paddingBottom: 10 }}
    >
      {icon}
      <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)' }}>
        {title}
      </span>
    </div>
  );
}

// Local Sparkles icon for filter "all" — keeps imports lean
function Sparkles() {
  return <SparklesIcon />;
}
function SparklesIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3" />
    </svg>
  );
}
