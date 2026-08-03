import React, { useState } from 'react';
import { ShoppingCart, Star, Tag, Fish, Layers, Leaf, Wrench, ChevronRight } from 'lucide-react';

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
    id: 'p1',
    name: 'Cá Rồng Kim Long Huyết Long 24K',
    price: 8500000,
    originalPrice: 11000000,
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&auto=format&fit=crop&q=80',
    category: 'Cá Cảnh',
    rating: 5,
    reviewCount: 48,
    description: 'Cá Rồng Kim Long nhập khẩu chuẩn CITES, vẩy vàng sáng bóng, dáng bơi uy nghi.',
    badge: 'Hot',
    badgeColor: '#f43f5e',
  },
  {
    id: 'p2',
    name: 'Cá Đĩa Discus Heckel Hoàng Gia',
    price: 450000,
    originalPrice: 600000,
    image: 'https://images.unsplash.com/photo-1520302630591-fd1f8dc09e6b?w=600&auto=format&fit=crop&q=80',
    category: 'Cá Cảnh',
    rating: 5,
    reviewCount: 112,
    description: 'Discus nhập khẩu Malaysia, màu sắc rực rỡ, hoa văn sọc đối xứng cân đẹp.',
    badge: 'Nhập khẩu',
    badgeColor: '#0284c7',
  },
  {
    id: 'p3',
    name: 'Bể Kính Siêu Trong ADA Style 90cm',
    price: 2800000,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80',
    category: 'Bể Kính',
    rating: 4.8,
    reviewCount: 67,
    description: 'Bể kính 4 mặt phẳng giấu đường chỉ, dày 10mm, khung nhôm anodize đen mờ siêu sang.',
    badge: 'Bestseller',
    badgeColor: '#d97706',
  },
  {
    id: 'p4',
    name: 'Bộ Đèn Chosun LED Thực Vật 60cm',
    price: 1200000,
    originalPrice: 1500000,
    image: 'https://images.unsplash.com/photo-1592571350791-6af43e8a5f76?w=600&auto=format&fit=crop&q=80',
    category: 'Thiết Bị',
    rating: 4.7,
    reviewCount: 89,
    description: 'Đèn LED Full Spectrum hỗ trợ cây thủy sinh quang hợp, điều chỉnh màu sắc 5000K-9000K.',
  },
  {
    id: 'p5',
    name: 'Lũa Thủy Sinh Cổ Thụ Sumatra',
    price: 380000,
    image: 'https://images.unsplash.com/photo-1623159619614-96fe025f9b2e?w=600&auto=format&fit=crop&q=80',
    category: 'Cây & Lũa',
    rating: 4.9,
    reviewCount: 203,
    description: 'Lũa Sumatra ngâm sẵn, hình thù đẹp tự nhiên, đã qua xử lý khử khuẩn và bão hoà nước.',
    badge: 'Tự nhiên',
    badgeColor: '#059669',
  },
  {
    id: 'p6',
    name: 'Bộ Lọc Canister Eheim Classic 2217',
    price: 3200000,
    originalPrice: 3900000,
    image: 'https://images.unsplash.com/photo-1497752531616-c3afd9760a11?w=600&auto=format&fit=crop&q=80',
    category: 'Thiết Bị',
    rating: 4.9,
    reviewCount: 156,
    description: 'Lọc canister Eheim 2217 dung tích 1000L/h, siêu êm, vi sinh cao, dùng cho bể 200-600L.',
    badge: 'Premium',
    badgeColor: '#7c3aed',
  },
  {
    id: 'p7',
    name: 'Cây Ráy Anubias Nana Petite',
    price: 95000,
    image: 'https://images.unsplash.com/photo-1566910842098-729a1f9b9b9f?w=600&auto=format&fit=crop&q=80',
    category: 'Cây & Lũa',
    rating: 4.8,
    reviewCount: 341,
    description: 'Ráy Anubias Nana Petite cứng cây, dễ nuôi, thích hợp buộc lũa đá, không cần CO2.',
  },
  {
    id: 'p8',
    name: 'Bể Acrylic Trụ Tròn Panorama 60L',
    price: 1800000,
    image: 'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=600&auto=format&fit=crop&q=80',
    category: 'Bể Kính',
    rating: 4.6,
    reviewCount: 77,
    description: 'Bể acrylic trụ tròn 360° panorama, trong suốt không đường chỉ, đế gỗ sồi tự nhiên.',
    badge: 'Độc quyền',
    badgeColor: '#0284c7',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Tất Cả', icon: <Layers size={15} /> },
  { id: 'Cá Cảnh', label: 'Cá Cảnh', icon: <Fish size={15} /> },
  { id: 'Bể Kính', label: 'Bể Kính', icon: <Layers size={15} /> },
  { id: 'Cây & Lũa', label: 'Cây & Lũa', icon: <Leaf size={15} /> },
  { id: 'Thiết Bị', label: 'Thiết Bị', icon: <Wrench size={15} /> },
];

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [addedId, setAddedId] = useState<string | null>(null);

  const filtered =
    activeCategory === 'all'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  const handleAdd = (product: Product) => {
    onAddToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1600);
  };

  return (
    <section id="shop" style={{ padding: '80px 0', background: '#f8fafc' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span
            style={{
              textTransform: 'uppercase',
              fontSize: '11px',
              letterSpacing: '3.5px',
              color: '#0284c7',
              fontWeight: 800,
              display: 'block',
              marginBottom: '10px',
            }}
          >
            Bộ Sưu Tập
          </span>
          <h2
            style={{
              fontSize: 'clamp(26px, 4vw, 38px)',
              fontFamily: 'var(--font-heading)',
              color: '#0f172a',
              marginBottom: '12px',
            }}
          >
            Cửa Hàng Thủy Sinh Cao Cấp
          </h2>
          <p style={{ color: '#64748b', maxWidth: '540px', margin: '0 auto', fontSize: '14px', lineHeight: 1.6 }}>
            Cá cảnh nhập khẩu, bể kính nghệ thuật, cây thủy sinh và thiết bị kỹ thuật số cao cấp
          </p>
        </div>

        {/* Category Filters */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '40px',
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 20px',
                borderRadius: '30px',
                border: activeCategory === cat.id ? '1.5px solid #0284c7' : '1.5px solid #e2e8f0',
                background: activeCategory === cat.id
                  ? 'linear-gradient(90deg, #0284c7, #06b6d4)'
                  : '#ffffff',
                color: activeCategory === cat.id ? '#ffffff' : '#475569',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: activeCategory === cat.id ? '0 4px 14px rgba(2,132,199,0.28)' : '0 1px 4px rgba(15,23,42,0.05)',
              }}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-4 gap-3">
          {filtered.map((product) => {
            const isAdded = addedId === product.id;
            return (
              <div
                key={product.id}
                className="glass-panel product-card"
                style={{ borderRadius: '16px', border: '1px solid rgba(2,132,199,0.1)', overflow: 'hidden' }}
              >
                {/* Image */}
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80';
                    }}
                    style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }}
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
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.8px',
                        padding: '4px 10px',
                        borderRadius: '20px',
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
                        background: '#f43f5e',
                        color: '#fff',
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: '20px',
                      }}
                    >
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Tag size={11} color="#0284c7" />
                    <span style={{ fontSize: '10px', color: '#0284c7', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                      {product.category}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', lineHeight: 1.4, fontFamily: 'var(--font-body)' }}>
                    {product.name}
                  </h3>

                  <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>
                    {product.description}
                  </p>

                  {/* Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={11}
                          fill={i < Math.floor(product.rating) ? '#d97706' : 'none'}
                          color="#d97706"
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>({product.reviewCount})</span>
                  </div>

                  {/* Price + Add to Cart */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                    <div>
                      <span style={{ fontSize: '17px', fontWeight: 800, color: '#0284c7' }}>
                        {product.price.toLocaleString()}đ
                      </span>
                      {product.originalPrice && (
                        <span style={{ fontSize: '11px', color: '#94a3b8', textDecoration: 'line-through', marginLeft: '6px' }}>
                          {product.originalPrice.toLocaleString()}đ
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAdd(product)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: 'none',
                        background: isAdded ? '#059669' : 'linear-gradient(135deg, #0284c7, #06b6d4)',
                        color: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(2,132,199,0.3)',
                        transform: isAdded ? 'scale(1.15)' : 'scale(1)',
                      }}
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
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            className="btn-secondary flex align-center gap-1"
            style={{ margin: '0 auto', display: 'inline-flex' }}
          >
            <span>Xem Tất Cả Sản Phẩm</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};
