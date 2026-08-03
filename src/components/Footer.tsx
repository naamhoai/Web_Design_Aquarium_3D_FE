import React from 'react';
import { Waves, MapPin, Phone, Mail, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  const links = {
    'Cửa Hàng': ['Cá Cảnh Nhập Khẩu', 'Bể Kính Nghệ Thuật', 'Cây Thủy Sinh', 'Thiết Bị Lọc & Chiếu Sáng', 'Studio 3D Tự Thiết Kế'],
    'Dịch Vụ': ['Setup Bể Nature Aquascape', 'Lắp Đặt Bể Cá Rồng / Koi', 'Bảo Dưỡng Định Kỳ', 'Tư Vấn Phong Thủy', 'Ship Cá Toàn Quốc'],
    'Hỗ Trợ': ['Hướng Dẫn Chăm Sóc Cá', 'Chính Sách Bảo Hành', 'Câu Hỏi Thường Gặp', 'Liên Hệ Tư Vấn', 'Blog Thủy Sinh'],
  };

  return (
    <footer style={{ background: '#0f172a', color: '#cbd5e1', fontFamily: 'var(--font-body)' }}>
      {/* Main Footer */}
      <div className="container" style={{ padding: '64px 24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px' }}>
          {/* Brand Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Waves size={28} color="#38bdf8" />
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: '#f8fafc', letterSpacing: '1px' }}>
                AquaRealm
              </span>
            </div>
            <p style={{ fontSize: '13px', lineHeight: 1.7, color: '#94a3b8', maxWidth: '280px', marginBottom: '24px' }}>
              Boutique thủy sinh hàng đầu Việt Nam — chuyên cung cấp cá cảnh nhập khẩu, bể kính nghệ thuật và dịch vụ setup Aquascape chuyên nghiệp tận nơi.
            </p>

            {/* Contact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { icon: <MapPin size={14} color="#38bdf8" />, text: '45 Nguyễn Trãi, Q.1, TP.HCM' },
                { icon: <Phone size={14} color="#38bdf8" />, text: '0901 234 567' },
                { icon: <Mail size={14} color="#38bdf8" />, text: 'hello@aquarealm.vn' },
                { icon: <Clock size={14} color="#38bdf8" />, text: 'T2–CN: 8:00 – 21:00' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {item.icon}
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              {[
                {
                  label: 'Facebook',
                  svg: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  ),
                },
                {
                  label: 'Instagram',
                  svg: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  ),
                },
                {
                  label: 'YouTube',
                  svg: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0f172a" />
                    </svg>
                  ),
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: 'rgba(56,189,248,0.1)',
                    border: '1px solid rgba(56,189,248,0.2)',
                    color: '#94a3b8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    textDecoration: 'none',
                    transition: 'all 0.25s',
                  }}
                  onMouseEnter={e => { (e.currentTarget).style.background = 'rgba(56,189,248,0.2)'; (e.currentTarget).style.color = '#38bdf8'; }}
                  onMouseLeave={e => { (e.currentTarget).style.background = 'rgba(56,189,248,0.1)'; (e.currentTarget).style.color = '#94a3b8'; }}
                >
                  {social.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h4 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '14px', letterSpacing: '0.5px', marginBottom: '16px', fontFamily: 'var(--font-body)' }}>
                {heading}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      style={{ color: '#94a3b8', fontSize: '13px', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => ((e.target as HTMLAnchorElement).style.color = '#38bdf8')}
                      onMouseLeave={e => ((e.target as HTMLAnchorElement).style.color = '#94a3b8')}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div
          style={{
            marginTop: '48px',
            padding: '28px 32px',
            background: 'rgba(56,189,248,0.06)',
            border: '1px solid rgba(56,189,248,0.14)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div>
            <h4 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>
              📧 Đăng Ký Nhận Khuyến Mãi Độc Quyền
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '13px' }}>
              Cập nhật thông tin cá nhập mới, tips chăm sóc thủy sinh và deal giảm giá hàng tuần.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flex: '0 0 auto' }}>
            <input
              type="email"
              placeholder="Email của bạn..."
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(56,189,248,0.2)',
                borderRadius: '30px',
                padding: '11px 18px',
                color: '#f8fafc',
                fontSize: '13px',
                outline: 'none',
                width: '220px',
              }}
            />
            <button
              className="btn-primary"
              style={{ padding: '11px 22px', fontSize: '12px', whiteSpace: 'nowrap' }}
            >
              Đăng Ký
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '16px 0' }}>
        <div className="container flex justify-between align-center" style={{ flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: '#475569' }}>
            © {year} AquaRealm. All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Chính Sách Bảo Mật', 'Điều Khoản Dịch Vụ', 'Sơ Đồ Website'].map((item) => (
              <a key={item} href="#" style={{ fontSize: '11px', color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => ((e.target as HTMLAnchorElement).style.color = '#38bdf8')}
                onMouseLeave={e => ((e.target as HTMLAnchorElement).style.color = '#475569')}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
