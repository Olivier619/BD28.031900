/**
 * BD Creator - Script Principal (main.js)
 * Gère l'initialisation et les interactions pour toutes les pages.
 */

// --- Variables globales ---
let projectData = {
    keywords: localStorage.getItem('bdKeywords') || "",
    scenario: null,
    storyboard: null,
    prompts: null // Ajouté
};

// --- Fonctions Utilitaires ---

// Fonction pour afficher le scénario (INCHANGÉE)
function displayScenario(scenario, container) { /* ... Code complet ... */ }

// Fonction pour générer et afficher le scénario (INCHANGÉE)
function generateAndDisplayScenario(keywords, generateButton, loadingElement) { /* ... Code complet ... */ }

// Fonction pour afficher le Storyboard (INCHANGÉE)
function displayStoryboard(storyboardData, container) { /* ... Code complet ... */ }

// **NOUVELLE FONCTION : Afficher les Prompts**
function displayPrompts(promptsData, container) {
    console.log(">>> displayPrompts: Appelé avec promptsData:", promptsData, "dans", container);
    if (!container) { console.error("displayPrompts: Conteneur manquant !"); return; }
    if (!promptsData || !promptsData.pages || !Array.isArray(promptsData.pages) || promptsData.pages.length === 0) {
        container.innerHTML = '<p>Aucune donnée de prompts à afficher.</p>';
        console.warn("displayPrompts: Données de prompts invalides ou vides reçues.");
        return;
    }

    let currentPageIndex = 0;
    const totalPages = promptsData.pages.length;

    function renderPromptsPage(index) {
        if (index < 0 || index >= totalPages) return;
        currentPageIndex = index;
        const page = promptsData.pages[index];

         if (!page || !page.panels || !Array.isArray(page.panels)) {
             console.warn(`displayPrompts: Page ${index+1} invalide ou sans panels.`);
             const pageContentDiv = container.querySelector('.prompts-page-content');
              if(pageContentDiv) pageContentDiv.innerHTML = `<h4>Page ${page?.pageNumber || (index + 1)} / ${totalPages}</h4><p class="error-message">Erreur: Données invalides pour cette page.</p>`;
             return;
         }


        let pageHtml = `<h4>Page ${page.pageNumber || (index + 1)} / ${totalPages}</h4>`;
        if (page.panels.length > 0) {
            pageHtml += `<div class="panels-container">`; // Réutiliser classe si possible
            page.panels.forEach((panel, panelIndex) => {
                pageHtml += `<div class="panel prompt-panel">`; // Ajouter une classe spécifique
                pageHtml += `<h5>Case ${panelIndex + 1}</h5>`;
                if (panel.prompt) {
                    pageHtml += `<div class="prompt">`;
                    // Utiliser <textarea> pour faciliter la copie
                    pageHtml += `<textarea class="prompt-textarea" readonly>${panel.prompt}</textarea>`;
                    // Ajouter un bouton Copier unique pour chaque prompt
                    pageHtml += `<button class="copy-button" data-prompt-index="${index}-${panelIndex}">Copier</button>`;
                    pageHtml += `</div>`; // Fin prompt
                } else {
                     pageHtml += `<p><i>Aucun prompt généré pour cette case.</i></p>`;
                }
                 // Ajouter d'autres infos si présentes (ex: description originale)
                 // if (panel.description_originale) { pageHtml += `<p><small>Desc. Orig.: ${panel.description_originale}</small></p>`; }
                pageHtml += `</div>`; // Fin panel
            });
            pageHtml += `</div>`; // Fin panels-container
        } else {
            pageHtml += `<p>Aucun prompt défini pour cette page.</p>`;
        }

        // Mettre à jour le contenu et la pagination
        const pageContentDiv = container.querySelector('.prompts-page-content');
        if (pageContentDiv) {
             pageContentDiv.innerHTML = pageHtml;
             const indicator = container.querySelector('.page-indicator');
             const prevBtn = container.querySelector('.prev-page-btn');
             const nextBtn = container.querySelector('.next-page-btn');
             if(indicator) indicator.textContent = `Page ${index + 1} / ${totalPages}`;
             if(prevBtn) prevBtn.disabled = (index === 0);
             if(nextBtn) nextBtn.disabled = (index === totalPages - 1);
        } else {
             console.error("displayPrompts: Div '.prompts-page-content' non trouvée.");
             container.innerHTML = pageHtml;
        }
    }

     // Ajouter la structure de pagination si elle n'existe pas
     if (!container.querySelector('.pagination-container')) {
        container.innerHTML = `
            <div class="pagination-container" style="margin-bottom: 15px; text-align: center;">
                <button class="prev-page-btn pagination-button" disabled>Précédent</button>
                <span class="page-indicator" style="margin: 0 15px;">Page 1 / ${totalPages}</span>
                <button class="next-page-btn pagination-button">Suivant</button>
            </div>
            <div class="prompts-page-content"></div>
        `;
        // Attacher les écouteurs pour la pagination
        container.querySelector('.prev-page-btn').addEventListener('click', () => renderPromptsPage(currentPageIndex - 1));
        container.querySelector('.next-page-btn').addEventListener('click', () => renderPromptsPage(currentPageIndex + 1));
    }

    // Attacher les écouteurs pour les boutons Copier (délégation d'événements)
    // Supprimer les anciens écouteurs avant d'ajouter de nouveaux si nécessaire (pour éviter doublons)
    container.removeEventListener('click', handlePromptCopy); // Supposer que handlePromptCopy est définie
    container.addEventListener('click', handlePromptCopy);

    // Afficher la première page de prompts
    renderPromptsPage(0);
}

// Gestionnaire pour les boutons Copier
function handlePromptCopy(event) {
     if (event.target.classList.contains('copy-button')) {
        const button = event.target;
        const textarea = button.previousElementSibling; // Le textarea juste avant
        if (textarea && textarea.tagName === 'TEXTAREA') {
             textarea.select(); // Sélectionner le texte
             textarea.setSelectionRange(0, 99999); // Pour mobiles
             try {
                 document.execCommand('copy'); // Copier dans le presse-papiers
                 button.textContent = 'Copié!';
                 button.style.backgroundColor = '#2ecc71'; // Vert succès
                 // Réinitialiser après 2 secondes
                 setTimeout(() => {
                     button.textContent = 'Copier';
                     button.style.backgroundColor = ''; // Couleur par défaut
                 }, 2000);
             } catch (err) {
                 console.error('Erreur lors de la copie:', err);
                 button.textContent = 'Erreur';
                 button.style.backgroundColor = '#e74c3c'; // Rouge erreur
                 setTimeout(() => {
                     button.textContent = 'Copier';
                      button.style.backgroundColor = '';
                 }, 2000);
             }
             window.getSelection().removeAllRanges(); // Désélectionner
        }
    }
}


// --- Initialisation ---
document.addEventListener('DOMContentLoaded', function() {
    console.log("main.js: DOM chargé.");
    // ... (Initialisations pour Accueil, Scénario, Storyboard comme avant) ...
    const keywordsInput = document.getElementById('keywords'); const generateButton = document.getElementById('generate-scenario-btn'); const scenarioDisplayContainer = document.getElementById('scenario-display-container'); if (keywordsInput && generateButton && scenarioDisplayContainer) { initializeHomePage(keywordsInput, generateButton, scenarioDisplayContainer); }
    const scenarioContainerPage = document.getElementById('scenario-container'); const keywordsDisplayPage = document.getElementById('keywords-display'); if (scenarioContainerPage && keywordsDisplayPage) { initializeScenarioPage(scenarioContainerPage, keywordsDisplayPage); }
    const storyboardContainerPage = document.getElementById('storyboard-container'); if (storyboardContainerPage) { initializeStoryboardPage(storyboardContainerPage); }


    // **NOUVEAU : Initialisation Page Prompts**
    const promptsContainerPage = document.getElementById('prompts-container');
    if (promptsContainerPage) {
        initializePromptsPage(promptsContainerPage);
    }

    if (window.bdSessionManager) { console.log("main.js: bdSessionManager trouvé."); } else { console.warn("main.js: bdSessionManager non trouvé."); }
});

// --- Fonctions d'Initialisation par Page ---

function initializeHomePage(keywordsInput, generateButton, scenarioDisplayContainer) { /* ... Code complet ... */ }
function initializeScenarioPage(scenarioContainerPage, keywordsDisplayPage) { /* ... Code complet ... */ }
async function initializeStoryboardPage(storyboardContainerPage) { /* ... Code complet ... */ }

// **NOUVELLE FONCTION : Initialisation Page Prompts**
async function initializePromptsPage(promptsContainerPage) {
    console.log("main.js: Initialisation Page Prompts.");
    promptsContainerPage.innerHTML = '<p>Chargement des prompts...</p>';

    const storyboardJson = localStorage.getItem('bdStoryboard');
    if (!storyboardJson) {
        promptsContainerPage.innerHTML = '<p class="error-message">Erreur: Aucun storyboard trouvé. Veuillez générer un scénario et un storyboard.</p>';
        return;
    }

    try {
        const storyboardData = JSON.parse(storyboardJson);
        projectData.storyboard = storyboardData; // Mettre à jour

         // Mettre à jour titre du chapitre sur la page prompts
         const chapterTitleElement = document.getElementById('chapter-name'); // ID dans prompts.html
         if(chapterTitleElement && storyboardData && storyboardData.chapterTitle) {
             chapterTitleElement.textContent = storyboardData.chapterTitle;
         }

        // Essayer de charger les prompts existants
        const existingPromptsJson = localStorage.getItem('bdPrompts');
        let promptsData = null;

        if (existingPromptsJson) {
            console.log("main.js: Prompts existants trouvés.");
            try {
                promptsData = JSON.parse(existingPromptsJson);
                projectData.prompts = promptsData;
            } catch (parseError) {
                console.error("main.js: Erreur parsing prompts existants:", parseError);
                localStorage.removeItem('bdPrompts');
            }
        }

        // Générer si non trouvés ou invalides
        if (!promptsData) {
             console.log("main.js: Aucun prompt valide trouvé, tentative de génération...");
             if (typeof window.generatePromptsDetailles === 'function') {
                 promptsData = await window.generatePromptsDetailles(storyboardData); // Utiliser fonction détaillée
                 if (promptsData) {
                     projectData.prompts = promptsData;
                     try {
                         localStorage.setItem('bdPrompts', JSON.stringify(promptsData));
                         console.log("main.js: Prompts générés et sauvegardés.");
                     } catch (saveError) {
                         console.error("main.js: Erreur sauvegarde prompts générés:", saveError);
                     }
                 } else {
                      console.error("main.js: La génération des prompts a échoué (retour null).");
                      promptsContainerPage.innerHTML = '<p class="error-message">Erreur lors de la génération des prompts.</p>';
                      return;
                 }
             } else {
                  console.warn("main.js: Fonction generatePromptsDetailles non trouvée.");
                  promptsContainerPage.innerHTML = '<p class="error-message">Erreur: Fonction de génération de prompts non trouvée.</p>';
                  return;
             }
        }

        // Afficher les prompts
        displayPrompts(promptsData, promptsContainerPage);

    } catch (error) {
        console.error("main.js: Erreur lors de l'initialisation de la page Prompts:", error);
        promptsContainerPage.innerHTML = '<p class="error-message">Une erreur est survenue lors du chargement des prompts.</p>';
    }
}


console.log("main.js (Complet avec prompts) chargé.");
