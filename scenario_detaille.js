/**
 * Fonction pour générer un scénario détaillé comme le ferait une IA spécialisée
 * S'assure que la fonction est bien attachée à l'objet window.
 */
console.log("--- scenario_detaille.js : DÉBUT ANALYSE ---"); // LOG AJOUTÉ

console.log("--- scenario_detaille.js : JUSTE AVANT définition window.generateScenarioDetaille ---"); // LOG AJOUTÉ
window.generateScenarioDetaille = async function(keywords) {
    try {
        console.log("generateScenarioDetaille (Original): Démarrage pour : " + keywords);

        const randomSeed = Date.now() + Math.floor(Math.random() * 1000000);
        const keywordsList = keywords.toLowerCase().split(/[ ,\n]+/).filter(k => k.trim().length > 0);

        let title = genererTitreCreatif(keywordsList, randomSeed);
        const univers = creerUnivers(keywordsList, randomSeed);
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

        console.log('>>> scenario_detaille.js: Prêt à retourner le scénario :', scenario); // LOG AJOUTÉ PRÉCÉDEMMENT
        // console.log("generateScenarioDetaille (Original): Scénario final généré:", scenario); // Optionnel
         await new Promise(resolve => setTimeout(resolve, 50)); // Simuler délai
        return scenario;

    } catch (error) {
        console.error('>>> scenario_detaille.js: ERREUR CAPTURÉE DANS generateScenarioDetaille :', error); // LOG AJOUTÉ PRÉCÉDEMMENT
        alert('ERREUR DANS generateScenarioDetaille - Vérifiez la console !'); // LOG AJOUTÉ PRÉCÉDEMMENT
        console.error("generateScenarioDetaille (Original): ERREUR lors de la génération:", error);
        // alert("Une erreur interne est survenue dans scenario_detaille.js. Vérifiez la console."); // Redondant
        return null;
    }
}
console.log("--- scenario_detaille.js : JUSTE APRÈS définition bloc fonction generateScenarioDetaille ---"); // LOG AJOUTÉ


// --- Fonctions auxiliaires (Copiez VOS fonctions originales ici) ---
// Assurez-vous que TOUTES vos fonctions auxiliaires (pseudoRandom, genererTitreCreatif, creerUnivers, etc.)
// sont présentes ici, exactement comme elles étaient dans votre fichier original.
// Je remets celles que j'avais dans mes réponses précédentes pour l'exemple.

function pseudoRandom(seed) { let x = Math.sin(seed) * 10000; return x - Math.floor(x); }

function genererTitreCreatif(keywordsList, randomSeed) { /* ... Votre code original ... */
    const titresCreatifs = ["Les Chroniques oubliées de [Mot-clé]", "L'Odyssée stellaire de [Mot-clé]", "Le Secret enfoui des [Mot-clé]", "Au-delà des terres de [Mot-clé]", "[Mot-clé] et la Prophétie Écarlate", "Les Gardiens du dernier [Mot-clé]", "L'Éveil sombre de [Mot-clé]", "La Prophétie des Anciens : [Mot-clé]", "Le Dernier Voyage vers [Mot-clé]", "L'Écho Silencieux des [Mot-clé]", "Sous le Ciel de [Mot-clé]", "[Mot-clé] : L'Héritage Perdu"];
    const modeleIndex = Math.floor(pseudoRandom(randomSeed) * titresCreatifs.length); let modele = titresCreatifs[modeleIndex];
    const keyword = keywordsList.length > 0 ? keywordsList[Math.floor(pseudoRandom(randomSeed + 1) * keywordsList.length)] : "Mystère";
    const keywordCapitalized = keyword.charAt(0).toUpperCase() + keyword.slice(1);
    return modele.replace("[Mot-clé]", keywordCapitalized);
 }

function creerUnivers(keywordsList, randomSeed) { /* ... Votre code original ... */
    const typesUnivers = ["médiéval-fantastique", "science-fiction", "post-apocalyptique", "contemporain", "steampunk", "cyberpunk", "mythologique", "historique", "dystopique", "utopique", "horreur cosmique", "western spaghetti", "polar noir", "space opera"];
    let detectedType = "contemporain";
    const typeKeywords = {"science-fiction": ["futur", "robot", "espace", "vaisseau", "alien", "cyborg", "planète", "laser"],"médiéval-fantastique": ["dragon", "magie", "elfe", "château", "chevalier", "épée", "sorcier", "quête"],"post-apocalyptique": ["apocalypse", "survie", "ruine", "mutant", "désert", "dévasté", "zone"],"steampunk": ["vapeur", "engrenage", "victorien", "dirigeable", "mécanique", "automate"],"cyberpunk": ["néon", "implant", "hacker", "corporation", "dystopie", "virtuel", "augmenté"],"horreur cosmique": ["cthulhu", "lovecraft", "indicible", "folie", "ancien", "abomination"]};
    for (const type in typeKeywords) { if (keywordsList.some(kw => typeKeywords[type].includes(kw))) { detectedType = type; break; } }
    if (detectedType === "contemporain" && keywordsList.length > 2) { detectedType = typesUnivers[Math.floor(pseudoRandom(randomSeed + 2) * typesUnivers.length)]; }
    const caracteristiques = { "médiéval-fantastique": { epoque: "Âge des légendes", technologie: "Limitée, magie omniprésente", particularites: "Créatures mythiques, royaumes en guerre", lieux: ["Forêt enchantée", "Citadelle Naine", "Tour de Sorcier", "Village Fortifié", "Ruines Elfiques"] }, /* ... Reste des caractéristiques ... */ };
    const universData = caracteristiques[detectedType] || caracteristiques["contemporain"];
    return { type: detectedType, ...universData, description: `Un univers ${detectedType} ${universData.epoque ? `se déroulant vers ${universData.epoque}` : ''}. Les particularités incluent : ${universData.particularites}. Technologie ${universData.technologie}.` };
}

function creerPersonnages(keywordsList, univers, randomSeed) { /* ... Votre code original ... */
    const archetypes = ["héros", "mentor", "allié", "antagoniste", "ombre", "gardien", "messager", "caméléon"];
    const traits = {"héros": ["courageux", "déterminé", "altruiste", "loyal", "impulsif", "naïf", "tourmenté par un choix"], /* ... Reste des traits ... */};
    const motivations = {"héros": ["sauver le monde", "protéger ses proches", "venger une injustice", "découvrir la vérité sur soi", "accomplir son destin"], /* ... Reste des motivations ... */};
    const nomsParUnivers = { /* ... Vos noms ... */ };
    const nombrePersonnages = Math.floor(pseudoRandom(randomSeed + 3) * 3) + 3;
    const personnages = []; const archetypesPossibles = [...archetypes];
    const heroArchetype = "héros"; const antagonistArchetype = "antagoniste";
    personnages.push(creerPersonnageDetaille(heroArchetype, univers, keywordsList, randomSeed + 4, nomsParUnivers, traits, motivations));
    archetypesPossibles.splice(archetypesPossibles.indexOf(heroArchetype), 1);
    personnages.push(creerPersonnageDetaille(antagonistArchetype, univers, keywordsList, randomSeed + 5, nomsParUnivers, traits, motivations));
    archetypesPossibles.splice(archetypesPossibles.indexOf(antagonistArchetype), 1);
    for (let i = 2; i < nombrePersonnages; i++) { if (archetypesPossibles.length === 0) break; const archetypeIndex = Math.floor(pseudoRandom(randomSeed + 6 + i) * archetypesPossibles.length); const selectedArchetype = archetypesPossibles.splice(archetypeIndex, 1)[0]; personnages.push(creerPersonnageDetaille(selectedArchetype, univers, keywordsList, randomSeed + 7 + i * 2, nomsParUnivers, traits, motivations)); }
    return personnages;
 }

function creerPersonnageDetaille(archetype, univers, keywordsList, randomSeed, nomsParUnivers, allTraits, allMotivations) { /* ... Votre code original ... */
    const nomsUnivers = nomsParUnivers[univers.type] || nomsParUnivers["contemporain"];
    const nom = Array.isArray(nomsUnivers) && nomsUnivers.length > 0 ? nomsUnivers[Math.floor(pseudoRandom(randomSeed) * nomsUnivers.length)] : `Perso_${archetype}`;
    const traitsArchetype = allTraits[archetype] || ["adaptable"];
    const nombreTraits = Math.floor(pseudoRandom(randomSeed + 1) * 2) + 2; const traitsSelectionnes = []; const traitsDisponibles = [...traitsArchetype];
    for (let i = 0; i < nombreTraits && traitsDisponibles.length > 0; i++) { const traitIndex = Math.floor(pseudoRandom(randomSeed + 2 + i) * traitsDisponibles.length); traitsSelectionnes.push(traitsDisponibles.splice(traitIndex, 1)[0]); }
    const motivationsArchetype = allMotivations[archetype] || ["survivre"]; const motivation = motivationsArchetype[Math.floor(pseudoRandom(randomSeed + 3) * motivationsArchetype.length)];
    const apparence = genererApparence(univers.type, archetype, randomSeed + 4); const traitDistinctif = genererTraitDistinctif(univers.type, archetype, randomSeed + 5);
    const description = `${nom} (${archetype}) : ${apparence}. ${traitsSelectionnes.join(', ')}. Trait distinctif : ${traitDistinctif}. Motivation principale : ${motivation}.`;
    return { nom, archetype, traits: traitsSelectionnes, motivation, description, apparence, traitDistinctif };
}

function genererApparence(typeUnivers, archetype, seed) { /* ... Votre code original ... */
    const apparencesBase = ["regard intense", "cicatrice discrète", "sourire énigmatique", "allure athlétique", "démarche assurée", "air pensif"];
    const apparencesParUnivers = { /* ... Vos apparences ... */ };
    const possibles = [...apparencesBase, ...(apparencesParUnivers[typeUnivers] || [])]; return possibles[Math.floor(pseudoRandom(seed) * possibles.length)];
}

function genererTraitDistinctif(typeUnivers, archetype, seed) { /* ... Votre code original ... */
     const traitsBase = ["boitille légèrement", "a un tic nerveux", "parle avec un accent particulier", "collectionne des objets étranges", "fredonne souvent"];
     const traitsParUnivers = { /* ... Vos traits ... */ };
     const possibles = [...traitsBase, ...(traitsParUnivers[typeUnivers] || [])]; return possibles[Math.floor(pseudoRandom(seed) * possibles.length)];
}

function creerStructureNarrative(keywordsList, univers, personnages, randomSeed) { /* ... Votre code original ... */
    const structures = ["voyage du héros", "quête initiatique", "enquête mystérieuse", "lutte contre l'oppression", "histoire de vengeance", "transformation personnelle", "rivalité destructrice", "amour interdit", "survie en milieu hostile", "récit de création/chute"];
    let detectedStructure = "quête initiatique"; if (keywordsList.includes("enquête") || keywordsList.includes("mystère") || keywordsList.includes("détective")) detectedStructure = "enquête mystérieuse"; if (keywordsList.includes("rébellion") || keywordsList.includes("tyran") || keywordsList.includes("liberté")) detectedStructure = "lutte contre l'oppression"; if (keywordsList.includes("vengeance") || keywordsList.includes("trahison")) detectedStructure = "histoire de vengeance"; if (keywordsList.includes("survie") || keywordsList.includes("désastre")) detectedStructure = "survie en milieu hostile"; if (detectedStructure === "quête initiatique" && pseudoRandom(randomSeed + 9) > 0.3) { detectedStructure = structures[Math.floor(pseudoRandom(randomSeed + 10) * structures.length)]; }
    const nombreChapitres = 4;
    const pointsCleParStructure = { /* ... Vos points clés ... */ };
    const etapes = pointsCleParStructure[detectedStructure] || pointsCleParStructure["quête initiatique"]; const etapesParChapitre = Math.ceil(etapes.length / nombreChapitres); const etapesDistribuees = [];
    for(let i=0; i<nombreChapitres; i++){ const debut = i * etapesParChapitre; const fin = Math.min(debut + etapesParChapitre, etapes.length); if (fin > debut) { etapesDistribuees.push(etapes.slice(debut, fin).join(' / ')); } else if (i === nombreChapitres -1 && etapes.length > debut) { etapesDistribuees.push(etapes.slice(debut).join(' / ')); } else { etapesDistribuees.push("Transition"); } }
    return { type: detectedStructure, nombreChapitres: nombreChapitres, etapesParChapitre: etapesDistribuees, description: `Une histoire de type "${detectedStructure}" en ${nombreChapitres} chapitres.` };
 }

function genererChapitresDetailles(structureNarrative, univers, personnages, randomSeed) { /* ... Votre code original ... */
    const chapitres = []; const nombreChapitres = structureNarrative.nombreChapitres; const etapesChapitres = structureNarrative.etapesParChapitre; const pagesParChapitre = 12; let numeroPageGlobal = 1;
    for (let i = 0; i < nombreChapitres; i++) {
        const etapeCourante = etapesChapitres[i] || `Chapitre ${i+1}`; let titreChapitre = etapeCourante.length > 40 ? `Chapitre ${i+1}` : etapeCourante;
        const pages = []; for (let j = 0; j < pagesParChapitre; j++) { pages.push(genererPage(numeroPageGlobal, i + 1, j + 1, univers, personnages, etapeCourante, randomSeed + numeroPageGlobal)); numeroPageGlobal++; }
        chapitres.push({ numero: i + 1, titre: `Chapitre ${i+1}: ${titreChapitre}`, etape: etapeCourante, pages: pages, resume: `Ce chapitre se concentre sur "${etapeCourante}", faisant progresser l'intrigue.` });
    } return chapitres;
 }

function genererPage(numeroGlobal, numeroChapitre, numeroLocal, univers, personnages, etapeChapitre, randomSeed) { /* ... Votre code original ... */
    const baseCases = 4; const variation = Math.floor(pseudoRandom(randomSeed) * 5) - 2; const nombreCases = Math.max(3, Math.min(7, baseCases + variation)); const cases = [];
    for (let k = 0; k < nombreCases; k++) {
         let personnagesPresents = []; const probaHero = 0.6; const probaAntago = 0.3; const maxPersoCase = 3; const nbPersoCase = Math.floor(pseudoRandom(randomSeed + k + 1) * maxPersoCase) + 1;
         const hero = personnages.find(p => p.archetype === 'héros'); if (hero && pseudoRandom(randomSeed + k + 2) < probaHero) { personnagesPresents.push(hero); }
         const antago = personnages.find(p => p.archetype === 'antagoniste'); if (antago && !personnagesPresents.includes(antago) && personnagesPresents.length < nbPersoCase && pseudoRandom(randomSeed + k + 3) < probaAntago) { personnagesPresents.push(antago); }
         const persosRestants = personnages.filter(p => !personnagesPresents.includes(p)); while(personnagesPresents.length < nbPersoCase && persosRestants.length > 0) { const index = Math.floor(pseudoRandom(randomSeed + k + 4 + personnagesPresents.length) * persosRestants.length); personnagesPresents.push(persosRestants.splice(index, 1)[0]); }
         if (personnagesPresents.length === 0 && personnages.length > 0) { personnagesPresents.push(personnages[0]); }
         cases.push(genererCase(numeroGlobal, k + 1, univers, personnagesPresents, etapeChapitre, randomSeed + k * 10));
    } return { numeroGlobal: numeroGlobal, numeroChapitre: numeroChapitre, numeroLocal: numeroLocal, cases: cases, description: `Page ${numeroGlobal} (Chap. ${numeroChapitre}, Pg. ${numeroLocal}). Focus: "${etapeChapitre}".` };
}

function genererCase(numeroPage, numeroCase, univers, personnagesPresents, etapeChapitre, randomSeed) { /* ... Votre code original ... */
    const typesPlans = ["plan large", "plan moyen", "gros plan", "plan d'ensemble", "plongée", "contre-plongée", "plan américain", "très gros plan (insert)", "plan épaule", "plan subjectif"]; const typePlan = typesPlans[Math.floor(pseudoRandom(randomSeed) * typesPlans.length)];
    const lieu = univers.lieux && univers.lieux.length > 0 ? univers.lieux[Math.floor(pseudoRandom(randomSeed + 1) * univers.lieux.length)] : "Lieu Indéfini"; let dialogue = null;
    if (personnagesPresents.length > 0 && pseudoRandom(randomSeed + 3) > 0.45) { const persoQuiParle = personnagesPresents[Math.floor(pseudoRandom(randomSeed + 4) * personnagesPresents.length)]; dialogue = { personnage: persoQuiParle.nom, texte: genererLigneDialogue(persoQuiParle, etapeChapitre, randomSeed + 5) }; }
    const narration = pseudoRandom(randomSeed + 6) > 0.7 ? genererNarration(univers, lieu, personnagesPresents, etapeChapitre, dialogue, randomSeed + 6) : null;
    const descriptionVisuelle = genererDescriptionVisuelle(typePlan, lieu, personnagesPresents, etapeChapitre, dialogue, narration, randomSeed + 7);
    return { numeroPage: numeroPage, numeroCase: numeroCase, typePlan: typePlan, lieu: lieu, personnagesPresents: personnagesPresents.map(p => p.nom), dialogue: dialogue, narration: narration, descriptionVisuelle: descriptionVisuelle };
 }

function genererLigneDialogue(personnage, etape, seed) { /* ... Votre code original ... */
    const baseDialogues = ["Qu'est-ce que c'était que ça ?", "Nous devons partir. Maintenant.", "Je n'aime pas ça...", "Regardez !", "Attendez... Il y a quelque chose ici.", "Est-ce que tout va bien ?", "Je ne peux pas continuer comme ça.", "C'est notre seule chance.", "Faites attention !", "Plus vite !", "Où sommes-nous ?", "Je crois que j'ai compris.", "Impossible...", "Suivez-moi !", "Silence !"];
    const dialoguesParArchetype = { /* Vos dialogues */ }; const dialoguesParEtape = { /* Vos dialogues */ };
    let sourceDialogues = baseDialogues; if (pseudoRandom(seed) < 0.6) { sourceDialogues = [...baseDialogues, ...(dialoguesParArchetype[personnage.archetype] || [])]; }
    const etapeSimple = etape.split(' / ')[0]; if (dialoguesParEtape[etapeSimple] && pseudoRandom(seed + 0.5) < 0.4) { sourceDialogues = [...sourceDialogues, ...dialoguesParEtape[etapeSimple]]; }
    return sourceDialogues.length > 0 ? sourceDialogues[Math.floor(pseudoRandom(seed + 1) * sourceDialogues.length)] : "..."; // Ajouter fallback
}

function genererNarration(univers, lieu, personnages, etape, dialogue, seed) { /* ... Votre code original ... */
    const baseNarrations = ["Le silence était lourd.", "Une tension palpable.", "Le temps suspendu.", `L'atmosphère de ${lieu.toLowerCase()}.`, "Soudain...", "Pendant ce temps...", "Au loin...", "Les ombres dansaient.", "Urgence.", "Non-dits.", "L'air vibrait."];
    let possibles = [...baseNarrations]; if(personnages.length === 1) possibles.push(`${personnages[0].nom} était seul(e) avec ses pensées.`); if(etape.includes("Obstacle") || etape.includes("Confrontation")) possibles.push("Le danger rôdait."); if(dialogue === null) possibles.push("Aucun mot n'était nécessaire."); if(univers.type === "horreur cosmique") possibles.push("Une présence indicible se fit sentir."); if(univers.type === "polar noir") possibles.push("La pluie battait contre la fenêtre.");
    return possibles.length > 0 ? possibles[Math.floor(pseudoRandom(seed) * possibles.length)] : null; // Peut retourner null
}

function genererDescriptionVisuelle(typePlan, lieu, personnages, etape, dialogue, narration, seed) { /* ... Votre code original ... */
    let desc = `${typePlan.charAt(0).toUpperCase() + typePlan.slice(1)} dans ${lieu}. `;
    if (personnages.length > 0) { const noms = personnages.map(p => p.nom).join(', '); desc += `${noms}. `; const actions = [`regarde ${pseudoRandom(seed) > 0.5 ? 'intensément' : 'vaguement'} ${pseudoRandom(seed+1) > 0.5 ? 'devant lui/elle' : 'vers quelque chose hors champ'}`, `a une expression ${['inquiète', 'déterminée', 'surprise', 'fatiguée', 'méfiante'][Math.floor(pseudoRandom(seed+2)*5)]}`, `examine ${['un objet au sol', 'une carte holographique', 'ses mains tremblantes', 'le mécanisme complexe'][Math.floor(pseudoRandom(seed+3)*4)]}`, `se tient ${['prêt(e) à bondir', 'immobile, à l'écoute', 'légèrement en retrait', 'au centre de l'attention'][Math.floor(pseudoRandom(seed+4)*4)]}`, `semble ${['parler animement (si dialogue)', 'murmurer pour lui/elle-même', 'réfléchir profondément', 'ignorer les autres'][Math.floor(pseudoRandom(seed+5)*4)]}${dialogue ? '' : ' (sans dialogue)'}.`]; desc += `${personnages[0].nom} ${actions[Math.floor(pseudoRandom(seed+6) * actions.length)]}. `; if (personnages.length > 1) { desc += `${personnages[1].nom} ${['observe la scène', 'réagit discrètement', 'semble en désaccord', 'attend des instructions'][Math.floor(pseudoRandom(seed+7)*4)]}. `; } }
    else { desc += `Le lieu est vide, soulignant ${['sa désolation', 'son immensité', 'un détail important', 'le calme avant la tempête'][Math.floor(pseudoRandom(seed+8)*4)]}. `; }
    const ambiances = ["Lumière crépusculaire filtrant par une fenêtre.", "Ombres portées créant une atmosphère oppressante.", "Brume épaisse réduisant la visibilité.", "Éclairage néon vibrant et froid.", "Poussière flottant dans un rayon de soleil."]; desc += ambiances[Math.floor(pseudoRandom(seed + 9) * ambiances.length)];
    return desc;
 }


console.log("--- scenario_detaille.js : FIN ANALYSE ---"); // LOG AJOUTÉ
