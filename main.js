// Solution tout-en-un pour BD Creator avec améliorations pour textes longs et prompts enrichis
// Ce fichier contient toutes les fonctionnalités nécessaires sans dépendances externes

// Variables globales pour stocker les données du projet
let projectData = {
    keywords: "",
    scenario: null,
    storyboard: null,
    prompts: null
};

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Document loaded');
    
    // Vérifier si nous sommes sur la page d'accueil
    const keywordsInput = document.getElementById('keywords');
    if (keywordsInput) {
        console.log('Keywords input found');
        
        // Ajouter un écouteur d'événements pour le bouton de génération de scénario
        const generateButton = document.getElementById('generate-scenario-btn');
        if (generateButton) {
            console.log('Generate button found');
            
            generateButton.addEventListener('click', function() {
                console.log('Generate button clicked');
                
                const keywords = keywordsInput.value;
                if (keywords.trim() === '') {
                    alert('Veuillez entrer du texte pour inspirer votre BD.');
                    return;
                }
                
                // Désactiver le bouton et montrer un message de chargement
                generateButton.disabled = true;
                generateButton.textContent = "Génération en cours...";
                
                // Créer un élément de chargement
                const loadingElement = document.createElement('div');
                loadingElement.id = 'loading-indicator';
                loadingElement.innerHTML = '<p>Génération du scénario en cours, veuillez patienter...</p>';
                loadingElement.style.marginTop = '20px';
                loadingElement.style.padding = '10px';
                loadingElement.style.backgroundColor = '#f8f9fa';
                loadingElement.style.borderRadius = '5px';
                loadingElement.style.textAlign = 'center';
                
                // Ajouter l'élément après le bouton
                generateButton.parentNode.appendChild(loadingElement);
                
                // Stocker le texte complet dans localStorage pour l'utiliser dans d'autres pages
                localStorage.setItem('bdKeywords', keywords);
                
                // Forcer la régénération du scénario en supprimant l'ancien
                localStorage.removeItem('bdScenario');
                
                // Générer le scénario directement sur la même page
                if (typeof window.generateScenarioDetaille === 'function') {
                    console.log('generateScenarioDetaille function found');
                    generateAndDisplayScenario(keywords, generateButton, loadingElement);
                } else {
                    console.error('generateScenarioDetaille function not found');
                    // Charger le script scenario_detaille.js
                    const script = document.createElement('script');
                    script.src = 'scenario_detaille.js';
                    script.onload = function() {
                        console.log('scenario_detaille.js loaded');
                        window.scenarioDetailleLoaded = true;
                        generateAndDisplayScenario(keywords, generateButton, loadingElement);
                    };
                    document.head.appendChild(script);
                }
            });
        }
        
        // Vérifier si un scénario existe déjà dans le localStorage
        const existingScenario = localStorage.getItem('bdScenario');
        if (existingScenario) {
            try {
                const scenario = JSON.parse(existingScenario);
                console.log('Existing scenario found in localStorage');
                
                // Créer un conteneur pour le scénario s'il n'existe pas déjà
                let scenarioContainer = document.getElementById('scenario-display-container');
                if (!scenarioContainer) {
                    scenarioContainer = document.createElement('div');
                    scenarioContainer.id = 'scenario-display-container';
                    scenarioContainer.className = 'scenario-container';
                    // Ajouter le conteneur après la section des fonctionnalités
                    const featuresSection = document.querySelector('.feature h3').parentNode;
                    featuresSection.parentNode.insertBefore(scenarioContainer, featuresSection.nextSibling);
                }
                displayScenario(scenario, scenarioContainer);
            } catch (e) {
                console.error("Erreur lors du chargement du scénario existant:", e);
            }
        }
    }
    
    // Vérifier si nous sommes sur la page de scénario
    const scenarioContainer = document.getElementById('scenario-container');
    if (scenarioContainer) {
        console.log('Scenario container found');
        const keywords = localStorage.getItem('bdKeywords') || "aventure fantastique";
        const keywordsDisplay = document.getElementById('keywords-display');
        if (keywordsDisplay) {
            // Limiter l'affichage à 100 caractères pour ne pas surcharger l'interface
            keywordsDisplay.textContent = keywords.length > 100 ? 
                keywords.substring(0, 100) + "..." : 
                keywords;
        }
        
        // Vérifier si nous venons d'une nouvelle session ou d'un rechargement normal
        const urlParams = new URLSearchParams(window.location.search);
        const isNewSession = urlParams.has('new');
        
        // Vérifier si un scénario existe déjà dans le localStorage
        const existingScenario = localStorage.getItem('bdScenario');
        
        // Forcer la régénération du scénario si c'est une nouvelle session ou si aucun scénario n'existe
        if (isNewSession || !existingScenario) {
            console.log("Génération d'un nouveau scénario (nouvelle session ou premier chargement)");
            
            // Générer et afficher le scénario avec la fonction améliorée pour textes longs
            console.log("Tentative d'appel à generateScenarioDetaille");
            
            // Vérifier si la fonction est disponible
            if (typeof window.generateScenarioDetaille === 'function') {
                console.log("Fonction generateScenarioDetaille trouvée dans window");
                window.generateScenarioDetaille(keywords).then(scenario => {
                    console.log("Scénario généré avec succès");
                    projectData.scenario = scenario;
                    displayScenario(scenario, scenarioContainer);
                    
                    // Sauvegarder le scénario dans localStorage
                    localStorage.setItem('bdScenario', JSON.stringify(scenario));
                    
                    // Mettre à jour le gestionnaire de session
                    if (window.sessionManager) {
                        window.sessionManager.updateCurrentSession({
                            scenario: scenario
                        });
                    }
                }).catch(error => {
                    console.error("Erreur lors de la génération du scénario:", error);
                    alert("Erreur lors de la génération du scénario. Veuillez réessayer.");
                });
            } else {
                console.error("Fonction generateScenarioDetaille non trouvée!");
                alert("Erreur: La fonction de génération de scénario n'est pas disponible.");
            }
        } else {
            console.log("Chargement d'un scénario existant");
            try {
                const scenario = JSON.parse(existingScenario);
                projectData.scenario = scenario;
                displayScenario(scenario, scenarioContainer);
            } catch (e) {
                console.error("Erreur lors du chargement du scénario:", e);
                // En cas d'erreur, générer un nouveau scénario
                console.log("Tentative d'appel à generateScenarioDetaille (après erreur)");
                
                // Vérifier si la fonction est disponible
                if (typeof window.generateScenarioDetaille === 'function') {
                    console.log("Fonction generateScenarioDetaille trouvée dans window (après erreur)");
                    window.generateScenarioDetaille(keywords).then(scenario => {
                        console.log("Scénario généré avec succès (après erreur)");
                        projectData.scenario = scenario;
                        displayScenario(scenario, scenarioContainer);
                        localStorage.setItem('bdScenario', JSON.stringify(scenario));
                    }).catch(error => {
                        console.error("Erreur lors de la génération du scénario (après erreur):", error);
                        alert("Erreur lors de la génération du scénario. Veuillez réessayer.");
                    });
                } else {
                    console.error("Fonction generateScenarioDetaille non trouvée (après erreur)!");
                    alert("Erreur: La fonction de génération de scénario n'est pas disponible.");
                }
            }
        }
    }
    
    // Vérifier si nous sommes sur la page de storyboard
    const storyboardContainer = document.getElementById('storyboard-container');
    if (storyboardContainer) {
        console.log('Storyboard container found');
        // Récupérer le scénario depuis localStorage
        const scenarioData = localStorage.getItem('bdScenario');
        if (scenarioData) {
            try {
                const scenario = JSON.parse(scenarioData);
                projectData.scenario = scenario;
                
                // Vérifier si un storyboard existe déjà dans localStorage
                const existingStoryboard = localStorage.getItem('bdStoryboard');
                if (existingStoryboard) {
                    try {
                        const storyboard = JSON.parse(existingStoryboard);
                        projectData.storyboard = storyboard;
                        displayStoryboard(storyboard);
                    } catch (e) {
                        console.error("Erreur lors du chargement du storyboard:", e);
                        createStoryboard(scenario).then(storyboard => {
                            projectData.storyboard = storyboard;
                            displayStoryboard(storyboard);
                            localStorage.setItem('bdStoryboard', JSON.stringify(storyboard));
                        });
                    }
                } else {
                    // Créer et afficher le storyboard
                    createStoryboard(scenario).then(storyboard => {
                        projectData.storyboard = storyboard;
                        displayStoryboard(storyboard);
                        localStorage.setItem('bdStoryboard', JSON.stringify(storyboard));
                        
                        // Mettre à jour le gestionnaire de session
                        if (window.sessionManager) {
                            window.sessionManager.updateCurrentSession({
                                storyboard: storyboard
                            });
                        }
                    });
                }
            } catch (e) {
                console.error("Erreur lors du chargement du scénario pour le storyboard:", e);
                storyboardContainer.innerHTML = "<p>Erreur: Veuillez d'abord générer un scénario.</p>";
            }
        } else {
            storyboardContainer.innerHTML = "<p>Veuillez d'abord générer un scénario.</p>";
        }
    }
    
    // Vérifier si nous sommes sur la page de prompts
    const promptsContainer = document.getElementById('prompts-container');
    if (promptsContainer) {
        console.log('Prompts container found');
        // Récupérer le storyboard depuis localStorage
        const storyboardData = localStorage.getItem('bdStoryboard');
        if (storyboardData) {
            try {
                const storyboard = JSON.parse(storyboardData);
                projectData.storyboard = storyboard;
                
                // Vérifier si des prompts existent déjà dans localStorage
                const existingProm
