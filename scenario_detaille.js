/**
 * Fonction pour générer un scénario détaillé comme le ferait une IA spécialisée
 * S'assure que la fonction est bien attachée à l'objet window.
 */
window.generateScenarioDetaille = async function(keywords) {
    try {
        console.log("generateScenarioDetaille (Original): Démarrage pour : " + keywords);

        const randomSeed = Date.now() + Math.floor(Math.random() * 1000000);
        const keywordsList = keywords.toLowerCase().split(/[ ,\n]+/).filter(k => k.trim().length > 0);

        let title = genererTitreCreatif(keywordsList, randomSeed);
        const univers = creerUnivers(keywordsList, randomSeed);
        const personnages = creerPersonnages(keywordsList, univers, randomSeed);
        const structureNarrative = creerStructureNarrative(keywordsList, univers, personnages, randomSeed);
        const chapitres = genererChapitresDetailles(structureNarrative, univers, personnages, randomSeed);

        const scenario = {
            title: title,
            theme: keywords,
            univers: univers,
            personnages: personnages,
            structureNarrative: structureNarrative,
            chapters: chapitres,
            generatedAt: new Date().toISOString()
        };

        console.log("generateScenarioDetaille (Original): Scénario final généré:", scenario);
         await new Promise(resolve => setTimeout(resolve, 50)); // Simuler délai
        return scenario;

    } catch (error) {
        console.error("generateScenarioDetaille (Original): ERREUR lors de la génération:", error);
        alert("Une erreur interne est survenue dans scenario_detaille.js. Vérifiez la console.");
        return null;
    }
}

// --- Fonctions auxiliaires (Doivent être exactement celles que vous aviez) ---

function pseudoRandom(seed) { let x = Math.sin(seed) * 10000; return x - Math.floor(x); }

function genererTitreCreatif(keywordsList, randomSeed) {
    const titresCreatifs = ["Les Chroniques oubliées de [Mot-clé]", "L'Odyssée stellaire de [Mot-clé]", "Le Secret enfoui des [Mot-clé]", "Au-delà des terres de [Mot-clé]", "[Mot-clé] et la Prophétie Écarlate", "Les Gardiens du dernier [Mot-clé]", "L'Éveil sombre de [Mot-clé]", "La Prophétie des Anciens : [Mot-clé]", "Le Dernier Voyage vers [Mot-clé]", "L'Écho Silencieux des [Mot-clé]", "Sous le Ciel de [Mot-clé]", "[Mot-clé] : L'Héritage Perdu"];
    const modeleIndex = Math.floor(pseudoRandom(randomSeed) * titresCreatifs.length); let modele = titresCreatifs[modeleIndex];
    const keyword = keywordsList.length > 0 ? keywordsList[Math.floor(pseudoRandom(randomSeed + 1) * keywordsList.length)] : "Mystère";
    const keywordCapitalized = keyword.charAt(0).toUpperCase() + keyword.slice(1);
    return modele.replace("[Mot-clé]", keywordCapitalized);
}

function creerUnivers(keywordsList, randomSeed) {
    const typesUnivers = ["médiéval-fantastique", "science-fiction", "post-apocalyptique", "contemporain", "steampunk", "cyberpunk", "mythologique", "historique", "dystopique", "utopique", "horreur cosmique", "western spaghetti", "polar noir", "space opera"];
    let detectedType = "contemporain";
    const typeKeywords = {"science-fiction": ["futur", "robot", "espace", "vaisseau", "alien", "cyborg", "planète", "laser"],"médiéval-fantastique": ["dragon", "magie", "elfe", "château", "chevalier", "épée", "sorcier", "quête"],"post-apocalyptique": ["apocalypse", "survie", "ruine", "mutant", "désert", "dévasté", "zone"],"steampunk": ["vapeur", "engrenage", "victorien", "dirigeable", "mécanique", "automate"],"cyberpunk": ["néon", "implant", "hacker", "corporation", "dystopie", "virtuel", "augmenté"],"horreur cosmique": ["cthulhu", "lovecraft", "indicible", "folie", "ancien", "abomination"]};
    for (const type in typeKeywords) { if (keywordsList.some(kw => typeKeywords[type].includes(kw))) { detectedType = type; break; } }
    if (detectedType === "contemporain" && keywordsList.length > 2) { detectedType = typesUnivers[Math.floor(pseudoRandom(randomSeed + 2) * typesUnivers.length)]; }
    const caracteristiques = { /* ... (copiez TOUTES les caractéristiques de votre fichier original ici) ... */
        "médiéval-fantastique": { epoque: "Âge des légendes", technologie: "Limitée, magie omniprésente", particularites: "Créatures mythiques, royaumes en guerre", lieux: ["Forêt enchantée", "Citadelle Naine", "Tour de Sorcier", "Village Fortifié", "Ruines Elfiques"] },
        "science-fiction": { epoque: "XXVème siècle", technologie: "Très avancée, IA, voyages FTL", particularites: "Exploration spatiale, fédérations galactiques", lieux: ["Station Spatiale Orbitale", "Planète Jungle luxuriante", "Mégapole Flottante", "Laboratoire de Xéno-biologie", "Vaisseau Colonial Générationnel"] },
        "post-apocalyptique": { epoque: "200 ans après 'Le Grand Effondrement'", technologie: "Vestiges et bricolages", particularites: "Factions hostiles, ressources rares", lieux: ["Ville en Ruines Recouvertes de Végétation", "Abri Souterrain Communautaire", "Désert de Verre Radioactif", "Forteresse de Pillards", "Oasis Cachée"] },
        "contemporain": { epoque: "Aujourd'hui", technologie: "Actuelle", particularites: "Intrigues urbaines, surnaturel discret possible", lieux: ["Café branché du centre-ville", "Vieil entrepôt désaffecté", "Parc municipal paisible", "Bibliothèque universitaire", "Quartier résidentiel calme"] },
        "steampunk": { epoque: "Ère Victorienne Alternative (1888)", technologie: "Mécanique à vapeur avancée", particularites: "Inventions extravagantes, société de classes marquée", lieux: ["Usine Horlogère Géante", "Salon d'Inventeur Excentrique", "Docks Brumeux et Dangereux", "Palais Aérien de l'Aristocratie", "Observatoire Automate"] },
        "cyberpunk": { epoque: "Néo-Kyoto, 2077", technologie: "Implants cybernétiques, réseaux neuronaux", particularites: "Mégacorporations toutes puissantes, bas-fonds dangereux", lieux: ["Marché Noir Souterrain Illuminé aux Néons", "Tour Corporative Impénétrable", "Bar Clandestin pour Hackers", "Autoroute Virtuelle du Net", "Clinique d'Augmentation Illégale"] },
        "mythologique": { epoque: "Temps des Mythes Grecs", technologie: "Artefacts divins", particularites: "Héros demi-dieux, monstres légendaires", lieux: ["Mont Olympe", "Labyrinthe de Crète", "Enfers", "Île des Sirènes", "Temple de Delphes"] },
        "horreur cosmique": { epoque: "Nouvelle-Angleterre, 1920", technologie: "Début XXe", particularites: "Sectes occultes, savoir interdit", lieux: ["Manoir Isolé et Hanté", "Village de Pêcheurs Dégénéré", "Bibliothèque Occulte Poussiéreuse", "Dimension Cauchemardesque", "Cercle de Monolithes Anciens"] },
        "polar noir": { epoque: "Los Angeles, 1940", technologie: "Après-guerre", particularites: "Femmes fatales, détectives désabusés", lieux: ["Bureau de Détective Privé Fumeux", "Club de Jazz Clandestin", "Villa d'un Magnat Corrompu", "Ruelle Sombre et Pluvieuse", "Commissariat Central"] },
        "western spaghetti": { epoque: "Ouest Sauvage, vers 1870", technologie: "Colts et dynamite", particularites: "Chasseurs de primes, duels au soleil", lieux: ["Ville Fantôme Poussiéreuse", "Saloon Bagarreur", "Canyon Isolé", "Ranch Fortifié", "Train à Vapeur Attaqué"] },
        "space opera": { epoque: "Millénaire Lointain", technologie: "Sabres laser, Force mystique", particularites: "Empire galactique vs Rébellion", lieux: ["Pont d'un Croiseur Stellaire", "Planète Désertique", "Cité dans les Nuages", "Académie Spatiale", "Temple Ancien sur une Lune"] },
        "historique": { epoque: "Rome Antique (70 ap. J.-C.)", technologie: "Romaine", particularites: "Intrigues politiques, gladiateurs", lieux: ["Colisée", "Forum Romain", "Villa Patricienne", "Thermes Publics", "Camp Militaire"] },
        "dystopique": { epoque: "République Unifiée, 2140", technologie: "Contrôle total via la technologie", particularites: "Surveillance constante, pensée unique", lieux: ["Centre de Conformité", "Zone d'Habitation Modulaire", "Ministère de la Vérité", "Camp de Rééducation", "Marché Noir Clandestin"] },
        "utopique": { epoque: "Arcadie Prime, 3000", technologie: "Intégrée et écologique", particularites: "Société harmonieuse en apparence", lieux: ["Jardins Flottants", "Centre de Méditation Communautaire", "Bibliothèque Holistique", "Habitat Bio-Dôme", "Source d'Énergie Cristalline"] }
    };
    const universData = caracteristiques[detectedType] || caracteristiques["contemporain"];
    return { type: detectedType, ...universData, description: `Un univers ${detectedType} ${universData.epoque ? `se déroulant vers ${universData.epoque}` : ''}. Les particularités incluent : ${universData.particularites}. Technologie ${universData.technologie}.` };
}

function creerPersonnages(keywordsList, univers, randomSeed) {
    const archetypes = ["héros", "mentor", "allié", "antagoniste", "ombre", "gardien", "messager", "caméléon"];
    const traits = {"héros": ["courageux", "déterminé", "altruiste", "loyal", "impulsif", "naïf", "tourmenté par un choix"],"mentor": ["sage", "expérimenté", "patient", "énigmatique", "exigeant", "protecteur", "fatigué du monde"],"allié": ["fidèle", "compétent", "optimiste", "pragmatique", "comique", "sceptique", "taciturne"],"antagoniste": ["ambitieux", "impitoyable", "charismatique", "manipulateur", "convaincu de son bon droit", "tragique", "avide"],"ombre": ["complexe", "imprévisible", "moralement ambigu", "séduisant", "dangereux", "brisé", "en quête de rédemption"],"gardien": ["vigilant", "stoïque", "traditionnel", "inflexible", "dévoué", "secret"],"messager": ["rapide", "neutre", "observateur", "porteur de nouvelles", "insaisissable"],"caméléon": ["adaptable", "trompeur", "opportuniste", "changeant", "mystérieux"]};
    const motivations = {"héros": ["sauver le monde", "protéger ses proches", "venger une injustice", "découvrir la vérité sur soi", "accomplir son destin"],"mentor": ["guider le héros", "réparer une erreur passée", "préparer la relève", "maintenir un équilibre fragile", "transmettre un savoir perdu"],"allié": ["soutenir le héros par amitié/amour", "atteindre un but personnel lié", "rembourser une dette", "fuir quelque chose", "prouver sa valeur"],"antagoniste": ["dominer le monde", "imposer sa vision idéologique", "se venger de la société/du héros", "obtenir un pouvoir ultime", "recréer un être cher perdu"],"ombre": ["trouver la rédemption", "survivre à tout prix", "défier les attentes", "semer le chaos pour une raison cachée", "protéger un secret inavouable"],"gardien": ["protéger un lieu/objet sacré", "maintenir un ordre ancien", "respecter un serment ancestral", "tester la valeur des autres"],"messager": ["accomplir une mission divine/importante", "observer sans interférer", "jouer un double jeu", "répandre une information clé"],"caméléon": ["s'enrichir", "gagner en influence", "survivre en s'adaptant", "servir ses propres intérêts cachés"]};
    const nomsParUnivers = { /* ... (copiez VOS noms ici) ... */
         "médiéval-fantastique": ["Aeliana", "Borin", "Lyra", "Kael", "Seraphina", "Roric"],"science-fiction": ["Jax", "Cyra", "Orion", "Nova", "Unit 7", "Zara"],"post-apocalyptique": ["Ash", "Echo", "Raze", "Willow", "Spike", "Hope"],"cyberpunk": ["Kaito", "Glitch", "Anya", "Jax", "Silas", "Chrome"],"steampunk": ["Isambard", "Ada", "Phileas", "Evangeline", "Barnaby", "Clara"],"contemporain": ["Alex", "Chloe", "Marcus", "Sophie", "Ryan", "Isabelle"],"mythologique": ["Achille", "Cassandre", "Ulysse", "Hélène", "Jason", "Médée"],"horreur cosmique": ["Randolph", "Abigail", "Herbert", "Eleanor", "Walter", "Lavinia"],"polar noir": ["Jake", "Vivian", "Mickey", "Lauren", "Eddie", "Gloria"],"western spaghetti": ["Django", "Carmen", "Jedediah", "Abigail", "Cole", "Esperanza"],"space opera": ["Zark", "Leia", "Han", "Mara", "Dash", "Asajj"],"historique": ["Lucius", "Cornelia", "Maximus", "Livia", "Decimus", "Octavia"], "dystopique": ["Numéro 6", "Julia", "Winston", "Theta-7", "Kass", "Unit-Sigma"],"utopique": ["Lyra", "Orion", "Serenity", "Aether", "Kai", "Elara"]
     };
    const nombrePersonnages = Math.floor(pseudoRandom(randomSeed + 3) * 3) + 3;
    const personnages = []; const archetypesPossibles = [...archetypes];
    const heroArchetype = "héros"; const antagonistArchetype = "antagoniste";
    personnages.push(creerPersonnageDetaille(heroArchetype, univers, keywordsList, randomSeed + 4, nomsParUnivers, traits, motivations));
    archetypesPossibles.splice(archetypesPossibles.indexOf(heroArchetype), 1);
    personnages.push(creerPersonnageDetaille(antagonistArchetype, univers, keywordsList, randomSeed + 5, nomsParUnivers, traits, motivations));
    archetypesPossibles.splice(archetypesPossibles.indexOf(antagonistArchetype), 1);
    for (let i = 2; i < nombrePersonnages; i++) { if (archetypesPossibles.length === 0) break; const archetypeIndex = Math.floor(pseudoRandom(randomSeed + 6 + i) * archetypesPossibles.length); const selectedArchetype = archetypesPossibles.splice(archetypeIndex, 1)[0]; personnages.push(creerPersonnageDetaille(selectedArchetype, univers, keywordsList, randomSeed + 7 + i * 2, nomsParUnivers, traits, motivations)); }
    return personnages;
}

function creerPersonnageDetaille(archetype, univers, keywordsList, randomSeed, nomsParUnivers, allTraits, allMotivations) {
    const nomsUnivers = nomsParUnivers[univers.type] || nomsParUnivers["contemporain"];
    const nom = Array.isArray(nomsUnivers) && nomsUnivers.length > 0 ? nomsUnivers[Math.floor(pseudoRandom(randomSeed) * nomsUnivers.length)] : `Perso_${archetype}`;
    const traitsArchetype = allTraits[archetype] || ["adaptable"];
    const nombreTraits = Math.floor(pseudoRandom(randomSeed + 1) * 2) + 2; const traitsSelectionnes = []; const traitsDisponibles = [...traitsArchetype];
    for (let i = 0; i < nombreTraits && traitsDisponibles.length > 0; i++) { const traitIndex = Math.floor(pseudoRandom(randomSeed + 2 + i) * traitsDisponibles.length); traitsSelectionnes.push(traitsDisponibles.splice(traitIndex, 1)[0]); }
    const motivationsArchetype = allMotivations[archetype] || ["survivre"]; const motivation = motivationsArchetype[Math.floor(pseudoRandom(randomSeed + 3) * motivationsArchetype.length)];
    const apparence = genererApparence(univers.type, archetype, randomSeed + 4); const traitDistinctif = genererTraitDistinctif(univers.type, archetype, randomSeed + 5);
    const description = `${nom} (${archetype}) : ${apparence}. ${traitsSelectionnes.join(', ')}. Trait distinctif : ${traitDistinctif}. Motivation principale : ${motivation}.`;
    return { nom, archetype, traits: traitsSelectionnes, motivation, description, apparence, traitDistinctif };
}

function genererApparence(typeUnivers, archetype, seed) {
    const apparencesBase = ["regard intense", "cicatrice discrète", "sourire énigmatique", "allure athlétique", "démarche assurée", "air pensif"];
    const apparencesParUnivers = { /* ... (vos apparences) ... */
         "médiéval-fantastique": ["armure gravée", "cape élimée", "yeux luisants de magie", "tatouages runiques"],"science-fiction": ["uniforme high-tech", "implants cybernétiques visibles", "combinaison spatiale usée", "coiffure futuriste"],"post-apocalyptique": ["vêtements rapiécés", "masque à gaz", "peau burinée par les éléments", "équipement de survie"],"cyberpunk": ["manteau long en cuir synthétique", "lunettes de réalité augmentée", "cheveux aux couleurs néon", "bras mécanique chromé"],"steampunk": ["haut-de-forme avec lunettes intégrées", "robe à corset et rouages", "bras mécanique en laiton", "montre à gousset complexe"],"contemporain": ["jean et t-shirt", "costume bien coupé", "look décontracté", "style artistique"],"mythologique": ["toge simple", "armure de bronze étincelante", "couronne de laurier", "peau dorée par le soleil"],"horreur cosmique": ["pardessus sombre", "air maladif", "yeux cernés par l'insomnie", "vêtements démodés"],"polar noir": ["imperméable et feutre mou", "robe de soirée élégante", "costume à rayures", "regard dur"],"western spaghetti": ["poncho poussiéreux", "chapeau de cowboy usé", "ceinturon avec colt", "robe de saloon"],"space opera": ["uniforme militaire strict", "tenue de pilote rebelle", "robe sénatoriale élégante", "armure mandalorienne"],"historique": ["tunique romaine", "armure de légionnaire", "stola patricienne", "vêtements de travailleur"], "dystopique": ["uniforme gris terne", "combinaison numérotée", "vêtements de rebelle discrets", "manteau d'agent de contrôle"],"utopique": ["tunique blanche et fluide", "combinaison ajustée aux lignes épurées", "vêtements en fibres naturelles", "bijoux minimalistes lumineux"]
     };
    const possibles = [...apparencesBase, ...(apparencesParUnivers[typeUnivers] || [])]; return possibles[Math.floor(pseudoRandom(seed) * possibles.length)];
}

function genererTraitDistinctif(typeUnivers, archetype, seed) {
     const traitsBase = ["boitille légèrement", "a un tic nerveux", "parle avec un accent particulier", "collectionne des objets étranges", "fredonne souvent"];
     const traitsParUnivers = { /* ... (vos traits) ... */
         "médiéval-fantastique": ["porte une amulette mystérieuse", "a une affinité avec les animaux", "peut sentir la magie", "cicatrice de brûlure magique"],"science-fiction": ["possède une IA personnelle intégrée", "a des réflexes surhumains dus à des implants", "parle plusieurs langues galactiques", "hologramme personnel vacillant"],"post-apocalyptique": ["mange de la nourriture suspecte sans sourciller", "connaît les ruines comme sa poche", "a un compteur Geiger qui crépite", "regard hanté"],"cyberpunk": ["interface neurale visible sur la tempe", "addiction aux stimulants de combat", "a un drone de surveillance personnel", "tousse à cause de la pollution"],"steampunk": ["remonte constamment une montre mécanique", "sent l'huile et la vapeur", "a une prothèse qui siffle", "transporte une caisse à outils décorée"],"contemporain": ["toujours un café à la main", "connaît tous les ragots", "expert en technologie", "ne sort jamais sans son carnet"],"mythologique": ["brille d'une faible aura divine", "peut parler aux animaux mythiques", "porte la marque d'un dieu", "ne saigne pas normalement"],"horreur cosmique": ["murmure des phrases incohérentes", "dessine des symboles étranges", "a peur des angles droits", "regard vide et lointain"],"polar noir": ["fume cigarette sur cigarette", "joue avec un jeton de poker", "a toujours une réplique cynique prête", "regard las"],"western spaghetti": ["crache souvent par terre", "mâchonne un brin d'herbe", "dégaine incroyablement vite", "joue de l'harmonica"],"space opera": ["pilote hors pair", "expert en contrebande", "sensible à la Force", "parle aux droïdes"],"historique": ["cite des philosophes grecs", "expert en stratégie militaire romaine", "connaît les rumeurs du Sénat", "porte une bague de légionnaire"], "dystopique": ["évite les caméras de surveillance", "utilise un langage codé", "regard méfiant", "cicatrice de punition"],"utopique": ["air serein presque troublant", "communique par télépathie faible", "se déplace silencieusement", "connaissances encyclopédiques"]
     };
     const possibles = [...traitsBase, ...(traitsParUnivers[typeUnivers] || [])]; return possibles[Math.floor(pseudoRandom(seed) * possibles.length)];
}

function creerStructureNarrative(keywordsList, univers, personnages, randomSeed) {
    const structures = ["voyage du héros", "quête initiatique", "enquête mystérieuse", "lutte contre l'oppression", "histoire de vengeance", "transformation personnelle", "rivalité destructrice", "amour interdit", "survie en milieu hostile", "récit de création/chute"];
    let detectedStructure = "quête initiatique"; if (keywordsList.includes("enquête") || keywordsList.includes("mystère") || keywordsList.includes("détective")) detectedStructure = "enquête mystérieuse"; if (keywordsList.includes("rébellion") || keywordsList.includes("tyran") || keywordsList.includes("liberté")) detectedStructure = "lutte contre l'oppression"; if (keywordsList.includes("vengeance") || keywordsList.includes("trahison")) detectedStructure = "histoire de vengeance"; if (keywordsList.includes("survie") || keywordsList.includes("désastre")) detectedStructure = "survie en milieu hostile"; if (detectedStructure === "quête initiatique" && pseudoRandom(randomSeed + 9) > 0.3) { detectedStructure = structures[Math.floor(pseudoRandom(randomSeed + 10) * structures.length)]; }
    const nombreChapitres = 4;
    const pointsCleParStructure = { /* ... (vos points clés) ... */
        "voyage du héros": ["Monde Ordinaire", "Appel & Refus", "Mentor & Seuil", "Épreuves & Alliés", "Approche Caverne", "Ordalie", "Récompense", "Retour & Résurrection", "Élixir"],"quête initiatique": ["La Mission", "Formation Équipe", "Voyage & Obstacles", "Perte & Doute", "Révélation Intérieure", "Confrontation Gardien", "Objectif Atteint", "Fuite & Sacrifice", "Retour Transformé"],"enquête mystérieuse": ["Le Crime/Mystère", "Premiers Indices", "Fausses Pistes", "Témoin Clé", "Danger Croissant", "Confrontation Suspect", "Révélation Choc", "Course Contre la Montre", "Résolution & Conséquences"],"lutte contre l'oppression": ["Vie sous l'Oppression", "Incident Déclencheur", "Rejoindre la Résistance", "Première Action & Échec", "Trahison & Capture", "Évasion & Ralliement", "Planification Attaque Finale", "Bataille Décisive", "Nouvel Ordre (ou pas)"],"histoire de vengeance": ["L'Offense Originelle", "Le Serment", "Préparation & Entraînement", "Traque & Premières Victimes", "Dilemme Moral", "Découverte Troublante", "Confrontation Finale", "Vengeance Assouvie (ou non)", "Le Vide d'Après"],"transformation personnelle": ["Vie Insatisfaisante", "Catalyseur du Changement", "Résistance & Rechute", "Acceptation & Effort", "Point de Non-Retour", "Épreuve de Vérité", "Intégration du Changement", "Nouvelle Identité", "Impact sur le Monde"],"rivalité destructrice": ["Origine de la Rivalité", "Première Confrontation", "Escalade", "Sabotage Mutuel", "Implication des Proches", "Point de Rupture", "Duel Final", "Destruction Mutuelle (ou Rédemption)", "Conséquences pour l'Entourage"],"amour interdit": ["Rencontre Fortuite", "Attirance & Obstacles", "Moments Volés", "Découverte & Scandale", "Séparation Forcée", "Tentative de Réunion", "Sacrifice Ultime", "Union (ou Tragédie)", "Postérité"],"survie en milieu hostile": ["Le Désastre", "Isolement & Prise de Conscience", "Recherche de Ressources", "Rencontre (Ami ou Ennemi)", "Menace Environnementale", "Perte d'Espoir", "Ingéniosité & Découverte", "Confrontation avec la Menace", "Sauvetage (ou Adaptation Finale)"],"récit de création/chute": ["L'Âge d'Or", "Le Premier Signe de Déclin", "Tentatives de Maintien", "La Grande Erreur", "Accélération de la Chute", "Le Chaos", "Tentative de Reconstruction", "Vestiges & Leçons", "Nouveau Cycle (?)"]
    };
    const etapes = pointsCleParStructure[detectedStructure] || pointsCleParStructure["quête initiatique"]; const etapesParChapitre = Math.ceil(etapes.length / nombreChapitres); const etapesDistribuees = [];
    for(let i=0; i<nombreChapitres; i++){ const debut = i * etapesParChapitre; const fin = Math.min(debut + etapesParChapitre, etapes.length); if (fin > debut) { etapesDistribuees.push(etapes.slice(debut, fin).join(' / ')); } else if (i === nombreChapitres -1 && etapes.length > debut) { etapesDistribuees.push(etapes.slice(debut).join(' / ')); } else { etapesDistribuees.push("Transition"); } }
    return { type: detectedStructure, nombreChapitres: nombreChapitres, etapesParChapitre: etapesDistribuees, description: `Une histoire de type "${detectedStructure}" en ${nombreChapitres} chapitres.` };
}

function genererChapitresDetailles(structureNarrative, univers, personnages, randomSeed) {
    const chapitres = []; const nombreChapitres = structureNarrative.nombreChapitres; const etapesChapitres = structureNarrative.etapesParChapitre; const pagesParChapitre = 12; let numeroPageGlobal = 1;
    for (let i = 0; i < nombreChapitres; i++) {
        const etapeCourante = etapesChapitres[i] || `Chapitre ${i+1}`; let titreChapitre = etapeCourante.length > 40 ? `Chapitre ${i+1}` : etapeCourante;
        const pages = []; for (let j = 0; j < pagesParChapitre; j++) { pages.push(genererPage(numeroPageGlobal, i + 1, j + 1, univers, personnages, etapeCourante, randomSeed + numeroPageGlobal)); numeroPageGlobal++; }
        chapitres.push({ numero: i + 1, titre: `Chapitre ${i+1}: ${titreChapitre}`, etape: etapeCourante, pages: pages, resume: `Ce chapitre se concentre sur "${etapeCourante}", faisant progresser l'intrigue.` });
    } return chapitres;
}

function genererPage(numeroGlobal, numeroChapitre, numeroLocal, univers, personnages, etapeChapitre, randomSeed) {
    const baseCases = 4; const variation = Math.floor(pseudoRandom(randomSeed) * 5) - 2; const nombreCases = Math.max(3, Math.min(7, baseCases + variation)); const cases = [];
    for (let k = 0; k < nombreCases; k++) {
         let personnagesPresents = []; const probaHero = 0.6; const probaAntago = 0.3; const maxPersoCase = 3; const nbPersoCase = Math.floor(pseudoRandom(randomSeed + k + 1) * maxPersoCase) + 1;
         const hero = personnages.find(p => p.archetype === 'héros'); if (hero && pseudoRandom(randomSeed + k + 2) < probaHero) { personnagesPresents.push(hero); }
         const antago = personnages.find(p => p.archetype === 'antagoniste'); if (antago && !personnagesPresents.includes(antago) && personnagesPresents.length < nbPersoCase && pseudoRandom(randomSeed + k + 3) < probaAntago) { personnagesPresents.push(antago); }
         const persosRestants = personnages.filter(p => !personnagesPresents.includes(p)); while(personnagesPresents.length < nbPersoCase && persosRestants.length > 0) { const index = Math.floor(pseudoRandom(randomSeed + k + 4 + personnagesPresents.length) * persosRestants.length); personnagesPresents.push(persosRestants.splice(index, 1)[0]); }
         if (personnagesPresents.length === 0 && personnages.length > 0) { personnagesPresents.push(personnages[0]); }
         cases.push(genererCase(numeroGlobal, k + 1, univers, personnagesPresents, etapeChapitre, randomSeed + k * 10));
    } return { numeroGlobal: numeroGlobal, numeroChapitre: numeroChapitre, numeroLocal: numeroLocal, cases: cases, description: `Page ${numeroGlobal} (Chap. ${numeroChapitre}, Pg. ${numeroLocal}). Focus: "${etapeChapitre}".` };
}

function genererCase(numeroPage, numeroCase, univers, personnagesPresents, etapeChapitre, randomSeed) {
    const typesPlans = ["plan large", "plan moyen", "gros plan", "plan d'ensemble", "plongée", "contre-plongée", "plan américain", "très gros plan (insert)", "plan épaule", "plan subjectif"]; const typePlan = typesPlans[Math.floor(pseudoRandom(randomSeed) * typesPlans.length)];
    const lieu = univers.lieux && univers.lieux.length > 0 ? univers.lieux[Math.floor(pseudoRandom(randomSeed + 1) * univers.lieux.length)] : "Lieu Indéfini"; let dialogue = null;
    if (personnagesPresents.length > 0 && pseudoRandom(randomSeed + 3) > 0.45) { const persoQuiParle = personnagesPresents[Math.floor(pseudoRandom(randomSeed + 4) * personnagesPresents.length)]; dialogue = { personnage: persoQuiParle.nom, texte: genererLigneDialogue(persoQuiParle, etapeChapitre, randomSeed + 5) }; }
    const narration = pseudoRandom(randomSeed + 6) > 0.7 ? genererNarration(univers, lieu, personnagesPresents, etapeChapitre, dialogue, randomSeed + 6) : null;
    const descriptionVisuelle = genererDescriptionVisuelle(typePlan, lieu, personnagesPresents, etapeChapitre, dialogue, narration, randomSeed + 7);
    return { numeroPage: numeroPage, numeroCase: numeroCase, typePlan: typePlan, lieu: lieu, personnagesPresents: personnagesPresents.map(p => p.nom), dialogue: dialogue, narration: narration, descriptionVisuelle: descriptionVisuelle };
}

function genererLigneDialogue(personnage, etape, seed) {
    const baseDialogues = ["Qu'est-ce que c'était que ça ?", "Nous devons partir. Maintenant.", "Je n'aime pas ça...", "Regardez !", "Attendez... Il y a quelque chose ici.", "Est-ce que tout va bien ?", "Je ne peux pas continuer comme ça.", "C'est notre seule chance.", "Faites attention !", "Plus vite !", "Où sommes-nous ?", "Je crois que j'ai compris.", "Impossible...", "Suivez-moi !", "Silence !"];
    const dialoguesParArchetype = { /* ... vos dialogues ... */
        "héros": ["Je ne laisserai personne derrière !", "Pour la justice !", "Je peux le faire.", "Quel est le plan ?", "Nous devons essayer !"],"mentor": ["La patience est une vertu.", "Souviens-toi de ton entraînement.", "Le destin t'attend.", "Observe et apprends.", "Ne sous-estime jamais ton adversaire."],"allié": ["Compte sur moi !", "J'ai un mauvais pressentiment...", "On se couvre, ok ?", "C'était moins une !", "Je m'en occupe."],"antagoniste": ["Pathétique.", "Vous ne pouvez pas m'arrêter !", "Le pouvoir sera mien !", "Comme c'est prévisible.", "Agenouillez-vous !"],"ombre": ["Tout a un prix...", "Peut-être... peut-être pas.", "Laissez-moi tranquille.", "Ça ne vous regarde pas.", "Les choses ne sont pas si simples."],"gardien": ["Halte ! Qui va là ?", "Vous ne passerez pas !", "Seuls les dignes...", "Respectez ce lieu.", "Le savoir a un prix."],"messager": ["J'ai un message pour vous.", "Écoutez attentivement.", "Le temps presse.", "Les choses ont changé.", "On m'envoie vous prévenir."],"caméléon": ["Intéressant...", "Comment puis-je vous aider... pour l'instant ?", "Cela pourrait être profitable.", "Je connais quelqu'un...", "Adaptons-nous."]
    };
    const dialoguesParEtape = { /* ... vos dialogues ... */
        "Monde Ordinaire": ["Encore une journée ordinaire...", "J'aimerais qu'il se passe quelque chose."],"Appel & Refus": ["Moi ? Pourquoi moi ?", "C'est impossible, je ne peux pas."],"Mentor & Seuil": ["Vous devez accepter votre destin.", "Le premier pas est le plus difficile."],"Épreuves & Alliés": ["Nous devons travailler ensemble !", "Fais attention, c'est un piège !"],"Ordalie": ["C'est maintenant ou jamais !", "Je ne peux pas perdre..."],"Retour & Résurrection": ["Je suis de retour.", "Les choses ont changé ici."],"Le Crime/Mystère": ["Qui aurait pu faire ça ?", "Il y a quelque chose qui cloche."],"Fausses Pistes": ["Je croyais qu'on le tenait...", "Retour à la case départ."],"Révélation Choc": ["Alors c'était vous depuis le début !", "Je n'arrive pas à y croire..."],"Vie sous l'Oppression": ["Baissez la tête et ne faites pas de vagues.", "Un jour, ça changera."],"Rejoindre la Résistance": ["Je veux me battre.", "Que puis-je faire ?"],"Bataille Décisive": ["Pour la liberté !", "C'est notre dernière chance !"]
    };
    let sourceDialogues = baseDialogues; if (pseudoRandom(seed) < 0.6) { sourceDialogues = [...baseDialogues, ...(dialoguesParArchetype[personnage.archetype] || [])]; }
    const etapeSimple = etape.split(' / ')[0]; if (dialoguesParEtape[etapeSimple] && pseudoRandom(seed + 0.5) < 0.4) { sourceDialogues = [...sourceDialogues, ...dialoguesParEtape[etapeSimple]]; }
    return sourceDialogues[Math.floor(pseudoRandom(seed + 1) * sourceDialogues.length)];
}

function genererNarration(univers, lieu, personnages, etape, dialogue, seed) {
    const baseNarrations = ["Le silence était lourd.", "Une tension palpable.", "Le temps suspendu.", `L'atmosphère de ${lieu.toLowerCase()}.`, "Soudain...", "Pendant ce temps...", "Au loin...", "Les ombres dansaient.", "Urgence.", "Non-dits.", "L'air vibrait."];
    let possibles = [...baseNarrations]; if(personnages.length === 1) possibles.push(`${personnages[0].nom} était seul(e) avec ses pensées.`); if(etape.includes("Obstacle") || etape.includes("Confrontation")) possibles.push("Le danger rôdait."); if(dialogue === null) possibles.push("Aucun mot n'était nécessaire."); if(univers.type === "horreur cosmique") possibles.push("Une présence indicible se fit sentir."); if(univers.type === "polar noir") possibles.push("La pluie battait contre la fenêtre.");
    return possibles[Math.floor(pseudoRandom(seed) * possibles.length)];
}

function genererDescriptionVisuelle(typePlan, lieu, personnages, etape, dialogue, narration, seed) {
    let desc = `${typePlan.charAt(0).toUpperCase() + typePlan.slice(1)} dans ${lieu}. `;
    if (personnages.length > 0) { const noms = personnages.map(p => p.nom).join(', '); desc += `${noms}. `; const actions = [`regarde ${pseudoRandom(seed) > 0.5 ? 'intensément' : 'vaguement'} ${pseudoRandom(seed+1) > 0.5 ? 'devant lui/elle' : 'vers quelque chose hors champ'}`, `a une expression ${['inquiète', 'déterminée', 'surprise', 'fatiguée', 'méfiante'][Math.floor(pseudoRandom(seed+2)*5)]}`, `examine ${['un objet au sol', 'une carte holographique', 'ses mains tremblantes', 'le mécanisme complexe'][Math.floor(pseudoRandom(seed+3)*4)]}`, `se tient ${['prêt(e) à bondir', 'immobile', 'légèrement en retrait', 'au centre de l'attention'][Math.floor(pseudoRandom(seed+4)*4)]}`, `semble ${['parler animement (si dialogue)', 'murmurer pour lui/elle-même', 'réfléchir profondément', 'ignorer les autres'][Math.floor(pseudoRandom(seed+5)*4)]}${dialogue ? '' : ' (sans dialogue)'}.`]; desc += `${personnages[0].nom} ${actions[Math.floor(pseudoRandom(seed+6) * actions.length)]}. `; if (personnages.length > 1) { desc += `${personnages[1].nom} ${['observe la scène', 'réagit discrètement', 'semble en désaccord', 'attend des instructions'][Math.floor(pseudoRandom(seed+7)*4)]}. `; } }
    else { desc += `Le lieu est vide, soulignant ${['sa désolation', 'son immensité', 'un détail important', 'le calme avant la tempête'][Math.floor(pseudoRandom(seed+8)*4)]}. `; }
    const ambiances = ["Lumière crépusculaire filtrant par une fenêtre.", "Ombres portées créant une atmosphère oppressante.", "Brume épaisse réduisant la visibilité.", "Éclairage néon vibrant et froid.", "Poussière flottant dans un rayon de soleil."]; desc += ambiances[Math.floor(pseudoRandom(seed + 9) * ambiances.length)];
    return desc;
}

console.log("scenario_detaille.js (Original) chargé et fonction generateScenarioDetaille définie.");
