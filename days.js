// 15 playable sols. Objectives: steps with `at` (station id) or `track` (free-action counter).
const sp = (item, xs) => xs.map(x => ({ item, x }));
const step = (at, action, instruction, extras = {}) => ({ at, action, instruction, ...extras });
const trk = (track, times, instruction, extras = {}) => ({ track, times, instruction, ...extras });

export const DAYS = [
  {
    title: 'ARRIVAL',
    intro: [
      'Greetings, Earthling! I am Zix. Welcome to Jezero Crater, where NASA\'s Perseverance landed in 2021. Your lander touched down safely!',
      'This is a 15-sol mission. Every sol your crew of two uses water, food and oxygen, and the base uses energy. Watch the HUD and the RESOURCES panel (R).',
      'Today: commission the habitat, sow your first greenhouse bed by hand and inspect the solar array. Only microgreens can be harvested within 15 sols, so choose your seeds wisely!'
    ],
    objectives: [
      { label: 'Commission habitat', steps: [
        step('habitat', 'inspect', 'At the habitat, open the station menu with E and run the life-support inspection.'),
        step('habitat', 'unpack', 'Unpack the cargo manifest into base storage.', { fact: 'Cargo logged. Mars air is ~95% carbon dioxide at less than 1% of Earth\'s surface pressure.' }),
        step('habitat', 'test', 'Run the habitat pressure and oxygen-system test (2 kWh).', { cost: { energy: 2 }, fact: 'Habitat test passed. Mars surface pressure averages about 610 Pa, so the crew needs a pressurized habitat.' })
      ] },
      { label: 'Sow the first greenhouse bed', steps: [
        step('greenhouse-entry', 'enter', 'Walk to the greenhouse airlock and press E to enter.'),
        trk('gh_medium', 1, 'At the MEDIUM BIN press E to take a bag of arcillite growing medium, then press E at BED 1 to add it.'),
        trk('gh_prepare', 1, 'Press E at the bed again to level and pre-moisten the medium (uses 0.5 L water).'),
        trk('gh_plant', 4, 'At the SEED RACK choose a seed with Q and confirm with E, then press E at the bed to plant ONE seed per press (4 seeds).'),
        trk('gh_water', 1, 'At the WATER LOOP press E to fill the watering can (2 L), then press E at the planted bed.'),
        trk('gh_lights', 1, 'At the ENV PANEL press E to switch the LED grow lights ON. Q changes the temperature setpoint.')
      ] },
      { label: 'Inspect the solar array', steps: [
        step('solar1', 'inspect', 'Walk to Solar Panel A and read its dust and output level.'),
        step('solar1', 'clean', 'Brush the dust off Panel A.', { clean: 'solar1', fact: 'Panel cleaned. Mars receives about 43% of Earth\'s sunlight because it orbits at 1.52 AU.' })
      ] }
    ],
    spawns: sp('scrap', [2100, 3500]),
    quiz: [
      { q: 'What is the main gas in Mars\' atmosphere?', c: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Argon'], a: 2, f: 'About 95% of Mars\' atmosphere is carbon dioxide (NASA).' },
      { q: 'How long is a Martian day (sol)?', c: ['24h 00m', '24h 37m', '23h 56m', '26h 10m'], a: 1, f: 'A sol is about 24 hours 37 minutes.' },
      { q: 'Mars surface gravity compared to Earth?', c: ['About 38%', 'About 16%', 'About 75%', 'The same'], a: 0, f: 'Mars gravity is 3.71 m/s², about 38% of Earth\'s.' },
      { q: 'Which rover landed in Jezero Crater in 2021?', c: ['Spirit', 'Curiosity', 'Opportunity', 'Perseverance'], a: 3, f: 'Perseverance landed on February 18, 2021.' },
      { q: 'Why does Mars look red?', c: ['Lava', 'Iron oxide in dust', 'Red plants', 'Sun reflection'], a: 1, f: 'Iron oxide minerals give much of the surface dust its rusty color.' }
    ]
  },
  {
    title: 'ROCK HOUNDS',
    intro: [
      'Sol 2! Billions of years ago, Jezero Crater held a lake fed by a river delta.',
      'Collect three rocks one at a time and analyse them at the habitat. Then audit the water system so you know your daily water budget.'
    ],
    objectives: [
      { label: 'Analyse three rock samples', collect: 'rock', n: 3, science: true, steps: [
        step('habitat', 'label', 'At the habitat sample bench, label all three collected rocks.', { need: { rock: 3 } }),
        step('habitat', 'chooseRoute', 'Choose a scan strategy.', { choices: [
          { id: 'water', name: 'Detailed scan for water-altered minerals', cost: { energy: 4 }, science: 4, outcome: 'Uses 4 kWh, gives more science.' },
          { id: 'efficient', name: 'Efficient broad scan', cost: { energy: 1 }, science: 1, outcome: 'Uses 1 kWh for a broad mineral profile.' }
        ] }),
        step('habitat', 'seal', 'Seal and log the analysed samples.', { consume: { rock: 3 }, fact: 'Samples sealed. Perseverance caches rock cores in sealed tubes for future study.' })
      ] },
      { label: 'Audit the water system', steps: [
        trk('tank_check', 1, 'At the WATER TANKS choose "Read tank levels".'),
        step('recycler', 'inspect', 'At the WATER RECYCLER inspect its intake and filters.', { fact: 'Each crew member uses 4 L of water per sol in this game. The recycler recovers part of it, but never all of it.' })
      ] }
    ],
    spawns: [...sp('rock', [2600, 3500, 4750]), ...sp('scrap', [1900])],
    quiz: [
      { q: 'What was Jezero Crater long ago?', c: ['A volcano', 'A lake with a delta', 'An ice cap', 'A sea of lava'], a: 1, f: 'Orbital geology shows a lake and river delta at Jezero.' },
      { q: 'Which minerals can preserve clues about past water?', c: ['Clays and carbonates', 'Diamonds', 'Pure iron', 'Salt-free glass'], a: 0, f: 'Clays and carbonates can form or persist in watery environments.' },
      { q: 'What does Perseverance do with selected rock cores?', c: ['Burns them', 'Seals them in sample tubes', 'Throws them away', 'Eats them'], a: 1, f: 'Perseverance caches sealed sample tubes for possible future return.' },
      { q: 'What is the tallest volcano on Mars?', c: ['Mauna Kea', 'Elysium Mons', 'Olympus Mons', 'Arsia Mons'], a: 2, f: 'Olympus Mons rises about 22 km above the Mars datum.' },
      { q: 'Which rover has explored Gale Crater since 2012?', c: ['Curiosity', 'Sojourner', 'Zhurong', 'Spirit'], a: 0, f: 'Curiosity landed in Gale Crater in August 2012.' }
    ]
  },
  {
    title: 'DUST STORM',
    intro: [
      'A dust storm passed overnight. Some Mars dust storms grow until they encircle the whole planet.',
      'Dust cuts solar output, and solar output powers everything. Inspect, clean and verify each panel by hand.'
    ],
    objectives: [
      { label: 'Service Solar Panel A', steps: [
        step('solar1', 'inspect', 'Inspect Panel A\'s dust coating.'),
        step('solar1', 'clean', 'Brush Panel A clean.', { clean: 'solar1' }),
        step('solar1', 'verify', 'Verify Panel A output.', { fact: 'Panel A verified. Dust cut the solar energy available to Opportunity during the 2018 global storm.' })
      ] },
      { label: 'Service Solar Panel B', steps: [
        step('solar2', 'inspect', 'Inspect Panel B.'),
        step('solar2', 'clean', 'Brush Panel B clean.', { clean: 'solar2' }),
        step('solar2', 'verify', 'Verify Panel B output.', { fact: 'Panel B verified. InSight\'s solar panels gathered dust over its mission.' })
      ] },
      { label: 'Service Solar Panel C', steps: [
        step('solar3', 'inspect', 'Inspect Panel C.'),
        step('solar3', 'clean', 'Brush Panel C clean.', { clean: 'solar3' }),
        step('solar3', 'verify', 'Verify Panel C output.', { fact: 'Array serviced. Curiosity and Perseverance use radioisotope power instead of solar panels.' })
      ] }
    ],
    spawns: sp('scrap', [3000, 4300]),
    quiz: [
      { q: 'Which rover mission ended after the 2018 global dust storm?', c: ['Curiosity', 'Opportunity', 'Perseverance', 'Sojourner'], a: 1, f: 'Opportunity went silent in June 2018 during a planet-encircling dust storm.' },
      { q: 'How do Curiosity and Perseverance get electrical power?', c: ['Solar panels', 'Batteries only', 'Radioisotope power systems', 'Wind turbines'], a: 2, f: 'Both use an MMRTG radioisotope power system.' },
      { q: 'What is the approximate average Mars surface temperature?', c: ['About 15 °C', 'About -63 °C', 'About -150 °C', 'About 0 °C'], a: 1, f: 'NASA gives an average near -63 °C; local conditions vary widely.' },
      { q: 'Can Martian dust storms become global?', c: ['Yes', 'No, never', 'Only at the poles', 'Only at night'], a: 0, f: 'Some large dust events grow to encircle Mars.' },
      { q: 'What was the name of NASA\'s Mars helicopter?', c: ['Dragonfly', 'Ingenuity', 'Skylark', 'Pathfinder'], a: 1, f: 'Ingenuity completed 72 flights on Mars from 2021 to 2024.' }
    ]
  },
  {
    title: 'WATER WORKS',
    intro: [
      'Sol 4! NASA\'s Phoenix lander confirmed water ice in Martian soil in 2008. Water does not appear by magic: you must mine it, melt it and treat it.',
      'Collect two ice blocks, melt them in the ICE EXTRACTOR, purify the raw water, then water your greenhouse bed. Equipment you did not bring can be installed with building materials.'
    ],
    objectives: [
      { label: 'Mine and purify ice', collect: 'ice', n: 2, steps: [
        trk('extract', 2, 'At the ICE EXTRACTOR choose "Melt 1 ice" twice (2 kWh each). Install the extractor first if needed.'),
        trk('purify', 1, 'At the WATER PURIFIER run a purification batch to turn raw water into drinking water.', { fact: 'Water treated. Phoenix detected perchlorate salts in Martian soil, so meltwater must be purified.' })
      ] },
      { label: 'Water the greenhouse', steps: [
        step('greenhouse-entry', 'enter', 'Enter the greenhouse through the airlock.'),
        trk('gh_water', 1, 'Fill the watering can at the WATER LOOP, then water a planted bed.'),
        trk('gh_inspect', 1, 'Press E at a planted bed to read its growth log.', { fact: 'Germination takes days. The seed absorbs water and the radicle (first root) emerges first.' })
      ] }
    ],
    spawns: [...sp('ice', [4400, 4560]), ...sp('scrap', [1450])],
    quiz: [
      { q: 'Which NASA lander exposed water ice in 2008?', c: ['Viking 1', 'Phoenix', 'InSight', 'Beagle 2'], a: 1, f: 'Phoenix exposed shallow ice that sublimated after excavation.' },
      { q: 'Why is stable liquid water difficult at Mars\' surface?', c: ['Too much gravity', 'Very low pressure and cold', 'Too much oxygen', 'Strong magnetism'], a: 1, f: 'Low pressure and cold make liquid water unstable at the surface.' },
      { q: 'What oxidizing salt did Phoenix detect in Martian soil?', c: ['Perchlorate', 'Sodium chloride only', 'Fluoride', 'Uranium'], a: 0, f: 'Phoenix detected perchlorate, which affects soil and water use.' },
      { q: 'What part of a germinating seed usually emerges first?', c: ['Leaf', 'Flower', 'Radicle (embryonic root)', 'Fruit'], a: 2, f: 'The radicle is the first root structure to emerge.' },
      { q: 'Where are major stores of water ice on Mars?', c: ['Only at the equator', 'At the poles and underground', 'Only inside volcanoes', 'Nowhere'], a: 1, f: 'Water ice exists at the poles and below the surface at many latitudes.' }
    ]
  },
  {
    title: 'ROVER REPAIR',
    intro: [
      'Sol 5! The rover reports a damaged wheel. Sharp rocks have worn Curiosity\'s wheels too.',
      'Find two spare parts, repair the rover one part at a time, then test-drive it. Driving burns fuel, so keep track of it: you need a fuel reserve for ascent on Sol 15!'
    ],
    objectives: [
      { label: 'Repair the rover', collect: 'part', n: 2, steps: [
        step('rover', 'diagnose', 'At the rover, diagnose the wheel and suspension fault.', { need: { part: 2 } }),
        step('rover', 'chooseRoute', 'Choose a test profile.', { choices: [
          { id: 'economy', name: 'Low-power wheel test', cost: { energy: 1 }, outcome: 'Slow test that saves battery.' },
          { id: 'torque', name: 'Full-torque stress test', cost: { energy: 4 }, science: 2, outcome: 'Uses more battery but gives better engineering data.' }
        ] }),
        step('rover', 'replacePart', 'Install one spare part. Repeat for the second one.', { times: 2, consume: { part: 1 }, progressMessage: 'First part secured. Install the second part.' }),
        step('rover', 'testDrive', 'Run a slow test drive (3 fuel).', { cost: { fuel: 3 }, fact: 'Rover repaired. NASA rovers use six wheels and a rocker-bogie suspension.' })
      ] }
    ],
    spawns: [...sp('part', [1150, 4750]), ...sp('scrap', [2600])],
    quiz: [
      { q: 'How long can a one-way radio signal take between Earth and Mars?', c: ['1 second', 'About 3-22 minutes', '2 hours', '1 day'], a: 1, f: 'One-way light time ranges from roughly 3 to 22 minutes.' },
      { q: 'How many wheels do Curiosity and Perseverance have?', c: ['4', '6', '8', '3'], a: 1, f: 'Both rovers use six wheels with rocker-bogie suspension.' },
      { q: 'How many natural moons does Mars have?', c: ['None', 'One', 'Two', 'Four'], a: 2, f: 'Mars has two small moons, Phobos and Deimos.' },
      { q: 'How long is one Mars year?', c: ['365 Earth days', '687 Earth days', '225 Earth days', '1000 Earth days'], a: 1, f: 'A Mars year is about 687 Earth days.' },
      { q: 'Why do rover drivers plan commands instead of driving live?', c: ['Radio-signal delay', 'No wheels', 'Wind rules', 'The rover has no camera'], a: 0, f: 'Minutes of signal delay make real-time driving impractical.' }
    ]
  },
  {
    title: 'RIDGE SCOUT',
    intro: [
      'The rover is ready. Scout Jezero Ridge, where Perseverance studies ancient rocks. Mars has no global magnetic field like Earth\'s.',
      'Collect two rocks, drive them to the ridge, deploy the weather station and transmit its data. Then compare the samples back at the habitat.'
    ],
    objectives: [
      { label: 'Deploy the weather station', collect: 'rock', n: 2, science: true, steps: [
        step('ridge', 'placeTripod', 'At Jezero Ridge, anchor the weather-station tripod with the rocks (2 fuel for the drive).', { need: { rock: 2 }, cost: { fuel: 2 } }),
        step('ridge', 'chooseSensor', 'Choose the first sensor priority.', { choices: [
          { id: 'wind', name: 'Wind direction', science: 2, outcome: 'Wind gets priority in the first report.' },
          { id: 'temperature', name: 'Temperature profile', science: 2, outcome: 'Temperature gets priority in the first report.' }
        ] }),
        step('ridge', 'calibrate', 'Calibrate the sensor against the reference reading.'),
        step('ridge', 'transmit', 'Transmit the data to the habitat relay (2 kWh).', { cost: { energy: 2 }, fact: 'Data sent. Perseverance carries MEDA, a suite of weather sensors.' })
      ] },
      { label: 'Process ridge samples', steps: [
        step('habitat', 'compare', 'At the habitat, compare the ridge samples with your Sol 2 readings.', { need: { rock: 2 } }),
        step('habitat', 'archive', 'Archive the comparison.', { consume: { rock: 2 }, fact: 'Archived. Mars has a thin atmosphere and no global magnetic field today.' })
      ] }
    ],
    spawns: [...sp('rock', [3300, 4850]), ...sp('ice', [4500])],
    quiz: [
      { q: 'Why is the radiation environment harsh on Mars\' surface?', c: ['Closer to the Sun only', 'Thin atmosphere and no global magnetic field', 'Volcanoes', 'Radioactive moons'], a: 1, f: 'Mars has no global magnetic field and only a thin atmosphere.' },
      { q: 'What is the approximate average surface pressure on Mars?', c: ['~101,000 Pa', '~610 Pa', '~10 Pa', '~50,000 Pa'], a: 1, f: 'About 610 Pa, less than 1% of Earth\'s sea-level pressure.' },
      { q: 'What is Valles Marineris?', c: ['A vast canyon system', 'A crater', 'A river delta', 'A rover'], a: 0, f: 'Valles Marineris is a canyon system more than 4,000 km long.' },
      { q: 'How big is Mars compared with Earth?', c: ['About the same', 'About half the diameter', 'Twice as big', 'One tenth'], a: 1, f: 'Mars is about 6,779 km across, a little over half of Earth\'s diameter.' },
      { q: 'What did MOXIE on Perseverance demonstrate?', c: ['Making water', 'Making oxygen from CO2', 'Making fuel from ice', 'Making plastic'], a: 1, f: 'MOXIE produced oxygen from Mars\' CO2-rich atmosphere.' }
    ]
  },
  {
    title: 'LIFE SUPPORT AUDIT',
    intro: [
      'Sol 7, almost halfway! Life-support systems wear down, and filters clog.',
      'Service the water recycler, check the habitat air system and monitor your crops. Plants grow only with water, light and the right temperature.'
    ],
    objectives: [
      { label: 'Service the water loop', steps: [
        trk('recycler_service', 1, 'At the WATER RECYCLER choose "Service filters" (1 material). Install it first if you did not bring one.'),
        trk('tank_check', 1, 'At the WATER TANKS read the tank levels.')
      ] },
      { label: 'Check habitat air', steps: [
        step('habitat', 'co2', 'At the habitat, check the CO2 scrubber readings.', { fact: 'CO2 removed. Crew members exhale carbon dioxide, which life support must remove.' })
      ] },
      { label: 'Monitor the crops', steps: [
        step('greenhouse-entry', 'enter', 'Enter the greenhouse.'),
        trk('gh_inspect', 2, 'Read the growth log at a planted bed twice (E).'),
        trk('gh_water', 1, 'Water a planted bed.')
      ] }
    ],
    spawns: sp('scrap', [1300, 3900, 4900]),
    quiz: [
      { q: 'Which gas do crew members exhale that life support must remove?', c: ['Oxygen', 'Carbon dioxide', 'Helium', 'Methane'], a: 1, f: 'Exhaled CO2 must be scrubbed from cabin air.' },
      { q: 'About what share of water did the ISS recover in 2023?', c: ['About 50%', 'About 75%', 'About 98%', '100%'], a: 2, f: 'NASA reported the ISS reached about 98% water recovery in 2023.' },
      { q: 'In photosynthesis, plants take in CO2 and release…', c: ['Nitrogen', 'Oxygen', 'Methane', 'Argon'], a: 1, f: 'Photosynthesis uses CO2, water and light and releases oxygen.' },
      { q: 'Why do space greenhouses such as Veggie use LEDs?', c: ['Efficient light in chosen colors', 'They are decorative', 'To heat rocks', 'To scare insects'], a: 0, f: 'LEDs give efficient light in chosen wavelengths. Veggie uses red, blue and green LEDs.' },
      { q: 'How does the ISS recover water from urine?', c: ['Freezing', 'Distillation', 'Burning', 'Magnets'], a: 1, f: 'The ISS Urine Processor Assembly uses vapor-compression distillation.' }
    ]
  },
  {
    title: 'OXYGEN FACTORY',
    intro: [
      'Sol 8! The crew breathes about 0.84 kg of oxygen per person every day. Mars air has less than 1% oxygen, but plenty of CO2.',
      'Inspect the ISRU plant and run an oxygen production batch. Then collect salvage from the landing site for future repairs.'
    ],
    objectives: [
      { label: 'Run the oxygen plant', steps: [
        step('isru', 'inspect', 'At the ISRU PLANT, inspect the CO2 intake.'),
        trk('o2_run', 1, 'At the ISRU PLANT choose "Run O2 boost batch" (5 kWh). Install the O2 generator first if needed.', { fact: 'Oxygen produced by solid-oxide electrolysis of CO2, the process MOXIE demonstrated.' })
      ] },
      { label: 'Recover landing salvage', collect: 'scrap', n: 2, steps: [
        step('habitat', 'stow', 'At the habitat, sort the salvage into the materials store.', { fact: 'Salvage stored. Reusing hardware cuts the mass that has to be launched from Earth.' })
      ] }
    ],
    spawns: sp('scrap', [2150, 4100, 4950]),
    quiz: [
      { q: 'What does MOXIE turn into oxygen?', c: ['Water ice', 'Atmospheric CO2', 'Iron oxide dust', 'Methane'], a: 1, f: 'MOXIE split CO2 from the Martian air.' },
      { q: 'How much oxygen did MOXIE make in total?', c: ['122 grams', '5 tonnes', '1 kilogram', '12 milligrams'], a: 0, f: 'MOXIE made 122 g over 16 runs, as a technology demonstration.' },
      { q: 'How much of Mars\' atmosphere is oxygen?', c: ['About 21%', 'About 10%', 'Less than 1%', 'About 50%'], a: 2, f: 'Oxygen is only a tiny fraction of the Martian atmosphere.' },
      { q: 'How does the ISS make most of its oxygen?', c: ['Electrolysis of water', 'Plants only', 'Burning fuel', 'Mining rocks'], a: 0, f: 'The ISS Oxygen Generation System splits water by electrolysis.' },
      { q: 'Why would making oxygen on Mars help a return trip?', c: ['Rocket engines need oxidizer', 'It makes rocks lighter', 'It cools the Sun', 'It is not useful'], a: 0, f: 'Oxidizer makes up most of a rocket\'s propellant mass.' }
    ]
  },
  {
    title: 'FIRST HARVEST',
    intro: [
      'Sol 9! Radish microgreens sown on Sol 1 should be close to ready. Full lettuce or radish crops need about a month, much longer than this mission.',
      'Harvest any ready bed by hand, or log growth data if nothing is ready yet. Then sow a new round of microgreens. Food is eaten every sol, so plan ahead!'
    ],
    objectives: [
      { label: 'Harvest or log crops', steps: [
        step('greenhouse-entry', 'enter', 'Enter the greenhouse.'),
        trk(['gh_harvest', 'gh_inspect'], 1, 'Harvest a READY bed with E. If no bed is ready, record growth data at a bed instead.', { fact: 'Harvested food goes into food storage. NASA crop studies show edible crops take days to weeks to grow.' })
      ] },
      { label: 'Sow a succession bed', steps: [
        trk('gh_medium', 1, 'Add fresh growing medium to an empty bed (MEDIUM BIN, then the bed).'),
        trk('gh_prepare', 1, 'Prepare the medium.'),
        trk('gh_plant', 3, 'Plant 3 seeds one at a time.'),
        trk('gh_water', 1, 'Water the new bed.')
      ] }
    ],
    spawns: sp('ice', [4380, 4620]),
    quiz: [
      { q: 'When are many microgreens harvested after sowing?', c: ['1-2 days', 'About 7-14 days', '60 days', '1 year'], a: 1, f: 'Many microgreens are harvested about 7-14 days after sowing.' },
      { q: 'How long did NASA\'s Veggie lettuce grow on the ISS before harvest?', c: ['3 days', 'About 33 days', '1 week', '6 months'], a: 1, f: 'NASA\'s Veg-01 red romaine lettuce grew for about 33 days.' },
      { q: 'What is NASA\'s plant-growth system on the ISS called?', c: ['Veggie', 'Sprout-X', 'GrowBot', 'MOXIE'], a: 0, f: 'Veggie is NASA\'s vegetable production system on the ISS.' },
      { q: 'What process lets plants use light energy to build sugars?', c: ['Photosynthesis', 'Fermentation', 'Combustion', 'Fission'], a: 0, f: 'Photosynthesis uses light, water and CO2 to make sugars.' },
      { q: 'How is most rover data relayed to Earth?', c: ['Mars orbiters', 'The Moon', 'Phobos only', 'Balloons'], a: 0, f: 'Orbiters such as MRO relay large volumes of rover data.' }
    ]
  },
  {
    title: 'FUEL FOR THE FUTURE',
    intro: [
      'Sol 10! The ascent vehicle needs a fuel reserve by Sol 15. Making propellant on Mars is called In-Situ Resource Utilization (ISRU).',
      'Run two methane fuel batches at the ISRU plant. Each one uses water and energy, so check your reserves first. Install the fuel plant if you did not bring one.'
    ],
    objectives: [
      { label: 'Produce methane fuel', steps: [
        trk('fuel_batch', 2, 'At the ISRU PLANT choose "Run fuel batch" twice (2 L water + 6 kWh each).', { fact: 'Fuel stored. The Sabatier reaction combines CO2 with hydrogen to make methane and water.' })
      ] },
      { label: 'Top up water reserves', collect: 'ice', n: 1, steps: [
        trk('extract', 1, 'Melt the ice at the ICE EXTRACTOR.'),
        trk('purify', 1, 'Purify the raw water.')
      ] }
    ],
    spawns: [...sp('ice', [4420, 4700]), ...sp('scrap', [3100])],
    quiz: [
      { q: 'What does the Sabatier reaction produce from CO2 and hydrogen?', c: ['Methane and water', 'Oxygen only', 'Iron', 'Ammonia'], a: 0, f: 'CO2 + 4H2 → CH4 + 2H2O.' },
      { q: 'What does ISRU stand for?', c: ['In-Situ Resource Utilization', 'International Space Rover Unit', 'Ion Solar Recharge Unit', 'Inner Space Research Union'], a: 0, f: 'ISRU means using local resources such as air, ice and soil.' },
      { q: 'About what is Mars\' escape velocity?', c: ['11.2 km/s', '5.0 km/s', '2.4 km/s', '0.5 km/s'], a: 1, f: 'Mars escape velocity is about 5.0 km/s, versus 11.2 km/s for Earth.' },
      { q: 'How often do efficient Earth-Mars launch windows occur?', c: ['Every month', 'About every 26 months', 'Every 10 years', 'Every week'], a: 1, f: 'Planetary alignment gives efficient windows about every 26 months.' },
      { q: 'Has a Sabatier reactor been used in space?', c: ['Yes, on the ISS', 'Never', 'Only on the Moon', 'Only on Venus'], a: 0, f: 'The ISS used a Sabatier system to recover water from CO2.' }
    ]
  },
  {
    title: 'COMMS DELAY',
    intro: [
      'Sol 11! Signals to Earth take minutes to arrive, and the relay antenna is misaligned.',
      'Find two antenna parts, mount them on the ridge relay mast, align it and transmit your status report.'
    ],
    objectives: [
      { label: 'Repair the relay antenna', collect: 'part', n: 2, steps: [
        step('ridge', 'mount', 'At Jezero Ridge, mount the antenna parts.', { need: { part: 2 }, consume: { part: 2 } }),
        step('ridge', 'align', 'Choose an alignment target.', { choices: [
          { id: 'orbiter', name: 'Align to the orbiter relay pass', cost: { energy: 2 }, outcome: 'Low power. Data waits for the next orbiter pass.' },
          { id: 'dte', name: 'Direct-to-Earth high-gain link', cost: { energy: 6 }, science: 3, outcome: 'Uses more power for a faster science downlink.' }
        ] }),
        step('ridge', 'transmit', 'Transmit the status report.', { fact: 'Report sent. NASA\'s Deep Space Network has antenna sites in California, Spain and Australia.' })
      ] }
    ],
    spawns: [...sp('part', [1400, 4300]), ...sp('scrap', [2400])],
    quiz: [
      { q: 'Where are NASA\'s Deep Space Network antenna sites?', c: ['California, Spain, Australia', 'Only Florida', 'Moon and Mars', 'Japan only'], a: 0, f: 'Goldstone, Madrid and Canberra give continuous coverage as Earth rotates.' },
      { q: 'What blocks Earth-Mars communications about every two years?', c: ['Solar conjunction', 'Moon phases', 'Rain', 'Dust devils'], a: 0, f: 'During solar conjunction the Sun lies between Earth and Mars.' },
      { q: 'How fast do radio signals travel?', c: ['Speed of sound', 'Speed of light', 'Half of light speed', 'Instantly'], a: 1, f: 'Radio waves travel at the speed of light.' },
      { q: 'How big are the largest DSN dish antennas?', c: ['7 m', '70 m', '700 m', '2 m'], a: 1, f: 'The largest DSN antennas are 70 m across.' },
      { q: 'Which of these orbiters has relayed rover data?', c: ['Mars Odyssey', 'Hubble', 'Voyager 1', 'Kepler'], a: 0, f: '2001 Mars Odyssey has served as a long-lived relay.' }
    ]
  },
  {
    title: 'WATER CRISIS',
    intro: [
      'Sol 12! Overnight sensors show the extractor bearings are failing and the water reserve is dropping.',
      'Service the extractor, drill for subsurface ice, melt it and purify the water. Every litre counts.'
    ],
    objectives: [
      { label: 'Restore water production', steps: [
        trk('extractor_service', 1, 'At the ICE EXTRACTOR choose "Service bearings" (3 materials).'),
        trk('drill', 2, 'Drill for subsurface ice twice (5 kWh each).'),
        trk('extract', 2, 'Melt 2 ice blocks into raw water.'),
        trk('purify', 1, 'Run a purification batch.', { fact: 'Water restored. Mars water ice is found at the poles and in shallow subsurface deposits.' })
      ] }
    ],
    spawns: sp('scrap', [1700, 3400]),
    quiz: [
      { q: 'Which instrument type maps buried ice from orbit?', c: ['Sounding radar', 'Thermometer', 'Microphone', 'Barometer'], a: 0, f: 'MRO\'s SHARAD radar probes subsurface ice layers.' },
      { q: 'At low pressure, water boils at…', c: ['A higher temperature', 'A lower temperature', 'Exactly 100 °C', 'It cannot boil'], a: 1, f: 'Lower pressure lowers the boiling point of water.' },
      { q: 'Electrolysis splits water into…', c: ['Hydrogen and oxygen', 'Carbon and oxygen', 'Salt and ice', 'Methane'], a: 0, f: '2H2O → 2H2 + O2.' },
      { q: 'Why is perchlorate a concern for crews?', c: ['It can harm the thyroid', 'It is magnetic', 'It glows', 'It is sweet'], a: 0, f: 'Perchlorate can interfere with thyroid function, so water must be treated.' },
      { q: 'What do Mars\' polar caps contain?', c: ['Water ice and seasonal CO2 ice', 'Liquid oceans', 'Lava', 'Only sand'], a: 0, f: 'The caps hold water ice plus seasonal carbon-dioxide frost.' }
    ]
  },
  {
    title: 'ICE CORE SURVEY',
    intro: [
      'Sol 13! Future crews need to know where ice is. Perseverance carries RIMFAX, a ground-penetrating radar.',
      'Collect three ice cores from the deposit field, run a subsurface survey at the ridge and log the cores at the habitat. The cores can then feed your water supply.'
    ],
    objectives: [
      { label: 'Ice core survey', collect: 'ice', n: 3, science: true, steps: [
        step('ridge', 'survey', 'At Jezero Ridge, run the subsurface survey (3 kWh, 2 fuel).', { cost: { energy: 3, fuel: 2 } }),
        step('habitat', 'log', 'At the habitat, log the three ice cores.', { need: { ice: 3 }, fact: 'Cores logged. Melt them in the extractor to add to your water supply.' })
      ] }
    ],
    spawns: [...sp('ice', [4350, 4500, 4650, 4800]), ...sp('scrap', [2000])],
    quiz: [
      { q: 'What is RIMFAX on Perseverance?', c: ['Ground-penetrating radar', 'A drill', 'A helicopter', 'A laser'], a: 0, f: 'RIMFAX images buried rock layers with radar.' },
      { q: 'Where did Phoenix land?', c: ['Northern arctic plains', 'Olympus Mons', 'Valles Marineris', 'The equator'], a: 0, f: 'Phoenix landed in the northern plains (Vastitas Borealis) in 2008.' },
      { q: 'What did Curiosity find evidence of in Gale Crater?', c: ['An ancient lake', 'Living microbes', 'Liquid oceans today', 'Ice volcanoes'], a: 0, f: 'Curiosity found an ancient lakebed environment.' },
      { q: 'Mars\' average distance from the Sun is about…', c: ['1.52 AU', '0.7 AU', '5.2 AU', '1.0 AU'], a: 0, f: 'About 1.52 AU, roughly 228 million km.' },
      { q: 'Why map ice before building a base?', c: ['Water supports life support and fuel', 'For decoration', 'To find gold', 'No reason'], a: 0, f: 'Local water could supply drinking water, oxygen and propellant.' }
    ]
  },
  {
    title: 'STOCKPILE',
    intro: [
      'Sol 14! Tomorrow is ascent preparation. Make sure tomorrow\'s food, water and oxygen are covered.',
      'Tend the greenhouse, clean two solar panels for the final sol and audit storage at the habitat.'
    ],
    objectives: [
      { label: 'Greenhouse care', steps: [
        step('greenhouse-entry', 'enter', 'Enter the greenhouse.'),
        trk(['gh_harvest', 'gh_inspect'], 2, 'Harvest ready beds, or log growth data (2 actions).'),
        trk('gh_water', 1, 'Water a planted bed.')
      ] },
      { label: 'Final power prep', steps: [
        trk('clean', 2, 'Clean 2 solar panels (open a panel\'s menu with E).')
      ] },
      { label: 'Storage audit', steps: [
        step('habitat', 'audit', 'At the habitat, audit all storage levels.', { fact: 'Audit complete. Check the RESOURCES panel for days of supply left.' })
      ] }
    ],
    spawns: sp('scrap', [2550, 4250]),
    quiz: [
      { q: 'What was the first Veggie-grown crop astronauts ate (2015)?', c: ['Red romaine lettuce', 'Potatoes', 'Rice', 'Tomatoes'], a: 0, f: 'In August 2015 astronauts ate Veggie-grown red romaine lettuce.' },
      { q: 'What does APH stand for?', c: ['Advanced Plant Habitat', 'Automated Potato House', 'Air Pressure Heater', 'Algae Production Hub'], a: 0, f: 'The Advanced Plant Habitat is a large plant-growth chamber on the ISS.' },
      { q: 'Which crop was grown in the APH in 2021?', c: ['Chile peppers', 'Bananas', 'Coffee', 'Corn'], a: 0, f: 'Plant Habitat-04 grew Hatch chile peppers.' },
      { q: 'What growth medium do Veggie plant pillows use?', c: ['Arcillite (calcined clay)', 'Sand', 'Martian dust', 'Cotton'], a: 0, f: 'Veggie pillows contain arcillite plus controlled-release fertilizer.' },
      { q: 'What is a plant\'s growth response to gravity called?', c: ['Gravitropism', 'Phototropism', 'Osmosis', 'Respiration'], a: 0, f: 'Gravitropism guides roots down and shoots up.' }
    ]
  },
  {
    title: 'ASCENT PREP',
    intro: [
      'Final sol! Load the ascent fuel reserve, hand the greenhouse over to the next crew and send the final report.',
      'Crops that are still growing are a gift to the next crew. You do not need to finish them. Good luck, Commander!'
    ],
    objectives: [
      { label: 'Fuel the ascent vehicle', steps: [
        step('isru', 'ascent', 'At the ISRU PLANT, transfer the ascent fuel reserve.', { ascent: true, fact: 'Ascent reserve loaded. A Mars Ascent Vehicle concept is part of NASA\'s Mars Sample Return studies.' })
      ] },
      { label: 'Greenhouse handover', steps: [
        step('greenhouse-entry', 'enter', 'Enter the greenhouse.'),
        trk(['gh_inspect', 'gh_harvest'], 1, 'Record the final growth log at a bed (or harvest one).')
      ] },
      { label: 'Final mission report', steps: [
        step('habitat', 'compile', 'At the habitat, compile science, crop, power and resource records.'),
        step('habitat', 'priority', 'Choose the report priority.', { choices: [
          { id: 'crop', name: 'Crop-growth research', science: 3, outcome: 'Highlights greenhouse data.' },
          { id: 'systems', name: 'Life-support systems', science: 3, outcome: 'Highlights ISRU and recycling data.' }
        ] }),
        step('habitat', 'transmit', 'Transmit the final report (3 kWh).', { cost: { energy: 3 }, fact: 'Final report sent through the Mars relay network.' })
      ] }
    ],
    spawns: [],
    quiz: [
      { q: 'Which landing system lowered Perseverance to the ground?', c: ['Sky crane', 'Airbags', 'Parachute only', 'Wings'], a: 0, f: 'A rocket-powered sky crane lowered Curiosity and Perseverance.' },
      { q: 'A typical Earth-to-Mars trip takes about…', c: ['3 days', '6-9 months', '5 years', '2 weeks'], a: 1, f: 'Typical transfers take roughly 6 to 9 months.' },
      { q: 'Which was NASA\'s first successful Mars lander (1976)?', c: ['Viking 1', 'Pathfinder', 'Phoenix', 'Spirit'], a: 0, f: 'Viking 1 landed on July 20, 1976.' },
      { q: 'What protects a spacecraft during atmospheric entry?', c: ['Heat shield', 'Solar panels', 'Antenna', 'Wheels'], a: 0, f: 'The heat shield absorbs and sheds the heat of entry.' },
      { q: 'What is a Mars Ascent Vehicle for?', c: ['Launching from Mars\' surface to orbit', 'Drilling', 'Farming', 'Weather'], a: 0, f: 'A MAV would lift samples or crew from the surface to orbit.' }
    ]
  }
];
