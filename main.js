// --- UPDATED FILE main.js ---
// Solution tout-en-un pour BD Creator avec améliorations pour textes longs et prompts enrichis
// Ce fichier contient toutes les fonctionnalités nécessaires sans dépendances externes

// Variables globales pour stocker les données du projet
let projectData = {
    keywords: "",
    scenario: null,
    storyboard: null,
    prompts: null
};

// Fonction pour afficher le scénario généré (doit être définie avant d'être appelée si appelée depuis DOMContentLoaded)
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

    // Afficher les informations sur l'univers (si elles existent)
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

    // Afficher les personnages (s'ils existent)
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

    // Afficher les chapitres (s'ils existent)
    if (scenario.chapters && scenario.chapters.length > 0) {
        const chapitresSection = document.createElement('div');
        chapitresSection.className = 'scenario-section';

        const chapitresTitle = document.createElement('h4');
        chapitresTitle.textContent = "Chapitres";
        chapitresSection.appendChild(chapitresTitle);

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
            chapitreContent.style.display = 'none'; // Masqué par défaut

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
            }


            chapitreItem.appendChild(chapitreContent);
            chapitresAccordion.appendChild(chapitreItem);
        });

        chapitresSection.appendChild(chapitresAccordion);
        container.appendChild(chapitresSection);
    }

    // Ajouter les styles CSS pour l'accordéon (seulement si nécessaire et pas déjà dans styles.css)
     // Vérifier si les styles existent déjà
    if (!document.getElementById('scenario-styles')) {
        const style = document.createElement('style');
        style.id = 'scenario-styles'; // Donner un ID pour éviter de l'ajouter plusieurs fois
        style.textContent = `
            .scenario-container { margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .scenario-header { margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
            .scenario-theme { font-style: italic; color: #555; }
            .scenario-section { margin-bottom: 20px; }
            .personnages-list { list-style: none; padding: 0; }
            .personnage-item { margin-bottom: 10px; padding: 5px; background-color: #fff; border-radius: 4px; }
            .chapitres-accordion .chapitre-item { margin-bottom: 5px; }
            .chapitre-header { background-color: #eee; padding: 10px; cursor: pointer; border-radius: 4px; }
            .chapitre-header:hover { background-color: #ddd; }
            .chapitre-header.active { background-color: #ddd; font-weight: bold; }
            .chapitre-content { padding: 15px; background-color: #f5f5f5; border: 1px solid #eee; border-top: none; border-radius: 0 0 4px 4px; }
            .chapitre-resume { margin-bottom: 10px; }
            .pages-count { font-weight: bold; margin-bottom: 10px; }
        `;
        document.head.appendChild(style);
    }
}

// Fonction pour générer et afficher le scénario (doit être définie avant d'être appelée)
function generateAndDisplayScenario(keywords, generateButton, loadingElement) {
    console.log("Génération du scénario pour: " + keywords);

    // S'assurer que la fonction generateScenarioDetaille existe
    if (typeof window.generateScenarioDetaille !== 'function') {
         console.error("Erreur: La fonction generateScenarioDetaille n'est pas définie.");
         alert("Erreur critique : la fonction de génération de scénario est manquante.");
         // Réactiver le bouton et supprimer le chargement en cas d'erreur
         generateButton.disabled = false;
         generateButton.textContent = "Générer un scénario";
         if (loadingElement && loadingElement.parentNode) {
             loadingElement.parentNode.removeChild(loadingElement);
         }
         return; // Arrêter l'exécution
     }


    window.generateScenarioDetaille(keywords).then(scenario => {
        console.log("Scénario généré avec succès", scenario);

        if (!scenario) {
           throw new Error("Le scénario généré est null ou invalide.");
        }

        projectData.scenario = scenario;

        // Sauvegarder le scénario dans localStorage
        localStorage.setItem('bdScenario', JSON.stringify(scenario));

        // Mettre à jour le gestionnaire de session (si nécessaire et s'il existe)
        // if (window.bdSessionManager) {
        //     window.bdSessionManager.updateCurrentSessionInfo(); // Ou une méthode plus spécifique si elle existe
        // }

        // Créer un conteneur pour le scénario s'il n'existe pas déjà
        let scenarioContainer = document.getElementById('scenario-display-container');
        if (!scenarioContainer) {
            scenarioContainer = document.createElement('div');
            scenarioContainer.id = 'scenario-display-container';
            scenarioContainer.className = 'scenario-container'; // Utiliser une classe CSS existante ou nouvelle
            // Ajouter le conteneur après le bouton (ou à un autre endroit approprié)
             const generateBtnParent = generateButton.parentNode;
            generateBtnParent.parentNode.insertBefore(scenarioContainer, generateBtnParent.nextSibling);
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
         if(scenarioContainer.scrollIntoView) {
             scenarioContainer.scrollIntoView({ behavior: 'smooth' });
         }


    }).catch(error => {
        console.error("Erreur lors de la génération du scénario:", error);
        alert("Erreur lors de la génération du scénario. Vérifiez la console pour plus de détails.");

        // Réactiver le bouton
        generateButton.disabled = false;
        generateButton.textContent = "Générer un scénario";

        // Supprimer l'indicateur de chargement
        if (loadingElement && loadingElement.parentNode) {
            loadingElement.parentNode.removeChild(loadingElement);
        }
    });
}


// Initialisation de l'application lorsque le DOM est prêt
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM chargé, initialisation de l'application principale...");

    // Vérifier si nous sommes sur la page d'accueil (index.html)
    const keywordsInput = document.getElementById('keywords');
    const generateButton = document.getElementById('generate-scenario-btn');

    if (keywordsInput && generateButton) {
        console.log("Page d'accueil détectée, ajout de l'écouteur pour générer le scénario.");
        // Ajouter un écouteur d'événements pour le bouton de génération de scénario
        generateButton.addEventListener('click', function() {
            console.log("Bouton 'Générer un scénario' cliqué!");
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
            loadingElement.style.cssText = 'margin-top: 20px; padding: 10px; background-color: #f8f9fa; border-radius: 5px; text-align: center;';

            // Ajouter l'élément après le bouton
            generateButton.parentNode.appendChild(loadingElement);

            // Stocker le texte complet dans localStorage
            localStorage.setItem('bdKeywords', keywords);

            // Forcer la régénération du scénario en supprimant l'ancien
            localStorage.removeItem('bdScenario');
            localStorage.removeItem('bdStoryboard'); // Supprimer aussi le storyboard lié
            localStorage.removeItem('bdPrompts'); // Et les prompts

            // Générer et afficher le scénario
            generateAndDisplayScenario(keywords, generateButton, loadingElement);
        });

         // Afficher le scénario existant s'il y en a un dans localStorage
         const existingScenarioJson = localStorage.getItem('bdScenario');
         if (existingScenarioJson) {
             console.log("Scénario existant trouvé dans localStorage, affichage...");
             try {
                 const existingScenario = JSON.parse(existingScenarioJson);
                 let scenarioContainer = document.getElementById('scenario-display-container');
                 if (!scenarioContainer) {
                     scenarioContainer = document.createElement('div');
                     scenarioContainer.id = 'scenario-display-container';
                     scenarioContainer.className = 'scenario-container';
                      const generateBtnParent = generateButton.parentNode;
                     generateBtnParent.parentNode.insertBefore(scenarioContainer, generateBtnParent.nextSibling);
                 }
                 displayScenario(existingScenario, scenarioContainer);
             } catch (e) {
                 console.error("Erreur lors de l'analyse du scénario existant:", e);
                 localStorage.removeItem('bdScenario'); // Supprimer le scénario invalide
             }
         } else {
             console.log("Aucun scénario existant trouvé dans localStorage.");
         }

    } else {
        console.log("Ce n'est pas la page d'accueil OU les éléments #keywords ou #generate-scenario-btn sont manquants.");
    }

     // --- Code pour les autres pages (Scénario, Storyboard, Prompts) ---
     // Vous devrez ajouter ici le code spécifique pour charger et afficher
     // les données sur ces pages, en vous assurant que les conteneurs
     // HTML correspondants existent (par ex. #scenario-container, #storyboard-container).

     // Exemple pour scenario.html (à adapter)
     const scenarioContainerPage = document.getElementById('scenario-container');
     if (scenarioContainerPage && !generateButton) { // Assurez-vous que ce n'est pas la page d'accueil
         console.log("Page Scénario détectée.");
         const scenarioJson = localStorage.getItem('bdScenario');
         if (scenarioJson) {
             try {
                 const scenario = JSON.parse(scenarioJson);
                 displayScenario(scenario, scenarioContainerPage); // Réutiliser la fonction d'affichage
             } catch (e) {
                 console.error("Erreur lors de l'affichage du scénario sur la page Scénario:", e);
                 scenarioContainerPage.innerHTML = '<p class="error-message">Erreur lors du chargement du scénario.</p>';
             }
         } else {
             scenarioContainerPage.innerHTML = '<p>Aucun scénario à afficher. Veuillez en générer un depuis la page d\'accueil.</p>';
         }
     }

     // Ajoutez des blocs 'if' similaires pour les pages storyboard.html et prompts.html

});

console.log("main.js chargé et prêt.");
