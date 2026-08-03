import { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { Navbar } from './components/Navbar';
import { AquariumStudioPage } from './components/AquariumStudioPage';
import { ProductCatalog } from './components/ProductCatalog';
import type { Product } from './components/ProductCatalog';
import { Footer } from './components/Footer';
import { SplashCanvas } from './components/SplashCanvas';
import {
  Sparkles, Trash2, X, ShieldCheck, Award, ArrowRight,
  Fish, Layers, Leaf, Wrench, Star, Truck, RotateCcw, Headphones, Compass
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  description: string;
  quantity: number;
  isCustom?: boolean;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [pageView, setPageView] = useState<'store' | 'studio'>('store');
  const [activeSection, setActiveSection] = useState('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const handleNavigate = (target: string) => {
    if (target === 'customizer') {
      setPageView('studio');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setPageView('store');
      setActiveSection(target);
      setTimeout(() => {
        const el = document.getElementById(target);
        if (el) {
          window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 72, behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
    }
  };

  const handleAddToCart = (product: Product | any) => {
    setCart((prev) => {
      if (product.isCustom) return [...prev, { ...product, quantity: 1 }];
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image, description: product.description, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));
  const handleUpdateQuantity = (id: string, qty: number) => {
    if (qty <= 0) { handleRemoveFromCart(id); return; }
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, quantity: qty } : i));
  };

  const handleCheckout = () => {
    setCheckoutSuccess(true);
    setTimeout(() => { setCart([]); setIsCartOpen(false); setCheckoutSuccess(false); }, 3200);
  };

  const cartTotal = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  if (showSplash) return <SplashScreen onEnter={() => setShowSplash(false)} />;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      {/* Navbar Header */}
      <Navbar cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} onNavigate={handleNavigate} activeSection={activeSection} pageView={pageView} />

      <main style={{ marginTop: '72px', flex: 1 }}>
        {pageView === 'studio' ? (
          /* DEDICATED 3D STUDIO PAGE */
          <AquariumStudioPage onAddToCart={handleAddToCart} onBackToStore={() => handleNavigate('home')} />
        ) : (
          /* STORE MAIN PAGE */
          <>
            {/* HERO SECTION WITH ENLARGED 3D STAGE & FLOATING BUBBLES */}
            <section id="home" className="ocean-ambient" style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', padding: '60px 0', position: 'relative', overflow: 'hidden' }}>
              <div className="container" style={{ position: 'relative', zIndex: 5 }}>
                <div className="grid grid-2 gap-4 align-center">
                  
                  {/* Left Hero Title & Description */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(2,132,199,0.1)', border: '1px solid rgba(2,132,199,0.28)', padding: '7px 18px', borderRadius: '30px', width: 'fit-content' }}>
                      <Sparkles size={14} color="#0284c7" />
                      <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px', color: '#0284c7' }}>
                        Boutique Aquarium & Aquascaping 3D
                      </span>
                    </div>

                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5.5vw, 4.6rem)', lineHeight: 1.12, fontWeight: 700, color: '#0f172a' }}>
                      Mang Cả <span style={{ color: '#0284c7', textShadow: '0 0 20px rgba(2,132,199,0.2)' }}>Đại Dương</span> Vào Không Gian Sống
                    </h1>

                    <p style={{ color: '#475569', fontSize: 'clamp(15px, 2.2vw, 17px)', lineHeight: 1.7, maxWidth: '520px' }}>
                      AquaRealm cung cấp cá cảnh nhập khẩu cao cấp, bể kính nghệ thuật và <strong>Phòng Studio 3D độc quyền</strong> để bạn tự phối lắp ghép hồ cá tương tác bơi lội với bong bóng nổi chân thật.
                    </p>

                    <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                      <button onClick={() => handleNavigate('customizer')} className="btn-primary flex align-center gap-2" style={{ padding: '15px 30px', fontSize: '14px' }}>
                        <span>Vào Studio 3D Ngay</span>
                        <ArrowRight size={16} />
                      </button>
                      <button onClick={() => handleNavigate('shop')} className="btn-secondary" style={{ padding: '14px 28px', fontSize: '14px' }}>
                        Khám Phá Cửa Hàng
                      </button>
                    </div>

                    {/* Trust Row */}
                    <div style={{ display: 'flex', gap: '22px', flexWrap: 'wrap', paddingTop: '22px', borderTop: '1px solid rgba(2,132,199,0.14)', marginTop: '6px' }}>
                      {[
                        { icon: <ShieldCheck size={18} color="#059669" />, text: 'Bảo hành cá sống 7 ngày' },
                        { icon: <Award size={18} color="#d97706" />, text: 'Nhập khẩu chuẩn CITES' },
                        { icon: <Truck size={18} color="#0284c7" />, text: 'Giao hàng hỏa tốc 24h' },
                      ].map((trust, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {trust.icon}
                          <span style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>{trust.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Hero Stage (ENLARGED 3D CINEMATIC VIEWPORT) */}
                  <div className="float-animation" style={{ position: 'relative' }}>
                    <div
                      className="glass-panel"
                      style={{
                        borderRadius: '28px',
                        overflow: 'hidden',
                        padding: '10px',
                        borderWidth: '2.5px',
                        borderColor: '#0284c7',
                        background: '#ffffff',
                        boxShadow: '0 24px 60px rgba(2, 132, 199, 0.28)',
                      }}
                    >
                      {/* Large Interactive 2.5D Aquarium Stage (Height: 460px) */}
                      <div
                        style={{
                          position: 'relative',
                          width: '100%',
                          height: '460px',
                          borderRadius: '22px',
                          overflow: 'hidden',
                          background: 'linear-gradient(135deg, #e0f2fe, #bae6fd, #0284c7)',
                        }}
                      >
                        {/* Live Canvas Engine with Ambient Bubbles & Realistic Swimming Fish */}
                        <SplashCanvas interactive={true} />

                        {/* Top Stage Tag */}
                        <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 10, background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(10px)', border: '1px solid rgba(2, 132, 199, 0.3)', padding: '8px 16px', borderRadius: '24px', fontSize: '12px', fontWeight: 700, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(15,23,42,0.08)' }}>
                          <Compass size={14} />
                          <span>Bể Thủy Sinh 3D — Bấm để tương tác thả thức ăn</span>
                        </div>

                        {/* Glass shine reflections */}
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.12) 100%)', pointerEvents: 'none', zIndex: 9 }} />
                      </div>
                    </div>

                    {/* Floating Badges */}
                    <div style={{ position: 'absolute', bottom: '-18px', left: '24px', background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(14px)', border: '1px solid rgba(2,132,199,0.25)', borderRadius: '16px', padding: '14px 20px', boxShadow: '0 10px 30px rgba(15,23,42,0.12)', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 20 }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg,#0284c7,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(2,132,199,0.3)' }}>
                        <Fish size={20} color="white" />
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Mô Phỏng 3D Thủy Sinh</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Hồ Biotope Nature 180L</div>
                      </div>
                    </div>

                    <div style={{ position: 'absolute', top: '-18px', right: '24px', background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(14px)', border: '1px solid rgba(217,119,6,0.3)', borderRadius: '16px', padding: '12px 18px', boxShadow: '0 8px 26px rgba(15,23,42,0.08)', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 20 }}>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} fill="#d97706" color="#d97706" />)}
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>4.9/5 (2,400+ Khách Hàng)</span>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* CATEGORIES SECTION */}
            <section style={{ padding: '76px 0', background: '#ffffff' }}>
              <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                  <span style={{ textTransform: 'uppercase', fontSize: '11px', letterSpacing: '3px', color: '#0284c7', fontWeight: 800, display: 'block', marginBottom: '8px' }}>Danh Mục</span>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 3.5vw, 36px)', color: '#0f172a' }}>Khám Phá Thế Giới Thủy Sinh</h2>
                </div>
                <div className="grid grid-4 gap-3">
                  {[
                    { label: 'Cá Cảnh', icon: <Fish size={28} />, desc: 'Hàng trăm loài cá nhập khẩu', color: '#0284c7', bg: 'rgba(2,132,199,0.08)' },
                    { label: 'Bể Kính', icon: <Layers size={28} />, desc: 'Bể siêu trong nhiều kiểu dáng', color: '#059669', bg: 'rgba(5,150,105,0.08)' },
                    { label: 'Cây & Lũa', icon: <Leaf size={28} />, desc: 'Cây thủy sinh & lũa tự nhiên', color: '#d97706', bg: 'rgba(217,119,6,0.08)' },
                    { label: 'Thiết Bị', icon: <Wrench size={28} />, desc: 'Lọc, đèn, CO2 chuyên dụng', color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
                  ].map((cat) => (
                    <div
                      key={cat.label}
                      className="glass-panel"
                      style={{ padding: '24px', cursor: 'pointer', borderRadius: '18px', border: '1px solid rgba(15,23,42,0.06)', background: '#ffffff', transition: 'all 0.3s' }}
                      onClick={() => handleNavigate('shop')}
                    >
                      <div style={{ width: '54px', height: '54px', borderRadius: '16px', background: cat.bg, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                        {cat.icon}
                      </div>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '6px', fontFamily: 'var(--font-body)' }}>{cat.label}</h3>
                      <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>{cat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* PRODUCT CATALOG */}
            <ProductCatalog onAddToCart={handleAddToCart} />

            {/* 3D STUDIO CTA SECTION */}
            <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(2,132,199,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                <span style={{ textTransform: 'uppercase', fontSize: '11px', letterSpacing: '3px', color: '#38bdf8', fontWeight: 800, display: 'block', marginBottom: '12px' }}>Tính Năng Đặc Biệt</span>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(26px, 4vw, 42px)', color: '#f8fafc', marginBottom: '14px' }}>
                  Phòng Studio 3D Thiết Kế Hồ Cá
                </h2>
                <p style={{ color: '#94a3b8', maxWidth: '580px', margin: '0 auto 32px', fontSize: '15px', lineHeight: 1.7 }}>
                  Chọn bể kính, thả cá yêu thích, bố trí lũa đá và xem trực tiếp đàn cá bơi lội trong không gian 3D. Nhấp vào màn hình để thả thức ăn cho cá!
                </p>
                <button onClick={() => handleNavigate('customizer')} className="btn-primary flex align-center gap-2" style={{ margin: '0 auto', display: 'inline-flex', padding: '16px 32px', fontSize: '14px' }}>
                  <Sparkles size={17} />
                  <span>Vào Phòng Studio 3D Ngay</span>
                </button>
              </div>
            </section>

            {/* SERVICES SECTION */}
            <section id="services" style={{ padding: '80px 0', background: '#f8fafc' }}>
              <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                  <span style={{ textTransform: 'uppercase', fontSize: '11px', letterSpacing: '3px', color: '#0284c7', fontWeight: 800, display: 'block', marginBottom: '8px' }}>Dịch Vụ</span>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 3.5vw, 36px)', color: '#0f172a', marginBottom: '12px' }}>Setup & Chăm Sóc Trọn Gói</h2>
                  <p style={{ color: '#64748b', maxWidth: '540px', margin: '0 auto', fontSize: '14px', lineHeight: 1.6 }}>
                    Đội ngũ nghệ nhân thủy sinh 10 năm kinh nghiệm đồng hành cùng bạn từ bản vẽ đến vận hành hoàn chỉnh.
                  </p>
                </div>
                <div className="grid grid-3 gap-3">
                  {[
                    { title: 'Setup Bể Nature Aquascape', desc: 'Thi công bố cục rừng, hồ đá Iwagumi, Biotope sông tự nhiên. Lên bản vẽ 3D trước khi thi công thực tế.', price: 'Từ 2.500.000đ', color: '#0284c7', icon: <Leaf size={24} color="#0284c7" /> },
                    { title: 'Lắp Đặt Bể Cá Rồng / Koi', desc: 'Hệ thống kính ghép keo giấu đường chỉ, lọc tràn dưới Matrix đa tầng, kiểm soát nước thông minh.', price: 'Từ 5.000.000đ', color: '#059669', icon: <Fish size={24} color="#059669" /> },
                    { title: 'Bảo Dưỡng Bể Định Kỳ', desc: 'Kiểm tra pH/NO2/NO3, cạo rêu hại, cắt cây thủy sinh, châm vi sinh và thay nước chuẩn quy trình.', price: 'Từ 300.000đ/lần', color: '#d97706', icon: <Wrench size={24} color="#d97706" /> },
                  ].map((svc, i) => (
                    <div key={i} className="glass-panel" style={{ padding: '28px', borderRadius: '20px', border: '1px solid rgba(15,23,42,0.07)', background: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(2,132,199,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                          {svc.icon}
                        </div>
                        <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>{svc.title}</h3>
                        <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, marginBottom: '20px' }}>{svc.desc}</p>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: svc.color }}>{svc.price}</span>
                        <button
                          className="btn-secondary"
                          style={{ padding: '8px 16px', fontSize: '12px' }}
                          onClick={() => alert(`Liên hệ tư vấn: ${svc.title}`)}
                        >
                          Đặt Lịch
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* TESTIMONIALS */}
            <section style={{ padding: '80px 0', background: '#ffffff' }}>
              <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                  <span style={{ textTransform: 'uppercase', fontSize: '11px', letterSpacing: '3px', color: '#0284c7', fontWeight: 800, display: 'block', marginBottom: '8px' }}>Đánh Giá</span>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 3.5vw, 34px)', color: '#0f172a' }}>Khách Hàng Nói Gì Về Chúng Tôi</h2>
                </div>
                <div className="grid grid-3 gap-3">
                  {[
                    { name: 'Anh Minh Tuấn', role: 'Khách mua bể 180L', stars: 5, comment: 'Bể kính trong suốt không có đường chỉ keo, cá Rồng Kim Long sống rất khỏe sau 2 tuần nhận hàng. Đội setup nhanh và gọn gàng lắm!', avatar: 'MT' },
                    { name: 'Chị Lan Anh', role: 'Dùng Studio 3D', stars: 5, comment: 'Tính năng Studio 3D thả cá và nhấp chuột thả thức ăn cho cá cực kỳ thú vị! Tôi đã ngồi thiết kế bể đến 2 giờ sáng mà không chán.', avatar: 'LA' },
                    { name: 'Anh Phúc Nguyên', role: 'Khách bảo dưỡng định kỳ', stars: 5, comment: 'Dịch vụ vệ sinh bể rất chuyên nghiệp, đúng giờ hẹn, kỹ thuật viên còn tư vấn thêm cách phòng bệnh cho cá miễn phí. Rất hài lòng!', avatar: 'PN' },
                  ].map((review, i) => (
                    <div key={i} className="glass-panel" style={{ padding: '24px', borderRadius: '18px', border: '1px solid rgba(15,23,42,0.07)', background: '#ffffff' }}>
                      <div style={{ display: 'flex', gap: '3px', marginBottom: '14px' }}>
                        {Array.from({ length: review.stars }).map((_, j) => <Star key={j} size={14} fill="#d97706" color="#d97706" />)}
                      </div>
                      <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.7, marginBottom: '18px', fontStyle: 'italic' }}>
                        "{review.comment}"
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #0284c7, #06b6d4)', color: '#fff', fontWeight: 800, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {review.avatar}
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{review.name}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>{review.role}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* TRUST STRIP */}
            <section style={{ padding: '40px 0', background: 'linear-gradient(90deg, #e0f2fe, #f0fdf4, #fef9ee)' }}>
              <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '28px' }}>
                  {[
                    { icon: <ShieldCheck size={26} color="#059669" />, title: 'Bảo Hành 7 Ngày', sub: 'Cá sống khoẻ, cam kết đổi trả' },
                    { icon: <Truck size={26} color="#0284c7" />, title: 'Ship Toàn Quốc', sub: 'Đóng gói oxy chuyên dụng 24h' },
                    { icon: <RotateCcw size={26} color="#d97706" />, title: 'Đổi Trả Dễ Dàng', sub: '7 ngày không cần lý do' },
                    { icon: <Headphones size={26} color="#7c3aed" />, title: 'Tư Vấn 24/7', sub: 'Hỗ trợ kỹ thuật miễn phí mãi mãi' },
                  ].map((t, i) => (
                    <div key={i} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      {t.icon}
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{t.title}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{t.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />

      {/* SHOPPING CART DRAWER */}
      {isCartOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)', zIndex: 99999, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ flex: 1 }} onClick={() => setIsCartOpen(false)} />
          <div style={{ width: '100%', maxWidth: '460px', height: '100%', background: '#ffffff', borderLeft: '1px solid rgba(2,132,199,0.14)', display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 40px rgba(15,23,42,0.1)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', color: '#0f172a' }}>Giỏ Hàng ({cartCount})</h3>
              <button onClick={() => setIsCartOpen(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} color="#475569" />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              {checkoutSuccess && (
                <div style={{ background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.3)', borderRadius: '12px', padding: '16px', textAlign: 'center', color: '#065f46', fontWeight: 600, marginBottom: '16px', fontSize: '14px' }}>
                  🎉 Đặt hàng thành công! Chúng tôi sẽ liên hệ sớm.
                </div>
              )}
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
                  <p style={{ fontSize: '14px', marginBottom: '16px' }}>Giỏ hàng của bạn đang trống</p>
                  <button onClick={() => { setIsCartOpen(false); handleNavigate('shop'); }} className="btn-secondary" style={{ fontSize: '12px', padding: '10px 20px' }}>
                    Tiếp tục mua sắm
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {cart.map((item) => (
                    <div key={item.id} style={{ display: 'flex', gap: '12px', padding: '14px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} style={{ width: '68px', height: '68px', objectFit: 'cover', borderRadius: '10px' }} />
                      ) : (
                        <div style={{ width: '68px', height: '68px', borderRadius: '10px', background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Sparkles size={22} color="#0284c7" />
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>{item.name}</h4>
                        <span style={{ fontSize: '12px', color: '#0284c7', fontWeight: 700, display: 'block', marginTop: '4px' }}>{item.price.toLocaleString()}đ</span>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                            <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} style={{ background: '#f8fafc', border: 'none', width: '28px', height: '28px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#475569' }}>−</button>
                            <span style={{ padding: '0 10px', fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{item.quantity}</span>
                            <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} style={{ background: '#f8fafc', border: 'none', width: '28px', height: '28px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#475569' }}>+</button>
                          </div>
                          <button onClick={() => handleRemoveFromCart(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f43f5e' }}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ padding: '20px', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ color: '#475569', fontSize: '14px', fontWeight: 600 }}>Tổng đơn:</span>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{cartTotal.toLocaleString()}đ</span>
                </div>
                <button onClick={handleCheckout} className="btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '14px' }}>
                  Xác Nhận Đặt Hàng — COD
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
