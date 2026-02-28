/**
 * K Devil Hunter - Application Logic
 *
 * Manages UI interactions: character selection, stat display, level scaling,
 * and damage calculation.
 */

/* ─── State ───────────────────────────────────────────────────────────────── */

let selectedAttacker = null;
let selectedDefender = null;
let attackerLevel = 1;
let defenderLevel = 1;

/* ─── Initialisation ─────────────────────────────────────────────────────── */

document.addEventListener("DOMContentLoaded", () => {
  renderCharacterRoster("attacker-roster", "attacker");
  renderCharacterRoster("defender-roster", "defender");

  document
    .getElementById("attacker-level")
    .addEventListener("input", onAttackerLevelChange);
  document
    .getElementById("defender-level")
    .addEventListener("input", onDefenderLevelChange);
  document
    .getElementById("skill-multiplier")
    .addEventListener("input", onSkillMultiplierChange);
  document
    .getElementById("roll-damage-btn")
    .addEventListener("click", onRollDamage);

  updateCalculatorPanel();
});

/* ─── Character Roster ───────────────────────────────────────────────────── */

/**
 * Renders character cards into a roster container.
 * @param {string} containerId - DOM id of the container
 * @param {"attacker"|"defender"} role
 */
function renderCharacterRoster(containerId, role) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  CHARACTERS.forEach((char) => {
    const card = document.createElement("div");
    card.className = "char-card";
    card.dataset.id = char.id;
    card.dataset.role = role;
    card.innerHTML = `
      <div class="char-card__element element--${char.element.toLowerCase()}">${char.element}</div>
      <div class="char-card__name">${char.name}</div>
      <div class="char-card__title">${char.title}</div>
      <div class="char-card__type">${char.type}</div>
    `;
    card.addEventListener("click", () => selectCharacter(char, role));
    container.appendChild(card);
  });
}

/**
 * Handles character selection for either role.
 * @param {Object} char - Character object
 * @param {"attacker"|"defender"} role
 */
function selectCharacter(char, role) {
  // Update selection state
  if (role === "attacker") {
    selectedAttacker = char;
  } else {
    selectedDefender = char;
  }

  // Highlight selected card
  document
    .querySelectorAll(`[data-role="${role}"]`)
    .forEach((el) => el.classList.remove("char-card--selected"));
  document
    .querySelector(`[data-role="${role}"][data-id="${char.id}"]`)
    .classList.add("char-card--selected");

  updateCharacterInfoPanel(role);
  updateCalculatorPanel();
}

/* ─── Character Info Panel ───────────────────────────────────────────────── */

/**
 * Updates the stat display panel for the given role.
 * @param {"attacker"|"defender"} role
 */
function updateCharacterInfoPanel(role) {
  const char = role === "attacker" ? selectedAttacker : selectedDefender;
  const level = role === "attacker" ? attackerLevel : defenderLevel;
  const panelId = role === "attacker" ? "attacker-info" : "defender-info";
  const panel = document.getElementById(panelId);

  if (!char) {
    panel.innerHTML = `<p class="placeholder">Select a character</p>`;
    return;
  }

  const stats = getStatsAtLevel(char, level);

  panel.innerHTML = `
    <div class="info-header">
      <span class="info-name">${char.name}</span>
      <span class="info-title">${char.title}</span>
      <span class="badge badge--${char.type.toLowerCase()}">${char.type}</span>
      <span class="badge badge--element element--${char.element.toLowerCase()}">${char.element}</span>
    </div>
    <div class="stat-grid">
      <div class="stat-row">
        <span class="stat-label">HP</span>
        <div class="stat-bar-wrap">
          <div class="stat-bar stat-bar--hp" style="width:${Math.min(100, (stats.hp / 3000) * 100)}%"></div>
        </div>
        <span class="stat-value">${stats.hp.toLocaleString()}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">ATK</span>
        <div class="stat-bar-wrap">
          <div class="stat-bar stat-bar--atk" style="width:${Math.min(100, (stats.atk / 600) * 100)}%"></div>
        </div>
        <span class="stat-value">${stats.atk.toLocaleString()}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">DEF</span>
        <div class="stat-bar-wrap">
          <div class="stat-bar stat-bar--def" style="width:${Math.min(100, (stats.def / 500) * 100)}%"></div>
        </div>
        <span class="stat-value">${stats.def.toLocaleString()}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">SPD</span>
        <div class="stat-bar-wrap">
          <div class="stat-bar stat-bar--spd" style="width:${Math.min(100, (stats.spd / 200) * 100)}%"></div>
        </div>
        <span class="stat-value">${stats.spd.toLocaleString()}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">CRIT%</span>
        <div class="stat-bar-wrap">
          <div class="stat-bar stat-bar--crit" style="width:${Math.min(100, stats.critRate)}%"></div>
        </div>
        <span class="stat-value">${stats.critRate}%</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">CRIT DMG</span>
        <div class="stat-bar-wrap">
          <div class="stat-bar stat-bar--crit" style="width:${Math.min(100, (stats.critDmg / 300) * 100)}%"></div>
        </div>
        <span class="stat-value">${stats.critDmg}%</span>
      </div>
    </div>
  `;
}

/* ─── Damage Calculator Panel ────────────────────────────────────────────── */

/** Updates the damage preview display. */
function updateCalculatorPanel() {
  const resultEl = document.getElementById("damage-result");

  if (!selectedAttacker || !selectedDefender) {
    resultEl.innerHTML = `<p class="placeholder">Select both an attacker and a defender to see damage estimates.</p>`;
    return;
  }

  const atkStats = getStatsAtLevel(selectedAttacker, attackerLevel);
  const defStats = getStatsAtLevel(selectedDefender, defenderLevel);

  const skillMult = parseFloat(
    document.getElementById("skill-multiplier").value
  ) || 1.0;

  const range = getDamageRange(
    { ...atkStats, element: selectedAttacker.element },
    { def: defStats.def, element: selectedDefender.element },
    skillMult
  );

  const matchupClass =
    range.breakdown.elementMatchup === "advantage"
      ? "matchup--advantage"
      : range.breakdown.elementMatchup === "disadvantage"
      ? "matchup--disadvantage"
      : "matchup--neutral";

  const matchupLabel =
    range.breakdown.elementMatchup === "advantage"
      ? "▲ Element Advantage"
      : range.breakdown.elementMatchup === "disadvantage"
      ? "▼ Element Disadvantage"
      : "● Neutral Element";

  resultEl.innerHTML = `
    <div class="matchup-banner ${matchupClass}">${matchupLabel}
      (${selectedAttacker.element} → ${selectedDefender.element})
    </div>

    <div class="damage-summary">
      <div class="damage-col">
        <span class="damage-label">Min (no crit)</span>
        <span class="damage-value">${range.minDamage.toLocaleString()}</span>
      </div>
      <div class="damage-col damage-col--avg">
        <span class="damage-label">Avg</span>
        <span class="damage-value damage-value--avg">${range.avgDamage.toLocaleString()}</span>
      </div>
      <div class="damage-col">
        <span class="damage-label">Max (crit)</span>
        <span class="damage-value">${range.maxDamage.toLocaleString()}</span>
      </div>
    </div>

    <div class="breakdown">
      <div class="breakdown-row">
        <span>ATK × Skill (${skillMult}×)</span>
        <span>${range.breakdown.rawDamage.toLocaleString()}</span>
      </div>
      <div class="breakdown-row">
        <span>DEF Mitigation</span>
        <span>−${range.breakdown.mitigation}%</span>
      </div>
      <div class="breakdown-row">
        <span>Element Multiplier</span>
        <span>×${range.breakdown.elementMultiplier.toFixed(1)}</span>
      </div>
      <div class="breakdown-row">
        <span>Crit Chance</span>
        <span>${atkStats.critRate}%</span>
      </div>
      <div class="breakdown-row">
        <span>Crit Damage</span>
        <span>${atkStats.critDmg}%</span>
      </div>
    </div>

    <div class="roll-section">
      <p class="roll-hint">Click <strong>Roll</strong> to simulate a single hit with random crit chance.</p>
    </div>
  `;
}

/** Simulates a single damage roll and shows the result. */
function onRollDamage() {
  if (!selectedAttacker || !selectedDefender) return;

  const atkStats = getStatsAtLevel(selectedAttacker, attackerLevel);
  const defStats = getStatsAtLevel(selectedDefender, defenderLevel);
  const skillMult =
    parseFloat(document.getElementById("skill-multiplier").value) || 1.0;

  const result = calculateDamage(
    { ...atkStats, element: selectedAttacker.element },
    { def: defStats.def, element: selectedDefender.element },
    { skillMultiplier: skillMult }
  );

  const rollEl = document.getElementById("roll-result");
  rollEl.style.display = "";
  rollEl.className = "roll-result" + (result.isCrit ? " roll-result--crit" : "");
  rollEl.innerHTML = result.isCrit
    ? `💥 CRITICAL HIT! <strong>${result.finalDamage.toLocaleString()}</strong> damage`
    : `⚔️ Hit! <strong>${result.finalDamage.toLocaleString()}</strong> damage`;

  rollEl.classList.add("roll-result--flash");
  setTimeout(() => rollEl.classList.remove("roll-result--flash"), 400);
}

/* ─── Level Change Handlers ──────────────────────────────────────────────── */

function onAttackerLevelChange(e) {
  attackerLevel = clampLevel(parseInt(e.target.value, 10));
  e.target.value = attackerLevel;
  document.getElementById("attacker-level-display").textContent = attackerLevel;
  updateCharacterInfoPanel("attacker");
  updateCalculatorPanel();
}

function onDefenderLevelChange(e) {
  defenderLevel = clampLevel(parseInt(e.target.value, 10));
  e.target.value = defenderLevel;
  document.getElementById("defender-level-display").textContent = defenderLevel;
  updateCharacterInfoPanel("defender");
  updateCalculatorPanel();
}

function onSkillMultiplierChange() {
  updateCalculatorPanel();
}

function clampLevel(val) {
  if (isNaN(val) || val < 1) return 1;
  if (val > 100) return 100;
  return val;
}
