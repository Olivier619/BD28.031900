/**
 * Fonction pour générer un scénario détaillé (simulation).
 * Assignée à window.generateScenarioDetaille.
 */
console.log("--- scenario_detaille.js : DÉBUT ANALYSE ---");

window.generateScenarioDetaille = async function(keywords) {
    try {
        console.log("generateScenarioDetaille: Démarrage pour : " + keywords);
        const randomSeed = Date.now() + Math.floor(Math.random() * 1000000);
        const keywordsList = keywords.toLowerCase().split(/[ ,\n]+/).filter(k => k.trim().length > 0);

        let title = genererTitreCreatif(keywordsList, randomSeed);
        const univers = creerUnivers(keywordsList, randomSeed);
        const personnages = creerPersonnages(keywordsList, univers, randomSeed);
        const structureNarrative = creerStructureNarrative(keywordsList, univers, personnages, randomSeed);
        const chapitres = genererChapitresDetailles(structureNarrative, univers, personnages, randomSeed);

        const scenario = { title, theme: keywords, univers, personnages, structureNarrative, chapters: chapitres, generatedAt: new Date().toISOString() };

        console.log("generateScenarioDetaille: Scénario final généré avec succès.");
        await new Promise(resolve => setTimeout(resolve, 50)); // Simuler délai
        return scenario;

    } catch (error) {
        console.error("generateScenarioDetaille: ERREUR lors de la génération:", error);
        return null; // Renvoyer null pour indiquer l'échec
    }
}
console.log("--- scenario_detaille.js : Fonction window.generateScenarioDetaille DÉFINIE ---");

// --- Fonctions auxiliaires ---
function pseudoRandom(seed) { let x = Math.sin(seed) * 10000; return x - Math.floor(x); }
function genererTitreCreatif(keywordsList, randomSeed) { const titres = ["Les Chroniques de [Mot-clé]", "L'Odyssée [Mot-clé]", "Le Secret des [Mot-clé]", "[Mot-clé]: La Légende", "L'Éveil de [Mot-clé]"]; const modele = titres[Math.floor(pseudoRandom(randomSeed) * titres.length)]; const keyword = keywordsList[0] || "Aventure"; return modele.replace("[Mot-clé]", keyword.charAt(0).toUpperCase() + keyword.slice(1)); }
function creerUnivers(keywordsList, randomSeed) { const typesUnivers = ["médiéval-fantastique", "science-fiction", "post-apocalyptique", "contemporain", "cyberpunk", "steampunk"]; let type = typesUnivers[Math.floor(pseudoRandom(randomSeed+1)*typesUnivers.length)]; const caracteristiques = { "médiéval-fantastique": {epoque:"Moyen-Âge", technologie:"Magie", particularites:"Quêtes", lieux:["Forêt","Château"]}, "science-fiction": {epoque:"23ème Siècle", technologie:"Vaisseaux", particularites:"Exploration", lieux:["Station","Planète X"]}, "post-apocalyptique": {epoque:"Après Chute", technologie:"Bricolage", particularites:"Survie", lieux:["Ruines","Abri"]}, "contemporain": {epoque:"Aujourd'hui", technologie:"Actuelle", particularites:"Intrigues", lieux:["Ville","Café"]}, "cyberpunk": {epoque:"2077", technologie:"Implants", particularites:"Corpos", lieux:["Néo-Kyoto","Bas-fonds"]}, "steampunk": {epoque:"1888", technologie:"Vapeur", particularites:"Inventions", lieux:["Londres","Dirigeable"]} }; if(!caracteristiques[type]) type="contemporain"; const data = caracteristiques[type]; return { type, ...data, description: `Univers ${type}.`}; }
function creerPersonnages(keywordsList, univers, randomSeed) { const archetypes = ["héros", "mentor", "allié", "antagoniste"]; const pers = []; for(let i=0; i<4; i++) pers.push(creerPersonnageDetaille(archetypes[i%archetypes.length], univers, keywordsList, randomSeed+i*10)); return pers;}
function creerPersonnageDetaille(archetype, univers, keywordsList, randomSeed, nomsParUnivers={}, allTraits={}, allMotivations={}) { const nom = `${archetype.charAt(0).toUpperCase()+archetype.slice(1)} ${Math.floor(pseudoRandom(randomSeed)*100)}`; const apparence = "Apparence générée"; const trait = "Trait généré"; const motiv = "Motivation générée"; return { nom, archetype, apparence, traitDistinctif: trait, motivation: motiv, description: `${nom} (${archetype}). ${apparence}. Trait: ${trait}. Motivation: ${motiv}.`}; }
function creerStructureNarrative(keywordsList, univers, personnages, randomSeed) { const types = ["Voyage du Héros", "Quête", "Enquête"]; const type = types[Math.floor(pseudoRandom(randomSeed+10)*types.length)]; return {type, nombreChapitres: 4, etapesParChapitre:["Intro","Développement","Crise","Climax/Résolution"], description:`Structure: ${type}`}; }
function genererChapitresDetailles(structureNarrative, univers, personnages, randomSeed) { const chapitres = []; const nbChap = structureNarrative.nombreChapitres || 4; const etapes = structureNarrative.etapesParChapitre || ["Etape inconnue"]; let pg=1; for(let i=0; i<nbChap; i++){ const pages = []; for(let j=0; j<12; j++){ pages.push(genererPage(pg, i+1, j+1, univers, personnages, etapes[i%etapes.length], randomSeed+pg)); pg++; } chapitres.push({numero:i+1, titre:`Chap ${i+1}: ${etapes[i%etapes.length]}`, etape:etapes[i%etapes.length], pages, resume:`Résumé chap ${i+1}`}); } return chapitres; }
function genererPage(numGlob, numChap, numLoc, univers, personnages, etape, seed) { const nbCases=Math.floor(pseudoRandom(seed)*4)+3; const cases=[]; for(let k=0; k<nbCases; k++) cases.push(genererCase(numGlob, k+1, univers, personnages.slice(0,2), etape, seed+k)); return {numeroGlobal:numGlob, numeroChapitre:numChap, numeroLocal:numLoc, cases, description:`Desc Page ${numGlob}`}; }
function genererCase(numPg, numCase, univers, persosPresents, etape, seed) { const plans=["large","moyen","gros"]; const plan=plans[Math.floor(pseudoRandom(seed)*plans.length)]; const lieu=univers?.lieux?.length ? univers.lieux[Math.floor(pseudoRandom(seed+1)*univers.lieux.length)] : "Lieu?"; const dialogue= pseudoRandom(seed+2)>0.5&&persosPresents?.length ? {personnage: persosPresents[0]?.nom||"?", texte:genererLigneDialogue(persosPresents[0], etape, seed+5)} : null; const narration= pseudoRandom(seed+3)>0.7 ? genererNarration(univers, lieu, persosPresents, etape, dialogue, seed+6) : null; const desc=genererDescriptionVisuelle(plan, lieu, persosPresents, etape, dialogue, narration, seed+7); return {numeroPage:numPg, numeroCase, typePlan:plan, lieu, personnagesPresents: persosPresents.map(p=>p?.nom||"?"), dialogue, narration, descriptionVisuelle: desc}; }
function genererLigneDialogue(personnage, etape, seed) {
    const baseDialogues = ["Qu'est-ce que c'était que ça ?", "Nous devons partir. Maintenant.", "Je n'aime pas ça...", "Regardez !", "Attendez... Il y a quelque chose ici.", "Est-ce que tout va bien ?", "Je ne peux pas continuer comme ça.", "C'est notre seule chance.", "Faites attention !", "Plus vite !", "Où sommes-nous ?", "Je crois que j'ai compris.", "Impossible...", "Suivez-moi !", "Silence !"];
    const dialoguesParArchetype = {"héros": ["Je ne laisserai personne derrière !", "Pour la justice !", "Je peux le faire.", "Quel est le plan ?", "Nous devons essayer !"],"mentor": ["La patience est une vertu.", "Souviens-toi de ton entraînement.", "Le destin t'attend.", "Observe et apprends.", "Ne sous-estime jamais ton adversaire."],"allié": ["Compte sur moi !", "J'ai un mauvais pressentiment...", "On se couvre, ok ?", "C'était moins une !", "Je m'en occupe."],"antagoniste": ["Pathétique.", "Vous ne pouvez pas m'arrêter !", "Le pouvoir sera mien !", "Comme c'est prévisible.", "Agenouillez-vous !"],"ombre": ["Tout a un prix...", "Peut-être... peut-être pas.", "Laissez-moi tranquille.", "Ça ne vous regarde pas.", "Les choses ne sont pas si simples."],"gardien": ["Halte ! Qui va là ?", "Vous ne passerez pas !", "Seuls les dignes...", "Respectez ce lieu.", "Le savoir a un prix."],"messager": ["J'ai un message pour vous.", "Écoutez attentivement.", "Le temps presse.", "Les choses ont changé.", "On m'envoie vous prévenir."],"caméléon": ["Intéressant...", "Comment puis-je vous aider... pour l'instant ?", "Cela pourrait être profitable.", "Je connais quelqu'un...", "Adaptons-nous."]};
    const dialoguesParEtape = {"Monde Ordinaire": ["Encore une journée ordinaire...", "J'aimerais qu'il se passe quelque chose."],"Appel & Refus": ["Moi ? Pourquoi moi ?", "C'est impossible, je ne peux pas."],"Mentor & Seuil": ["Vous devez accepter votre destin.", "Le premier pas est le plus difficile."],"Épreuves & Alliés": ["Nous devons travailler ensemble !", "Fais attention, c'est un piège !"],"Ordalie": ["C'est maintenant ou jamais !", "Je ne peux pas perdre..."],"Retour & Résurrection": ["Je suis de retour.", "Les choses ont changé ici."],"Le Crime/Mystère": ["Qui aurait pu faire ça ?", "Il y a quelque chose qui cloche."],"Fausses Pistes": ["Je croyais qu'on le tenait...", "Retour à la case départ."],"Révélation Choc": ["Alors c'était vous depuis le début !", "Je n'arrive pas à y croire..."],"Vie sous l'Oppression": ["Baissez la tête et ne faites pas de vagues.", "Un jour, ça changera."],"Rejoindre la Résistance": ["Je veux me battre.", "Que puis-je faire ?"],"Bataille Décisive": ["Pour la liberté !", "C'est notre dernière chance !"]};
    let sourceDialogues = baseDialogues; if (personnage && pseudoRandom(seed) < 0.6) { sourceDialogues = [...baseDialogues, ...(dialoguesParArchetype[personnage.archetype] || [])]; }
    const etapeSimple = typeof etape === 'string' ? etape.split(' / ')[0] : '';
    if (dialoguesParEtape[etapeSimple] && pseudoRandom(seed + 0.5) < 0.4) { sourceDialogues = [...sourceDialogues, ...dialoguesParEtape[etapeSimple]]; }
    return sourceDialogues.length > 0 ? sourceDialogues[Math.floor(pseudoRandom(seed + 1) * sourceDialogues.length)] : "...";
}

function genererNarration(univers, lieu, personnages, etape, dialogue, seed) {
    const baseNarrations = ["Le silence était lourd.", "Une tension palpable.", "Le temps suspendu.", `L'atmosphère de ${lieu?.toLowerCase() || 'ce lieu'}.`, "Soudain...", "Pendant ce temps...", "Au loin...", "Les ombres dansaient.", "Urgence.", "Non-dits.", "L'air vibrait."];
    let possibles = [...baseNarrations];
    if (Array.isArray(personnages)) {
       if(personnages.length === 1 && personnages[0]) possibles.push(`${personnages[0].nom} était seul(e) avec ses pensées.`);
       if(typeof etape === 'string' && (etape.includes("Obstacle") || etape.includes("Confrontation"))) possibles.push("Le danger rôdait.");
       if(dialogue === null) possibles.push("Aucun mot n'était nécessaire.");
    }
    if(univers?.type === "horreur cosmique") possibles.push("Une présence indicible se fit sentir.");
    if(univers?.type === "polar noir") possibles.push("La pluie battait contre la fenêtre.");
    return possibles.length > 0 ? possibles[Math.floor(pseudoRandom(seed) * possibles.length)] : null;
}

function genererDescriptionVisuelle(typePlan, lieu, personnages, etape, dialogue, narration, seed) {
    let desc = `${(typePlan || "Plan moyen").charAt(0).toUpperCase() + (typePlan || "plan moyen").slice(1)} dans ${lieu || "Lieu indéfini"}. `;
    if (Array.isArray(personnages) && personnages.length > 0) {
        const noms = personnages.map(p => p?.nom || "?").join(', ');
        desc += `${noms}. `;
        const actions = [`regarde ${pseudoRandom(seed) > 0.5 ? 'intensément' : 'vaguement'} ${pseudoRandom(seed+1) > 0.5 ? 'devant lui/elle' : 'vers quelque chose hors champ'}`, `a une expression ${['inquiète', 'déterminée', 'surprise', 'fatiguée', 'méfiante'][Math.floor(pseudoRandom(seed+2)*5)]}`, `examine ${['un objet au sol', 'une carte holographique', 'ses mains tremblantes', 'le mécanisme complexe'][Math.floor(pseudoRandom(seed+3)*4)]}`, `se tient ${['prêt(e) à bondir', 'immobile, à l'écoute', 'légèrement en retrait', 'au centre de l'attention'][Math.floor(pseudoRandom(seed+4)*4)]}`, `semble ${['parler animement (si dialogue)', 'murmurer pour lui/elle-même', 'réfléchir profondément', 'ignorer les autres'][Math.floor(pseudoRandom(seed+5)*4)]}${dialogue ? '' : ' (sans dialogue)'}.`];
        desc += `${personnages[0]?.nom || '?'} ${actions[Math.floor(pseudoRandom(seed+6) * actions.length)]}. `;
        if (personnages.length > 1) {
             desc += `${personnages[1]?.nom || '?'} ${['observe la scène', 'réagit discrètement', 'semble en désaccord', 'attend des instructions'][Math.floor(pseudoRandom(seed+7)*4)]}. `;
        }
    }
    else { desc += `Le lieu est vide, soulignant ${['sa désolation', 'son immensité', 'un détail important', 'le calme avant la tempête'][Math.floor(pseudoRandom(seed+8)*4)]}. `; }
    const ambiances = ["Lumière crépusculaire.", "Ombres portées.", "Brume épaisse.", "Éclairage néon.", "Poussière en suspension."];
    desc += ambiances[Math.floor(pseudoRandom(seed + 9) * ambiances.length)];
    return desc;
 }
