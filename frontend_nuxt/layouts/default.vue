<template>
  <div class="min-h-screen text-slate-100 AppBackground">
    <!-- Calque dégradé crépuscule -->
    <div class="AppBackgroundGradient" aria-hidden="true" />
    <!-- Calque étoiles très discret -->
    <div class="AppBackgroundStars" aria-hidden="true" />

    <header class="SiteHeader">
      <div class="container-xl SiteHeaderInner">
        <NuxtLink to="/" class="flex items-center gap-3">
          <div class="LogoMark">
            PP
          </div>
          <div class="LogoText">
            <p class="LogoTitle">PixelProwlers</p>
            <p class="LogoSubtitle">Studio pluriactif</p>
          </div>
        </NuxtLink>

        <nav class="SiteNav">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="nav-link"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
      </div>
    </header>

    <main class="SiteMain">
      <slot />
    </main>

    <footer class="SiteFooter">
      <div class="container-xl SiteFooterInner">
        <p>PixelProwlers — studio pluriactif.</p>
        <div class="SiteFooterLinks">
          <NuxtLink to="/mentions-legales" class="SiteFooterLink">Mentions légales</NuxtLink>
          <NuxtLink to="/confidentialite" class="SiteFooterLink">Confidentialité</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const navItems = [
  { to: '/', label: 'Accueil' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/relinium', label: 'Relinium' },
  { to: '/accompagnement-formation', label: 'Accompagnement & formation' },
  { to: '/mentions-legales', label: 'Mentions légales' },
  { to: '/confidentialite', label: 'Confidentialité' }
];
</script>

<style scoped>
@reference "@/assets/css/main.css";

/* --- Fond global : voûte étoilée calme, soir d'été --- */

.AppBackground {
  @apply relative overflow-hidden bg-slate-950;
}

/* Dégradé crépuscule très doux : horizon chaud en bas, nuit en haut */
.AppBackgroundGradient {
  @apply absolute inset-0 -z-20;
  background:
    radial-gradient(circle at 10% 0%, rgba(248, 250, 252, 0.10), transparent 55%),
    radial-gradient(circle at 85% 10%, rgba(125, 211, 252, 0.14), transparent 55%),
    radial-gradient(circle at 50% 120%, rgba(248, 181, 129, 0.18), transparent 60%),
    linear-gradient(180deg, #020617 0%, #020617 40%, #020617 75%, #0f172a 100%);
}

/* Etoiles statiques + léger drift pour la sensation de ciel vivant, mais très lent */
.AppBackgroundStars {
  @apply absolute inset-0 -z-10 pointer-events-none opacity-50;
  background-image:
    radial-gradient(1px 1px at 8% 15%, rgba(255, 255, 255, 0.9), transparent 60%),
    radial-gradient(1px 1px at 18% 40%, rgba(248, 250, 252, 0.9), transparent 60%),
    radial-gradient(1px 1px at 32% 18%, rgba(255, 255, 255, 0.8), transparent 60%),
    radial-gradient(1px 1px at 55% 12%, rgba(248, 250, 252, 0.7), transparent 60%),
    radial-gradient(1px 1px at 72% 28%, rgba(248, 250, 252, 0.85), transparent 60%),
    radial-gradient(1px 1px at 88% 20%, rgba(255, 255, 255, 0.9), transparent 60%),
    radial-gradient(1px 1px at 25% 65%, rgba(248, 250, 252, 0.8), transparent 60%),
    radial-gradient(1px 1px at 60% 70%, rgba(255, 255, 255, 0.75), transparent 60%),
    radial-gradient(1px 1px at 80% 80%, rgba(248, 250, 252, 0.8), transparent 60%);
  background-repeat: no-repeat;
  animation: starDrift 80s linear infinite;
}

@keyframes starDrift {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(20px, 30px, 0);
  }
}

/* --- Header & navigation : calmes, lisibles, non agressifs --- */

.SiteHeader {
  @apply sticky top-0 z-20 border-b border-slate-800/40 bg-slate-950/70 backdrop-blur;
}

.SiteHeaderInner {
  @apply flex items-center justify-between py-4;
}

/* Logo plus doux mais toujours identifiable */
.LogoMark {
  @apply flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-400/15 text-orange-200 font-bold tracking-tight border border-orange-300/30 shadow-sm shadow-orange-900/40;
}

.LogoText {
  @apply flex flex-col;
}

.LogoTitle {
  @apply text-lg font-semibold leading-tight;
}

.LogoSubtitle {
  @apply text-xs text-slate-400;
}

.SiteNav {
  @apply hidden items-center gap-4 md:flex;
}

.nav-link {
  @apply rounded-full px-4 py-2 text-sm font-medium text-slate-200/90 transition hover:bg-slate-800/80 hover:text-white;
}

/* --- Main & footer --- */

.SiteMain {
  @apply pb-20 pt-10;
}

.SiteFooter {
  @apply mt-12 border-t border-slate-800/40 bg-slate-950/80;
}

.SiteFooterInner {
  @apply flex flex-col gap-2 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between;
}

.SiteFooterLinks {
  @apply flex gap-3;
}

.SiteFooterLink {
  @apply hover:text-slate-200;
}
</style>
