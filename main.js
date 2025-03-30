/**
 * BD Creator - Script Principal (main.js)
 * Version simplifiée pour tester l'attachement direct de l'écouteur.
 */

// Fonction pour afficher le scénario (gardée pour l'appel)
function displayScenario(scenario, container) {
    console.log(">>> displayScenario: Appelé avec", scenario);
    if (!scenario || !container) {
        console.error(">>> displayScenario: Scénario ou conteneur manquant !");
        return;
    }
    // Logique d'affichage simplifiée pour le test
    container.innerHTML = `<h3>${scenario.title || 'Test'}</h3><p>Affichage OK.</p>`;
    console.log(">>> displayScenario: Affichage terminé.");
}

// Fonction pour générer et afficher (gardée pour l'appel)
function generateAndDisplayScenario(keywords, generateButton, loadingElement) {
    console.log(">>> generateAndDisplayScenario: Appelé avec", keywords);
    if (typeof window.generateScenarioDetaille !== 'function') {
        console.error(">>> generateAndDisplayScenario: generateScenarioDetaille N'EST PAS une fonction !");
        alert("Erreur : La fonction generateScenarioDetaille n'est pas chargée.");
        generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement && loadingElement.parentNode) loadingElement.parentNode.removeChild(loadingElement);
        return;
    }

    window.generateScenarioDetaille(keywords)
        .then(scenario => {
            console.log(">>> generateAndDisplayScenario: Scénario reçu:", scenario);
            if (!scenario) { throw new Error("Scénario reçu est null/undefined."); }

            localStorage.setItem('bdScenario', JSON.stringify(scenario)); // Sauvegarde simple
            let scenarioContainer = document.getElementById('scenario-display-container');
             if (!scenarioContainer) { // Créer si besoin
                 scenarioContainer = document.createElement('div');
                 scenarioContainer.id = 'scenario-display-container';
                 scenarioContainer.className = 'scenario-container';
                 generateButton.closest('.feature')?.parentNode?.insertBefore(scenarioContainer, generateButton.closest('.feature').nextSibling);
             }
            displayScenario(scenario, scenarioContainer); // Appel affichage

            // Nettoyage UI
            generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement && loadingElement.parentNode) loadingElement.parentNode.removeChild(loadingElement);
             if (scenarioContainer.scrollIntoView) scenarioContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

        })
        .catch(error => {
            console.error(">>> generateAndDisplayScenario: ERREUR dans .catch() :", error);
            alert("Erreur pendant la génération/affichage. Voir console.");
            // Nettoyage UI en cas d'erreur
            generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement && loadingElement.parentNode) loadingElement.parentNode.removeChild(loadingElement);
        });
}


// --- Initialisation Directe dans DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', function() {
    console.log("main.js (Simple): DOM chargé.");

    const keywordsInput = document.getElementById('keywords');
    const generateButton = document.getElementById('generate-scenario-btn');
    const scenarioDisplayContainer = document.getElementById('scenario-display-container');

    if (keywordsInput && generateButton && scenarioDisplayContainer) {
        console.log("main.js (Simple): Éléments de la page d'accueil trouvés.");

        generateButton.addEventListener('click', function() {
            console.log(">>> Bouton cliqué!"); // Log pour confirmer le clic

            const keywords = keywordsInput.value;
            if (!keywords || keywords.trim() === '') {
                alert('Veuillez entrer du texte.');
                return;
            }

            // UI Désactivation/Chargement
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

        console.log("main.js (Simple): Écouteur attaché au bouton.");

        // Afficher scénario existant (simplifié)
        const existingScenarioJson = localStorage.getItem('bdScenario');
        if (existingScenarioJson) {
            console.log("main.js (Simple): Affichage scénario existant.");
            try {
                const existingScenario = JSON.parse(existingScenarioJson);
                displayScenario(existingScenario, scenarioDisplayContainer);
                keywordsInput.value = localStorage.getItem('bdKeywords') || '';
            } catch (e) {
                console.error("main.js (Simple): Erreur parsing scénario existant:", e);
                localStorage.removeItem('bdScenario');
                scenarioDisplayContainer.innerHTML = '<p class="error-message">Erreur chargement.</p>';
            }
        } else {
            scenarioDisplayContainer.innerHTML = '';
        }

    } else {
        console.warn("main.js (Simple): Éléments de la page d'accueil non trouvés.");
    }

    // Initialisation Session Manager (si présent)
    if (window.bdSessionManager) {
         console.log("main.js (Simple): bdSessionManager trouvé.");
    } else {
         console.warn("main.js (Simple): bdSessionManager non trouvé.");
    }

});

console.log("main.js (Simple) chargé.");
