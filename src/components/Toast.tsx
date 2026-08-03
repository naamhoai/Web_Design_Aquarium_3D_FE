import { useEffect, useState, useCallback } from 'react';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';

export type ToastKind = 'success' | 'info' | 'warning' | 'danger';

export interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
  duration?: number;
}

let pushExternal: ((t: Omit<ToastItem, 'id'>) => void) | null = null;
let nextId = 1;

export function toast(t: Omit<ToastItem, 'id'>) {
  pushExternal?.(t);
}

export function ToastStack() {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((t: Omit<ToastItem, 'id'>) => {
    setItems((prev) => [...prev, { ...t, id: nextId++ }]);
  }, []);

  useEffect(() => {
    pushExternal = push;
    return () => {
      pushExternal = null;
    };
  }, [push]);

  useEffect(() => {
    if (items.length === 0) return;
    const timers = items.map((it) =>
      window.setTimeout(() => {
        setItems((prev) => prev.filter((p) => p.id !== it.id));
      }, it.duration ?? 3000)
    );
    return () => timers.forEach((t) => clearTimeout(t));
  }, [items]);

  const dismiss = (id: number) => setItems((prev) => prev.filter((p) => p.id !== id));

  if (items.length === 0) return null;

  return (
    <div className="toast-stack bottom-left" role="status" aria-live="polite">
      {items.map((it) => (
        <ToastView key={it.id} item={it} onClose={() => dismiss(it.id)} />
      ))}
    </div>
  );
}

const icons: Record<ToastKind, React.ReactNode> = {
  success: <CheckCircle2 size={18} />,
  info: <Info size={18} />,
  warning: <AlertTriangle size={18} />,
  danger: <XCircle size={18} />,
};

function ToastView({ item, onClose }: { item: ToastItem; onClose: () => void }) {
  return (
    <div className={`toast toast-${item.kind}`}>
      <span style={{ display: 'inline-flex' }}>{icons[item.kind]}</span>
      <span style={{ flex: 1 }}>{item.message}</span>
      <button
        onClick={onClose}
        aria-label="Đóng thông báo"
        style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
