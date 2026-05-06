// Drama dashboard — patch onglet Histoire pour rendre subarcs + voice notes
// Surcharge renderStory pour ajouter les sections « Sous-arcs récurrents »
// et « Voice notes » sous les 4 actes, avant la grille des endings.
(function(){
  if (typeof STORY === 'undefined' || typeof renderStory !== 'function') return;

  const _origRenderStory = renderStory;

  // helper local de sécurité
  function safeEscape(s){
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }

  // On ré-écrit renderStory pour insérer le bloc subarcs avant les endings.
  window.renderStory = function(){
    _origRenderStory();

    // Si subarcs absents (vieille version de story.js), on s'arrête là.
    if (!Array.isArray(STORY.subarcs) || STORY.subarcs.length === 0) return;

    // On retrouve la section pour insérer notre bloc avant le titre « Les 4 fins possibles ».
    const section = document.querySelector('main#content section.section');
    if (!section) return;

    // Crée le bloc Subarcs.
    const subarcsBlock = document.createElement('div');
    subarcsBlock.className = 'subarcs-block';
    subarcsBlock.style.marginTop = '32px';
    subarcsBlock.innerHTML = `
      <h3 class="section-title">Texture narrative — sous-arcs récurrents</h3>
      <p class="section-subtitle" style="margin-top:-4px">
        12 fils thématiques qui s'entrelacent sur 208 semaines (cf drama/NARRATIVE_DENSITY.md).
        Chaque fil émerge par juxtaposition de scènes autonomes, jamais par cliffhanger conversationnel.
      </p>
      <div class="subarcs-grid">
        ${STORY.subarcs.map(a => `
          <div class="subarc-card">
            <div class="subarc-id">${safeEscape(a.id)}</div>
            <div class="subarc-label">${safeEscape(a.label)}</div>
            <div class="subarc-desc">${safeEscape(a.desc)}</div>
          </div>
        `).join('')}
      </div>
    `;

    // Bloc Voice notes (note synthétique).
    const vnBlock = document.createElement('div');
    vnBlock.className = 'vn-note-block';
    vnBlock.style.marginTop = '24px';
    if (STORY.voicenotes_note){
      vnBlock.innerHTML = `
        <div class="lore-card" style="background:rgba(255,255,255,0.04)">
          <strong>🎙 Voice notes :</strong>
          <span style="opacity:0.85">${safeEscape(STORY.voicenotes_note)}</span>
        </div>
      `;
    }

    // On insère avant le titre « Les 4 fins possibles » (h3 dans la section).
    const endingsTitle = section.querySelector('h3.section-title');
    if (endingsTitle){
      section.insertBefore(subarcsBlock, endingsTitle);
      section.insertBefore(vnBlock, endingsTitle);
    } else {
      section.appendChild(subarcsBlock);
      section.appendChild(vnBlock);
    }
  };

  // Inject minimal CSS for the new blocks (compatible glass/dark theme).
  const css = `
  .subarcs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 12px;
    margin-top: 14px;
  }
  .subarc-card {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 12px 14px;
    backdrop-filter: blur(8px);
  }
  .subarc-id {
    display: inline-block;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 11px;
    font-weight: 700;
    background: rgba(255,200,80,0.15);
    color: rgba(255,200,80,0.95);
    padding: 2px 6px;
    border-radius: 4px;
    margin-bottom: 6px;
  }
  .subarc-label {
    font-weight: 700;
    font-size: 13px;
    margin-bottom: 4px;
  }
  .subarc-desc {
    font-size: 12px;
    opacity: 0.78;
    line-height: 1.4;
  }
  body.theme-glass .subarc-card { background: rgba(0,0,0,0.04); border-color: rgba(0,0,0,0.08); }
  body.theme-glass .subarc-desc { opacity: 0.7; }
  `;
  const styleTag = document.createElement('style');
  styleTag.id = 'subarcs-patch-css';
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  // Si on est déjà sur l'onglet story, re-render maintenant.
  const activeTab = document.querySelector('.tab.active');
  if (activeTab && activeTab.dataset.tab === 'story'){
    window.renderStory();
  }
})();
