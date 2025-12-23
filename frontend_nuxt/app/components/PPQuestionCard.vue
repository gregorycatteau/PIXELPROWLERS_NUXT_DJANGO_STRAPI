<template>
  <PPCard
    v-bind="forwardedAttrs"
    :as="as"
    :variant="resolvedCardVariant"
    :hoverable="isHoverable"
    class="pp-question-card"
    :class="densityClass"
  >
    <header class="pp-question-card__header">
      <div class="pp-question-card__meta">
        <slot name="meta" :a11y="a11y" />
      </div>

      <div v-if="showCounter" class="pp-question-card__counter" aria-hidden="true">
        {{ counterText }}
      </div>
    </header>

    <div class="pp-question-card__body">
      <h3 :id="a11y.titleId" class="pp-question-card__title">
        {{ title }}
      </h3>

      <p v-if="context" :id="a11y.contextId" class="pp-question-card__context">
        {{ context }}
      </p>

      <!-- Zone contrôle (scale, etc). On expose les ids a11y pour que l’adapter puisse les forward. -->
      <div class="pp-question-card__control">
        <slot :a11y="a11y" />
      </div>

      <div v-if="$slots.skip || $slots.nav" class="pp-question-card__actions">
        <div class="pp-question-card__skip">
          <slot name="skip" :a11y="a11y" />
        </div>
        <div class="pp-question-card__nav">
          <slot name="nav" :a11y="a11y" />
        </div>
      </div>
    </div>
  </PPCard>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";

type Density = "compact" | "default" | "comfort";
type CardVariant = "default" | "accent" | "indicator" | "hoverable";
type AsTag = "section" | "article" | "div";

const props = withDefaults(
  defineProps<{
    title: string;
    context?: string | null;

    /** 1-based index */
    index?: number | null;
    total?: number | null;

    /**
     * Base id utilisé pour relier title/context/controls.
     * Si absent, on dérive un id stable depuis title + index.
     */
    idBase?: string | null;

    density?: Density;
    cardVariant?: CardVariant;
    as?: AsTag;
  }>(),
  {
    context: null,
    index: null,
    total: null,
    idBase: null,
    density: "default",
    cardVariant: "default",
    as: "section",
  },
);

const attrs = useAttrs();

/**
 * Forward attrs sans “class” (les classes DS + density sont gérées dans le template).
 */
const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs as Record<string, unknown>;
  return rest;
});

/**
 * PPCard n'a pas de variant "hoverable" : on mappe vers variant="default" + hoverable.
 */
const resolvedCardVariant = computed(() => {
  if (props.cardVariant === "hoverable") return "default";
  return props.cardVariant;
});

const isHoverable = computed(() => props.cardVariant === "hoverable");

/**
 * Normalise une base d'id pour éviter collisions DOM / focus hijack / ids bizarres.
 * NFKC si dispo + suppression zero-width + allowlist + prefix + maxlen.
 */
function normalizeIdBase(raw: string): string {
  let s = String(raw ?? "");
  // NFKC (si l’environnement le supporte)
  try {
    // eslint-disable-next-line no-undef
    if (typeof s.normalize === "function") s = s.normalize("NFKC");
  } catch {
    // ignore
  }
  // remove zero-width + controls
  s = s.replace(/[\u200B-\u200D\uFEFF]/g, "");
  // allowlist
  s = s.replace(/[^a-zA-Z0-9_-]/g, "-");
  // collapse dashes
  s = s.replace(/-+/g, "-").replace(/^[-_]+|[-_]+$/g, "");
  if (!s) s = "q";
  if (s.length > 48) s = s.slice(0, 48);
  return `ppq_${s}`;
}

const computedBase = computed(() => {
  if (props.idBase) return normalizeIdBase(props.idBase);
  const seed = `${props.title || "q"}_${props.index ?? ""}`;
  return normalizeIdBase(seed);
});

const a11y = computed(() => {
  const base = computedBase.value;
  return {
    base,
    titleId: `${base}__title`,
    contextId: `${base}__context`,
  };
});

const showCounter = computed(() => {
  const i = props.index;
  const t = props.total;
  return typeof i === "number" && typeof t === "number" && i > 0 && t > 0;
});

const counterText = computed(() => {
  if (!showCounter.value) return "";
  return `Question ${props.index} / ${props.total}`;
});

const densityClass = computed(() => {
  if (props.density === "compact") return "pp-question-card--compact";
  if (props.density === "comfort") return "pp-question-card--comfort";
  return "pp-question-card--default";
});
</script>

<style scoped>
@reference "@/assets/css/main.css";
/* Atom DS : styles dans pp.components.css (global). Rien en scoped ici. */
</style>
