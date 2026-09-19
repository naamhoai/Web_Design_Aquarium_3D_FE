import { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { Navbar } from './components/Navbar';
import { HeroCinematic } from './components/HeroCinematic';
import { AquariumCustomizer } from './components/AquariumCustomizer';
import { ProductCatalog } from './components/ProductCatalog';
import type { Product } from './components/ProductCatalog';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { TelemetryModal } from './components/TelemetryModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { api, authStorage } from './services/api';
import type { UserProfile, OrderResponseData } from './services/api';
import {
  Sparkles, Trash2, X, ShieldCheck, ArrowRight,
  Fish, Layers, Leaf, Wrench, Star, Truck, RotateCcw, Headphones
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
  // Intro Splash screen:
  // Shows ONLY on initial site entry.
  // When reloading (F5), sessionStorage persists -> DOES NOT show.
  // When user closes the browser/tab and opens again -> sessionStorage is cleared -> Shows again!
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return sessionStorage.getItem('aquarium_intro_seen') !== 'true';
    } catch {
      return true;
    }
  });

  const handleEnterSite = () => {
    try {
      sessionStorage.setItem('aquarium_intro_seen', 'true');
    } catch {}
    setShowSplash(false);
  };

  const [pageView, setPageView] = useState<'store' | 'studio'>('store');
  const [activeSection, setActiveSection] = useState('home');
  const [isHeroExploded, setIsHeroExploded] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<OrderResponseData | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => authStorage.getUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);
  const [sharedDesign, setSharedDesign] = useState<any>(null);

  // Check if visitor opened a shared 3D design link: ?design=design-xxxx
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const slug = params.get('design');
      if (slug) {
        api.getDesignBySlug(slug).then((data) => {
          if (data) {
            setSharedDesign(data);
            setPageView('studio');
            setShowSplash(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        });
      }
    } catch (e) {
      console.warn('Failed to parse URL query:', e);
    }
  }, []);

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
  };

  const handleNavigate = (target: string) => {
    if (target === 'customizer') {
      setPageView('studio');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'exploded') {
      setPageView('store');
      setIsHeroExploded(true);
      setActiveSection('exploded');
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
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: OrderResponseData) => {
    setCart([]);
    setCreatedOrder(order);
    setIsOrderSuccessOpen(true);
  };

  const cartTotal = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  if (showSplash) return <SplashScreen onEnter={handleEnterSite} />;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#070a0f', color: '#f8fafc' }}>
      {/* Navbar Header */}
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        onNavigate={handleNavigate}
        activeSection={activeSection}
        pageView={pageView}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenTelemetry={() => setIsTelemetryOpen(true)}
      />

      <main style={{ marginTop: '72px', flex: 1 }}>
        {pageView === 'studio' ? (
          /* DEDICATED 3D STUDIO PAGE */
          <AquariumCustomizer
            onAddToCart={handleAddToCart}
            onBackToStore={() => handleNavigate('home')}
            initialDesign={sharedDesign}
          />
        ) : (
          /* STORE MAIN PAGE */
          <>
            {/* CINEMATIC HERO SHOWCASE (Instant 360° Tank with Click-to-Explode & Layer Hotspots) */}
            <HeroCinematic
              onOpenCustomizer={() => handleNavigate('customizer')}
              onAddToCart={handleAddToCart}
              isExplodedExternal={isHeroExploded}
              onExplodeChange={setIsHeroExploded}
            />

            {/* CATEGORIES SECTION */}
            <section style={{ padding: '80px 0', background: '#080d16', borderTop: '1px solid rgba(56, 189, 248, 0.08)' }}>
              <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                  <span style={{ textTransform: 'uppercase', fontSize: '11px', letterSpacing: '3px', color: '#06b6d4', fontWeight: 800, display: 'block', marginBottom: '8px' }}>
                    Danh Mục Hệ Sinh Thái
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 3.5vw, 38px)', color: '#f8fafc' }}>
                    Khám Phá Thế Giới Thủy Sinh Hiện Đại
                  </h2>
                </div>
                <div className="grid grid-4 gap-3">
                  {[
                    { label: 'Cá Cảnh & Đàn Neon', icon: <Fish size={28} />, desc: 'Cá Neon dạ quang, Koi Kohaku, Betta Halfmoon', color: '#38bdf8', bg: 'rgba(56,189,248,0.12)' },
                    { label: 'Bể Kính Studio', icon: <Layers size={28} />, desc: 'Bể siêu trong Opti-White vát cạnh giấu keo', color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
                    { label: 'Lũa Bonsai & Cây', icon: <Leaf size={28} />, desc: 'Lũa nghệ thuật đính rêu Taiwan, nền ADA', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
                    { label: 'Hệ Thiết Bị Modular', icon: <Wrench size={28} />, desc: 'Đèn cantilever, lọc ngầm Silent-Flow', color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
                  ].map((cat) => (
                    <div
                      key={cat.label}
                      style={{
                        padding: '26px',
                        cursor: 'pointer',
                        borderRadius: '20px',
                        border: '1px solid rgba(56, 189, 248, 0.12)',
                        background: 'rgba(15, 23, 42, 0.72)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                      }}
                      onClick={() => handleNavigate('shop')}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.12)';
                      }}
                    >
                      <div style={{ width: '54px', height: '54px', borderRadius: '16px', background: cat.bg, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                        {cat.icon}
                      </div>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#f8fafc', marginBottom: '8px', fontFamily: 'var(--font-body)' }}>{cat.label}</h3>
                      <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>{cat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* PRODUCT CATALOG (DARK LUXURY THEME) */}
            <ProductCatalog onAddToCart={handleAddToCart} />

            {/* 3D STUDIO CTA SECTION */}
            <section style={{ padding: '90px 0', background: 'linear-gradient(135deg, #050b14 0%, #0c182a 50%, #050b14 100%)', position: 'relative', overflow: 'hidden', borderTop: '1px solid rgba(56, 189, 248, 0.1)' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(6,182,212,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                <span style={{ textTransform: 'uppercase', fontSize: '11px', letterSpacing: '3px', color: '#06b6d4', fontWeight: 800, display: 'block', marginBottom: '12px' }}>
                  Phòng Thí Nghiệm Số Độc Quyền
                </span>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(26px, 4vw, 44px)', color: '#f8fafc', marginBottom: '16px', fontWeight: 800 }}>
                  Studio 3D Phối Cảnh & Mô Phỏng Thủy Sinh
                </h2>
                <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0 auto 36px', fontSize: '15px', lineHeight: 1.7 }}>
                  Chọn kích thước bể, thả đàn cá Koi / Neon, phối lũa đá và xem sinh vật bơi lội với chuyển động uốn sóng 3D chân thật. Thả thức ăn tương tác trực tiếp trên màn hình!
                </p>
                <button
                  onClick={() => handleNavigate('customizer')}
                  className="btn-primary flex align-center gap-2"
                  style={{
                    margin: '0 auto',
                    display: 'inline-flex',
                    padding: '16px 36px',
                    fontSize: '15px',
                    borderRadius: '30px',
                    boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)',
                  }}
                >
                  <Sparkles size={18} />
                  <span>Khởi Động Phòng Studio 3D Ngay</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </section>

            {/* SERVICES SECTION */}
            <section id="services" style={{ padding: '90px 0', background: '#080d16', borderTop: '1px solid rgba(56, 189, 248, 0.08)' }}>
              <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '52px' }}>
                  <span style={{ textTransform: 'uppercase', fontSize: '11px', letterSpacing: '3px', color: '#06b6d4', fontWeight: 800, display: 'block', marginBottom: '8px' }}>
                    Dịch Vụ Chuyên Nghiệp
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 3.5vw, 38px)', color: '#f8fafc', marginBottom: '12px' }}>
                    Setup & Chăm Sóc Trọn Gói Tận Nơi
                  </h2>
                  <p style={{ color: '#94a3b8', maxWidth: '540px', margin: '0 auto', fontSize: '14px', lineHeight: 1.6 }}>
                    Đội ngũ nghệ nhân thủy sinh đồng hành cùng bạn từ bản vẽ 3D đến vận hành ổn định lâu dài.
                  </p>
                </div>
                <div className="grid grid-3 gap-3">
                  {[
                    { title: 'Setup Nano Cube & Aquascape', desc: 'Bố cục phong cách ADA, lũa bonsai kết hợp rêu Taiwan, cân bằng hệ vi sinh hoàn chỉnh trước khi bàn giao.', price: 'Từ 2.500.000đ', color: '#06b6d4', icon: <Leaf size={24} color="#06b6d4" /> },
                    { title: 'Lắp Đặt Hệ Thống Bóc Tách Modular', desc: 'Thi công hệ thống lọc ngầm Silent-Flow, đèn cantilever chuẩn studio, giấu toàn bộ dây dẫn thẩm mỹ.', price: 'Từ 4.800.000đ', color: '#38bdf8', icon: <Fish size={24} color="#38bdf8" /> },
                    { title: 'Bảo Dưỡng Hệ Sinh Thái Định Kỳ', desc: 'Đo thông số nước TDS/pH/NO2, tỉa rêu bonsai, vệ sinh buồng lọc ngầm và kiểm tra sức khỏe đàn cá.', price: 'Từ 350.000đ/lần', color: '#f59e0b', icon: <Wrench size={24} color="#f59e0b" /> },
                  ].map((svc, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '30px',
                        borderRadius: '20px',
                        border: '1px solid rgba(56, 189, 248, 0.12)',
                        background: 'rgba(15, 23, 42, 0.72)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(6, 182, 212, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                          {svc.icon}
                        </div>
                        <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#f8fafc', marginBottom: '12px' }}>{svc.title}</h3>
                        <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '22px' }}>{svc.desc}</p>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '18px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: svc.color }}>{svc.price}</span>
                        <button
                          className="btn-secondary"
                          style={{
                            padding: '8px 18px',
                            fontSize: '12px',
                            background: 'rgba(6, 182, 212, 0.12)',
                            borderColor: 'rgba(6, 182, 212, 0.3)',
                            color: '#38bdf8',
                          }}
                          onClick={() => alert(`Liên hệ tư vấn dịch vụ: ${svc.title}`)}
                        >
                          Đặt Lịch Tư Vấn
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* TESTIMONIALS */}
            <section style={{ padding: '90px 0', background: '#070c14' }}>
              <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                  <span style={{ textTransform: 'uppercase', fontSize: '11px', letterSpacing: '3px', color: '#06b6d4', fontWeight: 800, display: 'block', marginBottom: '8px' }}>
                    Phản Hồi Trải Nghiệm
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 3.5vw, 36px)', color: '#f8fafc' }}>
                    Khách Hàng Nói Gì Về AquaRealm
                  </h2>
                </div>
                <div className="grid grid-3 gap-3">
                  {[
                    { name: 'Anh Minh Tuấn', role: 'Khách mua bể Nano Studio 30cm', stars: 5, comment: 'Bể xoay 360 độ trên web giống hệt ngoài thực tế! Kính siêu trong vát cạnh sắc nét, hệ lọc ngầm chạy cực kỳ êm không một tiếng động.', avatar: 'MT' },
                    { name: 'Chị Lan Anh', role: 'Thiết kế Studio 3D', stars: 5, comment: 'Trải nghiệm bóc tách mô-đun 360 độ quá trực quan! Mình xem rõ từng tầng từ đèn LED, lũa bonsai đến đáy lọc trước khi quyết định đặt trọn gói.', avatar: 'LA' },
                    { name: 'Anh Phúc Nguyên', role: 'Khách bảo dưỡng định kỳ', stars: 5, comment: 'Đội ngũ kỹ thuật viên cực kỳ tâm huyết, hướng dẫn chi tiết cách kiểm tra nước và duy trì rêu bonsai xanh mướt. Rất an tâm!', avatar: 'PN' },
                  ].map((review, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '26px',
                        borderRadius: '20px',
                        border: '1px solid rgba(56, 189, 248, 0.1)',
                        background: 'rgba(15, 23, 42, 0.65)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '3px', marginBottom: '14px' }}>
                        {Array.from({ length: review.stars }).map((_, j) => <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />)}
                      </div>
                      <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.7, marginBottom: '20px', fontStyle: 'italic' }}>
                        "{review.comment}"
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', color: '#fff', fontWeight: 800, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {review.avatar}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc' }}>{review.name}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>{review.role}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* TRUST STRIP */}
            <section style={{ padding: '44px 0', background: 'linear-gradient(90deg, #050b14, #0b1524, #050b14)', borderTop: '1px solid rgba(56, 189, 248, 0.1)' }}>
              <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '28px' }}>
                  {[
                    { icon: <ShieldCheck size={26} color="#10b981" />, title: 'Bảo Hành 7 Ngày', sub: 'Cá sống khỏe, cam kết đổi trả 100%' },
                    { icon: <Truck size={26} color="#06b6d4" />, title: 'Ship Toàn Quốc', sub: 'Đóng gói oxy chuyên dụng 24h hỏa tốc' },
                    { icon: <RotateCcw size={26} color="#f59e0b" />, title: 'Kiểm Tra Trước Khi Nhận', sub: 'Được quay clip mở hộp tận tay' },
                    { icon: <Headphones size={26} color="#a855f7" />, title: 'Hỗ Trợ Kỹ Thuật 24/7', sub: 'Tư vấn bảo dưỡng hệ sinh thái trọn đời' },
                  ].map((t, i) => (
                    <div key={i} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      {t.icon}
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc' }}>{t.title}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>{t.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />

      {/* SHOPPING CART DRAWER (DARK LUXURY GLASS) */}
      {isCartOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(6px)', zIndex: 99999, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ flex: 1 }} onClick={() => setIsCartOpen(false)} />
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              height: '100%',
              background: '#0c1322',
              borderLeft: '1px solid rgba(56, 189, 248, 0.18)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 50px rgba(0, 0, 0, 0.6)',
            }}
          >
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', color: '#f8fafc', fontWeight: 800 }}>
                Giỏ Hàng ({cartCount})
              </h3>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '18px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '56px 0', color: '#64748b' }}>
                  <p style={{ fontSize: '14px', marginBottom: '18px' }}>Giỏ hàng của bạn đang trống</p>
                  <button
                    onClick={() => { setIsCartOpen(false); handleNavigate('shop'); }}
                    className="btn-secondary"
                    style={{ fontSize: '12px', padding: '10px 22px', background: 'rgba(6, 182, 212, 0.1)', borderColor: 'rgba(6, 182, 212, 0.3)', color: '#38bdf8' }}
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '14px',
                        borderRadius: '14px',
                        background: 'rgba(15, 23, 42, 0.75)',
                        border: '1px solid rgba(56, 189, 248, 0.12)',
                      }}
                    >
                      {item.image ? (
                        <img src={item.image} alt={item.name} style={{ width: '68px', height: '68px', objectFit: 'cover', borderRadius: '10px' }} />
                      ) : (
                        <div style={{ width: '68px', height: '68px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(37,99,235,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(56,189,248,0.2)' }}>
                          <Sparkles size={22} color="#38bdf8" />
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', lineHeight: 1.3 }}>{item.name}</h4>
                        <span style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 800, display: 'block', marginTop: '4px' }}>
                          {item.price.toLocaleString()}đ
                        </span>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px', overflow: 'hidden' }}>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              style={{ background: 'rgba(255,255,255,0.05)', border: 'none', width: '28px', height: '28px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#cbd5e1' }}
                            >
                              −
                            </button>
                            <span style={{ padding: '0 10px', fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              style={{ background: 'rgba(255,255,255,0.05)', border: 'none', width: '28px', height: '28px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#cbd5e1' }}
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f43f5e' }}
                            title="Xóa"
                          >
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
              <div style={{ padding: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 600 }}>Tổng thanh toán:</span>
                  <span style={{ fontSize: '22px', fontWeight: 800, color: '#38bdf8' }}>{cartTotal.toLocaleString()}đ</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="btn-primary"
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '14px', fontWeight: 700 }}
                >
                  Xác Nhận Đặt Hàng — Giao Hàng Toàn Quốc
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(user) => setCurrentUser(user)}
      />

      {/* Real-Time Microservices Telemetry Modal */}
      <TelemetryModal
        isOpen={isTelemetryOpen}
        onClose={() => setIsTelemetryOpen(false)}
        currentUser={currentUser}
      />

      {/* Checkout Modal (Order Service :8086 & Inventory Service :8085) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        cartTotal={cartTotal}
        currentUser={currentUser}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Success & VietQR Modal */}
      <OrderSuccessModal
        isOpen={isOrderSuccessOpen}
        onClose={() => setIsOrderSuccessOpen(false)}
        order={createdOrder}
        onOpenTelemetry={() => setIsTelemetryOpen(true)}
      />
    </div>
  );
}
