// Demo mode: builds a sample script from fixed templates, without calling any AI.
// The server uses it when no API key is configured or when the AI service fails,
// so the public site always shows a working example at no cost.

const TEXT = {
  English: {
    hook: t => `Today's topic: ${t}. Stay until the end.`,
    setup: () => 'Most people scroll past this, but it takes less than a minute and you will remember it.',
    content: (t, n) => `[In the live version, Claude writes the main content about "${t}" here, timed to ${n} seconds.]`,
    cta: () => 'Follow for part two, and tell me in the comments what you already knew.',
    caption: t => `${t} 👀 #learnontiktok #didyouknow #fyp`,
    tips: ['Say the hook in the first second, before any intro.', 'Put text on screen for the key fact so it works without sound.', 'End on a question to push comments.'],
    reason: 'A curiosity gap in the first line, a quick payoff and a question at the end are the usual pattern for short videos that keep people watching.',
  },
  Spanish: {
    hook: t => `Tema de hoy: ${t}. Quédate hasta el final.`,
    setup: () => 'Casi todos pasan de largo, pero esto toma menos de un minuto y lo vas a recordar.',
    content: (t, n) => `[En la versión con IA, aquí Claude escribe el contenido principal sobre "${t}", ajustado a ${n} segundos.]`,
    cta: () => 'Sígueme para la segunda parte y dime en los comentarios qué ya sabías.',
    caption: t => `${t} 👀 #aprendeentiktok #sabiasque #parati`,
    tips: ['Di el gancho en el primer segundo, sin presentación.', 'Pon el dato clave en texto en pantalla para que funcione sin sonido.', 'Cierra con una pregunta para generar comentarios.'],
    reason: 'Una intriga en la primera frase, una respuesta rápida y una pregunta al final es el patrón habitual de los videos cortos que retienen.',
  },
  Portuguese: {
    hook: t => `Tema de hoje: ${t}. Fica até o final.`,
    setup: () => 'Quase todo mundo passa reto, mas isso leva menos de um minuto e você vai lembrar.',
    content: (t, n) => `[Na versão com IA, aqui o Claude escreve o conteúdo principal sobre "${t}", ajustado a ${n} segundos.]`,
    cta: () => 'Me segue para a parte dois e conta nos comentários o que você já sabia.',
    caption: t => `${t} 👀 #aprendanotiktok #vocesabia #fyp`,
    tips: ['Fale o gancho no primeiro segundo, sem introdução.', 'Coloque o dado principal em texto na tela para funcionar sem som.', 'Termine com uma pergunta para gerar comentários.'],
    reason: 'Uma curiosidade na primeira frase, uma resposta rápida e uma pergunta no final é o padrão comum dos vídeos curtos que prendem a atenção.',
  },
  French: {
    hook: t => `Sujet du jour : ${t}. Reste jusqu'à la fin.`,
    setup: () => "La plupart des gens passent sans regarder, mais ça prend moins d'une minute et tu t'en souviendras.",
    content: (t, n) => `[Dans la version avec IA, Claude écrit ici le contenu principal sur « ${t} », calé sur ${n} secondes.]`,
    cta: () => 'Abonne-toi pour la partie deux et dis-moi en commentaire ce que tu savais déjà.',
    caption: t => `${t} 👀 #apprendresurtiktok #lesaviezvous #pourtoi`,
    tips: ["Dis l'accroche dès la première seconde, sans introduction.", "Affiche le fait clé en texte à l'écran pour que la vidéo marche sans le son.", 'Termine par une question pour lancer les commentaires.'],
    reason: "Une curiosité dès la première phrase, une réponse rapide et une question à la fin : c'est le schéma habituel des vidéos courtes qui retiennent.",
  },
}

export function buildDemoScript({ topic, duration, language }) {
  const L = TEXT[language] || TEXT.English
  const t = topic.trim().replace(/[.!?…]+$/, '')
  const contentSeconds = Math.max(5, parseInt(duration, 10) - 15)

  const sections = [
    { label: 'HOOK', text: L.hook(t), seconds: 3 },
    { label: 'SETUP', text: L.setup(t), seconds: 8 },
    { label: 'CONTENT', text: L.content(t, contentSeconds), seconds: contentSeconds },
    { label: 'CTA', text: L.cta(t), seconds: 4 },
  ]

  return {
    demo: true,
    hook: sections[0].text,
    sections,
    fullScript: sections.map(s => s.text).join('\n\n'),
    caption: L.caption(t),
    tips: L.tips,
    estimatedViralScore: null,
    viralReason: L.reason,
  }
}
