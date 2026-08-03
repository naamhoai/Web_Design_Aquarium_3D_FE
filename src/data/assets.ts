// Dữ liệu thư viện thủy sinh (mock, không backend).
// Mỗi asset gồm nguồn gốc, mô tả, danh sách cửa hàng bán + giá.
// Riêng cá có thêm hướng dẫn chăm sóc chi tiết (nước, oxy, vi sinh, cho ăn).

export type AssetCategory = 'tank' | 'plant' | 'decor' | 'fish';

export interface Store {
  name: string; // Tên cửa hàng
  price: number; // Giá tại cửa hàng đó (VND)
  location?: string; // Khu vực / online
  url?: string; // Link tham khảo (mở tab mới)
}

export interface FishCare {
  species: string; // Loài / tên khoa học
  temperament: string; // Tính nết (hiền/dữ, bơi đàn...)
  waterTemp: string; // Nhiệt độ nước
  ph: string; // Độ pH
  minTank: string; // Dung tích tối thiểu
  oxygen: string; // Nhu cầu oxy / sục khí
  bacteria: string; // Cách châm vi sinh / chu trình nitơ
  feeding: string; // Cho ăn gì, mấy lần/ngày
  difficulty: 'Dễ' | 'Trung bình' | 'Khó'; // Mức độ khó nuôi
}

export interface Asset {
  id: string;
  category: AssetCategory;
  categoryLabel: string; // Nhãn tiếng Việt hiển thị
  name: string;
  origin: string; // Nguồn gốc / xuất xứ
  image: string;
  description: string;
  priceFrom: number; // Giá tham khảo thấp nhất (hiện trên card)
  stores: Store[]; // Danh sách cửa hàng bán
  careNote?: string; // Cây/decor/bể: cách trồng/đặt/bảo dưỡng
  fishCare?: FishCare; // Chỉ dành cho cá
}

export const categoryLabels: Record<AssetCategory | 'all', string> = {
  all: 'Tất cả',
  tank: 'Bể Kính',
  plant: 'Cây Thủy Sinh',
  decor: 'Trang Trí',
  fish: 'Cá Cảnh',
};

export const assets: Asset[] = [
  // ────────────────────────── BỂ KÍNH ──────────────────────────
  {
    id: 'tank-cubic-rimless',
    category: 'tank',
    categoryLabel: 'Bể Kính',
    name: 'Bể Cubic Rimless Siêu Trong 60cm',
    origin: 'Kính Optiwhite, gia công tại Việt Nam theo chuẩn ADA (Nhật Bản)',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=600&auto=format&fit=crop&q=80',
    description:
      'Bể không viền, kính siêu trong độ truyền sáng 92%, mài cạnh bo góc tinh tế. Dung tích ~64 lít, lý tưởng cho hồ thủy sinh Nature Style.',
    priceFrom: 850000,
    stores: [
      { name: 'Thủy Sinh AquaTin', price: 850000, location: 'Cầu Giấy, Hà Nội', url: 'https://shopee.vn' },
      { name: 'Aquarium Center', price: 920000, location: 'Quận 10, TP.HCM' },
      { name: 'Shopee Mall - Aqua Store', price: 990000, location: 'Online toàn quốc', url: 'https://shopee.vn' },
    ],
    careNote:
      'Vệ sinh kính bằng dao cạo rêu chuyên dụng, tránh cát/sạn làm xước. Kê bể trên đệm lót mút để phân bổ lực đều, không đặt trực tiếp lên mặt gồ ghề.',
  },
  {
    id: 'tank-curve-front',
    category: 'tank',
    categoryLabel: 'Bể Kính',
    name: 'Bể Cong Mặt Trước 90cm',
    origin: 'Thương hiệu Chihiros (Trung Quốc), phân phối chính hãng',
    image: 'https://images.unsplash.com/photo-1584267385494-9fdd9a71ad75?w=600&auto=format&fit=crop&q=80',
    description:
      'Mặt trước uốn cong tạo hiệu ứng nhìn không góc chết, dung tích ~180 lít. Kèm nắp đậy chống cá nhảy và khe đi dây gọn gàng.',
    priceFrom: 2450000,
    stores: [
      { name: 'Chihiros Việt Nam', price: 2450000, location: 'Online', url: 'https://chihiros.vn' },
      { name: 'Hồ Thủy Sinh 3D', price: 2600000, location: 'Thủ Đức, TP.HCM' },
    ],
    careNote:
      'Không dùng chất tẩy có cồn lên mặt cong (dễ mờ lớp phủ). Lau bằng khăn microfiber ẩm và nước sạch.',
  },
  {
    id: 'tank-nano-bowl',
    category: 'tank',
    categoryLabel: 'Bể Kính',
    name: 'Bể Nano Tròn Mini 20cm',
    origin: 'Sản xuất nội địa, dòng phổ thông cho bàn làm việc',
    image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&auto=format&fit=crop&q=80',
    description:
      'Bể tròn ~8 lít để bàn, hợp nuôi tép, cá Betta hoặc trồng vài khóm rêu. Nhỏ gọn, dễ đặt ở phòng làm việc.',
    priceFrom: 180000,
    stores: [
      { name: 'Tiki - Aqua Home', price: 180000, location: 'Online', url: 'https://tiki.vn' },
      { name: 'Chợ Cá Cảnh Lưu Xuân Tín', price: 150000, location: 'Quận 5, TP.HCM' },
    ],
    careNote:
      'Bể nhỏ nước biến động nhanh: thay 20-30% nước mỗi tuần, tránh đặt nơi nắng gắt gây tăng nhiệt và rêu hại.',
  },

  // ────────────────────────── CÂY THỦY SINH ──────────────────────────
  {
    id: 'plant-anubias-nana',
    category: 'plant',
    categoryLabel: 'Cây Thủy Sinh',
    name: 'Ráy Nana (Anubias nana)',
    origin: 'Bản địa Tây Phi (lưu vực sông Congo)',
    image: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=600&auto=format&fit=crop&q=80',
    description:
      'Cây lá cứng, xanh đậm, cực dễ nuôi. Buộc vào lũa hoặc đá, không cần cắm nền. Chịu được ánh sáng yếu, phù hợp người mới.',
    priceFrom: 35000,
    stores: [
      { name: 'Thủy Sinh Xanh', price: 35000, location: 'Hà Nội', url: 'https://shopee.vn' },
      { name: 'Aqua Plant Farm', price: 40000, location: 'Online' },
    ],
    careNote:
      'KHÔNG vùi thân rễ (củ) xuống nền — sẽ thối. Chỉ buộc rễ bám lũa/đá. Ánh sáng thấp-trung bình, không bắt buộc CO2.',
  },
  {
    id: 'plant-java-moss',
    category: 'plant',
    categoryLabel: 'Cây Thủy Sinh',
    name: 'Rêu Java (Taxiphyllum barbieri)',
    origin: 'Đông Nam Á (Việt Nam, Malaysia)',
    image: 'https://images.unsplash.com/photo-1614850523060-8da1d56ae167?w=600&auto=format&fit=crop&q=80',
    description:
      'Rêu bám bền, tạo mảng xanh mềm mại trên lũa đá. Nơi trú ẩn tốt cho cá con và tép. Sống khỏe trong đa số điều kiện.',
    priceFrom: 25000,
    stores: [
      { name: 'Chợ Rêu Thủy Sinh', price: 25000, location: 'Online', url: 'https://shopee.vn' },
      { name: 'Green Aqua Store', price: 30000, location: 'TP.HCM' },
    ],
    careNote:
      'Cắt tỉa định kỳ để tránh dày quá làm lớp trong bị úng và rụng. Dòng chảy nhẹ giúp rêu không bám cặn bẩn.',
  },
  {
    id: 'plant-pearl-weed',
    category: 'plant',
    categoryLabel: 'Cây Thủy Sinh',
    name: 'Trân Châu Ngọc Trai (Micranthemum)',
    origin: 'Bắc & Trung Mỹ',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&auto=format&fit=crop&q=80',
    description:
      'Cây tiền cảnh lá nhỏ li ti, tạo thảm xanh mướt. Quang hợp nhả bọt oxy li ti như ngọc trai rất đẹp.',
    priceFrom: 45000,
    stores: [
      { name: 'Aqua Plant Farm', price: 45000, location: 'Online', url: 'https://shopee.vn' },
      { name: 'Thủy Sinh Cao Cấp', price: 55000, location: 'Hà Nội' },
    ],
    careNote:
      'Cây khó: cần ánh sáng mạnh + CO2 + nền dinh dưỡng để tạo thảm đẹp. Thiếu sáng cây vươn cao, thưa và rụng lá.',
  },

  // ────────────────────────── TRANG TRÍ ──────────────────────────
  {
    id: 'decor-driftwood',
    category: 'decor',
    categoryLabel: 'Trang Trí',
    name: 'Lũa Đỗ Quyên Nghệ Thuật',
    origin: 'Gốc cây đỗ quyên vùng núi cao phía Bắc',
    image: 'https://images.unsplash.com/photo-1501426026826-31c667bdf23d?w=600&auto=format&fit=crop&q=80',
    description:
      'Lũa nhánh dáng bay, thớ đẹp, dùng làm điểm nhấn bố cục hoặc buộc rêu, ráy. Mỗi khúc một dáng độc nhất.',
    priceFrom: 120000,
    stores: [
      { name: 'Lũa Đá Thủy Sinh', price: 120000, location: 'Hà Nội', url: 'https://shopee.vn' },
      { name: 'Aqua Deco Shop', price: 150000, location: 'TP.HCM' },
    ],
    careNote:
      'Ngâm lũa 5-7 ngày (hoặc luộc) để ra hết tannin trước khi vào bể, tránh làm vàng nước. Có thể dằn đá cho chìm.',
  },
  {
    id: 'decor-seiryu-stone',
    category: 'decor',
    categoryLabel: 'Trang Trí',
    name: 'Đá Kẹp Kem (Seiryu Stone)',
    origin: 'Nhập khẩu, phổ biến trong bố cục Iwagumi Nhật Bản',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    description:
      'Đá vân trắng xám, cạnh sắc tạo bố cục hùng vĩ kiểu núi non. Được ưa chuộng trong phong cách Iwagumi.',
    priceFrom: 30000,
    stores: [
      { name: 'Lũa Đá Thủy Sinh', price: 30000, location: 'Online (tính theo kg)', url: 'https://shopee.vn' },
      { name: 'Đá Cảnh Thủy Sinh HCM', price: 35000, location: 'TP.HCM' },
    ],
    careNote:
      'Đá có tính kiềm nhẹ, làm tăng pH và độ cứng nước — cân nhắc với cá/tép ưa nước mềm. Cọ rửa sạch bùn trước khi dùng.',
  },
  {
    id: 'decor-aquasoil',
    category: 'decor',
    categoryLabel: 'Trang Trí',
    name: 'Nền Dinh Dưỡng Aquasoil',
    origin: 'Thương hiệu Gex / ADA Amazonia (Nhật Bản)',
    image: 'https://images.unsplash.com/photo-1554475900-0a0350e3fc7b?w=600&auto=format&fit=crop&q=80',
    description:
      'Nền trộn dạng viên, cung cấp dinh dưỡng cho cây và hạ pH về mức lý tưởng cho cây thủy sinh phát triển.',
    priceFrom: 250000,
    stores: [
      { name: 'Nền Thủy Sinh Store', price: 250000, location: 'Online (bao 3L)', url: 'https://shopee.vn' },
      { name: 'ADA Việt Nam', price: 480000, location: 'Hà Nội (bao 9L)' },
    ],
    careNote:
      'Nền mới thường xì amoniac giai đoạn đầu: chạy lọc cấy vi sinh 1-2 tuần (chu trình cycle) TRƯỚC khi thả cá.',
  },

  // ────────────────────────── CÁ CẢNH ──────────────────────────
  {
    id: 'fish-neon-tetra',
    category: 'fish',
    categoryLabel: 'Cá Cảnh',
    name: 'Cá Neon (Neon Tetra)',
    origin: 'Lưu vực sông Amazon (Nam Mỹ)',
    image: 'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?w=600&auto=format&fit=crop&q=80',
    description:
      'Cá nhỏ có dải xanh - đỏ óng ánh, bơi thành đàn tuyệt đẹp. Hiền lành, hợp bể cộng đồng có nhiều cây.',
    priceFrom: 8000,
    stores: [
      { name: 'Cá Cảnh Thái Hòa', price: 8000, location: 'Hà Nội', url: 'https://shopee.vn' },
      { name: 'Chợ Cá Lưu Xuân Tín', price: 6000, location: 'Quận 5, TP.HCM' },
      { name: 'Aqua Fish Online', price: 10000, location: 'Online (bán theo lố 10 con)' },
    ],
    fishCare: {
      species: 'Paracheirodon innesi',
      temperament: 'Hiền, bơi đàn — nên nuôi từ 10 con trở lên',
      waterTemp: '22 - 26°C',
      ph: '5.5 - 7.0 (ưa nước mềm, hơi axit)',
      minTank: '40 lít',
      oxygen: 'Cần oxy vừa phải; lọc tạo dòng nhẹ + cây thủy sinh nhả oxy là đủ, không cần sục mạnh.',
      bacteria:
        'Cấy vi sinh và chạy cycle bể 2-4 tuần trước khi thả. Duy trì men vi sinh định kỳ để phân hủy amoniac/nitrit — Neon rất nhạy với nước mới.',
      feeding:
        'Cho ăn 1-2 lần/ngày, lượng ăn hết trong 2 phút. Thức ăn vảy mịn, trùn chỉ đông lạnh, artemia. Tránh cho ăn dư gây đục nước.',
      difficulty: 'Dễ',
    },
  },
  {
    id: 'fish-discus',
    category: 'fish',
    categoryLabel: 'Cá Cảnh',
    name: 'Cá Đĩa (Discus)',
    origin: 'Lưu vực Amazon; dòng thương mại lai tạo ở Đông Nam Á',
    image: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=600&auto=format&fit=crop&q=80',
    description:
      'Được mệnh danh "nữ hoàng thủy sinh" với thân tròn dẹp, màu sắc rực rỡ. Cần chăm sóc kỹ, hợp người chơi có kinh nghiệm.',
    priceFrom: 250000,
    stores: [
      { name: 'Trại Cá Đĩa Sài Gòn', price: 250000, location: 'TP.HCM', url: 'https://shopee.vn' },
      { name: 'Discus Farm Hà Nội', price: 300000, location: 'Hà Nội' },
    ],
    fishCare: {
      species: 'Symphysodon aequifasciatus',
      temperament: 'Hiền nhưng nhút nhát, nuôi đàn 5-6 con, tránh nuôi chung cá hiếu động',
      waterTemp: '28 - 31°C (ấm hơn cá thường)',
      ph: '6.0 - 7.0 (nước mềm, sạch)',
      minTank: '200 lít cho đàn',
      oxygen: 'Cần oxy tốt và nước lưu thông nhẹ nhàng; dùng lọc công suất lớn nhưng đầu ra không tạo dòng xoáy mạnh.',
      bacteria:
        'Hệ vi sinh phải cực ổn định. Chạy lọc thùng + giá thể lớn, cấy vi sinh đều đặn. Thay 25-50% nước mỗi ngày/cách ngày để giữ nước tinh khiết.',
      feeding:
        'Cho ăn 2-3 lần/ngày: tim bò xay, trùn chỉ, thức ăn chuyên cá đĩa. Hút cặn thức ăn thừa ngay vì cá đĩa rất nhạy với chất lượng nước.',
      difficulty: 'Khó',
    },
  },
  {
    id: 'fish-betta',
    category: 'fish',
    categoryLabel: 'Cá Cảnh',
    name: 'Cá Betta (Cá Xiêm)',
    origin: 'Đồng ruộng, kênh rạch Đông Nam Á (Thái Lan, Việt Nam)',
    image: 'https://images.unsplash.com/photo-1520869562399-e772f042f422?w=600&auto=format&fit=crop&q=80',
    description:
      'Cá vây dài rực rỡ, cá đực hiếu chiến. Có cơ quan hô hấp phụ (mê lộ) nên sống được ở nước ít oxy, nuôi bể nhỏ được.',
    priceFrom: 30000,
    stores: [
      { name: 'Betta House', price: 30000, location: 'Online', url: 'https://shopee.vn' },
      { name: 'Chợ Cá Cảnh Sinh Trung', price: 25000, location: 'Nha Trang' },
    ],
    fishCare: {
      species: 'Betta splendens',
      temperament: 'Cá đực rất hung, nuôi RIÊNG mỗi con; không thả chung 2 con đực',
      waterTemp: '24 - 28°C',
      ph: '6.5 - 7.5',
      minTank: '5 lít (khuyến nghị 10-20 lít có sưởi)',
      oxygen:
        'Ngoi lên mặt lấy khí trời nhờ cơ quan mê lộ nên KHÔNG cần sục oxy mạnh; chỉ cần mặt nước thoáng. Tránh dòng chảy mạnh làm rách vây.',
      bacteria:
        'Dù khỏe vẫn nên có lọc nhẹ và cấy vi sinh để giữ nước sạch. Bể không lọc phải thay nước thường xuyên hơn (2-3 ngày/lần).',
      feeding:
        'Cho ăn 1-2 lần/ngày vài viên cám chuyên Betta hoặc trùn chỉ/artemia. Betta dễ béo phì và táo bón — mỗi tuần nhịn ăn 1 ngày.',
      difficulty: 'Dễ',
    },
  },
  {
    id: 'fish-angelfish',
    category: 'fish',
    categoryLabel: 'Cá Cảnh',
    name: 'Cá Thần Tiên (Angelfish)',
    origin: 'Lưu vực Amazon (Nam Mỹ)',
    image: 'https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?w=600&auto=format&fit=crop&q=80',
    description:
      'Dáng cao, vây dài thướt tha như dải lụa. Bơi thanh thoát giữa tầng nước, hợp bể cao trồng cây thân cao.',
    priceFrom: 40000,
    stores: [
      { name: 'Aqua Fish Online', price: 40000, location: 'Online', url: 'https://shopee.vn' },
      { name: 'Cá Cảnh Thái Hòa', price: 50000, location: 'Hà Nội' },
    ],
    fishCare: {
      species: 'Pterophyllum scalare',
      temperament: 'Tương đối hiền nhưng có thể ăn cá quá nhỏ (Neon con); nuôi đàn 4-6 con',
      waterTemp: '24 - 29°C',
      ph: '6.0 - 7.5',
      minTank: '120 lít, bể cao ≥ 45cm cho vây dài',
      oxygen: 'Cần oxy trung bình; lọc + dòng nhẹ là đủ, tránh dòng quá mạnh vì vây dài dễ mệt.',
      bacteria:
        'Chạy cycle và cấy vi sinh trước khi thả. Thay 20-30% nước/tuần, giữ nitrat thấp để vây không cụp.',
      feeding:
        'Cho ăn 2 lần/ngày: cám tổng hợp, trùn chỉ, artemia. Đa dạng thức ăn giúp lên màu và vây khỏe.',
      difficulty: 'Trung bình',
    },
  },
];
