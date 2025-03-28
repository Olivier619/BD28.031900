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
    // Vérifier si nous sommes sur la page d'accueil
    const keywordsInput = document.getElementById('keywords');
    if (keywordsInput) {
        // Ajouter un écouteur d'événements pour le bouton de génération de scénario
        const generateButton = document.getElementById('generate-scenario-btn');
        if (generateButton) {
            generateButton.addEventListener('click', function() {
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
                    // Inclure le script scenario_detaille.js s'il n'est pas déjà chargé
                    if (!window.scenarioDetailleLoaded) {
                        const script = document.createElement('script');
                        script.src = 'scenario_detaille.js';
                        script.onload = function() {
                            window.scenarioDetailleLoaded = true;
                            generateAndDisplayScenario(keywords, generateButton, loadingElement);
                        };
                        document.head.appendChild(script);
                    } else {
                        generateAndDisplayScenario(keywords, generateButton, loadingElement);
                    }
                } else {
                    // Charger le script scenario_detaille.js
                    const script = document.createElement('script');
                    script.src = 'scenario_detaille.js';
                    script.onload = function() {
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
            chapitreItem.className = 'chapitre-item';
            
            const chapitreHeader = document.createElement('div');
            chapitreHeader.className = 'chapitre-header';
            chapitreHeader.textContent = "Chapitre " + (chapitre.numero || (index + 1)) + ": " + (chapitre.titre || "Sans titre");
            chapitreHeader.onclick = function() {
                this.classList.toggle('active');
                const chapitreContent = this.nextElementSibling;
                if (chapitreContent.style.display === "block") {
                    chapitreContent.style.display = "none";
                } else {
                    chapitreContent.style.display = "block";
                }
            };
            chapitreItem.appendChild(chapitreHeader);
            
            const chapitreContent = document.createElement('div');
            chapitreContent.className = 'chapitre-content';
            chapitreContent.style.display = 'none';
            
            if (chapitre.resume) {
                const chapitreResume = document.createElement('p');
                chapitreResume.className = 'chapitre-resume';
                chapitreResume.textContent = chapitre.resume;
                chapitreContent.appendChild(chapitreResume);
            }
            
            if (chapitre.pages && chapitre.pages.length > 0) {
                const pagesCount = document.createElement('p');
                pagesCount.className = 'pages-count';
                pagesCount.textContent = chapitre.pages.length + " pages";
                chapitreContent.appendChild(pagesCount);
                
                // Ajouter un aperçu des premières pages
                const pagesPreview = document.createElement('div');
                pagesPreview.className = 'pages-preview';
                
                // Limiter à 3 pages pour l'aperçu
                const previewPages = chapitre.pages.slice(0, 3);
                previewPages.forEach(page => {
                    const pageItem = document.createElement('div');
                    pageItem.className = 'page-item';
                    
                    const pageHeader = document.createElement('h5');
                    pageHeader.textContent = "Page " + page.numeroGlobal;
                    pageItem.appendChild(pageHeader);
                    
                    if (page.description) {
                        const pageDesc = document.createElement('p');
                        pageDesc.textContent = page.description;
                        pageItem.appendChild(pageDesc);
                    }
                    
                    pagesPreview.appendChild(pageItem);
                });
                
                chapitreContent.appendChild(pagesPreview);
                
                if (chapitre.pages.length > 3) {
                    const morePages = document.createElement('p');
                    morePages.className = 'more-pages';
                    morePages.textContent = "... et " + (chapitre.pages.length - 3) + " pages supplémentaires";
                    chapitreContent.appendChild(morePages);
                }
            }
            
            chapitreItem.appendChild(chapitreContent);
            chapitresAccordion.appendChild(chapitreItem);
        });
        
        chapitresSection.appendChild(chapitresAccordion);
        container.appendChild(chapitresSection);
    }
    
    // Ajouter des styles CSS pour l'accordéon
    const style = document.createElement('style');
    style.textContent = `
        .scenario-container {
            margin-top: 30px;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .scenario-header {
            margin-bottom: 20px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
        }
        .scenario-section {
            margin-bottom: 20px;
        }
        .personnage-item {
            margin-bottom: 10px;
        }
        .chapitre-header {
            background-color: #eee;
            padding: 10px;
            cursor: pointer;
            margin-bottom: 5px;
            border-radius: 4px;
        }
        .chapitre-header:hover {
            background-color: #ddd;
        }
        .chapitre-header.active {
            background-color: #ddd;
        }
        .chapitre-content {
            padding: 10px;
            background-color: #f5f5f5;
            border-radius: 4px;
            margin-bottom: 10px;
        }
        .page-item {
            margin-bottom: 10px;
            padding-left: 10px;
            border-left: 2px solid #ddd;
        }
        .more-pages {
            font-style: italic;
            color: #666;
        }
    `;
    document.head.appendChild(style);
}

// Fonction pour afficher le storyboard
function displayStoryboard(storyboard) {
    const container = document.getElementById('storyboard-container');
    if (!container) return;
    
    container.innerHTML = '<h3>Storyboard</h3>';
    
    if (!storyboard || !storyboard.pages || storyboard.pages.length === 0) {
        container.innerHTML += '<p>Aucun storyboard disponible.</p>';
        return;
    }
    
    // Créer la navigation des pages
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination-container';
    
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Page précédente';
    prevButton.className = 'pagination-button';
    prevButton.disabled = true;
    
    const pageIndicator = document.createElement('span');
    pageIndicator.className = 'page-indicator';
    pageIndicator.textContent = 'Page 1 / ' + storyboard.pages.length;
    
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Page suivante';
    nextButton.className = 'pagination-button';
    nextButton.disabled = storyboard.pages.length <= 1;
    
    paginationContainer.appendChild(prevButton);
    paginationContainer.appendChild(pageIndicator);
    paginationContainer.appendChild(nextButton);
    
    container.appendChild(paginationContainer);
    
    // Créer le conteneur de page
    const pageContainer = document.createElement('div');
    pageContainer.className = 'storyboard-page-container';
    container.appendChild(pageContainer);
    
    // Variable pour suivre la page actuelle
    let currentPageIndex = 0;
    
    // Fonction pour afficher une page spécifique
    function displayPage(pageIndex) {
        if (pageIndex < 0 || pageIndex >= storyboard.pages.length) return;
        
        currentPageIndex = pageIndex;
        const page = storyboard.pages[pageIndex];
        
        pageContainer.innerHTML = '';
        
        const pageHeader = document.createElement('h4');
        pageHeader.textContent = 'Page ' + (page.number || (pageIndex + 1));
        pageContainer.appendChild(pageHeader);
        
        if (page.description) {
            const pageDesc = document.createElement('p');
            pageDesc.textContent = page.description;
            pageContainer.appendChild(pageDesc);
        }
        
        if (page.panels && page.panels.length > 0) {
            const panelsContainer = document.createElement('div');
            panelsContainer.className = 'panels-container';
            
            page.panels.forEach((panel, panelIndex) => {
                const panelElement = document.createElement('div');
                panelElement.className = 'panel';
                
                const panelHeader = document.createElement('h5');
                panelHeader.textContent = 'Case ' + (panelIndex + 1);
                panelElement.appendChild(panelHeader);
                
                if (panel.description) {
                    const panelDesc = document.createElement('p');
                    panelDesc.className = 'panel-description';
                    panelDesc.textContent = panel.description;
                    panelElement.appendChild(panelDesc);
                }
                
                if (panel.dialogue) {
                    const dialogueElement = document.createElement('div');
                    dialogueElement.className = 'dialogue';
                    dialogueElement.innerHTML = '<strong>Dialogue:</strong> ' + panel.dialogue;
                    panelElement.appendChild(dialogueElement);
                }
                
                panelsContainer.appendChild(panelElement);
            });
            
            pageContainer.appendChild(panelsContainer);
        }
        
        // Mettre à jour l'indicateur de page et les boutons
        pageIndicator.textContent = 'Page ' + (pageIndex + 1) + ' / ' + storyboard.pages.length;
        prevButton.disabled = pageIndex === 0;
        nextButton.disabled = pageIndex === storyboard.pages.length - 1;
    }
    
    // Afficher la première page
    displayPage(0);
    
    // Ajouter les écouteurs d'événements pour la pagination
    prevButton.addEventListener('click', function() {
        displayPage(currentPageIndex - 1);
    });
    
    nextButton.addEventListener('click', function() {
        displayPage(currentPageIndex + 1);
    });
}

// Fonction pour afficher les prompts
function displayPrompts(prompts) {
    const container = document.getElementById('prompts-container');
    if (!container) return;
    
    container.innerHTML = '<h3>Prompts pour Midjourney</h3>';
    
    if (!prompts || !prompts.pages || prompts.pages.length === 0) {
        container.innerHTML += '<p>Aucun prompt disponible.</p>';
        return;
    }
    
    // Créer la navigation des pages
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination-container';
    
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Page précédente';
    prevButton.className = 'pagination-button';
    prevButton.disabled = true;
    
    const pageIndicator = document.createElement('span');
    pageIndicator.className = 'page-indicator';
    pageIndicator.textContent = 'Page 1 / ' + prompts.pages.length;
    
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Page suivante';
    nextButton.className = 'pagination-button';
    nextButton.disabled = prompts.pages.length <= 1;
    
    paginationContainer.appendChild(prevButton);
    paginationContainer.appendChild(pageIndicator);
    paginationContainer.appendChild(nextButton);
    
    container.appendChild(paginationContainer);
    
    // Créer le conteneur de page
    const pageContainer = document.createElement('div');
    pageContainer.className = 'prompts-page-container';
    container.appendChild(pageContainer);
    
    // Variable pour suivre la page actuelle
    let currentPageIndex = 0;
    
    // Fonction pour afficher une page spécifique
    function displayPage(pageIndex) {
        if (pageIndex < 0 || pageIndex >= prompts.pages.length) return;
        
        currentPageIndex = pageIndex;
        const page = prompts.pages[pageIndex];
        
        pageContainer.innerHTML = '';
        
        const pageHeader = document.createElement('h4');
        pageHeader.textContent = 'Page ' + (page.number || (pageIndex + 1));
        pageContainer.appendChild(pageHeader);
        
        if (page.panels && page.panels.length > 0) {
            const panelsContainer = document.createElement('div');
            panelsContainer.className = 'panels-container';
            
            page.panels.forEach((panel, panelIndex) => {
                const panelElement = document.createElement('div');
                panelElement.className = 'panel';
                
                const panelHeader = document.createElement('h5');
                panelHeader.textContent = 'Case ' + (panelIndex + 1);
                panelElement.appendChild(panelHeader);
                
                if (panel.prompt) {
                    const promptElement = document.createElement('div');
                    promptElement.className = 'prompt';
                    
                    const promptTextarea = document.createElement('textarea');
                    promptTextarea.className = 'prompt-textarea';
                    promptTextarea.readOnly = true;
                    promptTextarea.value = panel.prompt;
                    promptElement.appendChild(promptTextarea);
                    
                    const copyButton = document.createElement('button');
                    copyButton.className = 'copy-button';
                    copyButton.textContent = 'Copier';
                    copyButton.addEventListener('click', function() {
                        promptTextarea.select();
                        document.execCommand('copy');
                        this.textContent = 'Copié!';
                        setTimeout(() => {
                            this.textContent = 'Copier';
                        }, 2000);
                    });
                    promptElement.appendChild(copyButton);
                    
                    panelElement.appendChild(promptElement);
                }
                
                panelsContainer.appendChild(panelElement);
            });
            
            pageContainer.appendChild(panelsContainer);
        }
        
        // Mettre à jour l'indicateur de page et les boutons
        pageIndicator.textContent = 'Page ' + (pageIndex + 1) + ' / ' + prompts.pages.length;
        prevButton.disabled = pageIndex === 0;
        nextButton.disabled = pageIndex === prompts.pages.length - 1;
    }
    
    // Afficher la première page
    displayPage(0);
    
    // Ajouter les écouteurs d'événements pour la pagination
    prevButton.addEventListener('click', function() {
        displayPage(currentPageIndex - 1);
    });
    
    nextButton.addEventListener('click', function() {
        displayPage(currentPageIndex + 1);
    });
}

// Fonction pour créer un storyboard à partir d'un scénario
async function createStoryboard(scenario) {
    console.log("Création du storyboard à partir du scénario:", scenario);
    
    // Vérifier si le scénario contient des chapitres et des pages
    if (!scenario || !scenario.chapters || scenario.chapters.length === 0) {
        console.error("Le scénario ne contient pas de chapitres");
        return { pages: [] };
    }
    
    const storyboardPages = [];
    
    // Parcourir les chapitres et les pages du scénario
    for (const chapter of scenario.chapters) {
        if (chapter.pages && chapter.pages.length > 0) {
            for (const page of chapter.pages) {
                const storyboardPage = {
                    number: page.numeroGlobal,
                    chapterNumber: chapter.numero,
                    description: page.description || `Page ${page.numeroGlobal} du chapitre ${chapter.numero}`,
                    panels: []
                };
                
                // Créer les cases pour cette page
                if (page.cases && page.cases.length > 0) {
                    for (const caseItem of page.cases) {
                        const panel = {
                            number: caseItem.numeroCase,
                            description: caseItem.descriptionVisuelle || "",
                            dialogue: caseItem.dialogue ? `${caseItem.dialogue.personnage}: ${caseItem.dialogue.texte}` : null
                        };
                        storyboardPage.panels.push(panel);
                    }
                }
                
                storyboardPages.push(storyboardPage);
            }
        }
    }
    
    return { pages: storyboardPages };
}

// Fonction pour générer des prompts à partir d'un storyboard
async function generatePrompts(storyboard) {
    console.log("Génération des prompts à partir du storyboard:", storyboard);
    
    if (!storyboard || !storyboard.pages || storyboard.pages.length === 0) {
        console.error("Le storyboard ne contient pas de pages");
        return { pages: [] };
    }
    
    const promptsPages = [];
    
    // Parcourir les pages du storyboard
    for (const page of storyboard.pages) {
        const promptsPage = {
            number: page.number,
            panels: []
        };
        
        // Générer un prompt pour chaque case
        if (page.panels && page.panels.length > 0) {
            for (const panel of page.panels) {
                const promptPanel = {
                    number: panel.number,
                    prompt: generateMidjourneyPrompt(panel)
                };
                promptsPage.panels.push(promptPanel);
            }
        }
        
        promptsPages.push(promptsPage);
    }
    
    return { pages: promptsPages };
}

// Fonction pour générer un prompt Midjourney à partir d'une case
function generateMidjourneyPrompt(panel) {
    // Base du prompt
    let prompt = "";
    
    // Ajouter la description de la case
    if (panel.description) {
        prompt += panel.description + ", ";
    }
    
    // Ajouter des éléments de style
    prompt += "detailed illustration, comic book style, vibrant colors, ";
    
    // Ajouter des paramètres techniques
    prompt += "--ar 16:9 --v 5 --q 2";
    
    return prompt;
}

// Fonction pour analyser un texte complet et en extraire les éléments narratifs
async function analyzeFullText(text) {
    console.log("Analyse du texte complet...");
    
    // Extraire les thèmes principaux
    const themes = [];
    const themeKeywords = ["aventure", "amour", "guerre", "paix", "nature", "technologie", "magie", "science", "histoire"];
    
    for (const keyword of themeKeywords) {
        if (text.toLowerCase().includes(keyword)) {
            themes.push(keyword);
        }
    }
    
    // Extraire les personnages potentiels (noms propres)
    const personnages = [];
    const nameRegex = /\b[A-Z][a-z]+\b/g;
    const nameMatches = text.match(nameRegex);
    
    if (nameMatches) {
        for (const name of nameMatches) {
            if (!personnages.includes(name)) {
                personnages.push(name);
            }
        }
    }
    
    // Extraire les lieux potentiels
    const lieux = [];
    const placeKeywords = ["château", "forêt", "ville", "montagne", "mer", "océan", "planète", "galaxie", "royaume"];
    
    for (const keyword of placeKeywords) {
        if (text.toLowerCase().includes(keyword)) {
            lieux.push(keyword);
        }
    }
    
    return {
        themes: themes,
        personnages: personnages,
        lieux: lieux,
        texteComplet: text
    };
}

console.log("main.js chargé avec succès");
