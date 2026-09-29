/**
 * Mô hình giỏ hàng phía client.
 * Mỗi dòng giỏ hàng mang danh sách `lines` = các mã SKU thật sẽ được đặt cho 1 đơn vị của dòng đó
 * (sản phẩm lẻ: 1 SKU; combo bóc tách / bể tự thiết kế: nhiều SKU).
 * Giá hiển thị chỉ mang tính tham khảo — server luôn tính lại giá theo SKU khi đặt hàng.
 */

export interface CartLine {
  sku: string;
  quantity: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
  isCustom?: boolean;
  /** Rỗng => sản phẩm chưa có trên hệ thống (dữ liệu demo), không thể đặt hàng. */
  lines: CartLine[];
}

/** Dữ liệu đầu vào khi thêm vào giỏ từ các màn hình khác nhau. */
export interface AddToCartInput {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  isCustom?: boolean;
  /** SKU đơn (sản phẩm thường). */
  sku?: string;
  /** Nhiều SKU (combo, bể tự thiết kế). Ưu tiên hơn `sku`. */
  lines?: CartLine[];
}

export function toCartLines(input: AddToCartInput): CartLine[] {
  if (input.lines && input.lines.length > 0) return input.lines.filter((l) => l.sku && l.quantity > 0);
  return input.sku ? [{ sku: input.sku, quantity: 1 }] : [];
}

/** Gộp các dòng giỏ thành danh sách SKU + số lượng gửi cho API checkout. */
export function expandCartToOrderItems(cart: CartItem[]): CartLine[] {
  const quantities = new Map<string, number>();
  for (const item of cart) {
    for (const line of item.lines) {
      quantities.set(line.sku, (quantities.get(line.sku) ?? 0) + line.quantity * item.quantity);
    }
  }
  return Array.from(quantities, ([sku, quantity]) => ({ sku, quantity }));
}

/** Các dòng không đặt được (dữ liệu demo khi backend không chạy). */
export function unorderableItems(cart: CartItem[]): CartItem[] {
  return cart.filter((item) => item.lines.length === 0);
}
