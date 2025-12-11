<template>
  <div class="P1SovereigntyNotice">
    <p class="NoticeTitle">Souveraineté</p>
    <p class="NoticeBody">
      {{ sovereignty }}
    </p>
    <p class="NoticeBody">{{ warning }}</p>
  </div>
</template>

<script setup lang="ts">
import { P1_INTRO_COPY } from '@/config/journeys/p1CopyV1_3';

const sovereignty = P1_INTRO_COPY.sovereignty;
const warning = P1_INTRO_COPY.sharedDeviceWarning;
</script>

<style scoped>
@reference "@/assets/css/main.css";

.P1SovereigntyNotice {
  @apply rounded-2xl border border-[color:var(--color-accent-border)] bg-[color:var(--color-accent-quiet)] p-4 text-sm text-[color:var(--color-text-primary)];
}

.NoticeTitle {
  @apply text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-accent-strong)] mb-1;
}

.NoticeBody {
  @apply text-sm text-[color:var(--color-text-primary)];
}
</style>
