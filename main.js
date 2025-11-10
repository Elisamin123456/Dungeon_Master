/* ==== 基础常量 ==== */
import { EQUIPMENT_DATA, EQUIPMENT_IDS, ITEM_TIERS } from "./equipmentData.js";

const GAME_WIDTH = 640;
const GAME_HEIGHT = 480;
const MAP_TILES = 64;
const TILE_SIZE = 16;
const WALL_COLLISION_MARGIN = 1;
const ENEMY_NAV_RECALC_INTERVAL_MS = 450;
const ENEMY_PATH_NODE_REACHED_THRESHOLD = TILE_SIZE * 0.35;
const ENEMY_PATH_MAX_EXPANSION = MAP_TILES * MAP_TILES;
const ENEMY_STUCK_MOVE_EPSILON = 1;
const ENEMY_STUCK_TIMEOUT_MS = 60;
const ENEMY_STUCK_IGNORE_RADIUS = TILE_SIZE;
const ENEMY_STUCK_NUDGE_SPEED_MIN = 30;
const ENEMY_STUCK_NUDGE_DURATION_MS = 20;
const WORLD_SIZE = MAP_TILES * TILE_SIZE;
const CAMERA_ZOOM = 2;
const CAMERA_ZOOM_MIN = 1;
const CAMERA_ZOOM_MAX = 3.5;
const CAMERA_ZOOM_STEP = 0.25;
const Q_TALISMAN_SPEED = 100;
const Q_TALISMAN_BOUNDARY_PADDING = 16;
// Q施法瞄准指示器参数
const Q_AIM_CONE_ANGLE_DEG = 30;            // 前方扇形角度
const Q_AIM_RADIUS = 8 * TILE_SIZE;         // 扇形半径（以格为单位换算像素）

const EQUIPMENT_SLOT_COUNT = 6;
const BROKEN_KINGS_BLADE_ID = "brokenKingsBlade";
const WITS_END_ID = "witsEnd";
const NASHORS_TOOTH_ID = "nashorsTooth";
const GUINSOOS_RAGEBLADE_ID = "guinsosRageblade";
const HEARTSTEEL_ID = "heartsteel";
const DARK_SEAL_ID = "darkSeal";
const THORNMAIL_ID = "thornmail";
const LOST_CHAPTER_ID = "lostChapter";
const TEAR_OF_THE_GODDESS_ID = "tearOfTheGoddess";
const SERAPHS_EMBRACE_ID = "seraphsEmbrace";
const BAILOU_SWORD_ID = "bailouSword";
const RUNAANS_HURRICANE_ID = "runaansHurricane";
const TIAMAT_ID = "tiamat";
const TITANIC_HYDRA_ID = "titanicHydra";
const BAMIS_CINDER_ID = "bamisCinder";
const SUNFIRE_AEGIS_ID = "sunfireAegis";
// New item IDs used for effects below
const RECURVE_BOW_ID = "recurveBow";
const HEXTECH_ALTERNATOR_ID = "hextechAlternator";
const LIANDRYS_ANGUISH_ID = "liandrysAnguish";
const INFINITY_ORB_ID = "infinityOrb";
const RIFTMAKER_ID = "riftmaker";
// 新增：本次实现涉及的装备 ID
const RABADONS_DEATHCAP_ID = "rabadonsDeathcap";     // 灭世者的死亡之帽
const NAVORI_QUICKBLADES_ID = "navoriQuickblades";   // 讯刃
const THE_COLLECTOR_ID = "theCollector";             // 收集者
const SOULSTEALER_CODEX_ID = "soulstealerCodex";
// Consumables
const HEALTH_POTION_ID = "healthPotion";
const REFILLABLE_POTION_ID = "refillablePotion";
const EQUIPMENT_TOOLTIP_DEFAULT = "查看鼠标移动到的位置";
const DEBUG_INITIAL_RANK = 11;
const DEBUG_SCENARIO = (() => {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    const params = new URLSearchParams(window.location.search);
    const hash = (window.location.hash || "").toLowerCase();
    return params.has("debug") || hash.includes("debug");
  } catch (error) {
    console.warn("Failed to parse debug flag", error); // eslint-disable-line no-console
    return false;
  }
})();

/* ==== Boss 调试开关与测试配置 ==== */
const DEBUG_BOSS = (() => {
  if (typeof window === "undefined") return false;
  try {
    const params = new URLSearchParams(window.location.search);
    const hash = (window.location.hash || "").toLowerCase();
    return (params.get("debug") === "boss")
      || params.has("boss")
      || params.has("bossDebug")
      || hash.includes("debug-boss")
      || hash.includes("bossdebug");
  } catch (error) {
    console.warn("Failed to parse boss debug flag", error); // eslint-disable-line no-console
    return false;
  }
})();

const DEBUG_SHOP = (() => {
  if (typeof window === "undefined") return false;
  try {
    const params = new URLSearchParams(window.location.search);
    const hash = (window.location.hash || "").toLowerCase();
    return params.get("debug") === "shop"
      || params.has("shop")
      || hash.includes("debug-shop")
      || hash.includes("shopdebug");
  } catch (error) {
    console.warn("Failed to parse shop debug flag", error); // eslint-disable-line no-console
    return false;
  }
})();

const SHOP_ITEM_COUNT = 3;
const SHOP_REFRESH_COST = 10; // 初始刷新费用（动态刷新将基于此值）
const SHOP_DEBUG_START_GOLD = 100000;

// ===== 碎片商店：数据与常量 =====
const SHARD_RARITIES = Object.freeze({ BASIC: "basic", MID: "mid", EPIC: "epic", LEGENDARY: "legendary" });
const SHARD_COSTS = Object.freeze({
  [SHARD_RARITIES.BASIC]: 300,
  [SHARD_RARITIES.MID]: 800,
  [SHARD_RARITIES.EPIC]: 1200,
  [SHARD_RARITIES.LEGENDARY]: 3500,
});

// 通用碎片图标（复用Powerup）
const SHARD_ICON = "assets/item/legendary/Powerup.png";

// 碎片定义（仅用于商店与结算，直接作用于面板，无需进入装备栏）
// 说明：百分比字段统一使用 0~1 小数表示。
const SHARDS = [
  // Basic (300G)
  { id: "shard_ad_basic",        name: "攻击碎片",   rarity: SHARD_RARITIES.BASIC,      cost: SHARD_COSTS.basic,     icon: SHARD_ICON, description: ["攻击力 +10"],                                  effects: { attackDamageFlat: 10 } },
  { id: "shard_as_basic",        name: "攻速碎片",   rarity: SHARD_RARITIES.BASIC,      cost: SHARD_COSTS.basic,     icon: SHARD_ICON, description: ["攻速 +15%"],                                  effects: { attackSpeedPct: 0.15 } },
  { id: "shard_hp_basic",        name: "生命碎片",   rarity: SHARD_RARITIES.BASIC,      cost: SHARD_COSTS.basic,     icon: SHARD_ICON, description: ["生命值 +100"],                                 effects: { maxHpFlat: 100 } },
  { id: "shard_ar_basic",        name: "护甲碎片",   rarity: SHARD_RARITIES.BASIC,      cost: SHARD_COSTS.basic,     icon: SHARD_ICON, description: ["护甲 +15"],                                   effects: { armorFlat: 15 } },
  { id: "shard_def_basic",       name: "防御碎片",   rarity: SHARD_RARITIES.BASIC,      cost: SHARD_COSTS.basic,     icon: SHARD_ICON, description: ["防御 +5"],                                    effects: { defenseFlat: 5 } },
  { id: "shard_ms_basic",        name: "移速碎片",   rarity: SHARD_RARITIES.BASIC,      cost: SHARD_COSTS.basic,     icon: SHARD_ICON, description: ["速度 +10"],                                   effects: { moveSpeedFlat: 10 } },
  { id: "shard_haste_basic",     name: "冷却碎片",   rarity: SHARD_RARITIES.BASIC,      cost: SHARD_COSTS.basic,     icon: SHARD_ICON, description: ["技能急速 +10"],                               effects: { abilityHaste: 10 } },
  { id: "shard_mana_basic",      name: "法力碎片",   rarity: SHARD_RARITIES.BASIC,      cost: SHARD_COSTS.basic,     icon: SHARD_ICON, description: ["法力值 +100"],                                 effects: { maxManaFlat: 100 } },
  { id: "shard_ap_basic",        name: "魔法碎片",   rarity: SHARD_RARITIES.BASIC,      cost: SHARD_COSTS.basic,     icon: SHARD_ICON, description: ["法术强度 +20"],                                effects: { abilityPowerFlat: 20 } },
  { id: "shard_cr_basic",        name: "暴击碎片",   rarity: SHARD_RARITIES.BASIC,      cost: SHARD_COSTS.basic,     icon: SHARD_ICON, description: ["暴击率 +8%"],                                  effects: { critChancePct: 0.08 } },
  { id: "shard_heal_basic",      name: "治疗碎片",   rarity: SHARD_RARITIES.BASIC,      cost: SHARD_COSTS.basic,     icon: SHARD_ICON, description: ["生命回复 +10/秒"],                             effects: { hpRegenPerSecond: 10 } },

  // Mid (800G)
  { id: "shard_ad_mid",          name: "攻击碎片",   rarity: SHARD_RARITIES.MID,        cost: SHARD_COSTS.mid,       icon: SHARD_ICON, description: ["攻击力 +30"],                                  effects: { attackDamageFlat: 30 } },
  { id: "shard_as_mid",          name: "攻速碎片",   rarity: SHARD_RARITIES.MID,        cost: SHARD_COSTS.mid,       icon: SHARD_ICON, description: ["攻速 +45%"],                                  effects: { attackSpeedPct: 0.45 } },
  { id: "shard_hp_mid",          name: "生命碎片",   rarity: SHARD_RARITIES.MID,        cost: SHARD_COSTS.mid,       icon: SHARD_ICON, description: ["生命值 +300"],                                 effects: { maxHpFlat: 300 } },
  { id: "shard_ar_mid",          name: "护甲碎片",   rarity: SHARD_RARITIES.MID,        cost: SHARD_COSTS.mid,       icon: SHARD_ICON, description: ["护甲 +45"],                                   effects: { armorFlat: 45 } },
  { id: "shard_def_mid",         name: "防御碎片",   rarity: SHARD_RARITIES.MID,        cost: SHARD_COSTS.mid,       icon: SHARD_ICON, description: ["防御 +15"],                                   effects: { defenseFlat: 15 } },
  { id: "shard_ms_mid",          name: "移速碎片",   rarity: SHARD_RARITIES.MID,        cost: SHARD_COSTS.mid,       icon: SHARD_ICON, description: ["速度 +30"],                                   effects: { moveSpeedFlat: 30 } },
  { id: "shard_haste_mid",       name: "冷却碎片",   rarity: SHARD_RARITIES.MID,        cost: SHARD_COSTS.mid,       icon: SHARD_ICON, description: ["技能急速 +30"],                               effects: { abilityHaste: 30 } },
  { id: "shard_mana_mid",        name: "法力碎片",   rarity: SHARD_RARITIES.MID,        cost: SHARD_COSTS.mid,       icon: SHARD_ICON, description: ["法力值 +300"],                                 effects: { maxManaFlat: 300 } },
  { id: "shard_ap_mid",          name: "魔法碎片",   rarity: SHARD_RARITIES.MID,        cost: SHARD_COSTS.mid,       icon: SHARD_ICON, description: ["法术强度 +60"],                                effects: { abilityPowerFlat: 60 } },
  { id: "shard_cr_mid",          name: "暴击碎片",   rarity: SHARD_RARITIES.MID,        cost: SHARD_COSTS.mid,       icon: SHARD_ICON, description: ["暴击率 +24%"],                                 effects: { critChancePct: 0.24 } },
  { id: "shard_heal_mid",        name: "治疗碎片",   rarity: SHARD_RARITIES.MID,        cost: SHARD_COSTS.mid,       icon: SHARD_ICON, description: ["生命回复 +30/秒"],                             effects: { hpRegenPerSecond: 30 } },
  { id: "shard_arp_mid",         name: "穿甲碎片",   rarity: SHARD_RARITIES.MID,        cost: SHARD_COSTS.mid,       icon: SHARD_ICON, description: ["护甲穿透 +15"],                               effects: { armorPenFlat: 15 } },
  { id: "shard_onhit_mid",       name: "特效碎片",   rarity: SHARD_RARITIES.MID,        cost: SHARD_COSTS.mid,       icon: SHARD_ICON, description: ["普攻特效伤害 +30"],                           effects: { onHitPhysicalFlat: 30 } },

  // Epic (1200G)
  { id: "shard_ad_epic",         name: "攻击碎片",   rarity: SHARD_RARITIES.EPIC,       cost: SHARD_COSTS.epic,      icon: SHARD_ICON, description: ["攻击力 +20%"],                                 effects: { attackDamagePct: 0.20 } },
  { id: "shard_as_epic",         name: "攻速碎片",   rarity: SHARD_RARITIES.EPIC,       cost: SHARD_COSTS.epic,      icon: SHARD_ICON, description: ["攻速 +75%"],                                  effects: { attackSpeedPct: 0.75 } },
  { id: "shard_hp_epic",         name: "生命碎片",   rarity: SHARD_RARITIES.EPIC,       cost: SHARD_COSTS.epic,      icon: SHARD_ICON, description: ["生命值 +20%"],                                 effects: { maxHpPct: 0.20 } },
  { id: "shard_ar_epic",         name: "护甲碎片",   rarity: SHARD_RARITIES.EPIC,       cost: SHARD_COSTS.epic,      icon: SHARD_ICON, description: ["护甲 +50%"],                                  effects: { armorPct: 0.50 } },
  { id: "shard_def_epic",        name: "防御碎片",   rarity: SHARD_RARITIES.EPIC,       cost: SHARD_COSTS.epic,      icon: SHARD_ICON, description: ["防御 +25"],                                   effects: { defenseFlat: 25 } },
  { id: "shard_ms_epic",         name: "移速碎片",   rarity: SHARD_RARITIES.EPIC,       cost: SHARD_COSTS.epic,      icon: SHARD_ICON, description: ["速度 +50%"],                                  effects: { moveSpeedPct: 0.50 } },
  { id: "shard_haste_epic",      name: "冷却碎片",   rarity: SHARD_RARITIES.EPIC,       cost: SHARD_COSTS.epic,      icon: SHARD_ICON, description: ["技能急速 +50"],                               effects: { abilityHaste: 50 } },
  { id: "shard_mana_epic",       name: "法力碎片",   rarity: SHARD_RARITIES.EPIC,       cost: SHARD_COSTS.epic,      icon: SHARD_ICON, description: ["法力值 +50%"],                                 effects: { maxManaPct: 0.50 } },
  { id: "shard_ap_epic",         name: "魔法碎片",   rarity: SHARD_RARITIES.EPIC,       cost: SHARD_COSTS.epic,      icon: SHARD_ICON, description: ["法术强度 +20%"],                               effects: { abilityPowerPct: 0.20 } },
  { id: "shard_cr_epic",         name: "暴击碎片",   rarity: SHARD_RARITIES.EPIC,       cost: SHARD_COSTS.epic,      icon: SHARD_ICON, description: ["暴击率 +40%"],                                 effects: { critChancePct: 0.40 } },
  { id: "shard_heal_epic",       name: "治疗碎片",   rarity: SHARD_RARITIES.EPIC,       cost: SHARD_COSTS.epic,      icon: SHARD_ICON, description: ["生命回复 +50/秒"],                             effects: { hpRegenPerSecond: 50 } },
  { id: "shard_arp_epic",        name: "穿甲碎片",   rarity: SHARD_RARITIES.EPIC,       cost: SHARD_COSTS.epic,      icon: SHARD_ICON, description: ["护甲穿透 +20 + 50%"],                         effects: { armorPenFlat: 20, armorPenPct: 0.50 } },
  { id: "shard_onhit_epic",      name: "特效碎片",   rarity: SHARD_RARITIES.EPIC,       cost: SHARD_COSTS.epic,      icon: SHARD_ICON, description: ["普攻特效伤害 +40 + 40% 攻击力"],               effects: { onHitPhysicalFlat: 40, onHitAdRatio: 0.40 } },

  // Legendary (3500G)
  { id: "shard_ad_legendary",    name: "攻击碎片",   rarity: SHARD_RARITIES.LEGENDARY,  cost: SHARD_COSTS.legendary, icon: SHARD_ICON, description: ["攻击力 +60%"],                                 effects: { attackDamagePct: 0.60 } },
  { id: "shard_as_legendary",    name: "攻速碎片",   rarity: SHARD_RARITIES.LEGENDARY,  cost: SHARD_COSTS.legendary, icon: SHARD_ICON, description: ["攻速 +150%"],                                 effects: { attackSpeedPct: 1.50 } },
  { id: "shard_hp_legendary",    name: "生命碎片",   rarity: SHARD_RARITIES.LEGENDARY,  cost: SHARD_COSTS.legendary, icon: SHARD_ICON, description: ["生命值 +60%"],                                 effects: { maxHpPct: 0.60 } },
  { id: "shard_ar_legendary",    name: "护甲碎片",   rarity: SHARD_RARITIES.LEGENDARY,  cost: SHARD_COSTS.legendary, icon: SHARD_ICON, description: ["护甲 +150%"],                                 effects: { armorPct: 1.50 } },
  { id: "shard_def_legendary",   name: "防御碎片",   rarity: SHARD_RARITIES.LEGENDARY,  cost: SHARD_COSTS.legendary, icon: SHARD_ICON, description: ["防御 +80"],                                   effects: { defenseFlat: 80 } },
  { id: "shard_ms_legendary",    name: "移速碎片",   rarity: SHARD_RARITIES.LEGENDARY,  cost: SHARD_COSTS.legendary, icon: SHARD_ICON, description: ["速度 +100%"],                                 effects: { moveSpeedPct: 1.00 } },
  { id: "shard_haste_legendary", name: "冷却碎片",   rarity: SHARD_RARITIES.LEGENDARY,  cost: SHARD_COSTS.legendary, icon: SHARD_ICON, description: ["技能急速 +150"],                              effects: { abilityHaste: 150 } },
  { id: "shard_mana_legendary",  name: "法力碎片",   rarity: SHARD_RARITIES.LEGENDARY,  cost: SHARD_COSTS.legendary, icon: SHARD_ICON, description: ["法力值 +150%"],                                effects: { maxManaPct: 1.50 } },
  { id: "shard_ap_legendary",    name: "魔法碎片",   rarity: SHARD_RARITIES.LEGENDARY,  cost: SHARD_COSTS.legendary, icon: SHARD_ICON, description: ["法术强度 +60%"],                               effects: { abilityPowerPct: 0.60 } },
  { id: "shard_cd_legendary",    name: "暴击碎片",   rarity: SHARD_RARITIES.LEGENDARY,  cost: SHARD_COSTS.legendary, icon: SHARD_ICON, description: ["暴击伤害 +100%"] ,                           effects: { critDamageBonusPct: 1.00 } },
  { id: "shard_heal_legendary",  name: "治疗碎片",   rarity: SHARD_RARITIES.LEGENDARY,  cost: SHARD_COSTS.legendary, icon: SHARD_ICON, description: ["生命回复 +150/秒"],                            effects: { hpRegenPerSecond: 150 } },
  { id: "shard_arp_legendary",   name: "穿甲碎片",   rarity: SHARD_RARITIES.LEGENDARY,  cost: SHARD_COSTS.legendary, icon: SHARD_ICON, description: ["护甲穿透 +60 + 70%"],                        effects: { armorPenFlat: 60, armorPenPct: 0.70 } },
  { id: "shard_onhit_legendary", name: "特效碎片",   rarity: SHARD_RARITIES.LEGENDARY,  cost: SHARD_COSTS.legendary, icon: SHARD_ICON, description: ["普攻特效伤害 +120 + 70% 攻击力"],            effects: { onHitPhysicalFlat: 120, onHitAdRatio: 0.70 } },
];

const SHARD_BY_ID = Object.freeze(Object.fromEntries(SHARDS.map(s => [s.id, { ...s, isShard: true }])));


const decodeUnicodeString = (value) => {
  if (typeof value !== "string" || value.length === 0) return value;
  return value
    .replace(/\\u([0-9a-fA-F]{4})/g, (_match, hex) => String.fromCharCode(Number.parseInt(hex, 16)))
    .replace(/\\n/g, "\n");
};

Object.values(EQUIPMENT_DATA).forEach((item) => {
  if (item?.name) item.name = decodeUnicodeString(item.name);
  if (Array.isArray(item?.description)) {
    item.description = item.description.map((line) => decodeUnicodeString(line));
  }
});

const SHOP_TEXT = Object.freeze({
  title: "属性碎片商店",
  goldPrefix: "金币：",
  // 刷新按钮文案在运行时动态更新，这里只作占位
  refresh: `刷新 (-${SHOP_REFRESH_COST})`,
  continueRun: "继续",
  exitRun: "结束探险",
  notEnoughGold: "金币不足。",
  inventoryFull: "库存已满。",
  offerPurchased: "已购买",
  offerUnavailable: "商品不可用。",
  refreshed: "列表已刷新。",
});

const ITEMS_BY_TIER = Object.freeze({
  [ITEM_TIERS.BASIC]: Object.values(EQUIPMENT_DATA).filter((item) => item.tier === ITEM_TIERS.BASIC),
  [ITEM_TIERS.MID]: Object.values(EQUIPMENT_DATA).filter((item) => item.tier === ITEM_TIERS.MID),
  [ITEM_TIERS.LEGENDARY]: Object.values(EQUIPMENT_DATA).filter((item) => item.tier === ITEM_TIERS.LEGENDARY),
});

const EQUIPMENT_COST_CACHE = Object.freeze(
  Object.fromEntries(
    Object.entries(EQUIPMENT_DATA).map(([id, item]) => [id, item.cost]),
  ),
);

const EQUIPMENT_SELL_PRICE_CACHE = Object.freeze(
  Object.fromEntries(
    Object.entries(EQUIPMENT_DATA).map(([id, item]) => [id, item.sellPrice]),
  ),
);

const EQUIPMENT_NAME_CACHE = Object.freeze(
  Object.fromEntries(
    Object.entries(EQUIPMENT_DATA).map(([id, item]) => [id, item.name]),
  ),
);

const shopRandom = () => {
  try {
    const globalCrypto = typeof crypto !== "undefined" ? crypto : (typeof window !== "undefined" ? window.crypto : undefined);
    if (globalCrypto?.getRandomValues) {
      const buffer = new Uint32Array(1);
      globalCrypto.getRandomValues(buffer);
      return buffer[0] / 0x100000000;
    }
  } catch (_error) {
    // fall back to Math.random
  }
  return Math.random();
};

const randomElement = (array, rng = shopRandom) => {
  if (!Array.isArray(array) || array.length === 0) return null;
  const index = Math.floor(rng() * array.length);
  return array[index];
};

const randomSample = (array, count, rng = shopRandom) => {
  if (!Array.isArray(array) || array.length === 0 || count <= 0) return [];
  const limit = Math.min(array.length, Math.max(0, count));
  const pool = array.slice();
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = pool[i];
    pool[i] = pool[j];
    pool[j] = tmp;
  }
  return pool.slice(0, limit);
};

/* 原始 dummy Boss（保留以便其他关卡可调用） */
const BOSS_TEST_CONFIG = {
  id: "Dummy",
  textureKey: "boss_dummy",
  spritePath: "assets/enemy/dummy.png",
  name: "训练假人",
  title: "测试Boss",
  maxHp: 120000,
  armor: 200,
  tiles: 4,
  musicKey: "boss_bgm_dummy",
  musicPath: "music/boss.mp3",
};

/* ==== 新增：Utsuho Boss 配置（灵乌路空｜神之火） ==== */
const BOSS_UTSUHO_CONFIG = {
  id: "Utsuho",
  // 贴图键
  textureIdle: "utsuho_idle",
  textureMoveDown: "utsuho_movedown",
  textureMoveRight: "utsuho_moveright", // 向左时将 flipX=true
  textureDeath: "utsuho_death",
  // 基本信息
  name: "霊烏路　空",
  title: "地獄の人工太陽",
  tiles: 6, // Boss贴图大小：6格
  // 面板与战斗数值
  maxHp: 66666,
  armor: 66,
  contactDamage: 100, // 与 Boss 本体接触伤害（物理）
  bulletMagicDamage: 66, // Boss 弹幕伤害（法术）
  moveSpeed: 100,
  // 冲刺参数
  dashInitSpeed: 6,
  dashAccel: 666, // 速度加速度（单位：像素/秒^2）
  // 采样资源路径
  assets: {
    basePath: "assets/boss/Utsuho/",
    warning: "assets/boss/Utsuho/Nuclearwarning.png", // 提示贴图 16格
    bullets: {
      bigyellow: "assets/boss/Utsuho/bullet/bigyellow.png",
      blue: "assets/boss/Utsuho/bullet/blue.png",
      nuclearbomb: "assets/boss/Utsuho/bullet/nuclearbomb.png",
      nuclearhazard: "assets/boss/Utsuho/bullet/nuclearhazard.png",
      nuclearspawn: "assets/boss/Utsuho/bullet/nuclearspawn.png", // 仅贴图
      yellow: "assets/boss/Utsuho/bullet/yellow.png",
    }
  },
  // BGM（要求：生成后才播放）
  musicKey: "utsuho_bgm",
  musicPath: "music/boss.mp3",
  // 模式时长（毫秒）
  modeDurations: { m1: 41000, m2: 35000, m3: 70000, m4: 35000 },
  // 判定与尺寸（单位：格）
  hitboxes: {
    bullets: {
      bigyellow: { size: 3, judge: 1 },
      blue: { size: 1, judge: 1 },
      nuclearbomb: { size: 16, judge: 10 },
      nuclearhazard: { size: 0.5, judge: 0.5 },
      nuclearspawn: { size: 5, judge: 0 }, // 仅贴图，无判定
      yellow: { size: 3, judge: 1 },
    },
    warningSize: 64
  }
};

/* ==== Boss 注册表：便于其他关卡调用 ==== */
const BOSS_REGISTRY = {
  [BOSS_TEST_CONFIG.id]: BOSS_TEST_CONFIG,
  [BOSS_UTSUHO_CONFIG.id]: BOSS_UTSUHO_CONFIG,
};

/* ==== 装备数据 ==== */
/* ==== 回合与数值 ==== */
const ROUND_DURATION = 60000;
const NO_DAMAGE_RANK_INTERVAL = 60000;
const RANK_INITIAL = 10;
const RANK_NO_DAMAGE_MULTIPLIER = 1.1;
const ROUND_CONTINUE_RANK_BONUS = 1;
const PICKUP_ATTRACT_SPEED = 240;

const STAT_UNITS_PER_TILE = 64;
const PIXELS_PER_TILE = TILE_SIZE;
const UNIT_TO_PIXEL = PIXELS_PER_TILE / STAT_UNITS_PER_TILE;
const statUnitsToPixels = (value) => value * UNIT_TO_PIXEL;
const statUnitsToTiles = (value) => value / STAT_UNITS_PER_TILE;

/* ==== 玩家参数 ==== */
const PLAYER_BASE_SPEED = 120;
const PLAYER_FOCUS_MULTIPLIER = 0.35;
const PLAYER_MANA_MAX = 200;
const PLAYER_FOCUS_RADIUS = 2;
const PLAYER_TILE_SCALE = 2;
const PLAYER_ANIMATION_FRAME_RATE = 4;
const PLAYER_HITBOX_RADIUS = PLAYER_FOCUS_RADIUS;

/* ==== 输入绑定 ==== */
const MOVEMENT_KEY_BINDINGS = [
  { code: "W", direction: "up" },
  { code: "S", direction: "down" },
  { code: "A", direction: "left" },
  { code: "D", direction: "right" },
];

/* ==== 字体工具 ==== */
const FONT_SIZE_REGEX = /-?\d+(\.\d+)?/;
const extractFontSizeValue = (value, fallback = 16) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const m = value.match(FONT_SIZE_REGEX);
    if (m) return Number.parseFloat(m[0]);
  }
  return fallback;
};
const ensureBaseFontSize = (text) => {
  if (!text) return 16;
  const hasDataMethods =
    typeof text.getData === "function" && typeof text.setData === "function";
  if (!hasDataMethods) return extractFontSizeValue(text.style?.fontSize, 16);
  let base = text.getData("baseFontSize");
  if (base == null) {
    base = extractFontSizeValue(text.style?.fontSize, 16);
    text.setData("baseFontSize", base);
  }
  return base;
};
const setFontSizeByScale = (text, scale) => {
  if (!text || typeof text.setFontSize !== "function") return;
  const baseSize = ensureBaseFontSize(text);
  const targetSize = Math.max(1, Math.round(baseSize * scale));
  text.setFontSize(targetSize);
};

/* ==== 武器/弹幕/敌人 ==== */
const WEAPON_ORBIT_RADIUS = 25;
// 基础转速（远程/默认）。近战以此为基准体现“攻速=转速”，现应将近战初始转速提升为当前的 2 倍。
const WEAPON_ORBIT_SPEED = 180; // deg/s（基础）
const MELEE_BASE_ORBIT_SPEED_MULTIPLIER = 2; // 近战初始转速×2
// Focus(Shift) 对阴阳玉轨道的影响
const FOCUS_ORBIT_RADIUS_MULTIPLIER = 0.6; // 按住Shift时：半径缩小为60%
const FOCUS_ORBIT_SPEED_MULTIPLIER = 2;    // 按住Shift时：转速×2
// E技能形态加成：远程+20%攻速；近战将这20%转化为阴阳玉的转速
const E_RANGED_ATTACK_SPEED_MULTIPLIER = 1.2;
const BULLET_SPEED = 170;
const BULLET_LIFETIME = 4500; // ms

const ENEMY_MAX_COUNT = 100;
const ENEMY_CONTACT_DAMAGE = 45;

const ENEMY_RARITIES = Object.freeze({
  BASIC: "basic",
  MID: "mid",
  EPIC: "epic",
  LEGENDARY: "legendary",
});

const ENEMY_RARITY_SEQUENCE = Object.freeze([
  ENEMY_RARITIES.BASIC,
  ENEMY_RARITIES.MID,
  ENEMY_RARITIES.EPIC,
  ENEMY_RARITIES.LEGENDARY,
]);

const ENEMY_RARITY_WEIGHTS = Object.freeze({
  [ENEMY_RARITIES.BASIC]: 0.80,
  [ENEMY_RARITIES.MID]: 0.10,
  [ENEMY_RARITIES.EPIC]: 0.07,
  [ENEMY_RARITIES.LEGENDARY]: 0.03,
});

const ENEMY_SPAWN_RADIUS_MAX = 300;
const ENEMY_SPAWN_RADIUS_MIN = 20;
const ENEMY_SPAWN_ATTEMPTS = 36;

const ENEMY_SPAWN_DELAY_MS = 2000;

// —— 地图地点：商店与宝箱 —— //
const MAP_SHOP_COUNT = 2;
const MAP_CHEST_COUNT = 10;

const ENEMY_TYPE_CONFIG = Object.freeze({
  kedama: {
    kind: "charger",
    weight: 0.9,
    tiers: {
      [ENEMY_RARITIES.BASIC]: {
        unlockRank: 0,
        hp: 100,
        attackDamage: 50,
        abilityPower: 0,
        armor: 0,
        defense: 0,
        moveSpeed: 70,
        chargeSpeed: 100,
        detectionRadius: 300,
        windupMs: 1000,
        idleRotationSpeed: 30,
        textureKey: "enemy_kedama_basic",
        spawnEffectKey: "enemy_spawn_basic",
        scale: 0.9,
        hitRadius: 12,
        dropRange: { min: 1, max: 5 },
      },
      [ENEMY_RARITIES.MID]: {
        unlockRank: 11,
        hp: 400,
        attackDamage: 100,
        abilityPower: 0,
        armor: 0,
        defense: 0,
        moveSpeed: 80,
        chargeSpeed: 300,
        detectionRadius: 300,
        windupMs: 1000,
        idleRotationSpeed: 30,
        textureKey: "enemy_kedama_mid",
        spawnEffectKey: "enemy_spawn_mid",
        scale: 1.0,
        hitRadius: 13,
        dropRange: { min: 10, max: 20 },
      },
      [ENEMY_RARITIES.EPIC]: {
        unlockRank: 14,
        hp: 1000,
        attackDamage: 150,
        abilityPower: 0,
        armor: 0,
        defense: 0,
        moveSpeed: 95,
        chargeSpeed: 600,
        detectionRadius: 300,
        windupMs: 1000,
        idleRotationSpeed: 30,
        textureKey: "enemy_kedama_epic",
        spawnEffectKey: "enemy_spawn_epic",
        scale: 1.15,
        hitRadius: 15,
        dropRange: { min: 50, max: 80 },
      },
      [ENEMY_RARITIES.LEGENDARY]: {
        unlockRank: 17,
        hp: 3000,
        attackDamage: 300,
        abilityPower: 0,
        armor: 0,
        defense: 0,
        moveSpeed: 110,
        chargeSpeed: 100,
        detectionRadius: 300,
        windupMs: 1000,
        idleRotationSpeed: 30,
        textureKey: "enemy_kedama_legendary",
        spawnEffectKey: "enemy_spawn_legendary",
        scale: 1.5,
        hitRadius: 16,
        dropRange: { min: 200, max: 300 },
      },
    },
  },
  yousei: {
    kind: "caster",
    weight: 0.08,
    tiers: {
      [ENEMY_RARITIES.BASIC]: {
        unlockRank: 12,
        hp: 100,
        attackDamage: 10,
        abilityPower: 30,
        armor: 10,
        defense: 0,
        moveSpeed: 80,
        detectionRadius: 150,
        moveDurationMs: 0,
        attackDurationMs: 4000,
        shotIntervalMs: 200,
        spreadDeg: 45,
        bulletSpeed: 110,
        bulletTextureKey: "enemy_bullet_basic",
        textureKey: "enemy_yousei_basic",
        spawnEffectKey: "enemy_spawn_basic",
        scale: 1.0,
        hitRadius: 12,
        dropRange: { min: 10, max: 20 },
      },
      [ENEMY_RARITIES.MID]: {
        unlockRank: 15,
        hp: 100,
        attackDamage: 10,
        abilityPower: 30,
        armor: 50,
        defense: 0,
        moveSpeed: 90,
        detectionRadius: 150,
        moveDurationMs: 0,
        attackDurationMs: 4000,
        shotIntervalMs: 100,
        spreadDeg: 30,
        bulletSpeed: 120,
        bulletTextureKey: "enemy_bullet_mid",
        textureKey: "enemy_yousei_mid",
        spawnEffectKey: "enemy_spawn_mid",
        scale: 1.05,
        hitRadius: 12,
        dropRange: { min: 50, max: 80 },
      },
      [ENEMY_RARITIES.EPIC]: {
        unlockRank: 18,
        hp: 100,
        attackDamage: 10,
        abilityPower: 50,
        armor: 100,
        defense: 0,
        moveSpeed: 95,
        detectionRadius: 150,
        moveDurationMs: 0,
        attackDurationMs: 4000,
        shotIntervalMs: 50,
        spreadDeg: 25,
        bulletSpeed: 150,
        bulletTextureKey: "enemy_bullet_epic",
        textureKey: "enemy_yousei_epic",
        spawnEffectKey: "enemy_spawn_epic",
        scale: 1.1,
        hitRadius: 13,
        dropRange: { min: 80, max: 100 },
      },
      [ENEMY_RARITIES.LEGENDARY]: {
        unlockRank: 21,
        hp: 100,
        attackDamage: 10,
        abilityPower: 75,
        armor: 150,
        defense: 0,
        moveSpeed: 100,
        detectionRadius: 150,
        moveDurationMs: 0,
        attackDurationMs: 4000,
        shotIntervalMs: 10,
        spreadDeg: 20,
        bulletSpeed: 180,
        bulletTextureKey: "enemy_bullet_legendary",
        textureKey: "enemy_yousei_legendary",
        spawnEffectKey: "enemy_spawn_legendary",
        scale: 1.5,
        hitRadius: 13,
        dropRange: { min: 200, max: 300 },
      },
    },
  },
  orb: {
    kind: "turret",
    weight: 0.02,
    tiers: {
      [ENEMY_RARITIES.BASIC]: {
        unlockRank: 13,
        hp: 50,
        attackDamage: 0,
        abilityPower: 50,
        armor: 0,
        defense: 10,
        textureKey: "enemy_orb_basic",
        ringTextureKey: "enemy_orbring_basic",
        spawnEffectKey: "enemy_spawn_basic",
        scale: 1,
        hitRadius: 13,
        attackIntervalMs: 4000,
        ringBulletCount: 8,
        ringBulletSpeed: 160,
        ringBulletTextureKey: "enemy_bullet_basic",
        proximityRadius: 100,
        extraRing: { count: 20, speed: 10, textureKey: "enemy_bullet_gun" },
        extraKunai: null,
        dropRange: { min: 5, max: 15 },
      },
      [ENEMY_RARITIES.MID]: {
        unlockRank: 16,
        hp: 200,
        attackDamage: 0,
        abilityPower: 50,
        armor: 0,
        defense: 25,
        textureKey: "enemy_orb_mid",
        ringTextureKey: "enemy_orbring_mid",
        spawnEffectKey: "enemy_spawn_mid",
        scale: 1.5,
        hitRadius: 14,
        attackIntervalMs: 4000,
        ringBulletCount: 20,
        ringBulletSpeed: 80,
        ringBulletTextureKey: "enemy_bullet_mid",
        proximityRadius: 100,
        extraRing: { count: 30, speed: 30, textureKey: "enemy_bullet_gun" },
        extraKunai: null,
        dropRange: { min: 15, max: 25 },
      },
      [ENEMY_RARITIES.EPIC]: {
        unlockRank: 19,
        hp: 250,
        attackDamage: 0,
        abilityPower: 50,
        armor: 0,
        defense: 50,
        textureKey: "enemy_orb_epic",
        ringTextureKey: "enemy_orbring_epic",
        spawnEffectKey: "enemy_spawn_epic",
        scale: 1.8,
        hitRadius: 16,
        attackIntervalMs: 4000,
        ringBulletCount: 60,
        ringBulletSpeed: 40,
        ringBulletTextureKey: "enemy_bullet_epic",
        proximityRadius: 100,
        extraRing: { count: 30, speed: 30, textureKey: "enemy_bullet_gun" },
        extraKunai: {
          textureKey: "enemy_bullet_kunai",
          intervalMs: 250,
          speed: 15,
          spreadDeg: 30,
        },
        dropRange: { min: 25, max: 50 },
      },
      [ENEMY_RARITIES.LEGENDARY]: {
        unlockRank: 22,
        hp: 380,
        attackDamage: 0,
        abilityPower: 50,
        armor: 0,
        defense: 75,
        textureKey: "enemy_orb_legendary",
        ringTextureKey: "enemy_orbring_legendary",
        spawnEffectKey: "enemy_spawn_legendary",
        scale: 2,
        hitRadius: 17,
        attackIntervalMs: 2000,
        ringBulletCount: 60,
        ringBulletSpeed: 20,
        ringBulletTextureKey: "enemy_bullet_legendary",
        proximityRadius: 100,
        extraRing: { count: 30, speed: 30, textureKey: "enemy_bullet_gun" },
        extraKunai: {
          textureKey: "enemy_bullet_kunai",
          intervalMs: 50,
          speed: 15,
          spreadDeg: 30,
        },
        dropRange: { min: 50, max: 75 },
      },
    },
  },
});

/* ==== 玩家基础面板 ==== */
const PLAYER_BASE_STATS = {
  name: "博丽灵梦",
  attackDamage: 50,
  abilityPower: 0,

  attackSpeed: 1.5,
  maxHp: 300,
  maxMana: PLAYER_MANA_MAX,
  critChance: 0,
  critDamage: 150,
  defense: 0,
  armor: 0,
  moveSpeed: PLAYER_BASE_SPEED,
  range: 600,
  abilityHaste: 0,
  cooldownReduction: 0,
  armorPenFlat: 0,
};

/* ==== 预加载场景 ==== */
class PreloadScene extends Phaser.Scene {
  constructor() { super("PreloadScene"); }
  preload() {
    // 加载冰拳效果
    this.load.image("ice_effect", "assets/item/effect/ice.png");
    
    this.load.image("floor", "assets/ground/defultground.png");
    this.load.image("wall", "assets/ground/defultwall.png");
    [
      "reimu_11","reimu_12","reimu_13","reimu_14",
      "reimu_21","reimu_22","reimu_23","reimu_24",
      "reimu_31","reimu_32","reimu_33","reimu_34",
    ].forEach((k)=> this.load.image(k, `assets/player/reimu/${k}.png`));
    this.load.image("weapon", "assets/weapon/yinyangball.png");
    this.load.image("bullet", "assets/bullet/spell.png");
    // 子弹撞墙爆炸特效
    this.load.image("effect_explosion", "assets/effect/explosion.png");
    this.load.image("enemy", "assets/enemy/test_robot.png");
    this.load.image("point", "assets/item/point.png");
    this.load.image("enemy_kedama_basic", "assets/enemy/Charger/kedama_basic.png");
    this.load.image("enemy_kedama_mid", "assets/enemy/Charger/kedama_mid.png");
    this.load.image("enemy_kedama_epic", "assets/enemy/Charger/kedama_epic.png");
    this.load.image("enemy_kedama_legendary", "assets/enemy/Charger/kedama_legendary.png");
    this.load.image("enemy_yousei_basic", "assets/enemy/Caster/yousei_basic.png");
    this.load.image("enemy_yousei_mid", "assets/enemy/Caster/yousei_mid.png");
    this.load.image("enemy_yousei_epic", "assets/enemy/Caster/yousei_epic.png");
    this.load.image("enemy_yousei_legendary", "assets/enemy/Caster/yousei_legendary.png");
    this.load.image("enemy_orb_basic", "assets/enemy/Turret/orb_basic.png");
    this.load.image("enemy_orb_mid", "assets/enemy/Turret/orb_mid.png");
    this.load.image("enemy_orb_epic", "assets/enemy/Turret/orb_epic.png");
    this.load.image("enemy_orb_legendary", "assets/enemy/Turret/orb_legendary.png");
    this.load.image("enemy_orbring_basic", "assets/enemy/Turret/orbring_basic.png");
    this.load.image("enemy_orbring_mid", "assets/enemy/Turret/orbring_mid.png");
    this.load.image("enemy_orbring_epic", "assets/enemy/Turret/orbring_epic.png");
    this.load.image("enemy_orbring_legendary", "assets/enemy/Turret/orbring_legendary.png");
    this.load.image("enemy_spawn_basic", "assets/enemy/spawn/basic_spawn.png");
    this.load.image("enemy_spawn_mid", "assets/enemy/spawn/mid_spawn.png");
    this.load.image("enemy_spawn_epic", "assets/enemy/spawn/epic_spawn.png");
    this.load.image("enemy_spawn_legendary", "assets/enemy/spawn/legendary.png");

    // 地图地点：商店与宝箱
    this.load.image("place_shop", "assets/place/shop.png");
    this.load.image("place_chest", "assets/place/chest.png");
    this.load.image("enemy_bullet_basic", "assets/enemy/bullets/basic.png");
    this.load.image("enemy_bullet_mid", "assets/enemy/bullets/mid.png");
    this.load.image("enemy_bullet_epic", "assets/enemy/bullets/epic.png");
    this.load.image("enemy_bullet_legendary", "assets/enemy/bullets/legendary.png");
    this.load.image("enemy_bullet_gun", "assets/enemy/bullets/gun.png");
    this.load.image("enemy_bullet_kunai", "assets/enemy/bullets/kunai.png");
    this.load.image("itemBrokenKingsBlade", "assets/item/legendary/破败王者之刃.png");
    this.load.image("itemWitsEnd", "assets/item/legendary/智慧末刃.png");
    this.load.image("itemNashorsTooth", "assets/item/legendary/纳什之牙.png");
    this.load.image("itemGuinsoosRageblade", "assets/item/legendary/鬼索的狂暴之刃.png");
    this.load.image("item_effect_arrow", "assets/item/effect/arrow.png");
    this.load.image("item_effect_sunfire", "assets/item/effect/sunfire.png");
    this.load.image("item_effect_tiamat", "assets/item/effect/tiamat.png");
    this.load.image("item_effect_titanic", "assets/item/effect/Titanichydra.png");
    this.load.audio("utsuho_bgm", "music/boss.mp3"); 
    this.load.audio("battle_bgm", "music/battle.mp3");
    // 移除敌人charge音效加载
    this.load.audio("enemyexploded", "se/enemyexploded.wav");
    this.load.audio("itempick", "se/itempick.wav");
    this.load.audio("pause", "se/pause.wav");
    this.load.audio("playershoot", "se/playershoot.wav");
    this.load.audio("pldead", "se/pldead.wav");
    // 新增：玩家技能与受伤、普攻命中音效（不硬编码角色名，使用通用key）
    this.load.audio("player_castQ", "se/Reimu_castQ.wav");
    this.load.audio("player_castE", "se/Reimu_castE.wav");
    this.load.audio("player_castR", "se/Reimu_castR.wav");
    // Space 闪避音效
    this.load.audio("player_dash", "se/Flash.wav");
    this.load.audio("player_gethit", "se/gethit.wav");
    this.load.audio("enemyhit", "se/enemyhit.wav");
    this.load.audio("orbhit", "se/orbhit.wav");
    // 药水音效
    this.load.audio("potion", "se/Potion.wav");
    // PreloadScene.preload 内其它 this.load.* 之后追加：预载技能图（包含闪避 SPACE）
    [
      "Q","E","R","SPACE",
      "Qmelee","Qspell",
      "R1","R2","R3","R4","R5","R6","R7","R8"
    ].forEach(k=>{
      // 使用统一 key: skill_<KEY>
      try {
        this.load.image(`skill_${k}`, `assets/player/reimu/skill/${k}.png`);
      } catch (e) {
        // 忽略加载错误（路径缺失时浏览器 img fallback 仍可工作）
        // eslint-disable-next-line no-console
        console.warn("Failed to queue skill preload", k, e);
      }
    });


    /* 预载 dummy Boss 资源与BGM（保留） */
    this.load.image(BOSS_TEST_CONFIG.textureKey, BOSS_TEST_CONFIG.spritePath);
    this.load.audio(BOSS_TEST_CONFIG.musicKey, BOSS_TEST_CONFIG.musicPath);

    /* ==== 新增：预载 Utsuho 相关资源 ==== */
    // Boss 身体
    this.load.image(BOSS_UTSUHO_CONFIG.textureIdle, `${BOSS_UTSUHO_CONFIG.assets.basePath}Utsuho.png`);
    this.load.image(BOSS_UTSUHO_CONFIG.textureMoveDown, `${BOSS_UTSUHO_CONFIG.assets.basePath}Utsuho_movedown.png`);
    this.load.image(BOSS_UTSUHO_CONFIG.textureMoveRight, `${BOSS_UTSUHO_CONFIG.assets.basePath}Utsuho_moveright.png`);
    this.load.image(BOSS_UTSUHO_CONFIG.textureDeath, `${BOSS_UTSUHO_CONFIG.assets.basePath}Utsuhodeath.png`);
    // 提示框
    this.load.image("utsuho_warning", BOSS_UTSUHO_CONFIG.assets.warning);
    // 弹幕采样
    this.load.image("u_bullet_bigyellow", BOSS_UTSUHO_CONFIG.assets.bullets.bigyellow);
    this.load.image("u_bullet_blue", BOSS_UTSUHO_CONFIG.assets.bullets.blue);
    this.load.image("u_bullet_nuclearbomb", BOSS_UTSUHO_CONFIG.assets.bullets.nuclearbomb);
    this.load.image("u_bullet_nuclearhazard", BOSS_UTSUHO_CONFIG.assets.bullets.nuclearhazard);
    this.load.image("u_bullet_nuclearspawn", BOSS_UTSUHO_CONFIG.assets.bullets.nuclearspawn);
    this.load.image("u_bullet_yellow", BOSS_UTSUHO_CONFIG.assets.bullets.yellow);
    // BGM（生成后播放）
    this.load.audio(BOSS_UTSUHO_CONFIG.musicKey, BOSS_UTSUHO_CONFIG.musicPath);
  }
  create() { this.scene.start("StartScene"); }
}

/* ==== 标题场景 ==== */
class StartScene extends Phaser.Scene {
  constructor() { super("StartScene"); }
  create() {
    const { width, height } = this.scale;
    this.add.rectangle(0, 0, width, height, 0x000000, 0.45).setOrigin(0, 0).setScrollFactor(0);
    const titleText = this.add.text(width/2, height/2-40, "Dungeon Master", {
      fontFamily: '"Zpix", monospace', fontSize: "32px", color: "#ffffff",
    }).setOrigin(0.5);
    ensureBaseFontSize(titleText);
    const promptText = this.add.text(width/2, height/2+20, "点击或按 Enter 开始", {
      fontFamily: '"Zpix", monospace', fontSize: "18px", color: "#d0d0ff",
    }).setOrigin(0.5);
    ensureBaseFontSize(promptText);

    this.input.keyboard.once("keydown-ENTER", ()=> this.scene.start("GameScene"));
    this.input.once("pointerdown", ()=> this.scene.start("GameScene"));
  }
}

/* ==== 游戏场景 ==== */
class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.elapsed = 0;
    this.killCount = 0;
  }

  init() {
    this.debugMode = DEBUG_SCENARIO;
    this.debugBossMode = DEBUG_BOSS;
    this.debugShopMode = DEBUG_SHOP;
    // 关卡：从1开始，Boss关卡每20关
    this.isBossStage = false;
    // 默认从第1关开始；当使用 ?debug 时，从第11关开始便于测试中后期
    this.level = (this.debugMode ? 11 : 1); // 关卡必须是整数

    this.playerStats = { ...PLAYER_BASE_STATS };
    this.currentHp = this.playerStats.maxHp;
    this.currentMana = this.playerStats.maxMana;
    this.attackTimer = null;
    this.spawnTimer = null;
    this.weaponAngle = 0;
    this.rangeVisible = false;
    this.currentZoom = CAMERA_ZOOM;
    this.rank = this.debugMode ? DEBUG_INITIAL_RANK : 
                this.debugShopMode ? 50 : 
                RANK_INITIAL;

    // 当使用 ?boss（或等价的 boss 调试开关）时：将初始关卡与初始 rank 设为 20
    if (this.debugBossMode) {
      this.level = 20;
      this.rank = 20;
    }
    this.lastDamageTimestamp = 0;
    this.nextNoDamageRankCheck = 0;
    this.roundTimeLeft = ROUND_DURATION;
    this.roundComplete = false;
    this.roundAwaitingDecision = false;
    this.roundOverlayElements = [];
    this.roundOverlayBackground = null;
    this.roundDecisionHandler = null;
    this.playerPoints = 0;
    this.shopState = {
      isOpen: false,
      offers: [],
      reason: null,
      lastMessage: "",
      refreshCost: SHOP_REFRESH_COST, // 动态刷新费用（进入商店时重置为初始值）
    };
    this.shopUi = null;
    this.shopUiHandlers = [];
    this.shopDynamicHandlers = [];
    this.movementDirectionOrder = [];
    this.movementKeyHandlers = [];
    this.bulletTrailGroup = null;
    this.isPaused = false;
    this.pauseOverlayElements = [];
    this.pauseOverlayBackground = null;
    this.pauseDecisionHandler = null;
    // —— Q技能瞄准状态 —— //
    this.qAiming = false;           // 是否在按住Q进行瞄准
    this.qAimGraphics = null;       // Q的施法范围图形
    this.qAimAngle = Math.PI / 2;   // 当前瞄准角度（弧度）
    // —— Game Over 覆盖层 —— //
    this.isGameOver = false;
    this.gameOverOverlayElements = [];
    this.gameOverOverlayBackground = null;
    this.gameOverDecisionHandler = null;
    // Run stats for HTML overlay
    this.runStats = {
      dealtPhysical: 0,
      dealtMagic: 0,
      taken: 0,
      heal: 0,
    };
    this.qTalismans = null;
    this.lastAimAngle = Math.PI / 2;
    this.playerFacing = "down";
    this.playerAnimationKeys = { down: "player-down", left: "player-left", right: "player-left", up: "player-up" };
    this.playerIdleFrames = { down: "reimu_11", left: "reimu_21", right: "reimu_21", up: "reimu_31" };
    this.playerEquipmentSlots = new Array(EQUIPMENT_SLOT_COUNT).fill(null);
    this.playerEquipmentStats = { physicalLifeSteal: 0 };
    this.playerOnHitEffects = [];
    this.heartsteelStacks = 0;
    this.heartsteelBonusHp = 0;
    this.heartsteelGainPerKill = 0;
    this.heartsteelOwnerSlotIndex = null; // 心之钢叠层拥有者槽位（用于判定后出不继承）
    // —— 杀人书（层数与进度） —— //
    this.darkSealStacks = 0;            // 当前杀人书层数
    this.darkSealKillProgress = 0;      // 小兵击杀计数（每100换1层）
    this.darkSealOwnerSlotIndex = null; // 杀人书叠层拥有者槽位
    // —— 女神泪/炽天使 层数（释放技能叠层） —— //
    this.manaStackCount = 0;            // 当前已叠的“层数”（每层+manaPerCast 最大到cap）
    this.manaStackPerCast = 0;          // 每层提供的法力值（通常5）
    this.manaStackCap = 0;              // 可叠加的最大法力（tear=700，seraph=1400）
    this.manaSpendHealPerPoint = 0;     // 消耗法力时的治疗量/点（炽天使=1）
    // —— 消耗品：药水 —— //
    this.healthPotionCount = 0;           // 生命药水数量（最多100）
    this.healthPotionOwnerSlotIndex = null; // 生命药水所在槽位
    this.refillablePotionCharges = 0;      // 复用性药水可用次数（0~5）
    this.refillablePotionMaxCharges = 5;
    this.refillablePotionOwnerSlotIndex = null; // 复用性药水所在槽位
    // —— 白楼剑动量 —— //
    this.bailouMomentumStacks = 0;      // 当前动量层数
    this.bailouMomentumExpires = [];    // 每层过期时间戳（ms）
    this.bailouMomentumSpeedPerStack = 0; // 每层提供的平直移速
    // —— 碎片系统 —— //
    this.shardState = {
      purchases: { basic: 0, mid: 0, epic: 0, legendary: 0 },
    };
    this.shardBonuses = {
      // 平直加成
      attackDamageFlat: 0,
      attackSpeedPct: 0,
      abilityPowerFlat: 0,
      armorFlat: 0,
      defenseFlat: 0,
      maxHpFlat: 0,
      maxManaFlat: 0,
      critChancePct: 0,
      critDamageBonusPct: 0,
      moveSpeedFlat: 0,
      moveSpeedPct: 0,
      abilityHaste: 0,
      armorPenFlat: 0,
      hpRegenPerSecond: 0,
      // 乘区（百分比）
      attackDamagePct: 0,
      abilityPowerPct: 0,
      armorPct: 0,
      maxHpPct: 0,
      maxManaPct: 0,
      // 穿甲与特效
      armorPenPct: 0,
      onHitPhysicalFlat: 0,
      onHitAdRatio: 0,
    };
    this.playerSpeedBuffMultiplier = 1;
    this.playerSpeedBuffExpiresAt = 0;
    this.lastSpellbladeUsedAt = 0;  // 追踪耀光装备的冷却时间
    this.lastPotionUsedAt = 0;      // 药水使用CD时间戳
    this.equipmentCooldowns = {};    // 追踪所有装备CD: { slotIndex: { expiresAt: number, duration: number } }
    this.equipmentTriggers = {};     // 追踪装备触发状态: { slotIndex: { active: boolean, expiresAt: number } }
    this.draggedEquipmentSlot = null;
    this.equipmentUi = null;
    this.equipmentUiHandlers = [];
    this.activeEquipmentTooltipIndex = null;
    this.sfxConfig = {
      enemyexploded: { volume: 0.325 },
      itempick: { volume: 0.1 },
      pause: { volume: 0.25 },
      playershoot: { volume: 1 },
      pldead: { volume: 0.25 },
      // 新增音效默认音量
      player_castQ: { volume: 2.5 },
      player_castE: { volume: 2.5 },
      player_castR: { volume: 2.5 },
      player_dash: { volume: 0.8 },
      player_gethit: { volume: 2.5 },
      enemyhit: { volume: 1 },
      orbhit: { volume: 0.8 },
      potion: { volume: 1.2 },
    };
    // 同一种音效素材触发最小间隔（ms）
    this.sfxLastPlayed = {};
    this.sfxMinIntervalMs = 200;
// —— 技能形态与数值 —— //
this.playerCombatMode = "ranged";   // ranged | melee（E切换），初始远程
this.modeAttackSpeedMultiplier = 1; // 远程+20%攻速
this.weaponHitbox = null;           // 近战模式下，阴阳宝玉的物理判定体

// —— 技能CD/蓝耗配置 —— //
this.skillConfig = {
  Q: { baseCd: 10000, mana: 60 },
  E: { baseCd: 5000,  mana: 0  },
  R: { baseCd: 58000, mana: 180 },
  DASH: { baseCd: 5000, mana: 0, distance: 50, durationMs: 120 }
};
this.skillReadyAt = { Q:0, E:0, R:0, DASH:0 };
this.skillCooldownDuration = { Q:0, E:0, R:0, DASH:0 };

// —— 预览提示（复用已有区域，不新增 UI） —— //
this.skillTooltipTarget = null; // 复用：优先技能面板，其次 equipmentDetails

// —— R 技能：梦想妙珠 —— //
    this.mikoOrbsGroup = null;      // 物理组
    this.mikoOrbs = [];             // 实例列表

    // —— 地图地点组（商店等） —— //
    this.places = null;             // 静态物体组（商店放这里）
    this.shopPlaces = [];           // 场上商店引用

// —— 闪避与无敌 —— //
this.playerInvulnerableUntil = 0;
this.playerWallCollider = null; // 保存玩家-墙体碰撞体

    // 鬼索叠层相关
    this.guinsooStacks = 0;
    this.guinsooStacksExpireAt = 0;
    this.guinsooFullProcCounter = 0;
    this.hasGuinsoo = false;

    this.hasRunaan = false;
    this.runaanConfig = null;
    this.hasTiamat = false;
    this.tiamatCleaveRadius = 0;
    this.tiamatCleaveFlat = 0;
    this.hasTitanicHydra = false;
    this.titanicCleaveRadius = 0;
    this.titanicCleaveBonus = 0; // percent of max HP
    this.titanicCleaveFlat = 0;  // flat bonus damage
    this.auraEffect = null;
    this.auraNextTickAt = 0;
    this.auraSprite = null;
    this.auraTween = null;

    // —— 基础与装备驱动的资源回复 —— //
    this.baseManaRegenPerSecond = 5;   // 基础回蓝：5 mana/s
    this.manaRegenFlatPerSecond = 0;   // 装备提供的平直回蓝（/s）
    this.manaRegenMultiplier = 1;      // 装备提供的回蓝倍率（相乘）
    this.hpRegenPerSecondFlat = 0;     // 装备提供的生命回复（/s）
    this._manaRegenCarry = 0;          // 小数累加避免抖动
    this._hpRegenCarry = 0;            // 小数累加避免抖动

    // Boss相关
    this.boss = null;
    this.bossMusic = null;
    this.bossKind = null; // 新增：当前Boss类型ID
    this.bossUi = {
      gfx: null,
      nameText: null,
      titleText: null,
      barX: GAME_WIDTH / 2,
      barY: 34,
      barW: 320,
      barH: 14,
    };

    /* ==== 新增：Boss 弹幕分组 ==== */
    this.bossBullets = null; // Boss子弹（含核弹/黄弹/蓝弹/危害微粒等）
  }

  create() {
    this.setupUIBindings();
    this.initializeEquipmentSystem();
    this.createMap();
    this.createPlayer();
    this.createBulletTrailResources();
    this.createWeapon();
    this.createGroups();
    this.setupCamera();
    this.setupInput();
    this.setupTimers();
    this.setupHUD();
    this.updateStatPanel();
    this.updateResourceBars();
    this.initializeShopSystem();

    // 地图随机放置：商店与宝箱
    this.spawnMapPlaces();

    /* ==== 新增：Boss弹幕分组与碰撞 ==== */
    this.bossBullets = this.physics.add.group();
    // 自机与Boss子弹判定：法术伤害（按Boss配置）
    this.physics.add.overlap(this.player, this.bossBullets, (player, bullet) => {
      if (!bullet.active) return;
      // 基础伤害
      let dmg = bullet.magicDamage ?? 0;
      // 核弹等可附加“按自机最大生命百分比”伤害
      if (bullet.percentMaxHpDamage && bullet.percentMaxHpDamage > 0) {
        const maxHp = this.playerStats?.maxHp ?? PLAYER_BASE_STATS.maxHp;
        const extra = Math.round(maxHp * bullet.percentMaxHpDamage);
        if (extra > 0) dmg += extra; // 同时造成额外伤害
      }
      if (dmg > 0) this.applyMagicDamageToPlayer(dmg);
      this.destroyBossBullet(bullet);
    });
    // 敌/Boss子弹与墙体发生碰撞：默认销毁；但核弹不参与碰撞（可穿墙、不消失）
    if (this.wallGroup) {
      this.physics.add.collider(
        this.bossBullets,
        this.wallGroup,
        (bullet, _wall) => {
          if (bullet && bullet.active) this.spawnWallHitExplosion(bullet.x, bullet.y);
          this.destroyBossBullet(bullet);
        },
        // processCallback：为核弹返回 false，跳过碰撞处理与分离
        (bullet, _wall) => {
          if (!bullet || !bullet.active) return false;
          const key = bullet.texture?.key;
          // 核弹忽略墙体碰撞（不分离、不触发销毁）
          if (key === "u_bullet_nuclearbomb") return false;
          return true;
        },
        this,
      );
    }

    const now = this.time.now;
    this.lastDamageTimestamp = now;
    this.nextNoDamageRankCheck = now + NO_DAMAGE_RANK_INTERVAL;
    this.roundTimeLeft = ROUND_DURATION;
    this.roundComplete = false;
    this.roundAwaitingDecision = false;
    this.updateOverlayScale();
    this.updateHUD();
// 近战命中体（与 weaponSprite 同位）
this.weaponHitbox = this.physics.add.image(this.player.x, this.player.y, "weapon").setVisible(false).setDepth(8);
this.weaponHitbox.body.setAllowGravity(false);
this.weaponHitbox.setCircle(8, this.weaponHitbox.width/2-8, this.weaponHitbox.height/2-8);
this.physics.add.overlap(this.weaponHitbox, this.enemies, (hitbox, enemy)=>{
  if (!enemy.active || this.playerCombatMode!=="melee") return;
  const now = this.time.now;
  if (!enemy.lastOrbHitAt || now - enemy.lastOrbHitAt >= 300) {
    // 将 E 的近战命中视为“普攻”：可触发攻击特效与法术暴击

    const preHp = enemy.hp;
    const baseAD = PLAYER_BASE_STATS.attackDamage; // 基础AD
    const ap = this.playerStats.abilityPower || 0;
    const baseMagic = Math.max(0, Math.round(baseAD + ap)); // 100%基础AD + 100%AP（魔法）

    // 普通暴击率影响（对该基础魔法伤害生效）
    const critChanceRaw = this.playerStats?.critChance ?? 0;          // 可能是0–1或0–100
    const critChance01 = critChanceRaw > 1 ? critChanceRaw / 100 : critChanceRaw;
    const critChance = Math.min(1, Math.max(0, critChance01));
    const critDamagePct = this.playerStats?.critDamage ?? 150;        // 150% = 1.5倍
    const baseIsCrit = Math.random() < critChance;
    const baseMagicFinal = baseIsCrit ? Math.round(baseMagic * (critDamagePct / 100)) : baseMagic;

    // 构建伤害条目（与远程普攻一致的归并/展示流程）
    const entries = [];

    // 基础伤害（按魔法结算，定义为 basic，不走普通暴击）
    entries.push({ type: "magic", amount: baseMagicFinal, source: baseIsCrit ? "basic_crit" : "basic", isOnHit: false, isCrit: baseIsCrit });

    // 耀光（若有）
    let spellbladeHit = null;
    if (this.nextAttackTriggersSpellblade) {
      spellbladeHit = this.consumeSpellbladeIfReady(enemy);
    }

    // 通用 on-hit 平直伤害
    const flatOnHitPhys = Math.max(0, Math.round(this.playerEquipmentStats?.onHitPhysicalFlat || 0));
    if (flatOnHitPhys > 0) entries.push({ type: "physical", amount: flatOnHitPhys, source: "onhit_phys_flat", isOnHit: true });
    const flatOnHitMagic = Math.max(0, Math.round(this.playerEquipmentStats?.onHitMagicFlat || 0));
    if (flatOnHitMagic > 0) entries.push({ type: "magic", amount: flatOnHitMagic, source: "onhit_magic_flat", isOnHit: true });

    // 破败王者之刃：百分比生命（按 on-hit 处理）
    if (this.hasItemEquipped(BROKEN_KINGS_BLADE_ID)) {
      const blade = EQUIPMENT_DATA[BROKEN_KINGS_BLADE_ID];
      const eff = blade.effects;
      const rawPercent = preHp * eff.percentCurrentHp;
      let percentDmg = Math.max(eff.percentMinDamage, rawPercent);
      if (enemy.isBoss) percentDmg = Math.min(percentDmg, eff.percentMaxDamageBoss);
      else percentDmg = Math.min(percentDmg, eff.percentMaxDamageNonBoss);
      entries.push({ type: "physical", amount: Math.round(percentDmg), source: "bork_percent", isOnHit: true });
      if (enemy.hitComboCount >= eff.tripleHitThreshold) {
        entries.push({ type: "magic", amount: Math.round(eff.tripleHitMagicDamage), source: "bork_triple", isOnHit: false });
        enemy.slowPct = Math.max(enemy.slowPct || 0, eff.tripleHitSlowPct);
        enemy.slowUntil = now + eff.tripleHitSlowMs;
        this.playerSpeedBuffMultiplier = Math.max(this.playerSpeedBuffMultiplier || 1, 1 + eff.selfHastePct);
        this.playerSpeedBuffExpiresAt = now + eff.selfHasteMs;
        enemy.hitComboCount = 0;
        enemy.hitComboExpireAt = 0;
      }
    }

    // 智慧末刃、纳什、鬼索、巨九（与远程普攻相同）
    let witsOnHitDamagePerProc = 0;
    if (this.hasItemEquipped(WITS_END_ID)) {
      const eff = EQUIPMENT_DATA[WITS_END_ID].effects;
      witsOnHitDamagePerProc = Math.round(eff.witsMagicOnHit);
      entries.push({ type: "magic", amount: witsOnHitDamagePerProc, source: "wits", isOnHit: true });
    }
    if (this.hasItemEquipped(NASHORS_TOOTH_ID)) {
      const eff = EQUIPMENT_DATA[NASHORS_TOOTH_ID].effects;
      const bonusAD = Math.max(0, this.playerStats.attackDamage - PLAYER_BASE_STATS.attackDamage);
      const nashorDmg = Math.round(eff.nashorBase + eff.nashorBonusAdRatio * bonusAD + eff.nashorApRatio * ap);
      entries.push({ type: "magic", amount: nashorDmg, source: "nashor", isOnHit: true });
    }
    let extraProcMultiplier = 1;
    if (this.hasItemEquipped(GUINSOOS_RAGEBLADE_ID)) {
      const eff = EQUIPMENT_DATA[GUINSOOS_RAGEBLADE_ID].effects;
      entries.push({ type: "magic", amount: Math.round(eff.ragebladeMagicOnHit), source: "guinsoo", isOnHit: true });
      this.guinsooStacks = Math.min((this.guinsooStacks || 0) + 1, eff.ragebladeMaxStacks || 4);
      this.guinsooStacksExpireAt = now + (eff.ragebladeStackDurationMs || 5000);
      if (this.guinsooStacks >= (eff.ragebladeMaxStacks || 4)) {
        this.guinsooFullProcCounter = (this.guinsooFullProcCounter || 0) + 1;
        if (this.guinsooFullProcCounter % (eff.ragebladeExtraProcEvery || 3) === 0) {
          extraProcMultiplier = 1 + (eff.ragebladeExtraProcsAtFull || 2);
        }
      } else {
        this.guinsooFullProcCounter = 0;
      }
      this.rebuildAttackTimer();
    }
    if (this.hasTitanicHydra && this.titanicCleaveBonus > 0) {
      const maxHpStat = this.playerStats?.maxHp ?? PLAYER_BASE_STATS.maxHp;
      const bonusDamage = Math.round(maxHpStat * this.titanicCleaveBonus);
      if (bonusDamage > 0) entries.push({ type: "physical", amount: bonusDamage, source: "titanic_primary", isOnHit: true });
    }

    // 归并并套减伤
    const damageGroups = { basic: { physical: 0, magic: 0 }, onHit: { physical: 0, magic: 0 } };
    for (const e of entries) {
      const times = e.isOnHit ? extraProcMultiplier : 1;
      for (let k = 0; k < times; k += 1) {
        const dealt = this.applyMitigationToTarget(e.amount, enemy, this.playerStats, e.type, 1);
        if (dealt <= 0) continue;
        const group = e.isOnHit ? damageGroups.onHit : damageGroups.basic;
        group[e.type] += dealt;
        // 智慧末刃：阈值治疗
        if (e.source === "wits") {
          const hpPct = this.currentHp / this.playerStats.maxHp;
          if (hpPct < (EQUIPMENT_DATA[WITS_END_ID].effects.witsHealThresholdHpPct || 0.5)) {
            this.currentHp = Math.min(this.currentHp + dealt, this.playerStats.maxHp);
            this.showHealNumber(this.player.x, this.player.y - 28, dealt);
            this.updateResourceBars();
          }
        }
      }
    }

    // 低血法暴（无穷法球）
    let magicBasicWasSpellCrit = false;
    const baseWasNormalCrit = baseIsCrit;
    let magicOnHitWasSpellCrit = false;
    if (this.hasItemEquipped(INFINITY_ORB_ID)) {
      const eff = EQUIPMENT_DATA[INFINITY_ORB_ID]?.effects || {};
      const threshold = Number.isFinite(eff.executeHpPct) ? eff.executeHpPct : 0.5;
      const mult = Number.isFinite(eff.magicCritMultiplier) ? eff.magicCritMultiplier : 1.5;
      if ((enemy.hp / (enemy.maxHp || 1)) <= threshold) {
        if (damageGroups.basic.magic > 0) {
          damageGroups.basic.magic = Math.max(0, Math.round(damageGroups.basic.magic * mult));
          magicBasicWasSpellCrit = true;
        }
        if (damageGroups.onHit.magic > 0) {
          damageGroups.onHit.magic = Math.max(0, Math.round(damageGroups.onHit.magic * mult));
          magicOnHitWasSpellCrit = true;
        }
      }
    }

    // 显示（与远程普攻一致样式）：先 basic，再 on-hit
    let displayOrder = 0;
    if (damageGroups.basic.physical > 0) this.displayDamageWithSeparation(enemy.x, enemy.y, damageGroups.basic.physical, "physical", displayOrder++);
    if (damageGroups.basic.magic > 0) {
      const typeToShow = (magicBasicWasSpellCrit || baseWasNormalCrit) ? "spellcrit" : "magic";
      this.displayDamageWithSeparation(enemy.x, enemy.y, damageGroups.basic.magic, typeToShow, displayOrder++);
    }
    if (damageGroups.onHit.physical > 0) this.displayDamageWithSeparation(enemy.x, enemy.y, damageGroups.onHit.physical, "physical", displayOrder++);
    if (damageGroups.onHit.magic > 0) this.displayDamageWithSeparation(enemy.x, enemy.y, damageGroups.onHit.magic, magicOnHitWasSpellCrit ? "spellcrit" : "magic", displayOrder++);

    // 独立显示：耀光（带 S 前缀）
    let spellbladeDamage = 0;
    if (spellbladeHit && spellbladeHit.amount > 0) {
      spellbladeDamage = spellbladeHit.amount;
      const stype = (spellbladeHit.type === "magic" && spellbladeHit.isSpellCrit) ? "spellcrit" : spellbladeHit.type;
      this.showDamageNumber(enemy.x, enemy.y, spellbladeDamage, stype, { isSpellblade: true });
    }

    // 实扣血
    const totalDamage =
      damageGroups.basic.physical + damageGroups.basic.magic +
      damageGroups.onHit.physical + damageGroups.onHit.magic +
      spellbladeDamage;
    if (totalDamage > 0) this.playSfx("orbhit");
    enemy.hp = Math.max(0, (enemy.hp ?? 0) - totalDamage);
    if (enemy.isBoss && typeof enemy.setData === "function") enemy.setData("hp", enemy.hp);
    if (enemy.isBoss) this.updateBossUI(enemy);

    // 劈砍与后续：定义为普攻
    const meleeAngle = Phaser.Math.Angle.Between(this.player.x, this.player.y, enemy.x, enemy.y);
    this.triggerCleaveEffects(enemy, { angle: meleeAngle, scale: 1 });
    enemy.lastOrbHitAt = now;

    if (enemy.hp <= 0) {
      this.killEnemy(enemy);
    } else {
      this.maybeExecuteTheCollector(enemy);
    }
    // 讯刃：普攻命中返还
    this.applyNavoriQuickbladesOnHitRefund();

    // 物理吸血（只对物理总额）
    const ls = this.playerEquipmentStats.physicalLifeSteal ?? 0;
    if (ls > 0) {
      const physicalTotal = damageGroups.basic.physical + damageGroups.onHit.physical;
      if (physicalTotal > 0) {
        const heal = Math.max(0, Math.round(physicalTotal * ls));
        if (heal > 0) {
          this.currentHp = Math.min(this.currentHp + heal, this.playerStats.maxHp);
          this.showHealNumber(this.player.x, this.player.y - 14, heal);
          this.updateResourceBars();
        }
      }
    }

    // Omnivamp（任意伤害）
    const omni = Math.max(0, this.playerEquipmentStats?.omniVampPct || 0);
    if (omni > 0) {
      const healAny = Math.max(0, Math.round(totalDamage * omni));
      if (healAny > 0) {
        this.currentHp = Math.min(this.currentHp + healAny, this.playerStats.maxHp);
        this.showHealNumber(this.player.x, this.player.y - 18, healAny);
        this.updateResourceBars();
      }
    }
  }
});

    if (this.debugShopMode) {
      this.playerPoints = Math.max(this.playerPoints, SHOP_DEBUG_START_GOLD);
      this.updateHUD();
      this.updateShopGoldLabel();
      this.openShop("debug");
    }

    if (!this.battleBgm) {
      this.battleBgm = this.sound.add("battle_bgm", { loop: true, volume: 0.4 });
      this.battleBgm.play();
      this.events.once("shutdown", () => { if (this.battleBgm?.isPlaying) this.battleBgm.stop(); });
      this.events.once("destroy", () => { if (this.battleBgm) { this.battleBgm.stop(); this.battleBgm.destroy(); this.battleBgm = null; } });
    } else if (!this.battleBgm.isPlaying) {
      this.battleBgm.play();
    }

    // Debug Boss 模式：停止一切音乐 -> 生成Utsuho -> 再播放Boss曲
    if (this.debugBossMode) {
      try { this.sound.stopAll(); } catch (_) {}
      if (this.spawnTimer) { this.spawnTimer.remove(); this.spawnTimer = null; }

      // 生成于场地中上方
      this.spawnBossById("Utsuho", { x: WORLD_SIZE/2, y: Math.floor(WORLD_SIZE * 0.25) });

      // 生成后才播放 Boss 音乐
      this.bossMusic = this.sound.add(BOSS_UTSUHO_CONFIG.musicKey, { loop: true, volume: 1.5 });
      this.bossMusic.play();

      // 退出或销毁场景时清理
      this.events.once("shutdown", () => {
        this.clearBossUI();
        if (this.bossMusic) { this.bossMusic.stop(); this.bossMusic.destroy(); this.bossMusic = null; }
      });
      this.events.once("destroy", () => {
        this.clearBossUI();
        if (this.bossMusic) { this.bossMusic.stop(); this.bossMusic.destroy(); this.bossMusic = null; }
      });
    }
  }

  /* ==== UI 绑定 ==== */
  setupUIBindings() {
    this.ui = {
      hpBar: document.getElementById("hp-bar"),
      hpLabel: document.getElementById("hp-bar-label"),
      mpBar: document.getElementById("mp-bar"),
      mpLabel: document.getElementById("mp-bar-label"),
      statContainer: document.getElementById("stat-lines"),
      timerValue: document.getElementById("sidebar-timer-value"),
      killValue: document.getElementById("sidebar-kill-value"),
      rankValue: document.getElementById("sidebar-rank-value"),
      pointValue: document.getElementById("sidebar-point-value"),
      equipmentDetails: document.getElementById("sidebar-equipment-details"),
      bossHeader: document.getElementById("boss-header"),
      bossName: document.getElementById("boss-name"),
      bossTitle: document.getElementById("boss-title"),
      shopOverlay: document.getElementById("shop-overlay"),
      shopItems: document.getElementById("shop-items"),
      shopMessage: document.getElementById("shop-message"),
      shopGoldValue: document.getElementById("shop-gold"),
      shopRefreshBtn: document.getElementById("shop-refresh-btn"),
      shopCloseBtn: document.getElementById("shop-close-btn"),
      shopExitRunBtn: document.getElementById("shop-exit-run-btn"),
      shopTitle: document.querySelector("#shop-overlay .shop-title"),
      shopGoldLabel: document.querySelector("#shop-overlay .shop-gold"),
    };
    const selectFirst = (selectors) => selectors.map((s) => document.querySelector(s)).find(Boolean);
    const skillSelectors = {
      Q: ['.skill-slot[data-skill="Q"]', '[data-skill="Q"]', '#skill-q', '.skill-q'],
      E: ['.skill-slot[data-skill="E"]', '[data-skill="E"]', '#skill-e', '.skill-e'],
      R: ['.skill-slot[data-skill="R"]', '[data-skill="R"]', '#skill-r', '.skill-r'],
      DASH: ['.skill-slot[data-skill="SPACE"]', '[data-skill="SPACE"]', '#skill-space', '.skill-space'],
    };

    const iconMap = { Q: "skill_Q", E: "skill_E", R: "skill_R", DASH: "skill_SPACE" };

    this.ui.skillUi = {};

    Object.entries(skillSelectors).forEach(([key, selectors]) => {
      const slotCandidate = selectFirst(selectors);
      if (!slotCandidate) return;
      const slot = slotCandidate.classList?.contains("skill-slot")
        ? slotCandidate
        : slotCandidate.closest?.(".skill-slot") || slotCandidate;
      if (!slot) return;

      const iconEl = slot.querySelector?.(".skill-icon") ?? null;
      if (iconEl && !iconEl.getAttribute("src")) {
        const texKey = iconMap[key];
        let src = null;
        if (texKey && this.textures && this.textures.exists(texKey)) {
          try {
            src = this.textures.getBase64(texKey);
          } catch (_) {
            src = null;
          }
        }
        if (!src) {
          const fileName = texKey ? texKey.replace(/^skill_?/, "") : key;
          src = `assets/player/reimu/skill/${fileName}.png`;
        }
        iconEl.src = src;
      }

      const overlayEl = slot.querySelector?.(".cooldown-overlay") ?? null;
      const timerEl = overlayEl?.querySelector?.(".cooldown-timer") ?? null;

      this.ui.skillUi[key] = {
        slot,
        icon: iconEl,
        overlay: overlayEl,
        timer: timerEl,
      };

      if (overlayEl) {
        overlayEl.style.display = "none";
        overlayEl.style.opacity = "1";
      }
      if (timerEl) timerEl.textContent = "";
      if (iconEl) iconEl.style.opacity = "1";
    });

    if (!this.skillTooltipTarget) this.skillTooltipTarget = this.ui.equipmentDetails;

    const descriptions = {
      Q: "Q「妖怪破坏者」\nCD 10s  消耗 60MP\n近战：按贴图物理碰撞判定（8格大小），造成法伤(100%AP)。\n远程：正前方30°三枚穿透符札（物伤=100%AD+50%AP）。",
      E: "E「阴阳鬼神玉」切换（CD 5s）\n远程：诱导护符，半径600普攻，攻速+20%。\n近战：阴阳宝玉巨化与半径×2旋转，接触造成(100%基础AD+100%AP)法伤。",
      R: "R「梦想封印」\nCD 58s  消耗 180MP\n立即治疗(500%AP+500)。召唤6枚梦想妙珠，先围绕2秒（旋转时碰撞造成(100%AP+200)法伤），随后追最近敌人命中后在4格范围内爆炸并造成(100%AP+200)法伤，清除敌方子弹。",
      DASH: "闪避（Space）\nCD 5s\n向前位移50，短暂无敌；忽略地形碰撞（边界除外）。",
    };

    const showTip = (key) => {
      if (!this.skillTooltipTarget) return;
      const text = descriptions[key];
      if (!text) return;
      if (this.skillTooltipTarget === this.ui.equipmentDetails) {
        this.skillTooltipTarget.innerHTML = "";
        text.split("\n").forEach((line) => {
          const span = document.createElement("span");
          span.textContent = line;
          this.skillTooltipTarget.appendChild(span);
        });
      } else {
        this.skillTooltipTarget.textContent = text;
      }
    };

    const clearTip = () => {
      if (!this.skillTooltipTarget) return;
      if (this.skillTooltipTarget === this.ui.equipmentDetails) {
        this.refreshEquipmentTooltip(this.activeEquipmentTooltipIndex ?? null);
      } else {
        this.skillTooltipTarget.textContent = "";
      }
    };

    Object.entries(this.ui.skillUi).forEach(([key, entry]) => {
      const targetEl = entry?.slot || entry?.icon;
      if (!targetEl) return;
      targetEl.addEventListener("mouseenter", () => showTip(key));
      targetEl.addEventListener("mouseleave", clearTip);
    });


  }
  showBossHeader(name, title) {
      if (!this.ui.bossHeader || !this.ui.bossName || !this.ui.bossTitle) return;
      this.ui.bossName.textContent = name || "";
      this.ui.bossTitle.textContent = title || "";
      this.ui.bossHeader.style.display = "block";
  }

  getBossHpRatioSafe(target) {
  if (!target) return 0;

  // 读取数值：优先属性，其次 DataManager
  const rawHp    = Number.isFinite(target.hp)     ? target.hp
                   : Number(target.getData?.("hp"));
  const rawMaxHp = Number.isFinite(target.maxHp)  ? target.maxHp
                   : Number(target.getData?.("maxHp"));

  const hp    = Number.isFinite(rawHp)    ? rawHp    : 0;
  const maxHp = Number.isFinite(rawMaxHp) ? rawMaxHp : 0;

  // 分母保护：maxHp<=0 时用 1；若 hp>0 但 maxHp==0，也用 hp 做分母避免 NaN
  const denom = (maxHp > 0) ? maxHp : (hp > 0 ? hp : 1);
  let ratio = hp / denom;

  // 兜底到 [0, 1]
  if (!Number.isFinite(ratio)) ratio = 0;
  ratio = Math.max(0, Math.min(1, ratio));
  return ratio;
}


  clearBossHeader() {
      if (!this.ui.bossHeader) return;
      this.ui.bossHeader.style.display = "none";
      if (this.ui.bossName) this.ui.bossName.textContent = "";
      if (this.ui.bossTitle) this.ui.bossTitle.textContent = "";
  }

/* ==== 敌人通用发弹工具（加入 GameScene 原型内） ==== */

// 敌人朝向自机 ±spreadDeg 的单发（法术伤害=caster/torret 自身 AP）
enemyFireAimedSpread(enemy, baseSpeed, textureKey, spreadDeg, fixedOffsetDeg = null) {
  if (!enemy?.active || !this.player) return;
  const base = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
  const off = fixedOffsetDeg != null
    ? Phaser.Math.DegToRad(fixedOffsetDeg)
    : Phaser.Math.DegToRad(Phaser.Math.Between(-spreadDeg, spreadDeg));
  const ang = base + off;
  this.spawnBossBullet({
    key: textureKey,
    sizeTiles: 1,           // 敌弹默认 1 格外观
    judgeTiles: 0.5,        // 默认 0.5 格判定
    from: { x: enemy.x, y: enemy.y },
    dirAngleDeg: Phaser.Math.RadToDeg(ang),
    forwardSpeed: baseSpeed,
    accel: 0,
    sideSpeed: 0,
    owner: enemy,
  }, enemy.abilityPower ?? 0, true);
}

// 敌人环状弹（法术伤害=自身 AP）
// phaseDeg 为空则随机相位；center 可指定坐标，不给则用敌人当前位置
enemyFireRing(enemy, {
  count, speed, textureKey, phaseDeg = null, center = null,
}) {
  if (!enemy?.active) return;
  const cx = center?.x ?? enemy.x;
  const cy = center?.y ?? enemy.y;
  const phase = (phaseDeg == null) ? Phaser.Math.Between(0, 359) : phaseDeg;
  this.fireRingAt(cx, cy, {
    key: textureKey,
    sizeTiles: 1,
    judgeTiles: 0.5,
    count,
    phaseDeg: phase,
    forwardSpeed: speed,
    accel: 0,
    sideSpeed: 0,
    owner: enemy,
  }, enemy.abilityPower ?? 0);
}

/* ==== Charger（kedama）AI ==== */
/* 自动寻路；进入 detectionRadius 后蓄力 windupMs，随后以 chargeSpeed 冲锋；撞墙结束并进入冷却 */
updateChargerAI(enemy, now, delta) {
  // 旋转贴图（角度属性单位为度）
  if (enemy.idleRotationSpeed) {
    const mul = delta / 16.6667; // 60fps 基准缩放
    enemy.angle = (enemy.angle + enemy.idleRotationSpeed * mul) % 360;
  }

  const toPlayer = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);
  const slowFactor = (enemy.slowUntil && now < enemy.slowUntil) ? (1 - (enemy.slowPct || 0)) : 1;

  // 状态机：idle -> windup -> dashing -> idle
  switch (enemy.aiState) {
    case "idle": {
      // 进入蓄力判定
      if (toPlayer <= (enemy.detectionRadius ?? 300) && (!enemy.attackCooldownUntil || now >= enemy.attackCooldownUntil)) {
        enemy.aiState = "windup";
        enemy.attackChargeUntil = now + (enemy.windupMs ?? 1000);
        enemy.chargeTargetX = this.player.x;
        enemy.chargeTargetY = this.player.y;
        enemy.body.setVelocity(0, 0);
        return;
      }
      // 普通追击：自动寻路
      const chaseSpeed = (enemy.moveSpeed ?? 70) * slowFactor;
      const navTarget = this.resolveEnemyNavigationTarget(enemy, now);
      const nav = enemy.nav;
      const hasNudge = nav && nav.nudgeUntil && now < nav.nudgeUntil;
      if (hasNudge) {
        const ang = nav.nudgeAngle ?? 0;
        const spd = nav.nudgeSpeed && nav.nudgeSpeed > 0 ? nav.nudgeSpeed : Math.max(ENEMY_STUCK_NUDGE_SPEED_MIN, chaseSpeed);
        enemy.body.setVelocity(Math.cos(ang) * spd, Math.sin(ang) * spd);
      } else if (navTarget) {
        const dx = navTarget.x - enemy.x; const dy = navTarget.y - enemy.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 1) {
          const k = chaseSpeed / Math.max(dist, 1);
          enemy.body.setVelocity(dx * k, dy * k);
        } else {
          enemy.body.setVelocity(0, 0);
        }
      } else {
        this.physics.moveToObject(enemy, this.player, chaseSpeed);
      }
      // 卡住处理
      this.handleEnemyStuckState(enemy, chaseSpeed, toPlayer, now);
      return;
    }
    case "windup": {
      enemy.body.setVelocity(0, 0);
      if (now >= enemy.attackChargeUntil) {
        const ang = Phaser.Math.Angle.Between(enemy.x, enemy.y, enemy.chargeTargetX, enemy.chargeTargetY);
        enemy.dashDirection = ang;
        enemy.dashingTimeoutAt = now + 1500; // 兜底超时，防止无限冲
        enemy.aiState = "dashing";
        return;
      }
      return;
    }
    case "dashing": {
      const spd = (enemy.chargeSpeed ?? 200) * slowFactor;
      this.physics.velocityFromRotation(enemy.dashDirection ?? 0, spd, enemy.body.velocity);
      // 冲刺残影：灰色，较低透明度，0.8s
      this.maybeEmitAfterimage(enemy, 50, { alphaStart: 0.6, duration: 800, tint: 0x999999, depthOffset: -1 });
      // 撞墙即结束
      const b = enemy.body.blocked;
      const hitWall = b?.left || b?.right || b?.up || b?.down;
      if (hitWall || now >= (enemy.dashingTimeoutAt ?? now)) {
        enemy.body.setVelocity(0, 0);
        enemy.aiState = "idle";
        enemy.attackCooldownUntil = now + 800;
        this.resetEnemyNav(enemy, now);
      }
      return;
    }
    default: enemy.aiState = "idle"; return;
  }
}


/* ==== Caster（yousei）AI ==== */
/* 距离<= detectionRadius 时进入循环：移动 2s -> 停止 2s 放弹（±30° 散射，间隔由 tier 指定），反复。 */
updateCasterAI(enemy, now, _delta) {
  const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);
  const inRange = dist <= (enemy.detectionRadius ?? 1200);
  if (!inRange) {
    // 未触发就普通追击
    const speed = enemy.moveSpeed ?? 80;
    const navTarget = this.resolveEnemyNavigationTarget(enemy, now);
    if (navTarget) {
      const dx = navTarget.x - enemy.x; const dy = navTarget.y - enemy.y;
      const d = Math.hypot(dx, dy);
      if (d > 1) {
        const k = speed / Math.max(d, 1);
        enemy.body.setVelocity(dx * k, dy * k);
      } else enemy.body.setVelocity(0, 0);
    } else {
      this.physics.moveToObject(enemy, this.player, speed);
    }
    return;
  }

  // 已触发循环
  const moveMs = enemy.moveDurationMs ?? 2000;
  const atkMs = enemy.attackDurationMs ?? 2000;
  const shotInt = enemy.shotIntervalMs ?? 500;
  const spread = enemy.tierConfig?.spreadDeg ?? 30;
  const bulletSpeed = enemy.tierConfig?.bulletSpeed ?? 30;
  if (!enemy.cyclePhase) {
    enemy.cyclePhase = "move";
    enemy.nextPhaseChangeAt = now + moveMs;
    enemy.nextShotTime = now + shotInt;
  }

  if (enemy.cyclePhase === "move") {
    // 追着自机移动
    const speed = enemy.moveSpeed ?? 80;
    const navTarget = this.resolveEnemyNavigationTarget(enemy, now);
    if (navTarget) {
      const dx = navTarget.x - enemy.x; const dy = navTarget.y - enemy.y;
      const d = Math.hypot(dx, dy);
      const k = speed / Math.max(d, 1);
      enemy.body.setVelocity(dx * k, dy * k);
    } else {
      this.physics.moveToObject(enemy, this.player, speed);
    }
    if (now >= enemy.nextPhaseChangeAt) {
      enemy.cyclePhase = "attack";
      enemy.nextPhaseChangeAt = now + atkMs;
      enemy.nextShotTime = now; // 进入攻击阶段立即开火一次
      enemy.body.setVelocity(0, 0);
    }
    return;
  }

  if (enemy.cyclePhase === "attack") {
    enemy.body.setVelocity(0, 0); // 停止移动
    if (now >= enemy.nextShotTime) {
      // 在（自机方向）±spread 发一发
      this.enemyFireAimedSpread(enemy, bulletSpeed, enemy.tierConfig?.bulletTextureKey ?? "enemy_bullet_basic", spread);
      enemy.nextShotTime = now + shotInt;
    }
    if (now >= enemy.nextPhaseChangeAt) {
      enemy.cyclePhase = "move";
      enemy.nextPhaseChangeAt = now + moveMs;
    }
  }
}


/* ==== Turret（orb）AI ==== */
/* 静止；每 attackIntervalMs 发一圈环状弹幕（随机相位）。自机进入 proximityRadius 100 时：
   1) 触发一次性额外环（朝向自机相位、gun.png、速度/数量按 tier）；
   2) epic/legendary 期间持续发出 kunai 随机 ±30° 散射（间隔按 tier），离开近身范围暂停。 */
updateTurretAI(enemy, now, _delta) {
  // 宝箱：标记 isChest 则完全不执行炮台发弹逻辑
  if (enemy.isChest) {
    enemy.body.setVelocity(0, 0);
    return;
  }
  // 保持静止
  enemy.body.setVelocity(0, 0);

  // ring sprite 位置&旋转
  if (enemy.ringSprite) {
    enemy.ringSprite.setPosition(enemy.x, enemy.y);
    enemy.ringSprite.rotation += (enemy.ringSpriteRotationSpeed ?? 0.01);
  }

  const cfg = enemy.tierConfig || {};
  const count = cfg.ringBulletCount ?? 20;
  const spd = cfg.ringBulletSpeed ?? 20;
  const tex = cfg.ringBulletTextureKey ?? "enemy_bullet_basic";
  const atkInt = cfg.attackIntervalMs ?? 1000;

  if (!enemy.nextAttackTime) enemy.nextAttackTime = now + Phaser.Math.Between(200, atkInt);
  if (now >= enemy.nextAttackTime) {
    this.enemyFireRing(enemy, { count, speed: spd, textureKey: tex, phaseDeg: Phaser.Math.Between(0, 359) });
    enemy.nextAttackTime = now + atkInt;
  }

  // 近身判定
  const proxR = cfg.proximityRadius ?? 100;
  const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);
  const inProx = dist <= proxR;

  // 一次性额外环（gun.png），相位朝向自机
  if (inProx && !enemy.extraBurstTriggered && cfg.extraRing) {
    const ang = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
    this.enemyFireRing(enemy, {
      count: cfg.extraRing.count,
      speed: cfg.extraRing.speed,
      textureKey: cfg.extraRing.textureKey ?? "enemy_bullet_gun",
      phaseDeg: Phaser.Math.RadToDeg(ang),
    });
    enemy.extraBurstTriggered = true;
  }

  // epic/legendary 近身连发 kunai
  if (cfg.extraKunai && inProx) {
    const k = cfg.extraKunai;
    if (!enemy.nextKunaiShotTime) enemy.nextKunaiShotTime = now;
    if (now >= enemy.nextKunaiShotTime) {
      // 在（自机方向）±spread 乱数一发
      this.enemyFireAimedSpread(enemy, k.speed ?? 15, k.textureKey ?? "enemy_bullet_kunai", k.spreadDeg ?? 30);
      enemy.nextKunaiShotTime = now + (k.intervalMs ?? 500);
    }
  } else {
    // 离开近身范围暂停 kunai
    enemy.nextKunaiShotTime = now + 100;
  }
}


  /* ==== 装备系统 ==== */
  initializeEquipmentSystem() {
    if (this.equipmentUiHandlers && this.equipmentUiHandlers.length > 0) {
      this.teardownEquipmentSystem();
    }
    const slotElements = Array.from(
      document.querySelectorAll(".equipment-slot[data-slot-index]")
    );
    const previewElement = document.getElementById("equipment-slot-1-preview");
    const previewImage = document.getElementById("equipment-slot-1-preview-img");

    this.equipmentUi = {
      slots: slotElements.map((element) => ({
        element,
        icon: element.querySelector(".equipment-icon"),
        badge: element.querySelector(".equipment-stack-badge"),
      })),
      previewElement,
      previewImage,
    };
    this.previewSlotIndex = null;
    this.bindPreviewRepositionEvents();
    this.events.once("shutdown", () => this.unbindPreviewRepositionEvents());
    this.events.once("destroy", () => this.unbindPreviewRepositionEvents());

    this.equipmentUiHandlers = [];

    slotElements.forEach((element) => {
      const handlers = {
        dragstart: (event) => this.handleEquipmentDragStart(event),
        dragenter: (event) => this.handleEquipmentDragEnter(event),
        dragover: (event) => this.handleEquipmentDragOver(event),
        dragleave: (event) => this.handleEquipmentDragLeave(event),
        drop: (event) => this.handleEquipmentDrop(event),
        dragend: (event) => this.handleEquipmentDragEnd(event),
        mouseenter: (event) => this.handleEquipmentSlotEnter(event),
        mouseleave: () => this.handleEquipmentSlotLeave(),
        click: (event) => this.handleEquipmentSlotClick(event),
      };
      Object.entries(handlers).forEach(([type, handler]) => {
        this.registerEquipmentUiHandler(element, type, handler);
      });
    });

    this.refreshEquipmentUI();
    this.refreshEquipmentTooltip(null);

    if ((this.debugMode || this.debugBossMode) && !this.debugShopMode) {
      this.equipItem(0, BROKEN_KINGS_BLADE_ID);
      this.equipItem(1, WITS_END_ID);
      this.equipItem(2, NASHORS_TOOTH_ID);
      this.equipItem(3, GUINSOOS_RAGEBLADE_ID);
    } else {
      this.recalculateEquipmentEffects();
    }

    this.events.once("shutdown", () => this.teardownEquipmentSystem());
    this.events.once("destroy", () => this.teardownEquipmentSystem());
  }

  registerEquipmentUiHandler(element, type, handler) {
    if (!element || typeof element.addEventListener !== "function") return;
    element.addEventListener(type, handler);
    this.equipmentUiHandlers.push({ element, type, handler });
  }

  teardownEquipmentSystem() {
    this.unbindPreviewRepositionEvents();
    if (this.equipmentUiHandlers) {
      this.equipmentUiHandlers.forEach(({ element, type, handler }) => {
        if (element?.removeEventListener) element.removeEventListener(type, handler);
      });
      this.equipmentUiHandlers = [];
    }
    this.equipmentUi = null;
    this.draggedEquipmentSlot = null;
    this.activeEquipmentTooltipIndex = null;
    this.previewSlotIndex = null;
  }

  getEquipmentDefinition(itemId) {
    if (!itemId) return null;
    return EQUIPMENT_DATA[itemId] ?? null;
  }
  
isSpellbladeItem(itemId) {
  if (!itemId) return false;
  const item = this.getEquipmentDefinition(itemId);
  if (item?.spellblade === true) return true;
  const knownSheenIds = new Set(["sheen", "divineSunderer", "trinityForce", "lichBane", "manamune", "frostfireGauntlet"]);
  return knownSheenIds.has(itemId);
}

updateSpellbladeOverlays() {
  if (!this.equipmentUi?.slots) return;
  const now = this.time?.now ?? Date.now();
  const CD = 1500;

  this.equipmentUi.slots.forEach(({ element }, index) => {
    const itemId = this.playerEquipmentSlots[index];
    if (!this.isSpellbladeItem(itemId)) {
      // 清理残留
      element?.querySelectorAll('.spellblade-cd, .spellblade-ready')?.forEach(el => el.remove());
      return;
    }

    let cdMask = element.querySelector('.spellblade-cd');
    if (!cdMask) {
      cdMask = document.createElement('div');
      cdMask.className = 'spellblade-cd';
      element.appendChild(cdMask);
    }

    let ready = element.querySelector('.spellblade-ready');
    if (!ready) {
      ready = document.createElement('div');
      ready.className = 'spellblade-ready';
      element.appendChild(ready);
    }

    const remain = Math.max(0, (this.lastSpellbladeUsedAt + CD) - now);
    if (remain > 0) {
      const ratio = remain / CD;
      cdMask.style.display = 'block';
      cdMask.style.height = `${(ratio * 100).toFixed(1)}%`;
      ready.classList.remove('active');
    } else {
      cdMask.style.display = 'none';
      ready.classList.add('active');
    }
  });
}

  refreshEquipmentUI() {
    if (!this.equipmentUi?.slots) return;
    const now = this.time.now;
    
    this.equipmentUi.slots.forEach(({ element, icon, badge }, index) => {
      const itemId = this.playerEquipmentSlots[index];
      const item = this.getEquipmentDefinition(itemId);
      
      // 清理之前的CD和指示器元素
      element.querySelectorAll('.spellblade-cd, .spellblade-ready').forEach(el => el.remove());
      
      if (item && icon) {
        icon.src = item.icon;
        icon.alt = item.name;
        element.classList.add("has-item");
        element.setAttribute("draggable", "true");
        
        // 处理耀光装备
        if (this.isSpellbladeItem(itemId)) {
          const isOnCooldown = !this.canTriggerSpellblade(now);
          
          // 添加CD遮罩
          const cdMask = document.createElement('div');
          cdMask.className = 'spellblade-cd';
          if (isOnCooldown) {
            const remainingTime = Math.max(0, (this.lastSpellbladeUsedAt + 1500) - now);
            const progress = remainingTime / 1500;
            cdMask.style.height = `${progress * 100}%`;
            cdMask.classList.add('active');
          }
          element.appendChild(cdMask);
          
          // 添加就绪指示器
          const readyIndicator = document.createElement('div');
          readyIndicator.className = 'spellblade-ready';
          if (!isOnCooldown) {
            readyIndicator.classList.add('active');
          }
          element.appendChild(readyIndicator);
        }
      } else {
        if (icon) {
          icon.removeAttribute("src");
          icon.alt = "";
        }
        element.classList.remove("has-item");
        element.removeAttribute("draggable");
        element.classList.remove("dragging");
        element.classList.remove("drag-over");
      }
      
      if (badge) {
        const stackText = this.getEquipmentStackBadgeText(item);
        if (stackText != null) {
          badge.textContent = stackText;
          badge.classList.add("active");
        } else {
          badge.textContent = "";
          badge.classList.remove("active");
        }
      }
    });

    this.updateEquipmentPreview(this.activeEquipmentTooltipIndex ?? null);
  }

  getEquipmentStackBadgeText(item) {
    if (!item) return null;
    if (item.id === HEARTSTEEL_ID) {
      const stacks = Number.isFinite(this.heartsteelStacks) ? this.heartsteelStacks : 0;
      return `${stacks}`;
    }
    if (item.id === DARK_SEAL_ID) {
      const stacks = Number.isFinite(this.darkSealStacks) ? this.darkSealStacks : 0;
      return `${stacks}`;
    }
    if (item.id === TEAR_OF_THE_GODDESS_ID || item.id === LOST_CHAPTER_ID || item.id === SERAPHS_EMBRACE_ID) {
      const stacks = Number.isFinite(this.manaStackCount) ? this.manaStackCount : 0;
      return `${stacks}`;
    }
    if (item.id === HEALTH_POTION_ID) {
      const n = Number.isFinite(this.healthPotionCount) ? this.healthPotionCount : 0;
      return n > 0 ? `${n}` : null; // 用完直接移除，不显示0
    }
    if (item.id === REFILLABLE_POTION_ID) {
      const n = Number.isFinite(this.refillablePotionCharges) ? this.refillablePotionCharges : 0;
      return `${n}`; // 可显示0，下一关回到5
    }
    return null;
  }

  refreshEquipmentTooltip(slotIndex = null) {
    if (!this.ui?.equipmentDetails) return;
    const container = this.ui.equipmentDetails;
    container.innerHTML = "";

    const itemId = slotIndex == null ? null : this.playerEquipmentSlots[slotIndex];
    const item = this.getEquipmentDefinition(itemId);
    if (!item) {
      const hint = document.createElement("span");
      hint.className = "sidebar-equipment-hint";
      hint.textContent = EQUIPMENT_TOOLTIP_DEFAULT;
      container.appendChild(hint);
      this.updateEquipmentPreview(null);
      return;
    }

    const title = document.createElement("span");
    title.className = "sidebar-equipment-title";
    title.textContent = item.name;
    container.appendChild(title);
    (item.description || []).forEach((line) => {
      const row = document.createElement("span");
      row.textContent = line;
      container.appendChild(row);
    });
    this.updateEquipmentPreview(slotIndex);
  }

  updateEquipmentPreview(slotIndex) {
    const ui = this.equipmentUi;
    if (!ui || !ui.previewElement || !ui.previewImage) return;

    const previewEl = ui.previewElement;
    const previewImage = ui.previewImage;

    const hidePreview = () => {
      this.previewSlotIndex = null;
      previewEl.classList.remove("active");
      previewEl.style.background = "transparent";
      previewEl.style.backgroundImage = "none";
      previewEl.style.left = "-9999px";
      previewEl.style.top = "-9999px";
      previewImage.removeAttribute("src");
      previewImage.alt = "";
    };

    if (!Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex >= this.playerEquipmentSlots.length) {
      hidePreview();
      return;
    }

    const itemId = this.playerEquipmentSlots[slotIndex];
    const item = this.getEquipmentDefinition(itemId);
    if (!item) {
      hidePreview();
      return;
    }

    this.previewSlotIndex = slotIndex;
    previewEl.classList.add("active");
    previewImage.src = item.icon;
    previewImage.alt = item.name;
    this.positionPreviewUnderSlot(slotIndex);
  }

  equipItem(slotIndex, itemId) {
    if (slotIndex < 0 || slotIndex >= this.playerEquipmentSlots.length) return;
    this.playerEquipmentSlots[slotIndex] = itemId ?? null;
    this.refreshEquipmentUI();
    this.recalculateEquipmentEffects();
    const tooltipIndex = this.activeEquipmentTooltipIndex ?? null;
    this.refreshEquipmentTooltip(tooltipIndex);
  }

  swapEquipmentSlots(sourceIndex, targetIndex) {
    if (
      sourceIndex == null || targetIndex == null ||
      sourceIndex === targetIndex ||
      Number.isNaN(sourceIndex) || Number.isNaN(targetIndex)
    ) return;
    const slots = this.playerEquipmentSlots;
    const tmp = slots[sourceIndex];
    slots[sourceIndex] = slots[targetIndex];
    slots[targetIndex] = tmp;
    // 若叠层拥有者参与了交换，更新其槽位索引
    if (this.darkSealOwnerSlotIndex === sourceIndex) this.darkSealOwnerSlotIndex = targetIndex;
    else if (this.darkSealOwnerSlotIndex === targetIndex) this.darkSealOwnerSlotIndex = sourceIndex;
    if (this.heartsteelOwnerSlotIndex === sourceIndex) this.heartsteelOwnerSlotIndex = targetIndex;
    else if (this.heartsteelOwnerSlotIndex === targetIndex) this.heartsteelOwnerSlotIndex = sourceIndex;
    if (this.healthPotionOwnerSlotIndex === sourceIndex) this.healthPotionOwnerSlotIndex = targetIndex;
    else if (this.healthPotionOwnerSlotIndex === targetIndex) this.healthPotionOwnerSlotIndex = sourceIndex;
    if (this.refillablePotionOwnerSlotIndex === sourceIndex) this.refillablePotionOwnerSlotIndex = targetIndex;
    else if (this.refillablePotionOwnerSlotIndex === targetIndex) this.refillablePotionOwnerSlotIndex = sourceIndex;
    this.refreshEquipmentUI();
    this.recalculateEquipmentEffects();
    const tooltipIndex = this.activeEquipmentTooltipIndex ?? null;
    this.refreshEquipmentTooltip(tooltipIndex);
  }

  recalculateEquipmentEffects() {
    this.playerEquipmentStats = { physicalLifeSteal: 0 };
    this.playerOnHitEffects = [];
    this.hasRunaan = false;
    this.runaanConfig = null;
    this.hasTiamat = false;
    this.tiamatCleaveRadius = 0;
    this.tiamatCleaveFlat = 0;
    this.hasTitanicHydra = false;
    this.titanicCleaveRadius = 0;
    this.titanicCleaveBonus = 0;
    this.titanicCleaveFlat = 0;
    this.auraEffect = null;

    // 资源回复重置（将由装备叠加）
    let manaRegenFlatPerSecond = 0; // /s 平直回蓝（装备累计）
    let manaRegenMultiplier = 1;    // 回蓝倍率（装备累计，相乘）
    let hpRegenPerSecondFlat = 0;   // /s 平直回血（装备累计）

    const prevStats = this.playerStats ?? PLAYER_BASE_STATS;
    const prevMaxHp = prevStats.maxHp ?? PLAYER_BASE_STATS.maxHp;
    const prevMaxMana = prevStats.maxMana ?? PLAYER_BASE_STATS.maxMana ?? PLAYER_MANA_MAX;
    const prevCurrentHp = Math.min(this.currentHp ?? prevMaxHp, prevMaxHp);
    const prevCurrentMana = Math.min(this.currentMana ?? prevMaxMana, prevMaxMana);
    const hpRatio = prevMaxHp > 0 ? prevCurrentHp / prevMaxHp : 1;
    const manaRatio = prevMaxMana > 0 ? prevCurrentMana / prevMaxMana : 1;

    const base = { ...PLAYER_BASE_STATS };
    let addAD = 0;
    let addASPct = 0;
    let addAP = 0;
    let addAR = 0;
    let addDEF = 0;
    let addHp = 0;
    let addMana = 0;
    let addCritChancePct = 0;
    let addCritDamageBonusPct = 0;
    let moveSpeedFlat = 0;
    let moveSpeedPct = 0;
    let abilityHaste = 0;
    let armorPenFlat = 0;
    // New aggregated equipment-driven effects
    let onHitPhysicalFlat = 0;
    let onHitMagicFlat = 0;           // for items that add magic on-hit (e.g., Riftmaker)
    let spellBonusMagicFlat = 0;      // flat magic added to spells (e.g., Hextech Alternator, Riftmaker)
    let omniVampPct = 0;              // omnivamp (e.g., Riftmaker)
    let apFromHpPctSum = 0;           // % of Max HP converted to AP (Riftmaker)
    let apMultiplierSum = 0;          // total AP multiplier (e.g., Deathcap)
    let hasGuinsoo = false;
    let heartsteelGainPerKill = 0;
    let heartsteelCount = 0;
    let darkSealCount = 0;
    // 反甲：反伤数值
    let thornsBase = 0;
    let thornsArmorRatio = 0;
    // 女神泪/炽天使：叠层参数
    let manaPerCast = 0;     // 取最大
    let manaCapBonus = 0;    // 取最大
    let healPerManaSpent = 0; // 累加
    // 白楼剑：动量（平直速度/最大层数）
    let bailouSpeedPerStack = 0;
    let bailouMaxStacks = 0;

    const appliedUniques = new Set();
    const darkSealSlots = [];
    const heartsteelSlots = [];
    const hpPotionSlots = [];
    const refillPotionSlots = [];
    for (let i = 0; i < this.playerEquipmentSlots.length; i += 1) {
      const itemId = this.playerEquipmentSlots[i];
      const item = this.getEquipmentDefinition(itemId);
      if (!item) continue;

      const stats = item.stats ?? {};

      if (stats.attackDamageFlat) addAD += stats.attackDamageFlat;
      if (stats.attackSpeedPct) addASPct += stats.attackSpeedPct;
      if (stats.physicalLifeSteal) this.playerEquipmentStats.physicalLifeSteal += stats.physicalLifeSteal;

      if (stats.abilityPowerFlat) addAP += stats.abilityPowerFlat;
      if (stats.arFlat) addAR += stats.arFlat;
      if (stats.defFlat) addDEF += stats.defFlat;
      if (stats.hpFlat) addHp += stats.hpFlat;
      if (stats.manaFlat) addMana += stats.manaFlat;
      if (stats.critChancePct) {
        const v = stats.critChancePct;
        // 支持单件装备写法为 30 或 0.30，逐项归一化到 [0,1]
        addCritChancePct += (v > 1 ? v / 100 : v);
      }
      if (stats.critDamageBonusPct) addCritDamageBonusPct += stats.critDamageBonusPct;
      if (stats.moveSpeedFlat) moveSpeedFlat += stats.moveSpeedFlat;
      if (stats.moveSpeedPct) moveSpeedPct += stats.moveSpeedPct;
      if (stats.abilityHaste) abilityHaste += stats.abilityHaste;
      if (stats.armorPenFlat) armorPenFlat += stats.armorPenFlat;

      const effects = item.effects ?? {};

      // —— 回蓝/回血类效果 —— //
      if (Number.isFinite(effects.manaRegenPerSecond)) {
        manaRegenFlatPerSecond += Math.max(0, effects.manaRegenPerSecond);
      }
      if (Number.isFinite(effects.hpRegenPerSecond)) {
        hpRegenPerSecondFlat += Math.max(0, effects.hpRegenPerSecond);
      }
      if (Number.isFinite(effects.manaRegenMultiplier)) {
        const m = Math.max(0, effects.manaRegenMultiplier);
        manaRegenMultiplier *= (m || 1);
      }

      if (item.id === RUNAANS_HURRICANE_ID) {
        const boltCount = Number.isFinite(effects.boltCount) ? Math.max(0, effects.boltCount) : 0;
        const damageMultiplier = Number.isFinite(effects.boltDamageMultiplier)
          ? Math.max(0, effects.boltDamageMultiplier)
          : 0.55;
        const boltsTriggerOnHit = effects.boltsTriggerOnHit !== false;
        this.hasRunaan = boltCount > 0 && damageMultiplier > 0;
        if (this.hasRunaan) {
          this.runaanConfig = {
            boltCount,
            damageMultiplier,
            boltsTriggerOnHit,
          };
        }
      }
      if (item.id === TIAMAT_ID) {
        this.hasTiamat = true;
        // 提亚马特范围：远程 2 格，近战 3 格（基于 TILE_SIZE）
        const baseTiles = (this.playerCombatMode === "ranged") ? 2 : 3;
        const adjustedRadius = Math.max(0, TILE_SIZE * baseTiles);
        this.tiamatCleaveRadius = Math.max(this.tiamatCleaveRadius, adjustedRadius);
        const flat = Number.isFinite(effects.cleaveFlat) ? Math.max(0, effects.cleaveFlat) : 0;
        this.tiamatCleaveFlat = Math.max(this.tiamatCleaveFlat, flat);
      }
      if (item.id === TITANIC_HYDRA_ID) {
        this.hasTitanicHydra = true;
        // 巨型九头蛇范围：远程 2.5 格，近战 4 格
        const baseTiles = (this.playerCombatMode === "ranged") ? 2.5 : 4;
        const adjustedRadius = Math.max(0, TILE_SIZE * baseTiles);
        this.titanicCleaveRadius = Math.max(this.titanicCleaveRadius, adjustedRadius);
        this.titanicCleaveBonus = Math.max(
          this.titanicCleaveBonus,
          Number.isFinite(effects.cleavePercentMaxHp) ? effects.cleavePercentMaxHp : 0,
        );
        const flat = Number.isFinite(effects.cleaveFlat) ? Math.max(0, effects.cleaveFlat) : 0;
        this.titanicCleaveFlat = Math.max(this.titanicCleaveFlat, flat);
      }
      // Aggregate on-hit flats (recurve bow & similar)
      if (Number.isFinite(effects.onHitPhysicalFlat)) {
        onHitPhysicalFlat += Math.max(0, effects.onHitPhysicalFlat);
      }
      // Magic on-hit + spell bonus (Riftmaker explicitly affects both; Hextech affects spells / empowered hits)
      if (Number.isFinite(effects.onHitMagicFlat)) {
        const v = Math.max(0, effects.onHitMagicFlat);
        if (item.id === RIFTMAKER_ID) {
          onHitMagicFlat += v;
          spellBonusMagicFlat += v;
        } else if (item.id === HEXTECH_ALTERNATOR_ID) {
          // Alternator: apply to spells only
          spellBonusMagicFlat += v;
        }
      }
      // 反伤（反甲/荆棘之甲）
      if (Number.isFinite(effects.thornsBase)) thornsBase += Math.max(0, effects.thornsBase);
      if (Number.isFinite(effects.thornsArmorRatio)) thornsArmorRatio += Math.max(0, effects.thornsArmorRatio);
      // 女神泪/炽天使叠层参数
      if (Number.isFinite(effects.manaPerCast)) manaPerCast = Math.max(manaPerCast, Math.max(0, effects.manaPerCast));
      if (Number.isFinite(effects.manaCapBonus)) manaCapBonus = Math.max(manaCapBonus, Math.max(0, effects.manaCapBonus));
      if (Number.isFinite(effects.healPerManaSpent)) healPerManaSpent += Math.max(0, effects.healPerManaSpent);
      // 白楼剑：动量参数
      if (item.id === BAILOU_SWORD_ID) {
        const sp = Number.isFinite(effects.momentumSpeedPerStack) ? Math.max(0, effects.momentumSpeedPerStack) : 0;
        const mx = Number.isFinite(effects.momentumMaxStacks) ? Math.max(0, effects.momentumMaxStacks) : 0;
        bailouSpeedPerStack = Math.max(bailouSpeedPerStack, sp);
        bailouMaxStacks = Math.max(bailouMaxStacks, mx);
      }
      // Omnivamp
      if (Number.isFinite(effects.omniVampPct)) omniVampPct += Math.max(0, effects.omniVampPct);
      // AP from Max HP
      if (Number.isFinite(effects.apFromHpPct)) apFromHpPctSum += Math.max(0, effects.apFromHpPct);
      // Total AP multiplier (e.g., Rabadon's Deathcap)
      if (Number.isFinite(effects.apMultiplier)) apMultiplierSum += Math.max(0, effects.apMultiplier);
      if (effects.auraDamage != null || effects.auraDamageHpRatio != null) {
        const auraDamage = Number.isFinite(effects.auraDamage) ? effects.auraDamage : 0;
        const auraRatio = Number.isFinite(effects.auraDamageHpRatio) ? effects.auraDamageHpRatio : 0;
        const auraInterval = Number.isFinite(effects.auraIntervalMs) ? effects.auraIntervalMs : 1000;
        const auraRadius = Number.isFinite(effects.auraRadius)
          ? effects.auraRadius
          : (item.id === SUNFIRE_AEGIS_ID ? 50 : 25);
        const priority = item.id === SUNFIRE_AEGIS_ID ? 2 : 1;
        const candidate = {
          damageFlat: auraDamage,
          damageRatio: auraRatio,
          intervalMs: Math.max(50, auraInterval),
          radius: Math.max(0, auraRadius),
          priority,
          textureKey: "item_effect_sunfire",
        };
        const currentAura = this.auraEffect;
        if (
          !currentAura ||
          candidate.priority > currentAura.priority ||
          (candidate.priority === currentAura.priority && candidate.radius >= currentAura.radius)
        ) {
          this.auraEffect = candidate;
        }
      }

      if (item.id === BROKEN_KINGS_BLADE_ID && !appliedUniques.has(item.id)) {
        this.playerOnHitEffects.push((context) => this.handleBrokenKingsBladeOnHit(context));
        appliedUniques.add(item.id);
      }
      if (item.id === GUINSOOS_RAGEBLADE_ID) hasGuinsoo = true;
      if (item.id === HEARTSTEEL_ID) { heartsteelCount += 1; heartsteelSlots.push(i); }
      if (item.id === HEALTH_POTION_ID) { hpPotionSlots.push(i); }
      if (item.id === REFILLABLE_POTION_ID) { refillPotionSlots.push(i); }
      if (effects.maxHpPerKill) {
        // 心之钢击杀增益：多件不叠加求和，取最大，避免叠层翻倍
        heartsteelGainPerKill = Math.max(heartsteelGainPerKill, effects.maxHpPerKill);
      }

      // 杀人书：根据当前层数增加AP与移速
      if (item.id === DARK_SEAL_ID && !appliedUniques.has(DARK_SEAL_ID)) {
        darkSealCount += 1; darkSealSlots.push(i);
        const apPer = Number.isFinite(effects.stackApPerKill) ? effects.stackApPerKill : 5;
        const msThreshold = Number.isFinite(effects.msBonusThreshold) ? effects.msBonusThreshold : 10;
        const msBonusPct = Number.isFinite(effects.msBonusPct) ? effects.msBonusPct : 0.10;
        const stacks = Math.max(0, this.darkSealStacks || 0);
        addAP += apPer * stacks;
        if (stacks >= msThreshold) moveSpeedPct += msBonusPct;
        // 避免多把杀人书重复应用层数收益
        appliedUniques.add(DARK_SEAL_ID);
      }
    }

    // —— 碎片：平直加成叠加 —— //
    if (!this.shardBonuses) this.shardBonuses = {};
    addAD += Math.max(0, this.shardBonuses.attackDamageFlat || 0);
    addASPct += Math.max(0, this.shardBonuses.attackSpeedPct || 0);
    addAP += Math.max(0, this.shardBonuses.abilityPowerFlat || 0);
    addAR += Math.max(0, this.shardBonuses.armorFlat || 0);
    addDEF += Math.max(0, this.shardBonuses.defenseFlat || 0);
    addHp += Math.max(0, this.shardBonuses.maxHpFlat || 0);
    addMana += Math.max(0, this.shardBonuses.maxManaFlat || 0);
    // 碎片暴击率：亦支持 30 或 0.30 的两种写法，逐项归一化
    {
      const v = Math.max(0, this.shardBonuses.critChancePct || 0);
      addCritChancePct += (v > 1 ? v / 100 : v);
    }
    addCritDamageBonusPct += Math.max(0, this.shardBonuses.critDamageBonusPct || 0);
    moveSpeedFlat += Math.max(0, this.shardBonuses.moveSpeedFlat || 0);
    moveSpeedPct += Math.max(0, this.shardBonuses.moveSpeedPct || 0);
    abilityHaste += Math.max(0, this.shardBonuses.abilityHaste || 0);
    armorPenFlat += Math.max(0, this.shardBonuses.armorPenFlat || 0);
    hpRegenPerSecondFlat += Math.max(0, this.shardBonuses.hpRegenPerSecond || 0);

    base.attackDamage = Math.max(1, Math.round(base.attackDamage + addAD));
    base.attackSpeed = Math.max(0.1, Number((base.attackSpeed * (1 + addASPct)).toFixed(3)));
    base.abilityPower = Math.max(0, Math.round((base.abilityPower ?? 0) + addAP));
    base.armor = Math.max(0, Math.round((base.armor ?? 0) + addAR));
    base.defense = Math.max(0, Math.round((base.defense ?? 0) + addDEF));
    const baseMaxHpValue = base.maxHp ?? PLAYER_BASE_STATS.maxHp;
    const heartsteelBonusHp = heartsteelGainPerKill > 0 ? this.heartsteelBonusHp : 0;
    base.maxHp = Math.max(1, Math.round(baseMaxHpValue + addHp + heartsteelBonusHp));
    const baseMaxMana = base.maxMana ?? PLAYER_MANA_MAX;
    // 女神泪/炽天使叠层生效
    this.manaStackPerCast = Math.max(0, manaPerCast);
    this.manaStackCap = Math.max(0, manaCapBonus);
    this.manaSpendHealPerPoint = Math.max(0, healPerManaSpent);
    const maxStackCount = (this.manaStackPerCast > 0 && this.manaStackCap > 0)
      ? Math.floor(this.manaStackCap / this.manaStackPerCast)
      : 0;
    if (maxStackCount === 0) {
      this.manaStackCount = Math.max(0, Math.min(this.manaStackCount || 0, 0));
    } else {
      this.manaStackCount = Math.max(0, Math.min(this.manaStackCount || 0, maxStackCount));
    }
    const bonusManaFromStacks = (this.manaStackCount || 0) * (this.manaStackPerCast || 0);
    base.maxMana = Math.max(0, Math.round(baseMaxMana + addMana + bonusManaFromStacks));
    // 暴击率：先记录未封顶值用于显示，再对内逻辑封顶
    {
      const uncapped01 = (base.critChance ?? 0) + addCritChancePct;
      base.critChanceUncapped = Math.max(0, uncapped01);
      base.critChance = Math.min(1, Math.max(0, uncapped01));
    }
    base.critDamage = Math.max(0, Math.round((base.critDamage ?? 0) + addCritDamageBonusPct * 100));

    // 白楼剑动量：将当前层数换算为平直移速
    this.bailouMomentumSpeedPerStack = Math.max(0, bailouSpeedPerStack);
    if (bailouMaxStacks > 0) this.bailouMomentumStacks = Math.min(this.bailouMomentumStacks || 0, bailouMaxStacks);
    const bailouFlat = (this.bailouMomentumStacks || 0) * (this.bailouMomentumSpeedPerStack || 0);
    const baseMoveSpeed = base.moveSpeed ?? PLAYER_BASE_SPEED;
    const computedMoveSpeed = (baseMoveSpeed + moveSpeedFlat + bailouFlat) * (1 + moveSpeedPct);
    base.moveSpeed = Math.max(0, Number(computedMoveSpeed.toFixed(3)));

    abilityHaste = Math.max(0, abilityHaste);
    base.abilityHaste = abilityHaste;
    base.cooldownReduction = abilityHaste > 0 ? 1 - (100 / (100 + abilityHaste)) : 0;
    base.armorPenFlat = Math.max(0, (base.armorPenFlat ?? 0) + armorPenFlat);

    // —— 碎片乘区：在基础数值确定后叠乘 —— //
    {
      const adPct = Math.max(0, this.shardBonuses.attackDamagePct || 0);
      if (adPct > 0) base.attackDamage = Math.max(1, Math.round(base.attackDamage * (1 + adPct)));
      const apPct = Math.max(0, this.shardBonuses.abilityPowerPct || 0);
      if (apPct > 0) base.abilityPower = Math.max(0, Math.round((base.abilityPower ?? 0) * (1 + apPct)));
      const arPct = Math.max(0, this.shardBonuses.armorPct || 0);
      if (arPct > 0) base.armor = Math.max(0, Math.round((base.armor ?? 0) * (1 + arPct)));
      const hpPct = Math.max(0, this.shardBonuses.maxHpPct || 0);
      if (hpPct > 0) base.maxHp = Math.max(1, Math.round((base.maxHp ?? PLAYER_BASE_STATS.maxHp) * (1 + hpPct)));
      const manaPct = Math.max(0, this.shardBonuses.maxManaPct || 0);
      if (manaPct > 0) base.maxMana = Math.max(0, Math.round((base.maxMana ?? PLAYER_MANA_MAX) * (1 + manaPct)));
      const arpPct = Math.max(0, this.shardBonuses.armorPenPct || 0);
      if (arpPct > 0) base.armorPenPct = Math.max(0, (base.armorPenPct || 0) + arpPct);
    }

    // Apply AP from HP conversion after maxHp is settled
    if (apFromHpPctSum > 0) {
      const hpForAp = base.maxHp ?? PLAYER_BASE_STATS.maxHp;
      const apBonusFromHp = Math.max(0, Math.round(hpForAp * apFromHpPctSum));
      base.abilityPower = Math.max(0, Math.round((base.abilityPower ?? 0) + apBonusFromHp));
    }

    // Apply total AP multiplier at the end (Rabadon's Deathcap)
    if (apMultiplierSum > 0) {
      const mult = 1 + apMultiplierSum; // e.g. 0.25 => 1.25
      base.abilityPower = Math.max(0, Math.round((base.abilityPower ?? 0) * mult));
    }

    this.playerStats = base;
    this.heartsteelGainPerKill = heartsteelGainPerKill;

    // Store aggregated effects for use in damage resolution
    const shardOnHit = Math.max(0, (this.shardBonuses?.onHitPhysicalFlat || 0))
      + Math.max(0, Math.round((this.shardBonuses?.onHitAdRatio || 0) * (base.attackDamage || PLAYER_BASE_STATS.attackDamage)));
    this.playerEquipmentStats.onHitPhysicalFlat = onHitPhysicalFlat + shardOnHit;
    this.playerEquipmentStats.onHitMagicFlat = onHitMagicFlat;
    this.playerEquipmentStats.spellBonusMagicFlat = spellBonusMagicFlat;
    this.playerEquipmentStats.omniVampPct = omniVampPct;
    this.playerEquipmentStats.thornsBase = Math.max(0, thornsBase);
    this.playerEquipmentStats.thornsArmorRatio = Math.max(0, thornsArmorRatio);

    // —— 出售叠层装备时：清理遗留的层数数值 —— //
    if (heartsteelCount === 0) {
      this.heartsteelStacks = 0;
      this.heartsteelBonusHp = 0;
      heartsteelGainPerKill = 0;
      this.heartsteelGainPerKill = 0;
    }
    if (darkSealCount === 0) {
      this.darkSealStacks = 0;
      this.darkSealKillProgress = 0;
    }

    // —— 叠层装备多件时：后出不继承先出的层数（以“拥有者槽位”为准）—— //
    // 杀人书：若仍有杀人书但拥有者不在装备栏中，视为出售了“带层数”的那一本，清空层数并转移拥有者
    if (darkSealSlots.length > 0) {
      if (this.darkSealOwnerSlotIndex == null) {
        this.darkSealOwnerSlotIndex = darkSealSlots[0];
      } else if (!darkSealSlots.includes(this.darkSealOwnerSlotIndex)) {
        // 原拥有者被移除（通常为卖出），后出的不继承层数
        this.darkSealStacks = 0;
        this.darkSealKillProgress = 0;
        this.darkSealOwnerSlotIndex = darkSealSlots[0];
      }
    } else {
      this.darkSealOwnerSlotIndex = null;
    }
    // 心之钢：同理，若原拥有者被移除但还有其它心之钢，清空叠层并转移拥有者
    if (heartsteelSlots.length > 0) {
      if (this.heartsteelOwnerSlotIndex == null) {
        this.heartsteelOwnerSlotIndex = heartsteelSlots[0];
      } else if (!heartsteelSlots.includes(this.heartsteelOwnerSlotIndex)) {
        this.heartsteelStacks = 0;
        this.heartsteelBonusHp = 0;
        this.heartsteelOwnerSlotIndex = heartsteelSlots[0];
      }
    } else {
      this.heartsteelOwnerSlotIndex = null;
    }

    // —— 消耗品：药水（确定所有者槽位，并在首次获得时设置初始数量/次数）—— //
    if (hpPotionSlots.length > 0) {
      // 如果原本没有拥有者或拥有者已不在，指定新的拥有者
      if (this.healthPotionOwnerSlotIndex == null || !hpPotionSlots.includes(this.healthPotionOwnerSlotIndex)) {
        const first = hpPotionSlots[0];
        this.healthPotionOwnerSlotIndex = first;
        if (!Number.isFinite(this.healthPotionCount) || this.healthPotionCount <= 0) {
          this.healthPotionCount = 1; // 新获得时至少为1瓶
        }
      }
      // 上限：100
      this.healthPotionCount = Math.max(0, Math.min(100, Math.floor(this.healthPotionCount || 0)));
      // 自动整合：若多个槽位同时存在生命药水，叠到拥有者格子并清空多余格
      if (hpPotionSlots.length > 1) {
        const extra = hpPotionSlots.length - 1;
        const owner = this.healthPotionOwnerSlotIndex ?? hpPotionSlots[0];
        const newCount = Math.max(1, Math.min(100, (this.healthPotionCount || 1) + extra));
        // 清空除拥有者外的其它槽位（避免重复整合）
        hpPotionSlots.forEach((slotIndex) => {
          if (slotIndex !== owner) this.playerEquipmentSlots[slotIndex] = null;
        });
        this.healthPotionOwnerSlotIndex = owner;
        this.healthPotionCount = newCount;
      }
    } else {
      // 无生命药水则清空计数与拥有者
      this.healthPotionOwnerSlotIndex = null;
      this.healthPotionCount = 0;
    }

    if (refillPotionSlots.length > 0) {
      if (this.refillablePotionOwnerSlotIndex == null || !refillPotionSlots.includes(this.refillablePotionOwnerSlotIndex)) {
        const first = refillPotionSlots[0];
        this.refillablePotionOwnerSlotIndex = first;
        // 首次获得时，若当前次数<=0，则装填为满
        if (!Number.isFinite(this.refillablePotionCharges) || this.refillablePotionCharges <= 0) {
          this.refillablePotionCharges = this.refillablePotionMaxCharges || 5;
        }
      }
      // 限制在 [0, max]
      const mx = Math.max(1, this.refillablePotionMaxCharges || 5);
      this.refillablePotionCharges = Math.max(0, Math.min(mx, Math.floor(this.refillablePotionCharges || 0)));
    } else {
      this.refillablePotionOwnerSlotIndex = null;
      this.refillablePotionCharges = 0;
    }

    const newMaxHp = this.playerStats.maxHp ?? prevMaxHp;
    const newMaxMana = this.playerStats.maxMana ?? prevMaxMana;
    this.currentHp = Math.min(newMaxHp, Math.max(0, Math.round(newMaxHp * hpRatio)));
    this.currentMana = Math.min(newMaxMana, Math.max(0, Math.round(newMaxMana * manaRatio)));

    if (!this.auraEffect) {
      this.stopAuraVisual();
    } else {
      this.auraNextTickAt = 0;
    }

    this.hasGuinsoo = hasGuinsoo;
    if (!this.hasGuinsoo) {
      this.guinsooStacks = 0;
      this.guinsooStacksExpireAt = 0;
      this.guinsooFullProcCounter = 0;
    }

    // 将装备汇总的资源回复生效
    this.manaRegenFlatPerSecond = Math.max(0, manaRegenFlatPerSecond);
    this.manaRegenMultiplier = Math.max(0, manaRegenMultiplier);
    this.hpRegenPerSecondFlat = Math.max(0, hpRegenPerSecondFlat);

    this.rebuildAttackTimer();
    this.updateStatPanel();
    this.updateResourceBars();
  }

  applyHeartsteelKillStack() {
    const gainPerKill = this.heartsteelGainPerKill ?? 0;
    if (gainPerKill <= 0) return;
    this.heartsteelStacks = (this.heartsteelStacks ?? 0) + 1;
    this.heartsteelBonusHp = (this.heartsteelBonusHp ?? 0) + gainPerKill;

    const prevMaxHp = this.playerStats?.maxHp ?? PLAYER_BASE_STATS.maxHp;
    const prevHp = this.currentHp ?? prevMaxHp;
    const newMaxHp = prevMaxHp + gainPerKill;
    const ratio = prevMaxHp > 0 ? prevHp / prevMaxHp : 1;

    if (this.playerStats) this.playerStats.maxHp = newMaxHp;
    this.currentHp = Math.min(newMaxHp, Math.max(0, Math.round(newMaxHp * ratio)));

    this.updateStatPanel();
    this.updateResourceBars();
    this.refreshEquipmentUI();
  }

  // 杀人书：按击杀叠层；100小兵=1层，击杀Boss额外+1层。
  applyDarkSealKillProgress(enemy) {
    if (!this.hasItemEquipped(DARK_SEAL_ID)) return;
    const eff = EQUIPMENT_DATA[DARK_SEAL_ID]?.effects || {};
    const maxStacks = Number.isFinite(eff.maxStacks) ? Math.max(0, eff.maxStacks) : 0;
    if (maxStacks <= 0) return;
    const killsPerStack = Number.isFinite(eff.killsPerStack) ? Math.max(1, eff.killsPerStack) : 100;
    const bossBonus = Number.isFinite(eff.bossStackBonus) ? Math.max(0, eff.bossStackBonus) : 1;
    let stacks = this.darkSealStacks || 0;
    let prog = this.darkSealKillProgress || 0;
    if (enemy?.isBoss) {
      stacks += bossBonus;
    } else {
      prog += 1;
      if (prog >= killsPerStack) {
        const gained = Math.floor(prog / killsPerStack);
        stacks += gained; prog = prog % killsPerStack;
      }
    }
    stacks = Math.min(stacks, maxStacks);
    this.darkSealStacks = stacks;
    this.darkSealKillProgress = prog;
    this.recalculateEquipmentEffects();
    this.refreshEquipmentUI();
  }

  // 白楼剑：击杀叠加动量层数（持续3秒，最多10层）
  applyBailouMomentumOnKill() {
    if (!this.hasItemEquipped(BAILOU_SWORD_ID)) return;
    const eff = EQUIPMENT_DATA[BAILOU_SWORD_ID]?.effects || {};
    const maxStacks = Number.isFinite(eff.momentumMaxStacks) ? Math.max(0, eff.momentumMaxStacks) : 10;
    const dur = Number.isFinite(eff.momentumDurationMs) ? Math.max(0, eff.momentumDurationMs) : 3000;
    const now = this.time.now;
    // 移除已过期层
    this.bailouMomentumExpires = (this.bailouMomentumExpires || []).filter((t) => t > now);
    // 增加一层；若已满，刷新最早过期层
    if ((this.bailouMomentumExpires.length || 0) < maxStacks) {
      this.bailouMomentumExpires.push(now + dur);
    } else {
      this.bailouMomentumExpires.sort((a, b) => a - b);
      this.bailouMomentumExpires[0] = now + dur;
    }
    this.bailouMomentumStacks = this.bailouMomentumExpires.length;
    this.recalculateEquipmentEffects();
  }

  getAttackSpeedBonusMultiplier() {
    const data = EQUIPMENT_DATA[GUINSOOS_RAGEBLADE_ID]?.effects;
    if (!this.hasGuinsoo || !data) return 1;
    const stacks = Math.min(this.guinsooStacks || 0, data.ragebladeMaxStacks || 0);
    return 1 + stacks * (data.ragebladeStackAsPct || 0);
  }

  rebuildAttackTimer() {
    if (this.attackTimer) {
      this.attackTimer.remove();
      this.attackTimer = null;
    }
    // 远程形态：攻速+20%；近战：停火（但计时器仍在，tryFireBullet 会早退）
    const modeASMult = (this.playerCombatMode === "ranged") ? E_RANGED_ATTACK_SPEED_MULTIPLIER : 1;
    const effAS = this.playerStats.attackSpeed * this.getAttackSpeedBonusMultiplier() * modeASMult;
    const attackDelay = 1000 / Math.max(0.1, effAS);
    this.attackTimer = this.time.addEvent({
      delay: attackDelay,
      loop: true,
      callback: () => this.tryFireBullet(),
    });
  }

  /* ==== 地图 ==== */
  createMap() {
    this.physics.world.setBounds(0, 0, WORLD_SIZE, WORLD_SIZE);
    this.floor = this.add.tileSprite(WORLD_SIZE/2, WORLD_SIZE/2, WORLD_SIZE, WORLD_SIZE, "floor").setOrigin(0.5);
    this.wallGroup = this.physics.add.staticGroup();
    this.wallTiles = [];
    this.generateRandomSegmentsMap();
  }

  generateRandomSegmentsMap() {
    if (this.wallGroup) this.wallGroup.clear(true, true);
    if (!this.wallTiles) this.wallTiles = [];
    this.wallTiles.forEach((tile) => tile?.destroy?.());
    this.wallTiles.length = 0;
    // debug 场景不生成墙
    // ? Boss 房间：只保留边框，中央不放墙
    const halfTile = TILE_SIZE / 2;
    const width = MAP_TILES;
    const height = MAP_TILES;
    const isWall = Array.from({ length: height }, () => Array(width).fill(false));
    const inBounds = (x, y) => x >= 0 && y >= 0 && x < width && y < height;
    const startX = Math.floor(width / 2);
    const startY = Math.floor(height / 2);
    let wallCount = 0;
    const markWall = (x, y, v) => {
      if (!inBounds(x, y)) return;
      if (isWall[y][x] === v) return;
      isWall[y][x] = v; wallCount += v ? 1 : -1;
    };

    // 先标记四周边框
    for (let x = 0; x < width; x += 1) { markWall(x, 0, true); markWall(x, height-1, true); }
    for (let y = 1; y < height-1; y += 1) { markWall(0, y, true); markWall(width-1, y, true); }

    // ? Boss 房间：仅保留边框（调试Boss模式或正式Boss关卡）
    if (this.debugBossMode || this.isBossStage) {
      this.wallGrid = isWall.map((row) => row.slice());
      for (let y=0;y<height;y+=1) {
        for (let x=0;x<width;x+=1) {
          if (isWall[y][x]) {
            const wx = x * TILE_SIZE + halfTile;
            const wy = y * TILE_SIZE + halfTile;
            this.addWall(wx, wy);
          }
        }
      }
      this.buildWallCollidersFromGrid(this.wallGrid, width, height);
      return; // ← 关键：中间不放墙
    }
    const isConnected = () => {
      if (isWall[startY][startX]) return false;
      const totalFloor = width * height - wallCount;
      const visited = Array.from({ length: height }, () => Array(width).fill(false));
      const q = [{ x: startX, y: startY }];
      visited[startY][startX] = true;
      let read = 0, reach = 1;
      while (read < q.length) {
        const { x, y } = q[read++ ];
        const neigh = [ {nx:x+1,ny:y}, {nx:x-1,ny:y}, {nx:x,ny:y+1}, {nx:x,ny:y-1} ];
        for (let i=0;i<neigh.length;i+=1) {
          const { nx, ny } = neigh[i];
          if (!inBounds(nx, ny) || visited[ny][nx] || isWall[ny][nx]) continue;
          visited[ny][nx] = true; reach += 1; q.push({x:nx,y:ny});
        }
      }
      return reach === totalFloor;
    };

    const blockedRadius = 3;
    for (let dy=-blockedRadius; dy<=blockedRadius; dy+=1) {
      for (let dx=-blockedRadius; dx<=blockedRadius; dx+=1) {
        markWall(
          Phaser.Math.Clamp(startX + dx, 1, width - 2),
          Phaser.Math.Clamp(startY + dy, 1, height - 2),
          false
        );
      }
    }

    const trySegment = (tiles) => {
      for (let i=0;i<tiles.length;i+=1) {
        const { x, y } = tiles[i];
        if (!inBounds(x, y) || isWall[y][x]) return false;
        if (Math.abs(x - startX) <= blockedRadius && Math.abs(y - startY) <= blockedRadius) return false;
      }
      tiles.forEach(({x,y})=> markWall(x, y, true));
      if (!isConnected()) { tiles.forEach(({x,y})=> markWall(x, y, false)); return false; }
      return true;
    };

    const placeSegments = (count, vertical) => {
      let placed = 0, attempts = 0;
      while (placed < count && attempts < count * 200) {
        attempts += 1;
        const length = 10;
        const sx = Phaser.Math.Between(1, vertical ? width - 2 : width - length - 1);
        const sy = Phaser.Math.Between(1, vertical ? height - length - 1 : height - 2);
        const tiles = [];
        for (let i=0;i<length;i+=1) {
          const x = sx + (vertical ? 0 : i);
          const y = sy + (vertical ? i : 0);
          tiles.push({ x, y });
        }
        if (trySegment(tiles)) placed += 1;
      }
    };

    placeSegments(25, false);
    placeSegments(25, true);

    this.wallGrid = isWall.map((row) => row.slice());

    for (let y=0;y<height;y+=1) {
      for (let x=0;x<width;x+=1) {
        if (isWall[y][x]) {
          const wx = x * TILE_SIZE + halfTile;
          const wy = y * TILE_SIZE + halfTile;
          this.addWall(wx, wy);
        }
      }
    }

    this.buildWallCollidersFromGrid(this.wallGrid, width, height);
  }

  addWall(x, y, scale = 1) {
    const wall = this.add.sprite(x, y, "wall");
    wall.setOrigin(0.5);
    wall.setScale(scale);
    wall.setDepth(1);
    this.wallTiles.push(wall);
    return wall;
  }

  buildWallCollidersFromGrid(isWall, width, height) {
    if (!this.wallGroup) return;
    const visited = Array.from({ length: height }, () => Array(width).fill(false));
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (!isWall[y][x] || visited[y][x]) continue;

        let rectWidth = 1;
        while (x + rectWidth < width) {
          if (!isWall[y][x + rectWidth] || visited[y][x + rectWidth]) break;
          rectWidth += 1;
        }

        let rectHeight = 1;
        let canGrow = true;
        while (y + rectHeight < height && canGrow) {
          for (let dx = 0; dx < rectWidth; dx += 1) {
            if (!isWall[y + rectHeight][x + dx] || visited[y + rectHeight][x + dx]) {
              canGrow = false;
              break;
            }
          }
          if (canGrow) rectHeight += 1;
        }

        for (let dy = 0; dy < rectHeight; dy += 1) {
          for (let dx = 0; dx < rectWidth; dx += 1) {
            visited[y + dy][x + dx] = true;
          }
        }

        const centerX = (x + rectWidth / 2) * TILE_SIZE;
        const centerY = (y + rectHeight / 2) * TILE_SIZE;
        this.addWallCollider(centerX, centerY, rectWidth, rectHeight);
      }
    }
  }

  addWallCollider(centerX, centerY, tileWidth, tileHeight) {
    const margin = WALL_COLLISION_MARGIN;
    const widthPx = tileWidth * TILE_SIZE + margin * 2;
    const heightPx = tileHeight * TILE_SIZE + margin * 2;
    const collider = this.wallGroup.create(centerX, centerY, "wall");
    collider.setOrigin(0.5);
    collider.setVisible(false);
    collider.setDisplaySize(widthPx, heightPx);
    if (typeof collider.refreshBody === "function") collider.refreshBody();
    if (collider.body && typeof collider.body.updateFromGameObject === "function") {
      collider.body.updateFromGameObject();
    }
    return collider;
  }

  worldToTileCoords(worldX, worldY) {
    const grid = this.wallGrid;
    const height = Array.isArray(grid) ? grid.length : MAP_TILES;
    const width = height > 0 && Array.isArray(grid[0]) ? grid[0].length : MAP_TILES;
    const tileX = Phaser.Math.Clamp(Math.floor(worldX / TILE_SIZE), 0, width - 1);
    const tileY = Phaser.Math.Clamp(Math.floor(worldY / TILE_SIZE), 0, height - 1);
    return { x: tileX, y: tileY };
  }

  tileToWorldCenter(tileX, tileY) {
    return {
      x: (tileX + 0.5) * TILE_SIZE,
      y: (tileY + 0.5) * TILE_SIZE,
    };
  }

  hasLineOfSightTiles(startTile, goalTile) {
    const grid = this.wallGrid;
    if (!Array.isArray(grid) || grid.length === 0) return false;
    const height = grid.length;
    const width = grid[0].length;
    const inBounds = (x, y) => x >= 0 && y >= 0 && x < width && y < height;
    if (!inBounds(startTile.x, startTile.y) || !inBounds(goalTile.x, goalTile.y)) return false;
    if (grid[startTile.y][startTile.x]) return false;
    if (grid[goalTile.y][goalTile.x]) return false;
    const dx = goalTile.x - startTile.x;
    const dy = goalTile.y - startTile.y;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    if (steps === 0) return true;
    let fx = startTile.x + 0.5;
    let fy = startTile.y + 0.5;
    const stepX = dx / steps;
    const stepY = dy / steps;
    for (let i = 0; i <= steps; i += 1) {
      const cx = Math.floor(fx);
      const cy = Math.floor(fy);
      if ((cx === startTile.x && cy === startTile.y) || (cx === goalTile.x && cy === goalTile.y)) {
        fx += stepX;
        fy += stepY;
        continue;
      }
      if (!inBounds(cx, cy) || grid[cy][cx]) return false;
      fx += stepX;
      fy += stepY;
    }
    return true;
  }

  computeNavigationPath(startTile, goalTile) {
    const grid = this.wallGrid;
    if (!Array.isArray(grid) || grid.length === 0) return null;
    const height = grid.length;
    const width = grid[0].length;
    const inBounds = (x, y) => x >= 0 && y >= 0 && x < width && y < height;
    if (!inBounds(startTile.x, startTile.y) || !inBounds(goalTile.x, goalTile.y)) return null;
    if (grid[startTile.y][startTile.x]) return null;
    if (grid[goalTile.y][goalTile.x]) return null;
    const maxNodes = Math.min(ENEMY_PATH_MAX_EXPANSION, width * height);
    const startIdx = startTile.y * width + startTile.x;
    const goalIdx = goalTile.y * width + goalTile.x;
    if (startIdx === goalIdx) return [];

    const visited = new Array(width * height).fill(false);
    const prev = new Array(width * height).fill(-1);
    const queue = [startIdx];
    visited[startIdx] = true;
    let head = 0;
    let expanded = 0;

    while (head < queue.length && expanded < maxNodes) {
      const current = queue[head];
      head += 1;
      if (current === goalIdx) break;
      expanded += 1;
      const cx = current % width;
      const cy = Math.floor(current / width);
      const neighbors = [
        { x: cx + 1, y: cy },
        { x: cx - 1, y: cy },
        { x: cx, y: cy + 1 },
        { x: cx, y: cy - 1 },
      ];
      for (let i = 0; i < neighbors.length; i += 1) {
        const nx = neighbors[i].x;
        const ny = neighbors[i].y;
        if (!inBounds(nx, ny) || grid[ny][nx]) continue;
        const idx = ny * width + nx;
        if (visited[idx]) continue;
        visited[idx] = true;
        prev[idx] = current;
        queue.push(idx);
      }
    }

    if (!visited[goalIdx]) return null;
    const path = [];
    let cur = goalIdx;
    while (cur !== startIdx && cur !== -1) {
      const px = cur % width;
      const py = Math.floor(cur / width);
      path.push({ x: px, y: py });
      cur = prev[cur];
    }
    if (cur === -1) return null;
    path.reverse();
    return path;
  }

  resolveEnemyNavigationTarget(enemy, now) {
    if (!enemy || !this.player || !Array.isArray(this.wallGrid)) return null;
    if (!enemy.nav) {
      enemy.nav = {
        path: null,
        index: 0,
        nextRecalc: now,
        goalKey: "",
        startKey: "",
        lastProgressAt: now,
        lastProgressX: enemy.x,
        lastProgressY: enemy.y,
        stuckCooldownUntil: 0,
        nudgeUntil: 0,
        nudgeAngle: null,
        nudgeSpeed: 0,
      };
    } else {
      if (typeof enemy.nav.lastProgressAt !== "number") enemy.nav.lastProgressAt = now;
      if (typeof enemy.nav.lastProgressX !== "number") enemy.nav.lastProgressX = enemy.x;
      if (typeof enemy.nav.lastProgressY !== "number") enemy.nav.lastProgressY = enemy.y;
      if (typeof enemy.nav.stuckCooldownUntil !== "number") enemy.nav.stuckCooldownUntil = 0;
      if (typeof enemy.nav.nextRecalc !== "number") enemy.nav.nextRecalc = now;
      if (typeof enemy.nav.nudgeUntil !== "number") enemy.nav.nudgeUntil = 0;
      if (typeof enemy.nav.nudgeAngle !== "number") enemy.nav.nudgeAngle = null;
      if (typeof enemy.nav.nudgeSpeed !== "number") enemy.nav.nudgeSpeed = 0;
    }
    const enemyTile = this.worldToTileCoords(enemy.x, enemy.y);
    const playerTile = this.worldToTileCoords(this.player.x, this.player.y);
    const goalKey = `${playerTile.x},${playerTile.y}`;
    const startKey = `${enemyTile.x},${enemyTile.y}`;

    if (this.hasLineOfSightTiles(enemyTile, playerTile)) {
      enemy.nav.path = null;
      enemy.nav.index = 0;
      enemy.nav.goalKey = goalKey;
      enemy.nav.startKey = startKey;
      enemy.nav.nextRecalc = now + ENEMY_NAV_RECALC_INTERVAL_MS;
      enemy.nav.lastProgressAt = now;
      enemy.nav.lastProgressX = enemy.x;
      enemy.nav.lastProgressY = enemy.y;
      enemy.nav.stuckCooldownUntil = 0;
      enemy.nav.nudgeUntil = 0;
      enemy.nav.nudgeAngle = null;
      enemy.nav.nudgeSpeed = 0;
      return { x: this.player.x, y: this.player.y };
    }

    if (enemy.nav.path && enemy.nav.index < enemy.nav.path.length) {
      const currentTarget = enemy.nav.path[enemy.nav.index];
      const currentPos = this.tileToWorldCenter(currentTarget.x, currentTarget.y);
      const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, currentPos.x, currentPos.y);
      if (dist <= ENEMY_PATH_NODE_REACHED_THRESHOLD) enemy.nav.index += 1;
    }

    const pathLength = enemy.nav.path?.length ?? 0;
    const pathMissing = !enemy.nav.path;
    const pathFinished = !pathMissing && enemy.nav.index >= pathLength;
    const startChanged = enemy.nav.startKey !== startKey;
    const goalChanged = enemy.nav.goalKey !== goalKey;
    const timedOut = now >= enemy.nav.nextRecalc;

    let needRecalc = false;
    if (startChanged || goalChanged) needRecalc = true;
    else if (pathMissing) needRecalc = timedOut;
    else if (pathFinished) needRecalc = true;
    else if (timedOut) needRecalc = true;

    if (needRecalc) {
      const path = this.computeNavigationPath(enemyTile, playerTile);
      enemy.nav.goalKey = goalKey;
      enemy.nav.startKey = startKey;
      enemy.nav.nextRecalc = now + ENEMY_NAV_RECALC_INTERVAL_MS;
      if (path && path.length > 0) {
        enemy.nav.path = path;
        enemy.nav.index = 0;
        enemy.nav.lastProgressAt = now;
        enemy.nav.lastProgressX = enemy.x;
        enemy.nav.lastProgressY = enemy.y;
        enemy.nav.stuckCooldownUntil = 0;
        enemy.nav.nudgeUntil = 0;
        enemy.nav.nudgeAngle = null;
        enemy.nav.nudgeSpeed = 0;
      } else {
        enemy.nav.path = null;
        enemy.nav.index = 0;
        enemy.nav.lastProgressAt = now;
        enemy.nav.lastProgressX = enemy.x;
        enemy.nav.lastProgressY = enemy.y;
        enemy.nav.stuckCooldownUntil = now;
        enemy.nav.nudgeUntil = 0;
        enemy.nav.nudgeAngle = null;
        enemy.nav.nudgeSpeed = 0;
      }
    }

    if (enemy.nav.path && enemy.nav.index < enemy.nav.path.length) {
      const nextTile = enemy.nav.path[enemy.nav.index];
      return this.tileToWorldCenter(nextTile.x, nextTile.y);
    }

    return null;
  }

  handleEnemyStuckState(enemy, chaseSpeed, distanceToPlayer, now) {
    const nav = enemy?.nav;
    if (!nav) return;
    if (typeof nav.lastProgressAt !== "number") {
      nav.lastProgressAt = now;
      nav.lastProgressX = enemy.x;
      nav.lastProgressY = enemy.y;
    }
    if (typeof nav.lastProgressX !== "number") nav.lastProgressX = enemy.x;
    if (typeof nav.lastProgressY !== "number") nav.lastProgressY = enemy.y;
    const movedDist = Phaser.Math.Distance.Between(
      enemy.x,
      enemy.y,
      nav.lastProgressX ?? enemy.x,
      nav.lastProgressY ?? enemy.y,
    );
    if (movedDist > ENEMY_STUCK_MOVE_EPSILON) {
      nav.lastProgressAt = now;
      nav.lastProgressX = enemy.x;
      nav.lastProgressY = enemy.y;
      nav.nudgeUntil = 0;
      nav.nudgeAngle = null;
      nav.nudgeSpeed = 0;
      return;
    }

    if (distanceToPlayer <= ENEMY_STUCK_IGNORE_RADIUS) return;
    if (now - (nav.lastProgressAt ?? 0) < ENEMY_STUCK_TIMEOUT_MS) return;
    if ((nav.stuckCooldownUntil ?? 0) > now) return;

    nav.path = null;
    nav.index = 0;
    nav.goalKey = "";
    nav.startKey = "";
    nav.nextRecalc = now;
    nav.lastProgressAt = now;
    nav.lastProgressX = enemy.x;
    nav.lastProgressY = enemy.y;
    nav.stuckCooldownUntil = now + ENEMY_STUCK_TIMEOUT_MS;
    const baseAngle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
    const offset = Phaser.Math.DegToRad(Phaser.Math.RND.pick([-90, 90]));
    const nudgeAngle = baseAngle + offset;
    const speed = Math.max(ENEMY_STUCK_NUDGE_SPEED_MIN, chaseSpeed * 0.75);
    nav.nudgeAngle = nudgeAngle;
    nav.nudgeSpeed = speed;
    nav.nudgeUntil = now + ENEMY_STUCK_NUDGE_DURATION_MS;

    const vx = Math.cos(nudgeAngle) * speed;
    const vy = Math.sin(nudgeAngle) * speed;
    enemy.body.setVelocity(vx, vy);
  }

  /* ==== 玩家与动画 ==== */
  createPlayer() {
    this.player = this.physics.add
      .sprite(WORLD_SIZE/2, WORLD_SIZE/2, this.playerIdleFrames.down)
      .setDepth(10);
    this.player.body.setAllowGravity(false);
    this.player.setCollideWorldBounds(true);
    this.applyPlayerScale();
    if (typeof this.player.setRoundPixels === "function") this.player.setRoundPixels(true);
    this.createPlayerAnimations();
    this.stopPlayerAnimation(this.playerFacing);

    this.focusIndicator = this.add.circle(this.player.x, this.player.y, PLAYER_FOCUS_RADIUS, 0xff6677, 0.9)
      .setDepth(11).setVisible(false);

    this.rangeGraphics = this.add.graphics().setDepth(2);
    this.rangeGraphics.clear();

    // Q施法范围预览图形（扇形+近战圈），默认隐藏
    this.qAimGraphics = this.add.graphics().setDepth(3);
    this.qAimGraphics.clear();

    this.playerWallCollider = this.physics.add.collider(this.player, this.wallGroup);

  }

  configurePlayerHitbox() {
    if (!this.player || !this.player.body) return;
    const frameWidth = this.player.width || 1;
    const frameHeight = this.player.height || 1;
    const scaleX = frameWidth !== 0 ? this.player.displayWidth / frameWidth : 1;
    const scaleY = frameHeight !== 0 ? this.player.displayHeight / frameHeight : 1;
    const averageScale = (scaleX && scaleY) ? (scaleX + scaleY) / 2 : 1;
    const radius = averageScale !== 0 ? PLAYER_HITBOX_RADIUS / averageScale : PLAYER_HITBOX_RADIUS;
    const offsetX = frameWidth / 2 - radius;
    const offsetY = frameHeight / 2 - radius;
    this.player.body.setCircle(radius, offsetX, offsetY);
  }

  applyPlayerScale() {
    if (!this.player) return;
    const frame = this.player.frame;
    const frameWidth = frame?.width ?? this.player.width ?? PIXELS_PER_TILE;
    const frameHeight = frame?.height ?? this.player.height ?? PIXELS_PER_TILE;
    const maxDimension = Math.max(frameWidth, frameHeight);
    const targetSize = PIXELS_PER_TILE * PLAYER_TILE_SCALE;
    const scale = maxDimension > 0
      ? (PIXELS_PER_TILE * PLAYER_TILE_SCALE) / maxDimension
      : PLAYER_TILE_SCALE;
    const currentScale = this.player.scaleX ?? 1;
    if (Math.abs(currentScale - scale) > 0.0001) this.player.setScale(scale);
    this.configurePlayerHitbox();
  }

  registerMovementDirection(direction) {
    if (!direction) return;
    const order = this.movementDirectionOrder ?? [];
    const index = order.indexOf(direction);
    if (index !== -1) order.splice(index, 1);
    order.push(direction);
    this.movementDirectionOrder = order;
  }
  unregisterMovementDirection(direction) {
    if (!direction || !this.movementDirectionOrder) return;
    const idx = this.movementDirectionOrder.indexOf(direction);
    if (idx !== -1) this.movementDirectionOrder.splice(idx, 1);
  }
  isMovementDirectionActive(direction) {
    if (!direction || !this.keys) return false;
    const key = this.keys[direction];
    return Boolean(key && key.isDown);
  }
  resolveMovementDirection(inputVX, inputVY) {
    if (this.movementDirectionOrder && this.movementDirectionOrder.length > 0) {
      for (let i = this.movementDirectionOrder.length - 1; i >= 0; i -= 1) {
        const dir = this.movementDirectionOrder[i];
        if (this.isMovementDirectionActive(dir)) return dir;
      }
    }
    if (Math.abs(inputVX) > Math.abs(inputVY)) return inputVX > 0 ? "right" : "left";
    if (inputVY !== 0) return inputVY > 0 ? "down" : "up";
    if (inputVX !== 0) return inputVX > 0 ? "right" : "left";
    return this.playerFacing ?? "down";
  }

  createPlayerAnimations() {
    [
      { key: "player-down", frames: ["reimu_11","reimu_12","reimu_13","reimu_14"] },
      { key: "player-left", frames: ["reimu_21","reimu_22","reimu_23","reimu_24"] },
      { key: "player-up",   frames: ["reimu_31","reimu_32","reimu_33","reimu_34"] },
    ].forEach(({ key, frames }) => {
      if (this.anims.exists(key)) return;
      this.anims.create({ key, frames: frames.map((f)=>({key:f})), frameRate: PLAYER_ANIMATION_FRAME_RATE, repeat: -1 });
    });
  }

  playPlayerAnimation(direction) {
    if (!this.player) return;
    const animKey = this.playerAnimationKeys[direction];
    if (!animKey) return;
    const shouldFlip = direction === "right";
    this.player.setFlipX(shouldFlip);
    if (this.player.anims.currentAnim?.key !== animKey || !this.player.anims.isPlaying) {
      this.player.anims.play(animKey, true);
    }
    this.applyPlayerScale();
  }
  stopPlayerAnimation(direction) {
    if (!this.player) return;
    const idleKey = this.playerIdleFrames[direction] ?? this.playerIdleFrames.down;
    const shouldFlip = direction === "right";
    if (this.player.flipX !== shouldFlip) this.player.setFlipX(shouldFlip);
    if (this.player.anims.isPlaying) this.player.anims.stop();
    if (idleKey && this.player.texture?.key !== idleKey) this.player.setTexture(idleKey);
    this.applyPlayerScale();
  }
  updatePlayerAnimationState(isMoving, inputVX, inputVY) {
    if (!this.player) return;
    let nextDir = this.playerFacing ?? "down";
    if (isMoving) {
      nextDir = this.resolveMovementDirection(inputVX, inputVY);
      this.playPlayerAnimation(nextDir);
    } else {
      this.stopPlayerAnimation(nextDir);
    }
    this.playerFacing = nextDir;
  }

  /* ==== 武器与弹轨 ==== */
  createWeapon() {
    this.weaponSprite = this.add.sprite(this.player.x + WEAPON_ORBIT_RADIUS, this.player.y, "weapon").setDepth(9);
    const weaponSize = PIXELS_PER_TILE;
    this.weaponSprite.setDisplaySize(weaponSize, weaponSize);
    if (typeof this.weaponSprite.setRoundPixels === "function") this.weaponSprite.setRoundPixels(true);
  }
  createBulletTrailResources() {
    if (!this.textures.exists("bullet_trail")) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xffffff, 1); g.fillCircle(5, 5, 5);
      g.generateTexture("bullet_trail", 10, 10); g.destroy();
    }
    if (!this.textures.exists("dash_particle")) { // 新增：冲刺微粒
      const g2 = this.make.graphics({ x: 0, y: 0, add: false });
      g2.fillStyle(0xffaa00, 1); g2.fillCircle(3, 3, 3);
      g2.generateTexture("dash_particle", 6, 6); g2.destroy();
    }
    this.destroyBulletTrailGroup();
    this.bulletTrailGroup = this.add.group();
    this.events.once("shutdown", () => this.destroyBulletTrailGroup());
    this.events.once("destroy", () => this.destroyBulletTrailGroup());
  }
  destroyBulletTrailGroup() {
    if (this.bulletTrailGroup) {
      this.bulletTrailGroup.getChildren().forEach((trail) => trail.destroy());
      this.bulletTrailGroup.clear(true, true);
      this.bulletTrailGroup = null;
    }
  }
  attachBulletTrailToBullet(bullet) {
    if (!bullet || !this.bulletTrailGroup) return;
    if (bullet.trailTimer) bullet.trailTimer.remove(false);
    bullet.trailTimer = this.time.addEvent({ delay: 45, loop: true, callback: () => this.spawnBulletTrail(bullet) });
    this.spawnBulletTrail(bullet);
  }
  detachBulletTrailFromBullet(bullet, burst = false) {
    if (!bullet) return;
    if (bullet.trailTimer) { bullet.trailTimer.remove(false); bullet.trailTimer = null; }
    if (burst) this.spawnBulletTrail(bullet, 3);
  }
  spawnBulletTrail(bullet, quantity = 1) {
    if (!this.bulletTrailGroup || !bullet || !bullet.active) return;
    for (let i=0;i<quantity;i+=1) {
      let trail = this.bulletTrailGroup.getFirstDead(false);
      if (!trail) {
        trail = this.add.image(0, 0, "bullet_trail");
        trail.setDepth(7); trail.setBlendMode(Phaser.BlendModes.ADD);
        trail.setActive(false); trail.setVisible(false);
        this.bulletTrailGroup.add(trail);
      }
      if (!trail) return;
      trail.setActive(true); trail.setVisible(true);
      trail.x = bullet.x; trail.y = bullet.y;
      const baseScale = 0.4; const randomScale = Phaser.Math.FloatBetween(0.2, 0.5);
      trail.setScale(baseScale + randomScale); trail.setAlpha(0.6);
      this.tweens.add({
        targets: trail, alpha: 0, scale: 0, duration: 220, onComplete: () => {
          trail.setActive(false); trail.setVisible(false);
        }
      });
    }
  }

  /* ==== 物理组与碰撞 ==== */
  createGroups() {
    this.enemies = this.physics.add.group();
    this.bullets = this.physics.add.group();
    this.qTalismans = this.physics.add.group();
    this.loot = this.physics.add.group();
    this.places = this.physics.add.staticGroup();

    this.physics.add.collider(this.enemies, this.wallGroup);
    this.physics.add.collider(this.enemies, this.enemies);

    this.physics.add.overlap(this.bullets, this.enemies, this.handleBulletEnemyOverlap, null, this);
    this.physics.add.overlap(this.qTalismans, this.enemies, this.handleQTalismanEnemyOverlap, null, this);

    // 玩家子弹撞墙：生成小爆炸特效并销毁子弹
    if (this.wallGroup) {
      this.physics.add.collider(this.bullets, this.wallGroup, (bullet, _wall) => {
        if (bullet && bullet.active) this.spawnWallHitExplosion(bullet.x, bullet.y);
        this.destroyBullet(bullet);
      });
    }
    this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyContact, null, this);
    this.physics.add.overlap(this.player, this.loot, this.collectPoint, null, this);
    this.physics.add.overlap(this.player, this.places, this.handlePlaceOverlap, null, this);
  }

  /* ==== 相机 ==== */
  setupCamera() {
    const camera = this.cameras.main;
    camera.setBounds(0, 0, WORLD_SIZE, WORLD_SIZE);
    camera.startFollow(this.player, false, 1, 1);
    camera.setZoom(this.currentZoom);
    camera.roundPixels = false;
  }
  handleMouseWheel(_pointer, _gameObjects, _deltaX, deltaY) {
    if (!deltaY) return;
    const direction = Math.sign(deltaY);
    if (direction === 0) return;
    this.currentZoom = Phaser.Math.Clamp(this.currentZoom - direction * CAMERA_ZOOM_STEP, CAMERA_ZOOM_MIN, CAMERA_ZOOM_MAX);
    this.cameras.main.setZoom(this.currentZoom);
    this.updateOverlayScale();
  }
  updateOverlayScale() {
    const overlayScale = CAMERA_ZOOM / this.currentZoom;
    this.scaleOverlayElement(this.roundOverlayBackground, overlayScale);
    this.scaleOverlayElement(this.roundOverlayElements, overlayScale);
    this.scaleOverlayElement(this.pauseOverlayBackground, overlayScale);
    this.scaleOverlayElement(this.pauseOverlayElements, overlayScale);
    this.scaleOverlayElement(this.gameOverOverlayBackground, overlayScale);
    this.scaleOverlayElement(this.gameOverOverlayElements, overlayScale);
  }
  scaleOverlayElement(target, scale) {
    if (!target) return;
    if (Array.isArray(target)) { target.forEach((t)=> this.scaleOverlayElement(t, scale)); return; }
    if (target instanceof Phaser.GameObjects.Text) setFontSizeByScale(target, scale);
    else if (typeof target.setScale === "function") target.setScale(scale);
  }

  /* ==== 声音与暂停 ==== */
  playSfx(key, overrides = {}) {
    if (!this.sound) return;
    // 触发节流：同一素材最小间隔 0.2s
    const now = this.time?.now ?? performance.now();
    const last = this.sfxLastPlayed?.[key] ?? 0;
    if (now - last < (this.sfxMinIntervalMs ?? 200)) return;
    this.sfxLastPlayed[key] = now;
    const baseConfig = this.sfxConfig?.[key] ?? {};
    this.sound.play(key, { ...baseConfig, ...overrides });
  }
  handlePauseKey(event) {
    if (!event || event.code !== "Escape") return;
    if (event.repeat) { event.preventDefault(); return; }
    if (this.isGameOver || this.roundAwaitingDecision || (this.roundComplete && !this.isPaused)) return;
    event.preventDefault();
    if (this.isPaused) this.resumeGame();
    else this.pauseGame();
  }
  pauseGame() {
    if (this.isPaused || this.roundComplete || this.roundAwaitingDecision) return;
    this.isPaused = true;
    this.physics.pause();
    this.time.timeScale = 0;
    if (this.battleBgm?.isPlaying) this.battleBgm.pause();
    if (this.attackTimer) this.attackTimer.paused = true;
    if (this.spawnTimer) this.spawnTimer.paused = true;
    // Use unified HTML overlay for pause
    this.showHtmlStatsOverlay("pause");
    this.playSfx("pause");
  }
  resumeGame() {
    if (!this.isPaused) return;
    this.isPaused = false;
       this.time.timeScale = 1;
    this.physics.resume();
    if (this.battleBgm) {
      if (this.battleBgm.isPaused) this.battleBgm.resume();
      else if (!this.battleBgm.isPlaying) this.battleBgm.play();
    }
    if (this.attackTimer) this.attackTimer.paused = false;
    if (this.spawnTimer) this.spawnTimer.paused = false;
    this.clearPauseOverlay();
    if (typeof this.hideHtmlStatsOverlay === "function") this.hideHtmlStatsOverlay();
  }
  exitToStartFromPause() {
    if (!this.isPaused) return;
    this.clearPauseOverlay();
    if (typeof this.hideHtmlStatsOverlay === "function") this.hideHtmlStatsOverlay();
    this.isPaused = false;
    this.time.timeScale = 1;
    this.physics.resume();
    if (this.battleBgm) {
      if (this.battleBgm.isPaused) this.battleBgm.resume();
      else if (!this.battleBgm.isPlaying) this.battleBgm.play();
    }
    if (this.attackTimer) this.attackTimer.paused = false;
    if (this.spawnTimer) this.spawnTimer.paused = false;
    this.scene.start("StartScene");
  }
  showPauseOverlay() {
    this.clearPauseOverlay();
    const bg = this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.6)
      .setScrollFactor(0).setDepth(45);
    const title = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 24, "游戏暂停", {
      fontFamily: '"Zpix", monospace', fontSize: "18px", color: "#ffffff",
    }).setOrigin(0.5).setScrollFactor(0).setDepth(46);
    ensureBaseFontSize(title);
    const prompt = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 14, "按 ESC 或 Y 继续游戏，按 N 返回标题", {
      fontFamily: '"Zpix", monospace', fontSize: "14px", color: "#d0d0ff",
    }).setOrigin(0.5).setScrollFactor(0).setDepth(46);
    ensureBaseFontSize(prompt);

    this.pauseOverlayBackground = bg;
    this.pauseOverlayElements = [title, prompt];
    this.updateOverlayScale();

    this.pauseDecisionHandler = (e) => {
      if (!e) return;
      if (e.code === "KeyY" || e.code === "Enter" || e.code === "Escape") this.resumeGame();
      else if (e.code === "KeyN") this.exitToStartFromPause();
    };
    this.input.keyboard.on("keydown", this.pauseDecisionHandler, this);
  }
  clearPauseOverlay() {
    if (this.pauseOverlayElements?.length) this.pauseOverlayElements.forEach((el)=> el.destroy());
    this.pauseOverlayElements = [];
    if (this.pauseOverlayBackground) { this.pauseOverlayBackground.destroy(); this.pauseOverlayBackground = null; }
    if (this.pauseDecisionHandler) { this.input.keyboard.off("keydown", this.pauseDecisionHandler, this); this.pauseDecisionHandler = null; }
  }

  /* ==== 输入 ==== */
  setupInput() {
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      focus: Phaser.Input.Keyboard.KeyCodes.SHIFT,
    });
// 技能键
// Q：按下显示随鼠标方向旋转的施法范围，抬起后释放
this.input.keyboard.on("keydown-Q", (e)=> { if (e?.repeat) return; this.startQAiming(); });
this.input.keyboard.on("keyup-Q", ()=> this.finishQAiming());
// 其他技能：依旧按下即释放
this.input.keyboard.on("keydown-E", ()=> this.castE());
this.input.keyboard.on("keydown-R", ()=> this.castR());
this.input.keyboard.on("keydown-SPACE", ()=> this.castDash());

// 退出时清理
const offSkills = ()=> {
  this.input.keyboard.off("keydown-Q", undefined, this);
  this.input.keyboard.off("keyup-Q", undefined, this);
  this.input.keyboard.off("keydown-E", undefined, this);
  this.input.keyboard.off("keydown-R", undefined, this);
  this.input.keyboard.off("keydown-SPACE", undefined, this);
};
this.events.once("shutdown", offSkills);
this.events.once("destroy", offSkills);

    this.movementDirectionOrder = this.movementDirectionOrder ?? [];
    this.movementKeyHandlers = [];
    MOVEMENT_KEY_BINDINGS.forEach(({ code, direction }) => {
      const downEvent = `keydown-${code}`;
      const upEvent = `keyup-${code}`;
      const downHandler = (event) => { if (event?.repeat) return; this.registerMovementDirection(direction); };
      const upHandler = () => { this.unregisterMovementDirection(direction); };
      this.input.keyboard.on(downEvent, downHandler, this);
      this.input.keyboard.on(upEvent, upHandler, this);
      this.movementKeyHandlers.push({ event: downEvent, handler: downHandler }, { event: upEvent, handler: upHandler });
    });

    this.input.on("wheel", this.handleMouseWheel, this);
    this.input.keyboard.on("keydown", this.handlePauseKey, this);

    const offAll = () => {
      this.input.off("wheel", this.handleMouseWheel, this);
      this.input.keyboard.off("keydown", this.handlePauseKey, this);
      if (this.movementKeyHandlers) {
        this.movementKeyHandlers.forEach(({ event, handler }) => this.input.keyboard.off(event, handler, this));
        this.movementKeyHandlers = [];
      }
      this.movementDirectionOrder = [];
      this.stopAuraVisual();
      this.clearPauseOverlay();
    };
    this.events.once("shutdown", offAll);
    this.events.once("destroy", offAll);
  }

  /* ==== 计时器 ==== */
  setupTimers() {
    this.rebuildAttackTimer();
    this.scheduleSpawnTimer();
  }
  scheduleSpawnTimer() {
    if (this.debugBossMode || this.isBossStage) {
      if (this.spawnTimer) { this.spawnTimer.remove(); this.spawnTimer = null; }
      return;
    }
    if (this.roundComplete || this.roundAwaitingDecision) {
      if (this.spawnTimer) { this.spawnTimer.remove(); this.spawnTimer = null; }
      return;
    }
    if (this.spawnTimer) this.spawnTimer.remove();
    const rankValue = Math.max(Number.isFinite(this.rank) ? this.rank : 0, 0);
    const growthTerm = 1 + 0.2 * (rankValue - 10);
    const speedFactor = Math.max(0.1, growthTerm);
    //const intervalSeconds = Math.max(0.01, 1 / Math.sqrt(speedFactor));
    // 基础间隔：随 rank 提高而缩短；第10关后再额外加快4倍（即间隔减为原来的1/4）
    let intervalSeconds = Math.max(0.01, 10 / rankValue);
    if (Math.floor(this.level || 0) > 10) {
      intervalSeconds = Math.max(0.0025, intervalSeconds / 4);
    }
    const delay = intervalSeconds * 1000;
    this.spawnTimer = this.time.addEvent({ delay, loop: true, callback: () => this.spawnEnemy() });
  }

  /* ==== HUD ==== */
  setupHUD() { this.updateOverlayScale(); this.updateHUD(); }

  /* ==== 地点：商店/宝箱 ==== */
  handlePlaceOverlap(_player, place) {
    if (!place || !place.active) return;
    if (place.placeType === "shop") {
      if (place._consumed) return;
      if (this.isShopOpen()) return;
      place._consumed = true;
      // 打开商店（不停止音乐）
      this.openShop("inRun");
      // 进入后商店贴图消失：移除并销毁
      if (this.places) this.places.remove(place, true, true);
      else place.destroy();
      if (Array.isArray(this.shopPlaces)) {
        const i = this.shopPlaces.indexOf(place);
        if (i >= 0) this.shopPlaces.splice(i, 1);
      }
    }
  }

  spawnMapPlaces() {
    if (!this.places) this.places = this.physics.add.staticGroup();
    this.shopPlaces = [];
    // 先放商店
    this.spawnRandomShops(MAP_SHOP_COUNT);
    // 再放宝箱
    this.spawnRandomChests(MAP_CHEST_COUNT);
  }

  spawnRandomShops(count = 2) {
    let placed = 0, attempts = 0;
    while (placed < count && attempts < count * 200) {
      attempts += 1;
      const pos = this.findClearPosition(32, { avoidPlayer: true });
      if (!pos) continue;
      const shop = this.places.create(pos.x, pos.y, "place_shop");
      if (!shop) continue;
      shop.setDepth(5);
      // 贴图宽度按 1 tile 缩放，保持原始纵横比（1*2），不压缩
      this.setDisplayWidthByTilesKeepAspect(shop, 1);
      if (typeof shop.refreshBody === "function") shop.refreshBody();
      shop.placeType = "shop";
      this.shopPlaces.push(shop);
      placed += 1;
    }
  }

  spawnRandomChests(count = 10) {
    let placed = 0, attempts = 0;
    while (placed < count && attempts < count * 300) {
      attempts += 1;
      const pos = this.findClearPosition(TILE_SIZE, { avoidPlayer: false });
      if (!pos) continue;
      const chest = this.spawnChestAt(pos.x, pos.y);
      if (chest) placed += 1;
    }
  }

  findClearPosition(radius = 16, opts = {}) {
    const avoidPlayer = opts?.avoidPlayer !== false;
    const maxAttempts = 60;
    const px = this.player?.x ?? WORLD_SIZE / 2;
    const py = this.player?.y ?? WORLD_SIZE / 2;
    for (let i = 0; i < maxAttempts; i += 1) {
      const x = Phaser.Math.Between(TILE_SIZE, WORLD_SIZE - TILE_SIZE);
      const y = Phaser.Math.Between(TILE_SIZE, WORLD_SIZE - TILE_SIZE);
      // 避开墙
      if (!this.isWithinWorldBounds(x, y)) continue;
      if (!this.isPositionWalkable(x, y)) continue;
      // 可选：避开玩家附近
      if (avoidPlayer && Phaser.Math.Distance.Between(x, y, px, py) < 80) continue;
      // 避开其它敌人与地点
      if (this.isPositionOccupied(x, y, radius)) continue;
      // 简单检查现有商店位置
      if (Array.isArray(this.shopPlaces)) {
        let tooClose = false;
        for (let j = 0; j < this.shopPlaces.length; j += 1) {
          const s = this.shopPlaces[j];
          if (!s?.active) continue;
          if (Phaser.Math.Distance.Between(x, y, s.x, s.y) < radius * 2) { tooClose = true; break; }
        }
        if (tooClose) continue;
      }
      return { x, y };
    }
    return null;
  }

  spawnChestAt(x, y) {
    if (!this.enemies) return null;
    const chest = this.enemies.create(x, y, "place_chest");
    if (!chest) return null;
    chest.setDepth(6);
    chest.body.setAllowGravity(false);
    chest.enemyType = "chest";
    chest.isChest = true;
    chest.enemyKind = "chest"; // 专用类别，用于跳过AI
    chest.body.moves = false;
    if (typeof chest.body.setImmovable === "function") chest.body.setImmovable(true);
    // 数值：HP 300 护甲 50
    chest.maxHp = 300;
    chest.hp = 300;
    chest.armor = 50;
    chest.def = 0;
    chest.attackDamage = 0;
    chest.contactDamage = 0;
    chest.abilityPower = 0;
    chest.dropRange = { min: 0, max: 0 }; // 不走普通掉落
    chest.state = "idle";

    // 外观 1 tile，判定半径=8
    this.setDisplaySizeByTiles(chest, 1);
    const radiusPx = TILE_SIZE / 2; // 8
    const frameW = chest.displayWidth || chest.width || TILE_SIZE;
    const frameH = chest.displayHeight || chest.height || TILE_SIZE;
    const offsetX = frameW / 2 - radiusPx;
    const offsetY = frameH / 2 - radiusPx;
    if (typeof chest.body.setCircle === "function") {
      chest.body.setCircle(radiusPx, offsetX, offsetY);
    } else if (chest.body.setSize) {
      chest.body.setSize(radiusPx * 2, radiusPx * 2);
      chest.body.setOffset(offsetX, offsetY);
    }
    return chest;
  }
  update(time, delta) {
    if (this.boss) this.updateBossUI(this.boss);
    if (this.isPaused) return;
    if (this.isShopOpen()) return;
    this.elapsed += delta;

    if (this.guinsooStacks > 0 && this.time.now >= (this.guinsooStacksExpireAt || 0)) {
      this.guinsooStacks = 0;
      this.guinsooStacksExpireAt = 0;
      this.guinsooFullProcCounter = 0;
      this.rebuildAttackTimer();
    }

    this.updatePlayerMovement();
    this.updateWeapon(delta);
    // Q瞄准预览
    this.updateQAim();
    this.updateBullets(delta);
    this.updateQTalismanProjectiles(delta);
    this.updateEnemies();
    this.updateLoot(delta);
    this.updateAura(delta);

    /* ==== 新增：更新 Boss 弹幕与Utsuho AI ==== */
    this.updateBossBullets(delta);
    if (this.boss && this.boss.isBoss && this.boss.bossKind === "Utsuho") {
      this.updateUtsuhoAI(delta);
    }
this.updateMikoOrbs(delta);

    // —— 基础与装备回复 —— //
    this.updateRegen(delta);

    // —— 自动使用药水：不依赖是否刚受到伤害，只要满足“已损失生命值阈值”即可触发 —— //
    if (typeof this.tryAutoUsePotions === 'function') {
      this.tryAutoUsePotions();
    }

    // 白楼剑动量过期处理
    this.updateBailouMomentum(delta);

    this.updateRoundTimer(delta);
    this.checkNoDamageRankBonus();
    this.updateHUD();
  }

  // 定时清理白楼剑动量层数（过期移除并重算移速）
  updateBailouMomentum(_delta) {
    if (!this.hasItemEquipped(BAILOU_SWORD_ID)) return;
    if (!Array.isArray(this.bailouMomentumExpires) || this.bailouMomentumExpires.length === 0) return;
    const now = this.time.now;
    const before = this.bailouMomentumExpires.length;
    this.bailouMomentumExpires = this.bailouMomentumExpires.filter((t) => t > now);
    const after = this.bailouMomentumExpires.length;
    if (after !== before) {
      this.bailouMomentumStacks = after;
      this.recalculateEquipmentEffects();
    }
  }

  // —— 每帧更新基础/装备带来的生命与法力回复 —— //
  updateRegen(delta) {
    const dt = Math.max(0, delta) / 1000; // 秒
    // 法力回复： (基础 + 装备平直) * 装备倍率
    const maxMana = this.playerStats?.maxMana ?? PLAYER_BASE_STATS.maxMana ?? PLAYER_MANA_MAX;
    if (maxMana > 0) {
      const perSecond = Math.max(0, (this.baseManaRegenPerSecond || 0) + (this.manaRegenFlatPerSecond || 0)) * (this.manaRegenMultiplier || 1);
      if (perSecond > 0 && (this.currentMana ?? 0) < maxMana) {
        const gainRaw = perSecond * dt + (this._manaRegenCarry || 0);
        const gain = Math.floor(gainRaw);
        this._manaRegenCarry = gainRaw - gain;
        if (gain > 0) {
          this.currentMana = Math.min(maxMana, (this.currentMana || 0) + gain);
          this.updateResourceBars();
        }
      }
    }

    // 生命回复：装备平直（可扩展倍率）
    const maxHp = this.playerStats?.maxHp ?? PLAYER_BASE_STATS.maxHp;
    if (maxHp > 0) {
      const perSecondHp = Math.max(0, this.hpRegenPerSecondFlat || 0); // 目前仅平直回复
      if (perSecondHp > 0 && (this.currentHp ?? 0) < maxHp) {
        const gainRaw = perSecondHp * dt + (this._hpRegenCarry || 0);
        const gain = Math.floor(gainRaw);
        this._hpRegenCarry = gainRaw - gain;
        if (gain > 0) {
          this.currentHp = Math.min(maxHp, (this.currentHp || 0) + gain);
          this.updateResourceBars();
        }
      }
    }
  }

  updatePlayerMovement() {
    const { up, down, left, right, focus } = this.keys;
    let vx = 0, vy = 0;

    if (this.playerSpeedBuffExpiresAt && this.time.now >= this.playerSpeedBuffExpiresAt) {
      this.playerSpeedBuffMultiplier = 1;
      this.playerSpeedBuffExpiresAt = 0;
    }

    if (left.isDown) vx -= 1;
    if (right.isDown) vx += 1;
    if (up.isDown) vy -= 1;
    if (down.isDown) vy += 1;

    const inputVX = vx, inputVY = vy;
    const isMoving = inputVX !== 0 || inputVY !== 0;
    let normX = 0, normY = 0;
    if (isMoving) {
      const len = Math.sqrt(inputVX*inputVX + inputVY*inputVY);
      normX = inputVX / len; normY = inputVY / len;
    }

    const speedModifier = focus.isDown ? PLAYER_FOCUS_MULTIPLIER : 1;
    const speedBuffMultiplier = this.playerSpeedBuffMultiplier ?? 1;
    const baseSpeed = this.playerStats?.moveSpeed ?? PLAYER_BASE_SPEED;
    const speed = baseSpeed * speedModifier * speedBuffMultiplier;

    if (isMoving) {
      const velX = Phaser.Math.RoundAwayFromZero(normX * speed);
      const velY = Phaser.Math.RoundAwayFromZero(normY * speed);
      this.player.body.setVelocity(velX, velY);
    } else {
      this.player.body.setVelocity(0, 0);
    }

    this.updatePlayerAnimationState(isMoving, inputVX, inputVY);

    this.focusIndicator.setVisible(focus.isDown).setPosition(this.player.x, this.player.y);
    this.setRangeDisplay(focus.isDown);
    if (this.rangeVisible) this.drawRangeCircle(); else this.rangeGraphics.clear();
  }

  drawRangeCircle() {
    if (!this.rangeVisible) { this.rangeGraphics.clear(); return; }
    const originX = this.weaponSprite ? this.weaponSprite.x : this.player.x;
       const originY = this.weaponSprite ? this.weaponSprite.y : this.player.y;
    const radius = statUnitsToPixels(this.playerStats.range);
    this.rangeGraphics.clear();
    this.rangeGraphics.lineStyle(0.6, 0x44aaff, 0.4);
    this.rangeGraphics.strokeCircle(originX, originY, radius);
  }
  setRangeDisplay(isVisible) {
    if (this.rangeVisible === isVisible) return;
    this.rangeVisible = isVisible;
    if (!isVisible) this.rangeGraphics.clear();
  }

  // —— Q施法范围：按下Q开始瞄准（显示扇形+近战圆），抬起Q后释放 —— //
  startQAiming() {
    if (this.qAiming) return;
    if (this.isPaused || this.isShopOpen()) return;
    this.qAiming = true;
    // 初始化角度为当前鼠标方向
    const pointer = this.input?.activePointer ?? null;
    const camera = this.cameras?.main ?? null;
    if (pointer && camera) {
      const worldPoint = camera.getWorldPoint(pointer.x, pointer.y);
      const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, worldPoint.x, worldPoint.y);
      if (Number.isFinite(angle)) {
        this.qAimAngle = angle;
        this.lastAimAngle = angle;
      }
    }
    // 立即绘制一帧
    this.drawQAimIndicator();
  }

  finishQAiming() {
    if (!this.qAiming) return;
    if (this.isPaused || this.isShopOpen()) { this.qAiming = false; if (this.qAimGraphics) this.qAimGraphics.clear(); return; }
    this.qAiming = false;
    if (this.qAimGraphics) this.qAimGraphics.clear();
    // 抬起后施法（可否施法由castQ内部canCast判定）
    this.castQ();
  }

  updateQAim() {
    if (!this.qAiming || !this.player) return;
    const pointer = this.input?.activePointer ?? null;
    const camera = this.cameras?.main ?? null;
    if (pointer && camera) {
      const worldPoint = camera.getWorldPoint(pointer.x, pointer.y);
      const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, worldPoint.x, worldPoint.y);
      if (Number.isFinite(angle)) {
        this.qAimAngle = angle;
        this.lastAimAngle = angle; // 与castQ保持一致
      }
    }
    this.drawQAimIndicator();
  }

  drawQAimIndicator() {
    if (!this.qAimGraphics) return;
    this.qAimGraphics.clear();
    if (!this.qAiming || !this.player) return;

    const cx = this.player.x;
    const cy = this.player.y;
    const angle = this.qAimAngle ?? 0;
    const half = Phaser.Math.DegToRad(Q_AIM_CONE_ANGLE_DEG / 2);
    const start = angle - half;
    const end = angle + half;

    // 扇形（远程Q三枚符札覆盖范围）
    this.qAimGraphics.fillStyle(0x44aaff, 0.18);
    this.qAimGraphics.lineStyle(1, 0x44aaff, 0.9);
    this.qAimGraphics.beginPath();
    this.qAimGraphics.moveTo(cx, cy);
    this.qAimGraphics.arc(cx, cy, Q_AIM_RADIUS, start, end, false);
    this.qAimGraphics.closePath();
    this.qAimGraphics.fillPath();
    this.qAimGraphics.strokePath();

    // 中心方向线（可视化朝向）
    const tx = cx + Math.cos(angle) * Q_AIM_RADIUS;
    const ty = cy + Math.sin(angle) * Q_AIM_RADIUS;
    this.qAimGraphics.lineStyle(1, 0x44aaff, 0.9);
    this.qAimGraphics.beginPath();
    this.qAimGraphics.moveTo(cx, cy);
    this.qAimGraphics.lineTo(tx, ty);
    this.qAimGraphics.strokePath();

    // 近战半圆范围（以面向为直径方向）
    const meleeRadius = 4 * TILE_SIZE;
    const mStart = angle - Math.PI / 2;
    const mEnd = angle + Math.PI / 2;
    const sx = cx + Math.cos(mStart) * meleeRadius;
    const sy = cy + Math.sin(mStart) * meleeRadius;
    this.qAimGraphics.fillStyle(0xff6677, 0.17);
    this.qAimGraphics.lineStyle(1, 0xff6677, 0.9);
    this.qAimGraphics.beginPath();
    this.qAimGraphics.moveTo(sx, sy);
    this.qAimGraphics.arc(cx, cy, meleeRadius, mStart, mEnd, false);
    this.qAimGraphics.lineTo(sx, sy);
    this.qAimGraphics.closePath();
    this.qAimGraphics.fillPath();
    this.qAimGraphics.strokePath();

    // 近战命中圈（保留细线帮助定位半径）
    this.qAimGraphics.lineStyle(1, 0xff6677, 0.5);
    this.qAimGraphics.strokeCircle(cx, cy, meleeRadius);
  }

  updateWeapon(delta) {
    // Focus(Shift)与形态对阴阳玉的半径/速度影响
    const focusDown = this.keys?.focus?.isDown === true;
    let orbitSpeed = WEAPON_ORBIT_SPEED;
    // 近战：将所有额外攻速转换为转速（装备与特效），但不包含远程形态下的+20%
    if (this.playerCombatMode === "melee") {
      // 近战初始转速提升为当前的2倍
      orbitSpeed *= MELEE_BASE_ORBIT_SPEED_MULTIPLIER;
      const baseAS = Math.max(0.1, PLAYER_BASE_STATS.attackSpeed || 0.1);
      const effAS = Math.max(0.1, (this.playerStats?.attackSpeed || baseAS)) * this.getAttackSpeedBonusMultiplier();
      const extraASMult = Math.max(0.1, effAS / baseAS);
      orbitSpeed *= extraASMult;
    }
    if (focusDown) orbitSpeed *= FOCUS_ORBIT_SPEED_MULTIPLIER; // Focus：转速×2

    // 推进角度
    const angleDelta = Phaser.Math.DegToRad((orbitSpeed * delta) / 1000);
    this.weaponAngle = (this.weaponAngle + angleDelta) % Phaser.Math.PI2;

    // 半径：近战×2；Focus压缩半径
    let orbitRadius = WEAPON_ORBIT_RADIUS * (this.playerCombatMode === "melee" ? 2 : 1);
    if (focusDown) orbitRadius *= FOCUS_ORBIT_RADIUS_MULTIPLIER;

    // 设定位置（统一用当前半径）
    const offsetX = Math.cos(this.weaponAngle) * orbitRadius;
    const offsetY = Math.sin(this.weaponAngle) * orbitRadius;
    this.weaponSprite.setPosition(this.player.x + offsetX, this.player.y + offsetY);
    if (this.rangeVisible) this.drawRangeCircle();

    // 形态外观与命中体跟随
    if (this.playerCombatMode === "melee") {
      const bigScale = 2;
      this.weaponSprite.setScale(bigScale);
      // 命中体同步
      if (this.weaponHitbox) {
        this.weaponHitbox.setPosition(this.weaponSprite.x, this.weaponSprite.y);
        const r = 16 * bigScale; // 命中半径
        this.weaponHitbox.setCircle(r, this.weaponHitbox.width/2 - r, this.weaponHitbox.height/2 - r);
        this.weaponHitbox.setVisible(false);
        this.weaponHitbox.active = true;
        this.weaponHitbox.body.enable = true;
      }
    } else {
      this.weaponSprite.setScale(0.5);
      if (this.weaponHitbox) {
        this.weaponHitbox.active = false;
        this.weaponHitbox.body.enable = false;
      }
    }
  }

  updateQTalismanProjectiles(_delta) {
    if (!this.qTalismans) return;
    const projectiles = this.qTalismans.getChildren();
    for (let i = projectiles.length - 1; i >= 0; i -= 1) {
      const projectile = projectiles[i];
      if (!projectile || !projectile.active) continue;
      const body = projectile.body;
      if (body) {
        const vx = body.velocity?.x ?? 0;
        const vy = body.velocity?.y ?? 0;
        if (vx !== 0 || vy !== 0) projectile.rotation = Math.atan2(vy, vx) + Math.PI / 2;
      }
      if (
        projectile.x < -Q_TALISMAN_BOUNDARY_PADDING
        || projectile.y < -Q_TALISMAN_BOUNDARY_PADDING
        || projectile.x > WORLD_SIZE + Q_TALISMAN_BOUNDARY_PADDING
        || projectile.y > WORLD_SIZE + Q_TALISMAN_BOUNDARY_PADDING
      ) {
        this.destroyQTalisman(projectile);
      }
    }
  }

  updateBullets(delta) {
    const bullets = this.bullets.getChildren();
    for (let i=bullets.length-1; i>=0; i-=1) {
      const bullet = bullets[i];
      if (!bullet.active) continue;
      const timeAlive = this.time.now - bullet.spawnTime;
      if (timeAlive > BULLET_LIFETIME) { this.destroyBullet(bullet); continue; }

      const target = this.findNearestEnemy(bullet.x, bullet.y, Number.MAX_VALUE);
      if (target) {
        const angle = Phaser.Math.Angle.Between(bullet.x, bullet.y, target.x, target.y);
        this.physics.velocityFromRotation(angle, BULLET_SPEED, bullet.body.velocity);
        bullet.setRotation(angle + Math.PI / 2);
      } else {
        bullet.body.setVelocity(0, 0);
      }
    }
  }

getEffectiveCooldown(baseMs) {
  const cdr = this.playerStats?.cooldownReduction ?? 0; // 0~1
  return Math.max(0, Math.round(baseMs * (1 - cdr)));
}

onSpellCastComplete() {
  // 检查是否可以激活耀光效果
  const now = this.time.now;
  if (!this.canTriggerSpellblade(now)) return;

  // 查找耀光装备
  const spellbladeItem = this.playerEquipmentSlots.find(id => this.isSpellbladeItem(id));
  if (!spellbladeItem) return;

  const item = this.getEquipmentDefinition(spellbladeItem);
  if (!item) return;

  // 设置耀光效果标记，表示下次普攻将触发耀光效果
  this.nextAttackTriggersSpellblade = true;

  // 更新装备栏显示

  this.refreshEquipmentUI();

  // 标记可以对下一个攻击目标触发耀光伤害
  this.nextAttackTriggersSpellblade = true;

  // 找到触发的装备槽并添加动画效果
  const slotIndex = this.playerEquipmentSlots.indexOf(spellbladeItem);
  if (slotIndex >= 0) {
    const slot = this.equipmentUi?.slots[slotIndex]?.element;
    if (slot) {
      slot.classList.add('spellblade-trigger');
      setTimeout(() => {
        slot.classList.remove('spellblade-trigger');
      }, 200);
    }
  }
}

canCast(key) {
  const now = this.time.now;
  const cfg = this.skillConfig[key];
  if (!cfg) return false;
  if (now < (this.skillReadyAt[key] || 0)) return false;
  if ((cfg.mana || 0) > (this.currentMana || 0)) return false;
  return true;
}
spendCostAndStartCd(key) {
  const now = this.time.now;
  const cfg = this.skillConfig[key];
  const cd = this.getEffectiveCooldown(cfg.baseCd);
  const mana = cfg.mana || 0;
  this.currentMana = Math.max(0, this.currentMana - mana);
  if (this.skillCooldownDuration && Object.prototype.hasOwnProperty.call(this.skillCooldownDuration, key)) {
    this.skillCooldownDuration[key] = cd;
  }
  this.skillReadyAt[key] = now + cd;
  this.updateResourceBars();
  this.updateSkillCooldownUI();
  // 炽天使：按消耗的法力值进行治疗
  if (mana > 0 && (this.manaSpendHealPerPoint || 0) > 0) {
    const heal = Math.max(0, Math.round(mana * this.manaSpendHealPerPoint));
    if (heal > 0) {
      this.currentHp = Math.min(this.playerStats.maxHp, (this.currentHp || 0) + heal);
      this.showHealNumber(this.player.x, this.player.y - 18, heal);
      this.updateResourceBars();
    }
  }
  // 女神泪/炽天使：释放技能叠层
  this.applyManaCastStack();
}

// 女神泪/炽天使：释放技能叠层（提升最大法力），并按炽天使的被动进行治疗
applyManaCastStack() {
  const perCast = this.manaStackPerCast || 0;
  const cap = this.manaStackCap || 0;
  if (perCast > 0 && cap > 0) {
    const maxCount = Math.floor(cap / perCast);
    if ((this.manaStackCount || 0) < maxCount) {
      this.manaStackCount = (this.manaStackCount || 0) + 1;
      const prevMax = this.playerStats?.maxMana ?? PLAYER_MANA_MAX;
      const prevCur = Math.min(this.currentMana ?? prevMax, prevMax);
      const ratio = prevMax > 0 ? (prevCur / prevMax) : 1;
      const bonus = perCast;
      if (this.playerStats) this.playerStats.maxMana = prevMax + bonus;
      this.currentMana = Math.min(this.playerStats.maxMana, Math.max(0, Math.round(this.playerStats.maxMana * ratio)));
      this.updateResourceBars();
      // 叠层后刷新装备栏徽标（女神泪/炽天使层数显示）
      this.refreshEquipmentUI();
    }
  }
}
isPlayerInvulnerable() {
  return this.time.now <= (this.playerInvulnerableUntil || 0);
}



updateEnemies() {
  const enemies = this.enemies.getChildren();
  const now = this.time.now;
  for (let i = enemies.length - 1; i >= 0; i -= 1) {
    const enemy = enemies[i];
    if (!enemy?.active) continue;

    // 导航状态初始化（仅对可移动体）
    if (!enemy.nav && enemy.enemyKind !== "turret") {
      this.initializeEnemyNav(enemy, now);
    } else if (enemy.nav) {
      if (typeof enemy.nav.lastProgressAt !== "number") enemy.nav.lastProgressAt = now;
      if (typeof enemy.nav.lastProgressX !== "number") enemy.nav.lastProgressX = enemy.x;
      if (typeof enemy.nav.lastProgressY !== "number") enemy.nav.lastProgressY = enemy.y;
      if (typeof enemy.nav.stuckCooldownUntil !== "number") enemy.nav.stuckCooldownUntil = 0;
      if (typeof enemy.nav.nextRecalc !== "number") enemy.nav.nextRecalc = now;
      if (typeof enemy.nav.nudgeUntil !== "number") enemy.nav.nudgeUntil = 0;
      if (typeof enemy.nav.nudgeAngle !== "number") enemy.nav.nudgeAngle = null;
      if (typeof enemy.nav.nudgeSpeed !== "number") enemy.nav.nudgeSpeed = 0;
    }

    // Boss 由专属逻辑驱动
    if (enemy.isBoss) continue;

    // 宝箱：不参与任何 AI（不移动不攻击）
    if (enemy.isChest) { enemy.body.setVelocity(0, 0); continue; }

    // 分派到三类 AI
    const delta = this.game.loop.delta; // ms
    switch (enemy.enemyKind) {
      case "charger":
        if (!enemy.aiState) enemy.aiState = "idle";
        this.updateChargerAI(enemy, now, delta);
        break;
      case "caster":
        this.updateCasterAI(enemy, now, delta);
        break;
      case "turret":
      default:
        this.updateTurretAI(enemy, now, delta);
        break;
    }
  }
}


  updateLoot(_delta) {
    const lootItems = this.loot.getChildren();
    const attractRadius = 50; // 固定拾取半径
    for (let i=lootItems.length-1; i>=0; i-=1) {
      const item = lootItems[i];
      if (!item.active) continue;
      const distance = Phaser.Math.Distance.Between(item.x, item.y, this.player.x, this.player.y);
      if (distance <= attractRadius) item.magnetActive = true;
      if (item.magnetActive) this.physics.moveToObject(item, this.player, PICKUP_ATTRACT_SPEED);
      else item.body.setVelocity(0, 0);
    }
  }

  updateAura(_delta) {
    const effect = this.auraEffect;
    if (!effect || effect.radius <= 0) {
      this.stopAuraVisual();
      return;
    }
    if (!this.player || !this.player.active) {
      this.stopAuraVisual();
      return;
    }

    this.ensureAuraVisual(effect);
    if (this.auraSprite) {
      this.auraSprite.setPosition(this.player.x, this.player.y);
      const diameter = effect.radius * 2;
      this.auraSprite.setDisplaySize(diameter, diameter);
    }

    const now = this.time.now;
    if (!this.auraNextTickAt || now >= this.auraNextTickAt) {
      this.applyAuraDamage(effect);
      this.auraNextTickAt = now + effect.intervalMs;
    }
  }

  ensureAuraVisual(effect) {
    if (this.auraSprite) return;
    if (!this.player || !this.add) return;
    const textureKey = effect.textureKey ?? "item_effect_sunfire";
    const sprite = this.add.image(this.player.x, this.player.y, textureKey);
    sprite.setDepth(this.player.depth ? this.player.depth - 1 : 3);
    sprite.setOrigin(0.5, 0.5);
    sprite.setAlpha(0);
    sprite.setBlendMode(Phaser.BlendModes.ADD);
    const diameter = effect.radius * 2;
    if (diameter > 0) sprite.setDisplaySize(diameter, diameter);
    this.auraSprite = sprite;
    if (this.auraTween) {
      if (typeof this.auraTween.stop === "function") this.auraTween.stop();
      if (typeof this.auraTween.remove === "function") this.auraTween.remove();
      this.auraTween = null;
    }
    this.auraTween = this.tweens.add({
      targets: sprite,
      alpha: { from: 0, to: 1 },
      duration: 280,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  stopAuraVisual() {
    if (this.auraTween) {
      if (typeof this.auraTween.stop === "function") this.auraTween.stop();
      if (typeof this.auraTween.remove === "function") this.auraTween.remove();
      this.auraTween = null;
    }
    if (this.auraSprite) {
      this.auraSprite.destroy();
      this.auraSprite = null;
    }
  }

  applyAuraDamage(effect) {
    const radius = effect.radius;
    if (radius <= 0) return;
    const maxHpStat = this.playerStats?.maxHp ?? PLAYER_BASE_STATS.maxHp;
    const baseDamage = Math.max(
      0,
      Math.round((effect.damageFlat ?? 0) + (effect.damageRatio ?? 0) * maxHpStat),
    );
    if (baseDamage <= 0) return;
    const enemies = (this.enemies && typeof this.enemies.getChildren === "function")
      ? this.enemies.getChildren()
      : [];
    if (!enemies.length) return;
    const radiusSq = radius * radius;
    for (let i = 0; i < enemies.length; i += 1) {
      const enemy = enemies[i];
      if (!enemy || !enemy.active) continue;
      const distSq = Phaser.Math.Distance.Squared(this.player.x, this.player.y, enemy.x, enemy.y);
      if (distSq > radiusSq) continue;
      // Infinity Orb applies to magic damage
      let raw = baseDamage;
      let typeToShow = "magic";
      if (this.hasItemEquipped(INFINITY_ORB_ID)) {
        const effInf = EQUIPMENT_DATA[INFINITY_ORB_ID]?.effects || {};
        const threshold = Number.isFinite(effInf.executeHpPct) ? effInf.executeHpPct : 0.5;
        const mult = Number.isFinite(effInf.magicCritMultiplier) ? effInf.magicCritMultiplier : 1.5;
        if ((enemy.hp / (enemy.maxHp || 1)) <= threshold) {
          raw = Math.round(raw * mult);
          typeToShow = "spellcrit";
        }
      }
      const dealt = this.applyMitigationToTarget(raw, enemy, this.playerStats, "magic", 1);
      if (dealt <= 0) continue;
      enemy.hp = Math.max(0, (enemy.hp ?? 0) - dealt);
      this.showDamageNumber(enemy.x, enemy.y, dealt, typeToShow);
      if (enemy.isBoss && typeof enemy.setData === "function") {
        enemy.setData("hp", enemy.hp);
        this.updateBossUI(enemy);
      }
      if (enemy.hp <= 0) this.killEnemy(enemy);
      // Omnivamp heal
      const omni = Math.max(0, this.playerEquipmentStats?.omniVampPct || 0);
      if (omni > 0) {
        const heal = Math.max(0, Math.round(dealt * omni));
        if (heal > 0) { this.currentHp = Math.min(this.currentHp + heal, this.playerStats.maxHp); this.showHealNumber(this.player.x, this.player.y - 18, heal); this.updateResourceBars(); }
      }
    }
  }

  updateRoundTimer(delta) {
    if (this.roundComplete || this.debugBossMode || this.isBossStage || this.isShopOpen()) return;
    this.roundTimeLeft = Math.max(0, this.roundTimeLeft - delta);
    if (this.roundTimeLeft <= 0) this.handleRoundComplete();
  }

  checkNoDamageRankBonus() {
    if (this.roundComplete || !this.nextNoDamageRankCheck) return;
    if (this.time.now >= this.nextNoDamageRankCheck) {
      this.rank = Number((this.rank * RANK_NO_DAMAGE_MULTIPLIER).toFixed(2));
      this.scheduleSpawnTimer();
      this.updateHUD();
      this.nextNoDamageRankCheck += NO_DAMAGE_RANK_INTERVAL;
    }
  }

  handleRoundComplete() {
    if (this.roundComplete) return;
    this.roundComplete = true;
    this.roundAwaitingDecision = true;
    if (this.spawnTimer) { this.spawnTimer.remove(); this.spawnTimer = null; }
    // 清空当前波次的怪物与所有类型的子弹
    this.clearEnemies();
    this.clearAllBullets();
    this.openShop("roundEnd");
  }
  clearEnemies() { this.enemies.getChildren().forEach((e)=> e.destroy()); }
  clearBullets() { this.bullets.getChildren().forEach((b)=> this.destroyBullet(b)); }
  // 统一清空：普通子弹 + Boss弹幕 + 其他投射物
  clearAllBullets() {
    try {
      if (this.bullets && typeof this.bullets.getChildren === "function") {
        this.bullets.getChildren().forEach((b) => this.destroyBullet(b));
      }
    } catch (_) {}
    try {
      if (typeof this.clearBossBullets === "function") this.clearBossBullets();
    } catch (_) {}
    try {
      if (this.qTalismans && typeof this.qTalismans.getChildren === "function") {
        const list = this.qTalismans.getChildren();
        for (let i = list.length - 1; i >= 0; i -= 1) {
          const p = list[i];
          if (p) this.qTalismans.remove(p, true, true);
        }
      }
    } catch (_) {}
    try {
      if (this.mikoOrbsGroup && typeof this.mikoOrbsGroup.getChildren === "function") {
        const list = this.mikoOrbsGroup.getChildren();
        for (let i = list.length - 1; i >= 0; i -= 1) {
          const o = list[i];
          if (o) this.mikoOrbsGroup.remove(o, true, true);
        }
      }
      // 同步清空引用数组，以避免残留无效引用
      if (Array.isArray(this.mikoOrbs)) this.mikoOrbs.length = 0;
    } catch (_) {}
  }

  showRoundOverlay() {
    this.clearRoundOverlay();
    const bg = this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.6).setScrollFactor(0).setDepth(40);
    const title = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 28, "Stage Clear!", {
      fontFamily: '"Zpix", monospace', fontSize: "18px", color: "#ffffff",
    }).setOrigin(0.5).setScrollFactor(0).setDepth(41);
    ensureBaseFontSize(title);
    const prompt = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 16, "Press Y to continue, N to end", {
      fontFamily: '"Zpix", monospace', fontSize: "14px", color: "#d0d0ff",
    }).setOrigin(0.5).setScrollFactor(0).setDepth(41);
    ensureBaseFontSize(prompt);

    this.roundOverlayBackground = bg;
    this.roundOverlayElements = [title, prompt];
    this.updateOverlayScale();

    this.roundDecisionHandler = (e) => {
      if (e.code === "KeyY" || e.code === "Enter") this.continueAfterRound(true);
      else if (e.code === "KeyN" || e.code === "Escape") this.continueAfterRound(false);
    };
    this.input.keyboard.on("keydown", this.roundDecisionHandler, this);
  }
  clearRoundOverlay() {
    if (this.roundOverlayElements?.length) this.roundOverlayElements.forEach((el)=> el.destroy());
    this.roundOverlayElements = [];
    if (this.roundOverlayBackground) { this.roundOverlayBackground.destroy(); this.roundOverlayBackground = null; }
    if (this.roundDecisionHandler) { this.input.keyboard.off("keydown", this.roundDecisionHandler, this); this.roundDecisionHandler = null; }
  }
  continueAfterRound(shouldContinue) {
    this.clearRoundOverlay();
    this.roundAwaitingDecision = false;
    if (shouldContinue) {
      // 进入下一关卡前：清空地图上所有怪物与子弹
      this.clearEnemies();
      this.clearAllBullets();
      // 进度：关卡+1，提升rank并准备下一关
      const prevLevel = Number.isFinite(this.level) ? Math.floor(this.level) : 1;
      this.level = Math.max(1, prevLevel + 1);
      // 正常rank增长方式保持不变：关卡结束+1
      this.rank = Number((this.rank + ROUND_CONTINUE_RANK_BONUS).toFixed(2));
      // 当通过第10关时，rank 翻倍
      if (prevLevel === 10) {
        this.rank = Number((this.rank * 2).toFixed(2));
      }
      // 每过一关（在通过第10关之后），rank 额外增加20%
      if (prevLevel >= 10) {
        this.rank = Number((this.rank * 1.2).toFixed(2));
      }
      this.roundComplete = false;
      const now = this.time.now;
      this.lastDamageTimestamp = now;
      this.nextNoDamageRankCheck = now + NO_DAMAGE_RANK_INTERVAL;
      this.roundTimeLeft = ROUND_DURATION;

      // 进入下一关：复用性药水补充可用次数
      if (this.hasItemEquipped(REFILLABLE_POTION_ID)) {
        this.refillablePotionCharges = this.refillablePotionMaxCharges || 5;
        this.refreshEquipmentUI?.();
      }

      // 判断是否Boss关卡（每20关）
      this.isBossStage = (this.level % 20 === 0);

      // 刷新地形（Boss关卡仅保留边框）
      this.generateRandomSegmentsMap();

      // 重置玩家位置
      if (this.player) {
        this.player.setPosition(WORLD_SIZE/2, WORLD_SIZE/2);
        this.player.body.setVelocity(0, 0);
        this.playerFacing = "down";
        this.stopPlayerAnimation(this.playerFacing);
      }

      // 地点刷新：商店/宝箱（Boss关卡不生成）
      if (!this.places) this.places = this.physics.add.staticGroup();
      if (this.places) this.places.clear(true, true);
      this.shopPlaces = [];
      if (!this.isBossStage) {
        this.spawnRandomShops(MAP_SHOP_COUNT);
        this.spawnRandomChests(MAP_CHEST_COUNT);
      }

      // 普通关卡：恢复刷怪；Boss关卡：生成Boss且暂停刷怪
      if (this.isBossStage) {
        // 停止常规刷怪
        if (this.spawnTimer) { this.spawnTimer.remove(); this.spawnTimer = null; }
        // 生成Boss Utsuho（默认场地中上方）
        this.spawnBossById("Utsuho", { x: WORLD_SIZE/2, y: Math.floor(WORLD_SIZE * 0.25) });
        // Boss血量按“每20关翻倍”进行倍率：20关×1，40关×2，60关×4...
        const cycles = Math.max(1, Math.floor(this.level / 20));
        let hpFactor = Math.pow(2, Math.max(0, cycles - 1));
        // 第十关后：Boss 也乘以 (1 + rank/10)
        if (Math.floor(this.level || 0) > 10) {
          const rf = Math.max(0, Number.isFinite(this.rank) ? this.rank : 0) / 10;
          if (rf > 0) hpFactor *= (1 + rf);
        }
        if (this.boss && this.boss.isBoss && this.boss.bossKind === "Utsuho") {
          const baseMaxHp = BOSS_UTSUHO_CONFIG.maxHp || this.boss.maxHp || 5000;
          this.boss.maxHp = Math.max(1, Math.round(baseMaxHp * hpFactor));
          this.boss.hp = this.boss.maxHp;
          if (typeof this.boss.setData === "function") {
            this.boss.setData("maxHp", this.boss.maxHp);
            this.boss.setData("hp", this.boss.hp);
          }
          this.updateBossUI(this.boss);
          // 同步Boss接触伤害乘算 (1 + rank/10)
          if (Math.floor(this.level || 0) > 10) {
            const rf = Math.max(0, Number.isFinite(this.rank) ? this.rank : 0) / 10;
            const factor = 1 + rf;
            if (factor > 0) this.boss.contactDamage = Math.max(0, Math.round(this.boss.contactDamage * factor));
          }
        }
        // 音乐：切到Boss曲
        try {
          if (this.battleBgm?.isPlaying) this.battleBgm.stop();
        } catch (_) {}
        if (!this.bossMusic) {
          this.bossMusic = this.sound.add(BOSS_UTSUHO_CONFIG.musicKey, { loop: true, volume: 1.5 });
        }
        if (this.bossMusic && !this.bossMusic.isPlaying) this.bossMusic.play();
      } else {
        // 非Boss关卡：常规刷怪与BGM
        this.scheduleSpawnTimer();
        // 停掉Boss曲，恢复战斗BGM
        if (this.bossMusic) { this.bossMusic.stop(); this.bossMusic.destroy(); this.bossMusic = null; }
        if (!this.battleBgm) {
          this.battleBgm = this.sound.add("battle_bgm", { loop: true, volume: 0.4 });
        }
        if (this.battleBgm && !this.battleBgm.isPlaying) this.battleBgm.play();
      }
    } else {
      this.roundComplete = true;
      this.endRunVictory();
    }
    this.updateHUD();
    this.updateOverlayScale();
  }
  endRunVictory() {
    this.physics.pause();
    if (this.spawnTimer) { this.spawnTimer.remove(); this.spawnTimer = null; }
    this.time.timeScale = 0;
    if (typeof this.showHtmlStatsOverlay === "function") this.showHtmlStatsOverlay("win");

  updateHUD() {
      // Boss模式下不显示倒计时
      if (this.debugBossMode || this.isBossStage) {
          if (this.ui.timerValue) this.ui.timerValue.textContent = "--:--";
      } else {
          const timeLeft = Math.max(0, this.roundTimeLeft);
          const totalSeconds = Math.ceil(timeLeft / 1000);
          const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
          const seconds = (totalSeconds % 60).toString().padStart(2, "0");
          if (this.ui.timerValue) this.ui.timerValue.textContent = `${minutes}:${seconds}`;
      }
      
      if (this.ui.killValue) this.ui.killValue.textContent = `${this.killCount}`;
      // 关卡为整数展示
      if (this.ui.rankValue) this.ui.rankValue.textContent = `${Math.max(1, Math.floor(this.level || 1))}`;
      if (this.ui.pointValue) this.ui.pointValue.textContent = `${this.playerPoints}`;
      this.updateSkillCooldownUI();
      this.updateSpellbladeOverlays();

  }

  updateSkillCooldownUI() {
    if (!this.ui || !this.ui.skillUi) return;
    const now = this.time?.now ?? Date.now();
    Object.entries(this.ui.skillUi).forEach(([key, entry]) => {
      if (!entry) return;
      const overlay = entry.overlay;
      const icon = entry.icon;
      const timer = entry.timer;
      const readyAt = this.skillReadyAt?.[key] ?? 0;
      const remaining = Math.max(0, readyAt - now);

      if (remaining > 0) {
        const durationRaw = this.skillCooldownDuration?.[key];
        const duration = Math.max(Number.isFinite(durationRaw) ? durationRaw : remaining, 1);
        const ratio = Math.min(1, Math.max(0, remaining / duration));
        const iconOpacity = 1 - ratio;
        if (icon) icon.style.opacity = iconOpacity.toFixed(2);
        if (overlay) {
          overlay.style.display = "flex";
          overlay.style.opacity = (0.3 + 0.7 * ratio).toFixed(2);
        }
        if (timer) timer.textContent = `${Math.ceil(remaining / 1000)}`;
      } else {
        if (icon) icon.style.opacity = "1";
        if (overlay) overlay.style.display = "none";
        if (timer) timer.textContent = "";
      }
    });
  }

  formatRankValue(value) { return Number.isInteger(value) ? `${value}` : value.toFixed(2); }


showDamageNumber(x, y, amount, type = "physical", options = {}) {
  // options 可以是布尔（表示 incoming），也可以是 { incoming: true/false, isSpellblade: false }
  const incoming = (typeof options === "boolean") ? options : !!options.incoming;
  const isSpellblade = options.isSpellblade || false;

  const colors = {
    physical: "#ffd966",
    magic: "#66aaff",
    crit: "#ff0000",   // 纯红色
    spellcrit: "#cc66ff", // 紫色：法术暴击
    heal: "#66ff66"
  };

  let displayValue = (typeof amount === "number") ? Math.round(amount) : amount;
  if (isSpellblade) {
    displayValue = `S${displayValue}`; // 为耀光伤害添加"S"前缀
  }
  if (type === "crit") displayValue = `爆${displayValue}`
  if (type === "spellcrit") displayValue = `爆${displayValue}`
  // 字号优先级（从小到大）：
  // （物伤/法伤）<（物理暴击/法术暴击）< 真实伤害 < 耀光伤害 < 自身受伤
  const baseNormal = 14;     // 物伤/法伤
  const baseCrit = 20;       // 物理暴击/法术暴击
  const baseTrue = 22;       // 真实伤害
  const baseSpellblade = 26; // 耀光伤害（通过 isSpellblade 标记）
  const baseIncoming = 32;   // 自身受伤（更大，更明显）

  let size = baseNormal;
  if (incoming) size = baseIncoming;
  else if (isSpellblade) size = baseSpellblade;
  else if (type === "true") size = baseTrue;
  else if (type === "crit" || type === "spellcrit") size = baseCrit;

  // Accumulate run stats for overlay
  if (typeof amount === "number" && Number.isFinite(amount) && amount > 0) {
    if (type === "heal") {
      // handled in showHealNumber
    } else if (incoming) {
      this.runStats.taken = Math.max(0, (this.runStats.taken || 0) + Math.round(amount));
    } else {
      const isMagicType = (type === "magic" || type === "spellcrit");
      if (isMagicType) this.runStats.dealtMagic = Math.max(0, (this.runStats.dealtMagic || 0) + Math.round(amount));
      else this.runStats.dealtPhysical = Math.max(0, (this.runStats.dealtPhysical || 0) + Math.round(amount));
    }
  }

  const text = this.add.text(x, y, `${displayValue}`, {
    fontFamily: '"Zpix", monospace',
    fontSize: `${size}px`,              // ← 使用上面的 size
    color: colors[type] ?? "#ffffff",
  }).setOrigin(0.5).setDepth(80);

  // 描边规则：
  // - 暴击：纯红色，无描边
  // - 自身受伤：红色描边
  // - 普通伤害（物理/法术，对敌人）：黑色描边
  // - 治疗：黑色细描边
  if (type === "crit" || type === "spellcrit") {
    text.setStroke("#000000", 0); // 去掉描边
  } else if (incoming) {
    text.setStroke("#ff0000", 3); // 自身受伤：红描边
  } else if (type === "heal") {
    text.setStroke("#000000", 2); // 治疗：黑描边
  } else {
    text.setStroke("#000000", 3); // 普通伤害：黑描边
  }

  // 轻微偏移与浮动动画
  text.x += Phaser.Math.FloatBetween(-4, 4);
  text.y += Phaser.Math.FloatBetween(-2, 2);

  // 动画方向：伤害向下消失；治疗维持原向上
  const isHeal = (type === "heal");
  const deltaY = isHeal
    ? ((type === "crit" || type === "spellcrit") ? -15 : -10)
    : (incoming ? 18 : (type === "crit" || type === "spellcrit" ? 15 : 10));

  // 持续时间：自身受伤更慢淡出，其它基本保持不变
  let duration = (type === "crit" || type === "spellcrit") ? 850 : 650;
  if (!isHeal) {
    if (incoming) duration = 1200;        // 自身：更慢
    else if (isSpellblade) duration = 900; // 耀光：略慢
    else if (type === "true") duration = 800; // 真伤：稍慢
  }

  this.tweens.add({
    targets: text,
    y: text.y + deltaY,
    alpha: 0,
    duration,
    ease: "Cubic.Out",
    onComplete: () => text.destroy()
  });
}

showHealNumber(x, y, amount) {
  if (typeof amount === "number" && Number.isFinite(amount) && amount > 0) {
    this.runStats.heal = Math.max(0, (this.runStats.heal || 0) + Math.round(amount));
  }
  this.showDamageNumber(x, y, amount, "heal", { incoming: false });
}

  /* ==== 伤害与战斗 ==== */
  // DEF仅对物理伤害生效；优先结算，其次按护甲乘区公式结算伤害
  applyMitigationToTarget(amount, targetStatsOrObj, sourceStatsOrObj, damageType = "physical", minimumOutput = 0) {
    const baseDamage = Number.isFinite(amount) ? amount : 0;
    if (baseDamage <= 0) return 0;

    const minOutput = Number.isFinite(minimumOutput) ? Math.max(0, Math.ceil(minimumOutput)) : 0;

    let afterDef = baseDamage;
    if (damageType === "physical") {
      const defRaw = targetStatsOrObj?.defense ?? targetStatsOrObj?.def ?? 0;
      const def = Number.isFinite(defRaw) ? Math.max(0, defRaw) : 0;
      afterDef -= def;
    }
    if (afterDef <= 0) return minOutput;

    const armorRaw = targetStatsOrObj?.armor ?? targetStatsOrObj?.ar ?? 0;
    const armor = Number.isFinite(armorRaw) ? armorRaw : 0;
    const penRaw =
      sourceStatsOrObj?.armorPenFlat ??
      sourceStatsOrObj?.armorPen ??
      sourceStatsOrObj?.armorPenetration ??
      0;
    const armorPenetration = Number.isFinite(penRaw) ? penRaw : 0;
    const penPctRaw = sourceStatsOrObj?.armorPenPct ?? 0;
    const penPct = Number.isFinite(penPctRaw) ? Math.max(0, penPctRaw) : 0;
    const armorAfterPct = armor * (1 - penPct);
    const effectiveArmor = armorAfterPct - armorPenetration;

    let damageMultiplier;
    if (effectiveArmor >= 0) {
      damageMultiplier = 100 / (100 + effectiveArmor);
    } else {
      damageMultiplier = 2 - (100 / (100 - effectiveArmor));
    }

    if (!Number.isFinite(damageMultiplier)) damageMultiplier = 0;
    damageMultiplier = Math.max(0, damageMultiplier);

    const mitigated = afterDef * damageMultiplier;
    const rounded = Math.max(0, Math.round(mitigated));
    return Math.max(rounded, minOutput);
  }

  // 新增：对自机施加法术伤害（Boss弹幕）
applyMagicDamageToPlayer(amount, sourceStats = null) {
  if (this.isPlayerInvulnerable()) return;

  const hpBefore = this.currentHp;
  const actual = this.applyMitigationToTarget(
    Math.round(amount),
    { armor: this.playerStats.armor ?? 0, def: this.playerStats.defense ?? 0 },
    sourceStats,
    "magic",
  );
  this.showDamageNumber(this.player.x, this.player.y - 12, actual, "magic", true);
  this.currentHp = Math.max(this.currentHp - actual, 0);
  // 关卡10：敌方伤害额外造成 10%当前生命值 + rank 的同属性伤害（法术）
  if (Math.floor(this.level || 0) > 10) {
    const bonusRaw = Math.max(0, Math.round(hpBefore * 0.10) + Math.round(this.rank || 0));
    if (bonusRaw > 0) {
      const bonus = this.applyMitigationToTarget(
        bonusRaw,
        { armor: this.playerStats.armor ?? 0, def: this.playerStats.defense ?? 0 },
        sourceStats,
        "magic",
      );
      if (bonus > 0) {
        this.showDamageNumber(this.player.x, this.player.y - 12, bonus, "magic", true);
        this.currentHp = Math.max(this.currentHp - bonus, 0);
      }
    }
  }
  this.updateResourceBars();
  const now = this.time.now;
  this.lastDamageTimestamp = now;
  this.nextNoDamageRankCheck = now + NO_DAMAGE_RANK_INTERVAL;

  // 反甲："受到攻击时"也对施法者反伤（魔法伤害）
  if (sourceStats && typeof sourceStats === "object" && sourceStats.active) {
    const thBase = Math.max(0, this.playerEquipmentStats?.thornsBase || 0);
    const thRatio = Math.max(0, this.playerEquipmentStats?.thornsArmorRatio || 0);
    if (thBase > 0 || thRatio > 0) {
      const armor = Math.max(0, this.playerStats?.armor || 0);
      const raw = Math.round(thBase + armor * thRatio);
      if (raw > 0) {
        const dealt = this.applyMitigationToTarget(raw, sourceStats, this.playerStats, "magic", 1);
        if (dealt > 0) {
          sourceStats.hp = Math.max(0, (sourceStats.hp || 0) - dealt);
          this.showDamageNumber(sourceStats.x, sourceStats.y, dealt, "magic");
          if (sourceStats.isBoss && typeof sourceStats.setData === "function") {
            sourceStats.setData("hp", sourceStats.hp);
            this.updateBossUI(sourceStats);
          }
          if (sourceStats.hp <= 0) this.killEnemy(sourceStats);
        }
      }
    }
  }

  // 伤害后尝试自动喝药
  this.tryAutoUsePotions?.();
  if (this.currentHp <= 0) this.gameOver();
else this.playSfx("player_gethit");
}


  // —— 消耗品：药水逻辑 —— //
  consumeHealthPotion() {
    if (!this.hasItemEquipped(HEALTH_POTION_ID)) return false;
    if (!Number.isFinite(this.healthPotionCount) || this.healthPotionCount <= 0) return false;
    const maxHp = this.playerStats?.maxHp ?? PLAYER_BASE_STATS.maxHp;
    if ((this.currentHp ?? 0) >= maxHp) return false;
    const heal = 100;
    const before = this.currentHp || 0;
    this.currentHp = Math.min(maxHp, before + heal);
    const gained = this.currentHp - before;
    if (gained > 0) this.showHealNumber(this.player.x, this.player.y - 18, gained);
    this.playSfx?.("potion");
    this.lastPotionUsedAt = this.time?.now ?? performance.now();
    this.healthPotionCount = Math.max(0, Math.floor(this.healthPotionCount - 1));
    // 用尽则移除该物品
    if (this.healthPotionCount <= 0) {
      const idx = this.healthPotionOwnerSlotIndex;
      if (Number.isInteger(idx) && idx >= 0 && idx < this.playerEquipmentSlots.length) {
        if (this.playerEquipmentSlots[idx] === HEALTH_POTION_ID) this.playerEquipmentSlots[idx] = null;
      }
      this.healthPotionOwnerSlotIndex = null;
    }
    this.refreshEquipmentUI?.();
    this.updateResourceBars?.();
    return true;
  }

  consumeRefillablePotion() {
    if (!this.hasItemEquipped(REFILLABLE_POTION_ID)) return false;
    if (!Number.isFinite(this.refillablePotionCharges) || this.refillablePotionCharges <= 0) return false;
    const maxHp = this.playerStats?.maxHp ?? PLAYER_BASE_STATS.maxHp;
    if ((this.currentHp ?? 0) >= maxHp) return false;
    const heal = 50;
    const before = this.currentHp || 0;
    this.currentHp = Math.min(maxHp, before + heal);
    const gained = this.currentHp - before;
    if (gained > 0) this.showHealNumber(this.player.x, this.player.y - 18, gained);
    this.playSfx?.("potion");
    this.lastPotionUsedAt = this.time?.now ?? performance.now();
    this.refillablePotionCharges = Math.max(0, Math.floor(this.refillablePotionCharges - 1));
    this.refreshEquipmentUI?.();
    this.updateResourceBars?.();
    return true;
  }

  tryAutoUsePotions() {
    const maxHp = this.playerStats?.maxHp ?? PLAYER_BASE_STATS.maxHp;
    if (!Number.isFinite(maxHp) || maxHp <= 0) return;
    let missing = Math.max(0, maxHp - (this.currentHp || 0));
    // 冷却：0.5s 内只允许喝一次
    const now = this.time?.now ?? performance.now();
    if (now - (this.lastPotionUsedAt || 0) < 500) return;
    // 优先：复用性药水（进入下一关会补满）
    if (missing >= 50 && this.refillablePotionCharges > 0 && this.hasItemEquipped(REFILLABLE_POTION_ID)) {
      this.consumeRefillablePotion();
      return;
    }
    // 然后：生命药水（叠加购买）
    if (missing >= 100 && this.healthPotionCount > 0 && this.hasItemEquipped(HEALTH_POTION_ID)) {
      this.consumeHealthPotion();
      return;
    }
  }

  // 分离显示：通过时间和位置错开
  displayDamageWithSeparation(x, y, amount, type, orderIndex) {
    const delay = 90 * orderIndex;
    const stepY = 14 * orderIndex;
    const offsetX = (orderIndex % 2 === 0) ? -6 : 6;
    this.time.delayedCall(delay, () => {
      this.showDamageNumber(x + offsetX, y - 12 + stepY, amount, type);
    });
  }

castQ() {
  if (!this.canCast("Q")) return;
  // 蓝耗与CD
  this.spendCostAndStartCd("Q");
  // 技能音效：Q
  this.playSfx("player_castQ");

  const pointer = this.input?.activePointer ?? null;
  const camera = this.cameras?.main ?? null;
  const fallbackFacing = this.playerFacing || "down";
  let dirRad = this.lastAimAngle ?? 0;
  if (pointer && camera) {
    const worldPoint = camera.getWorldPoint(pointer.x, pointer.y);
    const dx = worldPoint.x - this.player.x;
    const dy = worldPoint.y - this.player.y;
    const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, worldPoint.x, worldPoint.y);
    if ((Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) && Number.isFinite(angle)) dirRad = angle;
  }
  if (!Number.isFinite(dirRad)) {
    dirRad = { down: Math.PI / 2, up: -Math.PI / 2, left: Math.PI, right: 0 }[fallbackFacing] ?? 0;
  }
  this.lastAimAngle = dirRad;

  // —— 近战：改为贴图物理碰撞（8格大小）—— //
  const ap = this.playerStats.abilityPower || 0;
  const meleeDmgBase = Math.round(50 + ap); // 50 + 100%AP 法伤
  const center = { x: this.player.x, y: this.player.y };
  // 物理体：使用 Arcade Physics 重叠判定，避免手动扇形计算
  const slash = this.physics.add.image(this.player.x, this.player.y, "skill_Qmelee").setDepth(12);
  slash.body.setAllowGravity(false);
  // 贴图显示大小：由4格调整为2倍=8格；判定与贴图一致（8格直径的圆）
  this.setDisplaySizeByTiles(slash, 6);
  this.setSpriteCircleHit(slash, 8);
  // 记录基础伤害与已命中目标，确保每个单位只结算一次
  slash.meleeDamage = meleeDmgBase;
  slash.hitTargets = new Set();

  // 与敌人发生重叠即结算
  this.physics.add.overlap(slash, this.enemies, this.handleQMeleeSlashOverlap, null, this);

  // 近战特效动画保持：围绕前向小幅挥动
  slash.setOrigin(0.5, 1);
  const slashBaseRotation = dirRad + Math.PI / 2;
  slash.setRotation(slashBaseRotation - Math.PI / 2);
  slash.setAlpha(0.9);
  this.tweens.add({
    targets: slash,
    rotation: slashBaseRotation + Math.PI / 2,
    alpha: 0,
    duration: 1000,
    ease: "Sine.easeOut",
    onComplete: ()=>slash.destroy(),
  });

  // —— 远程部分：正前30° 三枚穿透判定（改为物理伤害）—— //
  const projDmg = Math.round((this.playerStats.attackDamage || 0) + 0.5 * ap);
  const offsets = [-15, 0, 15];
  offsets.forEach((deg)=>{
    const angle = dirRad + Phaser.Math.DegToRad(deg);
    this.spawnQTalismanProjectile(center.x, center.y, angle, projDmg);
  });

  // 远程视觉采样
  const fx = this.add.image(this.player.x, this.player.y, "skill_Qspell").setDepth(11);
  fx.setRotation(dirRad);
  fx.setAlpha(0.8);
  fx.setScale(0.92);
  this.tweens.add({
    targets: fx,
    alpha: 0,
    scale: 1.15,
    duration: 200,
    ease: "Sine.easeOut",
    onComplete: ()=>fx.destroy(),
  });

  // 触发耀光效果
  this.onSpellCastComplete();
}

spawnQTalismanProjectile(originX, originY, angle, damage) {
  if (!this.qTalismans) return null;
  const projectile = this.qTalismans.create(originX, originY, "skill_Qspell");
  if (!projectile) return null;
  projectile.setDepth(12);
  projectile.setAlpha(0.95);
  projectile.setScale(0.7);
  // 改为物理伤害
  projectile.physicalDamage = Number.isFinite(damage) ? Math.max(0, Math.round(damage)) : 0;
  projectile.hitTargets = new Set();
  projectile.fireAngle = angle;
  projectile.spawnTime = this.time.now;
  if (projectile.body) {
    projectile.body.setAllowGravity(false);
    this.physics.velocityFromRotation(angle, Q_TALISMAN_SPEED, projectile.body.velocity);
  }
  projectile.setRotation(angle + Math.PI / 2);
  return projectile;
}

destroyQTalisman(projectile) {
  if (!projectile || projectile.destroyed) return;
  projectile.destroyed = true;
  if (projectile.hitTargets?.clear) projectile.hitTargets.clear();
  projectile.hitTargets = null;
  if (projectile.body) projectile.body.setVelocity(0, 0);
  if (this.qTalismans?.contains?.(projectile)) {
    this.qTalismans.remove(projectile, true, true);
  } else {
    projectile.destroy();
  }
}
castE() {
  if (!this.canCast("E")) return;
  this.spendCostAndStartCd("E");
  // 技能音效：E（形态切换）
  this.playSfx("player_castE");

  this.playerCombatMode = (this.playerCombatMode === "ranged") ? "melee" : "ranged";

  // 立即重建攻速计时器以生效20%攻速/近战停火
  this.rebuildAttackTimer();
  // 形态改变后，重算装备效果（提亚马特范围随远近战变化）
  this.recalculateEquipmentEffects();
  
  // 触发耀光效果 
  this.onSpellCastComplete();
}
castR() {
  if (!this.canCast("R")) return;
  this.spendCostAndStartCd("R");
  // 技能音效：R
  this.playSfx("player_castR");

  const ap = this.playerStats.abilityPower || 0;
  const heal = Math.max(0, Math.round(5*ap + 500)); // 解释：按文意“500%AP+500”
  this.currentHp = Math.min(this.currentHp + heal, this.playerStats.maxHp);
  this.showHealNumber(this.player.x, this.player.y - 24, heal);
  this.updateResourceBars();

  // 准备物理组
  if (!this.mikoOrbsGroup) this.mikoOrbsGroup = this.physics.add.group();

  // 每颗梦想妙珠的基础伤害加成
  const orbBaseFlat = 200;

  // 从8选6不重复
  const pool = ["R1","R2","R3","R4","R5","R6","R7","R8"];
  Phaser.Utils.Array.Shuffle(pool);

  // 触发耀光效果
  this.onSpellCastComplete();
  const picks = pool.slice(0,6);

  this.mikoOrbs = picks.map((name, i)=>{
    const spr = this.physics.add.image(this.player.x, this.player.y, `skill_${name}`).setDepth(11);
    spr.body.setAllowGravity(false);
    spr.setCircle(8, spr.width/2-8, spr.height/2-8);
    spr._state = "orbit";                 // orbit -> seek -> done
    spr._angle = (i / 6) * Math.PI*2;     // 均匀分布
    spr._orbitTimeLeft = 2000;            // 2s
    spr._seekTarget = null;
    spr._ap = ap;
    this.mikoOrbsGroup.add(spr);
    return spr;
  });

  // 清弹：与 bossBullets 重叠即销毁
  this.physics.add.overlap(this.mikoOrbsGroup, this.bossBullets, (_orb, bullet)=>{
    this.destroyBossBullet(bullet);
  });
  // 旋转阶段与发射阶段命中逻辑：
  // - 旋转(orbit)时：与敌人碰撞造成一次魔法伤害（带短CD防多次触发）
  // - 发射(seek)时：命中后在4格范围内造成范围伤害（一次），随后销毁
  this.physics.add.overlap(this.mikoOrbsGroup, this.enemies, (orb, enemy)=>{
    if (!enemy.active) return;
    const spellFlat = Math.max(0, Math.round(this.playerEquipmentStats?.spellBonusMagicFlat || 0));
    const baseMagic = Math.round(orb._ap + orbBaseFlat) + spellFlat;

    // 旋转阶段的碰撞伤害（带节流）
    if (orb._state === "orbit") {
      if (!orb._orbitHitSet) orb._orbitHitSet = new Set();
      if (orb._orbitHitSet.has(enemy)) return; // 短CD内同一敌人不重复结算
      // Infinity Orb 执行与法术暴击处理
      let raw = baseMagic;
      let dtype = "magic";
      if (this.hasItemEquipped(INFINITY_ORB_ID)) {
        const eff = EQUIPMENT_DATA[INFINITY_ORB_ID]?.effects || {};
        const threshold = Number.isFinite(eff.executeHpPct) ? eff.executeHpPct : 0.5;
        const mult = Number.isFinite(eff.magicCritMultiplier) ? eff.magicCritMultiplier : 1.5;
        if ((enemy.hp / (enemy.maxHp || 1)) <= threshold) { raw = Math.round(raw * mult); dtype = "spellcrit"; }
      }
      const dealt = this.applyMitigationToTarget(raw, enemy, this.playerStats, "magic", 1);
      if (dealt > 0) {
        enemy.hp = Math.max(0, enemy.hp - dealt);
        this.showDamageNumber(enemy.x, enemy.y, dealt, dtype);
        if (enemy.hp<=0) this.killEnemy(enemy); else this.maybeExecuteTheCollector(enemy);
        // Omnivamp（单次命中）
        const omni = Math.max(0, this.playerEquipmentStats?.omniVampPct || 0);
        if (omni > 0) {
          const heal = Math.max(0, Math.round(dealt * omni));
          if (heal > 0) { this.currentHp = Math.min(this.currentHp + heal, this.playerStats.maxHp); this.showHealNumber(this.player.x, this.player.y - 18, heal); this.updateResourceBars(); }
        }
        // Liandry 持续伤害
        this.applyLiandryBurn(enemy);
      }
      // 添加短CD（避免同一敌人帧内连击）：200ms
      orb._orbitHitSet.add(enemy);
      this.time.delayedCall(200, () => { if (orb.active && orb._orbitHitSet) orb._orbitHitSet.delete(enemy); });
      return;
    }

    // 发射阶段：命中后触发范围伤害（4格半径）
    if (orb._state === "seek") {
      const AOE_RADIUS = 4 * TILE_SIZE;
      let totalDealt = 0;
      const enemies = this.enemies.getChildren();
      for (let i = 0; i < enemies.length; i += 1) {
        const e = enemies[i];
        if (!e || !e.active) continue;
        const distSq = Phaser.Math.Distance.Squared(orb.x, orb.y, e.x, e.y);
        if (distSq > AOE_RADIUS * AOE_RADIUS) continue;
        let raw = baseMagic;
        let dtype = "magic";
        if (this.hasItemEquipped(INFINITY_ORB_ID)) {
          const eff = EQUIPMENT_DATA[INFINITY_ORB_ID]?.effects || {};
          const threshold = Number.isFinite(eff.executeHpPct) ? eff.executeHpPct : 0.5;
          const mult = Number.isFinite(eff.magicCritMultiplier) ? eff.magicCritMultiplier : 1.5;
          if ((e.hp / (e.maxHp || 1)) <= threshold) { raw = Math.round(raw * mult); dtype = "spellcrit"; }
        }
        const dealt = this.applyMitigationToTarget(raw, e, this.playerStats, "magic", 1);
        if (dealt <= 0) continue;
        e.hp = Math.max(0, e.hp - dealt);
        this.showDamageNumber(e.x, e.y, dealt, dtype);
        if (e.isBoss && typeof e.setData === "function") { e.setData("hp", e.hp); this.updateBossUI(e); }
        if (e.hp<=0) this.killEnemy(e); else this.maybeExecuteTheCollector(e);
        // Liandry 持续伤害
        this.applyLiandryBurn(e);
        totalDealt += dealt;
      }

      // Omnivamp：按总伤害结算一次
      const omni = Math.max(0, this.playerEquipmentStats?.omniVampPct || 0);
      if (omni > 0 && totalDealt > 0) {
        const heal = Math.max(0, Math.round(totalDealt * omni));
        if (heal > 0) { this.currentHp = Math.min(this.currentHp + heal, this.playerStats.maxHp); this.showHealNumber(this.player.x, this.player.y - 18, heal); this.updateResourceBars(); }
      }

      // 结束该珠：改为将弹幕本体放大为4格半径、50%透明度，并在2秒内淡出后销毁（视觉爆炸特效）
      orb._state = "done";
      if (orb.body) {
        // 禁用物理避免再次触发碰撞
        orb.body.enable = false;
        if (typeof orb.body.setVelocity === "function") orb.body.setVelocity(0, 0);
      }
      // 将贴图显示尺寸设置为直径=8格
      const explosionDiameter = 8 * TILE_SIZE;
      if (typeof orb.setDisplaySize === "function") {
        orb.setDisplaySize(explosionDiameter, explosionDiameter);
      }
      orb.setAlpha(0.5);
      // 2秒内淡出
      this.tweens.add({
        targets: orb,
        alpha: 0,
        duration: 2000,
        ease: "Cubic.easeOut",
        onComplete: () => { if (orb && orb.destroy) orb.destroy(); },
      });
    }
  });
}





  tryFireBullet() {
    // 耀光检查
    const canSpellblade = this.canTriggerSpellblade();

    // 非远程模式不发射
    if (this.playerCombatMode !== "ranged") return;

    const rangePixels = statUnitsToPixels(this.playerStats.range);
    const originX = this.weaponSprite ? this.weaponSprite.x : this.player.x;
    const originY = this.weaponSprite ? this.weaponSprite.y : this.player.y;
    const target = this.findNearestEnemy(originX, originY, rangePixels);
    if (!target) return;

    const bullet = this.physics.add.sprite(originX, originY, "bullet");
    bullet.setDepth(8); bullet.setScale(0.64);
    bullet.body.setAllowGravity(false);
    bullet.body.setSize(8, 16); bullet.body.setOffset(4, 0);
    bullet.spawnTime = this.time.now;
    bullet.damage = this.playerStats.attackDamage;
    bullet.damageType = "physical";
    bullet.isCrit = false;
    bullet.onHitScale = 1;
    bullet.cleaveScale = 1;

    this.bullets.add(bullet);
    this.attachBulletTrailToBullet(bullet);
    this.playSfx("playershoot");

    const angle = Phaser.Math.Angle.Between(bullet.x, bullet.y, target.x, target.y);
    this.physics.velocityFromRotation(angle, BULLET_SPEED, bullet.body.velocity);
    bullet.setRotation(angle + Math.PI / 2);
    this.spawnRunaanBolts(originX, originY, target, rangePixels, angle);
  }

  spawnRunaanBolts(originX, originY, primaryTarget, rangePixels, initialAngle) {
    if (!this.hasRunaan || !this.runaanConfig) return;
    const { boltCount, damageMultiplier, boltsTriggerOnHit } = this.runaanConfig;
    if (!boltCount || boltCount <= 0 || !damageMultiplier || damageMultiplier <= 0) return;
    const enemies = (this.enemies && typeof this.enemies.getChildren === "function")
      ? this.enemies.getChildren()
      : [];
    if (!enemies.length) return;

    const rangeSq = rangePixels * rangePixels;
    const candidates = [];
    for (let i = 0; i < enemies.length; i += 1) {
      const enemy = enemies[i];
      if (!enemy || !enemy.active) continue;
      if (enemy === primaryTarget) continue;
      const distSq = Phaser.Math.Distance.Squared(originX, originY, enemy.x, enemy.y);
      if (distSq > rangeSq) continue;
      candidates.push({ enemy, distSq });
    }
    if (candidates.length === 0) return;
    candidates.sort((a, b) => a.distSq - b.distSq);
    const count = Math.min(boltCount, candidates.length);

    for (let i = 0; i < count; i += 1) {
      const target = candidates[i].enemy;
      const bolt = this.physics.add.sprite(originX, originY, "item_effect_arrow");
      bolt.setDepth(8);
      bolt.setScale(0.85);
      bolt.body.setAllowGravity(false);
      bolt.body.setSize(8, 16);
      bolt.body.setOffset(4, 0);
      bolt.spawnTime = this.time.now;
      bolt.damage = Math.max(1, Math.round(this.playerStats.attackDamage * damageMultiplier));
      bolt.damageType = "physical";
      bolt.isCrit = false;
      bolt.onHitScale = boltsTriggerOnHit ? damageMultiplier : 0;
      bolt.cleaveScale = damageMultiplier;
      bolt.isRunaanBolt = true;

      this.bullets.add(bolt);
      this.attachBulletTrailToBullet(bolt);

      const angle = Phaser.Math.Angle.Between(originX, originY, target.x, target.y);
      this.physics.velocityFromRotation(angle, BULLET_SPEED, bolt.body.velocity);
      bolt.setRotation(angle + Math.PI / 2);

      // 若没有目标角度（极端情况），使用主射角保证贴图方向
      if (!Number.isFinite(angle) && Number.isFinite(initialAngle)) {
        bolt.setRotation(initialAngle + Math.PI / 2);
      }
    }
  }

  findNearestEnemy(x, y, range = Number.MAX_VALUE) {
    const enemies = this.enemies.getChildren();
    let nearest = null;
    const maxRangeSq = (range === Number.MAX_VALUE) ? Number.MAX_VALUE : range * range;
    let nearestDist = maxRangeSq;
    for (let i=0;i<enemies.length;i+=1) {
      const enemy = enemies[i];
      if (!enemy.active) continue;
      const distanceSq = Phaser.Math.Distance.Squared(x, y, enemy.x, enemy.y);
      if (distanceSq <= nearestDist) { nearest = enemy; nearestDist = distanceSq; }
    }
    return nearest;
  }

  spawnEnemy() {
    if (this.debugBossMode || this.isBossStage) return;
    if (this.roundComplete || this.roundAwaitingDecision) return;
    if (this.enemies.getChildren().length >= ENEMY_MAX_COUNT) return;

    const spawnDef = this.pickEnemySpawnDefinition();
    if (!spawnDef) return;

    const position = this.findEnemySpawnPosition(spawnDef);
    if (!position) return;

    this.spawnEnemyWithEffect(spawnDef, position);
  }

  pickEnemySpawnDefinition() {
    const rankValue = Math.max(Number.isFinite(this.rank) ? this.rank : 0, 0);
    const typeEntries = [];
    Object.entries(ENEMY_TYPE_CONFIG).forEach(([typeKey, typeConfig]) => {
      const tierEntries = [];
      Object.entries(typeConfig.tiers).forEach(([tierKey, tierConfig]) => {
        const minRank = Number.isFinite(tierConfig.unlockRank) ? tierConfig.unlockRank : 0;
        const maxRank = Number.isFinite(tierConfig.maxRank) ? tierConfig.maxRank : Number.POSITIVE_INFINITY;
        if (rankValue < minRank) return;
        if (rankValue > maxRank) return;
        const weight = Number.isFinite(ENEMY_RARITY_WEIGHTS[tierKey]) ? ENEMY_RARITY_WEIGHTS[tierKey] : 0;
        if (weight < 0) return;
        tierEntries.push({ key: tierKey, config: tierConfig, weight });
      });
      if (tierEntries.length === 0) return;
      const typeWeight = Number.isFinite(typeConfig.weight) ? Math.max(typeConfig.weight, 0) : 0;
      typeEntries.push({ key: typeKey, config: typeConfig, tiers: tierEntries, weight: typeWeight });
    });
    if (typeEntries.length === 0) return null;

    const typeEntry = this.pickWeightedEntry(typeEntries);
    if (!typeEntry) return null;
    const tierEntry = this.pickWeightedEntry(typeEntry.tiers);
    if (!tierEntry) return null;

    return {
      typeKey: typeEntry.key,
      typeConfig: typeEntry.config,
      tierKey: tierEntry.key,
      tierConfig: tierEntry.config,
    };
  }

  pickWeightedEntry(entries) {
    if (!Array.isArray(entries) || entries.length === 0) return null;
    let total = 0;
    for (let i = 0; i < entries.length; i += 1) {
      const weight = Number.isFinite(entries[i].weight) ? Math.max(entries[i].weight, 0) : 0;
      entries[i].weight = weight;
      total += weight;
    }
    if (total <= 0) {
      const index = Phaser.Math.Between(0, entries.length - 1);
      return entries[index] ?? null;
    }
    let roll = Phaser.Math.FloatBetween(0, total);
    for (let i = 0; i < entries.length; i += 1) {
      const weight = entries[i].weight;
      if (roll <= weight) return entries[i];
      roll -= weight;
    }
    return entries[entries.length - 1] ?? null;
  }

  findEnemySpawnPosition(spawnDef) {
    const tierConfig = spawnDef?.tierConfig ?? null;
    const playerX = this.player?.x ?? WORLD_SIZE / 2;
    const playerY = this.player?.y ?? WORLD_SIZE / 2;
    const maxRadius = Math.max(ENEMY_SPAWN_RADIUS_MIN, Math.min(ENEMY_SPAWN_RADIUS_MAX, WORLD_SIZE));
    const minRadius = Math.min(ENEMY_SPAWN_RADIUS_MIN, maxRadius);
    const radiusBuffer = (tierConfig?.hitRadius ?? 14) + 4;

    for (let attempt = 0; attempt < ENEMY_SPAWN_ATTEMPTS; attempt += 1) {
      const distance = Phaser.Math.FloatBetween(minRadius, maxRadius);
      const angle = Phaser.Math.FloatBetween(0, Phaser.Math.PI2);
      const posX = Phaser.Math.Clamp(playerX + Math.cos(angle) * distance, TILE_SIZE, WORLD_SIZE - TILE_SIZE);
      const posY = Phaser.Math.Clamp(playerY + Math.sin(angle) * distance, TILE_SIZE, WORLD_SIZE - TILE_SIZE);
      if (!this.isWithinWorldBounds(posX, posY)) continue;
      if (!this.isPositionWalkable(posX, posY)) continue;
      if (this.isPositionOccupied(posX, posY, radiusBuffer)) continue;
      return { x: posX, y: posY };
    }
    return null;
  }

  isWithinWorldBounds(x, y) {
    return x >= TILE_SIZE && y >= TILE_SIZE && x <= WORLD_SIZE - TILE_SIZE && y <= WORLD_SIZE - TILE_SIZE;
  }

  isPositionWalkable(x, y) {
    const grid = this.wallGrid;
    if (!Array.isArray(grid) || grid.length === 0) return true;
    const tile = this.worldToTileCoords(x, y);
    if (!tile) return false;
    if (!Array.isArray(grid[tile.y])) return false;
    if (grid[tile.y][tile.x]) return false;
    return true;
  }

  isPositionOccupied(x, y, radius = 16) {
    if (!this.enemies) return false;
    const enemies = this.enemies.getChildren();
    for (let i = 0; i < enemies.length; i += 1) {
      const other = enemies[i];
      if (!other?.active) continue;
      const otherRadius = (other.hitRadius ?? other.body?.width ?? 14) + 4;
      const minDistance = radius + otherRadius;
      if (Phaser.Math.Distance.Between(x, y, other.x, other.y) < minDistance) return true;
    }
    return false;
  }

  spawnEnemyWithEffect(spawnDef, position) {
    const { tierConfig } = spawnDef;
    const spawnEffectKey = tierConfig?.spawnEffectKey;
    const spawnScale = tierConfig?.scale ?? 1;
    const effectPosition = { x: position.x, y: position.y };
    let effectSprite = null;
    if (spawnEffectKey) {
      effectSprite = this.add.image(effectPosition.x, effectPosition.y, spawnEffectKey).setDepth(4);
      effectSprite.setScale(spawnScale);
      effectSprite.setAlpha(0.9);
      effectSprite.setBlendMode(Phaser.BlendModes.ADD);
      this.tweens.add({
        targets: effectSprite,
        alpha: 0.4,
        duration: ENEMY_SPAWN_DELAY_MS,
        yoyo: false,
        repeat: 0,
        ease: "Sine.easeInOut",
      });
    }
    this.time.delayedCall(ENEMY_SPAWN_DELAY_MS, () => {
      if (!this || this.debugBossMode || this.roundComplete || this.roundAwaitingDecision) {
        if (effectSprite) effectSprite.destroy();
        return;
      }
      if (this.enemies.getChildren().length >= ENEMY_MAX_COUNT) {
        if (effectSprite) effectSprite.destroy();
        return;
      }
      const enemy = this.createEnemyFromDefinition(spawnDef, effectPosition);
      if (!enemy) {
        if (effectSprite) effectSprite.destroy();
        return;
      }
      if (effectSprite) {
        this.tweens.add({
          targets: effectSprite,
          alpha: 0,
          scale: spawnScale * 1.25,
          duration: 260,
          ease: "Sine.easeOut",
          onComplete: () => effectSprite.destroy(),
        });
      }
    });
  }

  createEnemyFromDefinition(spawnDef, position) {
    const { typeKey, tierKey, typeConfig, tierConfig } = spawnDef ?? {};
    if (!tierConfig) return null;
    const textureKey = tierConfig.textureKey ?? "enemy";
    const enemy = this.enemies.create(position.x, position.y, textureKey);
    if (!enemy) return null;

    enemy.setDepth(6);
    enemy.body.setAllowGravity(false);
    const scale = tierConfig.scale ?? 1;
    enemy.setScale(scale);

    const radius = tierConfig.hitRadius ?? 14;
    if (enemy.body?.setCircle) {
      const frameWidth = enemy.width || PIXELS_PER_TILE;
      const frameHeight = enemy.height || PIXELS_PER_TILE;
      const offsetX = frameWidth / 2 - radius;
      const offsetY = frameHeight / 2 - radius;
      enemy.body.setCircle(radius, offsetX, offsetY);
    } else if (enemy.body?.setSize) {
      enemy.body.setSize(radius * 2, radius * 2);
      const offsetX = ((enemy.width ?? radius * 2) - radius * 2) / 2;
      const offsetY = ((enemy.height ?? radius * 2) - radius * 2) / 2;
      enemy.body.setOffset(offsetX, offsetY);
    }
    enemy.hitRadius = radius;

    enemy.maxHp = tierConfig.hp ?? 100;
    enemy.hp = enemy.maxHp;
    // 第十关后：所有怪物（非Boss）属性按 (1 + rank/10) 乘算
    if (Math.floor(this.level || 0) > 10) {
      const rf = Math.max(0, Number.isFinite(this.rank) ? this.rank : 0) / 10;
      const factor = 1 + rf;
      if (factor > 0) {
        // HP
        enemy.maxHp = Math.max(1, Math.round(enemy.maxHp));
        enemy.hp = enemy.maxHp;
        // 攻击力/法强
        if (Number.isFinite(enemy.attackDamage)) enemy.attackDamage = Math.round(enemy.attackDamage * factor);
        if (Number.isFinite(enemy.abilityPower)) enemy.abilityPower = Math.round(enemy.abilityPower * factor);
        // 接触伤害沿用攻击力
        if (Number.isFinite(enemy.contactDamage)) enemy.contactDamage = Math.round(enemy.contactDamage * factor);
      }
    }
    enemy.attackDamage = tierConfig.attackDamage ?? 0;
    enemy.contactDamage = tierConfig.attackDamage ?? 0;
    enemy.abilityPower = tierConfig.abilityPower ?? 0;
    enemy.armor = tierConfig.armor ?? 0;
    enemy.def = tierConfig.defense ?? tierConfig.def ?? 0;
    enemy.moveSpeed = tierConfig.moveSpeed ?? 60;
    enemy.enemyType = typeKey;
    enemy.enemyTier = tierKey;
    enemy.enemyKind = typeConfig?.kind ?? "charger";
    enemy.dropRange = tierConfig.dropRange ?? { min: 5, max: 15 };
    enemy.tierConfig = tierConfig;
    enemy.typeConfig = typeConfig;
    enemy.state = "idle";
    enemy.aiState = "idle";
    enemy.lastHitAt = 0;
    enemy.hitComboCount = 0;
    enemy.hitComboExpireAt = 0;
    enemy.slowPct = 0;
    enemy.slowUntil = 0;
    enemy.lastDamageTick = 0;
    enemy.spawnedAt = this.time.now;
    enemy.idleRotationSpeed = tierConfig.idleRotationSpeed ?? 0;
    enemy.detectionRadius = tierConfig.detectionRadius ?? 200;
    enemy.windupMs = tierConfig.windupMs ?? 0;
    enemy.chargeSpeed = tierConfig.chargeSpeed ?? tierConfig.moveSpeed ?? 200;
    enemy.attackChargeUntil = 0;
    enemy.attackEndTime = 0;
    enemy.attackCooldownUntil = this.time.now + Phaser.Math.Between(400, 900);
    enemy.chargeTargetX = position.x;
    enemy.chargeTargetY = position.y;
    enemy.dashDirection = null;
    enemy.dashSpeed = enemy.chargeSpeed;
    enemy.extraBurstTriggered = false;
    enemy.nextAttackTime = this.time.now + Phaser.Math.Between(400, 900);
    enemy.nextKunaiShotTime = 0;
    enemy.ringSprite = null;
    enemy.kunaiActive = false;
    enemy.proximityActive = false;

    if (enemy.enemyKind === "turret") {
      enemy.body.setVelocity(0, 0);
      if (typeof enemy.body.setImmovable === "function") enemy.body.setImmovable(true);
      enemy.body.moves = false;
      if (tierConfig.ringTextureKey) {
        enemy.ringSprite = this.add.sprite(position.x, position.y, tierConfig.ringTextureKey).setDepth(enemy.depth - 1);
        enemy.ringSprite.setScale(scale);
        enemy.ringSpriteRotationSpeed = 0.015;
      }
    } else {
      this.initializeEnemyNav(enemy);
    }

    if (enemy.enemyKind === "caster") {
      enemy.aiState = "idle";
      enemy.cyclePhase = "move";
      enemy.moveDurationMs = tierConfig.moveDurationMs ?? 2000;
      enemy.attackDurationMs = tierConfig.attackDurationMs ?? 2000;
      enemy.shotIntervalMs = tierConfig.shotIntervalMs ?? 500;
      enemy.nextPhaseChangeAt = this.time.now + enemy.moveDurationMs;
      enemy.nextShotTime = this.time.now + enemy.shotIntervalMs;
    }

    if (enemy.enemyKind === "charger") {
      enemy.aiState = "idle";
    }

    enemy.isBoss = false;
    return enemy;
  }

  initializeEnemyNav(enemy, now = this.time.now) {
    enemy.nav = {
      path: null,
      index: 0,
      nextRecalc: now,
      goalKey: "",
      startKey: "",
      lastProgressAt: now,
      lastProgressX: enemy.x,
      lastProgressY: enemy.y,
      stuckCooldownUntil: 0,
      nudgeUntil: 0,
      nudgeAngle: null,
      nudgeSpeed: 0,
    };
  }

  resetEnemyNav(enemy, now = this.time.now) {
    if (!enemy.nav) {
      this.initializeEnemyNav(enemy, now);
      return;
    }
    enemy.nav.path = null;
    enemy.nav.index = 0;
    enemy.nav.nextRecalc = now;
    enemy.nav.goalKey = "";
    enemy.nav.startKey = "";
    enemy.nav.lastProgressAt = now;
    enemy.nav.lastProgressX = enemy.x;
    enemy.nav.lastProgressY = enemy.y;
    enemy.nav.stuckCooldownUntil = now;
    enemy.nav.nudgeUntil = 0;
    enemy.nav.nudgeAngle = null;
    enemy.nav.nudgeSpeed = 0;
  }

handleQTalismanEnemyOverlap(projectile, enemy) {
  if (!projectile || !projectile.active || projectile.destroyed) return;
  if (!enemy || !enemy.active) return;
  if (!projectile.hitTargets) projectile.hitTargets = new Set();
  if (projectile.hitTargets.has(enemy)) return;
  projectile.hitTargets.add(enemy);

  // 物理伤害：不受法术加成与法术暴击影响
  let rawDamage = Number.isFinite(projectile.physicalDamage) ? Math.max(0, Math.round(projectile.physicalDamage)) : 0;
  if (rawDamage <= 0) return;

  const dealt = this.applyMitigationToTarget(rawDamage, enemy, this.playerStats, "physical", 1);
  enemy.hp = Math.max(0, enemy.hp - dealt);
  this.showDamageNumber(enemy.x, enemy.y, dealt, "physical");
  if (enemy.hp <= 0) this.killEnemy(enemy);
  else this.maybeExecuteTheCollector(enemy);

  // Omnivamp heal
  const omni = Math.max(0, this.playerEquipmentStats?.omniVampPct || 0);
  if (omni > 0 && dealt > 0) {
    const heal = Math.max(0, Math.round(dealt * omni));
    if (heal > 0) {
      this.currentHp = Math.min(this.currentHp + heal, this.playerStats.maxHp);
      this.showHealNumber(this.player.x, this.player.y - 18, heal);
      this.updateResourceBars();
    }
  }

  // Liandry burn on skill hit
  this.applyLiandryBurn(enemy);
}

// Q近战贴图重叠结算：魔法伤害，按贴图碰撞判定
handleQMeleeSlashOverlap(slash, enemy) {
  if (!slash || slash.destroyed || !slash.active) return;
  if (!enemy || !enemy.active) return;
  if (!slash.hitTargets) slash.hitTargets = new Set();
  if (slash.hitTargets.has(enemy)) return;
  slash.hitTargets.add(enemy);

  const base = Number.isFinite(slash.meleeDamage) ? Math.max(0, Math.round(slash.meleeDamage)) : 0;
  if (base <= 0) return;

  // 仍按法术处理：法术额外平A加成与低血法暴
  const spellFlat = Math.max(0, Math.round(this.playerEquipmentStats?.spellBonusMagicFlat || 0));
  let amount = base + spellFlat;
  let showType = "magic";
  if (this.hasItemEquipped(INFINITY_ORB_ID)) {
    const eff = EQUIPMENT_DATA[INFINITY_ORB_ID]?.effects || {};
    const threshold = Number.isFinite(eff.executeHpPct) ? eff.executeHpPct : 0.5;
    const mult = Number.isFinite(eff.magicCritMultiplier) ? eff.magicCritMultiplier : 1.5;
    if ((enemy.hp / (enemy.maxHp || 1)) <= threshold) {
      amount = Math.max(0, Math.round(amount * mult));
      showType = "spellcrit";
    }
  }

  const dealt = this.applyMitigationToTarget(amount, enemy, this.playerStats, "magic", 1);
  enemy.hp = Math.max(0, enemy.hp - dealt);
  this.showDamageNumber(enemy.x, enemy.y, dealt, showType);
  if (enemy.hp <= 0) this.killEnemy(enemy);
  else this.maybeExecuteTheCollector(enemy);

  // Omnivamp heal
  const omni = Math.max(0, this.playerEquipmentStats?.omniVampPct || 0);
  if (omni > 0 && dealt > 0) {
    const heal = Math.max(0, Math.round(dealt * omni));
    if (heal > 0) {
      this.currentHp = Math.min(this.currentHp + heal, this.playerStats.maxHp);
      this.showHealNumber(this.player.x, this.player.y - 18, heal);
      this.updateResourceBars();
    }
  }

  // Liandry burn
  this.applyLiandryBurn(enemy);
}

  handleBulletEnemyOverlap(bullet, enemy) {
    if (!enemy.active) return;  const now = this.time.now;
    // 普攻命中音效（远程）
    this.playSfx("enemyhit");
    const preHp = enemy.hp;

  const entries = [];

  // === 基础伤害与暴击判定（修复点1：critChance 统一为[0,1]）===
  const baseAttackStat = this.playerStats?.attackDamage ?? PLAYER_BASE_STATS.attackDamage ?? 0;
  const minimumBaseDamage = Math.ceil(Math.max(0, baseAttackStat) * 0.1);

  const rawBulletDamage = Number.isFinite(bullet?.damage) ? Math.round(bullet.damage) : 0;
  const baseDamage = Math.max(minimumBaseDamage, rawBulletDamage);

  const critChanceRaw = this.playerStats?.critChance ?? 0;          // 可能是0–1或0–100
  const critChance01 = critChanceRaw > 1 ? critChanceRaw / 100 : critChanceRaw;
  const critChance = Math.min(1, Math.max(0, critChance01));       // 夹住边界

  const critDamagePct = this.playerStats?.critDamage ?? 150;       // 150% = 1.5倍
  const isCrit = Math.random() < critChance;
  const finalDamage = isCrit ? Math.round(baseDamage * (critDamagePct / 100)) : baseDamage;

  // 修复点2：不要把“暴击”当成伤害类型；始终用 physical/magic，暴击作为标记/来源
  entries.push({
    type: "physical",
    amount: finalDamage,
    source: isCrit ? "basic_crit" : "basic",
    isOnHit: false,
    minDamage: minimumBaseDamage,
    isCrit,
  });

// ——（替换原“处理耀光伤害”整段）——
let spellbladeHit = null;
if (this.nextAttackTriggersSpellblade) {
  spellbladeHit = this.consumeSpellbladeIfReady(enemy); // { amount, type, isSpellblade:true } | null
}

  // === Generic on-hit flats from equipment (recurve bow, riftmaker, etc.) ===
  const flatOnHitPhys = Math.max(0, Math.round(this.playerEquipmentStats?.onHitPhysicalFlat || 0));
  if (flatOnHitPhys > 0) {
    entries.push({ type: "physical", amount: flatOnHitPhys, source: "onhit_phys_flat", isOnHit: true });
  }
  const flatOnHitMagic = Math.max(0, Math.round(this.playerEquipmentStats?.onHitMagicFlat || 0));
  if (flatOnHitMagic > 0) {
    entries.push({ type: "magic", amount: flatOnHitMagic, source: "onhit_magic_flat", isOnHit: true });
  }

  // === 装备：破败王者之刃（示例常量名保持与原代码一致） ===
  let tripleProc = false;
  if (this.hasItemEquipped(BROKEN_KINGS_BLADE_ID)) {
    const blade = EQUIPMENT_DATA[BROKEN_KINGS_BLADE_ID];
    const eff = blade.effects;

    const rawPercent = preHp * eff.percentCurrentHp;
    let percentDmg = Math.max(eff.percentMinDamage, rawPercent);
    if (enemy.isBoss) {
      percentDmg = Math.min(percentDmg, eff.percentMaxDamageBoss);
    } else {
      percentDmg = Math.min(percentDmg, eff.percentMaxDamageNonBoss);
    }
    entries.push({ type: "physical", amount: Math.round(percentDmg), source: "bork_percent", isOnHit: true });

    if (enemy.hitComboCount >= eff.tripleHitThreshold) {
      entries.push({ type: "magic", amount: Math.round(eff.tripleHitMagicDamage), source: "bork_triple", isOnHit: false });
      enemy.slowPct = Math.max(enemy.slowPct || 0, eff.tripleHitSlowPct);
      enemy.slowUntil = now + eff.tripleHitSlowMs;
      this.playerSpeedBuffMultiplier = Math.max(this.playerSpeedBuffMultiplier || 1, 1 + eff.selfHastePct);
      this.playerSpeedBuffExpiresAt = now + eff.selfHasteMs;
      enemy.hitComboCount = 0;
      enemy.hitComboExpireAt = 0;
      tripleProc = true;
    }
  }

  // === 装备：智慧末刃 ===
  let witsOnHitDamagePerProc = 0;
  if (this.hasItemEquipped(WITS_END_ID)) {
    const eff = EQUIPMENT_DATA[WITS_END_ID].effects;
    witsOnHitDamagePerProc = Math.round(eff.witsMagicOnHit);
    entries.push({ type: "magic", amount: witsOnHitDamagePerProc, source: "wits", isOnHit: true });
  }

  // === 装备：纳什之牙 ===
  if (this.hasItemEquipped(NASHORS_TOOTH_ID)) {
    const eff = EQUIPMENT_DATA[NASHORS_TOOTH_ID].effects;
    const bonusAD = Math.max(0, this.playerStats.attackDamage - PLAYER_BASE_STATS.attackDamage);
    const ap = this.playerStats.abilityPower || 0;
    const nashorDmg = Math.round(eff.nashorBase + eff.nashorBonusAdRatio * bonusAD + eff.nashorApRatio * ap);
    entries.push({ type: "magic", amount: nashorDmg, source: "nashor", isOnHit: true });
  }

  // === 装备：鬼索的狂暴之刃（额外触发倍数） ===
  let extraProcMultiplier = 1;
  if (this.hasItemEquipped(GUINSOOS_RAGEBLADE_ID)) {
    const eff = EQUIPMENT_DATA[GUINSOOS_RAGEBLADE_ID].effects;
    entries.push({ type: "magic", amount: Math.round(eff.ragebladeMagicOnHit), source: "guinsoo", isOnHit: true });

    this.guinsooStacks = Math.min((this.guinsooStacks || 0) + 1, eff.ragebladeMaxStacks || 4);
    this.guinsooStacksExpireAt = now + (eff.ragebladeStackDurationMs || 5000);

    if (this.guinsooStacks >= (eff.ragebladeMaxStacks || 4)) {
      this.guinsooFullProcCounter = (this.guinsooFullProcCounter || 0) + 1;
      if (this.guinsooFullProcCounter % (eff.ragebladeExtraProcEvery || 3) === 0) {
        extraProcMultiplier = 1 + (eff.ragebladeExtraProcsAtFull || 2);
      }
    } else {
      this.guinsooFullProcCounter = 0;
    }

    this.rebuildAttackTimer();
  }

  if (this.hasTitanicHydra && this.titanicCleaveBonus > 0) {
    const maxHpStat = this.playerStats?.maxHp ?? PLAYER_BASE_STATS.maxHp;
    const bonusDamage = Math.round(maxHpStat * this.titanicCleaveBonus);
    if (bonusDamage > 0) {
      entries.push({
        type: "physical",
        amount: bonusDamage,
        source: "titanic_primary",
        isOnHit: true,
      });
    }
  }

  const onHitScale = Number.isFinite(bullet?.onHitScale) ? Math.max(0, bullet.onHitScale) : 1;
  if (onHitScale !== 1) {
    entries.forEach((entry) => {
      if (!entry.isOnHit) return;
      entry.amount = Math.max(0, Math.round(entry.amount * onHitScale));
      if (entry.minDamage != null) {
        entry.minDamage = Math.max(0, entry.minDamage * onHitScale);
      }
    });
  }

  // === 伤害归并，仅区分 physical / magic 与 basic / onHit ===
  const damageGroups = {
    basic: { physical: 0, magic: 0 },
    onHit: { physical: 0, magic: 0 }
  };

  for (const e of entries) {
    const times = e.isOnHit ? extraProcMultiplier : 1;
    for (let k = 0; k < times; k += 1) {
      const minDamageOutput = Number.isFinite(e.minDamage) ? Math.max(0, Math.ceil(e.minDamage)) : 0;
      const after = this.applyMitigationToTarget(e.amount, enemy, this.playerStats, e.type, minDamageOutput);
      if (after <= 0) continue;

      const group = e.isOnHit ? damageGroups.onHit : damageGroups.basic;
      group[e.type] += after;

      // 智慧末刃治疗
      if (e.source === "wits") {
        const hpPct = this.currentHp / this.playerStats.maxHp;
        if (hpPct < (EQUIPMENT_DATA[WITS_END_ID].effects.witsHealThresholdHpPct || 0.5)) {
          this.currentHp = Math.min(this.currentHp + after, this.playerStats.maxHp);
          this.showHealNumber(this.player.x, this.player.y - 28, after);
          this.updateResourceBars();
        }
      }
    }
  }

  // === 显示：基础物理伤害若来自暴击，用“crit”样式渲染 ===
  let displayOrder = 0;

  // 判断本次是否发生了基础暴击（不依赖汇总结构）
  const basicWasCrit = entries.some(e => !e.isOnHit && e.source === "basic_crit");

  // Infinity Orb: magic crit on low-HP targets
  let magicBasicWasSpellCrit = false;
  let magicOnHitWasSpellCrit = false;
  if (this.hasItemEquipped(INFINITY_ORB_ID)) {
    const eff = EQUIPMENT_DATA[INFINITY_ORB_ID]?.effects || {};
    const threshold = Number.isFinite(eff.executeHpPct) ? eff.executeHpPct : 0.5;
    const mult = Number.isFinite(eff.magicCritMultiplier) ? eff.magicCritMultiplier : 1.5;
    if ((enemy.hp / (enemy.maxHp || 1)) <= threshold) {
      if (damageGroups.basic.magic > 0) {
        damageGroups.basic.magic = Math.max(0, Math.round(damageGroups.basic.magic * mult));
        magicBasicWasSpellCrit = true;
      }
      if (damageGroups.onHit.magic > 0) {
        damageGroups.onHit.magic = Math.max(0, Math.round(damageGroups.onHit.magic * mult));
        magicOnHitWasSpellCrit = true;
      }
    }
  }

  if (damageGroups.basic.physical > 0) {
    this.displayDamageWithSeparation(
      enemy.x,
      enemy.y,
      damageGroups.basic.physical,
      basicWasCrit ? "crit" : "physical",
      displayOrder++
    );
  }
  if (damageGroups.basic.magic > 0) {
    this.displayDamageWithSeparation(
      enemy.x, enemy.y,
      damageGroups.basic.magic,
      magicBasicWasSpellCrit ? "spellcrit" : "magic",
      displayOrder++
    );
  }
  if (damageGroups.onHit.physical > 0) {
    this.displayDamageWithSeparation(enemy.x, enemy.y, damageGroups.onHit.physical, "physical", displayOrder++);
  }
  if (damageGroups.onHit.magic > 0) {
    this.displayDamageWithSeparation(
      enemy.x, enemy.y,
      damageGroups.onHit.magic,
      magicOnHitWasSpellCrit ? "spellcrit" : "magic",
      displayOrder++
    );
  }
// —— 单独显示耀光（带“S”前缀，颜色按 type） ——
// 注意：耀光不是 on-hit，不参与你的 basic/onHit 分组；独立显示并计入总伤害。
let spellbladeDamage = 0;
if (spellbladeHit && spellbladeHit.amount > 0) {
  spellbladeDamage = spellbladeHit.amount;
  // 使用独立接口直接显示（带 isSpellblade 标记）
  const stype = (spellbladeHit.type === "magic" && spellbladeHit.isSpellCrit) ? "spellcrit" : spellbladeHit.type;
  this.showDamageNumber(enemy.x, enemy.y, spellbladeDamage, stype, { isSpellblade: true });
}

  // === 扣血与后续处理 ===
const totalDamage =
  damageGroups.basic.physical + damageGroups.basic.magic +
  damageGroups.onHit.physical + damageGroups.onHit.magic +
  spellbladeDamage;

  enemy.hp = Math.max(0, (enemy.hp ?? 0) - totalDamage);
  if (enemy.isBoss && typeof enemy.setData === "function") {
    enemy.setData("hp", enemy.hp);
  }
  if (enemy.isBoss) this.updateBossUI(enemy);

  const attackAngle = (typeof bullet?.rotation === "number")
    ? bullet.rotation - Math.PI / 2
    : Phaser.Math.Angle.Between(this.player.x, this.player.y, enemy.x, enemy.y);
  const cleaveScale = Number.isFinite(bullet?.cleaveScale) ? Math.max(0, bullet.cleaveScale) : 1;
  this.triggerCleaveEffects(enemy, { angle: attackAngle, scale: cleaveScale });

  if (enemy.hp <= 0) {
    this.killEnemy(enemy);
  } else {
    // 收集者处决判定
    this.maybeExecuteTheCollector(enemy);
  }
  // 讯刃：普攻命中返还技能冷却
  this.applyNavoriQuickbladesOnHitRefund();

  // === 物理吸血 ===
  const ls = this.playerEquipmentStats.physicalLifeSteal ?? 0;
  if (ls > 0) {
    const physicalTotal = damageGroups.basic.physical + damageGroups.onHit.physical;
    if (physicalTotal > 0) {
      const heal = Math.max(0, Math.round(physicalTotal * ls));
      if (heal > 0) {
        this.currentHp = Math.min(this.currentHp + heal, this.playerStats.maxHp);
        this.showHealNumber(this.player.x, this.player.y - 14, heal);
        this.updateResourceBars();
      }
    }
  }

  // === Omnivamp (from any damage) ===
  const omni = Math.max(0, this.playerEquipmentStats?.omniVampPct || 0);
  if (omni > 0) {
    const healAny = Math.max(0, Math.round(totalDamage * omni));
    if (healAny > 0) {
      this.currentHp = Math.min(this.currentHp + healAny, this.playerStats.maxHp);
      this.showHealNumber(this.player.x, this.player.y - 18, healAny);
      this.updateResourceBars();
    }
  }

  this.destroyBullet(bullet);
}


  triggerCleaveEffects(hitEnemy, options = {}) {
    if ((!this.hasTiamat || this.tiamatCleaveRadius <= 0) &&
        (!this.hasTitanicHydra || this.titanicCleaveRadius <= 0)) {
      return;
    }
    if (!hitEnemy) return;
    const angle = Number.isFinite(options.angle) ? options.angle : 0;
    const scale = Number.isFinite(options.scale) ? Math.max(0, options.scale) : 1;

    if (this.hasTiamat && this.tiamatCleaveRadius > 0) {
      const flat = Number.isFinite(this.tiamatCleaveFlat) ? Math.max(0, Math.round(this.tiamatCleaveFlat)) : 0;
      const cleaveDamage = flat > 0 ? flat : 30; // 兜底固定 30
      this.spawnCleaveArea(
        "item_effect_tiamat",
        hitEnemy.x, hitEnemy.y,
        angle,
        this.tiamatCleaveRadius,
        cleaveDamage,
        "physical",
        hitEnemy,
      );
    }

    if (this.hasTitanicHydra && this.titanicCleaveRadius > 0) {
      const maxHpStat = this.playerStats?.maxHp ?? PLAYER_BASE_STATS.maxHp;
      const flat = Number.isFinite(this.titanicCleaveFlat) ? Math.max(0, this.titanicCleaveFlat) : 0;
      const pct = Number.isFinite(this.titanicCleaveBonus) ? Math.max(0, this.titanicCleaveBonus) : 0;
      const bonusDamage = Math.max(0, Math.round(flat + maxHpStat * pct));
      if (bonusDamage > 0) {
        this.spawnCleaveArea(
          "item_effect_titanic",
          hitEnemy.x, hitEnemy.y,
          angle,
          this.titanicCleaveRadius,
          bonusDamage,
          "physical",
          hitEnemy,
        );
      }
    }
  }

  spawnCleaveVisual(textureKey, x, y, angle, radiusPx) {
    if (!this.textures || typeof this.textures.exists !== "function" || !this.textures.exists(textureKey)) return null;
    const diameter = Math.max(0, Math.round((radiusPx || 0) * 2));
    const sprite = this.add.image(x, y, textureKey).setDepth(7);
    sprite.setOrigin(0.5, 0.5);
    sprite.setRotation(angle + Math.PI / 2);
    if (diameter > 0) sprite.setDisplaySize(diameter, diameter); else sprite.setDisplaySize(TILE_SIZE, TILE_SIZE);
    sprite.setAlpha(0.9);
    this.tweens.add({
      targets: sprite,
      alpha: 0,
      duration: 360,
      ease: "Cubic.easeOut",
      onComplete: () => sprite.destroy(),
    });
    return sprite;
  }

  // 使用特效贴图的碰撞范围进行结算
  spawnCleaveArea(textureKey, x, y, angle, radiusPx, damage, damageType, excludeEnemy) {
    const visual = this.spawnCleaveVisual(textureKey, x, y, angle, radiusPx);
    // 创建物理碰撞贴图，使用圆形判定
    const effect = this.physics.add.image(x, y, textureKey).setDepth(6);
    effect.setOrigin(0.5, 0.5);
    effect.setRotation(angle + Math.PI / 2);
    effect.setAlpha(0.001); // 几乎不可见，视觉交给 visual
    effect.body.setAllowGravity(false);
    effect.body.setImmovable(true);
    // 半径/直径：与显示大小一致
    const r = Math.max(0, Math.round(radiusPx || 0));
    const d = Math.max(1, r * 2);
    effect.setDisplaySize(d, d);
    // 物理圆：Arcade Physics 的 setCircle 使用本地尺寸，需要居中偏移
    const frameW = effect.width || d;
    const frameH = effect.height || d;
    const offsetX = Math.max(0, (frameW / 2) - r);
    const offsetY = Math.max(0, (frameH / 2) - r);
    if (effect.body && typeof effect.body.setCircle === "function") {
      effect.body.setCircle(r, offsetX, offsetY);
    }
    effect.hitSet = new Set();
    const collider = this.physics.add.overlap(effect, this.enemies, (_eff, enemy) => {
      if (!enemy || !enemy.active) return;
      if (enemy === excludeEnemy) return;
      if (effect.hitSet.has(enemy)) return;
      const dealt = this.applyMitigationToTarget(damage, enemy, this.playerStats, damageType, 1);
      if (dealt <= 0) { effect.hitSet.add(enemy); return; }
      enemy.hp = Math.max(0, (enemy.hp ?? 0) - dealt);
      this.showDamageNumber(enemy.x, enemy.y, dealt, damageType);
      if (enemy.isBoss && typeof enemy.setData === "function") { enemy.setData("hp", enemy.hp); this.updateBossUI(enemy); }
      if (enemy.hp <= 0) this.killEnemy(enemy);
      else this.maybeExecuteTheCollector(enemy);
      effect.hitSet.add(enemy);
    });
    // 定时销毁碰撞体
    this.time.delayedCall(360, () => {
      if (collider && typeof collider.destroy === "function") collider.destroy();
      if (effect && effect.destroy) effect.destroy();
    });
    return { visual, effect };
  }

  // 子弹撞墙的爆炸视觉：0.5格大小，0.5秒淡出
  spawnWallHitExplosion(x, y) {
    try {
      const size = TILE_SIZE * 1.5;
      const spr = this.add.image(x, y, "effect_explosion").setDepth(8);
      spr.setOrigin(0.5, 0.5);
      spr.setDisplaySize(size, size);
      spr.setAlpha(1);
      this.tweens.add({
        targets: spr,
        alpha: 0,
        duration: 500,
        ease: "Cubic.easeOut",
        onComplete: () => { if (spr && spr.destroy) spr.destroy(); },
      });
      return spr;
    } catch (_e) {
      return null;
    }
  }

  applyCleaveDamage(primaryEnemy, radius, damage, damageType) {
    if (radius <= 0 || damage <= 0) return;
    const enemies = (this.enemies && typeof this.enemies.getChildren === "function")
      ? this.enemies.getChildren()
      : [];
    const radiusSq = radius * radius;
    for (let i = 0; i < enemies.length; i += 1) {
      const enemy = enemies[i];
      if (!enemy || !enemy.active) continue;
      if (enemy === primaryEnemy) continue;
      const distSq = Phaser.Math.Distance.Squared(primaryEnemy.x, primaryEnemy.y, enemy.x, enemy.y);
      if (distSq > radiusSq) continue;
      const dealt = this.applyMitigationToTarget(damage, enemy, this.playerStats, damageType, 1);
      if (dealt <= 0) continue;
      enemy.hp = Math.max(0, (enemy.hp ?? 0) - dealt);
      this.showDamageNumber(enemy.x, enemy.y, dealt, damageType);
      if (enemy.isBoss && typeof enemy.setData === "function") {
        enemy.setData("hp", enemy.hp);
        this.updateBossUI(enemy);
      }
      if (enemy.hp <= 0) this.killEnemy(enemy);
      else this.maybeExecuteTheCollector(enemy);
    }
  }

  hasItemEquipped(itemId) {
    return this.playerEquipmentSlots.some((id) => id === itemId);
  }

  handleBrokenKingsBladeOnHit(_context) { return null; }

  // Apply/refresh Liandry's burn (DoT every 0.25s, total matches description)
  applyLiandryBurn(enemy) {
    if (!enemy || !enemy.active) return;
    if (!this.hasItemEquipped(LIANDRYS_ANGUISH_ID)) return;
    const eff = EQUIPMENT_DATA[LIANDRYS_ANGUISH_ID]?.effects || {};
    const durationMs = Number.isFinite(eff.burnDurationMs) ? eff.burnDurationMs : 3000;
    const basePctPS = Number.isFinite(eff.burnPercentBasePerSecond) ? eff.burnPercentBasePerSecond : 0.01; // of target max HP
    const apRatioPctPS = Number.isFinite(eff.burnPercentApRatio) ? eff.burnPercentApRatio : 0.0001;         // per AP (percentage per second)

    // Cancel prior timer and refresh
    if (enemy.liandryTimer) { enemy.liandryTimer.remove(false); enemy.liandryTimer = null; }
    enemy.liandryBurnAcc = 0; // fractional accumulator

    const ap = this.playerStats?.abilityPower || 0;
    const perSecondRaw = (enemy.maxHp || 0) * (basePctPS + ap * apRatioPctPS);
    const tickMs = 250;
    const ticks = Math.max(1, Math.round(durationMs / tickMs));
    const perTickRaw = perSecondRaw * (tickMs / 1000);

    const doTick = () => {
      if (!enemy || !enemy.active) return;
      // Accumulate raw and round down only the integer portion
      enemy.liandryBurnAcc = (enemy.liandryBurnAcc || 0) + perTickRaw;
      let rawDamage = Math.floor(enemy.liandryBurnAcc);
      enemy.liandryBurnAcc -= rawDamage;
      if (rawDamage <= 0) return;

      // Infinity Orb multiplier on low-HP targets affects display/damage type
      let typeToShow = "magic";
      if (this.hasItemEquipped(INFINITY_ORB_ID)) {
        const inf = EQUIPMENT_DATA[INFINITY_ORB_ID]?.effects || {};
        const threshold = Number.isFinite(inf.executeHpPct) ? inf.executeHpPct : 0.5;
        const mult = Number.isFinite(inf.magicCritMultiplier) ? inf.magicCritMultiplier : 1.5;
        if ((enemy.hp / (enemy.maxHp || 1)) <= threshold) {
          rawDamage = Math.round(rawDamage * mult);
          typeToShow = "spellcrit";
        }
      }

      const dealt = this.applyMitigationToTarget(rawDamage, enemy, this.playerStats, "magic", 1);
      if (dealt <= 0) return;
      enemy.hp = Math.max(0, (enemy.hp || 0) - dealt);
      this.showDamageNumber(enemy.x, enemy.y, dealt, typeToShow);
      if (enemy.isBoss && typeof enemy.setData === "function") {
        enemy.setData("hp", enemy.hp);
        this.updateBossUI(enemy);
      }
      if (enemy.hp <= 0) { this.killEnemy(enemy); return; }

      // Omnivamp heal from DoT
      const omni = Math.max(0, this.playerEquipmentStats?.omniVampPct || 0);
      if (omni > 0) {
        const heal = Math.max(0, Math.round(dealt * omni));
        if (heal > 0) {
          this.currentHp = Math.min(this.currentHp + heal, this.playerStats.maxHp);
          this.showHealNumber(this.player.x, this.player.y - 18, heal);
          this.updateResourceBars();
        }
      }
    };

    enemy.liandryTimer = this.time.addEvent({ delay: 250, repeat: ticks - 1, callback: doTick });
  }

  // 收集者：若目标未死且血量低于处决阈值，则强制击杀并掉落额外金币。
  maybeExecuteTheCollector(enemy) {
    if (!enemy || !enemy.active) return false;
    if (!this.hasItemEquipped(THE_COLLECTOR_ID)) return false;
    const eff = EQUIPMENT_DATA[THE_COLLECTOR_ID]?.effects || {};
    const threshold = Number.isFinite(eff.executeThresholdPct) ? eff.executeThresholdPct : 0.05;
    const hpPct = (enemy.maxHp || 1) > 0 ? (enemy.hp / (enemy.maxHp || 1)) : 0;
    if (enemy.hp > 0 && hpPct <= threshold) {
      // 白色“真伤9999”显示
      this.showDamageNumber(enemy.x, enemy.y, "真伤9999", "true");
      // 标记以避免在 killEnemy 再次显示
      enemy._collectorExecuteDisplayed = true;
      // 掉落额外金币
      const bonus = Number.isFinite(eff.executeBonusGold) ? Math.max(0, eff.executeBonusGold) : 0;
      if (bonus > 0) this.dropFixedPoints(enemy.x, enemy.y, bonus);
      this.killEnemy(enemy);
      return true;
    }
    return false;
  }

  // 讯刃：普攻命中时，减少当前技能剩余冷却
  applyNavoriQuickbladesOnHitRefund() {
    if (!this.hasItemEquipped(NAVORI_QUICKBLADES_ID)) return;
    const eff = EQUIPMENT_DATA[NAVORI_QUICKBLADES_ID]?.effects || {};
    const refundPct = Number.isFinite(eff.cooldownRefundOnHitPct) ? eff.cooldownRefundOnHitPct : 0.15;
    if (refundPct <= 0) return;
    const now = this.time.now;
    Object.keys(this.skillReadyAt || {}).forEach((key) => {
      const readyAt = this.skillReadyAt[key] || 0;
      if (readyAt > now) {
        const remaining = readyAt - now;
        const reduce = Math.round(remaining * refundPct);
        this.skillReadyAt[key] = Math.max(now, readyAt - reduce);
      }
    });
    this.updateSkillCooldownUI?.();
  }

  handlePlayerEnemyContact(_player, enemy) {
    const now = this.time.now;
    if (!enemy.lastDamageTick || now - enemy.lastDamageTick >= 650) {
      /* 修改：Boss 接触伤害按Boss配置，否则用默认常量，不改变原有逻辑 */
      const dmg = (enemy.isBoss && enemy.contactDamage) ? enemy.contactDamage : ENEMY_CONTACT_DAMAGE;
      this.applyDamageToPlayer(dmg, enemy);
      enemy.lastDamageTick = now;
    }
  }

  canTriggerSpellblade(now = this.time.now) {
    const SPELLBLADE_COOLDOWN = 1500; // 1.5秒冷却时间
    return now - this.lastSpellbladeUsedAt >= SPELLBLADE_COOLDOWN;
  }

  // 处理耀光装备的伤害
// ===【替换】原 dealSpellbladeDamage，并新增 consumeSpellbladeIfReady ===

// 计算耀光伤害（按装备effects通用字段组合）
computeSpellbladeDamageFor(item, enemy) {
  if (!item?.effects || !enemy) return null;
  const eff = item.effects;
  const baseAD = PLAYER_BASE_STATS.attackDamage;            // 基础AD（base AD）
  const ad     = this.playerStats?.attackDamage || 0;       // 面板AD
  const ap     = this.playerStats?.abilityPower || 0;       // 面板AP
  const tMaxHp = enemy.maxHp || enemy.maxHealth || 0;

  let raw = 0;
  // 通用支持：基础AD/面板AD/AP/最大生命/平直伤害（哪个有就加哪个）
  if (Number.isFinite(eff.spellbladeBaseAdPct)) raw += baseAD * eff.spellbladeBaseAdPct;
  if (Number.isFinite(eff.spellbladeAdRatio))   raw += ad     * eff.spellbladeAdRatio;
  if (Number.isFinite(eff.spellbladeApRatio))   raw += ap     * eff.spellbladeApRatio;
  if (Number.isFinite(eff.spellbladeMaxHpPct))  raw += tMaxHp * eff.spellbladeMaxHpPct;
  if (Number.isFinite(eff.spellbladeFlat))      raw += eff.spellbladeFlat;

  // 上限（区分boss/非boss）
  const cap = enemy.isBoss
    ? eff.spellbladeMaxDamageBoss
    : eff.spellbladeMaxDamageNonBoss;
  if (Number.isFinite(cap)) raw = Math.min(raw, cap);

  // 伤害类型（默认物理；个别如巫妖之祸为法术）
  const dmgType = eff.spellbladeDamageType === "magic" ? "magic" : "physical";

  // 是否可暴击（例如吸蓝刀）
  let isCrit = false;
  if (eff.spellbladeCanCrit) {
    const critChance01 = (this.playerStats?.critChance || 0) > 1
      ? (this.playerStats.critChance / 100)
      : (this.playerStats?.critChance || 0);
    if (Math.random() < Math.min(1, Math.max(0, critChance01))) {
      const critPct = this.playerStats?.critDamage || 150; // 150% = 1.5倍
      raw = Math.round(raw * (critPct / 100));
      isCrit = true; // 仅用于内部标记；显示仍用 S前缀而不是暴击红字
    }
  }

  // Spell flat bonus applies to magic-type spellblade (e.g., Alternator, Riftmaker)
  let isSpellCrit = false;
  if (dmgType === "magic") {
    const spellFlat = Math.max(0, Math.round(this.playerEquipmentStats?.spellBonusMagicFlat || 0));
    raw += spellFlat;
    // Infinity Orb multiplier
    if (this.hasItemEquipped(INFINITY_ORB_ID)) {
      const effInf = EQUIPMENT_DATA[INFINITY_ORB_ID]?.effects || {};
      const threshold = Number.isFinite(effInf.executeHpPct) ? effInf.executeHpPct : 0.5;
      const mult = Number.isFinite(effInf.magicCritMultiplier) ? effInf.magicCritMultiplier : 1.5;
      if ((enemy.hp / (enemy.maxHp || 1)) <= threshold) {
        raw = Math.round(raw * mult);
        isSpellCrit = true;
      }
    }
  }

  // 结算减伤，得出实际伤害
  const dealt = this.applyMitigationToTarget(Math.round(raw), enemy, this.playerStats, dmgType, 1);

  return { amount: dealt, type: dmgType, isCrit, isSpellCrit };
}

// 消耗“下一击触发耀光”标记并返回结算条目（供命中流程合并）
consumeSpellbladeIfReady(enemy) {
  if (!this.nextAttackTriggersSpellblade) return null;

  const itemId = this.playerEquipmentSlots.find(id => this.isSpellbladeItem(id));
  if (!itemId) return null;

  const item = this.getEquipmentDefinition(itemId);
  if (!item) return null;

  // 生成伤害
  const result = this.computeSpellbladeDamageFor(item, enemy);
  if (!result || result.amount <= 0) {
    // 即便没有伤害，也要消耗标记并进入CD
    this.nextAttackTriggersSpellblade = false;
    this.lastSpellbladeUsedAt = this.time.now;
    return null;
  }

  // 特效：按不同耀光装备执行额外效果（速度、减速圈等）
  const eff = item.effects || {};
  // 三相：移速
  if (eff.spellbladeMoveSpeed && eff.spellbladeMoveSpeedDurationMs) {
    this.addPlayerSpeedBuff(eff.spellbladeMoveSpeed, eff.spellbladeMoveSpeedDurationMs);
  }
  // 冰拳：减速圈
  if (item.id === "frostfireGauntlet" || eff.frostSlowRadiusBase != null || eff.frostSlowRadiusArmorRatio != null) {
    const adDamage = (this.playerStats?.attackDamage || 0) * (eff.spellbladeAdRatio || 0);
    const armorDamage = (this.playerStats?.armor || 0) * (eff.spellbladeArmorRatio || 0);
    // 旧数据兼容：如果上面已经在 compute 阶段算过，就不重复加；这里只处理范围减速与视觉
    const slowR = (eff.frostSlowRadiusBase || 0) + (this.playerStats?.armor || 0) * (eff.frostSlowRadiusArmorRatio || 0);
    if (slowR > 0) {
      this.createIceEffect(enemy.x, enemy.y, slowR);
      if (eff.frostSlowPct != null) this.applySlowInArea(enemy.x, enemy.y, slowR, eff.frostSlowPct);
    }
  }

  // 消耗与进入CD
  this.nextAttackTriggersSpellblade = false;
  this.lastSpellbladeUsedAt = this.time.now;

  // 返回一个供命中流程合并与独立显示的“耀光”条目
  return { amount: result.amount, type: result.type, isSpellblade: true };
}

  // 创建冰冻效果的视觉表现
  createIceEffect(x, y, radius) {
    const iceEffect = this.add.sprite(x, y, 'ice_effect');
    iceEffect.setScale(radius / 50); // 根据范围调整大小
    iceEffect.setAlpha(0.5);
    iceEffect.setDepth(7);
    
    // 添加淡出动画
    this.tweens.add({
      targets: iceEffect,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        iceEffect.destroy();
      }
    });
  }

  // 对范围内的敌人应用减速效果
  applySlowInArea(centerX, centerY, radius, slowAmount) {
    const enemies = this.enemies.getChildren();
    const radiusSq = radius * radius;
    
    enemies.forEach(enemy => {
      if (!enemy.active) return;
      
      const distSq = Phaser.Math.Distance.Squared(centerX, centerY, enemy.x, enemy.y);
      if (distSq <= radiusSq) {
        this.applySlowEffect(enemy, slowAmount);
      }
    });
  }

  // 对单个敌人应用减速效果
  applySlowEffect(enemy, slowAmount) {
    // 保存原始速度
    if (!enemy.originalSpeed) {
      enemy.originalSpeed = enemy.body.velocity.length();
    }
    
    // 应用减速
    const newSpeed = enemy.originalSpeed * (1 - slowAmount);
    const currentVelocity = enemy.body.velocity;
    const angle = Math.atan2(currentVelocity.y, currentVelocity.x);
    
    enemy.body.setVelocity(
      Math.cos(angle) * newSpeed,
      Math.sin(angle) * newSpeed
    );
    
    // 2秒后恢复速度
    this.time.delayedCall(2000, () => {
      if (!enemy.active) return;
      
      const currentAngle = Math.atan2(enemy.body.velocity.y, enemy.body.velocity.x);
      enemy.body.setVelocity(
        Math.cos(currentAngle) * enemy.originalSpeed,
        Math.sin(currentAngle) * enemy.originalSpeed
      );
      enemy.originalSpeed = null;
    });
  }

  // 添加玩家速度加成
  addPlayerSpeedBuff(amount, duration) {
    const currentSpeed = this.playerStats.moveSpeed;
    this.playerStats.moveSpeed += amount;
    
    // duration毫秒后恢复速度
    this.time.delayedCall(duration, () => {
      this.playerStats.moveSpeed = currentSpeed;
    });
  }

  applyDamageToPlayer(amount, sourceStats = null) {
    if (this.isPlayerInvulnerable()) return;
    const hpBefore = this.currentHp;
    const actual = this.applyMitigationToTarget(Math.round(amount), this.playerStats, sourceStats, "physical");
    this.showDamageNumber(this.player.x, this.player.y - 12, actual, "physical", true);
    this.currentHp = Math.max(this.currentHp - actual, 0);
    // 关卡10：敌方伤害额外造成 10%当前生命值 + rank 的同属性伤害
    if (Math.floor(this.level || 0) > 10) {
      const bonusRaw = Math.max(0, Math.round(hpBefore * 0.10) + Math.round(this.rank || 0));
      if (bonusRaw > 0) {
        const bonus = this.applyMitigationToTarget(bonusRaw, this.playerStats, sourceStats, "physical");
        if (bonus > 0) {
          this.showDamageNumber(this.player.x, this.player.y - 12, bonus, "physical", true);
          this.currentHp = Math.max(this.currentHp - bonus, 0);
        }
      }
    }
    this.updateResourceBars();
    const now = this.time.now;
    this.lastDamageTimestamp = now;
    this.nextNoDamageRankCheck = now + NO_DAMAGE_RANK_INTERVAL;

    // 反甲：反伤给攻击者（魔法伤害）
    if (sourceStats && typeof sourceStats === "object" && sourceStats.active) {
      const thBase = Math.max(0, this.playerEquipmentStats?.thornsBase || 0);
      const thRatio = Math.max(0, this.playerEquipmentStats?.thornsArmorRatio || 0);
      if (thBase > 0 || thRatio > 0) {
        const armor = Math.max(0, this.playerStats?.armor || 0);
        const raw = Math.round(thBase + armor * thRatio);
        if (raw > 0) {
          const dealt = this.applyMitigationToTarget(raw, sourceStats, this.playerStats, "magic", 1);
          if (dealt > 0) {
            sourceStats.hp = Math.max(0, (sourceStats.hp || 0) - dealt);
            this.showDamageNumber(sourceStats.x, sourceStats.y, dealt, "magic");
            if (sourceStats.isBoss && typeof sourceStats.setData === "function") {
              sourceStats.setData("hp", sourceStats.hp);
              this.updateBossUI(sourceStats);
            }
            if (sourceStats.hp <= 0) this.killEnemy(sourceStats);
          }
        }
      }
    }

    // 伤害后尝试自动喝药
    this.tryAutoUsePotions?.();
    if (this.currentHp <= 0) this.gameOver();
    else this.playSfx("player_gethit");
  }


  killEnemy(enemy) {
    this.playSfx("enemyexploded");
    // 修改：Utsuho死亡贴图；小怪保持原贴图并做淡出效果
    if (enemy.isBoss && enemy.bossKind === "Utsuho") {
      enemy.setTexture(BOSS_UTSUHO_CONFIG.textureDeath);
    } else {
      // 小怪：使用原贴图静止在原地，亮度与透明度降到50%，随后2秒内降至0并删除
      if (enemy.anims && enemy.anims.isPlaying) enemy.anims.stop();
      enemy.setAlpha(0.5);
      enemy.setTint(0x808080); // 约等于50%亮度
      const deathFx = { factor: 0.5 };
      this.tweens.add({
        targets: deathFx,
        factor: 0,
        duration: 2000,
        onUpdate: () => {
          const f = deathFx.factor;
          const c = Phaser.Display.Color.GetColor(
            Math.floor(f * 255),
            Math.floor(f * 255),
            Math.floor(f * 255)
          );
          enemy.setTint(c);
          enemy.setAlpha(f);
        },
        onComplete: () => { if (enemy && enemy.destroy) enemy.destroy(); }
      });
    }
    enemy.setVelocity(0, 0);
    enemy.active = false;
    enemy.body.enable = false;
    this.killCount += 1;
    this.updateHUD();
    this.applyHeartsteelKillStack();
    this.applyDarkSealKillProgress(enemy);
    this.applyBailouMomentumOnKill();

    // 收集者：只要装备者击杀，显示白色“真伤9999”
    if (this.hasItemEquipped(THE_COLLECTOR_ID) && !enemy._collectorExecuteDisplayed) {
      this.showDamageNumber(enemy.x, enemy.y, "真伤9999", "true");
    }

    // Soulstealer Codex: refund 25% of current remaining cooldowns
    if (this.hasItemEquipped(SOULSTEALER_CODEX_ID)) {
      const eff = EQUIPMENT_DATA[SOULSTEALER_CODEX_ID]?.effects || {};
      const refundPct = Number.isFinite(eff.killCooldownRefundPct) ? eff.killCooldownRefundPct : 0.25;
      const now = this.time.now;
      Object.keys(this.skillReadyAt || {}).forEach((key) => {
        const readyAt = this.skillReadyAt[key] || 0;
        if (readyAt > now) {
          const remaining = readyAt - now;
          const reduce = Math.round(remaining * refundPct);
          this.skillReadyAt[key] = Math.max(now, readyAt - reduce);
        }
      });
      this.updateSkillCooldownUI?.();
    }

    // Boss死亡收尾
    if (enemy.isBoss) {
      this.clearBossUI();
      if (this.bossMusic) { this.bossMusic.stop(); this.bossMusic.destroy(); this.bossMusic = null; }
      this.boss = null;
      this.bossKind = null;
      // 清空所有Boss弹幕
      this.clearBossBullets();
      // Boss关卡：击杀Boss视为关卡完成 -> 打开商店（替代倒计时条件）
      if (this.isBossStage) {
        this.isBossStage = false;
        this.handleRoundComplete();
      }
    }

    // 清理该敌人已发出的弹幕（防止敌人死亡后子弹残留）
    if (this.bossBullets) {
      const bs = this.bossBullets.getChildren();
      for (let i = bs.length - 1; i >= 0; i -= 1) {
        const b = bs[i];
        if (b && b.owner === enemy) this.destroyBossBullet(b);
      }
    }

    // 小怪的删除由上面的2秒淡出Tween完成；Boss仍按原逻辑延迟删除
    if (enemy.isChest) {
      this.handleChestDeathRewards(enemy);
    } else {
      this.maybeDropPoint(enemy.x, enemy.y);
    }
  if (enemy.ringSprite) {
  enemy.ringSprite.destroy();
  enemy.ringSprite = null;
}
if (enemy.isBoss) {
  this.time.delayedCall(260, () => enemy.destroy());
}

  }

/* 按敌人 tier 的 dropRange（min/max）生成总点数，并拆成较多的拾取物（更分散的显示） */
maybeDropPoint(enemyOrX, maybeY) {
  let x, y, range;
  if (typeof enemyOrX === "object") {
    const e = enemyOrX;
    x = e.x; y = e.y;
    const r = e.dropRange ?? { min: 5, max: 15 };
    range = { min: Math.max(0, r.min|0), max: Math.max(0, r.max|0) };
  } else {
    x = enemyOrX; y = maybeY;
    range = { min: 5, max: 15 }; 
  }

  // 总点数
  const total = Phaser.Math.Between(range.min, range.max);
  if (total <= 0) return;

  // 显示更多的掉落点：按总额自适应拆分，最高不超过 total
  const pieces = Phaser.Math.Clamp(Math.ceil(total / 5), 3, Math.min(12, total));
  // 保证每份至少有1点
  const base = Math.max(1, Math.floor(total / pieces));
  // 剩余点数
  let remaining = total;

  for (let i = 0; i < pieces; i += 1) {
    // 最后一份拿走所有剩余点数
    const amount = (i === pieces - 1) ? remaining : Math.max(1, Math.min(base, remaining - (pieces - 1 - i))); // 避免最后为负
    remaining -= amount;

    const ang = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const dist = Phaser.Math.FloatBetween(6, 22);
    const dropX = x + Math.cos(ang) * dist;
    const dropY = y + Math.sin(ang) * dist;

    const point = this.loot.create(dropX, dropY, "point");
    point.setDepth(5);
    point.body.setAllowGravity(false);
    point.body.setDrag(600, 600);
    point.magnetActive = false;
    point.amount = amount;
    // 击杀回蓝：总计 1 点法力值，按碎片等额分配
    point.manaGain = 1 / pieces;
  }
}
  // 宝箱：击杀后奖励
  // 1) 掉落200点（掉落物）40%
  // 2) 生成20个basic毛玉 10%
  // 3) 随机一个basic装备（栏满不发）20%
  // 4) 刷新5个随机legendary敌人 5%
  handleChestDeathRewards(enemy) {
    // 概率：40% / 10% / 20% / 5%，其余不触发额外奖励
    // 使用加权随机选择事件；新增：给予玩家5个生命药水（权重20）
    const events = [
      { id: 1, weight: 40 },   // 掉落200点
      { id: 2, weight: 10 },   // 生成20个basic毛玉
      { id: 7, weight: 20 },   // 新增：给予5个生命药水
      { id: 4, weight: 20 },   // 随机一个basic装备
      { id: 5, weight: 5 },    // 刷新5个随机legendary敌人（总权重5%）
    ];
    const totalW = events.reduce((sum, e) => sum + e.weight, 0);
    let roll = Math.random() * totalW;
    let outcome = 0;
    for (let i = 0; i < events.length; i += 1) {
      const e = events[i];
      if (roll < e.weight) { outcome = e.id; break; }
      roll -= e.weight;
    }

    switch (outcome) {
      case 1: { // 掉落200点（掉落物）
        this.dropFixedPoints(enemy.x, enemy.y, 200);
        break;
      }
      case 2: { // 生成20个basic毛玉
        const def = {
          typeKey: 'kedama',
          typeConfig: ENEMY_TYPE_CONFIG.kedama,
          tierKey: ENEMY_RARITIES.BASIC,
          tierConfig: ENEMY_TYPE_CONFIG.kedama.tiers[ENEMY_RARITIES.BASIC],
        };
        for (let i = 0; i < 20; i += 1) {
          const pos = this.findEnemySpawnPosition(def) || { x: Phaser.Math.Between(TILE_SIZE, WORLD_SIZE - TILE_SIZE), y: Phaser.Math.Between(TILE_SIZE, WORLD_SIZE - TILE_SIZE) };
          this.spawnEnemyWithEffect(def, pos);
        }
        break;
      }
      case 4: { // 随机一个basic装备（满了就不给）
        const empty = this.playerEquipmentSlots.findIndex((id) => id == null);
        if (empty >= 0) {
          const pool = ITEMS_BY_TIER[ITEM_TIERS.BASIC] || [];
          const pick = pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
          const itemId = pick?.id;
          if (itemId) this.equipItem(empty, itemId);
        }
        break;
      }
      case 7: { // 新增：给予玩家5个生命药水
        this.giveHealthPotions(5);
        break;
      }
      case 5: { // 刷新5个随机legendary敌人
        const typeKeys = Object.keys(ENEMY_TYPE_CONFIG);
        for (let i = 0; i < 5; i += 1) {
          const typeKey = typeKeys[Phaser.Math.Between(0, typeKeys.length - 1)];
          const typeConfig = ENEMY_TYPE_CONFIG[typeKey];
          const tierConfig = typeConfig.tiers?.[ENEMY_RARITIES.LEGENDARY];
          if (tierConfig) {
            const def = { typeKey, typeConfig, tierKey: ENEMY_RARITIES.LEGENDARY, tierConfig };
            const pos = this.findEnemySpawnPosition(def) || { x: Phaser.Math.Between(TILE_SIZE, WORLD_SIZE - TILE_SIZE), y: Phaser.Math.Between(TILE_SIZE, WORLD_SIZE - TILE_SIZE) };
            this.spawnEnemyWithEffect(def, pos);
          }
        }
        break;
      }
      default:
        break;
    }
  }
  // 按固定总金额掉落拾取物（用于收集者额外金币/宝箱）
  // 新增：给予生命药水（叠加到现有堆，或占用一个空格子）
  giveHealthPotions(count) {
    const n = Math.max(0, Math.floor(count || 0));
    if (n <= 0) return false;
    if (this.hasItemEquipped(HEALTH_POTION_ID)) {
      const before = Math.max(0, Math.floor(this.healthPotionCount || 0));
      const add = Math.min(n, Math.max(0, 100 - before));
      if (add <= 0) return false;
      this.healthPotionCount = before + add;
      this.refreshEquipmentUI?.();
      return true;
    }
    // 未拥有：尝试占用一个空槽
    const empty = this.playerEquipmentSlots.findIndex((id) => id == null);
    if (empty < 0) return false;
    this.equipItem(empty, HEALTH_POTION_ID);
    this.healthPotionOwnerSlotIndex = empty;
    this.healthPotionCount = Math.min(100, Math.max(1, n));
    this.refreshEquipmentUI?.();
    return true;
  }

  // 按固定总金额掉落拾取物（用于收集者额外金币/宝箱）
  dropFixedPoints(x, y, total) {
    const amountTotal = Math.max(0, Math.floor(total));
    if (amountTotal <= 0) return;

    // 显示更多：更细的拆分，但不超过 total 数量
    const pieces = Phaser.Math.Clamp(Math.ceil(amountTotal / 10), 2, Math.min(20, amountTotal));
    let remaining = amountTotal;
    for (let i = 0; i < pieces; i += 1) {
      const minLeft = (pieces - 1 - i); // 确保后面至少各1
      const avg = Math.floor(remaining / (pieces - i));
      const base = Math.max(1, avg);
      const amount = (i === pieces - 1) ? remaining : Math.max(1, Math.min(base, remaining - minLeft));
      remaining -= amount;
      const ang = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const dist = Phaser.Math.FloatBetween(6, 22);
      const dropX = x + Math.cos(ang) * dist;
      const dropY = y + Math.sin(ang) * dist;

      const point = this.loot.create(dropX, dropY, "point");
      point.setDepth(5);
      point.body.setAllowGravity(false);
      point.body.setDrag(600, 600);
      point.magnetActive = false;
      point.amount = amount;
      // 固定掉落（如宝箱/收集者）不提供回蓝
      point.manaGain = 0;
    }
  }

  collectPoint(_player, point) {
    if (!point.active) return;
    this.playSfx("itempick");
    this.loot.remove(point, true, true);
    this.playerPoints += point.amount;
    const fallback = point.amount * 10; // 兼容旧逻辑
    const gainRaw = Number.isFinite(point.manaGain) ? point.manaGain : fallback;
    const maxMana = this.playerStats?.maxMana ?? PLAYER_BASE_STATS.maxMana ?? PLAYER_MANA_MAX;
    let carry = this._manaRegenCarry || 0;
    const total = gainRaw + carry;
    const gainInt = Math.floor(total);
    this._manaRegenCarry = total - gainInt;
    if (gainInt > 0) {
      this.currentMana = Math.min((this.currentMana ?? 0) + gainInt, maxMana);
    }
    this.updateResourceBars();
    this.updateHUD();
  }

  destroyBullet(bullet) {
    if (!bullet || bullet.destroyed) return;
    this.detachBulletTrailFromBullet(bullet, true);
    bullet.destroyed = true;
    this.bullets.remove(bullet, true, true);
  }

  /* ==== 新增：Boss 弹幕销毁与更新 ==== */
  destroyBossBullet(b) {
    if (!b || b.destroyed) return;
    if (b.trailTimer) { b.trailTimer.remove(false); b.trailTimer = null; }
    b.destroyed = true;
    this.bossBullets.remove(b, true, true);
  }
  clearBossBullets() {
    if (!this.bossBullets) return;
    this.bossBullets.getChildren().forEach((b) => this.destroyBossBullet(b));
  }
// 在 updateBossBullets 方法中添加核弹轨迹生成逻辑
  updateBossBullets(delta) {
      if (!this.bossBullets) return;
      const dt = delta / 1000;
      const list = this.bossBullets.getChildren();
      for (let i = list.length - 1; i >= 0; i -= 1) {
          const b = list[i];
          if (!b.active) continue;

          // 前向速度 + 加速度
          b.forwardSpeed = (b.forwardSpeed || 0) + (b.accel || 0) * dt;

          // 速度分解：方向向量（ux,uy）与其法向（-uy,ux）
          const ux = b.ux || 1;
          const uy = b.uy || 0;
          const side = b.sideSpeed || 0;
          const fs = b.forwardSpeed || 0;

          const vx = ux * fs + (-uy) * side;
          const vy = uy * fs + (ux) * side;
          b.body.setVelocity(vx, vy);

          // 新增：核弹轨迹生成
          if (b.texture.key === "u_bullet_nuclearbomb") {
              if (!b.lastSpawnPos) {
                  b.lastSpawnPos = { x: b.x, y: b.y };
              }
              const step = this.tilesToPx(4); // 每4格检查一次
              const dist = Phaser.Math.Distance.Between(b.x, b.y, b.lastSpawnPos.x, b.lastSpawnPos.y);
              if (dist >= step) {
                  // 生成 nuclearspawn
                  const s = this.add.image(b.x, b.y, "u_bullet_nuclearspawn").setDepth(b.depth - 1);
                  this.setDisplaySizeByTiles(s, BOSS_UTSUHO_CONFIG.hitboxes.bullets.nuclearspawn.size);
                  s.setRotation(Math.atan2(uy, ux));
                  s.setAlpha(1);

                  // 1秒后淡出并生成 hazard
                  this.time.delayedCall(5000, () => {
                      this.tweens.add({
                          targets: s,
                          alpha: 0,
                          duration: 400,
                          onComplete: () => {
                              // 生成10个 nuclearhazard
                              for (let i = 0; i < 1; i++) {
                                  const offR = this.tilesToPx(2);
                                  const rx = Phaser.Math.FloatBetween(-offR, offR);
                                  const ry = Phaser.Math.FloatBetween(-offR, offR);
                                  const hx = s.x + rx;
                                  const hy = s.y + ry;
                                  this.spawnBossBullet({
                                      key: "u_bullet_nuclearhazard",
                                      sizeTiles: BOSS_UTSUHO_CONFIG.hitboxes.bullets.nuclearhazard.size,
                                      judgeTiles: BOSS_UTSUHO_CONFIG.hitboxes.bullets.nuclearhazard.judge,
                                      from: { x: hx, y: hy },
                                      dirAngleDeg: Phaser.Math.Between(0, 359),
                                      forwardSpeed: 1,
                                      accel: 0,
                                      sideSpeed: 0,
                                  }, BOSS_UTSUHO_CONFIG.bulletMagicDamage, true);
                              }
                              s.destroy();
                          }
                      });
                  });

                  b.lastSpawnPos = { x: b.x, y: b.y };
              }
          }

          // 离开画布则删除（完全移出）
          const r = b.hitRadius || 0;
          if (b.x < -r || b.x > WORLD_SIZE + r || b.y < -r || b.y > WORLD_SIZE + r) {
              this.destroyBossBullet(b);
          }
      }
  }

updateMikoOrbs(delta) {
  if (!this.mikoOrbs || this.mikoOrbs.length===0) return;
  const dt = delta;
  const speedOrbit = 6.5;             // 环绕角速度
  const radius = 48;                   // 环绕半径
  const seekSpeed = 220;               // 追踪速度

  for (let i=this.mikoOrbs.length-1;i>=0;i--){
    const orb = this.mikoOrbs[i];
    if (!orb || !orb.active) { this.mikoOrbs.splice(i,1); continue; }

    if (orb._state === "orbit") {
      orb._orbitTimeLeft -= dt;
      orb._angle += speedOrbit * dt/1000;
      orb.x = this.player.x + Math.cos(orb._angle) * radius;
      orb.y = this.player.y + Math.sin(orb._angle) * radius;
      if (orb._orbitTimeLeft <= 0) {
        // 切换到追踪
        const t = this.findNearestEnemy(this.player.x, this.player.y, Number.MAX_VALUE);
        orb._seekTarget = t || null;
        orb._state = "seek";
      }
    } else if (orb._state === "seek") {
      const t = orb._seekTarget && orb._seekTarget.active ? orb._seekTarget 
               : this.findNearestEnemy(orb.x, orb.y, Number.MAX_VALUE);
      if (!t) {
        // 没目标则渐隐消失
        orb._state="done";
        this.tweens.add({targets:orb, alpha:0, duration:300, onComplete:()=>orb.destroy()});
        continue;
      }
      const ang = Math.atan2(t.y - orb.y, t.x - orb.x);
      this.physics.velocityFromRotation(ang, seekSpeed, orb.body.velocity);
      // 朝向
      orb.setRotation(ang + Math.PI/2);
    }
  }
}
castDash() {
  if (!this.canCast("DASH")) return;
  this.spendCostAndStartCd("DASH");
  // 技能音效：SPACE 闪避
  this.playSfx("player_dash");

  // 无敌
  const dur = this.skillConfig.DASH.durationMs;
  this.playerInvulnerableUntil = this.time.now + dur;

  // 临时忽略墙碰撞（边界仍生效：setCollideWorldBounds(true) 已存在）
  if (this.playerWallCollider) this.playerWallCollider.active = false;

  // 位移方向：玩家朝向
  const facing = this.playerFacing || "down";
  const dirRad = {down:Math.PI/2, up:-Math.PI/2, left:Math.PI, right:0}[facing] ?? 0;
  const dx = Math.cos(dirRad) * this.skillConfig.DASH.distance;
  const dy = Math.sin(dirRad) * this.skillConfig.DASH.distance;

  // Tween 位移
  const tx = Phaser.Math.Clamp(this.player.x + dx, TILE_SIZE, WORLD_SIZE - TILE_SIZE);
  const ty = Phaser.Math.Clamp(this.player.y + dy, TILE_SIZE, WORLD_SIZE - TILE_SIZE);
  const p = this.add.image(this.player.x, this.player.y, "dash_particle").setDepth(10).setAlpha(0.9);
  this.tweens.add({ targets:p, alpha:0, duration:260, onComplete:()=>p.destroy() });

  this.tweens.add({
    targets: this.player,
    x: tx, y: ty,
    duration: dur, ease: "Cubic.Out",
    onComplete: ()=>{
      // 结束：恢复墙碰撞
      if (this.playerWallCollider) this.playerWallCollider.active = true;
      
      // 触发耀光效果
      this.onSpellCastComplete();
    }
  });
}


  gameOver() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.playSfx("pldead");
    // 暂停一切物理与计时
    this.physics.pause();
    if (this.attackTimer) { this.attackTimer.remove(); this.attackTimer = null; }
    if (this.spawnTimer) { this.spawnTimer.remove(); this.spawnTimer = null; }
    // 音乐静音
    if (this.battleBgm?.isPlaying) this.battleBgm.pause();
    // 显示失败覆盖层
    this.time.timeScale = 0;
    if (typeof this.showHtmlStatsOverlay === "function") this.showHtmlStatsOverlay("fail");
  }

  showGameOverOverlay() {
    this.clearGameOverOverlay();
    const bg = this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.65)
      .setScrollFactor(0).setDepth(50);
    const title = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 28, "战斗失败", {
      fontFamily: '"Zpix", monospace', fontSize: "20px", color: "#ff3344",
    }).setOrigin(0.5).setScrollFactor(0).setDepth(51);
    ensureBaseFontSize(title);
    const prompt = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 10, "按 Enter 或 R 重开，按 N 返回标题", {
      fontFamily: '"Zpix", monospace', fontSize: "14px", color: "#ffd0d0",
    }).setOrigin(0.5).setScrollFactor(0).setDepth(51);
    ensureBaseFontSize(prompt);

    this.gameOverOverlayBackground = bg;
    this.gameOverOverlayElements = [title, prompt];
    this.updateOverlayScale();

    this.gameOverDecisionHandler = (e) => {
      if (!e) return;
      if (e.code === "Enter" || e.code === "KeyR") this.restartFromGameOver();
      else if (e.code === "KeyN" || e.code === "Escape") this.exitToStartFromGameOver();
    };
    this.input.keyboard.on("keydown", this.gameOverDecisionHandler, this);
  }
  clearGameOverOverlay() {
    if (this.gameOverOverlayElements?.length) this.gameOverOverlayElements.forEach((el)=> el.destroy());
    this.gameOverOverlayElements = [];
    if (this.gameOverOverlayBackground) { this.gameOverOverlayBackground.destroy(); this.gameOverOverlayBackground = null; }
    if (this.gameOverDecisionHandler) { this.input.keyboard.off("keydown", this.gameOverDecisionHandler, this); this.gameOverDecisionHandler = null; }
  }
  restartFromGameOver() {
    this.clearGameOverOverlay();
    this.isGameOver = false;
    // 恢复音乐（新场景会自行创建/播放）
    if (this.battleBgm?.isPaused) this.battleBgm.stop?.();
    // 需求：死亡后的重开应完全重新加载界面
    // 使用浏览器刷新来确保所有状态（包括全局/静态单例）被重置
    if (typeof window !== "undefined" && window.location) {
      window.location.reload();
    } else {
      // 兜底：若无法访问 window，则退回到场景重启
      this.scene.restart();
    }
  }
  exitToStartFromGameOver() {
    this.clearGameOverOverlay();
    this.isGameOver = false;
    if (this.battleBgm?.isPaused) this.battleBgm.stop?.();
    this.scene.start("StartScene");
  }

  updateStatPanel() {
    if (!this.ui.statContainer) return;
    const stats = [
      `AD ${this.playerStats.attackDamage}`,
      `AP ${this.playerStats.abilityPower}`,
      `AS ${this.playerStats.attackSpeed.toFixed(2)}/s`,
      `HP ${this.playerStats.maxHp}`,
      `MP ${this.playerStats.maxMana}`,
      `MS ${Math.round(this.playerStats.moveSpeed ?? PLAYER_BASE_SPEED)}`,
      `CR ${(((this.playerStats.critChanceUncapped ?? this.playerStats.critChance) || 0) * 100).toFixed(0)}%`,
      `CD ${this.playerStats.critDamage}%`,
      `DEF ${this.playerStats.defense}`,
      `AR ${this.playerStats.armor}`,
      `AH ${this.playerStats.abilityHaste || 0}`,
      `CDR ${((this.playerStats.cooldownReduction ?? 0) * 100).toFixed(0)}%`,
      `射程 ${this.playerStats.range}`,
    ];
    this.ui.statContainer.innerHTML = "";
    stats.forEach((line) => {
      const span = document.createElement("span");
      span.className = "stat-line";
      span.textContent = line;
      this.ui.statContainer.appendChild(span);
    });
  }

  updateResourceBars() {
    if (this.ui.hpBar) {
      const hpPct = this.currentHp / this.playerStats.maxHp;
      this.ui.hpBar.style.width = `${Phaser.Math.Clamp(hpPct, 0, 1) * 100}%`;
    }
    if (this.ui.hpLabel) this.ui.hpLabel.textContent = `HP ${this.currentHp}/${this.playerStats.maxHp}`;
    if (this.ui.mpBar) {
      const maxMana = this.playerStats?.maxMana ?? PLAYER_BASE_STATS.maxMana ?? PLAYER_MANA_MAX;
      const mpPct = maxMana > 0 ? (this.currentMana ?? 0) / maxMana : 0;
      this.ui.mpBar.style.width = `${Phaser.Math.Clamp(mpPct, 0, 1) * 100}%`;
    }
    if (this.ui.mpLabel) {
      const maxMana = this.playerStats?.maxMana ?? PLAYER_BASE_STATS.maxMana ?? PLAYER_MANA_MAX;
      this.ui.mpLabel.textContent = `MP ${this.currentMana}/${maxMana}`;
    }
  }

  /* ==== 装备栏：DOM 辅助 ==== */
  getSlotIndexFromEvent(event) {
    const el = event?.currentTarget ?? event?.target;
    if (!el) return null;
    const slotEl = el.closest?.(".equipment-slot[data-slot-index]") || el;
    const idx = Number(slotEl?.dataset?.slotIndex);
    return Number.isFinite(idx) ? idx : null;
  }

  /* ==== 装备栏：拖拽实现 ==== */
  handleEquipmentDragStart(event) {
    const sourceIndex = this.getSlotIndexFromEvent(event);
    if (sourceIndex == null) return;
    if (!this.playerEquipmentSlots[sourceIndex]) return;

    this.draggedEquipmentSlot = sourceIndex;

    if (event.dataTransfer) {
      try {
        event.dataTransfer.setData("text/plain", String(sourceIndex));
        event.dataTransfer.effectAllowed = "move";
      } catch (_) {}
    }

    const el = event.currentTarget;
    el.classList.add("dragging");
    event.stopPropagation?.();
  }

  handleEquipmentDragEnter(event) {
    const targetIndex = this.getSlotIndexFromEvent(event);
    if (targetIndex == null) return;
    event.preventDefault?.();
    const el = event.currentTarget;
    el.classList.add("drag-over");
  }

  handleEquipmentDragOver(event) {
    event.preventDefault?.();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  }

  handleEquipmentDragLeave(event) {
    const el = event.currentTarget;
    el.classList.remove("drag-over");
  }

  handleEquipmentDrop(event) {
    event.preventDefault?.();
    event.stopPropagation?.();

    const sourceIndex =
      this.draggedEquipmentSlot != null
        ? this.draggedEquipmentSlot
        : Number(event.dataTransfer?.getData("text/plain"));

    const targetIndex = this.getSlotIndexFromEvent(event);

    const el = event.currentTarget;
    el.classList.remove("drag-over");

    if (
      sourceIndex == null ||
      targetIndex == null ||
      sourceIndex === targetIndex
    ) {
      return;
    }

    this.swapEquipmentSlots(sourceIndex, targetIndex);

    if (this.activeEquipmentTooltipIndex === sourceIndex) {
      this.activeEquipmentTooltipIndex = targetIndex;
    } else if (this.activeEquipmentTooltipIndex === targetIndex) {
      this.activeEquipmentTooltipIndex = sourceIndex;
    }
    this.refreshEquipmentTooltip(this.activeEquipmentTooltipIndex);
  }

  handleEquipmentDragEnd(event) {
    if (this.equipmentUi?.slots?.length) {
      this.equipmentUi.slots.forEach(({ element }) => {
        element.classList.remove("dragging");
        element.classList.remove("drag-over");
      });
    }
    this.draggedEquipmentSlot = null;
    event.stopPropagation?.();
  }

  /* ==== 装备栏：悬停提示 ==== */
  handleEquipmentSlotEnter(event) {
    const idx = this.getSlotIndexFromEvent(event);
    if (idx == null) return;
    this.activeEquipmentTooltipIndex = idx;
    this.refreshEquipmentTooltip(idx);
  }

  handleEquipmentSlotLeave() {
    this.activeEquipmentTooltipIndex = null;
    this.refreshEquipmentTooltip(null);
  }

  handleEquipmentSlotClick(event) {
    const idx = this.getSlotIndexFromEvent(event);
    if (idx == null) return;
    const itemId = this.playerEquipmentSlots[idx];
    if (!itemId) return;
    const item = this.getEquipmentDefinition(itemId);
    if (!item) return;
    const unitSellPrice = EQUIPMENT_SELL_PRICE_CACHE[itemId] ?? Math.floor((item.cost ?? 0) * 0.7);

    // 特例：生命药水按数量全部售出
    if (itemId === HEALTH_POTION_ID) {
      // 计算总数量：堆叠数量 + 额外槽位数量（-1，因一个槽位已计入）
      const slotIndices = [];
      for (let i = 0; i < this.playerEquipmentSlots.length; i += 1) {
        if (this.playerEquipmentSlots[i] === HEALTH_POTION_ID) slotIndices.push(i);
      }
      const extraFromSlots = Math.max(0, slotIndices.length - 1);
      const stackCount = Math.max(0, Math.floor(this.healthPotionCount || 0));
      const totalCount = Math.max(1, stackCount + extraFromSlots);
      const totalSell = unitSellPrice * totalCount;
      const confirmText = `确认以 ${totalSell} 金币卖出 ${item.name} x${totalCount} 吗？`;
      if (typeof window !== "undefined" && !window.confirm(confirmText)) return;
      // 清空所有生命药水槽位
      slotIndices.forEach((si) => { this.playerEquipmentSlots[si] = null; });
      this.healthPotionCount = 0;
      this.healthPotionOwnerSlotIndex = null;
      this.playerPoints += totalSell;
      this.refreshEquipmentUI();
      this.recalculateEquipmentEffects();
      const tooltipIndex = this.activeEquipmentTooltipIndex ?? null;
      this.refreshEquipmentTooltip(tooltipIndex);
      this.updateHUD();
      this.updateResourceBars();
      if (this.isShopOpen()) {
        this.updateShopGoldLabel();
        this.renderShop();
        this.setShopMessage(`已卖出 ${item.name} x${totalCount}，获得 ${totalSell} 金币。`);
      }
      return;
    }

    const confirmText = `确认以 ${unitSellPrice} 金币卖出 ${item.name} 吗？`;
    if (typeof window !== "undefined" && !window.confirm(confirmText)) return;
    this.playerEquipmentSlots[idx] = null;
    this.playerPoints += unitSellPrice;
    this.refreshEquipmentUI();
    this.recalculateEquipmentEffects();
    const tooltipIndex = this.activeEquipmentTooltipIndex ?? null;
    this.refreshEquipmentTooltip(tooltipIndex);
    this.updateHUD();
    this.updateResourceBars();
    if (this.isShopOpen()) {
      this.updateShopGoldLabel();
      this.renderShop();
      this.setShopMessage(`已卖出 ${item.name}，获得 ${sellPrice} 金币。`);
    }
  }

  /* ==== 商店系统 ==== */
  initializeShopSystem() {
    const ui = this.ui;
    if (!ui?.shopOverlay) return;

    this.teardownShopSystem();

    const shopUi = {
      overlay: ui.shopOverlay,
      items: ui.shopItems,
      message: ui.shopMessage,
      goldValue: ui.shopGoldValue,
      refreshBtn: ui.shopRefreshBtn,
      closeBtn: ui.shopCloseBtn,
      exitBtn: ui.shopExitRunBtn,
      title: ui.shopTitle,
      goldLabel: ui.shopGoldLabel,
    };

    this.shopUi = shopUi;

    if (shopUi.title) shopUi.title.textContent = SHOP_TEXT.title;
    if (shopUi.goldLabel) {
      const textNode = shopUi.goldLabel.firstChild;
      const textNodeType = typeof Node === "undefined" ? 3 : Node.TEXT_NODE;
      if (textNode && textNode.nodeType === textNodeType) {
        textNode.nodeValue = SHOP_TEXT.goldPrefix;
      } else if (typeof document !== "undefined") {
        shopUi.goldLabel.insertBefore(
          document.createTextNode(SHOP_TEXT.goldPrefix),
          shopUi.goldValue ?? null,
        );
      }
    }
    if (shopUi.refreshBtn) shopUi.refreshBtn.textContent = SHOP_TEXT.refresh;
    if (shopUi.closeBtn) shopUi.closeBtn.textContent = SHOP_TEXT.continueRun;
    if (shopUi.exitBtn) shopUi.exitBtn.textContent = SHOP_TEXT.exitRun;

    this.registerShopUiHandler(shopUi.refreshBtn, "click", () => this.handleShopRefresh());
    this.registerShopUiHandler(shopUi.closeBtn, "click", () => this.handleShopClose(true));
    this.registerShopUiHandler(shopUi.exitBtn, "click", () => this.handleShopClose(false));

    this.events.once("shutdown", () => this.teardownShopSystem());
    this.events.once("destroy", () => this.teardownShopSystem());
  }

  registerShopUiHandler(element, type, handler) {
    if (!element || typeof element.addEventListener !== "function" || typeof handler !== "function") return;
    element.addEventListener(type, handler);
    this.shopUiHandlers.push({ element, type, handler });
  }

  registerShopDynamicHandler(element, type, handler) {
    if (!element || typeof element.addEventListener !== "function" || typeof handler !== "function") return;
    element.addEventListener(type, handler);
    this.shopDynamicHandlers.push({ element, type, handler });
  }

  clearShopDynamicHandlers() {
    if (this.shopDynamicHandlers) {
      this.shopDynamicHandlers.forEach(({ element, type, handler }) => {
        if (element?.removeEventListener) element.removeEventListener(type, handler);
      });
      this.shopDynamicHandlers = [];
    }
  }

  teardownShopSystem() {
    this.clearShopDynamicHandlers();
    if (this.shopUiHandlers) {
      this.shopUiHandlers.forEach(({ element, type, handler }) => {
        if (element?.removeEventListener) element.removeEventListener(type, handler);
      });
      this.shopUiHandlers = [];
    }
    if (this.shopUi?.overlay) this.shopUi.overlay.classList.remove("visible");
    this.shopUi = null;
  }

  isShopOpen() {
    return Boolean(this.shopState?.isOpen);
  }

  openShop(reason = "roundEnd") {
    if (!this.shopUi?.overlay) return;
    this.shopState.reason = reason;
    this.shopState.isOpen = true;
    this.shopState.lastMessage = "";
    // 每次进入商店重置刷新费用为初始值
    this.shopState.refreshCost = SHOP_REFRESH_COST;
    // 根据进入原因切换商店标题
    if (this.shopUi?.title) {
      this.shopUi.title.textContent = (reason === "inRun") ? "属性碎片商店" : "装备商店";
    }

    this.physics.pause();
    this.time.timeScale = 0;
    if (this.attackTimer) this.attackTimer.paused = true;
    if (this.spawnTimer) this.spawnTimer.paused = true;

    this.generateShopOffers();
    this.renderShop();
    this.updateShopGoldLabel();
    this.updateShardProgressHeader();
    this.clearShopMessage();

    if (this.shopUi.exitBtn) {
      this.shopUi.exitBtn.style.display = reason === "roundEnd" ? "" : "none";
    }

    this.shopUi.overlay.classList.add("visible");
    if (reason === "roundEnd") this.roundAwaitingDecision = true;
  }

  closeShopOverlay() {
    if (this.shopUi?.overlay) this.shopUi.overlay.classList.remove("visible");
    this.shopState.isOpen = false;
  }

  resumeGameplayAfterShop() {
    this.time.timeScale = 1;
    this.physics.resume();
    if (this.attackTimer) this.attackTimer.paused = false;
    if (this.spawnTimer) this.spawnTimer.paused = false;
  }

  handleShopClose(continueRun) {
    if (!this.isShopOpen()) return;
    this.closeShopOverlay();
    this.clearShopDynamicHandlers();
    this.shopState.offers = [];
    this.clearShopMessage();

    if (this.shopState.reason === "roundEnd") {
      this.roundAwaitingDecision = false;
      this.resumeGameplayAfterShop();
      this.continueAfterRound(Boolean(continueRun));
    } else if (this.shopState.reason === "debug") {
      if (continueRun) {
        this.roundComplete = false;
        this.roundAwaitingDecision = false;
        this.resumeGameplayAfterShop();
        if (!this.spawnTimer) this.scheduleSpawnTimer();
      } else {
        this.resumeGameplayAfterShop();
        this.scene.start("StartScene");
      }
    } else {
      this.resumeGameplayAfterShop();
    }
    this.shopState.reason = null;
  }

  handleShopRefresh() {
    if (!this.isShopOpen()) return;
    const currentCost = Math.max(1, Math.floor(this.shopState?.refreshCost ?? SHOP_REFRESH_COST));
    if (this.playerPoints < currentCost) {
      this.setShopMessage(SHOP_TEXT.notEnoughGold);
      return;
    }
    // 扣除当前刷新费用
    this.playerPoints -= currentCost;
    // 刷新费用按1.8倍增长并向下取整
    this.shopState.refreshCost = Math.max(1, Math.floor(currentCost * 1.8));
    this.updateHUD();
    this.updateShopGoldLabel();
    this.generateShopOffers();
    this.renderShop();
    this.updateShardProgressHeader();
    this.setShopMessage(SHOP_TEXT.refreshed);
  }

  updateShopGoldLabel() {
    if (this.shopUi?.goldValue) this.shopUi.goldValue.textContent = `${this.playerPoints}`;
    const cost = Math.max(1, Math.floor(this.shopState?.refreshCost ?? SHOP_REFRESH_COST));
    if (this.shopUi?.refreshBtn) {
      // 动态更新刷新按钮的文案与可用状态
      this.shopUi.refreshBtn.textContent = `刷新 (-${cost})`;
      this.shopUi.refreshBtn.disabled = this.playerPoints < cost;
    }
  }

  // —— 碎片解锁提示（标题旁）—— //
  ensureShardProgressHeader() {
    if (!this.shopUi?.title) return;
    if (!this.shopUi.shardProgressEl) {
      const span = document.createElement("span");
      span.className = "shop-shard-progress-inline";
      span.style.marginLeft = "8px";
      span.style.fontSize = "12px";
      span.style.color = "#ffd966";
      this.shopUi.title.appendChild(span);
      this.shopUi.shardProgressEl = span;
    }
    this.shopUi.shardProgressEl.style.display = "";
  }

  hideShardProgressHeader() {
    if (this.shopUi?.shardProgressEl) this.shopUi.shardProgressEl.style.display = "none";
  }

  updateShardProgressHeader() {
    if (!this.shopUi) return;
    if (this.shopState?.reason !== "inRun") { this.hideShardProgressHeader(); return; }
    this.ensureShardProgressHeader();
    const info = this.getShardNextUnlockInfo?.();
    if (!info) { this.hideShardProgressHeader(); return; }
    this.shopUi.shardProgressEl.textContent = `下一级解锁还需 ${info.remain} 次`;
  }

  setShopMessage(text) {
    this.shopState.lastMessage = text || "";
    if (this.shopUi?.message) this.shopUi.message.textContent = this.shopState.lastMessage;
  }

  clearShopMessage() {
    this.setShopMessage("");
  }

  generateShopOffers() {
    // 仅“地图中进入商店”（inRun）才使用碎片商店，其余（roundEnd/debug）使用原装备商店
    if (this.shopState?.reason === "inRun") {
      const offers = [];
      const unlocked = this.getUnlockedShardRarities();
      const selectable = unlocked.length > 0 ? unlocked : [SHARD_RARITIES.BASIC];
      const weightByRarity = { basic: 4, mid: 3, epic: 2, legendary: 1 };
      for (let i = 0; i < SHOP_ITEM_COUNT; i += 1) {
        const totalW = selectable.reduce((s, r) => s + (weightByRarity[r] || 0), 0) || 1;
        let roll = shopRandom() * totalW;
        let chosenR = selectable[0];
        for (const r of selectable) {
          roll -= (weightByRarity[r] || 0);
          if (roll <= 0) { chosenR = r; break; }
        }
        const pool = SHARDS.filter(s => s.rarity === chosenR);
        const pick = pool[Math.floor(shopRandom() * pool.length)] || pool[0];
        if (pick) offers.push({ type: "shard", id: pick.id });
      }
      this.shopState.offers = offers;
    } else {
      this.generateEquipmentShopOffers();
    }
  }

  // 原装备商店生成逻辑（保留）：根据已有基础/进阶装备偏好生成
  generateEquipmentShopOffers() {
    const ownedIds = this.getOwnedItemIds();
    const ownedBasics = this.getOwnedItemsByTier(ITEM_TIERS.BASIC);
    const ownedMid = this.getOwnedItemsByTier(ITEM_TIERS.MID);
    const ownedCounts = this.countOwnedItemIds(ownedIds);
    const usedIds = new Set();
    const offers = [];

    const guaranteedIds = this.collectGuaranteedItems(ownedCounts);
    guaranteedIds.forEach((id) => {
      if (offers.length >= SHOP_ITEM_COUNT) return;
      if (usedIds.has(id)) return;
      const item = this.getEquipmentDefinition(id);
      if (!item) return;
      offers.push({ id, tier: item.tier });
      usedIds.add(id);
    });

    const maxAttempts = 100;
    const preferredPicks = { [ITEM_TIERS.MID]: 0, [ITEM_TIERS.LEGENDARY]: 0 };
    let attempts = 0;
    while (offers.length < SHOP_ITEM_COUNT && attempts < maxAttempts) {
      attempts += 1;
      const initialTier = this.rollShopTier(ownedBasics, ownedMid);
      const tierPriority = initialTier === ITEM_TIERS.LEGENDARY
        ? [ITEM_TIERS.LEGENDARY, ITEM_TIERS.MID, ITEM_TIERS.BASIC]
        : initialTier === ITEM_TIERS.MID
          ? [ITEM_TIERS.MID, ITEM_TIERS.BASIC]
          : [ITEM_TIERS.BASIC];

      let tier = initialTier;
      let weightedCandidates = [];
      for (const candidateTier of tierPriority) {
        const candidates = this.getWeightedCandidatesForTier(
          candidateTier,
          ownedBasics,
          ownedMid,
          ownedCounts,
          usedIds,
        );
        if (candidates.length > 0) {
          weightedCandidates = candidates;
          tier = candidateTier;
          break;
        }
      }

      if (weightedCandidates.length === 0) {
        const fallbackBasics = ITEMS_BY_TIER[ITEM_TIERS.BASIC]
          .map((item) => item.id)
          .filter((id) => !usedIds.has(id));
        if (fallbackBasics.length === 0) break;
        weightedCandidates = fallbackBasics.map((id) => ({ id, weight: 1, preferred: false }));
        tier = ITEM_TIERS.BASIC;
      }

      let candidatePool = weightedCandidates;
      if (tier === ITEM_TIERS.MID || tier === ITEM_TIERS.LEGENDARY) {
        const limit = tier === ITEM_TIERS.MID ? 1 : 1;
        if ((preferredPicks[tier] ?? 0) >= limit) {
          const nonPreferred = weightedCandidates.filter((entry) => !entry.preferred);
          if (nonPreferred.length > 0) candidatePool = nonPreferred;
        } else if (shopRandom() < 0.4) {
          const nonPreferred = weightedCandidates.filter((entry) => !entry.preferred);
          if (nonPreferred.length > 0) candidatePool = nonPreferred;
        }
      }

      let chosenId = this.pickWeightedCandidate(candidatePool);
      if (!chosenId) chosenId = this.pickWeightedCandidate(weightedCandidates);
      if (!chosenId && tier === ITEM_TIERS.BASIC) {
        const fallback = ITEMS_BY_TIER[tier]
          .map((item) => item.id)
          .filter((id) => !usedIds.has(id));
        chosenId = randomElement(fallback);
      }
      if (!chosenId) continue;
      if (usedIds.has(chosenId)) continue;
      usedIds.add(chosenId);
      const item = this.getEquipmentDefinition(chosenId);
      const tierForOffer = item?.tier ?? tier;
      if (item && (tier === ITEM_TIERS.MID || tier === ITEM_TIERS.LEGENDARY)) {
        const entry = weightedCandidates.find((candidate) => candidate.id === chosenId);
        if (entry?.preferred) preferredPicks[tier] = (preferredPicks[tier] ?? 0) + 1;
      }
      offers.push({ id: chosenId, tier: tierForOffer });
    }

    if (offers.length === 0) return;
    this.shopState.offers = offers;
  }

  getUnlockedShardRarities() {
    const p = this?.shardState?.purchases || { basic: 0, mid: 0, epic: 0, legendary: 0 };
    const unlocked = [SHARD_RARITIES.BASIC];
    // 修改：Mid 解锁需要 6 次 Basic；Epic/Legendary 保持 3 次不变
    if ((p.basic || 0) >= 6) unlocked.push(SHARD_RARITIES.MID);
    if ((p.mid || 0) >= 3) unlocked.push(SHARD_RARITIES.EPIC);
    if ((p.epic || 0) >= 3) unlocked.push(SHARD_RARITIES.LEGENDARY);
    return unlocked;
  }

  // —— 碎片解锁进度（只显示下一个稀有度的剩余次数）—— //
  getShardNextUnlockInfo() {
    const p = this?.shardState?.purchases || { basic: 0, mid: 0, epic: 0, legendary: 0 };
    // Mid 需 6 次 Basic；Epic 需 3 次 Mid；Legendary 需 3 次 Epic
    if ((p.basic || 0) < 6) return { remain: 6 - (p.basic || 0), target: "Mid" };
    if ((p.mid || 0) < 3) return { remain: 3 - (p.mid || 0), target: "Epic" };
    if ((p.epic || 0) < 3) return { remain: 3 - (p.epic || 0), target: "Legendary" };
    return null; // 全部已解锁
  }

  createShardProgressElement() {
    const info = this.getShardNextUnlockInfo();
    if (!info) return null;
    const el = document.createElement("div");
    el.style.fontSize = "12px";
    el.style.color = "#ffd966";
    el.style.margin = "4px 0 8px 0";
    el.textContent = `下一级解锁还需 ${info.remain} 次`;
    return el;
  }

  rollShopTier(ownedBasics, ownedMid) {
    if (ownedMid.length > 0 && shopRandom() < 0.5) return ITEM_TIERS.LEGENDARY;
    if (ownedBasics.length > 0 && shopRandom() < 0.5) return ITEM_TIERS.MID;
    return ITEM_TIERS.BASIC;
  }
  getCandidatesForTier(tier, ownedBasics, ownedMid) {
    if (tier === ITEM_TIERS.MID) {
      return this.collectUpgradeCandidates(ownedBasics, ITEM_TIERS.MID);
    }
    if (tier === ITEM_TIERS.LEGENDARY) {
      const candidates = new Set([
        ...this.collectUpgradeCandidates(ownedMid, ITEM_TIERS.LEGENDARY),
        ...this.collectUpgradeCandidates(ownedBasics, ITEM_TIERS.LEGENDARY),
      ]);
      return Array.from(candidates);
    }
    return ITEMS_BY_TIER[ITEM_TIERS.BASIC].map((item) => item.id);
  }

  collectUpgradeCandidates(ownedIds, targetTier) {
    if (!Array.isArray(ownedIds) || ownedIds.length === 0) return [];
    const result = new Set();
    ownedIds.forEach((id) => {
      const item = this.getEquipmentDefinition(id);
      (item?.buildsInto ?? []).forEach((candidateId) => {
        const candidate = this.getEquipmentDefinition(candidateId);
        if (candidate?.tier === targetTier) result.add(candidateId);
      });
    });
    return Array.from(result);
  }

  countOwnedItemIds(ownedIds) {
    const counts = new Map();
    if (!Array.isArray(ownedIds)) return counts;
    ownedIds.forEach((id) => {
      if (typeof id !== "string") return;
      counts.set(id, (counts.get(id) ?? 0) + 1);
    });
    return counts;
  }

  hasAllComponentsForItem(item, ownedCounts) {
    if (!item?.buildsFrom?.length) return false;
    const needs = new Map();
    item.buildsFrom.forEach((componentId) => {
      needs.set(componentId, (needs.get(componentId) ?? 0) + 1);
    });
    for (const [componentId, requiredAmount] of needs.entries()) {
      if ((ownedCounts.get(componentId) ?? 0) < requiredAmount) return false;
    }
    return true;
  }

  collectGuaranteedItems(ownedCounts) {
    const tierOrder = [ITEM_TIERS.LEGENDARY, ITEM_TIERS.MID, ITEM_TIERS.BASIC];
    const maxPerTier = {
      [ITEM_TIERS.LEGENDARY]: Math.min(2, SHOP_ITEM_COUNT),
      [ITEM_TIERS.MID]: Math.min(1, SHOP_ITEM_COUNT),
      [ITEM_TIERS.BASIC]: 0,
    };
    const craftableByTier = new Map();

    Object.values(EQUIPMENT_DATA).forEach((item) => {
      if (!this.hasAllComponentsForItem(item, ownedCounts)) return;
      const tierBucket = craftableByTier.get(item.tier) ?? [];
      tierBucket.push(item);
      craftableByTier.set(item.tier, tierBucket);
    });

    const guaranteed = [];
    tierOrder.forEach((tier) => {
      if (guaranteed.length >= SHOP_ITEM_COUNT) return;
      const bucket = craftableByTier.get(tier);
      if (!bucket?.length) return;
      const allowance = Math.min(
        maxPerTier[tier] ?? 0,
        SHOP_ITEM_COUNT - guaranteed.length,
        bucket.length,
      );
      if (allowance <= 0) return;
      const picks = randomSample(bucket, allowance, shopRandom);
      picks.forEach((item) => guaranteed.push(item.id));
    });

    return guaranteed;
  }

  getComponentMatchInfo(item, ownedCounts) {
    const total = Array.isArray(item?.buildsFrom) ? item.buildsFrom.length : 0;
    if (total === 0) return { matched: 0, total: 0, complete: false };
    const needs = new Map();
    item.buildsFrom.forEach((componentId) => {
      needs.set(componentId, (needs.get(componentId) ?? 0) + 1);
    });
    let matched = 0;
    let complete = true;
    needs.forEach((requiredAmount, componentId) => {
      const available = ownedCounts.get(componentId) ?? 0;
      matched += Math.min(available, requiredAmount);
      if (available < requiredAmount) complete = false;
    });
    return { matched, total, complete };
  }

  getWeightedCandidatesForTier(tier, ownedBasics, ownedMid, ownedCounts, usedIds) {
    const candidateIds = this.getCandidatesForTier(tier, ownedBasics, ownedMid);
    const candidates = [];
    candidateIds.forEach((id) => {
      if (usedIds.has(id)) return;
      const item = this.getEquipmentDefinition(id);
      if (!item) return;
      const info = this.getComponentMatchInfo(item, ownedCounts);
      if (info.total > 0 && info.complete) return;

      let baseWeight = 1;
      if (tier === ITEM_TIERS.MID) {
        if (info.matched > 0) baseWeight += info.matched * 0.25;
      } else if (tier === ITEM_TIERS.LEGENDARY) {
        if (info.matched > 0) baseWeight += info.matched * 0.4;
      }

      const randomBonus = shopRandom() * (tier === ITEM_TIERS.BASIC ? 0.5 : 0.9);
      const finalWeight = Math.max(0.1, baseWeight + randomBonus);
      candidates.push({
        id,
        weight: finalWeight,
        preferred: info.matched > 0,
      });
    });
    return candidates;
  }

  pickWeightedCandidate(candidates) {
    if (!Array.isArray(candidates) || candidates.length === 0) return null;
    const totalWeight = candidates.reduce((sum, entry) => sum + entry.weight, 0);
    if (totalWeight <= 0) return null;
    let roll = shopRandom() * totalWeight;
    for (const entry of candidates) {
      roll -= entry.weight;
      if (roll <= 0) return entry.id;
    }
    return candidates[candidates.length - 1].id;
  }

  getBuildsIntoNames(item, targetTier) {
    if (!item) return [];
    const result = [];
    (item.buildsInto ?? []).forEach((id) => {
      const def = this.getEquipmentDefinition(id);
      if (!def) return;
      if (targetTier && def.tier !== targetTier) return;
      const name = EQUIPMENT_NAME_CACHE[id] || def.name || id;
      if (typeof name === "string") result.push(name);
    });
    return result;
  }

  renderShop() {
    if (!this.shopUi?.items) return;
    this.clearShopDynamicHandlers();
    this.shopUi.items.innerHTML = "";
    this.shopState.offers.forEach((offer, index) => {
      const data = this.evaluateShopOffer(offer);
      if (!data) return;
      const card = this.createShopOfferElement(data, index);
      this.shopUi.items.appendChild(card);
    });
  }



  createShopOfferElement(offerData, index) {
    const card = document.createElement("div");
    card.className = "shop-item-card";

    const header = document.createElement("div");
    header.className = "shop-item-header";

    const icon = document.createElement("img");
    icon.className = "shop-item-icon";
    icon.src = offerData.item.icon;
    icon.alt = offerData.item.name;
    header.appendChild(icon);

    const name = document.createElement("div");
    name.className = "shop-item-name";
    name.textContent = offerData.item.name;
    header.appendChild(name);

    card.appendChild(header);

    const cost = document.createElement("div");
    cost.className = "shop-item-cost";
    cost.textContent = `价格：${offerData.price} 金币`;
    card.appendChild(cost);

    if (!offerData.item.isShard) {
      // 装备（兼容旧逻辑，不再使用）
      const itemTier = offerData.item.tier;
      if (itemTier !== ITEM_TIERS.BASIC) {
        const recipe = document.createElement("div");
        recipe.className = "shop-item-recipe";
        if (offerData.item.buildsFrom.length > 0) {
          const parts = offerData.item.buildsFrom.map((id) => EQUIPMENT_NAME_CACHE[id] || id);
          recipe.textContent = `配方：${parts.join(" + ")}`;
        } else {
          recipe.textContent = "配方：—";
        }
        card.appendChild(recipe);
      }

      if (offerData.componentsOwned.length > 0) {
        const consume = document.createElement("div");
        consume.className = "shop-item-consume";
        const names = offerData.componentsOwned.map(({ id }) => EQUIPMENT_NAME_CACHE[id] || id);
        consume.textContent = `消耗：${names.join("、")}`;
        card.appendChild(consume);
      }

      if (offerData.missingComponents.length > 0) {
        const missing = document.createElement("div");
        missing.className = "shop-item-missing";
        const names = offerData.missingComponents.map((id) => EQUIPMENT_NAME_CACHE[id] || id);
        missing.textContent = `额外购买：${names.join("、")}`;
        card.appendChild(missing);
      }

      let upgrades = [];
      if (itemTier === ITEM_TIERS.BASIC) upgrades = this.getBuildsIntoNames(offerData.item, ITEM_TIERS.MID);
      else if (itemTier === ITEM_TIERS.MID) upgrades = this.getBuildsIntoNames(offerData.item, ITEM_TIERS.LEGENDARY);
      if (upgrades.length > 0) {
        const upgradeEl = document.createElement("div");
        upgradeEl.className = "shop-item-upgrades";
        upgradeEl.textContent = `可合成：${upgrades.join("、")}`;
        card.appendChild(upgradeEl);
      }
    }

    if (offerData.item.description?.length) {
      const detail = document.createElement("div");
      detail.className = "shop-item-description";
      offerData.item.description.forEach((line) => {
        const entry = document.createElement("div");
        entry.textContent = line;
        detail.appendChild(entry);
      });
      card.appendChild(detail);
    }

    const actionRow = document.createElement("div");
    actionRow.className = "shop-item-actions";
    const buyBtn = document.createElement("button");
    buyBtn.className = "shop-button";
    buyBtn.textContent = `购买 (${offerData.price} 金币)`;
    buyBtn.disabled = !offerData.ready;
    if (!offerData.canAfford) buyBtn.title = SHOP_TEXT.notEnoughGold;
    else if (!offerData.hasSpace) buyBtn.title = SHOP_TEXT.inventoryFull;
    this.registerShopDynamicHandler(buyBtn, "click", () => this.handleShopPurchase(index));
    actionRow.appendChild(buyBtn);
    card.appendChild(actionRow);

    if (offerData.statusMessage) {
      const status = document.createElement("div");
      status.className = "shop-item-status";
      status.textContent = offerData.statusMessage;
      card.appendChild(status);
    }

    return card;
  }
  evaluateShopOffer(offer) {
    // 碎片商品：直接基于碎片定义生成卡片数据
    if (offer?.type === "shard") {
      const item = SHARD_BY_ID[offer.id];
      if (!item) return null;
      const price = Math.max(0, item.cost | 0);
      const canAfford = this.playerPoints >= price;
      const hasSpace = true; // 不占装备栏
      const statusMessage = canAfford ? "" : SHOP_TEXT.notEnoughGold;
      return {
        ...offer,
        item,
        price,
        componentsOwned: [],
        missingComponents: [],
        targetSlot: -1,
        freeSlotsAfterConsume: 99,
        canAfford,
        hasSpace,
        ready: canAfford && hasSpace,
        statusMessage,
      };
    }

    // 旧：装备商品（目前不会再生成）
    const item = this.getEquipmentDefinition(offer?.id);
    if (!item) return null;
    const { matches, missing } = this.matchComponentsForItem(item);
    const ownedCost = matches.reduce(
      (sum, entry) => sum + (EQUIPMENT_COST_CACHE[entry.id] ?? 0),
      0,
    );
    const price = Math.max(0, item.cost - ownedCost);
    const emptySlots = [];
    for (let i = 0; i < this.playerEquipmentSlots.length; i += 1) {
      if (this.playerEquipmentSlots[i] == null) emptySlots.push(i);
    }
    const freeSlotsAfterConsume = emptySlots.length + matches.length;
    const targetSlot = matches.length > 0
      ? Math.min(...matches.map((entry) => entry.slotIndex))
      : (emptySlots[0] ?? -1);
    const canAfford = this.playerPoints >= price;
    let hasSpace = freeSlotsAfterConsume > 0;
    let statusMessage = "";

    // 特殊规则：消耗品
    if (item.id === HEALTH_POTION_ID) {
      // 已拥有则不占新格子；达到上限则不可购买
      if (this.hasItemEquipped(HEALTH_POTION_ID)) {
        hasSpace = true;
      }
      const count = Math.max(0, Math.floor(this.healthPotionCount || 0));
      if (count >= 100) {
        hasSpace = false; // 禁止购买（达到上限）
        statusMessage = "生命药水已达上限";
      }
    } else if (item.id === REFILLABLE_POTION_ID) {
      // 复用性药水不可叠加购买
      if (this.hasItemEquipped(REFILLABLE_POTION_ID)) {
        hasSpace = false;
        statusMessage = "已拥有该物品";
      }
    }

    if (!canAfford && !statusMessage) statusMessage = SHOP_TEXT.notEnoughGold;
    else if (!hasSpace && !statusMessage) statusMessage = SHOP_TEXT.inventoryFull;

    return {
      ...offer,
      item,
      price,
      componentsOwned: matches,
      missingComponents: missing,
      targetSlot,
      freeSlotsAfterConsume,
      canAfford,
      hasSpace,
      ready: canAfford && hasSpace,
      statusMessage,
    };
  }

  handleShopPurchase(index) {
    if (!this.shopState?.offers?.[index]) {
      this.setShopMessage(SHOP_TEXT.offerUnavailable);
      return;
    }
    const offerData = this.evaluateShopOffer(this.shopState.offers[index]);
    if (!offerData) {
      this.setShopMessage(SHOP_TEXT.offerUnavailable);
      return;
    }
    if (!offerData.ready) {
      this.setShopMessage(offerData.statusMessage || SHOP_TEXT.offerUnavailable);
      this.renderShop();
      return;
    }
    const success = this.applyShopPurchase(offerData);
    this.updateHUD();
    this.updateShopGoldLabel();
    if (!success) {
      this.renderShop();
      this.setShopMessage(SHOP_TEXT.inventoryFull);
      return;
    }
    this.generateShopOffers();
    this.renderShop();
    this.setShopMessage(`${SHOP_TEXT.offerPurchased} ${offerData.item.name}`);
    this.updateShardProgressHeader();
  }

  applyShopPurchase(offerData) {
    this.playerPoints = Math.max(0, this.playerPoints - offerData.price);

    // —— 碎片购买：直接应用到面板，无需占用装备栏 —— //
    if (offerData?.item?.isShard) {
      this.applyShardPurchase(offerData.item);
      this.recalculateEquipmentEffects();
      this.updateHUD();
      this.updateResourceBars();
      return true;
    }

    const slotsToClear = [...offerData.componentsOwned].sort(
      (a, b) => b.slotIndex - a.slotIndex,
    );
    slotsToClear.forEach(({ slotIndex }) => {
      if (slotIndex >= 0 && slotIndex < this.playerEquipmentSlots.length) {
        this.playerEquipmentSlots[slotIndex] = null;
      }
    });

    // 消耗品特殊处理
    if (offerData.item.id === HEALTH_POTION_ID) {
      if (this.hasItemEquipped(HEALTH_POTION_ID)) {
        // 叠加数量（最多100）
        const before = Math.max(0, Math.floor(this.healthPotionCount || 0));
        this.healthPotionCount = Math.min(100, before + 1);
        this.refreshEquipmentUI();
        this.updateResourceBars();
        return true;
      }
      // 未拥有：需要空格子
      let targetSlot = offerData.targetSlot;
      if (targetSlot < 0 || targetSlot >= this.playerEquipmentSlots.length) {
        targetSlot = this.playerEquipmentSlots.findIndex((id) => id == null);
      }
      if (targetSlot < 0) {
        this.playerPoints += offerData.price;
        return false;
      }
      this.playerEquipmentSlots[targetSlot] = HEALTH_POTION_ID;
      this.healthPotionOwnerSlotIndex = targetSlot;
      this.healthPotionCount = Math.max(1, Math.floor(this.healthPotionCount || 1));
      this.refreshEquipmentUI();
      this.recalculateEquipmentEffects();
      const tooltipIndex = this.activeEquipmentTooltipIndex ?? null;
      this.refreshEquipmentTooltip(tooltipIndex);
      this.updateResourceBars();
      return true;
    }
    if (offerData.item.id === REFILLABLE_POTION_ID) {
      if (this.hasItemEquipped(REFILLABLE_POTION_ID)) {
        // 不可重复购买，回退金币
        this.playerPoints += offerData.price;
        return false;
      }
      let targetSlot = offerData.targetSlot;
      if (targetSlot < 0 || targetSlot >= this.playerEquipmentSlots.length) {
        targetSlot = this.playerEquipmentSlots.findIndex((id) => id == null);
      }
      if (targetSlot < 0) {
        this.playerPoints += offerData.price;
        return false;
      }
      this.playerEquipmentSlots[targetSlot] = REFILLABLE_POTION_ID;
      this.refillablePotionOwnerSlotIndex = targetSlot;
      this.refillablePotionCharges = this.refillablePotionMaxCharges || 5;
      this.refreshEquipmentUI();
      this.recalculateEquipmentEffects();
      const tooltipIndex = this.activeEquipmentTooltipIndex ?? null;
      this.refreshEquipmentTooltip(tooltipIndex);
      this.updateResourceBars();
      return true;
    }

    // 常规装备
    let targetSlot = offerData.targetSlot;
    if (targetSlot < 0 || targetSlot >= this.playerEquipmentSlots.length) {
      targetSlot = this.playerEquipmentSlots.findIndex((id) => id == null);
    }
    if (targetSlot < 0) {
      this.playerPoints += offerData.price;
      return false;
    }

    this.playerEquipmentSlots[targetSlot] = offerData.item.id;
    this.refreshEquipmentUI();
    this.recalculateEquipmentEffects();
    const tooltipIndex = this.activeEquipmentTooltipIndex ?? null;
    this.refreshEquipmentTooltip(tooltipIndex);
    this.updateResourceBars();
    return true;
  }

  // —— 碎片：应用购买效果并记录解锁进度 —— //
  applyShardPurchase(shardItem) {
    if (!shardItem?.effects) return;
    const eff = shardItem.effects;
    const b = (this.shardBonuses ||= {});
    // 平直
    if (eff.attackDamageFlat) b.attackDamageFlat = (b.attackDamageFlat || 0) + eff.attackDamageFlat;
    if (eff.attackSpeedPct) b.attackSpeedPct = (b.attackSpeedPct || 0) + eff.attackSpeedPct;
    if (eff.abilityPowerFlat) b.abilityPowerFlat = (b.abilityPowerFlat || 0) + eff.abilityPowerFlat;
    if (eff.armorFlat) b.armorFlat = (b.armorFlat || 0) + eff.armorFlat;
    if (eff.defenseFlat) b.defenseFlat = (b.defenseFlat || 0) + eff.defenseFlat;
    if (eff.maxHpFlat) b.maxHpFlat = (b.maxHpFlat || 0) + eff.maxHpFlat;
    if (eff.maxManaFlat) b.maxManaFlat = (b.maxManaFlat || 0) + eff.maxManaFlat;
    if (eff.critChancePct) b.critChancePct = (b.critChancePct || 0) + eff.critChancePct;
    if (eff.critDamageBonusPct) b.critDamageBonusPct = (b.critDamageBonusPct || 0) + eff.critDamageBonusPct;
    if (eff.moveSpeedFlat) b.moveSpeedFlat = (b.moveSpeedFlat || 0) + eff.moveSpeedFlat;
    if (eff.moveSpeedPct) b.moveSpeedPct = (b.moveSpeedPct || 0) + eff.moveSpeedPct;
    if (eff.abilityHaste) b.abilityHaste = (b.abilityHaste || 0) + eff.abilityHaste;
    if (eff.armorPenFlat) b.armorPenFlat = (b.armorPenFlat || 0) + eff.armorPenFlat;
    if (eff.hpRegenPerSecond) b.hpRegenPerSecond = (b.hpRegenPerSecond || 0) + eff.hpRegenPerSecond;
    // 乘区
    if (eff.attackDamagePct) b.attackDamagePct = (b.attackDamagePct || 0) + eff.attackDamagePct;
    if (eff.abilityPowerPct) b.abilityPowerPct = (b.abilityPowerPct || 0) + eff.abilityPowerPct;
    if (eff.armorPct) b.armorPct = (b.armorPct || 0) + eff.armorPct;
    if (eff.maxHpPct) b.maxHpPct = (b.maxHpPct || 0) + eff.maxHpPct;
    if (eff.maxManaPct) b.maxManaPct = (b.maxManaPct || 0) + eff.maxManaPct;
    if (eff.armorPenPct) b.armorPenPct = (b.armorPenPct || 0) + eff.armorPenPct;
    if (eff.onHitPhysicalFlat) b.onHitPhysicalFlat = (b.onHitPhysicalFlat || 0) + eff.onHitPhysicalFlat;
    if (eff.onHitAdRatio) b.onHitAdRatio = (b.onHitAdRatio || 0) + eff.onHitAdRatio;

    // 记录购买次数以解锁更高稀有度
    const r = shardItem.rarity || SHARD_RARITIES.BASIC;
    if (!this.shardState) this.shardState = { purchases: { basic: 0, mid: 0, epic: 0, legendary: 0 } };
    if (!this.shardState.purchases) this.shardState.purchases = { basic: 0, mid: 0, epic: 0, legendary: 0 };
    if (r === SHARD_RARITIES.BASIC) this.shardState.purchases.basic = (this.shardState.purchases.basic || 0) + 1;
    else if (r === SHARD_RARITIES.MID) this.shardState.purchases.mid = (this.shardState.purchases.mid || 0) + 1;
    else if (r === SHARD_RARITIES.EPIC) this.shardState.purchases.epic = (this.shardState.purchases.epic || 0) + 1;
    else if (r === SHARD_RARITIES.LEGENDARY) this.shardState.purchases.legendary = (this.shardState.purchases.legendary || 0) + 1;
  }

  matchComponentsForItem(item) {
    const matches = [];
    const missing = [];
    if (!item?.buildsFrom?.length) return { matches, missing };

    const usedSlots = new Set();
    item.buildsFrom.forEach((componentId) => {
      let foundIndex = -1;
      for (let i = 0; i < this.playerEquipmentSlots.length; i += 1) {
        if (usedSlots.has(i)) continue;
        if (this.playerEquipmentSlots[i] === componentId) {
          foundIndex = i;
          break;
        }
      }
      if (foundIndex !== -1) {
        usedSlots.add(foundIndex);
        matches.push({ slotIndex: foundIndex, id: componentId });
      } else {
        missing.push(componentId);
      }
    });
    return { matches, missing };
  }

  getOwnedItemIds() {
    return this.playerEquipmentSlots.filter((id) => typeof id === "string");
  }

  getOwnedItemsByTier(tier) {
    if (!tier) return [];
    return this.getOwnedItemIds().filter((id) => this.getEquipmentDefinition(id)?.tier === tier);
  }

  positionPreviewUnderSlot(slotIndex) {
    const ui = this.equipmentUi;
    if (!ui || !ui.previewElement || !ui.previewImage) return;
    if (!Number.isInteger(slotIndex) || slotIndex < 0 || !ui.slots?.[slotIndex]) return;

    const slotEl = ui.slots[slotIndex].element;
    const rect = slotEl.getBoundingClientRect();
    const previewEl = ui.previewElement;

    previewEl.style.position = "fixed";
    previewEl.style.left = `${Math.round(rect.left)}px`;
    previewEl.style.top = `${Math.round(rect.bottom + 4)}px`;
    previewEl.style.width = `${Math.round(rect.width)}px`;
    previewEl.style.height = `${Math.round(rect.height)}px`;
    previewEl.style.zIndex = "1000";
    previewEl.style.pointerEvents = "none";

    previewEl.style.background = "transparent";
    previewEl.style.backgroundImage = "none";

    ui.previewImage.style.width = "100%";
    ui.previewImage.style.height = "100%";
  }

  bindPreviewRepositionEvents() {
    this.previewRepositionHandler = () => {
      if (Number.isInteger(this.previewSlotIndex)) {
        this.positionPreviewUnderSlot(this.previewSlotIndex);
      }
    };
    window.addEventListener("resize", this.previewRepositionHandler);
    window.addEventListener("scroll", this.previewRepositionHandler, true);
  }

  unbindPreviewRepositionEvents() {
    if (this.previewRepositionHandler) {
      window.removeEventListener("resize", this.previewRepositionHandler);
      window.removeEventListener("scroll", this.previewRepositionHandler, true);
      this.previewRepositionHandler = null;
    }
  }

  /* ==== Boss 相关：生成与UI ==== */
  spawnBoss(cfg) {
    const boss = this.enemies.create(WORLD_SIZE / 2, WORLD_SIZE / 2, cfg.textureKey);
    boss.setDepth(9);
    boss.body.setAllowGravity(false);

    const frame = boss.frame;
    const fw = frame?.width ?? boss.width ?? TILE_SIZE;
    const fh = frame?.height ?? boss.height ?? TILE_SIZE;
    const maxDim = Math.max(fw, fh);
    const target = TILE_SIZE * (cfg.tiles || 4);
    const scale = target / Math.max(1, maxDim);
    boss.setScale(scale);
    boss.body.setSize(Math.max(8, fw * scale * 0.9), Math.max(8, fh * scale * 0.9), true);

    boss.isBoss = true;
    boss.maxHp = cfg.maxHp;
    boss.hp = cfg.maxHp;
    boss.armor = cfg.armor;
    boss.def = 0;
    boss.state = "idle";
    boss.attackCooldownUntil = this.time.now + 1000;

    this.boss = boss;
  }

  /* ==== 新增：通用 Boss 生成（通过ID） ==== */
  spawnBossById(id, positionOpt) {
    const cfg = BOSS_REGISTRY[id];
    if (!cfg) return;

    if (id === "Utsuho") {
      // 位置：默认中上方，可覆写
      const px = positionOpt?.x ?? (WORLD_SIZE / 2);
      const py = positionOpt?.y ?? Math.floor(WORLD_SIZE * 0.25);

      const boss = this.enemies.create(px, py, BOSS_UTSUHO_CONFIG.textureIdle);
      boss.setDepth(9);
      boss.body.setAllowGravity(false);
      boss.setCollideWorldBounds(true);

      // 缩放到4格
      const frame = boss.frame;
      const fw = frame?.width ?? boss.width ?? TILE_SIZE;
      const fh = frame?.height ?? boss.height ?? TILE_SIZE;
      const maxDim = Math.max(fw, fh);
      const target = TILE_SIZE * (BOSS_UTSUHO_CONFIG.tiles || 4);
      const scale = target / Math.max(1, maxDim);
      boss.setScale(scale);
      boss.body.setSize(Math.max(8, fw * scale * 0.9), Math.max(8, fh * scale * 0.9), true);

      // 标记
      boss.isBoss = true;
      boss.bossKind = "Utsuho";
      boss.maxHp = BOSS_UTSUHO_CONFIG.maxHp;
      boss.hp = BOSS_UTSUHO_CONFIG.maxHp;
      boss.armor = BOSS_UTSUHO_CONFIG.armor;
      boss.def = 0;
      boss.contactDamage = BOSS_UTSUHO_CONFIG.contactDamage;
      boss.state = "idle";
      boss.setDataEnabled();
      boss.setData("hp", boss.hp);
      boss.setData("maxHp", boss.maxHp);
      // Utsuho AI 初始化
      this.initUtsuhoAI(boss);

      this.boss = boss;
      this.bossKind = "Utsuho";
      this.createBossUI(BOSS_UTSUHO_CONFIG.name, BOSS_UTSUHO_CONFIG.title);

      // 按当前关卡与rank进行Boss属性倍率（非Boss关生成时才在此处处理）
      if (!this.isBossStage) {
        const cycles = Math.max(1, Math.floor((this.level || 1) / 20));
        let hpFactor = Math.pow(2, Math.max(0, cycles - 1));
        if (Math.floor(this.level || 0) > 10) {
          const rf = Math.max(0, Number.isFinite(this.rank) ? this.rank : 0) / 10;
          if (rf > 0) hpFactor *= (1 + rf);
        }
        if (hpFactor > 0) {
          const baseMaxHp = BOSS_UTSUHO_CONFIG.maxHp;
          boss.maxHp = Math.max(1, Math.round(baseMaxHp * hpFactor));
          boss.hp = boss.maxHp;
          boss.setData("hp", boss.hp);
          boss.setData("maxHp", boss.maxHp);
        }
        // 第十关后：Boss接触伤害也乘以 (1 + rank/10)
        if (Math.floor(this.level || 0) > 10) {
          const rf = Math.max(0, Number.isFinite(this.rank) ? this.rank : 0) / 10;
          const factor = 1 + rf;
          boss.contactDamage = Math.max(0, Math.round(boss.contactDamage * factor));
        }
      }
      // 新增：显示固定标题
      this.showBossHeader(BOSS_UTSUHO_CONFIG.name, BOSS_UTSUHO_CONFIG.title);

      return;
    }

    // 其他Boss（如Dummy）仍可调用
    this.spawnBoss(cfg);
    this.createBossUI(cfg.name, cfg.title);
  }

createBossUI(name, title) {
  this.clearBossUI();

  const barW = 80;   // 条宽
  const barH = 8;    // 条高
  const depth = (this.boss?.depth || 9) + 1;

  // 用 Graphics 而不是 Rectangle/Container
  const gfx = this.add.graphics().setDepth(depth);

  // 名字文本（放在血条上方）"
  const nameText = this.add.text(0, 0, name || "", {
    fontFamily: '"Zpix", monospace',
    fontSize: "10px",
    color: "#ffffff",
    align: "center",
  }).setOrigin(0.5).setDepth(depth);

  this.bossUi = {
    gfx,
    nameText,
    barW,
    barH,
  };

  // 首次绘制
  this.updateBossUI(this.boss);
}



  drawBossBar(ratio) {
    const { gfx, barX, barY, barW, barH } = this.bossUi;
    if (!gfx) return;
    const clamped = Phaser.Math.Clamp(ratio, 0, 1);

    gfx.clear();
    gfx.lineStyle(2, 0x000000, 1);
    gfx.strokeRect(barX - barW / 2, barY - barH / 2, barW, barH);

    const innerX = barX - barW / 2 + 1;
    const innerY = barY - barH / 2 + 1;
    const innerW = Math.max(0, Math.floor((barW - 2) * clamped));
    const innerH = barH - 2;

    gfx.fillStyle(0xff3333, 1);
    gfx.fillRect(innerX, innerY, innerW, barH - 2);
  }

updateBossUI(target) {
  if (!target || !target.isBoss || !this.bossUi?.gfx) return;

  const { gfx, barW, barH, nameText } = this.bossUi;
  const ratio = Phaser.Math.Clamp(target.hp / Math.max(1, target.maxHp), 0, 1);

  // 计算世界坐标下的显示位置（Boss 头顶）
  const offsetY = (target.displayHeight || 32) * 0.6 + 12;
  const x = target.x - barW / 2;
  const y = target.y - offsetY - barH / 2;

  // 重画
  gfx.clear();
  // 背板
  gfx.fillStyle(0x000000, 0.6);
  gfx.fillRect(x, y, barW, barH);
  // 边框（细线，-0.5 让像素对齐更锐利）
  gfx.lineStyle(1, 0x000000, 1);
  gfx.strokeRect(x - 0.5, y - 0.5, barW + 1, barH + 1);
  // 血量填充
  const innerW = Math.max(0, Math.floor((barW - 2) * ratio));
  gfx.fillStyle(0xff3333, 1);
  gfx.fillRect(x + 1, y + 1, innerW, barH - 2);

  // 名字
  if (nameText) {
    nameText.setPosition(target.x, y - 10);
  }
}




  getBossElapsed() {
    return this.boss?.ai?.elapsed ?? 0;
  }

  clearBossUI() {
    if (this.bossUi?.gfx) { this.bossUi.gfx.destroy(); this.bossUi.gfx = null; }
    if (this.bossUi?.nameText) { this.bossUi.nameText.destroy(); this.bossUi.nameText = null; }
    if (this.bossUi?.titleText) { this.bossUi.titleText.destroy(); this.bossUi.titleText = null; }
    if (this.bossUi?.container) { this.bossUi.container.destroy(); this.bossUi.container = null; }
    this.clearBossHeader();
    }

  /* ==== Utsuho 专属：工具函数 ==== */
  tilesToPx(tiles) { return tiles * TILE_SIZE; }
  setSpriteCircleHit(sprite, judgeTiles) {
    if (!sprite || !sprite.body) return;
    const diameterTiles = Number.isFinite(judgeTiles) ? judgeTiles : 0;
    const radiusPx = Math.max(0, (diameterTiles * TILE_SIZE) / 2);
    sprite.hitRadius = radiusPx;
    const frameW = sprite.displayWidth || sprite.width || TILE_SIZE;
    const frameH = sprite.displayHeight || sprite.height || TILE_SIZE;
    const offsetX = frameW / 2 - radiusPx;
    const offsetY = frameH / 2 - radiusPx;
    if (radiusPx > 0 && typeof sprite.body.setCircle === "function") {
      sprite.body.setCircle(radiusPx, offsetX, offsetY);
    } else if (sprite.body.setSize) {
      sprite.body.setSize(frameW, frameH);
      if (sprite.body.setOffset) sprite.body.setOffset(0, 0);
    }
  }
  setDisplaySizeByTiles(sprite, sizeTiles) {
    const px = this.tilesToPx(sizeTiles || 1);
    sprite.setDisplaySize(px, px);
  }

  // 等比例缩放：以宽度（tilesWide）为基准，不压缩纵横比
  setDisplayWidthByTilesKeepAspect(sprite, tilesWide) {
    if (!sprite) return;
    const targetW = this.tilesToPx(tilesWide || 1);
    const frameW = sprite.width || sprite.displayWidth || TILE_SIZE;
    if (frameW <= 0) { sprite.setDisplaySize(targetW, targetW); return; }
    const scale = targetW / frameW;
    sprite.setScale(scale);
  }
  aimUnit(fromX, fromY, toX, toY) {
    const dx = toX - fromX, dy = toY - fromY;
    const len = Math.hypot(dx, dy) || 1;
    return { ux: dx/len, uy: dy/len, angle: Math.atan2(dy, dx) };
  }

  /* ==== Utsuho：初始化AI与状态机 ==== */
  initUtsuhoAI(boss) {
    boss.ai = {
      elapsed: 0,
      mode: 1,
      modeEndsAt: BOSS_UTSUHO_CONFIG.modeDurations.m1,
      state: "seek", // seek | charge | dash1 | dash2 | m2_charge | m2_fire | m3_charge | m3_fire | m4_charge | m4_dash
      // 通用
      nextThink: 0,
      // Mode1 / Mode4 冲刺
      chargeEndsAt: 0,
      dashTarget: null,
      dashSpeed: 0,
      dashDir: { ux: 1, uy: 0 },
      dashLastMarkPos: { x: boss.x, y: boss.y },
      // Mode2
      m2_loopUntil: 0,
      m2_nextRingAt: 0,
      m2_phaseDegFixed: Phaser.Math.Between(0, 359),
      m2_ringEndsAt: 0, // 本次五秒窗口结束
      // Mode3
      m3_loopUntil: 0,
      m3_nextNukeAt: 0,
      m3_nextBlueAt: 0,
      m3_phaseNuke: 0,
      m3_phaseBlue: Phaser.Math.Between(0, 359),
    };
    boss.body.setVelocity(0, 0);
  }

  /* ==== Utsuho：AI 更新 ==== */
  updateUtsuhoAI(delta) {
    const boss = this.boss;
    if (!boss || !boss.active) return;
    const ai = boss.ai;
    ai.elapsed = (ai.elapsed ?? 0) + delta;
    const now = ai.elapsed;

    // 模式切换
    if (now >= ai.modeEndsAt) {
      this.advanceUtsuhoMode();
      return;
    }

    // 根据模式分派
    switch (ai.mode) {
      case 1: this.updateUtsuhoMode1(delta); break;
      case 2: this.updateUtsuhoMode2(delta); break;
      case 3: this.updateUtsuhoMode3(delta); break;
      case 4: this.updateUtsuhoMode4(delta); break;
      default: this.updateUtsuhoMode1(delta); break;
    }
  }

  advanceUtsuhoMode() {
    const boss = this.boss;
    if (!boss || !boss.active) return;
    const ai = boss.ai;
    const now = this.getBossElapsed();

    // 清除所有Boss弹幕
    this.clearBossBullets();
    boss.body.setVelocity(0, 0);

    if (ai.mode === 1) {
      ai.mode = 2;
      ai.modeEndsAt = now + BOSS_UTSUHO_CONFIG.modeDurations.m2;
      ai.state = "m2_charge";
      ai.m2_loopUntil = ai.modeEndsAt;
      ai.m2_phaseDegFixed = Phaser.Math.Between(0, 359);
      ai.m2_ringEndsAt = 0;
      this.startWarningCharge(3 * 1000); // 3秒蓄力
      return;
    }
    if (ai.mode === 2) {
      ai.mode = 3;
      ai.modeEndsAt = now + BOSS_UTSUHO_CONFIG.modeDurations.m3;
      ai.state = "m3_charge";
      ai.m3_loopUntil = ai.modeEndsAt;
      ai.m3_phaseNuke = 0;
      ai.m3_phaseBlue = Phaser.Math.Between(0, 359);
      this.startWarningCharge(3 * 1000);
      return;
    }
    if (ai.mode === 3) {
      ai.mode = 4;
      ai.modeEndsAt = now + BOSS_UTSUHO_CONFIG.modeDurations.m4;
      ai.state = "m4_charge";
      this.startCharge(1 * 1000); // Mode4 开场1s蓄力
      return;
    }
    if (ai.mode === 4) {
      ai.mode = 1;
      ai.modeEndsAt = now + BOSS_UTSUHO_CONFIG.modeDurations.m1;
      ai.state = "seek";
      return;
    }
  }

  /* ==== Utsuho：通用贴图朝向 ==== */
  setUtsuhoMoveTextureByVel() {
    const boss = this.boss;
    if (!boss) return;
    const vx = boss.body.velocity.x;
    const vy = boss.body.velocity.y;
    const spd = Math.hypot(vx, vy);
    if (spd < 1) {
      boss.setTexture(BOSS_UTSUHO_CONFIG.textureIdle);
      boss.setFlipX(false);
      return;
    }
    // 简单规则：纵向为主 -> movedown；否则 moveright/flipX
    if (Math.abs(vy) >= Math.abs(vx)) {
      boss.setTexture(BOSS_UTSUHO_CONFIG.textureMoveDown);
      boss.setFlipX(false);
    } else {
      boss.setTexture(BOSS_UTSUHO_CONFIG.textureMoveRight);
      boss.setFlipX(vx < 0);
    }
  }

  /* ==== Utsuho：蓄力提示（Mode2/3用的核警示框） ==== */
  startWarningCharge(ms) {
    const boss = this.boss;
    const ai = boss.ai;
    const now = this.getBossElapsed();
    ai.stateChargeUntil = now + ms;
    ai.state = ai.mode === 2 ? "m2_charge" : "m3_charge";
    // 提示框（在Boss下方，不遮挡Boss）
    if (boss.warningSprite) { boss.warningSprite.destroy(); boss.warningSprite = null; }
    const warn = this.add.image(boss.x, boss.y, "utsuho_warning").setDepth(boss.depth - 1);
    this.setDisplaySizeByTiles(warn, BOSS_UTSUHO_CONFIG.hitboxes.warningSize);
    warn.setAlpha(0.9);
    boss.warningSprite = warn;
  }
  startCharge(ms) {
    const boss = this.boss;
    const ai = boss.ai;
    const now = this.getBossElapsed();
    ai.stateChargeUntil = now + ms;
  }

  /* ==== Utsuho：Mode1（40秒）==== */
  updateUtsuhoMode1(delta) {
    const boss = this.boss;
    const ai = boss.ai;
    const now = this.getBossElapsed();

    const dist = Phaser.Math.Distance.Between(boss.x, boss.y, this.player.x, this.player.y);

    if (ai.state === "seek") {
      // 半径100外：向自机移动
      if (dist > 100) {
        this.physics.moveToObject(boss, this.player, BOSS_UTSUHO_CONFIG.moveSpeed);
        this.setUtsuhoMoveTextureByVel();
        return;
      }
      // 半径300内：开始蓄力 -> 冲刺1
      this.startCharge(3000);
      boss.body.setVelocity(0, 0);
      ai.chargeEndsAt = now + 1000;
      ai.dashTarget = { x: this.player.x, y: this.player.y }; // 记录当前自机坐标
      ai.state = "charge";
      return;
    }

    if (ai.state === "charge") {
      boss.body.setVelocity(0, 0);
      if (now >= ai.chargeEndsAt) {
        // 冲刺到墙或边界
        const dir = this.aimUnit(boss.x, boss.y, ai.dashTarget.x, ai.dashTarget.y);
        ai.dashDir = { ux: dir.ux, uy: dir.uy };
        ai.dashSpeed = BOSS_UTSUHO_CONFIG.dashInitSpeed;
        ai.state = "dash1";
        ai.dashLastMarkPos = { x: boss.x, y: boss.y };
      }
      return;
    }

    if (ai.state === "dash1" || ai.state === "dash2") {
      // 冲刺速度累增
      ai.dashSpeed += BOSS_UTSUHO_CONFIG.dashAccel * (delta/1000);
      boss.body.setVelocity(ai.dashDir.ux * ai.dashSpeed, ai.dashDir.uy * ai.dashSpeed);
      this.setUtsuhoMoveTextureByVel();
      // 残影：灰色，较低透明度，0.8s
      this.maybeEmitAfterimage(boss, 45, { alphaStart: 0.6, duration: 800, tint: 0x999999, depthOffset: -2 });
      // 每4格投放 nuclearspawn
      this.tryPlaceNuclearSpawnAlongDash(ai);
      // 碰到边缘或墙体？
      const blocked = boss.body.blocked;
      const hitEdge = blocked.left || blocked.right || blocked.up || blocked.down;
      if (ai.state === "dash1" && hitEdge) {
        boss.body.setVelocity(0, 0);
        // 记录当前自机坐标，冲刺到该点
        const t = { x: this.player.x, y: this.player.y };
        const dir2 = this.aimUnit(boss.x, boss.y, t.x, t.y);
        ai.dashDir = { ux: dir2.ux, uy: dir2.uy };
        ai.dashTarget = t;
        ai.dashSpeed = BOSS_UTSUHO_CONFIG.dashInitSpeed;
        ai.state = "dash2";
        ai.dashLastMarkPos = { x: boss.x, y: boss.y };
        return;
      }
      if (ai.state === "dash2") {
          const d2 = Phaser.Math.Distance.Between(boss.x, boss.y, ai.dashTarget.x, ai.dashTarget.y);
          // 新增：检测是否碰到边界
          const blocked = boss.body.blocked;
          const hitEdge = blocked.left || blocked.right || blocked.up || blocked.down;
          // 到达目标点 或 撞墙 都结束冲刺
          if (d2 <= 10 || hitEdge) {
              boss.body.setVelocity(0, 0);
              ai.state = "seek";
          }
      }
      return;
    }
  }

  tryPlaceNuclearSpawnAlongDash(ai) {
      const boss = this.boss;
      const last = ai.dashLastMarkPos || { x: boss.x, y: boss.y };
      const step = this.tilesToPx(4); // 每4格
      const dist = Phaser.Math.Distance.Between(boss.x, boss.y, last.x, last.y);
      if (dist < step) return;

      // 生成 nuclearspawn 贴图（方向与冲刺方向一致）
      const s = this.add.image(boss.x, boss.y, "u_bullet_nuclearspawn").setDepth(boss.depth - 1);
      this.setDisplaySizeByTiles(s, BOSS_UTSUHO_CONFIG.hitboxes.bullets.nuclearspawn.size);
      s.setRotation(Math.atan2(ai.dashDir.uy, ai.dashDir.ux));
      s.setAlpha(1);

      // 1秒后淡出，并在当前位置生成20个核危害粒子
      this.time.delayedCall(1000, () => {
          this.tweens.add({
              targets: s, 
              alpha: 0, 
              duration: 400, 
              onComplete: () => {
                  // 生成20个 nuclearhazard：速度10，方向随机，带粒子特效
                  const count = 20;
                  const spawnX = s.x;  // 使用消失时的位置
                  const spawnY = s.y;
                  for (let i = 0; i < count; i += 1) {
                      const offR = this.tilesToPx(2); // 四格内：±2格随机
                      const rx = Phaser.Math.FloatBetween(-offR, offR);
                      const ry = Phaser.Math.FloatBetween(-offR, offR);
                      const bx = spawnX + rx;
                      const by = spawnY + ry;
                      this.spawnBossBullet({
                          key: "u_bullet_nuclearhazard",
                          sizeTiles: BOSS_UTSUHO_CONFIG.hitboxes.bullets.nuclearhazard.size,
                          judgeTiles: BOSS_UTSUHO_CONFIG.hitboxes.bullets.nuclearhazard.judge,
                          from: { x: bx, y: by },
                          dirAngleDeg: Phaser.Math.Between(0, 359),
                          forwardSpeed: 10,
                          accel: 0,
                          sideSpeed: 0,
                      }, BOSS_UTSUHO_CONFIG.bulletMagicDamage, true);
                  }
                  s.destroy();
              }
          });
      });

      ai.dashLastMarkPos = { x: boss.x, y: boss.y };
      // 冲刺粒子
      this.emitDashParticles(boss.x, boss.y);
  }

  emitDashParticles(x, y) {
    const p = this.add.image(x, y, "dash_particle").setDepth(7).setAlpha(0.9);
    this.tweens.add({ targets: p, alpha: 0, scale: 0.2, duration: 240, onComplete: () => p.destroy() });
  }

  // ===== 残影效果（用于冲刺/急速移动）=====
  // 立即在给定实体位置生成一帧“残影”（会缓慢淡出）
  emitAfterimage(sprite, opts = {}) {
    if (!sprite || !sprite.texture) return;
    const {
      alphaStart = 0.6,
      duration = 800,
      tint = 0x999999,        // 改为灰色，更低透明度
      depthOffset = -1,
      additive = true,
    } = opts;
    const ghost = this.add.image(sprite.x, sprite.y, sprite.texture.key);
    // 帧/尺寸/朝向与本体一致
    if (sprite.frame && sprite.frame.name != null && ghost.setFrame) ghost.setFrame(sprite.frame.name);
    if (sprite.displayWidth && sprite.displayHeight && ghost.setDisplaySize) ghost.setDisplaySize(sprite.displayWidth, sprite.displayHeight);
    if (ghost.setScale && (sprite.scaleX != null || sprite.scaleY != null)) ghost.setScale(sprite.scaleX ?? 1, sprite.scaleY ?? 1);
    if (ghost.setRotation) ghost.setRotation(sprite.rotation || 0);
    if (ghost.setFlip && (sprite.flipX || sprite.flipY)) ghost.setFlip(sprite.flipX || false, sprite.flipY || false);
    ghost.setDepth((sprite.depth ?? 5) + depthOffset);
    ghost.setAlpha(alphaStart);
    if (ghost.setTint && tint != null) ghost.setTint(tint);
    if (additive && ghost.setBlendMode) ghost.setBlendMode(Phaser.BlendModes.ADD);
    // 缓慢淡出后销毁
    this.tweens.add({ targets: ghost, alpha: 0, duration, onComplete: () => ghost.destroy() });
    return ghost;
  }

  // 在高速度移动期间以固定间隔生成残影
  maybeEmitAfterimage(sprite, intervalMs = 50, opts = {}) {
    if (!sprite || !sprite.active) return;
    const now = this.time.now;
    const nextKey = "_nextAfterimageTimeMs";
    if (!sprite[nextKey] || now >= sprite[nextKey]) {
      this.emitAfterimage(sprite, opts);
      sprite[nextKey] = now + Math.max(16, intervalMs);
    }
  }

  /* ==== Utsuho：Mode2（35秒）==== */
  updateUtsuhoMode2(_delta) {
    const boss = this.boss;
    const ai = boss.ai;
    const now = this.getBossElapsed();
    // 移动至地图中心
    if (ai.state === "m2_charge") {
      if (boss.warningSprite) {
        boss.warningSprite.setPosition(boss.x, boss.y);
      }
      // 保证先居中
      const centerX = WORLD_SIZE/2, centerY = WORLD_SIZE/2;
      const d = Phaser.Math.Distance.Between(boss.x, boss.y, centerX, centerY);
      if (d > 6) {
        this.physics.moveTo(boss, centerX, centerY, BOSS_UTSUHO_CONFIG.moveSpeed);
        this.setUtsuhoMoveTextureByVel();
      } else {
        boss.body.setVelocity(0,0);
      }
      // 等待3秒蓄力结束
      if (now >= ai.stateChargeUntil) {
        // 开火5秒：yellow 环状弹幕
        if (boss.warningSprite) { boss.warningSprite.destroy(); boss.warningSprite = null; }
        ai.state = "m2_fire";
        ai.m2_phaseDegFixed = Phaser.Math.Between(0, 359); // 本轮固定相位
        ai.m2_ringEndsAt = now + 5000; // 持续5秒
        ai.m2_nextRingAt = now; // 立刻开第一轮
      }
      return;
    }

    if (ai.state === "m2_fire") {
      boss.body.setVelocity(0, 0);
      // 发射窗内：每0.01s 放一圈 60 发
      if (now <= ai.m2_ringEndsAt) {
        if (now >= ai.m2_nextRingAt) {
          this.fireRing({
            key: "u_bullet_yellow",
            sizeTiles: BOSS_UTSUHO_CONFIG.hitboxes.bullets.yellow.size,
            // 判定范围缩小一半（仅 Mode2 的 yellow）
            judgeTiles: BOSS_UTSUHO_CONFIG.hitboxes.bullets.yellow.judge / 2,
            count: 60,
            phaseDeg: ai.m2_phaseDegFixed,
            forwardSpeed: 100,
            accel: 666,
            sideSpeed: 0,
          }, BOSS_UTSUHO_CONFIG.bulletMagicDamage);
          ai.m2_nextRingAt = now + 200; 
        }
      } else {
        // 重回3秒蓄力，直到模式时间到
        if (now + 3000 <= ai.m2_loopUntil) {
          ai.state = "m2_charge";
          this.startWarningCharge(3000);
        } else {
          // 模式即将结束：等待advanceUtsuhoMode切换
          boss.body.setVelocity(0, 0);
        }
      }
      return;
    }
  }

  /* ==== Utsuho：Mode3（70秒）==== */
  updateUtsuhoMode3(_delta) {
    const boss = this.boss;
    const ai = boss.ai;
    const now = this.getBossElapsed();
    if (ai.state === "m3_charge") {
      if (boss.warningSprite) boss.warningSprite.setPosition(boss.x, boss.y);
      // 居中
      const centerX = WORLD_SIZE/2, centerY = WORLD_SIZE/2;
      const d = Phaser.Math.Distance.Between(boss.x, boss.y, centerX, centerY);
      if (d > 6) {
        this.physics.moveTo(boss, centerX, centerY, BOSS_UTSUHO_CONFIG.moveSpeed);
        this.setUtsuhoMoveTextureByVel();
      } else { boss.body.setVelocity(0,0); }
      if (now >= ai.stateChargeUntil) {
        if (boss.warningSprite) { boss.warningSprite.destroy(); boss.warningSprite = null; }
        ai.state = "m3_fire";
        ai.m3_nextNukeAt = now;     // 3秒间隔核弹，立即第一轮
        ai.m3_nextBlueAt = now;     // 0.2秒间隔蓝弹
        ai.m3_phaseNuke = 0;
        // ai.m3_phaseBlue 保持并在每次生成内随机增量
      }
      return;
    }

  // 在 updateUtsuhoMode3 函数中修改:
  if (ai.state === "m3_fire") {
      boss.body.setVelocity(0, 0);
      if (now >= ai.m3_nextNukeAt) {
          // 修改：保证8个核弹均匀分布在360度上
          this.fireRing({
              key: "u_bullet_nuclearbomb",
              sizeTiles: BOSS_UTSUHO_CONFIG.hitboxes.bullets.nuclearbomb.size,
              judgeTiles: BOSS_UTSUHO_CONFIG.hitboxes.bullets.nuclearbomb.judge,
              count: 8,
              phaseDeg: ai.m3_phaseNuke,
              forwardSpeed: 20,
              accel: 10,
              // 每个核弹的侧向速度仍然保持交替
              sideSpeed:0,
              // 命中自机额外造成其生命上限50%的伤害
              percentMaxHpDamage: 0.5,
          }, BOSS_UTSUHO_CONFIG.bulletMagicDamage);
          
          // 每次旋转45度(360/8)，保证下一轮的核弹与这一轮错开
          ai.m3_phaseNuke = (ai.m3_phaseNuke + 22.5) % 360;
          ai.m3_nextNukeAt = now + 6000;
      }
      // 0.2秒一次：蓝弹环（3个），初始相位每次 += 随机(-10,+30)
      if (now >= ai.m3_nextBlueAt) {
        // 本次增量
        ai.m3_phaseBlue = (ai.m3_phaseBlue + Phaser.Math.Between(-0.5, 5)) % 360;
        this.fireRing({
          key: "u_bullet_blue",
          sizeTiles: BOSS_UTSUHO_CONFIG.hitboxes.bullets.blue.size,
          judgeTiles: BOSS_UTSUHO_CONFIG.hitboxes.bullets.blue.judge,
          count: 3,
          phaseDeg: ai.m3_phaseBlue,
          forwardSpeed: Phaser.Math.FloatBetween(10, 15),
          accel: 0,
          sideSpeed: 30,
        }, BOSS_UTSUHO_CONFIG.bulletMagicDamage);
        ai.m3_nextBlueAt = now + 200;
      }
      return;
    }
  }

  /* ==== Utsuho：Mode4（35秒）==== */
  updateUtsuhoMode4(delta) {
    const boss = this.boss;
    const ai = boss.ai;
    const now = this.getBossElapsed();

    if (ai.state === "m4_charge") {
      boss.body.setVelocity(0, 0);
      if (now >= ai.stateChargeUntil) {
        this.startCharge(3000); 
        // 冲刺到墙 -> 冲刺到记录点；与Mode1相同，但spawn淡出后额外放 bigyellow 环（持续1秒内，每0.2秒发2发，方向朝向自机）
        ai.dashTarget = { x: this.player.x, y: this.player.y };
        const dir = this.aimUnit(boss.x, boss.y, ai.dashTarget.x, ai.dashTarget.y);
        ai.dashDir = { ux: dir.ux, uy: dir.uy };
        ai.dashSpeed = BOSS_UTSUHO_CONFIG.dashInitSpeed;
        ai.state = "m4_dash1";
        ai.dashLastMarkPos = { x: boss.x, y: boss.y };

      }
      return;
    }

    if (ai.state === "m4_dash1" || ai.state === "m4_dash2") {
      ai.dashSpeed += BOSS_UTSUHO_CONFIG.dashAccel * (delta/1000);
      boss.body.setVelocity(ai.dashDir.ux * ai.dashSpeed, ai.dashDir.uy * ai.dashSpeed);
      this.setUtsuhoMoveTextureByVel();
      // 残影：灰色，较低透明度，0.8s
      this.maybeEmitAfterimage(boss, 45, { alphaStart: 0.6, duration: 800, tint: 0x999999, depthOffset: -2 });
      // 放置 spawn，并在其淡出时触发 bigyellow 短时环（1秒，0.2s间隔）
      this.tryPlaceNuclearSpawnAlongDash_Mode4(ai);
      // 碰边或达点
      const blocked = boss.body.blocked;
      const hitEdge = blocked.left || blocked.right || blocked.up || blocked.down;
      if (ai.state === "m4_dash1" && hitEdge) {
        boss.body.setVelocity(0, 0);
        const t = { x: this.player.x, y: this.player.y };
        const dir2 = this.aimUnit(boss.x, boss.y, t.x, t.y);
        ai.dashDir = { ux: dir2.ux, uy: dir2.uy };
        ai.dashTarget = t;
        ai.dashSpeed = BOSS_UTSUHO_CONFIG.dashInitSpeed;
        ai.state = "m4_dash2";
        ai.dashLastMarkPos = { x: boss.x, y: boss.y };
        return;
      }
        if (ai.state === "m4_dash2") {
            const d2 = Phaser.Math.Distance.Between(boss.x, boss.y, ai.dashTarget.x, ai.dashTarget.y);
            const blocked = boss.body.blocked;
            const hitEdge = blocked.left || blocked.right || blocked.up || blocked.down;
            if (d2 <= 10 || hitEdge) {
                boss.body.setVelocity(0, 0);
                // 关键修改：直接开始新的充能
                this.startCharge(1000);
                ai.state = "m4_charge";
            }
        }
      return;
    }

    // seek 与 Mode1 相同
    this.updateUtsuhoMode1(delta);
  }

  tryPlaceNuclearSpawnAlongDash_Mode4(ai) {
    const boss = this.boss;
    const last = ai.dashLastMarkPos || { x: boss.x, y: boss.y };
    const step = this.tilesToPx(4); // 每4格
    const dist = Phaser.Math.Distance.Between(boss.x, boss.y, last.x, last.y);
    if (dist < step) return;

    const s = this.add.image(boss.x, boss.y, "u_bullet_nuclearspawn").setDepth(boss.depth - 1);
    this.setDisplaySizeByTiles(s, BOSS_UTSUHO_CONFIG.hitboxes.bullets.nuclearspawn.size);
    s.setRotation(Math.atan2(ai.dashDir.uy, ai.dashDir.ux));
    s.setAlpha(1);

    // 1秒后淡出 + 生成 bigyellow 环（持续1秒；每0.2秒发一圈；相位=朝向自机角度；一圈2发）
    this.time.delayedCall(1000, () => {
      this.tweens.add({
        targets: s, alpha: 0, duration: 400, onComplete: () => s.destroy(),
      });
      const center = { x: s.x, y: s.y };
      const aim = this.aimUnit(center.x, center.y, this.player.x, this.player.y);
      const phase = Phaser.Math.RadToDeg(aim.angle);
      const endAt = this.time.now + 1000;
      const doRing = () => {
        if (this.time.now > endAt) return;
        this.fireRingAt(center.x, center.y, {
          key: "u_bullet_bigyellow",
          sizeTiles: BOSS_UTSUHO_CONFIG.hitboxes.bullets.bigyellow.size,
          judgeTiles: BOSS_UTSUHO_CONFIG.hitboxes.bullets.bigyellow.judge,
          count: 2,
          phaseDeg: phase,
          forwardSpeed: 100,
          accel: 100,
          sideSpeed: 0,
        }, BOSS_UTSUHO_CONFIG.bulletMagicDamage);
        this.time.delayedCall(200, doRing);
      };
      doRing();
      // 顺便生成 hazard 微粒（5个，速度100）
      const count = 2;
      for (let i = 0; i < count; i += 1) {
        const offR = this.tilesToPx(2);
        const rx = Phaser.Math.FloatBetween(-offR, offR);
        const ry = Phaser.Math.FloatBetween(-offR, offR);
        const bx = center.x + rx;
        const by = center.y + ry;
        this.spawnBossBullet({
          key: "u_bullet_nuclearhazard",
          sizeTiles: BOSS_UTSUHO_CONFIG.hitboxes.bullets.nuclearhazard.size,
          judgeTiles: BOSS_UTSUHO_CONFIG.hitboxes.bullets.nuclearhazard.judge,
          from: { x: bx, y: by },
          dirAngleDeg: Phaser.Math.Between(0, 359),
          forwardSpeed: 50,
          accel: 0,
          sideSpeed: 0,
        }, BOSS_UTSUHO_CONFIG.bulletMagicDamage, true);
      }
    });

    ai.dashLastMarkPos = { x: boss.x, y: boss.y };
    this.emitDashParticles(boss.x, boss.y);
  }

  /* ==== Utsuho：发弹工具 ==== */
  // 在Boss当前位置发环
  fireRing(params, magicDamage) {
    const boss = this.boss;
    this.fireRingAt(boss.x, boss.y, params, magicDamage);
  }
  // 在指定坐标发环；sideSpeed 可为常数或函数(angleDeg)->值
  fireRingAt(cx, cy, params, magicDamage) {
    const { key, sizeTiles, judgeTiles, count, phaseDeg, forwardSpeed, accel, sideSpeed, owner, percentMaxHpDamage } = params;
    for (let i = 0; i < count; i += 1) {
      const angDeg = (phaseDeg + i * (360 / count)) % 360;
      const side = (typeof sideSpeed === "function") ? sideSpeed(angDeg) : (sideSpeed || 0);
      this.spawnBossBullet({
        key,
        sizeTiles,
        judgeTiles,
        from: { x: cx, y: cy },
        dirAngleDeg: angDeg,
        forwardSpeed,
        accel,
        sideSpeed: side,
        owner,
        percentMaxHpDamage,
      }, magicDamage, true);
    }
  }
  spawnBossBullet(opts, magicDamage, withTrail = false) {
    const { key, sizeTiles, judgeTiles, from, dirAngleDeg, forwardSpeed, accel, sideSpeed, owner, percentMaxHpDamage } = opts;
    const b = this.physics.add.image(from.x, from.y, key).setDepth(8);
    b.setActive(true).setVisible(true);
    b.body.setAllowGravity(false);
    this.setDisplaySizeByTiles(b, sizeTiles);
    this.setSpriteCircleHit(b, judgeTiles);
    const rad = Phaser.Math.DegToRad(dirAngleDeg);
    b.ux = Math.cos(rad);
    b.uy = Math.sin(rad);
    b.forwardSpeed = forwardSpeed || 0;
    b.accel = accel || 0;
    b.sideSpeed = sideSpeed || 0;
    b.magicDamage = magicDamage || 0;
    if (Number.isFinite(percentMaxHpDamage) && percentMaxHpDamage > 0) {
      b.percentMaxHpDamage = percentMaxHpDamage;
    }
    // 第十关后：如果子弹来源为 Boss，则乘以 (1 + rank/10)
    if (opts?.owner?.isBoss && Math.floor(this.level || 0) > 10) {
      const rf = Math.max(0, Number.isFinite(this.rank) ? this.rank : 0) / 10;
      const factor = 1 + rf;
      if (factor > 0) b.magicDamage = Math.max(0, Math.round(b.magicDamage * factor));
    }
    if (owner) b.owner = owner;
    this.bossBullets.add(b);
    if (withTrail) {
      // 复用玩家子弹轨迹作为特效
      b.trailTimer = this.time.addEvent({ delay: 60, loop: true, callback: () => {
        if (!b.active) return;
        const t = this.add.image(b.x, b.y, "bullet_trail").setDepth(7).setBlendMode(Phaser.BlendModes.ADD);
        t.setScale(Phaser.Math.FloatBetween(0.2, 0.4)); t.setAlpha(0.6);
        this.tweens.add({ targets: t, alpha: 0, scale: 0, duration: 220, onComplete: () => t.destroy() });
      }});
    }
    return b;
  }

}

/* ==== Phaser 配置 ==== */
const config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: "game",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: { gravity: { y: 0 }, debug: false },
  },
  scene: [PreloadScene, StartScene, GameScene],
};

window.addEventListener("load", () => {
  new Phaser.Game(config); // eslint-disable-line no-new
});

// ==== Attach HTML Stats Overlay helpers to GameScene prototype ====
GameScene.prototype.showHtmlStatsOverlay = function(result = "fail") {
  try {
    const overlay = typeof document !== "undefined" ? document.getElementById("stats-overlay") : null;
    if (!overlay) return;
    const titleEl = overlay.querySelector("#stats-title");
    const restartBtn = overlay.querySelector("#stats-restart");
    const exitBtn = overlay.querySelector("#stats-exit");

    if (titleEl) {
      titleEl.classList.remove("win", "fail", "pause");
      if (result === "pause") { titleEl.textContent = "游戏暂停"; titleEl.classList.add("pause"); }
      else if (result === "win") { titleEl.textContent = "通关成功"; titleEl.classList.add("win"); }
      else { titleEl.textContent = "通关失败"; titleEl.classList.add("fail"); }
    }

    const dealtPhys = Math.max(0, Math.round(this.runStats?.dealtPhysical || 0));
    const dealtMagic = Math.max(0, Math.round(this.runStats?.dealtMagic || 0));
    const dealtTotal = dealtPhys + dealtMagic;
    const taken = Math.max(0, Math.round(this.runStats?.taken || 0));
    const heal = Math.max(0, Math.round(this.runStats?.heal || 0));
    const gold = Math.max(0, Math.round(this.playerPoints || 0));
    const maxVal = Math.max(1, dealtTotal, taken, gold, heal);

    const rows = overlay.querySelectorAll(".stats-row");
    rows.forEach((row) => {
      const key = row.getAttribute("data-key");
      const outer = row.querySelector(".stats-bar-outer");
      const valueEl = row.querySelector('[data-value]');
      if (!outer || !valueEl) return;
      let val = 0;
      if (key === "dealt") val = dealtTotal; else if (key === "taken") val = taken; else if (key === "gold") val = gold; else if (key === "heal") val = heal;
      const p = Math.max(0, Math.min(1, maxVal > 0 ? (val / maxVal) : 0));
      const lp = p * 100;
      outer.style.width = `${lp.toFixed(2)}%`;
      outer.style.borderWidth = (lp <= 0.01) ? "0" : "2px";

      if (key === "dealt") {
        const segPhys = row.querySelector('[data-seg="phys"]');
        const segMagic = row.querySelector('[data-seg="magic"]');
        const total = Math.max(1, dealtTotal);
        const partPhys = Math.max(0, Math.min(1, dealtPhys / total));
        const partMagic = Math.max(0, Math.min(1, dealtMagic / total));
        if (segPhys) { segPhys.style.left = `0%`; segPhys.style.width = `${(partPhys * 100).toFixed(2)}%`; }
        if (segMagic) { segMagic.style.left = `${(partPhys * 100).toFixed(2)}%`; segMagic.style.width = `${(partMagic * 100).toFixed(2)}%`; }
      } else {
        const single = row.querySelector('[data-fill]');
        if (single) { single.style.left = `0%`; single.style.width = `100%`; }
      }

      valueEl.textContent = `${val}`;
      valueEl.style.left = `100%`;
      valueEl.style.transform = "translate(6px, -50%)";
      valueEl.style.textAlign = "left";
    });

    const restart = () => { overlay.style.display = "none"; this.isGameOver = false; this.time.timeScale = 1; if (typeof window !== "undefined" && window.location) window.location.reload(); else this.scene.restart(); };
    const exit = () => { overlay.style.display = "none"; this.isGameOver = false; this.time.timeScale = 1; this.scene.start("StartScene"); };
    if (restartBtn) restartBtn.onclick = restart;
    if (exitBtn) exitBtn.onclick = exit;

    overlay.style.display = "block";
  } catch (_) {}
};

GameScene.prototype.hideHtmlStatsOverlay = function() {
  try {
    const overlay = typeof document !== "undefined" ? document.getElementById("stats-overlay") : null;
    if (overlay) overlay.style.display = "none";
  } catch (_) {}
};
