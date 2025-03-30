/**
 * Fonction pour générer un scénario détaillé comme le ferait une IA spécialisée
 * S'assure que la fonction est bien attachée à l'objet window.
 */
console.log("--- scenario_detaille.js : DÉBUT ANALYSE ---");

console.log("--- scenario_detaille.js : JUSTE AVANT définition window.generateScenarioDetaille ---");
window.generateScenarioDetaille = async function(keywords) {
    try {
        console.log("generateScenarioDetaille (Original): Démarrage pour : " + keywords);

        const randomSeed = Date.now() + Math.floor(Math.random() * 1000000);
        const keywordsList = keywords.toLowerCase().split(/[ ,\n]+/).filter(k => k.trim().length > 0);

        let title = genererTitreCreatif(keywordsList, randomSeed);
        const univers = creerUnivers(keywordsList, randomSeed); // Appel de la fonction corrigée
        const personnages = creerPersonnages(keywordsList, univers, randomSeed);
        const structureNarrative = creerStructureNarrative(keywordsList, univers, personnages, randomSeed);
        const chapitres = genererChapitresDetailles(structureNarrative, univers, personnages, randomSeed);

        const scenario = {
            title: title,
            theme: keywords,
            univers: univers,
            personnages: personnages,
            structureNarrative: structureNarrative,
            chapters: chapitres,
            generatedAt: new Date().toISOString()
        };

        console.log('>>> scenario_detaille.js: Prêt à retourner le scénario :', scenario);
         await new Promise(resolve => setTimeout(resolve, 50)); // Simuler délai
        return scenario;

    } catch (error) {
        console.error('>>> scenario_detaille.js: ERREUR CAPTURÉE DANS generateScenarioDetaille :', error);
        alert('ERREUR DANS generateScenarioDetaille - Vérifiez la console !');
        console.error("generateScenarioDetaille (Original): ERREUR lors de la génération:", error);
        return null;
    }
}
console.log("--- scenario_detaille.js : JUSTE APRÈS définition bloc fonction generateScenarioDetaille ---");


// --- Fonctions auxiliaires ---

function pseudoRandom(seed) { let x = Math.sin(seed) * 10000; return x - Math.floor(x); }

function genererTitreCreatif(keywordsList, randomSeed) {
    const titresCreatifs = ["Les Chroniques oubliées de [Mot-clé]", "L'Odyssée stellaire de [Mot-clé]", "Le Secret enfoui des [Mot-clé]", "Au-delà des terres de [Mot-clé]", "[Mot-clé] et la Prophétie Écarlate", "Les Gardiens du dernier [Mot-clé]", "L'Éveil sombre de [Mot-clé]", "La Prophétie des Anciens : [Mot-clé]", "Le Dernier Voyage vers [Mot-clé]", "L'Écho Silencieux des [Mot-clé]", "Sous le Ciel de [Mot-clé]", "[Mot-clé] : L'Héritage Perdu"];
    const modeleIndex = Math.floor(pseudoRandom(randomSeed) * titresCreatifs.length); let modele = titresCreatifs[modeleIndex];
    const keyword = keywordsList.length > 0 ? keywordsList[Math.floor(pseudoRandom(randomSeed + 1) * keywordsList.length)] : "Mystère";
    const keywordCapitalized = keyword.charAt(0).toUpperCase() + keyword.slice(1);
    return modele.replace("[Mot-clé]", keywordCapitalized);
}

function creerUnivers(keywordsList, randomSeed) {
    const typesUnivers = ["médiéval-fantastique", "science-fiction", "post-apocalyptique", "contemporain", "steampunk", "cyberpunk", "mythologique", "historique", "dystopique", "utopique", "horreur cosmique", "western spaghetti", "polar noir", "space opera"];
    let detectedType = "contemporain";
    const typeKeywords = {"science-fiction": ["futur", "robot", "espace", "vaisseau", "alien", "cyborg", "planète", "laser"],"médiéval-fantastique": ["dragon", "magie", "elfe", "château", "chevalier", "épée", "sorcier", "quête"],"post-apocalyptique": ["apocalypse", "survie", "ruine", "mutant", "désert", "dévasté", "zone"],"steampunk": ["vapeur", "engrenage", "victorien", "dirigeable", "mécanique", "automate"],"cyberpunk": ["néon", "implant", "hacker", "corporation", "dystopie", "virtuel", "augmenté"],"horreur cosmique": ["cthulhu", "lovecraft", "indicible", "folie", "ancien", "abomination"]};
    for (const type in typeKeywords) { if (keywordsList.some(kw => typeKeywords[type].includes(kw))) { detectedType = type; break; } }
    if (detectedType === "contemporain" && keywordsList.length > 2) { detectedType = typesUnivers[Math.floor(pseudoRandom(randomSeed + 2) * typesUnivers.length)]; }
    const caracteristiques = {
        "médiéval-fantastique": { epoque: "Âge des légendes", technologie: "Limitée, magie omniprésente", particularites: "Créatures mythiques, royaumes en guerre", lieux: ["Forêt enchantée", "Citadelle Naine", "Tour de Sorcier", "Village Fortifié", "Ruines Elfiques"] },
        "science-fiction": { epoque: "XXVème siècle", technologie: "Très avancée, IA, voyages FTL", particularites: "Exploration spatiale, fédérations galactiques", lieux: ["Station Spatiale Orbitale", "Planète Jungle luxuriante", "Mégapole Flottante", "Laboratoire de Xéno-biologie", "Vaisseau Colonial Générationnel"] },
        "post-apocalyptique": { epoque: "200 ans après 'Le Grand Effondrement'", technologie: "Vestiges et bricolages", particularites: "Factions hostiles, ressources rares", lieux: ["Ville en Ruines Recouvertes de Végétation", "Abri Souterrain Communautaire", "Désert de Verre Radioactif", "Forteresse de Pillards", "Oasis Cachée"] },
        "contemporain": { epoque: "Aujourd'hui", technologie: "Actuelle", particularites: "Intrigues urbaines, surnaturel discret possible", lieux: ["Café branché du centre-ville", "Vieil entrepôt désaffecté", "Parc municipal paisible", "Bibliothèque universitaire", "Quartier résidentiel calme"] },
        "steampunk": { epoque: "Ère Victorienne Alternative (1888)", technologie: "Mécanique à vapeur avancée", particularites: "Inventions extravagantes, société de classes marquée", lieux: ["Usine Horlogère Géante", "Salon d'Inventeur Excentrique", "Docks Brumeux et Dangereux", "Palais Aérien de l'Aristocratie", "Observatoire Automate"] },
        "cyberpunk": { epoque: "Néo-Kyoto, 2077", technologie: "Implants cybernétiques, réseaux neuronaux", particularites: "Mégacorporations toutes puissantes, bas-fonds dangereux", lieux: ["Marché Noir Souterrain Illuminé aux Néons", "Tour Corporative Impénétrable", "Bar Clandestin pour Hackers", "Autoroute Virtuelle du Net", "Clinique d'Augmentation Illégale"] },
        "mythologique": { epoque: "Temps des Mythes Grecs", technologie: "Artefacts divins", particularites: "Héros demi-dieux, monstres légendaires", lieux: ["Mont Olympe", "Labyrinthe de Crète", "Enfers", "Île des Sirènes", "Temple de Delphes"] },
        "horreur cosmique": { epoque: "Nouvelle-Angleterre, 1920", technologie: "Début XXe", particularites: "Sectes occultes, savoir interdit", lieux: ["Manoir Isolé et Hanté", "Village de Pêcheurs Dégénéré", "Bibliothèque Occulte Poussiéreuse", "Dimension Cauchemardesque", "Cercle de Monolithes Anciens"] },
        "polar noir": { epoque: "Los Angeles, 1940", technologie: "Après-guerre", particularites: "Femmes fatales, détectives désabusés", lieux: ["Bureau de Détective Privé Fumeux", "Club de Jazz Clandestin", "Villa d'un Magnat Corrompu", "Ruelle Sombre et Pluvieuse", "Commissariat Central"] },
        "western spaghetti": { epoque: "Ouest Sauvage, vers 1870", technologie: "Colts et dynamite", particularites: "Chasseurs de primes, duels au soleil", lieux: ["Ville Fantôme Poussiéreuse", "Saloon Bagarreur", "Canyon Isolé", "Ranch Fortifié", "Train à Vapeur Attaqué"] },
        "space opera": { epoque: "Millénaire Lointain", technologie: "Sabres laser, Force mystique", particularites: "Empire galactique vs Rébellion", lieux: ["Pont d'un Croiseur Stellaire", "Planète Désertique", "Cité dans les Nuages", "Académie Spatiale", "Temple Ancien sur une Lune"] },
        "historique": { epoque: "Rome Antique (70 ap. J.-C.)", technologie: "Romaine", particularites: "Intrigues politiques, gladiateurs", lieux: ["Colisée", "Forum Romain", "Villa Patricienne", "Thermes Publics", "Camp Militaire"] },
        "dystopique": { epoque: "République Unifiée, 2140", technologie: "Contrôle total via la technologie", particularites: "Surveillance constante, pensée unique", lieux: ["Centre de Conformité", "Zone d'Habitation Modulaire", "Ministère de la Vérité", "Camp de Rééducation", "Marché Noir Clandestin"] },
        "utopique": { epoque: "Arcadie Prime, 3000", technologie: "Intégrée et écologique", particularites: "Société harmonieuse en apparence", lieux: ["Jardins Flottants", "Centre de Méditation Communautaire", "Bibliothèque Holistique", "Habitat Bio-Dôme", "Source d'Énergie Cristalline"] }
    };
    let finalType = detectedType;
    if (!caracteristiques[detectedType]) { console.warn(`creerUnivers: Type "${detectedType}" inconnu. Fallback "contemporain".`); finalType = "contemporain"; }
    const universData = caracteristiques[finalType];
    if (!universData) { console.error("creerUnivers: ERREUR - Données introuvables pour type final:", finalType); return { type: finalType, description: "Erreur génération univers.", lieux: ["Lieu Défaut"] }; }
    return { type: finalType, ...universData, description: `Un univers ${finalType} ${universData.epoque ? `vers ${universData.epoque}` : ''}. ${universData.particularites}. Tech: ${universData.technologie}.` };
}

function creerPersonnages(keywordsList, univers, randomSeed) { /* ... Votre code original complet ... */ }
function creerPersonnageDetaille(archetype, univers, keywordsList, randomSeed, nomsParUnivers, allTraits, allMotivations) { /* ... Votre code original complet ... */ }
function genererApparence(typeUnivers, archetype, seed) { /* ... Votre code original complet ... */ }
function genererTraitDistinctif(typeUnivers, archetype, seed) { /* ... Votre code original complet ... */ }
function creerStructureNarrative(keywordsList, univers, personnages, randomSeed) { /* ... Votre code original complet ... */ }
function genererChapitresDetailles(structureNarrative, univers, personnages, randomSeed) { /* ... Votre code original complet ... */ }
function genererPage(numeroGlobal, numeroChapitre, numeroLocal, univers, personnages, etapeChapitre, randomSeed) { /* ... Votre code original complet ... */ }
function genererCase(numeroPage, numeroCase, univers, personnagesPresents, etapeChapitre, randomSeed) { /* ... Votre code original complet ... */ }
function genererLigneDialogue(personnage, etape, seed) { /* ... Votre code original complet ... */ }
function genererNarration(univers, lieu, personnages, etape, dialogue, seed) { /* ... Votre code original complet ... */ }
function genererDescriptionVisuelle(typePlan, lieu, personnages, etape, dialogue, narration, seed) { /* ... Votre code original complet ... */ }

console.log("--- scenario_detaille.js : FIN ANALYSE ---");