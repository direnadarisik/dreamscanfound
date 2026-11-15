// Persistent resource simulation: capacities, production, consumption, daily tick.
import { CROPS, SEED_KEYS, SPACECRAFT, DIFFICULTY, EQUIPMENT, HEAT } from './data.js';

const BASE_CAP = { water: 150, food: 60, oxygen: 40, energy: 100, fuel: 100, materials: 60, raw: 40, seeds: 40 };
export const RES_KEYS = ['water', 'food', 'oxygen', 'energy', 'fuel', 'materials', 'seeds'];
export const RES_UNITS = { water: 'L', food: 'rations', oxygen: 'kg', energy: 'kWh', fuel: 'units', materials: 'units', seeds: 'seeds', raw: 'L' };
export const RES_NAMES = { water: 'Water', food: 'Food', oxygen: 'Oxygen', energy: 'Energy', fuel: 'Fuel', materials: 'Building materials', seeds: 'Seeds', raw: 'Raw meltwater' };
export const CREW = 2;

export const craftOf = M => SPACECRAFT.find(c => c.id === M.cfg.craft) || SPACECRAFT[1];
export const diffOf = M => DIFFICULTY[M.cfg.diff] || DIFFICULTY.normal;
export const seedCount = M => SEED_KEYS.reduce((a, k) => a + (M.inv[k + '_seed'] || 0), 0);

export function cap(M, k) {
  let v = BASE_CAP[k];
  const c = craftOf(M);
  if (k !== 'seeds') v *= c.storage;
  if (M.eq.tanks?.installed && ['water', 'food', 'oxygen', 'raw'].includes(k)) v *= 1.5;
  return Math.round(v + (M.capBonus[k] || 0));
}
export function getRes(M, k) { return k === 'seeds' ? seedCount(M) : M.res[k]; }

export function resetToday(M) {
  M.today = { prod: {}, cons: {}, chips: 0, salvage: 0, inspected: {} };
  M.dayStart = { ...M.res, seeds: seedCount(M) };
}
// Adds (or removes) a resource, clamped to [0, cap]. Returns the actual change.
export function addRes(M, k, d) {
  const before = M.res[k];
  M.res[k] = Math.max(0, Math.min(cap(M, k), before + d));
  const real = M.res[k] - before;
  if (M.today) {
    if (real > 0) M.today.prod[k] = (M.today.prod[k] || 0) + real;
    if (real < 0) M.today.cons[k] = (M.today.cons[k] || 0) - real;
  }
  return real;
}

export function createMission(cfg) {
  const diff = DIFFICULTY[cfg.diff];
  const has = id => cfg.equip.includes(id);
  const s = diff.start;
  const M = {
    cfg, day: 0, res: {}, capBonus: {}, eq: {},
    panels: { solar1: 0.9, solar2: 0.88, solar3: 0.92, solar4: 1 },
    beds: Array.from({ length: 4 }, () => ({ stage: 'empty', crop: null, seeds: 0, growth: 0, water: 0, health: 100 })),
    gh: { lights: false, temp: 21, selected: null, can: 0, carryMedium: false },
    inv: { medium: 4, radish_micro_seed: 6, lettuce_micro_seed: 4, lettuce_seed: 3, radish_seed: 3, mizuna_seed: 2, wheat_seed: 2 },
    log: [], report: null, history: [], science: 0, quizScore: 0, rescues: diff.rescue, flags: {},
    stats: { harvested: 0, waterMade: 0, o2Made: 0, fuelMade: 0, plantWater: 0 }
  };
  for (const e of EQUIPMENT) M.eq[e.id] = { installed: has(e.id), on: true, health: 100 };
  M.res = { water: 80 * s, food: 30 * s, oxygen: 24 * s, energy: 70, fuel: 40 * s, materials: 16 * s, raw: 0 };
  if (has('cache')) {
    M.res.food += 20; M.res.materials += 10;
    M.inv.radish_micro_seed += 4; M.inv.lettuce_micro_seed += 2; M.inv.medium += 2;
  }
  for (const k of Object.keys(M.res)) M.res[k] = Math.min(cap(M, k), Math.round(M.res[k] * 10) / 10);
  resetToday(M);
  M.log.push({ day: 0, text: `Mission launched: ${craftOf(M).name}, ${diff.name} difficulty.` });
  return M;
}

export const bedUnlocked = (M, i) => i < 2 || M.eq.veggie.installed;
export const panelIds = M => ['solar1', 'solar2', 'solar3'].concat(M.eq.solarx.installed ? ['solar4'] : []);

// Per-sol production / consumption rates. `shed` removes loads during an energy shortage.
export function forecast(M, shed = {}) {
  const diff = diffOf(M), craft = craftOf(M), eq = M.eq;
  const f = {};
  const solar = panelIds(M).reduce((a, id) => a + 9 * M.panels[id], 0) * (M.flags.storm ? 0.5 : 1);
  const planted = M.beds.filter(b => b.stage === 'planted').length;
  const loads = [['Life support & habitat', 10]];
  if (craft.load) loads.push(['Spacecraft systems', craft.load]);
  const recOn = eq.recycler.installed && eq.recycler.on && !shed.recycler;
  const o2On = eq.oxygen.installed && eq.oxygen.on && !shed.o2;
  const lightsOn = M.gh.lights && !M.flags.lightsOff && !shed.lights;
  if (recOn) loads.push(['Water recycler', 2]);
  if (o2On) loads.push(['O2 generator', 4]);
  if (lightsOn) loads.push(['LED grow lights', 1.5 * Math.max(1, planted)]);
  loads.push(['Greenhouse heater', planted ? HEAT[M.gh.temp] : 1]);
  f.energy = { prod: solar, cons: loads.reduce((a, l) => a + l[1], 0), loads };
  const crewWater = CREW * 4 * diff.cons;
  f.water = { prod: recOn ? 0.75 * eq.recycler.health / 100 * crewWater : 0, cons: crewWater };
  f.oxygen = { prod: o2On ? 2 * eq.oxygen.health / 100 : 0, cons: CREW * 0.84 * diff.cons };
  f.food = { prod: 0, cons: CREW * diff.cons };
  f.fuel = { prod: 0, cons: 0 };
  f.materials = { prod: 0, cons: 0 };
  f.seeds = { prod: 0, cons: 0 };
  f.plantWater = M.beds.filter(b => b.stage === 'planted').reduce((a, b) => a + CROPS[b.crop].water * b.seeds, 0);
  f.flags = { recOn, o2On, lightsOn };
  return f;
}

export function missionStatus(M) {
  const f = forecast(M);
  let worst = 99;
  for (const k of ['water', 'food', 'oxygen']) {
    const net = f[k].cons - f[k].prod;
    if (net > 0) worst = Math.min(worst, M.res[k] / net);
  }
  if (worst < 1.5 || M.res.energy < 8) return { label: 'CRITICAL', color: '#ff4b4b' };
  if (worst < 4 || M.res.energy < 25) return { label: 'CAUTION', color: '#ffd84d' };
  return { label: 'NOMINAL', color: '#7effa0' };
}

export function dailyTick(M, dayIndex) {
  const rep = { day: dayIndex + 1, rows: {}, notes: [], failed: null };
  // Energy shortage: shed loads in priority order.
  let shed = {}, f = forecast(M, shed);
  for (const k of ['lights', 'o2', 'recycler']) {
    if (M.res.energy + f.energy.prod - f.energy.cons >= 0) break;
    shed[k] = true; f = forecast(M, shed);
  }
  if (shed.lights) rep.notes.push('Energy shortage: grow lights shut off overnight.');
  if (shed.o2) rep.notes.push('Energy shortage: O2 generator shut down.');
  if (shed.recycler) rep.notes.push('Energy shortage: water recycler shut down.');
  for (const k of ['energy', 'water', 'oxygen', 'food']) {
    const gained = addRes(M, k, f[k].prod);
    if (gained < f[k].prod - 0.01) rep.notes.push(`${k} storage full: ${(f[k].prod - gained).toFixed(1)} lost.`);
    addRes(M, k, -f[k].cons);
  }
  if (f.flags.recOn) M.stats.waterMade += f.water.prod;
  if (f.flags.o2On) M.stats.o2Made += f.oxygen.prod;
  // Greenhouse growth.
  for (const [i, b] of M.beds.entries()) {
    if (b.stage !== 'planted') continue;
    const c = CROPS[b.crop];
    const need = c.water * b.seeds;
    const wet = b.water >= need - 1e-6;
    M.stats.plantWater += Math.min(need, b.water);
    b.water = Math.max(0, b.water - need);
    const tempOk = M.gh.temp >= c.temp[0] && M.gh.temp <= c.temp[1];
    let g = 1; const why = [];
    if (!f.flags.lightsOn) { g = 0; b.health -= 10; why.push('no light'); }
    if (!wet) { g = 0; b.health -= 25; why.push('dry medium'); }
    if (!tempOk) { g *= 0.5; b.health -= 10; why.push(`temperature ${M.gh.temp}°C outside ${c.temp[0]}-${c.temp[1]}°C`); }
    b.growth = Math.min(c.days, b.growth + g);
    if (b.health <= 0) { b.stage = 'dead'; rep.notes.push(`Bed ${i + 1}: ${c.name} died (${why.join(', ')}).`); }
    else if (why.length) rep.notes.push(`Bed ${i + 1}: growth slowed (${why.join(', ')}).`);
    else if (b.growth >= c.days) rep.notes.push(`Bed ${i + 1}: ${c.name} READY TO HARVEST.`);
  }
  // Wear and dust.
  if (f.flags.recOn) M.eq.recycler.health = Math.max(20, M.eq.recycler.health - 4);
  for (const id of panelIds(M)) M.panels[id] = Math.max(0.3, M.panels[id] - 0.04);
  M.flags = {};
  // Rows.
  for (const k of RES_KEYS) {
    const end = getRes(M, k);
    rep.rows[k] = { start: M.dayStart[k], end, prod: M.today.prod[k] || 0, cons: M.today.cons[k] || 0 };
  }
  // Failure check.
  for (const k of ['water', 'food', 'oxygen']) {
    if (M.res[k] > 0.01) continue;
    if (M.rescues > 0) {
      M.rescues--;
      M.res[k] = k === 'water' ? 12 : k === 'food' ? 4 : 4;
      M.science -= 10;
      rep.notes.push(`EMERGENCY: ${k} ran out. The contingency cache was opened (${M.rescues} left, -10 science).`);
    } else {
      rep.failed = `${k.toUpperCase()} DEPLETED. The crew could not be sustained.`;
    }
  }
  M.report = rep;
  M.history.push(rep);
  M.log.push({ day: dayIndex + 1, text: `End of sol ${dayIndex + 1}. ${rep.notes.join(' ') || 'All systems nominal.'}` });
  return rep;
}
