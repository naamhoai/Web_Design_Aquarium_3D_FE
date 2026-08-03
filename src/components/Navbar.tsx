import React, { useState, useEffect } from 'react';
import { Waves, Search, ShoppingCart, Menu, X, Sparkles } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onNavigate: (section: string) => void;
  activeSection: string;
  pageView: 'store' | 'studio';
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onCartClick,
  onNavigate,
  activeSection,
  pageView,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Trang Chủ' },
    { id: 'shop', label: 'Cửa Hàng' },
    { id: 'services', label: 'Dịch Vụ' },
    { id: 'customizer', label: 'Studio 3D' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        background: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.75)',
        borderBottom: scrolled ? '1px solid rgba(2,132,199,0.14)' : '1px solid rgba(2,132,199,0.06)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        boxShadow: scrolled ? '0 4px 24px rgba(15,23,42,0.06)' : 'none',
        transition: 'all 0.35s ease',
      }}
    >
      <div
        className="container flex align-center justify-between"
        style={{ width: '100%' }}
      >
        {/* Logo */}
        <div
          onClick={() => handleLinkClick('home')}
          className="flex align-center gap-1"
          style={{ cursor: 'pointer', zIndex: 1002 }}
        >
          <Waves size={28} color="#0284c7" />
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '22px',
              fontWeight: 700,
              background: 'linear-gradient(90deg, #0f172a 10%, #0284c7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '1px',
            }}
          >
            AquaRealm
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hide-mobile flex align-center gap-4" style={{ listStyle: 'none' }}>
          {navLinks.map((link) => {
            const isStudioLink = link.id === 'customizer';
            const isActive = isStudioLink
              ? pageView === 'studio'
              : pageView === 'store' && activeSection === link.id;

            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: isActive ? '#0284c7' : '#475569',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: '0.3px',
                  padding: '8px 2px',
                  position: 'relative',
                  transition: 'color 0.25s ease',
                }}
              >
                {link.label}
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '2px',
                      background: 'linear-gradient(90deg, #0284c7, #06b6d4)',
                      borderRadius: '2px',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex align-center gap-2" style={{ zIndex: 1002 }}>
          <button
            style={{
              background: 'transparent',
              border: 'none',
              color: '#475569',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(2,132,199,0.07)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <Search size={19} />
          </button>

          {/* Cart */}
          <button
            onClick={onCartClick}
            style={{
              background: 'rgba(2,132,199,0.06)',
              border: '1px solid rgba(2,132,199,0.18)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.25s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(2,132,199,0.12)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#0284c7';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(2,132,199,0.06)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(2,132,199,0.18)';
            }}
          >
            <ShoppingCart size={17} color="#0f172a" />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '10px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* CTA Studio */}
          <button
            onClick={() => handleLinkClick('customizer')}
            className="btn-primary hide-mobile flex align-center gap-1"
            style={{ padding: '10px 18px', fontSize: '12px' }}
          >
            <Sparkles size={13} />
            <span>Studio 3D</span>
          </button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#0f172a',
              cursor: 'pointer',
              display: 'none',
            }}
            className="show-mobile-inline"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: '72px',
            left: 0,
            width: '100%',
            height: 'calc(100vh - 72px)',
            background: 'rgba(248,250,252,0.97)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(2,132,199,0.12)',
            zIndex: 1001,
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#0f172a',
                fontSize: '20px',
                fontWeight: 700,
                textAlign: 'left',
                padding: '12px 0',
                borderBottom: '1px solid rgba(2,132,199,0.08)',
                cursor: 'pointer',
                fontFamily: 'var(--font-heading)',
              }}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleLinkClick('customizer')}
            className="btn-primary flex align-center justify-center gap-1"
            style={{ marginTop: '16px', width: '100%', padding: '14px' }}
          >
            <Sparkles size={16} />
            <span>Vào Phòng Studio 3D</span>
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile-inline { display: inline-flex !important; }
        }
      `}</style>
    </nav>
  );
};
