// Drama dashboard — variante texte des voice notes (mode défaut)
// Découpe chaque transcript en bulles SMS naturelles.
// Mode Texte = livraison par défaut (audio à enregistrer plus tard).
(function(){
  if (typeof VOICE_NOTES === 'undefined') return;
  const VARIANTS = {
    // Saison 1
    vn_maman_w1: [
      "Ma fille, fais bien attention en arrivant 🤍",
      "Mange bien.",
      "Ne parle pas trop fort dans le métro.",
      "Je t'aime ma chérie. Envoie-moi une photo quand tu seras dans ton studio."
    ],
    vn_wei_w2: [
      "Cousine !! Bienvenue à NeoCity 🎉",
      "Je passe te chercher demain à 10h, on va au campus ensemble.",
      "Mets pas tes baskets blanches, il pleut 😅"
    ],
    vn_inconnu_w5: [
      "Tu ne devrais pas être là.",
      "Mais maintenant que tu y es...",
      "fais attention."
    ],
    vn_tante_mei_w8: [
      "Shen Miao.",
      "J'ai retrouvé une photo de ton père dans le tiroir bleu.",
      "Il était jeune, à peu près ton âge.",
      "Tu lui ressembles plus que tu crois."
    ],
    vn_hugo_w22: [
      "Salut... c'est Hugo, du café.",
      "J'ai gardé ta tasse.",
      "Si tu veux la récupérer... ou pas.",
      "Café Hanami, je suis là samedi ☕"
    ],
    vn_lu_huan_w30: [
      "Shen, le document sur ton bureau.",
      "Signe-le avant ce soir.",
      "C'est une formalité. Fais-moi confiance."
    ],
    vn_maman_w42: [
      "Allô ma fille...",
      "J'ai senti ta voix bizarre la dernière fois.",
      "Je sais que tu mens quand tu dis que tout va bien.",
      "Je suis pas en colère, je suis ta mère c'est tout.",
      "Appelle quand tu veux. Bisous mon cœur 💖"
    ],
    vn_liu_wei_w47: [
      "Shen Miao !! 🚂",
      "J'arrive demain à NeoCity. Train de 15h.",
      "Tu m'attends à la gare ?",
      "J'ai apporté du thé du village."
    ],

    // Saison 2
    vn_inconnu_w76: [
      "14 mars 2007.",
      "Cherche cette date dans les archives.",
      "Ne fais confiance à personne au siège."
    ],
    vn_amanda_w82: [
      "Coucou Shen ! 💄",
      "Tu viens au gala samedi ?",
      "Mets quelque chose de classe, hein.",
      "T'inquiète, je te prêterai un truc si t'as rien 😘"
    ],
    vn_wei_w94: [
      "Shen je viens de croiser Amanda dans l'ascenseur 😤",
      "Cette pétasse parle de toi à tout le monde.",
      "Je vais lui régler son compte. Bouge pas."
    ],
    vn_hugo_w95: [
      "Shen...",
      "J'arrive plus à te suivre.",
      "T'es là sans être là.",
      "T'as toujours un truc sur ton téléphone, un truc plus important que nous.",
      "J'ai besoin de réfléchir."
    ],

    // Saison 3
    vn_tante_mei_w128: [
      "Shen Miao...",
      "Il est temps que tu saches.",
      "Ton père, il travaillait pour eux.",
      "Il a refusé une promotion en 2007 parce qu'il avait compris des choses.",
      "Trois mois plus tard...",
      "L'accident.",
      "Ce n'était pas un accident."
    ],
    vn_inconnu_w137: [
      "Lu Mingzhe.",
      "Le père. Mort 2018.",
      "Pas le fils.",
      "Cherche le bon coupable."
    ],
    vn_lu_huan_w142: [
      "J'avais quatorze ans quand j'ai compris.",
      "Mon père m'a dit qu'il avait fait quelque chose pour la famille.",
      "Il ne m'a jamais dit quoi.",
      "Mais j'ai vu son visage.",
      "Je sais qu'il a tué quelqu'un.",
      "Je suis désolé Shen."
    ],
    vn_lin_w150: [
      "Cousine.",
      "Je sais que c'est étrange. Mais oui c'est moi.",
      "Demain, café Hanami, 16h.",
      "Viens seule. Je t'expliquerai tout."
    ],

    // Saison 4
    vn_lin_w173: [
      "Quatre voies, Shen.",
      "Justice. Argent. Vengeance. Paix.",
      "C'est à toi de choisir.",
      "Je peux te donner les preuves pour chacune.",
      "Mais c'est toi qui décides ce qu'on en fait."
    ],
    vn_maman_w193: [
      "Je suis dans l'avion ✈️",
      "Je sais que tu m'avais dit non, mais...",
      "Je voulais être près de toi.",
      "Je serai là demain matin."
    ],
    vn_hugo_w194: [
      "Shen.",
      "Quoi que tu choisisses...",
      "Je serai là si tu veux que je sois là."
    ],
    vn_lu_huan_w195: [
      "J'ai bu trop de whisky.",
      "Je sais ce que tu cherches.",
      "Mon père était...",
      "Un homme dur.",
      "Je ne lui ressemble pas. Pas tout à fait.",
      "Si tu m'écoutes encore...",
      "Viens demain. Pavillon.",
      "Une dernière fois."
    ],
    vn_maman_w207: [
      "Ma fille...",
      "C'est ton heure.",
      "Quoi que tu choisisses, je serai fière de toi.",
      "Tu es la fille de ton père."
    ]
  };
  VOICE_NOTES.forEach(v => {
    if (VARIANTS[v.id]) v.text_variant = VARIANTS[v.id];
  });
})();
