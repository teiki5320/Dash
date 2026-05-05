// Drama dashboard — patch incrémental photos
// Étend PHOTOS défini dans data.js : lieux, beats sans visuel, posts dynamiques
// Source de vérité : ROADMAP.md du repo teiki5320/drama
(function(){
  if (typeof PHOTOS === 'undefined') return;
  const EXTRA = [
    // ===== Lieux récurrents (réutilisables, priorité 1 pour atmosphère) =====
    { id:'lieu_studio_shen', file:null, kind:'cinematic', season:1, weeks:[3,16,33,55,167], characters:['shen'], desc:'Studio Shen NeoCity — chambre minimaliste, lumière du soir, bureau encombré', status:'todo' },
    { id:'lieu_cafe_hanami', file:null, kind:'cinematic', season:1, weeks:[22,29,42,150], characters:['hugo','shen','lin'], desc:'Café Hanami — bois clair, fleurs séchées, tableaux Hugo au mur', status:'todo' },
    { id:'lieu_pavillon_lu', file:null, kind:'cinematic', season:3, weeks:[121,144,195,198], characters:['lu_huan'], desc:'Pavillon privé Lu Huan — boiseries, vue NeoCity, whisky sur table', status:'todo' },
    { id:'lieu_tour_lu_open_space', file:null, kind:'cinematic', season:1, weeks:[12,40,93,113], characters:['lu_huan','amanda'], desc:'Open space Tour Lu — verre, bleu froid, écrans, baies vitrées', status:'todo' },
    { id:'lieu_salle_gala', file:null, kind:'cinematic', season:2, weeks:[90], characters:['shen','lu_huan','amanda'], desc:'Salle de gala Lu — lustres or, robes longues, photographes', status:'todo' },
    { id:'lieu_florence', file:null, kind:'cinematic', season:2, weeks:[77,88], characters:['hugo','shen'], desc:'Florence — duomo en arrière-plan, ruelle de pierre, lumière dorée', status:'todo' },
    { id:'lieu_village', file:null, kind:'cinematic', season:1, weeks:[8,18,27,89,118,178,193], characters:['maman','tante_mei','liu_wei'], desc:'Village natal — toits gris, brume, montagne au fond', status:'todo' },
    { id:'lieu_maison_tante_mei', file:null, kind:'cinematic', season:1, weeks:[8,128,177], characters:['tante_mei'], desc:'Intérieur maison Tante Mei — bois sombre, photos famille, théière', status:'todo' },
    { id:'lieu_mahjong_table', file:null, kind:'chat', season:3, weeks:[118], characters:['maman','tante_mei'], desc:'Table mahjong au village — tuiles, mains âgées, bols de thé', status:'todo' },
    { id:'lieu_tribunal', file:null, kind:'cinematic', season:4, weeks:[208], characters:['shen'], desc:'Tribunal — bois sombre, robes, presse au fond (ending Justice)', status:'todo' },
    { id:'lieu_jet_prive', file:null, kind:'cinematic', season:4, weeks:[208], characters:['shen'], desc:'Jet privé — fenêtre nuage, cuir crème (ending Argent)', status:'todo' },
    { id:'lieu_tour_feu', file:null, kind:'cinematic', season:4, weeks:[208], characters:['shen'], desc:'Tour Lu en feu nocturne (ending Vengeance)', status:'todo' },
    { id:'lieu_ecole_village', file:null, kind:'cinematic', season:4, weeks:[208], characters:['shen','tante_mei'], desc:'École village — petits enfants, soleil matin (ending Paix)', status:'todo' },
    { id:'lieu_mariage_liu_wei', file:null, kind:'cinematic', season:4, weeks:[178], characters:['liu_wei'], desc:'Mariage village — lampions rouges, table dehors, soleil couchant', status:'todo' },
    { id:'lieu_galerie_hugo', file:null, kind:'cinematic', season:2, weeks:[57,127,187], characters:['hugo'], desc:'Galerie d\'art Hugo — murs blancs, toiles, vernissage', status:'todo' },

    // ===== Chats par beat majeur sans visuel (S1) =====
    { id:'todo_w14_pull_village', file:null, kind:'chat', season:1, weeks:[14], characters:['amanda','shen'], desc:'Pull du village — Amanda pique le style de Shen (W14)', status:'todo' },
    { id:'todo_w16_overtime_screenshot', file:null, kind:'chat', season:1, weeks:[16], characters:['shen'], desc:'Capture overtime/heures sup — première vraie pression pro', status:'todo' },
    { id:'todo_w30_doc_signature', file:null, kind:'chat', season:1, weeks:[30], characters:['lu_huan'], desc:'Doc juridique douteux à signer — Lu Huan teste la loyauté', status:'todo' },
    { id:'todo_w34_inconnu_question', file:null, kind:'chat', season:1, weeks:[34], characters:['inconnu'], desc:'Question codée Inconnu — premier vrai signal Skinner', status:'todo' },
    { id:'todo_w38_lu_surprend', file:null, kind:'chat', season:1, weeks:[38], characters:['lu_huan'], desc:'Lu Huan croise Shen + Hugo dans la rue', status:'todo' },

    // ===== Chats par beat majeur sans visuel (S2) =====
    { id:'todo_w63_keynote_produit', file:null, kind:'chat', season:2, weeks:[63], characters:['lu_huan'], desc:'Keynote scène — Lu Huan sur scène, produit dévoilé', status:'todo' },
    { id:'todo_w66_lu_post_keynote', file:null, kind:'post', season:2, weeks:[66], characters:['lu_huan'], desc:'Post Lu Huan post-keynote — triomphe public', status:'todo' },
    { id:'todo_w73_board_meeting', file:null, kind:'chat', season:2, weeks:[73], characters:['lu_huan'], desc:'Capture salle board — vote pour débarquer Lu Huan', status:'todo' },
    { id:'todo_w76_inconnu_date', file:null, kind:'chat', season:2, weeks:[76], characters:['inconnu'], desc:'Inconnu balance la date 14 mars 2007 — premier vrai indice papa', status:'todo' },
    { id:'todo_w83_graphique_bourse', file:null, kind:'chat', season:2, weeks:[83], characters:['lu_huan'], desc:'Graphique bourse — tuyau délit d\'initié', status:'todo' },
    { id:'todo_w85_inconnu_bourse', file:null, kind:'chat', season:2, weeks:[85], characters:['inconnu'], desc:'Inconnu prévient — ne touche pas à ce tuyau', status:'todo' },
    { id:'todo_w93_rh_email', file:null, kind:'chat', season:2, weeks:[93], characters:['rh'], desc:'Email RH — anomalies dans le travail de Shen', status:'todo' },
    { id:'todo_w94_wei_defend', file:null, kind:'chat', season:2, weeks:[94], characters:['wei'], desc:'Wei défend Shen face aux ragots de bureau', status:'todo' },
    { id:'todo_w100_soutenance', file:null, kind:'chat', season:2, weeks:[100], characters:['shen'], desc:'Soutenance master — diplôme posé', status:'todo' },

    // ===== Chats par beat majeur sans visuel (S3) =====
    { id:'todo_w113_clause_loyaute', file:null, kind:'chat', season:3, weeks:[113], characters:['lu_huan'], desc:'Clause de loyauté CDD — doc à signer (piège moral)', status:'todo' },
    { id:'todo_w117_message_code_lin', file:null, kind:'chat', season:3, weeks:[117], characters:['lin'], desc:'Premier message codé Lin — caractères chiffrés', status:'todo' },
    { id:'todo_w121_diner_prive_lu', file:null, kind:'chat', season:3, weeks:[121], characters:['lu_huan'], desc:'Dîner privé Lu Huan — pavillon, vin, ambiguïté', status:'todo' },
    { id:'todo_w137_inconnu_mingzhe', file:null, kind:'chat', season:3, weeks:[137], characters:['inconnu'], desc:'Inconnu lâche le nom Mingzhe — coupable nommé', status:'todo' },
    { id:'todo_w138_wei_savait', file:null, kind:'chat', season:3, weeks:[138], characters:['wei'], desc:'Wei avoue qu\'il savait — trahison familiale', status:'todo' },
    { id:'todo_w142_lu_huan_craque', file:null, kind:'chat', season:3, weeks:[142], characters:['lu_huan'], desc:'Lu Huan craque — premier moment vraiment humain', status:'todo' },
    { id:'todo_w148_inconnu_identite', file:null, kind:'chat', season:3, weeks:[148], characters:['inconnu','lin'], desc:'Inconnu = Lin — identité du Skinner révélée', status:'todo' },
    { id:'todo_w155_wei_explique_lin', file:null, kind:'chat', season:3, weeks:[155], characters:['wei','lin'], desc:'Wei explique le silence sur Lin', status:'todo' },

    // ===== Chats par beat majeur sans visuel (S4) =====
    { id:'todo_w157_selfie_2030', file:null, kind:'post', season:4, weeks:[157], characters:['shen'], desc:'Selfie nouvelle année 2030 — Shen 28 ans', status:'todo' },
    { id:'todo_w163_lu_derniere_manche', file:null, kind:'chat', season:4, weeks:[163], characters:['lu_huan'], desc:'Lu Huan annonce la dernière manche — 60 jours', status:'todo' },
    { id:'todo_w164_journaliste', file:null, kind:'chat', season:4, weeks:[164], characters:['inconnu'], desc:'Journaliste contacte Shen — première fuite presse', status:'todo' },
    { id:'todo_w167_hugo_distance', file:null, kind:'chat', season:4, weeks:[167], characters:['hugo'], desc:'Hugo prend distance — doutes', status:'todo' },
    { id:'todo_w175_lin_dossier', file:null, kind:'chat', season:4, weeks:[175], characters:['lin'], desc:'Lin transmet dossier preuves complet', status:'todo' },
    { id:'todo_w184_temoin', file:null, kind:'chat', season:4, weeks:[184], characters:['lin'], desc:'Lin trouve un témoin clé du dossier papa', status:'todo' },
    { id:'todo_w191_article_lemonde', file:null, kind:'post', season:4, weeks:[191], characters:['inconnu'], desc:'Article Le Monde — affaire Lu sort dans la presse mondiale', status:'todo' },
    { id:'todo_w193_maman_avion', file:null, kind:'chat', season:4, weeks:[193], characters:['maman'], desc:'Maman dans l\'avion vers NeoCity — selfie tremblé', status:'todo' },
    { id:'todo_w194_hugo_serai_la', file:null, kind:'chat', season:4, weeks:[194], characters:['hugo'], desc:'Hugo « je serai là si tu veux »', status:'todo' },
    { id:'todo_w196_lu_pavillon', file:null, kind:'chat', season:4, weeks:[196], characters:['lu_huan'], desc:'Lu pavillon nuit — invitation finale', status:'todo' },
    { id:'todo_w202_jour_j', file:null, kind:'chat', season:4, weeks:[202], characters:['shen'], desc:'Jour J approche — agenda barré', status:'todo' },
    { id:'todo_w207_cest_ton_heure', file:null, kind:'chat', season:4, weeks:[207], characters:['maman'], desc:'Maman: « c\'est ton heure »', status:'todo' },

    // ===== Posts Insta dynamiques (per-season social drama) =====
    { id:'post_wei_w6', file:null, kind:'post', season:1, weeks:[6], characters:['wei'], desc:'Post Wei — premières amies à NeoCity', status:'todo' },
    { id:'post_hugo_w11', file:null, kind:'post', season:1, weeks:[11], characters:['hugo'], desc:'Post Hugo — atelier peinture vue rue', status:'todo' },
    { id:'post_amanda_w26', file:null, kind:'post', season:1, weeks:[26], characters:['amanda'], desc:'Post Amanda — dîner pro humble brag', status:'todo' },
    { id:'post_hugo_w34', file:null, kind:'post', season:1, weeks:[34], characters:['hugo'], desc:'Post Hugo — annonce expo galerie', status:'todo' },
    { id:'post_amanda_w43', file:null, kind:'post', season:1, weeks:[43], characters:['amanda'], desc:'Post Amanda — robe nouvelle au bureau', status:'todo' },
    { id:'post_wei_w51', file:null, kind:'post', season:1, weeks:[51], characters:['wei'], desc:'Post Wei — fête fin S1', status:'todo' },
    { id:'post_lu_huan_w66', file:null, kind:'post', season:2, weeks:[66], characters:['lu_huan'], desc:'Post Lu Huan post-keynote — communication corporate', status:'todo' },
    { id:'post_amanda_w82', file:null, kind:'post', season:2, weeks:[82], characters:['amanda'], desc:'Post Amanda — teaser gala soirée', status:'todo' },
    { id:'post_hugo_florence', file:null, kind:'post', season:2, weeks:[77,88], characters:['hugo','shen'], desc:'Post Florence — couple en voyage', status:'todo' },
    { id:'post_inconnu_lin_w89', file:null, kind:'post', season:2, weeks:[89], characters:['lin'], desc:'Post anonyme avec photo Lin enfant — plante S3', status:'todo' },
    { id:'post_wei_w127', file:null, kind:'post', season:3, weeks:[127], characters:['wei'], desc:'Post Wei — étudiant·e fin master', status:'todo' },
    { id:'post_hugo_w139', file:null, kind:'post', season:3, weeks:[139], characters:['hugo'], desc:'Post Hugo cryptique — retrait silencieux', status:'todo' },
    { id:'post_lu_huan_w160', file:null, kind:'post', season:4, weeks:[160], characters:['lu_huan','amanda'], desc:'Communication officielle fusion Lu/Hatsune', status:'todo' },
    { id:'post_amanda_w184', file:null, kind:'post', season:4, weeks:[184], characters:['amanda'], desc:'Post Amanda — début offensive média', status:'todo' },
    { id:'post_inconnu_w198', file:null, kind:'post', season:4, weeks:[198], characters:['shen'], desc:'Dernier post avant l\'ending — silence Shen', status:'todo' },

    // ===== Maps & wallpapers complémentaires =====
    { id:'map_village_chine', file:null, kind:'map', season:1, weeks:[1,18,178], characters:[], desc:'Carte village natal de Shen (zoom Chine)', status:'todo' },
    { id:'map_florence', file:null, kind:'map', season:2, weeks:[77,88], characters:['hugo'], desc:'Carte Florence — voyage Hugo', status:'todo' },
    { id:'wallpaper_2030', file:null, kind:'wallpaper', season:4, weeks:[157], characters:[], desc:'Wallpaper 2030 — changement année visible UI', status:'todo' },
    { id:'wallpaper_endgame', file:null, kind:'wallpaper', season:4, weeks:[200], characters:[], desc:'Wallpaper endgame — sombre, pression montante', status:'todo' }
  ];
  // dédup par id
  const seen = new Set(PHOTOS.map(p => p.id));
  EXTRA.forEach(p => { if (!seen.has(p.id)) PHOTOS.push(p); });
})();
