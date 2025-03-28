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
                    generateAndDisplayScenario(keywords, generateButton, loadingElement);
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
                    featuresSection.parentNode.insertBefore(scenarioContainer, ▋
