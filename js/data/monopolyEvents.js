// js/data/monopolyEvents.js
// Bank Kartu Event Medis & Bio-Hazard untuk Bio-Monopoly (Tanpa Emoji - 100% Vektor SVG)

const EVENT_SVGS = {
  syringe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 2l4 4-2 2-4-4 2-2zM14 6l4 4M12 8l-7 7v3h3l7-7-3-3zM3 21l3-3"/></svg>`,
  vitamin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10.5 20.5l10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7z"/><path d="M8.5 8.5l7 7"/></svg>`,
  bacteria: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="6" width="6" height="12" rx="3"/><rect x="14" y="8" width="6" height="10" rx="3"/><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="11" cy="19" r="1.5" fill="currentColor"/></svg>`,
  fastBlood: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M13 17l5-5-5-5M6 17l5-5-5-5"/></svg>`,
  storm: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  plasma: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/><path d="M12 8v8M8 12h8"/></svg>`,
  toxin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  quarantine: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="10" width="16" height="12" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4M12 14v4M9 16h6"/></svg>`
};

export const MONOPOLY_EVENTS = [
  {
    id: 'ev1',
    title: 'Suntikan Vaksinasi Booster!',
    type: 'positive',
    icon: EVENT_SVGS.syringe,
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
    icon: EVENT_SVGS.vitamin,
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
    icon: EVENT_SVGS.bacteria,
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
    icon: EVENT_SVGS.fastBlood,
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
    icon: EVENT_SVGS.storm,
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
    icon: EVENT_SVGS.plasma,
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
    icon: EVENT_SVGS.toxin,
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
    icon: EVENT_SVGS.quarantine,
    description: 'Alarm isolasi berbunyi! Pemain harus segera diperiksa ke Ruang Karantina Medis.',
    effectText: 'Pindah langsung ke Petak Karantina Medis.',
    sendToJail: true,
    apply(player, state) {
      return `${player.name} diarahkan langsung ke Ruang Karantina Medis!`;
    }
  }
];
