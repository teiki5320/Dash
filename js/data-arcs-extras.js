// Drama dashboard — patch incrémental arcs S2-S4
// Étend ARCS et tague TIMELINE.arc pour W53-W208
// Source de vérité : ROADMAP.md du repo teiki5320/drama
(function(){
  if (typeof ARCS === 'undefined' || typeof TIMELINE === 'undefined') return;

  const EXTRA_ARCS = [
    // Saison 2
    { id:'F_demarrage', season:2, weeks:[53,54,55,56,57,58,59,60,61,62], titre:"Démarrage A2 — retour de pression", theme:"Bonne année, signaux faibles : Tante Mei photo papa, Lu promo à venir, Amanda nouvelle collègue, Maman tousse, Liu Wei carte séjour" },
    { id:'G_lancement', season:2, weeks:[63,64,65,66,67,68,69,70,71,72], titre:"Lancement produit & ombre du papa", theme:"W63 lancement Lu, médias, Hugo dit je t'aime, W70 Shen trouve carnet papa, Lu Huan voyage Singapour, Liu Wei distance" },
    { id:'H_crise_lu', season:2, weeks:[73,74,75,76,77,78,79,80,81,82], titre:"Crise Lu Huan + Florence", theme:"W73 board veut Lu, W76 Inconnu balance 14 mars 2007, Hugo Florence, Tante Mei envoie carnet par poste, gala invitation Amanda" },
    { id:'I_bourse_gala', season:2, weeks:[83,84,85,86,87,88,89,90,91,92], titre:"Tuyau bourse & soirée gala", theme:"W83 délit initié, W90 gala Lu première fois en robe, Maman photo Lin enfant (plante S3), Lu Huan vous ressemblez à quelqu'un" },
    { id:'J_trahison_climax', season:2, weeks:[93,94,95,96,97,98,99,100,101,102,103,104], titre:"Trahison Amanda → Climax A2", theme:"W93 RH étudient anomalies, Wei défend, Hugo doute, soutenance master W100, W103 choix carrière 3 voies, Réveillon A2" },

    // Saison 3
    { id:'K_pro_pression', season:3, weeks:[105,106,107,108,109,110,111,112,113,114,115,116], titre:"Vie pro & promotion piégée", theme:"CDD, clause loyauté W113, Hugo dit je t'aime, Tante Mei pose le coffre, Amanda retour discret, Liu Wei village" },
    { id:'L_lin_signal', season:3, weeks:[117,118,119,120,121,122,123,124,125,126,127], titre:"Lin envoie des signaux + passé révélé", theme:"W117 message codé Lin, W120 photo armoire bleue Tante Mei, Lu Huan dîner privé, W123 copie registre Lu Senior tombe entre les mains de Shen" },
    { id:'M_revelations_papa', season:3, weeks:[128,129,130,131,132,133,134,135,136,137,138,139,140,141], titre:"Révélations papa en cascade", theme:"W128 Tante Mei révèle papa, W133 carnet retrouvé, W137 Inconnu lâche le nom Mingzhe, W138 Wei savait, Hugo pause" },
    { id:'N_lu_lin_dossier', season:3, weeks:[142,143,144,145,146,147,148,149,150,151,152,153,154,155,156], titre:"Lu humain + Hatsune + Lin = cousine", theme:"W142 Lu Huan craque, W144 dossier Hatsune au pavillon, W145 Lin révélée cousine, W152 IRL, W156 Réveillon A3 avec Lin à table" },

    // Saison 4
    { id:'O_2030', season:4, weeks:[157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172], titre:"2030 — le piège se referme", theme:"Bonne année 2030, W160 rumeurs fusion Lu/Hatsune, W163 dernière manche 60 jours, journaliste, Hugo te quitte si mood<4" },
    { id:'P_confrontation', season:4, weeks:[173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189], titre:"Confrontation finale + préparation", theme:"W173 Lin propose 4 voies, mariage Liu Wei W178, armoire bleue léguée, Maman vient à NeoCity, Lin trouve un témoin" },
    { id:'Q_montee_finale', season:4, weeks:[190,191,192,193,194,195,196,197,198,199,200,201], titre:"Pression médias & convergence", theme:"W190 monte la pression, W195 décision intime nuit pavillon Lu, W198 avant-dernier acte, Maman avion, Hugo offre sa présence" },
    { id:'R_ending', season:4, weeks:[202,203,204,205,206,207,208], titre:"Imminence et choix final", theme:"Préparation finale, W205 imminence, W207 Maman c'est ton heure, W208 ending choisi (Justice / Argent / Vengeance / Paix)" }
  ];

  const seenIds = new Set(ARCS.map(a => a.id));
  EXTRA_ARCS.forEach(a => { if (!seenIds.has(a.id)) ARCS.push(a); });

  // Tag inverse W -> arc
  const wToArc = {};
  ARCS.forEach(a => a.weeks.forEach(w => { wToArc[w] = a.id; }));
  TIMELINE.forEach(t => { if (!t.arc && wToArc[t.w]) t.arc = wToArc[t.w]; });
})();
