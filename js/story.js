// Récit complet de Drama — 4 actes, paragraphes
// Source : ROADMAP §3 (timeline 208 sem.) + lore figé §1
// Cet objet est utilisé par le dashboard ET dupliqué dans ROADMAP.md §7
// pour servir de garde-fou de cohérence narrative.

const STORY = {
  intro: "Drama est un jeu narratif sur 208 semaines (4 ans, 4 saisons). Le joueur incarne Shen Miao, jeune femme asiatique de 24 ans qui s'installe en Europe en 2026 pour son master + stage chez Lu Europe, et qui découvrira progressivement que la famille Lu a fait tuer son père en 2007. Selon ses choix, la fin est l'une de 4 voies : Justice, Argent, Vengeance ou Paix.",
  actes: [
    {
      id: 1,
      titre: "Acte I — L'arrivée",
      range: "Saison 1, W1-52 (gratuite)",
      paragraphes: [
        "En 2026, Shen Miao a 24 ans. Elle quitte son village natal en Asie pour s'installer en Europe à NeoCity, où elle commence son master accompagné d'un stage chez Lu Europe — la branche européenne du Groupe Lu, le conglomérat fondé par feu Lu Senior. Le matin de son arrivée, elle envoie un selfie à Maman depuis l'aéroport (W1). Sa première semaine est portée par Wei, sa cousine qui vit déjà à NeoCity et lui sert de guide : tour du studio, cantine du campus, premiers chitchats légers (W2-W11). Très vite, un numéro inconnu commence à lui envoyer des pings énigmatiques (W5) — c'est L., qui hantera le récit pendant quatre ans.",
        "À W12, Shen entame son stage et rencontre les deux figures qui structurent sa vie professionnelle : Lu Huan, héritier du groupe et PDG actuel — charismatique, ambigu — et Amanda, collègue souriante mais venimeuse. Amanda commence par de petites piques (W14, le pull du village), puis la trahit publiquement à W40 en diffusant une photo prise dans un ascenseur (« Le piège »). Entre-temps, Tante Mei, restée au village, appelle Shen à W18 pour parler de la santé de Maman, puis à W27 pour annoncer qu'elle est elle-même malade — première grosse pression économique : 600 € à envoyer.",
        "À W22, dans un café (Hanami), Shen rencontre Hugo, un artiste. C'est le début d'une romance lente, scrutée par Lu Huan qui les croise par hasard (W38). En parallèle, Lu Huan teste la loyauté de Shen : à W30, il lui demande de signer un document douteux — premier vrai dilemme moral. À W47, Liu Wei, ami du village et romance alternative, arrive à NeoCity, créant un triangle qui va durer toute la suite. La saison se clôt sur la présentation du « grand œuvre » devant le comité (W50, beat majeur pro) et le Réveillon A1 (W52)."
      ]
    },
    {
      id: 2,
      titre: "Acte II — L'ascension",
      range: "Saison 2, W53-104 (payante)",
      paragraphes: [
        "Une nouvelle année commence. Shen monte en pression à Lu Europe. À W63, c'est le lancement produit public que le groupe a préparé pendant des mois — Lu Huan en première ligne. Mais à W73, le board veut le débarquer : Lu Huan est en crise, et Shen se retrouve coincée entre fidélité et opportunisme. À W83, il lui propose un tuyau boursier — délit d'initié. L. (W84) la prévient explicitement. Ce choix d'investissement va déterminer son patrimoine et sa moralité pour le reste du jeu.",
        "L'ombre du papa revient. À W70, Shen trouve un carnet de notes du papa parmi de vieilles affaires. Tante Mei envoie le carnet par la poste à W78. À W89, Maman envoie une photo de Lin enfant — la cousine disparue en 2020 dont personne ne parle plus. À W90, soirée gala Lu : Shen est invitée, première vraie immersion dans le monde des Lu en robe pro. Amanda y joue les charmantes, puis frappe : à W93, c'est la trahison — les RH étudient des « anomalies » dans le travail de Shen. Elle navigue la tempête seule, avec Wei qui la défend (W94) et Hugo qui doute (W95).",
        "La saison culmine à W103 (« Climax A2 ») : Shen choisit sa voie carrière entre 3 options. Soutenance de master à W100, Réveillon A2 à W104."
      ]
    },
    {
      id: 3,
      titre: "Acte III — Les révélations",
      range: "Saison 3, W105-156 (payante)",
      paragraphes: [
        "Shen passe en CDD professionnel. À W113, elle reçoit une promotion mais doit signer une clause de loyauté — autre piège moral. C'est aussi là que tout commence à craquer : à W117, un premier message codé arrive d'une certaine « Lin ». Tante Mei envoie une photo d'une armoire bleue à W120 — Shen ne sait pas encore pourquoi.",
        "À W123, le passé est révélé : une copie du registre de Lu Senior tombe entre les mains de Shen, prouvant que son père Shen Liwei (mort en 2007) était lié au Groupe Lu en tant que comptable. À W128, Tante Mei le confirme face à face : papa avait refusé une promotion qui l'aurait fait taire. Le carnet du papa est retrouvé à W133 ; il documente tout. À W138, autre choc : Wei savait quelque chose depuis le début. La trahison familiale.",
        "À W142, Lu Huan craque pour la première fois — moment humain, il avoue qu'il a appris à 14 ans (en 2014) que son père « avait fait quelque chose ». Mais ce n'est pas lui le coupable : c'est son père Lu Mingzhe, le vrai commanditaire, mort d'AVC en 2018 — hors d'atteinte. Lu Huan porte le poids du crime de son père sans en être l'auteur. À W144, dans le pavillon Lu, Shen découvre le dossier Hatsune — la trace écrite. À W145 enfin, Lin se révèle : c'est la cousine disparue depuis 2020, vivante, en Europe sous une fausse identité, à fouiller depuis six ans. Réveillon A3 (W156) avec Lin autour de la table."
      ]
    },
    {
      id: 4,
      titre: "Acte IV — Endgame",
      range: "Saison 4, W157-208 (payante)",
      paragraphes: [
        "2030. Shen a 28 ans. Le compte à rebours commence. À W160, des rumeurs de fusion Lu/Hatsune sortent dans la presse — Amanda les nourrit. À W163, Lu Huan annonce la « dernière manche » : 60 jours pour décider de sa loyauté ou de le faire tomber.",
        "À W173, Lin organise la confrontation finale et propose 4 voies à Shen — c'est le choix narratif majeur du jeu : Justice (procès médiatique), Argent (fortune offshore proposée par les Lu pour acheter son silence), Vengeance (démolir le Groupe Lu), ou Paix (rentrer au village et y ouvrir une école avec Tante Mei).",
        "L'engrenage médiatique monte à W190 (« Monte la pression »). Tante Mei, Maman et Liu Wei convergent vers NeoCity (W178 — mariage de Liu Wei, W192 Tante Mei arrive, W193 Maman dans l'avion). Hugo lui dit qu'il sera là si elle veut (W194). À W195, dans la nuit du pavillon Lu, Shen prend sa décision intime. Avant-dernier acte à W198. Imminence finale à W205 — Maman lui dit « c'est ton heure » à W207. À W208, Shen choisit, et selon la voie retenue, le jeu joue l'un des 4 endings."
      ]
    }
  ],
  endings: [
    { id: 'ending_justice', emoji: '⚖️', label: 'Justice', desc: "Procès médiatique. Lu Huan tombe, le Groupe Lu est éclaboussé. Shen gagne moralement mais perd Hugo, son confort matériel et l'illusion d'une vie ordinaire." },
    { id: 'ending_argent', emoji: '💴', label: 'Argent', desc: "Fortune offshore. Shen accepte le silence contre une vie luxueuse, offerte par les Lu pour enterrer l'affaire. Liberté apparente, vide intérieur, complicité durable." },
    { id: 'ending_vengeance', emoji: '🗡', label: 'Vengeance', desc: "Groupe Lu démoli. Tout brûle, y compris Shen elle-même. Justice par le feu, sans pardon. Lu Huan ne survit pas politiquement, et Shen rentre détruite." },
    { id: 'ending_paix', emoji: '🌸', label: 'Paix', desc: "École au village. Shen renonce à la guerre, retourne près de Tante Mei et fonde une école pour les enfants. La rédemption par le retour aux sources." }
  ]
};

if (typeof module !== 'undefined') module.exports = { STORY };
