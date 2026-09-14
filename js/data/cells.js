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
    avatar: '🛡️',
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
      icon: '🧬',
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
    avatar: '⚡',
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
      icon: '🔫',
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
      icon: '🕸️',
      atpCost: 35,
      cooldown: 6.0,
      duration: 4.5,
      description: 'Melontarkan jaring kromatin beracun (NET) yang menjerat dan menghentikan pergerakan semua patogen di area dampak, memberikan continuous poison damage.'
    },
    ultimateSkill: {
      name: 'Respiratory Burst (ROS Bomb)',
      key: 'Q / E',
      icon: '☢️',
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
    avatar: '🏹',
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
      icon: '🧬',
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
      icon: '🎯',
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
    avatar: '⚔️',
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
      icon: '🗡️',
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
      icon: '⚡',
      atpCost: 25,
      cooldown: 4.0,
      duration: 1.5,
      description: 'Melakukan klonal ekspansi kilat (dash) yang meninggalkan bayangan sel T sitokin pemotong patogen di jalur lintasan.'
    },
    ultimateSkill: {
      name: 'Granzyme Apoptosis Protocol',
      key: 'Q / E',
      icon: '☠️',
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
