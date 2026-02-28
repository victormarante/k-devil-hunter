/**
 * K Devil Hunter - Damage Calculation
 *
 * Implements the damage formula used in K Devil Hunter.
 *
 * Base damage formula:
 *   rawDamage = ATK * skillMultiplier
 *   mitigation = DEF / (DEF + 500)
 *   finalDamage = rawDamage * (1 - mitigation)
 *
 * Critical hit applies when a random roll is below the attacker's Crit Rate.
 *   critDamage = finalDamage * (critDmg / 100)
 *
 * Element matchups apply an additional multiplier.
 */

/**
 * Element advantage table.
 * Key element deals bonus damage against the value element.
 * This is one-directional: e.g. Light beats Dark but Dark does not beat Light.
 */
const ELEMENT_ADVANTAGE = {
  Fire: "Nature",
  Nature: "Wind",
  Wind: "Earth",
  Earth: "Fire",
  Light: "Dark",
};

const ELEMENT_MULTIPLIER = {
  advantage: 1.3,
  disadvantage: 0.7,
  neutral: 1.0,
};

/**
 * Determines the element matchup multiplier between attacker and defender.
 * @param {string} attackerElement
 * @param {string} defenderElement
 * @returns {number} Damage multiplier
 */
function getElementMultiplier(attackerElement, defenderElement) {
  if (ELEMENT_ADVANTAGE[attackerElement] === defenderElement) {
    return ELEMENT_MULTIPLIER.advantage;
  }
  if (ELEMENT_ADVANTAGE[defenderElement] === attackerElement) {
    return ELEMENT_MULTIPLIER.disadvantage;
  }
  return ELEMENT_MULTIPLIER.neutral;
}

/**
 * Calculates damage dealt from attacker to defender.
 *
 * @param {Object} attacker - { atk, critRate, critDmg, element }
 * @param {Object} defender - { def, element }
 * @param {Object} [options]
 * @param {number} [options.skillMultiplier=1.0] - Skill damage multiplier (e.g. 2.5 for a heavy attack)
 * @param {boolean} [options.forceCrit=false]    - Force a critical hit (for preview)
 * @param {boolean} [options.forceNoCrit=false]  - Force no critical hit (for preview)
 * @returns {Object} Damage breakdown
 */
function calculateDamage(attacker, defender, options = {}) {
  const { skillMultiplier = 1.0, forceCrit = false, forceNoCrit = false } =
    options;

  const rawDamage = attacker.atk * skillMultiplier;
  const mitigation = defender.def / (defender.def + 500);
  const baseDamage = rawDamage * (1 - mitigation);

  const elementMult = getElementMultiplier(
    attacker.element,
    defender.element
  );
  const elementAdjustedDamage = baseDamage * elementMult;

  let isCrit = false;
  if (!forceNoCrit) {
    isCrit = forceCrit || Math.random() * 100 < attacker.critRate;
  }

  const critMultiplier = isCrit ? attacker.critDmg / 100 : 1.0;
  const finalDamage = Math.round(elementAdjustedDamage * critMultiplier);

  return {
    rawDamage: Math.round(rawDamage),
    mitigation: Math.round(mitigation * 100),
    baseDamage: Math.round(baseDamage),
    elementMultiplier: elementMult,
    elementMatchup: getElementMatchupLabel(attacker.element, defender.element),
    isCrit,
    critMultiplier,
    finalDamage,
  };
}

/**
 * Returns a human-readable element matchup label.
 * @param {string} attackerElement
 * @param {string} defenderElement
 * @returns {string}
 */
function getElementMatchupLabel(attackerElement, defenderElement) {
  if (ELEMENT_ADVANTAGE[attackerElement] === defenderElement) {
    return "advantage";
  }
  if (ELEMENT_ADVANTAGE[defenderElement] === attackerElement) {
    return "disadvantage";
  }
  return "neutral";
}

/**
 * Returns the min, average, and max expected damage (no crit / crit) for display.
 * @param {Object} attacker - { atk, critRate, critDmg, element }
 * @param {Object} defender - { def, element }
 * @param {number} [skillMultiplier=1.0]
 * @returns {Object} { minDamage, avgDamage, maxDamage, breakdown }
 */
function getDamageRange(attacker, defender, skillMultiplier = 1.0) {
  const noCrit = calculateDamage(attacker, defender, {
    skillMultiplier,
    forceNoCrit: true,
  });
  const crit = calculateDamage(attacker, defender, {
    skillMultiplier,
    forceCrit: true,
  });

  const critChance = attacker.critRate / 100;
  const avgDamage = Math.round(
    noCrit.finalDamage * (1 - critChance) + crit.finalDamage * critChance
  );

  return {
    minDamage: noCrit.finalDamage,
    avgDamage,
    maxDamage: crit.finalDamage,
    breakdown: noCrit,
  };
}
