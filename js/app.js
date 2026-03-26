/**
 * K Devil Hunter - Application Logic
 *
 * Manages the stat-reference display and damage calculator UI.
 * All data is sourced from CHARACTER_STATS (characters.js).
 */

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

/** Format a large integer with K / M suffix */
function fmt(n) {
  if (n === undefined || n === null) return "—";
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (Math.abs(n) >= 1_000)     return (n / 1_000).toFixed(0) + "K";
  return n.toLocaleString();
}

/** Format a percentage value */
function fmtPct(n) {
  if (n === undefined || n === null) return "—";
  return n.toLocaleString() + "%";
}

/* ─── Stat-category definitions ───────────────────────────────────────────── */

const STAT_CATEGORIES = [
  {
    id: "honing",
    label: "Honing",
    icon: "⚔️",
    rows: [
      { key: "baseAtk",               label: "Base ATK",                    fmt: fmt },
      { key: "critRate",               label: "Crit Rate",                   fmt: fmtPct },
      { key: "critDmg",                label: "Crit DMG",                    fmt: fmtPct },
      { key: "ultraCritRate",          label: "Ultra Crit Rate",             fmt: fmtPct },
      { key: "ultraCritDmg",           label: "Ultra Crit DMG",              fmt: fmtPct },
      { key: "atkSpdIncrease",         label: "ATK SPD Increase",            fmt: fmtPct },
      { key: "baseHp",                 label: "Base HP",                     fmt: fmt },
      { key: "recoveryOnAutoAttack",   label: "Recovery on Auto-Attack",     fmt: fmt },
      { key: "brassCoinGainIncrease",  label: "Brass Coin Gain Increase",    fmt: fmtPct },
      { key: "expGainIncrease",        label: "EXP Gain Increase",           fmt: fmtPct },
    ],
  },
  {
    id: "mastery",
    label: "Mastery",
    icon: "📖",
    rows: [
      { key: "atkIncrease",               label: "ATK Increase",                fmt: fmtPct },
      { key: "hpIncrease",                label: "HP Increase",                 fmt: fmtPct },
      { key: "recoveryIncrease",          label: "Recovery Increase",           fmt: fmtPct },
      { key: "weaponDropRateIncrease",    label: "Weapon Drop Rate Increase",   fmt: fmtPct },
      { key: "robeDropRateIncrease",      label: "Robe Drop Rate Increase",     fmt: fmtPct },
      { key: "ringDropRateIncrease",      label: "Ring Drop Rate Increase",     fmt: fmtPct },
      { key: "moneyPouchDropRateIncrease",label: "Money Pouch Drop Rate Increase", fmt: fmtPct },
    ],
  },
  {
    id: "equipment",
    label: "Equipment",
    icon: "🛡️",
    rows: [
      { key: "atkIncrease",            label: "ATK Increase",                fmt: fmtPct },
      { key: "hpIncrease",             label: "HP Increase",                 fmt: fmtPct },
      { key: "recoveryIncrease",       label: "Recovery Increase",           fmt: fmtPct },
      { key: "baseAtk",                label: "Base ATK",                    fmt: fmt },
      { key: "baseHp",                 label: "Base HP",                     fmt: fmt },
      { key: "recoveryOnAutoAttack",   label: "Recovery on Auto-Attack",     fmt: fmt },
      { key: "brassCoinGainIncrease",  label: "Brass Coin Gain Increase",    fmt: fmtPct },
      { key: "expGainIncrease",        label: "EXP Gain Increase",           fmt: fmtPct },
    ],
  },
  {
    id: "skillCollection",
    label: "Skill Collection",
    icon: "✨",
    rows: [
      { key: "physicalDmgIncrease",    label: "Physical DMG Increase",       fmt: fmtPct },
      { key: "magicDmgIncrease",       label: "Magic DMG Increase",          fmt: fmtPct },
      { key: "fireDmgIncrease",        label: "Fire DMG Increase",           fmt: fmtPct },
      { key: "waterDmgIncrease",       label: "Water DMG Increase",          fmt: fmtPct },
      { key: "windDmgIncrease",        label: "Wind DMG Increase",           fmt: fmtPct },
      { key: "lightningDmgIncrease",   label: "Lightning DMG Increase",      fmt: fmtPct },
      { key: "earthDmgIncrease",       label: "Earth DMG Increase",          fmt: fmtPct },
      { key: "hpIncrease",             label: "HP Increase",                 fmt: fmtPct },
      { key: "recoveryIncrease",       label: "Recovery Increase",           fmt: fmtPct },
    ],
  },
  {
    id: "buff",
    label: "Buff",
    icon: "💫",
    rows: [
      { key: "additionalSpellDmg",     label: "Additional Spell DMG",        fmt: fmtPct },
      { key: "additionalTalismanDmg",  label: "Additional Talisman DMG",     fmt: fmtPct },
      { key: "additionalSpiritDmg",    label: "Additional Spirit DMG",       fmt: fmtPct },
      { key: "atkIncrease",            label: "ATK Increase",                fmt: fmtPct },
      { key: "brassCoinGainIncrease",  label: "Brass Coin Gain Increase",    fmt: fmtPct },
      { key: "recoveryIncrease",       label: "Recovery Increase",           fmt: fmtPct },
      { key: "additionalSkinDmg",      label: "Additional Skin DMG",         fmt: fmtPct },
      { key: "baseAtkFlat",            label: "Base ATK (flat)",             fmt: fmt },
      { key: "additionalAtkIncrease",  label: "Additional ATK Increase",     fmt: fmtPct },
      { key: "additionalDmg",          label: "Additional DMG",              fmt: fmtPct },
      { key: "additionalPhysicalDmg",  label: "Additional Physical DMG",     fmt: fmtPct },
      { key: "additionalMagicDmg",     label: "Additional Magic DMG",        fmt: fmtPct },
      { key: "additionalFireDmg",      label: "Additional Fire DMG",         fmt: fmtPct },
      { key: "additionalWaterDmg",     label: "Additional Water DMG",        fmt: fmtPct },
    ],
  },
  {
    id: "bloodEnergy",
    label: "Blood Energy",
    icon: "🩸",
    rows: [
      { key: "atkIncrease",  label: "ATK Increase",  fmt: fmtPct },
      { key: "magicDmg",     label: "Magic DMG",      fmt: fmtPct },
    ],
  },
  {
    id: "promotion",
    label: "Promotion",
    icon: "⬆️",
    rows: [
      { key: "hpIncrease",        label: "HP Increase",        fmt: fmtPct },
      { key: "atkIncrease",       label: "ATK Increase",        fmt: fmtPct },
      { key: "recoveryIncrease",  label: "Recovery Increase",   fmt: fmtPct },
    ],
  },
  {
    id: "monsterCollection",
    label: "Monster Collection",
    icon: "👾",
    rows: [
      { key: "hpIncrease",       label: "HP Increase",        fmt: fmtPct },
      { key: "recoveryIncrease", label: "Recovery Increase",  fmt: fmtPct },
    ],
  },
];

/* ─── Active tab state ────────────────────────────────────────────────────── */

let activeCategoryId = STAT_CATEGORIES[0].id;

/* ─── Initialisation ─────────────────────────────────────────────────────── */

document.addEventListener("DOMContentLoaded", () => {
  renderCharacterHeader();
  renderStatTabs();
  renderStatTable(activeCategoryId);
  renderSummaryCards();
  renderScreenshotGallery();
  updateCalculatorPanel();

  document.getElementById("skill-multiplier")
    .addEventListener("input", updateCalculatorPanel);
  document.getElementById("roll-damage-btn")
    .addEventListener("click", onRollDamage);
  document.getElementById("lightbox").addEventListener("click", () => {
    document.getElementById("lightbox").style.display = "none";
  });
});

/* ─── Character header ───────────────────────────────────────────────────── */

function renderCharacterHeader() {
  const el = document.getElementById("character-header");
  if (!el) return;
  const s = CHARACTER_STATS;
  el.innerHTML = `
    <div class="char-meta">
      <span class="char-name">${s.name}</span>
      <span class="char-level">Lv.${s.level}</span>
      <span class="char-sect">Sect: ${s.sect}</span>
      <span class="char-server">${s.server}</span>
    </div>
    <div class="char-totals">
      <div class="total-stat">
        <span class="total-label">Effective ATK</span>
        <span class="total-value">${fmt(getEffectiveAtk())}</span>
      </div>
      <div class="total-stat">
        <span class="total-label">Effective HP</span>
        <span class="total-value">${fmt(getEffectiveHp())}</span>
      </div>
      <div class="total-stat">
        <span class="total-label">Crit Rate</span>
        <span class="total-value">${fmtPct(s.honing.critRate)}</span>
      </div>
      <div class="total-stat">
        <span class="total-label">Crit DMG</span>
        <span class="total-value">${fmtPct(s.honing.critDmg)}</span>
      </div>
    </div>
  `;
}

/* ─── Summary cards ──────────────────────────────────────────────────────── */

function renderSummaryCards() {
  const el = document.getElementById("summary-cards");
  if (!el) return;
  const s = CHARACTER_STATS;

  const cards = [
    { icon: "⚔️",  label: "Effective ATK",        value: fmt(getEffectiveAtk()) },
    { icon: "❤️",  label: "Effective HP",          value: fmt(getEffectiveHp()) },
    { icon: "🎯",  label: "Crit Rate",             value: fmtPct(s.honing.critRate) },
    { icon: "💥",  label: "Crit DMG",              value: fmtPct(s.honing.critDmg) },
    { icon: "⚡",  label: "Ultra Crit Rate",       value: fmtPct(s.honing.ultraCritRate) },
    { icon: "🔥",  label: "Ultra Crit DMG",        value: fmtPct(s.honing.ultraCritDmg) },
    { icon: "📈",  label: "Total ATK Increase",    value: fmtPct(s.mastery.atkIncrease + s.equipment.atkIncrease + s.buff.atkIncrease + s.buff.additionalAtkIncrease + s.bloodEnergy.atkIncrease + s.promotion.atkIncrease) },
    { icon: "🏃",  label: "ATK SPD Increase",      value: fmtPct(s.honing.atkSpdIncrease) },
    { icon: "🪙",  label: "Brass Coin Gain",       value: fmtPct(s.honing.brassCoinGainIncrease) },
    { icon: "⭐",  label: "EXP Gain Increase",     value: fmtPct(s.honing.expGainIncrease) },
  ];

  el.innerHTML = cards.map(c => `
    <div class="summary-card">
      <span class="summary-icon">${c.icon}</span>
      <span class="summary-label">${c.label}</span>
      <span class="summary-value">${c.value}</span>
    </div>
  `).join("");
}

/* ─── Stat tabs ──────────────────────────────────────────────────────────── */

function renderStatTabs() {
  const tabBar = document.getElementById("stat-tabs");
  if (!tabBar) return;
  tabBar.innerHTML = STAT_CATEGORIES.map(cat => `
    <button
      class="stat-tab${cat.id === activeCategoryId ? " stat-tab--active" : ""}"
      data-cat="${cat.id}"
    >${cat.icon} ${cat.label}</button>
  `).join("");

  tabBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".stat-tab");
    if (!btn) return;
    activeCategoryId = btn.dataset.cat;
    tabBar.querySelectorAll(".stat-tab").forEach(b => b.classList.remove("stat-tab--active"));
    btn.classList.add("stat-tab--active");
    renderStatTable(activeCategoryId);
  });
}

/* ─── Stat table ─────────────────────────────────────────────────────────── */

function renderStatTable(categoryId) {
  const el = document.getElementById("stat-table");
  if (!el) return;
  const cat = STAT_CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return;
  const data = CHARACTER_STATS[categoryId];

  el.innerHTML = `
    <div class="stat-table-header">
      <span>${cat.icon} ${cat.label}</span>
      <span>Value</span>
    </div>
    ${cat.rows.map(row => `
      <div class="stat-table-row">
        <span class="stat-table-label">${row.label}</span>
        <span class="stat-table-value">${row.fmt(data[row.key])}</span>
      </div>
    `).join("")}
  `;
}

/* ─── Screenshot gallery ─────────────────────────────────────────────────── */

function renderScreenshotGallery() {
  const el = document.getElementById("screenshot-gallery");
  if (!el) return;

  const screenshots = [
    { file: "IMG_1228.JPEG", caption: "Gameplay" },
    { file: "IMG_1232.JPEG", caption: "Honing" },
    { file: "IMG_1233.JPEG", caption: "Mastery & Equipment" },
    { file: "IMG_1234.JPEG", caption: "Equipment & Skills" },
    { file: "IMG_1235.JPEG", caption: "Skill Collection & Buff" },
    { file: "IMG_1236.JPEG", caption: "Buff" },
    { file: "IMG_1237.JPEG", caption: "Buff (cont.)" },
    { file: "IMG_1238.JPEG", caption: "Buff (cont.)" },
    { file: "IMG_1239.JPEG", caption: "Buff (cont.)" },
    { file: "IMG_1240.JPEG", caption: "Blood Energy" },
    { file: "IMG_1241.JPEG", caption: "Promotion" },
    { file: "IMG_1242.JPEG", caption: "Monster Collection" },
    { file: "IMG_1243.JPEG", caption: "Monster Collection (cont.)" },
    { file: "IMG_1244.JPEG", caption: "Monster Collection (cont.)" },
    { file: "IMG_1245.JPEG", caption: "Stats (cont.)" },
    { file: "IMG_1246.JPEG", caption: "Stats (cont.)" },
    { file: "IMG_1247.JPEG", caption: "Stats (cont.)" },
    { file: "IMG_1248.JPEG", caption: "Summary" },
  ];

  el.innerHTML = screenshots.map(s => `
    <div class="gallery-item">
      <img
        src="assets/${s.file}"
        alt="${s.caption}"
        loading="lazy"
        onclick="openLightbox(this.src)"
      />
      <span class="gallery-caption">${s.caption}</span>
    </div>
  `).join("");
}

/* ─── Lightbox ───────────────────────────────────────────────────────────── */

function openLightbox(src) {
  const lb = document.getElementById("lightbox");
  document.getElementById("lightbox-img").src = src;
  lb.style.display = "flex";
}

/* ─── Damage Calculator ──────────────────────────────────────────────────── */

function updateCalculatorPanel() {
  const resultEl = document.getElementById("damage-result");
  const skillMult = parseFloat(document.getElementById("skill-multiplier").value) || 1.0;
  const range = getDamageRange(skillMult);
  const s = CHARACTER_STATS;

  resultEl.innerHTML = `
    <div class="damage-summary">
      <div class="damage-col">
        <span class="damage-label">Normal Hit</span>
        <span class="damage-value">${range.minDamage.toLocaleString()}</span>
      </div>
      <div class="damage-col">
        <span class="damage-label">Crit Hit</span>
        <span class="damage-value">${range.critDamage.toLocaleString()}</span>
      </div>
      <div class="damage-col damage-col--avg">
        <span class="damage-label">Avg</span>
        <span class="damage-value damage-value--avg">${range.avgDamage.toLocaleString()}</span>
      </div>
      <div class="damage-col">
        <span class="damage-label">Ultra Crit</span>
        <span class="damage-value">${range.maxDamage.toLocaleString()}</span>
      </div>
    </div>

    <div class="breakdown">
      <div class="breakdown-row">
        <span>Effective ATK</span>
        <span>${fmt(range.breakdown.effectiveAtk)}</span>
      </div>
      <div class="breakdown-row">
        <span>Skill Multiplier</span>
        <span>×${skillMult.toFixed(1)}</span>
      </div>
      <div class="breakdown-row">
        <span>Total ATK Increase</span>
        <span>+${fmtPct(range.breakdown.totalAtkIncrease)}</span>
      </div>
      <div class="breakdown-row">
        <span>Crit Rate / Crit DMG</span>
        <span>${fmtPct(s.honing.critRate)} / ${fmtPct(s.honing.critDmg)}</span>
      </div>
      <div class="breakdown-row">
        <span>Ultra Crit Rate / DMG</span>
        <span>${fmtPct(s.honing.ultraCritRate)} / ${fmtPct(s.honing.ultraCritDmg)}</span>
      </div>
    </div>

    <div class="roll-section">
      <p class="roll-hint">Click <strong>Roll Hit</strong> to simulate a single strike.</p>
    </div>
  `;
}

function onRollDamage() {
  const skillMult = parseFloat(document.getElementById("skill-multiplier").value) || 1.0;
  const result = calculateDamage({ skillMultiplier: skillMult });

  const rollEl = document.getElementById("roll-result");
  rollEl.style.display = "";

  const labels = { normal: "⚔️ Normal Hit!", crit: "💥 Critical Hit!", ultra: "🌟 ULTRA Critical Hit!" };
  const cssClasses = { normal: "", crit: " roll-result--crit", ultra: " roll-result--ultra" };

  rollEl.className = "roll-result" + cssClasses[result.hitType];
  rollEl.innerHTML = `${labels[result.hitType]} <strong>${result.finalDamage.toLocaleString()}</strong> damage`;

  rollEl.classList.add("roll-result--flash");
  setTimeout(() => rollEl.classList.remove("roll-result--flash"), 400);
}
