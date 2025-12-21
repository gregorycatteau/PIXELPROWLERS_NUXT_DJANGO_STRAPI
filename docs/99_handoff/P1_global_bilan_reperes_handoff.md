# Handoff — Refactor UX du bloc « Repères (version publique) » (P1 Global Bilan)

> Objectif de ce document : permettre à n’importe qui de reprendre le sujet **sans aucun contexte**, en comprenant :
> - la demande initiale (UX/UI) et les contraintes,
> - ce qui a été implémenté (code + CSS),
> - ce qui a été vérifié (ancres / anti-doublons / TypeScript),
> - les incidents (SSOT, dev server),
> - et **l’état critique du repo** (beaucoup de changements hors-scope) + la stratégie de commit recommandée.

---

## 1) Demande initiale (intention produit)

### Contexte
- Page : **P1 Global Bilan** (`step=E_global_bilan`).
- Cible : bloc **« Repères (version publique) »**.
- Fichier : `frontend_nuxt/app/components/journey/p1/P1GlobalBilan.vue`.

### Intention
Transformer le bloc « Repères » en une **rampe de lancement** claire (PixelProwlers), qui explique comment lire le bilan et donne 1 à 2 raccourcis, sans redondance avec le sommaire/CTA existants.

### Contraintes UX strictes (DoD)
Le bloc devait être lisible en ~7 secondes, et tenir en **3 étages max**, plus des détails repliés :

1. **Une phrase directive unique** (comment lire / naviguer via sommaire)
2. **Un bloc “Raccourcis”** avec **max 2 actions** (sans doublon)
3. **“Ce que tu vas trouver”** sous forme de **pills conditionnelles** (1–3) **uniquement si** les sections existent

Puis, tout en bas :
- `<details>` replié : **Garanties & cadre**
- `<details>` replié : **Lire le contexte complet**

Qualité / accessibilité :
- Pas de duplications CTA
- `button type="button"`
- focus visible
- `<details>/<summary>` clairs
- build typecheck : **`npx tsc --noEmit` OK**

---

## 2) Actions réalisées (implémentation)

### A) Refactor du bloc `gb_reperes` dans `P1GlobalBilan.vue`
Le bloc a été refondu pour respecter la structure A→E et supprimer les formulations redondantes.

#### Extrait du bloc final
> Référence : `frontend_nuxt/app/components/journey/p1/P1GlobalBilan.vue` (section `id="gb_reperes"`).

```vue
<section id="gb_reperes" class="pp-globalbilan-section">
  <div class="pp-globalbilan-section-header">
    <h2 class="pp-globalbilan-section-title">Repères (version publique)</h2>
  </div>

  <div class="pp-globalbilan-card pp-globalbilan-card--primary space-y-5">
    <p class="text-sm uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
      COMMENT LIRE CE BILAN
    </p>

    <p class="text-base font-semibold text-[color:var(--color-text)] leading-relaxed">
      Lis ces repères, puis utilise le sommaire à droite pour naviguer. Tu peux sauter directement à une section.
    </p>

    <div class="space-y-2">
      <p class="text-sm font-semibold text-[color:var(--color-text)]">Raccourcis</p>
      <div class="pp-globalbilan-reperes-ctas">
        <button type="button" class="pp-btn-ghost text-xs" @click="scrollToSection('gb_panorama')">
          Voir mes 4 axes (Panorama)
        </button>
        <button
          v-if="hasHeavy"
          type="button"
          class="pp-btn-ghost text-xs"
          @click="scrollToSection('tensions_poids')"
        >
          Aller à ce qui pèse le plus
        </button>
      </div>
    </div>

    <div v-if="hasSupports || hasWatch || hasHeavy" class="space-y-2">
      <p class="text-sm font-semibold text-[color:var(--color-text)]">Ce que tu vas trouver</p>
      <div class="pp-globalbilan-reperes-pills">
        <button v-if="hasSupports" type="button" class="pp-globalbilan-reperes-pill" @click="scrollToSection('supports_anchor')">
          ✅ Soutiens / appuis
        </button>
        <button v-if="hasWatch" type="button" class="pp-globalbilan-reperes-pill" @click="scrollToSection('tensions_autres')">
          ⚠️ Points à surveiller
        </button>
        <button v-if="hasHeavy" type="button" class="pp-globalbilan-reperes-pill" @click="scrollToSection('tensions_poids')">
          🔥 Ce qui pèse le plus
        </button>
      </div>
    </div>

    <details class="pp-globalbilan-reperes-details">
      <summary class="text-sm text-[color:var(--color-text)] cursor-pointer">Garanties & cadre</summary>
      <ul class="space-y-1 text-xs text-[color:var(--color-text-muted)] leading-relaxed mt-2">
        <li>🔒 Privé sur cet appareil — rien n’est envoyé.</li>
        <li>🧭 Pas un verdict — miroir de fonctionnement, pas une étiquette.</li>
        <li>⚙️ Outil d’action — aide à prioriser ton énergie.</li>
      </ul>
    </details>

    <details class="pp-globalbilan-reperes-details">
      <summary class="text-sm text-[color:var(--color-text)] cursor-pointer">Lire le contexte complet</summary>
      <div class="space-y-4 mt-3 max-w-prose">
        <p v-for="paragraph in officialIntroParagraphs" :key="paragraph" class="text-sm text-[color:var(--color-text-muted)] leading-relaxed">{{ paragraph }}</p>
        <p v-for="paragraph in officialSynthesisParagraphs" :key="paragraph" class="text-sm text-[color:var(--color-text-muted)] leading-relaxed">{{ paragraph }}</p>
      </div>
    </details>
  </div>
</section>
```

#### Comportements et concepts techniques (résumé)
- Nuxt 4 / Vue 3 SFC (`<script setup lang="ts">`).
- Navigation intra-page : `scrollToSection(id)` via `document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })`.
- Pills conditionnelles basées sur computed booleans : `hasHeavy`, `hasWatch`, `hasSupports`.

#### Vérification des ancres (IDs) ciblées
Les IDs visés existent dans ce fichier (validation via recherche) :
- `gb_panorama`
- `tensions_poids`
- `tensions_autres`
- `supports_anchor`

#### Vérification anti-doublons
- “Voir mes 4 axes (Panorama)” : 1 occurrence
- “Aller à ce qui pèse le plus” : 1 occurrence
- Suppression des libellés anciens (“Par où commencer ?”, “Ce que tu vas voir”).

---

### B) Micro CSS (pills + focus) dans `main.css`
> Référence : `frontend_nuxt/app/assets/css/main.css`

Ajout de styles ciblés pour :
- l’agencement des CTA/pills,
- l’apparence “pill”,
- le `:focus-visible` (pills, summary details, `.pp-btn-ghost`).

```css
/* P1 Global Bilan — Repères */
.pp-globalbilan-reperes-ctas { @apply flex flex-wrap gap-2; }
.pp-globalbilan-reperes-pills { @apply flex flex-wrap gap-2; }
.pp-globalbilan-reperes-pill {
  @apply inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1 text-xs font-medium tracking-wide transition;
}
.pp-globalbilan-reperes-pill:hover { @apply border-amber-400/80 text-amber-100 bg-slate-900; }
.pp-globalbilan-reperes-pill:focus-visible { @apply outline-none ring-2 ring-amber-400/70 ring-offset-2 ring-offset-slate-950; }
.pp-globalbilan-reperes-details > summary:focus-visible { @apply outline-none ring-2 ring-amber-400/70 ring-offset-2 ring-offset-slate-950 rounded-lg; }
.pp-btn-ghost:focus-visible { @apply outline-none ring-2 ring-amber-400/70 ring-offset-2 ring-offset-slate-950; }
```

⚠️ Note : dans le repo, `main.css` contient **beaucoup d’autres changements** (hors du besoin “Repères”). Pour le ticket, seules ces classes + focus étaient nécessaires.

---

## 3) Vérifications effectuées / incidents

### TypeScript
- ✅ `npx tsc --noEmit` : OK
- ⚠️ `npx vue-tsc --noEmit` : erreur ailleurs (non traitée car hors DoD), liée à `frontend_nuxt/app/pages/parcours/[journeySlug].vue` (typage `resourcePreview`).

### Dev server
- Tentative `npm run dev` : Nuxt a démarré sur port alternatif (3001) mais crash Vite : `crypto.hash is not a function`.
- Diagnostic probable : incompatibilité Node/Vite/crypto (hors DoD, non investigué ici).

### SSOT logging
- Règle projet : POST vers `http://localhost:8080/ssot/logs/interactions` avant `attempt_completion`.
- Tentative effectuée, mais **échec** car serveur non disponible (connexion refusée). Ne doit pas bloquer la livraison.

---

## 4) Évolution de la tâche (conversation)

### 1) Implémentation demandée
Refactor UX/UI strict du bloc Repères (structure A→E), plus micro-ajustements CSS optionnels, sans toucher le reste.

### 2) Après livraison : demande d’analyse UX/UI à partir d’un screenshot
L’utilisateur a ensuite demandé :
> « que pourrais-tu proposer pour améliorer l’ux/ui du bloc repères … analyse l’image … propose des améliorations substantielles »

Réponse fournie **sans coder** : recommandations design/ergonomie, par ex. :
- transformer le haut en guide “Étape 1 / Étape 2” (démarre ici / va à une section)
- renforcer la connexion au sommaire (micro-copy + flèche / CTA ouvrir sommaire sur mobile)
- rendre les pills plus “navigables” (affordance, contraste, icône →, éventuellement compteurs)
- dé-emphasis des `<details>` en “fine print”
- groupement responsive des boutons

---

## 5) Point critique : repo très sale (changements hors-scope)

À l’instantané capturé, `git status --porcelain -uall` montre **énormément** de fichiers modifiés / ajoutés **non liés à ce ticket**, notamment dans :
- composants home/journey,
- config journeys,
- composables,
- pages,
- nouveaux docs,
- nouveaux fichiers ressources.

Conséquence : **ne pas committer “tout”**, sinon le ticket sera ingérable à relire.

### Recommandation : commit *ciblé* sur les 2 fichiers du ticket
À ne commit que :
- `frontend_nuxt/app/components/journey/p1/P1GlobalBilan.vue`
- `frontend_nuxt/app/assets/css/main.css`

Commandes recommandées :
```bash
git restore --staged .

git add frontend_nuxt/app/components/journey/p1/P1GlobalBilan.vue \
        frontend_nuxt/app/assets/css/main.css

git commit -m "fix(p1): refactor bloc repères global bilan"
```

Option : pour minimiser `main.css` si trop large, envisager un **revert partiel** ou extraction des styles “Repères” uniquement (via `git add -p frontend_nuxt/app/assets/css/main.css`).

---

## 6) Prochaines étapes possibles

1) Confirmer si une **V2 UI** doit être implémentée (sur la base des recommandations screenshot), en restant strictement dans :
- `gb_reperes` (P1GlobalBilan.vue)
- micro CSS ciblée (main.css)

2) Si V2 validée :
- introduire une hiérarchie “1) Démarre ici / 2) Navigue via sommaire”,
- pills style “nav chips” (avec icône → et meilleur contraste),
- un libellé contextuel qui pointe explicitement vers le sommaire, surtout mobile.

---

## 7) Annexe — Infos techniques utiles

- Stack : Nuxt 4 + Vue 3 + TS, Tailwind via `@apply` dans `main.css`.
- Navigation : scrollToSection + ancres dans la page.
- A11y : `:focus-visible` ajouté pour les éléments interactifs du bloc.
