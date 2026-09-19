import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Sparkles, Volume2, VolumeX } from 'lucide-react';

interface SplashScreenProps {
  onEnter: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  const [isFading, setIsFading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handleEnterClick = useCallback(() => {
    if (isFading) return;
    setIsFading(true);
    setTimeout(() => {
      onEnter();
    }, 700);
  }, [isFading, onEnter]);

  // Keyboard shortcut: Space, Enter, or Escape to enter site
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter' || e.code === 'Escape') {
        e.preventDefault();
        handleEnterClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleEnterClick]);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  };

  return (
    <div
      onClick={handleEnterClick}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        overflow: 'hidden',
        background: '#04070c',
        cursor: 'pointer',
        transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isFading ? 0 : 1,
        transform: isFading ? 'scale(1.05)' : 'scale(1)',
        pointerEvents: isFading ? 'none' : 'auto',
      }}
    >
      {/* Background Cinematic Video */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <video
          src="/videos/intro.mp4"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            filter: 'brightness(0.9) contrast(1.05)',
          }}
        />

        {/* Ambient Dark Gradient Vignette Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 50%, rgba(4, 7, 12, 0.35) 0%, rgba(4, 7, 12, 0.75) 65%, rgba(2, 4, 8, 0.95) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Cinematic Top & Bottom Shadow Vignette */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '140px',
            background: 'linear-gradient(to bottom, rgba(4, 7, 12, 0.9) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '160px',
            background: 'linear-gradient(to top, rgba(4, 7, 12, 0.95) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Top Header Bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 10,
          padding: '24px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Eyebrow */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '24px',
            background: 'rgba(7, 12, 20, 0.65)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Sparkles size={14} color="#38bdf8" />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: '#38bdf8',
            }}
          >
            AquaStudio 3D • Cinema Intro
          </span>
        </div>

        {/* Action Controls: Sound & Skip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Mute/Unmute Button */}
          <button
            onClick={toggleSound}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(7, 12, 20, 0.65)',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.2s',
            }}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} color="#38bdf8" />}
          </button>

          {/* Quick Skip Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEnterClick();
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              background: 'rgba(7, 12, 20, 0.65)',
              color: '#cbd5e1',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#38bdf8';
              e.currentTarget.style.borderColor = '#38bdf8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#cbd5e1';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
            }}
          >
            <span>Bỏ qua</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Main Center Overlay Content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: '680px',
            padding: '40px 48px',
            borderRadius: '28px',
            background: 'rgba(6, 11, 20, 0.72)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 80px rgba(0, 0, 0, 0.7), 0 0 50px rgba(6, 182, 212, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          {/* Eyebrow */}
          <span
            style={{
              textTransform: 'uppercase',
              fontSize: '11px',
              fontWeight: 900,
              letterSpacing: '3px',
              color: '#06b6d4',
            }}
          >
            Boutique Aquarium & Aquascaping
          </span>

          {/* Heading */}
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: 800,
              color: '#f8fafc',
              lineHeight: 1.15,
              letterSpacing: '-0.5px',
              margin: 0,
            }}
          >
            ĐẠI DƯƠNG THU NHỎ TRONG TẦNG KHÔNG GIAN
          </h1>

          {/* Description */}
          <p
            style={{
              color: '#94a3b8',
              fontSize: 'clamp(13px, 1.6vw, 15px)',
              lineHeight: 1.6,
              maxWidth: '520px',
              margin: '4px 0 16px 0',
            }}
          >
            Khám phá tuyệt tác hồ cá thủy sinh 360° tương tác đa tầng, chiêm ngưỡng đàn sinh vật sống động với công nghệ hình ảnh chuẩn điện ảnh.
          </p>

          {/* Main Action Button */}
          <button
            onClick={handleEnterClick}
            className="btn-primary"
            style={{
              padding: '16px 40px',
              fontSize: '14px',
              fontWeight: 800,
              letterSpacing: '1.5px',
              borderRadius: '30px',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 10px 30px rgba(2, 132, 199, 0.45)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 14px 40px rgba(6, 182, 212, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(2, 132, 199, 0.45)';
            }}
          >
            <span>BƯỚC VÀO TRẢI NGHIỆM</span>
            <ArrowRight size={16} />
          </button>

          {/* Space / Click hint */}
          <span
            style={{
              fontSize: '11px',
              color: '#64748b',
              letterSpacing: '0.5px',
              marginTop: '6px',
            }}
          >
            Nhấn <kbd style={{ padding: '2px 6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', color: '#cbd5e1' }}>Space</kbd> hoặc nhấp vào bất kỳ đâu để vào trang web
          </span>
        </div>
      </div>
    </div>
  );
};
