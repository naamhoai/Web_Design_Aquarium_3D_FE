import React, { useState } from 'react';
import {
  CheckCircle2, Copy, Check, QrCode, Building2,
  Truck, ArrowRight, Activity, X
} from 'lucide-react';
import type { OrderResponseData } from '../services/api';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderResponseData | null;
  onOpenTelemetry?: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
  order,
  onOpenTelemetry,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const isVietQr = order.paymentMethod === 'VIETQR';
  const qrUrl = `https://img.vietqr.io/image/MB-0901234567-compact2.png?amount=${order.finalAmount}&addInfo=${order.orderNumber}&accountName=AQUARIUM%20DESIGN%20VIETNAM`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(2, 6, 12, 0.88)',
        backdropFilter: 'blur(14px)',
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
          maxWidth: '760px',
          background: 'linear-gradient(180deg, #0b1320 0%, #070d17 100%)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '24px',
          boxShadow: '0 30px 75px -15px rgba(0, 0, 0, 0.85), 0 0 35px rgba(16, 185, 129, 0.15)',
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
            padding: '24px 28px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(16, 185, 129, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#34d399',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
              }}
            >
              <CheckCircle2 size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '20px',
                    fontWeight: 800,
                    fontFamily: 'var(--font-heading)',
                    color: '#f8fafc',
                  }}
                >
                  Đặt Hàng Thành Công!
                </h2>
                <span
                  style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    color: '#34d399',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '12px',
                  }}
                >
                  {order.status}
                </span>
              </div>
              <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#94a3b8' }}>
                Hệ thống backend đã lưu đơn và phân bổ Sub-Orders đến xưởng cung ứng
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
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ overflowY: 'auto', padding: '24px 28px', flex: 1 }}>
          {/* Order Reference Banner */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: '16px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '22px',
            }}
          >
            <div>
              <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>MÃ ĐƠN HÀNG HỆ THỐNG</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.5px' }}>
                {order.orderNumber}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => handleCopy(order.orderNumber, 'orderNumber')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#38bdf8',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {copiedField === 'orderNumber' ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedField === 'orderNumber' ? 'Đã chép mã!' : 'Sao chép mã'}</span>
              </button>
            </div>
          </div>

          {/* VietQR or Payment Section */}
          {isVietQr ? (
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(15, 23, 42, 0.7) 100%)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 700, fontSize: '14px', marginBottom: '14px' }}>
                <QrCode size={18} />
                Quét Mã VietQR Chuyển Khoản Tự Động (Napas 24/7)
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: '20px', alignItems: 'center' }}>
                {/* QR Image */}
                <div
                  style={{
                    background: '#ffffff',
                    padding: '8px',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                    textAlign: 'center',
                  }}
                >
                  <img
                    src={qrUrl}
                    alt="VietQR Payment"
                    style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '6px' }}
                  />
                  <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, display: 'block', marginTop: '4px' }}>
                    Quét bằng mọi App Ngân hàng
                  </span>
                </div>

                {/* Bank Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#94a3b8' }}>Ngân hàng thụ hưởng:</span>
                    <span style={{ fontWeight: 700, color: '#f8fafc' }}>MB Bank (Quân Đội)</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                    <span style={{ color: '#94a3b8' }}>Số tài khoản:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 700, color: '#38bdf8', letterSpacing: '0.5px' }}>0901234567</span>
                      <button
                        onClick={() => handleCopy('0901234567', 'account')}
                        style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                        title="Sao chép số tài khoản"
                      >
                        {copiedField === 'account' ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#94a3b8' }}>Chủ tài khoản:</span>
                    <span style={{ fontWeight: 700, color: '#f8fafc' }}>AQUARIUM DESIGN VIETNAM</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                    <span style={{ color: '#94a3b8' }}>Số tiền chuyển khoản:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 800, color: '#34d399', fontSize: '15px' }}>
                        {order.finalAmount.toLocaleString('vi-VN')}₫
                      </span>
                      <button
                        onClick={() => handleCopy(order.finalAmount.toString(), 'amount')}
                        style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                        title="Sao chép số tiền"
                      >
                        {copiedField === 'amount' ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                    <span style={{ color: '#94a3b8' }}>Nội dung chuyển khoản:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 700, color: '#fbbf24' }}>{order.orderNumber}</span>
                      <button
                        onClick={() => handleCopy(order.orderNumber, 'memo')}
                        style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                        title="Sao chép nội dung"
                      >
                        {copiedField === 'memo' ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '16px',
                padding: '18px 20px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <Truck size={24} color="#34d399" />
              <div>
                <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '14px' }}>
                  Hình Thức Thanh Toán: Tiền Mặt Khi Nhận Hàng (COD)
                </div>
                <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>
                  Bộ phận CSKH sẽ liên hệ xác nhận thông tin và điều phối kỹ thuật viên giao bể trong 24 giờ.
                </div>
              </div>
            </div>
          )}

          {/* Sub-Orders Breakdown */}
          {order.subOrders && order.subOrders.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#94a3b8',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Building2 size={15} />
                Đơn Hàng Đã Phân Tách Cho Các Showroom / Xưởng ({order.subOrders.length})
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {order.subOrders.map((so, idx) => (
                  <div
                    key={so.id || idx}
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc' }}>
                          Xưởng Cung Ứng #{idx + 1}
                        </span>
                        <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                          (Supplier ID: {so.supplierId.slice(0, 8)}...)
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#38bdf8',
                          background: 'rgba(56, 189, 248, 0.1)',
                          padding: '2px 8px',
                          borderRadius: '8px',
                        }}
                      >
                        Trạng thái: {so.status}
                      </span>
                    </div>

                    {so.items && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {so.items.map((item, itemIdx) => (
                          <div
                            key={item.id || itemIdx}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontSize: '12px',
                              color: '#cbd5e1',
                              padding: '4px 0',
                            }}
                          >
                            <span>
                              {item.productName} ({item.variantName}) x{item.quantity}
                            </span>
                            <span style={{ fontWeight: 600, color: '#f8fafc' }}>
                              {item.subtotal.toLocaleString('vi-VN')}₫
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '20px 28px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(15, 23, 42, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {onOpenTelemetry && (
            <button
              onClick={() => {
                onClose();
                onOpenTelemetry();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                color: '#38bdf8',
                padding: '10px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Activity size={16} />
              <span>Kiểm Tra Telemetry 6 Services</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="btn-primary"
            style={{
              padding: '10px 24px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              border: 'none',
              cursor: 'pointer',
              marginLeft: 'auto',
            }}
          >
            <span>Tiếp Tục Mua Sắm & Thiết Kế 3D</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
