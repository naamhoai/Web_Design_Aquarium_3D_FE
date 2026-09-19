import React, { useState, useEffect } from 'react';
import { Waves, Search, ShoppingCart, Menu, X, Sparkles, User, LogOut } from 'lucide-react';
import { api } from '../services/api';
import type { UserProfile } from '../services/api';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onNavigate: (section: string) => void;
  activeSection: string;
  pageView: 'store' | 'studio';
  currentUser?: UserProfile | null;
  onOpenAuth?: () => void;
  onLogout?: () => void;
  onOpenTelemetry?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onCartClick,
  onNavigate,
  activeSection,
  pageView,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenTelemetry,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLive, setIsLive] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;
    api.checkHealth().then((status) => {
      if (isMounted) setIsLive(status);
    });

    const interval = setInterval(() => {
      api.checkHealth().then((status) => {
        if (isMounted) setIsLive(status);
      });
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Trang Chủ' },
    { id: 'exploded', label: 'Bóc Tách 360°' },
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
        background: scrolled ? 'rgba(7, 12, 20, 0.92)' : 'rgba(7, 12, 20, 0.75)',
        borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: scrolled ? '0 4px 24px rgba(0, 0, 0, 0.4)' : 'none',
        transition: 'all 0.35s ease',
      }}
    >
      <div
        className="container flex align-center justify-between"
        style={{ width: '100%' }}
      >
        {/* Logo & API Status Badge */}
        <div className="flex align-center gap-2" style={{ zIndex: 1002 }}>
          <div
            onClick={() => handleLinkClick('home')}
            className="flex align-center gap-1"
            style={{ cursor: 'pointer' }}
          >
            <Waves size={28} color="#38bdf8" />
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '22px',
                fontWeight: 800,
                background: 'linear-gradient(90deg, #ffffff 10%, #38bdf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '1px',
              }}
            >
              AquaRealm
            </span>
          </div>

          <div
            onClick={onOpenTelemetry}
            role="button"
            tabIndex={0}
            title="Bấm để xem chi tiết trạng thái 6 Microservices Backend & PostgreSQL"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.3px',
              background: isLive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
              border: isLive ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(245, 158, 11, 0.35)',
              color: isLive ? '#34d399' : '#fbbf24',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isLive ? '0 0 12px rgba(16, 185, 129, 0.15)' : 'none',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: isLive ? '#10b981' : '#f59e0b',
                boxShadow: isLive ? '0 0 8px #10b981' : 'none',
              }}
            />
            <span className="hide-mobile">
              {isLive === null ? 'Đang kết nối...' : isLive ? '6 Services Online (8080)' : 'Chế độ Demo'}
            </span>
          </div>
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
                  color: isActive ? '#38bdf8' : '#94a3b8',
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
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#38bdf8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
          >
            <Search size={19} />
          </button>

          {/* User Auth Profile / Login Button */}
          {currentUser ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '24px',
                padding: '4px 12px 4px 6px',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0284c7, #06b6d4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#fff',
                }}
              >
                {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }} className="hide-mobile">
                {currentUser.fullName?.split(' ').slice(-1)[0] || 'Khách'}
              </span>
              <button
                type="button"
                onClick={onLogout}
                title="Đăng xuất"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '20px',
                padding: '8px 14px',
                color: '#f8fafc',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <User size={15} color="#38bdf8" />
              <span className="hide-mobile">Đăng Nhập</span>
            </button>
          )}

          {/* Cart */}
          <button
            onClick={onCartClick}
            style={{
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
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
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(56, 189, 248, 0.2)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#38bdf8';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(56, 189, 248, 0.1)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(56, 189, 248, 0.25)';
            }}
          >
            <ShoppingCart size={17} color="#f8fafc" />
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
