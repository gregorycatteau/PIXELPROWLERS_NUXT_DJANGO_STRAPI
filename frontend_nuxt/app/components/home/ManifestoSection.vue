<template>
  <section class="ManifesteSection pp-section">
    <div class="pp-manifesto-shell">
      <div class="pp-manifesto-band" />
      <div class="ManifesteBody">
        <div class="ManifesteHeader">
          <PPBadge as="div" variant="accent" size="sm">PP</PPBadge>
          <p class="pp-section-label">Qui je suis</p>
        </div>
        <div class="ManifesteContent pp-section-header">
          <h2 class="pp-section-title">Ce qu’on te promet, sans maquillage</h2>
          <p class="pp-section-desc">
            PixelProwlers, ce n’est pas une « agence magique » qui débarque avec un template tout fait.
            C’est un studio qui travaille avec des collectifs, des assos, des SCIC et des personnes en tension,
            en prenant au sérieux ce que tu vis déjà au quotidien.
          </p>
          <ul class="ManifestoBulletList">
            <li class="pp-manifesto-item">
              <div class="ManifesteItemTitle">1. On prend ta fatigue et tes contraintes au sérieux</div>
              <p>
                Si tu arrives ici, c’est rarement parce que « tout va bien ».
                On part du principe que tu fais déjà au mieux avec le temps, l’argent, l’énergie et les personnes que tu as autour de toi.
                Notre boulot, ce n’est pas de t’ajouter une couche de pression, mais de t’aider à dégager un peu de marge de manœuvre là où c’est possible.
              </p>
            </li>
            <li class="pp-manifesto-item">
              <div class="ManifesteItemTitle">2. Les outils servent ton terrain, pas l’inverse</div>
              <p>
                On ne choisit pas les outils pour faire plaisir aux fiches produits ou aux modes du moment.
                On part de tes usages, de ton terrain, de tes publics, et on regarde ce qui est vraiment nécessaire, ce qui peut être simplifié, et ce qui doit être éteint.
                L’objectif : que ton site et tes outils numériques t’aident à travailler mieux, pas à courir plus vite.
              </p>
            </li>
            <li class="pp-manifesto-item">
              <div class="ManifesteItemTitle">3. On documente pour que ça tienne dans le temps</div>
              <p>
                Un projet réussi, ce n’est pas juste « un beau site qui sort ».
                C’est une organisation qui sait comment ça fonctionne, qui peut transmettre, intégrer des nouvelles personnes et survivre aux changements d’équipe.
                On prend le temps de documenter ce qu’on met en place, pour que tu n’aies pas à tout reconstruire à chaque départ ou chaque crise.
              </p>
            </li>
          </ul>
          <p class="ManifestoNote">
            Si à la fin du travail tu décides qu’on ne continue pas ensemble, tu gardes quand même les analyses, les tests et les pistes qu’on aura dégagées.
            L’idée, ce n’est pas de te rendre dépendant de nous, mais de t’aider à reprendre du contrôle sur ton écosystème numérique.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
@reference "@/assets/css/main.css";

.ManifesteSection {
  @apply relative;
}

.ManifesteBody {
  @apply relative space-y-4;
}

.ManifesteHeader {
  @apply flex items-center gap-3;
}

.ManifesteContent {
  @apply space-y-3;
}

.ManifestoBulletList {
  @apply grid gap-3 text-base leading-relaxed text-slate-100;
}

.ManifesteItemTitle {
  @apply font-semibold text-slate-50;
}

.ManifestoNote {
  @apply text-sm text-slate-400 italic;
}
</style>
