// DREAMSCANFOUND – 15 DAYS ON MARS · mission data.
// Cited science values are kept separate from simplified GAMEPLAY values.
export { DAYS } from './days.js';


export const CROPS = {
  radish_micro: {
    name: 'Radish microgreens',
    short: 'RADISH MICRO',
    days: 1,
    water: 0.25,
    temp: [18, 26],
    light: '16 h/sol LED',
    yieldPer: 0.75,
    color: '#c94a6a',
    src: 'Accelerated gameplay growth: 1 sol.'
  },

  lettuce_micro: {
    name: 'Lettuce microgreens',
    short: 'LETTUCE MICRO',
    days: 2,
    water: 0.2,
    temp: [16, 24],
    light: '16 h/sol LED',
    yieldPer: 0.6,
    color: '#7fd35a',
    src: 'Accelerated gameplay growth: 2 sols.'
  },

  lettuce: {
    name: "'Outredgeous' red romaine lettuce",
    short: 'LETTUCE',
    days: 3,
    water: 0.4,
    temp: [16, 24],
    light: 'Red/blue/green LED',
    yieldPer: 2,
    color: '#a8344a',
    src: 'Accelerated gameplay growth: 3 sols.'
  },

  radish: {
    name: "'Cherry Belle' radish",
    short: 'RADISH',
    days: 2,
    water: 0.35,
    temp: [16, 24],
    light: 'APH LED',
    yieldPer: 1.5,
    color: '#e0425a',
    src: 'Accelerated gameplay growth: 2 sols.'
  },

  mizuna: {
    name: 'Mizuna mustard greens',
    short: 'MIZUNA',
    days: 3,
    water: 0.35,
    temp: [16, 24],
    light: 'Red/blue/green LED',
    yieldPer: 1.5,
    color: '#4fae3a',
    src: 'Accelerated gameplay growth: 3 sols.'
  },

  wheat: {
    name: "'Apogee' dwarf wheat",
    short: 'DWARF WHEAT',
    days: 3,
    water: 0.5,
    temp: [18, 26],
    light: 'High-intensity LED',
    yieldPer: 3,
    color: '#d9b44a',
    src: 'Accelerated gameplay growth: 3 sols.'
  }
};
export const SEED_KEYS = Object.keys(CROPS);
export const TEMPS = [16, 21, 27];
export const HEAT = { 16: 2, 21: 4, 27: 7 };

export const SPACECRAFT = [
  { id: 'small', name: 'SMALL · Kestrel', mass: 6, cargo: 6, cost: 300, power: 6, load: 0, storage: 0.8, desc: 'Low mass and cheap. Limited cargo and -20% storage.' },
  { id: 'standard', name: 'STANDARD · Horizon', mass: 9, cargo: 10, cost: 450, power: 9, load: 0, storage: 1, desc: 'Balanced capacity and mass.' },
  { id: 'advanced', name: 'ADVANCED · Odyssey', mass: 13, cargo: 16, cost: 700, power: 14, load: 4, storage: 1.35, desc: 'Big cargo hold and +35% storage. Expensive, and draws +4 kWh/sol.' }
];
export const VEHICLES = [
  { id: 'light', name: 'LIGHT LIFTER', payload: 16, cost: 150, desc: '16 t to trans-Mars injection.' },
  { id: 'medium', name: 'MEDIUM LIFTER', payload: 24, cost: 260, desc: '24 t to trans-Mars injection.' },
  { id: 'heavy', name: 'SUPER-HEAVY LIFTER', payload: 36, cost: 450, desc: '36 t to trans-Mars injection.' }
];
export const DIFFICULTY = {
  easy: { name: 'EASY', budget: 1700, start: 1.4, cons: 0.85, rescue: 2, ascent: 20, desc: 'More supplies, gentler events, 2 emergency caches.' },
  normal: { name: 'NORMAL', budget: 1400, start: 1, cons: 1, rescue: 1, ascent: 25, desc: 'Balanced supplies, realistic challenges, 1 emergency cache.' },
  hard: { name: 'HARD', budget: 1150, start: 0.8, cons: 1.15, rescue: 0, ascent: 30, desc: 'Scarce supplies, harsher events, no emergency caches.' }
};
export const CONSUMABLES_MASS = 4;
export const EQUIPMENT = [
  { id: 'extractor', name: 'Ice drill & extractor', mass: 1.5, cost: 90, power: 3, def: true, install: { materials: 12, energy: 6 },
    purpose: 'Drills and melts subsurface ice into raw water. NASA\'s Phoenix confirmed shallow ice in 2008.' },
  { id: 'purifier', name: 'Water purifier', mass: 0.6, cost: 50, power: 1, def: true, install: { materials: 6, energy: 3 },
    purpose: 'Filters meltwater and removes perchlorate to make drinking water.' },
  { id: 'recycler', name: 'Water recycler', mass: 1.2, cost: 80, power: 2, def: true, install: { materials: 10, energy: 5 },
    purpose: 'Recovers part of the crew\'s used water. The ISS reached ~98% in 2023; the game uses 75%.' },
  { id: 'oxygen', name: 'MOXIE-derived O2 generator', mass: 1, cost: 100, power: 3, def: true, install: { materials: 14, energy: 6 },
    purpose: 'Splits atmospheric CO2 into O2. MOXIE proved this (122 g, 2021-23). The scaled output is a gameplay value.' },
  { id: 'fuelplant', name: 'Methane fuel plant', mass: 1.4, cost: 90, power: 3, def: false, install: { materials: 14, energy: 6 },
    purpose: 'Sabatier reactor: CO2 + hydrogen from water → methane. Not yet demonstrated on Mars.' },
  { id: 'solarx', name: 'Extra solar array', mass: 0.9, cost: 60, power: -3, def: false, install: { materials: 15, energy: 0 },
    purpose: 'Adds Solar Panel D and 3 kW of available launch power.' },
  { id: 'veggie', name: 'Veggie-style LED growth units', mass: 0.7, cost: 50, power: 2, def: false, install: { materials: 10, energy: 2 },
    purpose: 'Unlocks greenhouse beds 3 and 4 (based on NASA\'s Veggie).' },
  { id: 'tanks', name: 'Extra storage tanks', mass: 0.8, cost: 40, power: 0, def: false, purpose: '+50% water, food and oxygen storage.' },
  { id: 'spectro', name: 'Laser spectrometer', mass: 0.3, cost: 60, power: 1, def: false, purpose: 'Inspired by SuperCam. +3 science per completed science task.' },
  { id: 'radar', name: 'Ground-penetrating radar', mass: 0.3, cost: 45, power: 0.5, def: false, purpose: 'Inspired by RIMFAX. Reveals 1 extra buried ice block each sol.' },
  { id: 'cache', name: 'Supply cache', mass: 2.5, cost: 50, power: 0, def: false, purpose: '+20 food rations, +10 materials and extra seeds.' }
];

export const SCIENCE_VALUES = [
  'Mars gravity 3.71 m/s² (~38% of Earth) · NASA Mars Fact Sheet',
  'Mean surface pressure ~610 Pa; atmosphere ~95% CO2 · NASA',
  'Sol = 24 h 37 min; Mars year = 687 Earth days · NASA',
  'Sunlight at Mars is ~43% of Earth\'s (1.52 AU) · NASA',
  'Crew O2 use ≈ 0.84 kg/person/day · NASA life-support baseline (BVAD)',
  'ISS water recovery reached ~98% (2023) · NASA ECLSS',
  'MOXIE produced 122 g of O2 from CO2 on Mars (2021-2023) · NASA',
  'Veg-01 lettuce ~33 days; Plant Habitat-02 radish 27 days · NASA'
];
export const GAMEPLAY_VALUES = [
  'Crew of 2. Each person uses 4 L water, 1 food ration and 0.84 kg O2 per sol',
  'Recycler returns 75% of crew water × equipment health',
  'O2 generator: 2 kg/sol for 4 kWh (scaled-up MOXIE concept)',
  'Solar panel: 9 kWh/sol at 100% efficiency; dust takes 4% per sol',
  'Life support uses 10 kWh/sol; LEDs use 1.5 kWh per planted bed',
  '1 ice block → 6 L raw water; purification yields 90%',
  'Fuel batch: 2 L water + 6 kWh → 5 fuel units (Sabatier concept)',
  'Each crop\'s growth time is labelled with its source or as an approximation'
];
export const SOURCES = [
  'NASA Mars Fact Sheet - nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html',
  'NASA Mars Exploration - science.nasa.gov/mars',
  'Mars 2020 Perseverance: MOXIE, MEDA, RIMFAX, SuperCam - science.nasa.gov',
  'Phoenix Mars Lander: water ice & perchlorate (2008) - NASA/JPL',
  'NASA Veggie & Advanced Plant Habitat (Veg-01, Veg-04, Plant Habitat-02/04)',
  'ISS Environmental Control & Life Support System (ECLSS) - nasa.gov',
  'NASA Life Support Baseline Values and Assumptions Document (BVAD)'
];

// Mission events keyed by sol index. fx: res, dust, eq (health delta; 100 = full repair),
// flags, ghHealth, science, seedLoss.
export const EVENTS = {
  1: { title: 'SEED STORAGE HUMIDITY', info: 'A cargo-hold humidity sensor reads 85%. Damp seeds can mould and fail to germinate.',
    options: [
      { label: 'Dry the seeds with the habitat heater', detail: '-3 kWh energy. All seeds saved.', fx: { res: { energy: -3 } } },
      { label: 'Accept the damage', detail: 'Lose 2 seeds. No energy used.', fx: { seedLoss: 2 } }
    ] },
  2: { title: 'DUST STORM WARNING', info: 'Orbital imagery shows a regional dust storm approaching. Exposed panels will be heavily coated.',
    options: [
      { label: 'Stow panels at a steep tilt', detail: 'Solar output halved tonight, but panels lose only 5% efficiency.', fx: { flags: { storm: true }, dust: 0.05 } },
      { label: 'Keep generating at full tilt', detail: 'Normal output, but every panel loses 25% efficiency.', fx: { dust: 0.25 } }
    ] },
  3: { title: 'PERCHLORATE SPIKE', info: 'Purifier sensors detect high perchlorate in today\'s meltwater. Untreated, it can harm the thyroid.',
    options: [
      { label: 'Install a fresh cartridge', detail: '-2 materials. Purifier health back to 100%.', fx: { res: { materials: -2 }, eq: { purifier: 100 } } },
      { label: 'Run a slower double pass', detail: '-3 kWh energy and -20% purifier health.', fx: { res: { energy: -3 }, eq: { purifier: -20 } } }
    ] },
  4: { title: 'COMMUNICATION DELAY', info: 'Earth is ~14 light-minutes away today. Mission control\'s advice on the rover fault will take ~30 minutes round-trip.',
    options: [
      { label: 'Wait for Earth\'s guidance', detail: '-4 kWh of standby power, +3 science for following procedure.', fx: { res: { energy: -4 }, science: 3 } },
      { label: 'Act autonomously now', detail: 'No waiting, but a mistake risk: extractor health -15%.', fx: { eq: { extractor: -15 } } }
    ] },
  5: { title: 'CO2 SCRUBBER CLOGGING', info: 'Cabin CO2 is rising. The scrubber filter is clogged with fine dust.',
    options: [
      { label: 'Replace the filter now', detail: '-4 materials.', fx: { res: { materials: -4 } } },
      { label: 'Run extra fans and purge the air', detail: '-6 kWh energy and -1.5 kg stored oxygen.', fx: { res: { energy: -6, oxygen: -1.5 } } }
    ] },
  6: { title: 'GREENHOUSE COLD SNAP', info: 'The night outside fell to -90 °C and the greenhouse dropped to 12 °C. Seedlings are stressed.',
    options: [
      { label: 'Divert power to the heaters', detail: '-8 kWh energy. Crops unharmed.', fx: { res: { energy: -8 } } },
      { label: 'Fit thermal blankets', detail: '-3 materials. Crops lose 10% health.', fx: { res: { materials: -3 }, ghHealth: -10 } },
      { label: 'Do nothing', detail: 'All growing crops lose 35% health.', fx: { ghHealth: -35 } }
    ] },
  7: { title: 'ENERGY RESERVES LOW', info: 'Battery forecasts are falling as dust builds up. Cover the shortfall now or cut loads.',
    options: [
      { label: 'Run the backup fuel cell', detail: '-6 fuel → +15 kWh energy.', fx: { res: { fuel: -6, energy: 15 } } },
      { label: 'Switch the grow lights off for one sol', detail: 'Saves power, but crops will not grow tonight.', fx: { flags: { lightsOff: true } } },
      { label: 'Accept the risk', detail: 'No change. Systems may shut down overnight if the battery runs empty.', fx: {} }
    ] },
  8: { title: 'CREW HEALTH CHECK', info: 'A crew member is mildly dehydrated after long EVAs.',
    options: [
      { label: 'Give an extra water ration', detail: '-6 L water.', fx: { res: { water: -6 } } },
      { label: 'Keep the standard ration', detail: 'Saves water, but crew performance drops: -4 science.', fx: { science: -4 } }
    ] },
  9: { title: 'EXTRACTOR BEARING WEAR', info: 'Vibration sensors show the ice drill bearings are wearing quickly in the abrasive regolith.',
    options: [
      { label: 'Repair now', detail: '-5 materials. Extractor health 100%.', fx: { res: { materials: -5 }, eq: { extractor: 100 } } },
      { label: 'Postpone the repair', detail: 'Extractor health -30%. Output and reliability drop.', fx: { eq: { extractor: -30 } } }
    ] },
  10: { title: 'RELAY WINDOW', info: 'An orbiter relay pass is due in 2 hours. The direct-to-Earth link is available now but power-hungry.',
    options: [
      { label: 'Wait for the orbiter pass', detail: '-2 kWh.', fx: { res: { energy: -2 } } },
      { label: 'Use the direct-to-Earth link now', detail: '-7 kWh, +4 science.', fx: { res: { energy: -7 }, science: 4 } }
    ] },
  11: { title: 'RECYCLER LEAK', info: 'A seal in the water recycler is weeping. The leak grows if the unit keeps running.',
    options: [
      { label: 'Shut down and patch it', detail: '-4 materials. Recycler health 100%.', fx: { res: { materials: -4 }, eq: { recycler: 100 } } },
      { label: 'Keep running', detail: 'Lose 10 L water and -25% recycler health.', fx: { res: { water: -10 }, eq: { recycler: -25 } } }
    ] },
  12: { title: 'DUST DEVIL', info: 'A dust devil swept through the solar field overnight. Dust devils have cleaned rover panels before, but they also carry grit.',
    options: [
      { label: 'Inspect every panel for scratches', detail: '-2 kWh; all panels end up at full efficiency.', fx: { res: { energy: -2 }, cleanAll: true } },
      { label: 'Log it for science and move on', detail: '+3 science; panels gain only partial cleaning.', fx: { science: 3, dust: -0.15 } }
    ] },
  13: { title: 'ROVER BATTERY FAULT', info: 'The rover\'s battery heater failed overnight. A cold battery loses capacity.',
    options: [
      { label: 'Repair the heater', detail: '-4 materials.', fx: { res: { materials: -4 } } },
      { label: 'Warm it with base power', detail: '-6 kWh energy.', fx: { res: { energy: -6 } } }
    ] }
};