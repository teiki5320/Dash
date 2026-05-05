// Drama dashboard — patch incrémental voice notes
// Étend VOICE_NOTES défini dans data.js
// Source de vérité : ROADMAP.md du repo teiki5320/drama
(function(){
  if (typeof VOICE_NOTES === 'undefined') return;
  const EXTRA = [
    // ===== Saison 1 — installation et premiers signaux =====
    { id:'vn_maman_w1', week:1, contact:'maman', duration_sec:18,
      transcript:"Ma fille, fais bien attention en arrivant. Mange bien. Ne parle pas trop fort dans le métro. Je t'aime ma chérie. Envoie-moi une photo quand tu seras dans ton studio.",
      emotion:'douce, retenue, fierté triste' },
    { id:'vn_wei_w2', week:2, contact:'wei', duration_sec:12,
      transcript:"Cousine ! Bienvenue à NeoCity ! Je passe te chercher demain à dix heures, on va au campus ensemble. Mets pas tes baskets blanches, il pleut.",
      emotion:'joyeuse, vive, complice' },
    { id:'vn_inconnu_w5', week:5, contact:'inconnu', duration_sec:6,
      transcript:"Tu ne devrais pas être là. Mais maintenant que tu y es... fais attention.",
      emotion:'voix masquée, neutre, métallique' },
    { id:'vn_tante_mei_w8', week:8, contact:'tante_mei', duration_sec:22,
      transcript:"Shen Miao, j'ai retrouvé une photo de ton père dans le tiroir bleu. Il était jeune, à peu près ton âge. Tu lui ressembles plus que tu crois.",
      emotion:'tendre, voix âgée, lointaine' },
    { id:'vn_hugo_w22', week:22, contact:'hugo', duration_sec:11,
      transcript:"Salut... c'est Hugo, du café. J'ai gardé ta tasse. Si tu veux la récupérer... ou pas. Café Hanami, je suis là samedi.",
      emotion:'timide, sourire dans la voix' },
    { id:'vn_lu_huan_w30', week:30, contact:'lu_huan', duration_sec:14,
      transcript:"Shen, le document sur ton bureau. Signe-le avant ce soir. C'est une formalité. Fais-moi confiance.",
      emotion:'autoritaire douce, ambiguë' },
    { id:'vn_liu_wei_w47', week:47, contact:'liu_wei', duration_sec:9,
      transcript:"Shen Miao ! J'arrive demain à NeoCity. Train de quinze heures. Tu m'attends à la gare ? J'ai apporté du thé du village.",
      emotion:'rieur, presque ému, naïf' },

    // ===== Saison 2 =====
    { id:'vn_amanda_w82', week:82, contact:'amanda', duration_sec:16,
      transcript:"Coucou Shen ! Tu viens au gala samedi ? Mets quelque chose de classe, hein. T'inquiète, je te prêterai un truc si t'as rien.",
      emotion:'fausse douceur, sourire venimeux' },
    { id:'vn_hugo_w95', week:95, contact:'hugo', duration_sec:21,
      transcript:"Shen... j'arrive plus à te suivre. T'es là sans être là. T'as toujours un truc sur ton téléphone, un truc plus important que nous. J'ai besoin de réfléchir.",
      emotion:'épuisé, blessé, tendre malgré tout' },
    { id:'vn_wei_w94', week:94, contact:'wei', duration_sec:13,
      transcript:"Shen je viens de croiser Amanda dans l'ascenseur. Cette pétasse parle de toi à tout le monde. Je vais lui régler son compte. Bouge pas.",
      emotion:'fâchée, protectrice, déterminée' },

    // ===== Saison 3 =====
    { id:'vn_inconnu_w137', week:137, contact:'inconnu', duration_sec:7,
      transcript:"Lu Mingzhe. Le père. Mort 2018. Pas le fils. Cherche le bon coupable.",
      emotion:'voix masquée, neutre, urgente' },
    { id:'vn_lu_huan_w142', week:142, contact:'lu_huan', duration_sec:34,
      transcript:"J'avais quatorze ans quand j'ai compris. Mon père m'a dit qu'il avait fait quelque chose pour la famille. Il ne m'a jamais dit quoi. Mais j'ai vu son visage. Je sais qu'il a tué quelqu'un. Je suis désolé Shen.",
      emotion:'craqué, voix cassée, première vérité' },

    // ===== Saison 4 — endgame =====
    { id:'vn_lin_w173', week:173, contact:'lin', duration_sec:28,
      transcript:"Quatre voies, Shen. Justice, argent, vengeance, ou paix. C'est à toi de choisir. Je peux te donner les preuves pour chacune. Mais c'est toi qui décides ce qu'on en fait.",
      emotion:'mature, posée, lourde' },
    { id:'vn_maman_w193', week:193, contact:'maman', duration_sec:11,
      transcript:"Je suis dans l'avion. Je sais que tu m'avais dit non, mais... je voulais être près de toi. Je serai là demain matin.",
      emotion:'fragile, déterminée, tendre' },
    { id:'vn_hugo_w194', week:194, contact:'hugo', duration_sec:9,
      transcript:"Shen. Quoi que tu choisisses... je serai là si tu veux que je sois là.",
      emotion:'calme, apaisé, sans pression' },
    { id:'vn_maman_w207', week:207, contact:'maman', duration_sec:13,
      transcript:"Ma fille... c'est ton heure. Quoi que tu choisisses, je serai fière de toi. Tu es la fille de ton père.",
      emotion:'tremblante, transmission, sacre' }
  ];
  // dédup par id
  const seen = new Set(VOICE_NOTES.map(v => v.id));
  EXTRA.forEach(v => { if (!seen.has(v.id)) VOICE_NOTES.push(v); });
})();
