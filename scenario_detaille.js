// --- FICHIER : scenario_detaille.js (Version Simplifiée pour Test) ---

console.log("scenario_detaille.js : Début de l'analyse du script.");

// Définition minimale de la fonction sur window
window.generateScenarioDetaille = async function(keywords) {
    console.log("!!! FONCTION generateScenarioDetaille APPELÉE avec :", keywords);
    alert("La fonction generateScenarioDetaille a été appelée !"); // Pour être sûr visuellement

    // Retourner un objet scénario *très* simple pour tester l'affichage
    const dummyScenario = {
        title: "Scénario de Test Minimal",
        theme: keywords,
        univers: { type: "Test", description: "Univers de test" },
        personnages: [{ nom: "Test Perso", archetype: "Test" }],
        chapters: [
            { numero: 1, titre: "Chapitre Test 1", resume: "Résumé test.", pages: [] }
        ]
    };
    console.log("scenario_detaille.js : Retourne un scénario de test :", dummyScenario);
    return dummyScenario;
};

console.log("scenario_detaille.js : Fonction window.generateScenarioDetaille DÉFINIE.");

// Ajouter un petit délai artificiel (optionnel, pour simuler chargement)
// await new Promise(resolve => setTimeout(resolve, 10));

console.log("scenario_detaille.js : Fin de l'analyse du script.");
