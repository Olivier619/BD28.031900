/**
 * Fonction pour générer un scénario détaillé comme le ferait une IA spécialisée
 * S'assure que la fonction est bien attachée à l'objet window.
 */
window.generateScenarioDetaille = async function(keywords) {
    try {
        console.log("generateScenarioDetaille: Démarrage de la génération pour : " + keywords);

        // Ajouter un facteur d'aléatoire renforcé pour garantir l'unicité du scénario
        const randomSeed = Date.now() + Math.floor(Math.random() * 1000000);
        console.log("generateScenarioDetaille: Seed aléatoire généré: " + randomSeed);

        // Traitement des mots-clés (simple split pour l'exemple)
        const keywordsList = keywords.toLowerCase().split(/[ ,\n]+/).filter(k => k.trim().length > 0);
         console.log("generateScenarioDetaille: Mots-clés traités: ", keywordsList);


        // --- Simulation de génération ---
        // Remplacer ceci par votre logique de génération réelle si nécessaire
        // ou utiliser cette simulation pour tester l'intégration.

        // Génération d'un titre créatif basé sur les mots-clés
        let title = genererTitreCreatif(keywordsList, randomSeed);
         console.log("generateScenarioDetaille: Titre généré: ", title);

        // Création d'un univers cohérent basé sur les mots-clés
        const univers = creerUnivers(keywordsList, randomSeed);
         console.log("generateScenarioDetaille: Univers généré: ", univers);

        // Création des personnages principaux
        const personnages = creerPersonnages(keywordsList, univers, randomSeed);
         console.log("generateScenarioDetaille: Personnages générés: ", personnages);

        // Création d'une structure narrative
        const structureNarrative = creerStructureNarrative(keywordsList, univers, personnages, randomSeed);
         console.log("generateScenarioDetaille: Structure narrative générée: ", structureNarrative);


        // Génération des chapitres détaillés
        const chapitres = genererChapitresDetailles(structureNarrative, univers, personnages, randomSeed);
         console.log("generateScenarioDetaille: Chapitres générés: ", chapitres);


        // Construction de l'objet scénario complet
        const scenario = {
            title: title,
            theme: keywords, // Conserver les mots-clés originaux comme thème
            univers: univers,
            personnages: personnages,
            structureNarrative: structureNarrative,
            chapters: chapitres,
            generatedAt: new Date().toISOString() // Utiliser ISO string pour standardisation
        };

        console.log("generateScenarioDetaille: Scénario final généré:", scenario);
         // Petite pause pour simuler un traitement asynchrone plus long si nécessaire
         await new Promise(resolve => setTimeout(resolve, 50)); // 50ms de pause

        return scenario;

    } catch (error) {
        console.error("generateScenarioDetaille: Erreur majeure lors de la génération:", error);
         alert("Une erreur interne est survenue lors de la génération du scénario. Vérifiez la console.");
        return null; // Renvoyer null en cas d'erreur
    }
}

// --- Fonctions auxiliaires (inchangées par rapport à votre version) ---

/**
 * Génère un titre créatif basé sur les mots-clés
 */
function genererTitreCreatif(keywordsList, randomSeed) {
    const titresCreatifs = [
        "Les Chroniques oubliées de [Mot-clé]", "L'Odyssée stellaire de [Mot-clé]", "Le Secret enfoui des [Mot-clé]",
        "Au-delà des terres de [Mot-clé]", "[Mot-clé] et la Prophétie Écarlate", "Les Gardiens du dernier [Mot-clé]",
        "L'Éveil sombre de [Mot-clé]", "La Prophétie des Anciens : [Mot-clé]", "Le Dernier Voyage vers [Mot-clé]",
        "L'Écho Silencieux des [Mot-clé]", "Sous le Ciel de [Mot-clé]", "[Mot-clé] : L'Héritage Perdu"
    ];
    const modeleIndex = Math.floor(pseudoRandom(randomSeed) * titresCreatifs.length);
    let modele = titresCreatifs[modeleIndex];
    const keyword = keywordsList.length > 0 ? keywordsList[Math.floor(pseudoRandom(randomSeed + 1) * keywordsList.length)] : "Mystère";
    const keywordCapitalized = keyword.charAt(0).toUpperCase() + keyword.slice(1);
    return modele.replace("[Mot-clé]", keywordCapitalized);
}


/**
 * Crée un univers cohérent basé sur les mots-clés
 */
function creerUnivers(keywordsList, randomSeed) {
    const typesUnivers = [
        "médiéval-fantastique", "science-fiction", "post-apocalyptique", "contemporain",
        "steampunk", "cyberpunk", "mythologique", "historique", "dystopique", "utopique",
        "horreur cosmique", "western spaghetti", "polar noir", "space opera"
    ];
    let detectedType = "contemporain"; // Défaut
    const typeKeywords = {
        "science-fiction": ["futur", "robot", "espace", "vaisseau", "alien", "cyborg", "planète", "laser"],
        "médiéval-fantastique": ["dragon", "magie", "elfe", "château", "chevalier", "épée", "sorcier", "quête"],
        "post-apocalyptique": ["apocalypse", "survie", "ruine", "mutant", "désert", "dévasté", "zone"],
        "steampunk": ["vapeur", "engrenage", "victorien", "dirigeable", "mécanique", "automate"],
        "cyberpunk": ["néon", "implant", "hacker", "corporation", "dystopie", "virtuel", "augmenté"],
        "horreur cosmique": ["cthulhu", "lovecraft", "indicible", "folie", "ancien", "abomination"]
    };
     // Détection simple basée sur les mots-clés
    for (const type in typeKeywords) {
         if (keywordsList.some(kw => typeKeywords[type].includes(kw))) {
            detectedType = type;
            break;
         }
    }
    // Si aucun type n'est détecté, choisir aléatoirement (ou rester sur contemporain)
     if (detectedType === "contemporain" && keywordsList.length > 2) { // Éviter aléatoire si peu de mots-clés
         detectedType = typesUnivers[Math.floor(pseudoRandom(randomSeed + 2) * typesUnivers.length)];
     }

    const caracteristiques = {
        "médiéval-fantastique": { epoque: "Âge des légendes", technologie: "Limitée, magie omniprésente", particularites: "Créatures mythiques, royaumes en guerre", lieux: ["Forêt enchantée", "Citadelle Naine", "Tour de Sorcier", "Village Fortifié", "Ruines Elfiques"] },
        "science-fiction": { epoque: "XXVème siècle", technologie: "Très avancée, IA, voyages FTL", particularites: "Exploration spatiale, fédérations galactiques", lieux: ["Station Spatiale Orbitale", "Planète Jungle luxuriante", "Mégapole Flottante", "Laboratoire de Xéno-biologie", "Vaisseau Colonial Générationnel"] },
        "post-apocalyptique": { epoque: "200 ans après 'Le Grand Effondrement'", technologie: "Vestiges et bricolages", particularites: "Factions hostiles, ressources rares", lieux: ["Ville en Ruines Recouvertes de Végétation", "Abri Souterrain Communautaire", "Désert de Verre Radioactif", "Forteresse de Pillards", "Oasis Cachée"] },
        "contemporain": { epoque: "Aujourd'hui", technologie: "Actuelle", particularites: "Intrigues urbaines, surnaturel discret possible", lieux: ["Café branché du centre-ville", "Vieil entrepôt désaffecté", "Parc municipal paisible", "Bibliothèque universitaire", "Quartier résidentiel calme"] },
        "steampunk": { epoque: "Ère Victorienne Alternative (1888)", technologie: "Mécanique à vapeur avancée", particularites: "Inventions extravagantes, société de classes marquée", lieux: ["Usine Horlogère Géante", "Salon d'Inventeur Excentrique", "Docks Brumeux et Dangereux", "Palais Aérien de l'Aristocratie", "Observatoire Automate"] },
        "cyberpunk": { epoque: "Néo-Kyoto, 2077", technologie: "Implants cybernétiques, réseaux neuronaux", particularites: "Mégacorporations toutes puissantes, bas-fonds dangereux", lieux: ["Marché Noir Souterrain Illuminé aux Néons", "Tour Corporative Impénétrable", "Bar Clandestin pour Hackers", "Autoroute Virtuelle du Net", "Clinique d'Augmentation Illégale"] },
         // Ajouter les autres types ici...
        "mythologique": { epoque: "Temps des Mythes Grecs", technologie: "Artefacts divins", particularites: "Héros demi-dieux, monstres légendaires", lieux: ["Mont Olympe", "Labyrinthe de Crète", "Enfers", "Île des Sirènes", "Temple de Delphes"] },
        "horreur cosmique": { epoque: "Nouvelle-Angleterre, 1920", technologie: "Début XXe", particularites: "Sectes occultes, savoir interdit", lieux: ["Manoir Isolé et Hanté", "Village de Pêcheurs Dégénéré", "Bibliothèque Occulte Poussiéreuse", "Dimension Cauchemardesque", "Cercle de Monolithes Anciens"] },
         "polar noir": { epoque: "Los Angeles, 1940", technologie: "Après-guerre", particularites: "Femmes fatales, détectives désabusés", lieux: ["Bureau de Détective Privé Fumeux", "Club de Jazz Clandestin", "Villa d'un Magnat Corrompu", "Ruelle Sombre et Pluvieuse", "Commissariat Central"] },
         "western spaghetti": { epoque: "Ouest Sauvage, vers 1870", technologie: "Colts et dynamite", particularites: "Chasseurs de primes, duels au soleil", lieux: ["Ville Fantôme Poussiéreuse", "Saloon Bagarreur", "Canyon Isolé", "Ranch Fortifié", "Train à Vapeur Attaqué"] },
          "space opera": { epoque: "Millénaire Lointain", technologie: "Sabres laser, Force mystique", particularites: "Empire galactique vs Rébellion", lieux: ["Pont d'un Croiseur Stellaire", "Planète Désertique", "Cité dans les Nuages", "Académie Spatiale", "Temple Ancien sur une Lune"] },
          // etc. pour historique, dystopique, utopique...
          "historique": { epoque: "Rome Antique (70 ap. J.-C.)", technologie: "Romaine", particularites: "Intrigues politiques, gladiateurs", lieux: ["Colisée", "Forum Romain", "Villa Patricienne", "Thermes Publics", "Camp Militaire"] },
          "dystopique": { epoque: "République Unifiée, 2140", technologie: "Contrôle total via la technologie", particularites: "Surveillance constante, pensée unique", lieux: ["Centre de Conformité", "Zone d'Habitation Modulaire", "Ministère de la Vérité", "Camp de Rééducation", "Marché Noir Clandestin"] },
           "utopique": { epoque: "Arcadie Prime, 3000", technologie: "Intégrée et écologique", particularites: "Société harmonieuse en apparence", lieux: ["Jardins Flottants", "Centre de Méditation Communautaire", "Bibliothèque Holistique", "Habitat Bio-Dôme", "Source d'Énergie Cristalline"] }
    };
    const universData = caracteristiques[detectedType] || caracteristiques["contemporain"]; // Fallback
    return {
        type: detectedType,
        ...universData,
        description: `Un univers ${detectedType} ${universData.epoque ? `se déroulant vers ${universData.epoque}` : ''}. Les particularités incluent : ${universData.particularites}. Technologie ${universData.technologie}.`
    };
}

/**
 * Crée des personnages principaux
 */
 function creerPersonnages(keywordsList, univers, randomSeed) {
    const archetypes = ["héros", "mentor", "allié", "antagoniste", "ombre", "gardien", "messager", "caméléon"];
    const traits = {
        "héros": ["courageux", "déterminé", "altruiste", "loyal", "impulsif", "naïf", "tourmenté par un choix"],
        "mentor": ["sage", "expérimenté", "patient", "énigmatique", "exigeant", "protecteur", "fatigué du monde"],
        "allié": ["fidèle", "compétent", "optimiste", "pragmatique", "comique", "sceptique", "taciturne"],
        "antagoniste": ["ambitieux", "impitoyable", "charismatique", "manipulateur", "convaincu de son bon droit", "tragique", "avide"],
        "ombre": ["complexe", "imprévisible", "moralement ambigu", "séduisant", "dangereux", "brisé", "en quête de rédemption"],
        // Ajouter d'autres archétypes
         "gardien": ["vigilant", "stoïque", "traditionnel", "inflexible", "dévoué", "secret"],
         "messager": ["rapide", "neutre", "observateur", "porteur de nouvelles", "insaisissable"],
          "caméléon": ["adaptable", "trompeur", "opportuniste", "changeant", "mystérieux"]
    };
    const motivations = {
        "héros": ["sauver le monde", "protéger ses proches", "venger une injustice", "découvrir la vérité sur soi", "accomplir son destin"],
        "mentor": ["guider le héros", "réparer une erreur passée", "préparer la relève", "maintenir un équilibre fragile", "transmettre un savoir perdu"],
        "allié": ["soutenir le héros par amitié/amour", "atteindre un but personnel lié", "rembourser une dette", "fuir quelque chose", "prouver sa valeur"],
        "antagoniste": ["dominer le monde", "imposer sa vision idéologique", "se venger de la société/du héros", "obtenir un pouvoir ultime", "recréer un être cher perdu"],
        "ombre": ["trouver la rédemption", "survivre à tout prix", "défier les attentes", "semer le chaos pour une raison cachée", "protéger un secret inavouable"],
         // Ajouter d'autres motivations
         "gardien": ["protéger un lieu/objet sacré", "maintenir un ordre ancien", "respecter un serment ancestral", "tester la valeur des autres"],
         "messager": ["accomplir une mission divine/importante", "observer sans interférer", "jouer un double jeu", "répandre une information clé"],
          "caméléon": ["s'enrichir", "gagner en influence", "survivre en s'adaptant", "servir ses propres intérêts cachés"]
    };
     // Noms adaptés à l'univers
     const nomsParUnivers = { /* ... (similaire à avant, mais peut-être plus variés) ... */
         "médiéval-fantastique": ["Aeliana", "Borin", "Lyra", "Kael", "Seraphina", "Roric"],
         "science-fiction": ["Jax", "Cyra", "Orion", "Nova", "Unit 7", "Zara"],
         "post-apocalyptique": ["Ash", "Echo", "Raze", "Willow", "Spike", "Hope"],
          "cyberpunk": ["Kaito", "Glitch", "Anya", "Jax", "Silas", "Chrome"],
           "steampunk": ["Isambard", "Ada", "Phileas", "Evangeline", "Barnaby", "Clara"],
           // Ajouter pour les autres types
           "contemporain": ["Alex", "Chloe", "Marcus", "Sophie", "Ryan", "Isabelle"],
           "mythologique": ["Achille", "Cassandre", "Ulysse", "Hélène", "Jason", "Médée"],
           "horreur cosmique": ["Randolph", "Abigail", "Herbert", "Eleanor", "Walter", "Lavinia"],
            "polar noir": ["Jake", "Vivian", "Mickey", "Lauren", "Eddie", "Gloria"],
            "western spaghetti": ["Django", "Carmen", "Jedediah", "Abigail", "Cole", "Esperanza"],
             "space opera": ["Zark", "Leia", "Han", "Mara", "Dash", "Asajj"],
             "historique": ["Lucius", "Cornelia", "Maximus", "Livia", "Decimus", "Octavia"], // Rome
             "dystopique": ["Numéro 6", "Julia", "Winston", "Theta-7", "Kass", "Unit-Sigma"],
             "utopique": ["Lyra", "Orion", "Serenity", "Aether", "Kai", "Elara"]
     };

    const nombrePersonnages = Math.floor(pseudoRandom(randomSeed + 3) * 3) + 3; // 3 à 5 personnages
    const personnages = [];
    const archetypesPossibles = [...archetypes]; // Copie pour pouvoir retirer des éléments

     // Assurer un héros et un antagoniste (si possible)
     const heroArchetype = "héros";
     const antagonistArchetype = "antagoniste";
     personnages.push(creerPersonnageDetaille(heroArchetype, univers, keywordsList, randomSeed + 4, nomsParUnivers, traits, motivations));
     archetypesPossibles.splice(archetypesPossibles.indexOf(heroArchetype), 1);
     personnages.push(creerPersonnageDetaille(antagonistArchetype, univers, keywordsList, randomSeed + 5, nomsParUnivers, traits, motivations));
     archetypesPossibles.splice(archetypesPossibles.indexOf(antagonistArchetype), 1);


    for (let i = 2; i < nombrePersonnages; i++) {
        const archetypeIndex = Math.floor(pseudoRandom(randomSeed + 6 + i) * archetypesPossibles.length);
        const selectedArchetype = archetypesPossibles.splice(archetypeIndex, 1)[0]; // Retire l'archétype choisi
         if (selectedArchetype) { // Vérifier si un archétype a bien été sélectionné
            personnages.push(creerPersonnageDetaille(selectedArchetype, univers, keywordsList, randomSeed + 7 + i * 2, nomsParUnivers, traits, motivations));
         }
    }

    return personnages;
}

/**
 * Crée un personnage individuel détaillé
 */
function creerPersonnageDetaille(archetype, univers, keywordsList, randomSeed, nomsParUnivers, allTraits, allMotivations) {
    const nomsUnivers = nomsParUnivers[univers.type] || nomsParUnivers["contemporain"];
    const nom = nomsUnivers[Math.floor(pseudoRandom(randomSeed) * nomsUnivers.length)];

    const traitsArchetype = allTraits[archetype] || ["adaptable"];
    const nombreTraits = Math.floor(pseudoRandom(randomSeed + 1) * 2) + 2; // 2-3 traits
    const traitsSelectionnes = [];
    const traitsDisponibles = [...traitsArchetype];
    for (let i = 0; i < nombreTraits && traitsDisponibles.length > 0; i++) {
        const traitIndex = Math.floor(pseudoRandom(randomSeed + 2 + i) * traitsDisponibles.length);
        traitsSelectionnes.push(traitsDisponibles.splice(traitIndex, 1)[0]);
    }

    const motivationsArchetype = allMotivations[archetype] || ["survivre"];
    const motivation = motivationsArchetype[Math.floor(pseudoRandom(randomSeed + 3) * motivationsArchetype.length)];

     // Générer apparence et trait distinctif plus spécifiques à l'univers
     const apparence = genererApparence(univers.type, archetype, randomSeed + 4);
     const traitDistinctif = genererTraitDistinctif(univers.type, archetype, randomSeed + 5);


    const description = `${nom} (${archetype}) : ${apparence}. ${traitsSelectionnes.join(', ')}. Trait distinctif : ${traitDistinctif}. Motivation principale : ${motivation}.`;

    return { nom, archetype, traits: traitsSelectionnes, motivation, description, apparence, traitDistinctif };
}

 // Fonctions pour générer apparence et trait distinctif (exemples)
 function genererApparence(typeUnivers, archetype, seed) {
     const apparencesBase = ["regard intense", "cicatrice discrète", "sourire énigmatique", "allure athlétique", "démarche assurée", "air pensif"];
     const apparencesParUnivers = {
        "médiéval-fantastique": ["armure gravée", "cape élimée", "yeux luisants de magie", "tatouages runiques"],
        "science-fiction": ["uniforme high-tech", "implants cybernétiques visibles", "combinaison spatiale usée", "coiffure futuriste"],
        "post-apocalyptique": ["vêtements rapiécés", "masque à gaz", "peau burinée par les éléments", "équipement de survie"],
         "cyberpunk": ["manteau long en cuir synthétique", "lunettes de réalité augmentée", "cheveux aux couleurs néon", "bras mécanique chromé"],
          "steampunk": ["haut-de-forme avec lunettes intégrées", "robe à corset et rouages", "bras mécanique en laiton", "montre à gousset complexe"],
           // Ajouter d'autres...
           "contemporain": ["jean et t-shirt", "costume bien coupé", "look décontracté", "style artistique"],
           "mythologique": ["toge simple", "armure de bronze étincelante", "couronne de laurier", "peau dorée par le soleil"],
           "horreur cosmique": ["pardessus sombre", "air maladif", "yeux cernés par l'insomnie", "vêtements démodés"],
            "polar noir": ["imperméable et feutre mou", "robe de soirée élégante", "costume à rayures", "regard dur"],
            "western spaghetti": ["poncho poussiéreux", "chapeau de cowboy usé", "ceinturon avec colt", "robe de saloon"],
             "space opera": ["uniforme militaire strict", "tenue de pilote rebelle", "robe sénatoriale élégante", "armure mandalorienne"],
             "historique": ["tunique romaine", "armure de légionnaire", "stola patricienne", "vêtements de travailleur"], // Rome
             "dystopique": ["uniforme gris terne", "combinaison numérotée", "vêtements de rebelle discrets", "manteau d'agent de contrôle"],
             "utopique": ["tunique blanche et fluide", "combinaison ajustée aux lignes épurées", "vêtements en fibres naturelles", "bijoux minimalistes lumineux"]
     };
     const possibles = [...apparencesBase, ...(apparencesParUnivers[typeUnivers] || [])];
     return possibles[Math.floor(pseudoRandom(seed) * possibles.length)];
 }

  function genererTraitDistinctif(typeUnivers, archetype, seed) {
     const traitsBase = ["boitille légèrement", "a un tic nerveux", "parle avec un accent particulier", "collectionne des objets étranges", "fredonne souvent"];
     const traitsParUnivers = {
         "médiéval-fantastique": ["porte une amulette mystérieuse", "a une affinité avec les animaux", "peut sentir la magie", "cicatrice de brûlure magique"],
         "science-fiction": ["possède une IA personnelle intégrée", "a des réflexes surhumains dus à des implants", "parle plusieurs langues galactiques", "hologramme personnel vacillant"],
         "post-apocalyptique": ["mange de la nourriture suspecte sans sourciller", "connaît les ruines comme sa poche", "a un compteur Geiger qui crépite", "regard hanté"],
          "cyberpunk": ["interface neurale visible sur la tempe", "addiction aux stimulants de combat", "a un drone de surveillance personnel", "tousse à cause de la pollution"],
          "steampunk": ["remonte constamment une montre mécanique", "sent l'huile et la vapeur", "a une prothèse qui siffle", "transporte une caisse à outils décorée"],
          // Ajouter d'autres...
           "contemporain": ["toujours un café à la main", "connaît tous les ragots", "expert en technologie", "ne sort jamais sans son carnet"],
           "mythologique": ["brille d'une faible aura divine", "peut parler aux animaux mythiques", "porte la marque d'un dieu", "ne saigne pas normalement"],
           "horreur cosmique": ["murmure des phrases incohérentes", "dessine des symboles étranges", "a peur des angles droits", "regard vide et lointain"],
            "polar noir": ["fume cigarette sur cigarette", "joue avec un jeton de poker", "a toujours une réplique cynique prête", "regard las"],
            "western spaghetti": ["crache souvent par terre", "mâchonne un brin d'herbe", "dégaine incroyablement vite", "joue de l'harmonica"],
             "space opera": ["pilote hors pair", "expert en contrebande", "sensible à la Force", "parle aux droïdes"],
             "historique": ["cite des philosophes grecs", "expert en stratégie militaire romaine", "connaît les rumeurs du Sénat", "porte une bague de légionnaire"], // Rome
             "dystopique": ["évite les caméras de surveillance", "utilise un langage codé", "regard méfiant", "cicatrice de punition"],
             "utopique": ["air serein presque troublant", "communique par télépathie faible", "se déplace silencieusement", "connaissances encyclopédiques"]
     };
      const possibles = [...traitsBase, ...(traitsParUnivers[typeUnivers] || [])];
     return possibles[Math.floor(pseudoRandom(seed) * possibles.length)];
 }


/**
 * Crée une structure narrative complète
 */
function creerStructureNarrative(keywordsList, univers, personnages, randomSeed) {
    const structures = [
        "voyage du héros", "quête initiatique", "enquête mystérieuse", "lutte contre l'oppression",
        "histoire de vengeance", "transformation personnelle", "rivalité destructrice", "amour interdit",
        "survie en milieu hostile", "récit de création/chute"
    ];
     // Détection simple de structure
     let detectedStructure = "quête initiatique"; // Défaut
     if (keywordsList.includes("enquête") || keywordsList.includes("mystère") || keywordsList.includes("détective")) detectedStructure = "enquête mystérieuse";
     if (keywordsList.includes("rébellion") || keywordsList.includes("tyran") || keywordsList.includes("liberté")) detectedStructure = "lutte contre l'oppression";
     if (keywordsList.includes("vengeance") || keywordsList.includes("trahison")) detectedStructure = "histoire de vengeance";
     if (keywordsList.includes("survie") || keywordsList.includes("désastre")) detectedStructure = "survie en milieu hostile";
     // Si aucune structure détectée, choisir aléatoirement
     if (detectedStructure === "quête initiatique") {
         detectedStructure = structures[Math.floor(pseudoRandom(randomSeed + 10) * structures.length)];
     }


    // Adapter le nombre d'actes/chapitres si besoin
    const nombreChapitres = 4; // Fixé pour 48 pages
    const pointsCleParStructure = {
        "voyage du héros": ["Monde Ordinaire", "Appel & Refus", "Mentor & Seuil", "Épreuves & Alliés", "Approche Caverne", "Ordalie", "Récompense", "Retour & Résurrection", "Élixir"],
        "quête initiatique": ["La Mission", "Formation Équipe", "Voyage & Obstacles", "Perte & Doute", "Révélation Intérieure", "Confrontation Gardien", "Objectif Atteint", "Fuite & Sacrifice", "Retour Transformé"],
        "enquête mystérieuse": ["Le Crime/Mystère", "Premiers Indices", "Fausses Pistes", "Témoin Clé", "Danger Croissant", "Confrontation Suspect", "Révélation Choc", "Course Contre la Montre", "Résolution & Conséquences"],
        "lutte contre l'oppression": ["Vie sous l'Oppression", "Incident Déclencheur", "Rejoindre la Résistance", "Première Action & Échec", "Trahison & Capture", "Évasion & Ralliement", "Planification Attaque Finale", "Bataille Décisive", "Nouvel Ordre (ou pas)"],
         // Ajouter d'autres points clés...
         "histoire de vengeance": ["L'Offense Originelle", "Le Serment", "Préparation & Entraînement", "Traque & Premières Victimes", "Dilemme Moral", "Découverte Troublante", "Confrontation Finale", "Vengeance Assouvie (ou non)", "Le Vide d'Après"],
         "transformation personnelle": ["Vie Insatisfaisante", "Catalyseur du Changement", "Résistance & Rechute", "Acceptation & Effort", "Point de Non-Retour", "Épreuve de Vérité", "Intégration du Changement", "Nouvelle Identité", "Impact sur le Monde"],
         "rivalité destructrice": ["Origine de la Rivalité", "Première Confrontation", "Escalade", "Sabotage Mutuel", "Implication des Proches", "Point de Rupture", "Duel Final", "Destruction Mutuelle (ou Rédemption)", "Conséquences pour l'Entourage"],
         "amour interdit": ["Rencontre Fortuite", "Attirance & Obstacles", "Moments Volés", "Découverte & Scandale", "Séparation Forcée", "Tentative de Réunion", "Sacrifice Ultime", "Union (ou Tragédie)", "Postérité"],
         "survie en milieu hostile": ["Le Désastre", "Isolement & Prise de Conscience", "Recherche de Ressources", "Rencontre (Ami ou Ennemi)", "Menace Environnementale", "Perte d'Espoir", "Ingéniosité & Découverte", "Confrontation avec la Menace", "Sauvetage (ou Adaptation Finale)"],
         "récit de création/chute": ["L'Âge d'Or", "Le Premier Signe de Déclin", "Tentatives de Maintien", "La Grande Erreur", "Accélération de la Chute", "Le Chaos", "Tentative de Reconstruction", "Vestiges & Leçons", "Nouveau Cycle (?)"]
    };

     const etapes = pointsCleParStructure[detectedStructure] || pointsCleParStructure["quête initiatique"]; // Fallback
     // Distribution plus logique des étapes sur 4 chapitres
     const etapesParChapitre = Math.ceil(etapes.length / nombreChapitres);
     const etapesDistribuees = [];
     for(let i=0; i<nombreChapitres; i++){
         const debut = i * etapesParChapitre;
         const fin = Math.min(debut + etapesParChapitre, etapes.length);
         etapesDistribuees.push(etapes.slice(debut, fin).join(' / ')); // Regrouper les étapes par chapitre
     }


    return {
        type: detectedStructure,
        nombreChapitres: nombreChapitres,
        etapesParChapitre: etapesDistribuees, // Utiliser les étapes regroupées
        description: `Une histoire de type "${detectedStructure}" en ${nombreChapitres} chapitres.`
    };
}


/**
 * Génère des chapitres détaillés
 */
function genererChapitresDetailles(structureNarrative, univers, personnages, randomSeed) {
    const chapitres = [];
    const nombreChapitres = structureNarrative.nombreChapitres;
    const etapesChapitres = structureNarrative.etapesParChapitre; // Utiliser les étapes regroupées
    const pagesParChapitre = 12; // 48 pages / 4 chapitres
    let numeroPageGlobal = 1;

    const modelesTitres = [
        "Chapitre [N] : [Étape]", "L'Ombre de [Étape]", "Vers [Étape]",
        "Le Prix de [Étape]", "[Étape] et Conséquences"
    ];

    for (let i = 0; i < nombreChapitres; i++) {
        const etapeCourante = etapesChapitres[i]; // Titre basé sur les étapes du chapitre
         // Titre plus simple si les étapes sont trop longues
         let titreChapitre = etapeCourante.length > 30 ? `Chapitre ${i+1}` : etapeCourante;
         // Ou utiliser les modèles
         // const modeleIndex = Math.floor(pseudoRandom(randomSeed + 20 + i) * modelesTitres.length);
         // let titre = modelesTitres[modeleIndex].replace("[N]", (i + 1).toString()).replace("[Étape]", titreChapitre);


        const pages = [];
        for (let j = 0; j < pagesParChapitre; j++) {
             // Passer l'étape spécifique du chapitre à la génération de page
            pages.push(genererPage(numeroPageGlobal, i + 1, j + 1, univers, personnages, etapeCourante, randomSeed + numeroPageGlobal));
            numeroPageGlobal++;
        }

        chapitres.push({
            numero: i + 1,
            titre: `Chapitre ${i+1}: ${titreChapitre}`, // Titre plus descriptif
            etape: etapeCourante, // Garder les étapes regroupées
            pages: pages,
            resume: `Ce chapitre se concentre sur "${etapeCourante}", progressant dans l'intrigue principale.`
        });
    }
    return chapitres;
}

/**
 * Génère le contenu d'une page individuelle
 */
function genererPage(numeroGlobal, numeroChapitre, numeroLocal, univers, personnages, etapeChapitre, randomSeed) {
    const nombreCases = Math.floor(pseudoRandom(randomSeed) * 4) + 3; // 3 à 6 cases
    const cases = [];
    const personnagesPrincipaux = personnages.filter(p => p.archetype === 'héros' || p.archetype === 'antagoniste');
    const autresPersonnages = personnages.filter(p => p.archetype !== 'héros' && p.archetype !== 'antagoniste');


    for (let k = 0; k < nombreCases; k++) {
        // Sélectionner les personnages pour cette case (plus de logique possible)
         let personnagesPresents = [];
         const nbPersoCase = Math.floor(pseudoRandom(randomSeed + k + 1) * 2) + 1; // 1 ou 2 persos le plus souvent
         if (personnagesPrincipaux.length > 0 && pseudoRandom(randomSeed + k + 2) > 0.3) { // Probabilité d'inclure un perso principal
             personnagesPresents.push(personnagesPrincipaux[Math.floor(pseudoRandom(randomSeed + k + 3) * personnagesPrincipaux.length)]);
         }
         while(personnagesPresents.length < nbPersoCase && autresPersonnages.length > 0) {
             const autrePerso = autresPersonnages[Math.floor(pseudoRandom(randomSeed + k + 4 + personnagesPresents.length) * autresPersonnages.length)];
             if (!personnagesPresents.includes(autrePerso)) {
                 personnagesPresents.push(autrePerso);
             }
              // Petite sécurité pour éviter boucle infinie si peu de persos uniques
              if (personnagesPresents.length >= personnages.length) break;
         }
         // Si toujours vide (rare), prendre le héros ou le premier perso
          if (personnagesPresents.length === 0 && personnages.length > 0) {
              personnagesPresents.push(personnages.find(p => p.archetype === 'héros') || personnages[0]);
          }


         // Passer l'étape du chapitre pour contexte
        cases.push(genererCase(numeroGlobal, k + 1, univers, personnagesPresents, etapeChapitre, randomSeed + k * 10));
    }
    return {
        numeroGlobal: numeroGlobal,
        numeroChapitre: numeroChapitre,
        numeroLocal: numeroLocal,
        cases: cases,
        // Description de page plus générale
        description: `Page ${numeroGlobal}, Chap. ${numeroChapitre}. Progression autour de : "${etapeChapitre}".`
    };
}


/**
 * Génère le contenu d'une case individuelle
 */
 function genererCase(numeroPage, numeroCase, univers, personnagesPresents, etapeChapitre, randomSeed) {
    const typesPlans = ["plan large", "plan moyen", "gros plan", "plan d'ensemble", "plongée", "contre-plongée", "plan américain", "très gros plan (insert)"];
    const typePlan = typesPlans[Math.floor(pseudoRandom(randomSeed) * typesPlans.length)];
    const lieu = univers.lieux[Math.floor(pseudoRandom(randomSeed + 1) * univers.lieux.length)];

     let dialogue = null;
     // Plus de chance de dialogue si plusieurs personnages ou si gros plan
     if (personnagesPresents.length > 1 || (typePlan.includes("gros plan") && pseudoRandom(randomSeed + 2) > 0.3) ) {
         if (pseudoRandom(randomSeed + 3) > 0.4) { // 60% de chance
             const persoQuiParle = personnagesPresents[Math.floor(pseudoRandom(randomSeed + 4) * personnagesPresents.length)];
             dialogue = {
                 personnage: persoQuiParle.nom,
                 texte: genererLigneDialogue(persoQuiParle, etapeChapitre, randomSeed + 5)
             };
         }
     }

     const narration = genererNarration(univers, lieu, personnagesPresents, etapeChapitre, dialogue, randomSeed + 6);
     const descriptionVisuelle = genererDescriptionVisuelle(typePlan, lieu, personnagesPresents, etapeChapitre, dialogue, narration, randomSeed + 7);


    return {
        numeroPage: numeroPage,
        numeroCase: numeroCase,
        typePlan: typePlan,
        lieu: lieu,
        personnagesPresents: personnagesPresents.map(p => p.nom), // Stocker juste les noms
        dialogue: dialogue,
        narration: narration,
        descriptionVisuelle: descriptionVisuelle
    };
}

 // --- Fonctions de génération de contenu spécifiques ---

 function genererLigneDialogue(personnage, etape, seed) {
     const baseDialogues = [
         "Qu'est-ce que c'était que ça ?", "Nous devons partir. Maintenant.", "Je n'aime pas ça...",
         "Regardez !", "Attendez... Il y a quelque chose ici.", "Est-ce que tout va bien ?",
         "Je ne peux pas continuer comme ça.", "C'est notre seule chance.", "Faites attention !",
         "Plus vite !", "Où sommes-nous ?", "Je crois que j'ai compris."
     ];
     // Ajouter des dialogues spécifiques à l'archétype ou à l'étape ?
     const dialoguesParArchetype = {
        "héros": ["Je ne laisserai personne derrière !", "Pour la justice !", "Je peux le faire."],
        "mentor": ["La patience est une vertu.", "Souviens-toi de ton entraînement.", "Le destin t'attend."],
        "allié": ["Compte sur moi !", "J'ai un mauvais pressentiment...", "On se couvre, ok ?"],
        "antagoniste": ["Pathétique.", "Vous ne pouvez pas m'arrêter !", "Le pouvoir sera mien !"],
         "ombre": ["Tout a un prix...", "Peut-être... peut-être pas.", "Laissez-moi tranquille."]
         // etc.
     };
     const possibles = [...baseDialogues, ...(dialoguesParArchetype[personnage.archetype] || [])];
     return possibles[Math.floor(pseudoRandom(seed) * possibles.length)];
 }

  function genererNarration(univers, lieu, personnages, etape, dialogue, seed) {
     const baseNarrations = [
         "Le silence était assourdissant.", "Une tension palpable emplit l'air.", "Le temps semblait s'être arrêté.",
         `L'atmosphère de ${lieu} était pesante.`, "Soudain...", "Pendant ce temps...",
         "Au loin, un bruit suspect.", "Les ombres dansaient.", "Un sentiment d'urgence s'installa."
     ];
      // Ajouter des narrations basées sur le contexte ?
      if (dialogue === null && personnages.length > 0) {
          baseNarrations.push(`${personnages.map(p=>p.nom).join(' et ')} échangeaient un regard entendu.`);
          baseNarrations.push(`Le visage de ${personnages[0].nom} se ferma.`);
      }
      if (etape.includes("Obstacle") || etape.includes("Confrontation")) {
           baseNarrations.push("Le danger était imminent.");
      }
     return baseNarrations[Math.floor(pseudoRandom(seed) * baseNarrations.length)];
 }

  function genererDescriptionVisuelle(typePlan, lieu, personnages, etape, dialogue, narration, seed) {
     let desc = `${typePlan} de ${lieu}. `;
     if (personnages.length > 0) {
         desc += `${personnages.map(p => `${p.nom} (${p.apparence})`).join(' et ')} sont présents. `;
         // Décrire une action ou une expression
         const actionsPossibles = ["regarde fixement devant lui", "semble inquiet/déterminé/surpris", "examine un objet", "se tient prêt à agir", "est en pleine conversation", "pointe quelque chose du doigt"];
          desc += `${personnages[0].nom} ${actionsPossibles[Math.floor(pseudoRandom(seed) * actionsPossibles.length)]}. `;
          if (personnages.length > 1) {
               desc += `${personnages[1].nom} réagit en arrière-plan. `;
          }
     } else {
          desc += `Le lieu est désert, mettant l'accent sur l'ambiance. `;
     }
     // Ajouter des détails d'ambiance
     const ambiances = ["Lumière crépusculaire.", "Ombres longues et menaçantes.", "Brume légère flottant au sol.", "Éclairage artificiel froid.", "Soleil éclatant aveuglant."];
     desc += ambiances[Math.floor(pseudoRandom(seed + 1) * ambiances.length)];

     // Inclure subtilement la narration si elle apporte un élément visuel
      if (narration.includes("ombres") || narration.includes("lumière")) {
          // La description peut déjà le couvrir, mais on pourrait renforcer
      }


     return desc;
 }


 // Fonction pseudo-aléatoire simple pour la reproductibilité si nécessaire
 // (Attention: ce n'est PAS cryptographiquement sûr)
 function pseudoRandom(seed) {
     let x = Math.sin(seed) * 10000;
     return x - Math.floor(x);
 }


console.log("scenario_detaille.js chargé et fonction generateScenarioDetaille définie sur window.");
