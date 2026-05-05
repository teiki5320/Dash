// Drama Dashboard — logique d'affichage
// Vanilla JS, persistance localStorage, pas de build.

const LS_KEY = 'drama-dash-v1';
const PHOTO_STATUSES = ['todo', 'raw', 'retouched', 'validated', 'produced'];
const STATUS_LABEL = {
  todo: 'À shooter',
  raw: 'Brut',
  retouched: 'Retouchée',
  validated: 'Validée',
  produced: 'Produite'
};
const TYPE_ICONS = { major:'🎯', chitchat:'💬', cinematic:'🌟', empty:'✏' };
const TYPE_LABELS = { major:'Beat majeur', chitchat:'Chitchat', cinematic:'Cinématique', empty:'À écrire' };

function loadState() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
  catch { return {}; }
}
function saveState(s) { localStorage.setItem(LS_KEY, JSON.stringify(s)); }
let state = loadState();
state.photoStatus ??= {};
state.weekNotes ??= {};
state.weekDone ??= {};

function getPhotoStatus(p) { return state.photoStatus[p.id] ?? p.status; }
function setPhotoStatus(id, st) { state.photoStatus[id] = st; saveState(state); }
function getWeekNote(w) { return state.weekNotes[w] || ''; }
function setWeekNote(w, n) {
  if (n) state.weekNotes[w] = n; else delete state.weekNotes[w];
  saveState(state);
}

const tabs = document.querySelectorAll('#mainTabs .tab');
tabs.forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));

function switchTab(name) {
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  render(name);
}

const content = document.getElementById('content');
function render(tab) {
  if (tab === 'overview') return renderOverview();
  if (tab === 'lore') return renderLore();
  if (tab === 'story') return renderStory();
  const m = tab.match(/^s(\d)$/);
  if (m) return renderSeason(+m[1]);
}

function statsForSeason(season) {
  const rows = TIMELINE.filter(r => r.season === season);
  const done = rows.filter(r => r.status === 'done').length;
  return { total: rows.length, done, todo: rows.length - done, pct: Math.round(done/rows.length*100) };
}
function globalStats() {
  const done = TIMELINE.filter(r => r.status === 'done').length;
  const totalScenes = TIMELINE.length;
  const photosTotal = PHOTOS.length;
  const photosProd = PHOTOS.filter(p => {
    const s = getPhotoStatus(p);
    return s === 'produced' || s === 'validated';
  }).length;
  const vnTotal = (typeof VOICE_NOTES !== 'undefined') ? VOICE_NOTES.length : 0;
  const vnDone = 0; // todo : track via localStorage when on/off
  // % réel pondéré : scènes 60% + photos 30% + voice notes 10%
  const pctScenes = totalScenes ? done/totalScenes : 0;
  const pctPhotos = photosTotal ? photosProd/photosTotal : 0;
  const pctVN = vnTotal ? vnDone/vnTotal : 0;
  const pctReal = Math.round((pctScenes*0.6 + pctPhotos*0.3 + pctVN*0.1) * 100);
  const pct = Math.round(done/totalScenes*100); // legacy : scenes only
  return { done, totalScenes, pct, pctReal, photosTotal, photosProd, vnTotal, vnDone };
}

function renderGlobalKPIs() {
  const g = globalStats();
  const el = document.getElementById('globalProgress');
  el.innerHTML = `
    <div class="kpi"><span class="kpi-value">${g.done}/${g.totalScenes}</span><span class="kpi-label">Scènes</span></div>
    <div class="kpi"><span class="kpi-value">${g.photosProd}/${g.photosTotal}</span><span class="kpi-label">Photos</span></div>
    <div class="kpi"><span class="kpi-value">${g.pctReal}%</span><span class="kpi-label">Réel global</span></div>
  `;
}

function renderOverview() {
  const stats = [1,2,3,4].map(s => ({ s, ...statsForSeason(s) }));
  const g = globalStats();

  const lurappel = `
    <div class="lore-card" style="border-left:3px solid var(--danger)">
      <h3>⚠️ Garde-fou : les 3 Lu</h3>
      ${LORE.troisLu.map(l => `
        <div style="margin-bottom:6px"><strong>${l.nom}</strong> <span class="muted">— ${l.role}</span><br>
          <span style="color:var(--text-muted);font-size:12px">${l.etat}. ${l.ingame}</span></div>
      `).join('')}
    </div>`;

  content.innerHTML = `
    <section class="section active">
      <h2 class="section-title">Vue d'ensemble</h2>
      <p class="section-subtitle">Pitch : ${LORE.pitch}</p>

      <div class="cards-grid">
        ${stats.map(st => `
          <div class="card">
            <h3>Saison ${st.s}</h3>
            <div class="big">${st.done}<span class="muted">/${st.total}</span><span class="pct">${st.pct}%</span></div>
            <div class="progress-bar"><span style="width:${st.pct}%"></span></div>
            <p class="muted" style="margin:6px 0 0;font-size:11px">${st.todo} scènes restantes</p>
          </div>
        `).join('')}
      </div>

      <div class="cards-grid">
        <div class="card">
          <h3>Total scènes</h3>
          <div class="big">${g.done}<span class="muted">/${g.totalScenes}</span></div>
          <div class="progress-bar"><span style="width:${g.pct}%"></span></div>
        </div>
        <div class="card">
          <h3>Photos produites</h3>
          <div class="big">${g.photosProd}<span class="muted">/${g.photosTotal}</span></div>
          <div class="progress-bar"><span style="width:${Math.round(g.photosProd/g.photosTotal*100)}%"></span></div>
        </div>
        <div class="card">
          <h3>Endings</h3>
          <div class="big">${LORE.endings.filter(e=>e.ecrit).length}<span class="muted">/4</span></div>
          <div class="progress-bar"><span style="width:100%"></span></div>
        </div>
        <div class="card">
          <h3>Personnages actifs</h3>
          <div class="big">${PERSONNAGES.filter(p=>p.actif).length}</div>
          <p class="muted" style="margin:6px 0 0;font-size:11px">+ ${PERSONNAGES.filter(p=>!p.actif).length} en référence</p>
        </div>
      </div>

      <h2 class="section-title">Batches d'écriture — Saison 1 prioritaire</h2>
      <div class="batches-list">
        ${BATCHES.map(b => {
          const items = b.weeks.map(w => TIMELINE.find(r => r.w === w)).filter(Boolean);
          const done = items.filter(r => r.status === 'done').length;
          const pct = items.length ? Math.round(done/items.length*100) : 0;
          return `
            <div class="batch-row">
              <span class="batch-id">${b.id}</span>
              <span class="batch-theme">${b.theme}<br><span class="muted" style="font-size:11px">W${b.weeks.join(', W')}</span></span>
              <span class="batch-progress">
                ${done}/${items.length}
                <div class="progress-bar"><span style="width:${pct}%"></span></div>
                ${pct}%
              </span>
            </div>`;
        }).join('')}
      </div>

      <h2 class="section-title">Prochains beats majeurs à écrire</h2>
      <table class="timeline-table">
        <thead><tr><th>W</th><th>Type</th><th>Titre</th><th>Contact</th></tr></thead>
        <tbody>
          ${TIMELINE.filter(r => r.status === 'todo' && r.type === 'major').slice(0, 8).map(r => `
            <tr><td class="col-w">W${r.w}</td><td class="col-type"><span class="type-icon type-${r.type}">${TYPE_ICONS[r.type]}</span></td><td>${r.title}</td><td>${contactName(r.contact)}</td></tr>
          `).join('') || '<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">Aucun beat majeur restant — tous écrits ✨</td></tr>'}
        </tbody>
      </table>

      <div style="margin-top:24px">
        ${lurappel}
      </div>
    </section>
  `;
}

let seasonSubtab = { 1:'timeline', 2:'timeline', 3:'timeline', 4:'timeline' };

function renderSeason(s) {
  const meta = LORE.saisons.find(x => x.id === s);
  const st = statsForSeason(s);
  const sub = seasonSubtab[s];

  content.innerHTML = `
    <section class="section active">
      <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:12px;margin-bottom:8px">
        <div>
          <h2 class="section-title">${meta.label}</h2>
          <p class="section-subtitle">${meta.range} · ${meta.model} · ${st.done}/${st.total} scènes écrites (${st.pct}%)</p>
        </div>
        <div class="progress-bar" style="min-width:200px;flex:0 0 200px"><span style="width:${st.pct}%"></span></div>
      </div>

      <div class="subtabs" id="seasonSubtabs">
        <button class="subtab ${sub==='timeline'?'active':''}" data-sub="timeline">Timeline (52 sem.)</button>
        <button class="subtab ${sub==='persos'?'active':''}" data-sub="persos">Personnages</button>
        <button class="subtab ${sub==='photos'?'active':''}" data-sub="photos">Photos</button>
      </div>

      <div id="subContent"></div>
    </section>
  `;

  document.querySelectorAll('#seasonSubtabs .subtab').forEach(b => {
    b.addEventListener('click', () => {
      seasonSubtab[s] = b.dataset.sub;
      renderSeason(s);
    });
  });

  if (sub === 'timeline') renderTimeline(s);
  else if (sub === 'persos') renderPersos(s);
  else if (sub === 'photos') renderPhotos(s);
}

let timelineFilters = { type:'all', contact:'all', status:'all', search:'' };

function renderTimeline(s) {
  const rows = TIMELINE.filter(r => r.season === s);
  const contacts = [...new Set(rows.map(r => r.contact))].sort();

  const filterBar = document.createElement('div');
  filterBar.className = 'filters';
  filterBar.innerHTML = `
    <label>Type
      <select data-f="type">
        <option value="all">Tous</option>
        <option value="major">🎯 Majeur</option>
        <option value="chitchat">💬 Chitchat</option>
        <option value="cinematic">🌟 Cinématique</option>
        <option value="empty">✏ À écrire (slot vide)</option>
      </select>
    </label>
    <label>Contact
      <select data-f="contact">
        <option value="all">Tous</option>
        ${contacts.map(c => `<option value="${c}">${contactName(c)}</option>`).join('')}
      </select>
    </label>
    <label>État
      <select data-f="status">
        <option value="all">Tous</option>
        <option value="done">✅ Écrite</option>
        <option value="todo">✏ À faire</option>
      </select>
    </label>
    <label>Recherche
      <input type="search" data-f="search" placeholder="titre, sceneId…">
    </label>
    <span class="chip-counts" id="chipCounts"></span>
  `;

  const sub = document.getElementById('subContent');
  sub.innerHTML = '';
  sub.appendChild(filterBar);

  const wrap = document.createElement('div');
  sub.appendChild(wrap);

  filterBar.querySelectorAll('[data-f]').forEach(el => {
    el.value = timelineFilters[el.dataset.f];
    el.addEventListener('input', e => {
      timelineFilters[el.dataset.f] = e.target.value;
      drawTable();
    });
  });

  function drawTable() {
    const f = timelineFilters;
    let list = rows;
    if (f.type !== 'all') list = list.filter(r => r.type === f.type);
    if (f.contact !== 'all') list = list.filter(r => r.contact === f.contact);
    if (f.status !== 'all') list = list.filter(r => r.status === f.status);
    if (f.search.trim()) {
      const q = f.search.trim().toLowerCase();
      list = list.filter(r => r.title.toLowerCase().includes(q) || (r.sceneId||'').toLowerCase().includes(q));
    }

    document.getElementById('chipCounts').innerHTML = `
      <span class="chip">${list.filter(r=>r.status==='done').length} écrites</span>
      <span class="chip">${list.filter(r=>r.status==='todo').length} à faire</span>
      <span class="chip">${list.filter(r=>r.type==='major').length} majeurs</span>
    `;

    wrap.innerHTML = `
      <table class="timeline-table">
        <thead><tr>
          <th class="col-w">W</th>
          <th class="col-type"></th>
          <th>Titre</th>
          <th>Contact</th>
          <th class="col-batch">Batch</th>
          <th class="col-status">État</th>
        </tr></thead>
        <tbody>
          ${list.map(r => `
            <tr class="row-${r.type} row-${r.status}" data-w="${r.w}">
              <td class="col-w">W${r.w}</td>
              <td class="col-type"><span class="type-icon type-${r.type}" title="${TYPE_LABELS[r.type]}">${TYPE_ICONS[r.type]}</span></td>
              <td>${escapeHtml(r.title)}${r.sceneId ? `<span class="scene-id-tag">${r.sceneId}</span>` : ''}${r.note ? `<span class="muted" style="font-size:11px"> — ${r.note}</span>` : ''}</td>
              <td>${contactName(r.contact)}</td>
              <td class="col-batch">${r.batch || ''}</td>
              <td class="col-status">${r.status === 'done' ? '<span class="badge badge-done">✅</span>' : '<span class="badge badge-todo">✏</span>'}</td>
            </tr>
          `).join('') || '<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--text-muted)">Aucun résultat avec ces filtres.</td></tr>'}
        </tbody>
      </table>
    `;

    wrap.querySelectorAll('tbody tr').forEach(tr => {
      tr.addEventListener('click', () => openSceneModal(+tr.dataset.w));
    });
  }
  drawTable();
}

function renderPersos(s) {
  const list = PERSONNAGES.filter(p => p.saisons.includes(s));
  const refs = PERSONNAGES.filter(p => !p.actif);
  const sub = document.getElementById('subContent');
  sub.innerHTML = `
    <p class="muted" style="margin-bottom:14px">${list.length} personnages actifs en saison ${s}.</p>
    <div class="persona-grid">
      ${list.map(p => personaCard(p, s)).join('')}
    </div>
    <h3 style="margin:24px 0 12px;color:var(--text-muted);font-size:14px;text-transform:uppercase;letter-spacing:0.6px">Références lore (hors-écran)</h3>
    <div class="persona-grid">
      ${refs.map(p => personaCard(p, s)).join('')}
    </div>
  `;
}

function personaCard(p, currentSeason) {
  const apparitions = TIMELINE.filter(r => r.contact === p.id);
  const apparitionsSeason = apparitions.filter(r => r.season === currentSeason).length;
  return `
    <div class="persona-card faction-${p.faction}">
      <h3>${p.nom} <span class="seasons-dots">${[1,2,3,4].map(s => `<span class="${p.saisons.includes(s)?'on':''}">S${s}</span>`).join('')}</span></h3>
      <div class="role">${p.role}</div>
      <div class="desc">${p.desc}</div>
      <div class="meta">
        ${p.firstW ? `<span>1ère: W${p.firstW}</span>` : '<span>—</span>'}
        <span>${apparitionsSeason} scène${apparitionsSeason!==1?'s':''} en S${currentSeason}</span>
        <span>${apparitions.length} total</span>
      </div>
    </div>
  `;
}

let photoFilters = { kind:'all', status:'all', character:'all' };

function renderPhotos(s) {
  const all = PHOTOS.filter(p => p.season === s);
  const characters = [...new Set(all.flatMap(p => p.characters))].sort();
  const sub = document.getElementById('subContent');

  const counts = {
    todo: all.filter(p => getPhotoStatus(p) === 'todo').length,
    produced: all.filter(p => ['produced','validated','retouched','raw'].includes(getPhotoStatus(p))).length,
    total: all.length
  };

  sub.innerHTML = `
    <div class="filters">
      <label>Type
        <select data-pf="kind">
          <option value="all">Tous</option>
          <option value="chat">Chat (conversation)</option>
          <option value="post">Post Instagram</option>
          <option value="map">Carte</option>
          <option value="wallpaper">Wallpaper</option>
          <option value="avatar">Avatar contact</option>
          <option value="cinematic">Cinematic</option>
        </select>
      </label>
      <label>Statut
        <select data-pf="status">
          <option value="all">Tous</option>
          <option value="produced">Produites / validées</option>
          <option value="todo">À shooter</option>
        </select>
      </label>
      <label>Personnage
        <select data-pf="character">
          <option value="all">Tous</option>
          ${characters.map(c => `<option value="${c}">${contactName(c)}</option>`).join('')}
        </select>
      </label>
      <span class="chip-counts">
        <span class="chip">${counts.produced}/${counts.total} OK</span>
        <span class="chip">${counts.todo} à faire</span>
      </span>
    </div>
    <div id="photosWrap"></div>
  `;

  sub.querySelectorAll('[data-pf]').forEach(el => {
    el.value = photoFilters[el.dataset.pf];
    el.addEventListener('input', e => {
      photoFilters[el.dataset.pf] = e.target.value;
      drawPhotos();
    });
  });

  function drawPhotos() {
    const f = photoFilters;
    let list = all;
    if (f.kind !== 'all') list = list.filter(p => p.kind === f.kind);
    if (f.character !== 'all') list = list.filter(p => p.characters.includes(f.character));
    if (f.status === 'produced') list = list.filter(p => getPhotoStatus(p) !== 'todo');
    else if (f.status === 'todo') list = list.filter(p => getPhotoStatus(p) === 'todo');

    document.getElementById('photosWrap').innerHTML = `
      <div class="photos-grid">
        ${list.map(p => photoCard(p)).join('') || '<p class="muted">Aucune photo avec ces filtres.</p>'}
      </div>
    `;

    document.querySelectorAll('select.status-select').forEach(sel => {
      sel.addEventListener('change', e => {
        setPhotoStatus(sel.dataset.id, e.target.value);
        renderGlobalKPIs();
        drawPhotos();
      });
    });
  }
  drawPhotos();
}

function photoCard(p) {
  const status = getPhotoStatus(p);
  const url = p.file ? RAW_BASE + p.file : null;
  const weeks = p.weeks.length ? `W${p.weeks.join(', W')}` : 'UI';
  const chars = p.characters.map(c => contactName(c)).join(' · ') || '—';
  return `
    <div class="photo-card">
      <div class="photo-thumb">
        <span class="kind-tag">${p.kind}</span>
        ${url ? `<img src="${url}" alt="${escapeHtml(p.desc)}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'placeholder',textContent:'🖼'}))">` : '<span class="placeholder">📸</span>'}
      </div>
      <div class="photo-body">
        <div class="photo-desc">${escapeHtml(p.desc)}</div>
        <div class="photo-meta">
          <span>${weeks}</span>
          <span class="badge badge-${badgeClassForStatus(status)}">${STATUS_LABEL[status]}</span>
        </div>
        <div class="photo-meta">
          <span style="font-size:10px;font-family:var(--font-mono)">${p.file || '— pas de fichier —'}</span>
        </div>
        <div class="photo-meta">
          <span style="font-size:11px">${chars}</span>
          <select class="status-select" data-id="${p.id}">
            ${PHOTO_STATUSES.map(st => `<option value="${st}" ${status===st?'selected':''}>${STATUS_LABEL[st]}</option>`).join('')}
          </select>
        </div>
      </div>
    </div>
  `;
}

function badgeClassForStatus(st) {
  if (st === 'todo') return 'shoot';
  if (st === 'raw') return 'raw';
  if (st === 'retouched') return 'retouched';
  if (st === 'validated') return 'validated';
  return 'produced';
}

function renderStory() {
  content.innerHTML = `
    <section class="section active">
      <h2 class="section-title">L'histoire racontée</h2>
      <p class="section-subtitle">Récit complet en 4 actes. Garde-fou de cohérence narrative — synchronisé avec ROADMAP.md §7.</p>

      <div class="lore-card" style="margin-bottom:24px">
        <p style="margin:0">${escapeHtml(STORY.intro)}</p>
      </div>

      ${STORY.actes.map(a => `
        <article class="story-acte">
          <h3 class="story-acte-title">${escapeHtml(a.titre)}</h3>
          <p class="story-acte-range">${escapeHtml(a.range)}</p>
          ${a.paragraphes.map(p => `<p class="story-paragraph">${escapeHtml(p)}</p>`).join('')}
        </article>
      `).join('')}

      <h3 class="section-title" style="margin-top:32px">Les 4 fins possibles</h3>
      <div class="endings-grid">
        ${STORY.endings.map(e => `
          <div class="ending-card" style="text-align:left">
            <div class="em" style="text-align:center">${e.emoji}</div>
            <h4 style="text-align:center">${e.label}</h4>
            <p class="desc" style="text-align:left">${escapeHtml(e.desc)}</p>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderLore() {
  content.innerHTML = `
    <section class="section active">
      <h2 class="section-title">Lore figé</h2>
      <p class="section-subtitle">Source : ROADMAP.md §1 — NE PAS modifier sans mettre à jour le ROADMAP.</p>

      <div class="lore-grid">
        ${LORE.troisLu.map(l => `
          <div class="lore-card">
            <h3>${l.nom}</h3>
            <div class="role">${l.role}</div>
            <p style="margin:6px 0"><strong>État :</strong> ${l.etat}</p>
            <p style="margin:6px 0"><strong>En jeu :</strong> ${l.ingame}</p>
            <div class="warn">⚠️ ${l.warn}</div>
          </div>
        `).join('')}
      </div>

      <h2 class="section-title">Timeline historique (faits figés)</h2>
      <div class="timeline-history">
        <ul style="margin:0;padding-left:20px">
          ${LORE.faitsFiges.map(f => `<li><strong>${f.annee}</strong> — ${f.fait}</li>`).join('')}
        </ul>
      </div>

      <h2 class="section-title" style="margin-top:28px">Les 4 Endings</h2>
      <div class="endings-grid">
        ${LORE.endings.map(e => `
          <div class="ending-card">
            <div class="em">${e.emoji}</div>
            <h4>${e.label}</h4>
            <div class="desc">${e.desc}</div>
            <span class="badge ${e.ecrit?'badge-done':'badge-todo'}" style="margin-top:8px;display:inline-block">${e.ecrit?'✅ écrit':'✏ à écrire'}</span>
          </div>
        `).join('')}
      </div>

      <h2 class="section-title" style="margin-top:28px">Format pivot JSON (échange dash ↔ drama)</h2>
      <p class="section-subtitle">Cliquer une scène dans une timeline pour ouvrir sa fiche et copier son JSON pivot.</p>
    </section>
  `;
}

const modalBackdrop = document.getElementById('modalBackdrop');
const modalBody = document.getElementById('modalBody');
document.getElementById('modalClose').addEventListener('click', () => modalBackdrop.hidden = true);
modalBackdrop.addEventListener('click', e => { if (e.target === modalBackdrop) modalBackdrop.hidden = true; });

function openSceneModal(w) {
  const r = TIMELINE.find(x => x.w === w);
  if (!r) return;
  const linkedPhotos = PHOTOS.filter(p => p.weeks.includes(w));
  const note = getWeekNote(w);

  const pivot = {
    id: r.sceneId || `scene_w${r.w}`,
    week: r.w,
    type: r.type === 'major' ? 'messages' : (r.type === 'chitchat' ? 'chitchat' : (r.type === 'cinematic' ? 'cinematic' : 'messages')),
    contactId: r.contact,
    season: r.season,
    isMajorBeat: r.type === 'major' || r.type === 'cinematic',
    title: r.title,
    status: r.status,
    lines: [],
    choices: [],
    flashChoc: false
  };

  modalBody.innerHTML = `
    <h2>${TYPE_ICONS[r.type]} W${r.w} — ${escapeHtml(r.title)}</h2>
    <p class="modal-sub">Saison ${r.season} · ${TYPE_LABELS[r.type]} · contact: ${contactName(r.contact)} · ${r.status === 'done' ? 'écrite' : 'à écrire'}${r.batch ? ' · batch '+r.batch : ''}</p>

    ${r.sceneId ? `<p><strong>sceneId :</strong> <code>${r.sceneId}</code></p>` : ''}
    ${r.note ? `<p class="muted"><strong>Note ROADMAP :</strong> ${r.note}</p>` : ''}

    <h3 style="margin:18px 0 6px;font-size:14px">📷 Photos liées (${linkedPhotos.length})</h3>
    ${linkedPhotos.length ? `<ul style="margin:0 0 12px;padding-left:18px;font-size:12px">${linkedPhotos.map(p => `<li>${p.id} <span class="muted">— ${STATUS_LABEL[getPhotoStatus(p)]}</span></li>`).join('')}</ul>` : '<p class="muted" style="font-size:12px">Aucune photo associée à cette semaine.</p>'}

    <h3 style="margin:18px 0 6px;font-size:14px">📝 Note libre (sauvée localement)</h3>
    <textarea class="note-area" id="noteArea" placeholder="Idées, dialogue, références…">${escapeHtml(note)}</textarea>

    <h3 style="margin:18px 0 6px;font-size:14px">📤 Export JSON pivot</h3>
    <pre id="pivotJson">${escapeHtml(JSON.stringify(pivot, null, 2))}</pre>
    <button class="link-btn" id="copyPivot">📋 Copier le JSON</button>
  `;

  modalBackdrop.hidden = false;

  document.getElementById('noteArea').addEventListener('input', e => setWeekNote(w, e.target.value));
  document.getElementById('copyPivot').addEventListener('click', () => {
    navigator.clipboard.writeText(JSON.stringify(pivot, null, 2));
    document.getElementById('copyPivot').textContent = '✅ Copié !';
    setTimeout(() => document.getElementById('copyPivot').textContent = '📋 Copier le JSON', 1500);
  });
}

function contactName(id) {
  if (!id) return '—';
  const p = PERSONNAGES.find(x => x.id === id);
  return p ? p.nom : id;
}
function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

document.getElementById('resetLocal').addEventListener('click', () => {
  if (confirm('Effacer tous les statuts photos et notes locaux ?')) {
    localStorage.removeItem(LS_KEY);
    state = { photoStatus:{}, weekNotes:{}, weekDone:{} };
    renderGlobalKPIs();
    render('overview');
    document.querySelector('.tab[data-tab="overview"]').click();
  }
});
document.getElementById('exportAll').addEventListener('click', () => {
  const blob = {
    timeline: TIMELINE,
    photos: PHOTOS.map(p => ({ ...p, currentStatus: getPhotoStatus(p) })),
    personnages: PERSONNAGES,
    notes: state.weekNotes,
    lore: LORE,
    story: typeof STORY !== 'undefined' ? STORY : null,
    voiceNotes: typeof VOICE_NOTES !== 'undefined' ? VOICE_NOTES : null
  };
  const json = JSON.stringify(blob, null, 2);
  const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url; a.download = 'drama-dashboard-export.json';
  a.click();
  URL.revokeObjectURL(url);
});

// Theme toggle (glass = clair par défaut, dark = sombre dramatique)
function applyTheme(t) {
  if (t === 'dark') document.body.removeAttribute('data-theme');
  else document.body.dataset.theme = 'glass';
  localStorage.setItem('drama-dash-theme', t);
}
applyTheme(localStorage.getItem('drama-dash-theme') || 'glass');
document.getElementById('themeToggle').addEventListener('click', () => {
  applyTheme(document.body.dataset.theme === 'glass' ? 'dark' : 'glass');
});

renderGlobalKPIs();
render('overview');
