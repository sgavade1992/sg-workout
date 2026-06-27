// ALL TRAINING DATA
// Sources: HYROX official, PureGym, TrainRox, Nerd Fitness, Healthline, ACSM

const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];

// ── TYPE HELPERS ───────────────────────────────────────
function tclass(t){
  t=(t||'').toLowerCase();
  if(/run|tempo|interval|long|stride|zone.?[234]|cardio|walk|liss|hiit/.test(t))return'run';
  if(/str|squat|dead|lift|press|bench|lunge|hip|glute|pull.?up|carry|sandbag|farmer|full.?body/.test(t))return'str';
  if(/hyrox|combo|sim|ski(?:erg)?|sled|burpee|wall.?ball/.test(t))return'hyrox';
  return'rest';
}
function bclass(t){return{run:'b-run',str:'b-str',hyrox:'b-hyrox',rest:'b-rest'}[tclass(t)]||'b-rest';}
const TC={run:'#00c8f0',str:'#ff3d55',hyrox:'#e8ff47',rest:'#606090'};

// ── HYROX STATIONS ─────────────────────────────────────
const STATIONS=[
  {num:1,name:'SkiErg',emoji:'🎿',spec:'1,000 m',weight:'—',muscles:'Lats · Shoulders · Triceps · Core',col:'#00c8f0',
   tip:'Don\'t blow up your arms in the first 200m. Use a strong hip hinge — let gravity pull the handles. Think rhythm not power.',
   training:[{e:'SkiErg 5×200m',d:'Race pace, 90 sec rest. Lactate tolerance.'},{e:'SkiErg Steady 3×3 min',d:'Moderate effort, 2 min rest. Aerobic base.'},{e:'Lat Pulldown 4×12',d:'Mimics the pull-down stroke.'},{e:'Overhead Tricep Extension 3×15',d:'Powers the pull-down.'},{e:'Plank Hold 3×45 sec',d:'Core stability for erg posture.'}]},
  {num:2,name:'Sled Push',emoji:'🛷',spec:'50m (4×12.5m)',weight:'102 kg',muscles:'Quads · Glutes · Calves · Core · Chest',col:'#ff3d55',
   tip:'Drive with your legs, not arms. Hips low, chest forward. Short powerful strides. Don\'t stop mid-length — momentum is everything.',
   training:[{e:'Sled Push 4×25m 70%',d:'Build to race weight by Week 8.'},{e:'Heavy Sled Push 2×12.5m 120%',d:'Overload protocol.'},{e:'Back Squat 4×6–8',d:'Leg drive power.'},{e:'Romanian Deadlift 4×10',d:'Posterior chain.'},{e:'Wall Sit 3×60 sec',d:'Isometric quad endurance.'}]},
  {num:3,name:'Sled Pull',emoji:'🔗',spec:'50m (4×12.5m)',weight:'102 kg',muscles:'Back · Grip · Biceps · Glutes · Core',col:'#ff3d55',
   tip:'Hand-over-hand pull, walk sled back. Keep tension on rope — slack = wasted energy. Grip and lats are the limiters.',
   training:[{e:'Sled Pull 4×25m',d:'Hand-over-hand. Technique first.'},{e:'Seated Cable Row 4×12',d:'Mimics pulling motion.'},{e:'Dead Hang 3×max',d:'Grip endurance is critical.'},{e:"Farmer Walk 4×40m heavy",d:'Grip and posture under load.'},{e:'Face Pull 3×15',d:'Rear delt health.'}]},
  {num:4,name:'Burpee Broad Jumps',emoji:'💨',spec:'80 m total',weight:'BW',muscles:'Full body · Cardio · Explosive power',col:'#ff9a35',
   tip:'Stay rhythmic — smooth beats wild. Small jumps conserve energy. Chest to floor, then jump forward. Your HR will spike — breathe through it.',
   training:[{e:'Burpee Broad Jumps 4×10',d:'Smooth and controlled. Form first, speed second.'},{e:'Burpee EMOM 10 min',d:'8 burpees every minute. Metabolic conditioning.'},{e:'Broad Jump 5×5',d:'Explosive hip extension.'},{e:'Box Jump 4×8',d:'Plyometric power.'},{e:'Push-Up 4×15',d:'Chest strength for burpee descent.'}]},
  {num:5,name:'Row',emoji:'🚣',spec:'1,000 m',weight:'Rower',muscles:'Legs · Back · Arms · Core (full body)',col:'#3df59e',
   tip:'Legs drive → lean back → arms. Always that order. 70% power comes from legs. Don\'t row too fast early.',
   training:[{e:'Row 2,000m Time Trial',d:'Every 2–3 weeks. Track progress.'},{e:'Row Intervals 8×250m',d:'Hard effort, 1 min rest.'},{e:'Steady State Row 20 min',d:'Zone 2. Aerobic base on erg.'},{e:'Deadlift 4×5',d:'Powers the leg drive phase.'},{e:'Cable Row 4×12',d:'Direct rowing muscle strength.'}]},
  {num:6,name:"Farmer's Carry",emoji:'🏋️',spec:'200 m',weight:'2×24 kg',muscles:"Grip · Traps · Core · Shoulders · Legs",col:'#b47fff',
   tip:'Walk tall. Shoulders back, core braced. Don\'t let the weights pull you down. If grip fails — set down and reset.',
   training:[{e:"Farmer's Carry 4×50m race wt",d:'Build to 4×60m by Week 8.'},{e:"Heavy Farmer's 2×30m 130%",d:'Overload protocol.'},{e:'Trap Bar Deadlift 4×8',d:'Full carry position strength.'},{e:'Plate Pinch Hold 3×30 sec',d:'Grip isolation.'},{e:'Single-Arm KB Carry 3×40m each',d:'Anti-lateral lean core work.'}]},
  {num:7,name:'Sandbag Lunges',emoji:'🎒',spec:'100 m',weight:'20 kg',muscles:'Quads · Glutes · Hamstrings · Core',col:'#e8ff47',
   tip:'Sandbag on shoulders behind neck. Full strides. By station 7 your legs are wrecked — train this when already fatigued.',
   training:[{e:'Sandbag Lunge 4×40m race wt',d:'Alternate legs each step.'},{e:'Barbell Walking Lunge 4×20m',d:'Lunge-specific leg strength.'},{e:'Bulgarian Split Squat 4×8–10 each',d:'Unilateral quad and glute power.'},{e:'Reverse Lunge 3×12 each',d:'Knee-friendly lunge variant.'},{e:'Step-Up 3×12 each',d:'Glute activation.'}]},
  {num:8,name:'Wall Balls',emoji:'⚽',spec:'100 reps',weight:'6 kg ball',muscles:'Quads · Shoulders · Core · Lungs',col:'#ff3d55',
   tip:'Break into sets from the start: 10–12 reps, brief rest. Don\'t grind to failure. Squat deep, explode up, hit 3m target. Last station — dig deep.',
   training:[{e:'Wall Ball 4×25 race weight',d:'Practice the rhythm and breathing.'},{e:'Wall Ball AMRAP 5 min',d:'Metabolic conditioning.'},{e:'Thruster 4×10',d:'Squat-to-press movement pattern.'},{e:'Front Squat 4×8',d:'Quad strength in catch position.'},{e:'Air Squat 3×30',d:'Squat endurance. Do at end of runs.'}]},
];

// ── HYROX 12-WEEK PLAN (Sunday-first) ─────────────────
// Week plan: 7 days starting Sunday
// Sunday = Strength + Light Run (every week)
function makeDay(d,type,title,detail,exs){ return {d,type,title,detail,exs}; }
function ex(name,sets,reps,load,rest,cues,timer,isCardio){
  return {name,sets,reps,load:load||'—',rest:rest||0,cues:cues||'',timer:timer||0,isCardio:!!isCardio};
}

const HP=[ // HYROX_PLAN
{w:1,phase:'Phase 1 — Aerobic Foundation',pc:'#00c8f0',days:[
  makeDay('Sun','str','Full Body Strength + Easy Run','Sunday strength is a cornerstone every week. Light load — technique first.',[
    ex('Back Squat','3','10','Light bar',90,'Chest up, full depth, drive through heels.',90),
    ex('Romanian Deadlift','3','10','Moderate',90,'Hip hinge, soft knee, hamstring stretch. Bar close to legs.',90),
    ex('Push-Up','3','15','BW',60,'Full plank, chest to floor, elbows 45°.',60),
    ex('Lat Pulldown','3','12','Light-moderate',60,'Pull elbows to hips, slow controlled return.',60),
    ex('Plank Hold','3','45 sec','BW',45,'Neutral spine, squeeze glutes, breathe.',45),
    ex('Easy Run 15 min','1','15 min','—',0,'Zone 2 HR 122–135 bpm. Walk if HR > 135.',900,true),
  ]),
  makeDay('Mon','run','Zone 2 Run','Pure aerobic base building. This feels too easy — that is correct.',[
    ex('Warmup Walk','1','5 min','—',0,'Brisk walk, raise HR slowly.',300,true),
    ex('Zone 2 Run','1','20–25 min','—',0,'HR 122–135 bpm. Walk if HR > 135. Fully conversational pace.',1200,true),
    ex('Hip Flexor Stretch','2','60 sec each','—',30,'Lunge position, tuck pelvis forward.',60),
    ex('Calf Stretch','2','45 sec each','—',20,'Straight leg against wall.',45),
  ]),
  makeDay('Tue','str','Lower Body Strength A','These muscles power the sled push, sandbag lunges, and wall balls.',[
    ex('Back Squat','3','10','Same as Sunday',90,'Drive through heels, brace core.',90),
    ex('Romanian Deadlift','3','10','Moderate',90,'Bar close to legs, hinge at hips.',90),
    ex('Walking Lunge','3','10 each','BW',75,'Full stride length. Torso upright.',75),
    ex('Glute Bridge','3','15','BW or plate',60,'Drive hips to ceiling, 1 sec squeeze at top.',60),
    ex('Dead Bug','3','10','BW',45,'Press lower back into floor throughout.',45),
  ]),
  makeDay('Wed','run','Zone 2 Run + Running Drills','Drills improve form and cadence. High cadence reduces injury risk and improves efficiency.',[
    ex('Zone 2 Run','1','25–30 min','—',0,'HR 122–135 bpm.',1500,true),
    ex('High Knees','3','20m','BW',20,'Drive knees to hip height, quick feet.',20),
    ex('Butt Kicks','3','20m','BW',20,'Heel to glute, slight forward lean.',20),
    ex('A-Skip','3','20m','BW',20,'Skip rhythm, drive knee up, push down through ball of foot.',20),
    ex('Strides','4','80m','—',45,'Controlled fast — NOT a sprint. Smooth acceleration. Walk back.',45),
  ]),
  makeDay('Thu','str','Upper Body + Row Intro','First rowing session. Record your time — this is Benchmark #1.',[
    ex('Pull-Up or Lat Pulldown','3','8–10','BW / moderate',90,'Full range, control the descent.',90),
    ex('Bent-Over DB Row','3','10','Moderate',75,'Elbow to ceiling, squeeze lat at top.',75),
    ex('Overhead Press','3','10','Light-moderate',75,'Core tight, no lower back arch.',75),
    ex("Farmer's Carry",'3','30m','Light KB',60,'Shoulders back, walk tall, grip firm.',60),
    ex('Row 1,000m Easy','1','1,000m','Rower',0,'Zone 2 pace. Legs drive first. RECORD YOUR TIME — Benchmark #1!',300,true),
  ]),
  makeDay('Fri','rest','Active Recovery','Recovery is training. Flush soreness, improve mobility. HR under 110 bpm.',[
    ex('Brisk Walk','1','20–30 min','—',0,'HR under 110 bpm. Zone 1.',1200,true),
    ex('Hip Flexor Stretch','2','60 sec each','—',20,'Lunge position, posterior tilt.',60),
    ex('Pigeon Pose','2','60 sec each','—',20,'Hips square, breathe into the stretch.',60),
    ex('Foam Roll Quads','1','90 sec each','—',0,'Slow, pause 3–5 sec on tight spots.',90),
    ex('Thoracic Rotation','2','10 each side','—',20,'Seated, rotate fully, hold 2 sec.',30),
  ]),
  makeDay('Sat','run','Long Run — Aerobic Base','Weekly aerobic investment. Zone 2 the entire time. Build the engine.',[
    ex('Long Run','1','35 min','—',0,'Zone 2 HR 122–135 bpm the whole time. Walk if needed. ~2.5–3 miles.',2100,true),
    ex('Post-Run Stretch','1','10 min','—',0,'Hip flexors, calves, hamstrings, quads.',600),
  ]),
]},
{w:2,phase:'Phase 1 — Aerobic Foundation',pc:'#00c8f0',days:[
  makeDay('Sun','str','Full Body Strength + Easy Run','Add 5 lb to squat if Week 1 felt easy. Form first.',[
    ex('Back Squat','3','10','+5lb vs W1',90,'Slight load increase if W1 was easy.',90),
    ex('Romanian Deadlift','3','12','Moderate',90,'Increase range of motion.',90),
    ex('Push-Up','3','18','BW',60,'Tempo: 2 sec down, pause, 1 sec up.',60),
    ex('Cable Row','3','12','Moderate',60,'Sit tall, full retraction at end.',60),
    ex('Plank Hold','3','50 sec','BW',45,'+5 sec vs Week 1.',50),
    ex('Easy Run 20 min','1','20 min','—',0,'Zone 2. Notice if pace improves at same HR.',1200,true),
  ]),
  makeDay('Mon','run','Zone 2 Run','Slightly longer. Same HR ceiling.',[
    ex('Warmup Walk','1','5 min','—',0,'',300,true),
    ex('Zone 2 Run','1','25–30 min','—',0,'HR 122–135 bpm. Walk/run to control HR.',1500,true),
    ex('Cooldown + Hip Flexor','1','8 min','—',0,'Walk then hip flexor stretch.',480),
  ]),
  makeDay('Tue','str','Lower Body B','Add Bulgarian split squats — key for sled and lunge power.',[
    ex('Back Squat','3','10','',90,'',90),
    ex('Bulgarian Split Squat','3','8 each','Light DBs',90,'Rear foot elevated, front shin vertical, drive through heel.',90),
    ex('Step-Up','3','10 each','BW or light',75,'Drive through heel of front foot. No push-off from back.',75),
    ex('Hip Thrust','3','15','BW or plate',60,'Shoulder blades on bench, squeeze at top.',60),
    ex('Side Plank','2','30 sec each','BW',30,'Hips forward, body in straight line.',30),
  ]),
  makeDay('Wed','run','Zone 2 Run + Drills','Introduce 160 spm cadence with metronome app.',[
    ex('Zone 2 Run','1','30 min','—',0,'HR 122–135 bpm.',1800,true),
    ex('High Knees','3','20m','BW',20,'',20),
    ex('A-Skip','3','20m','BW',20,'',20),
    ex('Strides at 160 spm','4','80m','—',45,'Use metronome app at 80 bpm (160 spm). Note how it feels.',45),
  ]),
  makeDay('Thu','str','Upper Body + Row','Slightly longer row. Compare to Week 1.',[
    ex('Pull-Up','3','8','BW',90,'Full hang, chin over bar.',90),
    ex('DB Row','3','12','Moderate',75,'',75),
    ex("Farmer's Carry",'4','30m','Heavier than W1',60,'',60),
    ex('Face Pull','3','15','Light cable',45,'Elbows high, external rotation.',45),
    ex('Row 1,200m Easy','1','1,200m','Rower',0,'Compare feel to Week 1. Same pace?',360,true),
  ]),
  makeDay('Fri','rest','Active Recovery','Mobility focus: hip flexors and thoracic spine.',[
    ex('Walk or Light Bike','1','30 min','—',0,'Zone 1. HR under 110.',1800,true),
    ex('90-90 Hip Stretch','2','60 sec each','—',20,'Both knees at 90°, sit tall.',60),
    ex('Thoracic Rotation','2','10 each','—',20,'',30),
    ex('Foam Roll Full Body','1','10 min','—',0,'Quads, IT band, lats.',600),
  ]),
  makeDay('Sat','run','Long Run','Build to 40 min. Introduce 160 spm in final 10 min.',[
    ex('Long Run','1','40 min','—',0,'Zone 2. Final 10 min: use metronome at 160 spm.',2400,true),
    ex('Post-Run Stretch','1','10 min','—',0,'',600),
  ]),
]},
{w:3,phase:'Phase 1 — Aerobic Foundation',pc:'#00c8f0',days:[
  makeDay('Sun','str','Full Body Strength + Easy Run','4 sets now. Progressive overload is the key driver of adaptation.',[
    ex('Back Squat','4','8','Progressive',90,'Add weight vs Week 2.',90),
    ex('Romanian Deadlift','4','10','',90,'',90),
    ex('Dumbbell Bench Press','3','10','Moderate',75,'Control descent, elbows 45°.',75),
    ex('Bent-Over Row','4','10','',75,'',75),
    ex('Ab Wheel Rollout','3','8','BW',60,'Don\'t let lower back sag — brace hard.',60),
    ex('Easy Run 20 min','1','20 min','—',0,'Zone 2.',1200,true),
  ]),
  makeDay('Mon','run','Zone 2 Run','30–35 min. Adding 5 more minutes. Patience builds the engine.',[
    ex('Zone 2 Run','1','30–35 min','—',0,'HR 122–135 bpm. Walk if needed.',1800,true),
    ex('Hip Flexor Stretch','2','60 sec','—',20,'',60),
  ]),
  makeDay('Tue','str','Lower Body + Sandbag Intro','First sandbag exposure. Light load — just learn the movement feel.',[
    ex('Back Squat','4','8','',90,'',90),
    ex('Romanian Deadlift','4','10','',90,'',90),
    ex('Sandbag Lunge','3','20m','≤10 kg',90,'Light weight. Learn the movement. Full stride, sandbag on shoulders.',90),
    ex('Hip Thrust','3','12','Add weight',60,'',60),
    ex('Leg Curl','3','12','Moderate',60,'',60),
  ]),
  makeDay('Wed','run','Zone 2 Run + Full Drills','Full drill routine plus metronome cadence blocks.',[
    ex('Zone 2 Run','1','35 min','—',0,'HR 122–135 bpm.',2100,true),
    ex('High Knees','3','20m','BW',20,'',20),
    ex('Butt Kicks','3','20m','BW',20,'',20),
    ex('A-Skip','3','20m','BW',20,'',20),
    ex('Carioca','2','20m','BW',20,'Crossover lateral steps, hips relaxed.',20),
    ex('160 spm Strides','4','80m','—',45,'Metronome at 160 spm. Notice feel of higher cadence.',45),
  ]),
  makeDay('Thu','str','Upper Body + Row BENCHMARK','Record your 1,000m row time. This is your key fitness benchmark.',[
    ex('Pull-Up','4','8','BW',90,'',90),
    ex('Bent-Over Barbell Row','4','10','Moderate-heavy',75,'',75),
    ex('Overhead Press','3','10','',75,'',75),
    ex("Farmer's Carry",'4','40m','Increasing weekly',60,'',60),
    ex('Row 1,000m BENCHMARK','1','1,000m','Rower',0,'RECORD YOUR TIME. All-out effort.',300,true),
  ]),
  makeDay('Fri','rest','Active Recovery','',[
    ex('Easy Walk or Bike','1','30 min','—',0,'Zone 1.',1800,true),
    ex('Calf + Ankle Mobility','2','60 sec each','—',20,'Ankle circles, heel raises.',60),
    ex('Foam Roll Full Body','1','10 min','—',0,'',600),
  ]),
  makeDay('Sat','run','Long Run','45 min. Cadence focus middle section.',[
    ex('Long Run','1','45 min','—',0,'Zone 2. Minutes 15–35: use metronome at 160 spm.',2700,true),
    ex('Full Stretch','1','10 min','—',0,'',600),
  ]),
]},
{w:4,phase:'Phase 1 — Deload',pc:'#606090',days:[
  makeDay('Sun','str','Light Strength + Easy Run','Deload: 60% load, 2 sets. Let adaptations consolidate.',[
    ex('Back Squat','2','10','60% load',75,'Form focus. Light.',75),
    ex('Romanian Deadlift','2','10','Light',75,'',75),
    ex('Push-Up','2','15','BW',45,'',45),
    ex('Easy Run 15 min','1','15 min','—',0,'Zone 2. No pushing.',900,true),
  ]),
  makeDay('Mon','run','Zone 2 Run (Deload)','',[
    ex('Zone 2 Run','1','20 min','—',0,'HR 122–130 bpm. Deload — reduced volume.',1200,true),
  ]),
  makeDay('Tue','str','Lower Body Light','',[
    ex('Squat','2','10','Light',60,'',60),
    ex('Step-Up','2','10 each','BW',60,'',60),
    ex('Glute Bridge','2','15','BW',45,'',45),
  ]),
  makeDay('Wed','run','Easy Run + Mobility','',[
    ex('Very Easy Run','1','20 min','—',0,'Very easy pace. Just move.',1200,true),
    ex('Hip Flexor Sequence','1','10 min','—',0,'5 stretches, 60 sec each.',600),
  ]),
  makeDay('Thu','str','Upper Light + Easy Row','',[
    ex('Pull-Up','2','8','BW',75,'',75),
    ex('DB Row','2','10','Light',60,'',60),
    ex('Easy Row 500m','1','500m','Rower',0,'Zone 2 pace only.',180,true),
  ]),
  makeDay('Fri','rest','Full Rest','No training. Eat well, hydrate, sleep 8+ hrs. Phase 2 begins Sunday.',[
    ex('Rest','1','All day','—',0,'No training. Sleep 8+ hrs.'),
  ]),
  makeDay('Sat','run','Long Run BENCHMARK','Critical check: pace at 130 bpm vs Week 1.',[
    ex('Zone 2 Benchmark Run','1','30 min','—',0,'BENCHMARK: pace at 130 bpm vs Week 1? Should be 30+ sec/mile faster.',1800,true),
  ]),
]},
{w:5,phase:'Phase 2 — Threshold Development',pc:'#3df59e',days:[
  makeDay('Sun','str','Strength + SkiErg Intro','First SkiErg baseline. Record every split.',[
    ex('Back Squat','4','8','Phase 2 load',90,'',90),
    ex('Romanian Deadlift','4','10','',90,'',90),
    ex('Hip Thrust','3','12','Add weight',75,'',75),
    ex('SkiErg 500m','3','500m','—',90,'Baseline. Record each split. Moderate effort.',90,true),
    ex('Easy Run 15 min','1','15 min','—',0,'Zone 2.',900,true),
  ]),
  makeDay('Mon','run','Tempo Run — First','First Zone 3 work. Where race fitness begins to develop.',[
    ex('Warmup','1','5 min','—',0,'Zone 2.',300,true),
    ex('Tempo Run','1','15 min','—',0,'Zone 3: HR 145–155 bpm. Comfortably hard — 1–2 words between breaths.',900,true),
    ex('Cooldown','1','5 min','—',0,'Zone 2.',300,true),
  ]),
  makeDay('Tue','str','Lower Body + Sandbag','Sandbag lunges at race weight for the first time.',[
    ex('Back Squat','4','8','',90,'',90),
    ex('Romanian Deadlift','4','10','',90,'',90),
    ex('Sandbag Lunge','3','30m','Race weight 20kg',90,'Full strides. Sandbag on shoulders.',90),
    ex('Bulgarian Split Squat','3','8 each','Light DBs',75,'',75),
  ]),
  makeDay('Wed','run','Zone 2 Run — 165 spm','165 spm target. Metronome for first 10 min.',[
    ex('Zone 2 Run','1','35 min','—',0,'165 spm target. Metronome (82–83 bpm) first 10 min.',2100,true),
    ex('Drill Circuit','1','10 min','BW',0,'High Knees, Butt Kicks, A-Skip.',600),
  ]),
  makeDay('Thu','hyrox','HYROX Combo × 2 Rounds','First combined run+station simulation. This is what HYROX training is.',[
    ex('Run 400m','4','400m between stations','—',0,'Race effort between each station.',120,true),
    ex('Sled Push 25m','2','25m','102kg',0,'Drive with legs, hips low.',60),
    ex('Sled Pull 25m','2','25m','102kg',0,'Hand-over-hand, rope taut.',60),
    ex('Row 500m','2','500m','Rower',0,'Legs-back-arms sequence.',150,true),
    ex('Wall Balls 25 reps','2','25 reps','6kg ball',0,'Squat deep, hit 3m target.',90),
    ex('Rest Between Rounds','1','4 min','—',240,'Record each round time!',240),
  ]),
  makeDay('Fri','str','Upper Body + Carries','',[
    ex('Pull-Up','4','8','BW',90,'',90),
    ex('DB Row','4','12','Moderate-heavy',75,'',75),
    ex("Farmer's Carry",'4','50m','Race weight 2×24kg',60,'Walk tall.',60),
    ex('Burpee Broad Jumps','3','8 reps','BW',60,'Smooth and controlled.',60),
    ex('Face Pull','3','15','Light cable',45,'',45),
  ]),
  makeDay('Sat','run','Long Run','50 min. ~5 miles.',[
    ex('Long Run','1','50 min','—',0,'Zone 2. ~5 miles. 160–165 spm last 15 min.',3000,true),
  ]),
]},
{w:6,phase:'Phase 2 — Threshold Development',pc:'#3df59e',days:[
  makeDay('Sun','str','Strength + SkiErg','',[
    ex('Squat','4','8','',90,'',90),
    ex('RDL','4','10','',90,'',90),
    ex('Sandbag Lunge','3','30m','Race weight',90,'',90),
    ex('SkiErg 500m','3','500m','—',90,'Target < 2:30/500m. Beat Week 5.',90,true),
    ex('Easy Run 20 min','1','20 min','—',0,'Zone 2.',1200,true),
  ]),
  makeDay('Mon','run','Tempo Run','',[
    ex('Warmup','1','5 min','—',0,'Zone 2.',300,true),
    ex('Tempo Run','1','20 min','—',0,'Zone 3: HR 145–155 bpm.',1200,true),
    ex('Cooldown','1','5 min','—',0,'',300,true),
  ]),
  makeDay('Tue','str','Lower Body','',[
    ex('Squat','4','8','',90,'',90),
    ex('RDL','4','10','',90,'',90),
    ex('Sandbag Lunge','3','40m','Race weight',90,'',90),
    ex('Step-Up','3','12 each','DBs',60,'',60),
  ]),
  makeDay('Wed','run','Zone 2 + Drills','',[
    ex('Zone 2 Run','1','40 min','—',0,'165 spm throughout.',2400,true),
    ex('Full Drill Circuit','1','10 min','BW',0,'High Knees, Butt Kicks, A-Skip, Carioca.',600),
  ]),
  makeDay('Thu','hyrox','HYROX Combo × 2–3 Rounds','',[
    ex('Run 400m','4','400m','—',0,'Between stations.',120,true),
    ex('Sled Push 25m','3','25m','102kg',0,'',60),
    ex('Sled Pull 25m','3','25m','102kg',0,'',60),
    ex('Row 500m','3','500m','Rower',0,'',150,true),
    ex('Wall Balls 25','3','25 reps','6kg',0,'',90),
    ex('Round Rest','1','4 min','—',240,'Record each round split.',240),
  ]),
  makeDay('Fri','str','Upper + Stations','',[
    ex('Pull-Up','4','8','BW',90,'',90),
    ex('Bent-Over Row','4','12','',75,'',75),
    ex("Farmer's Carry",'4','60m','Race weight',60,'',60),
    ex('Burpee Broad Jumps','3','10 reps','BW',60,'',60),
  ]),
  makeDay('Sat','run','Long Run','',[
    ex('Long Run','1','55 min','—',0,'Zone 2. ~5.5 miles.',3300,true),
  ]),
]},
{w:7,phase:'Phase 2 — Threshold Development',pc:'#3df59e',days:[
  makeDay('Sun','str','Peak Strength + SkiErg','Peak Phase 2 loading.',[
    ex('Squat','4','8','Peak P2',90,'',90),
    ex('RDL','4','10','',90,'',90),
    ex('Sandbag Lunge','3','40m','Race weight',90,'',90),
    ex('SkiErg 500m','3','500m','—',90,'Beat Week 6 times.',90,true),
    ex('Easy Run 20 min','1','20 min','—',0,'Zone 2.',1200,true),
  ]),
  makeDay('Mon','run','Tempo Run','25 min. Longest yet. ~3 miles.',[
    ex('Warmup','1','5 min','—',0,'',300,true),
    ex('Tempo Run','1','25 min','—',0,'Zone 3. ~3 miles at tempo effort.',1500,true),
    ex('Cooldown','1','5 min','—',0,'',300,true),
  ]),
  makeDay('Tue','str','Lower Body','',[
    ex('Squat','4','8','',90,'',90),
    ex('RDL','4','10','',90,'',90),
    ex('Sandbag Lunge','4','50m','Building volume',90,'',90),
    ex('Hip Thrust','3','12','',60,'',60),
  ]),
  makeDay('Wed','run','Zone 2','',[
    ex('Zone 2 Run','1','40 min','—',0,'165–168 spm. No HR drift above 135.',2400,true),
  ]),
  makeDay('Thu','hyrox','HYROX Combo × 3 Rounds','3 full rounds. Track each round split.',[
    ex('Run 400m','4','400m','—',0,'',120,true),
    ex('Sled Push 25m','3','25m','102kg',0,'Track split per round.',60),
    ex('Sled Pull 25m','3','25m','102kg',0,'',60),
    ex('Row 500m','3','500m','Rower',0,'',150,true),
    ex('Wall Balls 25','3','25 reps','6kg',0,'',90),
    ex('Round Rest','1','4 min','—',240,'Track R1, R2, R3 separately.',240),
  ]),
  makeDay('Fri','str','Upper + Burpees','',[
    ex('Pull-Up','4','8','BW',90,'',90),
    ex('DB Row','4','12','',75,'',75),
    ex('Burpee Broad Jumps','3','15 reps','BW',60,'Building rep count.',60),
    ex("Farmer's Carry",'4','60m','Race weight',60,'',60),
  ]),
  makeDay('Sat','run','Long Run — Peak Phase 2','60 min. 6 miles. Biggest run so far.',[
    ex('Long Run','1','60 min','—',0,'Zone 2. ~6 miles. Biggest run so far!',3600,true),
  ]),
]},
{w:8,phase:'Phase 2 — Deload',pc:'#606090',days:[
  makeDay('Sun','str','Light Strength + Easy Run','Deload week. Keep sharpness, cut volume.',[
    ex('Squat','2','10','Light',75,'',75),
    ex('RDL','2','10','Light',75,'',75),
    ex('Pull-Up','2','8','BW',60,'',60),
    ex('SkiErg 500m','2','500m','—',90,'Easy effort.',90,true),
    ex('Easy Run 15 min','1','15 min','—',0,'Zone 2.',900,true),
  ]),
  makeDay('Mon','run','Tempo Run (Short Deload)','',[
    ex('Warmup','1','5 min','—',0,'',300,true),
    ex('Tempo Run','1','15 min','—',0,'Zone 3. Deload volume.',900,true),
    ex('Cooldown','1','5 min','—',0,'',300,true),
  ]),
  makeDay('Tue','str','Lower Body Light','',[
    ex('Squat','2','10','Light',75,'',75),
    ex('RDL','2','10','Light',75,'',75),
    ex('Sandbag Lunge','2','30m','Light',75,'',75),
  ]),
  makeDay('Wed','run','Zone 2 Easy','',[
    ex('Zone 2 Run','1','30 min','—',0,'Easy. No pressure.',1800,true),
  ]),
  makeDay('Thu','hyrox','HYROX Easy × 1–2 Rounds','',[
    ex('Easy HYROX Combo','2','1 round easy','—',0,'70% effort. Form focus, not speed.',600),
  ]),
  makeDay('Fri','rest','Full Rest','No training. Phase 3 starts Sunday.',[
    ex('Rest','1','All day','—',0,'No training. Phase 3 starts Sunday.'),
  ]),
  makeDay('Sat','run','Long Run Benchmark','Measure Z2 pace vs Week 5.',[
    ex('Zone 2 Benchmark Run','1','40 min','—',0,'BENCHMARK: Z2 pace vs Week 5? Should be 1–2 min/mile faster.',2400,true),
  ]),
]},
{w:9,phase:'Phase 3 — Race Simulation',pc:'#ff9a35',days:[
  makeDay('Sun','str','Strength + HYROX Stations','Maintain strength while adding full station volume.',[
    ex('Squat','4','8','Phase 3',90,'',90),
    ex('RDL','4','10','',90,'',90),
    ex('Sandbag Lunge','4','50m','Race weight',90,'',90),
    ex('Burpee Broad Jumps','3','20 reps','BW',75,'',75),
    ex('Easy Run 20 min','1','20 min','—',0,'Zone 2.',1200,true),
  ]),
  makeDay('Mon','run','Interval Run — Zone 4','First Zone 4 intervals. Builds race-pace fitness.',[
    ex('Warmup','1','5 min','—',0,'Zone 2.',300,true),
    ex('Zone 4 Intervals','4','5 min','—',120,'HR 158–168 bpm. Hard effort. 2 min easy jog between.',300,true),
    ex('Cooldown','1','5 min','—',0,'',300,true),
  ]),
  makeDay('Tue','hyrox','All HYROX Stations','Station volume session. Focus on individual station times.',[
    ex('SkiErg 1,000m','1','1,000m','—',0,'Record time.',300,true),
    ex('Wall Balls','3','25 reps','6kg',75,'',75),
    ex("Farmer's Carry",'4','50m','2×24kg',60,'',60),
    ex('Sandbag Lunge','4','50m','20kg',90,'',90),
    ex('Burpee Broad Jumps','3','20 reps','BW',60,'',60),
  ]),
  makeDay('Wed','run','Zone 2 Recovery Run','170 spm cadence target. This is a recovery day.',[
    ex('Zone 2 Run','1','40–45 min','—',0,'Recovery pace. 170 spm target.',2400,true),
  ]),
  makeDay('Thu','hyrox','Half HYROX Simulation','First race simulation. Record total time. Race predictor.',[
    ex('Run 1km + SkiErg 1,000m','1','Station 1','—',0,'Race effort.',600,true),
    ex('Run 1km + Sled Push 50m','1','Station 2','102kg',0,'',480),
    ex('Run 1km + Sled Pull 50m','1','Station 3','102kg',0,'',480),
    ex('Run 1km + Row 1,000m','1','Station 4','Rower',0,'RECORD TOTAL TIME!',600,true),
  ]),
  makeDay('Fri','hyrox','Upper + SkiErg Race Pace','',[
    ex('Pull-Up','4','8','BW',90,'',90),
    ex('Overhead Press','3','10','',75,'',75),
    ex("Farmer's Carry",'3','50m','Race weight',60,'',60),
    ex('SkiErg 1,000m Race Pace','2','1,000m','—',120,'Record both splits.',300,true),
  ]),
  makeDay('Sat','run','Long Run','65 min. ~7 miles.',[
    ex('Long Run','1','65 min','—',0,'Zone 2. ~7 miles.',3900,true),
  ]),
]},
{w:10,phase:'Phase 3 — Race Simulation',pc:'#ff9a35',days:[
  makeDay('Sun','str','Strength + Full Stations','',[
    ex('Squat','4','8','',90,'',90),
    ex('RDL','4','10','',90,'',90),
    ex('Sandbag Lunge','4','50m','Race weight',90,'',90),
    ex('Wall Balls','3','30 reps','6kg',75,'Volume building.',75),
    ex('Easy Run 20 min','1','20 min','—',0,'Zone 2.',1200,true),
  ]),
  makeDay('Mon','run','Interval Run — Zone 4','5 intervals vs 4 last week.',[
    ex('Warmup','1','5 min','—',0,'',300,true),
    ex('Zone 4 Intervals','5','5 min','—',120,'HR 158–168 bpm.',300,true),
    ex('Cooldown','1','5 min','—',0,'',300,true),
  ]),
  makeDay('Tue','str','All Stations Volume','',[
    ex('Sandbag Lunge','4','50m','Race weight',90,'',90),
    ex('Burpee Broad Jumps','4','20 reps','BW',75,'',75),
    ex('Wall Balls','4','30 reps','6kg',75,'',75),
    ex("Farmer's Carry",'4','50m','Race weight',60,'',60),
  ]),
  makeDay('Wed','run','Zone 2','',[
    ex('Zone 2 Run','1','45 min','—',0,'170 spm.',2700,true),
  ]),
  makeDay('Thu','hyrox','Half HYROX Simulation','Beat Week 9 time.',[
    ex('Run 1km + SkiErg','1','Station 1','—',0,'Beat W9 time.',600,true),
    ex('Run 1km + Sled Push','1','Station 2','102kg',0,'',480),
    ex('Run 1km + Sled Pull','1','Station 3','102kg',0,'',480),
    ex('Run 1km + Row','1','Station 4','Rower',0,'RECORD TOTAL TIME.',600,true),
  ]),
  makeDay('Fri','hyrox','Upper + SkiErg','',[
    ex('Upper Strength','3','10 each','',75,'Pull-Up, Row, Press.',75),
    ex('SkiErg 1,000m','2','1,000m','—',120,'Beat W9 splits.',300,true),
  ]),
  makeDay('Sat','run','Long Run — Peak Week','70 min. 7.5 miles. Peak of the program.',[
    ex('Long Run','1','70 min','—',0,'Zone 2. ~7.5 miles. Peak of entire program!',4200,true),
  ]),
]},
{w:11,phase:'Phase 3 — Full Simulation',pc:'#ff3d55',days:[
  makeDay('Sun','str','Moderate Strength + Easy Run','Conserve legs for the full simulation on Thursday.',[
    ex('Squat','3','8','Moderate — save legs',90,'',90),
    ex('RDL','3','10','',90,'',90),
    ex('Pull-Up','3','8','BW',75,'',75),
    ex('Easy Run 15 min','1','15 min','—',0,'Zone 2.',900,true),
  ]),
  makeDay('Mon','run','Interval Run','Longer 6-min intervals.',[
    ex('Warmup','1','5 min','—',0,'',300,true),
    ex('Zone 4 Intervals','4','6 min','—',120,'HR 158–168 bpm. Longer than W10.',360,true),
    ex('Cooldown','1','5 min','—',0,'',300,true),
  ]),
  makeDay('Tue','str','Accessory Work Only','Conserve energy for Thursday full simulation.',[
    ex("Farmer's Carry",'3','50m','Race weight',60,'',60),
    ex('Wall Balls','2','20 reps','6kg',60,'Easy effort.',60),
    ex('Core Circuit','3','45 sec each','BW',45,'Plank, Dead Bug, Side Plank.',45),
  ]),
  makeDay('Wed','run','Zone 2 — Pre-Sim Recovery','Save everything for Thursday.',[
    ex('Zone 2 Run','1','35 min','—',0,'Easy. Foam roll after. Save legs for Thursday.',2100,true),
  ]),
  makeDay('Thu','hyrox','⚡ FULL HYROX SIMULATION','Full race format. Men\'s Open weights. Record everything. This is your race predictor.',[
    ex('Run 1km + SkiErg 1,000m','1','Station 1','—',0,'Race effort throughout.',600,true),
    ex('Run 1km + Sled Push 50m','1','Station 2','102kg',0,'',480),
    ex('Run 1km + Sled Pull 50m','1','Station 3','102kg',0,'',480),
    ex('Run 1km + Burpee BJ 80m','1','Station 4','BW',0,'Stay rhythmic.',600),
    ex('Run 1km + Row 1,000m','1','Station 5','Rower',0,'',600,true),
    ex("Run 1km + Farmer's 200m",'1','Station 6','2×24kg',0,'',480),
    ex('Run 1km + Sandbag 100m','1','Station 7','20kg',0,'',600),
    ex('Run 1km + Wall Balls 100','1','Station 8 — FINISH','6kg',0,'RECORD TOTAL TIME!',720),
  ]),
  makeDay('Fri','rest','Full Rest','You earned it.',[
    ex('Rest','1','All day','—',0,'Eat, sleep, recover.'),
  ]),
  makeDay('Sat','run','Long Run Easy','Recovery focused.',[
    ex('Long Run','1','60 min','—',0,'Zone 2. Recovery focused.',3600,true),
  ]),
]},
{w:12,phase:'Phase 3 — Taper & Race Prep',pc:'#e8ff47',days:[
  makeDay('Sun','str','Light Strength + Short Run','Taper week. Feel sharp, not sore.',[
    ex('Squat','2','8','Light',75,'Stay sharp.',75),
    ex('RDL','2','10','Light',75,'',75),
    ex('Pull-Up','2','8','BW',60,'',60),
    ex('Easy Run 15 min','1','15 min','—',0,'Zone 2 only.',900,true),
  ]),
  makeDay('Mon','run','Short Tempo Run','',[
    ex('Warmup','1','5 min','—',0,'',300,true),
    ex('Tempo Run','1','15 min','—',0,'Zone 3. Taper — cut volume, keep intensity.',900,true),
    ex('Cooldown','1','5 min','—',0,'',300,true),
  ]),
  makeDay('Tue','str','Very Light Strength','',[
    ex('Light Full Body','2','8–10','Very light',60,'Nothing to failure. Feel the movements.',60),
  ]),
  makeDay('Wed','run','Easy Shake-Out','',[
    ex('Easy Run','1','20 min','—',0,'Very easy. 170 spm. No effort.',1200,true),
  ]),
  makeDay('Thu','hyrox','Race Rehearsal (Light)','Visit each station at easy effort. Practice transitions.',[
    ex('Run 400m Easy','1','400m','—',0,'',120,true),
    ex('SkiErg 200m','1','200m','—',0,'Easy feel.',120,true),
    ex('Sled Push 12.5m','1','12.5m','Race weight',0,'Just the feel.',60),
    ex('Row 250m','1','250m','Rower',0,'',90,true),
    ex('Wall Balls 15','1','15 reps','6kg',0,'Rehearsal, not workout.',60),
  ]),
  makeDay('Fri','rest','Rest — Race Eve','',[
    ex('Rest','1','All day','—',0,'Sleep 9 hrs. Lay out race kit. Pre-hydrate.'),
    ex('Visualization','1','10 min','—',0,'Mentally walk through each station.',600),
  ]),
  makeDay('Sat','rest','Rest + Race Prep','',[
    ex('Light Walk 10 min','1','10 min only','—',0,'',600,true),
    ex('Carb-Rich Dinner','1','Evening','—',0,'Pasta, rice, or sweet potato. Hydrate.'),
    ex('Sleep 9 Hours','1','Tonight','—',0,'Early to bed. Race day tomorrow.'),
  ]),
]},
];

// ── BENCHMARKS ─────────────────────────────────────────
const BENCHMARKS={
  4:[{n:'Run 4 miles continuously',t:'Zone 2 HR < 135 bpm throughout'},{n:'Z2 pace improved vs Week 1',t:'+30 sec/mile at same HR'},{n:'Sled push 102kg × 25m',t:'Under 1:30'},{n:'Row 1,000m',t:'Under 5:00'},{n:'Running cadence',t:'160 spm on focus runs'}],
  8:[{n:'Run 6 miles at Zone 2 HR',t:'Continuous, HR < 135 bpm'},{n:'Tempo pace (Zone 3)',t:'At or below 11:00/mile'},{n:'HYROX Combo 3 rounds',t:'Under 40 minutes total'},{n:'SkiErg 1,000m',t:'Under 5:30'},{n:'Cadence natural',t:'165–168 spm without metronome'},{n:'Resting HR drop',t:'Down 3–5 bpm from Week 1'}],
  12:[{n:'Run 8km (race distance)',t:'Under 58 min (7:15/mile)'},{n:'Full HYROX simulation',t:'Under 1:55 total'},{n:'Tempo pace',t:'At or below 10:00/mile'},{n:'Z2 pace total improvement',t:'+2–3 min/mile vs baseline'},{n:'Resting HR drop',t:'Down 5–8 bpm from baseline'}],
};

// ── BEGINNER GYM PLAN ──────────────────────────────────
const GYM_PHASES=[
  {num:1,weeks:'1–4',name:'Movement Learning',col:'#00c8f0',
   desc:'3 full-body days/week. Light loads — perfect technique before adding weight. Learn the 5 fundamental movement patterns.',
   sessions:[
    {name:'Day A — Mon/Thu',exs:[
      {name:'Goblet Squat',sets:'3',reps:'10',load:'Light KB/DB',cues:'Hold weight at chest, squat deep, elbows inside knees, drive through heels.'},
      {name:'DB Romanian Deadlift',sets:'3',reps:'10',load:'Light DBs',cues:'Hip hinge, soft knees, feel hamstring stretch. Straight back.'},
      {name:'Push-Up (or modified)',sets:'3',reps:'10',load:'BW',cues:'Full plank, chest to floor. Scale: knees-down push-up.'},
      {name:'DB Row (single arm)',sets:'3',reps:'10 each',load:'Light DB',cues:'Knee and hand on bench, elbow to ceiling.'},
      {name:'Plank Hold',sets:'3',reps:'20–30 sec',load:'BW',cues:'Neutral spine. Squeeze glutes. Breathe.'},
      {name:'Glute Bridge',sets:'3',reps:'15',load:'BW',cues:'Drive hips up, squeeze at top for 1 sec.'},
    ]},
    {name:'Day B — Fri',exs:[
      {name:'Wall Sit',sets:'3',reps:'30 sec',load:'BW',cues:'Back flat on wall, thighs parallel to floor.'},
      {name:'DB Overhead Press',sets:'3',reps:'10',load:'Light DBs',cues:'Core tight, press straight up, don\'t arch back.'},
      {name:'Lat Pulldown',sets:'3',reps:'12',load:'Light-moderate',cues:'Pull elbows to hips, controlled return.'},
      {name:'Incline DB Press',sets:'3',reps:'12',load:'Light',cues:'45° bench, controlled descent, elbows 45°.'},
      {name:'Seated Cable Row',sets:'3',reps:'12',load:'Light-moderate',cues:'Sit tall, squeeze shoulder blades.'},
      {name:'Core Circuit',sets:'2',reps:'30 sec each',load:'BW',cues:'Dead Bug, Side Plank, Bird Dog — 30 sec each.'},
    ]},
   ],
   benchmarks:['10 push-ups unbroken','Wall sit 45 sec','5 pull-ups (assisted ok)','Plank 45 sec'],
  },
  {num:2,weeks:'5–8',name:'Strength Building',col:'#3df59e',
   desc:'4 days/week — Upper/Lower split. Add weight each session when you complete all reps with good form.',
   sessions:[
    {name:'Monday — Upper Strength',exs:[
      {name:'Barbell Bench Press',sets:'4',reps:'8',load:'Moderate — add 5lb/session',cues:'Elbows 45°, full ROM, touch chest lightly.'},
      {name:'Barbell Row',sets:'4',reps:'8',load:'Moderate',cues:'Hinged over, elbows back, bar to lower chest.'},
      {name:'Overhead Press',sets:'3',reps:'8',load:'Moderate',cues:'Bar in front, press straight up.'},
      {name:'Pull-Up or Lat Pulldown',sets:'3',reps:'6–8',load:'BW / Moderate',cues:'Full hang, chin over bar.'},
      {name:'Tricep Pushdown',sets:'3',reps:'12',load:'Light-moderate',cues:'Lock elbows at sides.'},
      {name:'Bicep Curl',sets:'3',reps:'12',load:'Light',cues:'Full extension at bottom.'},
    ]},
    {name:'Tuesday — Lower Strength',exs:[
      {name:'Back Squat',sets:'4',reps:'8',load:'Add 5–10lb/session',cues:'Full depth, brace core, drive through heels.'},
      {name:'Romanian Deadlift',sets:'4',reps:'8',load:'Moderate',cues:'Hip hinge, feel hamstrings, bar close to legs.'},
      {name:'Leg Press',sets:'3',reps:'12',load:'Moderate-heavy',cues:'Full ROM, don\'t lock knees at top.'},
      {name:'Walking Lunge',sets:'3',reps:'10 each',load:'Light DBs',cues:'Full stride, torso upright.'},
      {name:'Calf Raise',sets:'4',reps:'15',load:'Moderate',cues:'Full ROM, slow 3-sec eccentric.'},
      {name:'Plank',sets:'3',reps:'45 sec',load:'BW',cues:''},
    ]},
    {name:'Thursday — Upper Volume',exs:[
      {name:'Incline Barbell Press',sets:'4',reps:'10',load:'Moderate',cues:'45° angle, controlled.'},
      {name:'Cable Row',sets:'4',reps:'10',load:'Moderate',cues:''},
      {name:'DB Overhead Press',sets:'3',reps:'10',load:'',cues:''},
      {name:'Chest-Supported Row',sets:'3',reps:'12',load:'',cues:''},
      {name:'Lateral Raise',sets:'3',reps:'15',load:'Light',cues:''},
      {name:'Face Pull',sets:'3',reps:'15',load:'Light cable',cues:'Elbows high, external rotation.'},
    ]},
    {name:'Friday — Lower Volume',exs:[
      {name:'Romanian Deadlift',sets:'4',reps:'10',load:'Moderate',cues:''},
      {name:'Bulgarian Split Squat',sets:'3',reps:'8 each',load:'DBs',cues:'Rear foot elevated.'},
      {name:'Hip Thrust',sets:'4',reps:'12',load:'Barbell or plate',cues:'Shoulder blades on bench.'},
      {name:'Leg Curl',sets:'3',reps:'12',load:'Machine',cues:''},
      {name:'Step-Up',sets:'3',reps:'10 each',load:'DBs',cues:''},
      {name:"Farmer's Carry",sets:'4',reps:'30m',load:'Heavy DBs or KBs',cues:'Walk tall.'},
    ]},
   ],
   benchmarks:['Back squat 1× bodyweight (170lb)','10 pull-ups unbroken','Bench press 0.75× bodyweight'],
  },
  {num:3,weeks:'9–12',name:'HYROX Bridge',col:'#ff9a35',
   desc:'5 training days. Bridge from gym to HYROX. Introduce functional movements at race weight.',
   sessions:[
    {name:'Monday — Lower Power',exs:[
      {name:'Back Squat',sets:'4',reps:'6',load:'Heavy — 80% 1RM',cues:'Explosive concentric.'},
      {name:'Conventional Deadlift',sets:'4',reps:'5',load:'Heavy',cues:'Drive floor away, flat back.'},
      {name:'Sandbag Lunge',sets:'3',reps:'20m',load:'Race weight 20kg',cues:'Build to race weight.'},
      {name:'Leg Press',sets:'3',reps:'12',load:'Moderate-heavy',cues:''},
      {name:"Farmer's Carry",sets:'4',reps:'40m',load:'Race weight 2×24kg',cues:'Walk tall.'},
    ]},
    {name:'Tuesday — Upper Pull',exs:[
      {name:'Weighted Pull-Up',sets:'4',reps:'6–8',load:'BW + weight',cues:''},
      {name:'Barbell Row',sets:'4',reps:'8',load:'Heavy',cues:''},
      {name:"Farmer's Carry",sets:'4',reps:'50m',load:'Race weight',cues:''},
      {name:'Face Pull',sets:'3',reps:'15',load:'Light',cues:''},
      {name:'Dead Hang',sets:'3',reps:'max time',load:'BW',cues:'Build grip for sled pull.'},
    ]},
    {name:'Wednesday — Running',exs:[
      {name:'Zone 2 Run',sets:'1',reps:'30 min',load:'—',cues:'Zone 2 HR. Building aerobic base.'},
      {name:'400m Intervals',sets:'4',reps:'400m',load:'—',cues:'Moderate effort. Walk 90 sec between.'},
    ]},
    {name:'Thursday — HYROX Skills',exs:[
      {name:'SkiErg 3×500m',sets:'3',reps:'500m',load:'—',cues:'Record splits. Aim < 2:45/500m.'},
      {name:'Wall Balls 3×20',sets:'3',reps:'20 reps',load:'6kg',cues:'Squat deep, hit 3m target.'},
      {name:'Burpee Broad Jumps 3×10',sets:'3',reps:'10 reps',load:'BW',cues:'Rhythmic, controlled.'},
      {name:'Row 3×500m',sets:'3',reps:'500m',load:'Rower',cues:'Legs first. Record splits.'},
    ]},
    {name:'Saturday — Long Run',exs:[
      {name:'Long Run',sets:'1',reps:'30–40 min',load:'—',cues:'Zone 2 the entire time.'},
      {name:'Post-Run Core',sets:'3',reps:'30 sec each',load:'BW',cues:'Plank, Side Plank, Dead Bug.'},
    ]},
   ],
   benchmarks:["Farmer's carry 100m with 2×24kg","Deadlift 1.5× bodyweight (255lb)",'Wall Balls 50 reps unbroken','Row 1,000m under 4:30'],
  },
];

// ── WEIGHT LOSS PLAN ───────────────────────────────────
const WL_PHASES=[
  {num:1,weeks:'1–4',name:'Foundation & Habit Building',col:'#3df59e',
   desc:'3 cardio + 2 strength sessions/week. Create 300–500 cal daily deficit through diet + activity. Consistency over intensity.',
   weekly:[
    {d:'Sun',type:'str',title:'Full Body Strength Circuit',
     exs:[{n:'Goblet Squat',s:'3',r:'12',l:'Light KB',c:'Squat deep, elbows inside knees.'},{n:'Push-Up (or modified)',s:'3',r:'10',l:'BW',c:'Full plank, chest to floor.'},{n:'DB Row',s:'3',r:'12 each',l:'Light DB',c:'Elbow to ceiling.'},{n:'Glute Bridge',s:'3',r:'15',l:'BW',c:'Squeeze at top.'},{n:'Plank',s:'3',r:'20–30 sec',l:'BW',c:'Brace core.'}]},
    {d:'Mon',type:'cardio',title:'Zone 2 Cardio — Fat Burning Zone',
     exs:[{n:'Brisk Walk or Light Bike',s:'1',r:'30–35 min',l:'—',c:'HR 112–131 bpm (Zone 2). Fat-burning zone. Maintain the whole time.'},{n:'Hip Flexor Stretch',s:'2',r:'45 sec each',l:'—',c:''}]},
    {d:'Tue',type:'str',title:'Lower Body Strength',
     exs:[{n:'Squat',s:'3',r:'12',l:'BW or light',c:''},{n:'Reverse Lunge',s:'3',r:'10 each',l:'BW',c:'Control the descent.'},{n:'Hip Thrust',s:'3',r:'15',l:'BW',c:'Squeeze glutes at top.'},{n:'Wall Sit',s:'3',r:'30 sec',l:'BW',c:'Thighs parallel to floor.'},{n:'Calf Raise',s:'3',r:'20',l:'BW',c:'Full ROM, slow descent.'}]},
    {d:'Wed',type:'cardio',title:'LISS Cardio — Low Intensity Steady State',
     exs:[{n:'Walking (outdoor or treadmill)',s:'1',r:'40 min',l:'—',c:'Brisk walking. HR 100–120 bpm. Burns fat efficiently without stress.'}]},
    {d:'Thu',type:'rest',title:'Active Recovery',
     exs:[{n:'Light Yoga or Stretching',s:'1',r:'20 min',l:'—',c:'Focus on hip flexors, hamstrings, shoulders.'},{n:'Foam Roll',s:'1',r:'10 min',l:'—',c:'Legs and back.'}]},
    {d:'Fri',type:'cardio',title:'HIIT — Calorie Burn',
     exs:[{n:'Warmup Walk',s:'1',r:'5 min',l:'—',c:''},{n:'HIIT 20 sec on / 40 sec off',s:'8',r:'20 sec work',l:'BW',c:'Jumping Jacks → High Knees → Squat Jumps → Burpees. Rotate each.'},{n:'Cooldown Walk',s:'1',r:'5 min',l:'—',c:''}]},
    {d:'Sat',type:'rest',title:'Full Rest',
     exs:[{n:'Rest',s:'1',r:'All day',l:'—',c:'Meal prep for the week. Track what you ate today.'}]},
   ]},
  {num:2,weeks:'5–8',name:'Building Intensity',col:'#ff9a35',
   desc:'4 cardio + 3 strength sessions/week. Increase deficit to 400–600 cal/day. Add resistance.',
   weekly:[
    {d:'Sun',type:'str',title:'Full Body Strength (Progressive)',
     exs:[{n:'DB Squat',s:'4',r:'10',l:'Moderate DBs',c:''},{n:'DB Bench Press',s:'4',r:'10',l:'Moderate',c:''},{n:'DB Row',s:'4',r:'10 each',l:'Moderate',c:''},{n:'Overhead Press',s:'3',r:'10',l:'DBs',c:''},{n:'Romanian Deadlift',s:'3',r:'10',l:'DBs',c:''},{n:'Plank',s:'3',r:'40 sec',l:'BW',c:''}]},
    {d:'Mon',type:'cardio',title:'Zone 2 Run/Walk Intervals',
     exs:[{n:'Run/Walk Intervals',s:'1',r:'35 min',l:'—',c:'Run 2 min, walk 1 min. Zone 2–3. Progress to longer run blocks each week.'}]},
    {d:'Tue',type:'str',title:'Lower Body Strength',
     exs:[{n:'Barbell or Goblet Squat',s:'4',r:'10',l:'Progressive',c:''},{n:'Romanian Deadlift',s:'4',r:'10',l:'Progressive',c:''},{n:'Walking Lunge',s:'3',r:'12 each',l:'DBs',c:''},{n:'Hip Thrust',s:'4',r:'12',l:'Plate or barbell',c:''},{n:"Farmer's Carry",s:'3',r:'30m',l:'Heavy DBs',c:''}]},
    {d:'Wed',type:'cardio',title:'Zone 2 Steady State',
     exs:[{n:'Run or Bike',s:'1',r:'35–40 min',l:'—',c:'Zone 2 HR. Burns fat efficiently.'}]},
    {d:'Thu',type:'str',title:'Upper Body Strength',
     exs:[{n:'Pull-Up or Lat Pulldown',s:'4',r:'8',l:'BW / moderate',c:''},{n:'DB Bench Press',s:'4',r:'10',l:'',c:''},{n:'DB Overhead Press',s:'3',r:'10',l:'',c:''},{n:'Cable Row',s:'3',r:'12',l:'',c:''},{n:'Tricep Dip or Pushdown',s:'3',r:'12',l:'',c:''}]},
    {d:'Fri',type:'cardio',title:'HIIT + Core',
     exs:[{n:'HIIT Circuit',s:'5',r:'30 sec on/off',l:'BW',c:'Squat Jump → Push-Up → Mountain Climber → Burpee → Jumping Jack. Rest 2 min between rounds.'},{n:'Core Circuit',s:'3',r:'30 sec each',l:'BW',c:'Plank, Russian Twist, Bicycle Crunch, Dead Bug.'}]},
    {d:'Sat',type:'rest',title:'Full Rest',
     exs:[{n:'Rest',s:'1',r:'All day',l:'—',c:'Weigh yourself this morning. Track weekly average, not daily.'}]},
   ]},
  {num:3,weeks:'9–12',name:'Peak Fat Loss + Maintain Muscle',col:'#ff3d55',
   desc:'5 training days. Heavy strength preserves muscle as weight drops. Deficit 300–400 cal (reducing more = muscle loss).',
   weekly:[
    {d:'Sun',type:'str',title:'Full Body Heavy Strength',
     exs:[{n:'Back Squat',s:'4',r:'6–8',l:'Heavy',c:'Heavy lifting preserves muscle during deficit.'},{n:'Deadlift',s:'3',r:'6',l:'Heavy',c:''},{n:'Bench Press',s:'4',r:'8',l:'',c:''},{n:'Weighted Pull-Up',s:'3',r:'6–8',l:'BW + weight',c:''},{n:'Overhead Press',s:'3',r:'8',l:'',c:''}]},
    {d:'Mon',type:'cardio',title:'Zone 2 Run',
     exs:[{n:'Zone 2 Run',s:'1',r:'35–40 min',l:'—',c:'Continuous running at Zone 2.'}]},
    {d:'Tue',type:'str',title:'Lower Body',
     exs:[{n:'Romanian Deadlift',s:'4',r:'8',l:'Heavy',c:''},{n:'Bulgarian Split Squat',s:'4',r:'8 each',l:'DBs',c:''},{n:'Hip Thrust',s:'4',r:'10',l:'Heavy',c:''},{n:'Leg Press',s:'3',r:'12',l:'',c:''},{n:"Farmer's Carry",s:'4',r:'40m',l:'Heavy',c:''}]},
    {d:'Wed',type:'cardio',title:'Interval Run',
     exs:[{n:'Warmup',s:'1',r:'5 min',l:'—',c:''},{n:'Run Intervals',s:'6',r:'2 min hard/1 easy',l:'—',c:'Hard = Zone 4. Easy = Zone 2. Builds VO2max and burns more calories.'},{n:'Cooldown',s:'1',r:'5 min',l:'—',c:''}]},
    {d:'Thu',type:'str',title:'Upper Body',
     exs:[{n:'Barbell Row',s:'4',r:'8',l:'Heavy',c:''},{n:'Incline DB Press',s:'4',r:'10',l:'',c:''},{n:'Lat Pulldown',s:'4',r:'10',l:'',c:''},{n:'Lateral Raise',s:'3',r:'15',l:'Light',c:''},{n:'Face Pull',s:'3',r:'15',l:'Light',c:''}]},
    {d:'Fri',type:'cardio',title:'Long Walk or Easy Cardio',
     exs:[{n:'Long Walk or Easy Run',s:'1',r:'45–50 min',l:'—',c:'Zone 1–2 only. Active recovery while keeping calories burning.'}]},
    {d:'Sat',type:'rest',title:'Full Rest',
     exs:[{n:'Rest',s:'1',r:'All day',l:'—',c:'Weigh yourself. Measure waist. Progress photos. Celebrate non-scale victories.'}]},
   ]},
];
const WL_TIPS=[
  'Weigh yourself same time daily (morning). Track weekly average, not daily fluctuations.',
  'Protein 1.0g per lb bodyweight minimum to preserve muscle while losing fat.',
  'Fill half your plate with vegetables — huge volume, low calories.',
  'Drink 2.5–3L water daily. Thirst is often mistaken for hunger.',
  'Sleep 7.5–9 hrs. Poor sleep increases hunger hormones and reduces fat burning.',
  'Don\'t drink calories: avoid juice, soda, alcohol. Black coffee is fine.',
  'Meal prep Sunday. Prepared food = fewer bad decisions during the week.',
  'Sustainable deficit: 300–500 cal/day. Bigger deficit = muscle loss.',
];

// ── FLAT PLAN ARRAYS for Gym & Weight Loss ────────────
// These mirror the same shape as HP (HYROX_PLAN) so the
// calendar, week view, and dashboard work generically.

// Helper: convert WL day exs (short format) to full ex objects
function wlEx(e){ return {name:e.n,sets:e.s,reps:e.r,load:e.l||'—',rest:0,cues:e.c||'',timer:0,isCardio:/run|walk|bike|cardio|hiit/i.test(e.n)}; }

function buildWLFlat() {
  const phases = WL_PHASES;
  const weeks = [];
  let wNum = 0;
  phases.forEach(ph => {
    // Each phase = 4 weeks; repeat the weekly template 4 times
    for (let rep = 0; rep < 4; rep++) {
      wNum++;
      weeks.push({
        w: wNum,
        phase: `Phase ${ph.num} — ${ph.name}`,
        pc: ph.col,
        days: ph.weekly.map(day => ({
          d: day.d,
          type: day.type,
          title: day.title,
          detail: `Phase ${ph.num} Week ${rep+1} · ${ph.desc.slice(0,80)}…`,
          exs: day.exs.map(wlEx),
        })),
      });
    }
  });
  return weeks;
}

function buildGymFlat() {
  const weeks = [];
  let wNum = 0;
  GYM_PHASES.forEach(ph => {
    for (let rep = 0; rep < 4; rep++) {
      wNum++;
      // Map sessions onto days of the week (Sun=str, Mon/Thu=upper, Tue/Fri=lower, Wed=run/rest, Sat=rest)
      const dayMap = [
        // Sun — always strength + light run
        { d:'Sun', type:'str', title:`Full Body Strength + Easy Run`, detail:ph.desc,
          exs: ph.sessions[ph.sessions.length-1]
            ? ph.sessions[ph.sessions.length-1].exs.slice(0,4).map(e=>({name:e.name,sets:e.sets,reps:e.reps,load:e.load,rest:e.rest||75,cues:e.cues||'',timer:e.rest||75})).concat([{name:'Easy Run 20 min',sets:'1',reps:'20 min',load:'—',rest:0,cues:'Zone 2 HR 122–135 bpm.',timer:1200,isCardio:true}])
            : [{name:'Full Body Strength',sets:'3',reps:'10',load:'Moderate',rest:90,cues:'See program tab for full details.',timer:90}]
        },
        // Mon
        { d:'Mon', type:'str', title: ph.sessions[0]?.name||'Upper Strength',
          detail: ph.desc, exs: (ph.sessions[0]?.exs||[]).map(e=>({name:e.name,sets:e.sets,reps:e.reps,load:e.load,rest:e.rest||75,cues:e.cues||'',timer:e.rest||75})) },
        // Tue
        { d:'Tue', type:'str', title: ph.sessions[1]?.name||'Lower Strength',
          detail: ph.desc, exs: (ph.sessions[1]?.exs||[]).map(e=>({name:e.name,sets:e.sets,reps:e.reps,load:e.load,rest:e.rest||75,cues:e.cues||'',timer:e.rest||75})) },
        // Wed — conditioning/run
        { d:'Wed', type: ph.num===3?'run':'rest', title: ph.num===3?'Running + Conditioning':'Active Recovery',
          detail:'', exs: ph.num===3
            ? (ph.sessions[2]?.exs||[]).map(e=>({name:e.name,sets:e.sets,reps:e.reps,load:e.load||'—',rest:e.rest||60,cues:e.cues||'',timer:e.rest||60,isCardio:/run|walk|row/i.test(e.name)}))
            : [{name:'Brisk Walk',sets:'1',reps:'30 min',load:'—',rest:0,cues:'Zone 1. Light movement. Foam roll.',timer:1800,isCardio:true}] },
        // Thu
        { d:'Thu', type: ph.num===3?'hyrox':'str', title: ph.num===3?(ph.sessions[3]?.name||'HYROX Skills'):(ph.sessions[2]?.name||'Upper Volume'),
          detail:'', exs: (ph.sessions[ph.num===3?3:2]?.exs||[]).map(e=>({name:e.name,sets:e.sets,reps:e.reps,load:e.load||'—',rest:e.rest||75,cues:e.cues||'',timer:e.rest||75,isCardio:/row|run|ski/i.test(e.name)})) },
        // Fri
        { d:'Fri', type:'str', title: ph.sessions[ph.num===3?1:3]?.name||'Lower Volume',
          detail:'', exs: (ph.sessions[ph.num===3?1:3]?.exs||[]).map(e=>({name:e.name,sets:e.sets,reps:e.reps,load:e.load||'—',rest:e.rest||75,cues:e.cues||'',timer:e.rest||75})) },
        // Sat
        { d:'Sat', type: ph.num===3?'run':'rest', title: ph.num===3?'Long Run':'Full Rest',
          detail:'', exs: ph.num===3
            ? (ph.sessions[4]?.exs||[]).map(e=>({name:e.name,sets:e.sets,reps:e.reps,load:e.load||'—',rest:e.rest||0,cues:e.cues||'',timer:e.rest||0,isCardio:true}))
            : [{name:'Rest',sets:'1',reps:'All day',load:'—',rest:0,cues:'No training. Sleep well.'}] },
      ];
      weeks.push({ w:wNum, phase:`Phase ${ph.num} (Wks ${ph.weeks}) — ${ph.name}`, pc:ph.col, days:dayMap });
    }
  });
  return weeks;
}

const WL_PLAN_FLAT  = buildWLFlat();
const GYM_PLAN_FLAT = buildGymFlat();
