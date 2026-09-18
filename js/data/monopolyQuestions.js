// js/data/monopolyQuestions.js
// Bank Soal Kuis Tanya-Jawab Biologi & Imunologi untuk Bio-Monopoly
// 100% Diturunkan dari Materi Ensiklopedia Imun (Imunpedia - Kisi-Kisi Dosen)

export const MONOPOLY_QUESTIONS = [
  // ==========================================
  // BAB I: SEL-SEL IMUN (SPEC-IMM-01 s/d 04)
  // ==========================================
  {
    id: 'q_macro_fago',
    category: 'BAB I // SEL IMUN',
    kisiKisi: 'Bab I: Makrofag (SPEC-IMM-01)',
    difficulty: 'Mudah',
    question: 'Di dalam Imunpedia, Makrofag mencerna bakteri dengan menggabungkan fagosom dengan organel seluler asam apa?',
    options: ['Lisosom (membentuk Fagolisosom)', 'Ribosom', 'Sentrosom', 'Retikulum Endoplasma'],
    correct: 0,
    rewardATP: 130,
    penaltyATP: 40,
    explanation: 'Sesuai Imunpedia (SPEC-IMM-01), fagosom berfusi dengan lisosom yang ber-pH asam dan kaya enzim hidrolitik untuk mencerna membran kuman patogen.'
  },
  {
    id: 'q_macro_apc',
    category: 'BAB I // SEL IMUN',
    kisiKisi: 'Bab I: Makrofag (SPEC-IMM-01)',
    difficulty: 'Sedang',
    question: 'Selain menelan kuman, Makrofag bertindak sebagai Antigen-Presenting Cell (APC) yang menyajikan fragmen antigen melalui molekul apa?',
    options: ['Molekul MHC-II kepada Sel T Helper', 'Molekul Hemoglobin', 'Molekul Insulin', 'Kapsid Viral'],
    correct: 0,
    rewardATP: 150,
    penaltyATP: 50,
    explanation: 'Berdasarkan Imunpedia, Makrofag menyajikan fragmen antigen via molekul MHC-II kepada Limfosit T Helper untuk memicu aktivasi imunitas adaptif.'
  },
  {
    id: 'q_neutro_first',
    category: 'BAB I // SEL IMUN',
    kisiKisi: 'Bab I: Neutrofil (SPEC-IMM-02)',
    difficulty: 'Mudah',
    question: 'Sel leukosit manakah yang merupakan populasi terbanyak dalam darah (50–70%) dan tiba paling pertama di lokasi luka infeksi?',
    options: ['Neutrofil (PMN)', 'Eritrosit', 'Eosinofil', 'Trombosit'],
    correct: 0,
    rewardATP: 120,
    penaltyATP: 40,
    explanation: 'Berdasarkan Imunpedia (SPEC-IMM-02), Neutrofil adalah first responder terbanyak dalam sirkulasi darah yang tiba kilat via ekstravasasi dan kemotaksis.'
  },
  {
    id: 'q_neutro_nets',
    category: 'BAB I // SEL IMUN',
    kisiKisi: 'Bab I: Neutrofil (SPEC-IMM-02)',
    difficulty: 'Sedang',
    question: 'Senjata rahasia apakah yang dilontarkan neutrofil berupa jaring serat kromatin ekstraseluler untuk menjerat bakteri?',
    options: [
      'NETs (Neutrophil Extracellular Traps)',
      'Membran Kapsid Titanium',
      'Gelembung Fosfolipid',
      'Jala Kolagen Subkutan'
    ],
    correct: 0,
    rewardATP: 150,
    penaltyATP: 50,
    explanation: 'Sesuai Imunpedia, neutrofil mampu melontarkan NETs berupa jaring kromatin yang dilapisi peptida antimikroba untuk menjebak dan membunuh mikroba.'
  },
  {
    id: 'q_neutro_pus',
    category: 'BAB I // SEL IMUN',
    kisiKisi: 'Bab I: Neutrofil (SPEC-IMM-02)',
    difficulty: 'Mudah',
    question: 'Berdasarkan fakta sains Imunpedia, nanah (pus) yang terbentuk pada luka infeksi sebenarnya tersusun atas apa?',
    options: [
      'Tumpukan neutrofil yang telah mengalami apoptosis massal',
      'Kumpulan sel darah merah yang mengering',
      'Cairan asam lambung yang bocor',
      'Gumpalan lemak subkutan'
    ],
    correct: 0,
    rewardATP: 130,
    penaltyATP: 40,
    explanation: 'Imunpedia (SPEC-IMM-02) menjelaskan bahwa nanah sebagian besar tersusun atas tumpukan neutrofil yang gugur berkorban membendung invasi bakteri.'
  },
  {
    id: 'q_bcell_plasma',
    category: 'BAB I // SEL IMUN',
    kisiKisi: 'Bab I: Limfosit B (SPEC-IMM-03)',
    difficulty: 'Sedang',
    question: 'Setelah teraktivasi oleh antigen, Limfosit B berdiferensiasi menjadi pabrik penghasil ribuan antibodi per detik yang disebut:',
    options: ['Sel Plasma (Plasma Cell)', 'Sel Mast', 'Sel Dendritik', 'Basofil'],
    correct: 0,
    rewardATP: 150,
    penaltyATP: 50,
    explanation: 'Berdasarkan Imunpedia, sel B berkembang menjadi Sel Plasma yang memuntahkan ribuan antibodi per detik dan Sel Memori B yang bertahan seumur hidup.'
  },
  {
    id: 'q_bcell_marrow',
    category: 'BAB I // SEL IMUN',
    kisiKisi: 'Bab I: Limfosit B (SPEC-IMM-03)',
    difficulty: 'Mudah',
    question: 'Di organ manakah Limfosit B pertama kali dibentuk dan menjalani proses pematangan (maturasi)?',
    options: ['Sumsum Tulang (Bone Marrow)', 'Kelenjar Tiroid', 'Pankreas', 'Kantung Empedu'],
    correct: 0,
    rewardATP: 130,
    penaltyATP: 40,
    explanation: 'Huruf "B" pada Limfosit B merujuk pada asal pembentukan dan pematangannya di Bone Marrow (Sumsum Tulang), sesuai catatan Imunpedia.'
  },
  {
    id: 'q_tcell_perforin',
    category: 'BAB I // SEL IMUN',
    kisiKisi: 'Bab I: Sel T Sitotoksik (SPEC-IMM-04)',
    difficulty: 'Sulit',
    question: 'Dua senjata molekuler apakah yang ditembakkan Sel T Sitotoksik (CD8+) untuk melubangi membran dan memicu apoptosis sel inang yang terinfeksi?',
    options: [
      'Perforin dan Granzyme',
      'Amilase dan Lipase',
      'Insulin dan Glukagon',
      'Hemoglobin dan Fibrinogen'
    ],
    correct: 0,
    rewardATP: 160,
    penaltyATP: 60,
    explanation: 'Imunpedia (SPEC-IMM-04) mencatat Perforin melubangi pori membran sel inang, lalu Granzyme masuk memicu apoptosis (kematian sel terprogram).'
  },
  {
    id: 'q_tcell_mhc1',
    category: 'BAB I // SEL IMUN',
    kisiKisi: 'Bab I: Sel T Sitotoksik (SPEC-IMM-04)',
    difficulty: 'Sedang',
    question: 'Molekul penanda pada membran sel tubuh apa yang diinspeksi Sel T Sitotoksik untuk mendeteksi sel yang telah dibajak virus?',
    options: ['Molekul MHC-I', 'Molekul Kolagen', 'Reseptor Histamin', 'Molekul Keratin'],
    correct: 0,
    rewardATP: 150,
    penaltyATP: 50,
    explanation: 'Sesuai Imunpedia, seluruh sel bernukleus menyajikan peptida internal via MHC-I. Jika peptida tersebut berasal dari virus, CTL akan mengeksekusi sel itu.'
  },

  // ==========================================
  // BAB II: VIROLOGI (SPEC-VIR-01 s/d 03)
  // ==========================================
  {
    id: 'q_flu_hana',
    category: 'BAB II // VIROLOGI',
    kisiKisi: 'Bab II: Virus Influenza A (SPEC-VIR-01)',
    difficulty: 'Sedang',
    question: 'Dua tonjolan glikoprotein utama pada permukaan Virus Influenza A yang bertugas untuk penetrasi dan pelepasan virion adalah:',
    options: [
      'Hemagglutinin (HA) dan Neuraminidase (NA)',
      'Keratin dan Kolagen',
      'Miosin dan Aktin',
      'Kapsid Alpha dan Beta'
    ],
    correct: 0,
    rewardATP: 150,
    penaltyATP: 50,
    explanation: 'Berdasarkan Imunpedia (SPEC-VIR-01), HA mengikat asam sialat reseptor epitel inang, sedangkan NA memotong asam sialat agar virion baru dapat lepas.'
  },
  {
    id: 'q_flu_shift',
    category: 'BAB II // VIROLOGI',
    kisiKisi: 'Bab II: Virus Influenza A (SPEC-VIR-01)',
    difficulty: 'Sedang',
    question: 'Mengapa galur Virus Influenza dapat bermutasi drastis memicu pandemi global baru (Antigenic Shift)?',
    options: [
      'Karena genom RNA-nya terbagi menjadi 8 segmen terpisah yang dapat bertukar',
      'Karena memiliki dinding sel peptidoglikan yang sangat tebal',
      'Karena ukurannya lebih besar daripada sel darah merah',
      'Karena virus influenza kebal terhadap suhu mendidih'
    ],
    correct: 0,
    rewardATP: 150,
    penaltyATP: 50,
    explanation: 'Sesuai Imunpedia, genom 8 segmen RNA memungkinkan pertukaran materi genetik (reassortment) saat dua galur menginfeksi sel yang sama (Antigenic Shift).'
  },
  {
    id: 'q_covid_ace2',
    category: 'BAB II // VIROLOGI',
    kisiKisi: 'Bab II: SARS-CoV-2 (SPEC-VIR-02)',
    difficulty: 'Mudah',
    question: 'Protein Spike (S) milik SARS-CoV-2 membajak sel paru-paru dan endotel tubuh manusia dengan mengikat reseptor apa?',
    options: ['Reseptor ACE2 (Angiotensin-Converting Enzyme 2)', 'Reseptor Insulin', 'Reseptor Adrenalin', 'Reseptor Dopamin'],
    correct: 0,
    rewardATP: 140,
    penaltyATP: 40,
    explanation: 'Imunpedia (SPEC-VIR-02) mencatat Spike (S) mengikat reseptor ACE2 pada membran sel paru-paru dengan bantuan protease TMPRSS2 inang.'
  },
  {
    id: 'q_covid_storm',
    category: 'BAB II // VIROLOGI',
    kisiKisi: 'Bab II: SARS-CoV-2 (SPEC-VIR-02)',
    difficulty: 'Sedang',
    question: 'Kondisi hiperinflamasi berbahaya saat sitokin IL-6 dan TNF-α membanjiri peredaran darah hingga merusak kapiler inang disebut:',
    options: ['Badai Sitokin (Cytokine Storm)', 'Badai Lisosom', 'Reaksi Apoptosis Ringan', 'Koagulasi Pasif'],
    correct: 0,
    rewardATP: 150,
    penaltyATP: 50,
    explanation: 'Berdasarkan Imunpedia, Badai Sitokin adalah respon imun yang lepas kendali di mana sitokin pro-inflamasi merusak dinding kapiler organ inang.'
  },
  {
    id: 'q_rhino_cold',
    category: 'BAB II // VIROLOGI',
    kisiKisi: 'Bab II: Human Rhinovirus (SPEC-VIR-03)',
    difficulty: 'Sedang',
    question: 'Mengapa Human Rhinovirus (penyebab salesma) bereplikasi paling optimal di rongga hidung manusia?',
    options: [
      'Karena menyukai suhu lingkungan 33–35°C yang lebih dingin dari suhu inti tubuh',
      'Karena membutuhkan oksigen murni 100%',
      'Karena tidak tahan dengan udara segar',
      'Karena hidung manusia memiliki enzim pelindung virus'
    ],
    correct: 0,
    rewardATP: 140,
    penaltyATP: 50,
    explanation: 'Imunpedia (SPEC-VIR-03) menjelaskan Rhinovirus bereplikasi optimal pada 33-35°C, persis suhu rongga hidung yang lebih sejuk dari suhu inti tubuh (37°C).'
  },

  // ==========================================
  // BAB III: BAKTERIOLOGI (SPEC-BAC-01 s/d 03)
  // ==========================================
  {
    id: 'q_strep_capsule',
    category: 'BAB III // BAKTERIOLOGI',
    kisiKisi: 'Bab III: Streptococcus pneumoniae (SPEC-BAC-01)',
    difficulty: 'Sedang',
    question: 'Senjata pelindung apakah yang membuat Streptococcus pneumoniae licin dan kebal terhadap fagositosis makrofag?',
    options: [
      'Kapsul Polisakarida tebal bermuatan negatif',
      'Dinding spora kalsium',
      'Kantung lipid lilin kedap air',
      'Barier kristal asam urat'
    ],
    correct: 0,
    rewardATP: 150,
    penaltyATP: 50,
    explanation: 'Sesuai Imunpedia (SPEC-BAC-01), kapsul polisakarida tebal mencegah perlekatan fagosom makrofag kecuali jika telah teropsonisasi antibodi/C3b.'
  },
  {
    id: 'q_staph_proteina',
    category: 'BAB III // BAKTERIOLOGI',
    kisiKisi: 'Bab III: Staphylococcus aureus (SPEC-BAC-02)',
    difficulty: 'Sulit',
    question: 'Bagaimana cara kerja Protein A yang diproduksi bakteri Staphylococcus aureus untuk mengelabui sel fagosit?',
    options: [
      'Mengikat ekor Fc antibodi secara terbalik sehingga tak dikenali fagosit',
      'Menghancurkan seluruh pembuluh darah inang',
      'Mengubah sel darah putih menjadi sel bakteri',
      'Menyerap seluruh oksigen di dalam darah'
    ],
    correct: 0,
    rewardATP: 160,
    penaltyATP: 60,
    explanation: 'Imunpedia (SPEC-BAC-02) mencatat Protein A mengikat ekor Fc antibodi terbalik, sehingga bagian Fab menonjol keluar dan fagosit tidak bisa mendeteksinya.'
  },
  {
    id: 'q_staph_biofilm',
    category: 'BAB III // BAKTERIOLOGI',
    kisiKisi: 'Bab III: Staphylococcus aureus (SPEC-BAC-02)',
    difficulty: 'Sedang',
    question: 'Lapisan lendir matriks ekstraseluler bakteri yang dapat meningkatkan resistensi antimikroba hingga 1.000 kali lipat disebut:',
    options: ['Biofilm', 'Peptidoglikan luar', 'Kapsomer', 'Silia bakteri'],
    correct: 0,
    rewardATP: 140,
    penaltyATP: 40,
    explanation: 'Berdasarkan Imunpedia, Biofilm Staphylococcus aureus melindungi koloni kuman dari penetrasi antibiotik hingga 1.000 kali lipat dibanding sel planktonik.'
  },
  {
    id: 'q_ecoli_lps',
    category: 'BAB III // BAKTERIOLOGI',
    kisiKisi: 'Bab III: Escherichia coli (SPEC-BAC-03)',
    difficulty: 'Sedang',
    question: 'Komponen membran luar E. coli apakah yang mengikat reseptor TLR-4 makrofag dan memicu demam tinggi (pirogenik)?',
    options: [
      'Lipopolisakarida (LPS / Endotoksin)',
      'Peptidoglikan murni',
      'Asam Teikoat',
      'Glikogen membran'
    ],
    correct: 0,
    rewardATP: 150,
    penaltyATP: 50,
    explanation: 'Sesuai Imunpedia (SPEC-BAC-03), LPS adalah ligan paling poten bagi reseptor TLR-4 makrofag yang memicu pelepasan pirogen pemicu demam tubuh.'
  },

  // ==========================================
  // BAB IV: NUTRISI & ADJUVAN (SPEC-NUT-01 s/d 03)
  // ==========================================
  {
    id: 'q_vitc_ros',
    category: 'BAB IV // NUTRISI',
    kisiKisi: 'Bab IV: Vitamin C (SPEC-NUT-01)',
    difficulty: 'Mudah',
    question: 'Mengapa Vitamin C esensial selama infeksi? Berdasarkan Imunpedia, fungsi utamanya adalah:',
    options: [
      'Menetralkan ROS (radikal bebas) hasil ledakan respiratori neutrofil',
      'Membunuh bakteri secara langsung dengan radiasi',
      'Menggantikan fungsi seluruh sel T',
      'Membekukan membran luar virus'
    ],
    correct: 0,
    rewardATP: 130,
    penaltyATP: 40,
    explanation: 'Imunpedia (SPEC-NUT-01) mencatat Vitamin C adalah antioksidan kuat penangkal ROS berlebih dari ledakan respiratori neutrofil agar jaringan inang terlindungi.'
  },
  {
    id: 'q_vitd_vdr',
    category: 'BAB IV // NUTRISI',
    kisiKisi: 'Bab IV: Vitamin D3 (SPEC-NUT-02)',
    difficulty: 'Sulit',
    question: 'Saat mengikat reseptor nukleus VDR di leukosit, Vitamin D3 merangsang sintesis peptida antimikroba alami tubuh yaitu:',
    options: [
      'Katelisidin (LL-37) dan Defensin-β',
      'Insulin dan Glukagon',
      'Kolagen dan Elastin',
      'Pepsin dan Renin'
    ],
    correct: 0,
    rewardATP: 160,
    penaltyATP: 60,
    explanation: 'Berdasarkan Imunpedia (SPEC-NUT-02), Vitamin D3 memicu transkripsi gen Katelisidin (LL-37) dan Defensin-β yang dapat melubangi dinding sel mikroba.'
  },
  {
    id: 'q_zinc_rdrp',
    category: 'BAB IV // NUTRISI',
    kisiKisi: 'Bab IV: Ion Seng / Zinc (SPEC-NUT-03)',
    difficulty: 'Sedang',
    question: 'Bagaimana mekanisme ion seng (Zinc / Zn2+) dalam menghambat perbanyakan virus RNA di dalam sel inang?',
    options: [
      'Mengganggu dan menghambat enzim RNA-dependent RNA polymerase (RdRp)',
      'Memotong untai DNA inti inang',
      'Mencairkan membran plasma sel manusia',
      'Menghentikan aliran darah secara total'
    ],
    correct: 0,
    rewardATP: 150,
    penaltyATP: 50,
    explanation: 'Imunpedia (SPEC-NUT-03) menyatakan Zinc secara langsung mengganggu aktivitas enzim RdRp virus RNA serta memperpendek durasi sakit hingga 33%.'
  }
];
