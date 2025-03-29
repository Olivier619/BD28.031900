/**
 * BD Creator - Script Principal (main.js)
 * Gère l'initialisation de l'application et les interactions principales.
 * Nouvelle version avec vérification explicite et logs de débogage.
 */

// --- Variables globales ---
let projectData = {
    keywords: localStorage.getItem('bdKeywords') || "",
    scenario: null,
    storyboard: null,
    prompts: null
};

// --- Fonctions Utilitaires ---

function displayScenario(scenario, container) {
    // *** POINT DE CONTRÔLE 2 ***
    console.log('>>> displayScenario: Fonction appelée avec scenario:', scenario, 'et container:', container);

    if (!scenario || typeof scenario !== 'object') {
        console.error("displayScenario: Scénario invalide fourni.", scenario);
        container.innerHTML = '<p class="error-message">Impossible d\'afficher le scénario (données invalides).</p>';
        return;
    }
     if (!container) {
        console.error("displayScenario: Conteneur HTML non trouvé.");
        container = document.getElementById('scenario-display-container');
         if(!container) {
            console.error("displayScenario: Conteneur #scenario-display-container introuvable.");
            return;
         }
    }
    container.innerHTML = '';
    let htmlContent = '';
    htmlContent += `<div class="scenario-header"><h3>${scenario.title || "Scénario Sans Titre"}</h3>`;
    if (scenario.theme) htmlContent += `<p class="scenario-theme"><em>Thème: ${scenario.theme.substring(0,100)}${scenario.theme.length > 100 ? '...' : ''}</em></p>`;
    htmlContent += `</div>`;
    if (scenario.univers) { /* ... Code affichage univers ... */
        htmlContent += `<div class="scenario-section"><h4>Univers : ${scenario.univers.type || '?'}</h4><p>${scenario.univers.description || ''}</p><ul>`;
        if(scenario.univers.epoque) htmlContent += `<li>Époque: ${scenario.univers.epoque}</li>`;
        if(scenario.univers.technologie) htmlContent += `<li>Technologie: ${scenario.univers.technologie}</li>`;
        if(scenario.univers.particularites) htmlContent += `<li>Particularités: ${scenario.univers.particularites}</li>`;
        htmlContent += `</ul></div>`;
    }
    if (scenario.personnages && scenario.personnages.length > 0) { /* ... Code affichage personnages ... */
        htmlContent += `<div class="scenario-section"><h4>Personnages</h4><ul class="personnages-list">`;
        scenario.personnages.forEach(p => { htmlContent += `<li class="personnage-item"><strong>${p.nom || '?'}</strong> (${p.archetype || '?'})${p.description ? `<br><small>${p.description}</small>`:''}</li>`; });
        htmlContent += `</ul></div>`;
    }
    if (scenario.structureNarrative && scenario.structureNarrative.etapesParChapitre) { /* ... Code affichage structure ... */
         htmlContent += `<div class="scenario-section"><h4>Structure: ${scenario.structureNarrative.type || '?'}</h4><ol>`;
         scenario.structureNarrative.etapesParChapitre.forEach((etapes, idx) => { htmlContent += `<li>Chap ${idx + 1}: ${etapes}</li>`; });
         htmlContent += `</ol></div>`;
    }
    if (scenario.chapters && scenario.chapters.length > 0) { /* ... Code affichage chapitres ... */
        htmlContent += `<div class="scenario-section"><h4>Chapitres (${scenario.chapters.length})</h4><div class="chapitres-accordion">`;
        scenario.chapters.forEach((chapitre, index) => {
            htmlContent += `<div class="chapitre-item"><div class="chapitre-header" onclick="this.classList.toggle('active'); const content = this.nextElementSibling; content.style.display = content.style.display === 'block' ? 'none' : 'block';">`;
            htmlContent += `Chapitre ${chapitre.numero || index + 1}: ${chapitre.titre || 'Sans Titre'} (+)</div>`;
            htmlContent += `<div class="chapitre-content"><p class="chapitre-resume"><strong>Résumé:</strong> ${chapitre.resume || 'Aucun résumé.'}</p>`;
            if (chapitre.pages && chapitre.pages.length > 0) htmlContent += `<p class="pages-count">${chapitre.pages.length} pages.</p>`;
            htmlContent += `</div></div>`;
        });
        htmlContent += `</div></div>`;
    }
    container.innerHTML = htmlContent;
    console.log(">>> displayScenario: Fin de l'injection HTML.");
}

function generateAndDisplayScenario(keywords, generateButton, loadingElement) {
    console.log("main.js: Appel de generateAndDisplayScenario pour:", keywords);
    if (typeof window.generateScenarioDetaille !== 'function') {
        console.error("ERREUR DANS generateAndDisplayScenario: window.generateScenarioDetaille n'est pas une fonction!");
        alert("Erreur interne: La fonction generateScenarioDetaille n'est pas prête.");
        generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement && loadingElement.parentNode) loadingElement.parentNode.removeChild(loadingElement); return;
    }

    window.generateScenarioDetaille(keywords)
        .then(scenario => {
            console.log("main.js: Scénario reçu de generateScenarioDetaille:", scenario);

            // *** POINT DE CONTRÔLE 3 ***
            console.log('>>> main.js: Objet Scénario reçu dans .then():', scenario);
            if (!scenario || typeof scenario !== 'object') {
                 console.error(">>> main.js: Le scénario reçu est INVALIDE ou null !");
                 throw new Error("Le scénario reçu est invalide ou null."); // Provoquer une erreur pour le catch
            }


            projectData.scenario = scenario;
            try {
                localStorage.setItem('bdScenario', JSON.stringify(scenario));
                console.log("main.js: Scénario sauvegardé dans localStorage.");
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

            // *** POINT DE CONTRÔLE 4 ***
            console.log('>>> main.js: Appel de displayScenario depuis .then()');
            displayScenario(scenario, scenarioContainer);

            // Nettoyage UI
            generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement && loadingElement.parentNode) loadingElement.parentNode.removeChild(loadingElement);
            if (scenarioContainer.scrollIntoView) scenarioContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

        })
        .catch(error => {
            // *** POINT DE CONTRÔLE 5 ***
            console.error('>>> main.js: ERREUR CAPTURÉE dans le .catch() de generateAndDisplayScenario :', error);
            console.error("main.js: Erreur dans promesse generateAndDisplayScenario:", error);
            alert("Erreur génération/affichage scénario. Vérifiez la console.");
            generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement && loadingElement.parentNode) loadingElement.parentNode.removeChild(loadingElement);
        });
}

// --- Fonction d'Initialisation Principale ---
function initializeApp() {
    console.log("main.js: initializeApp() appelée.");

    if (typeof window.generateScenarioDetaille === 'function') {
        console.log("main.js: window.generateScenarioDetaille est DÉFINIE. Initialisation immédiate.");
        initializeHomePage();
        initializeOtherPages(); // Initialiser les autres pages aussi
    } else {
        console.warn("main.js: window.generateScenarioDetaille n'est PAS encore définie. Report...");
        // Utiliser un intervalle pour vérifier plus fréquemment au début, puis moins souvent
        let checkInterval = setInterval(() => {
            if (typeof window.generateScenarioDetaille === 'function') {
                clearInterval(checkInterval); // Arrêter l'intervalle une fois la fonction trouvée
                console.log("main.js: window.generateScenarioDetaille est maintenant DÉFINIE. Initialisation...");
                initializeHomePage();
                initializeOtherPages();
            } else {
                console.log("main.js: ...vérification de generateScenarioDetaille...");
            }
        }, 50); // Vérifier toutes les 50ms

         // Sécurité : arrêter après un certain temps pour éviter une boucle infinie
         setTimeout(() => {
             if (typeof window.generateScenarioDetaille !== 'function') {
                 clearInterval(checkInterval);
                 console.error("main.js: ÉCHEC - window.generateScenarioDetaille n'a pas été définie après plusieurs secondes. Problème de chargement de scenario_detaille.js ?");
                 alert("Erreur critique: Impossible de charger la fonction de génération de scénario.");
             }
         }, 5000); // Arrêter après 5 secondes
    }
}

// --- Initialisation Spécifique à la Page d'Accueil ---
function initializeHomePage() {
    const keywordsInput = document.getElementById('keywords');
    const generateButton = document.getElementById('generate-scenario-btn');
    const scenarioDisplayContainer = document.getElementById('scenario-display-container');

    if (keywordsInput && generateButton && scenarioDisplayContainer) {
        console.log("main.js: Initialisation effective de la page d'accueil.");

        // Attacher l'écouteur (avec vérification pour éviter doublons)
        if (!generateButton.dataset.listenerAttached) {
             generateButton.addEventListener('click', function() {
                 console.log("main.js: Bouton 'Générer un scénario' cliqué.");
                 const keywords = keywordsInput.value;
                 if (!keywords || keywords.trim() === '') { alert('Veuillez entrer du texte.'); return; }
                 generateButton.disabled = true; generateButton.textContent = "Génération...";
                 let loadingElement = document.getElementById('loading-indicator');
                 if (!loadingElement) {
                     loadingElement = document.createElement('div'); loadingElement.id = 'loading-indicator';
                     loadingElement.innerHTML = '<p>Génération du scénario...</p>';
                     loadingElement.style.cssText = 'margin-top:15px; padding:10px; background:#eee; border-radius:4px; text-align:center;';
                     generateButton.parentNode.insertBefore(loadingElement, generateButton.nextSibling);
                 } else { loadingElement.style.display = 'block'; }
                 localStorage.removeItem('bdScenario'); localStorage.removeItem('bdStoryboard'); localStorage.removeItem('bdPrompts');
                 localStorage.setItem('bdKeywords', keywords);
                 // *** POINT DE CONTRÔLE 6 ***
                 console.log(">>> main.js: Appel de generateAndDisplayScenario depuis le listener du bouton.");
                 generateAndDisplayScenario(keywords, generateButton, loadingElement);
             });
             generateButton.dataset.listenerAttached = 'true';
              console.log("main.js: Écouteur d'événements attaché au bouton.");
         } else {
              console.log("main.js: Écouteur déjà attaché au bouton.");
         }


        // Afficher le scénario existant
        const existingScenarioJson = localStorage.getItem('bdScenario');
        if (existingScenarioJson) {
            console.log("main.js: Affichage du scénario existant (accueil).");
            try {
                const existingScenario = JSON.parse(existingScenarioJson);
                displayScenario(existingScenario, scenarioDisplayContainer);
                keywordsInput.value = localStorage.getItem('bdKeywords') || '';
            } catch (e) {
                console.error("main.js: Erreur parsing scénario existant (accueil):", e);
                localStorage.removeItem('bdScenario');
                scenarioDisplayContainer.innerHTML = '<p class="error-message">Erreur chargement scénario sauvegardé.</p>';
            }
        } else {
             console.log("main.js: Pas de scénario existant.");
             scenarioDisplayContainer.innerHTML = '';
        }
    } else {
         // Ne pas afficher d'erreur si on n'est pas sur la page d'accueil
         // console.log("main.js: Pas sur la page d'accueil ou éléments manquants.");
    }
}

// --- Initialisation Spécifique aux Autres Pages ---
function initializeOtherPages() {
    const scenarioContainerPage = document.getElementById('scenario-container');
    const keywordsDisplayPage = document.getElementById('keywords-display');
    if (scenarioContainerPage && keywordsDisplayPage) { /* ... code page scénario ... */
        console.log("main.js: Initialisation page Scénario.");
        const keywords = localStorage.getItem('bdKeywords') || '';
        keywordsDisplayPage.textContent = keywords.substring(0, 150) + (keywords.length > 150 ? '...' : '');
        const scenarioJson = localStorage.getItem('bdScenario');
        if (scenarioJson) { try { const scenario = JSON.parse(scenarioJson); displayScenario(scenario, scenarioContainerPage); } catch (e) { console.error("main.js: Erreur affichage page Scénario:", e); scenarioContainerPage.innerHTML = '<p class="error-message">Erreur affichage scénario.</p>'; } }
        else { scenarioContainerPage.innerHTML = '<p>Aucun scénario généré. Retournez à l\'accueil.</p>'; }
    }

    const storyboardContainerPage = document.getElementById('storyboard-container');
     if (storyboardContainerPage) { /* ... code page storyboard ... */
         console.log("main.js: Initialisation page Storyboard.");
         // Charger et afficher storyboard... displayStoryboard(...)
     }

     const promptsContainerPage = document.getElementById('prompts-container');
     if (promptsContainerPage) { /* ... code page prompts ... */
         console.log("main.js: Initialisation page Prompts.");
         // Charger et afficher prompts... displayPrompts(...)
     }
}

// --- Point d'Entrée Principal ---
document.addEventListener('DOMContentLoaded', initializeApp);

console.log("main.js chargé et prêt à initialiser l'application.");
