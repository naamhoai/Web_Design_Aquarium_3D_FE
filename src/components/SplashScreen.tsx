import React, { useState } from 'react';
import { SplashCanvas } from './SplashCanvas';

interface SplashScreenProps {
  onEnter: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  const [isFading, setIsFading] = useState(false);
  const [bubbleShower, setBubbleShower] = useState(false);

  const handleEnterClick = () => {
    setIsFading(true);
    setBubbleShower(true);
    setTimeout(() => {
      onEnter();
    }, 1400);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        overflow: 'hidden',
        transition: 'transform 1.3s cubic-bezier(0.85, 0, 0.15, 1), opacity 1.1s ease',
        transform: isFading ? 'translateY(-100%)' : 'translateY(0)',
        opacity: isFading ? 0 : 1,
        backgroundColor: '#e0f2fe',
      }}
    >
      {/* Sunlit Crystal Water Background */}
      <SplashCanvas />

      {/* Sunbeams radial overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.45) 0%, rgba(224, 242, 254, 0.75) 80%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Main UI Overlay */}
      <div
        className="flex flex-col align-center justify-between"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 3,
          padding: '60px 24px',
          textAlign: 'center',
        }}
      >
        {/* Top Branding */}
        <div style={{ marginTop: '20px' }}>
          <span
            style={{
              textTransform: 'uppercase',
              fontSize: '13px',
              letterSpacing: '5px',
              color: 'var(--color-primary)',
              fontWeight: 800,
            }}
          >
            Boutique Aquarium & Aquascaping
          </span>
        </div>

        {/* Center Card */}
        <div
          className="glass-panel"
          style={{
            padding: '48px 40px',
            borderRadius: '28px',
            maxWidth: '680px',
            background: 'rgba(255, 255, 255, 0.85)',
            borderColor: 'rgba(2, 132, 199, 0.25)',
            boxShadow: '0 20px 60px rgba(2, 132, 199, 0.15)',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.8rem, 7vw, 5rem)',
              fontWeight: 700,
              color: '#0f172a',
              letterSpacing: '6px',
              lineHeight: 1.1,
              marginBottom: '14px',
            }}
          >
            AQUA REALM
          </h1>
          <p
            style={{
              color: '#475569',
              fontSize: 'clamp(14px, 2vw, 17px)',
              letterSpacing: '2px',
              maxWidth: '520px',
              margin: '0 auto 32px auto',
              lineHeight: 1.6,
              fontWeight: 500,
            }}
          >
            Hành Trình Khám Phá Đại Dương Thu Nhỏ
          </p>

          <button
            onClick={handleEnterClick}
            className="pulse-glow"
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0284c7, #06b6d4)',
              border: '4px solid #ffffff',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto',
              boxShadow: '0 10px 30px rgba(2, 132, 199, 0.4)',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div
              style={{
                width: '14px',
                height: '14px',
                borderBottom: '2.5px solid #ffffff',
                borderRight: '2.5px solid #ffffff',
                transform: 'rotate(45deg)',
                marginBottom: '4px',
              }}
            />
            <span>Khám Phá</span>
            <span style={{ fontSize: '9px', opacity: 0.85, letterSpacing: '1px', fontWeight: 400 }}>
              ngay
            </span>
          </button>
        </div>

        {/* Footer Prompt */}
        <div style={{ marginBottom: '20px' }}>
          <p
            style={{
              color: '#475569',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '1px',
            }}
          >
            Nhấp chuột lên màn hình để tạo sóng nước và trêu đùa đàn cá
          </p>
        </div>
      </div>

      {/* Bubble Transition Shower */}
      {bubbleShower && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 99999,
            pointerEvents: 'none',
          }}
        >
          {Array.from({ length: 60 }).map((_, i) => {
            const size = Math.random() * 25 + 10;
            const left = Math.random() * 100;
            const delay = Math.random() * 0.8;
            const duration = Math.random() * 0.8 + 0.6;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  bottom: '-50px',
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  borderRadius: '50%',
                  border: '1.5px solid rgba(2, 132, 199, 0.6)',
                  background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(2, 132, 199, 0.2))',
                  animation: `transition-bubble ${duration}s cubic-bezier(0.25, 1, 0.5, 1) forwards`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
          <style>{`
            @keyframes transition-bubble {
              0% { transform: translateY(0) scale(0.5); opacity: 0; }
              20% { opacity: 0.9; }
              100% { transform: translateY(-115vh) scale(1.5); opacity: 0; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};
