// Gestionnaire de copie moderne et sécurisé
async function handlePromptCopy(event) {
    if (event.target.classList.contains('copy-button')) {
        const button = event.target;
        const textarea = button.previousElementSibling;
        
        try {
            await navigator.clipboard.writeText(textarea.value);
            button.textContent = 'Copié!';
            button.style.backgroundColor = '#2ecc71';
            setTimeout(() => {
                button.textContent = 'Copier';
                button.style.backgroundColor = '';
            }, 2000);
        } catch (err) {
            console.error('Erreur copie:', err);
            button.textContent = 'Erreur';
            button.style.backgroundColor = '#e74c3c';
        }
    }
}

// Gestion des chapitres sécurisée
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('chapitre-header')) {
        const header = event.target;
        const content = header.nextElementSibling;
        header.classList.toggle('active');
        content.classList.toggle('active');
    }
});

// Initialisation renforcée
function initializeApp() {
    console.log("Initialisation sécurisée...");
    const pages = {
        'index': { container: '#scenario-display-container', init: initializeHomePage },
        'scenario': { container: '#scenario-container', init: initializeScenarioPage },
        'storyboard': { container: '#storyboard-container', init: initializeStoryboardPage },
        'prompts': { container: '#prompts-container', init: initializePromptsPage }
    };

    try {
        const pageName = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
        const config = pages[pageName] || pages.index;
        const container = document.querySelector(config.container);
        
        if (!container) throw new Error('Conteneur introuvable');
        config.init(container);
    } catch (error) {
        console.error("Erreur d'initialisation:", error);
        showGlobalError();
    }
}

// ... (autres fonctions mises à jour avec gestion d'erreur) ...
