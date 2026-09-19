import { useMemo, useState, useEffect } from 'react';
import {
  ShoppingCart, RefreshCw, Compass, Info, Ruler, Droplets, Fish as FishIcon,
  Camera, Square, Hexagon, Circle, Sun, Moon, Sparkles, TreePine, Mountain, Layers, ArrowLeft,
  CloudUpload, CheckCircle2, Copy, X,
} from 'lucide-react';
import { api, authStorage } from '../services/api';
import type { SaveDesignPayload } from '../services/api';
import { Button } from './Button';
import { IconButton } from './IconButton';
import { Segmented } from './Segmented';
import { SectionHeader } from './SectionHeader';
import { Tag } from './Tag';
import { toast } from './Toast';
import {
  ConfiguratorScene, type SceneItem, type CameraPreset,
} from '../three/ConfiguratorScene';
import type { TankShape, StandStyle, BackgroundTheme } from '../three/tank/AquariumTank';
import type { LightingPreset } from '../three/tank/LightingRig';
import type { FishSpecies } from '../three/ProceduralFish';

type Panel = 'shape' | 'background' | 'lighting';
type PresetId = 'iwagumi' | 'biotope' | 'dutch' | 'custom';

const SHAPE_LABEL: Record<TankShape, string> = {
  rectangle: 'Bể Chữ Nhật Siêu Trong',
  hexagon: 'Bể Lục Giác Nghệ Thuật',
  bowl: 'Bể Tròn Mini',
};

const STAND_LABEL: Record<StandStyle, string> = {
  wood: 'Kệ Gỗ Sồi Cổ Điển',
  metal: 'Kệ Khung Sắt Tĩnh Điện',
  none: 'Không lấy kệ',
};

const BG_LABEL: Record<BackgroundTheme, string> = {
  'deep-blue': 'Thủy Cung Huyền Bí',
  'amazon-forest': 'Rừng Thủy Sinh Amazon',
  'ancient-ruins': 'Cổ Trấn Đổ Nát',
};

const PRICES = {
  shapes: { rectangle: 1500000, hexagon: 2200000, bowl: 950000 },
  stands: { wood: 800000, metal: 1200000, none: 0 },
  backgrounds: { 'deep-blue': 150000, 'amazon-forest': 250000, 'ancient-ruins': 350000 },
};

const SPECIES_BY_CANVAS_UNUSED: Record<string, FishSpecies> = {
  goldfish: 'goldfish',
  angelfish: 'angelfish',
  tetra: 'neon-tetra',
  clown: 'goldfish',
};
void SPECIES_BY_CANVAS_UNUSED;const CATALOG: SceneItem[] = [
  {
    id: 'f-discus', name: 'Cá Đĩa Discus', type: 'fish', price: 250000, color: '#ec4899',
    canvasType: 'goldfish', species: 'goldfish', swimRadius: 0.5,
  },
  {
    id: 'f-angel', name: 'Cá Thần Tiên', type: 'fish', price: 90000, color: '#e2e8f0',
    canvasType: 'angelfish', species: 'angelfish', swimRadius: 0.55,
  },
  {
    id: 'f-neon', name: 'Cá Neon Xanh', type: 'fish', price: 15000, color: '#ff2a2a',
    canvasType: 'tetra', species: 'neon-tetra', swimRadius: 0.6,
  },
  {
    id: 'f-clown', name: 'Cá Hề Nemo', type: 'fish', price: 80000, color: '#ff6b00',
    canvasType: 'clown', species: 'goldfish', swimRadius: 0.45,
  },
  {
    id: 'd-drift', name: 'Lũa Thủy Sinh Tự Nhiên', type: 'decor', price: 180000,
    canvasType: 'driftwood', decorGeometry: 'driftwood',
  },
  {
    id: 'd-stone', name: 'Đá Cảnh Rêu Phong', type: 'decor', price: 120000,
    canvasType: 'stone', decorGeometry: 'stone',
  },
  {
    id: 'd-plant', name: 'Khóm Cây Ráy Lùn', type: 'decor', price: 45000,
    canvasType: 'plant', plantHue: 'green' as const,
  },
];

const PRESETS: Record<
  Exclude<PresetId, 'custom'>,
  {
    label: string;
    desc: string;
    icon: React.ReactNode;
    config: {
      tankShape: TankShape;
      standStyle: StandStyle;
      backgroundTheme: BackgroundTheme;
      lightingPreset: LightingPreset;
      lightingIntensity: number;
      itemIds: string[];
    };
  }
> = {
  iwagumi: {
    label: 'Iwagumi',
    desc: 'Tối giản Nhật Bản — đá, rêu, ánh sáng trong.',
    icon: <Mountain size={16} />,
    config: {
      tankShape: 'rectangle',
      standStyle: 'wood',
      backgroundTheme: 'amazon-forest',
      lightingPreset: 'warm',
      lightingIntensity: 1.1,
      itemIds: ['d-stone', 'd-stone', 'd-plant'],
    },
  },
  biotope: {
    label: 'Biotope Amazon',
    desc: 'Lũa rừng già, neon đàn, ánh sáng ấm rực rỡ.',
    icon: <TreePine size={16} />,
    config: {
      tankShape: 'hexagon',
      standStyle: 'wood',
      backgroundTheme: 'amazon-forest',
      lightingPreset: 'warm',
      lightingIntensity: 1.2,
      itemIds: ['d-drift', 'd-plant', 'd-plant', 'f-neon', 'f-neon', 'f-neon'],
    },
  },
  dutch: {
    label: 'Hà Lan',
    desc: 'Cây rậm rạp, đèn mạnh, màu sắc rực rỡ.',
    icon: <Sparkles size={16} />,
    config: {
      tankShape: 'rectangle',
      standStyle: 'metal',
      backgroundTheme: 'deep-blue',
      lightingPreset: 'cool',
      lightingIntensity: 1.3,
      itemIds: ['d-plant', 'd-plant', 'd-plant', 'd-stone', 'f-discus', 'f-angel'],
    },
  },
};

const CAMERA_PRESETS: { id: CameraPreset; label: string; icon: React.ReactNode }[] = [
  { id: 'front', label: 'Trước', icon: <Square size={14} /> },
  { id: 'iso', label: '3/4', icon: <Layers size={14} /> },
  { id: 'top', label: 'Trên', icon: <Sun size={14} /> },
  { id: 'closeup', label: 'Cận', icon: <Camera size={14} /> },
];

interface AquariumCustomizerProps {
  onAddToCart: (item: any) => void;
  onBackToStore?: () => void;
  initialDesign?: any;
}

export const AquariumCustomizer: React.FC<AquariumCustomizerProps> = ({
  onAddToCart,
  onBackToStore,
  initialDesign,
}) => {
  const [tankShape, setTankShape] = useState<TankShape>('rectangle');
  const [standStyle, setStandStyle] = useState<StandStyle>('wood');
  const [backgroundTheme, setBackgroundTheme] = useState<BackgroundTheme>('amazon-forest');
  const [addedItems, setAddedItems] = useState<SceneItem[]>([]);
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>('warm');
  const [lightingIntensity, setLightingIntensity] = useState(1.1);
  const [activePanel, setActivePanel] = useState<Panel>('shape');
  const [activePreset, setActivePreset] = useState<PresetId>('custom');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('iso');
  const [autoRotate, setAutoRotate] = useState(false);

  // Cloud Save & Share State (Aquarium 3D Service :8084)
  const [isSavingCloud, setIsSavingCloud] = useState(false);
  const [savedDesignData, setSavedDesignData] = useState<{
    id: string;
    shareSlug: string;
    shareUrl: string;
    name: string;
    totalPrice: number;
    viewCount?: number;
  } | null>(null);

  // Rehydrate initial design if loaded from share URL (?design=slug)
  useEffect(() => {
    if (initialDesign) {
      try {
        if (initialDesign.tankDimensions) {
          const dims = typeof initialDesign.tankDimensions === 'string'
            ? JSON.parse(initialDesign.tankDimensions)
            : initialDesign.tankDimensions;
          if (dims.shape && SHAPE_LABEL[dims.shape as TankShape]) setTankShape(dims.shape);
          if (dims.stand && STAND_LABEL[dims.stand as StandStyle]) setStandStyle(dims.stand);
        }
        if (initialDesign.sceneData) {
          const sc = typeof initialDesign.sceneData === 'string'
            ? JSON.parse(initialDesign.sceneData)
            : initialDesign.sceneData;
          if (sc.backgroundTheme && BG_LABEL[sc.backgroundTheme as BackgroundTheme]) setBackgroundTheme(sc.backgroundTheme);
          if (sc.lightingPreset) setLightingPreset(sc.lightingPreset);
          if (sc.lightingIntensity) setLightingIntensity(sc.lightingIntensity);
          if (sc.items && Array.isArray(sc.items)) {
            const rehydrated = sc.items.map((it: any, i: number) => {
              const catMatch = CATALOG.find((c) => c.name === it.name || c.id === it.id);
              return catMatch ? { ...catMatch, id: `${catMatch.id}-${Date.now()}-${i}` } : it;
            });
            setAddedItems(rehydrated);
          }
        }
        toast({ kind: 'info', message: `✨ Đã khôi phục bản vẽ "${initialDesign.name}" từ cơ sở dữ liệu!` });
      } catch (e) {
        console.warn('Failed to rehydrate initial design:', e);
      }
    }
  }, [initialDesign]);

  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );
  useEffect(() => {
    if (reducedMotion) setAutoRotate(false);
  }, [reducedMotion]);

  const totalPrice =
    PRICES.shapes[tankShape] +
    PRICES.stands[standStyle] +
    PRICES.backgrounds[backgroundTheme] +
    addedItems.reduce((acc, it) => acc + it.price, 0);

  const ecosystemStats = useMemo(() => {
    const fish = addedItems.filter((it) => it.type === 'fish').length;
    const decor = addedItems.filter((it) => it.type === 'decor').length;
    return { fish, decor };
  }, [addedItems]);

  const applyPreset = (id: Exclude<PresetId, 'custom'>) => {
    const p = PRESETS[id];
    setTankShape(p.config.tankShape);
    setStandStyle(p.config.standStyle);
    setBackgroundTheme(p.config.backgroundTheme);
    setLightingPreset(p.config.lightingPreset);
    setLightingIntensity(p.config.lightingIntensity);
    setAddedItems(
      p.config.itemIds
        .map((cid) => CATALOG.find((c) => c.id === cid))
        .filter((c): c is SceneItem => Boolean(c))
        .map((c, i) => ({ ...c, id: `${c.id}-${Date.now()}-${i}` }))
    );
    setActivePreset(id);
    setActivePanel('shape');
    toast({ kind: 'info', message: `Đã áp dụng preset phong cách ${p.label}.` });
  };

  const handleAddItem = (item: SceneItem) => {
    if (addedItems.length >= 12) {
      toast({ kind: 'warning', message: 'Bể đã đạt số lượng vật phẩm tối đa để đảm bảo môi trường sinh thái.' });
      return;
    }
    setAddedItems((prev) => {
      const next = [...prev, { ...item, id: `${item.id}-${Date.now()}-${prev.length}` }];
      markCustom();
      return next;
    });
  };

  const handleRemoveItem = (id: string) => {
    setAddedItems((prev) => {
      const next = prev.filter((it) => it.id !== id);
      markCustom();
      return next;
    });
  };

  const markCustom = () => setActivePreset('custom');

  const handleReset = () => {
    setAddedItems([]);
    setTankShape('rectangle');
    setStandStyle('wood');
    setBackgroundTheme('amazon-forest');
    setLightingPreset('warm');
    setLightingIntensity(1.1);
    setActivePreset('custom');
    setActivePanel('shape');
    toast({ kind: 'info', message: 'Đã làm mới toàn bộ cấu hình bể cá.' });
  };

  const handleSaveToCart = () => {
    const customConfig = {
      id: `custom-tank-${Date.now()}`,
      name: `Bể Cá 3D — ${SHAPE_LABEL[tankShape]} (${PRESETS[activePreset as keyof typeof PRESETS]?.label ?? 'Custom'})`,
      price: totalPrice,
      image: '/assets/custom_tank_placeholder.png',
      isCustom: true,
      description: `Bể: ${SHAPE_LABEL[tankShape]} · Kệ: ${STAND_LABEL[standStyle]} · Phông nền: ${BG_LABEL[backgroundTheme]} · Ánh sáng: ${lightingPreset}. Gồm ${ecosystemStats.fish} sinh vật & ${ecosystemStats.decor} vật trang trí.`,
      details: {
        presetId: activePreset,
        tankShape, standStyle, backgroundTheme,
        lightingPreset, lightingIntensity,
        addedItems,
        ecosystem: ecosystemStats,
      },
    };
    onAddToCart(customConfig);
    toast({ kind: 'success', message: '🎉 Đã lưu thiết kế bể cá 3D vào giỏ hàng!' });
  };

  const handleSaveToCloud = async () => {
    setIsSavingCloud(true);
    try {
      const user = authStorage.getUser();
      const dims = {
        shape: tankShape,
        stand: standStyle,
        size: tankShape === 'rectangle' ? '90x45x45 cm' : tankShape === 'hexagon' ? '70x70x60 cm' : '40x40x35 cm',
      };
      const scene = {
        backgroundTheme,
        lightingPreset,
        lightingIntensity,
        items: addedItems.map((it) => ({
          id: it.id,
          name: it.name,
          type: it.type,
          price: it.price,
          canvasType: it.canvasType,
        })),
        activePreset,
      };
      const bom = {
        itemsCount: addedItems.length,
        tankPrice: PRICES.shapes[tankShape],
        standPrice: PRICES.stands[standStyle],
        backgroundPrice: PRICES.backgrounds[backgroundTheme],
        itemsPrice: addedItems.reduce((acc, it) => acc + it.price, 0),
      };

      // Valid fallback user ID (Customer Nguyễn Phương Nam) if not logged in
      const guestFallbackId = 'a0000000-0000-0000-0000-000000000005';
      const payload: SaveDesignPayload = {
        userId: user?.id || guestFallbackId,
        name: `Bể Cá 3D — ${SHAPE_LABEL[tankShape]} (${PRESETS[activePreset as keyof typeof PRESETS]?.label ?? 'Tự thiết kế'})`,
        tankDimensions: JSON.stringify(dims),
        sceneData: JSON.stringify(scene),
        bomSnapshot: JSON.stringify(bom),
        totalPrice,
      };

      const res = await api.save3DDesign(payload);
      if (res.success && res.data) {
        const slug = res.data.shareSlug;
        const shareUrl = `${window.location.origin}/?design=${slug}`;
        setSavedDesignData({
          id: res.data.id,
          shareSlug: slug,
          shareUrl,
          name: res.data.name,
          totalPrice: Number(res.data.totalPrice),
          viewCount: res.data.viewCount,
        });
        toast({ kind: 'success', message: '🎉 Đã lưu bản vẽ 3D lên PostgreSQL thành công!' });
      } else {
        toast({ kind: 'danger', message: res.message || 'Không thể lưu bản vẽ lên Cloud' });
      }
    } catch (err: any) {
      toast({ kind: 'danger', message: err?.message || 'Lỗi kết nối tới Aquarium 3D Service' });
    } finally {
      setIsSavingCloud(false);
    }
  };

  const tabOptions = [
    { value: 'shape' as const, label: 'Hình dạng', icon: <Square size={14} /> },
    { value: 'background' as const, label: 'Phông nền', icon: <Mountain size={14} /> },
    { value: 'lighting' as const, label: 'Ánh sáng', icon: <Sun size={14} /> },
  ];

  const fishCount = ecosystemStats.fish;
  const decorCount = ecosystemStats.decor;
  const sizeLabel =
    tankShape === 'rectangle' ? '90×45×45 cm' : tankShape === 'hexagon' ? '70×70×60 cm' : '40×40×35 cm';
  const volumeLabel =
    tankShape === 'rectangle' ? '180 L' : tankShape === 'hexagon' ? '120 L' : '30 L';

  return (
    <section id="customizer" className="section studio-section" aria-labelledby="customizer-title">
      <div className="container-wide">
        {onBackToStore && (
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={onBackToStore}
              className="btn-secondary flex align-center gap-1"
              style={{
                padding: '10px 18px',
                fontSize: '13px',
                borderRadius: '30px',
                background: '#ffffff',
                border: '1.5px solid #cbd5e1',
                cursor: 'pointer',
                fontWeight: 600,
                color: '#334155',
                display: 'inline-flex',
                boxShadow: '0 2px 8px rgba(15,23,42,0.05)',
              }}
            >
              <ArrowLeft size={16} />
              <span>Quay Lại Cửa Hàng</span>
            </button>
          </div>
        )}
        <SectionHeader
          eyebrow="Trải Nghiệm Tương Tác 3D"
          title={
            <>
              Tự Thiết Kế <span className="gradient-text">Bể Cá Thủy Sinh</span> Của Bạn
            </>
          }
          description="Chọn bố cục có sẵn, tinh chỉnh hình dáng, phông nền, ánh sáng và thả cá — mọi thay đổi cập nhật tức thì trong bể kính 3D chân thực."
        />

        <div className="studio-shell">
          {/* ── Full-bleed 3D stage ── */}
          <div className="studio-stage">
            <ConfiguratorScene
              shape={tankShape}
              stand={standStyle}
              backgroundTheme={backgroundTheme}
              items={addedItems}
              lightingPreset={lightingPreset}
              lightingIntensity={lightingIntensity}
              cameraPreset={cameraPreset}
              autoRotate={autoRotate}
            />
            <div className="studio-scrim" aria-hidden />
            <span className="studio-hint">
              <Compass size={12} /> Kéo để xoay · Cuộn để phóng to
            </span>
          </div>

          {/* ── Floating HUD overlay ── */}
          <div className="studio-overlay">
            {/* Top: preset chips + auto-rotate */}
            <div className="studio-top">
              <div className="studio-presets" role="tablist" aria-label="Bố cục có sẵn">
                {(Object.entries(PRESETS) as [keyof typeof PRESETS, typeof PRESETS[keyof typeof PRESETS]][]).map(
                  ([id, p]) => (
                    <button
                      key={id}
                      role="tab"
                      aria-selected={activePreset === id}
                      onClick={() => applyPreset(id)}
                      className={`studio-preset ${activePreset === id ? 'is-active' : ''}`}
                      type="button"
                      title={p.desc}
                    >
                      <span className="studio-preset-icon">{p.icon}</span>
                      <span className="studio-preset-label">{p.label}</span>
                    </button>
                  )
                )}
              </div>
              <button
                type="button"
                onClick={() => setAutoRotate((v) => !v)}
                aria-pressed={autoRotate}
                className={`studio-chip ${autoRotate ? 'is-active' : ''}`}
              >
                {autoRotate ? <Sun size={13} /> : <Moon size={13} />}
                <span>Tự xoay</span>
              </button>
            </div>

            {/* Left dock: library */}
            <aside className="studio-dock studio-dock-left" aria-label="Thư viện cá & trang trí">
              <div className="studio-dock-head">
                <FishIcon size={15} />
                <span>Thư Viện</span>
                <span className="studio-dock-count">{addedItems.length}/12</span>
              </div>
              <div className="studio-dock-body">
                <ItemsPanel
                  items={addedItems}
                  onAdd={handleAddItem}
                  onRemove={handleRemoveItem}
                />
              </div>
            </aside>

            {/* Right dock: properties + price + actions */}
            <aside className="studio-dock studio-dock-right" aria-label="Tùy chỉnh bể">
              <div className="studio-dock-head studio-dock-head-tabs">
                <Segmented<Panel>
                  value={activePanel}
                  options={tabOptions}
                  onChange={(v) => setActivePanel(v)}
                  ariaLabel="Chuyển tab tinh chỉnh"
                />
                {activePreset === 'custom' ? (
                  <Tag variant="premium">Custom</Tag>
                ) : (
                  <Tag variant="info">{PRESETS[activePreset as keyof typeof PRESETS].label}</Tag>
                )}
              </div>

              <div className="studio-dock-body">
                {activePanel === 'shape' && (
                  <ShapePanel
                    shape={tankShape}
                    stand={standStyle}
                    onShape={(s) => { setTankShape(s); markCustom(); }}
                    onStand={(s) => { setStandStyle(s); markCustom(); }}
                  />
                )}
                {activePanel === 'background' && (
                  <BackgroundPanel
                    theme={backgroundTheme}
                    onTheme={(t) => { setBackgroundTheme(t); markCustom(); }}
                  />
                )}
                {activePanel === 'lighting' && (
                  <LightingPanel
                    preset={lightingPreset}
                    intensity={lightingIntensity}
                    onPreset={(p) => { setLightingPreset(p); markCustom(); }}
                    onIntensity={setLightingIntensity}
                  />
                )}
              </div>

              <div className="studio-dock-foot">
                <PriceBreakdown
                  shape={tankShape}
                  stand={standStyle}
                  background={backgroundTheme}
                  items={addedItems}
                  total={totalPrice}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                  <button
                    onClick={handleSaveToCloud}
                    disabled={isSavingCloud}
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: isSavingCloud ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 16px rgba(2, 132, 199, 0.3)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {isSavingCloud ? <RefreshCw size={15} className="spin" /> : <CloudUpload size={15} />}
                    <span>{isSavingCloud ? 'Đang lưu vào PostgreSQL...' : 'Lưu Bản Vẽ 3D & Chia Sẻ'}</span>
                  </button>

                  <div className="flex gap-2">
                    <IconButton
                      size="md"
                      label="Làm mới"
                      onClick={handleReset}
                      icon={<RefreshCw size={16} />}
                    />
                    <Button
                      variant="primary"
                      size="md"
                      fullWidth
                      iconLeft={<ShoppingCart size={16} />}
                      onClick={handleSaveToCart}
                    >
                      Lưu vào giỏ
                    </Button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Bottom: camera strip + quick stats */}
            <div className="studio-bottom">
              <div className="studio-cameras" role="tablist" aria-label="Góc camera">
                {CAMERA_PRESETS.map((c) => (
                  <button
                    key={c.id}
                    role="tab"
                    aria-selected={cameraPreset === c.id}
                    onClick={() => setCameraPreset(c.id)}
                    className={`studio-camera-btn ${cameraPreset === c.id ? 'is-active' : ''}`}
                    type="button"
                  >
                    {c.icon}
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
              <div className="studio-quickstats">
                <span className="studio-qs"><Ruler size={13} /> {sizeLabel}</span>
                <span className="studio-qs"><Droplets size={13} /> {volumeLabel}</span>
                <span className="studio-qs"><FishIcon size={13} /> {fishCount} · {decorCount}</span>
                <span className="studio-qs studio-qs-total">
                  <Sparkles size={13} /> {totalPrice.toLocaleString('vi-VN')}₫
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Cloud Save & Share Modal (PostgreSQL 18 - aquarium-3d-service :8084) */}
        {savedDesignData && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(2, 6, 12, 0.85)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
            onClick={() => setSavedDesignData(null)}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '520px',
                background: 'linear-gradient(180deg, #0b121f 0%, #080d16 100%)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '20px',
                padding: '28px',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(56, 189, 248, 0.1)',
                color: '#f8fafc',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={24} color="#10b981" />
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#f8fafc' }}>
                    Đã Lưu Bản Vẽ Vào PostgreSQL!
                  </h3>
                </div>
                <button
                  onClick={() => setSavedDesignData(null)}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(56, 189, 248, 0.18)',
                  marginBottom: '18px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Tên thiết kế:</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>{savedDesignData.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Tổng giá trị:</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8' }}>
                    {savedDesignData.totalPrice.toLocaleString('vi-VN')}₫
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Mã chia sẻ (Slug):</span>
                  <span
                    style={{
                      fontSize: '13px',
                      fontFamily: 'monospace',
                      color: '#34d399',
                      background: 'rgba(16, 185, 129, 0.12)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    {savedDesignData.shareSlug}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '10px' }}>
                  Đã ghi nhận bản ghi vào bảng <code>user_designs</code> (PostgreSQL 18 - Port 8084)
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  Đường dẫn chia sẻ trực tiếp:
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    readOnly
                    value={savedDesignData.shareUrl}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      color: '#f8fafc',
                      fontSize: '13px',
                      fontFamily: 'monospace',
                    }}
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(savedDesignData.shareUrl);
                      toast({ kind: 'success', message: '📋 Đã copy link chia sẻ vào clipboard!' });
                    }}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '10px',
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                      color: '#38bdf8',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '13px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Copy size={14} />
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              <button
                onClick={() => setSavedDesignData(null)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

interface ShapePanelProps {
  shape: TankShape;
  stand: StandStyle;
  onShape: (s: TankShape) => void;
  onStand: (s: StandStyle) => void;
}

function ShapePanel({ shape, stand, onShape, onStand }: ShapePanelProps) {
  const shapeCards: { id: TankShape; icon: React.ReactNode; meta: string }[] = [
    { id: 'rectangle', icon: <Square size={22} />, meta: '90×45×45 cm · 180 L' },
    { id: 'hexagon', icon: <Hexagon size={22} />, meta: '70×70×60 cm · 120 L' },
    { id: 'bowl', icon: <Circle size={22} />, meta: '40×40×35 cm · 30 L' },
  ];
  return (
    <div className="flex flex-col gap-3">
      <span className="eyebrow">Kiểu dáng bể</span>
      <div className="option-grid">
        {shapeCards.map((s) => (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={shape === s.id}
            onClick={() => onShape(s.id)}
            className={`option-card ${shape === s.id ? 'is-active' : ''}`}
          >
            <span className="option-card-icon">{s.icon}</span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'left' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: '#fff' }}>
                {SHAPE_LABEL[s.id]}
              </span>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{s.meta}</span>
              <span style={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 700 }}>
                {PRICES.shapes[s.id].toLocaleString('vi-VN')}₫
              </span>
            </span>
          </button>
        ))}
      </div>

      <span className="eyebrow" style={{ marginTop: 12 }}>Kệ đỡ</span>
      <div className="option-list">
        {(['wood', 'metal', 'none'] as StandStyle[]).map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={stand === s}
            onClick={() => onStand(s)}
            className={`option-row ${stand === s ? 'is-active' : ''}`}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              {s === 'wood' && <TreePine size={16} color="var(--color-accent-gold)" />}
              {s === 'metal' && <Layers size={16} color="var(--color-text-secondary)" />}
              {s === 'none' && <Circle size={16} color="var(--color-text-muted)" />}
              <span style={{ color: '#fff', fontWeight: 600 }}>{STAND_LABEL[s]}</span>
            </span>
            <span style={{ color: 'var(--color-primary)', fontSize: 13 }}>
              {s === 'none' ? 'Miễn phí' : `+${PRICES.stands[s].toLocaleString('vi-VN')}₫`}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

interface BackgroundPanelProps {
  theme: BackgroundTheme;
  onTheme: (t: BackgroundTheme) => void;
}
function BackgroundPanel({ theme, onTheme }: BackgroundPanelProps) {
  const themes: { id: BackgroundTheme; gradient: string; desc: string }[] = [
    {
      id: 'deep-blue',
      gradient: 'linear-gradient(135deg, #1d5444 0%, #143d31 50%, #061a14 100%)',
      desc: 'Ánh sáng xanh huyền bí đáy biển sâu.',
    },
    {
      id: 'amazon-forest',
      gradient: 'linear-gradient(135deg, #22c55e 0%, #1d5444 50%, #021410 100%)',
      desc: 'Nền lũa cổ, thực vật xanh rêu Amazon.',
    },
    {
      id: 'ancient-ruins',
      gradient: 'linear-gradient(135deg, #fbbf24 0%, #3a2615 50%, #0e0805 100%)',
      desc: 'Cột cổ, đền rêu chìm trong nước.',
    },
  ];
  return (
    <div className="flex flex-col gap-3">
      <span className="eyebrow">Phông nền / Hệ sinh thái</span>
      <div className="flex flex-col gap-2">
        {themes.map((t) => (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={theme === t.id}
            onClick={() => onTheme(t.id)}
            className={`bg-card ${theme === t.id ? 'is-active' : ''}`}
          >
            <span className="bg-swatch" style={{ background: t.gradient }} />
            <span style={{ display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'left', flex: 1 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: '#fff' }}>
                {BG_LABEL[t.id]}
              </span>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                {t.desc}
              </span>
            </span>
            <span style={{ color: 'var(--color-primary)', fontSize: 13, fontWeight: 700 }}>
              +{PRICES.backgrounds[t.id].toLocaleString('vi-VN')}₫
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

interface ItemsPanelProps {
  items: SceneItem[];
  onAdd: (item: SceneItem) => void;
  onRemove: (id: string) => void;
}
function ItemsPanel({ items, onAdd, onRemove }: ItemsPanelProps) {
  const [tab, setTab] = useState<'fish' | 'decor'>('fish');
  const fishCatalog = CATALOG.filter((c) => c.type === 'fish');
  const decorCatalog = CATALOG.filter((c) => c.type === 'decor');
  const totalItemsPrice = items.reduce((acc, it) => acc + it.price, 0);

  return (
    <div className="flex flex-col gap-3">
      <Segmented<'fish' | 'decor'>
        value={tab}
        options={[
          { value: 'fish' as const, label: 'Cá cảnh', icon: <FishIcon size={14} /> },
          { value: 'decor' as const, label: 'Trang trí', icon: <Layers size={14} /> },
        ]}
        onChange={setTab}
        ariaLabel="Danh mục vật phẩm"
      />

      <div className="catalog-grid">
        {(tab === 'fish' ? fishCatalog : decorCatalog).map((c) => (
          <button
            key={c.id}
            type="button"
            className="catalog-card"
            onClick={() => onAdd(c)}
            aria-label={`Thêm ${c.name} vào bể`}
          >
            <span
              aria-hidden
              className="catalog-thumb"
              style={{
                background: c.color
                  ? `radial-gradient(circle at 30% 30%, ${c.color}, ${c.color}55 60%, transparent 90%)`
                  : 'linear-gradient(135deg, var(--color-emerald), var(--color-primary))',
              }}
            >
              {c.type === 'fish' ? (
                <FishIcon size={22} color="#fff" />
              ) : (
                <Mountain size={22} color="#fff" />
              )}
              <span className="catalog-add">+</span>
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 700, lineHeight: 1.3 }}>{c.name}</span>
              <span style={{ color: 'var(--color-primary)', fontSize: 11, fontWeight: 700 }}>
                {c.price.toLocaleString('vi-VN')}₫
              </span>
            </span>
          </button>
        ))}
      </div>

      {items.length > 0 && (
        <div className="items-added">
          <span className="eyebrow" style={{ marginBottom: 8 }}>Đã thêm ({items.length}/12)</span>
          <div className="items-pills">
            {items.map((it) => (
              <span key={it.id} className="item-pill">
                <span>{it.name}</span>
                <button
                  type="button"
                  aria-label={`Bỏ ${it.name}`}
                  onClick={() => onRemove(it.id)}
                  className="item-pill-x"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="items-subtotal">
            <span style={{ color: 'var(--color-text-muted)' }}>Tạm tính vật phẩm</span>
            <strong style={{ color: 'var(--color-primary)' }}>
              {totalItemsPrice.toLocaleString('vi-VN')}₫
            </strong>
          </div>
        </div>
      )}
    </div>
  );
}

interface LightingPanelProps {
  preset: LightingPreset;
  intensity: number;
  onPreset: (p: LightingPreset) => void;
  onIntensity: (i: number) => void;
}
function LightingPanel({ preset, intensity, onPreset, onIntensity }: LightingPanelProps) {
  const presets: { id: LightingPreset; label: string; tone: string; desc: string }[] = [
    { id: 'warm', label: 'Ấm áp', tone: '#fbbf24', desc: 'Ánh sáng vàng tự nhiên' },
    { id: 'cool', label: 'Mát lạnh', tone: '#9bd9ff', desc: 'Xanh trong, biển cả' },
    { id: 'cinematic', label: 'Điện ảnh', tone: '#5eead4', desc: 'Tương phản cao, viền sáng' },
  ];
  return (
    <div className="flex flex-col gap-3">
      <span className="eyebrow">Ánh sáng</span>
      <div className="flex flex-col gap-2">
        {presets.map((p) => (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={preset === p.id}
            onClick={() => onPreset(p.id)}
            className={`lighting-card ${preset === p.id ? 'is-active' : ''}`}
            style={{ ['--tone' as string]: p.tone } as React.CSSProperties}
          >
            <span
              className="lighting-orb"
              aria-hidden
              style={{ background: `radial-gradient(circle, ${p.tone} 0%, transparent 70%)` }}
            />
            <span style={{ display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'left', flex: 1 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: '#fff' }}>{p.label}</span>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{p.desc}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="slider-row">
        <div className="flex justify-between">
          <span className="eyebrow">Cường độ</span>
          <span style={{ color: 'var(--color-primary)', fontSize: 12, fontWeight: 700 }}>
            {intensity.toFixed(2)}×
          </span>
        </div>
        <input
          type="range"
          min={0.5}
          max={2.0}
          step={0.05}
          value={intensity}
          onChange={(e) => onIntensity(parseFloat(e.target.value))}
          aria-label="Cường độ ánh sáng"
        />
        <div className="slider-scale" aria-hidden>
          <span>0.5×</span><span>1.0×</span><span>1.5×</span><span>2.0×</span>
        </div>
      </div>

      <div
        className="hint"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
          fontSize: 12,
          color: 'var(--color-text-muted)',
          lineHeight: 1.5,
        }}
      >
        <Info size={14} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
        <span>
          Mở bảng <strong style={{ color: 'var(--color-primary)' }}>Dev 3D</strong> ở góc trên-phải (chỉ desktop) để tinh chỉnh truyền sáng, khúc xạ, độ gợn nước và tốc độ tự xoay.
        </span>
      </div>
    </div>
  );
}

function PriceBreakdown({
  shape,
  stand,
  background,
  items,
  total,
}: {
  shape: TankShape;
  stand: StandStyle;
  background: BackgroundTheme;
  items: SceneItem[];
  total: number;
}) {
  const itemsTotal = items.reduce((acc, it) => acc + it.price, 0);
  const base = PRICES.shapes[shape] + PRICES.stands[stand] + PRICES.backgrounds[background];
  return (
    <div className="price-card">
      <div className="price-row">
        <span>Bể + kệ + phông nền</span>
        <span>{base.toLocaleString('vi-VN')}₫</span>
      </div>
      <div className="price-row">
        <span>Sinh vật & decor ({items.length})</span>
        <span>{itemsTotal.toLocaleString('vi-VN')}₫</span>
      </div>
      <div className="price-row total">
        <span>Tổng</span>
        <span>{total.toLocaleString('vi-VN')}₫</span>
      </div>
    </div>
  );
}
