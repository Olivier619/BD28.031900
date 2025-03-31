// --- FICHIER : storyboard_detaille.js (Génération Complète) ---
console.log("--- storyboard_detaille.js : DÉBUT ANALYSE (Complet) ---");

window.createStoryboardComplet = async function(scenario) { // Renommée et prend scenario entier
    console.log("--- createStoryboardComplet: Démarrage ---");
    try {
        if (!scenario || !scenario.chapters || !Array.isArray(scenario.chapters) || scenario.chapters.length === 0) {
            throw new Error("Données scénario invalides ou sans chapitres.");
        }

        const univers = scenario.univers || { type: "contemporain", lieux: ["Lieu par Défaut"] };
        const personnagesScenario = scenario.personnages || [];
        const storyboardComplet = {
            scenarioTitle: scenario.title, // Garder titre scénario
            chapters: [] // Tableau pour stocker les données de chaque chapitre
        };

        console.log(`createStoryboardComplet: Traitement de ${scenario.chapters.length} chapitres...`);

        // Boucle sur TOUS les chapitres du scénario
        for (const [chapterIndex, chapitre] of scenario.chapters.entries()) {
            if (!chapitre) { console.warn(`Chapitre ${chapterIndex+1} invalide.`); continue; }

            const personnagesNomsChapitre = chapitre.personnages || personnagesScenario.map(p => p.nom);
            const personnagesChapitre = personnagesScenario.filter(p => personnagesNomsChapitre.includes(p.nom));
            const pagesResultat = [];
            const pagesSource = chapitre.pages || [];

            console.log(`  -> Chap ${chapterIndex+1} ('${chapitre.titre}'): ${pagesSource.length} pages source.`);

            // Boucle sur les pages de CE chapitre
            for (const [pageIndex, pageScenario] of pagesSource.entries()) {
                 if (!pageScenario || !pageScenario.cases || !Array.isArray(pageScenario.cases)) {
                     console.warn(`    Page ${pageIndex+1} (glob ${pageScenario?.numeroGlobal}) invalide ou sans cases.`);
                     pagesResultat.push({ pageNumber: pageScenario?.numeroGlobal || -1, description: `Page ${pageIndex+1} invalide`, cases: [] });
                     continue;
                 }

                 const casesStoryboard = pageScenario.cases.map((caseScenario, caseIndex) => ({
                     description: caseScenario.descriptionVisuelle || "N/A",
                     dialogue: caseScenario.dialogue ? `${caseScenario.dialogue.personnage}: ${caseScenario.dialogue.texte}` : null,
                     personnages: caseScenario.personnagesPresents || []
                 }));

                 pagesResultat.push({
                     pageNumber: pageScenario.numeroGlobal, // Utiliser le numéro global de la page scénario
                     description: pageScenario.description,
                     cases: casesStoryboard
                 });
            } // Fin boucle pages

            // Ajouter les données du chapitre au résultat complet
            storyboardComplet.chapters.push({
                 chapterNumber: chapitre.numero || chapterIndex + 1,
                 chapterTitle: chapitre.title || `Chapitre ${chapterIndex + 1}`,
                 chapterSummary: chapitre.resume || "Aucun.",
                 pages: pagesResultat, // Pages storyboard pour ce chapitre
                 personnages: personnagesChapitre, // Personnages spécifiques (optionnel)
            });

        } // Fin boucle chapitres

        storyboardComplet.univers = univers; // Ajouter l'univers global pour référence
        console.log("--- createStoryboardComplet: Storyboard COMPLET généré ---", storyboardComplet);
        return storyboardComplet;

    } catch (error) {
        console.error("--- createStoryboardComplet: ERREUR ---", error);
        return null;
    }
}
console.log("--- storyboard_detaille.js : Fonction window.createStoryboardComplet DÉFINIE ---");
console.log("--- storyboard_detaille.js : FIN ANALYSE (Complet) ---");
