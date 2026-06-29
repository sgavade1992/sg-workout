// ═══════════════════════════════════════════════════════
// CUSTOM WORKOUT BUILDER — Checklist-based (mobile friendly)
// ═══════════════════════════════════════════════════════

// ── EXERCISE LIBRARY ───────────────────────────────────
const EXERCISE_LIBRARY = {
  'Running & Cardio': [
    {name:'Zone 2 Run',           cat:'run',   sets:'1', reps:'20–30 min',      load:'—',       cues:'HR 112–131 bpm. Conversational pace.',         timer:1200,isCardio:true},
    {name:'Tempo Run',            cat:'run',   sets:'1', reps:'15–20 min',      load:'—',       cues:'HR 145–155 bpm. Comfortably hard.',            timer:900, isCardio:true},
    {name:'Interval Run',         cat:'run',   sets:'6', reps:'400m',           load:'—',       cues:'Hard effort. 90 sec jog rest between.',        timer:120, isCardio:true},
    {name:'Long Run',             cat:'run',   sets:'1', reps:'45–60 min',      load:'—',       cues:'Zone 2 the entire time.',                      timer:2700,isCardio:true},
    {name:'HIIT Sprints',         cat:'run',   sets:'8', reps:'30 sec on/30 off',load:'—',      cues:'All-out effort on, complete rest off.',         timer:30,  isCardio:true},
    {name:'Treadmill Walk',       cat:'run',   sets:'1', reps:'30 min',         load:'—',       cues:'Incline 5–8%. Zone 1–2.',                      timer:1800,isCardio:true},
    {name:'Row Ergometer',        cat:'run',   sets:'1', reps:'1,000m',         load:'—',       cues:'Legs-back-arms. Record time.',                 timer:300, isCardio:true},
    {name:'Assault Bike',         cat:'run',   sets:'1', reps:'20 min',         load:'—',       cues:'Zone 2 or HIIT intervals.',                    timer:1200,isCardio:true},
    {name:'Jump Rope',            cat:'run',   sets:'3', reps:'3 min',          load:'—',       cues:'Steady pace. 1 min rest.',                     timer:180, isCardio:true},
    {name:'Stair Climber',        cat:'run',   sets:'1', reps:'20 min',         load:'—',       cues:'Steady zone 2 effort.',                        timer:1200,isCardio:true},
  ],
  'HYROX Stations': [
    {name:'SkiErg',               cat:'hyrox', sets:'3', reps:'500m',           load:'—',       cues:'Hip hinge drive. Record each split.',          timer:90,  isCardio:true},
    {name:'Sled Push',            cat:'hyrox', sets:'4', reps:'25m',            load:'102kg',   cues:'Hips low, drive with legs.',                   timer:60},
    {name:'Sled Pull',            cat:'hyrox', sets:'4', reps:'25m',            load:'102kg',   cues:'Hand-over-hand. Keep rope taut.',              timer:60},
    {name:'Burpee Broad Jumps',   cat:'hyrox', sets:'3', reps:'10 reps',        load:'BW',      cues:'Rhythmic, chest to floor each rep.',           timer:60},
    {name:'Sandbag Lunge',        cat:'hyrox', sets:'3', reps:'20m',            load:'20kg',    cues:'Full stride, sandbag on shoulders.',           timer:90},
    {name:"Farmer's Carry",       cat:'hyrox', sets:'4', reps:'50m',            load:'2×24kg',  cues:'Walk tall, core braced, grip firm.',           timer:60},
    {name:'Wall Balls',           cat:'hyrox', sets:'3', reps:'20 reps',        load:'6kg',     cues:'Squat deep, explode up, hit 3m target.',      timer:75},
    {name:'HYROX Combo',          cat:'hyrox', sets:'2', reps:'1 full round',   load:'—',       cues:'Run 400m between each station.',               timer:600},
  ],
  'Legs & Glutes': [
    {name:'Back Squat',           cat:'str',   sets:'4', reps:'8',              load:'Heavy',   cues:'Full depth, brace core, drive through heels.',timer:120},
    {name:'Romanian Deadlift',    cat:'str',   sets:'4', reps:'10',             load:'Moderate',cues:'Hip hinge, feel hamstring stretch.',           timer:90},
    {name:'Bulgarian Split Squat',cat:'str',   sets:'3', reps:'8 each',         load:'DBs',     cues:'Rear foot elevated. Front heel drive.',       timer:90},
    {name:'Leg Press',            cat:'str',   sets:'3', reps:'12',             load:'Heavy',   cues:"Full ROM, don't lock knees.",                 timer:75},
    {name:'Hip Thrust',           cat:'str',   sets:'4', reps:'12',             load:'Barbell', cues:'Shoulder blades on bench. Squeeze glutes.',   timer:75},
    {name:'Walking Lunge',        cat:'str',   sets:'3', reps:'10 each',        load:'DBs',     cues:'Full stride, upright torso.',                 timer:75},
    {name:'Step-Up',              cat:'str',   sets:'3', reps:'10 each',        load:'DBs',     cues:'Drive through front heel only.',               timer:60},
    {name:'Leg Curl',             cat:'str',   sets:'3', reps:'12',             load:'Machine', cues:'Controlled eccentric, full extension.',       timer:60},
    {name:'Calf Raise',           cat:'str',   sets:'4', reps:'15',             load:'Moderate',cues:'Full ROM. 3 sec eccentric.',                  timer:45},
    {name:'Goblet Squat',         cat:'str',   sets:'3', reps:'15',             load:'KB',      cues:'Elbows inside knees. Chest up.',               timer:60},
    {name:'Deadlift',             cat:'str',   sets:'4', reps:'5',              load:'Heavy',   cues:'Drive the floor away. Flat back.',             timer:120},
    {name:'Glute Bridge',         cat:'str',   sets:'3', reps:'15',             load:'BW/plate',cues:'Drive hips up, 1 sec hold.',                  timer:60},
    {name:'Reverse Lunge',        cat:'str',   sets:'3', reps:'10 each',        load:'DBs',     cues:'Control the descent.',                        timer:60},
  ],
  'Push (Chest / Shoulders / Triceps)': [
    {name:'Barbell Bench Press',  cat:'str',   sets:'4', reps:'8',              load:'Heavy',   cues:'Elbows 45°, touch chest, full extension.',    timer:90},
    {name:'Incline DB Press',     cat:'str',   sets:'3', reps:'10',             load:'Moderate',cues:'45° bench, slow descent.',                    timer:75},
    {name:'Overhead Press',       cat:'str',   sets:'4', reps:'8',              load:'Barbell', cues:'Core tight, press straight up.',               timer:90},
    {name:'DB Overhead Press',    cat:'str',   sets:'3', reps:'10',             load:'DBs',     cues:'Neutral grip option available.',               timer:75},
    {name:'Push-Up',              cat:'str',   sets:'3', reps:'15–20',          load:'BW',      cues:'Full plank, chest to floor, elbows 45°.',     timer:60},
    {name:'Cable Chest Fly',      cat:'str',   sets:'3', reps:'12',             load:'Light',   cues:'Wide arc, slight bend in elbows.',             timer:60},
    {name:'Dips',                 cat:'str',   sets:'3', reps:'10',             load:'BW',      cues:'Slight forward lean for chest focus.',        timer:75},
    {name:'Lateral Raise',        cat:'str',   sets:'3', reps:'15',             load:'Light DBs',cues:'Slight bend in elbow. Lead with elbow.',    timer:45},
    {name:'Tricep Pushdown',      cat:'str',   sets:'3', reps:'15',             load:'Cable',   cues:'Elbows locked at sides.',                      timer:45},
    {name:'Tricep Dip',           cat:'str',   sets:'3', reps:'12',             load:'BW',      cues:'Full extension at bottom.',                   timer:60},
  ],
  'Pull (Back / Biceps)': [
    {name:'Pull-Up',              cat:'str',   sets:'4', reps:'8',              load:'BW',      cues:'Full hang, chin over bar, control descent.',  timer:90},
    {name:'Lat Pulldown',         cat:'str',   sets:'4', reps:'12',             load:'Moderate',cues:'Pull elbows to hips. Slow return.',           timer:75},
    {name:'Barbell Row',          cat:'str',   sets:'4', reps:'8',              load:'Heavy',   cues:'Hinged over, elbows back.',                   timer:90},
    {name:'Seated Cable Row',     cat:'str',   sets:'3', reps:'12',             load:'Moderate',cues:'Full retraction. Sit tall.',                  timer:60},
    {name:'DB Row (single arm)',  cat:'str',   sets:'3', reps:'10 each',        load:'Heavy DB',cues:'Knee on bench, elbow to ceiling.',            timer:75},
    {name:'Face Pull',            cat:'str',   sets:'3', reps:'15',             load:'Light cable',cues:'Elbows high, external rotation.',          timer:45},
    {name:'Dead Hang',            cat:'str',   sets:'3', reps:'Max time',       load:'BW',      cues:'Build grip for sled pull.',                   timer:30},
    {name:'Bicep Curl',           cat:'str',   sets:'3', reps:'12',             load:'DBs',     cues:'Full extension at bottom.',                   timer:45},
    {name:'Hammer Curl',          cat:'str',   sets:'3', reps:'12',             load:'DBs',     cues:'Neutral grip, controlled.',                   timer:45},
    {name:'Chest-Supported Row',  cat:'str',   sets:'3', reps:'12',             load:'DBs',     cues:'Chest on incline bench. Eliminates cheat.',   timer:60},
  ],
  'Core & Abs': [
    {name:'Plank Hold',           cat:'str',   sets:'3', reps:'45–60 sec',      load:'BW',      cues:'Neutral spine, squeeze glutes, breathe.',     timer:45},
    {name:'Dead Bug',             cat:'str',   sets:'3', reps:'10',             load:'BW',      cues:'Press lower back into floor throughout.',     timer:45},
    {name:'Side Plank',           cat:'str',   sets:'2', reps:'30 sec each',    load:'BW',      cues:'Hips forward, body in straight line.',        timer:30},
    {name:'Ab Wheel Rollout',     cat:'str',   sets:'3', reps:'8–10',           load:'BW',      cues:"Brace hard. Don't let back sag.",             timer:60},
    {name:'Hanging Leg Raise',    cat:'str',   sets:'3', reps:'12',             load:'BW',      cues:'Controlled. No swinging.',                    timer:60},
    {name:'Russian Twist',        cat:'str',   sets:'3', reps:'20',             load:'Plate/ball',cues:'Feet off floor for harder version.',        timer:45},
    {name:'Bicycle Crunch',       cat:'str',   sets:'3', reps:'20',             load:'BW',      cues:'Opposite elbow to knee. Controlled.',        timer:45},
    {name:'Cable Crunch',         cat:'str',   sets:'3', reps:'15',             load:'Light cable',cues:'Crunch down, feel abs contract.',          timer:45},
    {name:'Pallof Press',         cat:'str',   sets:'3', reps:'12 each',        load:'Cable',   cues:'Anti-rotation core stability.',               timer:45},
    {name:'Superman Hold',        cat:'str',   sets:'3', reps:'10',             load:'BW',      cues:'Squeeze glutes, hold 2 sec at top.',          timer:30},
  ],
  'Mobility & Recovery': [
    {name:'Hip Flexor Stretch',   cat:'rest',  sets:'2', reps:'60 sec each',    load:'—',       cues:'Lunge position, tuck pelvis forward.',        timer:60},
    {name:'Pigeon Pose',          cat:'rest',  sets:'2', reps:'60 sec each',    load:'—',       cues:'Hips square. Breathe into the stretch.',      timer:60},
    {name:'Foam Roll Quads',      cat:'rest',  sets:'1', reps:'90 sec each',    load:'—',       cues:'Slow rolls. Pause on tight spots.',           timer:90},
    {name:'Thoracic Rotation',    cat:'rest',  sets:'2', reps:'10 each',        load:'—',       cues:'Seated. Rotate fully, hold 2 sec.',           timer:30},
    {name:'Calf Stretch',         cat:'rest',  sets:'2', reps:'45 sec each',    load:'—',       cues:'Straight leg against wall.',                  timer:45},
    {name:'90-90 Hip Stretch',    cat:'rest',  sets:'2', reps:'60 sec each',    load:'—',       cues:"Both knees at 90°. Sit tall.",               timer:60},
    {name:"World's Greatest Stretch",cat:'rest',sets:'2',reps:'5 each',         load:'—',       cues:'Lunge + rotation + reach.',                   timer:30},
    {name:'Downward Dog',         cat:'rest',  sets:'3', reps:'30 sec',         load:'—',       cues:'Press heels down. Alternate pedalling.',      timer:30},
    {name:'Ankle Mobility',       cat:'rest',  sets:'2', reps:'10 circles',     load:'—',       cues:'Full ROM circles each direction.',            timer:20},
    {name:'Glute Stretch',        cat:'rest',  sets:'2', reps:'45 sec each',    load:'—',       cues:'Figure-4 stretch.',                           timer:45},
  ],
  'Olympic & Power': [
    {name:'Power Clean',          cat:'str',   sets:'4', reps:'5',              load:'Moderate',cues:'Hip hinge, explosive pull, catch in rack.',   timer:120},
    {name:'Box Jump',             cat:'str',   sets:'4', reps:'6',              load:'BW',      cues:'Land softly, full extension at top.',         timer:75},
    {name:'Broad Jump',           cat:'str',   sets:'4', reps:'5',              load:'BW',      cues:'Max distance. Hip extension at takeoff.',     timer:60},
    {name:'Kettlebell Swing',     cat:'str',   sets:'4', reps:'15',             load:'KB',      cues:'Hip hinge drive. Hike the bell back.',       timer:60},
    {name:'Kettlebell Snatch',    cat:'str',   sets:'3', reps:'8 each',         load:'KB',      cues:'Punch through at top.',                       timer:90},
    {name:'Thruster',             cat:'str',   sets:'4', reps:'10',             load:'Barbell/DBs',cues:'Squat + press in one movement.',          timer:90},
  ],
};

const BUILDER_DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const DAY_SHORT    = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

// ── BUILDER STATE ──────────────────────────────────────
let builderWeek     = 1;
let builderDay      = 0;
let libSearchQuery  = '';
let libActiveGroup  = 'All';

// ── CUSTOM PLAN MANAGEMENT ─────────────────────────────
function getCustomPlan() { return D.customPlan || null; }

function ensureCustomPlan() {
  if (!D.customPlan) {
    D.customPlan = {
      name: 'My Custom Plan',
      weeks: Array.from({length:12}, (_,i) => ({
        w: i+1,
        phase: `Week ${i+1}`,
        pc: '#e8ff47',
        days: BUILDER_DAYS.map((d, di) => ({
          d: DAY_SHORT[di],
          type: di===0 ? 'str' : 'rest',
          title: di===0 ? 'Strength + Light Run' : 'Rest / Recovery',
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

// ── RENDER BUILDER ─────────────────────────────────────
function renderBuilder() {
  const pt = document.getElementById('pt-builder');
  if (!pt) return;
  ensureCustomPlan();

  pt.innerHTML = `
  <div class="builder-wrap">

    <!-- ── STEP 1: Pick week + day ── -->
    <div class="builder-step-card">
      <div class="builder-step-hdr">
        <span class="builder-step-num">1</span>
        <div>
          <div style="font-weight:700;font-size:.9rem">Select Week &amp; Day</div>
          <div style="font-size:.7rem;color:var(--m2)">Choose where to add exercises</div>
        </div>
      </div>

      <!-- Week selector -->
      <div style="margin-bottom:12px">
        <div class="ctitle">Week</div>
        <div class="builder-week-grid" id="builderWkGrid"></div>
      </div>

      <!-- Day selector -->
      <div>
        <div class="ctitle">Day of Week</div>
        <div class="builder-day-pills" id="builderDayPills"></div>
      </div>
    </div>

    <!-- ── STEP 2: Current day exercises ── -->
    <div class="builder-step-card">
      <div class="builder-step-hdr">
        <span class="builder-step-num">2</span>
        <div style="flex:1">
          <div style="font-weight:700;font-size:.9rem" id="builderDayTitle">Sunday — Week 1</div>
          <div style="font-size:.7rem;color:var(--m2)" id="builderDayCount">0 exercises</div>
        </div>
        <button class="btn-ghost" onclick="clearBuilderDay()" style="font-size:.7rem;padding:5px 10px;color:var(--red);border-color:rgba(255,61,85,.25)">Clear</button>
      </div>
      <div id="builderDayExercises"></div>
      <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--b1);display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn-save" onclick="activateCustomPlan()" style="font-size:.78rem;padding:9px 16px">▶ Use This Plan</button>
        <button class="btn-ghost" onclick="renamePlan()" style="font-size:.76rem">✎ Rename</button>
        <button class="btn-ghost" onclick="clearCustomPlan()" style="font-size:.76rem;color:var(--red);border-color:rgba(255,61,85,.2)">✕ Clear All</button>
      </div>
    </div>

    <!-- ── STEP 3: Exercise checklist ── -->
    <div class="builder-step-card">
      <div class="builder-step-hdr">
        <span class="builder-step-num">3</span>
        <div>
          <div style="font-weight:700;font-size:.9rem">Add Exercises</div>
          <div style="font-size:.7rem;color:var(--m2)">Tap ＋ to add to selected day</div>
        </div>
      </div>

      <!-- Search -->
      <input id="libSearch" class="lib-search" placeholder="🔍  Search exercises…"
        oninput="libSearchQuery=this.value;renderLibChecklist()" value="${libSearchQuery}"
        style="margin-bottom:10px">

      <!-- Category tabs -->
      <div class="lib-group-tabs" id="libGroupTabs" style="margin-bottom:10px"></div>

      <!-- Exercise checklist -->
      <div class="lib-checklist" id="libChecklist"></div>
    </div>

  </div>`;

  renderBuilderWkGrid();
  renderBuilderDayPills();
  renderBuilderDayPanel();
  renderLibGroupTabs();
  renderLibChecklist();
}

// ── WEEK SELECTOR GRID ─────────────────────────────────
function renderBuilderWkGrid() {
  const plan = ensureCustomPlan();
  const el = document.getElementById('builderWkGrid');
  if (!el) return;
  el.innerHTML = Array.from({length:12}, (_,i) => {
    const w = i+1;
    const totalEx = plan.weeks[i].days.reduce((s,d) => s + d.exs.length, 0);
    const isActive = builderWeek === w;
    return `<button
      class="builder-wk-btn${isActive ? ' builder-wk-active' : ''}"
      onclick="builderWeek=${w};renderBuilderWkGrid();renderBuilderDayPills();renderBuilderDayPanel()">
      <span class="bwk-label">W${w}</span>
      ${totalEx > 0 ? `<span class="bwk-dot"></span>` : ''}
    </button>`;
  }).join('');
}

// ── DAY PILLS ──────────────────────────────────────────
function renderBuilderDayPills() {
  const plan = ensureCustomPlan();
  const el = document.getElementById('builderDayPills');
  if (!el) return;
  const week = plan.weeks[builderWeek - 1];
  el.innerHTML = week.days.map((day, di) => {
    const isActive = builderDay === di;
    const col = TC[tclass(day.type)] || '#888';
    const hasEx = day.exs.length > 0;
    return `<button
      class="builder-day-pill${isActive ? ' builder-day-active' : ''}"
      style="${isActive ? `border-color:${col};background:${col}18;` : ''}"
      onclick="builderDay=${di};renderBuilderDayPills();renderBuilderDayPanel()">
      <span style="font-weight:700;font-size:.72rem;color:${isActive?col:'var(--m1)'}">${day.d}</span>
      ${hasEx ? `<span class="bpill-count">${day.exs.length}</span>` : ''}
    </button>`;
  }).join('');
}

// ── DAY EXERCISE LIST ──────────────────────────────────
function renderBuilderDayPanel() {
  const plan = ensureCustomPlan();
  const day  = plan.weeks[builderWeek - 1].days[builderDay];
  const col  = TC[tclass(day.type)] || '#888';

  const titleEl = document.getElementById('builderDayTitle');
  const countEl = document.getElementById('builderDayCount');
  const listEl  = document.getElementById('builderDayExercises');
  if (!titleEl || !listEl) return;

  titleEl.textContent = `${BUILDER_DAYS[builderDay]} — Week ${builderWeek}`;
  countEl.textContent = `${day.exs.length} exercise${day.exs.length !== 1 ? 's' : ''}`;

  if (!day.exs.length) {
    listEl.innerHTML = `<div style="text-align:center;padding:20px 10px;color:var(--m1);font-size:.8rem;border:1px dashed var(--b2);border-radius:var(--rsm)">
      No exercises yet.<br>Tap <strong style="color:var(--accent)">＋ Add</strong> below to add from the library.
    </div>`;
    return;
  }

  listEl.innerHTML = day.exs.map((ex, i) => `
    <div class="bex-row">
      <div class="bex-handle">
        <span class="bex-num">${i+1}</span>
      </div>
      <div class="bex-info">
        <div class="bex-name">${ex.name}${ex.isCardio?'<span class="cardio-pill">cardio</span>':''}</div>
        <div class="bex-meta">${ex.sets!=='1'?ex.sets+'×'+ex.reps:ex.reps} · ${ex.load||'BW'}</div>
      </div>
      <div class="bex-actions">
        <button class="bex-action-btn" onclick="moveBexUp(${i})" ${i===0?'disabled':''} title="Move up">↑</button>
        <button class="bex-action-btn" onclick="moveBexDown(${i})" ${i===day.exs.length-1?'disabled':''} title="Move down">↓</button>
        <button class="bex-action-btn bex-del" onclick="removeBex(${i})" title="Remove">✕</button>
      </div>
    </div>`).join('');
}

function moveBexUp(idx) {
  const day = ensureCustomPlan().weeks[builderWeek-1].days[builderDay];
  if (idx === 0) return;
  [day.exs[idx], day.exs[idx-1]] = [day.exs[idx-1], day.exs[idx]];
  saveAll(); renderBuilderDayPanel();
}
function moveBexDown(idx) {
  const day = ensureCustomPlan().weeks[builderWeek-1].days[builderDay];
  if (idx === day.exs.length-1) return;
  [day.exs[idx], day.exs[idx+1]] = [day.exs[idx+1], day.exs[idx]];
  saveAll(); renderBuilderDayPanel();
}
function removeBex(idx) {
  const day = ensureCustomPlan().weeks[builderWeek-1].days[builderDay];
  day.exs.splice(idx, 1);
  updateDayType(builderWeek, builderDay);
  saveAll();
  renderBuilderWkGrid();
  renderBuilderDayPills();
  renderBuilderDayPanel();
}
function clearBuilderDay() {
  if (!confirm(`Clear all exercises from ${BUILDER_DAYS[builderDay]}?`)) return;
  const day = ensureCustomPlan().weeks[builderWeek-1].days[builderDay];
  day.exs = [];
  updateDayType(builderWeek, builderDay);
  saveAll();
  renderBuilderWkGrid();
  renderBuilderDayPills();
  renderBuilderDayPanel();
}

// ── LIBRARY GROUP TABS ─────────────────────────────────
function renderLibGroupTabs() {
  const groups = ['All', ...Object.keys(EXERCISE_LIBRARY)];
  const el = document.getElementById('libGroupTabs');
  if (!el) return;
  el.innerHTML = groups.map(g => {
    const short = g === 'All' ? 'All' :
      g.includes('Running') ? 'Cardio' :
      g.includes('HYROX')   ? 'HYROX' :
      g.includes('Legs')    ? 'Legs' :
      g.includes('Push')    ? 'Push' :
      g.includes('Pull')    ? 'Pull' :
      g.includes('Core')    ? 'Core' :
      g.includes('Mobility')? 'Mobility' :
      g.includes('Olympic') ? 'Power' : g;
    return `<button class="lib-group-btn${libActiveGroup===g?' active':''}"
      onclick="libActiveGroup='${g.replace(/'/g,"\\'")}';renderLibGroupTabs();renderLibChecklist()">
      ${short}
    </button>`;
  }).join('');
}

// ── EXERCISE CHECKLIST ─────────────────────────────────
function renderLibChecklist() {
  const q = libSearchQuery.toLowerCase();
  let exs = [];
  if (libActiveGroup === 'All') {
    Object.values(EXERCISE_LIBRARY).forEach(arr => exs.push(...arr));
  } else {
    exs = EXERCISE_LIBRARY[libActiveGroup] || [];
  }
  if (q) exs = exs.filter(e =>
    e.name.toLowerCase().includes(q) ||
    e.cat.toLowerCase().includes(q) ||
    (e.cues||'').toLowerCase().includes(q)
  );

  const el = document.getElementById('libChecklist');
  if (!el) return;

  // Check which are already in the current day
  const plan = ensureCustomPlan();
  const currentDayExNames = new Set(
    plan.weeks[builderWeek-1].days[builderDay].exs.map(e => e.name)
  );

  if (!exs.length) {
    el.innerHTML = '<div style="text-align:center;color:var(--m1);padding:24px;font-size:.8rem">No exercises found</div>';
    return;
  }

  el.innerHTML = exs.map((e, i) => {
    const alreadyAdded = currentDayExNames.has(e.name);
    const yt = (typeof getYTLink === 'function') ? getYTLink(e.name) : null;
    return `<div class="lib-check-row${alreadyAdded?' lib-check-added':''}">
      <div class="lib-check-info">
        <div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-bottom:2px">
          <span class="badge ${bclass(e.cat)}">${e.cat.toUpperCase()}</span>
          <span class="lib-check-name">${e.name}</span>
          ${yt ? `<a href="${yt}" target="_blank" rel="noopener" class="yt-btn yt-btn-sm" onclick="event.stopPropagation()" title="Watch demo">▶</a>` : ''}
        </div>
        <div class="lib-check-meta">${e.sets!=='1'?e.sets+'×':''} ${e.reps} · ${e.load||'BW'}</div>
        ${e.cues ? `<div class="lib-check-cues">${e.cues}</div>` : ''}
      </div>
      <button
        class="lib-add-btn${alreadyAdded?' lib-add-btn-done':''}"
        onclick="addExerciseToDay(${i}, '${libActiveGroup}')"
        title="${alreadyAdded ? 'Already added — tap to add again' : 'Add to '+BUILDER_DAYS[builderDay]}">
        ${alreadyAdded ? '✓' : '＋'}
      </button>
    </div>`;
  }).join('');
}

// ── ADD EXERCISE ───────────────────────────────────────
function addExerciseToDay(libIdx, group) {
  let exs = [];
  if (group === 'All') {
    Object.values(EXERCISE_LIBRARY).forEach(arr => exs.push(...arr));
  } else {
    exs = EXERCISE_LIBRARY[group] || [];
  }
  // Re-apply search filter
  const q = libSearchQuery.toLowerCase();
  if (q) exs = exs.filter(e =>
    e.name.toLowerCase().includes(q) || e.cat.toLowerCase().includes(q)
  );

  const src = exs[libIdx];
  if (!src) return;

  const plan = ensureCustomPlan();
  const day  = plan.weeks[builderWeek-1].days[builderDay];

  day.exs.push({
    name:     src.name,
    sets:     src.sets || '3',
    reps:     src.reps || '10',
    load:     src.load || '—',
    rest:     src.rest || 75,
    cues:     src.cues || '',
    timer:    src.timer || 75,
    isCardio: !!src.isCardio,
  });

  updateDayType(builderWeek, builderDay);
  saveAll();

  // Update all panels
  renderBuilderWkGrid();
  renderBuilderDayPills();
  renderBuilderDayPanel();
  renderLibChecklist(); // refresh checkmarks

  showToast(`✅ ${src.name} added to ${DAY_SHORT[builderDay]}`);
}

// ── UPDATE DAY TYPE ────────────────────────────────────
function updateDayType(week, dayIdx) {
  const plan = ensureCustomPlan();
  const day  = plan.weeks[week-1].days[dayIdx];
  if (!day.exs.length) {
    day.type  = dayIdx === 0 ? 'str' : 'rest';
    day.title = dayIdx === 0 ? 'Strength + Light Run' : 'Rest / Recovery';
    return;
  }
  const cats   = day.exs.map(e => tclass(e.type || e.cat || e.name));
  const counts = cats.reduce((acc,c) => { acc[c]=(acc[c]||0)+1; return acc; }, {});
  const dominant = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0] || 'str';
  day.type  = dominant;
  day.title = day.exs.slice(0,3).map(e=>e.name).join(' · ') + (day.exs.length>3?` +${day.exs.length-3}`:'');
}

// ── PLAN ACTIONS ───────────────────────────────────────
function renamePlan() {
  const name = prompt('Plan name:', D.customPlan?.name || 'My Custom Plan');
  if (!name) return;
  ensureCustomPlan();
  D.customPlan.name = name;
  saveAll();
  showToast('Plan renamed');
}

function clearCustomPlan() {
  if (!confirm('Clear the entire custom plan? This cannot be undone.')) return;
  D.customPlan = null;
  saveAll();
  renderBuilder();
  showToast('Custom plan cleared');
}

function activateCustomPlan() {
  ensureCustomPlan();
  setActiveProgram('custom');
  showToast('✅ Custom plan is now active! Check Calendar & This Week.');
}
