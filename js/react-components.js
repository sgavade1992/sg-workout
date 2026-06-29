// ═══════════════════════════════════════════════════════
// SG Workout — React Components
// Uses React 18 for reactive, auto-updating UI elements
// ═══════════════════════════════════════════════════════

const { useState, useEffect, useCallback } = React;

// ── GLOBAL REACTIVE STATE ─────────────────────────────
// A tiny pub-sub so vanilla JS can trigger React re-renders
const AppState = {
  _listeners: new Set(),
  _state: { activeNav: 'dash', activeProgram: 'hyrox', syncState: 'idle' },

  get(key) { return this._state[key]; },

  set(key, value) {
    this._state[key] = value;
    this._listeners.forEach(fn => fn({ ...this._state }));
  },

  subscribe(fn) {
    this._listeners.add(fn);
    return () => this._listeners.delete(fn);
  },
};

// Hook to subscribe to AppState
function useAppState() {
  const [state, setState] = useState({ ...AppState._state });
  useEffect(() => {
    const unsub = AppState.subscribe(setState);
    return unsub;
  }, []);
  return state;
}

// ── NAV ITEMS CONFIG ──────────────────────────────────
const NAV_ITEMS = [
  {
    id: 'dash', label: 'Dashboard',
    icon: (
      React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        React.createElement('rect', { x: 3, y: 3, width: 7, height: 7 }),
        React.createElement('rect', { x: 14, y: 3, width: 7, height: 7 }),
        React.createElement('rect', { x: 3, y: 14, width: 7, height: 7 }),
        React.createElement('rect', { x: 14, y: 14, width: 7, height: 7 })
      )
    )
  },
  {
    id: 'calendar', label: 'Calendar',
    icon: (
      React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        React.createElement('rect', { x: 3, y: 4, width: 18, height: 18, rx: 2 }),
        React.createElement('line', { x1: 16, y1: 2, x2: 16, y2: 6 }),
        React.createElement('line', { x1: 8, y1: 2, x2: 8, y2: 6 }),
        React.createElement('line', { x1: 3, y1: 10, x2: 21, y2: 10 })
      )
    )
  },
  {
    id: 'week', label: 'This Week',
    icon: (
      React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        React.createElement('path', { d: 'M12 2L2 7l10 5 10-5-10-5z' }),
        React.createElement('path', { d: 'M2 17l10 5 10-5' }),
        React.createElement('path', { d: 'M2 12l10 5 10-5' })
      )
    )
  },
  { id: '__log__', label: 'Log', isCenter: true },
  {
    id: 'program', label: 'Program',
    icon: (
      React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        React.createElement('path', { d: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z' }),
        React.createElement('polyline', { points: '14 2 14 8 20 8' }),
        React.createElement('line', { x1: 16, y1: 13, x2: 8, y2: 13 }),
        React.createElement('line', { x1: 16, y1: 17, x2: 8, y2: 17 })
      )
    )
  },
  {
    id: 'settings', label: 'Settings',
    icon: (
      React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        React.createElement('circle', { cx: 12, cy: 12, r: 3 }),
        React.createElement('path', { d: 'M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z' })
      )
    )
  },
];

// ── FLOATING TASKBAR COMPONENT ────────────────────────
function FloatingTaskbar() {
  const { activeNav } = useAppState();

  const handleNav = useCallback((id) => {
    // Call the global nav() from app.js
    if (window.nav) window.nav(id);
    AppState.set('activeNav', id);
  }, []);

  const handleLog = useCallback(() => {
    if (window.openModal) window.openModal();
  }, []);

  return React.createElement('div', { className: 'float-bar', id: 'floatBar' },
    NAV_ITEMS.map(item => {
      if (item.isCenter) {
        return React.createElement('button', {
          key: item.id,
          className: 'fbar-log-btn',
          onClick: handleLog,
          title: 'Log Session',
          'aria-label': 'Log a training session',
        },
          React.createElement('svg', {
            viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
            strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round',
            width: 22, height: 22,
          },
            React.createElement('line', { x1: 12, y1: 5, x2: 12, y2: 19 }),
            React.createElement('line', { x1: 5, y1: 12, x2: 19, y2: 12 })
          )
        );
      }

      const isActive = activeNav === item.id;
      return React.createElement('button', {
        key: item.id,
        className: `fbar-btn${isActive ? ' active' : ''}`,
        onClick: () => handleNav(item.id),
        'data-nav': item.id,
        'aria-label': item.label,
        'aria-current': isActive ? 'page' : undefined,
      },
        React.createElement('span', { className: 'fbar-icon' }, item.icon),
        React.createElement('span', null, item.label)
      );
    })
  );
}

// ── SYNC INDICATOR COMPONENT ──────────────────────────
function SyncDot() {
  const { syncState } = useAppState();
  const colors = {
    idle: '#606090', syncing: '#ff9a35',
    ok: '#3df59e', error: '#ff3d55', local: '#9090c0',
  };
  const col = colors[syncState] || colors.idle;
  const titles = {
    idle: 'Not configured', syncing: 'Syncing…',
    ok: 'Synced ✓', error: 'Sync error', local: 'Local only',
  };

  return React.createElement('span', {
    className: 'sync-dot',
    style: {
      background: col,
      boxShadow: syncState === 'ok' ? `0 0 6px ${col}88` : 'none',
    },
    title: titles[syncState] || '—',
    onClick: () => window.nav?.('settings'),
  });
}

// ── MOUNT COMPONENTS ──────────────────────────────────
function mountReactComponents() {
  // Floating taskbar
  const taskbarRoot = document.getElementById('react-taskbar');
  if (taskbarRoot) {
    ReactDOM.createRoot(taskbarRoot).render(
      React.createElement(React.StrictMode, null,
        React.createElement(FloatingTaskbar)
      )
    );
  }

  // Sync dot (replace static element)
  const syncDotEl = document.getElementById('syncDot');
  if (syncDotEl) {
    ReactDOM.createRoot(syncDotEl).render(
      React.createElement(SyncDot)
    );
  }
}

// ── BRIDGE: vanilla JS → React state ─────────────────
// Override setSyncState so Supabase backend updates React
const _origSetSyncState = window.setSyncState;
window.setSyncState = function(s) {
  AppState.set('syncState', s);
  // Also update the old sync-badge spans (settings page)
  const info = { idle:{txt:'—',col:'#606090'}, syncing:{txt:'Syncing…',col:'#ff9a35'}, ok:{txt:'✓ Synced',col:'#3df59e'}, error:{txt:'Sync error',col:'#ff3d55'}, local:{txt:'Local only',col:'#9090c0'} };
  const d = info[s] || info.idle;
  document.querySelectorAll('.sync-badge').forEach(el => {
    el.textContent = d.txt; el.style.color = d.col;
  });
};

// Override nav() to also update React state
const _origNav = window.nav;
window.nav = function(id, btn) {
  _origNav?.(id, btn);
  AppState.set('activeNav', id);
};

// Override setActiveProgram to update React + trigger label
const _origSetActiveProgram = window.setActiveProgram;
window.setActiveProgram = async function(id) {
  await _origSetActiveProgram?.(id);
  AppState.set('activeProgram', id);
};

// ── BOOT ──────────────────────────────────────────────
// Mount after DOM is ready and app.js has loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountReactComponents);
} else {
  mountReactComponents();
}
