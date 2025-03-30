/**
 * Fonction pour générer des prompts détaillés pour Midjourney.
 * Assignée à window.generatePromptsDetailles.
 */
console.log("--- prompts_detailles.js : DÉBUT ANALYSE ---");

window.generatePromptsDetailles = async function(storyboard) {
    console.log("--- generatePromptsDetailles : Démarrage ---");
    try {
        // Validation
        if (!storyboard || !storyboard.pages || !Array.isArray(storyboard.pages)) { throw new Error("Données storyboard invalides."); }
        if (storyboard.pages.length === 0) { console.warn("generatePromptsDetailles: Storyboard sans pages."); return { pages: [] }; }

        console.log("Génération prompts détaillés...");
        const promptsResult = { pages: [] };
        const personnagesGlobaux = storyboard.personnages || [];
        const univers = storyboard.univers || { type: "contemporain" };

        // Styles et éléments visuels (condensé)
        const artStylesParUnivers = { "contemporain": ["modern illustration style", "realistic contemporary art", "photorealistic"], /* ... */ };
        const elementsVisuelsDeBase = ["detailed", "high quality", "cinematic lighting", "dynamic composition"];
        const elementsVisuelsSpecifiques = { "contemporain": ["urban environment", "modern architecture"], /* ... */ };

        for (const page of storyboard.pages) {
             if (!page || !page.cases || !Array.isArray(page.cases)) { console.warn(`generatePromptsDetailles: Page ${page?.pageNumber} invalide.`); promptsResult.pages.push({ pageNumber: page?.pageNumber || '?', panels: [] }); continue; }
             const promptsPage = { pageNumber: page.pageNumber, panels: [] };

            for (const [index, caseItem] of page.cases.entries()) {
                 if (!caseItem) { console.warn(`generatePromptsDetailles: Case invalide P${page.pageNumber}-C${index+1}.`); continue; }

                let artStyles = artStylesParUnivers[univers.type] || artStylesParUnivers["contemporain"] || ["illustration style"];
                const style = artStyles[Math.floor(pseudoRandom(Date.now() + index * 10) * artStyles.length)];
                const elementsDeBase = selectionnerElementsAleatoires(elementsVisuelsDeBase, 2, 3, Date.now() + index * 11);
                const elementsSpecifiques = selectionnerElementsAleatoires(elementsVisuelsSpecifiques[univers.type] || elementsVisuelsSpecifiques["contemporain"] || [], 1, 2, Date.now() + index * 12);

                const descriptionCase = caseItem.description || "";
                const dialogueCase = caseItem.dialogue || null;
                const personnagesCaseNoms = caseItem.personnages || [];
                const personnagesCompletsCase = personnagesGlobaux.filter(p => personnagesCaseNoms.includes(p.nom));

                let promptDescription = creerDescriptionPrompt(descriptionCase, dialogueCase, personnagesCompletsCase, personnagesGlobaux, univers);

                const promptComplet = `${style}, ${elementsDeBase.join(", ")}, ${elementsSpecifiques.join(", ")}, ${promptDescription} --ar 16:9 --style raw`.replace(/, ,/g, ',').replace(/, $/,'').replace(/,\s*--/,' --'); // Nettoyage

                promptsPage.panels.push({ prompt: promptComplet });
            }
             promptsResult.pages.push(promptsPage);
        }

        console.log("--- generatePromptsDetailles: Génération terminée ---");
        return promptsResult;

    } catch (error) {
        console.error("--- generatePromptsDetailles: ERREUR ---", error);
        return null;
    }
}
console.log("--- prompts_detailles.js : Fonction window.generatePromptsDetailles DÉFINIE. ---");

// --- Fonctions auxiliaires (ASSUREZ-VOUS D'AVOIR LES VÔTRES) ---
function pseudoRandom(seed) { let x = Math.sin(seed) * 10000; return x - Math.floor(x); }
function selectionnerElementsAleatoires(liste, min, max, seed) { if (!liste || liste.length === 0) return []; const nombreElements = Math.max(0, Math.floor(pseudoRandom(seed) * (max - min + 1)) + min); const elements = []; const listeCopiee = [...liste]; for (let i = 0; i < nombreElements && listeCopiee.length > 0; i++) { const index = Math.floor(pseudoRandom(seed + i + 1) * listeCopiee.length); elements.push(listeCopiee.splice(index, 1)[0]); } return elements; }
function creerDescriptionPrompt(description, dialogue, personnagesCase, personnagesGlobaux, univers) { let promptDesc = description; if (personnagesCase.length > 0) { promptDesc += `, featuring ${personnagesCase.map(p => `${p.nom} (${p.apparence || 'normal'}, ${p.traitDistinctif || 'aucun'})`).join(' and ')}`; } if (univers.type === 'cyberpunk') promptDesc += ", neon lights"; if (dialogue) { if (dialogue.includes("!")) promptDesc += ", dramatic expression"; if (dialogue.includes("?")) promptDesc += ", questioning look"; } return promptDesc;}
// Ajouter les autres fonctions auxiliaires si elles existent dans votre version originale...

console.log("--- prompts_detailles.js : FIN ANALYSE ---");
