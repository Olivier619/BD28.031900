/**
 * BD Creator - Script Principal (main.js)
 * Gère l'initialisation de l'application et les interactions principales.
 * Version finale avec affichage détaillé du scénario.
 */

// --- Variables globales ---
let projectData = {
    keywords: localStorage.getItem('bdKeywords') || "",
    scenario: null, // Sera chargé/mis à jour
    // storyboard: null, // Décommenter si/quand utilisé
    // prompts: null     // Décommenter si/quand utilisé
};

// --- Fonctions Utilitaires ---

// FONCTION D'AFFICHAGE COMPLÈTE
function displayScenario(scenario, container) {
    console.log(">>> displayScenario (Complet): Appelé avec", scenario, "dans", container);

    if (!container) {
        console.error("displayScenario: Conteneur HTML non fourni ou introuvable !");
        container = document.getElementById('scenario-display-container'); // Tentative de récupération
        if (!container) {
            console.error("displayScenario: Conteneur #scenario-display-container introuvable ! Arrêt.");
            return; // Impossible d'afficher sans conteneur
        }
    }
    if (!scenario || typeof scenario !== 'object' || !scenario.title) { // Ajout d'une vérification plus stricte
        console.error("displayScenario: Scénario invalide ou incomplet fourni:", scenario);
        container.innerHTML = '<p class="error-message">Erreur : Les données du scénario reçues sont invalides ou incomplètes.</p>';
        return;
    }

    container.innerHTML = ''; // Vider le conteneur
    let htmlContent = '';

    // En-tête
    htmlContent += `<div class="scenario-header"><h3>${scenario.title}</h3>`;
    if (scenario.theme) htmlContent += `<p class="scenario-theme"><em>Thème: ${scenario.theme.substring(0,150)}${scenario.theme.length > 150 ? '...' : ''}</em></p>`;
    htmlContent += `</div>`;

    // Univers
    if (scenario.univers) {
        htmlContent += `<div class="scenario-section"><h4>Univers : ${scenario.univers.type || '?'}</h4><p>${scenario.univers.description || ''}</p><ul>`;
        if(scenario.univers.epoque) htmlContent += `<li>Époque: ${scenario.univers.epoque}</li>`;
        if(scenario.univers.technologie) htmlContent += `<li>Technologie: ${scenario.univers.technologie}</li>`;
        if(scenario.univers.particularites) htmlContent += `<li>Particularités: ${scenario.univers.particularites}</li>`;
        htmlContent += `</ul></div>`;
    }

    // Personnages
    if (scenario.personnages && scenario.personnages.length > 0) {
        htmlContent += `<div class="scenario-section"><h4>Personnages</h4><ul class="personnages-list">`;
        scenario.personnages.forEach(p => {
            htmlContent += `<li class="personnage-item"><strong>${p.nom || '?'}</strong> (${p.archetype || '?'})`;
            if(p.description) htmlContent += `<br><small>${p.description}</small>`;
            // Ajouter apparence et trait si présents
            if(p.apparence) htmlContent += `<br><small><i>Apparence:</i> ${p.apparence}</small>`;
            if(p.traitDistinctif) htmlContent += `<br><small><i>Trait:</i> ${p.traitDistinctif}</small>`;
            htmlContent += `</li>`;
        });
        htmlContent += `</ul></div>`;
    }

    // Structure Narrative
    if (scenario.structureNarrative && scenario.structureNarrative.etapesParChapitre) {
         htmlContent += `<div class="scenario-section"><h4>Structure: ${scenario.structureNarrative.type || '?'}</h4><ol>`;
         scenario.structureNarrative.etapesParChapitre.forEach((etapes, idx) => { htmlContent += `<li>Chap ${idx + 1}: ${etapes}</li>`; });
         htmlContent += `</ol></div>`;
    }

    // Chapitres (Accordéon)
    if (scenario.chapters && scenario.chapters.length > 0) {
        htmlContent += `<div class="scenario-section"><h4>Chapitres (${scenario.chapters.length})</h4><div class="chapitres-accordion">`;
        scenario.chapters.forEach((chapitre, index) => {
            htmlContent += `<div class="chapitre-item"><div class="chapitre-header" onclick="this.classList.toggle('active'); const content = this.nextElementSibling; content.style.display = content.style.display === 'block' ? 'none' : 'block';">`;
            htmlContent += `Chapitre ${chapitre.numero || index + 1}: ${chapitre.titre || 'Sans Titre'} (+)</div>`;
            // Le contenu est caché par CSS initialement (display: none)
            htmlContent += `<div class="chapitre-content"><p class="chapitre-resume"><strong>Résumé:</strong> ${chapitre.resume || 'Aucun résumé.'}</p>`;
            if (chapitre.pages && chapitre.pages.length > 0) htmlContent += `<p class="pages-count">${chapitre.pages.length} pages prévues.</p>`;
            // Ajouter un aperçu des descriptions de cases si disponible (exemple)
            if (chapitre.pages && chapitre.pages[0] && chapitre.pages[0].cases && chapitre.pages[0].cases[0]) {
                htmlContent += `<p><i>Début: ${chapitre.pages[0].cases[0].descriptionVisuelle.substring(0, 100)}...</i></p>`;
            }
            htmlContent += `</div></div>`;
        });
        htmlContent += `</div></div>`;
    } else {
         htmlContent += `<p>Aucun chapitre généré dans ce scénario.</p>`;
    }

    container.innerHTML = htmlContent;
    console.log(">>> displayScenario (Complet): Affichage terminé.");
}

// Fonction pour générer et afficher (légèrement ajustée pour utiliser displayScenario complet)
function generateAndDisplayScenario(keywords, generateButton, loadingElement) {
    console.log("main.js: Appel de generateAndDisplayScenario pour:", keywords);
    if (typeof window.generateScenarioDetaille !== 'function') {
        console.error("ERREUR DANS generateAndDisplayScenario: window.generateScenarioDetaille n'est pas une fonction!");
        alert("Erreur interne: La fonction generateScenarioDetaille n'est pas prête.");
        generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement && loadingElement.parentNode) loadingElement.parentNode.removeChild(loadingElement);
        return;
    }

    window.generateScenarioDetaille(keywords)
        .then(scenario => {
            console.log("main.js: Scénario reçu:", scenario);
            if (!scenario) { throw new Error("Scénario reçu est null/undefined."); }

            projectData.scenario = scenario;
            try {
                localStorage.setItem('bdScenario', JSON.stringify(scenario));
                console.log("main.js: Scénario sauvegardé.");
            } catch (e) {
                console.error("main.js: Erreur sauvegarde localStorage:", e);
                alert("Attention: Scénario généré mais sauvegarde échouée.");
            }

            let scenarioContainer = document.getElementById('scenario-display-container');
             if (!scenarioContainer) {
                 console.warn("main.js: #scenario-display-container non trouvé. Création.");
                 scenarioContainer = document.createElement('div');
                 scenarioContainer.id = 'scenario-display-container';
                 scenarioContainer.className = 'scenario-container';
                 generateButton.closest('.feature')?.parentNode?.insertBefore(scenarioContainer, generateButton.closest('.feature').nextSibling);
            }

            // Appel de la fonction d'affichage COMPLÈTE
            displayScenario(scenario, scenarioContainer);

            // Nettoyage UI
            generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement && loadingElement.parentNode) loadingElement.parentNode.removeChild(loadingElement);
             if (scenarioContainer.scrollIntoView) scenarioContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

        })
        .catch(error => {
            console.error(">>> main.js: ERREUR CAPTURÉE dans le .catch() de generateAndDisplayScenario :", error);
            alert("Erreur pendant la génération/affichage. Voir console.");
            generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement && loadingElement.parentNode) loadingElement.parentNode.removeChild(loadingElement);
            // Afficher un message d'erreur dans le conteneur
            let scenarioContainer = document.getElementById('scenario-display-container');
            if(scenarioContainer) {
                scenarioContainer.innerHTML = `<p class="error-message">Impossible de générer le scénario. Détails dans la console.</p>`;
            }
        });
}

// --- Initialisation Directe dans DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', function() {
    console.log("main.js (Complet): DOM chargé.");

    const keywordsInput = document.getElementById('keywords');
    const generateButton = document.getElementById('generate-scenario-btn');
    const scenarioDisplayContainer = document.getElementById('scenario-display-container');

    if (keywordsInput && generateButton && scenarioDisplayContainer) {
        console.log("main.js (Complet): Éléments de la page d'accueil trouvés.");

        // Attacher l'écouteur
        if (!generateButton.dataset.listenerAttached) {
             generateButton.addEventListener('click', function() {
                 console.log(">>> Bouton cliqué!");
                 const keywords = keywordsInput.value;
                 if (!keywords || keywords.trim() === '') { alert('Veuillez entrer du texte.'); return; }
                 generateButton.disabled = true; generateButton.textContent = "Génération...";
                 let loadingElement = document.getElementById('loading-indicator');
                 if (!loadingElement) {
                     loadingElement = document.createElement('div'); loadingElement.id = 'loading-indicator';
                     loadingElement.innerHTML = '<p>Génération...</p>'; loadingElement.style.cssText = 'margin-top:15px; padding:10px; background:#eee; border-radius:4px; text-align:center;';
                     generateButton.parentNode.insertBefore(loadingElement, generateButton.nextSibling);
                 } else { loadingElement.style.display = 'block'; }
                 localStorage.removeItem('bdScenario'); localStorage.removeItem('bdStoryboard'); localStorage.removeItem('bdPrompts');
                 localStorage.setItem('bdKeywords', keywords);
                 console.log(">>> Appel de generateAndDisplayScenario...");
                 generateAndDisplayScenario(keywords, generateButton, loadingElement);
             });
             generateButton.dataset.listenerAttached = 'true';
             console.log("main.js (Complet): Écouteur attaché au bouton.");
         }

        // Afficher scénario existant
        const existingScenarioJson = localStorage.getItem('bdScenario');
        if (existingScenarioJson) {
            console.log("main.js (Complet): Affichage scénario existant.");
            try {
                const existingScenario = JSON.parse(existingScenarioJson);
                displayScenario(existingScenario, scenarioDisplayContainer); // Appel fonction complète
                keywordsInput.value = localStorage.getItem('bdKeywords') || '';
            } catch (e) {
                console.error("main.js (Complet): Erreur parsing scénario existant:", e);
                localStorage.removeItem('bdScenario');
                scenarioDisplayContainer.innerHTML = '<p class="error-message">Erreur chargement scénario.</p>';
            }
        } else {
            scenarioDisplayContainer.innerHTML = ''; // Vider si rien
        }

    } else {
        console.log("main.js (Complet): Pas sur la page d'accueil ou éléments manquants.");
    }

    // Initialiser Session Manager (si présent)
     if (window.bdSessionManager) {
         console.log("main.js (Complet): bdSessionManager trouvé.");
     } else {
         console.warn("main.js (Complet): bdSessionManager non trouvé.");
     }

     // Logique pour les autres pages (scenario.html, etc.) - Utilise la fonction displayScenario complète
     const scenarioContainerPage = document.getElementById('scenario-container');
     const keywordsDisplayPage = document.getElementById('keywords-display');
     if (scenarioContainerPage && keywordsDisplayPage) {
         console.log("main.js (Complet): Initialisation page Scénario.");
         const keywords = localStorage.getItem('bdKeywords') || '';
         keywordsDisplayPage.textContent = keywords.substring(0, 150) + (keywords.length > 150 ? '...' : '');
         const scenarioJson = localStorage.getItem('bdScenario');
         if (scenarioJson) { try { const scenario = JSON.parse(scenarioJson); displayScenario(scenario, scenarioContainerPage); } catch (e) { console.error("main.js: Erreur affichage page Scénario:", e); scenarioContainerPage.innerHTML = '<p class="error-message">Erreur affichage scénario.</p>'; } }
         else { scenarioContainerPage.innerHTML = '<p>Aucun scénario généré. Retournez à l\'accueil.</p>'; }
     }
     // Ajouter ici la logique pour storyboard et prompts si nécessaire...

});

console.log("main.js (Complet) chargé.");
