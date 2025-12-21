<template>
  <div class="pp-journey-shell">
    <a class="SkipLink" href="#main">Aller au contenu principal</a>
    <div class="JourneyBackground" aria-hidden="true" />
    <header class="JourneyTop pp-journey-header">
      <NuxtLink to="/" class="JourneyBrand">
        <span class="JourneyBrandMark">PP</span>
        <span class="JourneyBrandText">PixelProwlers</span>
      </NuxtLink>
    </header>
    <main id="main" class="JourneyMain pp-journey-page">
      <div class="pp-journey-inner">
        <slot />
      </div>
    </main>
    <footer class="JourneyFooter pp-journey-inner">
      <p class="text-sm text-slate-400">Souveraineté des données · réponses en mémoire par défaut</p>
    </footer>
  </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.SkipLink {
  @apply absolute left-4 top-4 z-30 -translate-y-16 rounded-md bg-[color:var(--color-accent-strong)] px-4 py-2 text-sm font-semibold text-[color:var(--color-text-invert)] shadow-lg focus-visible:translate-y-0 transition;
}

.JourneyBackground {
  @apply absolute inset-0 -z-10 bg-gradient-to-b from-slate-950 via-slate-950/90 to-slate-900;
}

.JourneyBrand {
  @apply inline-flex items-center gap-3 no-underline text-[color:var(--color-text-primary)];
}

.JourneyBrandMark {
  @apply inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--color-accent-quiet)] text-lg font-bold text-[color:var(--color-accent-strong)] border border-[color:var(--color-accent-border)];
}

.JourneyBrandText {
  @apply text-base font-semibold;
}

.JourneyFooter {
  @apply pb-10;
}
</style>
