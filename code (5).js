--- UPDATED FILE scenario_detaille.js ---
/**
 * Fonction pour générer un scénario détaillé comme le ferait une IA spécialisée
 * Cette fonction remplacera la fonction generateScenario actuelle
 */
window.generateScenarioDetaille = async function(keywords) {
  try {
    console.log("Génération du scénario détaillé à partir de : " + keywords);

    // Ajouter un facteur d'aléatoire renforcé pour garantir l'unicité du scénario
    const randomSeed = Date.now() + Math.floor(Math.random() * 1000000);
    console.log("Seed aléatoire généré: " + randomSeed);

    // Traitement des mots-clés
    const keywordsList = keywords.split(/[ ,]+/).filter(k => k.length > 0);

    // Génération d'un titre créatif basé sur les mots-clés
    let title = genererTitreCreatif(keywordsList, randomSeed);

    // Création d'un univers cohérent basé sur les mots-clés
    const univers = creerUnivers(keywordsList, randomSeed);

    // Création des personnages principaux avec des caractéristiques détaillées
    const personnages = creerPersonnages(keywordsList, univers, randomSeed);

    // Création d'une structure narrative complète
    const structureNarrative = creerStructureNarrative(keywordsList, univers, personnages, randomSeed);

    // Génération des chapitres détaillés
    const chapitres = genererChapitresDetailles(structureNarrative, univers, personnages, randomSeed);

    // Construction de l'objet scénario complet
    const scenario = {
      title: title,
      theme: keywords,
      univers: univers,
      personnages: personnages,
      structureNarrative: structureNarrative,
      chapters: chapitres,
      generatedAt: Date.now()
    };

    return scenario;
  } catch (error) {
    console.error("Erreur lors de la génération du scénario détaillé:", error);
    return null;
  }
}

/**
 * Génère un titre créatif basé sur les mots-clés
 */
function genererTitreCreatif(keywordsList, randomSeed) {
  const titresCreatifs = [
    "Les Chroniques de [Mot-clé]",
    "L'Odyssée [Mot-clé]",
    "Le Secret des [Mot-clé]",
    "Au-delà des [Mot-clé]",
    "[Mot-clé]: La Légende Oubliée",
    "Les Gardiens de [Mot-clé]",
    "L'Éveil de [Mot-clé]",
    "La Prophétie des [Mot-clé]",
    "Le Dernier [Mot-clé]",
    "L'Écho des [Mot-clé]"
  ];

  // Sélection d'un modèle de titre
  const modeleIndex = Math.floor((randomSeed % 100) / 100 * titresCreatifs.length);
  let modele = titresCreatifs[modeleIndex];

  // Remplacement du placeholder par un mot-clé
  if (keywordsList.length > 0) {
    const keywordIndex = Math.floor((randomSeed % 200) / 200 * keywordsList.length);
    const keyword = keywordsList[keywordIndex];
    const keywordCapitalized = keyword.charAt(0).toUpperCase() + keyword.slice(1);
    modele = modele.replace("[Mot-clé]", keywordCapitalized);
  } else {
    modele = modele.replace("[Mot-clé]", "Mondes");
  }

  return modele;
}

/**
 * Crée un univers cohérent basé sur les mots-clés
 */
function creerUnivers(keywordsList, randomSeed) {
  // Types d'univers possibles
  const typesUnivers = [
    "médiéval-fantastique", "science-fiction", "post-apocalyptique",
    "contemporain", "steampunk", "cyberpunk", "mythologique",
    "historique", "dystopique", "utopique"
  ];

  // Sélection d'un type d'univers influencé par les mots-clés
  let typeUnivers = typesUnivers[Math.floor((randomSeed % 300) / 300 * typesUnivers.length)];

  // Adaptation du type d'univers en fonction des mots-clés
  if (keywordsList.length > 0) {
    for (const keyword of keywordsList) {
      if (keyword.includes("futur") || keyword.includes("robot") || keyword.includes("espace")) {
        typeUnivers = "science-fiction";
        break;
      } else if (keyword.includes("dragon") || keyword.includes("magie") || keyword.includes("elfe")) {
        typeUnivers = "médiéval-fantastique";
        break;
      } else if (keyword.includes("apocalypse") || keyword.includes("survie") || keyword.includes("ruine")) {
        typeUnivers = "post-apocalyptique";
        break;
      }
    }
  }

  // Caractéristiques de l'univers
  const caracteristiques = {
    "médiéval-fantastique": {
      epoque: "Âge des légendes",
      technologie: "Limitée, remplacée par la magie",
      particularites: "Créatures mythiques, royaumes en guerre, quêtes héroïques",
      lieux: ["Forêt enchantée", "Château ancestral", "Village paisible", "Montagne sacrée", "Cité fortifiée"]
    },
    "science-fiction": {
      epoque: "Futur lointain",
      technologie: "Très avancée, voyages interstellaires, intelligence artificielle",
      particularites: "Civilisations extraterrestres, conflits interplanétaires, exploration spatiale",
      lieux: ["Station spatiale", "Planète inconnue", "Métropole futuriste", "Laboratoire secret", "Vaisseau spatial"]
    },
    "post-apocalyptique": {
      epoque: "Après la chute de la civilisation",
      technologie: "Vestiges technologiques, innovations de fortune",
      particularites: "Ressources rares, territoires hostiles, nouvelles sociétés émergentes",
      lieux: ["Ruines urbaines", "Abri souterrain", "Oasis préservée", "Territoire contaminé", "Campement nomade"]
    },
    "contemporain": {
      epoque: "Présent",
      technologie: "Actuelle, avec possibles éléments fantastiques",
      particularites: "Intrigues urbaines, mystères cachés dans le quotidien",
      lieux: ["Métropole animée", "Petite ville tranquille", "Campus universitaire", "Quartier historique", "Zone industrielle"]
    },
    "steampunk": {
      epoque: "Ère victorienne alternative",
      technologie: "Mécanique avancée, vapeur, engrenages",
      particularites: "Aristocratie et inventeurs, exploration, sociétés secrètes",
      lieux: ["Cité industrielle", "Dirigeable majestueux", "Manoir mécanique", "Docks brumeux", "Laboratoire d'inventeur"]
    },
    "cyberpunk": {
      epoque: "Futur proche",
      technologie: "Cybernétique, réalité virtuelle, implants",
      particularites: "Mégacorporations, hackers, inégalités sociales extrêmes",
      lieux: ["Mégalopole néon", "Bas-fonds", "Quartier général corporatif", "Réseau virtuel", "Clinique clandestine"]
    },
    "mythologique": {
      epoque: "Temps des mythes",
      technologie: "Primitive, mais avec artefacts divins",
      particularites: "Dieux et héros, quêtes épiques, créatures légendaires",
      lieux: ["Temple sacré", "Île mystérieuse", "Royaume des dieux", "Forêt primordiale", "Cité antique"]
    },
    "historique": {
      epoque: "Période historique spécifique",
      technologie: "Correspondant à l'époque choisie",
      particularites: "Événements historiques réinterprétés, personnages inspirés de figures réelles",
      lieux: ["Palais royal", "Champ de bataille", "Port marchand", "Quartier populaire", "Monument emblématique"]
    },
    "dystopique": {
      epoque: "Futur oppressif",
      technologie: "Avancée mais contrôlée",
      particularites: "Régime totalitaire, surveillance, résistance clandestine",
      lieux: ["Centre de contrôle", "Zone de résistance", "Quartier d'habitation standardisé", "Centre de rééducation", "Frontière surveillée"]
    },
    "utopique": {
      epoque: "Futur idéalisé",
      technologie: "Harmonieusement intégrée à la société",
      particularites: "Société apparemment parfaite cachant des secrets troublants",
      lieux: ["Cité jardin", "Centre communautaire", "Dôme écologique", "Tour d'harmonie", "Réserve naturelle"]
    }
  };

  // Création de l'univers détaillé
  const univers = {
    type: typeUnivers,
    ...caracteristiques[typeUnivers],
    description: `Un monde ${typeUnivers} où ${caracteristiques[typeUnivers].particularites.toLowerCase()}.`
  };

  return univers;
}

/**
 * Crée des personnages principaux avec des caractéristiques détaillées
 */
function creerPersonnages(keywordsList, randomSeed) {
  // Archétypes de personnages
  const archetypes = [
    "héros", "mentor", "allié", "antagoniste", "gardien", "messager", "ombre"
  ];

  // Traits de personnalité
  const traits = {
    "héros": ["courageux", "déterminé", "idéaliste", "loyal", "impulsif"],
    "mentor": ["sage", "patient", "mystérieux", "exigeant", "protecteur"],
    "allié": ["fidèle", "compétent", "humoristique", "pragmatique", "sceptique"],
    "antagoniste": ["ambitieux", "impitoyable", "charismatique", "calculateur", "vengeur"],
    "gardien": ["vigilant", "traditionnel", "inflexible", "honorable", "méfiant"],
    "messager": ["curieux", "neutre", "observateur", "adaptable", "insaisissable"],
    "ombre": ["tourmenté", "complexe", "imprévisible", "dangereux", "séduisant"]
  };

  // Motivations possibles
  const motivations = {
    "héros": ["protéger les innocents", "venger un proche", "prouver sa valeur", "découvrir la vérité", "accomplir une prophétie"],
    "mentor": ["transmettre un savoir", "réparer une erreur passée", "préparer la nouvelle génération", "maintenir l'équilibre", "expier une faute"],
    "allié": ["aider un ami", "poursuivre un intérêt commun", "rembourser une dette", "trouver sa place", "fuir son passé"],
    "antagoniste": ["conquérir le pouvoir", "renverser l'ordre établi", "se venger d'une injustice", "imposer sa vision du monde", "obtenir l'immortalité"],
    "gardien": ["préserver un secret", "protéger un lieu sacré", "maintenir les traditions", "tester les héros", "respecter un serment"],
    "messager": ["délivrer une information cruciale", "observer les événements", "manipuler les protagonistes", "rétablir l'équilibre", "servir une entité supérieure"],
    "ombre": ["racheter son âme", "défier son destin", "semer le chaos", "tester ses limites", "survivre à tout prix"]
  };

  // Nombre de personnages principaux (3-5)
  const nombrePersonnages = Math.floor((randomSeed % 400) / 400 * 3) + 3;

  // Création des personnages
  const personnages = [];
  const archetypesUtilises = new Set();

  // Toujours inclure un héros et un antagoniste
  archetypesUtilises.add("héros");
  archetypesUtilises.add("antagoniste");

  // Créer le héros
  const hero = creerPersonnage("héros", univers, keywordsList, randomSeed + 1);
  personnages.push(hero);

  // Créer l'antagoniste
  const antagoniste = creerPersonnage("antagoniste", univers, keywordsList, randomSeed + 2);
  personnages.push(antagoniste);

  // Créer les autres personnages
  for (let i = 2; i < nombrePersonnages; i++) {
    // Sélectionner un archétype non utilisé
    let archetype;
    do {
      archetype = archetypes[Math.floor((randomSeed % (500 + i * 100)) / (500 + i * 100) * archetypes.length)];
    } while (archetypesUtilises.has(archetype));

    archetypesUtilises.add(archetype);

    // Créer le personnage
    const personnage = creerPersonnage(archetype, univers, keywordsList, randomSeed + i + 3);
    personnages.push(personnage);
  }

  return personnages;
}

/**
 * Crée un personnage individuel avec des caractéristiques détaillées
 */
function creerPersonnage(archetype, univers, keywordsList, randomSeed) {
  // Noms possibles selon le type d'univers
  const noms = {
    "médiéval-fantastique": ["Eldrin", "Lyra", "Thorne", "Seraphina", "Gareth", "Isolde", "Rowan", "Morgana", "Alaric", "Elara"],
    "science-fiction": ["Nova", "Orion", "Vega", "Ceres", "Zephyr", "Andromeda", "Sirius", "Aurora", "Quantum", "Nebula"],
    "post-apocalyptique": ["Ash", "Raven", "Flint", "Echo", "Rust", "Ember", "Slate", "Willow", "Cinder", "Storm"],
    "contemporain": ["Alex", "Morgan", "Jordan", "Casey", "Taylor", "Riley", "Quinn", "Avery", "Cameron", "Reese"],
    "steampunk": ["Archibald", "Victoria", "Edison", "Amelia", "Bartholomew", "Eliza", "Cornelius", "Beatrice", "Thaddeus", "Josephine"],
    "cyberpunk": ["Neon", "Glitch", "Cipher", "Pixel", "Zero", "Matrix", "Hack", "Proxy", "Virus", "Chrome"],
    "mythologique": ["Perseus", "Athena", "Orion", "Persephone", "Theseus", "Artemis", "Hermes", "Gaia", "Apollo", "Selene"],
    "historique": ["William", "Eleanor", "Henry", "Catherine", "Richard", "Elizabeth", "Thomas", "Margaret", "Edward", "Anne"],
    "dystopique": ["Cipher", "Unity", "Proctor", "Harmony", "Sentinel", "Verity", "Monitor", "Concord", "Vigilant", "Purity"],
    "utopique": ["Harmony", "Zenith", "Aether", "Serenity", "Paragon", "Felicity", "Lumina", "Tranquil", "Virtue", "Prosper"]
  };

  // Traits de personnalité pour cet archétype
  const traitsArchetype = {
    "héros": ["courageux", "déterminé", "idéaliste", "loyal", "impulsif"],
    "mentor": ["sage", "patient", "mystérieux", "exigeant", "protecteur"],
    "allié": ["fidèle", "compétent", "humoristique", "pragmatique", "sceptique"],
    "antagoniste": ["ambitieux", "impitoyable", "charismatique", "calculateur", "vengeur"],
    "gardien": ["vigilant", "traditionnel", "inflexible", "honorable", "méfiant"],
    "messager": ["curieux", "neutre", "observateur", "adaptable", "insaisissable"],
    "ombre": ["tourmenté", "complexe", "imprévisible", "dangereux", "séduisant"]
  }[archetype];

  // Motivations possibles pour cet archétype
  const motivationsArchetype = {
    "héros": ["protéger les innocents", "venger un proche", "prouver sa valeur", "découvrir la vérité", "accomplir une prophétie"],
    "mentor": ["transmettre un savoir", "réparer une erreur passée", "préparer la nouvelle génération", "maintenir l'équilibre", "expier une faute"],
    "allié": ["aider un ami", "poursuivre un intérêt commun", "rembourser une dette", "trouver sa place", "fuir son passé"],
    "antagoniste": ["conquérir le pouvoir", "renverser l'ordre établi", "se venger d'une injustice", "imposer sa vision du monde", "obtenir l'immortalité"],
    "gardien": ["préserver un secret", "protéger un lieu sacré", "maintenir les traditions", "tester les héros", "respecter un serment"],
    "messager": ["délivrer une information cruciale", "observer les événements", "manipuler les protagonistes", "rétablir l'équilibre", "servir une entité supérieure"],
    "ombre": ["racheter son âme", "défier son destin", "semer le chaos", "tester ses limites", "survivre à tout prix"]
  }[archetype];

  // Sélectionner un nom en fonction du type d'univers
  const nomsUnivers = noms[univers.type] || noms["contemporain"];
  const nom = nomsUnivers[Math.floor((randomSeed % 600) / 600 * nomsUnivers.length)];

  // Sélectionner des traits de personnalité
  const nombreTraits = Math.floor((randomSeed % 700) / 700 * 2) + 1; // 1-2 traits
  const traitsSelectionnes = [];

  for (let i = 0; i < nombreTraits; i++) {
    const traitIndex = Math.floor((randomSeed % (800 + i * 100)) / (800 + i * 100) * traitsArchetype.length);
    traitsSelectionnes.push(traitsArchetype[traitIndex]);
  }

  // Sélectionner une motivation
  const motivationIndex = Math.floor((randomSeed % 900) / 900 * motivationsArchetype.length);
  const motivation = motivationsArchetype[motivationIndex];

  // Créer une description du personnage
  const description = `${nom} est un personnage ${traitsSelectionnes.join(" et ")}. En tant que ${archetype}, ${nom} est motivé par le désir de ${motivation}.`;

  // Créer l'objet personnage
  const personnage = {
    nom: nom,
    archetype: archetype,
    traits: traitsSelectionnes,
    motivation: motivation,
    description: description
  };

  return personnage;
}

/**
 * Crée une structure narrative complète
 */
function creerStructureNarrative(keywordsList, univers, personnages, randomSeed) {
  // Structures narratives possibles
  const structures = [
    "voyage du héros",
    "quête",
    "vengeance",
    "transformation",
    "rivalité",
    "énigme",
    "tragédie",
    "renaissance"
  ];

  // Sélectionner une structure narrative
  const structureIndex = Math.floor((randomSeed % 1000) / 1000 * structures.length);
  const structure = structures[structureIndex];

  // Nombre de chapitres (4-6 pour garantir 48 pages)
  const nombreChapitres = 4; // Fixé à 4 chapitres pour avoir exactement 48 pages (12 pages par chapitre)

  // Créer les étapes de la structure narrative
  const etapes = [];

  switch (structure) {
    case "voyage du héros":
      etapes.push("Le monde ordinaire");
      etapes.push("L'appel à l'aventure");
      etapes.push("Le refus de l'appel");
      etapes.push("La rencontre avec le mentor");
      etapes.push("Le passage du premier seuil");
      etapes.push("Épreuves, alliés et ennemis");
      etapes.push("L'approche de la caverne intime");
      etapes.push("L'épreuve suprême");
      etapes.push("La récompense");
      etapes.push("Le chemin du retour");
      etapes.push("La résurrection");
      etapes.push("Le retour avec l'élixir");
      break;
    case "quête":
      etapes.push("La mission est confiée");
      etapes.push("Formation du groupe");
      etapes.push("Voyage vers l'objectif");
      etapes.push("Obstacles et défis");
      etapes.push("Trahison interne");
      etapes.push("Perte d'espoir");
      etapes.push("Regain de motivation");
      etapes.push("Approche finale");
      etapes.push("Confrontation avec le gardien");
      etapes.push("Obtention de l'objet de la quête");
      etapes.push("Fuite et poursuite");
      etapes.push("Retour triomphal");
      break;
    case "vengeance":
      etapes.push("L'acte injuste");
      etapes.push("La perte");
      etapes.push("Le serment de vengeance");
      etapes.push("La préparation");
      etapes.push("La traque");
      etapes.push("Les victimes collatérales");
      etapes.push("Le doute");
      etapes.push("La découverte d'une vérité cachée");
      etapes.push("Le choix moral");
      etapes.push("La confrontation");
      etapes.push("La vengeance accomplie ou abandonnée");
      etapes.push("Les conséquences");
      break;
    default:
      // Structure générique pour les autres types
      etapes.push("Introduction du monde et des personnages");
      etapes.push("Présentation du conflit principal");
      etapes.push("Premier obstacle");
      etapes.push("Développement des relations");
      etapes.push("Complication majeure");
      etapes.push("Moment de vérité");
      etapes.push("Crise d'identité");
      etapes.push("Découverte importante");
      etapes.push("Point de non-retour");
      etapes.push("Préparation pour l'affrontement final");
      etapes.push("Climax");
      etapes.push("Résolution et nouveau statut quo");
  }

  // Créer la structure narrative complète
  const structureNarrative = {
    type: structure,
    nombreChapitres: nombreChapitres,
    etapes: etapes,
    description: `Une histoire structurée comme un(e) ${structure}, suivant un parcours en ${nombreChapitres} chapitres.`
  };

  return structureNarrative;
}

/**
 * Génère des chapitres détaillés pour le scénario
 */
function genererChapitresDetailles(structureNarrative, univers, personnages, randomSeed) {
  const chapitres = [];
  const nombreChapitres = structureNarrative.nombreChapitres;
  const etapes = structureNarrative.etapes;
  const pagesParChapitre = 12; // Fixé à 12 pages par chapitre pour avoir exactement 48 pages

  // Titres possibles pour les chapitres
  const modelesTitres = [
    "Chapitre [N]: [Étape]",
    "[Étape]",
    "Le temps de [Étape]",
    "Quand [Étape]",
    "L'heure de [Étape]"
  ];

  // Générer chaque chapitre
  for (let i = 0; i < nombreChapitres; i++) {
    // Sélectionner un modèle de titre
    const modeleIndex = Math.floor((randomSeed % (1100 + i * 100)) /