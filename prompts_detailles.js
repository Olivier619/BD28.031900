/**
 * Fonction pour générer des prompts détaillés pour Midjourney à partir d'un storyboard.
 * Assure l'assignation à window.
 */
console.log("--- prompts_detailles.js : DÉBUT ANALYSE ---");

// Assignation à window
window.generatePromptsDetailles = async function(storyboard) {
    console.log("--- generatePromptsDetailles : Démarrage ---");
    try {
        // 1. Validation de l'entrée
        if (!storyboard || !storyboard.pages || !Array.isArray(storyboard.pages)) {
             console.error("generatePromptsDetailles: Données de storyboard invalides reçues.", storyboard);
             throw new Error("Données de storyboard invalides.");
        }
        if (storyboard.pages.length === 0) {
            console.warn("generatePromptsDetailles: Le storyboard ne contient aucune page.");
            return { pages: [] }; // Retourner un résultat vide mais valide
        }


        console.log("Génération des prompts détaillés pour le storyboard");
        const promptsResult = { pages: [] }; // Structure pour stocker les résultats

        // Récupérer les infos globales (peuvent être utiles pour les prompts)
        const personnagesGlobaux = storyboard.personnages || []; // Personnages définis au niveau du chapitre/storyboard
        const univers = storyboard.univers || { type: "contemporain" };

        // Styles et éléments visuels (comme dans votre fichier original)
        const artStylesParUnivers = { /* ... Votre objet artStylesParUnivers complet ... */
             "médiéval-fantastique": ["fantasy illustration style", "medieval fantasy art", /* ... */], "science-fiction": ["sci-fi concept art", /* ... */], /* ... etc */
             "contemporain": ["modern illustration style", "realistic contemporary art", "urban lifestyle illustration", "slice of life art style", "photorealistic illustration", "modern concept art", "contemporary graphic novel style"],
        };
        const elementsVisuelsDeBase = ["detailed", "high quality", /* ... */];
        const elementsVisuelsSpecifiques = { /* ... Votre objet elementsVisuelsSpecifiques complet ... */
             "médiéval-fantastique": ["magical atmosphere", /* ... */], "science-fiction": ["holographic displays", /* ... */], /* ... etc */
              "contemporain": ["urban environment", "modern architecture", "everyday objects", "realistic textures","contemporary fashion","familiar settings","current technology"],
        };


        // Parcourir chaque page du storyboard reçu
        for (const page of storyboard.pages) {
             if (!page || !page.cases || !Array.isArray(page.cases)) {
                 console.warn(`generatePromptsDetailles: Page ${page?.pageNumber} invalide ou sans cases.`);
                 // Ajouter une page vide ou avec erreur aux résultats ?
                  promptsResult.pages.push({ pageNumber: page?.pageNumber || '?', panels: [] });
                 continue; // Passer à la page suivante
             }

             const promptsPage = {
                pageNumber: page.pageNumber,
                panels: [] // Tableau pour les prompts de cette page
             };

            // Parcourir chaque case de la page
            for (const [index, caseItem] of page.cases.entries()) {
                 if (!caseItem) {
                     console.warn(`generatePromptsDetailles: Case invalide à l'index ${index} de la page ${page.pageNumber}.`);
                     continue;
                 }

                // Sélectionner style et éléments (logique originale)
                let artStyles = artStylesParUnivers[univers.type] || artStylesParUnivers["contemporain"];
                const style = artStyles[Math.floor(pseudoRandom(Date.now() + index * 10) * artStyles.length)]; // Utiliser un seed différent pour chaque case
                const elementsDeBase = selectionnerElementsAleatoires(elementsVisuelsDeBase, 3, 4, Date.now() + index * 11);
                const elementsSpecifiques = selectionnerElementsAleatoires(elementsVisuelsSpecifiques[univers.type] || elementsVisuelsSpecifiques["contemporain"], 2, 3, Date.now() + index * 12);

                // Extraire infos clés de la case
                const descriptionCase = caseItem.description || ""; // Utiliser description de la case storyboard
                const dialogueCase = caseItem.dialogue || null;
                const personnagesCaseNoms = caseItem.personnages || []; // Noms des personnages dans la case

                // Récupérer les objets personnages complets pour la description
                 const personnagesCompletsCase = personnagesGlobaux.filter(p => personnagesCaseNoms.includes(p.nom));


                // Créer description détaillée pour le prompt
                let promptDescription = creerDescriptionPrompt(
                    descriptionCase,
                    dialogueCase,
                    personnagesCompletsCase, // Passer les objets complets
                    personnagesGlobaux, // Passer tous les personnages pour référence si besoin
                    univers
                );

                // Assembler le prompt Midjourney
                const promptComplet = `${style}, ${elementsDeBase.join(", ")}, ${elementsSpecifiques.join(", ")}, ${promptDescription} --ar 16:9 --style raw`; // Exemple avec ratio et style
                 console.log(`Prompt généré pour P${page.pageNumber}-C${index+1}: ${promptComplet.substring(0,100)}...`);

                // Ajouter le prompt au résultat de la page
                promptsPage.panels.push({
                    // caseIdentifier: `Page ${page.pageNumber}, Case ${index + 1}`, // Peut-être pas nécessaire
                    prompt: promptComplet
                    // Ajouter d'autres infos si utile (ex: description originale)
                    // description_originale: descriptionCase
                });
            } // Fin boucle cases

             promptsResult.pages.push(promptsPage); // Ajouter la page de prompts complétée

        } // Fin boucle pages

        console.log("--- generatePromptsDetailles: Génération terminée avec succès ---", promptsResult);
        return promptsResult; // Renvoyer l'objet structuré { pages: [...] }

    } catch (error) {
        console.error("--- generatePromptsDetailles: ERREUR ---", error);
        return null; // Renvoyer null en cas d'erreur
    }
}
console.log("--- prompts_detailles.js : Fonction window.generatePromptsDetailles DÉFINIE. ---");

// --- Fonctions auxiliaires (COPIEZ VOS FONCTIONS ORIGINALES ICI) ---
// IMPORTANT: Assurez-vous que toutes les fonctions appelées par generatePromptsDetailles
// (comme selectionnerElementsAleatoires, creerDescriptionPrompt, extraireElementsVisuels, etc.)
// sont bien définies dans ce fichier.

// Fonction pseudo-aléatoire (si utilisée dans les auxiliaires)
function pseudoRandom(seed) { let x = Math.sin(seed) * 10000; return x - Math.floor(x); }

// Exemple (adaptez avec VOS fonctions réelles)
function selectionnerElementsAleatoires(liste, min, max, seed) {
    if (!liste || liste.length === 0) return [];
    const nombreElements = Math.max(0, Math.floor(pseudoRandom(seed) * (max - min + 1)) + min);
    const elements = [];
    const listeCopiee = [...liste];
    for (let i = 0; i < nombreElements && listeCopiee.length > 0; i++) {
        const index = Math.floor(pseudoRandom(seed + i + 1) * listeCopiee.length);
        elements.push(listeCopiee.splice(index, 1)[0]);
    }
    return elements;
}

function creerDescriptionPrompt(description, dialogue, personnagesCase, personnagesGlobaux, univers) {
    let promptDesc = description; // Commencer avec la description de la case
    // Ajouter détails personnages présents
    if (personnagesCase.length > 0) {
        promptDesc += `, featuring ${personnagesCase.map(p => `${p.nom} (${p.apparence || ''}, ${p.traitDistinctif || ''})`).join(' and ')}`;
    }
     // Ajouter éléments d'ambiance basés sur l'univers
     if (univers.type === 'cyberpunk') promptDesc += ", neon lights, rainy streets";
     if (univers.type === 'médiéval-fantastique') promptDesc += ", mystical glow, ancient ruins";
     // Ajouter émotion du dialogue
     if (dialogue) {
        // Logique simple pour extraire émotion (à améliorer)
         if (dialogue.includes("!")) promptDesc += ", dramatic expression";
         if (dialogue.includes("?")) promptDesc += ", questioning look";
     }
    return promptDesc;
}

// Assurez-vous que TOUTES les autres fonctions nécessaires (extraireElementsVisuels, etc.) sont ici

function extraireElementsVisuels(description) { /* ... Votre code ... */ return ["dynamic composition"]; } // Placeholder
function extraireAmbianceEtEclairage(description) { /* ... Votre code ... */ return "cinematic lighting"; } // Placeholder
function getDetailsLieuPourPrompt(typeUnivers) { /* ... Votre code ... */ return `${typeUnivers} setting`; } // Placeholder
function extraireEmotionDuDialogue(dialogue) { /* ... Votre code ... */ return "neutral"; } // Placeholder
function traduireCadrage(cadrage) { /* ... Votre code ... */ return cadrage.toLowerCase().replace(' ','_'); } // Placeholder
function traduireAction(action) { /* ... Votre code ... */ return action; } // Placeholder
function traduireEmotion(emotion) { /* ... Votre code ... */ return emotion; } // Placeholder


console.log("--- prompts_detailles.js : FIN ANALYSE ---");
