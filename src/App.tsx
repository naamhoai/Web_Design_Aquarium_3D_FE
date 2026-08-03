import { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { Navbar } from './components/Navbar';
import { AquariumStudioPage } from './components/AquariumStudioPage';
import { ProductCatalog } from './components/ProductCatalog';
import type { Product } from './components/ProductCatalog';
import { Footer } from './components/Footer';
import { Sparkles, Trash2, X, ShieldCheck, Heart, Award, ArrowRight } from 'lucide-react';

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

  // Navigation Routing
  const handleNavigate = (target: string) => {
    if (target === 'customizer') {
      setPageView('studio');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setPageView('store');
      setActiveSection(target);
      setTimeout(() => {
        const element = document.getElementById(target);
        if (element) {
          const headerOffset = 76;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product | any) => {
    setCart((prevCart) => {
      if (product.isCustom) {
        return [...prevCart, { ...product, quantity: 1 }];
      }

      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [
        ...prevCart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          description: product.description,
          quantity: 1,
        },
      ];
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const handleCheckout = () => {
    setCheckoutSuccess(true);
    setTimeout(() => {
      setCart([]);
      setIsCartOpen(false);
      setCheckoutSuccess(false);
    }, 3000);
  };

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (showSplash) {
    return <SplashScreen onEnter={() => setShowSplash(false)} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar Header */}
      <Navbar
        cartCount={totalCartItems}
        onCartClick={() => setIsCartOpen(true)}
        onNavigate={handleNavigate}
        activeSection={activeSection}
        pageView={pageView}
      />

      {/* Main View Router */}
      <main style={{ marginTop: '76px', flex: 1 }}>
        {pageView === 'studio' ? (
          /* DEDICATED 3D STUDIO PAGE */
          <AquariumStudioPage
            onAddToCart={handleAddToCart}
            onBackToStore={() => handleNavigate('home')}
          />
        ) : (
          /* STORE MAIN PAGE */
          <>
            {/* HERO SECTION */}
            <section
              id="home"
              className="ocean-ambient flex align-center"
              style={{
                minHeight: 'calc(100vh - 76px)',
                padding: '80px 0',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div className="container grid grid-2 gap-4 align-center">
                {/* Hero Left */}
                <div className="flex flex-col gap-3" style={{ position: 'relative', zIndex: 5 }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(0, 242, 254, 0.08)',
                      border: '1px solid rgba(0, 242, 254, 0.25)',
                      padding: '6px 16px',
                      borderRadius: '30px',
                      width: 'fit-content',
                    }}
                  >
                    <Sparkles size={14} color="var(--color-primary)" />
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: 'var(--color-primary)',
                      }}
                    >
                      Thiết kế bể thủy sinh nghệ thuật 3D
                    </span>
                  </div>

                  <h1
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(2.2rem, 5vw, 4.2rem)',
                      lineHeight: 1.15,
                      fontWeight: 700,
                      color: '#fff',
                    }}
                  >
                    Mang Cả <span style={{ color: 'var(--color-primary)' }}>Đại Dương</span> Vào Không Gian Sống
                  </h1>

                  <p
                    style={{
                      color: 'var(--color-text-secondary)',
                      fontSize: 'clamp(14px, 2.5vw, 16px)',
                      lineHeight: 1.6,
                      maxWidth: '520px',
                    }}
                  >
                    AquaRealm cung cấp bể cá cảnh, sinh vật thủy sinh nhập khẩu cao cấp cùng phòng Studio 3D độc quyền giúp bạn tự phối lắp ghép hồ cá tương tác bơi lội ngay trên trang web.
                  </p>

                  <div className="flex gap-2" style={{ marginTop: '16px' }}>
                    <button
                      onClick={() => handleNavigate('customizer')}
                      className="btn-primary flex align-center gap-1"
                    >
                      <span>Vào Studio 3D</span>
                      <ArrowRight size={16} />
                    </button>
                    <button
                      onClick={() => handleNavigate('shop')}
                      className="btn-secondary"
                    >
                      Khám phá cửa hàng
                    </button>
                  </div>

                  {/* Trust Badges */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '24px',
                      marginTop: '40px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      paddingTop: '24px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShieldCheck size={20} color="var(--color-primary)" />
                      <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Bảo hành cá sống 7 ngày</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Award size={20} color="var(--color-primary)" />
                      <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Nhập khẩu chuẩn 100%</span>
                    </div>
                  </div>
                </div>

                {/* Hero Right Card */}
                <div
                  className="glass-panel float-animation"
                  style={{
                    borderRadius: '24px',
                    overflow: 'hidden',
                    padding: '12px',
                    position: 'relative',
                    zIndex: 5,
                    borderWidth: '2px',
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=800&auto=format&fit=crop&q=80"
                    alt="Nature Aquascape Setup"
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '16px',
                      display: 'block',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '24px',
                      left: '24px',
                      background: 'rgba(2, 11, 24, 0.85)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(0, 242, 254, 0.25)',
                      borderRadius: '12px',
                      padding: '12px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <Heart size={20} color="var(--color-accent-coral)" />
                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', display: 'block' }}>Thiết kế Studio 3D</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Hồ Iwagumi Biotope 90L</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* PRODUCT CATALOG */}
            <ProductCatalog onAddToCart={handleAddToCart} />

            {/* SERVICES SECTION */}
            <section id="services" style={{ padding: '80px 0', background: 'var(--color-bg-deep)' }}>
              <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                  <span
                    style={{
                      textTransform: 'uppercase',
                      fontSize: '12px',
                      letterSpacing: '3px',
                      color: 'var(--color-primary)',
                      fontWeight: 700,
                    }}
                  >
                    Dịch Vụ Chuyên Nghiệp
                  </span>
                  <h2
                    style={{
                      fontSize: 'clamp(24px, 4vw, 36px)',
                      marginTop: '8px',
                      fontFamily: 'var(--font-heading)',
                      color: '#fff',
                    }}
                  >
                    Dịch Vụ Setup & Chăm Sóc Trọn Gói
                  </h2>
                  <p
                    style={{
                      color: 'var(--color-text-secondary)',
                      maxWidth: '600px',
                      margin: '12px auto 0 auto',
                      fontSize: '14px',
                      lineHeight: 1.6,
                    }}
                  >
                    Chúng tôi đồng hành cùng bạn từ khâu lên bản vẽ Studio 3D, thi công lắp đặt cho đến quy trình vệ sinh vi sinh trọn gói tại nhà.
                  </p>
                </div>

                <div className="grid grid-3 gap-3">
                  {[
                    {
                      title: '1. Setup Bể Thủy Sinh Nature',
                      desc: 'Thi công bố cục rừng, hồ đá bán cạn Iwagumi, hồ Biotope mô phỏng sông tự nhiên chuẩn phong thủy.',
                      img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format&fit=crop&q=80',
                    },
                    {
                      title: '2. Lắp Đặt Bể Cá Rồng / Cá Koi Khủng',
                      desc: 'Hệ thống kính cường lực ghép keo giấu đường chỉ, dàn lọc tràn dưới Matrix đa tầng xử lý nước siêu trong.',
                      img: 'https://images.unsplash.com/photo-1524704659674-20480006b24f?w=500&auto=format&fit=crop&q=80',
                    },
                    {
                      title: '3. Bảo Dưỡng & Vệ Sinh Bể Định Kỳ',
                      desc: 'Kiểm tra nồng độ pH, đo NO2/NO3, cạo rêu hại bám kính, cắt tỉa cây thủy sinh và châm vi sinh định kỳ.',
                      img: 'https://images.unsplash.com/photo-1501426026826-31c667bdf23d?w=500&auto=format&fit=crop&q=80',
                    },
                  ].map((svc, idx) => (
                    <div
                      key={idx}
                      className="glass-panel"
                      style={{
                        borderRadius: '16px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                      }}
                    >
                      <img src={svc.img} alt={svc.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '12px', fontFamily: 'var(--font-body)' }}>
                            {svc.title}
                          </h3>
                          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                            {svc.desc}
                          </p>
                        </div>
                        <button
                          className="btn-secondary"
                          style={{ marginTop: '20px', padding: '10px 20px', fontSize: '12px', width: '100%', textAlign: 'center' }}
                          onClick={() => alert(`Cảm ơn bạn đã quan tâm! AquaRealm sẽ tư vấn: ${svc.title}`)}
                        >
                          Đăng Ký Tư Vấn
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* SHOPPING CART DRAWER */}
      {isCartOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(2, 11, 24, 0.75)',
            backdropFilter: 'blur(5px)',
            zIndex: 99999,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div style={{ flex: 1 }} onClick={() => setIsCartOpen(false)} />

          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '480px',
              height: '100%',
              background: '#040e21',
              borderLeft: '1px solid rgba(0, 242, 254, 0.2)',
              borderRadius: 0,
              padding: '30px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div className="flex justify-between align-center" style={{ marginBottom: '24px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', color: '#fff' }}>
                  Giỏ Hàng Của Bạn
                </h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
                >
                  <X size={24} />
                </button>
              </div>

              {checkoutSuccess && (
                <div
                  className="glass-panel"
                  style={{
                    padding: '16px',
                    borderColor: 'var(--color-emerald)',
                    background: 'rgba(16, 185, 129, 0.12)',
                    color: 'white',
                    borderRadius: '10px',
                    marginBottom: '20px',
                    textAlign: 'center',
                    fontWeight: 600,
                  }}
                >
                  🎉 Đặt hàng thành công! Đội ngũ AquaRealm sẽ liên lạc tư vấn lắp đặt cho bạn.
                </div>
              )}

              <div
                style={{
                  maxHeight: 'calc(100vh - 280px)',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {cart.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '50px 0' }}>
                    <p style={{ fontSize: '14px' }}>Giỏ hàng đang trống.</p>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        handleNavigate('shop');
                      }}
                      className="btn-secondary"
                      style={{ marginTop: '16px', padding: '10px 20px', fontSize: '12px' }}
                    >
                      Tiếp tục mua hàng
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '12px',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: '70px',
                            height: '70px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '70px',
                            height: '70px',
                            borderRadius: '8px',
                            background: 'rgba(0, 242, 254, 0.08)',
                            border: '1px solid rgba(0, 242, 254, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Sparkles size={20} color="var(--color-primary)" />
                        </div>
                      )}

                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '14px', color: '#fff', fontWeight: 700 }}>{item.name}</h4>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'block', margin: '4px 0' }}>
                          {item.isCustom ? 'Thiết kế 3D cá nhân hóa' : `Giá: ${item.price.toLocaleString()}đ`}
                        </span>

                        <div className="flex justify-between align-center" style={{ marginTop: '8px' }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              border: '1px solid rgba(255,255,255,0.12)',
                              borderRadius: '6px',
                            }}
                          >
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              style={{ background: 'transparent', border: 'none', color: '#fff', width: '24px', height: '24px', cursor: 'pointer' }}
                            >
                              -
                            </button>
                            <span style={{ fontSize: '12px', padding: '0 6px', color: '#fff', fontWeight: 'bold' }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              style={{ background: 'transparent', border: 'none', color: '#fff', width: '24px', height: '24px', cursor: 'pointer' }}
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {cart.length > 0 && (
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px' }}>
                <div className="flex justify-between" style={{ marginBottom: '12px' }}>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Tổng đơn hàng:</span>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '18px' }}>
                    {totalCartPrice.toLocaleString()}đ
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="btn-primary"
                  style={{ width: '100%', padding: '14px', borderRadius: '10px', fontSize: '14px' }}
                >
                  Xác Nhận Đặt Hàng (Thanh Toán COD)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
