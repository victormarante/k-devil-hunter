/**
 * K Devil Hunter - Damage Calculation
 *
 * Implements a simplified version of the damage formula used in K Devil Hunter,
 * based on stats visible in the in-game "Detailed Stats" screen.
 *
 * Formula:
 *   effectiveAtk  = (honingBaseAtk + equipBaseAtk + buffFlatAtk)
 *                   × (1 + totalAtkIncrease%)
 *   baseDamage    = effectiveAtk × skillMultiplier
 *   afterDmgBonus = baseDamage × (1 + additionalDmg%)
 *   normalHit     = afterDmgBonus
 *   critHit       = afterDmgBonus × (critDmg / 100)
 *   ultraCritHit  = afterDmgBonus × (ultraCritDmg / 100)   (when ultra crit fires)
 */

/**
 * Calculates a single damage hit based on current character stats.
 *
 * @param {Object} opts
 * @param {number} opts.skillMultiplier  – Skill damage multiplier (default 1.0)
 * @param {boolean} [opts.forceCrit]     – Force a regular critical hit
 * @param {boolean} [opts.forceUltra]    – Force an ultra critical hit
 * @param {boolean} [opts.forceNormal]   – Force a normal (no crit) hit
 * @returns {Object} Damage result breakdown
 */
function calculateDamage({ skillMultiplier = 1.0, forceCrit = false, forceUltra = false, forceNormal = false } = {}) {
  const s = CHARACTER_STATS;

  // ── 1. Effective ATK ────────────────────────────────────────────────────────
  const flatAtk = s.honing.baseAtk + s.equipment.baseAtk + s.buff.baseAtkFlat;
  const totalAtkPct =
    s.mastery.atkIncrease +
    s.equipment.atkIncrease +
    s.buff.atkIncrease +
    s.buff.additionalAtkIncrease +
    s.bloodEnergy.atkIncrease +
    s.promotion.atkIncrease;
  const effectiveAtk = Math.round(flatAtk * (1 + totalAtkPct / 100));

  // ── 2. Base hit before crits ─────────────────────────────────────────────
  const baseDamage = Math.round(effectiveAtk * skillMultiplier);
  const additionalDmgMult = 1 + (s.buff.additionalDmg + s.buff.additionalPhysicalDmg) / 100;
  const afterBonus = Math.round(baseDamage * additionalDmgMult);

  // ── 3. Determine hit type ────────────────────────────────────────────────
  let hitType = "normal";
  if (!forceNormal) {
    if (forceUltra) {
      hitType = "ultra";
    } else if (forceCrit) {
      hitType = "crit";
    } else {
      const roll = Math.random() * 100;
      if (roll < s.honing.ultraCritRate) {
        hitType = "ultra";
      } else if (roll < s.honing.critRate) {
        hitType = "crit";
      }
    }
  }

  // ── 4. Apply crit multiplier ─────────────────────────────────────────────
  // Ultra Crit stacks on top of Crit DMG:
  //   Crit      → base × (critDmg / 100)
  //   Ultra Crit → base × ((critDmg + ultraCritDmg) / 100)
  let finalDamage;
  if (hitType === "ultra") {
    finalDamage = Math.round(afterBonus * ((s.honing.critDmg + s.honing.ultraCritDmg) / 100));
  } else if (hitType === "crit") {
    finalDamage = Math.round(afterBonus * (s.honing.critDmg / 100));
  } else {
    finalDamage = afterBonus;
  }

  return {
    effectiveAtk,
    baseDamage,
    additionalDmgMult,
    hitType,
    critRate:     s.honing.critRate,
    critDmg:      s.honing.critDmg,
    ultraCritRate: s.honing.ultraCritRate,
    ultraCritDmg:  s.honing.ultraCritDmg,
    finalDamage,
    totalAtkIncrease: totalAtkPct,
  };
}

/**
 * Returns the expected min / avg / max damage range.
 *
 * @param {number} [skillMultiplier=1.0]
 * @returns {{ minDamage, avgDamage, maxDamage, breakdown }}
 */
function getDamageRange(skillMultiplier = 1.0) {
  const normal = calculateDamage({ skillMultiplier, forceNormal: true });
  const crit   = calculateDamage({ skillMultiplier, forceCrit: true,  forceNormal: false });
  const ultra  = calculateDamage({ skillMultiplier, forceUltra: true, forceNormal: false });

  const s = CHARACTER_STATS;
  const pNormal = Math.max(0, 1 - s.honing.critRate / 100);
  const pUltra  = Math.min(1, s.honing.ultraCritRate / 100);
  const pCrit   = Math.max(0, s.honing.critRate / 100 - pUltra);

  const avgDamage = Math.round(
    normal.finalDamage * pNormal +
    crit.finalDamage   * pCrit   +
    ultra.finalDamage  * pUltra
  );

  return {
    minDamage: normal.finalDamage,
    avgDamage,
    maxDamage: ultra.finalDamage,
    critDamage: crit.finalDamage,
    breakdown: normal,
  };
}
