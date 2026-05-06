// Récit complet de Drama — 4 actes, paragraphes
// Source : ROADMAP §3 (timeline 208 sem.) + lore figé §1 + NARRATIVE_DENSITY.md
// Cet objet est utilisé par le dashboard ET dupliqué dans ROADMAP.md §7
// pour servir de garde-fou de cohérence narrative.

const STORY = {
  intro: "Drama est un jeu narratif sur 208 semaines (4 ans, 4 saisons). Le joueur incarne Shen Miao, jeune femme asiatique de 24 ans qui s'installe en Europe en 2026 pour son master + stage chez Lu Europe, et qui découvrira progressivement que la famille Lu a fait tuer son père en 2007. Mais le vrai labyrinthe est plus profond : derrière le coupable apparent (Lu Mingzhe, mort en 2018) se cache un pacte familial et trois sources anonymes qui se font passer pour une seule. Selon ses choix, la fin est l'une de 4 voies : Justice, Argent, Vengeance ou Paix.",
  actes: [
    {
      id: 1,
      titre: "Acte I — L'arrivée",
      range: "Saison 1, W1-52 (gratuite)",
      paragraphes: [
        "En 2026, Shen Miao a 24 ans. Elle quitte son village natal en Asie pour s'installer en Europe à NeoCity, où elle commence son master accompagné d'un stage chez Lu Europe — la branche européenne du Groupe Lu, le conglomérat fondé par feu Lu Senior. Le matin de son arrivée, elle envoie un selfie à Maman depuis l'aéroport (W1). Sa première semaine est portée par Wei, sa cousine qui vit déjà à NeoCity et lui sert de guide : tour du studio, cantine du campus, premiers chitchats légers (W2-W11). Très vite, un numéro inconnu commence à lui envoyer des pings énigmatiques (W5) — c'est « L. », qui hantera le récit pendant quatre ans. Ce que Shen ne sait pas encore : derrière « L. » se cachent en réalité trois sources distinctes (un journaliste, sa cousine Lin, et Lu Huan lui-même qui prévient anonymement). Le reveal viendra bien plus tard, à W148.",
        "À W12, Shen entame son stage et rencontre les deux figures qui structurent sa vie professionnelle : Lu Huan, héritier du groupe et PDG actuel — charismatique, ambigu — et Amanda, collègue souriante mais venimeuse. Amanda commence par de petites piques (W14, le pull du village), puis la trahit publiquement à W40 en diffusant une photo prise dans un ascenseur (« Le piège »). Entre-temps, Tante Mei, restée au village, appelle Shen à W18 pour parler de la santé de Maman, puis à W27 pour annoncer qu'elle est elle-même malade — première grosse pression économique : 600 € à envoyer. Cette pression financière reviendra par cycles (W56, W67, W107, W167) — il n'y a jamais de vrai répit budgétaire.",
        "À W22, dans un café (Hanami), Shen rencontre Hugo, un artiste. C'est le début d'une romance lente, scrutée par Lu Huan qui les croise par hasard (W38). En parallèle, Lu Huan teste la loyauté de Shen : à W30, il lui demande de signer un document douteux — premier vrai dilemme moral. À W47, Liu Wei, ami du village et romance alternative, arrive à NeoCity, créant un triangle qui va durer toute la suite. La saison se clôt sur la présentation du « grand œuvre » devant le comité (W50) et le Réveillon A1 (W52)."
      ]
    },
    {
      id: 2,
      titre: "Acte II — L'ascension",
      range: "Saison 2, W53-104 (payante)",
      paragraphes: [
        "Une nouvelle année commence. Shen monte en pression à Lu Europe. À W63, c'est le lancement produit public que le groupe a préparé pendant des mois — Lu Huan en première ligne. Mais à W73, le board veut le débarquer : Lu Huan est en crise, et Shen se retrouve coincée entre fidélité et opportunisme. À W83, il lui propose un tuyau boursier — délit d'initié. L. (W84) la prévient explicitement. Ce choix d'investissement va déterminer son patrimoine et sa moralité pour le reste du jeu, et reviendra trois fois (W112 bonus structuré, W160 fusion Lu/Hatsune, W175 ultime chantage).",
        "L'ombre du papa revient. À W70, Shen trouve un carnet de notes du papa parmi de vieilles affaires. Tante Mei envoie le carnet par la poste à W78. À W76, un voice note de L. (voix masquée) lui balance pour la première fois la date « 14 mars 2007 ». À W89, Maman envoie une photo de Lin enfant — la cousine disparue en 2020 dont personne ne parle plus. À W90, soirée gala Lu : Shen est invitée, première vraie immersion dans le monde des Lu en robe pro. Amanda y joue les charmantes, puis frappe : à W93, c'est la trahison — les RH étudient des « anomalies » dans le travail de Shen. Elle navigue la tempête seule, avec Wei qui la défend (W94) et Hugo qui doute (W95).",
        "La saison culmine à W103 (« Climax A2 ») : Shen choisit sa voie carrière entre 3 options. Soutenance de master à W100, Réveillon A2 à W104."
      ]
    },
    {
      id: 3,
      titre: "Acte III — Les révélations",
      range: "Saison 3, W105-156 (payante)",
      paragraphes: [
        "Shen passe en CDD professionnel. À W113, elle reçoit une promotion mais doit signer une clause de loyauté — autre piège moral. C'est aussi là que tout commence à craquer : à W117, un premier message codé arrive d'une certaine « Lin ». Tante Mei envoie une photo d'une armoire bleue à W120 — Shen ne sait pas encore pourquoi.",
        "À W123, le passé est révélé : une copie du registre de Lu Senior tombe entre les mains de Shen, prouvant que son père Shen Liwei (mort en 2007) était lié au Groupe Lu en tant que comptable. À W128, Tante Mei le confirme face à face dans un voice note bouleversant : papa avait refusé une promotion qui l'aurait fait taire, trois mois avant son « accident ». À W137, L. lâche enfin un nom : « Lu Mingzhe. Le père. Mort 2018. Pas le fils. » Le carnet du papa est retrouvé à W133 ; il documente tout. À W138, autre choc : Wei savait quelque chose depuis le début — la trahison familiale qu'on commence à mesurer.",
        "À W142, Lu Huan craque pour la première fois — moment humain, voice note ivre où il avoue qu'il a appris à 14 ans (en 2014) que son père « avait fait quelque chose ». Mais ce n'est pas lui le coupable : c'est son père Lu Mingzhe, le vrai commanditaire, mort d'AVC en 2018 — hors d'atteinte. Lu Huan porte le poids du crime de son père sans en être l'auteur. À W144, dans le pavillon Lu, Shen découvre le dossier Hatsune — la trace écrite. À W145 enfin, Lin se révèle : c'est la cousine disparue depuis 2020, vivante, en Europe sous une fausse identité, à fouiller depuis six ans. À W148, Shen comprend que les pings de « L. » venaient de trois sources différentes (Lin, un journaliste, Lu Huan en sourdine) — recadrage rétroactif de toute la S1-S2. Réveillon A3 (W156) avec Lin autour de la table."
      ]
    },
    {
      id: 4,
      titre: "Acte IV — Endgame",
      range: "Saison 4, W157-208 (payante)",
      paragraphes: [
        "2030. Shen a 28 ans. Le compte à rebours visuel commence : à partir de W163, un compteur « J-X » apparaît dans l'UI du téléphone, indiquant les jours restants jusqu'au choix final. À W160, des rumeurs de fusion Lu/Hatsune sortent dans la presse — Amanda les nourrit. À W163, Lu Huan annonce la « dernière manche » : 60 jours pour décider de sa loyauté ou de le faire tomber.",
        "À W173, Lin organise la confrontation finale et propose 4 voies à Shen — c'est le choix narratif majeur du jeu : Justice (procès médiatique), Argent (fortune offshore proposée par les Lu pour acheter son silence), Vengeance (démolir le Groupe Lu), ou Paix (rentrer au village et y ouvrir une école avec Tante Mei). À W181, Lin présente son témoin clé : c'est l'oncle Wei (le père de Wei la cousine), qui a négocié son ascension dans le Groupe Lu en échange de son silence sur le meurtre du papa en 2007. Le 4e antagoniste, jusqu'ici invisible, prend forme. C'est ce pacte familial enfoui que Wei (la cousine) portait depuis le début, et c'est pour ça qu'elle « savait » à W138.",
        "L'engrenage médiatique monte à W190 (« Monte la pression » — article Le Monde). Tante Mei, Maman et Liu Wei convergent vers NeoCity (W178 — mariage de Liu Wei, W192 Tante Mei arrive, W193 Maman dans l'avion). Hugo lui dit qu'il sera là si elle veut (W194). À W195, dans la nuit du pavillon Lu, Shen prend sa décision intime — un voice note ivre de Lu Huan, presque tendre, lui propose une dernière fois de le rejoindre. Avant-dernier acte à W198. Imminence finale à W205 — Maman lui dit « c'est ton heure » à W207, dans un voice note tremblant qui passe le témoin. À W208, Shen choisit, et selon la voie retenue, le jeu joue l'un des 4 endings."
      ]
    }
  ],
  // Sous-arcs récurrents (cf NARRATIVE_DENSITY.md A1-A12) — texture narrative, pas plot principal
  subarcs: [
    { id: 'A1', label: 'Mystères parallèles', desc: '4 fils en parallèle (papa, Lu, Amanda, Lin) qui s\'éclairent les uns les autres sans jamais se résoudre seuls.' },
    { id: 'A2', label: '4e antagoniste caché', desc: 'L\'oncle Wei (père de la cousine) a fait un pacte avec le Groupe Lu en 2007. Reveal W181.' },
    { id: 'A3', label: 'Multiples Inconnus', desc: 'Le numéro « L. » est en réalité 3 sources distinctes (Lin / journaliste / Lu Huan anonyme). Reveal W148.' },
    { id: 'A4', label: 'Skinner pings 30+', desc: 'Pings anonymes répartis tous les ~7 semaines pour maintenir l\'inconfort.' },
    { id: 'A5', label: 'Cycles d\'argent', desc: '600 € récurrents (Tante Mei, opérations, voyage, avocat) — la pression budgétaire ne s\'arrête jamais.' },
    { id: 'A6', label: 'Cycles santé', desc: 'Tante Mei, Maman, Shen elle-même — santé physique et mentale qui oscille saison par saison.' },
    { id: 'A7', label: 'Triangle Hugo / Liu Wei', desc: 'La romance alternative (W47) et la romance principale (W22) oscillent jusqu\'à W194.' },
    { id: 'A8', label: 'Drame social Insta', desc: 'Posts Insta d\'Amanda / Hugo / Wei comme scène de tension publique. Affecte le mood.' },
    { id: 'A9', label: 'Cycles bourse / délit', desc: 'Tentation récurrente (W83, W112, W160, W175). Plus on cède, moins l\'ending Justice est crédible.' },
    { id: 'A10', label: 'Paranoia beats', desc: 'Sentiment d\'être suivie / écoutée à partir de W83. Variable d\'état qui modifie l\'UI à fort niveau.' },
    { id: 'A11', label: 'Révélation des Inconnus', desc: 'W148 (Lin), W155 (Wei savait), W186 (journaliste), W189 (oncle Wei père).' },
    { id: 'A12', label: 'J-X countdown', desc: 'Compte à rebours visible dans l\'UI à partir de W163 — urgence ressentie de la S4.' }
  ],
  // Voice notes (mode Texte priorité, Audio en option) — cf ASSETS_SPEC §4
  voicenotes_note: "21 voice notes définis (cf ASSETS_SPEC §4). Délivrés par défaut en mode Texte (bulles SMS multi-lignes avec rythme naturel). Mode Audio activable une fois les .m4a enregistrés.",
  endings: [
    { id: 'ending_justice', emoji: '⚖️', label: 'Justice', desc: "Procès médiatique. Lu Huan tombe, le Groupe Lu est éclaboussé. Shen gagne moralement mais perd Hugo, son confort matériel et l'illusion d'une vie ordinaire." },
    { id: 'ending_argent', emoji: '💴', label: 'Argent', desc: "Fortune offshore. Shen accepte le silence contre une vie luxueuse, offerte par les Lu pour enterrer l'affaire. Liberté apparente, vide intérieur, complicité durable." },
    { id: 'ending_vengeance', emoji: '🗡', label: 'Vengeance', desc: "Groupe Lu démoli. Tout brûle, y compris Shen elle-même. Justice par le feu, sans pardon. Lu Huan ne survit pas politiquement, et Shen rentre détruite." },
    { id: 'ending_paix', emoji: '🌸', label: 'Paix', desc: "École au village. Shen renonce à la guerre, retourne près de Tante Mei et fonde une école pour les enfants. La rédemption par le retour aux sources." }
  ]
};

if (typeof module !== 'undefined') module.exports = { STORY };
