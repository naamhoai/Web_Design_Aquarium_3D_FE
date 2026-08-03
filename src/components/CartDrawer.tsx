import { Trash2, ShoppingBag, Plus, Minus, Heart } from 'lucide-react';
import { Drawer } from './Drawer';
import { Button } from './Button';
import { IconButton } from './IconButton';
import { GlassPanel } from './GlassPanel';
import { toast } from './Toast';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  description: string;
  quantity: number;
  isCustom?: boolean;
}

export interface CartDrawerProps {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdate: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  onContinue: () => void;
  checkoutSuccess: boolean;
}

export function CartDrawer({
  open,
  items,
  onClose,
  onUpdate,
  onRemove,
  onCheckout,
  onContinue,
  checkoutSuccess,
}: CartDrawerProps) {
  const total = items.reduce((acc, it) => acc + it.price * it.quantity, 0);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Giỏ Hàng Của Bạn"
      labelledBy="cart-title"
      footer={
        items.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                color: 'var(--color-text-secondary)',
                fontSize: 13,
              }}
            >
              <span>Tổng cộng</span>
              <strong
                style={{
                  color: '#fff',
                  fontFamily: 'var(--font-display)',
                  fontSize: 22,
                }}
              >
                {total.toLocaleString('vi-VN')}₫
              </strong>
            </div>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              iconRight={<Heart size={16} />}
              onClick={() => {
                onCheckout();
                toast({ kind: 'success', message: '🎉 Đặt hàng thành công! Đội ngũ AquaRealm sẽ liên lạc với bạn.' });
              }}
            >
              Đặt Hàng
            </Button>
          </div>
        ) : null
      }
    >
      {checkoutSuccess && (
        <GlassPanel
          depth={1}
          bordered
          style={{
            padding: 16,
            marginBottom: 16,
            textAlign: 'center',
            color: '#fff',
            background: 'rgba(34, 197, 94, 0.1)',
            borderColor: 'var(--color-success)',
          }}
        >
          🎉 Đặt hàng thành công! Đội ngũ AquaRealm sẽ sớm liên lạc để vận chuyển.
        </GlassPanel>
      )}

      {items.length === 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
            padding: '40px 0',
            color: 'var(--color-text-secondary)',
            textAlign: 'center',
          }}
        >
          <ShoppingBag size={42} color="var(--color-primary)" />
          <p style={{ fontSize: 14 }}>Giỏ hàng của bạn đang trống.</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              onContinue();
              onClose();
            }}
          >
            Tiếp tục mua sắm
          </Button>
        </div>
      ) : (
        <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {items.map((it, idx) => (
            <GlassPanel
              key={it.id}
              bordered
              style={{
                padding: 12,
                display: 'grid',
                gridTemplateColumns: '64px 1fr',
                gap: 12,
                ['--i' as string]: idx,
              } as React.CSSProperties}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 12,
                  background: it.image
                    ? `url(${it.image}) center/cover`
                    : 'linear-gradient(135deg, rgba(94,234,212,0.2), rgba(52,211,153,0.2))',
                  flexShrink: 0,
                }}
                aria-hidden
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <strong style={{ color: '#fff', fontSize: 13, lineHeight: 1.3 }}>{it.name}</strong>
                  <IconButton
                    size="sm"
                    label="Xóa khỏi giỏ"
                    onClick={() => onRemove(it.id)}
                    icon={<Trash2 size={14} />}
                  />
                </div>
                {it.description && (
                  <span style={{ color: 'var(--color-text-muted)', fontSize: 11, lineHeight: 1.4 }}>
                    {it.description}
                  </span>
                )}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 'auto',
                  }}
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      background: 'rgba(94, 234, 212, 0.06)',
                      border: '1px solid var(--glass-1-border)',
                      borderRadius: 999,
                      padding: 2,
                    }}
                  >
                    <IconButton
                      size="sm"
                      label="Giảm số lượng"
                      onClick={() => onUpdate(it.id, it.quantity - 1)}
                      icon={<Minus size={12} />}
                    />
                    <span
                      aria-live="polite"
                      style={{
                        minWidth: 24,
                        textAlign: 'center',
                        fontWeight: 700,
                        fontSize: 12,
                        color: '#fff',
                      }}
                    >
                      {it.quantity}
                    </span>
                    <IconButton
                      size="sm"
                      label="Tăng số lượng"
                      onClick={() => onUpdate(it.id, it.quantity + 1)}
                      icon={<Plus size={12} />}
                    />
                  </div>
                  <strong
                    style={{
                      color: 'var(--color-primary)',
                      fontSize: 13,
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    {(it.price * it.quantity).toLocaleString('vi-VN')}₫
                  </strong>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      )}
    </Drawer>
  );
}
