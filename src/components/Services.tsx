import { useState } from 'react';
import { Hammer, Sparkles, Droplets, CheckCircle2, Calendar } from 'lucide-react';
import { Button } from './Button';
import { Modal } from './Modal';
import { SectionHeader } from './SectionHeader';
import { GlassPanel } from './GlassPanel';
import { toast } from './Toast';

interface Service {
  title: string;
  desc: string;
  bullets: string[];
  img: string;
  icon: React.ReactNode;
  tone: 'primary' | 'secondary' | 'gold';
}

const services: Service[] = [
  {
    title: '1. Setup Bể Thủy Sinh Nature',
    desc: 'Thi công bố cục rừng, hồ đá bán cạn Iwagumi, hồ Biotope mô phỏng sông tự nhiên chuẩn phong thuỷ, đã cấy vi sinh chu kỳ ban đầu.',
    bullets: ['Khảo sát tận nơi miễn phí', 'Bảo hành hệ sinh thái 90 ngày', 'Đo & cân chỉnh pH/CO₂'],
    img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format&fit=crop&q=80',
    icon: <Hammer size={20} />,
    tone: 'primary',
  },
  {
    title: '2. Lắp Đặt Bể Cá Rồng / Cá Koi Khủng',
    desc: 'Hệ thống kính cường lực dày ghép keo giấu đường chỉ, dàn lọc tràn dưới Matrix đa tầng xử lý nước siêu trong cho cá lớn.',
    bullets: ['Kính cường lực 12–19mm', 'Lọc tràn đa tầng Matrix', 'Bảo hành 12 tháng'],
    img: 'https://images.unsplash.com/photo-1524704659674-20480006b24f?w=500&auto=format&fit=crop&q=80',
    icon: <Sparkles size={20} />,
    tone: 'gold',
  },
  {
    title: '3. Bảo Dưỡng & Vệ Sinh Bể Định Kỳ',
    desc: 'Kiểm tra nồng độ pH, đo NO2/NO3, cạo rêu hại bám kính, cắt tỉa cây thuỷ sinh, thay nước và châm vi sinh định kỳ an toàn tuyệt đối.',
    bullets: ['Đo pH/NO₂/NO₃ mỗi lần', 'Cạo rêu hại bám kính', 'Cắt tỉa & thay nước định kỳ'],
    img: 'https://images.unsplash.com/photo-1501426026826-31c667bdf23d?w=500&auto=format&fit=crop&q=80',
    icon: <Droplets size={20} />,
    tone: 'secondary',
  },
];

const toneToVar: Record<Service['tone'], string> = {
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  gold: 'var(--color-accent-gold)',
};

export function Services() {
  const [openFor, setOpenFor] = useState<Service | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Vui lòng nhập họ tên';
    if (!/^0\d{9,10}$/.test(form.phone.trim())) next.phone = 'Số điện thoại chưa hợp lệ';
    setErrors(next);
    if (Object.keys(next).length) return;
    setOpenFor(null);
    setForm({ name: '', phone: '', address: '', note: '' });
    toast({ kind: 'success', message: `🎉 Đã gửi yêu cầu tư vấn dịch vụ “${openFor?.title.replace(/^\d+\.\s*/, '')}”. AquaRealm sẽ liên hệ bạn trong 24h.` });
  };

  return (
    <section
      id="services"
      className="section mesh-ambient"
      aria-labelledby="services-title"
    >
      <div className="container">
        <SectionHeader
          eyebrow="Dịch Vụ Chuyên Nghiệp"
          title="Dịch Vụ Setup & Chăm Sóc Trọn Gói"
          description="Chúng tôi đồng hành cùng bạn từ khâu lên bản vẽ 3D, thi công lắp đặt cho đến quy trình vệ sinh vi sinh trọn gói tại nhà."
        />

        <div className="grid grid-3 stagger" style={{ ['--i' as string]: 0 } as React.CSSProperties}>
          {services.map((svc, idx) => (
            <GlassPanel
              key={svc.title}
              bordered
              interactive
              className="hover-lift tilt-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                height: '100%',
                ['--i' as string]: idx,
              } as React.CSSProperties}
            >
              <div style={{ position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden' }}>
                <img
                  src={svc.img}
                  alt={svc.title}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    background: 'rgba(6, 26, 20, 0.7)',
                    border: `1px solid ${toneToVar[svc.tone]}`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: toneToVar[svc.tone],
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {svc.icon}
                </span>
              </div>
              <div
                style={{
                  padding: 22,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#fff',
                    fontFamily: 'var(--font-body)',
                    lineHeight: 1.3,
                  }}
                >
                  {svc.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  {svc.desc}
                </p>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  {svc.bullets.map((b) => (
                    <li
                      key={b}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        color: 'var(--color-text-secondary)',
                        fontSize: 12,
                      }}
                    >
                      <CheckCircle2 size={14} color={toneToVar[svc.tone]} />
                      {b}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  iconLeft={<Calendar size={14} />}
                  onClick={() => setOpenFor(svc)}
                  style={{ marginTop: 'auto' }}
                >
                  Đăng Ký Khảo Sát Tại Nhà
                </Button>
              </div>
            </GlassPanel>
          ))}
        </div>
      </div>

      <Modal
        open={!!openFor}
        onClose={() => setOpenFor(null)}
        title={openFor ? `Đăng ký: ${openFor.title.replace(/^\d+\.\s*/, '')}` : ''}
        labelledBy="service-form-title"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setOpenFor(null)}>
              Hủy
            </Button>
            <Button variant="primary" size="md" onClick={(e) => submit(e as unknown as React.FormEvent)}>
              Gửi yêu cầu
            </Button>
          </>
        }
      >
        <form
          onSubmit={submit}
          style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
        >
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            Để lại thông tin — đội ngũ AquaRealm sẽ liên hệ bạn trong vòng 24 giờ.
          </p>
          <div>
            <label className="form-label" htmlFor="svc-name">Họ và tên</label>
            <input
              id="svc-name"
              className="form-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nguyễn Văn A"
              aria-invalid={!!errors.name}
            />
            {errors.name && <span style={{ color: 'var(--color-danger)', fontSize: 11 }}>{errors.name}</span>}
          </div>
          <div>
            <label className="form-label" htmlFor="svc-phone">Số điện thoại</label>
            <input
              id="svc-phone"
              className="form-input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="0901234567"
              aria-invalid={!!errors.phone}
            />
            {errors.phone && <span style={{ color: 'var(--color-danger)', fontSize: 11 }}>{errors.phone}</span>}
          </div>
          <div>
            <label className="form-label" htmlFor="svc-address">Địa chỉ</label>
            <input
              id="svc-address"
              className="form-input"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Quận/Huyện, TP. Hà Nội"
            />
          </div>
          <div>
            <label className="form-label" htmlFor="svc-note">Ghi chú</label>
            <textarea
              id="svc-note"
              className="form-textarea"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Kích thước bể dự kiến, loài cá yêu thích, thời gian thi công…"
            />
          </div>
        </form>
      </Modal>
    </section>
  );
}
