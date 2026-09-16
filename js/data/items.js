/**
 * items.js
 * Item Nutrisi, Molekul Bio-Energi, dan Drop yang dijatuhkan di dalam cairan tubuh.
 */

export const PICKUP_TYPES = {
  atp_orb: {
    id: 'atp_orb',
    name: 'Adenosin Trifosfat (ATP)',
    color: '#ffaa00',
    glowColor: 'rgba(255, 170, 0, 0.6)',
    radius: 7,
    value: 25,
    type: 'atp',
    sound: 'pickup_atp',
    apply: (player) => {
      player.atp = Math.min(player.stats.atpMax, player.atp + 25);
    }
  },

  cytokine_drop: {
    id: 'cytokine_drop',
    name: 'Tetesan Sitokin (EXP)',
    color: '#00f2fe',
    glowColor: 'rgba(0, 242, 254, 0.6)',
    radius: 6,
    value: 18,
    type: 'exp',
    sound: 'pickup_exp',
    apply: (player, game) => {
      game.addExp(18);
    }
  },

  amino_acid: {
    id: 'amino_acid',
    name: 'Asam Amino Komplet',
    color: '#00ff88',
    glowColor: 'rgba(0, 255, 136, 0.6)',
    radius: 8,
    value: 80,
    type: 'heal',
    sound: 'pickup_heal',
    apply: (player) => {
      player.hp = Math.min(player.stats.maxHp, player.hp + 80);
    }
  },

  vitamin_c: {
    id: 'vitamin_c',
    name: 'Asam Askorbat (Vitamin C)',
    color: '#ffd166',
    glowColor: 'rgba(255, 209, 102, 0.8)',
    radius: 10,
    duration: 15,
    type: 'buff',
    icon: '<svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="9"/><path d="M12 3v18"/><path d="M3 12h18"/></svg>',
    sound: 'pickup_buff',
    desc: '-30% Cooldown Skill',
    apply: (player, game) => {
      game.applyBuff('vitamin_c', 'Vitamin C (Cooldown -30%)', 15, () => {
        player.cooldownReduction = 0.3;
      }, () => {
        player.cooldownReduction = 0;
      });
    }
  },

  zinc: {
    id: 'zinc',
    name: 'Ion Zink (Zn2+)',
    color: '#b8c0ff',
    glowColor: 'rgba(184, 192, 255, 0.8)',
    radius: 10,
    duration: 10,
    type: 'buff',
    icon: '<svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    sound: 'pickup_buff',
    desc: 'Virus Freeze / Replikasi Terhenti',
    apply: (player, game) => {
      game.applyBuff('zinc', 'Ion Seng (Inhibitor RNA-Pol)', 10, () => {
        game.freezeViruses = true;
      }, () => {
        game.freezeViruses = false;
      });
    }
  },

  vitamin_d3: {
    id: 'vitamin_d3',
    name: 'Kolekalsiferol (Vitamin D3)',
    color: '#ff99c8',
    glowColor: 'rgba(255, 153, 200, 0.8)',
    radius: 10,
    duration: 15,
    type: 'buff',
    icon: '<svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
    sound: 'pickup_buff',
    desc: '+25 Armor & Barrier Integritas',
    apply: (player, game) => {
      game.applyBuff('vitamin_d3', 'Vitamin D3 (Armor +25)', 15, () => {
        player.stats.armor += 25;
      }, () => {
        player.stats.armor -= 25;
      });
    }
  }
};
