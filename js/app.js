/**
 * K Devil Hunter - Application Logic
 *
 * Manages the stat-reference display and damage calculator UI.
 * All data is sourced from CHARACTER_STATS (characters.js).
 * Users can edit their own stats, share them via a base64 code,
 * and import a profile code to restore a saved state.
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

/* ─── Active state ────────────────────────────────────────────────────────── */

/** Deep-copy CHARACTER_STATS so the original stays intact */
let activeStats = JSON.parse(JSON.stringify(CHARACTER_STATS));

/** Deep-copy EQUIPMENT_ITEMS_DEFAULT so the original stays intact */
let activeEquipment = JSON.parse(JSON.stringify(EQUIPMENT_ITEMS_DEFAULT));

/** Whether the UI is currently in edit mode */
let isEditMode = false;

/* ─── Profile helpers ─────────────────────────────────────────────────────── */

/** Serialize the current profile to a sharable base64 string */
function serializeProfile() {
  const json = JSON.stringify({ stats: activeStats, equipment: activeEquipment });
  // encodeURIComponent converts all non-ASCII (e.g. emoji icons) to %XX escape
  // sequences, making the string safe for btoa which only handles Latin-1.
  return btoa(encodeURIComponent(json));
}

/**
 * Deserialize a profile from a base64 string.
 * @param {string} code
 * @returns {boolean} true on success
 */
function deserializeProfile(code) {
  try {
    const json = decodeURIComponent(atob(code.trim()));
    const data = JSON.parse(json);
    if (data && data.stats) {
      activeStats = data.stats;
      activeEquipment = data.equipment
        ? data.equipment
        : JSON.parse(JSON.stringify(EQUIPMENT_ITEMS_DEFAULT));
      return true;
    }
  } catch (err) {
    console.warn("Failed to import profile:", err);
  }
  return false;
}

/** Reset everything to the bundled example profile */
function resetToDefault() {
  activeStats    = JSON.parse(JSON.stringify(CHARACTER_STATS));
  activeEquipment = JSON.parse(JSON.stringify(EQUIPMENT_ITEMS_DEFAULT));
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
    id: "herb",
    label: "Herb",
    icon: "🌿",
    rows: [
      { key: "atkIncrease",                label: "ATK Increase",                   fmt: fmtPct },
      { key: "hpIncrease",                 label: "HP Increase",                    fmt: fmtPct },
      { key: "recoveryIncrease",           label: "Recovery Increase",              fmt: fmtPct },
      { key: "additionalDmg",              label: "Additional DMG",                 fmt: fmtPct },
      { key: "additionalDmgToBoss",        label: "Additional DMG to Boss",         fmt: fmtPct },
      { key: "additionalDmgToNormal",      label: "Additional DMG to Normal",       fmt: fmtPct },
      { key: "additionalPhysicalDmg",      label: "Additional Physical DMG",        fmt: fmtPct },
      { key: "additionalMagicDmg",         label: "Additional Magic DMG",           fmt: fmtPct },
      { key: "additionalFireDmg",          label: "Additional Fire DMG",            fmt: fmtPct },
      { key: "additionalWaterDmg",         label: "Additional Water DMG",           fmt: fmtPct },
      { key: "additionalWindDmg",          label: "Additional Wind DMG",            fmt: fmtPct },
      { key: "additionalLightningDmg",     label: "Additional Lightning DMG",       fmt: fmtPct },
      { key: "additionalEarthDmg",         label: "Additional Earth DMG",           fmt: fmtPct },
      { key: "brassCoinGainIncrease",      label: "Brass Coin Gain Increase",       fmt: fmtPct },
      { key: "expGainIncrease",            label: "EXP Gain Increase",              fmt: fmtPct },
      { key: "weaponDropRateIncrease",     label: "Weapon Drop Rate Increase",      fmt: fmtPct },
      { key: "robeDropRateIncrease",       label: "Robe Drop Rate Increase",        fmt: fmtPct },
      { key: "ringDropRateIncrease",       label: "Ring Drop Rate Increase",        fmt: fmtPct },
      { key: "moneyPouchDropRateIncrease", label: "Money Pouch Drop Rate Increase", fmt: fmtPct },
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
      { key: "baseAtk",              label: "Base ATK",                    fmt: fmt    },
      { key: "atkIncrease",          label: "ATK Increase",                fmt: fmtPct },
      { key: "additionalDmg",        label: "Additional DMG",              fmt: fmtPct },
      { key: "additionalDmgToBoss",  label: "Additional DMG to Boss",      fmt: fmtPct },
      { key: "additionalDmgToNormal",label: "Additional DMG to Normal",    fmt: fmtPct },
      { key: "additionalDmgToRealm", label: "Additional DMG to Realm",     fmt: fmtPct },
      { key: "baseHp",               label: "Base HP",                     fmt: fmt    },
      { key: "hpIncrease",           label: "HP Increase",                 fmt: fmtPct },
      { key: "recoveryOnAutoAttack", label: "Recovery on Auto-Attack",     fmt: fmt    },
      { key: "recoveryIncrease",     label: "Recovery Increase",           fmt: fmtPct },
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
    id: "trait",
    label: "Trait",
    icon: "🌀",
    rows: [
      { key: "recoveryIncrease", label: "Recovery",          fmt: fmtPct },
      { key: "hpIncrease",       label: "HP",                fmt: fmtPct },
      { key: "atkIncrease",      label: "ATK",               fmt: fmtPct },
      { key: "spellDmg",         label: "Spell DMG",         fmt: fmtPct },
      { key: "talismanDmg",      label: "Talisman DMG",      fmt: fmtPct },
      { key: "spiritDmg",        label: "Spirit DMG",        fmt: fmtPct },
      { key: "autoAttackDmg",    label: "Auto-Attack DMG",   fmt: fmtPct },
      { key: "divineBeastDmg",   label: "Divine Beast DMG",  fmt: fmtPct },
    ],
  },
  {
    id: "innerCore",
    label: "Inner Core",
    icon: "🔮",
    rows: [
      { key: "atkIncrease",      label: "ATK Increase",      fmt: fmtPct },
      { key: "hpIncrease",       label: "HP Increase",       fmt: fmtPct },
      { key: "recoveryIncrease", label: "Recovery Increase", fmt: fmtPct },
      { key: "dmgReduction",     label: "DMG Reduction",     fmt: fmtPct },
    ],
  },
  {
    id: "offering",
    label: "Offering",
    icon: "⛩️",
    rows: [
      { key: null,                      label: "Temple 1",                  isHeader: true },
      { key: "temple1AtkIncrease",      label: "ATK Increase",              fmt: fmtPct },
      { key: "temple1HpIncrease",       label: "HP Increase",               fmt: fmtPct },
      { key: "temple1RecoveryIncrease", label: "Recovery Increase",         fmt: fmtPct },
      { key: "temple1AutoAttackDmg",    label: "Auto-Attack DMG",           fmt: fmtPct },
      { key: null,                      label: "Temple 2",                  isHeader: true },
      { key: "temple2AtkIncrease",      label: "ATK Increase",              fmt: fmtPct },
      { key: "temple2HpIncrease",       label: "HP Increase",               fmt: fmtPct },
      { key: "temple2RecoveryIncrease", label: "Recovery Increase",         fmt: fmtPct },
      { key: "temple2AutoAttackDmg",    label: "Auto-Attack DMG",           fmt: fmtPct },
      { key: null,                      label: "Temple 3",                  isHeader: true },
      { key: "temple3AtkIncrease",      label: "ATK Increase",              fmt: fmtPct },
      { key: "temple3HpIncrease",       label: "HP Increase",               fmt: fmtPct },
      { key: "temple3RecoveryIncrease", label: "Recovery Increase",         fmt: fmtPct },
      { key: "temple3AutoAttackDmg",    label: "Auto-Attack DMG",           fmt: fmtPct },
    ],
  },
  {
    id: "skill",
    label: "Skill",
    icon: "🎴",
    rows: [
      { key: null,                         label: "Spells",                   isHeader: true },
      { key: "additionalSpellDmg",         label: "Additional Spell DMG",     fmt: fmtPct },
      { key: null,                         label: "Talisman",                 isHeader: true },
      { key: "additionalTalismanDmg",      label: "Additional Talisman DMG",  fmt: fmtPct },
      { key: null,                         label: "Spirits",                  isHeader: true },
      { key: "additionalSpiritDmg",        label: "Additional Spirit DMG",    fmt: fmtPct },
      { key: null,                         label: "Divine Beasts",            isHeader: true },
      { key: "divineBeastPhysicalDmg",     label: "Additional Physical DMG",  fmt: fmtPct },
      { key: "divineBeastHpIncrease",      label: "HP Increase",              fmt: fmtPct },
      { key: "divineBeastRecoveryIncrease",label: "Recovery Increase",        fmt: fmtPct },
      { key: "divineBeastBrassCoinGain",   label: "Brass Coin Gain Increase", fmt: fmtPct },
      { key: "divineBeastExpGain",         label: "EXP Gain Increase",        fmt: fmtPct },
      { key: null,                         label: "Skins",                    isHeader: true },
      { key: "skinsBaseAtk",               label: "Base ATK",                 fmt: fmt    },
      { key: "skinsAtkIncrease",           label: "ATK Increase",             fmt: fmtPct },
      { key: "skinsAdditionalDmg",         label: "Additional DMG",           fmt: fmtPct },
      { key: "skinsAdditionalDmgToBoss",   label: "Additional DMG to Boss",   fmt: fmtPct },
      { key: "skinsAdditionalDmgToNormal", label: "Additional DMG to Normal", fmt: fmtPct },
      { key: "skinsAdditionalDmgToRealm",  label: "Additional DMG to Realm",  fmt: fmtPct },
      { key: "skinsBaseHp",                label: "Base HP",                  fmt: fmt    },
      { key: "skinsHpIncrease",            label: "HP Increase",              fmt: fmtPct },
      { key: "skinsRecoveryOnAutoAttack",  label: "Recovery on Auto-Attack",  fmt: fmt    },
      { key: "skinsRecoveryIncrease",      label: "Recovery Increase",        fmt: fmtPct },
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

/* ─── Equipment item definitions ─────────────────────────────────────────── */

const EQUIP_ITEM_DEFS = [
  {
    key: "weapon",
    equipRows:   [
      { key: "baseAtk",    label: "Base ATK",        fmt: fmt },
      { key: "atkIncrease", label: "ATK Increase %", fmt: fmtPct },
    ],
    holdingRows: [
      { key: "atkIncrease", label: "ATK Increase %", fmt: fmtPct },
    ],
  },
  {
    key: "robe",
    equipRows:   [
      { key: "baseHp",      label: "Base HP",         fmt: fmt },
      { key: "hpIncrease",  label: "HP Increase %",   fmt: fmtPct },
    ],
    holdingRows: [
      { key: "hpIncrease",  label: "HP Increase %",   fmt: fmtPct },
    ],
  },
  {
    key: "ring",
    equipRows:   [
      { key: "recoveryOnAutoAttack", label: "Recovery on Auto-Attack", fmt: fmt },
      { key: "recoveryIncrease",     label: "Recovery Increase %",     fmt: fmtPct },
    ],
    holdingRows: [
      { key: "recoveryIncrease", label: "Recovery Increase %", fmt: fmtPct },
    ],
  },
  {
    key: "moneyPouch",
    equipRows:   [
      { key: "brassCoinGainIncrease", label: "Brass Coin Gain %", fmt: fmtPct },
      { key: "expGainIncrease",       label: "EXP Gain %",        fmt: fmtPct },
    ],
    holdingRows: [
      { key: "movementSpdIncrease",  label: "Movement SPD %",      fmt: fmtPct },
      { key: "autoAttackDmgIncrease", label: "Auto-Attack DMG %",  fmt: fmtPct },
    ],
  },
];

/* ─── Active tab state ────────────────────────────────────────────────────── */

let activeCategoryId = STAT_CATEGORIES[0].id;

/* ─── Initialisation ─────────────────────────────────────────────────────── */

document.addEventListener("DOMContentLoaded", () => {
  renderProfileActions();
  renderCharacterHeader();
  renderStatTabs();
  renderStatTable(activeCategoryId);
  renderSummaryCards();
  renderEquipmentItems();
  renderScreenshotGallery();
  updateCalculatorPanel();

  document.getElementById("skill-multiplier")
    .addEventListener("input", updateCalculatorPanel);
  document.getElementById("roll-damage-btn")
    .addEventListener("click", onRollDamage);
  document.getElementById("lightbox").addEventListener("click", () => {
    document.getElementById("lightbox").style.display = "none";
  });

  // Profile modal close
  document.getElementById("profile-modal-close").addEventListener("click", closeProfileModal);
  document.getElementById("profile-modal-overlay").addEventListener("click", closeProfileModal);

  // Copy share code
  document.getElementById("profile-copy-btn").addEventListener("click", () => {
    const code = document.getElementById("profile-code-ta").value;
    navigator.clipboard.writeText(code).then(() => {
      const btn = document.getElementById("profile-copy-btn");
      btn.textContent = "✅ Copied!";
      setTimeout(() => { btn.textContent = "📋 Copy Code"; }, 1500);
    });
  });

  // Import from pasted code
  document.getElementById("profile-import-btn").addEventListener("click", () => {
    const code = document.getElementById("profile-code-ta").value.trim();
    if (deserializeProfile(code)) {
      closeProfileModal();
      refreshAll();
    } else {
      alert("❌ Invalid profile code. Please paste a valid share code.");
    }
  });
});

/* ─── Full re-render helper ──────────────────────────────────────────────── */

function refreshAll() {
  renderCharacterHeader();
  renderSummaryCards();
  renderStatTable(activeCategoryId);
  renderEquipmentItems();
  updateCalculatorPanel();
}

/* ─── Profile actions ────────────────────────────────────────────────────── */

function renderProfileActions() {
  const el = document.getElementById("profile-actions");
  if (!el) return;
  el.innerHTML = `
    <div class="profile-actions">
      <button class="btn btn--sm" id="edit-toggle-btn">✏️ Edit Stats</button>
      <button class="btn btn--sm btn--outline" id="share-btn">🔗 Share Profile</button>
      <button class="btn btn--sm btn--outline" id="import-btn">📥 Import Profile</button>
      <button class="btn btn--sm btn--ghost" id="reset-btn">🔄 Reset to Default</button>
    </div>
  `;

  document.getElementById("edit-toggle-btn").addEventListener("click", toggleEditMode);
  document.getElementById("share-btn").addEventListener("click", openShareModal);
  document.getElementById("import-btn").addEventListener("click", openImportModal);
  document.getElementById("reset-btn").addEventListener("click", () => {
    if (confirm("Reset all stats to the bundled example profile?")) {
      resetToDefault();
      if (isEditMode) { isEditMode = false; }
      refreshAll();
      renderProfileActions();
    }
  });
}

/* ─── Edit mode ──────────────────────────────────────────────────────────── */

function toggleEditMode() {
  isEditMode = !isEditMode;
  const btn = document.getElementById("edit-toggle-btn");
  if (btn) btn.textContent = isEditMode ? "📄 View Stats" : "✏️ Edit Stats";
  renderCharacterHeader();
  renderStatTable(activeCategoryId);
  renderEquipmentItems();
}

/* ─── Share / Import modal ───────────────────────────────────────────────── */

function openShareModal() {
  document.getElementById("profile-code-ta").value = serializeProfile();
  document.getElementById("profile-modal-title").textContent = "🔗 Share Profile";
  document.getElementById("profile-modal").style.display = "flex";
}

function openImportModal() {
  document.getElementById("profile-code-ta").value = "";
  document.getElementById("profile-modal-title").textContent = "📥 Import Profile";
  document.getElementById("profile-modal").style.display = "flex";
}

function closeProfileModal() {
  document.getElementById("profile-modal").style.display = "none";
}

/* ─── Character header ───────────────────────────────────────────────────── */

function renderCharacterHeader() {
  const el = document.getElementById("character-header");
  if (!el) return;
  const s = activeStats;

  const metaFields = [
    { key: "name",   label: "Name",   val: s.name   },
    { key: "level",  label: "Level",  val: s.level  },
    { key: "sect",   label: "Sect",   val: s.sect   },
    { key: "server", label: "Server", val: s.server },
  ];

  const metaHtml = isEditMode
    ? metaFields.map(f => `
        <label class="meta-edit-label">
          <span>${f.label}</span>
          <input class="meta-edit-input" data-meta="${f.key}" value="${f.val}" />
        </label>`).join("")
    : `
        <span class="char-name">${s.name}</span>
        <span class="char-level">Lv.${s.level}</span>
        <span class="char-sect">Sect: ${s.sect}</span>
        <span class="char-server">${s.server}</span>`;

  el.innerHTML = `
    <div class="char-meta">${metaHtml}</div>
    <div class="char-totals">
      <div class="total-stat">
        <span class="total-label">Effective ATK</span>
        <span class="total-value">${fmt(getEffectiveAtk(activeStats, activeEquipment))}</span>
      </div>
      <div class="total-stat">
        <span class="total-label">Effective HP</span>
        <span class="total-value">${fmt(getEffectiveHp(activeStats, activeEquipment))}</span>
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

  if (isEditMode) {
    el.querySelectorAll(".meta-edit-input").forEach(input => {
      input.addEventListener("change", e => {
        const key = e.target.dataset.meta;
        const raw = e.target.value;
        activeStats[key] = key === "level" ? (Number(raw) || 0) : raw;
        renderCharacterHeader();
        renderSummaryCards();
        updateCalculatorPanel();
      });
    });
  }
}

/* ─── Summary cards ──────────────────────────────────────────────────────── */

function renderSummaryCards() {
  const el = document.getElementById("summary-cards");
  if (!el) return;
  const s = activeStats;

  const cards = [
    { icon: "⚔️",  label: "Effective ATK",        value: fmt(getEffectiveAtk(activeStats, activeEquipment)) },
    { icon: "❤️",  label: "Effective HP",          value: fmt(getEffectiveHp(activeStats, activeEquipment)) },
    { icon: "🎯",  label: "Crit Rate",             value: fmtPct(s.honing.critRate) },
    { icon: "💥",  label: "Crit DMG",              value: fmtPct(s.honing.critDmg) },
    { icon: "⚡",  label: "Ultra Crit Rate",       value: fmtPct(s.honing.ultraCritRate) },
    { icon: "🔥",  label: "Ultra Crit DMG",        value: fmtPct(s.honing.ultraCritDmg) },
    {
      icon: "📈",  label: "Total ATK Increase",
      value: fmtPct(
        s.mastery.atkIncrease +
        s.herb.atkIncrease +
        s.equipment.atkIncrease +
        s.buff.atkIncrease +
        s.buff.additionalAtkIncrease +
        s.bloodEnergy.atkIncrease +
        s.promotion.atkIncrease +
        s.trait.atkIncrease +
        s.innerCore.atkIncrease +
        s.offering.temple1AtkIncrease +
        s.offering.temple2AtkIncrease +
        s.offering.temple3AtkIncrease +
        s.skill.skinsAtkIncrease
      ),
    },
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
  const data = activeStats[categoryId];

  if (isEditMode) {
    el.innerHTML = `
      <div class="stat-table-header">
        <span>${cat.icon} ${cat.label}</span>
        <span>Value</span>
      </div>
      ${cat.rows.map(row => {
        if (row.isHeader) {
          return `<div class="stat-table-group-header">${row.label}</div>`;
        }
        return `
          <div class="stat-table-row">
            <span class="stat-table-label">${row.label}</span>
            <input
              class="stat-edit-input"
              type="number"
              step="any"
              data-cat="${categoryId}"
              data-key="${row.key}"
              value="${data[row.key]}"
            />
          </div>`;
      }).join("")}
    `;

    el.querySelectorAll(".stat-edit-input").forEach(input => {
      input.addEventListener("change", e => {
        const { cat: catId, key } = e.target.dataset;
        activeStats[catId][key] = parseFloat(e.target.value) || 0;
        renderCharacterHeader();
        renderSummaryCards();
        updateCalculatorPanel();
      });
    });
  } else {
    el.innerHTML = `
      <div class="stat-table-header">
        <span>${cat.icon} ${cat.label}</span>
        <span>Value</span>
      </div>
      ${cat.rows.map(row => {
        if (row.isHeader) {
          return `<div class="stat-table-group-header">${row.label}</div>`;
        }
        return `
          <div class="stat-table-row">
            <span class="stat-table-label">${row.label}</span>
            <span class="stat-table-value">${row.fmt(data[row.key])}</span>
          </div>`;
      }).join("")}
    `;
  }
}

/* ─── Equipment items ────────────────────────────────────────────────────── */

function renderEquipmentItems() {
  const el = document.getElementById("equipment-items");
  if (!el) return;

  el.innerHTML = EQUIP_ITEM_DEFS.map(def => {
    const item = activeEquipment[def.key];
    const equipActiveClass = item.equipped ? " equip-state--on" : "";
    const holdActiveClass  = item.held     ? " equip-state--on" : "";

    const makeRows = (effects, rows) => rows.map(row => {
      const val = effects[row.key];
      if (isEditMode) {
        return `
          <div class="equip-stat-row">
            <span class="equip-stat-label">${row.label}</span>
            <input
              class="stat-edit-input equip-edit-input"
              type="number"
              step="any"
              data-item="${def.key}"
              data-effect="${effects === item.equipEffect ? 'equipEffect' : 'holdingEffect'}"
              data-key="${row.key}"
              value="${val}"
            />
          </div>`;
      }
      return `
        <div class="equip-stat-row">
          <span class="equip-stat-label">${row.label}</span>
          <span class="equip-stat-value">${row.fmt(val)}</span>
        </div>`;
    }).join("");

    return `
      <div class="equip-card">
        <div class="equip-card-header">
          <span class="equip-card-icon">${item.icon}</span>
          <span class="equip-card-name">${item.name}</span>
        </div>

        <div class="equip-effect-block">
          <div class="equip-effect-label-row">
            <span class="equip-effect-title">Equip Effect</span>
            <label class="equip-toggle${equipActiveClass}">
              <input
                type="checkbox"
                class="equip-checkbox"
                data-item="${def.key}"
                data-field="equipped"
                ${item.equipped ? "checked" : ""}
              />
              <span>${item.equipped ? "Equipped" : "Not Equipped"}</span>
            </label>
          </div>
          <div class="equip-stats${item.equipped ? "" : " equip-stats--inactive"}">
            ${makeRows(item.equipEffect, def.equipRows)}
          </div>
        </div>

        <div class="equip-effect-block">
          <div class="equip-effect-label-row">
            <span class="equip-effect-title">Holding Effect</span>
            <label class="equip-toggle${holdActiveClass}">
              <input
                type="checkbox"
                class="equip-checkbox"
                data-item="${def.key}"
                data-field="held"
                ${item.held ? "checked" : ""}
              />
              <span>${item.held ? "Held" : "Not Held"}</span>
            </label>
          </div>
          <div class="equip-stats${item.held ? "" : " equip-stats--inactive"}">
            ${makeRows(item.holdingEffect, def.holdingRows)}
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Toggle equipped / held
  el.querySelectorAll(".equip-checkbox").forEach(cb => {
    cb.addEventListener("change", e => {
      const { item, field } = e.target.dataset;
      activeEquipment[item][field] = e.target.checked;
      renderEquipmentItems();
      renderCharacterHeader();
      renderSummaryCards();
      updateCalculatorPanel();
    });
  });

  // Edit equipment effect values
  el.querySelectorAll(".equip-edit-input").forEach(input => {
    input.addEventListener("change", e => {
      const { item, effect, key } = e.target.dataset;
      activeEquipment[item][effect][key] = parseFloat(e.target.value) || 0;
      renderCharacterHeader();
      renderSummaryCards();
      updateCalculatorPanel();
    });
  });
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
  const range = getDamageRange(skillMult, activeStats, activeEquipment);
  const s = activeStats;

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
  const result = calculateDamage({ skillMultiplier: skillMult, stats: activeStats, equipment: activeEquipment });

  const rollEl = document.getElementById("roll-result");
  rollEl.style.display = "";

  const labels = { normal: "⚔️ Normal Hit!", crit: "💥 Critical Hit!", ultra: "🌟 ULTRA Critical Hit!" };
  const cssClasses = { normal: "", crit: " roll-result--crit", ultra: " roll-result--ultra" };

  rollEl.className = "roll-result" + cssClasses[result.hitType];
  rollEl.innerHTML = `${labels[result.hitType]} <strong>${result.finalDamage.toLocaleString()}</strong> damage`;

  rollEl.classList.add("roll-result--flash");
  setTimeout(() => rollEl.classList.remove("roll-result--flash"), 400);
}
