window.generatePromptsDetailles = async function(storyboard) {
    try {
        // Gestion des valeurs manquantes
        const safeUniversType = storyboard.univers?.type || 'contemporain';
        const artStyles = artStylesParUnivers[safeUniversType] || ['illustration style'];
        
        // Génération de seed sécurisée
        const seed = Date.now() + index * 1000 + crypto.getRandomValues(new Uint32Array(1))[0];
        
        // Sanitisation des descriptions
        const safeDescription = descriptionCase.replace(/[<>]/g, '');
        // ... reste de la fonction ...
    } catch (error) {
        console.error("Erreur sécurisée:", error);
        return null;
    }
}
