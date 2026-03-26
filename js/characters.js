/**
 * K Devil Hunter - Game & Character Data
 *
 * Character stats are based on the actual in-game "Detailed Stats" screen.
 * "Marcello" is the player's in-game name; the character type is Demon Hunter.
 * Screenshots were taken at Lv.275, Sect: 4TheWin, Server: Global.
 *
 * Stat categories mirror the in-game tabs:
 *   Honing → Mastery → Herb → Equipment → Skill Collection → Buff →
 *   Blood Energy → Promotion → Trait → Inner Core → Offering →
 *   Skill → Monster Collection
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
   * Herb – stat bonuses obtained through the Herb system.
   */
  herb: {
    atkIncrease:                0, // %
    hpIncrease:                 0, // %
    recoveryIncrease:           0, // %
    additionalDmg:              0, // %
    additionalDmgToBoss:        0, // %
    additionalDmgToNormal:      0, // %
    additionalPhysicalDmg:      0, // %
    additionalMagicDmg:         0, // %
    additionalFireDmg:          0, // %
    additionalWaterDmg:         0, // %
    additionalWindDmg:          0, // %
    additionalLightningDmg:     0, // %
    additionalEarthDmg:         0, // %
    brassCoinGainIncrease:      0, // %
    expGainIncrease:            0, // %
    weaponDropRateIncrease:     0, // %
    robeDropRateIncrease:       0, // %
    ringDropRateIncrease:       0, // %
    moneyPouchDropRateIncrease: 0, // %
  },

  /**
   * Blood Energy – bonuses from the Blood Energy upgrade system.
   * Each promotion unlock lets you roll up to 8 stat lines from the pool below.
   * Enter the total accumulated value for each stat type.
   */
  bloodEnergy: {
    baseAtk:               0,
    atkIncrease:           90, // %
    additionalDmg:          0, // %
    additionalDmgToBoss:    0, // %
    additionalDmgToNormal:  0, // %
    additionalDmgToRealm:   0, // %
    baseHp:                 0,
    hpIncrease:             0, // %
    recoveryOnAutoAttack:   0,
    recoveryIncrease:       0, // %
  },

  /**
   * Trait – tree of stats allocated through accumulated trait points.
   * Enter the total aggregated value for each stat.
   */
  trait: {
    recoveryIncrease: 0, // %
    hpIncrease:       0, // %
    atkIncrease:      0, // %
    spellDmg:         0, // %
    talismanDmg:      0, // %
    spiritDmg:        0, // %
    autoAttackDmg:    0, // %
    divineBeastDmg:   0, // %
  },

  /**
   * Inner Core – percentage increases of ATK, HP and Recovery plus DMG Reduction.
   */
  innerCore: {
    atkIncrease:      0, // %
    hpIncrease:       0, // %
    recoveryIncrease: 0, // %
    dmgReduction:     0, // %
  },

  /**
   * Offering – three Temples, each providing the same four stat bonuses.
   * Stats are stored flat with a temple prefix for simple key lookup.
   */
  offering: {
    temple1AtkIncrease:      0, // %
    temple1HpIncrease:       0, // %
    temple1RecoveryIncrease: 0, // %
    temple1AutoAttackDmg:    0, // %
    temple2AtkIncrease:      0, // %
    temple2HpIncrease:       0, // %
    temple2RecoveryIncrease: 0, // %
    temple2AutoAttackDmg:    0, // %
    temple3AtkIncrease:      0, // %
    temple3HpIncrease:       0, // %
    temple3RecoveryIncrease: 0, // %
    temple3AutoAttackDmg:    0, // %
  },

  /**
   * Skill – bonuses from equipable Spells, Talismans, Spirits, Divine Beasts
   * and Skins (Holding effects).
   * Skins follow the same roll mechanic as Blood Energy; enter the aggregated total.
   */
  skill: {
    // Spells
    additionalSpellDmg:         0, // %
    // Talisman
    additionalTalismanDmg:      0, // %
    // Spirits
    additionalSpiritDmg:        0, // %
    // Divine Beasts
    divineBeastPhysicalDmg:     0, // %
    divineBeastHpIncrease:      0, // %
    divineBeastRecoveryIncrease:0, // %
    divineBeastBrassCoinGain:   0, // %
    divineBeastExpGain:         0, // %
    // Skins
    skinsBaseAtk:                0,
    skinsAtkIncrease:            0, // %
    skinsAdditionalDmg:          0, // %
    skinsAdditionalDmgToBoss:    0, // %
    skinsAdditionalDmgToNormal:  0, // %
    skinsAdditionalDmgToRealm:   0, // %
    skinsBaseHp:                 0,
    skinsHpIncrease:             0, // %
    skinsRecoveryOnAutoAttack:   0,
    skinsRecoveryIncrease:       0, // %
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
 * Individual equipment items with Equip Effect (active when the item is
 * equipped) and Holding Effect (active whenever the item is in inventory).
 *
 * All numeric values default to 0 – users fill in their own numbers.
 */
const EQUIPMENT_ITEMS_DEFAULT = {
  weapon: {
    name: "Weapon", icon: "⚔️",
    equipped: false, held: false,
    equipEffect:   { baseAtk: 0, atkIncrease: 0 },
    holdingEffect: { atkIncrease: 0 },
  },
  robe: {
    name: "Robe", icon: "🧥",
    equipped: false, held: false,
    equipEffect:   { baseHp: 0, hpIncrease: 0 },
    holdingEffect: { hpIncrease: 0 },
  },
  ring: {
    name: "Ring", icon: "💍",
    equipped: false, held: false,
    equipEffect:   { recoveryOnAutoAttack: 0, recoveryIncrease: 0 },
    holdingEffect: { recoveryIncrease: 0 },
  },
  moneyPouch: {
    name: "Money Pouch", icon: "👝",
    equipped: false, held: false,
    equipEffect:   { brassCoinGainIncrease: 0, expGainIncrease: 0 },
    holdingEffect: { movementSpdIncrease: 0, autoAttackDmgIncrease: 0 },
  },
};

/**
 * Aggregates the stat bonuses from all equipment items based on their
 * current equipped / held state.
 *
 * @param {Object} equipment  – equipment items object (defaults to EQUIPMENT_ITEMS_DEFAULT)
 * @returns {Object} Aggregated numeric bonuses
 */
function computeEquipBonuses(equipment) {
  const eq = equipment || EQUIPMENT_ITEMS_DEFAULT;
  const b = {
    flatAtk: 0, atkPct: 0,
    flatHp: 0, hpPct: 0,
    flatRecovery: 0, recoveryPct: 0,
    brassCoinPct: 0, expGainPct: 0,
    movementSpdPct: 0, autoAttackDmgPct: 0,
  };

  for (const item of Object.values(eq)) {
    if (item.equipped) {
      const ef = item.equipEffect;
      b.flatAtk    += ef.baseAtk              || 0;
      b.atkPct     += ef.atkIncrease          || 0;
      b.flatHp     += ef.baseHp               || 0;
      b.hpPct      += ef.hpIncrease           || 0;
      b.flatRecovery += ef.recoveryOnAutoAttack || 0;
      b.recoveryPct  += ef.recoveryIncrease    || 0;
      b.brassCoinPct += ef.brassCoinGainIncrease || 0;
      b.expGainPct   += ef.expGainIncrease     || 0;
    }
    if (item.held) {
      const hf = item.holdingEffect;
      b.atkPct         += hf.atkIncrease       || 0;
      b.hpPct          += hf.hpIncrease        || 0;
      b.recoveryPct    += hf.recoveryIncrease  || 0;
      b.movementSpdPct += hf.movementSpdIncrease  || 0;
      b.autoAttackDmgPct += hf.autoAttackDmgIncrease || 0;
    }
  }
  return b;
}

/**
 * Returns the effective (total) ATK for the character, combining
 * the Honing base ATK with all flat bonuses and percentage multipliers,
 * including any active equipment-item bonuses.
 *
 * Simplified formula used for the damage calculator:
 *   effectiveAtk = (honingBaseAtk + equipmentBaseAtk + buffBaseAtkFlat + itemFlatAtk)
 *                  × (1 + totalAtkIncrease / 100)
 *
 * @param {Object} [stats]     – stat object (defaults to CHARACTER_STATS)
 * @param {Object} [equipment] – equipment items (defaults to EQUIPMENT_ITEMS_DEFAULT)
 * @returns {number} Effective ATK value
 */
function getEffectiveAtk(stats, equipment) {
  const s = stats || CHARACTER_STATS;
  const eb = computeEquipBonuses(equipment);
  const flatAtk =
    s.honing.baseAtk +
    s.equipment.baseAtk +
    s.buff.baseAtkFlat +
    s.bloodEnergy.baseAtk +
    s.skill.skinsBaseAtk +
    eb.flatAtk;
  const offeringAtkPct =
    s.offering.temple1AtkIncrease +
    s.offering.temple2AtkIncrease +
    s.offering.temple3AtkIncrease;
  const totalAtkPct =
    s.mastery.atkIncrease +
    s.herb.atkIncrease +
    s.equipment.atkIncrease +
    s.buff.atkIncrease +
    s.buff.additionalAtkIncrease +
    s.bloodEnergy.atkIncrease +
    s.promotion.atkIncrease +
    s.trait.atkIncrease +
    s.innerCore.atkIncrease +
    offeringAtkPct +
    s.skill.skinsAtkIncrease +
    eb.atkPct;
  return Math.round(flatAtk * (1 + totalAtkPct / 100));
}

/**
 * Returns the effective (total) HP, including active equipment-item bonuses.
 *
 * @param {Object} [stats]     – stat object (defaults to CHARACTER_STATS)
 * @param {Object} [equipment] – equipment items (defaults to EQUIPMENT_ITEMS_DEFAULT)
 * @returns {number} Effective HP value
 */
function getEffectiveHp(stats, equipment) {
  const s = stats || CHARACTER_STATS;
  const eb = computeEquipBonuses(equipment);
  const flatHp =
    s.honing.baseHp +
    s.equipment.baseHp +
    s.bloodEnergy.baseHp +
    s.skill.skinsBaseHp +
    eb.flatHp;
  const offeringHpPct =
    s.offering.temple1HpIncrease +
    s.offering.temple2HpIncrease +
    s.offering.temple3HpIncrease;
  const totalHpPct =
    s.mastery.hpIncrease +
    s.herb.hpIncrease +
    s.equipment.hpIncrease +
    s.skillCollection.hpIncrease +
    s.promotion.hpIncrease +
    s.monsterCollection.hpIncrease +
    s.bloodEnergy.hpIncrease +
    s.trait.hpIncrease +
    s.innerCore.hpIncrease +
    offeringHpPct +
    s.skill.divineBeastHpIncrease +
    s.skill.skinsHpIncrease +
    eb.hpPct;
  return Math.round(flatHp * (1 + totalHpPct / 100));
}
