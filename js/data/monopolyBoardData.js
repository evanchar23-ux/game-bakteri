// js/data/monopolyBoardData.js
// 20 Petak Sirkuit Anatomi Tubuh untuk Bio-Monopoly

export const BOARD_TILES = [
  {
    index: 0,
    name: 'Sumsum Tulang',
    sub: 'START / Base Produksi Leukosit',
    type: 'start',
    icon: '🦴',
    color: '#00f2fe',
    desc: 'Tempat pembentukan sel darah. Melewati petak ini dapat +200 ATP.'
  },
  {
    index: 1,
    name: 'Epitel Kulit',
    sub: 'Epidermis Luar',
    type: 'property',
    group: 'skin',
    groupColor: '#ffaa00',
    icon: '🛡️',
    price: 100,
    rent: 20,
    owner: null,
    level: 0
  },
  {
    index: 2,
    name: 'Kuis Imunologi',
    sub: 'Kartu Tanya Jawab',
    type: 'quiz',
    icon: '❓',
    color: '#38ef7d',
    desc: 'Jawab pertanyaan seputar sains medis untuk dapat hadiah bonus ATP!'
  },
  {
    index: 3,
    name: 'Dermis & Kolagen',
    sub: 'Bantalan Kulit Dalam',
    type: 'property',
    group: 'skin',
    groupColor: '#ffaa00',
    icon: '🧬',
    price: 120,
    rent: 25,
    owner: null,
    level: 0
  },
  {
    index: 4,
    name: 'Bio-Hazard',
    sub: 'Event Medis Acak',
    type: 'event',
    icon: '⚡',
    color: '#ff3d78',
    desc: 'Ambil kartu kejutan medis (Suntikan booster, toksin kuman, badai sitokin, dll).'
  },
  {
    index: 5,
    name: 'Ruang Karantina',
    sub: 'Isolasi Medis / Singgah',
    type: 'jail',
    icon: '🏥',
    color: '#ffb300',
    desc: 'Pemain yang terinfeksi harus istirahat 1 putaran di sini.'
  },
  {
    index: 6,
    name: 'Mukosa Hidung',
    sub: 'Filter Udara Pertama',
    type: 'property',
    group: 'respiratory',
    groupColor: '#00f2fe',
    icon: '👃',
    price: 140,
    rent: 30,
    owner: null,
    level: 0
  },
  {
    index: 7,
    name: 'Kuis Imunologi',
    sub: 'Kartu Tanya Jawab',
    type: 'quiz',
    icon: '❓',
    color: '#38ef7d',
    desc: 'Uji pengetahuan biologi tubuh manusia berhadiah energi seluler ATP.'
  },
  {
    index: 8,
    name: 'Bronkus & Silia',
    sub: 'Mucociliary Escalator',
    type: 'property',
    group: 'respiratory',
    groupColor: '#00f2fe',
    icon: '🌬️',
    price: 160,
    rent: 35,
    owner: null,
    level: 0
  },
  {
    index: 9,
    name: 'Alveolus Paru',
    sub: 'Pertukaran Gas O2 & CO2',
    type: 'property',
    group: 'respiratory',
    groupColor: '#00f2fe',
    icon: '🫁',
    price: 200,
    rent: 50,
    owner: null,
    level: 0
  },
  {
    index: 10,
    name: 'Detoksifikasi Hati',
    sub: 'Hepar / Istirahat Aman',
    type: 'parking',
    icon: '🍃',
    color: '#00ffcc',
    desc: 'Zona relaksasi aman. Sel imun menetralisir metabolit & mendapat +50 ATP.'
  },
  {
    index: 11,
    name: 'Mukosa Lambung',
    sub: 'Barier Asam Klorida (HCl)',
    type: 'property',
    group: 'digestive',
    groupColor: '#9d4edd',
    icon: '🧪',
    price: 220,
    rent: 55,
    owner: null,
    level: 0
  },
  {
    index: 12,
    name: 'Bio-Hazard',
    sub: 'Event Medis Acak',
    type: 'event',
    icon: '⚡',
    color: '#ff3d78',
    desc: 'Ambil kartu kejutan medis tak terduga.'
  },
  {
    index: 13,
    name: 'Vili Usus Halus',
    sub: 'Peyer Patches & Absorpsi',
    type: 'property',
    group: 'digestive',
    groupColor: '#9d4edd',
    icon: '🦠',
    price: 240,
    rent: 60,
    owner: null,
    level: 0
  },
  {
    index: 14,
    name: 'Kolon & Mikrobiom',
    sub: 'Ekosistem Bakteri Baik',
    type: 'property',
    group: 'digestive',
    groupColor: '#9d4edd',
    icon: '🌿',
    price: 260,
    rent: 70,
    owner: null,
    level: 0
  },
  {
    index: 15,
    name: 'Masuk Karantina!',
    sub: 'Kena Paparan Patogen',
    type: 'go_to_jail',
    icon: '🚨',
    color: '#ff3d78',
    desc: 'Alarm bahaya! Langsung menuju ke Ruang Karantina Medis (Petak 5).'
  },
  {
    index: 16,
    name: 'Kelenjar Limfa',
    sub: 'Pos Nodus Limfa Servikal',
    type: 'property',
    group: 'lymphatic',
    groupColor: '#ff007f',
    icon: '🔘',
    price: 280,
    rent: 75,
    owner: null,
    level: 0
  },
  {
    index: 17,
    name: 'Kuis Imunologi',
    sub: 'Kartu Tanya Jawab',
    type: 'quiz',
    icon: '❓',
    color: '#38ef7d',
    desc: 'Tantangan cerdas cermat biologi dengan hadiah energi ATP tinggi.'
  },
  {
    index: 18,
    name: 'Limpa (Spleen)',
    sub: 'Filter & Gudang Limfosit',
    type: 'property',
    group: 'lymphatic',
    groupColor: '#ff007f',
    icon: '🩸',
    price: 300,
    rent: 85,
    owner: null,
    level: 0
  },
  {
    index: 19,
    name: 'Klinik Vaksinasi',
    sub: 'Pusat Imunisasi & Riset',
    type: 'booster',
    icon: '🔬',
    color: '#4cc9f0',
    desc: 'Laboratorium riset biomedis. Dapatkan subsidi antibodi +100 ATP.'
  }
];

export const PAWN_TYPES = [
  {
    id: 'macrophage',
    name: 'Makrofag',
    badge: 'FAGOSIT BESAR',
    icon: '🛡️',
    color: '#00f2fe',
    avatarClass: 'pawn-macrophage'
  },
  {
    id: 'tcell',
    name: 'Sel T Sitotoksik',
    badge: 'PENDEKAR APOPTOSIS',
    icon: '⚔️',
    color: '#ff3d78',
    avatarClass: 'pawn-tcell'
  },
  {
    id: 'bcell',
    name: 'Sel B Plasma',
    badge: 'PABRIK ANTIBODI',
    icon: '🎯',
    color: '#ffaa00',
    avatarClass: 'pawn-bcell'
  },
  {
    id: 'neutrophil',
    name: 'Neutrofil',
    badge: 'GARDA TERDEPAN',
    icon: '⚡',
    color: '#2fe7c8',
    avatarClass: 'pawn-neutrophil'
  }
];
