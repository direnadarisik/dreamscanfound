// DOM overlays: modal panels and the mission-control setup screen.
import { SPACECRAFT, VEHICLES, DIFFICULTY, EQUIPMENT, CONSUMABLES_MASS } from './data.js';

const root = document.getElementById('ui-root');
let modalEl = null, onCloseCb = null, closable = true;

export function openModal(html, opts = {}) {
  closeModal(true);
  closable = opts.closable !== false;
  modalEl = document.createElement('div');
  modalEl.className = 'modal-back';
  modalEl.innerHTML = `<div class="modal ${opts.wide ? 'wide' : ''}">${closable ? '<button class="x" data-close>✕</button>' : ''}${html}</div>`;
  root.appendChild(modalEl);
  modalEl.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeModal(); });
  onCloseCb = opts.onClose || null;
  return modalEl;
}
export function closeModal(silent) {
  if (!modalEl) return;
  modalEl.remove();
  modalEl = null;
  const cb = onCloseCb;
  onCloseCb = null;
  if (!silent && cb) cb();
}
export const isModalOpen = () => !!modalEl;
export const modalClosable = () => closable;
export function modalElement() { return modalEl; }

// ---------------- Mission setup ----------------
export function computeSetup(sel) {
  const craft = SPACECRAFT.find(c => c.id === sel.craft);
  const veh = VEHICLES.find(v => v.id === sel.vehicle);
  const diff = DIFFICULTY[sel.diff];
  const eq = EQUIPMENT.filter(e => sel.equip.includes(e.id));
  const eqMass = eq.reduce((a, e) => a + e.mass, 0);
  const cost = craft.cost + veh.cost + eq.reduce((a, e) => a + e.cost, 0);
  const powerNeed = eq.filter(e => e.power > 0).reduce((a, e) => a + e.power, 0);
  const powerAvail = craft.power + eq.filter(e => e.power < 0).reduce((a, e) => a - e.power, 0);
  const cargo = eqMass + CONSUMABLES_MASS;
  const mass = craft.mass + cargo;
  const errors = [];
  if (cost > diff.budget) errors.push(`Over budget by $${cost - diff.budget}M`);
  if (mass > veh.payload) errors.push(`Total mass ${mass.toFixed(1)} t exceeds launch payload ${veh.payload} t`);
  if (cargo > craft.cargo) errors.push(`Cargo ${cargo.toFixed(1)} t exceeds spacecraft hold ${craft.cargo} t`);
  if (powerNeed > powerAvail) errors.push(`Equipment needs ${powerNeed} kW but only ${powerAvail} kW is available`);
  return { craft, veh, diff, eq, eqMass, cost, powerNeed, powerAvail, cargo, mass, errors };
}

export function showSetup(onLaunch) {
  const sel = { craft: 'standard', vehicle: 'medium', diff: 'normal', equip: EQUIPMENT.filter(e => e.def).map(e => e.id) };
  const el = document.createElement('div');
  el.className = 'setup';
  root.appendChild(el);
  const meter = (label, v, max, unit, bad) => `<div class="meter ${bad ? 'bad' : ''}"><span>${label}</span><b>${v}${unit} / ${max}${unit}</b><i style="width:${Math.min(100, v / max * 100)}%"></i></div>`;
  function render() {
    const s = computeSetup(sel);
    el.innerHTML = `
      <div class="setup-head"><h1>MISSION CONTROL · DREAMSCANFOUND</h1><p>Configure your spacecraft and launch for a 15-sol surface mission at Jezero Crater.</p></div>
      <div class="setup-grid">
        <section><h2>A · SPACECRAFT</h2>${SPACECRAFT.map(c => `<button class="opt ${sel.craft === c.id ? 'on' : ''}" data-craft="${c.id}"><b>${c.name}</b><small>${c.mass} t · hold ${c.cargo} t · ${c.power} kW · $${c.cost}M</small><em>${c.desc}</em></button>`).join('')}
          <h2>B · DIFFICULTY</h2>${Object.entries(DIFFICULTY).map(([k, d]) => `<button class="opt ${sel.diff === k ? 'on' : ''}" data-diff="${k}"><b>${d.name}</b><small>Budget $${d.budget}M · ascent fuel ${d.ascent}</small><em>${d.desc}</em></button>`).join('')}
          <h2>D · LAUNCH VEHICLE</h2>${VEHICLES.map(v => `<button class="opt ${sel.vehicle === v.id ? 'on' : ''}" data-veh="${v.id}"><b>${v.name}</b><small>payload ${v.payload} t · $${v.cost}M</small><em>${v.desc}</em></button>`).join('')}
        </section>
        <section><h2>C · MISSION EQUIPMENT</h2>${EQUIPMENT.map(e => `<button class="opt eq ${sel.equip.includes(e.id) ? 'on' : ''}" data-eq="${e.id}"><b>${sel.equip.includes(e.id) ? '☑' : '☐'} ${e.name}</b><small>${e.mass} t · $${e.cost}M · ${e.power < 0 ? '+' + (-e.power) + ' kW supply' : e.power + ' kW'}</small><em>${e.purpose}</em></button>`).join('')}
          <p class="note">Equipment left on Earth can be built on Mars from building materials (if it has an install option).</p>
        </section>
        <section class="summary"><h2>E/F · BUDGET, POWER & MASS</h2>
          ${meter('BUDGET', s.cost, s.diff.budget, ' $M', s.cost > s.diff.budget)}
          ${meter('TOTAL MASS', +s.mass.toFixed(1), s.veh.payload, ' t', s.mass > s.veh.payload)}
          ${meter('CARGO HOLD', +s.cargo.toFixed(1), s.craft.cargo, ' t', s.cargo > s.craft.cargo)}
          ${meter('POWER', s.powerNeed, s.powerAvail, ' kW', s.powerNeed > s.powerAvail)}
          <h3>MISSION SUMMARY</h3>
          <ul><li>Spacecraft: ${s.craft.name}</li><li>Launch vehicle: ${s.veh.name}</li><li>Difficulty: ${s.diff.name}</li>
          <li>Remaining budget: <b>$${s.diff.budget - s.cost}M</b></li><li>Crew supplies: ${CONSUMABLES_MASS} t</li>
          <li>Equipment: ${s.eq.map(e => e.name).join(', ') || 'none'}</li></ul>
          ${s.errors.length ? `<div class="errors">${s.errors.map(e => `⚠ ${e}`).join('<br>')}</div>` : '<div class="ok">✔ All launch constraints satisfied</div>'}
          <button class="launch" data-launch ${s.errors.length ? 'disabled' : ''}>🚀 LAUNCH MISSION</button>
        </section>
      </div>`;
  }
  el.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.craft) sel.craft = b.dataset.craft;
    if (b.dataset.diff) sel.diff = b.dataset.diff;
    if (b.dataset.veh) sel.vehicle = b.dataset.veh;
    if (b.dataset.eq) {
      const id = b.dataset.eq;
      sel.equip = sel.equip.includes(id) ? sel.equip.filter(x => x !== id) : [...sel.equip, id];
    }
    if (b.hasAttribute('data-launch')) {
      if (computeSetup(sel).errors.length) return;
      el.remove();
      onLaunch({ ...sel, equip: [...sel.equip] });
      return;
    }
    render();
  });
  render();
}
