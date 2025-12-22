# PX No v-html Doctrine V1

PixelProwlers ne construit pas de profils utilisateurs : il produit des miroirs locaux exportables.

## Regle absolue
- Aucun HTML custom dans les modules data-only (manifests, copy, registry, export, templates).
- Interdiction globale de `v-html` dans le frontend.

## Exceptions (process strict)
Une exception ne peut exister que si les conditions suivantes sont remplies :
1) Allowlist explicite dans `frontend_nuxt/tools/guard_allowlist/no_v_html_allowlist.ts`.
2) Sanitizer robuste + validation securite.
3) Documentation SSOT mise a jour.

## Guards CI
- `no-v-html:guard` : echoue si `v-html` est detecte.
- `data-only:guard` : bloque les schemes, HTML, caractere invisibles et textes non conformes.
