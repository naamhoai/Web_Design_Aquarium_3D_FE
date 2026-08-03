import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ShoppingCart, RefreshCw, Layers, Fish as FishIcon, Compass, ArrowLeft } from 'lucide-react';
import { SplashCanvas } from './SplashCanvas';

interface CustomItem {
  id: string;
  name: string;
  type: 'fish' | 'decor';
  price: number;
  color?: string;
  canvasType: string;
}

interface SandboxFish {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  canvasType: string;
  wiggle: number;
}

interface SandboxFood {
  x: number;
  y: number;
  speed: number;
}

interface AquariumStudioPageProps {
  onAddToCart: (item: any) => void;
  onBackToStore: () => void;
}

const pricingData = {
  shapes: { rectangle: 1500000, hexagon: 2200000, bowl: 950000 } as const,
  stands: { wood: 800000, metal: 1200000, none: 0 } as const,
  backgrounds: { 'deep-blue': 150000, 'amazon-forest': 250000, 'ancient-ruins': 350000 } as const,
};

const shapesVietnamese = { rectangle: 'Bể Chữ Nhật Siêu Trong 90cm', hexagon: 'Bể Lục Giác Nghệ Thuật', bowl: 'Bể Tròn Mini' };
const standsVietnamese = { wood: 'Kệ Gỗ Sồi Cổ Điển', metal: 'Kệ Khung Sắt Tĩnh Điện', none: 'Không lấy kệ' };
const backgroundsVietnamese = { 'deep-blue': 'Thủy Cung Huyền Bí', 'amazon-forest': 'Rừng Amazon', 'ancient-ruins': 'Cổ Trấn Đổ Nát' };

const availableItems: CustomItem[] = [
  { id: 'f1', name: 'Cá Đĩa Discus', type: 'fish', price: 250000, color: '#ec4899', canvasType: 'discus' },
  { id: 'f2', name: 'Cá Rồng Kim Long', type: 'fish', price: 850000, color: '#d97706', canvasType: 'arowana' },
  { id: 'f3', name: 'Cá Thần Tiên', type: 'fish', price: 90000, color: '#94a3b8', canvasType: 'angelfish' },
  { id: 'f4', name: 'Cá Neon Tetra', type: 'fish', price: 15000, color: '#ef4444', canvasType: 'tetra' },
  { id: 'f5', name: 'Cá Hề Nemo', type: 'fish', price: 80000, color: '#ff6b00', canvasType: 'clown' },
  { id: 'd1', name: 'Lũa Cổ Thụ', type: 'decor', price: 180000, canvasType: 'driftwood' },
  { id: 'd2', name: 'Đá Rêu Phong', type: 'decor', price: 120000, canvasType: 'stone' },
  { id: 'd3', name: 'Cây Dương Xỉ', type: 'decor', price: 45000, canvasType: 'plant' },
];

export const AquariumStudioPage: React.FC<AquariumStudioPageProps> = ({ onAddToCart, onBackToStore }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tankShape, setTankShape] = useState<'rectangle' | 'hexagon' | 'bowl'>('rectangle');
  const [standStyle, setStandStyle] = useState<'wood' | 'metal' | 'none'>('wood');
  const [backgroundTheme, setBackgroundTheme] = useState<'deep-blue' | 'amazon-forest' | 'ancient-ruins'>('amazon-forest');
  const [addedItems, setAddedItems] = useState<CustomItem[]>([]);
  const [activeTab, setActiveTab] = useState<'shape' | 'background' | 'items'>('shape');
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const simulationRef = useRef<{ fish: SandboxFish[]; decor: string[]; food: SandboxFood[] }>({
    fish: [], decor: [], food: [],
  });

  const totalPrice =
    pricingData.shapes[tankShape] +
    pricingData.stands[standStyle] +
    pricingData.backgrounds[backgroundTheme] +
    addedItems.reduce((acc, item) => acc + item.price, 0);

  useEffect(() => {
    const fishItems = addedItems.filter((i) => i.type === 'fish');
    const currFish = [...simulationRef.current.fish];
    if (fishItems.length > currFish.length) {
      for (let i = currFish.length; i < fishItems.length; i++) {
        const item = fishItems[i];
        currFish.push({
          x: 100 + Math.random() * 300,
          y: 80 + Math.random() * 180,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 0.8,
          size: item.canvasType === 'arowana' ? 32 : item.canvasType === 'discus' ? 26 : 18,
          color: item.color || '#0284c7',
          canvasType: item.canvasType,
          wiggle: Math.random() * Math.PI * 2,
        });
      }
    } else {
      currFish.splice(fishItems.length);
    }
    simulationRef.current.fish = currFish;
    simulationRef.current.decor = addedItems.filter((i) => i.type === 'decor').map((i) => i.canvasType);
  }, [addedItems]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;
    const W = (canvas.width = 600);
    const H = (canvas.height = 400);
    let t = 0;

    const render = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.012;

      // Tank Background
      if (backgroundTheme === 'deep-blue') {
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, '#bae6fd');
        g.addColorStop(1, '#0284c7');
        ctx.fillStyle = g;
      } else if (backgroundTheme === 'amazon-forest') {
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, '#a7f3d0');
        g.addColorStop(1, '#065f46');
        ctx.fillStyle = g;
      } else {
        const g = ctx.createLinearGradient(0, 0, W, H);
        g.addColorStop(0, '#cbd5e1');
        g.addColorStop(1, '#1e293b');
        ctx.fillStyle = g;
      }
      ctx.fillRect(0, 0, W, H);

      // Sunbeam caustics
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.beginPath();
      ctx.moveTo(160 + Math.sin(t) * 25, 0);
      ctx.lineTo(280 + Math.sin(t) * 25, 0);
      ctx.lineTo(340 + Math.sin(t) * 12, H);
      ctx.lineTo(120 + Math.sin(t) * 12, H);
      ctx.closePath();
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';

      const tLeft = 40, tTop = 30, tW = W - 80, tH = H - 70;

      // Decor
      let stoneCount = 0, woodCount = 0, plantCount = 0;
      simulationRef.current.decor.forEach((dec) => {
        ctx.save();
        if (dec === 'driftwood') {
          ctx.strokeStyle = '#92400e'; ctx.lineWidth = 14; ctx.lineCap = 'round';
          const bx = tLeft + 80 + woodCount * 110, by = tTop + tH + 18;
          ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + 40, by - 55); ctx.lineTo(bx + 85, by - 88); ctx.stroke();
          ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(bx + 40, by - 55); ctx.lineTo(bx - 12, by - 105); ctx.stroke();
          woodCount++;
        } else if (dec === 'stone') {
          ctx.fillStyle = '#94a3b8'; const bx = tLeft + 40 + stoneCount * 130, by = tTop + tH + 22;
          ctx.beginPath(); ctx.arc(bx, by, 24, Math.PI, 0); ctx.closePath(); ctx.fill();
          ctx.fillStyle = '#10b981'; ctx.beginPath(); ctx.arc(bx - 5, by - 12, 10, Math.PI, 0); ctx.fill();
          stoneCount++;
        } else if (dec === 'plant') {
          ctx.fillStyle = '#10b981'; const bx = tLeft + tW - 90 - plantCount * 95, by = tTop + tH + 22;
          for (let i = 0; i < 6; i++) {
            ctx.beginPath(); ctx.ellipse(bx + (i - 2.5) * 13, by - 32 + Math.sin(t + i) * 6, 9, 24, (i - 2.5) * 0.15, 0, Math.PI * 2); ctx.fill();
          }
          plantCount++;
        }
        ctx.restore();
      });

      // Food
      ctx.fillStyle = '#fbbf24';
      simulationRef.current.food.forEach((fd, fi) => {
        fd.y += fd.speed;
        ctx.beginPath(); ctx.arc(fd.x, fd.y, 3, 0, Math.PI * 2); ctx.fill();
        if (fd.y > tTop + tH) simulationRef.current.food.splice(fi, 1);
      });

      // Fish
      simulationRef.current.fish.forEach((f) => {
        f.x += f.vx; f.y += f.vy;
        const foods = simulationRef.current.food;
        if (foods.length) {
          const dx = foods[0].x - f.x, dy = foods[0].y - f.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) { f.vx += (dx / dist) * 0.06; f.vy += (dy / dist) * 0.06; }
          if (dist < 18) foods.shift();
        }
        const spd = Math.sqrt(f.vx * f.vx + f.vy * f.vy);
        if (spd > 1.8) { f.vx = (f.vx / spd) * 1.8; f.vy = (f.vy / spd) * 1.8; }
        if (f.x < tLeft + 20) { f.x = tLeft + 20; f.vx *= -1; }
        if (f.x > tLeft + tW - 20) { f.x = tLeft + tW - 20; f.vx *= -1; }
        if (f.y < tTop + 20) { f.y = tTop + 20; f.vy *= -1; }
        if (f.y > tTop + tH - 18) { f.y = tTop + tH - 18; f.vy *= -1; }

        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(Math.atan2(f.vy, f.vx));
        f.wiggle += 0.16;
        const wv = Math.sin(f.wiggle) * 4;
        ctx.fillStyle = f.color;
        ctx.beginPath(); ctx.ellipse(0, 0, f.size * 0.65, f.size * 0.38, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(-f.size * 0.55, 0); ctx.lineTo(-f.size * 1.1, -f.size * 0.4 + wv); ctx.lineTo(-f.size * 1.1, f.size * 0.4 + wv); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(f.size * 0.3, -f.size * 0.06, 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(f.size * 0.31, -f.size * 0.06, 1.4, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });

      // Stand
      if (standStyle === 'wood') {
        ctx.fillStyle = '#92400e';
        ctx.fillRect(tLeft - 10, tTop + tH, tW + 20, 20);
        ctx.fillRect(tLeft + 18, tTop + tH + 20, 20, 32);
        ctx.fillRect(tLeft + tW - 38, tTop + tH + 20, 20, 32);
      } else if (standStyle === 'metal') {
        ctx.fillStyle = '#334155';
        ctx.fillRect(tLeft - 4, tTop + tH, tW + 8, 8);
        ctx.fillRect(tLeft + 8, tTop + tH + 8, 8, 44);
        ctx.fillRect(tLeft + tW - 16, tTop + tH + 8, 8, 44);
      }

      // Tank outline & glass
      if (tankShape === 'hexagon') {
        ctx.strokeStyle = '#0284c7'; ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(tLeft + 40, tTop); ctx.lineTo(tLeft + tW - 40, tTop);
        ctx.lineTo(tLeft + tW, tTop + 60); ctx.lineTo(tLeft + tW, tTop + tH);
        ctx.lineTo(tLeft, tTop + tH); ctx.lineTo(tLeft, tTop + 60);
        ctx.closePath(); ctx.stroke();
      } else if (tankShape === 'bowl') {
        ctx.strokeStyle = '#0284c7'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.ellipse(W / 2, tTop + tH / 2, tW / 2, tH / 2, 0, 0, Math.PI * 2); ctx.stroke();
      } else {
        ctx.strokeStyle = '#0284c7'; ctx.lineWidth = 4;
        ctx.strokeRect(tLeft, tTop, tW, tH);
      }

      // Glass shine
      const shine = ctx.createLinearGradient(0, 0, W, H);
      shine.addColorStop(0, 'rgba(255,255,255,0.3)');
      shine.addColorStop(0.35, 'rgba(255,255,255,0)');
      shine.addColorStop(1, 'rgba(255,255,255,0.1)');
      ctx.fillStyle = shine;
      ctx.fillRect(tLeft, tTop, tW, tH);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [tankShape, standStyle, backgroundTheme]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = 600 / rect.width;
    simulationRef.current.food.push({ x: (e.clientX - rect.left) * scaleX, y: 30, speed: Math.random() * 0.5 + 0.9 });
  };

  const handleAddItem = (item: CustomItem) => {
    if (addedItems.length >= 14) {
      setAlertMsg('Bể đã đạt giới hạn!');
      setTimeout(() => setAlertMsg(null), 2500);
      return;
    }
    setAddedItems([...addedItems, { ...item, id: `${item.id}-${Date.now()}` }]);
  };

  const handleSaveToCart = () => {
    onAddToCart({
      id: `custom-tank-${Date.now()}`,
      name: `Bể 3D: ${shapesVietnamese[tankShape]}`,
      price: totalPrice,
      isCustom: true,
      description: `Bể: ${shapesVietnamese[tankShape]} | Kệ: ${standsVietnamese[standStyle]} | ${addedItems.length} sinh vật`,
    });
    setAlertMsg('🎉 Đã thêm bể 3D vào giỏ hàng!');
    setTimeout(() => setAlertMsg(null), 3500);
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '12px', color: '#475569', marginBottom: '8px', display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px',
  };

  const optionBtnStyle = (active: boolean): React.CSSProperties => ({
    background: active ? 'linear-gradient(90deg, rgba(2,132,199,0.08), rgba(6,182,212,0.08))' : '#f8fafc',
    border: active ? '1.5px solid #0284c7' : '1.5px solid #e2e8f0',
    borderRadius: '12px',
    padding: '12px 16px',
    color: active ? '#0f172a' : '#475569',
    textAlign: 'left' as const,
    cursor: 'pointer',
    fontWeight: 600,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    transition: 'all 0.2s',
  });

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 72px)', overflow: 'hidden', padding: '40px 0 60px', background: '#f8fafc' }}>
      {/* Animated Aquatic Background */}
      <SplashCanvas interactive={false} />
      {/* Light overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 40%, rgba(248,250,252,0.6) 0%, rgba(248,250,252,0.92) 100%)', pointerEvents: 'none', zIndex: 2 }} />

      <div className="container" style={{ position: 'relative', zIndex: 5 }}>
        {/* Top Nav */}
        <div className="flex align-center justify-between" style={{ marginBottom: '28px' }}>
          <button onClick={onBackToStore} className="btn-secondary flex align-center gap-1" style={{ padding: '10px 18px', fontSize: '12px' }}>
            <ArrowLeft size={15} />
            <span>Cửa Hàng</span>
          </button>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2.5px', color: '#0284c7', fontWeight: 800 }}>
              AquaRealm Studio 3D
            </span>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', color: '#0f172a', marginTop: '2px' }}>
              Thiết Kế Bể Thủy Sinh Cá Nhân Hóa
            </h1>
          </div>
        </div>

        {/* Studio Layout */}
        <div className="grid grid-2 gap-4 align-center">
          {/* Left: Tank Viewport */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                position: 'relative',
                background: 'linear-gradient(135deg, #e0f2fe, #bae6fd, #0284c7)',
                borderRadius: '20px',
                border: '2px solid #0284c7',
                boxShadow: '0 12px 40px rgba(2,132,199,0.22)',
                overflow: 'hidden',
                height: '400px',
              }}
            >
              <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 20, background: 'rgba(255,255,255,0.88)', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(2,132,199,0.2)', fontWeight: 600 }}>
                <Compass size={12} />
                <span>Nhấp vào bể để thả thức ăn cho cá</span>
              </div>
              <div style={{ position: 'absolute', top: '14px', left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.8)', boxShadow: '0 0 10px rgba(255,255,255,1)', zIndex: 2 }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.08) 100%)', pointerEvents: 'none', zIndex: 10 }} />
              <canvas ref={canvasRef} onClick={handleCanvasClick} style={{ cursor: 'crosshair', zIndex: 5, display: 'block', width: '100%', height: '100%' }} />
            </div>

            {/* Stats Row */}
            <div
              className="glass-panel"
              style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', textAlign: 'center', gap: '0', background: 'rgba(255,255,255,0.9)', borderColor: 'rgba(2,132,199,0.14)' }}
            >
              {[
                { label: 'Kích Thước', value: tankShape === 'rectangle' ? '90×45×45cm' : tankShape === 'hexagon' ? '70×70×60cm' : '42×42×38cm' },
                { label: 'Dung Tích', value: tankShape === 'rectangle' ? '180 Lít' : tankShape === 'hexagon' ? '125 Lít' : '35 Lít' },
                { label: 'Sinh Vật', value: `${addedItems.length}/14` },
              ].map((stat, i) => (
                <div key={i} style={{ borderLeft: i > 0 ? '1px solid #e2e8f0' : 'none', padding: '0 12px' }}>
                  <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>{stat.label}</span>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: i === 2 ? '#0284c7' : '#0f172a', marginTop: '4px' }}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Config Panel */}
          <div className="glass-panel" style={{ padding: '28px', background: 'rgba(255,255,255,0.92)', borderColor: 'rgba(2,132,199,0.14)' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '22px' }}>
              {(['shape', 'background', 'items'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    flex: 1, background: 'transparent', border: 'none',
                    padding: '10px 4px',
                    color: activeTab === tab ? '#0284c7' : '#64748b',
                    fontWeight: 700, cursor: 'pointer', fontSize: '11px',
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                    borderBottom: activeTab === tab ? '2px solid #0284c7' : '2px solid transparent',
                    transition: 'all 0.25s',
                  }}
                >
                  {tab === 'shape' ? '1. Khung & Kệ' : tab === 'background' ? '2. Phông Nền' : '3. Cá & Decor'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'shape' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Kiểu dáng bể kính</label>
                  <select className="form-select" value={tankShape} onChange={(e) => setTankShape(e.target.value as any)}>
                    <option value="rectangle">Bể Chữ Nhật 90cm — 1.500.000đ</option>
                    <option value="hexagon">Bể Lục Giác Nghệ Thuật — 2.200.000đ</option>
                    <option value="bowl">Bể Tròn Mini — 950.000đ</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Kệ đỡ bể</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(['wood', 'metal', 'none'] as const).map((s) => (
                      <button key={s} onClick={() => setStandStyle(s)} style={optionBtnStyle(standStyle === s)}>
                        <span>{standsVietnamese[s]}</span>
                        <span style={{ color: '#0284c7', fontSize: '13px', fontWeight: 700 }}>
                          {s === 'none' ? 'Miễn phí' : `+${pricingData.stands[s].toLocaleString()}đ`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'background' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={labelStyle}>Hệ sinh thái phông nền</label>
                {(['deep-blue', 'amazon-forest', 'ancient-ruins'] as const).map((bg) => (
                  <button key={bg} onClick={() => setBackgroundTheme(bg)} style={optionBtnStyle(backgroundTheme === bg)}>
                    <div>
                      <span style={{ fontWeight: 700, display: 'block', fontSize: '13px', color: '#0f172a' }}>{backgroundsVietnamese[bg]}</span>
                      <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', display: 'block' }}>
                        {bg === 'deep-blue' ? 'Ánh sáng xanh đại dương huyền bí' : bg === 'amazon-forest' ? 'Rừng thủy sinh nhiệt đới xanh mướt' : 'Cổ trấn đổ nát chìm đáy nước'}
                      </span>
                    </div>
                    <span style={{ color: '#0284c7', fontWeight: 700, fontSize: '13px' }}>+{pricingData.backgrounds[bg].toLocaleString()}đ</span>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'items' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ maxHeight: '190px', overflowY: 'auto' }}>
                  <label style={labelStyle}>Chọn sinh vật & trang trí</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {availableItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleAddItem(item)}
                        style={{
                          background: '#f8fafc', border: '1px solid #e2e8f0',
                          borderRadius: '10px', padding: '8px 10px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '6px',
                          fontSize: '11px', fontWeight: 600, color: '#0f172a', textAlign: 'left', transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { (e.currentTarget).style.borderColor = '#0284c7'; (e.currentTarget).style.background = 'rgba(2,132,199,0.05)'; }}
                        onMouseLeave={e => { (e.currentTarget).style.borderColor = '#e2e8f0'; (e.currentTarget).style.background = '#f8fafc'; }}
                      >
                        {item.type === 'fish' ? <FishIcon size={13} color="#d97706" /> : <Layers size={13} color="#059669" />}
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                          <span style={{ color: '#64748b', fontSize: '10px' }}>{item.price.toLocaleString()}đ</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                {addedItems.length > 0 && (
                  <div style={{ background: '#f1f5f9', borderRadius: '10px', padding: '10px', maxHeight: '80px', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {addedItems.map((item, idx) => (
                        <span key={item.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '3px 10px', fontSize: '10px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          {item.name}
                          <button onClick={() => { const next = [...addedItems]; next.splice(idx, 1); setAddedItems(next); }} style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', fontWeight: 'bold', lineHeight: 1 }}>×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Budget */}
            <div style={{ marginTop: '22px', paddingTop: '18px', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#475569', fontSize: '14px', fontWeight: 600 }}>Tổng ước tính:</span>
                <span style={{ fontSize: '22px', fontWeight: 800, color: '#0284c7' }}>{totalPrice.toLocaleString()}đ</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button onClick={() => setAddedItems([])} className="btn-secondary" style={{ padding: '12px', width: '46px', borderRadius: '10px', display: 'flex', justifyContent: 'center' }}>
                <RefreshCw size={15} />
              </button>
              <button onClick={handleSaveToCart} className="btn-primary flex align-center justify-center gap-2" style={{ flex: 1, borderRadius: '10px', padding: '12px', display: 'flex' }}>
                <ShoppingCart size={15} />
                <span>Thêm vào Giỏ Hàng</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {alertMsg && (
        <div className="glass-panel pulse-glow" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, padding: '14px 22px', color: '#0f172a', fontWeight: 600, fontSize: '14px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.95)', borderColor: 'rgba(2,132,199,0.3)' }}>
          <Sparkles size={17} color="#0284c7" />
          <span>{alertMsg}</span>
        </div>
      )}
    </div>
  );
};
