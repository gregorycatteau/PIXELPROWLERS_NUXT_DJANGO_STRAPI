<!--
  PPDsCatalogStates.vue — DS Catalog Section: State Components (V1.STATES-R1)
  
  Démonstration des composants d'état DS :
  - PPEmptyState (état vide / aucun résultat)
  - PPErrorState (état erreur)
  - PPLoadingState (état chargement / skeleton)
-->
<template>
  <PPDsCatalogSection id="states" title="États UI">
    <div class="pp-ds-catalog-states">
      <!-- =====================================================
           État Empty (PPEmptyState)
           ===================================================== -->
      <h3 class="pp-ds-demo__title">PPEmptyState — État Vide</h3>
      
      <div class="pp-ds-demo__group">
        <!-- Default (avec icon search) -->
        <div class="pp-ds-demo__item">
          <span class="pp-ds-demo__label">icon="search" (défaut)</span>
          <PPEmptyState
            title="Aucun résultat"
            description="Aucune ressource ne correspond à vos critères."
            action-label="Effacer les filtres"
          />
        </div>

        <!-- Icon folder -->
        <div class="pp-ds-demo__item">
          <span class="pp-ds-demo__label">icon="folder"</span>
          <PPEmptyState
            title="Aucune ressource disponible"
            description="Découvrez nos parcours pour des recommandations personnalisées."
            icon="folder"
            action-label="Découvrir les parcours"
            action-to="/parcours/p1"
          />
        </div>

        <!-- Icon inbox + tone info -->
        <div class="pp-ds-demo__item">
          <span class="pp-ds-demo__label">icon="inbox" + tone="info"</span>
          <PPEmptyState
            title="Boîte de réception vide"
            description="Vous n'avez pas encore de messages."
            icon="inbox"
            tone="info"
          />
        </div>

        <!-- Sans action -->
        <div class="pp-ds-demo__item">
          <span class="pp-ds-demo__label">Sans action</span>
          <PPEmptyState
            title="Liste vide"
            description="Cette section est vide pour le moment."
            :icon="undefined"
          />
        </div>
      </div>

      <!-- =====================================================
           État Error (PPErrorState)
           ===================================================== -->
      <h3 class="pp-ds-demo__title">PPErrorState — État Erreur</h3>
      
      <div class="pp-ds-demo__group">
        <!-- Default -->
        <div class="pp-ds-demo__item">
          <span class="pp-ds-demo__label">Défaut (neutral)</span>
          <PPErrorState
            description="Impossible de charger les données. Veuillez réessayer."
          />
        </div>

        <!-- Custom title + tone warning -->
        <div class="pp-ds-demo__item">
          <span class="pp-ds-demo__label">tone="warning"</span>
          <PPErrorState
            title="Connexion perdue"
            description="Vérifiez votre connexion internet."
            tone="warning"
            retry-label="Reconnecter"
          />
        </div>

        <!-- Sans description -->
        <div class="pp-ds-demo__item">
          <span class="pp-ds-demo__label">Titre seul</span>
          <PPErrorState title="Service temporairement indisponible" />
        </div>
      </div>

      <!-- =====================================================
           État Loading (PPLoadingState)
           ===================================================== -->
      <h3 class="pp-ds-demo__title">PPLoadingState — État Chargement</h3>
      
      <div class="pp-ds-demo__group">
        <!-- Skeleton (défaut) -->
        <div class="pp-ds-demo__item">
          <span class="pp-ds-demo__label">variant="skeleton" (défaut, count=3)</span>
          <PPLoadingState />
        </div>

        <!-- Skeleton 6 items -->
        <div class="pp-ds-demo__item">
          <span class="pp-ds-demo__label">variant="skeleton" count=6</span>
          <PPLoadingState :count="6" label="Chargement des ressources…" />
        </div>

        <!-- Spinner -->
        <div class="pp-ds-demo__item">
          <span class="pp-ds-demo__label">variant="spinner"</span>
          <PPLoadingState variant="spinner" label="Traitement en cours…" />
        </div>
      </div>

      <!-- =====================================================
           Comparaison rapide
           ===================================================== -->
      <h3 class="pp-ds-demo__title">Comparaison des 3 états</h3>
      
      <div class="pp-ds-demo__comparison">
        <div class="pp-ds-demo__comparison-item">
          <PPEmptyState
            title="Vide"
            description="Aucun élément"
            icon="inbox"
          />
        </div>
        <div class="pp-ds-demo__comparison-item">
          <PPErrorState
            title="Erreur"
            description="Quelque chose s'est mal passé"
          />
        </div>
        <div class="pp-ds-demo__comparison-item">
          <PPLoadingState variant="spinner" label="Chargement…" />
        </div>
      </div>
    </div>
  </PPDsCatalogSection>
</template>

<script setup lang="ts">
// DS State components auto-imported by the framework
</script>

<style scoped>
@reference "@/assets/css/main.css";

.pp-ds-catalog-states {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.pp-ds-demo__title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--pp-color-text-primary);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--pp-color-stroke);
  margin-top: 1rem;
}

.pp-ds-demo__group {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.pp-ds-demo__item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pp-ds-demo__label {
  font-size: 0.75rem;
  color: var(--pp-color-text-muted);
  font-family: monospace;
}

.pp-ds-demo__comparison {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.pp-ds-demo__comparison-item {
  min-height: 200px;
}
</style>
