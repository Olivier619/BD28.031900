/**
 * Fonction pour créer un storyboard détaillé à partir d'un scénario.
 * Assignée à window.createStoryboardDetaille.
 */
console.log("--- storyboard_detaille.js : DÉBUT ANALYSE ---");

window.createStoryboardDetaille = async function(scenario, chapterIndex) {
    console.log(`--- createStoryboardDetaille: Démarrage pour chapitre index ${chapterIndex} ---`);
    try {
        // Validation entrées
        if (!scenario || !scenario.chapters || !scenario.chapters[chapterIndex]) {
            console.error("createStoryboardDetaille: Scénario/chapitre invalide.", { scenario, chapterIndex });
            throw new Error("Données invalides.");
         }
        const chapitre = scenario.chapters[chapterIndex];
        // console.log("createStoryboardDetaille: Données chapitre:", chapitre);

        // Définir univers AVANT utilisation
        const univers = scenario.univers || { type: "contemporain", lieux: ["Lieu par Défaut"] };
        // console.log("createStoryboardDetaille: Univers:", univers);

        // Définir lieuPrincipal
        const lieuPrincipal = chapitre.lieu || (univers.lieux && univers.lieux.length > 0 ? univers.lieux[0] : "Lieu Principal Indéfini");
        // console.log("createStoryboardDetaille: Lieu principal:", lieuPrincipal);

        // Personnages
        const personnagesScenario = scenario.personnages || [];
        const personnagesNomsChapitre = chapitre.personnages || personnagesScenario.map(p => p.nom);
        const personnagesChapitre = personnagesScenario.filter(p => personnagesNomsChapitre.includes(p.nom));

        const pagesResultat = [];
        const pagesSource = chapitre.pages || [];
        const pagesCount = pagesSource.length;

        if (pagesCount === 0) {
            console.warn(`createStoryboardDetaille: Chapitre ${chapterIndex + 1} sans pages.`);
            return { chapterTitle: chapitre.title || `Chapitre ${chapterIndex + 1}`, chapterSummary: chapitre.resume || "Aucun.", pages: [], personnages: personnagesChapitre, lieu: lieuPrincipal, univers: univers };
        }

        console.log(`createStoryboardDetaille: Génération ${pagesCount} pages storyboard.`);
        for (let i = 0; i < pagesCount; i++) {
             const pageScenario = pagesSource[i];
             if (!pageScenario || !pageScenario.cases || pageScenario.cases.length === 0) {
                  console.warn(`createStoryboardDetaille: Page ${i+1} (glob ${pageScenario?.numeroGlobal}) sans cases.`);
                  pagesResultat.push({ pageNumber: pageScenario?.numeroGlobal || (i + 1), description: pageScenario?.description || `Page ${i+1}`, cases: [{ description: "Aucune case.", dialogue: null, personnages: [] }] });
                  continue;
             }
             const casesStoryboard = pageScenario.cases.map((caseScenario, caseIndex) => ({
                 description: caseScenario.descriptionVisuelle || "N/A",
                 dialogue: caseScenario.dialogue ? `${caseScenario.dialogue.personnage}: ${caseScenario.dialogue.texte}` : null,
                 personnages: caseScenario.personnagesPresents || []
             }));
             pagesResultat.push({ pageNumber: pageScenario.numeroGlobal || (i + 1), description: pageScenario.description, cases: casesStoryboard });
        }

        const storyboardResult = { chapterTitle: chapitre.title || `Chapitre ${chapterIndex + 1}`, chapterSummary: chapitre.resume || "Aucun.", pages: pagesResultat, personnages: personnagesChapitre, univers: univers };
        console.log("--- createStoryboardDetaille: Storyboard généré ---"); // Log réduit
        return storyboardResult;

    } catch (error) {
        console.error("--- createStoryboardDetaille: ERREUR ---", error);
        return null;
    }
}
console.log("--- storyboard_detaille.js : Fonction window.createStoryboardDetaille DÉFINIE ---");
console.log("--- storyboard_detaille.js : FIN ANALYSE ---");