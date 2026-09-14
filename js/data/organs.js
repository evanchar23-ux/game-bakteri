/**
 * organs.js
 * Definisi Area Organ Tubuh sebagai Level Stage Game
 * Setiap organ memiliki identitas visual, struktur anatomis, hazard mikroskopik, gelombang patogen berimbang, dan boss yang unik.
 */

export const ORGAN_STAGES = {
  lungs: {
    id: 'lungs',
    name: 'Paru-paru (Pulmo)',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#00d2ff" stroke-width="2" stroke-linecap="round"><path d="M12 4v8M12 7c-2-2-5-1-6 2s0 7 2 9 4 1 4 1M12 7c2-2 5-1 6 2s0 7-2 9-4 1-4 1"/></svg>`,
    subtitle: 'Alveoli & Epitel Bersilia',
    colorTheme: '#00d2ff',
    bgColor: '#031422',
    fluidTint: 'rgba(0, 210, 255, 0.12)',
    themeType: 'lungs',
    hazard: {
      name: 'Gerak Silia (Ciliary Beat)',
      description: 'Silia bronkial dan arus aerosol perlahan mengalir ke arah atas mendorong mikroba.',
      driftX: 0,
      driftY: -16
    },
    lore: 'Epitel saluran pernapasan dilapisi silia dan mukus (Mucociliary escalator) yang terus-menerus menyaring partikel aerosol. Virus aerosol seperti Influenza dan SARS-CoV-2 mengincar reseptor di permukaan ini.',
    waves: [
      {
        waveNum: 1,
        title: 'Invasi Aerosol Awal',
        enemies: [
          { type: 'rhinovirus', count: 9 },
          { type: 'influenza', count: 6 }
        ],
        spawnInterval: 1.1
      },
      {
        waveNum: 2,
        title: 'Kolonisasi Mukosa Bronkial',
        enemies: [
          { type: 'influenza', count: 11 },
          { type: 'streptococcus', count: 8 },
          { type: 'sars_cov_2', count: 5 }
        ],
        spawnInterval: 0.95
      },
      {
        waveNum: 3,
        title: 'Kompensasi Pneumonia & Badai Sitokin',
        enemies: [
          { type: 'influenza', count: 12 },
          { type: 'streptococcus', count: 11 },
          { type: 'sars_cov_2', count: 7 }
        ],
        boss: 'boss_sars_cov_2',
        spawnInterval: 0.85
      }
    ],
    funFact: 'Satu kali bersin dapat melontarkan hingga 40.000 droplet aerosol dengan kecepatan mencapai 160 km/jam!'
  },

  gut: {
    id: 'gut',
    name: 'Saluran Pencernaan (Usus)',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#2a9d8f" stroke-width="2" stroke-linecap="round"><path d="M6 7c0-2 2-3 4-3s4 1.5 4 3.5c0 3-4 3-4 5.5s4 2.5 4 5c0 2-2 3-4 3s-4-1.5-4-3.5"/><path d="M18 7c0-2-2-3-4-3"/></svg>`,
    subtitle: 'Vili Intestinal & Mukosa Usus',
    colorTheme: '#2a9d8f',
    bgColor: '#021813',
    fluidTint: 'rgba(42, 157, 143, 0.12)',
    themeType: 'gut',
    hazard: {
      name: 'Gelombang Peristaltik Usus',
      description: 'Kontraksi ritmik dinding usus berkala mendorong cairan dan partikel ke kanan.',
      driftX: 20,
      driftY: 0
    },
    lore: 'Lumen usus dipenuhi tonjolan vili intestinal yang meliuk-liuk untuk absorpsi nutrisi. Cairan kaya enzim pencernaan dan mikrobiota komensal menjaga keutuhan barier epitel.',
    waves: [
      {
        waveNum: 1,
        title: 'Kontaminasi Makanan',
        enemies: [
          { type: 'escherichia_coli', count: 9 },
          { type: 'rhinovirus', count: 6 }
        ],
        spawnInterval: 1.1
      },
      {
        waveNum: 2,
        title: 'Proliferasi Enteropatogen',
        enemies: [
          { type: 'escherichia_coli', count: 13 },
          { type: 'streptococcus', count: 7 },
          { type: 'staph_aureus', count: 5 }
        ],
        spawnInterval: 0.95
      },
      {
        waveNum: 3,
        title: 'Invasi Mukosa Akut',
        enemies: [
          { type: 'escherichia_coli', count: 14 },
          { type: 'staph_aureus', count: 9 },
          { type: 'streptococcus', count: 7 }
        ],
        boss: 'boss_e_coli',
        spawnInterval: 0.85
      }
    ],
    funFact: 'Sekitar 70% dari seluruh jaringan imun tubuh manusia terkonsentrasi di usus dalam bentuk GALT (Gut-Associated Lymphoid Tissue)!'
  },

  skin: {
    id: 'skin',
    name: 'Epidermis (Luka Terbuka)',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#e76f51" stroke-width="2" stroke-linecap="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
    subtitle: 'Lapisan Fibrin & Keratin',
    colorTheme: '#e76f51',
    bgColor: '#1a0608',
    fluidTint: 'rgba(231, 111, 81, 0.12)',
    themeType: 'skin',
    hazard: {
      name: 'Eksudat & Debris Fibrin',
      description: 'Cairan plasma lengket dan serabut fibrin pembekuan darah memperlambat gerak mikroba.',
      driftX: 0,
      driftY: 0
    },
    lore: 'Ketika barier keratin kulit robek, jaring benang fibrin dan agregasi trombosit segera membentuk sumbat hemostatik untuk menahan serbuan bakteri dari udara luar.',
    waves: [
      {
        waveNum: 1,
        title: 'Kontaminasi Permukaan Luka',
        enemies: [
          { type: 'staph_aureus', count: 10 },
          { type: 'streptococcus', count: 6 }
        ],
        spawnInterval: 1.1
      },
      {
        waveNum: 2,
        title: 'Pembentukan Kluster Bakteri',
        enemies: [
          { type: 'staph_aureus', count: 13 },
          { type: 'escherichia_coli', count: 7 },
          { type: 'streptococcus', count: 6 }
        ],
        spawnInterval: 0.95
      },
      {
        waveNum: 3,
        title: 'Kolonisasi MRSA Biofilm',
        enemies: [
          { type: 'staph_aureus', count: 14 },
          { type: 'streptococcus', count: 9 },
          { type: 'escherichia_coli', count: 7 }
        ],
        boss: 'boss_mrsa',
        spawnInterval: 0.85
      }
    ],
    funFact: 'Kulit manusia ditutupi lapisan asam alami (acid mantle) ber-pH sekitar 5.5 yang dapat menghambat pertumbuhan sebagian besar bakteri patogen.'
  },

  bloodstream: {
    id: 'bloodstream',
    name: 'Pembuluh Darah (Vasculature)',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#e63946" stroke-width="2" stroke-linecap="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="rgba(230, 57, 70, 0.3)"/></svg>`,
    subtitle: 'Arteriol & Dinding Endotel',
    colorTheme: '#e63946',
    bgColor: '#160206',
    fluidTint: 'rgba(230, 57, 70, 0.14)',
    themeType: 'bloodstream',
    hazard: {
      name: 'Aliran Hemodinamik Arteri',
      description: 'Arus deras aliran darah kapiler berkala menghempas partikel ke arah kanan bawah.',
      driftX: 22,
      driftY: 8
    },
    lore: 'Arteriol dilapisi sel-sel endotel halus. Ketika patogen menembus sirkulasi darah (bakteremia/viremia), mereka dapat menyebar luas jika neutrofil tidak segera menempel pada dinding pembuluh.',
    waves: [
      {
        waveNum: 1,
        title: 'Bakteremia Akut',
        enemies: [
          { type: 'streptococcus', count: 9 },
          { type: 'influenza', count: 7 }
        ],
        spawnInterval: 1.1
      },
      {
        waveNum: 2,
        title: 'Viremia Sistemik',
        enemies: [
          { type: 'sars_cov_2', count: 12 },
          { type: 'staph_aureus', count: 9 },
          { type: 'influenza', count: 6 }
        ],
        spawnInterval: 0.95
      },
      {
        waveNum: 3,
        title: 'Krisis Sepsis Vaskular',
        enemies: [
          { type: 'streptococcus', count: 13 },
          { type: 'sars_cov_2', count: 11 },
          { type: 'staph_aureus', count: 8 }
        ],
        boss: 'boss_sars_cov_2',
        spawnInterval: 0.85
      }
    ],
    funFact: 'Total panjang seluruh pembuluh darah dalam satu tubuh manusia dewasa jika dibentangkan mencapai 100.000 kilometer, cukup mengitari bumi 2,5 kali!'
  },

  brain: {
    id: 'brain',
    name: 'Sistem Saraf (Otak)',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#b388ff" stroke-width="2" stroke-linecap="round"><path d="M12 4c-3.3 0-6 2.7-6 6 0 1.9 1 3.6 2.4 4.6.4.3.6.8.6 1.4v2c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-2c0-.5.2-1.1.6-1.4 1.4-1 2.4-2.7 2.4-4.6 0-3.3-2.7-6-6-6z"/></svg>`,
    subtitle: 'Blood-Brain Barrier (BBB)',
    colorTheme: '#b388ff',
    bgColor: '#080112',
    fluidTint: 'rgba(179, 136, 255, 0.1)',
    themeType: 'brain',
    hazard: {
      name: 'Gelombang Elektromagnetik Sinapsis',
      description: 'Loncatan sinyal listrik antar neuron kadang menyetrum mikroba di sekitarnya.',
      driftX: 5,
      driftY: -5
    },
    lore: 'Blood-Brain Barrier (BBB) adalah benteng pertahanan terakhir. Sangat sedikit patogen yang bisa menembusnya. Bakteri Meningococcus yang lolos bisa menyebabkan radang selaput otak (Meningitis) yang fatal.',
    waves: [
      {
        waveNum: 1,
        title: 'Penetrasi Mikroglia',
        enemies: [
          { type: 'streptococcus', count: 12 },
          { type: 'influenza', count: 5 }
        ],
        spawnInterval: 1.0
      },
      {
        waveNum: 2,
        title: 'Infeksi Cairan Serebrospinal',
        enemies: [
          { type: 'streptococcus', count: 18 },
          { type: 'staph_aureus', count: 10 }
        ],
        spawnInterval: 0.9
      },
      {
        waveNum: 3,
        title: 'Ancaman Meningitis Akut',
        enemies: [
          { type: 'streptococcus', count: 20 },
          { type: 'sars_cov_2', count: 8 }
        ],
        boss: 'boss_mrsa', 
        spawnInterval: 0.8
      }
    ],
    funFact: 'Otak manusia menggunakan sekitar 20% dari total oksigen dan energi tubuh, meskipun beratnya hanya 2% dari berat badan!'
  },

  stomach: {
    id: 'stomach',
    name: 'Lambung (Gastrik)',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#ffeb3b" stroke-width="2" stroke-linecap="round"><path d="M7 6c0-2.2 1.8-4 4-4s4 1.8 4 4c0 3.3-2 6-4 9-2-3-4-5.7-4-9z"/></svg>`,
    subtitle: 'Lautan Asam Klorida (HCl)',
    colorTheme: '#ffeb3b',
    bgColor: '#1a1600',
    fluidTint: 'rgba(255, 235, 59, 0.12)',
    themeType: 'stomach',
    hazard: {
      name: 'Erupsi Asam Lambung',
      description: 'Lingkungan sangat asam secara konstan merusak dinding patogen biasa (pH 1.5 - 3.5).',
      driftX: 0,
      driftY: 25
    },
    lore: 'Lambung bagaikan kawah mematikan bagi 99% bakteri karena cairan asamnya (HCl). Namun, bakteri Heliobacter pylori (H. Pylori) berevolusi dengan enzim urease untuk menetralkan asam dan menetap di lambung.',
    waves: [
      {
        waveNum: 1,
        title: 'Bakteri Kontaminan Makanan',
        enemies: [
          { type: 'escherichia_coli', count: 10 },
          { type: 'staph_aureus', count: 5 }
        ],
        spawnInterval: 1.2
      },
      {
        waveNum: 2,
        title: 'Pertahanan Urease',
        enemies: [
          { type: 'escherichia_coli', count: 15 },
          { type: 'streptococcus', count: 10 }
        ],
        spawnInterval: 1.0
      },
      {
        waveNum: 3,
        title: 'Kolonisasi H. Pylori',
        enemies: [
          { type: 'escherichia_coli', count: 18 },
          { type: 'staph_aureus', count: 12 },
          { type: 'streptococcus', count: 8 }
        ],
        boss: 'boss_sars_cov_2', // Ganti dengan boss yg relevan
        spawnInterval: 0.85
      }
    ],
    funFact: 'Asam lambung manusia sangat kuat hingga cukup korosif untuk melarutkan seng! Namun lapisan mukus melindungi perut dari mencerna dirinya sendiri.'
  }
};

export const SUBJECT_DATA = [
  {
    id: 0,
    name: 'HOMO SAPIENS #01 (DEWASA)',
    model: 'assets/human_model.glb',
    targetHeight: 1.75, // Scale adjustment
    organs: [
      { id: 'lungs', cx: 150, cy: 185 },
      { id: 'bloodstream', cx: 188, cy: 152 },
      { id: 'gut', cx: 155, cy: 260 },
      { id: 'skin', cx: 102, cy: 290 }
    ]
  },
  {
    id: 1,
    name: 'HOMO SAPIENS #02 (ANAK)',
    model: 'assets/michelle.glb',
    targetHeight: 1.5,
    organs: [
      { id: 'brain', cx: 150, cy: 65 },
      { id: 'stomach', cx: 165, cy: 230 },
      { id: 'lungs', cx: 150, cy: 175 }
    ]
  }
];
