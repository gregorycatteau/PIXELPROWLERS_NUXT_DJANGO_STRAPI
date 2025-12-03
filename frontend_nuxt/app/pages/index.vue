<template>
  <div class="PageContainer">
    <HomeHeroSection
      :journeys="journeys"
      :selected-journey-id="selectedJourneyId"
      :selected-journey="selectedJourney"
      @select-journey="handleSelectJourney"
    />

    <HomeRecognitionSection
      :situations="situations"
      :selected-journey-id="selectedJourneyId"
      :selected-journey="selectedJourney"
      @select-journey="handleSelectJourney"
      @scroll-to-hero="scrollToHero"
    />

    <HomeAxesSection :axes="axes" />

    <HomeTimelineSection :steps="steps" />

    <HomeFitSection :fit-list="fitList" />

    <HomeManifestoSection />

    <HomeContactSection />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import HomeAxesSection from '~/components/home/AxesSection.vue';
import HomeContactSection from '~/components/home/ContactSection.vue';
import HomeFitSection from '~/components/home/FitSection.vue';
import HomeHeroSection from '~/components/home/HeroSection.vue';
import HomeManifestoSection from '~/components/home/ManifestoSection.vue';
import HomeRecognitionSection from '~/components/home/RecognitionSection.vue';
import HomeTimelineSection from '~/components/home/TimelineSection.vue';
import { useHead } from '#imports';


/**
 * Parcours d’entrée proposés sur la landing :
 * 1) idée ou projet qui ne prend pas,
 * 2) structure qui dysfonctionne,
 * 3) outils numériques épuisants,
 * 4) malaise dans le job,
 * 5) sensation diffuse que « quelque chose coince ».
 */
const journeys = [
  {
    id: 'idee-isolee',
    label: "J’ai une super idée mais personne ne la partage",
    tagline:
      "Tu sens qu’il y a quelque chose de juste dans ce que tu portes, mais tu n’arrives pas à l’expliquer, ni à embarquer les bonnes personnes.",
    heroHighlight: "Tu as une idée qui te semble évidente, mais autour de toi ça décroche, ça doute ou ça ne suit pas.",
    step2Description:
      "Tu as une intuition forte, un projet, un format d’activité… mais dès que tu en parles, tu sens un flou.\nOn te dit « c’est intéressant », sans jamais savoir quoi en faire. Tu ne sais plus si c’est toi, ton idée, ou la façon dont tu la présentes.\nIci, on va surtout t’aider à la clarifier, à la mettre en forme, et à vérifier si elle trouve sa place dans le réel."
  },
  {
    id: 'structure-dysfonction',
    label: "Ma structure fonctionne mal",
    tagline:
      "Réunions lourdes, décisions qui tournent en rond, tensions qui s’installent… tu as besoin d’y voir clair et de recadrer sans casser ce qui tient encore.",
    heroHighlight: "Tu passes ton temps à éteindre des feux, les réunions s’allongent et personne ne sait vraiment où on va.",
    step2Description:
      "Ton asso, collectif, SCIC ou tiers-lieu tourne… mais dans la douleur.\nRéunions qui s’enchaînent, décisions floues, tensions larvées, outils mal utilisés, et la sensation d’être toujours en mode réaction.\nIci, on va prendre le temps de comprendre où ça coince, poser les rôles, les flux, et tester quelques ajustements concrets, à petite échelle."
  },
  {
    id: 'outils-fatigants',
    label: "Mes outils informatiques me fatiguent",
    tagline:
      "Site, mails, formulaires, tableaux, messageries… tu passes plus de temps à gérer les outils qu’à faire ton vrai boulot, et tu veux simplifier sans tout jeter.",
    heroHighlight: "Tu as accumulé des outils « parce qu’il fallait bien », et maintenant c’est toi qui travailles pour eux.",
    step2Description:
      "Tu jongles entre mails, drives, tableurs, formulaires, messageries, outils « gratuits » et comptes partagés à rallonge.\nChaque nouvelle tâche te demande trois plateformes, quatre mots de passe et une bonne dose de patience.\nIci, on va regarder ton environnement numérique comme un tout, garder ce qui sert vraiment ton terrain, simplifier le reste, et documenter pour que ça ne repose pas que sur toi."
  },
  {
    id: 'plus-en-phase-job',
    label: "Je ne me retrouve plus dans mon job",
    tagline:
      "Ton métier, ton poste ou ton rôle ont changé (ou toi tu as changé) et tu as besoin de clarifier où tu en es, ce que tu veux garder et ce que tu veux faire évoluer.",
    heroHighlight: "Tu fais ton boulot, mais tu as l’impression d’avoir glissé loin de ce qui te faisait vibrer au départ.",
    step2Description:
      "Tu as une vraie expérience, des compétences solides, mais ton quotidien ne ressemble plus à ce que tu avais en tête.\nTu passes plus de temps à gérer des contraintes qu’à faire ce pour quoi tu es doué·e, et tu sens monter une lassitude qui te fait peur.\nIci, on ne te dira pas de tout plaquer : on va cartographier ce que tu sais faire, ce que tu veux garder, ce que tu veux arrêter, et voir comment ton projet numérique peut t’aider à réaligner tout ça."
  },
  {
    id: 'je-sais-pas-mais',
    label: "Je ne sais pas, mais je sens que ça coince",
    tagline:
      "Tu avances par réflexes, avec une fatigue de fond. Tu ne mets pas encore les mots dessus, mais tu sais que tu ne peux pas continuer comme ça indéfiniment.",
    heroHighlight: "Tu ne sais pas mettre des mots dessus, mais tu sens un frottement permanent : quelque chose cloche, sans que tu arrives à le pointer.",
    step2Description:
      "Tout n’est pas en train de s’effondrer, mais tu sens une usure diffuse : des retours qui se répètent, des tensions récurrentes, des tâches qui reviennent comme des boomerangs.\nTu n’arrives pas à dire exactement « où ça bloque », et du coup tu ne sais pas par quel bout prendre le problème.\nIci, on va poser calmement le contexte, repérer les signaux faibles, et formuler ensemble 2 ou 3 hypothèses de travail réalistes, à tester sans tout casser."
  }
] as const;

type JourneyId = (typeof journeys)[number]['id'];

type Journey = (typeof journeys)[number];

const selectedJourneyId = ref<JourneyId>(journeys[0].id);

const selectedJourney = computed<Journey>(() => {
  return journeys.find((j) => j.id === selectedJourneyId.value) ?? journeys[0];
});

/**
 * Liste des situations typiques affichées plus bas dans la page.
 * Elles servent à confirmer à l’utilisateur qu’il est « au bon endroit ».
 */
const situations: {
  title: string;
  body: string;
  tag: string;
  icon: string;
  journeyId: JourneyId;
}[] = [
  {
    title: 'Trop de demandes floues, équipe à bout',
    body: "Ton asso, collectif, SCIC ou tiers-lieu tourne… mais dans la douleur.\nRéunions qui s’enchaînent, décisions floues, tensions larvées, outils mal utilisés, et la sensation d’être toujours en mode réaction.\nIci, on va prendre le temps de comprendre où ça coince, poser les rôles, les flux, et tester quelques ajustements concrets, à petite échelle.",
    tag: 'Épuisement',
    icon: '⚠️',
    journeyId: 'structure-dysfonction'
  },
  {
    title: 'Ton message se perd en route',
    body: "Tu as une intuition forte, un projet, un format d’activité… mais dès que tu en parles, tu sens un flou.\nOn te dit « c’est intéressant », sans jamais savoir quoi en faire. Tu ne sais plus si c’est toi, ton idée, ou la façon dont tu la présentes.\nIci, on va surtout t’aider à la clarifier, à la mettre en forme, et à vérifier si elle trouve sa place dans le réel.",
    tag: 'Confusion',
    icon: '🧩',
    journeyId: 'idee-isolee'
  },
  {
    title: 'Toujours en réaction, jamais en cadence',
    body: "Tu jongles entre mails, drives, tableurs, formulaires, messageries, outils « gratuits » et comptes partagés à rallonge.\nChaque nouvelle tâche te demande trois plateformes, quatre mots de passe et une bonne dose de patience.\nIci, on va regarder ton environnement numérique comme un tout, garder ce qui sert vraiment ton terrain, simplifier le reste, et documenter pour que ça ne repose pas que sur toi.",
    tag: 'Cadence',
    icon: '🔁',
    journeyId: 'structure-dysfonction'
  },
  {
    title: 'Tout repose sur les mêmes personnes',
    body: "Tout n’est pas en train de s’effondrer, mais tu sens une usure diffuse : des retours qui se répètent, des tensions récurrentes, des tâches qui reviennent comme des boomerangs.\nTu n’arrives pas à dire exactement « où ça bloque », et du coup tu ne sais pas par quel bout prendre le problème.\nIci, on va poser calmement le contexte, repérer les signaux faibles, et formuler ensemble 2 ou 3 hypothèses de travail réalistes, à tester sans tout casser.",
    tag: 'Transfert',
    icon: '📚',
    journeyId: 'outils-fatigants'
  }
];

/**
 * Axes de travail structurels mis en avant dans la seconde section :
 * cadrage, expérience éditoriale, pilotage.
 */
const axes = [
  { title: 'Cadrage clair', body: 'Aligner enjeux, critères de décision et proposition de valeur.', badge: 'Clarifier', icon: '🎯' },
  { title: 'Expérience éditoriale', body: 'Designer vitrine, formulaires et contenus qui filtrent et orientent.', badge: 'Outiller', icon: '🛠️' },
  { title: 'Pilotage et transmission', body: 'Documenter, mesurer, préparer la suite (offres pilotes, automatisations).', badge: 'Accompagner', icon: '🤝' }
];

/**
 * Étapes génériques du parcours : écoute, plan court, livraison, passage de relais.
 */
const steps = [
  { title: 'Signal faible', body: 'On écoute, on cartographie les tensions et les priorités, sans chercher à « faire joli » pour un rapport ou un financeur. À ce stade, tu peux tout dire : rien ne part en communication derrière.' },
  { title: 'Plan court', body: 'Roadmap 4–6 semaines, livrables et responsabilités.' },
  { title: 'Livraison guidée', body: 'Ateliers + sprints sur les pages clés, formulaires et messages.' },
  { title: 'Passage de relais', body: 'Documentation, mesures, options d’évolution.' }
];

const fitList = [
  'Tu veux une vitrine claire et un système de tri des demandes.',
  'Tu es prêt·e à prototyper vite sans tout verrouiller au départ.',
  'Tu cherches un regard extérieur qui facilite la décision, pas une agence en mode boîte noire.',
  'Tu veux garder la main sur les contenus et la donnée.'
];

const scrollToHero = () => {
  const hero = document.querySelector('.HeroWrapper');
  if (!hero) return;
  hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const handleSelectJourney = (journeyId: string) => {
  selectedJourneyId.value = (journeyId as JourneyId);
};

const canonicalUrl = 'https://pixelprowlers.io/';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'PixelProwlers',
  url: canonicalUrl,
  logo: 'https://pixelprowlers.io/logo.png',
  sameAs: [],
  description:
    'Studio pluriactif pour collectifs, associations et SCIC : clarté éditoriale, produit léger, transmission.'
};

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  url: canonicalUrl,
  name: 'PixelProwlers · Studio pluriactif pour collectifs, assos et SCIC',
  description:
    'Clarifier ton projet, simplifier tes outils et aligner ton organisation avec un plan court et documenté.'
};

useHead({
  title: 'PixelProwlers · Studio pluriactif pour collectifs, assos et SCIC',
  meta: [
    {
      name: 'description',
      content: 'Clarifier ton projet, simplifier tes outils et aligner ton organisation avec un plan court et documenté.'
    },
    { name: 'robots', content: 'index,follow' },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: 'PixelProwlers · Studio pluriactif pour collectifs, assos et SCIC' },
    {
      property: 'og:description',
      content: 'Clarifier ton projet, simplifier tes outils et aligner ton organisation avec un plan court et documenté.'
    },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: '/mainhero.webp' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'PixelProwlers · Studio pluriactif pour collectifs, assos et SCIC' },
    {
      name: 'twitter:description',
      content: 'Clarifier ton projet, simplifier tes outils et aligner ton organisation avec un plan court et documenté.'
    },
    { name: 'twitter:image', content: '/mainhero.webp' }
  ],
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(organizationJsonLd) },
    { type: 'application/ld+json', innerHTML: JSON.stringify(webPageJsonLd) }
  ]
});
</script>

<style scoped>
@reference "@/assets/css/main.css";

.PageContainer {
  @apply w-full max-w-9/10 mx-auto px-4 sm:px-6 lg:px-8 space-y-20 pb-24;
}
</style>
