<template>
  <div class="PageContainer">
    <!-- HERO : PARCOURS D'IMMERSION, FOCUS SUR LE CHOIX -->
    <section class="HeroWrapper">
      <div class="HeroBackdrop" aria-hidden="true">
        <div class="HeroGlow HeroGlowPrimary" />
        <div class="HeroGlow HeroGlowSecondary" />
        <div class="HeroBackgroundAccent" />
      </div>

      <div class="HeroGrid">
        <!-- Colonne gauche : texte d’accueil -->
        <div class="HeroLeft">
          <h1 class="HeroTitle">
            Salut… aujourd’hui, tu en es où, et qu’est-ce que tu viens chercher ici&nbsp;?
          </h1>
          <p class="HeroParagraph">
            Peut-être que tu portes un projet, un collectif, une structure… ou juste une idée qui te tient à cœur.
            Tu avances comme tu peux, entre contraintes, fatigue et envies de faire mieux, sans toujours savoir par
            quel bout reprendre les choses. Ici, on ne vient pas te juger ni te mettre la pression&nbsp;: on prend
            le temps d’écouter, de clarifier ce qui compte pour toi et de dessiner ensemble quelques prochaines
            étapes réalistes, au rythme qui te convient.
          </p>
        </div>

        <!-- Colonne droite : image d’illustration -->
        <div class="HeroRight" aria-hidden="true">
          <div class="HeroImageWrapper">
            <img
              src="/public/mainhero.png"
              alt="Personne au calme devant son ordinateur au crépuscule, prête à clarifier sa situation"
              class="HeroImage"
              loading="lazy"
            />
          </div>
        </div>

        <!-- Rangée basse : choix de parcours + CTA -->
        <div class="HeroLower">
          <div class="HeroQuestionBlock">
            <p class="HeroQuestionLabel">Donc... Qu’est-ce qui t’amène ici aujourd’hui&nbsp;?</p>
            <div class="HeroJourneyGrid">
              <button
                v-for="journey in journeys"
                :key="journey.id"
                type="button"
                class="HeroJourneyCard"
                :class="{ HeroJourneyCardActive: journey.id === selectedJourneyId }"
                @click="selectedJourneyId = journey.id"
              >
                <span class="HeroJourneyLabel">{{ journey.label }}</span>
                <span class="HeroJourneyTagline">{{ journey.tagline }}</span>
              </button>
            </div>
            <p class="HeroQuestionHelper">
              Tu peux changer de cas à tout moment. Si tu n’es pas sûr·e, choisis simplement
              «&nbsp;Je ne sais pas, mais je sens que ça coince.&nbsp;».
            </p>
          </div>

          <div class="HeroActions">
            <NuxtLink
              :to="{
                path: '/accompagnement-formation',
                query: { parcours: selectedJourneyId }
              }"
              class="HeroPrimaryButton"
            >
              Commencer avec « {{ selectedJourney.label }} »
            </NuxtLink>
            <NuxtLink to="/a-propos" class="HeroSecondaryButton">
              Voir concrètement comment on travaille
            </NuxtLink>
          </div>

          <p class="HeroReassurance">
            Premier échange offert (30–45&nbsp;min), sans engagement, en visio ou téléphone.
            Rien n’est enregistré, rien ne part en communication.
          </p>
        </div>
      </div>
    </section>

    <!-- SITUATIONS / ÉTAPE 2 -->
    <section class="PageSection IndicatorsSectionWrapper">
      <header class="SectionHeader">
        <p class="SectionLabel">Étape 2 · Te reconnais-tu dans ces situations&nbsp;?</p>
        <h2 class="SectionTitle">Indices que tu es vraiment au bon endroit</h2>
        <p class="SectionDescription">
          Si tu te reconnais dans au moins une de ces situations, c’est normal&nbsp;: beaucoup de collectifs et de
          porteurs de projets vivent ça. Choisis le parcours qui se rapproche le plus de ce que tu vis, même si ce n’est
          pas parfait.
        </p>
      </header>
      <div class="IndicatorsGrid">
        <button
          v-for="(item, index) in situations"
          :key="index"
          type="button"
          class="PrimaryCard IndicatorCard"
          :class="{
            IndicatorWide: index === 0,
            IndicatorCardActive: selectedJourneyId === item.journeyId
          }"
          :aria-pressed="selectedJourneyId === item.journeyId"
          @click="selectedJourneyId = item.journeyId"
        >
          <div class="IndicatorHeader">
            <div class="IndicatorBadge">{{ item.icon }}</div>
            <div>
              <p class="CardTag">{{ item.tag }}</p>
              <h3 class="IndicatorTitle">{{ item.title }}</h3>
            </div>
          </div>
          <p class="IndicatorBody">{{ item.body }}</p>
        </button>
      </div>
      <div class="IndicatorsActions">
        <p class="IndicatorsHelper">
          Se reconnaître dans plusieurs cartes est courant. Cliquer sur une carte ou sur ce bouton te permet juste de
          choisir un point de départ. Tu pourras ajuster ensuite.
        </p>
        <div class="IndicatorsButtons">
          <NuxtLink
            :to="{
              path: '/accompagnement-formation',
              query: { parcours: selectedJourneyId }
            }"
            class="IndicatorsPrimaryButton"
          >
            Démarrer avec « {{ selectedJourney.label }} »
          </NuxtLink>
          <button type="button" class="IndicatorsSecondaryButton" @click="scrollToHero">
            Revenir aux parcours du début de page
          </button>
        </div>
      </div>
    </section>

    <!-- AXES -->
    <section class="PageSection">
      <header class="SectionHeader">
        <p class="SectionLabel">Ce qu’on fait ensemble</p>
        <h2 class="SectionTitle">Trois axes pour rendre ta situation lisible</h2>
        <p class="SectionDescription">
          On ne te propose pas un «&nbsp;plan parfait&nbsp;» qui explose au premier imprévu.
          On part de ce que tu vis vraiment&nbsp;: règles qui changent en cours de route,
          financements aléatoires, engagement en dents de scie. À partir de là, on dessine
          une trajectoire assez solide pour tenir… et assez souple pour encaisser les
          secousses.
        </p>
      </header>
      <div class="AxisGrid">
        <article
          v-for="(axis, index) in axes"
          :key="index"
          class="SecondaryCard AxisCard"
        >
          <div class="AxisTop">
            <span class="AxisBadge">{{ axis.badge }}</span>
            <span class="AxisIcon">{{ axis.icon }}</span>
          </div>
          <h3 class="AxisTitle">{{ axis.title }}</h3>
          <p class="AxisDescription">{{ axis.body }}</p>
        </article>
      </div>
    </section>

    <!-- TIMELINE -->
    <section class="PageSection">
      <header class="SectionHeader">
        <p class="SectionLabel">Comment ça se passe concrètement ?</p>
        <h2 class="SectionTitle">Quatre étapes, pas plus</h2>
        <p class="SectionDescription">
          On ne vient pas retourner la table. On commence par regarder ensemble, sans promesse
          magique et sans t’obliger à tout changer. Quatre étapes posées pour passer de
          «&nbsp;on subit&nbsp;» à «&nbsp;on sait ce qu’on teste dans les prochaines semaines&nbsp;».
        </p>
      </header>
      <div class="TimelineWrapper">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="TimelineStep"
        >
          <div class="TimelineBadge">{{ index + 1 }}</div>
          <div
            class="TimelineLine"
            :class="{ last: index === steps.length - 1 }"
          />
          <div class="TimelineContent">
            <h3 class="TimelineTitle">{{ step.title }}</h3>
            <p class="TimelineText">{{ step.body }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FIT -->
    <section class="FitSection">
      <div class="FitHeader">
        <p class="SectionLabel">Est-ce qu’on est faits pour travailler ensemble ?</p>
        <h2 class="SectionTitle">Clarifions vite si on avance ou non</h2>
        <p class="SectionDescription">
          On ne travaille bien que s’il y a un vrai fit. On pose le cadre, on regarde ce que
          tu traverses et on teste d’abord une collaboration courte. Si ça ne convient pas,
          tu repars au moins avec un diagnostic clair et quelques pistes concrètes.
        </p>
      </div>
      <ul class="FitList">
        <li
          v-for="item in fitList"
          :key="item"
          class="FitItem"
        >
          <span class="FitMarker">•</span>
          <p class="FitText">{{ item }}</p>
        </li>
      </ul>
    </section>

    <!-- MANIFESTE -->
    <section class="ManifesteSection">
      <div class="ManifesteAccent" />
      <div class="ManifesteBody">
        <div class="ManifesteHeader">
          <div class="ManifesteBadge">PP</div>
          <p class="SectionLabel">Qui je suis</p>
        </div>
        <div class="ManifesteContent">
          <h2 class="SectionTitle">Un studio réduit, branché sur les collectifs</h2>
          <ul class="ManifestoBulletList">
            <li class="ManifestoBullet">
              Je connais les dynamiques de terrain&nbsp;: équipes de soin, assos, SCIC,
              collectifs qui tiennent avec trop peu de moyens. Je prends au sérieux ta
              fatigue, tes contraintes et les tensions que ça génèrent.
            </li>
            <li class="ManifestoBullet">
              Je refuse les dark patterns, la dette numérique toxique et les sites vitrines
              qui compliquent la vie au lieu de l’apaiser.
            </li>
            <li class="ManifestoBullet">
              On conçoit les décisions, les contenus et les outils avec toi, pas à ta place.
              L’objectif&nbsp;: que tu puisses continuer sans dépendre de nous.
            </li>
          </ul>
          <p class="ManifestoNote">
            On sait que ce n’est jamais simple de regarder en face ce qui coince, surtout
            quand tu t’y es consacré pendant des années. On ne vient pas faire la morale ni
            chercher des coupables. Mais si ton objectif est seulement de maquiller les
            problèmes pour que ça «&nbsp;passe&nbsp;» une saison de plus, on ne sera pas les
            bons alliés.
          </p>
        </div>
      </div>
    </section>

    <!-- CONTACT -->
    <section class="ContactSection">
      <div class="ContactHeader">
        <div class="ContactIntro">
          <p class="SectionLabel">Prêt·e à en parler ?</p>
          <h2 class="SectionTitle">On commence par un échange clair, sans engagement</h2>
          <p class="SectionDescription">
            Tu expliques où tu en es, ce qui te pèse et ce que tu aimerais voir évoluer.
            On prend le temps de regarder ça avec toi, on met des mots, on esquisse des
            pistes. Peut-être qu’on travaillera ensemble, peut-être pas&nbsp;; dans tous les
            cas, tu repars avec un regard plus structuré, sans marketing agressif ni relance
            forcée.
          </p>
        </div>
        <NuxtLink
          to="/accompagnement-formation"
          class="CTA CTASecondary"
        >
          Voir les formats possibles
        </NuxtLink>
      </div>
      <form
        class="ContactForm"
        @submit.prevent="submitForm"
      >
        <label class="FormField">
          <span class="FormLabel">Nom complet</span>
          <input
            v-model="form.name"
            type="text"
            required
            class="FormInput"
            placeholder="Nom et prénom"
          />
        </label>
        <label class="FormField">
          <span class="FormLabel">Email</span>
          <input
            v-model="form.email"
            type="email"
            required
            class="FormInput"
            placeholder="ton@email.fr"
          />
        </label>
        <label class="FormField">
          <span class="FormLabel">Organisation (optionnel)</span>
          <input
            v-model="form.organisation"
            type="text"
            class="FormInput"
            placeholder="Collectif / coop / structure"
          />
        </label>
        <label class="FormField FormFieldFull">
          <span class="FormLabel">Message</span>
          <textarea
            v-model="form.message"
            rows="4"
            required
            class="FormTextarea"
            placeholder="Contexte, blocages, attentes"
          />
        </label>
        <label class="HiddenField">
          <input
            v-model="form.honeypot"
            type="text"
            tabindex="-1"
            autocomplete="off"
          />
        </label>
        <div class="FormFooter">
          <p class="FormHelper">
            On garde seulement ce qu’il faut pour te répondre. Aucune donnée n’est
            revendue, aucun ajout automatique à une liste.
          </p>
          <button
            type="submit"
            class="FormButton"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting">Envoi...</span>
            <span v-else>Envoyer</span>
          </button>
        </div>
        <div
          v-if="statusMessage"
          class="FormStatusSuccess"
        >
          Bien reçu. {{ statusMessage }} Retour humain (pas un robot) sous peu.
        </div>
        <div
          v-if="errorMessage"
          class="FormStatusError"
        >
          {{ errorMessage }}
        </div>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();

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
      "Tu sens qu’il y a quelque chose de juste dans ce que tu portes, mais tu n’arrives pas à l’expliquer, ni à embarquer les bonnes personnes."
  },
  {
    id: 'structure-dysfonction',
    label: "Ma structure fonctionne mal",
    tagline:
      "Réunions lourdes, décisions qui tournent en rond, tensions qui s’installent… tu as besoin d’y voir clair et de recadrer sans casser ce qui tient encore."
  },
  {
    id: 'outils-fatigants',
    label: "Mes outils informatiques me fatiguent",
    tagline:
      "Site, mails, formulaires, tableaux, messageries… tu passes plus de temps à gérer les outils qu’à faire ton vrai boulot, et tu veux simplifier sans tout jeter."
  },
  {
    id: 'plus-en-phase-job',
    label: "Je ne me retrouve plus dans mon job",
    tagline:
      "Ton métier, ton poste ou ton rôle ont changé (ou toi tu as changé) et tu as besoin de clarifier où tu en es, ce que tu veux garder et ce que tu veux faire évoluer."
  },
  {
    id: 'je-sais-pas-mais',
    label: "Je ne sais pas, mais je sens que ça coince",
    tagline:
      "Tu avances par réflexes, avec une fatigue de fond. Tu ne mets pas encore les mots dessus, mais tu sais que tu ne peux pas continuer comme ça indéfiniment."
  }
] as const;

type JourneyId = (typeof journeys)[number]['id'];

const selectedJourneyId = ref<JourneyId>(journeys[0].id);

const selectedJourney = computed(() => {
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
    body: 'Beaucoup de sollicitations, peu sont qualifiées. L’équipe s’épuise à répondre à tout. Tu veux remettre de l’ordre et protéger les forces.',
    tag: 'Épuisement',
    icon: '⚠️',
    journeyId: 'structure-dysfonction'
  },
  {
    title: 'Ton message se perd en route',
    body: 'Site, mails, propositions n’alignent pas la même histoire. Les visiteurs repartent sans comprendre, tu dois sans cesse réexpliquer.',
    tag: 'Confusion',
    icon: '🧩',
    journeyId: 'idee-isolee'
  },
  {
    title: 'Toujours en réaction, jamais en cadence',
    body: 'Tu alternes urgences et idées long terme sans plan court. Tu veux une cadence 4–6 semaines pour livrer sans brûler l’équipe.',
    tag: 'Cadence',
    icon: '🔁',
    journeyId: 'structure-dysfonction'
  },
  {
    title: 'Tout repose sur les mêmes personnes',
    body: 'La connaissance est dispersée, rien n’est vraiment documenté. Tu veux que les outils soutiennent le collectif au lieu de le fatiguer.',
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

const form = reactive({
  name: '',
  email: '',
  organisation: '',
  message: '',
  honeypot: ''
});

const statusMessage = ref('');
const errorMessage = ref('');
const isSubmitting = ref(false);

/**
 * Fonction de soumission du formulaire de contact :
 *  - envoie les données au backend PixelProwlers,
 *  - gère les messages de succès/erreur pour l’utilisateur,
 *  - réinitialise le formulaire en cas de succès.
 */
const submitForm = async () => {
  statusMessage.value = '';
  errorMessage.value = '';
  isSubmitting.value = true;
  try {
    await $fetch(`${config.public.apiBase}/api/contact/`, {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        organisation: form.organisation,
        message: form.message,
        honeypot: form.honeypot
        // Évolution possible : envoyer aussi selectedJourneyId
        // pour pré-qualifier la demande côté backend.
      }
    });
    statusMessage.value = 'Merci ! Ton message est bien transmis.';
    form.name = '';
    form.email = '';
    form.organisation = '';
    form.message = '';
    form.honeypot = '';
  } catch (error: any) {
    const details = error?.data;
    errorMessage.value = details?.message || 'Une erreur est survenue. Réessaie plus tard.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
@reference "@/assets/css/main.css";

.PageContainer {
  @apply w-full max-w-9/10 mx-auto px-4 sm:px-6 lg:px-8 space-y-20 pb-24;
}

/* --- HERO : PARCOURS D'IMMERSION, FOCUS SUR LE CHOIX --- */

.HeroWrapper {
  @apply relative overflow-hidden rounded-3xl border border-slate-800/50 bg-gradient-to-br from-slate-950/85 via-slate-950/75 to-slate-900/75 px-6 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-20 shadow-[0_26px_80px_rgba(15,23,42,0.85)] backdrop-blur-md lg:min-h-[calc(100vh-160px)];
}

.HeroBackdrop {
  @apply absolute inset-0 opacity-25 blur-3xl pointer-events-none z-0;
}

.HeroGlow {
  @apply pointer-events-none absolute rounded-full;
}

.HeroGlowPrimary {
  @apply -left-24 -top-10 h-64 w-64 bg-orange-400/20;
}

.HeroGlowSecondary {
  @apply right-0 top-10 h-60 w-60 bg-cyan-300/18;
}

.HeroBackgroundAccent {
  @apply absolute inset-y-10 left-20 w-24 rounded-full bg-gradient-to-b from-orange-400/12 via-purple-500/10 to-cyan-300/12 blur-3xl;
}

/* Grille principale du hero :
 * - mobile : 1 colonne, empilé
 * - desktop : 12 colonnes, texte 7 / image 5 / bas 12
 */
.HeroGrid {
  @apply relative z-10 mx-auto grid gap-8 lg:gap-10 lg:grid-cols-12 items-start;
}

/* Colonne texte */
.HeroLeft {
  @apply flex flex-col gap-6 lg:col-span-7;
}

/* Colonne image */
.HeroRight {
  @apply lg:col-span-5 flex justify-center lg:justify-end;
}

.HeroImageWrapper {
  @apply relative w-full max-w-md mx-auto rounded-3xl overflow-hidden border border-slate-800/60 bg-slate-900/60 shadow-[0_24px_80px_rgba(15,23,42,0.9)] aspect-[4/3];
}

.HeroImage {
  @apply w-full h-full object-cover block;
}

/* Bloc du bas : parcours + CTA */
.HeroLower {
  @apply lg:col-span-12 mt-4 space-y-5;
}

.HeroTitle {
  @apply text-4xl sm:text-5xl lg:text-[52px] font-bold leading-tight tracking-tight max-w-[22ch];
}

.HeroParagraph {
  @apply mt-4 text-sm md:text-base text-slate-200/90 max-w-[64ch] leading-relaxed;
}

/* Bloc question / parcours */

.HeroQuestionBlock {
  @apply mt-2 space-y-3;
}

.HeroQuestionLabel {
  @apply text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-slate-400;
}

.HeroJourneyGrid {
  @apply grid gap-3 sm:grid-cols-2;
}

.HeroJourneyCard {
  @apply text-left rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3.5 flex flex-col gap-1.5 cursor-pointer transition-all duration-150 hover:border-orange-300/70 hover:bg-slate-900/90;
}

.HeroJourneyCardActive {
  @apply border-orange-400/80 bg-slate-900/95 shadow-lg shadow-orange-900/40;
}

.HeroJourneyLabel {
  @apply text-sm font-semibold text-slate-50;
}

.HeroJourneyTagline {
  @apply text-xs text-slate-400 leading-snug;
}

.HeroQuestionHelper {
  @apply text-xs text-slate-500 max-w-[50ch];
}

/* CTA & réassurance */

.HeroActions {
  @apply mt-4 flex flex-col sm:flex-row gap-3 sm:items-center;
}

.HeroPrimaryButton {
  @apply inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold bg-orange-400 text-slate-950 shadow-lg shadow-orange-500/35 hover:bg-orange-300 hover:shadow-orange-300/50 hover:-translate-y-[1px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950;
}

.HeroSecondaryButton {
  @apply inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium border border-slate-500 text-slate-100 hover:border-slate-200 hover:bg-slate-900/60 hover:-translate-y-[1px] transition;
}

.HeroReassurance {
  @apply text-xs md:text-sm text-slate-400 max-w-[45ch];
}

/* --- Sections suivantes (identiques à la base) --- */

.SectionLabel {
  @apply text-slate-400 text-sm uppercase tracking-[0.2em] text-orange-300;
}

.PageSection {
  @apply space-y-4;
}

.SectionHeader {
  @apply space-y-2;
}

.SectionTitle {
  @apply text-3xl font-semibold leading-tight;
}

.SectionDescription {
  @apply text-base leading-relaxed text-slate-300;
}

/* Indicateurs */

.IndicatorsGrid {
  @apply grid gap-4 md:grid-cols-2;
}

.PrimaryCard {
  @apply rounded-2xl bg-slate-900/70 border border-orange-500/30 shadow-xl shadow-orange-900/20 transition-all duration-200 hover:-translate-y-1 hover:shadow-orange-700/25 p-5;
}

.IndicatorCard {
  @apply border-l-4 border-orange-400/60;
}

.IndicatorWide {
  @apply md:col-span-2;
}

.IndicatorHeader {
  @apply flex items-center gap-3;
}

.IndicatorBadge {
  @apply inline-flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/20 text-orange-200 font-semibold border border-orange-400/40;
}

.CardTag {
  @apply inline-flex items-center rounded-full bg-orange-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-200;
}

.IndicatorTitle {
  @apply text-xl font-semibold leading-snug;
}

.IndicatorBody {
  @apply text-base leading-relaxed text-slate-200 mt-2;
}

.IndicatorCardActive {
  @apply border-orange-400/80 bg-slate-900/95 shadow-lg shadow-orange-900/40;
}

.IndicatorsSectionWrapper {
  @apply space-y-6;
}

.IndicatorsActions {
  @apply mt-6 flex flex-col gap-3;
}

.IndicatorsHelper {
  @apply text-sm text-slate-300;
}

.IndicatorsButtons {
  @apply flex flex-col gap-3 sm:flex-row sm:items-center;
}

.IndicatorsPrimaryButton {
  @apply inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold bg-orange-400 text-slate-950 shadow-lg shadow-orange-500/35 hover:bg-orange-300 hover:shadow-orange-300/50 hover:-translate-y-[1px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950;
}

.IndicatorsSecondaryButton {
  @apply inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium border border-slate-500 text-slate-100 hover:border-slate-200 hover:bg-slate-900/60 hover:-translate-y-[1px] transition;
}

/* Axes */

.AxisGrid {
  @apply grid gap-4 md:grid-cols-3;
}

.SecondaryCard {
  @apply rounded-2xl bg-[var(--color-panel)] border border-[var(--color-stroke)] shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/40 p-5;
}

.AxisCard {
  @apply space-y-3;
}

.AxisTop {
  @apply flex items-center justify-between;
}

.AxisBadge {
  @apply inline-flex items-center gap-2 rounded-full bg-orange-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-200;
}

.AxisIcon {
  @apply text-lg;
}

.AxisTitle {
  @apply text-xl font-semibold leading-snug;
}

.AxisDescription {
  @apply text-base leading-relaxed text-slate-300 mt-2;
}

/* Timeline */

.TimelineWrapper {
  @apply relative flex flex-col gap-6;
}

.TimelineWrapper::before {
  content: "";
  @apply absolute left-[19px] top-5 bottom-5 w-px bg-gradient-to-b from-orange-400/60 via-orange-500/30 to-transparent;
}

.TimelineStep {
  @apply relative grid grid-cols-[auto,1fr] items-start gap-4 pl-2;
}

.TimelineBadge {
  @apply flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-slate-900 font-bold shadow-lg shadow-orange-500/30;
}

.TimelineLine {
  @apply hidden;
}

.TimelineLine.last {
  @apply bg-transparent;
}

.TimelineContent {
  @apply space-y-1 rounded-xl bg-[var(--color-panel)] p-4 border border-[var(--color-stroke)] shadow-md;
}

.TimelineTitle {
  @apply text-xl font-semibold leading-snug;
}

.TimelineText {
  @apply text-base leading-relaxed text-slate-300 mt-1;
}

/* Fit */

.FitSection {
  @apply rounded-2xl bg-[var(--color-panel)] border border-[var(--color-stroke)] shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/40 border-l-4 border-orange-400/70 p-6 space-y-4;
}

.FitHeader {
  @apply space-y-3;
}

.FitList {
  @apply grid gap-3 pt-2 md:grid-cols-2;
}

.FitItem {
  @apply flex items-start gap-3 text-slate-200;
}

.FitMarker {
  @apply mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/15 text-orange-300 font-bold;
}

.FitText {
  @apply text-base leading-relaxed text-slate-200;
}

/* Manifeste */

.ManifesteSection {
  @apply relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 shadow-[0_30px_100px_rgba(0,0,0,0.35)];
}

.ManifesteAccent {
  @apply absolute left-0 top-0 h-full w-1 bg-orange-400/70;
}

.ManifesteBody {
  @apply relative space-y-4 p-6 md:p-8;
}

.ManifesteHeader {
  @apply flex items-center gap-3;
}

.ManifesteBadge {
  @apply inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/80 text-orange-200 border border-orange-400/40 font-semibold;
}

.ManifesteContent {
  @apply space-y-3;
}

.ManifestoBulletList {
  @apply grid gap-2 text-base leading-relaxed text-slate-100;
}

.ManifestoBullet {
  @apply flex items-start gap-3 rounded-2xl bg-slate-900/60 px-4 py-3 border border-slate-800;
}

.ManifestoNote {
  @apply text-sm text-slate-400 italic;
}

/* Contact */

.ContactSection {
  @apply rounded-3xl border border-orange-500/30 bg-[var(--color-panel-alt)] p-6 shadow-xl shadow-orange-900/20 space-y-6;
}

.ContactHeader {
  @apply flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between;
}

.ContactIntro {
  @apply space-y-1;
}

.ContactForm {
  @apply grid gap-4 md:grid-cols-2;
}

.FormField {
  @apply flex flex-col gap-2 text-sm text-slate-200;
}

.FormFieldFull {
  @apply md:col-span-2;
}

.FormLabel {
  @apply text-sm font-semibold text-slate-200;
}

.FormInput {
  @apply w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/40;
}

.FormTextarea {
  @apply w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/40 resize-none;
}

.HiddenField {
  @apply hidden;
}

.FormFooter {
  @apply flex flex-col gap-2 md:col-span-2 md:flex-row md:items-center md:justify-between;
}

.FormHelper {
  @apply text-sm text-slate-400;
}

.FormButton {
  @apply bg-orange-500 text-slate-900 shadow-lg shadow-orange-500/30 hover:-translate-y-0.5 hover:shadow-orange-400/40 disabled:opacity-60 rounded-full px-5 py-3 font-semibold transition;
}

.FormStatusSuccess {
  @apply rounded-2xl px-4 py-3 text-sm font-medium bg-emerald-500/10 text-emerald-200 border border-emerald-400/40 md:col-span-2;
}

.FormStatusError {
  @apply rounded-2xl px-4 py-3 text-sm font-medium bg-rose-500/10 text-rose-200 border border-rose-400/40 md:col-span-2;
}
</style>
