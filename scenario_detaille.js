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
        
        console.log("Scénario détaillé généré avec succès:", scenario);
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
Vérifier le fichier HTML pour les IDs et les scripts
Assurez-vous que le fichier HTML contient les éléments suivants :

HTML
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BD Creator</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        .text-input-area {
            width: 100%;
            min-height: 150px;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-family: inherit;
            font-size: 1em;
            resize: vertical;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>BD Creator</h1>
        <div class="feature">
            <h3>Entrez du texte pour inspirer votre BD :</h3>
            <textarea id="keywords" class="text-input-area" placeholder="Entrez un texte de plusieurs lignes ou paragraphes qui servira d'inspiration pour votre BD."></textarea>
            <button id="generate-scenario-btn" class="button">Générer un scénario</button>
        </div>
        <div id="scenario-display-container"></div>
    </div>

    <!-- Inclure les scripts -->
    <script src="bd_creator_session_manager.js"></script>
    <script src="scenario_detaille.js"></script>
    <script src="main.js"></script>
</body>
</html>
