/**
 * API Client Service for 3D Aquarium Platform
 * Connects Frontend (React 19 / Three.js) with Backend Microservices via API Gateway (Port 8080)
 */

export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message?: string;
  data: T;
  timestamp?: string;
}

export interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
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
  description?: string;
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
  tankDimensions: string;
  sceneData: string;
  bomSnapshot: string;
  totalPrice: number;
  isPublic: boolean;
  viewCount: number;
  likeCount: number;
  createdAt?: string;
}

export interface SaveDesignPayload {
  userId?: string;
  name: string;
  tankDimensions: string;
  sceneData: string;
  bomSnapshot: string;
  totalPrice: number;
  thumbnailUrl?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: 'CUSTOMER' | 'SUPPLIER' | 'ADMIN' | 'TECHNICIAN';
  status: string;
  emailVerified?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
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

export interface AddToCartPayload {
  userId: string;
  productVariantId: string;
  quantity?: number;
  userDesignId?: string;
  customConfiguration?: string;
}

export interface CheckoutPayload {
  userId: string;
  shippingAddress: string;
  paymentMethod?: 'COD' | 'VIETQR' | 'CREDIT_CARD';
  customerNotes?: string;
  shippingFee?: number;
  discountAmount?: number;
  recipientName?: string;
  recipientPhone?: string;
}

export interface OrderItemResponse {
  id: string;
  productVariantId: string;
  sku: string;
  productName: string;
  variantName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  customConfiguration?: string;
}

export interface SubOrderResponse {
  id: string;
  subOrderNumber: string;
  supplierId: string;
  storeName: string;
  totalAmount: number;
  shippingFee: number;
  finalAmount: number;
  status: string;
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
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: string;
  customerNotes?: string;
  createdAt: string;
  subOrders: SubOrderResponse[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
const DEFAULT_TIMEOUT_MS = 6000;

const TOKEN_KEY = 'aquarium_access_token';
const USER_KEY = 'aquarium_user_profile';

export const authStorage = {
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  setAuth(auth: AuthResponse): void {
    try {
      localStorage.setItem(TOKEN_KEY, auth.accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
    } catch (e) {
      console.error(e);
    }
  },
  getUser(): UserProfile | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  clear(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.error(e);
    }
  },
};

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const token = authStorage.getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const api = {
  /**
   * Health check to detect whether the Spring Cloud Gateway & Backend are online
   */
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/categories`, { method: 'GET' }, 2500);
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Đăng nhập qua Identity Service (Cổng 8080 -> 8081)
   */
  async login(payload: LoginPayload): Promise<{ success: boolean; data?: AuthResponse; message?: string }> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const json: ApiResponse<AuthResponse> = await res.json();
      if (res.ok && json.success) {
        authStorage.setAuth(json.data);
        return { success: true, data: json.data };
      }
      return { success: false, message: json.message || 'Đăng nhập không thành công' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Không thể kết nối tới Backend Identity Service' };
    }
  },

  /**
   * Đăng ký tài khoản qua Identity Service
   */
  async register(payload: RegisterPayload): Promise<{ success: boolean; data?: AuthResponse; message?: string }> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const json: ApiResponse<AuthResponse> = await res.json();
      if (res.ok && json.success) {
        authStorage.setAuth(json.data);
        return { success: true, data: json.data };
      }
      return { success: false, message: json.message || 'Đăng ký không thành công' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Không thể kết nối tới Backend Identity Service' };
    }
  },

  /**
   * Lấy thông tin tài khoản hiện tại từ token JWT
   */
  async getProfile(): Promise<UserProfile | null> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/auth/me`);
      if (!res.ok) return null;
      const json: ApiResponse<UserProfile> = await res.json();
      return json.success ? json.data : null;
    } catch {
      return null;
    }
  },

  /**
   * Đăng xuất
   */
  logout(): void {
    authStorage.clear();
  },

  /**
   * Get all active categories from Catalog Service
   */
  async getCategories(): Promise<BackendCategory[] | null> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/categories`);
      if (!res.ok) return null;
      const json: ApiResponse<BackendCategory[]> = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.warn('[API] getCategories failed, using fallback:', err);
      return null;
    }
  },

  /**
   * Get products with pagination and category filter
   */
  async getProducts(params?: { categoryId?: number; page?: number; size?: number }): Promise<BackendProduct[] | null> {
    try {
      const query = new URLSearchParams();
      if (params?.categoryId) query.set('categoryId', String(params.categoryId));
      if (params?.page !== undefined) query.set('page', String(params.page));
      query.set('size', String(params?.size || 20));

      const res = await fetchWithTimeout(`${API_BASE_URL}/products?${query.toString()}`);
      if (!res.ok) return null;
      const json: ApiResponse<SpringPage<BackendProduct>> = await res.json();
      return json.success ? json.data.content : null;
    } catch (err) {
      console.warn('[API] getProducts failed, using fallback:', err);
      return null;
    }
  },

  /**
   * Get 3D customizable aquarium combos
   */
  async get3DCombos(): Promise<BackendProduct[] | null> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/products/3d-combos`);
      if (!res.ok) return null;
      const json: ApiResponse<BackendProduct[]> = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.warn('[API] get3DCombos failed, using fallback:', err);
      return null;
    }
  },

  /**
   * Get exploded 6-layer BOM for 3D simulation
   */
  async getExplodedBom(productIdOrSku: string): Promise<ExplodedBom | null> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/3d/boms/${productIdOrSku}/exploded-view`);
      if (!res.ok) return null;
      const json: ApiResponse<ExplodedBom> = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.warn('[API] getExplodedBom failed, using fallback:', err);
      return null;
    }
  },

  /**
   * Lưu cấu hình thiết kế 3D vào PostgreSQL qua Aquarium 3D Service
   */
  async save3DDesign(payload: SaveDesignPayload): Promise<{ success: boolean; data?: UserDesignResponse; message?: string }> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/3d/designs`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const json: ApiResponse<UserDesignResponse> = await res.json();
      if (res.ok && json.success) {
        return { success: true, data: json.data };
      }
      return { success: false, message: json.message || 'Lưu thiết kế không thành công' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Không thể kết nối tới Aquarium 3D Service' };
    }
  },

  /**
   * Lấy cấu hình thiết kế 3D theo mã chia sẻ (shareSlug) từ Database
   */
  async getDesignBySlug(slug: string): Promise<UserDesignResponse | null> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/3d/designs/share/${slug}`);
      if (!res.ok) return null;
      const json: ApiResponse<UserDesignResponse> = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.warn('[API] getDesignBySlug failed:', err);
      return null;
    }
  },

  /**
   * Thêm sản phẩm hoặc combo 3D vào giỏ hàng lưu DB (Port 8080 -> 8086)
   */
  async addToCartDB(payload: AddToCartPayload): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/cart/items`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const json: ApiResponse<any> = await res.json();
      if (res.ok && json.success) {
        return { success: true, data: json.data };
      }
      return { success: false, message: json.message || 'Không thể thêm vào giỏ hàng DB' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Lỗi kết nối Order & Cart Service' };
    }
  },

  /**
   * Đặt hàng và tự động bóc tách Master Order & Sub-Orders cho từng Shop (Port 8080 -> 8086)
   */
  async checkoutOrder(payload: CheckoutPayload): Promise<{ success: boolean; data?: OrderResponseData; message?: string }> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/orders/checkout`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const json: ApiResponse<OrderResponseData> = await res.json();
      if (res.ok && json.success) {
        return { success: true, data: json.data };
      }
      return { success: false, message: json.message || 'Đặt hàng không thành công' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Không thể kết nối tới Order Service' };
    }
  },

  /**
   * Tra cứu đơn hàng theo ID
   */
  async getOrderById(orderId: string): Promise<OrderResponseData | null> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/orders/${orderId}`);
      if (!res.ok) return null;
      const json: ApiResponse<OrderResponseData> = await res.json();
      return json.success ? json.data : null;
    } catch {
      return null;
    }
  },

  /**
   * Tra cứu đơn hàng theo Mã Đơn (VD: ORD-20260918-XXXX)
   */
  async getOrderByNumber(orderNumber: string): Promise<OrderResponseData | null> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/orders/number/${orderNumber}`);
      if (!res.ok) return null;
      const json: ApiResponse<OrderResponseData> = await res.json();
      return json.success ? json.data : null;
    } catch {
      return null;
    }
  },

  /**
   * Lấy lịch sử đơn hàng của một người dùng
   */
  async getOrdersByUser(userId: string): Promise<OrderResponseData[]> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/orders/user/${userId}`);
      if (!res.ok) return [];
      const json: ApiResponse<OrderResponseData[]> = await res.json();
      return json.success ? json.data : [];
    } catch {
      return [];
    }
  },

  /**
   * Đo kiểm độ trễ và trạng thái sống của toàn bộ 6 Microservices Backend qua Gateway
   */
  async checkServicesTelemetry(): Promise<{
    services: {
      name: string;
      serviceId: string;
      port: number;
      targetEndpoint: string;
      online: boolean;
      latencyMs: number;
    }[];
    overallOnline: boolean;
  }> {
    const checks = [
      {
        name: 'API Gateway',
        serviceId: 'gateway-service',
        port: 8080,
        targetEndpoint: `${API_BASE_URL}/categories`,
      },
      {
        name: 'Identity Service (Auth/JWT)',
        serviceId: 'identity-service',
        port: 8081,
        targetEndpoint: `${API_BASE_URL}/auth/me`,
      },
      {
        name: 'Catalog Service (Sản Phẩm)',
        serviceId: 'catalog-service',
        port: 8083,
        targetEndpoint: `${API_BASE_URL}/categories`,
      },
      {
        name: 'Aquarium 3D Service (BOM & Thiết Kế)',
        serviceId: 'aquarium-3d-service',
        port: 8084,
        targetEndpoint: `${API_BASE_URL}/3d/boms/COMBO-NANO-30/exploded-view`,
      },
      {
        name: 'Inventory Service (Kho & Trại Cá)',
        serviceId: 'inventory-service',
        port: 8085,
        targetEndpoint: `${API_BASE_URL}/inventory/alerts/low-stock`,
      },
      {
        name: 'Order Service (Đơn Hàng & Giỏ DB)',
        serviceId: 'order-service',
        port: 8086,
        targetEndpoint: `${API_BASE_URL}/orders/user/a0000000-0000-0000-0000-000000000005`,
      },
    ];

    const results = await Promise.all(
      checks.map(async (chk) => {
        const start = performance.now();
        try {
          const res = await fetchWithTimeout(chk.targetEndpoint, { method: 'GET' }, 3000);
          const latencyMs = Math.round(performance.now() - start);
          const isAlive = res.ok || res.status === 401 || res.status === 403 || res.status === 404;
          return {
            ...chk,
            online: isAlive,
            latencyMs,
          };
        } catch {
          return {
            ...chk,
            online: false,
            latencyMs: 0,
          };
        }
      })
    );

    const overallOnline = results.some((r) => r.online);
    return {
      services: results,
      overallOnline,
    };
  },
};

