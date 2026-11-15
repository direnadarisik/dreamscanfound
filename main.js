import { DAYS, EVENTS, CROPS, SEED_KEYS, TEMPS, EQUIPMENT, SCIENCE_VALUES, GAMEPLAY_VALUES, SOURCES } from './data.js';
import { createMission, cap, getRes, addRes, forecast, dailyTick, missionStatus, resetToday, seedCount, bedUnlocked, panelIds, craftOf, diffOf, RES_KEYS, RES_UNITS, RES_NAMES } from './sim.js';
import { openModal, closeModal, isModalOpen, modalClosable, modalElement, showSetup } from './ui.js';
import { createCine, titleButtons, BUTTONS_AT, drawTravel, TRAVEL_LEN } from './intro.js';

const W = 1920, H = 1080, WORLD = 5400, GROUND = 880, HAB_X = 510;
const container = document.getElementById('game-container');
const canvas = document.createElement('canvas');
container.appendChild(canvas);
const ctx = canvas.getContext('2d');
let scale = 1, offX = 0, offY = 0;
function resize() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px';
  scale = Math.min(canvas.width / W, canvas.height / H);
  offX = (canvas.width - W * scale) / 2; offY = (canvas.height - H * scale) / 2;
}
addEventListener('resize', resize);
resize();

function loadImg(name) {
  const img = new Image();
  img.src = `assets/${name}.webp`;
  return img;
}
const IMG = {};
['mars-bg', 'habitat', 'greenhouse', 'solar-panel', 'rover', 'astronaut', 'astronaut-walk', 'astronaut-action', 'alien',
  'water-tank', 'water-recycler', 'water-purifier', 'ice-extractor', 'isru-plant', 'rocket', 'earth', 'spacecraft'].forEach(n => IMG[n] = loadImg(n));
const WALK_FRAMES = [
  { x: 0, y: 0, w: 261, h: 562 }, { x: 265, y: 0, w: 233, h: 563 }, { x: 502, y: 0, w: 217, h: 561 },
  { x: 723, y: 0, w: 280, h: 562 }, { x: 0, y: 567, w: 237, h: 561 }, { x: 241, y: 567, w: 214, h: 563 }
];
const ACTION_FRAMES = [{ x: 0, y: 0, w: 306, h: 471 }, { x: 310, y: 0, w: 367, h: 336 }, { x: 0, y: 475, w: 340, h: 471 }, { x: 344, y: 475, w: 271, h: 318 }];
const ACT = { interact: 0, plant: 1, water: 2, collect: 3 };



const music = new Audio('assets/mars-theme.mp3');
const sfxBlip = new Audio('assets/blip.mp3');
const sfxChime = new Audio('assets/chime.mp3');
const sfxLaunch = new Audio('assets/rocket-launch.mp3');
const sfxSting = new Audio('assets/title-sting.mp3');
music.loop = true; music.volume = 0.4;

function play(a) { a.currentTime = 0; a.play().catch(() => {}); }
let audioOn = false;
function unlockAudio() { if (!audioOn) { audioOn = true; } }
function startMusic() { if (audioOn && music.paused) music.play().catch(() => {}); }

const STATIONS = [
  { id: 'habitat', name: 'Habitat', x: 300, w: 420, img: 'habitat' },
  { id: 'greenhouse', name: 'Greenhouse airlock', x: 900, w: 460, img: 'greenhouse' },
  { id: 'tank', name: 'Water Tanks', x: 1500, w: 170, img: 'water-tank' },
  { id: 'recycler', name: 'Water Recycler', x: 1720, w: 220, img: 'water-recycler', eq: 'recycler' },
  { id: 'purifier', name: 'Water Purifier', x: 1990, w: 170, img: 'water-purifier', eq: 'purifier' },
  { id: 'solar1', name: 'Solar Panel A', x: 2250, w: 200, img: 'solar-panel', panel: true },
  { id: 'solar2', name: 'Solar Panel B', x: 2480, w: 200, img: 'solar-panel', panel: true },
  { id: 'solar3', name: 'Solar Panel C', x: 2710, w: 200, img: 'solar-panel', panel: true },
  { id: 'solar4', name: 'Solar Panel D', x: 2940, w: 200, img: 'solar-panel', panel: true, eq: 'solarx' },
  { id: 'isru', name: 'ISRU Plant (O2 + fuel)', x: 3250, w: 250, img: 'isru-plant' },
  { id: 'rover', name: 'Rover', x: 3650, w: 320, img: 'rover' },
  { id: 'extractor', name: 'Ice Extractor', x: 4120, w: 230, img: 'ice-extractor', eq: 'extractor' },
  { id: 'ice', name: 'Ice Deposit', x: 4450, w: 260, img: null },
  { id: 'ridge', name: 'Jezero Ridge', x: 5000, w: 200, img: null }
];
const ROOM = [
  { id: 'medium', label: 'MEDIUM BIN', x: 330 },
  { id: 'seed-rack', label: 'SEED RACK', x: 530 },
  { id: 'bed0', label: 'BED 1', x: 760, bed: 0 }, { id: 'bed1', label: 'BED 2', x: 980, bed: 1 },
  { id: 'bed2', label: 'BED 3', x: 1200, bed: 2 }, { id: 'bed3', label: 'BED 4', x: 1420, bed: 3 },
  { id: 'irrigation', label: 'WATER LOOP', x: 1630 },
  { id: 'env', label: 'ENV PANEL', x: 1810 }
];

//State
let state = 'boot';
let M = null;
let dayIndex = 0;
let player = { x: HAB_X, y: GROUND, vx: 0, vy: 0, face: 1, walk: 0 };
let roomPlayer = { x: 235, walk: 0, face: 1 };
let actAnim = null;
let cam = 0, suit = 100;
let pickups = [], objectives = [], particles = [], pops = [];
let dialogLine = 0;
let quiz = { q: 0, score: 0, picked: -1, timer: 0 };
let toast = { text: '', t: 0 };
let seedIdx = 0;
let keys = {};
let previousState = 'play';
let menu = null, openPanelKind = null;
let travelT = 0;
const dust = Array.from({ length: 80 }, () => ({ x: Math.random() * W, y: Math.random() * H, s: 1 + Math.random() * 3 }));
const cine = createCine(IMG, { launch: () => play(sfxLaunch), sting: () => play(sfxSting) });

//Save
const SAVE_KEY = 'dreamscanfound-15days-v1';
function hasSave() { try { return !!localStorage.getItem(SAVE_KEY); } catch { return false; } }
function saveGame() { try { localStorage.setItem(SAVE_KEY, JSON.stringify({ M, dayIndex })); } catch {} }
function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch {} }
function loadGame() {
  try {
    const d = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!d?.M) return false;
    M = d.M;
    startDay(d.dayIndex);
    say(`Mission restored at the start of sol ${d.dayIndex + 1}.`);
    return true;
  } catch { return false; }
}

//Helpers
const fmt = v => (Math.round(v * 10) / 10).toString();
const costStr = c => c ? Object.entries(c).map(([k, v]) => `-${fmt(v)} ${k === 'energy' ? 'kWh' : RES_UNITS[k] === 'units' ? k : RES_UNITS[k] + ' ' + k}`).join(', ') : '';
function say(message, duration = 4.5) { toast = { text: message, t: duration }; }
function logEvt(text) { M.log.push({ day: dayIndex + 1, text }); }
function burst(x, y, color) {
  for (let i = 0; i < 18; i++) {
    const a = Math.random() * Math.PI * 2, s = 100 + Math.random() * 250;
    particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 100, life: 0.7, color, room: state === 'greenhouse' });
  }
}
function pop(x, y, message) { pops.push({ x, y, text: message, t: 0, room: state === 'greenhouse' }); }
function actorPos() { return state === 'greenhouse' ? { x: roomPlayer.x, y: 600 } : { x: player.x, y: player.y - 120 }; }
function act(type) { actAnim = { frame: ACT[type], t: 0.5 }; }

//Mission flow
function startNewMission(cfg) {
  M = createMission(cfg);
  dayIndex = 0;
  state = 'travel';
  travelT = 0;
}
function startDay(i) {
  dayIndex = i;
  M.day = i;
  const d = DAYS[i];
  objectives = d.objectives.map(o => ({ ...o, steps: o.steps.map(s => ({ ...s })), done: false, stepIndex: 0, stepCount: 0, collected: 0 }));
  pickups = d.spawns.map(s => ({ ...s, y: GROUND - 20, taken: false }));
  if (M.eq.radar.installed) pickups.push({ item: 'ice', x: 4250 + (i * 137) % 600, y: GROUND - 20, taken: false });
  player = { x: HAB_X, y: GROUND, vx: 0, vy: 0, face: 1, walk: 0 };
  suit = 100;
  dialogLine = 0;
  resetToday(M);
  M.gh.carryMedium = false;
  state = 'intro';
  saveGame();
}
function currentObjective() { return objectives.find(o => !o.done) || null; }
function currentStep(obj = currentObjective()) { return obj?.steps?.[obj.stepIndex] || null; }
function hintFor(obj) {
  if (!obj) return 'All tasks for this sol are complete!';
  if (obj.collect && obj.collected < obj.n) return `Explore and press E beside each ${obj.collect} pickup (${obj.collected}/${obj.n}). Walking over items does not collect them.`;
  const s = currentStep(obj);
  if (!s) return '';
  return s.instruction + ((s.times || 1) > 1 ? ` (${obj.stepCount}/${s.times})` : '');
}
function advanceStep(obj, step, message) {
  obj.stepIndex++;
  obj.stepCount = 0;
  if (message) say(message, 5.5);
  if (obj.stepIndex >= obj.steps.length) {
    obj.done = true;
    M.science += 5 + (obj.science && M.eq.spectro.installed ? 3 : 0);
    play(sfxBlip);
    const p = actorPos();
    burst(p.x, p.y, '#8f8');
    pop(p.x, p.y - 60, 'TASK COMPLETE!');
    logEvt(`Completed: ${obj.label}`);
    checkDayDone();
  }
}
function checkDayDone() {
  if (objectives.length && objectives.every(o => o.done) && (state === 'play' || state === 'greenhouse')) {
    closeModal(true); menu = null;
    quiz = { q: 0, score: 0, picked: -1, timer: 0 };
    setTimeout(() => { if (state === 'play' || state === 'greenhouse') state = 'quiz'; }, 1200);
  }
}
function bump(key, n = 1) {
  for (const obj of objectives) {
    if (obj.done || (obj.collect && obj.collected < obj.n)) continue;
    const s = currentStep(obj);
    if (!s?.track) continue;
    const ks = Array.isArray(s.track) ? s.track : [s.track];
    if (!ks.includes(key)) continue;
    obj.stepCount += n;
    if (obj.stepCount >= (s.times || 1)) advanceStep(obj, s, s.fact);
    else { const p = actorPos(); pop(p.x, p.y - 40, `${obj.stepCount}/${s.times}`); }
    return;
  }
}
function completeStationStep(obj, step, ci) {
  if (obj.collect && obj.collected < obj.n) { say(`Collect ${obj.n} ${obj.collect} first (${obj.collected}/${obj.n}).`); return; }
  for (const [item, count] of Object.entries(step.need || {})) {
    if ((M.inv[item] || 0) < count) { say(`You need ${count} ${item}. Check your inventory (I).`); return; }
  }
  const choice = step.choices ? step.choices[ci] : null;
  const cost = { ...(step.cost || {}), ...(choice?.cost || {}) };
  if (step.ascent) cost.fuel = diffOf(M).ascent;
  for (const [k, v] of Object.entries(cost)) {
    if (M.res[k] < v) { say(`Not enough ${k}: need ${fmt(v)}, you have ${fmt(M.res[k])}. ${k === 'fuel' ? 'Run fuel batches at the ISRU plant.' : ''}`, 6); return; }
  }
  for (const [k, v] of Object.entries(cost)) addRes(M, k, -v);
  for (const [k, n] of Object.entries(step.consume || {})) M.inv[k] = Math.max(0, (M.inv[k] || 0) - n);
  for (const [k, n] of Object.entries(step.give || {})) M.inv[k] = (M.inv[k] || 0) + n;
  if (step.clean) M.panels[step.clean] = 1;
  if (choice?.science) M.science += choice.science;
  act('interact');
  play(sfxBlip);
  obj.stepCount++;
  if (obj.stepCount >= (step.times || 1)) advanceStep(obj, step, choice ? `Selected: ${choice.name}. ${choice.outcome || ''}` : (step.fact || `${obj.label}: step complete.`));
  else say(step.progressMessage || `Progress ${obj.stepCount}/${step.times}.`);
}

// ---------- World interaction ----------
function nearStation() {
  let best = null, bd = 1e9;
  for (const s of STATIONS) {
    const d = Math.abs(player.x - (s.x + s.w / 2));
    if (d < s.w / 2 + 25 && d < bd) { best = s; bd = d; }
  }
  return best;
}
function nearbyPickup() { return pickups.find(p => !p.taken && Math.abs(p.x - player.x) < 78 && Math.abs(player.y - GROUND) < 28); }
function collectNearby(p) {
  p.taken = true;
  if (p.item === 'scrap') addRes(M, 'materials', 3);
  else M.inv[p.item] = (M.inv[p.item] || 0) + 1;
  const obj = objectives.find(o => !o.done && o.collect === p.item && o.collected < o.n);
  if (obj) obj.collected++;
  act('collect');
  play(sfxBlip);
  burst(p.x, p.y, '#ffcf6a');
  pop(p.x, p.y - 60, p.item === 'scrap' ? '+3 materials' : `+1 ${p.item}`);
  say(obj ? `${p.item} collected (${obj.collected}/${obj.n}).${obj.collected >= obj.n ? ' Now go to the marked station.' : ''}` : `${p.item === 'scrap' ? 'Salvage added to building materials' : p.item + ' stored in inventory'}.`);
}
function interactWorld() {
  const pickup = nearbyPickup();
  if (pickup) { collectNearby(pickup); return; }
  const st = nearStation();
  if (!st) { say('Move close to a station or pickup before pressing E.'); return; }
  if (st.id === 'greenhouse') {
    for (const obj of objectives) {
      const s = currentStep(obj);
      if (!obj.done && s?.at === 'greenhouse-entry' && !(obj.collect && obj.collected < obj.n)) advanceStep(obj, s, 'Airlock cycled. Welcome to the greenhouse.');
    }
    roomPlayer.x = 235;
    state = 'greenhouse';
    return;
  }
  openStationMenu(st);
}

function A(label, detail, cost, run, blocked) {
  const lack = cost && Object.entries(cost).find(([k, v]) => M.res[k] < v);
  return {
    label: label + (lack ? `  (not enough ${lack[0]})` : ''), detail: [detail, costStr(cost)].filter(Boolean).join(' · '),
    disabled: !!lack || !!blocked,
    run: () => { for (const [k, v] of Object.entries(cost || {})) addRes(M, k, -v); run(); }
  };
}
function installAction(id) {
  const e = EQUIPMENT.find(x => x.id === id);
  return A(`Install ${e.name}`, e.purpose, e.install, () => {
    M.eq[id].installed = true; M.eq[id].health = 100;
    act('interact'); play(sfxChime);
    logEvt(`Built and installed: ${e.name}.`);
    say(`${e.name} installed and online.`);
    bump('install');
  });
}
function freeActions(st) {
  const eq = M.eq, out = [];
  switch (st.id) {
    case 'habitat': {
      const need = +(0.3 * (100 - suit) / 100).toFixed(2);
      out.push(A('Refill suit oxygen', `Suit ${suit | 0}% → 100% from base O2`, need > 0 ? { oxygen: need } : null, () => { suit = 100; act('interact'); say('Suit oxygen topped up from base storage.'); }, suit >= 99));
      out.push(A('Make growing medium', 'Sterilize and bag 1 unit of clay-based medium', { materials: 2 }, () => { M.inv.medium = (M.inv.medium || 0) + 1; act('interact'); say('+1 bag of growing medium.'); }));
      out.push(A('Open resource management', 'Production, consumption and storage', null, () => openPanel('resources')));
      break;
    }
    case 'tank':
      out.push(A('Read tank levels', `Water ${fmt(M.res.water)}/${cap(M, 'water')} L · raw ${fmt(M.res.raw)}/${cap(M, 'raw')} L`, null, () => {
        const f = forecast(M); act('interact'); bump('tank_check');
        say(`Tanks: ${fmt(M.res.water)} L potable. Net change per sol: ${fmt(f.water.prod - f.water.cons)} L (crew ${fmt(f.water.cons)} L, recycler +${fmt(f.water.prod)} L).`, 6);
      }));
      out.push(A('Build tank expansion', '+40 L water capacity', { materials: 12, energy: 3 }, () => {
        M.capBonus.water = (M.capBonus.water || 0) + 40; act('interact'); logEvt('Built a +40 L water tank expansion.'); say('Water storage capacity increased by 40 L.'); bump('build');
      }));
      break;
    case 'recycler':
      if (!eq.recycler.installed) { out.push(installAction('recycler')); break; }
      out.push(A(`Switch recycler ${eq.recycler.on ? 'OFF' : 'ON'}`, eq.recycler.on ? 'Saves 2 kWh/sol, but no water is recovered' : 'Recovers 75% of crew water for 2 kWh/sol', null, () => {
        eq.recycler.on = !eq.recycler.on; act('interact'); say(`Water recycler ${eq.recycler.on ? 'ON' : 'OFF'}.`); if (eq.recycler.on) bump('recycler_on');
      }));
      out.push(A('Service filters', `Health ${eq.recycler.health | 0}% → 100%`, { materials: 1 }, () => { eq.recycler.health = 100; act('interact'); say('Recycler filters replaced.'); bump('recycler_service'); }));
      break;
    case 'purifier':
      if (!eq.purifier.installed) { out.push(installAction('purifier')); break; }
      out.push(A('Purify raw water batch', `Raw ${fmt(M.res.raw)} L → up to 10 L at 90% yield × ${eq.purifier.health | 0}% health`, { energy: 1 }, () => {
        const amt = Math.min(10, M.res.raw);
        const outL = amt * 0.9 * eq.purifier.health / 100;
        addRes(M, 'raw', -amt);
        const got = addRes(M, 'water', outL);
        eq.purifier.health = Math.max(30, eq.purifier.health - 8);
        M.stats.waterMade += got;
        act('interact'); bump('purify');
        say(`Purified ${fmt(amt)} L raw → ${fmt(got)} L drinking water.${got < outL - 0.05 ? ' Tank full: some water lost!' : ''}`);
      }, M.res.raw < 0.5));
      out.push(A('Replace cartridge', `Health ${eq.purifier.health | 0}% → 100%`, { materials: 2 }, () => { eq.purifier.health = 100; act('interact'); say('Purifier cartridge replaced.'); }));
      break;
    case 'isru':
      if (!eq.oxygen.installed) out.push(installAction('oxygen'));
      else {
        out.push(A(`Switch O2 generator ${eq.oxygen.on ? 'OFF' : 'ON'}`, eq.oxygen.on ? 'Saves 4 kWh/sol, but makes no O2' : '+2 kg O2 per sol for 4 kWh/sol', null, () => { eq.oxygen.on = !eq.oxygen.on; act('interact'); say(`O2 generator ${eq.oxygen.on ? 'ON' : 'OFF'}.`); }));
        out.push(A('Run O2 boost batch', '+1.2 kg oxygen now', { energy: 5 }, () => {
          const g = addRes(M, 'oxygen', 1.2 * eq.oxygen.health / 100); M.stats.o2Made += g; act('interact'); bump('o2_run'); say(`+${fmt(g)} kg O2 produced from atmospheric CO2.`);
        }));
      }
      if (!eq.fuelplant.installed) out.push(installAction('fuelplant'));
      else out.push(A('Run fuel batch', '+5 fuel (methane via Sabatier)', { water: 2, energy: 6 }, () => {
        const g = addRes(M, 'fuel', 5); M.stats.fuelMade += g; act('interact'); bump('fuel_batch'); say(`+${fmt(g)} fuel. Ascent reserve required on sol 15: ${diffOf(M).ascent}.`);
      }));
      break;
    case 'rover':
      out.push(A('Inspect rover', 'Battery, wheels and fuel status', null, () => { act('interact'); say(`Rover OK. Base fuel: ${fmt(M.res.fuel)}. Sol-15 ascent reserve: ${diffOf(M).ascent}.`); }));
      out.push(A('Salvage drive to landing debris', '+4 materials (once per sol)', { fuel: 3 }, () => {
        addRes(M, 'materials', 4); M.today.salvage++; act('interact'); bump('salvage'); say('Salvaged 4 units of building material from the lander debris.');
      }, M.today.salvage >= 1));
      break;
    case 'extractor':
      if (!eq.extractor.installed) { out.push(installAction('extractor')); break; }
      out.push(A('Melt 1 ice → raw water', `+${fmt(6 * eq.extractor.health / 100)} L raw (you have ${M.inv.ice || 0} ice)`, { energy: 2 }, () => {
        M.inv.ice--; const g = addRes(M, 'raw', 6 * eq.extractor.health / 100); act('interact'); bump('extract'); say(`Melted ice: +${fmt(g)} L raw meltwater. Purify it before drinking!`);
      }, !(M.inv.ice > 0)));
      out.push(A('Drill subsurface ice', `+1 ice · 8% wear (health ${eq.extractor.health | 0}%)`, { energy: 5 }, () => {
        M.inv.ice = (M.inv.ice || 0) + 1; eq.extractor.health = Math.max(0, eq.extractor.health - 8); act('interact'); bump('drill'); say('Drilled 1 ice core from below the regolith.');
      }, eq.extractor.health < 20));
      out.push(A('Service bearings', `Health ${eq.extractor.health | 0}% → 100%`, { materials: 3 }, () => { eq.extractor.health = 100; act('interact'); bump('extractor_service'); say('Extractor bearings serviced.'); }));
      break;
    case 'ice':
      out.push(A('Chip ice by hand', `+1 ice, -10% suit O2 (${2 - M.today.chips} left this sol)`, null, () => {
        M.inv.ice = (M.inv.ice || 0) + 1; suit -= 10; M.today.chips++; act('collect'); bump('chip'); say('+1 ice block chipped from the deposit.');
      }, M.today.chips >= 2));
      break;
    case 'ridge':
      out.push(A('Record a field note', '+1 science (once per sol)', null, () => { M.science += 1; M.today.ridgeNote = true; act('interact'); say('Field note: layered sediments hint at ancient water flow.'); }, M.today.ridgeNote));
      break;
    default:
      if (st.panel) {
        if (st.eq && !eq[st.eq].installed) { out.push(installAction(st.eq)); break; }
        const e = M.panels[st.id];
        out.push(A('Read panel output', `Efficiency ${Math.round(e * 100)}% → ${fmt(9 * e)} kWh/sol`, null, () => { act('interact'); say(`${st.name}: ${Math.round(e * 100)}% efficiency, ${fmt(9 * e)} kWh/sol.`); }));
        out.push(A('Clean panel (EVA brush)', '-6% suit O2', null, () => { M.panels[st.id] = 1; suit -= 6; act('interact'); bump('clean'); say(`${st.name} cleaned: 100% efficiency.`); }, e > 0.99));
      }
  }
  return out;
}
function stationStatus(st) {
  const eq = M.eq;
  const m = { recycler: 'recycler', purifier: 'purifier', extractor: 'extractor' }[st.id];
  if (m) return eq[m].installed ? `Installed · health ${eq[m].health | 0}%${m === 'recycler' ? ` · ${eq.recycler.on ? 'ON' : 'OFF'}` : ''}` : 'NOT INSTALLED: build it with materials';
  if (st.id === 'isru') return `O2 generator: ${eq.oxygen.installed ? (eq.oxygen.on ? 'ON' : 'OFF') : 'not installed'} · Fuel plant: ${eq.fuelplant.installed ? 'ready' : 'not installed'} · Fuel ${fmt(M.res.fuel)}`;
  if (st.id === 'tank') return `Water ${fmt(M.res.water)}/${cap(M, 'water')} L · Raw meltwater ${fmt(M.res.raw)}/${cap(M, 'raw')} L`;
  if (st.id === 'habitat') return `Suit O2 ${suit | 0}% · Base O2 ${fmt(M.res.oxygen)} kg · Materials ${fmt(M.res.materials)}`;
  if (st.panel) return st.eq && !eq[st.eq].installed ? 'Empty pad: install an extra solar array' : `Efficiency ${Math.round(M.panels[st.id] * 100)}%`;
  return '';
}
function openStationMenu(st) {
  const acts = [];
  for (const obj of objectives) {
    if (obj.done) continue;
    const s = currentStep(obj);
    if (!s || s.at !== st.id) continue;
    if (obj.collect && obj.collected < obj.n) { acts.push({ label: `★ ${obj.label}`, detail: `Collect ${obj.n} ${obj.collect} first (${obj.collected}/${obj.n})`, disabled: true, run: () => {} }); continue; }
    if (s.choices) s.choices.forEach((c, ci) => acts.push({ label: `★ ${c.name}`, detail: `${s.instruction} ${c.outcome || ''} ${costStr(c.cost)}`, run: () => completeStationStep(obj, s, ci) }));
    else acts.push({ label: `★ ${s.instruction}`, detail: `${obj.label}${(s.times || 1) > 1 ? ` (${obj.stepCount}/${s.times})` : ''} ${costStr(s.ascent ? { fuel: diffOf(M).ascent } : s.cost)}`, run: () => completeStationStep(obj, s) });
  }
  acts.push(...freeActions(st));
  const html = `<h2>${st.name.toUpperCase()}</h2><div class="status">${stationStatus(st)}</div>
    <div class="acts">${acts.map((a, i) => `<button class="act ${a.label.startsWith('★') ? 'task' : ''}" data-i="${i}" ${a.disabled ? 'disabled' : ''}><b>${i + 1}. ${a.label}</b><small>${a.detail || ''}</small></button>`).join('')}</div>
    <p class="hint">Click or press 1-${acts.length} · E = first available option · ESC = close</p>`;
  const el = openModal(html, { onClose: () => { menu = null; } });
  menu = { acts };
  el.querySelectorAll('[data-i]').forEach(b => b.addEventListener('click', () => runMenu(+b.dataset.i)));
}
function runMenu(i) {
  const a = menu?.acts[i];
  if (!a || a.disabled) return;
  closeModal();
  menu = null;
  a.run();
}

//Greenhouse
function nearRoom() {
  let best = null, bd = 95;
  for (const s of ROOM) { const d = Math.abs(roomPlayer.x - s.x); if (d < bd) { best = s; bd = d; } }
  return best;
}
function bedInfo(b) {
  if (b.stage === 'empty') return 'Empty bed: add growing medium.';
  if (b.stage === 'medium') return 'Medium added: press E to prepare it.';
  if (b.stage === 'dead') return 'Crop failed. Press E to clear the bed.';
  if (b.stage === 'prepared' && !b.seeds) return 'Prepared: select a seed at the rack, then plant.';
  const c = CROPS[b.crop];
  const need = c.water * b.seeds;
  return `${c.name}: ${b.seeds} seeds · growth ${fmt(b.growth)}/${c.days} sols · water ${fmt(b.water)} L (needs ${fmt(need)} L/sol) · light ${M.gh.lights ? 'ON' : 'OFF'} (${c.light}) · ${M.gh.temp}°C (ok ${c.temp[0]}-${c.temp[1]}) · health ${Math.max(0, b.health) | 0}%`;
}
function bedInteract(i) {
  const b = M.beds[i];
  if (!bedUnlocked(M, i)) {
    const e = EQUIPMENT.find(x => x.id === 'veggie');
    if (M.res.materials >= e.install.materials && M.res.energy >= e.install.energy) {
      addRes(M, 'materials', -e.install.materials); addRes(M, 'energy', -e.install.energy);
      M.eq.veggie.installed = true; act('interact'); play(sfxChime); logEvt('Built Veggie-style LED growth units: beds 3-4 unlocked.');
      say('LED growth units assembled. Beds 3 and 4 are now available.');
    } else say(`Bed locked. Build LED growth units here for ${e.install.materials} materials + ${e.install.energy} kWh.`);
    return;
  }
  if (b.stage === 'dead') { Object.assign(b, { stage: 'empty', crop: null, seeds: 0, growth: 0, water: 0, health: 100 }); act('collect'); say('Dead crop and spent medium cleared.'); return; }
  if (b.stage === 'empty') {
    if (!M.gh.carryMedium) { say('Take a bag of growing medium from the MEDIUM BIN first.'); return; }
    M.gh.carryMedium = false; b.stage = 'medium'; act('plant'); play(sfxBlip); bump('gh_medium');
    say('Arcillite growing medium added. Press E again to level and pre-moisten it.');
    return;
  }
  if (b.stage === 'medium') {
    if (M.res.water < 0.5) { say('Not enough stored water to pre-moisten the medium.'); return; }
    addRes(M, 'water', -0.5); b.stage = 'prepared'; b.water = 0.5; act('water'); bump('gh_prepare');
    say('Medium leveled and pre-moistened. Select a seed at the SEED RACK, then plant one seed per press of E.');
    return;
  }
  const c = b.crop ? CROPS[b.crop] : null;
  if (c && b.growth >= c.days) {
    const amt = Math.round(b.seeds * c.yieldPer * Math.max(0, b.health) / 100 * 2) / 2;
    const got = addRes(M, 'food', amt);
    M.stats.harvested += got;
    logEvt(`Harvested ${c.name}: +${fmt(got)} food rations.`);
    Object.assign(b, { stage: 'empty', crop: null, seeds: 0, growth: 0, water: 0, health: 100 });
    act('collect'); play(sfxChime); burst(roomPlayer.x, 620, '#8f8'); pop(roomPlayer.x, 520, `+${fmt(got)} FOOD`);
    bump('gh_harvest');
    say(`Harvested by hand: +${fmt(got)} food rations stored. The spent medium was removed, so add new medium to replant.`);
    return;
  }
  const sel = M.gh.selected;
  if (b.growth === 0 && b.seeds < 4 && sel && (!b.crop || b.crop === sel) && (M.inv[sel + '_seed'] || 0) > 0) {
    M.inv[sel + '_seed']--; b.seeds++; b.crop = sel; b.stage = 'planted';
    act('plant'); play(sfxBlip); pop(roomPlayer.x, 520, `SEED ${b.seeds}/4`); bump('gh_plant');
    say(`Planted 1 ${CROPS[sel].name} seed (${b.seeds}/4 in this bed). ${CROPS[sel].days} sols to harvest.`);
    return;
  }
  if (M.gh.can > 0 && b.seeds > 0) {
    const add = Math.min(1, M.gh.can, 3 - b.water);
    if (add <= 0.01) { say('The medium is saturated (3 L max). Overwatering would waste water.'); return; }
    b.water += add; M.gh.can -= add; act('water'); bump('gh_water');
    say(`Watered: +${fmt(add)} L. Bed holds ${fmt(b.water)} L; it uses ${fmt(CROPS[b.crop].water * b.seeds)} L per sol.`);
    return;
  }
  if (b.seeds > 0) { act('interact'); bump('gh_inspect'); say(bedInfo(b), 7); return; }
  say(sel ? `No ${CROPS[sel].name} seeds left, or a different crop is already in this bed.` : 'Select a seed type at the SEED RACK first (Q to choose, E to confirm).');
}
function interactRoom() {
  if (roomPlayer.x < 175) { state = 'play'; player.x = 1130; player.y = GROUND; say('Back outside. Suit oxygen is draining again.'); return; }
  const st = nearRoom();
  if (!st) { say('Walk up to a labelled station.'); return; }
  if (st.bed !== undefined) { bedInteract(st.bed); return; }
  if (st.id === 'medium') {
    if (M.gh.carryMedium) { say('You are already carrying a bag of medium. Add it to an empty bed.'); return; }
    if ((M.inv.medium || 0) <= 0) { say('No growing medium left. Make more at the habitat (2 materials each).'); return; }
    M.inv.medium--; M.gh.carryMedium = true; act('collect'); say('Picked up 1 bag of arcillite growing medium. Carry it to an empty bed.');
  } else if (st.id === 'seed-rack') {
    const k = SEED_KEYS[seedIdx];
    if ((M.inv[k + '_seed'] || 0) <= 0) { say(`No ${CROPS[k].name} seeds left. Use Q to choose another.`); return; }
    M.gh.selected = k; act('interact');
    say(`${CROPS[k].name} selected (${CROPS[k].days} sols to harvest). ${CROPS[k].src}`, 6);
  } else if (st.id === 'irrigation') {
    if (M.gh.can >= 1.99) { say('The watering can is already full (2 L).'); return; }
    const need = 2 - M.gh.can;
    if (M.res.water < need) { say('Not enough water in storage. Produce more with the extractor and purifier.'); return; }
    addRes(M, 'water', -need); addRes(M, 'energy', -0.2); M.gh.can = 2; act('interact');
    say(`Watering can filled: -${fmt(need)} L from the tanks. Pour it on a planted bed with E.`);
  } else if (st.id === 'env') {
    M.gh.lights = !M.gh.lights; act('interact');
    if (M.gh.lights) bump('gh_lights');
    say(`LED grow lights ${M.gh.lights ? 'ON' : 'OFF'}. Plants need light to grow. Setpoint ${M.gh.temp}°C (Q to change).`);
  }
}
function cycleRoom(dir) {
  const st = nearRoom();
  if (st?.id === 'env') {
    const i = (TEMPS.indexOf(M.gh.temp) + dir + TEMPS.length) % TEMPS.length;
    M.gh.temp = TEMPS[i];
    say(`Temperature setpoint ${M.gh.temp}°C. Higher temperatures use more heater energy. Check each crop's range.`);
  } else {
    seedIdx = (seedIdx + dir + SEED_KEYS.length) % SEED_KEYS.length;
    const k = SEED_KEYS[seedIdx];
    say(`Seed: ${CROPS[k].name} (x${M.inv[k + '_seed'] || 0}) · ${CROPS[k].days} sols · press E at the SEED RACK to select.`, 3);
  }
}

//Panels
function openPanel(kind) {
  if (!M) return;
  openPanelKind = kind;
  let html = '';
  const f = forecast(M);
  if (kind === 'inventory') {
    const items = Object.entries(M.inv).filter(([, n]) => n > 0);
    html = `<h2>INVENTORY</h2><div class="cols"><div><h3>Carried & stored items</h3><table>${items.map(([k, n]) => `<tr><td>${k.endsWith('_seed') ? CROPS[k.slice(0, -5)].name + ' seeds' : k === 'medium' ? 'Growing medium bags' : k}</td><td>x${n}</td></tr>`).join('') || '<tr><td>(empty)</td></tr>'}</table>
      <p>Carrying medium: ${M.gh.carryMedium ? 'yes' : 'no'} · Watering can: ${fmt(M.gh.can)}/2 L · Selected seed: ${M.gh.selected ? CROPS[M.gh.selected].name : 'none'}</p></div>
      <div><h3>Base resources</h3><table>${RES_KEYS.map(k => `<tr><td>${RES_NAMES[k]}</td><td>${fmt(getRes(M, k))} / ${cap(M, k)} ${RES_UNITS[k]}</td></tr>`).join('')}<tr><td>Raw meltwater</td><td>${fmt(M.res.raw)} / ${cap(M, 'raw')} L</td></tr></table></div></div>`;
  } else if (kind === 'objectives') {
    html = `<h2>SOL ${dayIndex + 1} OBJECTIVES · ${DAYS[dayIndex].title}</h2>${objectives.map(o => `<div class="obj ${o.done ? 'done' : ''}"><b>${o.done ? '✔' : '▸'} ${o.label}</b>${o.collect ? ` <small>(collect ${Math.min(o.collected, o.n)}/${o.n} ${o.collect})</small>` : ''}<ol>${o.steps.map((s, i) => `<li class="${i < o.stepIndex || o.done ? 'done' : i === o.stepIndex ? 'cur' : ''}">${s.instruction}</li>`).join('')}</ol></div>`).join('')}
      <h3>Mission timeline</h3><p class="small">${DAYS.map((d, i) => `<span class="${i < dayIndex ? 'done' : i === dayIndex ? 'cur' : ''}">S${i + 1} ${d.title}</span>`).join(' · ')}</p>`;
  } else if (kind === 'resources') {
    const row = k => { const r = f[k] || { prod: 0, cons: 0 }; const y = M.report?.rows[k]; return `<tr><td>${RES_NAMES[k]}</td><td>${fmt(getRes(M, k))}</td><td>${cap(M, k)} ${RES_UNITS[k]}</td><td class="g">+${fmt(r.prod)}</td><td class="r">-${fmt(r.cons)}</td><td>${fmt(M.today.prod[k] || 0)} / ${fmt(M.today.cons[k] || 0)}</td><td>${y ? (y.end - y.start >= 0 ? '+' : '') + fmt(y.end - y.start) : '-'}</td></tr>`; };
    const eqRow = e => { const s = M.eq[e.id]; return `<tr><td>${e.name}</td><td>${s.installed ? (['recycler', 'oxygen'].includes(e.id) ? (s.on ? 'ON' : 'OFF') : 'installed') : '<span class="r">not installed</span>'}</td><td>${s.installed && ['extractor', 'purifier', 'recycler', 'oxygen'].includes(e.id) ? (s.health | 0) + '%' : ''}</td></tr>`; };
    html = `<h2>RESOURCE MANAGEMENT</h2>
      <table class="grid"><tr><th>Resource</th><th>Now</th><th>Capacity</th><th>Auto prod/sol</th><th>Auto use/sol</th><th>Today manual +/-</th><th>Last sol net</th></tr>${RES_KEYS.map(row).join('')}</table>
      <div class="cols"><div><h3>Energy loads (kWh/sol)</h3><table>${f.energy.loads.map(l => `<tr><td>${l[0]}</td><td>${fmt(l[1])}</td></tr>`).join('')}<tr><td><b>Solar production</b></td><td class="g">${fmt(f.energy.prod)}</td></tr></table>
        <p>Panels: ${panelIds(M).map(id => `${id.slice(-1) === '1' ? 'A' : id.slice(-1) === '2' ? 'B' : id.slice(-1) === '3' ? 'C' : 'D'} ${Math.round(M.panels[id] * 100)}%`).join(' · ')}</p>
        <h3>Water system</h3><p>Crew use ${fmt(f.water.cons)} L/sol · recycler recovers ${fmt(f.water.prod)} L/sol · plant beds draw ${fmt(f.plantWater)} L/sol from the medium · raw meltwater buffer ${fmt(M.res.raw)} L. Total water made this mission: ${fmt(M.stats.waterMade)} L.</p></div>
      <div><h3>Equipment</h3><table>${EQUIPMENT.map(eqRow).join('')}</table>
        <h3>Greenhouse</h3><p>${M.beds.map((b, i) => `Bed ${i + 1}: ${bedUnlocked(M, i) ? (b.crop ? `${CROPS[b.crop].short} ${fmt(b.growth)}/${CROPS[b.crop].days}` : b.stage) : 'locked'}`).join('<br>')}</p>
        <p>Emergency caches left: ${M.rescues} · Ascent fuel needed on sol 15: ${diffOf(M).ascent}</p></div></div>`;
  } else if (kind === 'map') {
    const px = x => (x / WORLD * 100).toFixed(2);
    html = `<h2>JEZERO BASE MAP</h2><div class="map">${STATIONS.map(s => `<div class="pin ${s.eq && !M.eq[s.eq].installed ? 'off' : ''} ${objectives.some(o => !o.done && currentStep(o)?.at === s.id) || (s.id === 'greenhouse' && objectives.some(o => !o.done && currentStep(o)?.at === 'greenhouse-entry')) ? 'target' : ''}" style="left:${px(s.x + s.w / 2)}%"><span>${s.name}</span></div>`).join('')}
      ${pickups.filter(p => !p.taken).map(p => `<div class="dot ${p.item}" style="left:${px(p.x)}%" title="${p.item}"></div>`).join('')}
      <div class="me" style="left:${px(state === 'greenhouse' ? 1130 : player.x)}%">▲ YOU</div></div>
      <p class="small">Orange pins = active task targets · faded = not installed · dots: <span class="ice">■</span> ice <span class="rock">■</span> rock <span class="part">■</span> part <span class="scrap">■</span> salvage</p>`;
  } else if (kind === 'log') {
    html = `<h2>MISSION LOG</h2><div class="log">${M.log.slice().reverse().map(l => `<p><b>SOL ${l.day}</b> ${l.text}</p>`).join('')}</div>`;
  } else if (kind === 'info') {
    const c = craftOf(M), d = diffOf(M);
    html = `<h2>MISSION INFORMATION</h2><p>Team DREAMSCANFOUND · ${c.name} · ${d.name} · equipment: ${EQUIPMENT.filter(e => M.cfg.equip.includes(e.id)).map(e => e.name).join(', ') || 'none'}</p>
      <div class="cols"><div><h3>Science values (cited)</h3><ul>${SCIENCE_VALUES.map(s => `<li>${s}</li>`).join('')}</ul></div>
      <div><h3>Gameplay simplifications</h3><ul>${GAMEPLAY_VALUES.map(s => `<li>${s}</li>`).join('')}</ul></div></div>
      <h3>Crop growth assumptions</h3><table class="grid"><tr><th>Crop</th><th>Sols</th><th>Water/seed/sol</th><th>Temp</th><th>Basis</th></tr>${SEED_KEYS.map(k => { const x = CROPS[k]; return `<tr><td>${x.name}</td><td>${x.days}</td><td>${x.water} L</td><td>${x.temp[0]}-${x.temp[1]}°C</td><td class="small">${x.src}</td></tr>`; }).join('')}</table>
      <p class="small">Only microgreens can be harvested within 15 sols. Full crops are left for the next crew.</p>
      <h3>Sources</h3><ul class="small">${SOURCES.map(s => `<li>${s}</li>`).join('')}</ul>
      <h3>Controls</h3><p class="small">A/D move · SHIFT run · SPACE jump · E interact · Q choose (greenhouse) · I inventory · O objectives · R resources · M map · L log · N info · ESC pause. Progress is saved at the start of every sol.</p>`;
  }
  openModal(html, { wide: true, onClose: () => { openPanelKind = null; } });
}

//Events, day end
function applyFx(fx) {
  const mul = diffOf(M).cons;
  for (const [k, v] of Object.entries(fx.res || {})) addRes(M, k, v < 0 ? v * mul : v);
  if (fx.dust) for (const id of panelIds(M)) M.panels[id] = Math.max(0.3, Math.min(1, M.panels[id] - fx.dust * (fx.dust > 0 ? mul : 1)));
  if (fx.cleanAll) for (const id of panelIds(M)) M.panels[id] = 1;
  for (const [id, v] of Object.entries(fx.eq || {})) if (M.eq[id].installed) M.eq[id].health = v >= 100 ? 100 : Math.max(0, Math.min(100, M.eq[id].health + v * mul));
  if (fx.flags) Object.assign(M.flags, fx.flags);
  if (fx.ghHealth) for (const b of M.beds) if (b.stage === 'planted') { b.health += fx.ghHealth * mul; if (b.health <= 0) b.stage = 'dead'; }
  if (fx.science) M.science += fx.science;
  if (fx.seedLoss) for (let n = 0; n < fx.seedLoss; n++) { const k = SEED_KEYS.slice().sort((a, b) => (M.inv[b + '_seed'] || 0) - (M.inv[a + '_seed'] || 0))[0]; if (M.inv[k + '_seed'] > 0) M.inv[k + '_seed']--; }
}
function showEvent(ev) {
  state = 'event';
  const mul = diffOf(M).cons;
  const blocked = o => Object.entries(o.fx.res || {}).some(([k, v]) => ['materials', 'fuel'].includes(k) && v < 0 && M.res[k] < -v * mul);
  const el = openModal(`<h2 class="warn">⚠ MISSION EVENT · ${ev.title}</h2><p>${ev.info}</p><p class="small">Current: water ${fmt(M.res.water)} L · food ${fmt(M.res.food)} · O2 ${fmt(M.res.oxygen)} kg · energy ${fmt(M.res.energy)} kWh · fuel ${fmt(M.res.fuel)} · materials ${fmt(M.res.materials)}</p>
    <div class="acts">${ev.options.map((o, i) => `<button class="act" data-o="${i}" ${blocked(o) ? 'disabled' : ''}><b>${i + 1}. ${o.label}</b><small>${o.detail}${blocked(o) ? ' (not enough resources)' : ''}</small></button>`).join('')}</div>
    <p class="hint">Choose a response. Every decision has consequences.</p>`, { closable: false });
  menu = { acts: ev.options.map((o, i) => ({ disabled: blocked(o), run: () => choose(i) })) };
  function choose(i) {
    const o = ev.options[i];
    applyFx(o.fx);
    logEvt(`Event "${ev.title}": chose "${o.label}". ${o.detail}`);
    say(`Decision logged: ${o.label}.`);
    state = 'play';
  }
  el.querySelectorAll('[data-o]').forEach(b => b.addEventListener('click', () => { closeModal(true); menu = null; choose(+b.dataset.o); }));
}
function finishDay() {
  M.quizScore += quiz.score;
  const rep = dailyTick(M, dayIndex);
  state = 'dayEnd';
  const rows = RES_KEYS.map(k => { const r = rep.rows[k]; const d = r.end - r.start; return `<tr><td>${RES_NAMES[k]}</td><td>${fmt(r.start)}</td><td class="g">+${fmt(r.prod)}</td><td class="r">-${fmt(r.cons)}</td><td>${fmt(r.end)} / ${cap(M, k)}</td><td class="${d >= 0 ? 'g' : 'r'}">${d >= 0 ? '+' : ''}${fmt(d)}</td></tr>`; }).join('');
  const last = dayIndex >= DAYS.length - 1;
  const el = openModal(`<h2>SOL ${dayIndex + 1} REPORT · ${DAYS[dayIndex].title}</h2><p>Science quiz: ${quiz.score}/5 · Science points: ${M.science}</p>
    <table class="grid"><tr><th>Resource</th><th>Start</th><th>Produced</th><th>Consumed</th><th>End / cap</th><th>Daily change</th></tr>${rows}</table>
    <h3>Overnight</h3><ul>${rep.notes.map(n => `<li>${n}</li>`).join('') || '<li>All systems nominal.</li>'}</ul>
    <button class="primary" data-primary>${rep.failed ? 'MISSION STATUS ▶' : last ? 'COMPLETE MISSION ▶' : `BEGIN SOL ${dayIndex + 2} ▶`}</button>`, { wide: true, closable: false });
  el.querySelector('[data-primary]').addEventListener('click', () => {
    closeModal(true);
    if (rep.failed) endMission(false, rep.failed);
    else if (last) endMission(true);
    else startDay(dayIndex + 1);
  });
}
function endMission(won, reason = '') {
  state = won ? 'win' : 'fail';
  clearSave();
  const total = M.quizScore + M.science + (won ? 50 : 0);
  const rank = total >= 230 ? 'Mission Commander' : total >= 170 ? 'Chief Scientist' : total >= 110 ? 'Mission Specialist' : 'Cadet';
  const el = openModal(`<h2 class="${won ? '' : 'warn'}">${won ? 'MISSION COMPLETE!' : 'MISSION FAILED'}</h2>
    <p>${won ? 'DREAMSCANFOUND survived all 15 sols on Mars and launched for home!' : reason + ` (sol ${dayIndex + 1})`}</p>
    <table class="grid"><tr><td>Quiz score</td><td>${M.quizScore}/${(dayIndex + 1) * 5}</td></tr><tr><td>Science points</td><td>${M.science}</td></tr>
    <tr><td>Food harvested</td><td>${fmt(M.stats.harvested)} rations</td></tr><tr><td>Water produced/recovered</td><td>${fmt(M.stats.waterMade)} L</td></tr>
    <tr><td>Oxygen produced</td><td>${fmt(M.stats.o2Made)} kg</td></tr><tr><td>Fuel produced</td><td>${fmt(M.stats.fuelMade)}</td></tr>
    <tr><td><b>Total score</b></td><td><b>${total}</b> · Rank: ${rank}</td></tr></table>
    <button class="primary" data-primary>RETURN TO TITLE</button>`, { closable: false });
  el.querySelector('[data-primary]').addEventListener('click', () => { closeModal(true); M = null; state = 'cine'; cine.t = BUTTONS_AT; });
}

//Input
const PANEL_KEYS = { KeyI: 'inventory', KeyO: 'objectives', KeyR: 'resources', KeyM: 'map', KeyL: 'log', KeyN: 'info' };
function beginNew() { clearSave(); state = 'setup'; showSetup(cfg => startNewMission(cfg)); }
function beginContinue() { if (hasSave() && loadGame()) startMusic(); }
addEventListener('keydown', e => {
  unlockAudio();
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) e.preventDefault();
  if (e.repeat && ['KeyE', 'KeyQ', 'Enter', 'Space', 'KeyI', 'KeyO', 'KeyR', 'KeyM', 'KeyL', 'KeyN'].includes(e.code)) return;
  keys[e.code] = true;
  if (isModalOpen()) {
    if (menu) {
      if (/^Digit[1-9]$/.test(e.code)) { const i = +e.code.slice(5) - 1; const a = menu.acts[i]; if (a && !a.disabled) { if (state === 'event') { closeModal(true); const r = a.run; menu = null; r(); } else runMenu(i); } }
      else if ((e.code === 'KeyE' || e.code === 'Enter') && state !== 'event') { const i = menu.acts.findIndex(a => !a.disabled); if (i >= 0) runMenu(i); }
    } else if (e.code === 'Enter') modalElement()?.querySelector('[data-primary]')?.click();
    if (PANEL_KEYS[e.code] && PANEL_KEYS[e.code] === openPanelKind) closeModal();
    else if (e.code === 'Escape' && modalClosable()) closeModal();
    return;
  }
  if (state === 'boot') { state = 'cine'; return; }
  if (state === 'cine') {
    if (cine.t < BUTTONS_AT) { if (['Space', 'Escape', 'Enter'].includes(e.code)) cine.skip(); }
    else if (e.code === 'Enter') beginNew();
    else if (e.code === 'KeyC') beginContinue();
    return;
  }
  if (state === 'travel' && ['Space', 'Enter', 'Escape'].includes(e.code)) { travelT = TRAVEL_LEN; return; }
  if (state === 'intro' && ['Enter', 'Space', 'KeyE'].includes(e.code)) { advanceDialog(); return; }
  if (state === 'play' || state === 'greenhouse') {
    if (e.code === 'KeyE') state === 'greenhouse' ? interactRoom() : interactWorld();
    if (PANEL_KEYS[e.code]) openPanel(PANEL_KEYS[e.code]);
    if (e.code === 'Escape') { previousState = state; state = 'paused'; }
    if (state === 'greenhouse' && (e.code === 'KeyQ' || e.code === 'ArrowUp' || e.code === 'ArrowDown')) cycleRoom(e.code === 'ArrowDown' ? 1 : -1);
    return;
  }
  if (state === 'paused' && e.code === 'Escape') { state = previousState; return; }
  if (state === 'quiz' && /^Digit[1-4]$/.test(e.code)) answer(+e.code.slice(5) - 1);
});
addEventListener('keyup', e => keys[e.code] = false);
addEventListener('blur', () => { keys = {}; });

function canvasPoint(e) {
  const r = canvas.getBoundingClientRect();
  const dpr = canvas.width / r.width;
  return { mx: ((e.clientX - r.left) * dpr - offX) / scale, my: ((e.clientY - r.top) * dpr - offY) / scale };
}
canvas.addEventListener('mousedown', e => {
  unlockAudio();
  if (isModalOpen()) return;
  const { mx, my } = canvasPoint(e);
  if (state === 'boot') state = 'cine';
  else if (state === 'cine') {
    if (cine.t < BUTTONS_AT) { cine.skip(); return; }
    for (const b of titleButtons(hasSave())) {
      if (mx > b.x && mx < b.x + b.w && my > b.y && my < b.y + b.h) b.id === 'start' ? beginNew() : beginContinue();
    }
  } else if (state === 'travel') travelT = TRAVEL_LEN;
  else if (state === 'intro') advanceDialog();
  else if (state === 'paused') state = previousState;
  else if (state === 'quiz') {
    for (let i = 0; i < 4; i++) { const by = 480 + i * 110; if (mx > 360 && mx < 1560 && my > by && my < by + 90) answer(i); }
  }
});
document.querySelectorAll('#hud button[data-panel]').forEach(b => b.addEventListener('click', () => {
  if (state !== 'play' && state !== 'greenhouse') return;
  if (isModalOpen()) { const same = openPanelKind === b.dataset.panel; closeModal(); if (same) return; }
  openPanel(b.dataset.panel);
}));
function advanceDialog() {
  dialogLine++;
  if (dialogLine >= DAYS[dayIndex].intro.length) {
    const ev = EVENTS[dayIndex];
    if (ev) showEvent(ev); else state = 'play';
  }
}
function answer(i) {
  if (quiz.picked >= 0 || quiz.q >= 5) return;
  const q = DAYS[dayIndex].quiz[quiz.q];
  quiz.picked = i; quiz.timer = 2.2;
  if (i === q.a) { quiz.score++; play(sfxChime); } else play(sfxBlip);
}

//Update
function update(dt) {
  dust.forEach(p => { p.x -= p.s * 30 * dt; if (p.x < 0) p.x = W; });
  particles.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 373 * dt; p.life -= dt; });
  particles = particles.filter(p => p.life > 0);
  pops.forEach(p => p.t += dt);
  pops = pops.filter(p => p.t < 1.2);
  if (toast.t > 0) toast.t -= dt;
  if (actAnim) { actAnim.t -= dt; if (actAnim.t <= 0) actAnim = null; }
  document.getElementById('hud').style.display = (state === 'play' || state === 'greenhouse') && M ? 'flex' : 'none';
  if (state === 'cine') { cine.update(dt); return; }
  if (state === 'travel') { travelT += dt; if (travelT >= TRAVEL_LEN) { startMusic(); startDay(0); } return; }
  if (isModalOpen()) return;
  if (state === 'quiz' && quiz.picked >= 0) {
    quiz.timer -= dt;
    if (quiz.timer <= 0) { quiz.q++; quiz.picked = -1; if (quiz.q >= 5) finishDay(); }
  }
  const running = keys.ShiftLeft || keys.ShiftRight;
  const dir = actAnim ? 0 : (keys.KeyD || keys.ArrowRight ? 1 : 0) - (keys.KeyA || keys.ArrowLeft ? 1 : 0);
  if (state === 'greenhouse') {
    roomPlayer.x = Math.max(80, Math.min(1860, roomPlayer.x + dir * (running ? 520 : 350) * dt));
    if (dir) { roomPlayer.walk += dt * (running ? 14 : 9); roomPlayer.face = dir; }
    return;
  }
  if (state !== 'play') return;
  player.vx = dir * (running ? 680 : 420);
  if (dir) { player.face = dir; player.walk += dt * (running ? 14 : 9); }
  if ((keys.Space || keys.KeyW || keys.ArrowUp) && player.y >= GROUND && !actAnim) player.vy = -620;
  player.vy += 3.71 * 260 * dt; // Mars gravity makes jumps floaty
  player.x = Math.max(60, Math.min(WORLD - 60, player.x + player.vx * dt));
  player.y = Math.min(GROUND, player.y + player.vy * dt);
  if (player.y >= GROUND) player.vy = 0;
  cam += (Math.max(0, Math.min(WORLD - W, player.x - W / 2)) - cam) * Math.min(1, dt * 6);
  const inside = Math.abs(player.x - HAB_X) < 210;
  if (inside && suit < 100) { const add = Math.min(100 - suit, 20 * dt); suit += add; addRes(M, 'oxygen', -add * 0.003); }
  else if (!inside) suit -= (running ? 2.4 : 1.6) * dt;
  if (suit <= 0) {
    suit = 100; player.x = HAB_X; player.y = GROUND;
    addRes(M, 'oxygen', -1.5 * diffOf(M).cons);
    M.science -= 3;
    logEvt('Suit oxygen depleted: emergency return to the habitat (-1.5 kg base O2, -3 science).');
    say('Suit oxygen depleted! Emergency return to the habitat. That cost base oxygen and science.');
  }
}

//Draw
function drawImgFit(img, x, y, w) {
  if (!img.complete || !img.naturalWidth) return;
  const h = w * img.naturalHeight / img.naturalWidth;
  ctx.drawImage(img, x, y - h, w, h);
}
function drawAstronaut(x, baseY, scaleH, facing, walking, phase) {
  ctx.save();
  ctx.translate(x, baseY);
  ctx.scale(facing, 1);
  const actA = IMG['astronaut-action'], atlas = IMG['astronaut-walk'], idle = IMG.astronaut;
  if (actAnim && actA.complete && actA.naturalWidth) {
    const f = ACTION_FRAMES[actAnim.frame];
    const h = scaleH * f.h / 471, w = h * f.w / f.h;
    ctx.drawImage(actA, f.x, f.y, f.w, f.h, -w / 2, -h, w, h);
  } else if (walking && atlas.complete && atlas.naturalWidth) {
    const f = WALK_FRAMES[Math.floor(phase) % WALK_FRAMES.length];
    const w = scaleH * f.w / f.h;
    ctx.drawImage(atlas, f.x, f.y, f.w, f.h, -w / 2, -scaleH, w, scaleH);
  } else if (idle.complete && idle.naturalWidth) {
    const bob = Math.sin(performance.now() / 400) * 2;
    const w = scaleH * idle.naturalWidth / idle.naturalHeight;
    ctx.drawImage(idle, -w / 2, -scaleH + bob, w, scaleH - bob);
  }
  ctx.restore();
}
function panel(x, y, w, h) {
  ctx.fillStyle = 'rgba(20,8,6,0.86)'; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#ff8a3d'; ctx.lineWidth = 6; ctx.strokeRect(x, y, w, h);
}
function text(t, x, y, size, color = '#fff', font = 'VT323', align = 'left') {
  ctx.font = `${size}px "${font}"`; ctx.fillStyle = color; ctx.textAlign = align; ctx.fillText(t, x, y);
}
function wrap(t, x, y, maxW, size, color, lineHeight) {
  ctx.font = `${size}px VT323`;
  let line = '', yy = y;
  for (const word of t.split(' ')) {
    if (ctx.measureText(line + word).width > maxW && line) { text(line, x, yy, size, color); line = ''; yy += lineHeight; }
    line += word + ' ';
  }
  text(line, x, yy, size, color);
}
function isTargetStation(id) {
  return objectives.some(o => { if (o.done) return false; const s = currentStep(o); if (!s) return false; if (o.collect && o.collected < o.n) return false; return s.at === id || (id === 'greenhouse' && s.at === 'greenhouse-entry'); });
}
function drawWorld(t) {
  const bg = IMG['mars-bg'];
  if (bg.complete && bg.naturalWidth) { const bx = -(cam * 0.2) % W; ctx.drawImage(bg, bx, 0, W, H); ctx.drawImage(bg, bx + W, 0, W, H); }
  else { ctx.fillStyle = '#d99a5c'; ctx.fillRect(0, 0, W, H); }
  ctx.save();
  ctx.translate(-Math.round(cam), 0);
  for (let x = Math.floor(cam / 16) * 16; x < cam + W + 16; x += 16) {
    const h = Math.round((Math.sin(x * 0.01) * 6 + Math.sin(x * 0.037) * 4) / 4) * 4;
    ctx.fillStyle = '#a3401f'; ctx.fillRect(x, GROUND + h, 16, H - GROUND);
    ctx.fillStyle = '#c95a2c'; ctx.fillRect(x, GROUND + h, 16, 8);
    if ((x * 7) % 112 === 0) { ctx.fillStyle = '#6e2814'; ctx.fillRect(x, GROUND + 50 + h, 12, 8); }
  }
  // Pipes between habitat and water systems
  ctx.fillStyle = '#7d6a5c'; ctx.fillRect(720, GROUND - 14, 1440, 8);
  for (const s of STATIONS) {
    if (s.x + s.w + 300 < cam || s.x - 300 > cam + W) continue;
    const off = s.eq && M && !M.eq[s.eq].installed;
    if (s.img) {
      ctx.globalAlpha = off ? 0.3 : 1;
      drawImgFit(IMG[s.img], s.x, GROUND + 10, s.w);
      ctx.globalAlpha = 1;
      if (off) text('NOT INSTALLED', s.x + s.w / 2, GROUND - 40, 14, '#ffd9b0', 'Press Start 2P', 'center');
      if (s.panel && !off && M) { const e = M.panels[s.id]; ctx.fillStyle = `rgba(150,80,40,${(1 - e) * 0.8})`; ctx.fillRect(s.x + 20, GROUND - 170, s.w - 40, 90); }
    } else if (s.id === 'ice') {
      ctx.fillStyle = '#dff4ff';
      for (let i = 0; i < 5; i++) ctx.fillRect(s.x + i * 50, GROUND - 20 - (i % 2) * 24, 44, 30 + (i % 2) * 24);
    } else {
      ctx.fillStyle = '#7a3018';
      ctx.beginPath(); ctx.moveTo(s.x - 100, GROUND + 10); ctx.lineTo(s.x + 100, GROUND - 260); ctx.lineTo(s.x + 300, GROUND + 10); ctx.fill();
      ctx.fillStyle = '#c0c4c8'; ctx.fillRect(s.x + 96, GROUND - 330, 8, 80); ctx.fillRect(s.x + 80, GROUND - 336, 40, 10);
    }
    if (isTargetStation(s.id) && state === 'play') text('!', s.x + s.w / 2, GROUND - 340 + Math.sin(t * 5) * 10, 60, '#ffe14d', 'Press Start 2P', 'center');
  }
  for (const p of pickups) {
    if (p.taken) continue;
    const bob = Math.sin(t * 4 + p.x) * 6;
    ctx.fillStyle = { rock: '#8a5a44', ice: '#bfe8ff', part: '#b8c0c8', scrap: '#8d939b' }[p.item] || '#fff';
    ctx.fillRect(p.x - 18, p.y - 30 + bob, 36, 28);
    ctx.fillStyle = p.item === 'scrap' ? '#ff8a3d' : 'rgba(255,255,255,0.7)';
    ctx.fillRect(p.x - 12, p.y - 26 + bob, 10, 6);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath(); ctx.ellipse(player.x, GROUND + 6, 50, 12, 0, 0, Math.PI * 2); ctx.fill();
  const airborne = player.y < GROUND - 4;
  drawAstronaut(player.x, player.y, 190, player.face, Math.abs(player.vx) > 1 && !airborne, player.walk * 0.95);
  for (const p of particles) if (!p.room) { ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, 8, 8); }
  for (const p of pops) if (!p.room) { const e = 1 - (1 - Math.min(1, p.t)) ** 3; text(p.text, p.x, p.y - e * 80, 22, '#ffe14d', 'Press Start 2P', 'center'); }
  if (state === 'play') {
    const pickup = nearbyPickup(), st = nearStation();
    if (pickup) text(`[E] collect ${pickup.item}`, player.x, player.y - 220, 20, '#ffe14d', 'Press Start 2P', 'center');
    else if (st) text(`[E] ${st.id === 'greenhouse' ? 'enter greenhouse' : st.name}`, player.x, player.y - 220, 20, '#fff', 'Press Start 2P', 'center');
  }
  ctx.restore();
  ctx.fillStyle = 'rgba(255,200,150,0.35)';
  dust.forEach(p => ctx.fillRect(p.x, p.y, p.s * 2, p.s * 2));
}
function drawGreenhouse(t) {
  ctx.fillStyle = '#a45a34'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#d48d50'; ctx.fillRect(0, 0, W, 690);
  ctx.fillStyle = '#224a55'; ctx.fillRect(60, 95, 1800, 680);
  ctx.fillStyle = '#71b5b5'; ctx.fillRect(80, 115, 1760, 625);
  for (let x = 170; x < 1800; x += 220) {
    ctx.fillStyle = 'rgba(236,247,220,0.22)'; ctx.fillRect(x, 130, 14, 590);
    ctx.fillStyle = '#e6a24e'; ctx.fillRect(x - 5, 100, 24, 680);
  }
  ctx.fillStyle = '#513323'; ctx.fillRect(70, 750, 1780, 115);
  ctx.fillStyle = '#9b5529'; ctx.fillRect(70, 750, 1780, 18);
  const lightsOn = M.gh.lights;
  for (const s of ROOM) {
    const x = s.x;
    if (s.id === 'medium') {
      ctx.fillStyle = '#5e3d2b'; ctx.fillRect(x - 70, 625, 140, 130);
      ctx.fillStyle = '#b58a5b'; ctx.fillRect(x - 58, 610, 116, 24);
      for (let i = 0; i < Math.min(4, M.inv.medium || 0); i++) { ctx.fillStyle = '#e8d7b5'; ctx.fillRect(x - 50 + i * 26, 650, 22, 40); }
    } else if (s.id === 'seed-rack') {
      ctx.fillStyle = '#65472e'; ctx.fillRect(x - 64, 430, 128, 310);
      SEED_KEYS.forEach((k, i) => {
        const r = Math.floor(i / 2), cl = i % 2;
        ctx.fillStyle = '#c89c59'; ctx.fillRect(x - 52, 470 + r * 82, 104, 8);
        ctx.fillStyle = (M.inv[k + '_seed'] || 0) > 0 ? CROPS[k].color : '#555';
        ctx.fillRect(x - 44 + cl * 50, 440 + r * 82, 36, 28);
        if (i === seedIdx) { ctx.strokeStyle = '#ffe14d'; ctx.lineWidth = 4; ctx.strokeRect(x - 48 + cl * 50, 436 + r * 82, 44, 36); }
        if (M.gh.selected === k) { ctx.fillStyle = '#fff'; ctx.fillRect(x - 30 + cl * 50, 430 + r * 82, 8, 8); }
      });
    } else if (s.bed !== undefined) {
      const b = M.beds[s.bed], unlocked = bedUnlocked(M, s.bed);
      if (lightsOn && unlocked) { ctx.fillStyle = '#e070ff'; ctx.fillRect(x - 100, 470, 200, 12); ctx.fillStyle = 'rgba(230,120,255,0.12)'; ctx.fillRect(x - 100, 482, 200, 180); }
      ctx.globalAlpha = unlocked ? 1 : 0.35;
      ctx.fillStyle = '#716147'; ctx.fillRect(x - 100, 665, 200, 70);
      ctx.fillStyle = '#b99460'; ctx.fillRect(x - 95, 655, 190, 16);
      if (b.stage !== 'empty') { ctx.fillStyle = b.stage === 'medium' ? '#a89070' : '#50361e'; ctx.fillRect(x - 84, 674, 168, 46); }
      if (b.water > 0 && b.stage !== 'empty') { ctx.fillStyle = '#4fb4ff'; ctx.fillRect(x - 84, 716, 168 * Math.min(1, b.water / 3), 4); }
      if (b.crop) {
        const c = CROPS[b.crop], g = b.growth / c.days;
        for (let i = 0; i < b.seeds; i++) {
          const px = x - 60 + i * 40, ph = 6 + Math.min(1, g * 1.4) * 70;
          ctx.fillStyle = b.stage === 'dead' ? '#6b4a2a' : '#277c37'; ctx.fillRect(px, 674 - ph, 6, ph);
          if (g > 0.15 && b.stage !== 'dead') {
            ctx.fillStyle = b.health < 50 ? '#a6a24e' : c.color;
            const lw = 8 + g * 14;
            ctx.fillRect(px - lw, 680 - ph, lw, 7); ctx.fillRect(px + 6, 672 - ph, lw, 7);
          }
        }
        if (g >= 1 && b.stage !== 'dead') text('READY!', x, 560 + Math.sin(t * 5) * 6, 18, '#ffe14d', 'Press Start 2P', 'center');
        else text(`${c.short} ${fmt(b.growth)}/${c.days}`, x, 760 + 40, 16, '#fff0c9', 'VT323', 'center');
      }
      ctx.globalAlpha = 1;
      if (!unlocked) text('LOCKED', x, 640, 14, '#fff', 'Press Start 2P', 'center');
    } else if (s.id === 'irrigation') {
      ctx.fillStyle = '#487c81'; ctx.fillRect(x - 62, 495, 124, 245);
      ctx.fillStyle = '#70dddb'; ctx.fillRect(x - 44, 520, 88, 64);
      ctx.fillStyle = '#467b42'; ctx.fillRect(x - 50, 620, 100, 46);
    } else if (s.id === 'env') {
      ctx.fillStyle = '#3a4650'; ctx.fillRect(x - 50, 480, 100, 260);
      ctx.fillStyle = lightsOn ? '#e070ff' : '#333'; ctx.fillRect(x - 34, 500, 68, 30);
      text(`${M.gh.temp}°C`, x, 580, 30, '#7effdc', 'VT323', 'center');
    }
    text(s.label, x, 420, 15, '#fff0c9', 'Press Start 2P', 'center');
  }
  ctx.fillStyle = '#b4592e'; ctx.fillRect(80, 550, 110, 205);
  ctx.fillStyle = '#7ac9cc'; ctx.fillRect(97, 568, 76, 165);
  text('AIRLOCK', 135, 535, 16, '#fff', 'Press Start 2P', 'center');
  const dir = (keys.KeyD || keys.ArrowRight ? 1 : 0) - (keys.KeyA || keys.ArrowLeft ? 1 : 0);
  drawAstronaut(roomPlayer.x, 750, 166, roomPlayer.face, dir !== 0 && !actAnim, roomPlayer.walk * 0.95);
  if (M.gh.carryMedium) { ctx.fillStyle = '#e8d7b5'; ctx.fillRect(roomPlayer.x - 16, 560, 32, 40); }
  for (const p of particles) if (p.room) { ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, 8, 8); }
  for (const p of pops) if (p.room) { const e = 1 - (1 - Math.min(1, p.t)) ** 3; text(p.text, p.x, p.y - e * 80, 22, '#ffe14d', 'Press Start 2P', 'center'); }
  const st = nearRoom();
  if (roomPlayer.x < 175) text('[E] exit airlock', roomPlayer.x + 60, 470, 18, '#fff', 'Press Start 2P', 'center');
  else if (st) text(`[E] ${st.label}${st.id === 'seed-rack' || st.id === 'env' ? '  [Q] change' : ''}`, roomPlayer.x, 470, 18, '#ffe14d', 'Press Start 2P', 'center');
  panel(45, 18, 1830, 70);
  text(`GREENHOUSE · DAY ${dayIndex + 1}/15`, 75, 52, 18, '#7effdc', 'Press Start 2P');
  wrap(hintFor(currentObjective()), 560, 46, 1290, 26, '#fff', 26);
  panel(45, 900, 1830, 135);
  const k = SEED_KEYS[seedIdx];
  text(`SEED (Q): ${CROPS[k].name} x${M.inv[k + '_seed'] || 0} · ${CROPS[k].days} sols   ·   SELECTED: ${M.gh.selected ? CROPS[M.gh.selected].short : 'none'}   ·   CAN ${fmt(M.gh.can)}/2 L   ·   MEDIUM ${M.inv.medium || 0}${M.gh.carryMedium ? ' (carrying 1)' : ''}`, 80, 950, 28, '#ffd9b0');
  text(`LIGHTS ${lightsOn ? 'ON' : 'OFF'} · ${M.gh.temp}°C · Tank water ${fmt(M.res.water)} L · Energy ${fmt(M.res.energy)} kWh   ·   A/D walk · E interact · walk left to the AIRLOCK to exit`, 80, 1005, 26, '#e6ffd4');
  if (toast.t > 0) { panel(370, 790, 1180, 100); wrap(toast.text, 400, 828, 1120, 27, '#fff', 28); }
}
function bar(x, y, label, value, max, color, suffix = '') {
  text(label, x, y + 24, 28, '#ffd9b0');
  ctx.fillStyle = '#331410'; ctx.fillRect(x + 120, y + 4, 210, 24);
  ctx.fillStyle = color; ctx.fillRect(x + 120, y + 4, 210 * Math.max(0, Math.min(1, value / max)), 24);
  text(suffix, x + 340, y + 24, 26, '#fff');
}
function drawHUD() {
  const st = missionStatus(M);
  panel(20, 20, 520, 262);
  text(`DAY ${dayIndex + 1}/15`, 40, 58, 22, '#ff8a3d', 'Press Start 2P');
  text(st.label, 520, 58, 18, st.color, 'Press Start 2P', 'right');
  bar(40, 72, 'SUIT O2', suit, 100, suit < 25 ? '#ff4040' : '#5fd0ff', `${suit | 0}%`);
  bar(40, 106, 'ENERGY', M.res.energy, cap(M, 'energy'), M.res.energy < 20 ? '#ff4040' : '#ffd84d', `${M.res.energy | 0} kWh`);
  bar(40, 140, 'WATER', M.res.water, cap(M, 'water'), '#4fb4ff', `${M.res.water | 0} L`);
  bar(40, 174, 'FOOD', M.res.food, cap(M, 'food'), '#8fd36a', `${fmt(M.res.food)}`);
  bar(40, 208, 'BASE O2', M.res.oxygen, cap(M, 'oxygen'), '#a6e8ff', `${fmt(M.res.oxygen)} kg`);
  text(`FUEL ${M.res.fuel | 0} · MAT ${M.res.materials | 0} · SEEDS ${seedCount(M)} · SCI ${M.science}`, 40, 268, 26, '#ffe14d');
  panel(1320, 20, 580, 82 + objectives.length * 39);
  text(`SOL ${dayIndex + 1}: ${DAYS[dayIndex].title}`, 1340, 59, 16, '#ff8a3d', 'Press Start 2P');
  const cur = currentObjective();
  objectives.forEach((o, i) => {
    const prog = o.collect ? ` (${Math.min(o.collected, o.n)}/${o.n})` : '';
    const stage = !o.done ? ` · ${Math.min(o.stepIndex + 1, o.steps.length)}/${o.steps.length}` : '';
    text(`${o.done ? '[x]' : o === cur ? '>' : '[ ]'} ${o.label}${prog}${stage}`, 1340, 99 + i * 39, 26, o.done ? '#8f8' : o === cur ? '#ffe14d' : '#fff');
  });
  panel(560, 20, 740, 100);
  text(`NEXT · ${cur?.label || 'Sol complete'}`, 580, 50, 14, '#ffe14d', 'Press Start 2P');
  wrap(hintFor(cur), 580, 80, 700, 24, '#fff', 24);
  text('A/D move · SHIFT run · SPACE jump · E interact · I/O/R/M/L/N panels · ESC pause', W / 2, 1066, 26, '#ffd9b0', 'VT323', 'center');
  if (toast.t > 0) { panel(400, 880, 1120, 110); wrap(toast.text, 430, 922, 1060, 29, '#fff', 31); }
}
function drawAlien(x, y, t) {
  const img = IMG.alien;
  if (img.complete && img.naturalWidth) { const h = 260, w = h * img.naturalWidth / img.naturalHeight; ctx.drawImage(img, x, y - h + Math.sin(t * 3) * 8, w, h); }
}
function drawIntro(t) {
  ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(0, 0, W, H);
  drawAlien(160, 1000, t);
  panel(460, 640, 1360, 340);
  text(`ZIX the Martian · DAY ${dayIndex + 1}/15: ${DAYS[dayIndex].title}`, 500, 700, 20, '#5fffd0', 'Press Start 2P');
  wrap(DAYS[dayIndex].intro[dialogLine] || '', 500, 760, 1280, 38, '#fff', 42);
  text(`[SPACE / click] continue  ${dialogLine + 1}/${DAYS[dayIndex].intro.length}`, 1780, 950, 28, '#ffd9b0', 'VT323', 'right');
}
function drawQuiz() {
  ctx.fillStyle = 'rgba(15,5,3,0.88)'; ctx.fillRect(0, 0, W, H);
  const q = DAYS[dayIndex].quiz[quiz.q];
  if (!q) return;
  text(`SCIENCE CHECK  ${quiz.q + 1}/5`, W / 2, 200, 36, '#ff8a3d', 'Press Start 2P', 'center');
  wrap(q.q, 360, 320, 1200, 48, '#fff', 52);
  q.c.forEach((c, i) => {
    const by = 480 + i * 110;
    let color = 'rgba(80,30,20,0.9)';
    if (quiz.picked >= 0 && i === q.a) color = '#2f8a3a'; else if (quiz.picked === i) color = '#a02a2a';
    ctx.fillStyle = color; ctx.fillRect(360, by, 1200, 90);
    ctx.strokeStyle = '#ff8a3d'; ctx.lineWidth = 4; ctx.strokeRect(360, by, 1200, 90);
    text(`${i + 1}. ${c}`, 400, by + 58, 40);
  });
  if (quiz.picked >= 0) wrap(q.f, 360, 960, 1200, 32, '#ffe14d', 34);
}
function render(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(scale, 0, 0, scale, offX, offY);
  ctx.imageSmoothingEnabled = false;
  ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
  if (state === 'boot') {
    ctx.fillStyle = '#04030a'; ctx.fillRect(0, 0, W, H);
    text('DREAMSCANFOUND', W / 2, 460, 40, '#5fffd0', 'Press Start 2P', 'center');
    text('INCOMING TRANSMISSION', W / 2, 540, 24, '#ffd9b0', 'Press Start 2P', 'center');
    if (Math.floor(t * 2) % 2) text('CLICK OR PRESS ANY KEY', W / 2, 640, 36, '#fff', 'VT323', 'center');
    return;
  }
  if (state === 'cine' || state === 'setup') { cine.draw(ctx, hasSave() && state === 'cine'); return; }
  if (state === 'travel') { drawTravel(ctx, IMG, travelT); return; }
  if (!M) return;
  if (state === 'greenhouse' || (state === 'paused' && previousState === 'greenhouse')) drawGreenhouse(t);
  else { drawWorld(t); drawHUD(); }
  if (state === 'intro') drawIntro(t);
  if (state === 'quiz') drawQuiz();
  if (state === 'paused') {
    ctx.fillStyle = 'rgba(15,5,3,0.75)'; ctx.fillRect(0, 0, W, H);
    text('PAUSED', W / 2, 420, 64, '#ff8a3d', 'Press Start 2P', 'center');
    text('ESC or click to resume · progress is saved at the start of each sol', W / 2, 520, 40, '#fff', 'VT323', 'center');
    drawAlien(W / 2 - 130, 1040, t);
  }
}

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  update(dt);
  ctx.save();
  render(now / 1000);
  ctx.restore();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
