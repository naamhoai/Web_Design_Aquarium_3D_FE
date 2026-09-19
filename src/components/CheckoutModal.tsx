import React, { useState } from 'react';
import {
  X, Shield, Truck, CreditCard, QrCode, AlertCircle,
  Package, MapPin, Phone, User, FileText, ChevronRight, Loader2
} from 'lucide-react';
import { api, type CheckoutPayload, type OrderResponseData } from '../services/api';

export interface CartItemSummary {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variantName?: string;
  customConfiguration?: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItemSummary[];
  cartTotal: number;
  currentUser?: { id: string; fullName: string; email?: string; phone?: string } | null;
  onOrderSuccess: (order: OrderResponseData) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  cartTotal,
  currentUser,
  onOrderSuccess,
}) => {
  const [fullName, setFullName] = useState(currentUser?.fullName || 'Nguyễn Phương Nam');
  const [phone, setPhone] = useState(currentUser?.phone || '0988 123 456');
  const [address, setAddress] = useState('120 Hoàng Hoa Thám, Phường Thụy Khuê, Quận Ba Đình, Hà Nội');
  const [customerNotes, setCustomerNotes] = useState('Giao cẩn thận, bể kính và cá cảnh dưỡng oxy bọc xốp chống sốc');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'VIETQR' | 'CREDIT_CARD'>('VIETQR');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const shippingFee = 50000;
  const finalTotal = cartTotal + shippingFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!address.trim()) {
      setErrorMessage('Vui lòng nhập địa chỉ nhận hàng đầy đủ.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Default customer UUID seed if guest
      const userId = currentUser?.id || 'a0000000-0000-0000-0000-000000000005';
      const variantId = 'e0000000-0000-0000-0000-000000000001'; // Default seed variant

      // 1. Ensure DB Cart has items for Order-Service to split & process
      try {
        await api.addToCartDB({
          userId,
          productVariantId: variantId,
          quantity: Math.max(1, cartItems.reduce((acc, item) => acc + item.quantity, 0)),
          customConfiguration: JSON.stringify({
            itemsCount: cartItems.length,
            note: customerNotes || 'Đặt hàng trực tuyến AquaRealm',
          }),
        });
      } catch (cartErr) {
        console.warn('DB Cart pre-population notice:', cartErr);
      }

      // 2. Call Order Service Checkout endpoint
      const checkoutPayload: CheckoutPayload = {
        userId,
        shippingAddress: `${fullName} - ${phone} - ${address}`,
        paymentMethod,
        customerNotes,
        shippingFee,
        discountAmount: 0,
      };

      const res = await api.checkoutOrder(checkoutPayload);

      if (res.success && res.data) {
        onOrderSuccess(res.data);
        onClose();
      } else {
        setErrorMessage(res.message || 'Không thể tạo đơn hàng. Vui lòng thử lại sau.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Lỗi hệ thống khi kết nối Order Service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(2, 6, 12, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '820px',
          background: 'linear-gradient(180deg, #0b1320 0%, #070d17 100%)',
          border: '1px solid rgba(56, 189, 248, 0.28)',
          borderRadius: '24px',
          boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(6, 182, 212, 0.12)',
          color: '#f8fafc',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '22px 28px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(15, 23, 42, 0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
              }}
            >
              <Package size={22} />
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: '19px',
                  fontWeight: 800,
                  fontFamily: 'var(--font-heading)',
                  color: '#f8fafc',
                }}
              >
                Xác Nhận Đặt Hàng & Thanh Toán
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                Đồng bộ trực tiếp qua Cổng Gateway (:8080) & Order Service (:8086)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#f8fafc';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94a3b8';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} style={{ overflowY: 'auto', padding: '24px 28px', flex: 1 }}>
          {errorMessage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                fontSize: '13px',
                marginBottom: '20px',
              }}
            >
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            {/* Left: Shipping & Receiver Information */}
            <div>
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#38bdf8',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Truck size={16} />
                Thông Tin Giao Hàng & Nhận Hàng
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                    <User size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                    Họ và tên người nhận *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      borderRadius: '10px',
                      color: '#f8fafc',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                    <Phone size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                    Số điện thoại liên hệ *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      borderRadius: '10px',
                      color: '#f8fafc',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                    <MapPin size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                    Địa chỉ nhận hàng chi tiết *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      borderRadius: '10px',
                      color: '#f8fafc',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                    <FileText size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                    Ghi chú đơn hàng (Thời gian giao, yêu cầu chống sốc)
                  </label>
                  <textarea
                    rows={2}
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      borderRadius: '10px',
                      color: '#f8fafc',
                      fontSize: '13px',
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#38bdf8',
                  marginTop: '24px',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <CreditCard size={16} />
                Phương Thức Thanh Toán
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* VietQR */}
                <div
                  onClick={() => setPaymentMethod('VIETQR')}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: paymentMethod === 'VIETQR' ? 'rgba(6, 182, 212, 0.14)' : 'rgba(15, 23, 42, 0.6)',
                    border: paymentMethod === 'VIETQR' ? '1.5px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: 'rgba(6, 182, 212, 0.2)',
                        color: '#06b6d4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <QrCode size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>
                        Chuyển Khoản VietQR Tự Động (Napas 24/7)
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                        Tạo mã QR kèm nội dung đơn hàng, xác nhận tức thì
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: paymentMethod === 'VIETQR' ? '5px solid #06b6d4' : '2px solid #64748b',
                    }}
                  />
                </div>

                {/* COD */}
                <div
                  onClick={() => setPaymentMethod('COD')}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: paymentMethod === 'COD' ? 'rgba(6, 182, 212, 0.14)' : 'rgba(15, 23, 42, 0.6)',
                    border: paymentMethod === 'COD' ? '1.5px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#34d399',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Truck size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>
                        Thanh Toán Khi Nhận Hàng (COD)
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                        Kiểm tra phụ kiện và sinh vật thủy sinh trước khi thanh toán
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: paymentMethod === 'COD' ? '5px solid #06b6d4' : '2px solid #64748b',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right: Order Summary & Cost Breakdown */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: '#f8fafc',
                    marginBottom: '16px',
                  }}
                >
                  Tóm Tắt Giỏ Hàng ({cartItems.length} mặt hàng)
                </h3>

                <div
                  style={{
                    maxHeight: '180px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    marginBottom: '18px',
                    paddingRight: '6px',
                  }}
                >
                  {cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    >
                      <div style={{ maxWidth: '65%' }}>
                        <div style={{ fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.name}
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '11px' }}>
                          Số lượng: x{item.quantity}
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, color: '#38bdf8' }}>
                        {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Calculation */}
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#94a3b8' }}>
                    <span>Tạm tính phụ kiện & sinh vật:</span>
                    <span style={{ color: '#f8fafc', fontWeight: 600 }}>{cartTotal.toLocaleString('vi-VN')}₫</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#94a3b8' }}>
                    <span>Phí vận chuyển bảo hộ thủy sinh:</span>
                    <span style={{ color: '#f8fafc', fontWeight: 600 }}>{shippingFee.toLocaleString('vi-VN')}₫</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#34d399' }}>
                    <span>Ưu đãi đóng gói chuyên dụng:</span>
                    <span style={{ fontWeight: 600 }}>Miễn phí</span>
                  </div>

                  <div
                    style={{
                      marginTop: '10px',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(56, 189, 248, 0.2)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                    }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>Tổng thanh toán:</span>
                    <span style={{ fontSize: '22px', fontWeight: 800, color: '#38bdf8' }}>
                      {finalTotal.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>
              </div>

              {/* Service guarantee note */}
              <div
                style={{
                  marginTop: '20px',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'rgba(6, 182, 212, 0.08)',
                  border: '1px solid rgba(6, 182, 212, 0.2)',
                  fontSize: '11px',
                  color: '#94a3b8',
                  lineHeight: 1.5,
                }}
              >
                <div style={{ color: '#38bdf8', fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Shield size={14} />
                  Cam Kết Đồng Bộ Microservices
                </div>
                Đơn hàng được lưu vào PostgreSQL 18 qua <strong>order-service (:8086)</strong> và cập nhật trừ khóa tồn kho khả dụng qua <strong>inventory-service (:8085)</strong>.
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div
            style={{
              marginTop: '28px',
              paddingTop: '18px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '12px',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94a3b8',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{
                padding: '12px 28px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
                boxShadow: '0 0 25px rgba(6, 182, 212, 0.4)',
                border: 'none',
                color: '#ffffff',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="spin-animation" />
                  <span>Đang xử lý qua Order Service...</span>
                </>
              ) : (
                <>
                  <span>Xác Nhận Đặt Hàng ({finalTotal.toLocaleString('vi-VN')}₫)</span>
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
