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
    icon: '🍊',
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
    icon: '⚡',
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
    icon: '☀️',
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
