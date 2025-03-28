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
