/**
 * API client cho nền tảng Bể Cá 3D — mọi request đi qua API Gateway (mặc định http://localhost:8080).
 *
 * Mô hình phiên đăng nhập (an toàn trước XSS):
 *  - Access token (JWT, sống 15 phút) CHỈ lưu trong bộ nhớ JS, không ghi vào localStorage.
 *  - Refresh token nằm trong cookie HttpOnly do server đặt → JavaScript không đọc được.
 *  - Khi tải lại trang hoặc access token hết hạn, client gọi /auth/refresh để lấy token mới.
 *  - Mọi request gửi header X-Aquarium-Client (server dùng để chống CSRF cho endpoint dùng cookie).
 */

export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message?: string;
  data: T;
  timestamp?: string;
}

/** Kết quả chuẩn hóa trả về cho UI. */
export interface ApiResult<T> {
  success: boolean;
  data?: T;
  message?: string;
  status?: number;
  fieldErrors?: Record<string, string>;
}

export interface SpringPage<T> {
  content: T[];
  page?: { size: number; number: number; totalElements: number; totalPages: number };
}

export interface BackendProduct {
  id: string;
  supplierId: string;
  categoryId: number;
  name: string;
  slug: string;
  sku: string;
  shortDescription?: string;
  basePrice: number;
  isCombo?: boolean;
  is3dCustomizable?: boolean;
  isLivestock?: boolean;
  isFragileGlass?: boolean;
  status: string;
  totalSales?: number;
  rating?: number;
  thumbnailUrl?: string;
  /** SKU dùng để đặt hàng — giá thật do server tính lại khi checkout. */
  defaultVariantId?: string;
  defaultVariantSku?: string;
  price?: number;
  originalPrice?: number;
}

export interface BackendCategory {
  id: number;
  parentId?: number;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  level: number;
}

export interface BomLayerItem {
  layerIndex: number;
  layerName: string;
  componentVariantId: string;
  componentName: string;
  sku: string;
  price: number;
  isRequired: boolean;
  canSwap: boolean;
  asset3dUrl?: string;
  boundingBox?: string;
}

export interface ExplodedBom {
  comboProductId: string;
  comboName: string;
  comboSku: string;
  totalPrice: number;
  layers: BomLayerItem[];
}

export interface UserDesignResponse {
  id: string;
  userId: string;
  name: string;
  shareSlug: string;
  shareUrl: string;
  thumbnailUrl?: string;
  tankDimensions?: string;
  sceneData?: string;
  bomSnapshot?: string;
  totalPrice: number;
  isPublic: boolean;
  viewCount: number;
  likeCount: number;
  createdAt?: string;
}

export interface DesignComponent {
  sku: string;
  quantity: number;
}

export interface SaveDesignPayload {
  name: string;
  tankDimensions: string;
  sceneData: string;
  /** Linh kiện theo SKU — server tự tính tổng giá. */
  components: DesignComponent[];
  isPublic?: boolean;
}

export type UserRole = 'CUSTOMER' | 'SUPPLIER' | 'ADMIN' | 'TECHNICIAN';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  status: string;
  emailVerified?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserProfile;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

/** Phương thức thanh toán backend hỗ trợ. "Chuyển khoản VietQR" = BANK_TRANSFER. */
export type PaymentMethod = 'COD' | 'BANK_TRANSFER';

export interface ShippingAddress {
  recipientName: string;
  phone: string;
  addressLine: string;
  ward?: string;
  district?: string;
  city?: string;
}

export interface CheckoutPayload {
  /** Giá/phí ship do server tính — client chỉ gửi SKU và số lượng. */
  items: { sku: string; quantity: number }[];
  paymentMethod: PaymentMethod;
  shippingAddress: ShippingAddress;
  customerNotes?: string;
}

export interface OrderItemResponse {
  id: string;
  subOrderId: string;
  productVariantId: string;
  sku: string;
  productName: string;
  variantName: string;
  price: number;
  quantity: number;
  subtotal: number;
  isLivestock?: boolean;
  isFragileGlass?: boolean;
}

export interface SubOrderResponse {
  id: string;
  orderId: string;
  supplierId: string;
  storeName?: string;
  subtotal: number;
  shippingFee: number;
  commissionAmount: number;
  payoutAmount: number;
  status: string;
  createdAt?: string;
  items: OrderItemResponse[];
}

export interface OrderResponseData {
  id: string;
  orderNumber: string;
  userId: string;
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  finalAmount: number;
  status: string;
  paymentMethod: PaymentMethod | string;
  paymentStatus: string;
  shippingAddress: string;
  customerNotes?: string;
  createdAt: string;
  subOrders: SubOrderResponse[];
}

export interface CompatibilityResult {
  isCompatible: boolean;
  isBioLoadSafe: boolean;
  totalBioLoad: number;
  maxBioLoadCapacity: number;
  warnings: string[];
  recommendedPhRange: string;
  recommendedTempRange: string;
}

export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
const DEFAULT_TIMEOUT_MS = 8000;
const CLIENT_HEADER = { 'X-Aquarium-Client': 'web' };
/** Chỉ là "gợi ý" có phiên cũ để thử khôi phục khi tải trang — KHÔNG chứa token. */
const SESSION_HINT_KEY = 'aquarium_session_hint';
/** Khóa cũ lưu token trong localStorage (phiên bản trước) — xóa bỏ khi khởi động. */
const LEGACY_KEYS = ['aquarium_access_token', 'aquarium_user_profile'];

// ------------------------------------------------------------------ Trạng thái phiên (trong bộ nhớ)

let accessToken: string | null = null;
let accessTokenExpiresAt = 0;
let currentUser: UserProfile | null = null;
let refreshInFlight: Promise<boolean> | null = null;
const listeners = new Set<(user: UserProfile | null) => void>();

function safeStorage(action: (s: Storage) => void) {
  try {
    action(localStorage);
  } catch {
    /* trình duyệt chặn storage — bỏ qua */
  }
}

safeStorage((s) => LEGACY_KEYS.forEach((k) => s.removeItem(k)));

function setSession(auth: AuthResponse) {
  accessToken = auth.accessToken;
  accessTokenExpiresAt = Date.now() + Math.max(30, auth.expiresIn - 30) * 1000;
  currentUser = auth.user;
  safeStorage((s) => s.setItem(SESSION_HINT_KEY, '1'));
  listeners.forEach((cb) => cb(currentUser));
}

function clearSession() {
  const hadUser = currentUser !== null;
  accessToken = null;
  accessTokenExpiresAt = 0;
  currentUser = null;
  safeStorage((s) => s.removeItem(SESSION_HINT_KEY));
  if (hadUser) listeners.forEach((cb) => cb(null));
}

// ------------------------------------------------------------------ HTTP helpers

async function rawFetch(path: string, init: RequestInit = {}, timeoutMs = DEFAULT_TIMEOUT_MS, withAuth = true): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const method = (init.method || 'GET').toUpperCase();
  const headers: Record<string, string> = {
    // Header chống CSRF chỉ cần cho request thay đổi dữ liệu; GET ẩn danh không cần → tránh preflight thừa
    ...(method === 'GET' ? {} : CLIENT_HEADER),
    ...((init.headers as Record<string, string>) || {}),
  };
  if (init.body !== undefined) headers['Content-Type'] = 'application/json';
  if (withAuth && accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  try {
    return await fetch(path.startsWith('http') ? path : API_BASE_URL + path, {
      ...init,
      headers,
      credentials: 'include', // cần để trình duyệt nhận/gửi cookie refresh (HttpOnly)
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

/** Làm mới access token bằng cookie refresh. Gộp các lời gọi đồng thời thành một (single-flight). */
function refreshAccessToken(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const res = await rawFetch('/auth/refresh', { method: 'POST' }, DEFAULT_TIMEOUT_MS, false);
        if (!res.ok) {
          clearSession();
          return false;
        }
        const json: ApiResponse<AuthResponse> = await res.json();
        setSession(json.data);
        return true;
      } catch {
        return false;
      } finally {
        refreshInFlight = null;
      }
    })();
  }
  return refreshInFlight;
}

async function toResult<T>(res: Response): Promise<ApiResult<T>> {
  let json: Partial<ApiResponse<unknown>> | null = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }
  if (res.ok && json?.success !== false) {
    return { success: true, data: json?.data as T, status: res.status, message: json?.message };
  }
  const fieldErrors = json && json.data && typeof json.data === 'object' && !Array.isArray(json.data)
    ? (json.data as Record<string, string>)
    : undefined;
  let message = json?.message;
  if (!message) {
    message = res.status === 429 ? 'Bạn thao tác quá nhanh, vui lòng thử lại sau ít phút' : `Lỗi máy chủ (${res.status})`;
  }
  if (fieldErrors && Object.keys(fieldErrors).length > 0) {
    message = `${message}: ${Object.values(fieldErrors)[0]}`;
  }
  return { success: false, status: res.status, message, fieldErrors };
}

/**
 * Gọi API có kèm access token (nếu có). Hết hạn → tự làm mới rồi thử lại đúng 1 lần.
 * requireAuth=true: chưa đăng nhập thì trả lỗi 401 ngay, không gọi mạng.
 */
async function request<T>(path: string, init: RequestInit = {}, options: { requireAuth?: boolean; timeoutMs?: number } = {}): Promise<ApiResult<T>> {
  try {
    if (accessToken && Date.now() >= accessTokenExpiresAt) {
      await refreshAccessToken();
    }
    if (options.requireAuth && !accessToken) {
      return { success: false, status: 401, message: 'Vui lòng đăng nhập để tiếp tục' };
    }
    let res = await rawFetch(path, init, options.timeoutMs);
    if (res.status === 401 && accessToken) {
      const refreshed = await refreshAccessToken();
      if (refreshed) res = await rawFetch(path, init, options.timeoutMs);
    }
    return await toResult<T>(res);
  } catch (err) {
    const aborted = err instanceof DOMException && err.name === 'AbortError';
    return {
      success: false,
      message: aborted ? 'Máy chủ phản hồi quá chậm, vui lòng thử lại' : 'Không thể kết nối tới máy chủ (API Gateway)',
    };
  }
}

const json = (body: unknown): RequestInit['body'] => JSON.stringify(body);

// ------------------------------------------------------------------ Public API

export const api = {
  /** Đăng ký nghe thay đổi phiên (đăng nhập / đăng xuất / hết phiên). Trả về hàm hủy. */
  onSessionChange(cb: (user: UserProfile | null) => void): () => void {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },

  getCurrentUser(): UserProfile | null {
    return currentUser;
  },

  /** Khôi phục phiên khi tải trang (dùng cookie refresh HttpOnly). */
  async restoreSession(): Promise<UserProfile | null> {
    let hasHint = false;
    safeStorage((s) => {
      hasHint = s.getItem(SESSION_HINT_KEY) === '1';
    });
    if (!hasHint) return null;
    const ok = await refreshAccessToken();
    return ok ? currentUser : null;
  },

  async checkHealth(): Promise<boolean> {
    try {
      const res = await rawFetch('/categories', { method: 'GET' }, 2500, false);
      return res.ok;
    } catch {
      return false;
    }
  },

  async login(payload: LoginPayload): Promise<ApiResult<AuthResponse>> {
    const result = await request<AuthResponse>('/auth/login', { method: 'POST', body: json(payload) });
    if (result.success && result.data) setSession(result.data);
    return result;
  },

  async register(payload: RegisterPayload): Promise<ApiResult<AuthResponse>> {
    const result = await request<AuthResponse>('/auth/register', { method: 'POST', body: json(payload) });
    if (result.success && result.data) setSession(result.data);
    return result;
  },

  async logout(): Promise<void> {
    try {
      await rawFetch('/auth/logout', { method: 'POST' }, 4000, false);
    } catch {
      /* vẫn xóa phiên phía client dù server không phản hồi */
    }
    clearSession();
  },

  getProfile(): Promise<ApiResult<UserProfile>> {
    return request<UserProfile>('/auth/me', {}, { requireAuth: true });
  },

  async getCategories(): Promise<BackendCategory[] | null> {
    const result = await request<BackendCategory[]>('/categories');
    return result.success && result.data ? result.data : null;
  },

  async getProducts(params?: { categoryId?: number; page?: number; size?: number }): Promise<BackendProduct[] | null> {
    const query = new URLSearchParams();
    if (params?.categoryId) query.set('categoryId', String(params.categoryId));
    if (params?.page !== undefined) query.set('page', String(params.page));
    query.set('size', String(params?.size || 20));
    const result = await request<SpringPage<BackendProduct>>(`/products?${query.toString()}`);
    return result.success && result.data ? result.data.content : null;
  },

  async get3DCombos(): Promise<BackendProduct[] | null> {
    const result = await request<BackendProduct[]>('/products/3d-combos');
    return result.success && result.data ? result.data : null;
  },

  async getExplodedBom(productIdOrSku: string): Promise<ExplodedBom | null> {
    const result = await request<ExplodedBom>(`/3d/boms/${encodeURIComponent(productIdOrSku)}/exploded-view`);
    return result.success && result.data ? result.data : null;
  },

  async checkCompatibility(speciesIds: number[], tankVolumeLiters: number, quantities: Record<number, number>): Promise<CompatibilityResult | null> {
    const result = await request<CompatibilityResult>('/3d/biology/check-compatibility', {
      method: 'POST',
      body: json({ speciesIds, tankVolumeLiters, quantities }),
    });
    return result.success && result.data ? result.data : null;
  },

  save3DDesign(payload: SaveDesignPayload): Promise<ApiResult<UserDesignResponse>> {
    return request<UserDesignResponse>('/3d/designs', { method: 'POST', body: json(payload) }, { requireAuth: true });
  },

  async getDesignBySlug(slug: string): Promise<UserDesignResponse | null> {
    if (!/^design-[a-f0-9]{8,32}$/.test(slug)) return null;
    const result = await request<UserDesignResponse>(`/3d/designs/share/${slug}`);
    return result.success && result.data ? result.data : null;
  },

  checkoutOrder(payload: CheckoutPayload): Promise<ApiResult<OrderResponseData>> {
    return request<OrderResponseData>('/orders/checkout', { method: 'POST', body: json(payload) }, { requireAuth: true, timeoutMs: 15000 });
  },

  getOrderById(orderId: string): Promise<ApiResult<OrderResponseData>> {
    return request<OrderResponseData>(`/orders/${encodeURIComponent(orderId)}`, {}, { requireAuth: true });
  },

  getOrderByNumber(orderNumber: string): Promise<ApiResult<OrderResponseData>> {
    return request<OrderResponseData>(`/orders/number/${encodeURIComponent(orderNumber)}`, {}, { requireAuth: true });
  },

  getMyOrders(): Promise<ApiResult<OrderResponseData[]>> {
    return request<OrderResponseData[]>('/orders/me', {}, { requireAuth: true });
  },

  /**
   * Đo độ trễ & trạng thái từng microservice qua Gateway.
   * 401/403 vẫn tính là "online" (service đang chạy, chỉ là endpoint cần đăng nhập).
   */
  async checkServicesTelemetry(): Promise<{
    services: { name: string; serviceId: string; port: number; targetEndpoint: string; online: boolean; latencyMs: number }[];
    overallOnline: boolean;
  }> {
    const checks = [
      { name: 'API Gateway + Catalog', serviceId: 'gateway-service', port: 8080, targetEndpoint: '/categories' },
      { name: 'Identity Service (Auth/JWT)', serviceId: 'identity-service', port: 8081, targetEndpoint: '/auth/me' },
      { name: 'Supplier Service (Gian hàng)', serviceId: 'supplier-service', port: 8082, targetEndpoint: '/suppliers/aquaart-hanoi' },
      { name: 'Catalog Service (Sản Phẩm)', serviceId: 'catalog-service', port: 8083, targetEndpoint: '/products?size=1' },
      { name: 'Aquarium 3D Service (BOM & Thiết Kế)', serviceId: 'aquarium-3d-service', port: 8084, targetEndpoint: '/3d/biology/rules' },
      { name: 'Inventory Service (Kho & Trại Cá)', serviceId: 'inventory-service', port: 8085, targetEndpoint: '/inventory/alerts/low-stock' },
      { name: 'Order Service (Đơn Hàng & Giỏ)', serviceId: 'order-service', port: 8086, targetEndpoint: '/orders/me' },
    ];

    const services = await Promise.all(
      checks.map(async (chk) => {
        const start = performance.now();
        try {
          const res = await rawFetch(chk.targetEndpoint, { method: 'GET' }, 3000);
          const latencyMs = Math.round(performance.now() - start);
          const online = res.ok || res.status === 401 || res.status === 403 || res.status === 404;
          return { ...chk, online, latencyMs };
        } catch {
          return { ...chk, online: false, latencyMs: 0 };
        }
      })
    );
    return { services, overallOnline: services.some((s) => s.online) };
  },
};
