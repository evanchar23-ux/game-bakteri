/**
 * pathogens.js
 * Database Patogen: Virus, Bakteri, dan Boss Penyakit
 * Dilengkapi morfologi mikroskopik, mekanisme biologis nyata, dan visualisasi canvas.
 */

export const PATHOGENS = {
  // --- VIRUSES ---
  influenza: {
    id: 'influenza',
    name: 'Influenza A Virus',
    type: 'virus',
    genome: 'ssRNA (-) Bersegmen',
    envelope: true,
    color: '#ff4b72',
    spikeColor: '#ffd166',
    radius: 14,
    hp: 45,
    speed: 110,
    damage: 12,
    score: 50,
    spikes: 8, // Hemagglutinin & Neuraminidase
    behavior: 'swarming',
    expDrop: 15,
    lore: 'Virus RNA berselubung dengan duri Hemagglutinin (HA) untuk menempel dan Neuraminidase (NA) untuk melepaskan virion baru.'
  },

  sars_cov_2: {
    id: 'sars_cov_2',
    name: 'SARS-CoV-2 Virion',
    type: 'virus',
    genome: 'ssRNA (+) Monopartit',
    envelope: true,
    color: '#e63946',
    spikeColor: '#ff0054',
    radius: 18,
    hp: 95,
    speed: 95,
    damage: 18,
    score: 110,
    spikes: 12, // Duri Corona S-Protein
    behavior: 'infect_epith',
    canShoot: true,
    shootInterval: 2.4,
    expDrop: 30,
    lore: 'Betacoronavirus dengan Spike Glycoprotein (S) yang mengikat reseptor ACE2 sel inang, berisiko memicu badai sitokin.'
  },

  rhinovirus: {
    id: 'rhinovirus',
    name: 'Human Rhinovirus',
    type: 'virus',
    genome: 'ssRNA (+) Tanpa Selubung (Naked)',
    envelope: false,
    color: '#f72585',
    spikeColor: '#b5179e',
    radius: 11,
    hp: 30,
    speed: 145,
    damage: 8,
    score: 40,
    spikes: 0,
    shape: 'icosahedral',
    behavior: 'fast_erratic',
    expDrop: 12,
    lore: 'Penyebab utama common cold. Kapsid ikosahedral telanjang tanpa amplop lipid membuatnya tahan terhadap deterjen dan eter.'
  },

  // --- BACTERIA ---
  streptococcus: {
    id: 'streptococcus',
    name: 'Streptococcus pneumoniae',
    type: 'bacteria',
    gram: 'Gram Positif (Kokus Rantai)',
    envelope: false,
    color: '#9d4edd',
    capsuleColor: 'rgba(157, 78, 221, 0.35)',
    radius: 16,
    hp: 120,
    speed: 75,
    damage: 16,
    armor: 15, // Kapsul polisakarida antifagositik
    score: 90,
    chainLength: 3,
    behavior: 'chain_charge',
    expDrop: 25,
    lore: 'Bakteri kokus gram positif berantai. Memiliki kapsul polisakarida tebal yang melindunginya dari fagositosis langsung sebelum diopsonisasi.'
  },

  staph_aureus: {
    id: 'staph_aureus',
    name: 'Staphylococcus aureus',
    type: 'bacteria',
    gram: 'Gram Positif (Tandan Anggur)',
    envelope: false,
    color: '#e0a96d',
    radius: 15,
    hp: 85,
    speed: 85,
    damage: 15,
    clusterCount: 4,
    score: 75,
    behavior: 'cluster_march',
    expDrop: 20,
    lore: 'Kokus berkelompok mirip tandan anggur. Menghasilkan enzim koagulase dan protein A yang mengikat fragmen Fc antibodi terbalik.'
  },

  escherichia_coli: {
    id: 'escherichia_coli',
    name: 'Escherichia coli (UPEC/EHEC)',
    type: 'bacteria',
    gram: 'Gram Negatif (Basil Berflagel)',
    envelope: false,
    color: '#2a9d8f',
    radius: 17,
    length: 32,
    hp: 110,
    speed: 120,
    damage: 14,
    score: 85,
    hasFlagella: true,
    behavior: 'flagella_burst',
    expDrop: 22,
    lore: 'Basil gram-negatif dengan lipopolisakarida (Endotoksin LPS). Flagela peritrikat membantunya berenang lincah di cairan viskos usus dan saluran urin.'
  },

  // --- BOSSES ---
  boss_sars_cov_2: {
    id: 'boss_sars_cov_2',
    name: 'Apex SARS-CoV-2 "Spiked Overlord"',
    isBoss: true,
    type: 'virus',
    genome: 'Hyper-Mutated RNA Lineage',
    color: '#b5179e',
    spikeColor: '#ff0054',
    radius: 46,
    hp: 2800,
    maxHp: 2800,
    speed: 65,
    damage: 32,
    score: 1500,
    spikes: 24,
    behavior: 'boss_sars',
    expDrop: 250,
    specialSkills: [
      'Cytokine Storm Burst (Area confusion waves)',
      'Viral Budding (Spawns mini influenza/coronaviruses)',
      'Spike Piercing Volley'
    ],
    lore: 'Varian virion raksasa yang bermutasi. Spike protein afinitas tinggi memicu eksaserbasi reaksi inflamasi parah (Badai Sitokin).'
  },

  boss_mrsa: {
    id: 'boss_mrsa',
    name: 'Superbug MRSA "The Biofilm Fortress"',
    isBoss: true,
    type: 'bacteria',
    gram: 'Methicillin-Resistant S. aureus',
    color: '#d4a373',
    capsuleColor: 'rgba(212, 163, 115, 0.4)',
    radius: 48,
    hp: 3400,
    maxHp: 3400,
    speed: 55,
    damage: 36,
    armor: 40, // Biofilm tebal
    score: 1800,
    behavior: 'boss_mrsa',
    expDrop: 300,
    specialSkills: [
      'Biofilm Shield Generation (Absorbs damage)',
      'Beta-Lactamase Pulse',
      'Exotoxin Slime Trail'
    ],
    lore: 'Galur Staphylococcus aureus yang resisten terhadap antibiotik beta-laktam. Membentuk matriks ekstraseluler biofilm keras yang sulit ditembus.'
  },

  boss_e_coli: {
    id: 'boss_e_coli',
    name: 'Shiga Colossus E. coli O157:H7',
    isBoss: true,
    type: 'bacteria',
    gram: 'Enterohemorrhagic E. coli',
    color: '#1b4332',
    radius: 45,
    length: 70,
    hp: 3000,
    maxHp: 3000,
    speed: 80,
    damage: 34,
    score: 1600,
    hasFlagella: true,
    behavior: 'boss_ecoli',
    expDrop: 280,
    specialSkills: [
      'Shiga Toxin Nova (Slows and burns immunity)',
      'Binary Fission Replication (Splits into clones at 50% HP)',
      'Flagellar Dash'
    ],
    lore: 'Bakteri enterohemoragik yang menghasilkan Toksin Shiga (Stx), menghambat sintesis protein sel endotel dan memicu sindrom uremik hemolitik.'
  }
};
