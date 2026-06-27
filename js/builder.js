// ═══════════════════════════════════════════════════════
// CUSTOM WORKOUT BUILDER — drag & drop to any day
// Saves to D.customPlan, reflected in calendar + checklist
// ═══════════════════════════════════════════════════════

// ── EXERCISE LIBRARY ───────────────────────────────────
const EXERCISE_LIBRARY = {
  'Running & Cardio': [
    {name:'Zone 2 Run',          cat:'run',    sets:'1', reps:'20–30 min', load:'—',    cues:'HR 112–131 bpm. Conversational pace. Fat-burning zone.',      timer:1200, isCardio:true},
    {name:'Tempo Run',           cat:'run',    sets:'1', reps:'15–20 min', load:'—',    cues:'HR 145–155 bpm. Comfortably hard — 1–2 words between breaths.',timer:900,  isCardio:true},
    {name:'Interval Run',        cat:'run',    sets:'6', reps:'400m',      load:'—',    cues:'Hard effort. Walk/jog 90 sec rest between.',                  timer:120,  isCardio:true},
    {name:'Long Run',            cat:'run',    sets:'1', reps:'45–60 min', load:'—',    cues:'Zone 2 the entire time. Aerobic base building.',              timer:2700, isCardio:true},
    {name:'HIIT Sprints',        cat:'run',    sets:'8', reps:'30 sec on/30 off',load:'—',cues:'All-out effort on, complete rest off.',                     timer:30,   isCardio:true},
    {name:'Treadmill Walk',      cat:'run',    sets:'1', reps:'30 min',    load:'—',    cues:'Incline 5–8%. Zone 1–2.',                                    timer:1800, isCardio:true},
    {name:'Row Ergometer',       cat:'run',    sets:'1', reps:'1,000m',    load:'—',    cues:'Legs-back-arms sequence. Record time.',                       timer:300,  isCardio:true},
    {name:'Assault Bike',        cat:'run',    sets:'1', reps:'20 min',    load:'—',    cues:'Zone 2 or HIIT intervals.',                                   timer:1200, isCardio:true},
    {name:'Jump Rope',           cat:'run',    sets:'3', reps:'3 min',     load:'—',    cues:'Steady pace. 1 min rest between.',                           timer:180,  isCardio:true},
    {name:'Stair Climber',       cat:'run',    sets:'1', reps:'20 min',    load:'—',    cues:'Steady zone 2 effort.',                                      timer:1200, isCardio:true},
  ],
  'HYROX Stations': [
    {name:'SkiErg',              cat:'hyrox',  sets:'3', reps:'500m',      load:'—',    cues:'Hip hinge drive. Record each split.',                         timer:90,   isCardio:true},
    {name:'Sled Push',           cat:'hyrox',  sets:'4', reps:'25m',       load:'102kg',cues:'Hips low, drive with legs. Short powerful strides.',          timer:60},
    {name:'Sled Pull',           cat:'hyrox',  sets:'4', reps:'25m',       load:'102kg',cues:'Hand-over-hand. Keep rope taut.',                             timer:60},
    {name:'Burpee Broad Jumps',  cat:'hyrox',  sets:'3', reps:'10 reps',   load:'BW',   cues:'Rhythmic and controlled. Chest to floor each rep.',           timer:60},
    {name:'Sandbag Lunge',       cat:'hyrox',  sets:'3', reps:'20m',       load:'20kg', cues:'Full stride, sandbag on shoulders behind neck.',              timer:90},
    {name:"Farmer's Carry",      cat:'hyrox',  sets:'4', reps:'50m',       load:'2×24kg',cues:'Walk tall, core braced, grip firm.',                        timer:60},
    {name:'Wall Balls',          cat:'hyrox',  sets:'3', reps:'20 reps',   load:'6kg',  cues:'Squat deep, explode up, hit 3m target.',                     timer:75},
    {name:'HYROX Combo',         cat:'hyrox',  sets:'2', reps:'1 full round',load:'—',  cues:'Run 400m between each station.',                             timer:600},
  ],
  'Legs & Glutes': [
    {name:'Back Squat',          cat:'str',    sets:'4', reps:'8',         load:'Heavy',cues:'Full depth, brace core, drive through heels.',               timer:120},
    {name:'Romanian Deadlift',   cat:'str',    sets:'4', reps:'10',        load:'Moderate',cues:'Hip hinge, feel hamstring stretch. Bar close to legs.',    timer:90},
    {name:'Bulgarian Split Squat',cat:'str',   sets:'3', reps:'8 each',    load:'DBs',  cues:'Rear foot elevated. Drive through front heel.',              timer:90},
    {name:'Leg Press',           cat:'str',    sets:'3', reps:'12',        load:'Heavy',cues:'Full ROM, don\'t lock knees.',                               timer:75},
    {name:'Hip Thrust',          cat:'str',    sets:'4', reps:'12',        load:'Barbell',cues:'Shoulder blades on bench. Squeeze glutes at top.',         timer:75},
    {name:'Walking Lunge',       cat:'str',    sets:'3', reps:'10 each',   load:'DBs',  cues:'Full stride, upright torso.',                               timer:75},
    {name:'Step-Up',             cat:'str',    sets:'3', reps:'10 each',   load:'DBs',  cues:'Drive through front heel only.',                             timer:60},
    {name:'Leg Curl',            cat:'str',    sets:'3', reps:'12',        load:'Machine',cues:'Controlled eccentric, full extension.',                   timer:60},
    {name:'Calf Raise',          cat:'str',    sets:'4', reps:'15',        load:'Moderate',cues:'Full ROM. 3 sec eccentric.',                             timer:45},
    {name:'Goblet Squat',        cat:'str',    sets:'3', reps:'15',        load:'KB',   cues:'Elbows inside knees. Chest up.',                            timer:60},
    {name:'Deadlift',            cat:'str',    sets:'4', reps:'5',         load:'Heavy',cues:'Drive the floor away. Flat back.',                          timer:120},
    {name:'Glute Bridge',        cat:'str',    sets:'3', reps:'15',        load:'BW/plate',cues:'Drive hips to ceiling, 1 sec hold.',                    timer:60},
  ],
  'Push (Chest / Shoulders / Triceps)': [
    {name:'Barbell Bench Press', cat:'str',    sets:'4', reps:'8',         load:'Heavy',cues:'Elbows 45°, touch chest, full extension.',                  timer:90},
    {name:'Incline DB Press',    cat:'str',    sets:'3', reps:'10',        load:'Moderate',cues:'45° bench, slow descent.',                               timer:75},
    {name:'Overhead Press',      cat:'str',    sets:'4', reps:'8',         load:'Barbell',cues:'Core tight, bar in front, press straight up.',            timer:90},
    {name:'DB Overhead Press',   cat:'str',    sets:'3', reps:'10',        load:'DBs',  cues:'Neutral grip option available.',                            timer:75},
    {name:'Push-Up',             cat:'str',    sets:'3', reps:'15–20',     load:'BW',   cues:'Full plank, chest to floor, elbows 45°.',                  timer:60},
    {name:'Cable Chest Fly',     cat:'str',    sets:'3', reps:'12',        load:'Light',cues:'Wide arc, slight bend in elbows.',                         timer:60},
    {name:'Dips',                cat:'str',    sets:'3', reps:'10',        load:'BW',   cues:'Slight forward lean for chest focus.',                     timer:75},
    {name:'Lateral Raise',       cat:'str',    sets:'3', reps:'15',        load:'Light DBs',cues:'Slight bend in elbow. Lead with elbow.',               timer:45},
    {name:'Tricep Pushdown',     cat:'str',    sets:'3', reps:'15',        load:'Cable',cues:'Elbows locked at sides.',                                  timer:45},
    {name:'Tricep Dip',          cat:'str',    sets:'3', reps:'12',        load:'BW',   cues:'Full extension at bottom.',                                timer:60},
  ],
  'Pull (Back / Biceps)': [
    {name:'Pull-Up',             cat:'str',    sets:'4', reps:'8',         load:'BW',   cues:'Full hang start, chin over bar, control the descent.',      timer:90},
    {name:'Lat Pulldown',        cat:'str',    sets:'4', reps:'12',        load:'Moderate',cues:'Pull elbows to hips. Slow return.',                     timer:75},
    {name:'Barbell Row',         cat:'str',    sets:'4', reps:'8',         load:'Heavy',cues:'Hinged over, elbows back, bar to lower chest.',            timer:90},
    {name:'Seated Cable Row',    cat:'str',    sets:'3', reps:'12',        load:'Moderate',cues:'Full retraction. Sit tall.',                            timer:60},
    {name:'DB Row (single arm)', cat:'str',    sets:'3', reps:'10 each',   load:'Heavy DB',cues:'Knee on bench, elbow to ceiling.',                     timer:75},
    {name:'Face Pull',           cat:'str',    sets:'3', reps:'15',        load:'Light cable',cues:'Elbows high, external rotation at end.',             timer:45},
    {name:'Dead Hang',           cat:'str',    sets:'3', reps:'Max time',  load:'BW',   cues:'Build grip for sled pull.',                               timer:30},
    {name:'Bicep Curl',          cat:'str',    sets:'3', reps:'12',        load:'DBs',  cues:'Full extension at bottom.',                               timer:45},
    {name:'Hammer Curl',         cat:'str',    sets:'3', reps:'12',        load:'DBs',  cues:'Neutral grip, controlled.',                               timer:45},
    {name:'Chest-Supported Row', cat:'str',    sets:'3', reps:'12',        load:'DBs',  cues:'Chest on incline bench. Eliminates cheat.',               timer:60},
  ],
  'Core & Abs': [
    {name:'Plank Hold',          cat:'str',    sets:'3', reps:'45–60 sec', load:'BW',   cues:'Neutral spine, squeeze glutes, breathe.',                 timer:45},
    {name:'Dead Bug',            cat:'str',    sets:'3', reps:'10',        load:'BW',   cues:'Press lower back into floor throughout.',                 timer:45},
    {name:'Side Plank',          cat:'str',    sets:'2', reps:'30 sec each',load:'BW',  cues:'Hips forward, body in straight line.',                   timer:30},
    {name:'Ab Wheel Rollout',    cat:'str',    sets:'3', reps:'8–10',      load:'BW',   cues:'Brace hard. Don\'t let back sag.',                       timer:60},
    {name:'Hanging Leg Raise',   cat:'str',    sets:'3', reps:'12',        load:'BW',   cues:'Controlled. No swinging.',                               timer:60},
    {name:'Russian Twist',       cat:'str',    sets:'3', reps:'20',        load:'Plate/ball',cues:'Feet off floor for harder version.',                timer:45},
    {name:'Bicycle Crunch',      cat:'str',    sets:'3', reps:'20',        load:'BW',   cues:'Opposite elbow to knee. Controlled.',                    timer:45},
    {name:'Cable Crunch',        cat:'str',    sets:'3', reps:'15',        load:'Light cable',cues:'Crunch down, feel abs contract.',                  timer:45},
    {name:'Pallof Press',        cat:'str',    sets:'3', reps:'12 each',   load:'Cable',cues:'Anti-rotation core stability.',                          timer:45},
    {name:'Superman Hold',       cat:'str',    sets:'3', reps:'10',        load:'BW',   cues:'Squeeze glutes, hold 2 sec at top.',                     timer:30},
  ],
  'Mobility & Recovery': [
    {name:'Hip Flexor Stretch',  cat:'rest',   sets:'2', reps:'60 sec each',load:'—',   cues:'Lunge position, tuck pelvis forward.',                   timer:60},
    {name:'Pigeon Pose',         cat:'rest',   sets:'2', reps:'60 sec each',load:'—',   cues:'Hips square. Breathe into the stretch.',                 timer:60},
    {name:'Foam Roll Quads',     cat:'rest',   sets:'1', reps:'90 sec each',load:'—',   cues:'Slow rolls. Pause on tight spots.',                      timer:90},
    {name:'Thoracic Rotation',   cat:'rest',   sets:'2', reps:'10 each',   load:'—',    cues:'Seated. Rotate fully, hold 2 sec.',                      timer:30},
    {name:'Calf Stretch',        cat:'rest',   sets:'2', reps:'45 sec each',load:'—',   cues:'Straight leg against wall.',                             timer:45},
    {name:'Glute Stretch',       cat:'rest',   sets:'2', reps:'45 sec each',load:'—',   cues:'Figure-4 stretch.',                                      timer:45},
    {name:'90-90 Hip Stretch',   cat:'rest',   sets:'2', reps:'60 sec each',load:'—',   cues:'Both knees at 90°. Sit tall.',                           timer:60},
    {name:'Ankle Mobility',      cat:'rest',   sets:'2', reps:'10 circles',load:'—',    cues:'Full ROM ankle circles each direction.',                  timer:20},
    {name:'World\'s Greatest Stretch',cat:'rest',sets:'2',reps:'5 each',  load:'—',    cues:'Lunge + rotation + reach. Best single drill.',           timer:30},
    {name:'Downward Dog',        cat:'rest',   sets:'3', reps:'30 sec',    load:'—',    cues:'Press heels down. Alternate pedalling.',                 timer:30},
  ],
  'Olympic & Power': [
    {name:'Power Clean',         cat:'str',    sets:'4', reps:'5',         load:'Moderate',cues:'Hip hinge, explosive pull, catch in rack position.', timer:120},
    {name:'Hang Clean',          cat:'str',    sets:'4', reps:'5',         load:'Moderate',cues:'Start from hip. Fast elbows.',                       timer:120},
    {name:'Box Jump',            cat:'str',    sets:'4', reps:'6',         load:'BW',   cues:'Land softly, full extension at top.',                   timer:75},
    {name:'Broad Jump',          cat:'str',    sets:'4', reps:'5',         load:'BW',   cues:'Max distance. Hip extension at takeoff.',               timer:60},
    {name:'Kettlebell Swing',    cat:'str',    sets:'4', reps:'15',        load:'KB',   cues:'Hip hinge drive. Hike the bell back.',                  timer:60},
    {name:'Kettlebell Snatch',   cat:'str',    sets:'3', reps:'8 each',    load:'KB',   cues:'Punch through at top.',                                 timer:90},
    {name:'Thruster',            cat:'str',    sets:'4', reps:'10',        load:'Barbell/DBs',cues:'Squat + press in one movement.',                  timer:90},
    {name:'Clean & Press',       cat:'str',    sets:'3', reps:'6',         load:'Barbell',cues:'Full clean, strict press.',                          timer:120},
  ],
};

// Day names for builder
const BUILDER_DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const DAY_SHORT    = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

// ── CUSTOM PLAN MANAGEMENT ─────────────────────────────
// D.customPlan = {
//   name: "My Plan",
//   weeks: [{ w:1, days:[ {d:'Sun', type:'str', title:'...', detail:'', exs:[...]} × 7 ] }]
// }

function getCustomPlan() {
  return D.customPlan || null;
}

function ensureCustomPlan() {
  if (!D.customPlan) {
    D.customPlan = {
      name: 'My Custom Plan',
      weeks: Array.from({length:12}, (_,i) => ({
        w: i+1,
        phase: `Week ${i+1}`,
        pc: '#e8ff47',
        days: BUILDER_DAYS.map((d,di) => ({
          d: DAY_SHORT[di],
          type: di===0?'str':'rest',
          title: di===0?'Strength + Light Run':'Rest / Recovery',
          detail: '',
          exs: di===0 ? [
            {name:'Back Squat',sets:'3',reps:'10',load:'Moderate',rest:90,cues:'Full depth.',timer:90},
            {name:'Easy Run 15 min',sets:'1',reps:'15 min',load:'—',rest:0,cues:'Zone 2.',timer:900,isCardio:true},
          ] : [],
        }))
      }))
    };
  }
  return D.customPlan;
}

// ── BUILDER STATE ──────────────────────────────────────
let builderWeek     = 1;
let builderDay      = 0;   // 0=Sun
let draggedExercise = null; // { ...exObj } being dragged from library
let draggedFromDay  = null; // {week, dayIdx, exIdx} if dragging within plan
let libSearchQuery  = '';
let libActiveGroup  = 'All';

// ── RENDER BUILDER ─────────────────────────────────────
function renderBuilder() {
  const pt = document.getElementById('pt-builder');
  if (!pt) return;
  ensureCustomPlan();

  pt.innerHTML = `
  <div class="builder-wrap">

    <!-- LEFT: Exercise Library -->
    <div class="builder-lib">
      <div class="builder-lib-hdr">
        <div class="sh-title" style="font-size:.9rem">📚 Exercise <span>Library</span></div>
        <input id="libSearch" class="lib-search" placeholder="Search exercises…"
          oninput="libSearchQuery=this.value;renderLibList()" value="${libSearchQuery}">
      </div>
      <div class="lib-group-tabs" id="libGroupTabs"></div>
      <div class="lib-list" id="libList"></div>
      <div style="font-size:.65rem;color:var(--m1);padding:8px 0;text-align:center">
        Drag any exercise onto a day slot →
      </div>
    </div>

    <!-- RIGHT: Plan Builder -->
    <div class="builder-plan">
      <div class="builder-plan-hdr">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <div class="sh-title" style="font-size:.9rem">🗓 <span id="customPlanName">${D.customPlan?.name||'My Custom Plan'}</span></div>
          <button class="btn-ghost" onclick="renamePlan()" style="font-size:.68rem;padding:4px 9px">✎ Rename</button>
          <button class="btn-ghost" onclick="activateCustomPlan()" style="font-size:.68rem;padding:4px 9px;color:var(--accent);border-color:rgba(232,255,71,.3)">▶ Use This Plan</button>
          <button class="btn-ghost" onclick="clearCustomPlan()" style="font-size:.68rem;padding:4px 9px;color:var(--red);border-color:rgba(255,61,85,.2)">✕ Clear All</button>
        </div>
        <div style="display:flex;align-items:center;gap:6px;margin-top:10px;flex-wrap:wrap">
          <span style="font-size:.7rem;color:var(--m2)">Week:</span>
          <div style="display:flex;gap:3px;flex-wrap:wrap">
            ${Array.from({length:12},(_,i)=>`<button class="wk-sel-btn${builderWeek===i+1?' active-wk':''}" onclick="builderWeek=${i+1};renderBuilderWeek()">W${i+1}</button>`).join('')}
          </div>
        </div>
      </div>

      <div id="builderWeekGrid"></div>

      <!-- Day exercise list -->
      <div id="builderDayPanel" style="margin-top:12px"></div>
    </div>

  </div>`;

  renderLibGroups();
  renderLibList();
  renderBuilderWeek();
}

function renderLibGroups() {
  const groups = ['All', ...Object.keys(EXERCISE_LIBRARY)];
  document.getElementById('libGroupTabs').innerHTML = groups.map(g => `
    <button class="lib-group-btn${libActiveGroup===g?' active':''}" onclick="libActiveGroup='${g.replace(/'/g,"\\'").replace(/\//g,'\\/')}';renderLibGroups();renderLibList()">
      ${g.length>18?g.slice(0,16)+'…':g}
    </button>`).join('');
  document.querySelectorAll('.lib-group-btn').forEach(b => {
    b.classList.toggle('active', b.textContent.trim().startsWith(libActiveGroup.slice(0,10)));
  });
}

function renderLibList() {
  const q = libSearchQuery.toLowerCase();
  let exs = [];
  if (libActiveGroup === 'All') {
    Object.values(EXERCISE_LIBRARY).forEach(arr => exs.push(...arr));
  } else {
    exs = EXERCISE_LIBRARY[libActiveGroup] || [];
  }
  if (q) exs = exs.filter(e => e.name.toLowerCase().includes(q) || e.cat.includes(q) || (e.cues||'').toLowerCase().includes(q));

  document.getElementById('libList').innerHTML = exs.length
    ? exs.map((e, i) => `
      <div class="lib-ex-card" draggable="true"
        ondragstart="onLibDragStart(event, '${encodeURIComponent(JSON.stringify(e))}')"
        ondragend="onDragEnd(event)"
        onclick="addExToCurrentDay(${encodeURIComponent(JSON.stringify(e))})"
        title="Click to add to selected day · Drag to a specific slot">
        <div class="lib-ex-badge ${bclass(e.cat)}">${e.cat.toUpperCase()}</div>
        <div class="lib-ex-name">${e.name}</div>
        <div class="lib-ex-meta">${e.sets}×${e.reps}${e.load&&e.load!=='—'?' · '+e.load:''}</div>
        <div class="lib-ex-drag">⠿</div>
      </div>`).join('')
    : '<div style="text-align:center;color:var(--m1);padding:20px;font-size:.78rem">No exercises match</div>';
}

// ── DRAG FROM LIBRARY ──────────────────────────────────
function onLibDragStart(event, encoded) {
  try { draggedExercise = JSON.parse(decodeURIComponent(encoded)); } catch { return; }
  draggedFromDay = null;
  event.dataTransfer.effectAllowed = 'copy';
  event.target.style.opacity = '0.5';
}

// ── DRAG FROM PLAN (reorder) ───────────────────────────
function onPlanExDragStart(event, week, dayIdx, exIdx) {
  const plan = ensureCustomPlan();
  draggedExercise = {...plan.weeks[week-1].days[dayIdx].exs[exIdx]};
  draggedFromDay  = {week, dayIdx, exIdx};
  event.dataTransfer.effectAllowed = 'move';
  event.target.closest('.ex-card').style.opacity = '0.4';
}

function onDragEnd(event) {
  event.target.style.opacity = '';
  document.querySelectorAll('.drop-zone').forEach(z => z.classList.remove('drag-over'));
}

// ── DROP ONTO DAY SLOT ─────────────────────────────────
function onDayDragOver(event) {
  event.preventDefault();
  event.currentTarget.classList.add('drag-over');
  event.dataTransfer.dropEffect = draggedFromDay ? 'move' : 'copy';
}
function onDayDragLeave(event) { event.currentTarget.classList.remove('drag-over'); }

function onDayDrop(event, week, dayIdx) {
  event.preventDefault();
  event.currentTarget.classList.remove('drag-over');
  if (!draggedExercise) return;

  const plan = ensureCustomPlan();
  const day  = plan.weeks[week-1].days[dayIdx];

  // If reordering within same day, remove from old position first
  if (draggedFromDay && draggedFromDay.week===week && draggedFromDay.dayIdx===dayIdx) {
    day.exs.splice(draggedFromDay.exIdx, 1);
  } else if (draggedFromDay) {
    // Moving from a different day — remove from source
    plan.weeks[draggedFromDay.week-1].days[draggedFromDay.dayIdx].exs.splice(draggedFromDay.exIdx, 1);
    updateDayType(draggedFromDay.week, draggedFromDay.dayIdx);
  }

  // Build a proper ex object
  const newEx = {
    name:     draggedExercise.name,
    sets:     draggedExercise.sets || '3',
    reps:     draggedExercise.reps || '10',
    load:     draggedExercise.load || '—',
    rest:     draggedExercise.rest || 75,
    cues:     draggedExercise.cues || '',
    timer:    draggedExercise.timer || 75,
    isCardio: !!draggedExercise.isCardio,
  };
  day.exs.push(newEx);
  updateDayType(week, dayIdx);

  draggedExercise = null;
  draggedFromDay  = null;
  saveAll();
  renderBuilderWeek();
  if (builderDay === dayIdx) renderBuilderDayPanel();
  showToast(`✅ ${newEx.name} added to ${DAY_SHORT[dayIdx]}`);
}

// Click-to-add: adds exercise to currently selected day in builder
function addExToCurrentDay(encoded) {
  let e;
  try { e = typeof encoded==='string' ? JSON.parse(decodeURIComponent(encoded)) : encoded; } catch { return; }
  const plan = ensureCustomPlan();
  const day  = plan.weeks[builderWeek-1].days[builderDay];
  const newEx = {
    name:e.name, sets:e.sets||'3', reps:e.reps||'10',
    load:e.load||'—', rest:e.rest||75, cues:e.cues||'',
    timer:e.timer||75, isCardio:!!e.isCardio,
  };
  day.exs.push(newEx);
  updateDayType(builderWeek, builderDay);
  saveAll();
  renderBuilderWeek();
  renderBuilderDayPanel();
  showToast(`✅ ${newEx.name} added to ${BUILDER_DAYS[builderDay]}`);
}

function updateDayType(week, dayIdx) {
  const plan = ensureCustomPlan();
  const day  = plan.weeks[week-1].days[dayIdx];
  if (!day.exs.length) {
    day.type  = dayIdx===0 ? 'str' : 'rest';
    day.title = dayIdx===0 ? 'Strength + Light Run' : 'Rest / Recovery';
    return;
  }
  // Infer type from majority of exercises
  const cats = day.exs.map(e => tclass(e.type||e.cat||e.name));
  const counts = cats.reduce((acc,c)=>{acc[c]=(acc[c]||0)+1;return acc;},{});
  const dominant = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0] || 'str';
  day.type  = dominant;
  // Build title from exercise names
  const names = day.exs.slice(0,3).map(e=>e.name).join(' · ');
  day.title = names + (day.exs.length>3?` +${day.exs.length-3}`:'');
}

// ── BUILDER WEEK GRID ──────────────────────────────────
function renderBuilderWeek() {
  const plan = ensureCustomPlan();
  const week = plan.weeks[builderWeek-1];
  const container = document.getElementById('builderWeekGrid');
  if (!container) return;

  container.innerHTML = `<div class="builder-day-grid">
    ${week.days.map((day, di) => {
      const col = TC[tclass(day.type)] || '#888';
      const isActive = builderDay === di;
      return `<div class="builder-day-col${isActive?' bdc-active':''}"
          ondragover="onDayDragOver(event)"
          ondragleave="onDayDragLeave(event)"
          ondrop="onDayDrop(event, ${builderWeek}, ${di})"
          onclick="builderDay=${di};renderBuilderWeek();renderBuilderDayPanel()"
          style="border-color:${isActive?col:'var(--b1)'}">
        <div class="bdc-header" style="color:${col}">
          <span class="bdc-day">${day.d}</span>
          <span class="bdc-type badge ${bclass(day.type)}" style="font-size:.52rem">${day.type.toUpperCase()}</span>
        </div>
        <div class="bdc-exs">
          ${day.exs.length
            ? day.exs.slice(0,4).map(e=>`<div class="bdc-ex-pill">${e.name}</div>`).join('') + (day.exs.length>4?`<div class="bdc-more">+${day.exs.length-4} more</div>`:'')
            : `<div class="drop-zone" style="color:var(--m1);font-size:.62rem;text-align:center;padding:8px 4px;border:1px dashed var(--b2);border-radius:6px">Drop here</div>`
          }
        </div>
        <div class="bdc-count" style="color:${col}">${day.exs.length} ex</div>
      </div>`;
    }).join('')}
  </div>`;

  renderBuilderDayPanel();
}

function renderBuilderDayPanel() {
  const plan = ensureCustomPlan();
  const day  = plan.weeks[builderWeek-1].days[builderDay];
  const panel= document.getElementById('builderDayPanel');
  if (!panel) return;
  const col  = TC[tclass(day.type)] || '#888';

  panel.innerHTML = `
  <div class="card" style="border-left:2px solid ${col}">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <div>
        <span class="badge ${bclass(day.type)}" style="margin-right:8px">${day.type.toUpperCase()}</span>
        <strong style="font-size:.9rem">${BUILDER_DAYS[builderDay]} — Week ${builderWeek}</strong>
        <div style="font-size:.72rem;color:var(--m2);margin-top:3px">${day.exs.length} exercises · Click an exercise in the library to add</div>
      </div>
      <button class="btn-ghost" onclick="clearDay(${builderWeek},${builderDay})" style="font-size:.7rem;color:var(--red);border-color:rgba(255,61,85,.2)">Clear day</button>
    </div>
    ${day.exs.length===0
      ? `<div style="text-align:center;padding:30px;color:var(--m1);border:1px dashed var(--b2);border-radius:8px;font-size:.8rem">
          No exercises yet.<br>Click or drag from the library →
        </div>`
      : `<div id="builderExList">${day.exs.map((e,i) => builderExRow(e,i,day.exs.length)).join('')}</div>`
    }
  </div>`;
}

function builderExRow(e, idx, total) {
  const w=builderWeek,di=builderDay;
  return `<div class="builder-ex-row" id="bexrow_${idx}"
    draggable="true"
    ondragstart="onPlanExDragStart(event,${w},${di},${idx})"
    ondragend="onDragEnd(event)">
    <div class="bex-drag-handle" title="Drag to reorder">⠿</div>
    <div class="bex-body">
      <div style="font-weight:600;font-size:.84rem">${e.name}${e.isCardio?'<span class="cardio-pill">cardio</span>':''}</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:3px">
        <label style="font-size:.66rem;color:var(--m1)">Sets <input type="number" class="bex-input" value="${e.sets}" min="1" max="10" onchange="updateExField(${w},${di},${idx},'sets',this.value)"></label>
        <label style="font-size:.66rem;color:var(--m1)">Reps <input class="bex-input bex-reps" value="${e.reps}" onchange="updateExField(${w},${di},${idx},'reps',this.value)"></label>
        <label style="font-size:.66rem;color:var(--m1)">Load <input class="bex-input bex-load" value="${e.load||'—'}" onchange="updateExField(${w},${di},${idx},'load',this.value)"></label>
        <label style="font-size:.66rem;color:var(--m1)">Rest(s) <input type="number" class="bex-input" value="${e.rest||75}" min="0" max="300" onchange="updateExField(${w},${di},${idx},'rest',+this.value)"></label>
      </div>
      ${e.cues?`<div style="font-size:.68rem;color:var(--m2);font-style:italic;margin-top:3px">${e.cues}</div>`:''}
    </div>
    <div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0">
      <button class="bex-btn" onclick="moveEx(${w},${di},${idx},-1)" ${idx===0?'disabled':''} title="Move up">▲</button>
      <button class="bex-btn" onclick="moveEx(${w},${di},${idx},1)"  ${idx===total-1?'disabled':''} title="Move down">▼</button>
      <button class="bex-btn bex-del" onclick="removeEx(${w},${di},${idx})" title="Remove">✕</button>
    </div>
  </div>`;
}

function updateExField(week, dayIdx, exIdx, field, val) {
  const plan = ensureCustomPlan();
  plan.weeks[week-1].days[dayIdx].exs[exIdx][field] = val;
  saveAll();
}

function moveEx(week, dayIdx, exIdx, dir) {
  const plan = ensureCustomPlan();
  const exs  = plan.weeks[week-1].days[dayIdx].exs;
  const newIdx = exIdx + dir;
  if (newIdx < 0 || newIdx >= exs.length) return;
  [exs[exIdx], exs[newIdx]] = [exs[newIdx], exs[exIdx]];
  saveAll();
  renderBuilderDayPanel();
}

function removeEx(week, dayIdx, exIdx) {
  const plan = ensureCustomPlan();
  plan.weeks[week-1].days[dayIdx].exs.splice(exIdx, 1);
  updateDayType(week, dayIdx);
  saveAll();
  renderBuilderWeek();
  renderBuilderDayPanel();
  showToast('Exercise removed');
}

function clearDay(week, dayIdx) {
  if (!confirm(`Clear all exercises from ${BUILDER_DAYS[dayIdx]}?`)) return;
  const plan = ensureCustomPlan();
  plan.weeks[week-1].days[dayIdx].exs = [];
  updateDayType(week, dayIdx);
  saveAll();
  renderBuilderWeek();
  renderBuilderDayPanel();
  showToast('Day cleared');
}

function clearCustomPlan() {
  if (!confirm('Clear the entire custom plan? This cannot be undone.')) return;
  D.customPlan = null;
  saveAll();
  renderBuilder();
  showToast('Custom plan cleared');
}

function renamePlan() {
  const name = prompt('Plan name:', D.customPlan?.name || 'My Custom Plan');
  if (!name) return;
  ensureCustomPlan();
  D.customPlan.name = name;
  saveAll();
  document.getElementById('customPlanName').textContent = name;
  showToast('Plan renamed');
}

function activateCustomPlan() {
  ensureCustomPlan();
  setActiveProgram('custom');
  showToast('✅ Custom plan is now active! Check Calendar & This Week.');
}
