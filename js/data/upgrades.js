/**
 * upgrades.js
 * Pilihan Peningkatan Diferensiasi Sitokin / Mutasi Imunologis
 * Muncul saat pemain naik level di dalam run (3 pilihan acak).
 */

export const CYTOKINE_UPGRADES = [
  {
    id: 'interferon_alpha',
    title: 'Interferon Tipe I (IFN-α/β)',
    icon: '<svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    type: 'antiviral',
    effectDesc: '+25% Damage vs Virus & Mengurangi Kecepatan Virus 20%',
    lore: 'Sitokin antivirus krusial yang menginduksi status antiviral pada sel-sel inang di sekitarnya.',
    apply: (player) => {
      player.virusDamageBonus = (player.virusDamageBonus || 1) + 0.25;
      player.virusSlowAura = true;
    }
  },
  {
    id: 'chemokine_il8',
    title: 'Kemokin Kemotaksis (IL-8)',
    icon: '⚡',
    type: 'speed_ally',
    effectDesc: '+20% Kecepatan Gerak & Memanggil 1 Neutrofil Pembantu',
    lore: 'Interleukin-8 adalah kemoatraktan kuat yang memanggil rekrutmen leukosit ke situs infeksi.',
    apply: (player, game) => {
      player.stats.speed *= 1.2;
      if (game) game.spawnAlliedDrone();
    }
  },
  {
    id: 'complement_mac',
    title: 'Komplemen Jalur Lisis (MAC)',
    icon: '💥',
    type: 'damage',
    effectDesc: 'Semua Serangan Mengabaikan Armor Bakteri & +15% Damage',
    lore: 'Membrane Attack Complex (C5b-C9) melubangi membran luar bakteri patogen secara langsung.',
    apply: (player) => {
      player.ignoreArmor = true;
      player.damageMultiplier = (player.damageMultiplier || 1) + 0.15;
    }
  },
  {
    id: 'hypermutation',
    title: 'Hipermutasi Somatik (SHM)',
    icon: '<svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M4 22c3.5-1.5 6.5-6.5 9-11 2.5-4.5 5.5-9 9-10.5"/><path d="M4 2c3.5 1.5 6.5 6.5 9 11 2.5 4.5 5.5 9 9 10.5"/><path d="M7.5 12.5l9-9"/><path d="M10.5 15.5l7-7"/><path d="M4.5 6.5l4-4"/><path d="M6 9.5l6-6"/><path d="M18 14.5l-6 6"/><path d="M15 17.5l-4 4"/><path d="M19.5 11.5l-9 9"/></svg>',
    type: 'crit',
    effectDesc: '+15% Critical Chance & +50% Critical Damage',
    lore: 'Mekanisme seluler adaptif yang memodifikasi gen antibodi untuk menghasilkan afinitas antigen maksimal.',
    apply: (player) => {
      player.stats.critChance += 0.15;
      player.stats.critMult += 0.50;
    }
  },
  {
    id: 'lysozyme_enhancer',
    title: 'Lisozim Konsentrasi Tinggi',
    icon: '🧪',
    type: 'antibacterial',
    effectDesc: '+35% Kerusakan terhadap Seluruh Spesies Bakteri',
    lore: 'Enzim yang memecah ikatan beta-1,4 glikosidik antara asam N-asetilmuramat dan N-asetilglukosamin pada peptidoglikan.',
    apply: (player) => {
      player.bacteriaDamageBonus = (player.bacteriaDamageBonus || 1) + 0.35;
    }
  },
  {
    id: 'respiratory_ros',
    title: 'NADPH Oksidase Hiperaktif',
    icon: '☢️',
    type: 'burst',
    effectDesc: 'Serangan meninggalkan bercak Radikal Bebas (ROS) beracun selama 3 detik',
    lore: 'Produksi anion superoksida yang sangat reaktif untuk membunuh mikroba intraseluler.',
    apply: (player) => {
      player.leavesROSPatch = true;
    }
  },
  {
    id: 'phagolysosome_acid',
    title: 'Asidifikasi Fagolisosom',
    icon: '❤️',
    type: 'heal',
    effectDesc: '+50% Pemulihan HP dari Kills & +150 Max HP',
    lore: 'Penurunan pH vakuola fagositik hingga 4.5 untuk mengoptimalkan kinerja hidrolase asam.',
    apply: (player) => {
      player.stats.maxHp += 150;
      player.hp = Math.min(player.stats.maxHp, player.hp + 150);
      player.killHealBonus = (player.killHealBonus || 1) + 0.5;
    }
  },
  {
    id: 'antioxidant_shield',
    title: 'Glutation & Barrier Seluler',
    icon: '🔰',
    type: 'defense',
    effectDesc: 'Mendapatkan Barrier Pelindung yang Menyerap 120 Kerusakan tiap 12 detik',
    lore: 'Antioksidan tripeptida utama yang melindungi membran sel imun dari lisis autologus.',
    apply: (player) => {
      player.hasRegenShield = true;
      player.shieldMax = 120;
      player.shield = 120;
    }
  }
];

