// js/data/monopolyEvents.js
// Bank Kartu Event Medis & Bio-Hazard untuk Bio-Monopoly

export const MONOPOLY_EVENTS = [
  {
    id: 'ev1',
    title: 'Suntikan Vaksinasi Booster!',
    type: 'positive',
    icon: '💉',
    description: 'Tubuh menerima vaksinasi mRNA mutakhir. Produksi antibodi melonjak drastis di seluruh peredaran darah!',
    effectText: '+150 ATP untuk pemain.',
    apply(player, state) {
      player.atp += 150;
      return `${player.name} mendapatkan suntikan booster (+150 ATP)!`;
    }
  },
  {
    id: 'ev2',
    title: 'Konsumsi Vitamin C & Zinc!',
    type: 'positive',
    icon: '🍊',
    description: 'Inang meminum suplemen buah segar. Membran leukosit teregenerasi dan kecepatan fagosom meningkat.',
    effectText: '+100 ATP untuk pemain.',
    apply(player, state) {
      player.atp += 100;
      return `${player.name} pulih bugar dari asupan vitamin (+100 ATP)!`;
    }
  },
  {
    id: 'ev3',
    title: 'Infeksi Bakteri Nosokomial!',
    type: 'negative',
    icon: '🦠',
    description: 'Strain bakteri resisten menyusup ke aliran darah. Sistem pertahanan seluler harus menguras energi cadangan.',
    effectText: '-80 ATP untuk sterilisasi darurat.',
    apply(player, state) {
      const loss = Math.min(player.atp, 80);
      player.atp -= loss;
      return `${player.name} mengeluarkan energi membendung kuman (-${loss} ATP)!`;
    }
  },
  {
    id: 'ev4',
    title: 'Arus Aliran Darah Cepat (Vasodilatasi)!',
    type: 'positive',
    icon: '🚀',
    description: 'Pelebaran pembuluh darah arteriol memicu percepatan migrasi leukosit ke organ tujuan.',
    effectText: 'Maju 3 petak ke depan segera!',
    moveSteps: 3,
    apply(player, state) {
      return `${player.name} terdorong arus darah cepat (Maju 3 petak)!`;
    }
  },
  {
    id: 'ev5',
    title: 'Badai Sitokin (Cytokine Storm)!',
    type: 'negative',
    icon: '⚡',
    description: 'Respon hiperinflamasi menyebabkan kebingungan sinyal seluler. Sel imun terhambat bergerak.',
    effectText: 'Mundur 2 petak ke belakang.',
    moveSteps: -2,
    apply(player, state) {
      return `${player.name} terhambat badai sitokin (Mundur 2 petak)!`;
    }
  },
  {
    id: 'ev6',
    title: 'Donasi Plasma Konvalesen!',
    type: 'positive',
    icon: '🩸',
    description: 'Masuknya antibodi siap pakai dari donor plasma menetralisir racun patogen seketika.',
    effectText: '+200 ATP untuk pemain.',
    apply(player, state) {
      player.atp += 200;
      return `${player.name} menerima plasma konvalesen super (+200 ATP)!`;
    }
  },
  {
    id: 'ev7',
    title: 'Kontaminasi Toksin Bakteri!',
    type: 'negative',
    icon: '⚠️',
    description: 'Lipopolisakarida (Endotoksin) bakteri memicu reaksi peradangan demam tinggi.',
    effectText: '-100 ATP untuk detoksifikasi.',
    apply(player, state) {
      const loss = Math.min(player.atp, 100);
      player.atp -= loss;
      return `${player.name} menguras energi detoksifikasi endotoksin (-${loss} ATP)!`;
    }
  },
  {
    id: 'ev8',
    title: 'Inspeksi Karantina Medis Darurat!',
    type: 'neutral',
    icon: '🏥',
    description: 'Alarm isolasi berbunyi! Pemain harus segera diperiksa ke Ruang Karantina Medis.',
    effectText: 'Pindah langsung ke Petak Karantina Medis.',
    sendToJail: true,
    apply(player, state) {
      return `${player.name} diarahkan langsung ke Ruang Karantina Medis!`;
    }
  }
];
