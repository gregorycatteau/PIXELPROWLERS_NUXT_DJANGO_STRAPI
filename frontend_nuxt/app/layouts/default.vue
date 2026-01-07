<template>
  <div class="min-h-screen text-slate-100 AppBackground">
    <a class="SkipLink" href="#main-content">Aller au contenu principal</a>

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
            :key="item.key"
            :to="item.to"
            class="nav-link"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <button
          type="button"
          class="MobileMenuButton md:hidden"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-nav"
          @click="toggleMenu"
          @keydown.escape="closeMenu"
        >
          <span class="sr-only">Ouvrir le menu</span>
          <span :class="['MobileMenuIcon', isMenuOpen ? 'open' : '']" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      <transition name="fade">
        <div
          v-if="isMenuOpen"
          class="MobileMenuOverlay"
          @click.self="closeMenu"
        >
          <div
            id="mobile-nav"
            ref="menuPanel"
            class="MobileMenuPanel"
            role="dialog"
            aria-modal="true"
          >
            <div class="MobileMenuHeader">
              <p class="MobileMenuTitle">Navigation</p>
              <button type="button" class="MobileMenuClose" @click="closeMenu">
                <span class="sr-only">Fermer le menu</span>
                ✕
              </button>
            </div>
            <div class="MobileMenuLinks" ref="menuLinks">
              <NuxtLink
                v-for="item in navItems"
                :key="item.key"
                :to="item.to"
                class="MobileNavLink MobileNavLinkIcon"
                @click="closeMenu"
              >
                <span class="MobileNavIcon" aria-hidden="true">{{ item.icon }}</span>
                <span class="sr-only">{{ item.label }}</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </transition>
    </header>

    <main id="main-content" class="SiteMain">
      <slot />
    </main>

    <footer class="SiteFooter">
      <div class="container-xl SiteFooterInner">
        <p>PixelProwlers — studio pluriactif.</p>
        <div class="SiteFooterLinks">
          <NuxtLink to="/parcours" class="SiteFooterLink">Parcours</NuxtLink>
          <NuxtLink to="/mentions-legales" class="SiteFooterLink">Mentions légales</NuxtLink>
          <NuxtLink to="/politique-confidentialite" class="SiteFooterLink">Politique de confidentialité</NuxtLink>
          <NuxtLink to="/accessibilite" class="SiteFooterLink">Accessibilité</NuxtLink>
          <NuxtLink to="/a-propos" class="SiteFooterLink">À propos</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { buildResourcesDeepLink } from '@/utils/deeplinks/resourcesDeepLink';

const resourcesLink = buildResourcesDeepLink({});

const navItems = [
  { key: 'home', to: '/', label: 'Accueil', icon: '🏠' },
  { key: 'about', to: '/a-propos', label: 'À propos', icon: 'ℹ️' },
  { key: 'relinium', to: '/relinium', label: 'Relinium', icon: '🧪' },
  { key: 'accompagnement', to: '/accompagnement-formation', label: 'Accompagnement & formation', icon: '🛠️' },
  { key: 'blog', to: '/blog', label: 'Blog', icon: '📰' },
  { key: 'resources', to: resourcesLink, label: 'Ressources', icon: '📚' },
  { key: 'journeys', to: '/parcours', label: 'Parcours', icon: '🧭' },
  { key: 'contact', to: '/contact', label: 'Contact', icon: '✉️' }
];

const isMenuOpen = ref(false);
const menuPanel = ref<HTMLElement | null>(null);
const menuLinks = ref<HTMLElement | null>(null);

const closeMenu = () => {
  isMenuOpen.value = false;
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const trapFocus = (event: KeyboardEvent) => {
  if (!isMenuOpen.value) return;
  if (event.key !== 'Tab') return;
  const container = menuPanel.value;
  if (!container) return;
  const focusable = Array.from(
    container.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
  ).filter((el) => !el.hasAttribute('disabled'));
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first || !last) return;
  const active = document.activeElement as HTMLElement | null;

  if (event.shiftKey) {
    if (active === first) {
      event.preventDefault();
      last.focus();
    }
  } else if (active === last) {
    event.preventDefault();
    first.focus();
  }
};

watch(isMenuOpen, async (open) => {
  if (open) {
    await nextTick();
    const firstLink = menuLinks.value?.querySelector<HTMLElement>('a, button');
    firstLink?.focus();
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', trapFocus);
      document.body.classList.add('overflow-hidden');
    }
  } else {
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', trapFocus);
      document.body.classList.remove('overflow-hidden');
    }
  }
});

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('keydown', trapFocus);
  }
});
</script>

<style scoped>
@reference "@/assets/css/main.css";

/* --- Fond global : voûte étoilée calme, soir d'été --- */

.AppBackground {
  @apply relative overflow-hidden bg-bg-page;
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

.SkipLink {
  @apply sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-orange-500 focus:px-4 focus:py-2 focus:text-slate-900 focus:shadow-lg;
}

.MobileMenuButton {
  @apply inline-flex items-center justify-center rounded-xl border border-slate-700/80 bg-slate-900/70 px-3 py-2 text-slate-100 shadow-sm shadow-slate-900/60 transition hover:border-orange-400/60 hover:text-white;
}

.MobileMenuIcon {
  @apply relative block h-4 w-6;
}

.MobileMenuIcon span {
  @apply absolute left-0 block h-0.5 w-full bg-slate-200 transition-transform duration-200;
}

.MobileMenuIcon span:nth-child(1) {
  top: 0;
}

.MobileMenuIcon span:nth-child(2) {
  top: 7px;
}

.MobileMenuIcon span:nth-child(3) {
  top: 14px;
}

.MobileMenuIcon.open span:nth-child(1) {
  @apply translate-y-[7px] rotate-45;
}

.MobileMenuIcon.open span:nth-child(2) {
  @apply opacity-0;
}

.MobileMenuIcon.open span:nth-child(3) {
  @apply -translate-y-[7px] -rotate-45;
}

.MobileMenuOverlay {
  @apply fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-xl flex justify-end md:hidden; /* Plein écran opaque côté mobile uniquement */
}

.MobileMenuPanel {
  @apply relative h-full max-h-screen overflow-y-auto w-full max-w-none bg-slate-900/95 border-l border-slate-800 shadow-2xl shadow-slate-900/70 p-6 flex flex-col gap-4 text-slate-50;
  animation: mobileSlide 200ms ease-out;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10000;
}

.MobileNavLink {
  @apply rounded-xl px-4 py-3 text-base font-semibold text-slate-50 bg-slate-800/80 border border-slate-700 hover:border-orange-300/70 hover:bg-slate-800/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900;
}

.MobileNavLinkIcon {
  @apply h-14 w-14 rounded-full flex items-center justify-center text-2xl mx-auto;
}

.MobileNavIcon {
  @apply block leading-none;
}

/* --- Animation de transition pour le menu mobile --- */

@keyframes mobileSlide {
  from {
    transform: translateX(6%);
    opacity: 0.82;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 140ms ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
