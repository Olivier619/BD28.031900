/**
 * BD Creator - Script Principal (main.js)
 * Gère l'initialisation et les interactions pour toutes les pages.
 */

// --- Variables globales ---
let projectData = {
    keywords: localStorage.getItem('bdKeywords') || "",
    scenario: null,
    storyboard: null, // Ajouté
    prompts: null
};

// --- Fonctions Utilitaires ---

// Fonction pour afficher le scénario (INCHANGÉE)
function displayScenario(scenario, container) {
    // ... (Code complet de displayScenario comme dans la réponse précédente) ...
    console.log(">>> displayScenario (Complet): Appelé avec", scenario, "dans", container);
    if (!container) { console.error("displayScenario: Conteneur HTML non fourni ou introuvable !"); container = document.getElementById('scenario-display-container'); if (!container) { console.error("displayScenario: Conteneur #scenario-display-container introuvable ! Arrêt."); return; } }
    if (!scenario || typeof scenario !== 'object' || !scenario.title) { console.error("displayScenario: Scénario invalide ou incomplet fourni:", scenario); container.innerHTML = '<p class="error-message">Erreur : Les données du scénario reçues sont invalides ou incomplètes.</p>'; return; }
    container.innerHTML = ''; let htmlContent = '';
    htmlContent += `<div class="scenario-header"><h3>${scenario.title}</h3>`; if (scenario.theme) htmlContent += `<p class="scenario-theme"><em>Thème: ${scenario.theme.substring(0,150)}${scenario.theme.length > 150 ? '...' : ''}</em></p>`; htmlContent += `</div>`;
    if (scenario.univers) { htmlContent += `<div class="scenario-section"><h4>Univers : ${scenario.univers.type || '?'}</h4><p>${scenario.univers.description || ''}</p><ul>`; if(scenario.univers.epoque) htmlContent += `<li>Époque: ${scenario.univers.epoque}</li>`; if(scenario.univers.technologie) htmlContent += `<li>Technologie: ${scenario.univers.technologie}</li>`; if(scenario.univers.particularites) htmlContent += `<li>Particularités: ${scenario.univers.particularites}</li>`; htmlContent += `</ul></div>`; }
    if (scenario.personnages && scenario.personnages.length > 0) { htmlContent += `<div class="scenario-section"><h4>Personnages</h4><ul class="personnages-list">`; scenario.personnages.forEach(p => { htmlContent += `<li class="personnage-item"><strong>${p.nom || '?'}</strong> (${p.archetype || '?'})`; if(p.description) htmlContent += `<br><small>${p.description}</small>`; if(p.apparence) htmlContent += `<br><small><i>Apparence:</i> ${p.apparence}</small>`; if(p.traitDistinctif) htmlContent += `<br><small><i>Trait:</i> ${p.traitDistinctif}</small>`; htmlContent += `</li>`; }); htmlContent += `</ul></div>`; }
    if (scenario.structureNarrative && scenario.structureNarrative.etapesParChapitre) { htmlContent += `<div class="scenario-section"><h4>Structure: ${scenario.structureNarrative.type || '?'}</h4><ol>`; scenario.structureNarrative.etapesParChapitre.forEach((etapes, idx) => { htmlContent += `<li>Chap ${idx + 1}: ${etapes}</li>`; }); htmlContent += `</ol></div>`; }
    if (scenario.chapters && scenario.chapters.length > 0) { htmlContent += `<div class="scenario-section"><h4>Chapitres (${scenario.chapters.length})</h4><div class="chapitres-accordion">`; scenario.chapters.forEach((chapitre, index) => { htmlContent += `<div class="chapitre-item"><div class="chapitre-header" onclick="this.classList.toggle('active'); const content = this.nextElementSibling; content.style.display = content.style.display === 'block' ? 'none' : 'block';">`; htmlContent += `Chapitre ${chapitre.numero || index + 1}: ${chapitre.titre || 'Sans Titre'} (+)</div>`; htmlContent += `<div class="chapitre-content"><p class="chapitre-resume"><strong>Résumé:</strong> ${chapitre.resume || 'Aucun résumé.'}</p>`; if (chapitre.pages && chapitre.pages.length > 0) htmlContent += `<p class="pages-count">${chapitre.pages.length} pages prévues.</p>`; if (chapitre.pages && chapitre.pages[0] && chapitre.pages[0].cases && chapitre.pages[0].cases[0]) { htmlContent += `<p><i>Début: ${chapitre.pages[0].cases[0].descriptionVisuelle.substring(0, 100)}...</i></p>`; } htmlContent += `</div></div>`; }); htmlContent += `</div></div>`; }
    else { htmlContent += `<p>Aucun chapitre généré dans ce scénario.</p>`; }
    container.innerHTML = htmlContent; console.log(">>> displayScenario (Complet): Affichage terminé.");
}

// Fonction pour générer et afficher le scénario (INCHANGÉE)
function generateAndDisplayScenario(keywords, generateButton, loadingElement) {
    // ... (Code complet de generateAndDisplayScenario comme avant) ...
    console.log("main.js: Appel de generateAndDisplayScenario pour:", keywords);
    if (typeof window.generateScenarioDetaille !== 'function') { console.error("ERREUR DANS generateAndDisplayScenario: window.generateScenarioDetaille n'est pas une fonction!"); alert("Erreur interne: La fonction generateScenarioDetaille n'est pas prête."); generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement && loadingElement.parentNode) loadingElement.parentNode.removeChild(loadingElement); return; }
    window.generateScenarioDetaille(keywords)
        .then(scenario => {
            console.log("main.js: Scénario reçu:", scenario); if (!scenario) { throw new Error("Scénario reçu est null/undefined."); }
            projectData.scenario = scenario; try { localStorage.setItem('bdScenario', JSON.stringify(scenario)); console.log("main.js: Scénario sauvegardé."); } catch (e) { console.error("main.js: Erreur sauvegarde localStorage:", e); alert("Attention: Scénario généré mais sauvegarde échouée."); }
            let scenarioContainer = document.getElementById('scenario-display-container'); if (!scenarioContainer) { console.warn("main.js: #scenario-display-container non trouvé. Création."); scenarioContainer = document.createElement('div'); scenarioContainer.id = 'scenario-display-container'; scenarioContainer.className = 'scenario-container'; generateButton.closest('.feature')?.parentNode?.insertBefore(scenarioContainer, generateButton.closest('.feature').nextSibling); }
            displayScenario(scenario, scenarioContainer); // Appel affichage COMPLÈTE
            generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement && loadingElement.parentNode) loadingElement.parentNode.removeChild(loadingElement); if (scenarioContainer.scrollIntoView) scenarioContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        })
        .catch(error => {
            console.error(">>> main.js: ERREUR CAPTURÉE dans le .catch() de generateAndDisplayScenario :", error); alert("Erreur pendant la génération/affichage. Voir console.");
            generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement && loadingElement.parentNode) loadingElement.parentNode.removeChild(loadingElement);
            let scenarioContainer = document.getElementById('scenario-display-container'); if(scenarioContainer) { scenarioContainer.innerHTML = `<p class="error-message">Impossible de générer le scénario. Détails dans la console.</p>`; }
        });
}

// **NOUVELLE FONCTION : Afficher le Storyboard**
function displayStoryboard(storyboardData, container) {
    console.log(">>> displayStoryboard: Appelé avec storyboardData:", storyboardData, "dans", container);
    if (!container) { console.error("displayStoryboard: Conteneur manquant !"); return; }
    if (!storyboardData || !storyboardData.pages || storyboardData.pages.length === 0) {
        container.innerHTML = '<p>Aucune donnée de storyboard à afficher.</p>';
        return;
    }

    let currentPageIndex = 0;
    const totalPages = storyboardData.pages.length;

    function renderPage(index) {
        if (index < 0 || index >= totalPages) return; // Index invalide
        currentPageIndex = index;
        const page = storyboardData.pages[index];

        let pageHtml = `<h4>Page ${page.pageNumber || (index + 1)} / ${totalPages}</h4>`;
        if (page.description) { // Utiliser la description de la page du storyboard si elle existe
             pageHtml += `<p><i>${page.description}</i></p>`;
        }

        if (page.cases && page.cases.length > 0) { // Utiliser 'cases' si c'est le nom dans storyboard_detaille.js
            pageHtml += `<div class="panels-container">`; // Utiliser une classe existante si possible
            page.cases.forEach((panel, panelIndex) => {
                pageHtml += `<div class="panel">`; // Utiliser une classe existante si possible
                pageHtml += `<h5>Case ${panelIndex + 1}</h5>`;
                if (panel.description) {
                    pageHtml += `<p class="panel-description"><strong>Visuel:</strong> ${panel.description}</p>`;
                }
                if (panel.dialogue) {
                    // Afficher le dialogue brut tel quel pour l'instant
                    pageHtml += `<div class="dialogue"><strong>Dialogue:</strong> ${panel.dialogue}</div>`;
                }
                 if (panel.personnages && panel.personnages.length > 0) {
                     pageHtml += `<div class="personnages-case"><small><i>Présents: ${panel.personnages.join(', ')}</i></small></div>`;
                 }

                pageHtml += `</div>`; // Fin panel
            });
            pageHtml += `</div>`; // Fin panels-container
        } else {
            pageHtml += `<p>Aucune case définie pour cette page.</p>`;
        }

        // Mettre à jour le contenu et la pagination
        const pageContentDiv = container.querySelector('.storyboard-page-content'); // Chercher une div interne
        if (pageContentDiv) {
             pageContentDiv.innerHTML = pageHtml;
             // Mettre à jour l'indicateur et les boutons (chercher par ID ou classe)
             const indicator = container.querySelector('.page-indicator');
             const prevBtn = container.querySelector('.prev-page-btn');
             const nextBtn = container.querySelector('.next-page-btn');
             if(indicator) indicator.textContent = `Page ${index + 1} / ${totalPages}`;
             if(prevBtn) prevBtn.disabled = (index === 0);
             if(nextBtn) nextBtn.disabled = (index === totalPages - 1);
        } else {
             console.error("displayStoryboard: Div '.storyboard-page-content' interne non trouvée.");
             container.innerHTML = pageHtml; // Fallback: remplacer tout le contenu
        }
    }

    // Créer la structure initiale (pagination + contenu) si elle n'existe pas
    if (!container.querySelector('.pagination-container')) {
        container.innerHTML = `
            <div class="pagination-container" style="margin-bottom: 15px; text-align: center;">
                <button class="prev-page-btn pagination-button" disabled>Précédent</button>
                <span class="page-indicator" style="margin: 0 15px;">Page 1 / ${totalPages}</span>
                <button class="next-page-btn pagination-button">Suivant</button>
            </div>
            <div class="storyboard-page-content">
                <!-- Le contenu de la page sera injecté ici -->
            </div>
        `;
        // Attacher les écouteurs aux nouveaux boutons
        container.querySelector('.prev-page-btn').addEventListener('click', () => renderPage(currentPageIndex - 1));
        container.querySelector('.next-page-btn').addEventListener('click', () => renderPage(currentPageIndex + 1));
    }

    // Afficher la première page
    renderPage(0);
}

// --- Initialisation ---
document.addEventListener('DOMContentLoaded', function() {
    console.log("main.js: DOM chargé.");

    // Initialisation Page Accueil
    const keywordsInput = document.getElementById('keywords');
    const generateButton = document.getElementById('generate-scenario-btn');
    const scenarioDisplayContainer = document.getElementById('scenario-display-container');
    if (keywordsInput && generateButton && scenarioDisplayContainer) {
        initializeHomePage(keywordsInput, generateButton, scenarioDisplayContainer);
    }

    // Initialisation Page Scénario
    const scenarioContainerPage = document.getElementById('scenario-container');
    const keywordsDisplayPage = document.getElementById('keywords-display');
    if (scenarioContainerPage && keywordsDisplayPage) {
        initializeScenarioPage(scenarioContainerPage, keywordsDisplayPage);
    }

    // **NOUVEAU : Initialisation Page Storyboard**
    const storyboardContainerPage = document.getElementById('storyboard-container');
    if (storyboardContainerPage) {
        initializeStoryboardPage(storyboardContainerPage);
    }

    // Ajouter ici l'initialisation pour la page Prompts quand elle sera prête
    // const promptsContainerPage = document.getElementById('prompts-container');
    // if (promptsContainerPage) {
    //     initializePromptsPage(promptsContainerPage);
    // }

    // Initialiser le gestionnaire de session (qui s'auto-initialise aussi sur DOMContentLoaded)
    if (window.bdSessionManager) { console.log("main.js: bdSessionManager trouvé."); }
    else { console.warn("main.js: bdSessionManager non trouvé."); }
});

// --- Fonctions d'Initialisation par Page ---

function initializeHomePage(keywordsInput, generateButton, scenarioDisplayContainer) {
    console.log("main.js: Initialisation Page Accueil.");
    if (!generateButton.dataset.listenerAttached) {
         generateButton.addEventListener('click', function() { /* ... Code listener complet ... */
             console.log(">>> Bouton cliqué!"); const keywords = keywordsInput.value; if (!keywords || keywords.trim() === '') { alert('Veuillez entrer du texte.'); return; }
             generateButton.disabled = true; generateButton.textContent = "Génération..."; let loadingElement = document.getElementById('loading-indicator');
             if (!loadingElement) { loadingElement = document.createElement('div'); loadingElement.id = 'loading-indicator'; loadingElement.innerHTML = '<p>Génération...</p>'; loadingElement.style.cssText = 'margin-top:15px; padding:10px; background:#eee; border-radius:4px; text-align:center;'; generateButton.parentNode.insertBefore(loadingElement, generateButton.nextSibling); } else { loadingElement.style.display = 'block'; }
             localStorage.removeItem('bdScenario'); localStorage.removeItem('bdStoryboard'); localStorage.removeItem('bdPrompts'); localStorage.setItem('bdKeywords', keywords);
             console.log(">>> Appel de generateAndDisplayScenario...");
              // Vérification cruciale avant appel
              if (typeof window.generateScenarioDetaille === 'function') {
                generateAndDisplayScenario(keywords, generateButton, loadingElement);
              } else {
                 console.error("INITIALIZE_HOME: generateScenarioDetaille non trouvé LORS DU CLIC!");
                 alert("Erreur critique: Fonction de génération indisponible au moment du clic.");
                 generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement && loadingElement.parentNode) loadingElement.parentNode.removeChild(loadingElement);
              }
         });
         generateButton.dataset.listenerAttached = 'true'; console.log("main.js: Écouteur attaché.");
    }
    // Afficher scénario existant
    const existingScenarioJson = localStorage.getItem('bdScenario');
    if (existingScenarioJson) { /* ... Code affichage existant ... */
         console.log("main.js: Affichage scénario existant (accueil)."); try { const existingScenario = JSON.parse(existingScenarioJson); displayScenario(existingScenario, scenarioDisplayContainer); keywordsInput.value = localStorage.getItem('bdKeywords') || ''; } catch (e) { console.error("main.js: Erreur parsing scénario existant (accueil):", e); localStorage.removeItem('bdScenario'); scenarioDisplayContainer.innerHTML = '<p class="error-message">Erreur chargement scénario sauvegardé.</p>'; }
    } else { scenarioDisplayContainer.innerHTML = ''; }
}

function initializeScenarioPage(scenarioContainerPage, keywordsDisplayPage) {
    console.log("main.js: Initialisation Page Scénario.");
    const keywords = localStorage.getItem('bdKeywords') || '';
    keywordsDisplayPage.textContent = keywords.substring(0, 150) + (keywords.length > 150 ? '...' : '');
    const scenarioJson = localStorage.getItem('bdScenario');
    if (scenarioJson) { /* ... Code affichage page scénario ... */
         try { const scenario = JSON.parse(scenarioJson); displayScenario(scenario, scenarioContainerPage); } catch (e) { console.error("main.js: Erreur affichage page Scénario:", e); scenarioContainerPage.innerHTML = '<p class="error-message">Erreur affichage scénario.</p>'; }
    } else { scenarioContainerPage.innerHTML = '<p>Aucun scénario généré. Retournez à l\'accueil.</p>'; }
}

// **NOUVELLE FONCTION : Initialisation Page Storyboard**
async function initializeStoryboardPage(storyboardContainerPage) {
    console.log("main.js: Initialisation Page Storyboard.");
    storyboardContainerPage.innerHTML = '<p>Chargement du storyboard...</p>'; // Message initial

    const scenarioJson = localStorage.getItem('bdScenario');
    if (!scenarioJson) {
        storyboardContainerPage.innerHTML = '<p class="error-message">Erreur: Aucun scénario trouvé. Veuillez générer un scénario à l\'accueil.</p>';
        return;
    }

    try {
        const scenario = JSON.parse(scenarioJson);
        projectData.scenario = scenario; // Mettre à jour si nécessaire

        // Essayer de charger un storyboard existant
        const existingStoryboardJson = localStorage.getItem('bdStoryboard');
        let storyboardData = null;

        if (existingStoryboardJson) {
            console.log("main.js: Storyboard existant trouvé.");
            try {
                storyboardData = JSON.parse(existingStoryboardJson);
                projectData.storyboard = storyboardData;
            } catch (parseError) {
                console.error("main.js: Erreur parsing storyboard existant:", parseError);
                localStorage.removeItem('bdStoryboard'); // Supprimer si corrompu
            }
        }

        // Si pas de storyboard existant ou erreur de parsing, le générer
        if (!storyboardData) {
            console.log("main.js: Aucun storyboard valide trouvé, tentative de génération...");
            if (typeof window.createStoryboardDetaille === 'function') {
                // Utiliser la fonction détaillée si disponible
                // Note: createStoryboardDetaille attend scenario ET chapterIndex.
                // Pour l'instant, générons pour le premier chapitre (index 0)
                // Il faudra ajouter une logique pour sélectionner le chapitre plus tard.
                if (scenario.chapters && scenario.chapters.length > 0) {
                    const chapterIndex = 0; // A CHANGER PLUS TARD pour sélection dynamique
                    storyboardData = await window.createStoryboardDetaille(scenario, chapterIndex);
                     // Mettre à jour le titre du chapitre sur la page
                     const chapterTitleElement = document.getElementById('chapter-title'); // Assurez-vous que cet ID existe dans storyboard.html
                     if(chapterTitleElement && storyboardData && storyboardData.chapterTitle) {
                        chapterTitleElement.textContent = storyboardData.chapterTitle;
                     }

                } else {
                     console.error("main.js: Le scénario ne contient aucun chapitre pour générer le storyboard.");
                     storyboardContainerPage.innerHTML = '<p class="error-message">Erreur: Le scénario chargé ne contient pas de chapitres.</p>';
                     return;
                }

            } else {
                // Fallback: utiliser la fonction simple si la détaillée n'existe pas
                console.warn("main.js: Fonction createStoryboardDetaille non trouvée, utilisation fallback non implémenté.");
                // storyboardData = await createStoryboardSimple(scenario); // Fonction hypothétique simple
                 storyboardContainerPage.innerHTML = '<p class="error-message">Erreur: Fonction de génération de storyboard non trouvée.</p>';
                 return; // Arrêter si aucune fonction de génération
            }

            if (storyboardData) {
                projectData.storyboard = storyboardData;
                try {
                    localStorage.setItem('bdStoryboard', JSON.stringify(storyboardData));
                    console.log("main.js: Storyboard généré et sauvegardé.");
                } catch (saveError) {
                    console.error("main.js: Erreur sauvegarde storyboard généré:", saveError);
                    // Continuer quand même l'affichage
                }
            } else {
                 console.error("main.js: La génération du storyboard a échoué (retour null).");
                 storyboardContainerPage.innerHTML = '<p class="error-message">Erreur lors de la génération du storyboard.</p>';
                 return;
            }
        }

        // Afficher le storyboard (existant ou nouvellement généré)
        displayStoryboard(storyboardData, storyboardContainerPage);

    } catch (error) {
        console.error("main.js: Erreur lors de l'initialisation de la page Storyboard:", error);
        storyboardContainerPage.innerHTML = '<p class="error-message">Une erreur est survenue lors du chargement du storyboard.</p>';
    }
}

// --- Ajouter initializePromptsPage ici quand prête ---


console.log("main.js (Complet) chargé.");

console.log("main.js (Complet) chargé.");
