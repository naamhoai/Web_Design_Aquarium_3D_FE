import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Tag, Fish, Layers, Leaf, Wrench, ChevronRight, Box, Sparkles, Database } from 'lucide-react';
import { Product3DModal } from './Product3DModal';
import { api } from '../services/api';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  description: string;
  badge?: string;
  badgeColor?: string;
}

interface ProductCatalogProps {
  onAddToCart: (product: Product) => void;
}

const PRODUCTS: Product[] = [
  {
    id: 'nano-cube-30',
    name: 'Bể Nano Cube Studio 30×30×35cm',
    price: 1650000,
    originalPrice: 1950000,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80',
    category: 'Bể Kính',
    rating: 5,
    reviewCount: 142,
    description: 'Kính siêu trong Opti-White 8mm 4 mặt vát cạnh giấu keo, chuẩn Studio 360° sang trọng.',
    badge: 'Video Showcase',
    badgeColor: '#06b6d4',
  },
  {
    id: 'cantilever-led',
    name: 'Đèn LED Cantilever Nhôm CNC Vát Cạnh',
    price: 1350000,
    originalPrice: 1600000,
    image: 'https://images.unsplash.com/photo-1592571350791-6af43e8a5f76?w=600&auto=format&fit=crop&q=80',
    category: 'Thiết Bị',
    rating: 4.9,
    reviewCount: 88,
    description: 'Chân kẹp cần vươn cantilever tối giản, chip LED Full Spectrum 6500K kích thích quang hợp.',
    badge: 'Bestseller',
    badgeColor: '#f59e0b',
  },
  {
    id: 'bonsai-taiwan-moss',
    name: 'Lũa Bonsai Nghệ Thuật Đính Rêu Taiwan',
    price: 850000,
    image: 'https://images.unsplash.com/photo-1623159619614-96fe025f9b2e?w=600&auto=format&fit=crop&q=80',
    category: 'Cây & Lũa',
    rating: 5,
    reviewCount: 215,
    description: 'Gốc lũa tạo hình cổ thụ đính tán rêu xanh mướt, ngâm chìm tự nhiên, chuẩn bố cục video.',
    badge: 'Thủ Công',
    badgeColor: '#10b981',
  },
  {
    id: 'neon-tetra-pack',
    name: 'Đàn Cá Neon Dạ Quang (Set 15 Con)',
    price: 250000,
    originalPrice: 320000,
    image: 'https://images.unsplash.com/photo-1520302630591-fd1f8dc09e6b?w=600&auto=format&fit=crop&q=80',
    category: 'Cá Cảnh',
    rating: 4.9,
    reviewCount: 310,
    description: 'Cá Neon Cardinal lấp lánh ánh xanh lục quang, bơi đàn sinh động quanh cụm bonsai.',
    badge: 'Bơi Đàn',
    badgeColor: '#38bdf8',
  },
  {
    id: 'silent-flow-filter',
    name: 'Hệ Lọc Ngầm Tuần Hoàn Silent-Flow',
    price: 2200000,
    originalPrice: 2600000,
    image: 'https://images.unsplash.com/photo-1497752531616-c3afd9760a11?w=600&auto=format&fit=crop&q=80',
    category: 'Thiết Bị',
    rating: 5,
    reviewCount: 94,
    description: 'Thiết kế bóc tách giấu ngầm đáy hồ, bơm DC 12V êm tuyệt đối dưới 18dB, lọc 4 tầng.',
    badge: 'Công Nghệ',
    badgeColor: '#8b5cf6',
  },
  {
    id: 'ada-amazonia-soil',
    name: 'Phân Nền Thủy Sinh ADA Amazonia Ver.2 (9L)',
    price: 680000,
    image: 'https://images.unsplash.com/photo-1566910842098-729a1f9b9b9f?w=600&auto=format&fit=crop&q=80',
    category: 'Cây & Lũa',
    rating: 4.8,
    reviewCount: 178,
    description: 'Hạt đất sét nung giàu acid humic và vi lượng, ổn định pH 6.2 - 6.8 cho cây phát triển rực rỡ.',
    badge: 'Chính Hãng',
    badgeColor: '#059669',
  },
  {
    id: 'koi-kohaku-3d',
    name: 'Cá Chép Koi Kohaku Nhật Bản Tuyển Chọn',
    price: 4500000,
    originalPrice: 5500000,
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&auto=format&fit=crop&q=80',
    category: 'Cá Cảnh',
    rating: 5,
    reviewCount: 65,
    description: 'Khoang đỏ Beni rực rỡ trên nền trắng Shiroji tinh khiết, giấy khai sinh trại Dainichi.',
    badge: 'VIP',
    badgeColor: '#ef4444',
  },
  {
    id: 'acrylic-cylinder-panorama',
    name: 'Bể Trụ Tròn Acrylic 360° Panorama',
    price: 3200000,
    image: 'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=600&auto=format&fit=crop&q=80',
    category: 'Bể Kính',
    rating: 4.7,
    reviewCount: 52,
    description: 'Liền mạch 360 độ không vết nối, đế composite sang trọng tích hợp đèn đổi màu RGB.',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Tất Cả Sản Phẩm', icon: <Layers size={15} /> },
  { id: 'Bể Kính', label: 'Bể Kính Studio', icon: <Layers size={15} /> },
  { id: 'Thiết Bị', label: 'Hệ Thiết Bị Modular', icon: <Wrench size={15} /> },
  { id: 'Cá Cảnh', label: 'Cá Cảnh & Đàn Neon', icon: <Fish size={15} /> },
  { id: 'Cây & Lũa', label: 'Lũa Bonsai & Nền', icon: <Leaf size={15} /> },
];

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [addedId, setAddedId] = useState<string | null>(null);
  const [selected3DProduct, setSelected3DProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [isLiveDb, setIsLiveDb] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [apiProducts, categories] = await Promise.all([
          api.getProducts({ size: 30 }),
          api.getCategories(),
        ]);

        if (apiProducts && apiProducts.length > 0 && isMounted) {
          const categoryMap = new Map<number, string>();
          if (categories) {
            categories.forEach((c) => categoryMap.set(c.id, c.name));
          }

          const mapped: Product[] = apiProducts.map((bp) => {
            const fallbackMatch = PRODUCTS.find((p) =>
              p.name.toLowerCase().includes(bp.name.substring(0, 8).toLowerCase()) ||
              p.id === bp.sku.toLowerCase()
            );

            let catName = 'Bể Kính';
            const rawCat = categoryMap.get(bp.categoryId) || '';
            if (rawCat.includes('Cá')) catName = 'Cá Cảnh';
            else if (rawCat.includes('Đèn') || rawCat.includes('Lọc') || rawCat.includes('Thiết Bị')) catName = 'Thiết Bị';
            else if (rawCat.includes('Lũa') || rawCat.includes('Cây') || rawCat.includes('Phân')) catName = 'Cây & Lũa';

            return {
              id: bp.id,
              name: bp.name,
              price: Number(bp.basePrice),
              originalPrice: bp.isCombo ? Math.round(Number(bp.basePrice) * 1.15) : undefined,
              image: bp.thumbnailUrl || fallbackMatch?.image || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80',
              category: catName,
              rating: Number(bp.rating) || 5.0,
              reviewCount: bp.totalSales ? bp.totalSales * 3 + 12 : 68,
              description: bp.shortDescription || fallbackMatch?.description || 'Sản phẩm thủy sinh cao cấp chuẩn Studio.',
              badge: bp.isCombo ? 'Combo 3D' : bp.isLivestock ? 'Cá Cảnh Live' : bp.is3dCustomizable ? '3D Config' : undefined,
              badgeColor: bp.isCombo ? '#06b6d4' : bp.isLivestock ? '#38bdf8' : '#10b981',
            };
          });

          setProducts(mapped);
          setIsLiveDb(true);
        }
      } catch (err) {
        console.warn('API load failed, staying with default catalog:', err);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory);

  const handleAdd = (product: Product) => {
    onAddToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1600);
  };

  return (
    <section
      id="shop"
      style={{
        padding: '90px 0',
        background: 'linear-gradient(180deg, #070c14 0%, #0b111a 50%, #070c14 100%)',
        position: 'relative',
        borderTop: '1px solid rgba(56, 189, 248, 0.08)',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '46px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '24px',
              background: isLiveDb ? 'rgba(16, 185, 129, 0.12)' : 'rgba(56, 189, 248, 0.08)',
              border: isLiveDb ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(56, 189, 248, 0.2)',
              marginBottom: '14px',
            }}
          >
            {isLiveDb ? <Database size={13} color="#10b981" /> : <Sparkles size={13} color="#38bdf8" />}
            <span
              style={{
                textTransform: 'uppercase',
                fontSize: '11px',
                letterSpacing: '2px',
                color: isLiveDb ? '#34d399' : '#38bdf8',
                fontWeight: 800,
              }}
            >
              {isLiveDb ? 'Đồng bộ PostgreSQL Live (Port 8080)' : 'Bộ Sưu Tập Studio'}
            </span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontFamily: 'var(--font-heading)',
              color: '#f8fafc',
              marginBottom: '12px',
              fontWeight: 800,
            }}
          >
            Cửa Hàng Thiết Bị & Sinh Vật Chuẩn Studio
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '560px', margin: '0 auto', fontSize: '15px', lineHeight: 1.6 }}>
            Trang bị đồng bộ cho hồ cá thủy sinh từ bể nano siêu trong, đèn cantilever đến lũa bonsai nghệ thuật.
          </p>
        </div>

        {/* Category Filters */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '44px',
          }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 22px',
                  borderRadius: '30px',
                  border: isActive
                    ? '1.5px solid #06b6d4'
                    : '1.5px solid rgba(255, 255, 255, 0.08)',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.22), rgba(59, 130, 246, 0.22))'
                    : 'rgba(15, 23, 42, 0.65)',
                  backdropFilter: 'blur(10px)',
                  color: isActive ? '#38bdf8' : '#94a3b8',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: isActive
                    ? '0 0 20px rgba(6, 182, 212, 0.3)'
                    : 'none',
                }}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="grid grid-4 gap-3">
          {filtered.map((product) => {
            const isAdded = addedId === product.id;
            return (
              <div
                key={product.id}
                style={{
                  borderRadius: '18px',
                  border: '1px solid rgba(56, 189, 248, 0.12)',
                  background: 'rgba(15, 23, 42, 0.72)',
                  backdropFilter: 'blur(12px)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.35)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(6, 182, 212, 0.18)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.12)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.35)';
                }}
              >
                {/* Image Viewport */}
                <div style={{ position: 'relative', overflow: 'hidden', height: '210px', background: '#030712' }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80';
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.5s ease',
                      opacity: 0.92,
                    }}
                  />

                  {/* Gradient bottom shadow */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(15,23,42,0.85) 100%)',
                      pointerEvents: 'none',
                    }}
                  />

                  {product.badge && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: product.badgeColor || '#0284c7',
                        color: '#fff',
                        fontSize: '10px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.8px',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      }}
                    >
                      {product.badge}
                    </span>
                  )}

                  {product.originalPrice && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(239, 68, 68, 0.9)',
                        color: '#fff',
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '4px 9px',
                        borderRadius: '20px',
                      }}
                    >
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                  )}

                  {/* 3D Preview Trigger */}
                  <button
                    onClick={() => setSelected3DProduct(product)}
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      background: 'rgba(7, 12, 20, 0.88)',
                      backdropFilter: 'blur(8px)',
                      color: '#38bdf8',
                      border: '1px solid rgba(56, 189, 248, 0.45)',
                      borderRadius: '20px',
                      padding: '5px 12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = '#06b6d4';
                      (e.currentTarget as HTMLButtonElement).style.color = '#020617';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(7, 12, 20, 0.88)';
                      (e.currentTarget as HTMLButtonElement).style.color = '#38bdf8';
                    }}
                  >
                    <Box size={13} />
                    <span>Xem 3D</span>
                  </button>
                </div>

                {/* Info */}
                <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Tag size={11} color="#38bdf8" />
                    <span
                      style={{
                        fontSize: '10px',
                        color: '#38bdf8',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.8px',
                      }}
                    >
                      {product.category}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#f8fafc',
                      lineHeight: 1.4,
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {product.name}
                  </h3>

                  <p
                    style={{
                      fontSize: '12px',
                      color: '#94a3b8',
                      lineHeight: 1.55,
                      flex: 1,
                    }}
                  >
                    {product.description}
                  </p>

                  {/* Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={11}
                          fill={i < Math.floor(product.rating) ? '#f59e0b' : 'none'}
                          color="#f59e0b"
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>({product.reviewCount})</span>
                  </div>

                  {/* Price + Add to Cart */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '8px',
                      paddingTop: '10px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '17px', fontWeight: 800, color: '#38bdf8' }}>
                        {product.price.toLocaleString()}đ
                      </span>
                      {product.originalPrice && (
                        <span
                          style={{
                            fontSize: '11px',
                            color: '#64748b',
                            textDecoration: 'line-through',
                            marginLeft: '6px',
                          }}
                        >
                          {product.originalPrice.toLocaleString()}đ
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAdd(product)}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        border: 'none',
                        background: isAdded
                          ? '#10b981'
                          : 'linear-gradient(135deg, #06b6d4, #2563eb)',
                        color: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 14px rgba(6, 182, 212, 0.3)',
                        transform: isAdded ? 'scale(1.15)' : 'scale(1)',
                      }}
                      title="Thêm vào giỏ hàng"
                    >
                      <ShoppingCart size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <button
            className="btn-secondary flex align-center gap-1"
            style={{
              margin: '0 auto',
              display: 'inline-flex',
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              color: '#38bdf8',
            }}
          >
            <span>Xem Toàn Bộ 120+ Sản Phẩm Studio</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Interactive 3D Product Modal */}
      {selected3DProduct && (
        <Product3DModal
          product={selected3DProduct}
          onClose={() => setSelected3DProduct(null)}
          onAddToCart={handleAdd}
        />
      )}
    </section>
  );
};
