/**
 * K Devil Hunter - Character Data
 *
 * Contains predefined playable characters with their base stats.
 * Stats are based on in-game character stat tabs.
 */

const CHARACTERS = [
  {
    id: "kael",
    name: "Kael",
    title: "Shadow Blade",
    type: "Attacker",
    element: "Dark",
    level: 1,
    baseStats: {
      hp: 1200,
      atk: 320,
      def: 180,
      spd: 95,
      critRate: 15,
      critDmg: 150,
    },
  },
  {
    id: "lyra",
    name: "Lyra",
    title: "Holy Sentinel",
    type: "Tank",
    element: "Light",
    level: 1,
    baseStats: {
      hp: 2400,
      atk: 210,
      def: 380,
      spd: 75,
      critRate: 8,
      critDmg: 130,
    },
  },
  {
    id: "zephyr",
    name: "Zephyr",
    title: "Storm Dancer",
    type: "Speedster",
    element: "Wind",
    level: 1,
    baseStats: {
      hp: 1000,
      atk: 280,
      def: 140,
      spd: 140,
      critRate: 22,
      critDmg: 175,
    },
  },
  {
    id: "mordia",
    name: "Mordia",
    title: "Flame Witch",
    type: "Mage",
    element: "Fire",
    level: 1,
    baseStats: {
      hp: 900,
      atk: 410,
      def: 120,
      spd: 88,
      critRate: 18,
      critDmg: 200,
    },
  },
  {
    id: "rex",
    name: "Rex",
    title: "Iron Fist",
    type: "Brawler",
    element: "Earth",
    level: 1,
    baseStats: {
      hp: 1800,
      atk: 290,
      def: 260,
      spd: 82,
      critRate: 10,
      critDmg: 140,
    },
  },
  {
    id: "sylvana",
    name: "Sylvana",
    title: "Thornweaver",
    type: "Support",
    element: "Nature",
    level: 1,
    baseStats: {
      hp: 1100,
      atk: 190,
      def: 200,
      spd: 105,
      critRate: 12,
      critDmg: 135,
    },
  },
];

/**
 * Stat growth per level for each character type.
 * These multipliers are applied to base stats when leveling up.
 */
const LEVEL_GROWTH = {
  Attacker: { hp: 60, atk: 18, def: 8, spd: 1.5 },
  Tank: { hp: 120, atk: 10, def: 20, spd: 0.8 },
  Speedster: { hp: 50, atk: 15, def: 6, spd: 3 },
  Mage: { hp: 45, atk: 22, def: 5, spd: 1.2 },
  Brawler: { hp: 90, atk: 14, def: 14, spd: 1 },
  Support: { hp: 55, atk: 8, def: 10, spd: 2 },
};

/**
 * Returns scaled stats for a character at a given level.
 * @param {Object} character - Character object
 * @param {number} level - Target level (1–100)
 * @returns {Object} Scaled stats
 */
function getStatsAtLevel(character, level) {
  const growth = LEVEL_GROWTH[character.type];
  const lvlBonus = Math.max(0, level - 1);
  return {
    hp: Math.round(character.baseStats.hp + growth.hp * lvlBonus),
    atk: Math.round(character.baseStats.atk + growth.atk * lvlBonus),
    def: Math.round(character.baseStats.def + growth.def * lvlBonus),
    spd: Math.round(character.baseStats.spd + growth.spd * lvlBonus),
    critRate: character.baseStats.critRate,
    critDmg: character.baseStats.critDmg,
  };
}
