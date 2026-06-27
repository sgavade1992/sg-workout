// ═══════════════════════════════════════════════════════
// SG WORKOUT — Supabase Backend
// Handles: Auth, per-user data storage, real-time sync
// ═══════════════════════════════════════════════════════
//
// SETUP (one-time):
// 1. Go to supabase.com → New project (free)
// 2. Project Settings → API → copy URL and anon key
// 3. Paste them below
// 4. In Supabase dashboard → SQL Editor → run this SQL:
//
//    create table if not exists user_data (
//      id         uuid references auth.users primary key,
//      data       jsonb not null default '{}',
//      updated_at timestamptz default now()
//    );
//    alter table user_data enable row level security;
//    create policy "Users own data" on user_data
//      for all using (auth.uid() = id);
//
// ═══════════════════════════════════════════════════════

const SUPABASE_URL = 'https://avuemmebwbsnarugsiyc.supabase.co';      // ← replace
const SUPABASE_KEY = 'sb_publishable_rnWIinum-pOzdHbSjnJSvQ_vHBVUbLR'; // ← replace

// Load Supabase if not already loaded
const SB = (() => {
  if (window.supabase) return window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  // Fallback: create minimal stub so app doesn't crash before library loads
  return null;
})();

// Current session
let CURRENT_USER = null;

// ── SYNC STATE ────────────────────────────────────────
let syncState = 'idle';
const SYNC_INFO = {
  idle:    { txt: 'Not signed in', col: '#606090' },
  syncing: { txt: 'Syncing…',      col: '#ff9a35' },
  ok:      { txt: '✓ Synced',      col: '#3df59e' },
  error:   { txt: 'Sync error',    col: '#ff3d55' },
  local:   { txt: 'Local only',    col: '#9090c0' },
};

function setSyncState(s) {
  syncState = s;
  const info = SYNC_INFO[s] || SYNC_INFO.idle;
  document.querySelectorAll('.sync-badge').forEach(el => {
    el.textContent   = info.txt;
    el.style.color   = info.col;
    el.style.borderColor = info.col + '44';
  });
}

// ── AUTH CHECK (called on workout.html load) ──────────
async function checkAuth() {
  if (!SB) { console.warn('Supabase not loaded'); return false; }
  const { data: { session } } = await SB.auth.getSession();
  if (!session) {
    // Not logged in — redirect to landing
    window.location.replace('index.html');
    return false;
  }
  CURRENT_USER = session.user;
  updateUserUI(session.user);
  return true;
}

function updateUserUI(user) {
  if (!user) return;
  const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Athlete';
  const el = document.getElementById('userInfo');
  if (el) el.innerHTML = `<span style="font-size:.72rem;color:var(--m2)">👋 ${name}</span>`;
}

// ── SIGN OUT ──────────────────────────────────────────
async function signOut() {
  if (!SB) return;
  if (!confirm('Sign out?')) return;
  await SB.auth.signOut();
  window.location.replace('index.html');
}

// ── LOAD DATA FROM SUPABASE ───────────────────────────
async function sbLoad() {
  if (!SB || !CURRENT_USER) return null;
  setSyncState('syncing');
  try {
    const { data, error } = await SB
      .from('user_data')
      .select('data')
      .eq('id', CURRENT_USER.id)
      .single();
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
      console.warn('Load error:', error);
      setSyncState('error');
      return null;
    }
    setSyncState('ok');
    return data?.data || null;
  } catch (e) {
    console.warn('Load exception:', e);
    setSyncState('error');
    return null;
  }
}

// ── SAVE DATA TO SUPABASE ─────────────────────────────
let _saveTimer = null;

async function sbSave(appData) {
  // Always write to localStorage immediately
  localStorage.setItem('hx_d_' + (CURRENT_USER?.id || 'anon'), JSON.stringify(appData));

  if (!SB || !CURRENT_USER) { setSyncState('local'); return; }

  // Debounce: 1.5s after last call
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(async () => {
    setSyncState('syncing');
    try {
      const { error } = await SB
        .from('user_data')
        .upsert({
          id:   CURRENT_USER.id,
          data: appData,
          updated_at: new Date().toISOString(),
        });
      setSyncState(error ? 'error' : 'ok');
      if (error) console.warn('Save error:', error);
    } catch (e) {
      console.warn('Save exception:', e);
      setSyncState('error');
    }
  }, 1500);
}

// ── SYNC MANAGER (same interface as old github.js Sync) ─
const Sync = {
  async load() {
    const ok = await checkAuth();
    if (!ok) return null; // redirecting

    setSyncState('syncing');
    // Try Supabase first
    const remote = await sbLoad();
    if (remote) { setSyncState('ok'); return remote; }

    // Fall back to localStorage for this user
    const uid = CURRENT_USER?.id || 'anon';
    try {
      const local = JSON.parse(localStorage.getItem('hx_d_' + uid) || '{}');
      setSyncState(Object.keys(local).length ? 'local' : 'ok');
      return local;
    } catch { return {}; }
  },

  async save(data) {
    await sbSave(data);
  },
};

// ── LEGACY COMPAT (old github.js stubs) ──────────────
function ghConfigured() { return !!CURRENT_USER; }
function saveGHConfig()  {} // no-op: auth is via Supabase
async function syncNow() {
  if (window.D) await sbSave(window.D);
  showToast('✅ Synced!');
}
async function loadFromGH() {
  const data = await sbLoad();
  if (data && window.D) {
    window.D = { ...window.D, ...data };
    localStorage.setItem('hx_d_' + (CURRENT_USER?.id||'anon'), JSON.stringify(window.D));
    renderDash?.();
    showToast('✅ Loaded from cloud!');
  } else {
    showToast('Nothing to load', '#ff9a35');
  }
}

// ── REAL-TIME LISTENER (sync across tabs/devices) ─────
function startRealtimeSync() {
  if (!SB || !CURRENT_USER) return;
  SB.channel('user_data_changes')
    .on('postgres_changes', {
      event:  'UPDATE',
      schema: 'public',
      table:  'user_data',
      filter: `id=eq.${CURRENT_USER.id}`,
    }, (payload) => {
      // Another device saved — merge into local state
      if (payload.new?.data && window.D) {
        const incoming = payload.new.data;
        // Only update if server version is newer (by log count)
        if ((incoming.logs?.length || 0) > (window.D.logs?.length || 0)) {
          window.D = { ...window.D, ...incoming };
          localStorage.setItem('hx_d_' + CURRENT_USER.id, JSON.stringify(window.D));
          renderDash?.();
          showToast('↓ Progress updated from another device');
        }
      }
    })
    .subscribe();
}
