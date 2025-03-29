/**
 * BD Creator - Script Principal (main.js)
 * Gère l'initialisation de l'application et les interactions principales
 * sur les différentes pages.
 */

// --- Variables globales (si nécessaire) ---
let projectData = {
    keywords: localStorage.getItem('bdKeywords') || "", // Charger au démarrage
    scenario: null, // Sera chargé depuis localStorage si existant
    storyboard: null,
    prompts: null
};

// --- Fonctions Utilitaires ---

// Fonction pour afficher le scénario (peut être appelée depuis plusieurs endroits)
function displayScenario(scenario, container) {
    console.log("main.js: Affichage du scénario dans le conteneur:", container);

    if (!scenario || typeof scenario !== 'object') {
        console.error("displayScenario: Scénario invalide fourni.", scenario);
        container.innerHTML = '<p class="error-message">Impossible d\'afficher le scénario (données invalides).</p>';
        return;
    }
     if (!container) {
        console.error("displayScenario: Conteneur HTML non trouvé.");
        // Peut-être chercher un conteneur par défaut ?
        // container = document.getElementById('default-scenario-output');
         if(!container) return; // Si toujours pas trouvé, abandonner
    }

    // Vider le conteneur précédent
    container.innerHTML = '';

    // --- Construction dynamique du HTML pour le scénario ---
    let htmlContent = '';

    // En-tête
    htmlContent += `<div class="scenario-header">`;
    htmlContent += `<h3>${scenario.title || "Scénario Sans Titre"}</h3>`;
    if (scenario.theme) {
        htmlContent += `<p class="scenario-theme"><em>Thème basé sur : ${scenario.theme.substring(0,100)}${scenario.theme.length > 100 ? '...' : ''}</em></p>`;
    }
    htmlContent += `</div>`;

    // Univers
    if (scenario.univers) {
        htmlContent += `<div class="scenario-section"><h4>Univers : ${scenario.univers.type || 'Non défini'}</h4>`;
        htmlContent += `<p>${scenario.univers.description || ''}</p>`;
        htmlContent += `<ul>`;
        if(scenario.univers.epoque) htmlContent += `<li>Époque: ${scenario.univers.epoque}</li>`;
        if(scenario.univers.technologie) htmlContent += `<li>Technologie: ${scenario.univers.technologie}</li>`;
        if(scenario.univers.particularites) htmlContent += `<li>Particularités: ${scenario.univers.particularites}</li>`;
        htmlContent += `</ul></div>`;
    }

    // Personnages
    if (scenario.personnages && scenario.personnages.length > 0) {
        htmlContent += `<div class="scenario-section"><h4>Personnages</h4>`;
        htmlContent += `<ul class="personnages-list">`;
        scenario.personnages.forEach(p => {
            htmlContent += `<li class="personnage-item"><strong>${p.nom || '?'}</strong> (${p.archetype || '?'})`;
            if(p.description) htmlContent += `<br><small>${p.description}</small>`;
            htmlContent += `</li>`;
        });
        htmlContent += `</ul></div>`;
    }

    // Structure Narrative (optionnel à afficher)
    if (scenario.structureNarrative) {
         htmlContent += `<div class="scenario-section"><h4>Structure Narrative</h4>`;
         htmlContent += `<p>Type: ${scenario.structureNarrative.type || 'Inconnu'}</p>`;
         if(scenario.structureNarrative.etapesParChapitre) {
             htmlContent += `<p>Étapes clés par chapitre:</p><ol>`;
             scenario.structureNarrative.etapesParChapitre.forEach((etapes, idx) => {
                 htmlContent += `<li>Chap ${idx + 1}: ${etapes}</li>`;
             });
             htmlContent += `</ol>`;
         }
         htmlContent += `</div>`;
    }


    // Chapitres (Accordéon)
    if (scenario.chapters && scenario.chapters.length > 0) {
        htmlContent += `<div class="scenario-section"><h4>Chapitres (${scenario.chapters.length})</h4>`;
        htmlContent += `<div class="chapitres-accordion">`;
        scenario.chapters.forEach((chapitre, index) => {
            htmlContent += `<div class="chapitre-item">`;
            htmlContent += `<div class="chapitre-header" onclick="this.classList.toggle('active'); this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'block' ? 'none' : 'block';">`;
            htmlContent += `Chapitre ${chapitre.numero || index + 1}: ${chapitre.titre || 'Sans Titre'} (+)`; // Ajouter un (+) pour indiquer qu'on peut cliquer
            htmlContent += `</div>`;
            htmlContent += `<div class="chapitre-content">`; // display: none; géré par CSS/JS
            if (chapitre.resume) htmlContent += `<p class="chapitre-resume"><strong>Résumé:</strong> ${chapitre.resume}</p>`;
            if (chapitre.pages && chapitre.pages.length > 0) {
                 htmlContent += `<p class="pages-count">${chapitre.pages.length} pages dans ce chapitre.</p>`;
                 // On pourrait ajouter un aperçu des descriptions de pages ici si nécessaire
            } else {
                 htmlContent += `<p>Aucune page détaillée générée pour ce chapitre.</p>`;
            }
            htmlContent += `</div></div>`; // Fin chapitre-content et chapitre-item
        });
        htmlContent += `</div></div>`; // Fin accordéon et section chapitres
    }

    // Injecter le HTML dans le conteneur
    container.innerHTML = htmlContent;
    console.log("main.js: Contenu du scénario injecté dans le DOM.");
}


// Fonction pour générer et afficher le scénario (appelée depuis l'event listener)
function generateAndDisplayScenario(keywords, generateButton, loadingElement) {
    console.log("main.js: Appel de generateAndDisplayScenario pour:", keywords);

    // Vérifier si la fonction de génération existe bien sur window
    if (typeof window.generateScenarioDetaille !== 'function') {
        console.error("ERREUR CRITIQUE: window.generateScenarioDetaille n'est pas une fonction!");
        alert("Erreur: La fonction de génération de scénario est introuvable. Vérifiez que le script 'scenario_detaille.js' est correctement chargé AVANT 'main.js'.");
        generateButton.disabled = false;
        generateButton.textContent = "Générer un scénario";
        if (loadingElement && loadingElement.parentNode) {
            loadingElement.parentNode.removeChild(loadingElement);
        }
        return; // Arrêter ici
    }

    window.generateScenarioDetaille(keywords)
        .then(scenario => {
            console.log("main.js: Scénario reçu de generateScenarioDetaille:", scenario);

            if (!scenario) {
                // Gérer le cas où la génération a échoué et renvoyé null
                throw new Error("La fonction generateScenarioDetaille a retourné null.");
            }

            projectData.scenario = scenario; // Mettre à jour la variable globale (si utilisée)

            // Sauvegarder le scénario (chaîne JSON) dans localStorage
            try {
                localStorage.setItem('bdScenario', JSON.stringify(scenario));
                console.log("main.js: Scénario sauvegardé dans localStorage.");
            } catch (e) {
                console.error("main.js: Erreur lors de la sauvegarde du scénario dans localStorage:", e);
                alert("Attention: Le scénario a été généré mais n'a pas pu être sauvegardé.");
            }


            // Trouver ou créer le conteneur d'affichage sur la page d'accueil
            let scenarioContainer = document.getElementById('scenario-display-container');
            if (!scenarioContainer) {
                console.warn("main.js: Conteneur #scenario-display-container non trouvé. Création dynamique.");
                scenarioContainer = document.createElement('div');
                scenarioContainer.id = 'scenario-display-container';
                scenarioContainer.className = 'scenario-container';
                // Insérer après le bouton ou son parent <div class="feature">
                const featureDiv = generateButton.closest('.feature'); // Trouver le div parent .feature
                if (featureDiv && featureDiv.parentNode) {
                    featureDiv.parentNode.insertBefore(scenarioContainer, featureDiv.nextSibling);
                } else {
                    // Fallback: ajouter à la fin du container principal
                    document.querySelector('.container')?.appendChild(scenarioContainer);
                }
            }

            // Afficher le scénario dans le conteneur
            displayScenario(scenario, scenarioContainer);

            // Réactiver le bouton et supprimer le chargement
            generateButton.disabled = false;
            generateButton.textContent = "Générer un scénario";
            if (loadingElement && loadingElement.parentNode) {
                loadingElement.parentNode.removeChild(loadingElement);
            }

            // Faire défiler pour voir le résultat
            if (scenarioContainer.scrollIntoView) {
                scenarioContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

        })
        .catch(error => {
            console.error("main.js: Erreur dans la promesse de generateAndDisplayScenario:", error);
            alert("Une erreur est survenue lors de la génération ou de l'affichage du scénario. Vérifiez la console.");

            // Assurer la réactivation du bouton et la suppression du chargement même en cas d'erreur
            generateButton.disabled = false;
            generateButton.textContent = "Générer un scénario";
            if (loadingElement && loadingElement.parentNode) {
                loadingElement.parentNode.removeChild(loadingElement);
            }
        });
}


// --- Initialisation et écouteurs d'événements ---

document.addEventListener('DOMContentLoaded', function() {
    console.log("main.js: DOM chargé. Initialisation de l'application.");

    // --- Logique pour la page d'accueil (index.html) ---
    const keywordsInput = document.getElementById('keywords');
    const generateButton = document.getElementById('generate-scenario-btn');
    const scenarioDisplayContainer = document.getElementById('scenario-display-container'); // Le conteneur existe déjà dans l'HTML

    if (keywordsInput && generateButton && scenarioDisplayContainer) {
        console.log("main.js: Page d'accueil détectée.");

        // 1. Attacher l'écouteur au bouton
        generateButton.addEventListener('click', function() {
            console.log("main.js: Bouton 'Générer un scénario' cliqué.");
            const keywords = keywordsInput.value;
            if (!keywords || keywords.trim() === '') {
                alert('Veuillez entrer du texte pour inspirer votre BD.');
                return;
            }

            // Désactiver bouton, afficher chargement
            generateButton.disabled = true;
            generateButton.textContent = "Génération...";
            let loadingElement = document.getElementById('loading-indicator');
            if (!loadingElement) {
                loadingElement = document.createElement('div');
                loadingElement.id = 'loading-indicator';
                loadingElement.innerHTML = '<p>Génération du scénario en cours...</p>';
                 loadingElement.style.cssText = 'margin-top: 15px; padding: 10px; background-color: #eee; border-radius: 4px; text-align: center;';
                 // Insérer après le bouton
                 generateButton.parentNode.insertBefore(loadingElement, generateButton.nextSibling);
            } else {
                loadingElement.style.display = 'block'; // Rendre visible si déjà existant
            }


            // Nettoyer les anciennes données avant de générer
            localStorage.removeItem('bdScenario');
            localStorage.removeItem('bdStoryboard');
            localStorage.removeItem('bdPrompts');
            localStorage.setItem('bdKeywords', keywords); // Sauvegarder les nouveaux mots-clés

            // Appeler la fonction principale de génération/affichage
            generateAndDisplayScenario(keywords, generateButton, loadingElement);
        });

        // 2. Afficher le scénario existant au chargement de la page
        const existingScenarioJson = localStorage.getItem('bdScenario');
        if (existingScenarioJson) {
            console.log("main.js: Scénario existant trouvé au chargement, tentative d'affichage.");
            try {
                const existingScenario = JSON.parse(existingScenarioJson);
                displayScenario(existingScenario, scenarioDisplayContainer);
                 // Pré-remplir le textarea avec les mots-clés de la session chargée
                 keywordsInput.value = localStorage.getItem('bdKeywords') || '';
            } catch (e) {
                console.error("main.js: Erreur parsing scénario existant:", e);
                localStorage.removeItem('bdScenario'); // Nettoyer si invalide
                scenarioDisplayContainer.innerHTML = '<p class="error-message">Impossible de charger le scénario précédemment sauvegardé (données corrompues).</p>';
            }
        } else {
            console.log("main.js: Pas de scénario existant dans localStorage.");
             scenarioDisplayContainer.innerHTML = ''; // Assurer que le conteneur est vide
        }

    } else {
         console.log("main.js: Pas sur la page d'accueil (ou éléments manquants).");
    }

    // --- Logique pour la page Scénario (scenario.html) ---
    const scenarioContainerPage = document.getElementById('scenario-container');
    const keywordsDisplayPage = document.getElementById('keywords-display');
    if (scenarioContainerPage && keywordsDisplayPage) { // Identifie la page Scénario
        console.log("main.js: Page Scénario détectée.");
        const keywords = localStorage.getItem('bdKeywords') || '';
        keywordsDisplayPage.textContent = keywords.substring(0, 150) + (keywords.length > 150 ? '...' : ''); // Afficher mots-clés

        const scenarioJson = localStorage.getItem('bdScenario');
        if (scenarioJson) {
            try {
                const scenario = JSON.parse(scenarioJson);
                displayScenario(scenario, scenarioContainerPage); // Réutiliser la fonction d'affichage
            } catch (e) {
                console.error("main.js: Erreur affichage scénario sur page Scénario:", e);
                scenarioContainerPage.innerHTML = '<p class="error-message">Erreur: Impossible d\'afficher le scénario.</p>';
            }
        } else {
            scenarioContainerPage.innerHTML = '<p>Aucun scénario n\'a été généré ou sauvegardé. Retournez à l\'accueil pour commencer.</p>';
        }
    }

    // --- Logique pour la page Storyboard (storyboard.html) ---
    const storyboardContainerPage = document.getElementById('storyboard-container');
    if (storyboardContainerPage) {
        console.log("main.js: Page Storyboard détectée.");
        // Vous ajouterez ici la logique pour charger `bdStoryboard` depuis localStorage,
        // le parser, puis appeler une fonction `displayStoryboard(storyboardData, storyboardContainerPage)`
        // que vous devrez créer (similaire à displayScenario).
         const storyboardJson = localStorage.getItem('bdStoryboard');
         if (storyboardJson) {
             try {
                 const storyboardData = JSON.parse(storyboardJson);
                 // displayStoryboard(storyboardData, storyboardContainerPage); // APPELER VOTRE FONCTION ICI
                 storyboardContainerPage.innerHTML = '<p>Affichage du storyboard à implémenter.</p>'; // Placeholder
                 console.log("Données Storyboard chargées:", storyboardData);
             } catch(e) {
                  console.error("main.js: Erreur parsing storyboard:", e);
                  storyboardContainerPage.innerHTML = '<p class="error-message">Erreur: Impossible de charger le storyboard.</p>';
             }
         } else {
              storyboardContainerPage.innerHTML = '<p>Aucun storyboard trouvé. Veuillez générer un scénario d\'abord.</p>';
         }
    }

    // --- Logique pour la page Prompts (prompts.html) ---
    const promptsContainerPage = document.getElementById('prompts-container');
    if (promptsContainerPage) {
        console.log("main.js: Page Prompts détectée.");
        // Logique similaire pour charger `bdPrompts` et appeler `displayPrompts(...)`
         const promptsJson = localStorage.getItem('bdPrompts');
          if (promptsJson) {
             try {
                 const promptsData = JSON.parse(promptsJson);
                 // displayPrompts(promptsData, promptsContainerPage); // APPELER VOTRE FONCTION ICI
                 promptsContainerPage.innerHTML = '<p>Affichage des prompts à implémenter.</p>'; // Placeholder
                 console.log("Données Prompts chargées:", promptsData);
             } catch(e) {
                  console.error("main.js: Erreur parsing prompts:", e);
                  promptsContainerPage.innerHTML = '<p class="error-message">Erreur: Impossible de charger les prompts.</p>';
             }
         } else {
              promptsContainerPage.innerHTML = '<p>Aucun prompt trouvé. Veuillez générer un scénario et un storyboard d\'abord.</p>';
         }
    }


    // Initialiser le gestionnaire de session (s'il est chargé)
    // Note: bd_creator_session_manager.js s'initialise lui-même maintenant via DOMContentLoaded.
    // Si vous avez besoin d'interagir avec lui depuis main.js, assurez-vous que l'instance window.bdSessionManager existe.
    if (window.bdSessionManager) {
        console.log("main.js: Gestionnaire de session trouvé.");
        // On pourrait appeler une méthode de mise à jour ici si nécessaire,
        // mais bdSessionManager gère déjà son UI via son propre DOMContentLoaded.
    } else {
        console.warn("main.js: Gestionnaire de session (bdSessionManager) non trouvé au moment de l'init de main.js.");
    }

});

console.log("main.js chargé.");
