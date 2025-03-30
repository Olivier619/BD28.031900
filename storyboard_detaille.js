/**
 * Fonction pour créer un storyboard détaillé à partir d'un scénario.
 * S'assure que la fonction est bien attachée à l'objet window.
 */
console.log("--- storyboard_detaille.js : DÉBUT ANALYSE ---");

// Définition et assignation directe à window
window.createStoryboardDetaille = async function(scenario, chapterIndex) {
    console.log(`--- createStoryboardDetaille: Démarrage pour chapitre index ${chapterIndex} ---`);
    try {
        // Vérifier les entrées
        if (!scenario || !scenario.chapters || !scenario.chapters[chapterIndex]) {
            console.error("createStoryboardDetaille: Scénario ou chapitre spécifié invalide.", scenario, chapterIndex);
            throw new Error("Données scénario/chapitre invalides pour créer le storyboard.");
         }

        console.log("Création du storyboard détaillé pour le chapitre: " + scenario.chapters[chapterIndex].title);

        const chapitre = scenario.chapters[chapterIndex];
         // Accéder aux personnages définis au niveau du scénario global
        const personnagesScenario = scenario.personnages || [];
         // Utiliser les noms de personnages listés dans le chapitre (s'ils existent) pour filtrer
         // Ou utiliser tous les personnages du scénario si chapitre.personnages n'est pas défini
         const personnagesNomsChapitre = chapitre.personnages || personnagesScenario.map(p => p.nom); // Fallback
         const personnagesChapitre = personnagesScenario.filter(p => personnagesNomsChapitre.includes(p.nom));


        const lieuPrincipal = chapitre.lieu || univers.lieux[0] || "Lieu Principal Indéfini"; // Utiliser un lieu de l'univers si besoin
        const acte = chapitre.acte || "acte_inconnu"; // Fallback pour l'acte

        // Récupérer les informations de l'univers (important pour les détails)
        const univers = scenario.univers || { type: "contemporain", lieux: ["Lieu par Défaut"]}; // Fallback univers

        const pagesResultat = []; // Renommé pour éviter conflit avec variable 'pages' interne
        const pagesSource = chapitre.pages || []; // Utiliser les pages du chapitre
         const pagesCount = pagesSource.length;

         if (pagesCount === 0) {
             console.warn(`createStoryboardDetaille: Le chapitre ${chapterIndex + 1} n'a pas de pages définies dans le scénario.`);
             // On pourrait soit retourner un storyboard vide, soit générer des pages/cases vides
              return {
                 chapterTitle: chapitre.title || `Chapitre ${chapterIndex + 1}`,
                 chapterSummary: chapitre.summary || "Aucun résumé.",
                 pages: [], // Retourner tableau vide
                 personnages: personnagesChapitre,
                 lieu: lieuPrincipal,
                 univers: univers
             };
         }

        // Créer une progression narrative pour le chapitre (si nécessaire ou utiliser etape du chapitre)
        // const progressionNarrative = creerProgressionNarrative(chapitre, acte); // Cette fonction n'est pas définie ici

        // Créer les pages du storyboard en se basant sur les pages du scénario
        for (let i = 0; i < pagesCount; i++) {
             const pageScenario = pagesSource[i];
             if (!pageScenario || !pageScenario.cases || pageScenario.cases.length === 0) {
                  console.warn(`createStoryboardDetaille: Page ${i+1} du chapitre ${chapterIndex+1} n'a pas de cases définies.`);
                  // Ajouter une page vide ou avec un message
                  pagesResultat.push({
                      pageNumber: pageScenario.numeroGlobal || (i + 1), // Utiliser numeroGlobal si dispo
                      description: pageScenario.description || `Page ${i+1} - Placeholder`,
                      cases: [{ description: "Aucune case définie dans le scénario.", dialogue: null, personnages: [] }]
                  });
                  continue; // Passer à la page suivante
             }

             // Mapper les cases du scénario vers les cases du storyboard
             const casesStoryboard = pageScenario.cases.map((caseScenario, caseIndex) => {
                 // Extraire les personnages réellement présents (juste les noms)
                 const personnagesCaseNoms = caseScenario.personnagesPresents || [];

                 return {
                     // number: caseScenario.numeroCase || (caseIndex + 1), // Si numeroCase existe
                     description: caseScenario.descriptionVisuelle || "Description visuelle manquante.",
                     dialogue: caseScenario.dialogue ? `${caseScenario.dialogue.personnage}: ${caseScenario.dialogue.texte}` : null,
                     personnages: personnagesCaseNoms
                     // Ajouter d'autres infos si nécessaire (narration, typePlan...)
                 };
             });

            // Ajouter la page formatée au storyboard
            pagesResultat.push({
                pageNumber: pageScenario.numeroGlobal || (i + 1),
                description: pageScenario.description, // Description de la page du scénario
                cases: casesStoryboard
            });
        }

        const storyboardResult = {
            chapterTitle: chapitre.title || `Chapitre ${chapterIndex + 1}`,
            chapterSummary: chapitre.resume || "Aucun résumé.", // Utiliser 'resume' au lieu de 'summary'
            pages: pagesResultat,
            personnages: personnagesChapitre, // Personnages pertinents pour ce chapitre
            // lieu: lieuPrincipal, // Le lieu peut varier par case, peut-être pas utile ici
            univers: univers // Garder l'univers pour référence (prompts)
        };
        console.log("--- createStoryboardDetaille: Storyboard généré avec succès ---", storyboardResult);
        return storyboardResult;

    } catch (error) {
        console.error("--- createStoryboardDetaille: ERREUR lors de la création du storyboard détaillé ---", error);
        // Peut-être renvoyer null ou un objet d'erreur spécifique
        return null;
    }
}
console.log("--- storyboard_detaille.js : Fonction window.createStoryboardDetaille DÉFINIE. ---");


// --- Fonctions auxiliaires (SI elles étaient utilisées par createStoryboardDetaille avant) ---
// Si creerProgressionNarrative, creerCasesPage, etc., étaient utilisées DIRECTEMENT
// par createStoryboardDetaille, elles doivent être définies ICI ou importées.
// Sinon, si la logique est maintenant DANS createStoryboardDetaille (comme ci-dessus),
// ces fonctions auxiliaires ne sont plus nécessaires ici.

// Exemple de fonction auxiliaire (si elle était nécessaire)
// function creerProgressionNarrative(chapitre, acte) { ... }


console.log("--- storyboard_detaille.js : FIN ANALYSE ---");
