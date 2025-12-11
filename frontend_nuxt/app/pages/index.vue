<template>
  <div class="space-y-16 pb-24">
    <HomeHeroSection
      section-id="home-hero"
      :title="hero.title"
      :subtitle="hero.subtitlePrimary + (hero.subtitleSecondary ? ' ' + hero.subtitleSecondary : '')"
      :primary-cta-label="hero.primaryCta"
      :secondary-cta-label="hero.secondaryCta"
      :microcopy="hero.microcopy"
      @cta-primary-click="handleHeroPrimaryCta"
      @cta-secondary-click="handleHeroSecondaryCta"
    />

    <HomeJourneysGridSection
      section-id="home-journeys"
      :journeys="HOME_JOURNEYS"
      :title="journeysTitle"
      :subtitle="journeysSubtitle"
      @journey-click="handleJourneyClick"
    />

    <HomeNowSection
      section-id="home-now"
      :title="nowContent.title"
      :subtitle="nowContent.subtitle"
      :items="nowContent.items"
      @block-click="handleNowBlockClick"
    />

    <HomeFitAudienceSection
      section-id="home-fit"
      :title="fitContent.title"
      :subtitle="fitContent.subtitle"
      :fit-list="fitContent.fitList"
      :not-for-list="fitContent.notForList"
    />

    <HomeHowWeWorkSection
      section-id="home-how"
      :title="howContent.title"
      :subtitle="howContent.subtitle"
      :steps="howContent.steps"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useHead, navigateTo } from '#imports';
import HomeFitAudienceSection from '~/components/home/HomeFitAudienceSection.vue';
import HomeHeroSection from '~/components/home/HomeHeroSection.vue';
import HomeHowWeWorkSection from '~/components/home/HomeHowWeWorkSection.vue';
import HomeJourneysGridSection from '~/components/home/HomeJourneysGridSection.vue';
import HomeNowSection from '~/components/home/HomeNowSection.vue';
import { HOME_JOURNEYS, type HomeJourneyId } from '~/config/homeJourneysConfig';
import { useAnalytics } from '~/composables/useAnalytics';

const { trackEvent } = useAnalytics();

// S1 — Hero (cf. HOME_V1_2_HOMEPAGE_UX_CONTENT_TALIA.md, section Hero)
const hero = {
  title: 'Tu portes un projet utile. Ta structure et tes outils suivent… plus ou moins.',
  subtitlePrimary: 'PixelProwlers est un studio d’architecture numérique souveraine pour assos, SCIC, collectifs et personnes en transition.',
  subtitleSecondary:
    'Ici, tu choisis un parcours adapté à ta situation pour commencer à explorer ce qui coince dans ta structure, tes outils ou ta trajectoire.',
  primaryCta: 'Choisir un parcours',
  secondaryCta: 'Comprendre comment on travaille',
  microcopy: undefined
} as const;

// S2 — Titre/sous-titre (cf. HOME_V1_2_HOMEPAGE_UX_CONTENT_TALIA.md, section S2)
const journeysTitle = 'Par quoi tu as envie de commencer ?';
const journeysSubtitle = 'Choisis la carte qui se rapproche le plus de ce que tu vis. Tu pourras toujours changer de parcours ensuite.';

// S3 — “Ce que tu peux faire ici, tout de suite” (cf. Talia S3)
type HomeNowBlockId = 'now-words' | 'now-clarity' | 'now-action';
type HomeNowBlock = { id: HomeNowBlockId; title: string; body: string; };

const nowContent: { title: string; subtitle: string; items: HomeNowBlock[] } = {
  title: 'Ce que tu peux faire ici, tout de suite',
  subtitle:
    'Quel que soit le parcours que tu choisis, la démarche reste la même : poser les choses, comprendre ce qui se joue, et décider comment avancer à ton rythme.',
  items: [
    {
      id: 'now-words',
      title: 'Mettre des mots',
      body:
        'En choisissant un parcours proche de ce que tu vis, tu commences par déplier calmement les situations qui posent problème, et mettre des mots sur des faits.'
    },
    {
      id: 'now-clarity',
      title: 'Y voir plus clair',
      body:
        'Les écrans de diagnostic et de bilan du parcours t’aident à relier les symptômes entre eux et à comprendre ce qui se passe vraiment dans ta structure, tes outils ou ta trajectoire.'
    },
    {
      id: 'now-action',
      title: 'Passer à l’action',
      body:
        'À la fin du parcours, tu repars avec des ressources open source et des pistes de travail concrètes, à activer en autonomie — avec la possibilité de nous embarquer plus tard si ça a du sens pour toi.'
    }
  ]
};

// S4 — “Quand notre façon de travailler te correspond…” (cf. Talia S4)
const fitContent: {
  title: string;
  subtitle?: string;
  fitList: string[];
  notForList: string[];
} = {
  title: 'Quand notre façon de travailler te correspond… et quand ce n’est pas le bon cadre',
  subtitle: undefined,
  fitList: [
    'Tu veux comprendre avant de “scaler” et prendre un temps de diagnostic honnête.',
    'Ta souveraineté numérique est aussi une position politique et tu veux réduire tes dépendances.',
    'Tu acceptes de regarder le réel tel qu’il est, tensions et bricolages compris.',
    'Tu cherches un allié exigeant qui aide à structurer, documenter et questionner les choix.',
    'Tu veux que ton système soit transmissible et ne repose pas sur quelques personnes héroïques.'
  ],
  notForList: [
    'Tu veux surtout un résultat visible très vite, sans phase de mise à plat.',
    'Tu n’as aucune envie de questionner tes dépendances numériques aux grands acteurs.',
    'Tu préfères que la communication enjolive et évite les tensions ou zones d’ombre.',
    'Tu attends d’un prestataire qu’il exécute sans remettre en question le sens ou les effets à long terme.',
    'Tu acceptes que tout repose durablement sur quelques personnes clés sans documenter ni partager.'
  ]
};

// S5 — “Comment on travaille, concrètement” (cf. Talia S5)
const howContent = {
  title: 'Comment on travaille, concrètement',
  subtitle: 'L’idée n’est pas de tout retourner, mais de t’aider à avancer de façon posée, documentée et soutenable.',
  steps: [
    {
      title: '1. Explorer en autonomie',
      body: 'Tu choisis un parcours qui te parle. Tu explores la page longue traîne, tu utilises les questionnaires et les ressources pour clarifier ta situation, sans compte ni engagement.'
    },
    {
      title: '2. Structurer ce que tu découvres',
      body: 'Si tu en as besoin, tu peux documenter ton diagnostic dans un espace Relinium dédié : un SSOT personnel pour garder une trace, partager avec ton collectif et suivre les évolutions dans le temps.'
    },
    {
      title: '3. Vérifier si on est faits pour travailler ensemble',
      body: 'Quand le terrain est prêt, tu peux enclencher un échange Fit. On regarde ensemble si PixelProwlers est la bonne pièce du puzzle pour toi maintenant, ou si d’autres options sont plus justes. Dans tous les cas, l’objectif est que tu repartes avec plus de clarté que lorsque tu es arrivé·e.'
    }
  ]
};

const scrollToSection = (id: string) => {
  if (process.server) return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const handleHeroPrimaryCta = () => {
  trackEvent('home_hero_cta_clicked' as any, { target: 'journeys' });
  scrollToSection('home-journeys');
};

const handleHeroSecondaryCta = () => {
  trackEvent('home_hero_cta_clicked' as any, { target: 'how' });
  scrollToSection('home-how');
};

const handleJourneyClick = ({ journeyId }: { journeyId: HomeJourneyId }) => {
  const journey = HOME_JOURNEYS.find((j) => j.id === journeyId);
  if (!journey || !journey.isAvailable) return;
  trackEvent('home_journey_card_clicked' as any, { journey_id: journeyId });
  navigateTo(`/parcours/${journey.slug}`);
};

const handleNowBlockClick = ({ blockId }: { blockId: string }) => {
  trackEvent('home_now_block_clicked' as any, { block_id: blockId });
};

onMounted(() => {
  trackEvent('home_view' as any);
});

const seoTitle = 'PixelProwlers · Choisis un parcours pour clarifier ta structure et tes outils';
const seoDescription =
  "Studio d’architecture numérique souveraine pour assos, SCIC, collectifs et personnes en transition. Parcours P1–P5 pour mettre des mots, y voir clair et passer à l’action sans tunnel forcé.";

useHead({
  title: seoTitle,
  meta: [
    { name: 'description', content: seoDescription },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: seoTitle },
    { property: 'og:description', content: seoDescription },
    { property: 'og:url', content: 'https://pixelprowlers.io/' },
    { property: 'og:image', content: '/mainhero.webp' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: seoTitle },
    { name: 'twitter:description', content: seoDescription },
    { name: 'twitter:image', content: '/mainhero.webp' }
  ],
  link: [{ rel: 'canonical', href: 'https://pixelprowlers.io/' }]
});
</script>
