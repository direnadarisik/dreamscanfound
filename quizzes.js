// Mission-specific quizzes (5 per day) and short learning tips, written for ages 11-14.
// q = question, c = 4 choices, a = index of the correct choice, f = short explanation.
export const QUIZZES = [
  // Day 1 · ARRIVAL – habitat check, first greenhouse bed, solar panel
  [
    { q: 'Why do astronauts need a sealed habitat on Mars?', c: ['To keep the dust pretty', 'Mars air is very thin and has almost no oxygen', 'Mars is too hot', 'To hide from aliens'], a: 1, f: 'Mars air is about 95% carbon dioxide and very thin, so people need a sealed, pressurized home with oxygen.' },
    { q: 'What did you put in the greenhouse bed before planting seeds?', c: ['Ice cubes', 'Rocks from outside', 'Growing medium (special soil-like material)', 'Nothing'], a: 2, f: 'Roots need something to grow in. The growing medium holds water and supports the plant.' },
    { q: 'Why did you water the bed after planting?', c: ['Seeds need water to start growing', 'To clean the seeds', 'To make the bed heavier', 'Water is not needed'], a: 0, f: 'A seed soaks up water before it can sprout. Without water, it stays asleep.' },
    { q: 'Why did you switch ON the LED grow lights?', c: ['To keep astronauts awake', 'Plants need light to make their food', 'To warm the rocks', 'To scare bugs'], a: 1, f: 'Plants use light energy to make food. This is called photosynthesis.' },
    { q: 'Why did you clean the solar panel?', c: ['Dust blocks sunlight, so less electricity is made', 'To make it shiny for photos', 'Dust makes it heavier', 'It was not useful'], a: 0, f: 'Solar panels turn sunlight into electricity. Dust covers them and lowers the power they make.' }
  ],
  // Day 2 · ROCK HOUNDS – rock samples, water audit
  [
    { q: 'Why did you collect rock samples?', c: ['To build a wall', 'Rocks can hold clues about Mars\' past, like old water', 'To throw them', 'To use as food'], a: 1, f: 'Scientists study rocks to learn what Mars was like long ago. Some rocks only form with water.' },
    { q: 'What was Jezero Crater, where your base is, long ago?', c: ['A lake with a river delta', 'A volcano', 'An ocean of lava', 'A forest'], a: 0, f: 'Jezero once held a lake. That is why NASA sent the Perseverance rover there.' },
    { q: 'Why did you seal and label the rock samples?', c: ['To keep them clean and know where each came from', 'To make them heavier', 'To hide them', 'Labels are just decoration'], a: 0, f: 'Sealed, labelled samples stay clean so scientists can trust the results.' },
    { q: 'Why did you check the water tank levels?', c: ['To know how much water the crew has each day', 'To see if fish live there', 'To paint the tanks', 'It is not important'], a: 0, f: 'Knowing your water supply helps you plan. Astronauts use water every day.' },
    { q: 'What does the water recycler do?', c: ['Makes water from rocks', 'Cleans used water so it can be used again', 'Freezes water', 'Turns water into fuel'], a: 1, f: 'Recycling cleans used water. On the space station almost all water is recycled.' }
  ],
  // Day 3 · DUST STORM – clean and check panels A, B, C
  [
    { q: 'What happens to solar panels during a dust storm?', c: ['They make more electricity', 'Dust covers them and they make less electricity', 'Nothing happens', 'They turn into batteries'], a: 1, f: 'Dust blocks sunlight, so the panels make less electricity.' },
    { q: 'How do solar panels make electricity?', c: ['From wind', 'From sunlight', 'From dust', 'From water'], a: 1, f: 'Solar panels turn sunlight into electricity.' },
    { q: 'Why did you check each panel AFTER cleaning it?', c: ['To make sure it works well again', 'To get dirty again', 'To turn it off', 'No reason'], a: 0, f: 'Checking after a repair proves the job worked. Engineers always test their work.' },
    { q: 'Why is electricity important for a Mars base?', c: ['Only for music', 'It runs air, water, heat and lights that keep astronauts alive', 'It is not needed', 'Only for the rover'], a: 1, f: 'Almost every system in the base needs electricity, including the systems that keep astronauts alive.' },
    { q: 'Can dust storms on Mars become very big?', c: ['No, they are always tiny', 'Yes, some cover the whole planet', 'Only indoors', 'Only on Earth'], a: 1, f: 'Some Mars dust storms grow so big they cover the whole planet.' }
  ],
  // Day 4 · WATER WORKS – ice → melt → purify, water the greenhouse
  [
    { q: 'Where did you get water on Mars today?', c: ['From rain', 'From ice that you melted', 'From a river', 'From the rover'], a: 1, f: 'Mars has ice in the ground and at the poles. Melting it gives water.' },
    { q: 'Why did you purify the melted ice water?', c: ['To make it colder', 'Mars soil has harmful salts, so water must be cleaned', 'To change its color', 'To make it heavier'], a: 1, f: 'Mars soil contains salts called perchlorates. They must be removed before people drink the water.' },
    { q: 'Why does making water need electricity?', c: ['Machines that melt and clean water need power', 'Water is made from electricity', 'It does not need any', 'To make it fizzy'], a: 0, f: 'The extractor and purifier are machines, and machines need electricity to run.' },
    { q: 'What happens if plants do not get enough water?', c: ['They grow faster', 'They dry out, become weak and can die', 'They turn blue', 'Nothing'], a: 1, f: 'Plants need water to grow and stay healthy. Without it they wilt and can die.' },
    { q: 'What comes out of a seed first when it starts to grow?', c: ['A flower', 'A fruit', 'A tiny root', 'A leaf'], a: 2, f: 'The first root (called the radicle) comes out first to take in water.' }
  ],
  // Day 5 · ROVER REPAIR – parts, test, fuel
  [
    { q: 'What did you need to collect to fix the rover?', c: ['Ice blocks', 'Spare parts', 'Seeds', 'Rocks'], a: 1, f: 'You found two spare parts and installed them one at a time.' },
    { q: 'Why did you test the rover after fixing it?', c: ['To make sure it is safe and works', 'To break it again', 'To waste fuel', 'Just for fun'], a: 0, f: 'Testing shows the repair worked before you trust the rover on a real trip.' },
    { q: 'Why did the test drive use fuel?', c: ['Moving a vehicle needs energy', 'Fuel cleans the wheels', 'It did not use fuel', 'To make smoke'], a: 0, f: 'Every vehicle needs energy to move. Using fuel today means less is left later.' },
    { q: 'Why is it smart to save some fuel?', c: ['Fuel is needed on Day 15 to leave Mars', 'Fuel is heavy', 'It looks nice', 'Fuel grows over time'], a: 0, f: 'Your crew needs a fuel reserve to launch home on the last day.' },
    { q: 'Why can\'t people on Earth drive the rover live like a video game?', c: ['Messages take minutes to travel between Earth and Mars', 'The rover has no wheels', 'It is too dark', 'Rovers drive themselves only at night'], a: 0, f: 'Radio messages take about 3 to 22 minutes to reach Mars, so drivers plan commands ahead.' }
  ],
  // Day 6 · RIDGE SCOUT – weather station, sensors, data
  [
    { q: 'What does a weather station measure?', c: ['Things like temperature and wind', 'How fast rovers drive', 'How many rocks there are', 'Plant height'], a: 0, f: 'Weather stations measure temperature, wind, air pressure and more.' },
    { q: 'Why did you use rocks to hold the weather station?', c: ['To keep it steady in the wind', 'To make it pretty', 'Rocks give it power', 'To hide it'], a: 0, f: 'A steady station gives correct readings, even when the wind blows.' },
    { q: 'Why did you calibrate the sensor?', c: ['To make sure its readings are correct', 'To turn it off', 'To paint it', 'To make it louder'], a: 0, f: 'Calibrating means checking a tool against a known value so its measurements are right.' },
    { q: 'Compared with Earth, Mars is usually…', c: ['Much warmer', 'Much colder', 'The same', 'Always 20 °C'], a: 1, f: 'Mars is much colder than Earth. The average is about -63 °C.' },
    { q: 'Why send weather data back to the base?', c: ['So the crew can plan safe work outside', 'To fill up memory', 'It is not useful', 'To make noise'], a: 0, f: 'Knowing the weather helps astronauts plan outside walks and protect equipment.' }
  ],
  // Day 7 · LIFE SUPPORT AUDIT – recycler filters, CO2 check, crops
  [
    { q: 'What does "life support" mean?', c: ['Systems that keep astronauts alive, like air and water', 'A game menu', 'A kind of rocket', 'A space plant'], a: 0, f: 'Life support gives astronauts clean air, safe water and the right temperature.' },
    { q: 'Why did you replace the recycler filters?', c: ['Dirty filters stop cleaning water well', 'To change their color', 'Filters never get dirty', 'To make it louder'], a: 0, f: 'Filters catch dirt. When they get clogged, the machine works badly.' },
    { q: 'Which gas do people breathe out that must be removed from the air?', c: ['Oxygen', 'Carbon dioxide', 'Helium', 'Neon'], a: 1, f: 'We breathe out carbon dioxide (CO2). Too much of it in a closed room is dangerous.' },
    { q: 'Why should we check on greenhouse plants often?', c: ['To spot problems like dry soil early', 'Plants like visitors', 'To pick them early', 'There is no reason'], a: 0, f: 'Checking plants often helps you fix problems before they get serious.' },
    { q: 'What do plants need to grow?', c: ['Light, water and the right temperature', 'Only darkness', 'Only rocks', 'Only fuel'], a: 0, f: 'Plants need light, water, air (CO2) and a good temperature.' }
  ],
  // Day 8 · OXYGEN FACTORY – oxygen from CO2, salvage
  [
    { q: 'Which gas from Mars air did the oxygen machine use?', c: ['Carbon dioxide (CO2)', 'Nitrogen', 'Helium', 'Steam'], a: 0, f: 'Mars air is mostly CO2. The machine splits CO2 to free the oxygen.' },
    { q: 'Why do astronauts need to make oxygen?', c: ['Mars air has almost no oxygen to breathe', 'Oxygen is used for painting', 'It makes rocks lighter', 'They don\'t need it'], a: 0, f: 'Less than 1% of Mars air is oxygen, so people cannot breathe it.' },
    { q: 'What did making oxygen use from the base?', c: ['Electricity', 'Seeds', 'Rocks', 'Nothing'], a: 0, f: 'Splitting CO2 needs energy, so the oxygen machine uses electricity.' },
    { q: 'Which real NASA tool proved we can make oxygen on Mars?', c: ['MOXIE on the Perseverance rover', 'A telescope', 'A weather balloon', 'A helicopter'], a: 0, f: 'MOXIE made small amounts of oxygen from Mars air between 2021 and 2023.' },
    { q: 'Why did you collect salvage (old metal parts)?', c: ['Reusing parts saves bringing new ones from Earth', 'To throw them away', 'For decoration', 'To make noise'], a: 0, f: 'Sending things from Earth is hard and costly. Reusing parts saves resources.' }
  ],
  // Day 9 · FIRST HARVEST – harvest, replant
  [
    { q: 'Why can microgreens be harvested during this mission?', c: ['They grow fast, in about 1-2 weeks', 'They never grow', 'They grow in 1 hour', 'They need a whole year'], a: 0, f: 'Microgreens are young plants picked after about 7-14 days.' },
    { q: 'What did harvesting the plants give your crew?', c: ['Fuel', 'Food', 'Oxygen tanks', 'Electricity'], a: 1, f: 'Harvested plants go into food storage for the crew.' },
    { q: 'Why did you plant new seeds after harvesting?', c: ['To keep food coming in the future', 'To use up water', 'To clean the bed', 'For no reason'], a: 0, f: 'Planting again keeps food growing. Farmers call this succession planting.' },
    { q: 'Why add fresh growing medium to the bed?', c: ['The old medium was used up and removed', 'To make the bed heavier', 'Plants hate old soil', 'It is not needed'], a: 0, f: 'After harvest the old medium is removed, so new plants need fresh medium.' },
    { q: 'Which action helps plants grow in a greenhouse?', c: ['Turning the lights off forever', 'Giving the right amount of water and light', 'Never watering', 'Making it freezing cold'], a: 1, f: 'A controlled greenhouse gives plants the right water, light and temperature.' }
  ],
  // Day 10 · FUEL FOR THE FUTURE – methane fuel, water top-up
  [
    { q: 'What did each fuel batch use?', c: ['Water and electricity', 'Seeds and soil', 'Rocks only', 'Nothing'], a: 0, f: 'Your fuel plant used 2 L of water and 6 kWh of electricity per batch.' },
    { q: 'Why make rocket fuel on Mars instead of bringing it all from Earth?', c: ['Bringing everything would make the rocket too heavy', 'Earth fuel does not work on Mars', 'It is more fun', 'There is no reason'], a: 0, f: 'Using local materials means the rocket from Earth can be lighter.' },
    { q: 'What is the fuel your plant made?', c: ['Methane', 'Gasoline', 'Wood', 'Coal'], a: 0, f: 'The plant joins CO2 and hydrogen to make methane, a rocket fuel.' },
    { q: 'Why did you collect and melt more ice today?', c: ['Making fuel used up some water', 'Ice is food', 'To build an igloo', 'To cool the rover'], a: 0, f: 'Fuel production used water, so you refilled your water supply.' },
    { q: 'What does "using local resources" mean on Mars?', c: ['Using Mars air, ice and soil to make things', 'Buying things on Earth', 'Using only Earth supplies', 'Asking aliens for help'], a: 0, f: 'Scientists call this ISRU: making what you need from what is already on Mars.' }
  ],
  // Day 11 · COMMS DELAY – antenna repair, relay
  [
    { q: 'What does "communication delay" mean?', c: ['The time needed for messages to reach Earth', 'A broken phone', 'A slow rover', 'A quiet radio'], a: 0, f: 'Radio messages travel very fast, but Mars is so far away that they still take minutes.' },
    { q: 'About how long can a message take to travel from Mars to Earth?', c: ['1 second', '3 to 22 minutes', '3 days', '1 year'], a: 1, f: 'It depends on where the planets are, from about 3 to 22 minutes one way.' },
    { q: 'Why did you point (align) the antenna?', c: ['The signal must aim at its target to arrive', 'To make it look nice', 'To catch rain', 'To make it heavier'], a: 0, f: 'Antennas send signals in a direction. A badly aimed antenna loses the message.' },
    { q: 'How can a spacecraft orbiting Mars help?', c: ['It can relay (pass on) messages to Earth', 'It brings food', 'It makes oxygen', 'It cleans panels'], a: 0, f: 'Orbiters pass messages between rovers and Earth.' },
    { q: 'Why did the direct link to Earth use more electricity?', c: ['A long-distance signal needs more power', 'It plays music', 'It heats the base', 'It did not'], a: 0, f: 'Sending a strong signal all the way to Earth needs more power.' }
  ],
  // Day 12 · WATER CRISIS – service, drill, melt, purify
  [
    { q: 'Why did you service (fix) the ice extractor first?', c: ['A worn machine works badly or breaks', 'To make noise', 'To paint it', 'It was not needed'], a: 0, f: 'Fixing machines before they break keeps water coming.' },
    { q: 'What were the steps to make drinking water today?', c: ['Drill ice → melt it → purify it', 'Wait for rain', 'Dig a well', 'Buy water'], a: 0, f: 'You drilled ice, melted it into raw water, then cleaned it to make it safe.' },
    { q: 'Why is saving water important on Mars?', c: ['Making new water takes work, energy and time', 'Water is free', 'Water falls from the sky', 'It is not important'], a: 0, f: 'Every litre on Mars takes effort to make, so wasting water is risky.' },
    { q: 'Which choice helps save water?', c: ['Recycling used water', 'Leaving taps running', 'Overwatering plants', 'Throwing water away'], a: 0, f: 'Recycling lets the crew use the same water again and again.' },
    { q: 'Why do astronauts need clean water?', c: ['For drinking, cooking and staying healthy', 'Only for swimming', 'Only for washing rovers', 'They do not need it'], a: 0, f: 'Clean water keeps people healthy. Dirty water can make people sick.' }
  ],
  // Day 13 · ICE CORE SURVEY – radar survey, ice cores
  [
    { q: 'What did your underground survey look for?', c: ['Ice hidden under the ground', 'Gold', 'Aliens', 'Lava'], a: 0, f: 'A ground-penetrating radar can find buried ice without digging.' },
    { q: 'Why is finding ice important for future astronauts?', c: ['Ice gives water, oxygen and fuel', 'Ice is fun to slide on', 'It is not important', 'Ice is food'], a: 0, f: 'Water from ice can be drunk, split into oxygen, or used to make fuel.' },
    { q: 'What is an ice core?', c: ['A tube-shaped sample of ice', 'A frozen planet', 'A cold rover', 'An ice cream'], a: 0, f: 'An ice core is a long piece of ice taken out for study.' },
    { q: 'Where is ice found on Mars?', c: ['At the poles and under the ground', 'Only in the sky', 'Nowhere', 'Only in volcanoes'], a: 0, f: 'Mars has ice caps at its poles and ice under the ground in many places.' },
    { q: 'Why did you log (record) the ice cores at the habitat?', c: ['So scientists know where each sample came from', 'To melt them', 'To hide them', 'Logging is not useful'], a: 0, f: 'Good records make science useful for future crews.' }
  ],
  // Day 14 · STOCKPILE – greenhouse care, clean panels, storage check
  [
    { q: 'Why did you check all storage levels today?', c: ['To be sure there is enough for the last day', 'To count rocks', 'To clean the tanks', 'No reason'], a: 0, f: 'Planning ahead means the crew has enough water, food and oxygen.' },
    { q: 'Why clean the solar panels before the final day?', c: ['Clean panels make more electricity', 'To make them shine', 'Dust is food', 'To make them lighter'], a: 0, f: 'More electricity tomorrow keeps every system running.' },
    { q: 'What happens when energy reserves become very low?', c: ['Important systems may stop working', 'Nothing', 'The base gets brighter', 'Plants grow faster'], a: 0, f: 'With no electricity, machines for air, water and heat can shut down.' },
    { q: 'Which equipment needs electricity?', c: ['Grow lights, water purifier and oxygen machine', 'Rocks', 'Ice', 'Seeds'], a: 0, f: 'Lights, purifiers and oxygen machines all run on electricity.' },
    { q: 'Why should we monitor greenhouse temperature?', c: ['Too hot or too cold can hurt plants', 'Plants like to be frozen', 'Temperature does not matter', 'To heat the rover'], a: 0, f: 'Each plant has a temperature range where it grows best.' }
  ],
  // Day 15 · ASCENT PREP – fuel transfer, handover, final report
  [
    { q: 'Why did you load the fuel reserve today?', c: ['The rocket needs fuel to launch from Mars', 'To clean the rover', 'To water plants', 'It was not needed'], a: 0, f: 'A rocket needs plenty of fuel to lift off from Mars and go home.' },
    { q: 'Why leave growing plants for the next crew?', c: ['They can harvest them later', 'Plants are heavy', 'Nobody likes plants', 'To make a mess'], a: 0, f: 'Some crops take a month or more to grow, so the next crew can enjoy them.' },
    { q: 'Why did you send a final mission report?', c: ['So scientists on Earth learn from your mission', 'To say goodbye only', 'Reports are not useful', 'To use up electricity'], a: 0, f: 'Sharing results helps future missions do even better.' },
    { q: 'Which resources did your crew make on Mars during this mission?', c: ['Water, oxygen, food and fuel', 'Only gold', 'Nothing', 'Only rocks'], a: 0, f: 'You produced water from ice, oxygen from CO2, food in the greenhouse and fuel at the plant.' },
    { q: 'What is the most important lesson for living on Mars?', c: ['Plan and save resources carefully', 'Use everything quickly', 'Ignore the machines', 'Never check the weather'], a: 0, f: 'Saving resources and planning ahead helps astronauts survive.' }
  ]
];

// Short "Did you know?" tips shown during each day's mission.
export const TIPS = [
  [['🌱', 'Plants need light to grow.'], ['☀️', 'Solar panels turn sunlight into electricity.'], ['🏠', 'Mars air is too thin to breathe, so astronauts live in a sealed habitat.']],
  [['🪨', 'Rocks can show where water flowed long ago.'], ['💧', 'Clean water is important for astronauts.'], ['♻️', 'Recycling water means less water is wasted.']],
  [['🌪️', 'Some Mars dust storms cover the whole planet.'], ['☀️', 'Dusty panels make less electricity.'], ['⚡', 'Saving electricity keeps important machines running.']],
  [['🧊', 'Mars has ice under the ground and at its poles.'], ['🧪', 'Melted Mars ice must be cleaned before drinking.'], ['🌱', 'Seeds need water to start growing.']],
  [['🔧', 'Always test a machine after fixing it.'], ['📡', 'Messages take minutes to travel between Earth and Mars.'], ['⛽', 'Save fuel: you need it to leave Mars on Day 15.']],
  [['🌡️', 'Mars is much colder than Earth.'], ['📏', 'Calibrating a sensor makes its readings correct.'], ['🧲', 'Mars has no global magnetic field like Earth.']],
  [['🫁', 'People breathe out carbon dioxide, which must be removed.'], ['🧽', 'Clogged filters make machines work badly.'], ['🌱', 'Plants need water, light and the right temperature.']],
  [['🌬️', 'Mars air is mostly carbon dioxide (CO2).'], ['⚗️', 'Machines can split CO2 to make oxygen.'], ['♻️', 'Reusing old parts saves resources.']],
  [['🥗', 'Microgreens can be picked after about 1-2 weeks.'], ['🌾', 'Planting again after harvest keeps food coming.'], ['💡', 'LED grow lights help plants grow indoors.']],
  [['🚀', 'Making fuel on Mars means the rocket from Earth can be lighter.'], ['💧', 'Making fuel uses water and electricity.'], ['🔁', 'Using Mars air, ice and soil is called using local resources.']],
  [['📡', 'Radio signals travel at the speed of light.'], ['🛰️', 'Orbiters pass messages between Mars and Earth.'], ['🎯', 'Antennas must be aimed at their target.']],
  [['🛠️', 'Fixing machines early stops bigger problems.'], ['🚰', 'Every litre of water on Mars takes work to make.'], ['💚', 'Saving resources helps astronauts survive.']],
  [['📻', 'Radar can find ice hidden under the ground.'], ['🧊', 'Ice can become water, oxygen and fuel.'], ['📝', 'Good records help future crews.']],
  [['📦', 'Check your supplies before a big day.'], ['🌡️', 'Each plant grows best in its own temperature range.'], ['⚡', 'Low energy can make important systems stop.']],
  [['🚀', 'A rocket needs lots of fuel to leave Mars.'], ['🌱', 'Some crops take a month or more to grow.'], ['📤', 'Sharing results helps future missions.']]
];
