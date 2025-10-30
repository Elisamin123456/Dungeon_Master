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

const EQUIPMENT_SLOT_COUNT = 6;
const BROKEN_KINGS_BLADE_ID = "brokenKingsBlade";
const WITS_END_ID = "witsEnd";
const NASHORS_TOOTH_ID = "nashorsTooth";
const GUINSOOS_RAGEBLADE_ID = "guinsosRageblade";
const EQUIPMENT_TOOLTIP_DEFAULT = "查看鼠标移动到的位置";
const DEBUG_INITIAL_RANK = 100;
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
const SHOP_REFRESH_COST = 10;
const SHOP_DEBUG_START_GOLD = 100000;

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
  title: "装备商店",
  goldPrefix: "金币：",
  refresh: `刷新 (-${SHOP_REFRESH_COST})`,
  continueRun: "继续",
  exitRun: "结束探险",
  notEnoughGold: "金币不足。",
  inventoryFull: "装备栏已满。",
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

const randomElement = (array, rng = Math.random) => {
  if (!Array.isArray(array) || array.length === 0) return null;
  const index = Math.floor(rng() * array.length);
  return array[index];
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
const WEAPON_ORBIT_SPEED = 180; // deg/s
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
  [ENEMY_RARITIES.BASIC]: 0.6,
  [ENEMY_RARITIES.MID]: 0.15,
  [ENEMY_RARITIES.EPIC]: 0.1,
  [ENEMY_RARITIES.LEGENDARY]: 0.05,
});

const ENEMY_SPAWN_RADIUS_MAX = 300;
const ENEMY_SPAWN_RADIUS_MIN = 20;
const ENEMY_SPAWN_ATTEMPTS = 36;

const ENEMY_SPAWN_DELAY_MS = 2000;

const ENEMY_TYPE_CONFIG = Object.freeze({
  kedama: {
    kind: "charger",
    weight: 0.6,
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
        dropRange: { min: 10, max: 30 },
      },
      [ENEMY_RARITIES.MID]: {
        unlockRank: 12,
        hp: 200,
        attackDamage: 75,
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
        dropRange: { min: 30, max: 50 },
      },
      [ENEMY_RARITIES.EPIC]: {
        unlockRank: 17,
        hp: 400,
        attackDamage: 100,
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
        dropRange: { min: 50, max: 100 },
      },
      [ENEMY_RARITIES.LEGENDARY]: {
        unlockRank: 22,
        hp: 800,
        attackDamage: 125,
        abilityPower: 0,
        armor: 0,
        defense: 0,
        moveSpeed: 110,
        chargeSpeed: 900,
        detectionRadius: 300,
        windupMs: 1000,
        idleRotationSpeed: 30,
        textureKey: "enemy_kedama_legendary",
        spawnEffectKey: "enemy_spawn_legendary",
        scale: 1.3,
        hitRadius: 16,
        dropRange: { min: 100, max: 150 },
      },
    },
  },
  yousei: {
    kind: "caster",
    weight: 0.15,
    tiers: {
      [ENEMY_RARITIES.BASIC]: {
        unlockRank: 15,
        hp: 100,
        attackDamage: 10,
        abilityPower: 30,
        armor: 10,
        defense: 0,
        moveSpeed: 80,
        detectionRadius: 300,
        moveDurationMs: 2000,
        attackDurationMs: 2000,
        shotIntervalMs: 500,
        spreadDeg: 30,
        bulletSpeed: 30,
        bulletTextureKey: "enemy_bullet_basic",
        textureKey: "enemy_yousei_basic",
        spawnEffectKey: "enemy_spawn_basic",
        scale: 1.0,
        hitRadius: 12,
        dropRange: { min: 10, max: 30 },
      },
      [ENEMY_RARITIES.MID]: {
        unlockRank: 20,
        hp: 100,
        attackDamage: 10,
        abilityPower: 50,
        armor: 50,
        defense: 0,
        moveSpeed: 90,
        detectionRadius: 300,
        moveDurationMs: 2000,
        attackDurationMs: 2000,
        shotIntervalMs: 200,
        spreadDeg: 30,
        bulletSpeed: 30,
        bulletTextureKey: "enemy_bullet_mid",
        textureKey: "enemy_yousei_mid",
        spawnEffectKey: "enemy_spawn_mid",
        scale: 1.05,
        hitRadius: 12,
        dropRange: { min: 30, max: 50 },
      },
      [ENEMY_RARITIES.EPIC]: {
        unlockRank: 25,
        hp: 100,
        attackDamage: 10,
        abilityPower: 70,
        armor: 100,
        defense: 0,
        moveSpeed: 95,
        detectionRadius: 300,
        moveDurationMs: 2000,
        attackDurationMs: 2000,
        shotIntervalMs: 100,
        spreadDeg: 30,
        bulletSpeed: 30,
        bulletTextureKey: "enemy_bullet_epic",
        textureKey: "enemy_yousei_epic",
        spawnEffectKey: "enemy_spawn_epic",
        scale: 1.1,
        hitRadius: 13,
        dropRange: { min: 50, max: 100 },
      },
      [ENEMY_RARITIES.LEGENDARY]: {
        unlockRank: 30,
        hp: 100,
        attackDamage: 10,
        abilityPower: 90,
        armor: 150,
        defense: 0,
        moveSpeed: 100,
        detectionRadius: 300,
        moveDurationMs: 2000,
        attackDurationMs: 2000,
        shotIntervalMs: 50,
        spreadDeg: 30,
        bulletSpeed: 30,
        bulletTextureKey: "enemy_bullet_legendary",
        textureKey: "enemy_yousei_legendary",
        spawnEffectKey: "enemy_spawn_legendary",
        scale: 1.15,
        hitRadius: 13,
        dropRange: { min: 100, max: 150 },
      },
    },
  },
  orb: {
    kind: "turret",
    weight: 0.15,
    tiers: {
      [ENEMY_RARITIES.BASIC]: {
        unlockRank: 18,
        hp: 50,
        attackDamage: 0,
        abilityPower: 50,
        armor: 0,
        defense: 10,
        textureKey: "enemy_orb_basic",
        ringTextureKey: "enemy_orbring_basic",
        spawnEffectKey: "enemy_spawn_basic",
        scale: 0.95,
        hitRadius: 13,
        attackIntervalMs: 2000,
        ringBulletCount: 10,
        ringBulletSpeed: 40,
        ringBulletTextureKey: "enemy_bullet_basic",
        proximityRadius: 100,
        extraRing: { count: 10, speed: 10, textureKey: "enemy_bullet_gun" },
        extraKunai: null,
        dropRange: { min: 10, max: 30 },
      },
      [ENEMY_RARITIES.MID]: {
        unlockRank: 23,
        hp: 100,
        attackDamage: 0,
        abilityPower: 50,
        armor: 0,
        defense: 25,
        textureKey: "enemy_orb_mid",
        ringTextureKey: "enemy_orbring_mid",
        spawnEffectKey: "enemy_spawn_mid",
        scale: 1.0,
        hitRadius: 14,
        attackIntervalMs: 3000,
        ringBulletCount: 20,
        ringBulletSpeed: 40,
        ringBulletTextureKey: "enemy_bullet_mid",
        proximityRadius: 100,
        extraRing: { count: 15, speed: 30, textureKey: "enemy_bullet_gun" },
        extraKunai: null,
        dropRange: { min: 30, max: 50 },
      },
      [ENEMY_RARITIES.EPIC]: {
        unlockRank: 28,
        hp: 200,
        attackDamage: 0,
        abilityPower: 50,
        armor: 0,
        defense: 50,
        textureKey: "enemy_orb_epic",
        ringTextureKey: "enemy_orbring_epic",
        spawnEffectKey: "enemy_spawn_epic",
        scale: 1.15,
        hitRadius: 16,
        attackIntervalMs: 4000,
        ringBulletCount: 30,
        ringBulletSpeed: 40,
        ringBulletTextureKey: "enemy_bullet_epic",
        proximityRadius: 100,
        extraRing: { count: 15, speed: 30, textureKey: "enemy_bullet_gun" },
        extraKunai: {
          textureKey: "enemy_bullet_kunai",
          intervalMs: 500,
          speed: 15,
          spreadDeg: 30,
        },
        dropRange: { min: 50, max: 100 },
      },
      [ENEMY_RARITIES.LEGENDARY]: {
        unlockRank: 33,
        hp: 400,
        attackDamage: 0,
        abilityPower: 50,
        armor: 0,
        defense: 75,
        textureKey: "enemy_orb_legendary",
        ringTextureKey: "enemy_orbring_legendary",
        spawnEffectKey: "enemy_spawn_legendary",
        scale: 1.25,
        hitRadius: 17,
        attackIntervalMs: 5000,
        ringBulletCount: 50,
        ringBulletSpeed: 20,
        ringBulletTextureKey: "enemy_bullet_legendary",
        proximityRadius: 100,
        extraRing: { count: 15, speed: 30, textureKey: "enemy_bullet_gun" },
        extraKunai: {
          textureKey: "enemy_bullet_kunai",
          intervalMs: 100,
          speed: 15,
          spreadDeg: 30,
        },
        dropRange: { min: 100, max: 150 },
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
  maxHp: 600,
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
    this.load.image("floor", "assets/ground/defultground.png");
    this.load.image("wall", "assets/ground/defultwall.png");
    [
      "reimu_11","reimu_12","reimu_13","reimu_14",
      "reimu_21","reimu_22","reimu_23","reimu_24",
      "reimu_31","reimu_32","reimu_33","reimu_34",
    ].forEach((k)=> this.load.image(k, `assets/player/reimu/${k}.png`));
    this.load.image("weapon", "assets/weapon/yinyangball.png");
    this.load.image("bullet", "assets/bullet/spell.png");
    this.load.image("enemy", "assets/enemy/test_robot.png");
    this.load.image("enemyDeath", "assets/enemy/test_robot_death.png");
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
    this.load.audio("utsuho_bgm", "music/boss.mp3"); 
    this.load.audio("battle_bgm", "music/battle.mp3");
    this.load.audio("enemycharge", "se/enemycharge.wav");
    this.load.audio("enemyexploded", "se/enemyexploded.wav");
    this.load.audio("itempick", "se/itempick.wav");
    this.load.audio("pause", "se/pause.wav");
    this.load.audio("playershoot", "se/playershoot.wav");
    this.load.audio("pldead", "se/pldead.wav");

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
    this.playerFacing = "down";
    this.playerAnimationKeys = { down: "player-down", left: "player-left", right: "player-left", up: "player-up" };
    this.playerIdleFrames = { down: "reimu_11", left: "reimu_21", right: "reimu_21", up: "reimu_31" };
    this.playerEquipmentSlots = new Array(EQUIPMENT_SLOT_COUNT).fill(null);
    this.playerEquipmentStats = { physicalLifeSteal: 0 };
    this.playerOnHitEffects = [];
    this.playerSpeedBuffMultiplier = 1;
    this.playerSpeedBuffExpiresAt = 0;
    this.draggedEquipmentSlot = null;
    this.equipmentUi = null;
    this.equipmentUiHandlers = [];
    this.activeEquipmentTooltipIndex = null;
    this.sfxConfig = {
      enemycharge: { volume: 0.25 },
      enemyexploded: { volume: 0.325 },
      itempick: { volume: 0.1 },
      pause: { volume: 0.25 },
      playershoot: { volume: 0.4 },
      pldead: { volume: 0.25 },
    };

    // 鬼索叠层相关
    this.guinsooStacks = 0;
    this.guinsooStacksExpireAt = 0;
    this.guinsooFullProcCounter = 0;
    this.hasGuinsoo = false;

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

    /* ==== 新增：Boss弹幕分组与碰撞 ==== */
    this.bossBullets = this.physics.add.group();
    // 自机与Boss子弹判定：法术伤害（按Boss配置）
    this.physics.add.overlap(this.player, this.bossBullets, (player, bullet) => {
      if (!bullet.active) return;
      // 仅当标记为Boss弹幕时生效
      const dmg = bullet.magicDamage ?? 0;
      if (dmg > 0) this.applyMagicDamageToPlayer(dmg);
      this.destroyBossBullet(bullet);
    });

    const now = this.time.now;
    this.lastDamageTimestamp = now;
    this.nextNoDamageRankCheck = now + NO_DAMAGE_RANK_INTERVAL;
    this.roundTimeLeft = ROUND_DURATION;
    this.roundComplete = false;
    this.roundAwaitingDecision = false;
    this.updateOverlayScale();
    this.updateHUD();

    if (this.debugShopMode) {
      this.playerPoints = Math.max(this.playerPoints, SHOP_DEBUG_START_GOLD);
      this.updateHUD();
      this.updateShopGoldLabel();
      this.openShop("debug");
    }

    if (!this.battleBgm) {
      this.battleBgm = this.sound.add("battle_bgm", { loop: true, volume: 0.6 });
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
      skillOverlay: document.getElementById("skill-space-overlay"),
      skillTimer: document.getElementById("skill-space-timer"),
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
        this.playSfx("enemycharge");
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
      })),
      previewElement,
      previewImage,
    };
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
  }

  getEquipmentDefinition(itemId) {
    if (!itemId) return null;
    return EQUIPMENT_DATA[itemId] ?? null;
  }

  refreshEquipmentUI() {
    if (!this.equipmentUi?.slots) return;
    this.equipmentUi.slots.forEach(({ element, icon }, index) => {
      const itemId = this.playerEquipmentSlots[index];
      const item = this.getEquipmentDefinition(itemId);
      if (item && icon) {
        icon.src = item.icon;
        icon.alt = item.name;
        element.classList.add("has-item");
        element.setAttribute("draggable", "true");
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
    });

    const previewElement = this.equipmentUi.previewElement;
    const previewImage = this.equipmentUi.previewImage;
    const previewItem = this.getEquipmentDefinition(this.playerEquipmentSlots[0]);

    if (previewElement && previewImage) {
      if (previewItem) {
        previewElement.classList.add("active");
        previewImage.src = previewItem.icon;
        previewImage.alt = previewItem.name;
        this.positionPreviewUnderSlot1();
      } else {
        previewElement.classList.remove("active");
        previewElement.style.background = "transparent";
        previewElement.style.backgroundImage = "none";
        previewImage.removeAttribute("src");
        previewImage.alt = "";
      }
    }

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
    this.refreshEquipmentUI();
    this.recalculateEquipmentEffects();
    const tooltipIndex = this.activeEquipmentTooltipIndex ?? null;
    this.refreshEquipmentTooltip(tooltipIndex);
  }

  recalculateEquipmentEffects() {
    this.playerEquipmentStats = { physicalLifeSteal: 0 };
    this.playerOnHitEffects = [];

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
    let hasGuinsoo = false;

    const appliedUniques = new Set();
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
      if (stats.critChancePct) addCritChancePct += stats.critChancePct;
      if (stats.critDamageBonusPct) addCritDamageBonusPct += stats.critDamageBonusPct;
      if (stats.moveSpeedFlat) moveSpeedFlat += stats.moveSpeedFlat;
      if (stats.moveSpeedPct) moveSpeedPct += stats.moveSpeedPct;
      if (stats.abilityHaste) abilityHaste += stats.abilityHaste;
      if (stats.armorPenFlat) armorPenFlat += stats.armorPenFlat;

      if (item.id === BROKEN_KINGS_BLADE_ID && !appliedUniques.has(item.id)) {
        this.playerOnHitEffects.push((context) => this.handleBrokenKingsBladeOnHit(context));
        appliedUniques.add(item.id);
      }
      if (item.id === GUINSOOS_RAGEBLADE_ID) hasGuinsoo = true;
    }

    base.attackDamage = Math.max(1, Math.round(base.attackDamage + addAD));
    base.attackSpeed = Math.max(0.1, Number((base.attackSpeed * (1 + addASPct)).toFixed(3)));
    base.abilityPower = Math.max(0, Math.round((base.abilityPower ?? 0) + addAP));
    base.armor = Math.max(0, Math.round((base.armor ?? 0) + addAR));
    base.defense = Math.max(0, Math.round((base.defense ?? 0) + addDEF));
    base.maxHp = Math.max(1, Math.round((base.maxHp ?? PLAYER_BASE_STATS.maxHp) + addHp));
    const baseMaxMana = base.maxMana ?? PLAYER_MANA_MAX;
    base.maxMana = Math.max(0, Math.round(baseMaxMana + addMana));
    // 支持装备给到 30 或 0.30 两种写法，统一为 [0,1]
    {
      const add01 = addCritChancePct > 1 ? addCritChancePct / 100 : addCritChancePct;
      base.critChance = Math.min(1, Math.max(0, (base.critChance ?? 0) + add01));
    }
    base.critDamage = Math.max(0, Math.round((base.critDamage ?? 0) + addCritDamageBonusPct * 100));

    const baseMoveSpeed = base.moveSpeed ?? PLAYER_BASE_SPEED;
    const computedMoveSpeed = (baseMoveSpeed + moveSpeedFlat) * (1 + moveSpeedPct);
    base.moveSpeed = Math.max(0, Number(computedMoveSpeed.toFixed(3)));

    abilityHaste = Math.max(0, abilityHaste);
    base.abilityHaste = abilityHaste;
    base.cooldownReduction = abilityHaste > 0 ? 1 - (100 / (100 + abilityHaste)) : 0;
    base.armorPenFlat = Math.max(0, (base.armorPenFlat ?? 0) + armorPenFlat);

    this.playerStats = base;

    const newMaxHp = this.playerStats.maxHp ?? prevMaxHp;
    const newMaxMana = this.playerStats.maxMana ?? prevMaxMana;
    this.currentHp = Math.min(newMaxHp, Math.max(0, Math.round(newMaxHp * hpRatio)));
    this.currentMana = Math.min(newMaxMana, Math.max(0, Math.round(newMaxMana * manaRatio)));

    this.hasGuinsoo = hasGuinsoo;
    if (!this.hasGuinsoo) {
      this.guinsooStacks = 0;
      this.guinsooStacksExpireAt = 0;
      this.guinsooFullProcCounter = 0;
    }

    this.rebuildAttackTimer();
    this.updateStatPanel();
    this.updateResourceBars();
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
    const effAS = this.playerStats.attackSpeed * this.getAttackSpeedBonusMultiplier();
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

    // ? 仅 Boss 房间：渲染边框后直接返回（不在中间生成任何墙）
    if (this.debugBossMode) {
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

    this.physics.add.collider(this.player, this.wallGroup);
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
    this.loot = this.physics.add.group();

    this.physics.add.collider(this.enemies, this.wallGroup);
    this.physics.add.collider(this.enemies, this.enemies);

    this.physics.add.overlap(this.bullets, this.enemies, this.handleBulletEnemyOverlap, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyContact, null, this);
    this.physics.add.overlap(this.player, this.loot, this.collectPoint, null, this);
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
    const baseConfig = this.sfxConfig?.[key] ?? {};
    this.sound.play(key, { ...baseConfig, ...overrides });
  }
  handlePauseKey(event) {
    if (!event || event.code !== "Escape") return;
    if (event.repeat) { event.preventDefault(); return; }
    if (this.roundAwaitingDecision || (this.roundComplete && !this.isPaused)) return;
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
    this.showPauseOverlay();
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
  }
  exitToStartFromPause() {
    if (!this.isPaused) return;
    this.clearPauseOverlay();
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
    if (this.debugBossMode) {
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
    const intervalSeconds = Math.max(0.01, 10 / rankValue);
    const delay = intervalSeconds * 1000;
    this.spawnTimer = this.time.addEvent({ delay, loop: true, callback: () => this.spawnEnemy() });
  }

  /* ==== HUD ==== */
  setupHUD() { this.updateOverlayScale(); this.updateHUD(); }
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
    this.updateBullets(delta);
    this.updateEnemies();
    this.updateLoot(delta);

    /* ==== 新增：更新 Boss 弹幕与Utsuho AI ==== */
    this.updateBossBullets(delta);
    if (this.boss && this.boss.isBoss && this.boss.bossKind === "Utsuho") {
      this.updateUtsuhoAI(delta);
    }

    this.updateRoundTimer(delta);
    this.checkNoDamageRankBonus();
    this.updateHUD();
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

  updateWeapon(delta) {
    const angleDelta = Phaser.Math.DegToRad((WEAPON_ORBIT_SPEED * delta) / 1000);
    this.weaponAngle = (this.weaponAngle + angleDelta) % Phaser.Math.PI2;
    const offsetX = Math.cos(this.weaponAngle) * WEAPON_ORBIT_RADIUS;
    const offsetY = Math.sin(this.weaponAngle) * WEAPON_ORBIT_RADIUS;
    this.weaponSprite.setPosition(this.player.x + offsetX, this.player.y + offsetY);
    if (this.rangeVisible) this.drawRangeCircle();
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

  updateRoundTimer(delta) {
    if (this.roundComplete || this.debugBossMode || this.isShopOpen()) return;
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
    this.clearEnemies();
    this.clearBullets();
    this.openShop("roundEnd");
  }
  clearEnemies() { this.enemies.getChildren().forEach((e)=> e.destroy()); }
  clearBullets() { this.bullets.getChildren().forEach((b)=> this.destroyBullet(b)); }

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
      this.rank = Number((this.rank + ROUND_CONTINUE_RANK_BONUS).toFixed(2));
      this.roundComplete = false;
      const now = this.time.now;
      this.lastDamageTimestamp = now;
      this.nextNoDamageRankCheck = now + NO_DAMAGE_RANK_INTERVAL;
      this.roundTimeLeft = ROUND_DURATION;
      this.generateRandomSegmentsMap();
      if (this.player) {
        this.player.setPosition(WORLD_SIZE/2, WORLD_SIZE/2);
        this.player.body.setVelocity(0, 0);
        this.playerFacing = "down";
        this.stopPlayerAnimation(this.playerFacing);
      }
      this.scheduleSpawnTimer();
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
    if (this.attackTimer) { this.attackTimer.remove(); this.attackTimer = null; }
    const text = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2, "Adventure Complete", {
      fontFamily: '"Zpix", monospace', fontSize: "20px", color: "#66ff99",
      backgroundColor: "#000000aa", padding: { x: 8, y: 6 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(50);
    ensureBaseFontSize(text);
    setFontSizeByScale(text, CAMERA_ZOOM / this.currentZoom);
  }

  updateHUD() {
      // Boss模式下不显示倒计时
      if (this.debugBossMode) {
          if (this.ui.timerValue) this.ui.timerValue.textContent = "--:--";
      } else {
          const timeLeft = Math.max(0, this.roundTimeLeft);
          const totalSeconds = Math.ceil(timeLeft / 1000);
          const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
          const seconds = (totalSeconds % 60).toString().padStart(2, "0");
          if (this.ui.timerValue) this.ui.timerValue.textContent = `${minutes}:${seconds}`;
      }
      
      if (this.ui.killValue) this.ui.killValue.textContent = `${this.killCount}`;
      if (this.ui.rankValue) this.ui.rankValue.textContent = this.formatRankValue(this.rank);
      if (this.ui.pointValue) this.ui.pointValue.textContent = `${this.playerPoints}`;
  }

  formatRankValue(value) { return Number.isInteger(value) ? `${value}` : value.toFixed(2); }
// Add these methods to the GameScene class:

showDamageNumber(x, y, amount, type = "physical", options = {}) {
  // options 可以是布尔（表示 incoming），也可以是 { incoming: true/false }
  const incoming = (typeof options === "boolean") ? options : !!options.incoming;

  const colors = {
    physical: "#ffd966",
    magic: "#66aaff",
    crit: "#ff0000",   // 纯红色
    heal: "#66ff66"
  };

  const displayValue = (typeof amount === "number") ? Math.round(amount) : amount;

  const text = this.add.text(x, y, `${displayValue}`, {
    fontFamily: '"Zpix", monospace',
    fontSize: (type === "crit") ? "20px" : "14px",
    color: colors[type] ?? "#ffffff",
  }).setOrigin(0.5).setDepth(80);

  // 描边规则：
  // - 暴击：纯红色，无描边
  // - 自身受伤：红色描边
  // - 普通伤害（物理/法术，对敌人）：黑色描边
  // - 治疗：黑色细描边
  if (type === "crit") {
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

  this.tweens.add({
    targets: text,
    y: text.y + ((type === "crit") ? -15 : -10),
    alpha: 0,
    duration: (type === "crit") ? 850 : 650,
    ease: "Cubic.Out",
    onComplete: () => text.destroy()
  });
}

showHealNumber(x, y, amount) {
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
    const effectiveArmor = armor - armorPenetration;

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
  const actual = this.applyMitigationToTarget(
    Math.round(amount),
    { armor: this.playerStats.armor ?? 0, def: this.playerStats.defense ?? 0 },
    sourceStats,
    "magic",
  );
  this.showDamageNumber(this.player.x, this.player.y - 12, actual, "magic", true); // ← 这里传 true
  this.currentHp = Math.max(this.currentHp - actual, 0);
  this.updateResourceBars();
  const now = this.time.now;
  this.lastDamageTimestamp = now;
  this.nextNoDamageRankCheck = now + NO_DAMAGE_RANK_INTERVAL;
  if (this.currentHp <= 0) this.gameOver();
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

  tryFireBullet() {
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

    this.bullets.add(bullet);
    this.attachBulletTrailToBullet(bullet);
    this.playSfx("playershoot");

    const angle = Phaser.Math.Angle.Between(bullet.x, bullet.y, target.x, target.y);
    this.physics.velocityFromRotation(angle, BULLET_SPEED, bullet.body.velocity);
    bullet.setRotation(angle + Math.PI / 2);
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
    if (this.debugBossMode) return;
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
        const unlockRank = Number.isFinite(tierConfig.unlockRank) ? tierConfig.unlockRank : 0;
        if (rankValue < unlockRank) return;
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
    enemy.attackDamage = tierConfig.attackDamage ?? 0;
    enemy.contactDamage = tierConfig.attackDamage ?? 0;
    enemy.abilityPower = tierConfig.abilityPower ?? 0;
    enemy.armor = tierConfig.armor ?? 0;
    enemy.def = tierConfig.defense ?? tierConfig.def ?? 0;
    enemy.moveSpeed = tierConfig.moveSpeed ?? 60;
    enemy.enemyType = typeKey;
    enemy.enemyTier = tierKey;
    enemy.enemyKind = typeConfig?.kind ?? "charger";
    enemy.dropRange = tierConfig.dropRange ?? { min: 10, max: 30 };
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

handleBulletEnemyOverlap(bullet, enemy) {
  if (!enemy.active) return;

  const now = this.time.now;
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
    this.displayDamageWithSeparation(enemy.x, enemy.y, damageGroups.basic.magic, "magic", displayOrder++);
  }
  if (damageGroups.onHit.physical > 0) {
    this.displayDamageWithSeparation(enemy.x, enemy.y, damageGroups.onHit.physical, "physical", displayOrder++);
  }
  if (damageGroups.onHit.magic > 0) {
    this.displayDamageWithSeparation(enemy.x, enemy.y, damageGroups.onHit.magic, "magic", displayOrder++);
  }

  // === 扣血与后续处理 ===
  const totalDamage =
    damageGroups.basic.physical + damageGroups.basic.magic +
    damageGroups.onHit.physical + damageGroups.onHit.magic;

  enemy.hp = Math.max(0, (enemy.hp ?? 0) - totalDamage);
  if (enemy.isBoss && typeof enemy.setData === "function") {
    enemy.setData("hp", enemy.hp);
  }
  if (enemy.isBoss) this.updateBossUI(enemy);

  if (enemy.hp <= 0) {
    this.killEnemy(enemy);
  }

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

  this.destroyBullet(bullet);
}


  hasItemEquipped(itemId) {
    return this.playerEquipmentSlots.some((id) => id === itemId);
  }

  handleBrokenKingsBladeOnHit(_context) { return null; }

  handlePlayerEnemyContact(_player, enemy) {
    const now = this.time.now;
    if (!enemy.lastDamageTick || now - enemy.lastDamageTick >= 650) {
      /* 修改：Boss 接触伤害按Boss配置，否则用默认常量，不改变原有逻辑 */
      const dmg = (enemy.isBoss && enemy.contactDamage) ? enemy.contactDamage : ENEMY_CONTACT_DAMAGE;
      this.applyDamageToPlayer(dmg, enemy);
      enemy.lastDamageTick = now;
    }
  }

applyDamageToPlayer(amount, sourceStats = null) {
  const actual = this.applyMitigationToTarget(Math.round(amount), this.playerStats, sourceStats, "physical");
  this.showDamageNumber(this.player.x, this.player.y - 12, actual, "physical", true); // ← 这里传 true
  this.currentHp = Math.max(this.currentHp - actual, 0);
  this.updateResourceBars();
  const now = this.time.now;
  this.lastDamageTimestamp = now;
  this.nextNoDamageRankCheck = now + NO_DAMAGE_RANK_INTERVAL;
  if (this.currentHp <= 0) this.gameOver();
}


  killEnemy(enemy) {
    this.playSfx("enemyexploded");
    // 修改：Utsuho死亡贴图
    if (enemy.isBoss && enemy.bossKind === "Utsuho") {
      enemy.setTexture(BOSS_UTSUHO_CONFIG.textureDeath);
    } else {
      enemy.setTexture("enemyDeath");
    }
    enemy.setVelocity(0, 0);
    enemy.active = false;
    enemy.body.enable = false;
    this.killCount += 1;
    this.updateHUD();

    // Boss死亡收尾
    if (enemy.isBoss) {
      this.clearBossUI();
      if (this.bossMusic) { this.bossMusic.stop(); this.bossMusic.destroy(); this.bossMusic = null; }
      this.boss = null;
      this.bossKind = null;
      // 清空所有Boss弹幕
      this.clearBossBullets();
    }

    this.time.delayedCall(260, () => enemy.destroy());
    this.maybeDropPoint(enemy.x, enemy.y);
  if (enemy.ringSprite) {
  enemy.ringSprite.destroy();
  enemy.ringSprite = null;
}
this.time.delayedCall(260, () => enemy.destroy());

  }

/* 按敌人 tier 的 dropRange（min/max）生成总点数，并拆成若干拾取物 */
maybeDropPoint(enemyOrX, maybeY) {
  let x, y, range;
  if (typeof enemyOrX === "object") {
    const e = enemyOrX;
    x = e.x; y = e.y;
    const r = e.dropRange ?? { min: 10, max: 30 };
    range = { min: Math.max(0, r.min|0), max: Math.max(0, r.max|0) };
  } else {
    x = enemyOrX; y = maybeY;
    range = { min: 10, max: 30 }; 
  }

  // 总点数
  const total = Phaser.Math.Between(range.min, range.max);
  if (total <= 0) return;

  // 拆分成 2~4 份
  const pieces = Phaser.Math.Clamp(Math.ceil(total / 15), 2, 4);
  // 保证每份至少有1点
  const base = Math.max(1, Math.floor(total / pieces));
  // 剩余点数
  let remaining = total;

  for (let i = 0; i < pieces; i += 1) {
    // 最后一份拿走所有剩余点数
    const amount = (i === pieces - 1) ? remaining : base;
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
  }
}

  collectPoint(_player, point) {
    if (!point.active) return;
    this.playSfx("itempick");
    this.loot.remove(point, true, true);
    this.playerPoints += point.amount;
    const manaGain = point.amount * 10;
    const maxMana = this.playerStats?.maxMana ?? PLAYER_BASE_STATS.maxMana ?? PLAYER_MANA_MAX;
    this.currentMana = Math.min((this.currentMana ?? 0) + manaGain, maxMana);
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

  gameOver() {
    this.playSfx("pldead");
    this.physics.pause();
    this.time.removeAllEvents();
    const text = this.add.text(this.player.x, this.player.y - 12, "GAME OVER", {
      fontFamily: '"Zpix", monospace', fontSize: "18px", color: "#ff3344",
      backgroundColor: "#000000aa", padding: { x: 6, y: 4 },
    }).setOrigin(0.5).setScrollFactor(0);
    ensureBaseFontSize(text);
    setFontSizeByScale(text, CAMERA_ZOOM / this.currentZoom);
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
      `CR ${(this.playerStats.critChance * 100).toFixed(0)}%`,
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
    const sellPrice = EQUIPMENT_SELL_PRICE_CACHE[itemId] ?? Math.floor((item.cost ?? 0) * 0.7);
    const confirmText = `确认以 ${sellPrice} 金币卖出 ${item.name} 吗？`;
    if (typeof window !== "undefined" && !window.confirm(confirmText)) return;
    this.playerEquipmentSlots[idx] = null;
    this.playerPoints += sellPrice;
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

    this.physics.pause();
    this.time.timeScale = 0;
    if (this.attackTimer) this.attackTimer.paused = true;
    if (this.spawnTimer) this.spawnTimer.paused = true;

    this.generateShopOffers();
    this.renderShop();
    this.updateShopGoldLabel();
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
    if (this.playerPoints < SHOP_REFRESH_COST) {
      this.setShopMessage(SHOP_TEXT.notEnoughGold);
      return;
    }
    this.playerPoints -= SHOP_REFRESH_COST;
    this.updateHUD();
    this.updateShopGoldLabel();
    this.generateShopOffers();
    this.renderShop();
    this.setShopMessage(SHOP_TEXT.refreshed);
  }

  updateShopGoldLabel() {
    if (this.shopUi?.goldValue) this.shopUi.goldValue.textContent = `${this.playerPoints}`;
    if (this.shopUi?.refreshBtn) this.shopUi.refreshBtn.disabled = this.playerPoints < SHOP_REFRESH_COST;
  }

  setShopMessage(text) {
    this.shopState.lastMessage = text || "";
    if (this.shopUi?.message) this.shopUi.message.textContent = this.shopState.lastMessage;
  }

  clearShopMessage() {
    this.setShopMessage("");
  }

  generateShopOffers() {
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
    let attempts = 0;
    while (offers.length < SHOP_ITEM_COUNT && attempts < maxAttempts) {
      attempts += 1;
      const tier = this.rollShopTier(ownedBasics, ownedMid);
      const weightedCandidates = this.getWeightedCandidatesForTier(
        tier,
        ownedBasics,
        ownedMid,
        ownedCounts,
        usedIds,
      );

      let chosenId = this.pickWeightedCandidate(weightedCandidates);
      if (!chosenId && tier === ITEM_TIERS.BASIC) {
        const fallback = ITEMS_BY_TIER[tier]
          .map((item) => item.id)
          .filter((id) => !usedIds.has(id));
        chosenId = randomElement(fallback);
      }
      if (!chosenId) continue;
      usedIds.add(chosenId);
      const item = this.getEquipmentDefinition(chosenId);
      const tierForOffer = item?.tier ?? tier;
      offers.push({ id: chosenId, tier: tierForOffer });
    }

    if (offers.length === 0) return;

    this.shopState.offers = offers;
  }

  rollShopTier(ownedBasics, ownedMid) {
    if (ownedMid.length > 0 && Math.random() < 0.5) return ITEM_TIERS.LEGENDARY;
    if (ownedBasics.length > 0 && Math.random() < 0.5) return ITEM_TIERS.MID;
    return ITEM_TIERS.BASIC;
  }

  getCandidatesForTier(tier, ownedBasics, ownedMid) {
    if (tier === ITEM_TIERS.MID) {
      return this.collectUpgradeCandidates(ownedBasics, ITEM_TIERS.MID);
    }
    if (tier === ITEM_TIERS.LEGENDARY) {
      return this.collectUpgradeCandidates(ownedMid, ITEM_TIERS.LEGENDARY);
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
    const tierPriority = {
      [ITEM_TIERS.LEGENDARY]: 3,
      [ITEM_TIERS.MID]: 2,
      [ITEM_TIERS.BASIC]: 1,
    };
    return Object.values(EQUIPMENT_DATA)
      .filter((item) => this.hasAllComponentsForItem(item, ownedCounts))
      .sort((a, b) => {
        const tierDiff = (tierPriority[b.tier] ?? 0) - (tierPriority[a.tier] ?? 0);
        if (tierDiff !== 0) return tierDiff;
        const costDiff = (a.cost ?? 0) - (b.cost ?? 0);
        if (costDiff !== 0) return costDiff;
        return a.id.localeCompare(b.id);
      })
      .map((item) => item.id);
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
      if (info.complete) return;
      const weight = item.buildsFrom?.length ? 1 + info.matched * 0.1 : 1;
      candidates.push({ id, weight: Math.max(0, weight) });
    });
    return candidates;
  }

  pickWeightedCandidate(candidates) {
    if (!Array.isArray(candidates) || candidates.length === 0) return null;
    const totalWeight = candidates.reduce((sum, entry) => sum + entry.weight, 0);
    if (totalWeight <= 0) return null;
    let roll = Math.random() * totalWeight;
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
    if (itemTier === ITEM_TIERS.BASIC) {
      upgrades = this.getBuildsIntoNames(offerData.item, ITEM_TIERS.MID);
    } else if (itemTier === ITEM_TIERS.MID) {
      upgrades = this.getBuildsIntoNames(offerData.item, ITEM_TIERS.LEGENDARY);
    }
    if (upgrades.length > 0) {
      const upgradeEl = document.createElement("div");
      upgradeEl.className = "shop-item-upgrades";
      upgradeEl.textContent = `可合成：${upgrades.join("、")}`;
      card.appendChild(upgradeEl);
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
    const hasSpace = freeSlotsAfterConsume > 0;
    let statusMessage = "";
    if (!canAfford) statusMessage = SHOP_TEXT.notEnoughGold;
    else if (!hasSpace) statusMessage = SHOP_TEXT.inventoryFull;

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
  }

  applyShopPurchase(offerData) {
    this.playerPoints = Math.max(0, this.playerPoints - offerData.price);

    const slotsToClear = [...offerData.componentsOwned].sort(
      (a, b) => b.slotIndex - a.slotIndex,
    );
    slotsToClear.forEach(({ slotIndex }) => {
      if (slotIndex >= 0 && slotIndex < this.playerEquipmentSlots.length) {
        this.playerEquipmentSlots[slotIndex] = null;
      }
    });

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

  positionPreviewUnderSlot1() {
    const ui = this.equipmentUi;
    if (!ui || !ui.previewElement || !ui.previewImage || !ui.slots?.[0]) return;

    const slotEl = ui.slots[0].element;
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
    this.previewRepositionHandler = () => this.positionPreviewUnderSlot1();
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

  // 名字文本（放在血条上方）
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
    gfx.fillRect(innerX, innerY, innerW, innerH);
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
  setSpriteCircleHit(b, judgeTiles) {
    const r = Math.max(0, (judgeTiles || 0) * TILE_SIZE / 2);
    b.hitRadius = r;
    const fw = b.width || TILE_SIZE, fh = b.height || TILE_SIZE;
    const offX = fw/2 - r, offY = fh/2 - r;
    if (r > 0) b.body.setCircle(r, offX, offY);
    else b.body.setSize(fw, fh);
  }
  setDisplaySizeByTiles(sprite, sizeTiles) {
    const px = this.tilesToPx(sizeTiles || 1);
    sprite.setDisplaySize(px, px);
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
    this.playSfx("enemycharge");
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
    this.playSfx("enemycharge");
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

      this.playSfx("enemycharge");
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
            judgeTiles: BOSS_UTSUHO_CONFIG.hitboxes.bullets.yellow.judge,
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
    const { key, sizeTiles, judgeTiles, count, phaseDeg, forwardSpeed, accel, sideSpeed } = params;
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
      }, magicDamage, true);
    }
  }
  spawnBossBullet(opts, magicDamage, withTrail = false) {
    const { key, sizeTiles, judgeTiles, from, dirAngleDeg, forwardSpeed, accel, sideSpeed } = opts;
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
