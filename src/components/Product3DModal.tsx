import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { X, ShoppingCart, RotateCw, Sparkles, Check, Layers, ShieldCheck, Truck } from 'lucide-react';
import type { Product } from './ProductCatalog';
import { Organic3DFish, type OrganicFishType } from '../three/Organic3DFish';
import { Plant } from '../three/Plants';
import { Bubbles } from '../three/Bubbles';

interface Product3DModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

/**
 * 3D Scene specifically tailored to showcase the selected product category.
 */
function ProductScene({ product }: { product: Product }) {
  const cat = product.category;

  if (cat === 'Cá Cảnh') {
    const nameLower = product.name.toLowerCase();
    const fishType: OrganicFishType = nameLower.includes('đĩa') || nameLower.includes('discus')
      ? 'betta'
      : nameLower.includes('neon') || nameLower.includes('tetra')
      ? 'neon'
      : nameLower.includes('thần tiên') || nameLower.includes('betta')
      ? 'betta'
      : nameLower.includes('hề') || nameLower.includes('nemo') || nameLower.includes('clown')
      ? 'clown'
      : nameLower.includes('rồng') || nameLower.includes('long') || nameLower.includes('koi')
      ? 'koi'
      : 'goldfish';

    return (
      <group>
        <ambientLight intensity={1.1} color="#f0fdf4" />
        <pointLight position={[3, 5, 4]} intensity={3.5} color="#fed7aa" />
        <pointLight position={[-3, -1, 2]} intensity={2.2} color="#38bdf8" />
        <directionalLight position={[0, 6, 2]} intensity={2.0} color="#ffffff" />

        {/* Luminous Rising Bubbles */}
        <Bubbles count={30} spread={2.5} speed={0.4} size={0.035} />

        {/* Gorgeous Organic Swimming Realistic Fish */}
        <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.3}>
          <Organic3DFish
            type={fishType}
            position={[0, 0, 0]}
            scale={0.85}
            swimRadius={0.45}
            swimSpeed={0.9}
            swimHeight={0.2}
          />
        </Float>

        {/* Water pedestal ring */}
        <mesh position={[0, -1.3, 0]}>
          <cylinderGeometry args={[1.5, 1.6, 0.2, 32]} />
          <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.6} />
        </mesh>
      </group>
    );
  }

  if (cat === 'Bể Kính') {
    return (
      <group>
        <ambientLight intensity={0.8} />
        <pointLight position={[4, 5, 4]} intensity={2} color="#bae6fd" />
        <directionalLight position={[-4, 3, 2]} intensity={1.5} color="#ffffff" />

        {/* 3D Glass Tank Structure */}
        <group position={[0, 0.1, 0]}>
          {/* Glass panels (cube box) */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2.8, 1.8, 1.8]} />
            <meshPhysicalMaterial
              color="#e0f2fe"
              transparent
              opacity={0.28}
              roughness={0.05}
              metalness={0.1}
              transmission={0.9}
              thickness={0.5}
            />
          </mesh>

          {/* Substrate bottom */}
          <mesh position={[0, -0.8, 0]}>
            <boxGeometry args={[2.7, 0.15, 1.7]} />
            <meshStandardMaterial color="#57534e" roughness={0.9} />
          </mesh>

          {/* Inner plants & rocks */}
          <Plant position={[-0.8, -0.7, -0.3]} scale={0.5} hue="emerald" />
          <Plant position={[0.7, -0.7, 0.2]} scale={0.45} hue="green" />
          <mesh position={[0.1, -0.65, -0.1]}>
            <dodecahedronGeometry args={[0.3, 0]} />
            <meshStandardMaterial color="#44403c" roughness={0.85} />
          </mesh>

          {/* Small fish inside tank */}
          <Organic3DFish type="neon" scale={0.35} swimRadius={0.4} swimSpeed={1} />
        </group>

        {/* Stand / Cabinet Base */}
        <mesh position={[0, -1.3, 0]}>
          <boxGeometry args={[3, 0.8, 2]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.3} />
        </mesh>
      </group>
    );
  }

  if (cat === 'Cây & Lũa') {
    return (
      <group>
        <ambientLight intensity={0.9} />
        <pointLight position={[3, 4, 3]} intensity={2} color="#86efac" />
        <directionalLight position={[-2, 4, 1]} intensity={1.5} color="#ffffff" />

        {/* Aquatic Driftwood & Rock Centerpiece */}
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <group position={[0, -0.4, 0]}>
            {/* Rock Base */}
            <mesh position={[0, -0.3, 0]}>
              <dodecahedronGeometry args={[0.8, 1]} />
              <meshStandardMaterial color="#52525b" roughness={0.8} />
            </mesh>
            <mesh position={[-0.5, -0.4, 0.4]}>
              <dodecahedronGeometry args={[0.5, 0]} />
              <meshStandardMaterial color="#71717a" roughness={0.85} />
            </mesh>

            {/* Plants swaying */}
            <Plant position={[0.2, -0.2, 0.1]} scale={0.7} hue="emerald" />
            <Plant position={[-0.4, -0.2, -0.2]} scale={0.55} hue="green" />
            <Plant position={[0.5, -0.3, -0.3]} scale={0.4} hue="moss" />
          </group>
        </Float>

        {/* Water ripples and bubbles around */}
        <Bubbles count={16} spread={2} />

        {/* Display Pedestal */}
        <mesh position={[0, -1.2, 0]}>
          <cylinderGeometry args={[1.4, 1.5, 0.2, 32]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.5} />
        </mesh>
      </group>
    );
  }

  // Fallback: Equipment / Default High-Tech Filter/Light Display
  return (
    <group>
      <ambientLight intensity={0.9} />
      <pointLight position={[3, 4, 3]} intensity={2.5} color="#60a5fa" />
      <directionalLight position={[-3, 3, -2]} intensity={1.5} color="#ffffff" />

      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
        <group position={[0, 0, 0]}>
          {/* Cylinder technical canister body */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.65, 0.65, 1.4, 32]} />
            <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.2} />
          </mesh>
          {/* Accent rings */}
          <mesh position={[0, 0.5, 0]}>
            <torusGeometry args={[0.68, 0.04, 16, 32]} />
            <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0, -0.5, 0]}>
            <torusGeometry args={[0.68, 0.04, 16, 32]} />
            <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.5} />
          </mesh>
          {/* Valve head */}
          <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.4, 0.65, 0.3, 32]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      </Float>

      {/* Pedestal */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[1.3, 1.4, 0.2, 32]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.6} />
      </mesh>
    </group>
  );
}

export const Product3DModal: React.FC<Product3DModalProps> = ({ product, onClose, onAddToCart }) => {
  const [autoRotate, setAutoRotate] = useState(true);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(15, 23, 42, 0.78)',
        backdropFilter: 'blur(8px)',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '920px',
          background: '#ffffff',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px -15px rgba(2, 132, 199, 0.4)',
          border: '1.5px solid rgba(2, 132, 199, 0.25)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          maxHeight: '90vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 30,
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)',
            transition: 'all 0.2s',
          }}
          aria-label="Đóng"
        >
          <X size={20} color="#0f172a" />
        </button>

        {/* 3D Viewport Column */}
        <div
          style={{
            position: 'relative',
            height: '460px',
            background: 'radial-gradient(circle at 50% 35%, #075985 0%, #0c4a6e 40%, #082f49 100%)',
            overflow: 'hidden',
          }}
        >
          {/* Top 3D Indicator */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              zIndex: 10,
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(8px)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 800,
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <Sparkles size={13} color="#0284c7" />
            <span>MÔ PHỎNG 3D REAL-TIME</span>
          </div>

          {/* 3D Controls Bar */}
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              right: '16px',
              zIndex: 10,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(10px)',
              padding: '8px 14px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', fontSize: '11px' }}>
              <RotateCw size={13} />
              <span>Kéo chuột để xoay 360° · Cuộn để phóng to</span>
            </div>
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              style={{
                background: autoRotate ? '#0284c7' : 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {autoRotate ? 'Tắt tự xoay' : 'Bật tự xoay'}
            </button>
          </div>

          {/* Live Three.js Canvas */}
          <Suspense
            fallback={
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8',
                  fontSize: '13px',
                }}
              >
                Đang nạp mô hình 3D...
              </div>
            }
          >
            <Canvas
              camera={{ position: [0, 1.2, 4], fov: 45 }}
              style={{ width: '100%', height: '100%' }}
            >
              <OrbitControls
                enableZoom={true}
                enablePan={false}
                autoRotate={autoRotate}
                autoRotateSpeed={1.8}
                minDistance={1.8}
                maxDistance={7}
                maxPolarAngle={Math.PI / 1.8}
                minPolarAngle={Math.PI / 6}
              />
              <ProductScene product={product} />
            </Canvas>
          </Suspense>
        </div>

        {/* Product Details & Actions Column */}
        <div
          style={{
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '20px',
            overflowY: 'auto',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#0284c7',
                  background: 'rgba(2,132,199,0.1)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                }}
              >
                {product.category}
              </span>
              {product.badge && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#ffffff',
                    background: product.badgeColor || '#059669',
                    padding: '4px 10px',
                    borderRadius: '12px',
                  }}
                >
                  {product.badge}
                </span>
              )}
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '22px',
                color: '#0f172a',
                lineHeight: 1.3,
                marginBottom: '12px',
              }}
            >
              {product.name}
            </h2>

            <p style={{ color: '#475569', fontSize: '13px', lineHeight: 1.7, marginBottom: '20px' }}>
              {product.description}
            </p>

            {/* Feature specs list */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155' }}>
                <Layers size={15} color="#0284c7" />
                <span>Mô hình hiển thị tỉ lệ chuẩn thực tế 1:1</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155' }}>
                <ShieldCheck size={15} color="#059669" />
                <span>Bảo hành chính hãng & kiểm định nguồn gốc</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155' }}>
                <Truck size={15} color="#d97706" />
                <span>Hỗ trợ vận chuyển chống sốc chuyên dụng</span>
              </div>
            </div>
          </div>

          {/* Pricing & Add to Cart Footer */}
          <div
            style={{
              paddingTop: '20px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Đơn giá niêm yết</span>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#0284c7' }}>
                {product.price.toLocaleString()}đ
              </span>
              {product.originalPrice && (
                <span
                  style={{
                    fontSize: '13px',
                    color: '#94a3b8',
                    textDecoration: 'line-through',
                    marginLeft: '8px',
                  }}
                >
                  {product.originalPrice.toLocaleString()}đ
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="btn-primary flex align-center gap-2"
              style={{
                padding: '14px 24px',
                fontSize: '14px',
                background: added ? '#059669' : undefined,
                transition: 'background 0.3s ease',
              }}
            >
              {added ? (
                <>
                  <Check size={17} />
                  <span>Đã Thêm Vào Giỏ!</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={17} />
                  <span>Thêm Vào Giỏ Hàng</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
