// js/data/monopolyBoardData.js
// 20 Petak Sirkuit Anatomi Tubuh untuk Bio-Monopoly (Tanpa Emoji - 100% Vektor SVG)

export const SVG_ICONS = {
  marrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 3a3 3 0 0 1 3 3c0 .8-.3 1.5-.8 2l-1.4 1.4c-.4.4-.6 1-.6 1.6v2c0 .6.2 1.2.6 1.6l1.4 1.4c.5.5.8 1.2.8 2a3 3 0 0 1-5.1 2.1l-1.4-1.4c-.4-.4-1-.6-1.6-.6h-2c-.6 0-1.2.2-1.6.6l-1.4 1.4A3 3 0 0 1 2 17c0-.8.3-1.5.8-2l1.4-1.4c.4-.4.6-1 .6-1.6v-2c0-.6-.2-1.2-.6-1.6L3.4 7A3 3 0 0 1 7 2c.8 0 1.5.3 2 .8l1.4 1.4c.4.4 1 .6 1.6.6h2c.6 0 1.2-.2 1.6-.6l1.4-1.4c.5-.5 1.2-.8 2-.8z"/><circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.35"/></svg>`,
  shieldSkin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2L4 6v6c0 5.5 3.5 10 8 11 4.5-1 8-5.5 8-11V6l-8-4z"/><path d="M12 7v10M8 11h8" stroke-width="1.4"/></svg>`,
  quiz: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9.5"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17" stroke-width="2.5"/></svg>`,
  collagen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6c4 0 4 6 8 6s4-6 8-6M4 12c4 0 4 6 8 6s4-6 8-6M4 18c4 0 4 4 8 4s4-4 8-4"/></svg>`,
  biohazard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="2.5"/><path d="M12 9.5a4 4 0 1 0-3.5 5.5M12 9.5a4 4 0 1 1 3.5 5.5M8.5 15a4 4 0 1 0 7 0M12 2v3M5.5 19.5l2.6-1.5M18.5 19.5l-2.6-1.5"/></svg>`,
  quarantine: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="10" width="16" height="12" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4M12 14v4M9 16h6"/></svg>`,
  nasal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 4c0 4-2 7-2 11a4 4 0 0 0 8 0c0-1.5-.5-3-1-4M15 4c0 4 2 7 2 11a4 4 0 0 1-8 0"/><circle cx="9.5" cy="16" r="1.2" fill="currentColor"/><circle cx="14.5" cy="16" r="1.2" fill="currentColor"/></svg>`,
  bronchus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2v7M12 9l-4 5M12 9l4 5M8 14l-3 4M8 14l2 4M16 14l-2 4M16 14l3 4"/></svg>`,
  alveolus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="7.5" cy="9" r="3.5"/><circle cx="16.5" cy="9" r="3.5"/><circle cx="12" cy="16" r="4"/><path d="M12 2v8.5"/></svg>`,
  liver: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 14c0 5 4 8 8 8s8-3 8-8c0-6-8-12-8-12S4 8 4 14z"/><path d="M12 9v7M9 13l3 3 3-3"/></svg>`,
  stomach: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 4h10M10 4v4l-4 7c-1.5 2.5 0 6 3 6h6c3 0 4.5-3.5 3-6l-4-7V4"/><path d="M8 15h8"/></svg>`,
  villi: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 18c2 0 2-4 4-4s2 4 4 4 2-4 4-4 2 4 4 4M3 12c2 0 2-4 4-4s2 4 4 4 2-4 4-4 2 4 4 4M3 6c2 0 2-4 4-4s2 4 4 4 2-4 4-4 2 4 4 4"/></svg>`,
  microbiome: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="6" width="6" height="12" rx="3"/><rect x="14" y="8" width="6" height="10" rx="3"/><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="11" cy="19" r="1.5" fill="currentColor"/></svg>`,
  alarm: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 19h12a2 2 0 0 0 2-2v-5a8 8 0 1 0-16 0v5a2 2 0 0 0 2 2zM12 2v2M4.9 4.9l1.4 1.4M19.1 4.9l-1.4 1.4M12 22a3 3 0 0 0 3-3H9a3 3 0 0 0 3 3z"/></svg>`,
  lymph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="5"/><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="20" r="2.5"/><path d="M8 8l2.5 2.5M16 8l-2.5 2.5M12 17v-2"/></svg>`,
  spleen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21a9 9 0 0 0 9-9c0-4.5-4-8-9-9s-9 4-9 9 3 9 9 9z"/><path d="M8 12h8M12 8v8"/></svg>`,
  clinic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 2l4 4-2 2-4-4 2-2zM14 6l4 4M12 8l-7 7v3h3l7-7-3-3zM3 21l3-3"/></svg>`,
  dice: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5" fill="currentColor"/><circle cx="16" cy="8" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="8" cy="16" r="1.5" fill="currentColor"/><circle cx="16" cy="16" r="1.5" fill="currentColor"/></svg>`
};

export const BOARD_TILES = [
  {
    index: 0,
    name: 'Sumsum Tulang',
    sub: 'START / Base Produksi Leukosit',
    type: 'start',
    icon: SVG_ICONS.marrow,
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
    icon: SVG_ICONS.shieldSkin,
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
    icon: SVG_ICONS.quiz,
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
    icon: SVG_ICONS.collagen,
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
    icon: SVG_ICONS.biohazard,
    color: '#ff3d78',
    desc: 'Ambil kartu kejutan medis (Suntikan booster, toksin kuman, badai sitokin, dll).'
  },
  {
    index: 5,
    name: 'Ruang Karantina',
    sub: 'Isolasi Medis / Singgah',
    type: 'jail',
    icon: SVG_ICONS.quarantine,
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
    icon: SVG_ICONS.nasal,
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
    icon: SVG_ICONS.quiz,
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
    icon: SVG_ICONS.bronchus,
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
    icon: SVG_ICONS.alveolus,
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
    icon: SVG_ICONS.liver,
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
    icon: SVG_ICONS.stomach,
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
    icon: SVG_ICONS.biohazard,
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
    icon: SVG_ICONS.villi,
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
    icon: SVG_ICONS.microbiome,
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
    icon: SVG_ICONS.alarm,
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
    icon: SVG_ICONS.lymph,
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
    icon: SVG_ICONS.quiz,
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
    icon: SVG_ICONS.spleen,
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
    icon: SVG_ICONS.clinic,
    color: '#4cc9f0',
    desc: 'Laboratorium riset biomedis. Dapatkan subsidi antibodi +100 ATP.'
  }
];

export const PAWN_SVGS = {
  macrophage: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><path d="M12 7v10M7 12h10"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>`,
  tcell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15 8 22 9 17 14 18 21 12 17 6 21 7 14 2 9 9 8 12 2"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>`,
  bcell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="7"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><circle cx="12" cy="12" r="2.5" fill="currentColor"/></svg>`,
  neutrophil: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M4.9 19.1L19.1 4.9"/><circle cx="12" cy="12" r="3.5" fill="currentColor"/></svg>`
};

export const PAWN_TYPES = [
  {
    id: 'macrophage',
    name: 'Makrofag',
    badge: 'FAGOSIT BESAR',
    icon: PAWN_SVGS.macrophage,
    color: '#00f2fe',
    avatarClass: 'pawn-macrophage'
  },
  {
    id: 'tcell',
    name: 'Sel T Sitotoksik',
    badge: 'PENDEKAR APOPTOSIS',
    icon: PAWN_SVGS.tcell,
    color: '#ff3d78',
    avatarClass: 'pawn-tcell'
  },
  {
    id: 'bcell',
    name: 'Sel B Plasma',
    badge: 'PABRIK ANTIBODI',
    icon: PAWN_SVGS.bcell,
    color: '#ffaa00',
    avatarClass: 'pawn-bcell'
  },
  {
    id: 'neutrophil',
    name: 'Neutrofil',
    badge: 'GARDA TERDEPAN',
    icon: PAWN_SVGS.neutrophil,
    color: '#2fe7c8',
    avatarClass: 'pawn-neutrophil'
  }
];
