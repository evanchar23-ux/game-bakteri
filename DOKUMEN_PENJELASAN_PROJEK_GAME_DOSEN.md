# DOKUMEN LAPORAN & PROPOSAL PENGEMBANGAN SISTEM
# "VIRAL SLAYER: THE MICROSCOPIC IMMUNE DEFENSE"
### Media Pembelajaran Interaktif Gamifikasi Imunologi & Mikrobiologi Berbasis WebGL 3D

---

**Identitas Proyek:**
- **Nama Permainan:** Viral Slayer: The Microscopic Immune Defense
- **Platform:** Web Application (Cross-Platform Browser-Based)
- **Teknologi Utama:** HTML5 Canvas, JavaScript (ES6+ Modules), Three.js (WebGL 3D Engine), Web Audio API, OrbitControls
- **Target Pengguna:** Mahasiswa Kedokteran/Biologi, Siswa Sekolah Menengah, serta Masyarakat Umum yang mempelajari Sistem Imun dan Patologi Mikrobiologi.

---

## DAFTAR ISI
1. [ABSTRAK / RINGKASAN EKSEKUTIF](#abstrak--ringkasan-eksekutif)
2. [BAB I: PENDAHULUAN](#bab-i-pendahuluan)
   - 1.1 Latar Belakang Masalah
   - 1.2 Rumusan Masalah
   - 1.3 Tujuan Pengembangan
   - 1.4 Manfaat Edukatif & Praktis
3. [BAB II: KONSEP PERMAINAN & GAMEPLAY MECHANICS](#bab-ii-konsep-permainan--gameplay-mechanics)
   - 2.1 Genre & Filosofi Desain
   - 2.2 Siklus Permainan (Core Game Loop)
   - 2.3 Sistem Kontrol & Antarmuka (HUD Telemetri)
   - 2.4 Sistem Peningkatan Sitokin (Cytokine Upgrade Trees)
4. [BAB III: LANDASAN SAINS & INTEGRASI IMUNOLOGI](#bab-iii-landasan-sains--integrasi-imunologi)
   - 3.1 Profil Sel Imun Pembela (Playable Biological Units)
   - 3.2 Profil Patogen & Mekanisme Virulensi (Microbial Foes & Bosses)
   - 3.3 Mikro-Lingkungan & Topografi Organ Inang
5. [BAB IV: ARSITEKTUR SISTEM & IMPLEMENTASI TEKNIS](#bab-iv-arsitektur-sistem--implementasi-teknis)
   - 4.1 Arsitektur Perangkat Lunak (Modular Architecture)
   - 4.2 Engine Rendering 3D WebGL (Three.js Integration)
   - 4.3 Engine Audio Prosedural (Web Audio API Bio-Acoustics)
   - 4.4 Engine Fisika Partikel & Deteksi Tabrakan (Collision Dynamics)
6. [BAB V: FITUR UNGGULAN & INOVASI TEKNOLOGI](#bab-v-fitur-unggulan--inovasi-teknologi)
   - 5.1 Peta Tubuh Manusia 3D Biometrik (Holographic Human Scanner)
   - 5.2 Laboratorium Bio-Chamber 3D Sel Imun Interaktif
   - 5.3 Modul Ensiklopedia Medis Digital ("Immunopedia")
   - 5.4 Cinematic Teaser & Entri Misi Sinematik
7. [BAB VI: KESIMPULAN & ARAH PENGEMBANGAN](#bab-vi-kesimpulan--arah-pengembangan)

---

## ABSTRAK / RINGKASAN EKSEKUTIF

Konsep sistem imun manusia sering kali dipersepsikan sebagai materi pembelajaran yang abstrak, kompleks, dan sulit dipahami hanya melalui diagram statis dalam buku teks. Proses seperti fagositosis makrofag, pembentukan perangkap ekstraseluler oleh neutrofil (*NETosis*), produksi antibodi spesifik oleh limfosit B, serta sitotoksisitas terarah oleh limfosit T CD8+ membutuhkan pemahaman spasial dan temporal yang mendalam.

**Viral Slayer: The Microscopic Immune Defense** hadir sebagai solusi gamifikasi media edukasi interaktif (*Serious Games*) berbasis web. Permainan ini memadukan simulasi pertempuran mikroskopis berkecepatan tinggi (*fast-paced action*) dengan prinsip-prinsip imunologi terverifikasi. Dilengkapi pemindai anatomi tubuh manusia 3D (*Three.js 3D WebGL Scanner*), bio-chamber sel imun 3D dengan membran biologis berdenyut, modul ensiklopedia digital (*Immunopedia*), serta engine audio sintetik real-time tanpa ketergantungan aset eksternal berat, aplikasi ini dapat diakses secara instan melalui peramban web modern tanpa instalasi perangkat lunak tambahan.

---

## BAB I: PENDAHULUAN

### 1.1 Latar Belakang Masalah
Dalam pendidikan biologi, kedokteran, dan kesehatan masyarakat, imunologi merupakan cabang ilmu hayati fundamental yang mempelajari cara organisme mempertahankan keutuhan biologisnya dari ancaman mikroba patogen. Namun, metode pembelajaran konvensional cenderung berfokus pada hafalan nomenklatur protein, molekul pensinyalan (sitokin), dan skema statis 2 dimensi. 

Fenomena pandemi global dan ancaman resistensi antimikroba (*Antimicrobial Resistance / AMR*) menuntut adanya pemahaman literasi imunologis yang lebih kuat di kalangan masyarakat akademik maupun umum. Pendekatan gamifikasi (*Game-Based Learning*) terbukti secara ilmiah mampu meningkatkan retensi kognitif hingga 40% lebih tinggi dibandingkan pembelajaran pasif, karena memberikan umpan balik aksi-reaksi (*cause-and-effect*) secara real-time.

### 1.2 Rumusan Masalah
1. Bagaimana merancang media pembelajaran imunologi yang akurat secara ilmiah namun tetap interaktif, menarik (*engaging*), dan mudah diakses?
2. Bagaimana memvisualisasikan interaksi spasial 3D organ tubuh manusia dan morfologi seluler mikroskopis ke dalam platform web berkinerja tinggi (*60 FPS*) tanpa memerlukan kartu grafis berkekuatan khusus?
3. Bagaimana menyusun sistem progresi permainan yang merefleksikan proses adaptasi biologis tubuh manusia nyata (seperti regulasi sitokin, fagositosis, dan opsonisasi)?

### 1.3 Tujuan Pengembangan
- Mengembangkan media permainan edukatif berbasis web yang mengilustrasikan mekanisme kerja sistem imun bawaan (*innate immunity*) dan sistem imun adaptif (*adaptive immunity*).
- Mengintegrasikan teknologi visualisasi 3D WebGL interaktif untuk pemindaian organ inang dan inspeksi sitologi sel imun.
- Menyediakan materi edukasi terstruktur melalui fitur ensiklopedia digital terintegrasi (*Immunopedia*) yang menjelaskan klasifikasi sel, patogen, organ, dan bioterapi.

### 1.4 Manfaat Edukatif & Praktis
- **Bagi Mahasiswa/Pelajar:** Mempermudah visualisasi proses biologi seluler mikro, memahami peran antibodi, dan mengetahui karakteristik patogen spesifik (SARS-CoV-2, MRSA, *E. coli*).
- **Bagi Dosen/Pengajar:** Dapat digunakan sebagai instrumen simulasi laboratorium interaktif (*virtual biology lab demonstration*) dalam proses perkuliahan atau tugas praktikum.
- **Bagi Institusi & Teknologi:** Memperlihatkan pemanfaatan teknologi Web Standards (HTML5, Vanilla CSS, Three.js) untuk pengembangan aplikasi simulasi ilmiah yang efisien, responsif, dan bebas hambatan instalasi (*zero-friction deployment*).

---

## BAB II: KONSEP PERMAINAN & GAMEPLAY MECHANICS

### 2.1 Genre & Filosofi Desain
Permainan ini mengusung genre **Microscopic Bio-Action Survival RPG**. Pemain berperan langsung sebagai komandan sel imun spesifik yang dikerahkan ke dalam jaringan organ tubuh yang tengah mengalami invasi mikroba akut. Filosofi desain mengedepankan akurasi terminologi medis (*scientific rigor*) yang dibalut mekanisme permainan adiktif, di mana setiap variabel permainan (HP, Kecepatan, ATP, Efek Skill) mencerminkan parameter biokimia nyata.

### 2.2 Siklus Permainan (Core Game Loop)
1. **Pemilihan Sel Imun (3D Bio-Chamber):** Pemain menyeleksi unit imun berdasarkan karakteristik taktis (Makrofag, Neutrofil, Limfosit B, atau Limfosit T).
2. **Pemindaian & Pemilihan Organ (3D Biometric Body Scanner):** Pemain memutar tubuh manusia 3D dan memilih zona infeksi (Paru-Paru, Pembuluh Darah, Usus, atau Kulit).
3. **Pengerahan Sinematik (Cinematic Entrance Protocol):** Menampilkan animasi pengerahan sitokin dan taklimat misi (*mission briefing*) mengenai bahaya lingkungan lokal.
4. **Pertempuran Mikroskopis Multi-Gelombang:** Pemain bermanuver di lingkungan jaringan organ, membasmi gelombang patogen dengan serangan dasar, skill taktis, dan bio-ultimatum.
5. **Pengumpulan Energi ATP & Fagositosis:** Patogen yang tereliminasi menjatuhkan molekul ATP dan fragmen antigen yang dapat diserap untuk regenerasi.
6. **Regulasi Sitokin (Level Up Evolution):** Saat titer antigen terpenuhi, pemain memilih mutasi adaptif sitokin (*Interleukin, Interferon, Opsonin*).
7. **Konfrontasi Puncak (Boss Battle):** Menghadapi koloni patogen mutan (seperti *SARS-CoV-2 Supercluster* atau *MRSA Biofilm Nexus*).
8. **Debriefing & Evaluasi Medis:** Menampilkan ringkasan CFU (*Colony Forming Units*) yang dibersihkan, efisiensi fagositosis, dan ulasan ilmiah.

### 2.3 Sistem Kontrol & Antarmuka (HUD Telemetri)
- **Navigasi:** Tombol `W, A, S, D` atau `Tombol Panah` untuk pergerakan sel imun dalam fluida tubuh.
- **Arah Serangan:** Kursor Mouse (bidikan 360 derajat terarah).
- **Serangan Dasar (Basic Attack):** Klik Kiri Mouse / Spasi.
- **Skill Taktis (Tactical Skill):** Tombol `Spasi` (Konsumsi ATP terukur).
- **Bio-Ultimatum (Ultimate Burst):** Tombol `Q` atau `E` (Serangan area katastropik berskala luas).
- **HUD Biometrik:** Bar Integritas Membran (HP), Bar Energi Seluler (ATP), Bar Progresi Antigen (EXP), Indikator CFU Tereliminasi, dan Radar Gelombang Musuh.

### 2.4 Sistem Peningkatan Sitokin (Cytokine Upgrade Trees)
Sistem *level up* dalam permainan didasarkan pada pelepasan molekul sinyal biologis:
- **Interferon-Gamma (IFN-γ):** Meningkatkan efisiensi fagositosis dan damage sebesar 25%.
- **Interleukin-2 (IL-2):** Mempercepat proliferasi sel dan mobilitas kecepatan gerak.
- **Kaskade Komplemen (C3b Opsonin):** Menandai patogen sehingga serangan memiliki peluang *Critical Hit* lebih tinggi.
- **Enzim Lisosom & Perforin:** Memperlebar radius semburan kimiawi perusak dinding peptidoglikan bakteri.

---

## BAB III: LANDASAN SAINS & INTEGRASI IMUNOLOGI

### 3.1 Profil Sel Imun Pembela (Playable Biological Units)

| Nama Sel | Klasifikasi | Keunggulan Spesifik | Mekanisme Biologis Nyata |
| :--- | :--- | :--- | :--- |
| **Makrofag** *(Macrophage)* | Imunitas Bawaan *(Innate)* | HP Tinggi, Fagositosis Jarak Dekat, Semburan Nitrat Oksida (NO) | Sel fagositik jaringan yang menjulurkan pseudopodia untuk menelan debris, menyajikan antigen via molekul MHC-II. |
| **Neutrofil** *(Neutrophil)* | Garis Depan *(First Responder)* | Tembakan Cepat Proyektil Granula, Perangkap Jaring NETs | Granulosit terbanyak dalam sirkulasi; meluncurkan enzim defensin dan jaring kromatin beracun (*NETosis*) untuk mengunci kuman. |
| **Limfosit B** *(B-Lymphocyte)* | Imunitas Adaptif *(Adaptive)* | Penanda Opsonisasi, Aglutinasi Berantai, Satelit Antibodi | Memproduksi imunoglobulin spesifik (IgG, IgM) yang mengikat epitop antigen dan memicu presipitasi patogen. |
| **Limfosit T CD8+** *(Cytotoxic T)* | Sel Pembunuh *(Assassin)* | Kerusakan Kritis Sangat Tinggi, Induksi Lisis Apoptosis | Mengidentifikasi sel inang yang terinfeksi dan mengekskresi perforin serta granzim untuk merusak membran patogen. |

### 3.2 Profil Patogen & Mekanisme Virulensi (Microbial Foes & Bosses)
1. **SARS-CoV-2 (Variant Aerosol):** Menggunakan protein paku (*spike glycoprotein*) untuk menempel pada reseptor ACE2 sel pernapasan. Menyerang dengan kecepatan tinggi dan memicu badai sitokin.
2. **Streptococcus pneumoniae:** Bakteri diplokokus gram-positif berkapsul polisakarida tebal yang memperlambat laju fagositosis inang.
3. **Escherichia coli (Enterotoksigenik):** Bakteri basil berflagela yang menyuntikkan enterotoksin labil, bergerak lincah di saluran pencernaan.
4. **Staphylococcus aureus (MRSA Biofilm):** Patogen nosokomial dengan resistensi multiobat yang mampu membentuk lapisan lendir polimer (*biofilm matrix*) berdaya tahan ekstrem.
5. **Bosses Spesifik:**
   - *SARS-CoV-2 Supercluster (Spike Variant)*
   - *E. coli Biofilm Colony (Shiga-like Toxin)*
   - *MRSA Biofilm Nexus (Resistan Multiobat)*

### 3.3 Mikro-Lingkungan & Topografi Organ Inang
Permainan menyimulasikan 4 organ dengan dinamika bio-fisika berbeda:
- **Pulmo (Paru-Paru):** Lingkungan aerosol bertegangan permukaan alveolus tinggi dengan bahaya *hypoxia*.
- **Vaskulatur (Pembuluh Darah):** Aliran turbulensi hemodinamik darah dengan arus red blood cells (eritrosit) mengalir.
- **Usus (Saluran Pencernaan):** Zona asam-basa dinamis dengan populasi mikrobiota dan mucus barrier tebal.
- **Dermis (Lapisan Kulit):** Matriks keratin padat dengan paparan mikroba eksternal akibat trauma robekan terbuka.

---

## BAB IV: ARSITEKTUR SISTEM & IMPLEMENTASI TEKNIS

### 4.1 Arsitektur Perangkat Lunak (Modular Architecture)
Kode aplikasi dirancang menggunakan pola berorientasi objek murni (*ES6 Object-Oriented Modules*) tanpa dependensi *framework* yang membebani memori browser. Struktur direktori terbagi rapi:
```text
GAME BAKTERI/
├── index.html                 # Struktur Antarmuka Utama & HUD Canvas
├── css/
│   └── style.css              # Sistem Desain Glassmorphism & Cyber-Medical UI
├── js/
│   ├── game.js                # Core Game Loop, State Management, & UI Wiring
│   ├── audio/
│   │   └── sound.js           # Engine Sintesis Audio Prosedural (Web Audio API)
│   ├── data/
│   │   ├── cells.js           # Parameter Statistik & Skill Sel Imun
│   │   ├── pathogens.js       # Variabel Virulensi & AI Wave Patogen
│   │   ├── organs.js          # Konfigurasi Peta Organ & Karakteristik Biohazard
│   │   ├── upgrades.js        # Pohon Sitokin & Peningkatan Molekuler
│   │   └── immunopediaData.js # Basis Data Ensiklopedia Sains Terverifikasi
│   ├── engine/
│   │   ├── camera.js          # Dynamic Viewport Tracking & Screen Shake
│   │   ├── cell3d.js          # 3D Microscopic Cell Bio-Chamber Engine (Three.js)
│   │   ├── hologram3d.js      # 3D Biometric Human Body Scanner Engine (Three.js)
│   │   ├── input.js           # Mouse & Keyboard Event Dispatcher
│   │   ├── particles.js       # High-Performance Biological Particle System
│   │   ├── renderer.js        # 2D Canvas Cellular Battlefield Renderer
│   │   └── teaser.js          # Cinematic Trailer Canvas Animation
│   ├── entities/              # Kelas Entitas: Player, Pathogen, Projectile, Pickup
│   └── libs/                  # Pustaka Inti Lokal: three.min.js, OrbitControls, GLTFLoader
└── assets/                    # Model 3D GLTF (.glb) & Aset Grafis Pendukung
```

### 4.2 Engine Rendering 3D WebGL (Three.js Integration)
- **Zero Black-Box Transparency:** WebGLRenderer dikonfigurasi dengan parameter `alpha: true` dan `setClearColor(0x000000, 0)` sehingga kanvas 3D membaur transparan 100% dengan latar grid antarmuka tanpa kotak hitam.
- **Model Tubuh Manusia Asli:** Memuat model 3D manusia utuh (*ReadyPlayerMe / Michelle Humanoid Mesh*) dengan material kaca holografis biometrik (*custom MeshStandardMaterial*) yang menampilkan organ internal (jantung berdetak, paru-paru berpasangan, usus meliuk, dan otak bercahaya).
- **Projeksi Vektor 3D ke Layar 2D:** Menggunakan rumus transformasi koordinat spasial:
  $$\vec{v}_{screen} = \text{project}(\vec{v}_{3D}, \text{Camera})$$
  Titik hotspot SVG interaktif (`PULMO`, `VASKULAR`, `USUS`, `DERMIS`) menempel akurat pada koordinat 3D organ dalam tubuh dan meredup secara cerdas saat berada di sisi posterior (punggung).
- **Bio-Chamber Sel Imun 3D Prosedural (`cell3d.js`):** Menghasilkan deformasi membran organik secara dinamis dengan gelombang trigonometri (*Simplex/Sine Noise Displacement*), organel bergerak, granula bersirkulasi, serta cincin partikel sitokin.

### 4.3 Engine Audio Prosedural (Web Audio API Bio-Acoustics)
Aplikasi tidak menggunakan rekaman audio statis `.mp3` atau `.wav` eksternal yang lambat dimuat. Sebaliknya, seluruh efek suara disintesis secara matematika menggunakan **Web Audio API**:
- **Osilator Sintesis (`OscillatorNode`):** Gelombang *sine*, *triangle*, dan *sawtooth* untuk suara tembakan granula, sengatan antibodi, dan denyut sonar.
- **Rangkaian Filter Biquad (`BiquadFilterNode`):** Memotong frekuensi tinggi (*Low-Pass Filter*) untuk menyimulasikan sensasi suara teredam di dalam fluida cairan tubuh (*viscous fluid acoustics*).
- **Detak Jantung Dinamis:** Sintesis frekuensi rendah 55Hz–110Hz dengan peluruhan eksponensial (*exponential decay*) yang berdenyut selaras dengan status kesehatan inang.

### 4.4 Engine Fisika Partikel & Deteksi Tabrakan
- Mendukung pembaruan hingga 600+ partikel simultan dengan alokasi memori terkontrol (*particle pooling*).
- Deteksi tabrakan presisi lingkaran (*Circular Bounding Collision*) dan deteksi orientasi sudut arah (*atan2 angle trajectory*) untuk proyektil terarah.

---

## BAB V: FITUR UNGGULAN & INOVASI TEKNOLOGI

### 5.1 Peta Tubuh Manusia 3D Biometrik (Holographic Human Scanner)
Pemain tidak sekadar memilih level dari menu biasa, melainkan berinteraksi langsung dengan pemindai biometrik 3D:
- **Rotasi Bebas Multi-Aksis:** Mendukung perputaran 360° horizontal (*yaw*) dan vertikal (*pitch / atas-bawah*) sehingga tubuh dapat diinspeksi dari atas kepala hingga telapak kaki.
- **Inspeksi Organ Dalam:** Jantung yang berdenyut dengan pendaran cahaya merah, lobus paru-paru yang bernapas, saluran usus neon, serta sensor dermal.
- **Kontrol Fleksibel:** Kompatibel dengan *mouse drag*, *touch drag* pada gawai layar sentuh, serta tombol navigasi taktis dock (`◀ KIRI`, `▶ KANAN`, `▲ ATAS`, `▼ BAWAH`, `⟲ RESET`, `🔄 AUTO ORBIT`).

### 5.2 Laboratorium Bio-Chamber 3D Sel Imun Interaktif
Pada menu pemilihan karakter, pemain disajikan pod kontensi biologi mikroskopis 3D:
- Sel berukuran riil (magnifikasi 12.500x virtual) mengambang bebas di dalam tabung laser pemindai.
- Membran Makrofag bergerak aktif meregangkan pseudopodia ameboid.
- Neutrofil memperlihatkan lobus nukleus polimorfik dan pusaran granula aktif.
- Limfosit B memamerkan jajaran antibodi Y dan satelit imunoglobulin yang mengorbit.
- Limfosit T menonjolkan duri perforin mematikan dengan retikel bidik pemusnah.

### 5.3 Modul Ensiklopedia Medis Digital ("Immunopedia")
Menyediakan bank pengetahuan sains yang dapat dibuka sewaktu-waktu:
- **Kategori Seluler:** Penjelasan sitologi, fungsi fagositosis, dan penanda membran (MHC, TCR, BCR).
- **Kategori Patologi:** Taksonomi mikroba, struktur virus asam nukleat, dan faktor virulensi bakteri.
- **Kategori Anatomi Organ:** Struktur histologi alveolus, endotel pembuluh darah, vili usus, dan dermis.
- **Kategori Terapi Sitokin:** Mekanisme kerja vaksinasi, terapi antibodi monoklonal, dan pencegahan sepsis.

### 5.4 Cinematic Teaser & Entri Misi Sinematik
Dilengkapi mode pengenalan sinematik bertema fiksi ilmiah medis lengkap dengan bilah letterbox *widescreen*, pemindaian hologram, dan narasi misi taktis sebelum pemain memasuki arena pertarungan.

---

## BAB VI: KESIMPULAN & ARAH PENGEMBANGAN

### 6.1 Kesimpulan
**Viral Slayer: The Microscopic Immune Defense** berhasil membuktikan bahwa topik sains yang kompleks seperti imunologi dan mikrobiologi dapat ditransformasikan menjadi media pembelajaran interaktif yang imersif, estetis, dan mendidik. Pemanfaatan teknologi WebGL 3D modern membuktikan bahwa grafis berkualitas tinggi dapat dihadirkan secara ringan dan instan langsung di peramban tanpa memerlukan kompilasi rumit ataupun spesifikasi komputer yang tinggi.

### 6.2 Arah Pengembangan Selanjutnya
1. **Mode Multi-Pemain (Cooperative Immunity Mode):** Kolaborasi real-time antara 2 pemain (misal: Makrofag bertindak sebagai tank fagositik, sementara Limfosit B menembakkan antibodi dari jarak jauh).
2. **Visualisasi Sistem Limfatik Lengkap:** Memperluas peta tubuh manusia 3D hingga mencakup kelenjar getah bening (*lymph nodes*), limpa (*spleen*), dan timus (*thymus gland*).
3. **Integrasi Kuis Formatif Akademik:** Menambahkan mode asesmen evaluasi belajar dengan pertanyaan klinis adaptif untuk keperluan ujian mahasiswa kedokteran/biologi.

---

**Penyusun Proyek:** Tim Pengembang *Viral Slayer: The Microscopic Immune Defense*  
**Dokumen Disiapkan Untuk:** Pengajuan Sidang Proyek / Evaluasi Dosen Pembimbing & Penguji
