/**
 * K Devil Hunter - Game & Character Data
 *
 * Character stats are based on the actual in-game "Detailed Stats" screen.
 * "Marcello" is the player's in-game name; the character type is Demon Hunter.
 * Screenshots were taken at Lv.275, Sect: 4TheWin, Server: Global.
 *
 * Stat categories mirror the in-game tabs:
 *   Honing → Mastery → Equipment → Skill Collection → Buff →
 *   Blood Energy → Promotion → Monster Collection
 */

/** Links to the game on official storefronts */
const GAME_LINKS = {
  pocketgamer: "https://www.pocketgamer.com/k-devil-hunter/out-now/",
  googlePlay:  "https://play.google.com/store/apps/details?id=com.codedragon.kdemon",
  appStore:    "https://apps.apple.com/se/app/k-devil-hunter/id6757422245",
};

/**
 * Example character stats extracted from the in-game screenshots.
 * Values are from Marcello's "Detailed Stats" panel at Lv.275.
 *
 * All percentage values are stored as plain numbers (e.g. 100 = 100%).
 * Flat values are stored as their full integer (e.g. 30050 = 30K 50).
 */
const CHARACTER_STATS = {
  name: "Demon Hunter",
  level: 275,
  sect: "4TheWin",
  server: "Global",

  /**
   * Honing – core combat stats gained through levelling and hunting.
   */
  honing: {
    baseAtk:               30050,
    critRate:              100,    // %
    critDmg:               1000,   // %
    ultraCritRate:         41,     // %
    ultraCritDmg:          382,    // %
    atkSpdIncrease:        93,     // %
    baseHp:                601000,
    recoveryOnAutoAttack:  150300,
    brassCoinGainIncrease: 510,    // %
    expGainIncrease:       520,    // %
  },

  /**
   * Mastery – bonus stats from grinding mastery levels.
   */
  mastery: {
    atkIncrease:              2000, // %
    hpIncrease:               790,  // %
    recoveryIncrease:         0,    // %
    weaponDropRateIncrease:   0,    // %
    robeDropRateIncrease:     0,    // %
    ringDropRateIncrease:     0,    // %
    moneyPouchDropRateIncrease: 0,  // %
  },

  /**
   * Equipment – stats contributed by equipped gear.
   */
  equipment: {
    atkIncrease:             675,   // %
    hpIncrease:              170,   // %
    recoveryIncrease:        137.5, // %
    baseAtk:                 15800,
    baseHp:                  160000,
    recoveryOnAutoAttack:    34000,
    brassCoinGainIncrease:   123.8, // %
    expGainIncrease:         123.8, // %
  },

  /**
   * Skill Collection – bonuses unlocked via the skill collection system.
   */
  skillCollection: {
    physicalDmgIncrease:  60,  // %
    magicDmgIncrease:     50,  // %
    fireDmgIncrease:      50,  // %
    waterDmgIncrease:     50,  // %
    windDmgIncrease:      50,  // %
    lightningDmgIncrease: 50,  // %
    earthDmgIncrease:     50,  // %
    hpIncrease:           220, // %
    recoveryIncrease:     200, // %
  },

  /**
   * Buff – additional bonuses from buff items and upgrades.
   */
  buff: {
    additionalSpellDmg:    0,   // %
    additionalTalismanDmg: 0,   // %
    additionalSpiritDmg:   0,   // %
    atkIncrease:           205, // %
    brassCoinGainIncrease: 205, // %
    recoveryIncrease:      410, // %
    additionalSkinDmg:     5,   // %
    baseAtkFlat:           310,
    additionalAtkIncrease: 4,   // %
    additionalDmg:         10,  // %
    additionalPhysicalDmg: 28.6,// %
    additionalMagicDmg:    28.6,// %
    additionalFireDmg:     28.6,// %
    additionalWaterDmg:    38.2,// %
  },

  /**
   * Blood Energy – bonuses from the Blood Energy upgrade system.
   */
  bloodEnergy: {
    atkIncrease:   90, // %
    magicDmg:       5, // %
  },

  /**
   * Promotion – bonuses from character promotion upgrades.
   */
  promotion: {
    hpIncrease:         375, // %
    atkIncrease:        142.8,// %
    recoveryIncrease:   50,  // %
  },

  /**
   * Monster Collection – bonuses from collecting monsters.
   */
  monsterCollection: {
    hpIncrease:        51.3,  // %
    recoveryIncrease:  162.8, // %
  },
};

/**
 * Returns the effective (total) ATK for the character, combining
 * the Honing base ATK with all flat bonuses and percentage multipliers.
 *
 * Simplified formula used for the damage calculator:
 *   effectiveAtk = (honingBaseAtk + equipmentBaseAtk + buffBaseAtkFlat)
 *                  × (1 + totalAtkIncrease / 100)
 *
 * @returns {number} Effective ATK value
 */
function getEffectiveAtk() {
  const s = CHARACTER_STATS;
  const flatAtk = s.honing.baseAtk + s.equipment.baseAtk + s.buff.baseAtkFlat;
  const totalAtkPct =
    s.mastery.atkIncrease +
    s.equipment.atkIncrease +
    s.buff.atkIncrease +
    s.buff.additionalAtkIncrease +
    s.bloodEnergy.atkIncrease +
    s.promotion.atkIncrease;
  return Math.round(flatAtk * (1 + totalAtkPct / 100));
}

/**
 * Returns the effective (total) HP.
 *
 * @returns {number} Effective HP value
 */
function getEffectiveHp() {
  const s = CHARACTER_STATS;
  const flatHp = s.honing.baseHp + s.equipment.baseHp;
  const totalHpPct =
    s.mastery.hpIncrease +
    s.equipment.hpIncrease +
    s.skillCollection.hpIncrease +
    s.promotion.hpIncrease +
    s.monsterCollection.hpIncrease;
  return Math.round(flatHp * (1 + totalHpPct / 100));
}
