// ─── TYPES ───────────────────────────────────────────────────────────────────

export interface PropertyConfig {
  name: string;
  initialValue: string;
  targetValue: string;
}

export interface Level {
  id: string;
  title: string;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  levelType: 'dasar' | 'tantangan' | 'custom';
  category?: 'Visual' | 'Typography' | 'Spacing' | 'Layout';
  concept?: string;
  description: string;
  htmlStructure: string;
  propertyConfigs: PropertyConfig[];
  timeLimit: number;
  isLocked?: boolean;
  stars?: number;
  isUserCreated?: boolean;
  createdBy?: string;
}

// ─── PREDEFINED PROPERTIES (16 total, 4 categories) ─────────────────────────

export const PREDEFINED_PROPERTIES: Record<string, {
  label: string;
  category: string;
  description: string;
  values: string[];
  displayValues?: string[];
}> = {
  // Visual
  'background-color': { label: 'Background Color', category: 'Visual', description: 'Warna latar belakang elemen', values: ['#ffffff', '#111827', '#6b7280', '#1d4ed8', '#dc2626', '#16a34a', '#f59e0b', '#9333ea', '#374151'], displayValues: ['White', 'Black', 'Gray', 'Blue', 'Red', 'Green', 'Amber', 'Purple', 'Dark Gray'] },
  'color':            { label: 'Text Color',       category: 'Visual', description: 'Warna teks elemen',            values: ['#111827', '#374151', '#6b7280', '#ffffff', '#1d4ed8', '#dc2626', '#16a34a', '#9333ea', '#f59e0b'], displayValues: ['Black', 'Gray', 'Light Gray', 'White', 'Blue', 'Red', 'Green', 'Purple', 'Amber'] },
  'border-radius':    { label: 'Border Radius',    category: 'Visual', description: 'Sudut melengkung',             values: ['0px', '4px', '8px', '12px', '16px', '20px', '24px', '50%'] },
  'opacity':          { label: 'Opacity',          category: 'Visual', description: 'Tingkat transparansi',         values: ['0.5', '0.75', '0.9', '1'], displayValues: ['50%', '75%', '90%', '100%'] },
  // Typography
  'font-size':        { label: 'Font Size',        category: 'Typography', description: 'Ukuran teks',              values: ['14px', '16px', '18px', '20px', '24px', '28px', '32px', '40px', '48px', '56px'] },
  'font-weight':      { label: 'Font Weight',      category: 'Typography', description: 'Ketebalan teks',           values: ['400', '500', '600', '700', '800'] },
  'text-align':       { label: 'Text Align',       category: 'Typography', description: 'Perataan teks horizontal', values: ['left', 'center', 'right'] },
  'letter-spacing':   { label: 'Letter Spacing',   category: 'Typography', description: 'Jarak antar huruf',        values: ['-1px', '0px', '1px', '2px', '3px'] },
  // Spacing
  'padding':          { label: 'Padding',          category: 'Spacing', description: 'Jarak dalam elemen',         values: ['8px', '12px', '16px', '20px', '24px', '32px'] },
  'margin':           { label: 'Margin',           category: 'Spacing', description: 'Jarak luar elemen',          values: ['0px', '8px', '12px', '16px', '24px', '32px'] },
  'gap':              { label: 'Gap',              category: 'Spacing', description: 'Jarak antar child elemen',    values: ['4px', '8px', '12px', '16px', '24px', '32px'] },
  // Layout
  'display':          { label: 'Display',          category: 'Layout', description: 'Tipe tampilan elemen',        values: ['block', 'flex', 'inline-block', 'inline-flex', 'grid'], displayValues: ['Block', 'Flex', 'Inline Block', 'Inline Flex', 'Grid'] },
  'width':            { label: 'Width',            category: 'Layout', description: 'Lebar elemen',                values: ['150px', '200px', '250px', '300px', '350px', '400px', '100%'] },
  'height':           { label: 'Height',           category: 'Layout', description: 'Tinggi elemen',               values: ['80px', '120px', '160px', '200px', '250px', '300px', 'auto'] },
  'align-items':      { label: 'Align Items',      category: 'Layout', description: 'Perataan vertikal child',     values: ['flex-start', 'center', 'flex-end', 'stretch'], displayValues: ['Top', 'Center', 'Bottom', 'Stretch'] },
  'justify-content':  { label: 'Justify Content',  category: 'Layout', description: 'Perataan horizontal child',   values: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'], displayValues: ['Start', 'Center', 'End', 'Space Between', 'Space Around'] },
};

export const PREDEFINED_CATEGORIES = ['Visual', 'Typography', 'Spacing', 'Layout'];

// ─── CSS MATERIALS (MDN-based, Indonesian) ──────────────────────────────────

export const CSS_MATERIALS: Record<string, { pengertian: string; fungsi: string }> = {
  'background-color': {
    pengertian: 'Properti CSS untuk mengatur warna latar belakang suatu elemen HTML.',
    fungsi: 'Memberikan warna dasar pada elemen agar konten lebih menonjol, menarik, dan mudah dibaca.'
  },
  'color': {
    pengertian: 'Properti CSS untuk mengatur warna teks (huruf) di dalam elemen.',
    fungsi: 'Mengatur warna tulisan agar kontras dengan latar belakang dan nyaman dibaca oleh pengguna.'
  },
  'border-radius': {
    pengertian: 'Properti CSS untuk mengatur tingkat kelengkungan sudut pada elemen.',
    fungsi: 'Membuat sudut elemen menjadi membulat sehingga tampilan terlihat lebih lembut dan modern.'
  },
  'opacity': {
    pengertian: 'Properti CSS untuk mengatur tingkat transparansi elemen, dari 0 (tidak terlihat) hingga 1 (penuh).',
    fungsi: 'Mengatur seberapa transparan elemen ditampilkan, berguna untuk efek visual dan hierarki konten.'
  },
  'font-size': {
    pengertian: 'Properti CSS untuk mengatur ukuran huruf atau teks pada elemen.',
    fungsi: 'Menentukan besar kecilnya teks agar sesuai dengan hierarki informasi dan mudah dibaca.'
  },
  'font-weight': {
    pengertian: 'Properti CSS untuk mengatur ketebalan huruf, dari tipis (400) hingga tebal (800).',
    fungsi: 'Memberikan penekanan visual pada teks tertentu, misalnya judul yang harus lebih tebal dari paragraf.'
  },
  'text-align': {
    pengertian: 'Properti CSS untuk mengatur perataan horizontal teks dalam elemen (kiri, tengah, atau kanan).',
    fungsi: 'Mengatur posisi teks agar rata kiri, tengah, atau kanan sesuai kebutuhan desain.'
  },
  'letter-spacing': {
    pengertian: 'Properti CSS untuk mengatur jarak antar huruf dalam teks.',
    fungsi: 'Menambah atau mengurangi spasi antar huruf untuk meningkatkan keterbacaan atau efek tipografi.'
  },
  'padding': {
    pengertian: 'Properti CSS untuk mengatur jarak antara konten dan border (batas) elemen.',
    fungsi: 'Memberikan ruang di dalam elemen agar konten tidak terlalu rapat dengan tepi elemen.'
  },
  'margin': {
    pengertian: 'Properti CSS untuk mengatur jarak luar elemen terhadap elemen lain di sekitarnya.',
    fungsi: 'Memberikan ruang di luar elemen agar tidak menempel dengan elemen tetangga.'
  },
  'gap': {
    pengertian: 'Properti CSS untuk mengatur jarak antar child elemen di dalam container flex atau grid.',
    fungsi: 'Mengatur jarak seragam antar item dalam layout flexbox atau grid tanpa perlu margin individual.'
  },
  'display': {
    pengertian: 'Properti CSS untuk mengatur bagaimana elemen ditampilkan (block, flex, grid, dll).',
    fungsi: 'Menentukan jenis layout elemen, apakah blok penuh, fleksibel, atau inline.'
  },
  'width': {
    pengertian: 'Properti CSS untuk mengatur lebar suatu elemen.',
    fungsi: 'Menentukan seberapa lebar elemen ditampilkan agar sesuai dengan desain halaman.'
  },
  'height': {
    pengertian: 'Properti CSS untuk mengatur tinggi suatu elemen.',
    fungsi: 'Menentukan seberapa tinggi elemen ditampilkan agar proporsional dengan konten di dalamnya.'
  },
  'align-items': {
    pengertian: 'Properti CSS untuk mengatur perataan vertikal child elemen dalam container flex.',
    fungsi: 'Memposisikan item anak secara vertikal: di atas, tengah, bawah, atau meregang penuh.'
  },
  'justify-content': {
    pengertian: 'Properti CSS untuk mengatur perataan horizontal child elemen dalam container flex.',
    fungsi: 'Memposisikan item anak secara horizontal: di awal, tengah, akhir, atau tersebar merata.'
  },
};

// ─── HELPER: Build level with category-based HTML ──────────────────────────

function htmlWrap(inner: string, extra = ''): string {
  return `<div id="target" style="padding: 24px; background-color: #6b7280; border-radius: 12px; ${extra}">${inner}</div>`;
}

// ─── LEVEL DASAR: MUDAH (16 levels, 60s, 1 property) ───────────────────────

const DASAR_MUDAH: Level[] = [
  // Visual 1-4
  { id: 'd-v1', title: 'Warna Latar', difficulty: 'Mudah', levelType: 'dasar', category: 'Visual', concept: 'Background Color',
    description: 'Ubah warna latar belakang kartu agar sesuai target.',
    htmlStructure: '<div id="target" style="padding:24px;background-color:#ffffff;border-radius:12px;"><h2 style="font-size:22px;font-weight:700;margin:0 0 8px;color:#111827;">Profil Saya</h2><p style="color:#374151;font-size:14px;margin:0;">Belajar CSS itu menyenangkan</p></div>',
    propertyConfigs: [{ name: 'background-color', initialValue: '#ffffff', targetValue: '#6b7280' }], timeLimit: 60 },
  { id: 'd-v2', title: 'Warna Teks', difficulty: 'Mudah', levelType: 'dasar', category: 'Visual', concept: 'Text Color',
    description: 'Ubah warna teks judul agar sesuai target.',
    htmlStructure: htmlWrap('<h2 style="font-size:22px;font-weight:700;margin:0 0 8px;">Judul Artikel</h2><p style="font-size:14px;color:#d1d5db;margin:0;">Deskripsi singkat di sini</p>'),
    propertyConfigs: [{ name: 'color', initialValue: '#111827', targetValue: '#1d4ed8' }], timeLimit: 60 },
  { id: 'd-v3', title: 'Sudut Melengkung', difficulty: 'Mudah', levelType: 'dasar', category: 'Visual', concept: 'Border Radius',
    description: 'Atur sudut kartu agar membulat sesuai target.',
    htmlStructure: htmlWrap('<h2 style="font-size:20px;font-weight:700;margin:0 0 6px;color:#ffffff;">Kartu Info</h2><p style="font-size:14px;color:#d1d5db;margin:0;">Konten kartu</p>'),
    propertyConfigs: [{ name: 'border-radius', initialValue: '0px', targetValue: '16px' }], timeLimit: 60 },
  { id: 'd-v4', title: 'Transparansi', difficulty: 'Mudah', levelType: 'dasar', category: 'Visual', concept: 'Opacity',
    description: 'Atur transparansi elemen agar sesuai target.',
    htmlStructure: htmlWrap('<h2 style="font-size:20px;font-weight:700;margin:0 0 6px;color:#ffffff;">Elemen Hantu</h2><p style="font-size:14px;color:#d1d5db;margin:0;">Coba atur opacity</p>'),
    propertyConfigs: [{ name: 'opacity', initialValue: '1', targetValue: '0.75' }], timeLimit: 60 },
  // Typography 5-8
  { id: 'd-t1', title: 'Ukuran Huruf', difficulty: 'Mudah', levelType: 'dasar', category: 'Typography', concept: 'Font Size',
    description: 'Perbesar ukuran teks judul agar sesuai target.',
    htmlStructure: htmlWrap('<h2 style="font-weight:700;margin:0 0 8px;color:#ffffff;">Judul Besar</h2><p style="font-size:14px;color:#d1d5db;margin:0;">Subteks kecil</p>'),
    propertyConfigs: [{ name: 'font-size', initialValue: '20px', targetValue: '40px' }], timeLimit: 60 },
  { id: 'd-t2', title: 'Ketebalan Huruf', difficulty: 'Mudah', levelType: 'dasar', category: 'Typography', concept: 'Font Weight',
    description: 'Tebalkan teks judul agar sesuai target.',
    htmlStructure: htmlWrap('<h2 style="font-size:24px;margin:0 0 8px;color:#ffffff;">Teks Tebal</h2><p style="font-size:14px;color:#d1d5db;margin:0;">Deskripsi</p>'),
    propertyConfigs: [{ name: 'font-weight', initialValue: '400', targetValue: '800' }], timeLimit: 60 },
  { id: 'd-t3', title: 'Perataan Teks', difficulty: 'Mudah', levelType: 'dasar', category: 'Typography', concept: 'Text Align',
    description: 'Tengahkan teks agar sesuai target.',
    htmlStructure: htmlWrap('<h2 style="font-size:22px;font-weight:700;margin:0 0 8px;color:#ffffff;">Rata Tengah</h2><p style="font-size:14px;color:#d1d5db;margin:0;">Paragraf pendek</p>'),
    propertyConfigs: [{ name: 'text-align', initialValue: 'left', targetValue: 'center' }], timeLimit: 60 },
  { id: 'd-t4', title: 'Jarak Huruf', difficulty: 'Mudah', levelType: 'dasar', category: 'Typography', concept: 'Letter Spacing',
    description: 'Atur jarak antar huruf agar sesuai target.',
    htmlStructure: htmlWrap('<h2 style="font-size:24px;font-weight:700;margin:0 0 8px;color:#ffffff;">SPASI HURUF</h2><p style="font-size:14px;color:#d1d5db;margin:0;">Coba atur letter-spacing</p>'),
    propertyConfigs: [{ name: 'letter-spacing', initialValue: '0px', targetValue: '3px' }], timeLimit: 60 },
  // Spacing 9-11
  { id: 'd-s1', title: 'Jarak Dalam', difficulty: 'Mudah', levelType: 'dasar', category: 'Spacing', concept: 'Padding',
    description: 'Tambahkan padding agar konten tidak terlalu rapat.',
    htmlStructure: htmlWrap('<h2 style="font-size:20px;font-weight:700;margin:0 0 6px;color:#ffffff;">Kartu Padding</h2><p style="font-size:14px;color:#d1d5db;margin:0;">Atur jarak dalam</p>'),
    propertyConfigs: [{ name: 'padding', initialValue: '8px', targetValue: '32px' }], timeLimit: 60 },
  { id: 'd-s2', title: 'Jarak Luar', difficulty: 'Mudah', levelType: 'dasar', category: 'Spacing', concept: 'Margin',
    description: 'Tambahkan margin agar kartu memiliki jarak luar.',
    htmlStructure: htmlWrap('<h2 style="font-size:20px;font-weight:700;margin:0 0 6px;color:#ffffff;">Kartu Margin</h2><p style="font-size:14px;color:#d1d5db;margin:0;">Atur jarak luar</p>'),
    propertyConfigs: [{ name: 'margin', initialValue: '0px', targetValue: '24px' }], timeLimit: 60 },
  { id: 'd-s3', title: 'Jarak Antar Item', difficulty: 'Mudah', levelType: 'dasar', category: 'Spacing', concept: 'Gap',
    description: 'Atur jarak antar elemen dalam container flex.',
    htmlStructure: '<div id="target" style="padding:24px;background-color:#6b7280;border-radius:12px;display:flex;flex-direction:column;"><div style="background:#dbeafe;padding:12px;border-radius:8px;font-weight:600;color:#1e40af;">Item 1</div><div style="background:#d1fae5;padding:12px;border-radius:8px;font-weight:600;color:#065f46;">Item 2</div><div style="background:#fef3c7;padding:12px;border-radius:8px;font-weight:600;color:#92400e;">Item 3</div></div>',
    propertyConfigs: [{ name: 'gap', initialValue: '4px', targetValue: '16px' }], timeLimit: 60 },
  // Layout 12-16
  { id: 'd-l1', title: 'Tipe Display', difficulty: 'Mudah', levelType: 'dasar', category: 'Layout', concept: 'Display',
    description: 'Ubah display elemen menjadi flex.',
    htmlStructure: '<div id="target" style="padding:24px;background-color:#6b7280;border-radius:12px;"><div style="background:#dbeafe;padding:12px;border-radius:8px;font-weight:600;color:#1e40af;">Item A</div><div style="background:#d1fae5;padding:12px;border-radius:8px;font-weight:600;color:#065f46;">Item B</div></div>',
    propertyConfigs: [{ name: 'display', initialValue: 'block', targetValue: 'flex' }], timeLimit: 60 },
  { id: 'd-l2', title: 'Lebar Elemen', difficulty: 'Mudah', levelType: 'dasar', category: 'Layout', concept: 'Width',
    description: 'Atur lebar kartu agar sesuai target.',
    htmlStructure: htmlWrap('<h2 style="font-size:20px;font-weight:700;margin:0 0 6px;color:#ffffff;">Kartu Lebar</h2><p style="font-size:14px;color:#d1d5db;margin:0;">Atur width</p>'),
    propertyConfigs: [{ name: 'width', initialValue: '200px', targetValue: '350px' }], timeLimit: 60 },
  { id: 'd-l3', title: 'Tinggi Elemen', difficulty: 'Mudah', levelType: 'dasar', category: 'Layout', concept: 'Height',
    description: 'Atur tinggi kartu agar sesuai target.',
    htmlStructure: htmlWrap('<h2 style="font-size:20px;font-weight:700;margin:0 0 6px;color:#ffffff;">Kartu Tinggi</h2><p style="font-size:14px;color:#d1d5db;margin:0;">Atur height</p>'),
    propertyConfigs: [{ name: 'height', initialValue: '120px', targetValue: '250px' }], timeLimit: 60 },
  { id: 'd-l4', title: 'Rata Vertikal', difficulty: 'Mudah', levelType: 'dasar', category: 'Layout', concept: 'Align Items',
    description: 'Atur perataan vertikal child agar di tengah.',
    htmlStructure: '<div id="target" style="padding:24px;background-color:#6b7280;border-radius:12px;display:flex;height:150px;"><div style="background:#dbeafe;padding:12px;border-radius:8px;font-weight:600;color:#1e40af;">Kiri</div><div style="background:#d1fae5;padding:12px;border-radius:8px;font-weight:600;color:#065f46;">Kanan</div></div>',
    propertyConfigs: [{ name: 'align-items', initialValue: 'flex-start', targetValue: 'center' }], timeLimit: 60 },
  { id: 'd-l5', title: 'Rata Horizontal', difficulty: 'Mudah', levelType: 'dasar', category: 'Layout', concept: 'Justify Content',
    description: 'Atur perataan horizontal child agar di tengah.',
    htmlStructure: '<div id="target" style="padding:24px;background-color:#6b7280;border-radius:12px;display:flex;"><div style="background:#dbeafe;padding:12px;border-radius:8px;font-weight:600;color:#1e40af;">A</div><div style="background:#d1fae5;padding:12px;border-radius:8px;font-weight:600;color:#065f46;">B</div></div>',
    propertyConfigs: [{ name: 'justify-content', initialValue: 'flex-start', targetValue: 'center' }], timeLimit: 60 },
];

// ─── LEVEL DASAR: SEDANG (16 levels, 90s, 2 properties) ────────────────────

const DASAR_SEDANG: Level[] = [
  // Visual
  { id: 'd-sv1', title: 'Warna Latar & Teks', difficulty: 'Sedang', levelType: 'dasar', category: 'Visual', concept: 'Background Color + Text Color',
    description: 'Kombinasikan warna latar dan warna teks yang kontras.',
    htmlStructure: htmlWrap('<h2 style="font-size:22px;font-weight:700;margin:0 0 8px;">Kartu Kontras</h2><p style="font-size:14px;margin:0;">Padukan warna yang tepat</p>'),
    propertyConfigs: [{ name: 'background-color', initialValue: '#6b7280', targetValue: '#111827' }, { name: 'color', initialValue: '#ffffff', targetValue: '#ffffff' }], timeLimit: 90 },
  { id: 'd-sv2', title: 'Latar & Sudut', difficulty: 'Sedang', levelType: 'dasar', category: 'Visual', concept: 'Background Color + Border Radius',
    description: 'Atur warna latar dan sudut kartu secara bersamaan.',
    htmlStructure: htmlWrap('<h2 style="font-size:20px;font-weight:700;margin:0 0 6px;color:#ffffff;">Kartu Warna</h2><p style="font-size:14px;color:#d1d5db;margin:0;">Dua properti visual</p>'),
    propertyConfigs: [{ name: 'background-color', initialValue: '#6b7280', targetValue: '#9333ea' }, { name: 'border-radius', initialValue: '0px', targetValue: '20px' }], timeLimit: 90 },
  { id: 'd-sv3', title: 'Sudut & Transparansi', difficulty: 'Sedang', levelType: 'dasar', category: 'Visual', concept: 'Border Radius + Opacity',
    description: 'Gabungkan sudut membulat dengan efek transparansi.',
    htmlStructure: htmlWrap('<h2 style="font-size:20px;font-weight:700;margin:0 0 6px;color:#ffffff;">Efek Kaca</h2><p style="font-size:14px;color:#d1d5db;margin:0;">Dua properti visual</p>'),
    propertyConfigs: [{ name: 'border-radius', initialValue: '0px', targetValue: '16px' }, { name: 'opacity', initialValue: '1', targetValue: '0.75' }], timeLimit: 90 },
  { id: 'd-sv4', title: 'Warna Teks & Transparansi', difficulty: 'Sedang', levelType: 'dasar', category: 'Visual', concept: 'Text Color + Opacity',
    description: 'Ubah warna teks dan atur transparansi elemen.',
    htmlStructure: htmlWrap('<h2 style="font-size:22px;font-weight:700;margin:0 0 8px;">Teks Transparan</h2><p style="font-size:14px;margin:0;">Dua properti visual</p>'),
    propertyConfigs: [{ name: 'color', initialValue: '#ffffff', targetValue: '#dc2626' }, { name: 'opacity', initialValue: '1', targetValue: '0.9' }], timeLimit: 90 },
  // Typography
  { id: 'd-st1', title: 'Ukuran & Ketebalan', difficulty: 'Sedang', levelType: 'dasar', category: 'Typography', concept: 'Font Size + Font Weight',
    description: 'Buat judul besar dan tebal.',
    htmlStructure: htmlWrap('<h2 style="margin:0 0 8px;color:#ffffff;">Judul Penting</h2><p style="font-size:14px;color:#d1d5db;margin:0;">Subteks</p>'),
    propertyConfigs: [{ name: 'font-size', initialValue: '20px', targetValue: '40px' }, { name: 'font-weight', initialValue: '400', targetValue: '800' }], timeLimit: 90 },
  { id: 'd-st2', title: 'Ukuran & Rata Teks', difficulty: 'Sedang', levelType: 'dasar', category: 'Typography', concept: 'Font Size + Text Align',
    description: 'Besarkan teks dan tengahkan.',
    htmlStructure: htmlWrap('<h2 style="font-weight:700;margin:0 0 8px;color:#ffffff;">Headline</h2><p style="font-size:14px;color:#d1d5db;margin:0;">Tengahkan semua</p>'),
    propertyConfigs: [{ name: 'font-size', initialValue: '20px', targetValue: '32px' }, { name: 'text-align', initialValue: 'left', targetValue: 'center' }], timeLimit: 90 },
  { id: 'd-st3', title: 'Ketebalan & Jarak Huruf', difficulty: 'Sedang', levelType: 'dasar', category: 'Typography', concept: 'Font Weight + Letter Spacing',
    description: 'Tebalkan dan beri jarak antar huruf.',
    htmlStructure: htmlWrap('<h2 style="font-size:24px;margin:0 0 8px;color:#ffffff;">BRAND NAME</h2><p style="font-size:14px;color:#d1d5db;margin:0;">Tagline</p>'),
    propertyConfigs: [{ name: 'font-weight', initialValue: '400', targetValue: '700' }, { name: 'letter-spacing', initialValue: '0px', targetValue: '2px' }], timeLimit: 90 },
  { id: 'd-st4', title: 'Rata Teks & Jarak Huruf', difficulty: 'Sedang', levelType: 'dasar', category: 'Typography', concept: 'Text Align + Letter Spacing',
    description: 'Tengahkan teks dan atur jarak huruf.',
    htmlStructure: htmlWrap('<h2 style="font-size:22px;font-weight:700;margin:0 0 8px;color:#ffffff;">TIPOGRAFI</h2><p style="font-size:14px;color:#d1d5db;margin:0;">Dua properti tipografi</p>'),
    propertyConfigs: [{ name: 'text-align', initialValue: 'left', targetValue: 'center' }, { name: 'letter-spacing', initialValue: '0px', targetValue: '3px' }], timeLimit: 90 },
  // Spacing
  { id: 'd-ss1', title: 'Padding & Margin', difficulty: 'Sedang', levelType: 'dasar', category: 'Spacing', concept: 'Padding + Margin',
    description: 'Atur jarak dalam dan luar elemen.',
    htmlStructure: htmlWrap('<h2 style="font-size:20px;font-weight:700;margin:0 0 6px;color:#ffffff;">Kartu Spasi</h2><p style="font-size:14px;color:#d1d5db;margin:0;">Dua properti spacing</p>'),
    propertyConfigs: [{ name: 'padding', initialValue: '8px', targetValue: '24px' }, { name: 'margin', initialValue: '0px', targetValue: '16px' }], timeLimit: 90 },
  { id: 'd-ss2', title: 'Padding & Gap', difficulty: 'Sedang', levelType: 'dasar', category: 'Spacing', concept: 'Padding + Gap',
    description: 'Atur padding container dan jarak antar item.',
    htmlStructure: '<div id="target" style="background-color:#6b7280;border-radius:12px;display:flex;flex-direction:column;"><div style="background:#dbeafe;padding:12px;border-radius:8px;font-weight:600;color:#1e40af;">Item 1</div><div style="background:#d1fae5;padding:12px;border-radius:8px;font-weight:600;color:#065f46;">Item 2</div></div>',
    propertyConfigs: [{ name: 'padding', initialValue: '8px', targetValue: '24px' }, { name: 'gap', initialValue: '4px', targetValue: '16px' }], timeLimit: 90 },
  { id: 'd-ss3', title: 'Margin & Gap', difficulty: 'Sedang', levelType: 'dasar', category: 'Spacing', concept: 'Margin + Gap',
    description: 'Atur margin luar dan gap antar item.',
    htmlStructure: '<div id="target" style="padding:24px;background-color:#6b7280;border-radius:12px;display:flex;flex-direction:column;"><div style="background:#dbeafe;padding:12px;border-radius:8px;font-weight:600;color:#1e40af;">A</div><div style="background:#d1fae5;padding:12px;border-radius:8px;font-weight:600;color:#065f46;">B</div></div>',
    propertyConfigs: [{ name: 'margin', initialValue: '0px', targetValue: '16px' }, { name: 'gap', initialValue: '4px', targetValue: '12px' }], timeLimit: 90 },
  // Layout
  { id: 'd-sl1', title: 'Display & Lebar', difficulty: 'Sedang', levelType: 'dasar', category: 'Layout', concept: 'Display + Width',
    description: 'Ubah display dan atur lebar.',
    htmlStructure: '<div id="target" style="padding:24px;background-color:#6b7280;border-radius:12px;"><div style="background:#dbeafe;padding:12px;border-radius:8px;font-weight:600;color:#1e40af;">A</div><div style="background:#d1fae5;padding:12px;border-radius:8px;font-weight:600;color:#065f46;">B</div></div>',
    propertyConfigs: [{ name: 'display', initialValue: 'block', targetValue: 'flex' }, { name: 'width', initialValue: '200px', targetValue: '350px' }], timeLimit: 90 },
  { id: 'd-sl2', title: 'Lebar & Tinggi', difficulty: 'Sedang', levelType: 'dasar', category: 'Layout', concept: 'Width + Height',
    description: 'Atur lebar dan tinggi kartu.',
    htmlStructure: htmlWrap('<h2 style="font-size:20px;font-weight:700;margin:0 0 6px;color:#ffffff;">Kartu Dimensi</h2><p style="font-size:14px;color:#d1d5db;margin:0;">Dua properti layout</p>'),
    propertyConfigs: [{ name: 'width', initialValue: '200px', targetValue: '350px' }, { name: 'height', initialValue: '120px', targetValue: '200px' }], timeLimit: 90 },
  { id: 'd-sl3', title: 'Display & Rata Vertikal', difficulty: 'Sedang', levelType: 'dasar', category: 'Layout', concept: 'Display + Align Items',
    description: 'Ubah display flex dan tengahkan child vertikal.',
    htmlStructure: '<div id="target" style="padding:24px;background-color:#6b7280;border-radius:12px;height:150px;"><div style="background:#dbeafe;padding:12px;border-radius:8px;font-weight:600;color:#1e40af;">X</div><div style="background:#d1fae5;padding:12px;border-radius:8px;font-weight:600;color:#065f46;">Y</div></div>',
    propertyConfigs: [{ name: 'display', initialValue: 'block', targetValue: 'flex' }, { name: 'align-items', initialValue: 'flex-start', targetValue: 'center' }], timeLimit: 90 },
  { id: 'd-sl4', title: 'Display & Rata Horizontal', difficulty: 'Sedang', levelType: 'dasar', category: 'Layout', concept: 'Display + Justify Content',
    description: 'Ubah display flex dan tengahkan child horizontal.',
    htmlStructure: '<div id="target" style="padding:24px;background-color:#6b7280;border-radius:12px;"><div style="background:#dbeafe;padding:12px;border-radius:8px;font-weight:600;color:#1e40af;">X</div><div style="background:#d1fae5;padding:12px;border-radius:8px;font-weight:600;color:#065f46;">Y</div></div>',
    propertyConfigs: [{ name: 'display', initialValue: 'block', targetValue: 'flex' }, { name: 'justify-content', initialValue: 'flex-start', targetValue: 'center' }], timeLimit: 90 },
  { id: 'd-sl5', title: 'Rata Vertikal & Horizontal', difficulty: 'Sedang', levelType: 'dasar', category: 'Layout', concept: 'Align Items + Justify Content',
    description: 'Tengahkan child secara vertikal dan horizontal.',
    htmlStructure: '<div id="target" style="padding:24px;background-color:#6b7280;border-radius:12px;display:flex;height:150px;"><div style="background:#dbeafe;padding:12px;border-radius:8px;font-weight:600;color:#1e40af;">A</div><div style="background:#d1fae5;padding:12px;border-radius:8px;font-weight:600;color:#065f46;">B</div></div>',
    propertyConfigs: [{ name: 'align-items', initialValue: 'flex-start', targetValue: 'center' }, { name: 'justify-content', initialValue: 'flex-start', targetValue: 'center' }], timeLimit: 90 },
];

// ─── LEVEL DASAR: SULIT (16 levels, 120s, 3 properties) ────────────────────

const DASAR_SULIT: Level[] = [
  // Visual
  { id: 'd-dv1', title: 'Latar, Teks, Sudut', difficulty: 'Sulit', levelType: 'dasar', category: 'Visual', concept: 'Background + Text Color + Border Radius',
    description: 'Kombinasikan 3 properti visual untuk membuat kartu menarik.',
    htmlStructure: htmlWrap('<h2 style="font-size:22px;font-weight:700;margin:0 0 8px;">Kartu Elegan</h2><p style="font-size:14px;margin:0;">Tiga properti visual</p>'),
    propertyConfigs: [{ name: 'background-color', initialValue: '#6b7280', targetValue: '#111827' }, { name: 'color', initialValue: '#ffffff', targetValue: '#ffffff' }, { name: 'border-radius', initialValue: '0px', targetValue: '20px' }], timeLimit: 120 },
  { id: 'd-dv2', title: 'Latar, Sudut, Opacity', difficulty: 'Sulit', levelType: 'dasar', category: 'Visual', concept: 'Background + Border Radius + Opacity',
    description: 'Tiga properti visual: warna, sudut, dan transparansi.',
    htmlStructure: htmlWrap('<h2 style="font-size:20px;font-weight:700;margin:0 0 6px;color:#ffffff;">Kartu Glass</h2><p style="font-size:14px;color:#d1d5db;margin:0;">Tiga properti visual</p>'),
    propertyConfigs: [{ name: 'background-color', initialValue: '#6b7280', targetValue: '#1d4ed8' }, { name: 'border-radius', initialValue: '0px', targetValue: '16px' }, { name: 'opacity', initialValue: '1', targetValue: '0.75' }], timeLimit: 120 },
  { id: 'd-dv3', title: 'Teks, Sudut, Opacity', difficulty: 'Sulit', levelType: 'dasar', category: 'Visual', concept: 'Text Color + Border Radius + Opacity',
    description: 'Gabungkan warna teks, sudut, dan transparansi.',
    htmlStructure: htmlWrap('<h2 style="font-size:22px;font-weight:700;margin:0 0 8px;">Kartu Transparan</h2><p style="font-size:14px;margin:0;">Tiga properti visual</p>'),
    propertyConfigs: [{ name: 'color', initialValue: '#111827', targetValue: '#9333ea' }, { name: 'border-radius', initialValue: '0px', targetValue: '24px' }, { name: 'opacity', initialValue: '1', targetValue: '0.9' }], timeLimit: 120 },
  { id: 'd-dv4', title: 'Latar, Teks, Opacity', difficulty: 'Sulit', levelType: 'dasar', category: 'Visual', concept: 'Background + Text Color + Opacity',
    description: 'Tiga properti visual sekaligus.',
    htmlStructure: htmlWrap('<h2 style="font-size:22px;font-weight:700;margin:0 0 8px;">Kartu Warna</h2><p style="font-size:14px;margin:0;">Tiga properti visual</p>'),
    propertyConfigs: [{ name: 'background-color', initialValue: '#6b7280', targetValue: '#dc2626' }, { name: 'color', initialValue: '#ffffff', targetValue: '#ffffff' }, { name: 'opacity', initialValue: '1', targetValue: '0.9' }], timeLimit: 120 },
  // Typography
  { id: 'd-dt1', title: 'Ukuran, Ketebalan, Rata', difficulty: 'Sulit', levelType: 'dasar', category: 'Typography', concept: 'Font Size + Weight + Align',
    description: 'Tiga properti tipografi untuk headline sempurna.',
    htmlStructure: htmlWrap('<h2 style="margin:0 0 8px;color:#ffffff;">HEADLINE BESAR</h2><p style="font-size:14px;color:#d1d5db;margin:0;">Tiga properti tipografi</p>'),
    propertyConfigs: [{ name: 'font-size', initialValue: '20px', targetValue: '40px' }, { name: 'font-weight', initialValue: '400', targetValue: '800' }, { name: 'text-align', initialValue: 'left', targetValue: 'center' }], timeLimit: 120 },
  { id: 'd-dt2', title: 'Ukuran, Ketebalan, Spasi', difficulty: 'Sulit', levelType: 'dasar', category: 'Typography', concept: 'Font Size + Weight + Letter Spacing',
    description: 'Tiga properti tipografi untuk branding.',
    htmlStructure: htmlWrap('<h2 style="margin:0 0 8px;color:#ffffff;">BRAND</h2><p style="font-size:14px;color:#d1d5db;margin:0;">Tiga properti tipografi</p>'),
    propertyConfigs: [{ name: 'font-size', initialValue: '20px', targetValue: '32px' }, { name: 'font-weight', initialValue: '400', targetValue: '700' }, { name: 'letter-spacing', initialValue: '0px', targetValue: '2px' }], timeLimit: 120 },
  { id: 'd-dt3', title: 'Ukuran, Rata, Spasi', difficulty: 'Sulit', levelType: 'dasar', category: 'Typography', concept: 'Font Size + Align + Letter Spacing',
    description: 'Tiga properti tipografi sekaligus.',
    htmlStructure: htmlWrap('<h2 style="font-weight:700;margin:0 0 8px;color:#ffffff;">TYPOGRAPHY</h2><p style="font-size:14px;color:#d1d5db;margin:0;">Tiga properti</p>'),
    propertyConfigs: [{ name: 'font-size', initialValue: '20px', targetValue: '28px' }, { name: 'text-align', initialValue: 'left', targetValue: 'center' }, { name: 'letter-spacing', initialValue: '0px', targetValue: '3px' }], timeLimit: 120 },
  { id: 'd-dt4', title: 'Ketebalan, Rata, Spasi', difficulty: 'Sulit', levelType: 'dasar', category: 'Typography', concept: 'Font Weight + Align + Letter Spacing',
    description: 'Tiga properti tipografi sekaligus.',
    htmlStructure: htmlWrap('<h2 style="font-size:24px;margin:0 0 8px;color:#ffffff;">SLOGAN</h2><p style="font-size:14px;color:#d1d5db;margin:0;">Tiga properti</p>'),
    propertyConfigs: [{ name: 'font-weight', initialValue: '400', targetValue: '700' }, { name: 'text-align', initialValue: 'left', targetValue: 'center' }, { name: 'letter-spacing', initialValue: '0px', targetValue: '2px' }], timeLimit: 120 },
  // Spacing
  { id: 'd-ds1', title: 'Padding, Margin, Gap', difficulty: 'Sulit', levelType: 'dasar', category: 'Spacing', concept: 'Padding + Margin + Gap',
    description: 'Tiga properti spacing untuk layout yang rapi.',
    htmlStructure: '<div id="target" style="background-color:#6b7280;border-radius:12px;display:flex;flex-direction:column;"><div style="background:#dbeafe;padding:12px;border-radius:8px;font-weight:600;color:#1e40af;">Item 1</div><div style="background:#d1fae5;padding:12px;border-radius:8px;font-weight:600;color:#065f46;">Item 2</div><div style="background:#fef3c7;padding:12px;border-radius:8px;font-weight:600;color:#92400e;">Item 3</div></div>',
    propertyConfigs: [{ name: 'padding', initialValue: '8px', targetValue: '24px' }, { name: 'margin', initialValue: '0px', targetValue: '16px' }, { name: 'gap', initialValue: '4px', targetValue: '16px' }], timeLimit: 120 },
  { id: 'd-ds2', title: 'Gap, Padding, Margin', difficulty: 'Sulit', levelType: 'dasar', category: 'Spacing', concept: 'Gap + Padding + Margin',
    description: 'Tiga properti spacing dengan urutan berbeda.',
    htmlStructure: '<div id="target" style="background-color:#6b7280;border-radius:12px;display:flex;flex-direction:column;"><div style="background:#dbeafe;padding:12px;border-radius:8px;font-weight:600;color:#1e40af;">A</div><div style="background:#d1fae5;padding:12px;border-radius:8px;font-weight:600;color:#065f46;">B</div></div>',
    propertyConfigs: [{ name: 'gap', initialValue: '4px', targetValue: '12px' }, { name: 'padding', initialValue: '8px', targetValue: '20px' }, { name: 'margin', initialValue: '0px', targetValue: '24px' }], timeLimit: 120 },
  { id: 'd-ds3', title: 'Margin, Gap, Padding', difficulty: 'Sulit', levelType: 'dasar', category: 'Spacing', concept: 'Margin + Gap + Padding',
    description: 'Tiga properti spacing kombinasi lain.',
    htmlStructure: '<div id="target" style="background-color:#6b7280;border-radius:12px;display:flex;flex-direction:column;"><div style="background:#fee2e2;padding:12px;border-radius:8px;font-weight:600;color:#991b1b;">X</div><div style="background:#ede9fe;padding:12px;border-radius:8px;font-weight:600;color:#5b21b6;">Y</div><div style="background:#d1fae5;padding:12px;border-radius:8px;font-weight:600;color:#065f46;">Z</div></div>',
    propertyConfigs: [{ name: 'margin', initialValue: '0px', targetValue: '16px' }, { name: 'gap', initialValue: '4px', targetValue: '16px' }, { name: 'padding', initialValue: '8px', targetValue: '24px' }], timeLimit: 120 },
  // Layout
  { id: 'd-dl1', title: 'Display, Lebar, Tinggi', difficulty: 'Sulit', levelType: 'dasar', category: 'Layout', concept: 'Display + Width + Height',
    description: 'Tiga properti layout untuk kontrol dimensi penuh.',
    htmlStructure: '<div id="target" style="padding:24px;background-color:#6b7280;border-radius:12px;"><div style="background:#dbeafe;padding:12px;border-radius:8px;font-weight:600;color:#1e40af;">A</div><div style="background:#d1fae5;padding:12px;border-radius:8px;font-weight:600;color:#065f46;">B</div></div>',
    propertyConfigs: [{ name: 'display', initialValue: 'block', targetValue: 'flex' }, { name: 'width', initialValue: '200px', targetValue: '350px' }, { name: 'height', initialValue: '120px', targetValue: '200px' }], timeLimit: 120 },
  { id: 'd-dl2', title: 'Display, Rata V & H', difficulty: 'Sulit', levelType: 'dasar', category: 'Layout', concept: 'Display + Align Items + Justify Content',
    description: 'Tiga properti layout untuk centering sempurna.',
    htmlStructure: '<div id="target" style="padding:24px;background-color:#6b7280;border-radius:12px;height:200px;"><div style="background:#dbeafe;padding:12px;border-radius:8px;font-weight:600;color:#1e40af;">Center</div></div>',
    propertyConfigs: [{ name: 'display', initialValue: 'block', targetValue: 'flex' }, { name: 'align-items', initialValue: 'flex-start', targetValue: 'center' }, { name: 'justify-content', initialValue: 'flex-start', targetValue: 'center' }], timeLimit: 120 },
  { id: 'd-dl3', title: 'Lebar, Tinggi, Rata V', difficulty: 'Sulit', levelType: 'dasar', category: 'Layout', concept: 'Width + Height + Align Items',
    description: 'Tiga properti layout.',
    htmlStructure: '<div id="target" style="padding:24px;background-color:#6b7280;border-radius:12px;display:flex;"><div style="background:#dbeafe;padding:12px;border-radius:8px;font-weight:600;color:#1e40af;">A</div></div>',
    propertyConfigs: [{ name: 'width', initialValue: '200px', targetValue: '300px' }, { name: 'height', initialValue: '120px', targetValue: '200px' }, { name: 'align-items', initialValue: 'flex-start', targetValue: 'center' }], timeLimit: 120 },
  { id: 'd-dl4', title: 'Lebar, Tinggi, Rata H', difficulty: 'Sulit', levelType: 'dasar', category: 'Layout', concept: 'Width + Height + Justify Content',
    description: 'Tiga properti layout.',
    htmlStructure: '<div id="target" style="padding:24px;background-color:#6b7280;border-radius:12px;display:flex;"><div style="background:#d1fae5;padding:12px;border-radius:8px;font-weight:600;color:#065f46;">B</div></div>',
    propertyConfigs: [{ name: 'width', initialValue: '200px', targetValue: '350px' }, { name: 'height', initialValue: '120px', targetValue: '200px' }, { name: 'justify-content', initialValue: 'flex-start', targetValue: 'center' }], timeLimit: 120 },
  { id: 'd-dl5', title: 'Display, Lebar, Rata H', difficulty: 'Sulit', levelType: 'dasar', category: 'Layout', concept: 'Display + Width + Justify Content',
    description: 'Tiga properti layout.',
    htmlStructure: '<div id="target" style="padding:24px;background-color:#6b7280;border-radius:12px;"><div style="background:#dbeafe;padding:12px;border-radius:8px;font-weight:600;color:#1e40af;">A</div><div style="background:#fef3c7;padding:12px;border-radius:8px;font-weight:600;color:#92400e;">B</div></div>',
    propertyConfigs: [{ name: 'display', initialValue: 'block', targetValue: 'flex' }, { name: 'width', initialValue: '200px', targetValue: '400px' }, { name: 'justify-content', initialValue: 'flex-start', targetValue: 'space-between' }], timeLimit: 120 },
];

// ─── LEVEL TANTANGAN (5 levels) ─────────────────────────────────────────────

const TANTANGAN_LEVELS: Level[] = [
  { id: 't-1', title: 'Kartu Profil Lengkap', difficulty: 'Sedang', levelType: 'tantangan',
    description: 'Gabungkan 4 properti untuk membuat kartu profil yang sempurna.',
    htmlStructure: '<div id="target" style="padding:24px;background-color:#d1d5db;border-radius:16px;"><div style="font-size:48px;margin-bottom:12px;">👤</div><h2 style="font-size:22px;font-weight:700;margin:8px 0;color:#ffffff;">John Doe</h2><p style="color:#d1d5db;font-size:15px;margin:0;">UI/UX Designer</p></div>',
    propertyConfigs: [{ name: 'background-color', initialValue: '#6b7280', targetValue: '#1d4ed8' }, { name: 'font-size', initialValue: '20px', targetValue: '28px' }, { name: 'padding', initialValue: '12px', targetValue: '32px' }, { name: 'width', initialValue: '200px', targetValue: '350px' }], timeLimit: 120 },
  { id: 't-2', title: 'Hero Section', difficulty: 'Sedang', levelType: 'tantangan',
    description: 'Buat hero section yang menarik dengan 6 properti.',
    htmlStructure: '<div id="target" style="padding:32px;background-color:#d1d5db;border-radius:16px;text-align:center;"><h1 style="color:#ffffff;margin:0 0 12px;line-height:1.2;">Welcome</h1><p style="color:#d1d5db;font-size:16px;margin:0;">Build amazing things</p></div>',
    propertyConfigs: [{ name: 'background-color', initialValue: '#6b7280', targetValue: '#111827' }, { name: 'color', initialValue: '#ffffff', targetValue: '#ffffff' }, { name: 'font-weight', initialValue: '400', targetValue: '800' }, { name: 'margin', initialValue: '0px', targetValue: '16px' }, { name: 'height', initialValue: '120px', targetValue: '250px' }, { name: 'display', initialValue: 'block', targetValue: 'flex' }], timeLimit: 150 },
  { id: 't-3', title: 'Product Gallery', difficulty: 'Sulit', levelType: 'tantangan',
    description: 'Buat galeri produk dengan layout flex dan 6 properti.',
    htmlStructure: '<div id="target" style="padding:24px;background-color:#d1d5db;border-radius:12px;"><div style="background:white;padding:16px;border:1px solid #e5e7eb;"><h3 style="font-size:18px;font-weight:700;margin:0 0 6px;color:#111827;">Product A</h3><p style="color:#10b981;font-size:20px;font-weight:700;margin:0;">$99</p></div><div style="background:white;padding:16px;border:1px solid #e5e7eb;"><h3 style="font-size:18px;font-weight:700;margin:0 0 6px;color:#111827;">Product B</h3><p style="color:#10b981;font-size:20px;font-weight:700;margin:0;">$149</p></div></div>',
    propertyConfigs: [{ name: 'border-radius', initialValue: '0px', targetValue: '16px' }, { name: 'font-size', initialValue: '16px', targetValue: '24px' }, { name: 'text-align', initialValue: 'left', targetValue: 'center' }, { name: 'gap', initialValue: '4px', targetValue: '16px' }, { name: 'align-items', initialValue: 'flex-start', targetValue: 'center' }, { name: 'width', initialValue: '200px', targetValue: '400px' }], timeLimit: 180 },
  { id: 't-4', title: 'Dashboard Card', difficulty: 'Sulit', levelType: 'tantangan',
    description: 'Buat kartu dashboard kompleks dengan 7 properti.',
    htmlStructure: '<div id="target" style="padding:24px;background-color:#d1d5db;border-radius:16px;"><div style="font-size:32px;margin-bottom:8px;">📊</div><h2 style="font-weight:700;margin:0 0 4px;color:#ffffff;">Analytics</h2><p style="color:#d1d5db;font-size:14px;margin:0;">1,234 visitors</p><div style="display:flex;gap:8px;margin-top:12px;"><span style="background:#d1fae5;padding:4px 12px;border-radius:12px;font-size:12px;font-weight:600;color:#065f46;">Live</span></div></div>',
    propertyConfigs: [{ name: 'background-color', initialValue: '#6b7280', targetValue: '#9333ea' }, { name: 'color', initialValue: '#ffffff', targetValue: '#5b21b6' }, { name: 'border-radius', initialValue: '8px', targetValue: '24px' }, { name: 'letter-spacing', initialValue: '0px', targetValue: '1px' }, { name: 'padding', initialValue: '12px', targetValue: '32px' }, { name: 'display', initialValue: 'block', targetValue: 'flex' }, { name: 'justify-content', initialValue: 'flex-start', targetValue: 'space-between' }], timeLimit: 210 },
  { id: 't-5', title: 'Final Challenge', difficulty: 'Sulit', levelType: 'tantangan',
    description: 'Tantangan terakhir! Gunakan seluruh 16 properti CSS yang telah dipelajari.',
    htmlStructure: '<div id="target" style="padding:24px;background-color:#d1d5db;border-radius:16px;"><div style="font-size:48px;margin-bottom:12px;">🏆</div><h1 style="font-weight:800;margin:0 0 8px;color:#ffffff;">Master CSS</h1><p style="color:#d1d5db;font-size:16px;margin:0 0 16px;">Selamat! Kamu telah menguasai dasar-dasar CSS.</p><div style="background:#d1fae5;padding:12px;border-radius:8px;font-weight:600;color:#065f46;text-align:center;">Level Selesai!</div></div>',
    propertyConfigs: [
      { name: 'background-color', initialValue: '#6b7280', targetValue: '#111827' },
      { name: 'color', initialValue: '#ffffff', targetValue: '#ffffff' },
      { name: 'border-radius', initialValue: '8px', targetValue: '24px' },
      { name: 'opacity', initialValue: '1', targetValue: '0.9' },
      { name: 'font-size', initialValue: '16px', targetValue: '32px' },
      { name: 'font-weight', initialValue: '400', targetValue: '700' },
      { name: 'text-align', initialValue: 'left', targetValue: 'center' },
      { name: 'letter-spacing', initialValue: '0px', targetValue: '2px' },
      { name: 'padding', initialValue: '12px', targetValue: '32px' },
      { name: 'margin', initialValue: '0px', targetValue: '16px' },
      { name: 'gap', initialValue: '4px', targetValue: '16px' },
      { name: 'display', initialValue: 'block', targetValue: 'flex' },
      { name: 'width', initialValue: '200px', targetValue: '400px' },
      { name: 'height', initialValue: '120px', targetValue: '300px' },
      { name: 'align-items', initialValue: 'flex-start', targetValue: 'center' },
      { name: 'justify-content', initialValue: 'flex-start', targetValue: 'center' },
    ], timeLimit: 300 },
];

// ─── EXPORTS ─────────────────────────────────────────────────────────────────

export const ALL_DASAR_LEVELS: Level[] = [...DASAR_MUDAH, ...DASAR_SEDANG, ...DASAR_SULIT];
export const ALL_TANTANGAN_LEVELS: Level[] = TANTANGAN_LEVELS;

// Set initial lock state
ALL_DASAR_LEVELS.forEach((l, i) => {
  l.isLocked = l.difficulty !== 'Mudah'; // Mudah unlocked, rest locked
});
ALL_TANTANGAN_LEVELS.forEach(l => { l.isLocked = true; });

export const getDisplayValue = (propName: string, cssValue: string): string => {
  const def = PREDEFINED_PROPERTIES[propName];
  if (!def?.displayValues) return cssValue;
  const idx = def.values.indexOf(cssValue);
  return idx >= 0 ? def.displayValues[idx] : cssValue;
};
