/**
 * cells.js
 * Definisi Karakter Sel Imun yang dapat dimainkan (Playable Cells)
 * Dilengkapi statistik biologis, senjata utama, skill aktif, dan lore ilmiah.
 */

export const IMMUNE_CELLS = {
  macrophage: {
    id: 'macrophage',
    name: 'Makrofag',
    badge: 'Innate Sentinel',
    avatar: '<svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    color: '#00e5ff',
    secondaryColor: '#0077b6',
    radius: 26,
    lore: 'Sel fagositik berukuran besar pembersih patogen dan puing seluler. Menggunakan pseudopodia untuk menelan patogen dan menyajikan fragmen antigen ke sel T melalui MHC-II.',
    baseStats: {
      maxHp: 800,
      hpRegen: 3, // per detik
      speed: 150,
      armor: 25, // % damage reduction
      atpMax: 100,
      atpRegen: 8,
      critChance: 0.10,
      critMult: 1.5
    },
    basicAttack: {
      name: 'Pseudopodia Strike & Phagocytosis',
      icon: '💥',
      type: 'melee_swallow',
      damage: 65,
      range: 85,
      cooldown: 0.45,
      description: 'Menjulurkan pseudopodia ke depan untuk menelan patogen dalam jarak dekat. Menyerap 5% Max HP jika membunuh musuh biasa.'
    },
    tacticalSkill: {
      name: 'Antigen Presentation (MHC-II)',
      key: 'SPACE',
      icon: '<svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M4 22c3.5-1.5 6.5-6.5 9-11 2.5-4.5 5.5-9 9-10.5"/><path d="M4 2c3.5 1.5 6.5 6.5 9 11 2.5 4.5 5.5 9 9 10.5"/><path d="M7.5 12.5l9-9"/><path d="M10.5 15.5l7-7"/><path d="M4.5 6.5l4-4"/><path d="M6 9.5l6-6"/><path d="M18 14.5l-6 6"/><path d="M15 17.5l-4 4"/><path d="M19.5 11.5l-9 9"/></svg>',
      atpCost: 30,
      cooldown: 5.0,
      duration: 3.0,
      description: 'Mempresentasikan antigen melalui gelombang sitokin IL-1/TNF-α, memperlambat semua patogen di sekitar sebesar 50% dan memberikan 2x damage kerentanan.'
    },
    ultimateSkill: {
      name: 'Nitric Oxide & Lysosomal Burst',
      key: 'Q / E',
      icon: '💥',
      atpCost: 65,
      cooldown: 12.0,
      description: 'Melepaskan semburan enzim lisosom dan Reactive Nitrogen Species (RNS) dalam radius luas di sekitar Makrofag, menghancurkan biofilm dan dinding bakteri.'
    },
    passive: {
      name: 'Fagositosis Regeneratif',
      description: 'Setiap patogen yang ditelan memulihkan sedikit HP dan memicu pembentukan molekul komplemen.'
    }
  },

  neutrophil: {
    id: 'neutrophil',
    name: 'Neutrofil',
    badge: 'First Responder',
    avatar: '<svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    color: '#00ff88',
    secondaryColor: '#00b04f',
    radius: 20,
    lore: 'Sel darah putih paling melimpah dan garis depan pertama infeksi akut. Bergerak sangat cepat dengan meluncurkan granula toksik dan perangkap jaring ekstraseluler (NETs).',
    baseStats: {
      maxHp: 480,
      hpRegen: 1.5,
      speed: 215,
      armor: 10,
      atpMax: 100,
      atpRegen: 12,
      critChance: 0.20,
      critMult: 1.8
    },
    basicAttack: {
      name: 'Granule Burst (Defensin & Lysozyme)',
      icon: '<svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"/><path d="M16 12l-4-4-4 4M12 8v8"/></svg>',
      type: 'rapid_projectile',
      damage: 28,
      bulletSpeed: 520,
      range: 420,
      cooldown: 0.18,
      spread: 0.08,
      description: 'Menembakkan proyektil granula antimikroba (defensin) beruntun dengan kecepatan tinggi.'
    },
    tacticalSkill: {
      name: 'NETosis (Extracellular Trap)',
      key: 'SPACE',
      icon: '<svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M4 4l16 16M4 20L20 4M12 2v20M2 12h20"/></svg>',
      atpCost: 35,
      cooldown: 6.0,
      duration: 4.5,
      description: 'Melontarkan jaring kromatin beracun (NET) yang menjerat dan menghentikan pergerakan semua patogen di area dampak, memberikan continuous poison damage.'
    },
    ultimateSkill: {
      name: 'Respiratory Burst (ROS Bomb)',
      key: 'Q / E',
      icon: '<svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="9" stroke-dasharray="4 4"/></svg>',
      atpCost: 70,
      cooldown: 14.0,
      description: 'Mengaktifkan enzim NADPH oksidase untuk meledakkan konsentrasi radikal bebas O2- dan H2O2, melenyapkan virus dan bakteri di koridor tembakan.'
    },
    passive: {
      name: 'Chemotaxis Sprint',
      description: 'Mendapatkan tambahan pergerakan +35% saat mendekati kumpulan patogen.'
    }
  },

  b_cell: {
    id: 'b_cell',
    name: 'Limfosit B',
    badge: 'Adaptive Marksman',
    avatar: '<svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2M9.5 6.5L21 18v3h-3L6.5 9.5M11 5l-6 6M8 8L4 4M5 3L3 5"/></svg>',
    color: '#ff007f',
    secondaryColor: '#9b00e8',
    radius: 22,
    lore: 'Prajurit sistem imun adaptif spesialis penghasil antibodi (Immunoglobulin). Menandai patogen dengan presisi tinggi dan memicu aglutinasi sebelum menghancurkannya.',
    baseStats: {
      maxHp: 420,
      hpRegen: 1.0,
      speed: 175,
      armor: 8,
      atpMax: 120,
      atpRegen: 10,
      critChance: 0.25,
      critMult: 2.2
    },
    basicAttack: {
      name: 'Antibody Barrage (IgG / IgM)',
      icon: '<svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M4 22c3.5-1.5 6.5-6.5 9-11 2.5-4.5 5.5-9 9-10.5"/><path d="M4 2c3.5 1.5 6.5 6.5 9 11 2.5 4.5 5.5 9 9 10.5"/><path d="M7.5 12.5l9-9"/><path d="M10.5 15.5l7-7"/><path d="M4.5 6.5l4-4"/><path d="M6 9.5l6-6"/><path d="M18 14.5l-6 6"/><path d="M15 17.5l-4 4"/><path d="M19.5 11.5l-9 9"/></svg>',
      type: 'homing_antibody',
      damage: 42,
      bulletSpeed: 460,
      range: 520,
      cooldown: 0.35,
      description: 'Menembakkan molekul antibodi bercabang Y yang sedikit melengkung mengejar antigen patogen terdekat.'
    },
    tacticalSkill: {
      name: 'Opsonization Wave',
      key: 'SPACE',
      icon: '<svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
      atpCost: 30,
      cooldown: 5.5,
      duration: 5.0,
      description: 'Menandai seluruh patogen di layar dengan antibodi IgG. Patogen ter-opsonisasi menerima 100% Critical Vulnerability dan bergerak 30% lebih lambat.'
    },
    ultimateSkill: {
      name: 'Agglutination Detonation',
      key: 'Q / E',
      icon: '💥',
      atpCost: 75,
      cooldown: 15.0,
      description: 'Memadatkan semua patogen yang terikat antibodi menjadi gumpalan (aglutinasi) kemudian meledakkannya melalui aktivasi Komplemen Klasik!'
    },
    passive: {
      name: 'Affinity Maturation',
      description: 'Setiap kali menembak spesies patogen yang sama berturut-turut, tingkat kerusakan dan critical rate meningkat permanen hingga +40%.'
    }
  },

  t_cell: {
    id: 't_cell',
    name: 'Limfosit T Sitotoksik (CD8+)',
    badge: 'Cellular Assassin',
    avatar: '<svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2M9.5 6.5L21 18v3h-3L6.5 9.5M11 5l-6 6M8 8L4 4M5 3L3 5"/></svg>',
    color: '#ffaa00',
    secondaryColor: '#e85d04',
    radius: 21,
    lore: 'Pembunuh presisi yang mengenali sel tubuh terinfeksi virus melalui MHC-I. Menginduksi apoptosis terprogram menggunakan perforin dan granzyme.',
    baseStats: {
      maxHp: 520,
      hpRegen: 2.0,
      speed: 190,
      armor: 15,
      atpMax: 100,
      atpRegen: 9,
      critChance: 0.30,
      critMult: 2.5
    },
    basicAttack: {
      name: 'Perforin Lance',
      icon: '<svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M2 22L22 2M16 4l4 4M11 9l4 4"/></svg>',
      type: 'pierce_beam',
      damage: 55,
      bulletSpeed: 600,
      range: 350,
      cooldown: 0.28,
      description: 'Tusukan energi perforin yang menembus hingga 3 patogen berurutan dan melubangi membran kapsid virus.'
    },
    tacticalSkill: {
      name: 'Clonal Expansion Dash',
      key: 'SPACE',
      icon: '<svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
      atpCost: 25,
      cooldown: 4.0,
      duration: 1.5,
      description: 'Melakukan klonal ekspansi kilat (dash) yang meninggalkan bayangan sel T sitokin pemotong patogen di jalur lintasan.'
    },
    ultimateSkill: {
      name: 'Granzyme Apoptosis Protocol',
      key: 'Q / E',
      icon: '<svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
      atpCost: 80,
      cooldown: 16.0,
      description: 'Menginjeksi enzim Granzyme B ke seluruh musuh kuat dan Boss di sekitar, memicu kaskade caspase yang melisiskan musuh dari dalam.'
    },
    passive: {
      name: 'Self/Non-Self Surveillance',
      description: 'Memberikan damage ganda terhadap target yang membajak sel inang atau bereplikasi cepat.'
    }
  }
};

