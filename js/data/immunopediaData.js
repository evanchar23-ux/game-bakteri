/**
 * immunopediaData.js
 * Database Edukasi Ensiklopedia Mikroskopik Virologi & Imunologi
 */

export const IMMUNOPEDIA_DATA = {
  cells: [
    {
      id: 'macro',
      name: 'Makrofag (Macrophage)',
      tag: 'Sistem Imun Bawaan (Innate Immunity)',
      icon: '🛡️',
      desc: 'Berasal dari diferensiasi monosit darah yang bermigrasi ke jaringan. Makrofag bertindak sebagai sel fagositik profesional pembersih debris seluler dan patogen asing.',
      mechanism: 'Melakukan penelanan patogen melalui pembentukan fagosom yang berfusi dengan lisosom (fagolisosom) yang ber-pH asam dan kaya enzim hidrolitik.',
      funFact: 'Makrofag juga berperan sebagai Antigen-Presenting Cell (APC) yang memproses fragmen antigen dan menyajikannya via molekul MHC-II kepada Limfosit T Helper.'
    },
    {
      id: 'neutro',
      name: 'Neutrofil (Neutrophil)',
      tag: 'Garis Depan Pertama (First Responder)',
      icon: '⚡',
      desc: 'Merupakan leukosit terbanyak dalam sirkulasi darah manusia (50-70%). Sel pertama yang tiba di lokasi luka atau infeksi akut melalui proses ekstravasasi dan kemotaksis.',
      mechanism: 'Membunuh mikroba melalui tiga rute: fagositosis cepat, degranulasi enzim antimikroba (lisozim, defensin), dan pembentukan NETs (Neutrophil Extracellular Traps).',
      funFact: 'Pus atau nanah yang terbentuk pada luka infeksi sebagian besar tersusun atas tumpukan neutrofil yang telah mengalami apoptosis setelah berjuang.'
    },
    {
      id: 'bcell',
      name: 'Limfosit B (B-Cell)',
      tag: 'Imunitas Humoral Adaptif',
      icon: '🏹',
      desc: 'Berasal dan matang di sumsum tulang (Bone Marrow). Bertanggung jawab menghasilkan antibodi (imunoglobulin) spesifik terhadap epitop antigen patogen.',
      mechanism: 'Setelah mengenali antigen dan dibantu sel Th2, sel B berproliferasi menjadi Sel Plasma (penghasil ribuan antibodi per detik) dan Sel Memori B jangka panjang.',
      funFact: 'Antibodi tidak membunuh bakteri secara langsung, melainkan melumpuhkannya melalui netralisasi, aglutinasi, presipitasi, dan opsonisasi untuk memudahkan fagositosis.'
    },
    {
      id: 'tcell',
      name: 'Limfosit T Sitotoksik (CD8+ CTL)',
      tag: 'Imunitas Seluler Adaptif',
      icon: '⚔️',
      desc: 'Matang di kelenjar Timus. Bertugas mendeteksi dan melisiskan sel tubuh yang telah dibajak oleh virus intraseluler atau sel tumor.',
      mechanism: 'Mengenali peptida asing yang disajikan oleh molekul MHC-I pada membran sel tubuh, kemudian menembakkan Perforin (membuat pori) dan Granzyme (memicu apoptosis sel inang).',
      funFact: 'Karena virus bersembunyi di dalam sel tubuh sendiri, sel T sitotoksik harus mengorbankan sel inang yang terinfeksi demi menghentikan replikasi virion.'
    }
  ],

  viruses: [
    {
      id: 'flu',
      name: 'Virus Influenza Tipe A',
      tag: 'Famili Orthomyxoviridae • ssRNA (-) Bersegmen',
      icon: '🦠',
      desc: 'Virus pernapasan berselubung lipid (enveloped) dengan genom RNA 8 segmen. Memiliki dua glikoprotein utama pada permukaannya: Hemagglutinin (HA) dan Neuraminidase (NA).',
      mechanism: 'HA mengikat asam sialat pada reseptor sel epitel pernapasan untuk penetrasi virus, sementara NA memotong asam sialat agar virion baru dapat melepaskan diri dari sel inang.',
      funFact: 'Karena genom bersegmen, dua galur virus influenza berbeda yang menginfeksi satu sel dapat bertukar segmen (Antigenic Shift), memicu pandemi baru seperti flu babi.'
    },
    {
      id: 'covid',
      name: 'SARS-CoV-2 (Coronavirus)',
      tag: 'Famili Coronaviridae • ssRNA (+)',
      icon: '👑',
      desc: 'Virus berselubung dengan genom RNA rantai tunggal terbesar (+ sense, ~30 kb). Permukaannya dikelilingi tonjolan glikoprotein menyerupai mahkota (corona).',
      mechanism: 'Spike Glycoprotein (S) mengikat reseptor ACE2 (Angiotensin-Converting Enzyme 2) pada membran sel paru-paru, endotel, dan usus dengan bantuan protease TMPRSS2.',
      funFact: 'Reaksi inflamasi berlebihan terhadap SARS-CoV-2 dapat memicu "Badai Sitokin" (Cytokine Storm), di mana IL-6 dan TNF-α membanjiri sirkulasi darah dan merusak jaringan sehat.'
    },
    {
      id: 'rhino',
      name: 'Human Rhinovirus',
      tag: 'Famili Picornaviridae • ssRNA (+) Telanjang (Naked)',
      icon: '💎',
      desc: 'Penyebab utama lebih dari 50% kasus salesma (common cold). Memiliki struktur kapsid ikosahedral simetris tanpa selubung lipid membran luar.',
      mechanism: 'Ketiadaan selubung membran membuat rhinovirus sangat stabil dan resisten di udara kering serta permukaan benda mati, namun peka terhadap suasana asam lambung.',
      funFact: 'Rhinovirus bereplikasi optimal pada suhu 33-35°C, persis dengan suhu lingkungan rongga hidung manusia yang sedikit lebih dingin daripada suhu inti tubuh.'
    }
  ],

  bacteria: [
    {
      id: 'strep',
      name: 'Streptococcus pneumoniae (Pneumococcus)',
      tag: 'Bakteri Gram Positif • Diplokokus Berantai',
      icon: '🧫',
      desc: 'Penyebab utama pneumonia bakteri, meningitis, dan otitis media. Tumbuh berpasangan atau rantai pendek di bawah mikroskop.',
      mechanism: 'Senjata utamanya adalah Kapsul Polisakarida yang licin dan bermuatan negatif, mencegah perlekatan fagosom makrofag kecuali jika telah diselimuti antibodi atau C3b.',
      funFact: 'Percobaan legendaris Frederick Griffith tahun 1928 tentang "Prinsip Transformasi Genetik" pertama kali dibuktikan menggunakan galur Streptococcus pneumoniae berkapsul!'
    },
    {
      id: 'staph',
      name: 'Staphylococcus aureus & MRSA',
      tag: 'Bakteri Gram Positif • Tandan Kokus (Clusters)',
      icon: '🍇',
      desc: 'Bakteri komensal kulit normal yang dapat menjadi patogen ganas jika menembus luka. Galur MRSA (Methicillin-Resistant) kebal terhadap hampir semua antibiotik beta-laktam.',
      mechanism: 'Memproduksi protein A (mengikat antibodi secara terbalik di ekor Fc) dan menghasilkan biofilm polimer ekstraseluler tebal yang melindungi seluruh koloni.',
      funFact: 'Biofilm bakteri dapat meningkatkan resistensi antimikroba hingga 1.000 kali lipat dibanding bakteri planktonik yang berenang bebas!'
    },
    {
      id: 'ecoli',
      name: 'Escherichia coli (Enteropatogenik)',
      tag: 'Bakteri Gram Negatif • Basil Berflagela',
      icon: '🐛',
      desc: 'Bakteri batang dengan dinding sel tipis peptidoglikan dan membran luar yang kaya akan Lipopolisakarida (LPS / Endotoksin).',
      mechanism: 'Galur seperti EHEC O157:H7 mensekresikan Toksin Shiga yang menonaktifkan subunit ribosom 60S sel inang, menghentikan sintesis protein dan memicu kematian sel vili usus.',
      funFact: 'Lipopolisakarida (LPS) bakteri gram negatif merupakan stimulan terkuat reseptor TLR-4 sel imun, memicu demam tinggi seketika.'
    }
  ],

  nutrients: [
    {
      id: 'vitc',
      name: 'Vitamin C (Asam Askorbat)',
      tag: 'Mikronutrisi Esensial Larut Air',
      icon: '🍊',
      desc: 'Antioksidan kuat yang menetralkan spesies oksigen reaktif (ROS) berlebih hasil dari ledakan respiratori neutrofil, mencegah kerusakan jaringan inang autologus.',
      mechanism: 'Meningkatkan motilitas kemotaksis neutrofil, merangsang pembelahan limfosit, dan mendukung pemeliharaan barier epitel kulit melalui sintesis kolagen.',
      funFact: 'Konsentrasi Vitamin C di dalam leukosit manusia tercatat 50 hingga 100 kali lebih tinggi dibandingkan kadar vitamin C di dalam plasma darah bebas!'
    },
    {
      id: 'vitd',
      name: 'Vitamin D3 (Kolekalsiferol)',
      tag: 'Imunomodulator Steroid Hormon',
      icon: '☀️',
      desc: 'Bukan sekadar vitamin tulang, Vitamin D3 adalah regulator ekspresi gen imunologis utama melalui reseptor Vitamin D (VDR) di nukleus sel darah putih.',
      mechanism: 'Memicu pelepasan peptida antimikroba alami tubuh seperti Katelisidin (LL-37) dan Defensin yang dapat merusak membran bakteri patogen seketika.',
      funFact: 'Kekurangan vitamin D3 berkorelasi klinis kuat dengan kerentanan terhadap infeksi saluran pernapasan akut dan penyakit autoimun.'
    },
    {
      id: 'zinc',
      name: 'Ion Seng (Zinc / Zn2+)',
      tag: 'Kofaktor Mineral Metaloprotein',
      icon: '⚡',
      desc: 'Unsur mikro esensial yang diperlukan untuk fungsi ribuan enzim dan faktor transkripsi "Zinc-finger" dalam proliferasi sel imun.',
      mechanism: 'Secara langsung menghambat aktivitas enzim RNA-dependent RNA polymerase (RdRp) berbagai virus RNA, serta menjaga keutuhan mukosa membran seluler.',
      funFact: 'Mengonsumsi lozenges zinc dalam 24 jam pertama setelah gejala salesma terbukti secara klinis memperpendek durasi sakit hingga 33%!'
    }
  ]
};
