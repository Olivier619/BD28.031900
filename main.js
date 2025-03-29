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
                        if (typeof window.generateScenarioDetaille === 'function') {
                            console.log('generateScenarioDetaille function loaded successfully');
                            generateAndDisplayScenario(keywords, generateButton, loadingElement);
                        } else {
                            console.error('generateScenarioDetaille function still not found after loading script');
                        }
                    };
                    script.onerror = function() {
                        console.error('Failed to load scenario_detaille.js');
                    };
                    document.head.appendChild(script);
                }
            });
        } else {
            console.error('Generate button not found');
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
    } else {
        console.error('Keywords input not found');
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
                const existingPrompts = localStorage.getItem('bdPrompts');
                if (existingPrompts) {
                    try {
                        const prompts = JSON.parse(existingPrompts);
                        projectData.prompts = prompts;
                        displayPrompts(prompts);
                    } catch (e) {
                        console.error("Erreur lors du chargement des prompts:", e);
                        generatePrompts(storyboard).then(prompts => {
                            projectData.prompts = prompts;
                            displayPrompts(prompts);
                            localStorage.setItem('bdPrompts', JSON.stringify(prompts));
                        });
                    }
                } else {
                    // Générer et afficher les prompts avec la fonction enrichie
                    generatePrompts(storyboard).then(prompts => {
                        projectData.prompts = prompts;
                        displayPrompts(prompts);
                        localStorage.setItem('bdPrompts', JSON.stringify(prompts));
                        
                        // Mettre à jour le gestionnaire de session
                        if (window.sessionManager) {
                            window.sessionManager.updateCurrentSession({
                                prompts: prompts
                            });
                        }
                    });
                }
            } catch (e) {
                console.error("Erreur lors du chargement du storyboard pour les prompts:", e);
                promptsContainer.innerHTML = "<p>Erreur: Veuillez d'abord créer un storyboard.</p>";
            }
        } else {
            promptsContainer.innerHTML = "<p>Veuillez d'abord créer un storyboard.</p>";
        }
    }
});

// Fonction pour générer et afficher un scénario directement sur la page d'accueil
function generateAndDisplayScenario(keywords, generateButton, loadingElement) {
    console.log("Génération du scénario pour: " + keywords);
    
    window.generateScenarioDetaille(keywords).then(scenario => {
        console.log("Scénario généré avec succès");
        projectData.scenario = scenario;
        
        // Sauvegarder le scénario dans localStorage
        localStorage.setItem('bdScenario', JSON.stringify(scenario));
        
        // Mettre à jour le gestionnaire de session
        if (window.sessionManager) {
            window.sessionManager.updateCurrentSession({
                scenario: scenario
            });
        }
        
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
        
        // Afficher le scénario
        displayScenario(scenario, scenarioContainer);
        
        // Réactiver le bouton
        generateButton.disabled = false;
        generateButton.textContent = "Générer un scénario";
        
        // Supprimer l'indicateur de chargement
        if (loadingElement && loadingElement.parentNode) {
            loadingElement.parentNode.removeChild(loadingElement);
        }
        
        // Faire défiler jusqu'au scénario
        scenarioContainer.scrollIntoView({ behavior: 'smooth' });
    }).catch(error => {
        console.error("Erreur lors de la génération du scénario:", error);
        alert("Erreur lors de la génération du scénario. Veuillez réessayer.");
        
        // Réactiver le bouton
        generateButton.disabled = false;
        generateButton.textContent = "Générer un scénario";
        
        // Supprimer l'indicateur de chargement
        if (loadingElement && loadingElement.parentNode) {
            loadingElement.parentNode.removeChild(loadingElement);
        }
    });
}

// Fonction pour afficher le scénario généré
function displayScenario(scenario, container) {
    console.log("Affichage du scénario:", scenario);
    
    if (!container) {
        console.error("Conteneur non spécifié pour l'affichage du scénario");
        return;
    }
    
    // Vider le conteneur
    container.innerHTML = '';
    
    // Créer l'en-tête du scénario
    const header = document.createElement('div');
    header.className = 'scenario-header';
    
    const title = document.createElement('h3');
    title.textContent = scenario.title || "Scénario sans titre";
    header.appendChild(title);
    
    const theme = document.createElement('p');
    theme.className = 'scenario-theme';
    theme.textContent = "Thème: " + (scenario.theme || "Non spécifié");
    header.appendChild(theme);
    
    container.appendChild(header); 
    
    // Afficher les informations sur l'univers
    if (scenario.univers) {
        const universSection = document.createElement('div');
        universSection.className = 'scenario-section';
        
        const universTitle = document.createElement('h4');
        universTitle.textContent = "Univers";
        universSection.appendChild(universTitle);
        
        const universDesc = document.createElement('p');
        universDesc.textContent = scenario.univers.description || "Description de l'univers non disponible";
        universSection.appendChild(universDesc);
        
        const universDetails = document.createElement('ul');
        if (scenario.univers.type) {
            const typeItem = document.createElement('li');
            typeItem.textContent = "Type: " + scenario.univers.type;
            universDetails.appendChild(typeItem);
        }
        if (scenario.univers.epoque) {
            const epoqueItem = document.createElement('li');
            epoqueItem.textContent = "Époque: " + scenario.univers.epoque;
            universDetails.appendChild(epoqueItem);
        }
        if (scenario.univers.technologie) {
            const techItem = document.createElement('li');
            techItem.textContent = "Technologie: " + scenario.univers.technologie;
            universDetails.appendChild(techItem);
        }
        universSection.appendChild(universDetails);
        
        container.appendChild(universSection);
    }
    
    // Afficher les personnages
    if (scenario.personnages && scenario.personnages.length > 0) {
        const personnagesSection = document.createElement('div');
        personnagesSection.className = 'scenario-section';
        
        const personnagesTitle = document.createElement('h4');
        personnagesTitle.textContent = "Personnages";
        personnagesSection.appendChild(personnagesTitle);
        
        const personnagesList = document.createElement('ul');
        personnagesList.className = 'personnages-list';
        
        scenario.personnages.forEach(personnage => {
            const personnageItem = document.createElement('li');
            personnageItem.className = 'personnage-item';
            
            const personnageName = document.createElement('strong');
            personnageName.textContent = personnage.nom || "Personnage sans nom";
            personnageItem.appendChild(personnageName);
            
            if (personnage.archetype) {
                personnageItem.appendChild(document.createTextNode(" (" + personnage.archetype + ")"));
            }
            
            if (personnage.description) {
                const personnageDesc = document.createElement('p');
                personnageDesc.textContent = personnage.description;
                personnageItem.appendChild(personnageDesc);
            }
            
            personnagesList.appendChild(personnageItem);
        });
        
        personnagesSection.appendChild(personnagesList);
        container.appendChild(personnagesSection);
    }
    
    // Afficher les chapitres
    if (scenario.chapters && scenario.chapters.length > 0) {
        const chapitresSection = document.createElement('div');
        chapitresSection.className = 'scenario-section';
        
        const chapitresTitle = document.createElement('h4');
        chapitresTitle.textContent = "Chapitres";
        chapitresSection.appendChild(chapitresTitle);
        
        // Créer un accordéon pour les chapitres
        const chapitresAccordion = document.createElement('div');
        chapitresAccordion.className = 'chapitres-accordion';
        
        scenario.chapters.forEach((chapitre, index) => {
            const chapitreItem = document.createElement('div');
            chapitreItem.className = 'chapitre-item';   personnagesList.appendChild(personnageItem);
        });
        
 ▋
