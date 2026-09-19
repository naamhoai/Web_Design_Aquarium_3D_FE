import React, { useState, useRef, useEffect } from 'react';
import {
  RotateCw, Play, Pause, Sparkles, Layers,
  ShoppingBag, Check, Info, Compass, RefreshCw, X, ChevronRight,
  MapPin, Truck, Store, ShieldCheck, Eye, Database
} from 'lucide-react';
import { api } from '../services/api';

interface LayerSpec {
  label: string;
  value: string;
}

interface LayerStoreLocation {
  city: string;
  address: string;
  hotline: string;
}

interface LayerInfo {
  id: string;
  step: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  topPercent: number; // percentage from top in exploded video
  highlight: string;
  specs: LayerSpec[];
  stores: LayerStoreLocation[];
  shippingInfo: string;
  warranty: string;
  stockStatus: string;
}

const LAYERS: LayerInfo[] = [
  {
    id: 'layer-led',
    step: '01',
    name: 'Thanh Đèn LED Quang Hợp Siêu Mỏng',
    category: 'Chiếu Sáng Thông Minh',
    price: 1350000,
    originalPrice: 1600000,
    topPercent: 14,
    highlight: 'Quang phổ Full Spectrum 7500K - 9000K kích thích diệp lục tố, giúp rêu xanh mướt và cây thủy sinh quang hợp rực rỡ.',
    specs: [
      { label: 'Chip LED', value: 'Samsung LM301B High-CRI 95+' },
      { label: 'Công suất', value: '36W WRGB Full Spectrum' },
      { label: 'Vỏ tản nhiệt', value: 'Nhôm nguyên khối CNC Anodized chống oxy hóa' },
      { label: 'Điều khiển', value: 'Dimmer cảm ứng 10 cấp, hẹn giờ 3 nấc (6h-8h-10h)' },
      { label: 'Tuổi thọ', value: '50.000 giờ chiếu sáng liên tục' },
    ],
    warranty: 'Bảo hành chính hãng 24 tháng (1 đổi 1 trong 30 ngày đầu)',
    stockStatus: 'Còn 18 bộ sẵn hàng',
    shippingInfo: 'Giao hỏa tốc 2 giờ nội thành HN & TP.HCM • Miễn phí vận chuyển toàn quốc',
    stores: [
      { city: 'Hà Nội', address: '120 Hoàng Hoa Thám, P. Ngọc Hà, Q. Ba Đình', hotline: '0988.123.456' },
      { city: 'TP. Hồ Chí Minh', address: '45 Võ Văn Tần, P. Võ Thị Sáu, Quận 3', hotline: '0938.654.321' },
    ],
  },
  {
    id: 'layer-cover',
    step: '02',
    name: 'Nắp Kính Cường Lực Chống Bay Hơi',
    category: 'Bảo Vệ Vi Khí Hậu',
    price: 350000,
    originalPrice: 450000,
    topPercent: 27,
    highlight: 'Giảm 85% tốc độ bốc hơi nước, giữ nhiệt độ nước ổn định và ngăn ngừa cá cảnh nhảy ra ngoài an toàn tuyệt đối.',
    specs: [
      { label: 'Chất liệu kính', value: 'Kính cường lực siêu trong 5mm vát cạnh kim cương' },
      { label: 'Khe cho ăn', value: 'Cửa lùa thông minh tiện lợi không cần nhấc nắp' },
      { label: 'Chân kẹp', value: 'Bộ 4 kẹp mica nguyên khối trong suốt giấu viền' },
      { label: 'Khả năng chịu lực', value: 'Chịu tải trọng 20kg bề mặt chống va đập' },
    ],
    warranty: 'Bảo hành 12 tháng nứt vỡ tự nhiên',
    stockStatus: 'Sẵn hàng tại tất cả chi nhánh',
    shippingInfo: 'Đóng kiện xốp chống va đập chuyên dụng • Giao hàng an toàn 100%',
    stores: [
      { city: 'Hà Nội', address: '120 Hoàng Hoa Thám, P. Ngọc Hà, Q. Ba Đình', hotline: '0988.123.456' },
      { city: 'TP. Hồ Chí Minh', address: '45 Võ Văn Tần, P. Võ Thị Sáu, Quận 3', hotline: '0938.654.321' },
    ],
  },
  {
    id: 'layer-biotope',
    step: '03',
    name: 'Hệ Sinh Thái Lũa Bonsai & Đàn Cá Neon',
    category: 'Sinh Vật Cảnh Nghệ Thuật',
    price: 1850000,
    originalPrice: 2200000,
    topPercent: 42,
    highlight: 'Gốc lũa Linh Sam cổ thụ đính rêu Taiwan Moss cấy tỉa hoàn thiện kết hợp đàn 15 cá Neon Cardinal dạ quang bơi lội sinh động.',
    specs: [
      { label: 'Lũa nghệ thuật', value: 'Lũa Linh Sam rừng tự nhiên, xử lý chìm 100% không phai màu' },
      { label: 'Rêu đính kèm', value: 'Rêu Taiwan Moss nuôi cấy nước mát, tán rậm xanh mướt' },
      { label: 'Đàn cá sinh vật', value: '15x Cá Neon Cardinal dạ quang + 5x Tép đỏ Red Cherry' },
      { label: 'Độ thích nghi', value: 'Đã thuần dưỡng nước máy ổn định, ăn cám hạt nhỏ' },
    ],
    warranty: 'Bảo hành sống khỏe 7 ngày sau khi bàn giao (1 đổi 1 nếu có hao hụt)',
    stockStatus: 'Thiết kế thủ công sẵn sàng giao',
    shippingInfo: 'Vận chuyển chuyên dụng bằng túi oxy nhiệt độ chuẩn trong 2 giờ',
    stores: [
      { city: 'Hà Nội', address: '120 Hoàng Hoa Thám, P. Ngọc Hà, Q. Ba Đình (Xem hồ mẫu)', hotline: '0988.123.456' },
      { city: 'TP. Hồ Chí Minh', address: '45 Võ Văn Tần, P. Võ Thị Sáu, Quận 3 (Xem hồ mẫu)', hotline: '0938.654.321' },
    ],
  },
  {
    id: 'layer-tank',
    step: '04',
    name: 'Bể Kính Siêu Trong Opti-White 30cm',
    category: 'Hồ Kính Nano Cube Cao Cấp',
    price: 1650000,
    originalPrice: 1950000,
    topPercent: 57,
    highlight: 'Độ truyền sáng 99.8% không ám xanh, mài vát kim cương 4 cạnh chống khúc xạ và dán keo Wacker Đức tàng hình.',
    specs: [
      { label: 'Kích thước chuẩn', value: '30 x 30 x 30 cm (Dung tích thực 27 Lít)' },
      { label: 'Loại kính', value: 'Opti-White Ultra-Clear glass 8mm chịu lực cao' },
      { label: 'Công nghệ dán', value: 'Keo Wacker CHLB Đức giấu chỉ keo 4 mặt phẳng tuyệt đối' },
      { label: 'Cạnh mép', value: 'Vát xiết kim cương 45 độ bóng gương' },
    ],
    warranty: 'Bảo hành rò rỉ keo 5 năm đổi mới tận nơi',
    stockStatus: 'Sẵn hàng số lượng lớn',
    shippingInfo: 'Giao hỏa tốc nội thành • Đóng thùng gỗ chống sốc chuyển phát toàn quốc',
    stores: [
      { city: 'Hà Nội', address: '120 Hoàng Hoa Thám, P. Ngọc Hà, Q. Ba Đình', hotline: '0988.123.456' },
      { city: 'TP. Hồ Chí Minh', address: '45 Võ Văn Tần, P. Võ Thị Sáu, Quận 3', hotline: '0938.654.321' },
    ],
  },
  {
    id: 'layer-soil',
    step: '05',
    name: 'Phân Nền Vi Sinh ADA Amazonia Ver.2',
    category: 'Đất Nền Dinh Dưỡng ADA Nhật Bản',
    price: 680000,
    originalPrice: 790000,
    topPercent: 71,
    highlight: 'Đất sét nung đen tự nhiên giàu acid humic nhả chậm kết hợp đá nham thạch tổ ong tạo ổ vi sinh phân giải nitrat cực mạnh.',
    specs: [
      { label: 'Thương hiệu', value: 'ADA (Aqua Design Amano) Nhật Bản nhập khẩu' },
      { label: 'Quy cách', value: 'Bao 9L đất hạt đen đồng đều, không làm đục nước' },
      { label: 'Cân bằng pH', value: 'Duy trì nước mềm pH 6.2 - 6.8 lý tưởng cho tép và cây' },
      { label: 'Thời gian dinh dưỡng', value: 'Nhả dưỡng chất bền vững từ 24 - 36 tháng' },
      { label: 'Quà tặng kèm', value: '1 hũ vi sinh khởi tạo chu trình Nitrat hóa Seachem' },
    ],
    warranty: 'Cam kết hàng nhập khẩu chính ngạch 100% có tem kiểm định',
    stockStatus: 'Còn 32 bao tại kho',
    shippingInfo: 'Giao nhanh toàn quốc • Hỗ trợ đo thông số nước miễn phí',
    stores: [
      { city: 'Hà Nội', address: '120 Hoàng Hoa Thám, P. Ngọc Hà, Q. Ba Đình', hotline: '0988.123.456' },
      { city: 'TP. Hồ Chí Minh', address: '45 Võ Văn Tần, P. Võ Thị Sáu, Quận 3', hotline: '0938.654.321' },
    ],
  },
  {
    id: 'layer-filter',
    step: '06',
    name: 'Hệ Thống Lọc Đáy Ngầm Silent-Flow',
    category: 'Công Nghệ Tuần Hoàn Sinh Học',
    price: 2200000,
    originalPrice: 2600000,
    topPercent: 86,
    highlight: 'Giấu ngầm toàn bộ động cơ và buồng lọc dưới đáy bể, loại bỏ hoàn toàn tiếng ồn (< 16dB) và duy trì nước trong suốt như pha lê.',
    specs: [
      { label: 'Động cơ bơm', value: 'DC 12V Inverter 650 Lít/giờ, công suất 8W siêu tiết kiệm điện' },
      { label: 'Độ ồn hoạt động', value: '< 16dB (êm tuyệt đối, đặt phòng ngủ hoàn toàn không nghe thấy)' },
      { label: 'Vật liệu lọc đi kèm', value: 'Matrix Seachem + Eheim Substrat Pro + Mút lọc cơ học 4 lớp' },
      { label: 'Cơ chế hút', value: 'Hút váng mặt tự cân bằng + hút cặn đáy đa điểm 360 độ' },
    ],
    warranty: 'Bảo hành động cơ bơm 36 tháng chính hãng',
    stockStatus: 'Sẵn hàng kèm dịch vụ lắp đặt tận nơi',
    shippingInfo: 'Miễn phí vận chuyển toàn quốc • Hướng dẫn đấu nối 1:1 qua video call',
    stores: [
      { city: 'Hà Nội', address: '120 Hoàng Hoa Thám, P. Ngọc Hà, Q. Ba Đình (Có kỹ thuật viên qua nhà)', hotline: '0988.123.456' },
      { city: 'TP. Hồ Chí Minh', address: '45 Võ Văn Tần, P. Võ Thị Sáu, Quận 3 (Có kỹ thuật viên qua nhà)', hotline: '0938.654.321' },
    ],
  },
];

interface HeroCinematicProps {
  onExploreExploded?: () => void;
  onOpenCustomizer: () => void;
  onAddToCart: (item: any) => void;
  isExplodedExternal?: boolean;
  onExplodeChange?: (exploded: boolean) => void;
}

export const HeroCinematic: React.FC<HeroCinematicProps> = ({
  onOpenCustomizer,
  onAddToCart,
  isExplodedExternal,
  onExplodeChange,
}) => {
  // Exploded state: false = Assembled Nano Cube, true = Exploded 6 Layers
  const [isExploded, setIsExploded] = useState(isExplodedExternal ?? false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [activeLayer, setActiveLayer] = useState<LayerInfo | null>(null);
  const [cartFeedback, setCartFeedback] = useState<string | null>(null);
  const [layers, setLayers] = useState<LayerInfo[]>(LAYERS);
  const [isLiveBom, setIsLiveBom] = useState(false);

  // Fetch 6-Layer Exploded BOM from aquarium-3d-service via Gateway (Port 8080 -> 8084)
  useEffect(() => {
    let isMounted = true;
    async function loadLiveBom() {
      try {
        const bom = await api.getExplodedBom('COMBO-NANO-30');
        if (bom && bom.layers && bom.layers.length > 0 && isMounted) {
          setIsLiveBom(true);
          setLayers((prev) =>
            prev.map((l, idx) => {
              const bLayer = bom.layers[idx];
              if (!bLayer) return l;
              return {
                ...l,
                name: bLayer.componentName || bLayer.layerName || l.name,
                category: bLayer.layerName || l.category,
                price: Number(bLayer.price) || l.price,
                highlight: bLayer.description || l.highlight,
              };
            })
          );
        }
      } catch (err) {
        console.warn('Exploded BOM fetch fallback:', err);
      }
    }
    loadLiveBom();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync external explode state
  useEffect(() => {
    if (isExplodedExternal !== undefined && isExplodedExternal !== isExploded) {
      setIsExploded(isExplodedExternal);
    }
  }, [isExplodedExternal]);

  // Ripple shockwave state when clicking on tank to explode
  const [shockwave, setShockwave] = useState<{ x: number; y: number; key: number } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const dragStartX = useRef<number>(0);
  const dragStartTime = useRef<number>(0);
  const hasMovedRef = useRef<boolean>(false);

  // Keep rotation angle in sync when toggling exploded mode
  const toggleExplode = (clientX?: number, clientY?: number) => {
    const nextVal = !isExploded;
    setIsExploded(nextVal);
    onExplodeChange?.(nextVal);

    if (videoRef.current) {
      const dur = videoRef.current.duration || 10;
      const currentRatio = (videoRef.current.currentTime / dur) % 1;

      // Trigger ripple effect if client coords provided
      if (clientX !== undefined && clientY !== undefined) {
        setShockwave({ x: clientX, y: clientY, key: Date.now() });
      }

      // Restore exact rotation angle in the corresponding video
      setTimeout(() => {
        if (videoRef.current) {
          const newDur = videoRef.current.duration || 10;
          videoRef.current.currentTime = currentRatio * newDur;
          if (isPlaying) {
            videoRef.current.play().catch(() => {});
          }
        }
      }, 40);
    }
  };

  // Sync video time when switching video sources
  useEffect(() => {
    if (videoRef.current && isPlaying) {
      videoRef.current.play().catch(() => {});
    }
  }, [isExploded, isPlaying]);

  // Listen for Escape key to close active layer modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveLayer(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Drag-to-Rotate handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!videoRef.current) return;
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartX.current = e.clientX;
    dragStartTime.current = videoRef.current.currentTime;
    videoRef.current.pause();
    setIsPlaying(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !videoRef.current) return;
    const deltaX = e.clientX - dragStartX.current;
    if (Math.abs(deltaX) > 6) {
      hasMovedRef.current = true;
    }
    const dur = videoRef.current.duration || 10;
    // 380px drag = full 360 degree rotation
    const timeDelta = (deltaX / 380) * dur;
    let targetTime = (dragStartTime.current + timeDelta) % dur;
    if (targetTime < 0) targetTime += dur;

    videoRef.current.currentTime = targetTime;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging) {
      setIsDragging(false);
      // If user did not drag, it was an intentional CLICK on the tank!
      if (!hasMovedRef.current) {
        const rect = e.currentTarget.getBoundingClientRect();
        if (!isExploded) {
          // In assembled mode: click on tank to explode!
          toggleExplode(e.clientX - rect.left, e.clientY - rect.top);
        } else {
          // In exploded mode: click on that specific layer of the tank to open its modal!
          const clickYRatio = (e.clientY - rect.top) / rect.height;
          let targetIndex = 0;
          if (clickYRatio < 0.20) targetIndex = 0;       // Tầng 1: Đèn LED
          else if (clickYRatio < 0.35) targetIndex = 1;  // Tầng 2: Nắp kính
          else if (clickYRatio < 0.50) targetIndex = 2;  // Tầng 3: Lũa & Cá
          else if (clickYRatio < 0.65) targetIndex = 3;  // Tầng 4: Bể kính
          else if (clickYRatio < 0.80) targetIndex = 4;  // Tầng 5: Phân nền ADA
          else targetIndex = 5;                          // Tầng 6: Hệ lọc ngầm

          setActiveLayer(layers[targetIndex]);
        }
      } else {
        if (videoRef.current) {
          videoRef.current.play().catch(() => {});
          setIsPlaying(true);
        }
      }
    }
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!videoRef.current || !e.touches[0]) return;
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartX.current = e.touches[0].clientX;
    dragStartTime.current = videoRef.current.currentTime;
    videoRef.current.pause();
    setIsPlaying(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !videoRef.current || !e.touches[0]) return;
    const deltaX = e.touches[0].clientX - dragStartX.current;
    if (Math.abs(deltaX) > 8) {
      hasMovedRef.current = true;
    }
    const dur = videoRef.current.duration || 10;
    const timeDelta = (deltaX / 300) * dur;
    let targetTime = (dragStartTime.current + timeDelta) % dur;
    if (targetTime < 0) targetTime += dur;

    videoRef.current.currentTime = targetTime;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isDragging) {
      setIsDragging(false);
      if (!hasMovedRef.current) {
        const rect = e.currentTarget.getBoundingClientRect();
        const touch = e.changedTouches[0];
        if (touch) {
          if (!isExploded) {
            toggleExplode(touch.clientX - rect.left, touch.clientY - rect.top);
          } else {
            const clickYRatio = (touch.clientY - rect.top) / rect.height;
            let targetIndex = 0;
            if (clickYRatio < 0.20) targetIndex = 0;
            else if (clickYRatio < 0.35) targetIndex = 1;
            else if (clickYRatio < 0.50) targetIndex = 2;
            else if (clickYRatio < 0.65) targetIndex = 3;
            else if (clickYRatio < 0.80) targetIndex = 4;
            else targetIndex = 5;

            setActiveLayer(LAYERS[targetIndex]);
          }
        }
      } else {
        if (videoRef.current) {
          videoRef.current.play().catch(() => {});
          setIsPlaying(true);
        }
      }
    }
  };

  // Jump to specific angle
  const handleSetAngleRatio = (ratio: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const dur = videoRef.current.duration || 10;
    videoRef.current.currentTime = ratio * dur;
  };

  // Add to cart handlers
  const handleAddSingleLayer = (layer: LayerInfo) => {
    onAddToCart({
      id: layer.id,
      name: layer.name,
      price: layer.price,
      description: layer.highlight,
    });
    setCartFeedback(layer.id);
    setTimeout(() => setCartFeedback(null), 2000);
  };

  const totalBundlePrice = LAYERS.reduce((acc, l) => acc + l.price, 0);

  const handleBuyEntireTank = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart({
      id: 'full-modular-aquarium-set',
      name: 'Trọn Gói Hồ Thủy Sinh Bóc Tách Đa Tầng 360° Studio',
      price: isExploded ? totalBundlePrice : 4850000,
      description: isExploded
        ? 'Gồm đầy đủ 6 linh kiện bóc tách: Đèn LED, Nắp kính, Cây lũa rêu & Đàn cá Neon, Bể kính siêu trong, Phân nền ADA, Lọc ngầm Silent-Flow.'
        : 'Trọn bộ Hồ cá Nano Cube 30cm Setup sẵn hoàn chỉnh kèm đèn cantilever và hệ lọc ngầm cao cấp.',
    });
    setCartFeedback('full');
    setTimeout(() => setCartFeedback(null), 2200);
  };

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - 72px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px 50px',
        background: 'radial-gradient(circle at 50% 25%, #0c1828 0%, #060a10 50%, #030508 100%)',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(56, 189, 248, 0.12)',
        userSelect: 'none',
      }}
    >
      <style>{`
        @keyframes modalBackdropFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalZoomPop {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(6, 182, 212, 0.18) 0%, rgba(59, 130, 246, 0.04) 55%, transparent 75%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '1440px' }}>
        {/* ── Top Header Controls & Eyebrow ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            marginBottom: '18px',
          }}
        >
          {/* Eyebrow badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '30px',
                background: 'rgba(6, 182, 212, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                boxShadow: '0 0 20px rgba(6, 182, 212, 0.2)',
              }}
            >
              <Sparkles size={14} color="#38bdf8" />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  color: '#38bdf8',
                }}
              >
                Trải Nghiệm Bể Cá 360° Đột Phá
              </span>
            </div>

            {/* Current State Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '12px',
                  color: isExploded ? '#f59e0b' : '#34d399',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: isExploded ? '#f59e0b' : '#34d399',
                    boxShadow: `0 0 10px ${isExploded ? '#f59e0b' : '#34d399'}`,
                    display: 'inline-block',
                  }}
                />
                {isExploded ? 'Đang Bóc Tách 6 Tầng' : 'Hồ Cá Nguyên Khối 360°'}
              </span>

              {isLiveBom && (
                <span
                  style={{
                    fontSize: '11px',
                    color: '#38bdf8',
                    background: 'rgba(6, 182, 212, 0.12)',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 700,
                  }}
                >
                  <Database size={11} />
                  BOM PostgreSQL 18 Live (:8084)
                </span>
              )}
            </div>
          </div>

          {/* Right Mode Switchers: Explode Toggle & 3D Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* The Main EXPLODE BUTTON */}
            <button
              onClick={() => toggleExplode()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '24px',
                border: isExploded ? '1.5px solid #f59e0b' : '1.5px solid #06b6d4',
                background: isExploded
                  ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(239, 68, 68, 0.15))'
                  : 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(59, 130, 246, 0.25))',
                color: isExploded ? '#fcd34d' : '#38bdf8',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: isExploded
                  ? '0 0 25px rgba(245, 158, 11, 0.3)'
                  : '0 0 25px rgba(6, 182, 212, 0.3)',
              }}
            >
              {isExploded ? <RefreshCw size={15} /> : <Layers size={15} />}
              <span>{isExploded ? 'LẮP RÁP LẠI NGUYÊN KHỐI' : 'BÓC TÁCH CÁC TẦNG LỚP'}</span>
            </button>
          </div>
        </div>

        {/* ── Main Tank Viewport (Huge Cinematic Turntable - Borderless) ── */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(540px, 78vh, 800px)',
            borderRadius: '0px',
            border: 'none',
            background: 'transparent',
            boxShadow: 'none',
            overflow: 'hidden',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Click Shockwave Effect */}
          {shockwave && (
            <div
              key={shockwave.key}
              style={{
                position: 'absolute',
                left: shockwave.x - 50,
                top: shockwave.y - 50,
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                border: `3px solid ${isExploded ? '#38bdf8' : '#f59e0b'}`,
                pointerEvents: 'none',
                zIndex: 40,
                animation: 'shockwave-burst 0.75s ease-out forwards',
              }}
            />
          )}

          {/* Top Stage Instructions Badge */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '18px',
              zIndex: 30,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(7, 12, 20, 0.88)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              backdropFilter: 'blur(12px)',
              padding: '8px 18px',
              borderRadius: '24px',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5)',
            }}
          >
            <RotateCw size={14} className="spin-slow" color="#38bdf8" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc' }}>
              {isExploded
                ? 'ĐANG BÓC TÁCH 6 TẦNG — KÉO ĐỂ XOAY 360° • NHẤP VÀO BỂ ĐỂ LẮP RÁP LẠI'
                : 'HỒ CÁ NANO CUBE — KÉO ĐỂ XOAY 360° • NHẤP VÀO BỂ ĐỂ BÓC TÁCH'}
            </span>
          </div>

          {/* Central Action Prompt Button */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              zIndex: 35,
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExplode();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              style={{
                background: isExploded
                  ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
                  : 'linear-gradient(135deg, #0284c7, #06b6d4)',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 900,
                padding: '8px 18px',
                borderRadius: '24px',
                letterSpacing: '0.6px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(0, 0, 0, 0.45)',
                transition: 'all 0.25s ease',
              }}
            >
              {isExploded ? '⚡ NHẤP ĐỂ LẮP RÁP LẠI' : '✨ NHẤP VÀO BỂ ĐỂ BÓC TÁCH'}
            </button>
          </div>

          {/* RENDER STAGE: 360° Studio Turntable */}
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              {/* Subtle spotlight pedestal glow underneath the tank */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '65%',
                  height: '100px',
                  borderRadius: '50%',
                  background: isExploded
                    ? 'radial-gradient(ellipse, rgba(245, 158, 11, 0.14) 0%, transparent 70%)'
                    : 'radial-gradient(ellipse, rgba(6, 182, 212, 0.16) 0%, transparent 70%)',
                  filter: 'blur(35px)',
                  pointerEvents: 'none',
                  zIndex: 2,
                }}
              />

              <video
                ref={videoRef}
                key={isExploded ? 'exploded-video' : 'assembled-video'}
                src={
                  isExploded
                    ? '/videos/aquarium_exploded_view.mp4'
                    : '/videos/aquarium_nano_cube.mp4'
                }
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  background: 'transparent',
                  transform: 'scale(1.08)',
                  transformOrigin: 'center center',
                  zIndex: 3,
                  position: 'relative',
                }}
              />

              {/* ── 6 Clickable layer horizontal bands directly on the tank in Exploded Mode ── */}
              {isExploded && (
                <div
                  style={{
                    position: 'absolute',
                    top: '6%',
                    left: '20%',
                    width: '60%',
                    height: '88%',
                    pointerEvents: 'none',
                    zIndex: 22,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {layers.map((layer) => (
                    <div
                      key={`band-${layer.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveLayer(layer);
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      onMouseUp={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      onTouchEnd={(e) => e.stopPropagation()}
                      style={{
                        flex: 1,
                        pointerEvents: 'auto',
                        cursor: 'pointer',
                        borderRadius: '12px',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(6, 182, 212, 0.08)';
                        e.currentTarget.style.boxShadow = 'inset 0 0 20px rgba(6, 182, 212, 0.25)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      title={`Nhấp để phóng to xem thông số Tầng ${layer.step}: ${layer.name}`}
                    />
                  ))}
                </div>
              )}

              {/* ── 6 INTERACTIVE LAYER HOTSPOTS (Appears in Exploded Mode - Clean with NO PRICES) ── */}
              {isExploded && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    zIndex: 25,
                  }}
                >
                  {layers.map((layer) => {
                    const isSelected = activeLayer?.id === layer.id;
                    return (
                      <div
                        key={layer.id}
                        style={{
                          position: 'absolute',
                          top: `${layer.topPercent}%`,
                          right: 'clamp(16px, 5vw, 70px)',
                          transform: 'translateY(-50%)',
                          pointerEvents: 'auto',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          zIndex: 35,
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onMouseUp={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        onTouchEnd={(e) => e.stopPropagation()}
                      >
                        {/* Connecting indicator line */}
                        <div
                          style={{
                            width: isSelected ? '32px' : '18px',
                            height: '2px',
                            background: isSelected ? '#06b6d4' : 'rgba(56, 189, 248, 0.5)',
                            boxShadow: isSelected ? '0 0 12px #06b6d4' : 'none',
                            transition: 'all 0.25s ease',
                          }}
                        />

                        {/* Hotspot Button (Clean, NO PRICE TAG) */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveLayer(isSelected ? null : layer);
                          }}
                          onMouseDown={(e) => e.stopPropagation()}
                          onMouseUp={(e) => e.stopPropagation()}
                          onTouchStart={(e) => e.stopPropagation()}
                          onTouchEnd={(e) => e.stopPropagation()}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 18px',
                            borderRadius: '24px',
                            background: isSelected
                              ? 'linear-gradient(135deg, #0284c7, #06b6d4)'
                              : 'rgba(7, 12, 22, 0.94)',
                            border: isSelected
                              ? '1.5px solid #ffffff'
                              : '1.5px solid rgba(56, 189, 248, 0.45)',
                            color: isSelected ? '#ffffff' : '#f8fafc',
                            cursor: 'pointer',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                            boxShadow: isSelected
                              ? '0 0 24px rgba(6, 182, 212, 0.65)'
                              : '0 4px 20px rgba(0, 0, 0, 0.6)',
                            transition: 'all 0.25s ease',
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = '#38bdf8';
                              e.currentTarget.style.transform = 'scale(1.05)';
                              e.currentTarget.style.boxShadow = '0 0 20px rgba(56, 189, 248, 0.4)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.45)';
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.6)';
                            }
                          }}
                        >
                          <span
                            style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '50%',
                              background: isSelected ? '#ffffff' : '#0284c7',
                              color: isSelected ? '#0284c7' : '#ffffff',
                              fontSize: '11px',
                              fontWeight: 900,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {layer.step}
                          </span>
                          <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.2px' }}>
                            {layer.name}
                          </span>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '11px',
                              fontWeight: 700,
                              color: isSelected ? '#020617' : '#38bdf8',
                              background: isSelected ? 'rgba(255, 255, 255, 0.92)' : 'rgba(56, 189, 248, 0.16)',
                              padding: '3px 10px',
                              borderRadius: '12px',
                              marginLeft: '2px',
                            }}
                          >
                            <Eye size={12} /> Xem thông số
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          {/* ── Bottom Floating Controls (Play/Pause, Angle Presets, Full CTA - No Video Slider/Time) ── */}
          <div
            style={{
              position: 'absolute',
              bottom: '22px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              background: 'rgba(7, 12, 20, 0.84)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '30px',
              padding: '8px 18px',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 10px 35px rgba(0, 0, 0, 0.65)',
              maxWidth: 'calc(100% - 32px)',
              flexWrap: 'wrap',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Play/Pause Rotate Button */}
            <button
              onClick={togglePlayPause}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              title={isPlaying ? 'Tạm dừng xoay tự động' : 'Tiếp tục xoay tự động'}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: '2px' }} />}
            </button>

            {/* Angle Preset Quick Buttons */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { label: '0° Mặt Trước', ratio: 0 },
                { label: '45° Góc Nghiêng', ratio: 0.125 },
                { label: '90° Mặt Hông', ratio: 0.25 },
                { label: '180° Mặt Sau', ratio: 0.5 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={(e) => handleSetAngleRatio(preset.ratio, e)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '14px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    color: '#94a3b8',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#38bdf8';
                    e.currentTarget.style.borderColor = '#06b6d4';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#94a3b8';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Subtle Divider */}
            <div style={{ width: '1px', height: '18px', background: 'rgba(255, 255, 255, 0.15)' }} />

            {/* Buy Whole Bundle CTA */}
            <button
              onClick={handleBuyEntireTank}
              className="btn-primary"
              style={{
                padding: '7px 16px',
                fontSize: '12px',
                fontWeight: 800,
                borderRadius: '14px',
                background: cartFeedback === 'full'
                  ? '#10b981'
                  : isExploded
                  ? 'linear-gradient(90deg, #d97706, #f59e0b)'
                  : 'linear-gradient(90deg, #0284c7, #06b6d4)',
                whiteSpace: 'nowrap',
              }}
            >
              <ShoppingBag size={13} style={{ marginRight: '6px' }} />
              <span>
                {cartFeedback === 'full'
                  ? 'Đã Thêm Vào Giỏ!'
                  : isExploded
                  ? 'Mua Trọn Gói 6 Tầng'
                  : 'Mua Hồ Setup Hoàn Chỉnh'}
              </span>
            </button>
          </div>
        </div>

        {/* ── Below Tank: Floating Quick Specs & Studio CTA ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginTop: '20px',
            padding: '16px 24px',
            borderRadius: '20px',
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(56, 189, 248, 0.12)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={16} color="#38bdf8" />
              <span style={{ fontSize: '13px', color: '#cbd5e1' }}>
                {isExploded
                  ? 'Mẹo: Nhấp vào từng tầng trên bể để xem chi tiết và thêm lẻ vào giỏ hàng.'
                  : 'Mẹo: Nhấp trực tiếp vào bể cá hoặc nút góc trên để bóc tách 6 tầng linh kiện.'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onOpenCustomizer}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                borderRadius: '12px',
                border: '1px solid rgba(6, 182, 212, 0.35)',
                background: 'rgba(6, 182, 212, 0.1)',
                color: '#38bdf8',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Compass size={15} />
              <span>Vào Studio 3D Tự Phối Cảnh</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Active Layer Foreground Spotlight Modal (Zooms up prominently in the center of screen) ── */}
      {activeLayer && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'rgba(2, 6, 15, 0.85)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            animation: 'modalBackdropFade 0.22s ease-out',
          }}
          onClick={() => setActiveLayer(null)}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
        >
          <div
            style={{
              width: 'min(680px, 94vw)',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'linear-gradient(155deg, rgba(15, 23, 42, 0.98) 0%, rgba(5, 10, 22, 0.99) 100%)',
              border: '1.5px solid rgba(56, 189, 248, 0.5)',
              borderRadius: '24px',
              padding: '28px 26px',
              boxShadow: '0 25px 70px -15px rgba(0, 0, 0, 0.95), 0 0 40px rgba(6, 182, 212, 0.3)',
              animation: 'modalZoomPop 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
          >
            {/* Header: Step & Category & Stock & Close */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    background: 'linear-gradient(135deg, #0284c7, #06b6d4)',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 900,
                    padding: '4px 12px',
                    borderRadius: '12px',
                    letterSpacing: '0.6px',
                  }}
                >
                  TẦNG {activeLayer.step}
                </span>
                <span
                  style={{
                    color: '#38bdf8',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                  }}
                >
                  {activeLayer.category}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#10b981',
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    padding: '4px 10px',
                    borderRadius: '20px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                  {activeLayer.stockStatus}
                </span>
                <button
                  onClick={() => setActiveLayer(null)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
                    e.currentTarget.style.borderColor = '#ef4444';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#94a3b8';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  }}
                  title="Đóng (Phím ESC)"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Component Title & Highlight Description */}
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#f8fafc', marginBottom: '8px', lineHeight: 1.3 }}>
                {activeLayer.name}
              </h3>
              <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6 }}>
                {activeLayer.highlight}
              </p>
            </div>

            {/* Section 1: Thông Số Kỹ Thuật (Specs) */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Sparkles size={16} color="#06b6d4" />
                <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#e2e8f0' }}>
                  Thông Số Kỹ Thuật Chi Tiết
                </h4>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                {activeLayer.specs.map((spec, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>{spec.label}</span>
                    <span style={{ fontSize: '12px', color: '#f1f5f9', fontWeight: 700 }}>{spec.value}</span>
                  </div>
                ))}
              </div>

              {/* Warranty Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '12px',
                  paddingTop: '10px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  fontSize: '12px',
                  color: '#38bdf8',
                  fontWeight: 600,
                }}
              >
                <ShieldCheck size={16} color="#38bdf8" />
                <span>{activeLayer.warranty}</span>
              </div>
            </div>

            {/* Section 2: Mua Được Ở Đâu & Hệ Thống Showroom */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Store size={16} color="#f59e0b" />
                <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#e2e8f0' }}>
                  Mua Được Ở Đâu & Hệ Thống Showroom
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px', marginBottom: '12px' }}>
                {activeLayer.stores.map((store, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: 'rgba(245, 158, 11, 0.05)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontWeight: 800, fontSize: '12px' }}>
                      <MapPin size={14} />
                      <span>Showroom {store.city}</span>
                    </div>
                    <p style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: 1.4 }}>
                      {store.address}
                    </p>
                    <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700 }}>
                      Hotline: {store.hotline}
                    </span>
                  </div>
                ))}
              </div>

              {/* Shipping & Delivery policy */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.06)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  fontSize: '11px',
                  color: '#34d399',
                  fontWeight: 600,
                }}
              >
                <Truck size={15} color="#34d399" style={{ flexShrink: 0 }} />
                <span>{activeLayer.shippingInfo}</span>
              </div>
            </div>

            {/* Section 3: Pricing & Add to Cart Footer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 900, color: '#38bdf8', letterSpacing: '-0.5px' }}>
                    {activeLayer.price.toLocaleString()}đ
                  </span>
                  <span style={{ fontSize: '13px', color: '#64748b', textDecoration: 'line-through' }}>
                    {activeLayer.originalPrice.toLocaleString()}đ
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: '#ef4444',
                      background: 'rgba(239, 68, 68, 0.15)',
                      padding: '2px 8px',
                      borderRadius: '8px',
                    }}
                  >
                    -{Math.round((1 - activeLayer.price / activeLayer.originalPrice) * 100)}%
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                  Đã bao gồm VAT • Cam kết chính hãng 100%
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleAddSingleLayer(activeLayer)}
                  className="btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    fontSize: '13px',
                    fontWeight: 800,
                    borderRadius: '14px',
                    background: cartFeedback === activeLayer.id
                      ? '#10b981'
                      : 'linear-gradient(90deg, #0284c7, #06b6d4)',
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(6, 182, 212, 0.4)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {cartFeedback === activeLayer.id ? (
                    <>
                      <Check size={16} />
                      <span>Đã Thêm Vào Giỏ Hàng!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      <span>Thêm Vào Giỏ Hàng</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
