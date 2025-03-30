/**
 * Fonction pour créer un storyboard détaillé à partir d'un scénario.
 * Nouvelle tentative de correction pour l'erreur 'univers'.
 */
console.log("--- storyboard_detaille.js : DÉBUT ANALYSE (v3) ---");

// Assignation à window pour accessibilité globale
window.createStoryboardDetaille = async function(scenario, chapterIndex) {
    console.log(`--- createStoryboardDetaille (v3): Démarrage pour chapitre index ${chapterIndex} ---`);
    try {
        // 1. Validation des entrées
        if (!scenario || !scenario.chapters || !scenario.chapters[chapterIndex]) {
            console.error("createStoryboardDetaille: Scénario ou chapitre invalide.", { scenario, chapterIndex });
            throw new Error("Données scénario/chapitre invalides.");
        }
        const chapitre = scenario.chapters[chapterIndex];
        console.log("createStoryboardDetaille: Données du chapitre:", chapitre);

        // 2. *** DÉFINITION DE 'univers' - POINT CRUCIAL ***
        console.log("createStoryboardDetaille: Définition de la variable 'univers'...");
        const univers = scenario.univers || { type: "contemporain", lieux: ["Lieu par Défaut"] };
        // *** LOG DE VÉRIFICATION IMMÉDIAT ***
        console.log("createStoryboardDetaille: Vérification de 'univers' JUSTE après définition:", univers);
        if (!univers) {
             console.error("createStoryboardDetaille: ERREUR FATALE - 'univers' est toujours null/undefined après définition !");
             throw new Error("Échec critique de la définition de l'univers.");
        }
        console.log("createStoryboardDetaille: Type d'univers:", univers.type); // Vérifier si on peut accéder à une propriété

        // 3. Définition de lieuPrincipal (UTILISE 'univers')
        console.log("createStoryboardDetaille: Définition de 'lieuPrincipal' (ligne ~28)...");
        const lieuPrincipal = chapitre.lieu || (univers.lieux && univers.lieux.length > 0 ? univers.lieux[0] : "Lieu Principal Indéfini");
        console.log("createStoryboardDetaille: lieuPrincipal défini:", lieuPrincipal);

        // 4. Personnages
        const personnagesScenario = scenario.personnages || [];
        const personnagesNomsChapitre = chapitre.personnages || personnagesScenario.map(p => p.nom);
        const personnagesChapitre = personnagesScenario.filter(p => personnagesNomsChapitre.includes(p.nom));
        // console.log("createStoryboardDetaille: Personnages filtrés:", personnagesChapitre); // Optionnel

        // 5. Reste de la logique (inchangée)
        const acte = chapitre.acte || "acte_inconnu";
        const pagesResultat = [];
        const pagesSource = chapitre.pages || [];
        const pagesCount = pagesSource.length;

        if (pagesCount === 0) {
            console.warn(`createStoryboardDetaille: Chapitre ${chapterIndex + 1} sans pages.`);
            return { chapterTitle: chapitre.title || `Chapitre ${chapterIndex + 1}`, chapterSummary: chapitre.resume || "Aucun résumé.", pages: [], personnages: personnagesChapitre, lieu: lieuPrincipal, univers: univers };
        }

        console.log(`createStoryboardDetaille: Génération de ${pagesCount} pages.`);
        for (let i = 0; i < pagesCount; i++) {
             const pageScenario = pagesSource[i];
             if (!pageScenario || !pageScenario.cases || pageScenario.cases.length === 0) {
                  console.warn(`createStoryboardDetaille: Page ${i+1} (glob ${pageScenario?.numeroGlobal}) sans cases.`);
                  pagesResultat.push({ pageNumber: pageScenario?.numeroGlobal || (i + 1), description: pageScenario?.description || `Page ${i+1}`, cases: [{ description: "Aucune case définie.", dialogue: null, personnages: [] }] });
                  continue;
             }
             const casesStoryboard = pageScenario.cases.map((caseScenario, caseIndex) => ({
                 description: caseScenario.descriptionVisuelle || "Description manquante.",
                 dialogue: caseScenario.dialogue ? `${caseScenario.dialogue.personnage}: ${caseScenario.dialogue.texte}` : null,
                 personnages: caseScenario.personnagesPresents || []
             }));
             pagesResultat.push({ pageNumber: pageScenario.numeroGlobal || (i + 1), description: pageScenario.description, cases: casesStoryboard });
        }

        const storyboardResult = { chapterTitle: chapitre.title || `Chapitre ${chapterIndex + 1}`, chapterSummary: chapitre.resume || "Aucun résumé.", pages: pagesResultat, personnages: personnagesChapitre, univers: univers };
        console.log("--- createStoryboardDetaille (v3): Storyboard généré avec succès ---", storyboardResult);
        return storyboardResult;

    } catch (error) {
        console.error("--- createStoryboardDetaille (v3): ERREUR CAPTURÉE ---", error);
        // Afficher l'erreur dans l'UI aussi ?
        const storyboardContainer = document.getElementById('storyboard-container');
         if(storyboardContainer) storyboardContainer.innerHTML = `<p class="error-message">Erreur interne lors de la génération du storyboard. Détails dans la console.</p>`;
        return null; // Important de retourner null
    }
}
console.log("--- storyboard_detaille.js : Fonction window.createStoryboardDetaille DÉFINIE (v3). ---");

// --- PAS de fonctions auxiliaires ici ---

console.log("--- storyboard_detaille.js : FIN ANALYSE (v3) ---");
