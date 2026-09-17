// js/data/monopolyQuestions.js
// Bank Soal Kuis Tanya-Jawab Biologi & Imunologi untuk Bio-Monopoly

export const MONOPOLY_QUESTIONS = [
  {
    id: 'q1',
    category: 'SEL DARAH PUTIH',
    difficulty: 'Mudah',
    question: 'Sel imun manakah yang bertindak sebagai "tukang makan besar" (fagositosis) untuk membersihkan bakteri dan bangkai sel?',
    options: ['Makrofag', 'Eritrosit', 'Trombosit', 'Sel Lemak'],
    correct: 0,
    rewardATP: 120,
    penaltyATP: 40,
    explanation: 'Makrofag berasal dari kata Yunani "makros" (besar) dan "phagein" (makan). Sel ini bertindak menelan dan mencerna patogen serta debris seluler.'
  },
  {
    id: 'q2',
    category: 'SISTEM ADAPTIF',
    difficulty: 'Sedang',
    question: 'Sel imun apakah yang bertanggung jawab memproduksi molekul protein peluru khusus bernama Antibodi (Imunoglobulin)?',
    options: ['Limfosit T', 'Sel Plasma (Diferensiasi Sel B)', 'Neutrofil', 'Basofil'],
    correct: 1,
    rewardATP: 150,
    penaltyATP: 50,
    explanation: 'Sel B yang teraktivasi oleh antigen akan berdiferensiasi menjadi Sel Plasma yang mampu menembakkan ribuan molekul antibodi per detik!'
  },
  {
    id: 'q3',
    category: 'PATOGEN & VIRUS',
    difficulty: 'Mudah',
    question: 'Mengapa virus tidak dapat dibunuh menggunakan obat Antibiotik?',
    options: [
      'Karena virus memiliki cangkang titanium',
      'Karena antibiotik hanya menargetkan struktur sel bakteri, sedangkan virus bukan sel',
      'Karena virus terlalu kecil untuk dilihat obat',
      'Karena antibiotik justru memberi makan virus'
    ],
    correct: 1,
    rewardATP: 140,
    penaltyATP: 50,
    explanation: 'Antibiotik merusak dinding sel peptidoglikan atau ribosom bakteri. Virus tidak punya dinding sel atau metabolisme mandiri, melainkan membajak sel inang.'
  },
  {
    id: 'q4',
    category: 'ORGAN & ANATOMI',
    difficulty: 'Sedang',
    question: 'Di bagian tubuh manakah sel-sel darah (termasuk sel imun dan sel darah merah) pertama kali diproduksi?',
    options: ['Hati (Hepar)', 'Sumsum Tulang Merah (Bone Marrow)', 'Jantung', 'Paru-paru'],
    correct: 1,
    rewardATP: 130,
    penaltyATP: 40,
    explanation: 'Hematopoiesis (pembentukan sel darah) berpusat di sumsum tulang merah melalui diferensiasi sel punca hematopoietik.'
  },
  {
    id: 'q5',
    category: 'MEKANISME PERTAHANAN',
    difficulty: 'Sedang',
    question: 'Apa nama proses kematian sel terprogram yang dipicu oleh Sel T Sitotoksik agar sel yang terinfeksi virus tidak menjadi sarang perkembangbiakan?',
    options: ['Nekrosis', 'Apoptosis', 'Mitosis', 'Metamorfosis'],
    correct: 1,
    rewardATP: 160,
    penaltyATP: 60,
    explanation: 'Apoptosis adalah mekanisme bunuh diri seluler yang rapi dan terkoordinasi, mencegah penyebaran virus ke sel-sel tetangga tanpa memicu kebocoran isi sel.'
  },
  {
    id: 'q6',
    category: 'VAKSINASI',
    difficulty: 'Mudah',
    question: 'Bagaimana cara kerja vaksin dalam melindungi tubuh dari penyakit menular?',
    options: [
      'Langsung membunuh kuman saat disuntikkan',
      'Melatih sistem imun dengan antigen jinak agar membentuk Sel Memori',
      'Menggantikan fungsi seluruh sel darah merah',
      'Membuat lapisan pelindung plastik di kulit'
    ],
    correct: 1,
    rewardATP: 150,
    penaltyATP: 40,
    explanation: 'Vaksin memperkenalkan fragmen patogen yang tidak berbahaya sehingga Limfosit B & T membentuk Sel Memori yang siap bereaksi cepat jika patogen asli menyerang.'
  },
  {
    id: 'q7',
    category: 'BIOKIMIA IMUN',
    difficulty: 'Sulit',
    question: 'Molekul pembawa pesan kimiawi apa yang dilepaskan sel imun untuk memanggil bala bantuan ke area luka atau infeksi?',
    options: ['Sitokin & Kemokin', 'Hemoglobin', 'Insulin', 'Glukosa'],
    correct: 0,
    rewardATP: 180,
    penaltyATP: 60,
    explanation: 'Sitokin (seperti Interleukin dan Interferon) serta Kemokin berfungsi sebagai sinyal SOS pemanggil dan pengatur respon inflamasi leukosit.'
  },
  {
    id: 'q8',
    category: 'GARIS DEPAN',
    difficulty: 'Mudah',
    question: 'Sel darah putih manakah yang jumlahnya paling banyak (60-70%) dan menjadi pasukan respon cepat pertama yang tiba di luka?',
    options: ['Neutrofil', 'Eosinofil', 'Monosit', 'Basofil'],
    correct: 0,
    rewardATP: 120,
    penaltyATP: 40,
    explanation: 'Neutrofil adalah garda terdepan sistem imun bawaan. Nanah yang muncul di luka sebagian besar terdiri dari neutrofil yang gugur setelah bertempur melawan bakteri.'
  },
  {
    id: 'q9',
    category: 'BAKTERI BAIK',
    difficulty: 'Sedang',
    question: 'Kumpulan triliunan mikroorganisme menguntungkan yang hidup di usus manusia dan membantu sistem imun disebut:',
    options: ['Mikrobioma Usus (Gut Microbiota)', 'Plankton Intestinal', 'Bakteri Patogenik', 'Parasit Usus'],
    correct: 0,
    rewardATP: 140,
    penaltyATP: 40,
    explanation: 'Mikrobioma usus berkompetisi memperebutkan nutrisi melawan bakteri jahat dan melatih sistem imun saluran cerna agar tetap seimbang.'
  },
  {
    id: 'q10',
    category: 'ORGAN PERNAPASAN',
    difficulty: 'Sedang',
    question: 'Struktur berupa rambut halus bergetar di saluran pernapasan yang bertugas menyapu lendir dan kuman keluar dari paru-paru disebut:',
    options: ['Silia (Cilia)', 'Vili Usus', 'Flagela', 'Alveolus'],
    correct: 0,
    rewardATP: 140,
    penaltyATP: 50,
    explanation: 'Silia pada epitel bersilia terus bergetar menggerakkan lapisan mukus (Mucociliary escalator) ke atas menuju tenggorokan untuk dibatukkan atau ditelan.'
  },
  {
    id: 'q11',
    category: 'SISTEM LIMFATIK',
    difficulty: 'Sedang',
    question: 'Organ berbentuk kacang kecil yang berfungsi sebagai pos pemeriksaan dan penyaringan cairan getah bening (limfa) dari patogen adalah:',
    options: ['Nodus Limfa (Kelenjar Getah Bening)', 'Ginjal', 'Kantung Empedu', 'Pankreas'],
    correct: 0,
    rewardATP: 150,
    penaltyATP: 50,
    explanation: 'Nodus limfa dipenuhi sel B dan sel T. Ketika ada infeksi di dekatnya, nodus limfa akan membengkak karena sel imun aktif berproliferasi.'
  },
  {
    id: 'q12',
    category: 'GAYA HIDUP & IMUNITAS',
    difficulty: 'Mudah',
    question: 'Kebiasaan manakah yang terbukti secara ilmiah memperkuat daya tahan tubuh dan produksi sitokin pelindung?',
    options: [
      'Tidur cukup 7–8 jam dan mengonsumsi makanan bergizi',
      'Begadang tiap malam bermain game tanpa istirahat',
      'Jarang minum air putih dan tidak berolahraga',
      'Terus-menerus stres tanpa relaksasi'
    ],
    correct: 0,
    rewardATP: 120,
    penaltyATP: 30,
    explanation: 'Saat tidur nyenyak, tubuh memproduksi dan melepaskan sitokin yang esensial untuk melawan infeksi dan meredakan peradangan.'
  },
  {
    id: 'q13',
    category: 'BIO-SENJATA SEL',
    difficulty: 'Sulit',
    question: 'Enzim yang terkandung di dalam air mata, air liur, dan lendir yang mampu merusak dinding sel bakteri adalah:',
    options: ['Lisozim', 'Amilase', 'Pepsin', 'Lipase'],
    correct: 0,
    rewardATP: 170,
    penaltyATP: 60,
    explanation: 'Lisozim (Lysozyme) memecah ikatan kimiawi peptidoglikan dinding sel bakteri gram positif, bertindak sebagai antiseptik alami tubuh.'
  },
  {
    id: 'q14',
    category: 'MEMORI IMUNOLOGIS',
    difficulty: 'Sedang',
    question: 'Mengapa seseorang yang pernah terkena cacar air umumnya tidak akan terjangkit cacar air untuk kedua kalinya?',
    options: [
      'Karena virus cacar air takut pada orang dewasa',
      'Karena terbentuk Sel T dan Sel B Memori yang merespon kilat sebelum virus berkembang',
      'Karena kulit menjadi tebal secara permanen',
      'Karena darahnya berubah warna'
    ],
    correct: 1,
    rewardATP: 150,
    penaltyATP: 40,
    explanation: 'Respon imun sekunder yang dimediasi Sel Memori jauh lebih cepat dan kuat (titer antibodi melonjak drastis) sehingga virus dieliminasi sebelum memicu gejala.'
  },
  {
    id: 'q15',
    category: 'NUTRISI IMUN',
    difficulty: 'Mudah',
    question: 'Mineral penting yang esensial untuk perkembangan sel imun dan penyembuhan jaringan luka adalah:',
    options: ['Zinc (Seng)', 'Tembaga murni', 'Merkuri', 'Emas'],
    correct: 0,
    rewardATP: 130,
    penaltyATP: 30,
    explanation: 'Zinc (Seng) adalah kofaktor untuk lebih dari 300 enzim dalam tubuh yang mengatur proliferasi dan fungsi leukosit.'
  }
];
