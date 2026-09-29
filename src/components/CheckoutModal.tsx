import React, { useEffect, useState } from 'react';
import {
  X, Shield, Truck, CreditCard, QrCode, AlertCircle,
  Package, MapPin, Phone, User, FileText, ChevronRight, Loader2
} from 'lucide-react';
import { api, type OrderResponseData, type PaymentMethod } from '../services/api';
import { expandCartToOrderItems, unorderableItems, type CartItem } from '../cart';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  cartTotal: number;
  currentUser?: { id: string; fullName: string; email?: string; phone?: string } | null;
  onOrderSuccess: (order: OrderResponseData) => void;
}

/** Phí ship hiển thị để tham khảo; số tiền thật do server tính và trả về trong đơn hàng. */
const ESTIMATED_SHIPPING_FEE = 50000;
const PHONE_PATTERN = /^(\+84|0)[0-9]{9,10}$/;

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  background: 'rgba(15, 23, 42, 0.8)',
  border: '1px solid rgba(56, 189, 248, 0.2)',
  borderRadius: '10px',
  color: '#f8fafc',
  fontSize: '13px',
  outline: 'none',
};

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 };

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  cartTotal,
  currentUser,
  onOrderSuccess,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BANK_TRANSFER');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Mỗi lần mở: điền sẵn thông tin của tài khoản đang đăng nhập (không dùng dữ liệu cá nhân giả)
  useEffect(() => {
    if (isOpen) {
      setFullName(currentUser?.fullName ?? '');
      setPhone(currentUser?.phone ?? '');
      setErrorMessage(null);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const finalTotal = cartTotal + ESTIMATED_SHIPPING_FEE;
  const demoItems = unorderableItems(cartItems);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const normalizedPhone = phone.replace(/[\s.-]/g, '');
    if (!fullName.trim() || !address.trim()) {
      setErrorMessage('Vui lòng nhập đầy đủ họ tên và địa chỉ nhận hàng.');
      return;
    }
    if (!PHONE_PATTERN.test(normalizedPhone)) {
      setErrorMessage('Số điện thoại không hợp lệ (ví dụ: 0901234567).');
      return;
    }
    if (demoItems.length > 0) {
      setErrorMessage(`Giỏ hàng có ${demoItems.length} sản phẩm demo chưa có trên hệ thống. Vui lòng xóa trước khi đặt hàng.`);
      return;
    }
    const items = expandCartToOrderItems(cartItems);
    if (items.length === 0) {
      setErrorMessage('Giỏ hàng đang trống.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.checkoutOrder({
        items,
        paymentMethod,
        shippingAddress: {
          recipientName: fullName.trim(),
          phone: normalizedPhone,
          addressLine: address.trim(),
        },
        customerNotes: customerNotes.trim() || undefined,
      });
      if (res.success && res.data) {
        onOrderSuccess(res.data);
        onClose();
      } else {
        setErrorMessage(res.message || 'Không thể tạo đơn hàng. Vui lòng thử lại sau.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentOption = (value: PaymentMethod, title: string, subtitle: string, icon: React.ReactNode, accent: string) => (
    <div
      role="radio"
      aria-checked={paymentMethod === value}
      tabIndex={0}
      onClick={() => setPaymentMethod(value)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPaymentMethod(value); } }}
      style={{
        padding: '14px 16px',
        borderRadius: '12px',
        background: paymentMethod === value ? 'rgba(6, 182, 212, 0.14)' : 'rgba(15, 23, 42, 0.6)',
        border: paymentMethod === value ? '1.5px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.08)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${accent}33`, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>{subtitle}</div>
        </div>
      </div>
      <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: paymentMethod === value ? '5px solid #06b6d4' : '2px solid #64748b' }} />
    </div>
  );

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(2, 6, 12, 0.85)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        style={{
          width: '100%', maxWidth: '820px', background: 'linear-gradient(180deg, #0b1320 0%, #070d17 100%)',
          border: '1px solid rgba(56, 189, 248, 0.28)', borderRadius: '24px',
          boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(6, 182, 212, 0.12)', color: '#f8fafc',
          maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 28px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(15, 23, 42, 0.6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
              <Package size={22} />
            </div>
            <div>
              <h2 id="checkout-title" style={{ margin: 0, fontSize: '19px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#f8fafc' }}>
                Xác Nhận Đặt Hàng & Thanh Toán
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                Giá, phí vận chuyển và tồn kho được máy chủ kiểm tra lại khi đặt hàng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            style={{ background: 'rgba(255, 255, 255, 0.06)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} style={{ overflowY: 'auto', padding: '24px 28px', flex: 1 }} noValidate>
          {errorMessage && (
            <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', fontSize: '13px', marginBottom: '20px' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="checkout-grid">
            {/* Left: Shipping & Receiver Information */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#38bdf8', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={16} />
                Thông Tin Giao Hàng & Nhận Hàng
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label htmlFor="co-name" style={labelStyle}>
                    <User size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                    Họ và tên người nhận *
                  </label>
                  <input id="co-name" type="text" required maxLength={150} autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} style={inputStyle} />
                </div>

                <div>
                  <label htmlFor="co-phone" style={labelStyle}>
                    <Phone size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                    Số điện thoại liên hệ *
                  </label>
                  <input id="co-phone" type="tel" required maxLength={15} autoComplete="tel" placeholder="0901234567" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
                </div>

                <div>
                  <label htmlFor="co-address" style={labelStyle}>
                    <MapPin size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                    Địa chỉ nhận hàng chi tiết *
                  </label>
                  <input id="co-address" type="text" required maxLength={300} autoComplete="street-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" style={inputStyle} />
                </div>

                <div>
                  <label htmlFor="co-notes" style={labelStyle}>
                    <FileText size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                    Ghi chú đơn hàng (thời gian giao, yêu cầu chống sốc)
                  </label>
                  <textarea id="co-notes" rows={2} maxLength={500} value={customerNotes} onChange={(e) => setCustomerNotes(e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
              </div>

              <h3 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#38bdf8', marginTop: '24px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={16} />
                Phương Thức Thanh Toán
              </h3>

              <div role="radiogroup" aria-label="Phương thức thanh toán" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {paymentOption('BANK_TRANSFER', 'Chuyển Khoản VietQR (Napas 24/7)', 'Nhận mã QR kèm nội dung đơn hàng sau khi đặt', <QrCode size={20} />, '#06b6d4')}
                {paymentOption('COD', 'Thanh Toán Khi Nhận Hàng (COD)', 'Kiểm tra phụ kiện và sinh vật thủy sinh trước khi thanh toán', <Truck size={20} />, '#34d399')}
              </div>
            </div>

            {/* Right: Order Summary */}
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#f8fafc', marginBottom: '16px' }}>
                  Tóm Tắt Giỏ Hàng ({cartItems.length} mặt hàng)
                </h3>

                <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px', paddingRight: '6px' }}>
                  {cartItems.map((item) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', fontSize: '12px', opacity: item.lines.length === 0 ? 0.55 : 1 }}>
                      <div style={{ maxWidth: '65%' }}>
                        <div style={{ fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                        <div style={{ color: item.lines.length === 0 ? '#fbbf24' : '#94a3b8', fontSize: '11px' }}>
                          {item.lines.length === 0 ? 'Sản phẩm demo — chưa đặt được' : `Số lượng: x${item.quantity}`}
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, color: '#38bdf8' }}>{(item.price * item.quantity).toLocaleString('vi-VN')}₫</div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#94a3b8' }}>
                    <span>Tạm tính:</span>
                    <span style={{ color: '#f8fafc', fontWeight: 600 }}>{cartTotal.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#94a3b8' }}>
                    <span>Phí vận chuyển (ước tính):</span>
                    <span style={{ color: '#f8fafc', fontWeight: 600 }}>{ESTIMATED_SHIPPING_FEE.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div style={{ marginTop: '10px', paddingTop: '12px', borderTop: '1px solid rgba(56, 189, 248, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>Tổng tạm tính:</span>
                    <span style={{ fontSize: '22px', fontWeight: 800, color: '#38bdf8' }}>{finalTotal.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '20px', padding: '12px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.2)', fontSize: '11px', color: '#94a3b8', lineHeight: 1.5 }}>
                <div style={{ color: '#38bdf8', fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Shield size={14} />
                  Giá được máy chủ xác nhận
                </div>
                Hệ thống tính lại giá theo bảng giá hiện hành, giữ hàng trong kho và tách đơn theo từng nhà cung cấp. Số tiền cuối cùng hiển thị ở màn hình xác nhận đơn.
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{ marginTop: '28px', paddingTop: '18px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} disabled={isSubmitting} style={{ padding: '12px 24px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{ padding: '12px 28px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)', boxShadow: '0 0 25px rgba(6, 182, 212, 0.4)', border: 'none', color: '#ffffff', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="spin" />
                  <span>Đang tạo đơn hàng...</span>
                </>
              ) : (
                <>
                  <span>Đặt Hàng</span>
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
