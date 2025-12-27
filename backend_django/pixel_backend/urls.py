"""
Routes principales du projet PixelProwlers Backend.

Structure URL conforme à API_SPEC_V1.md:
- /api/v1/health/ - Health checks
- /api/v1/contact/ - Formulaire de contact
- /api/v1/resources/ - Ressources éducatives (stub MVP)
- /api/v1/gate125/ - Opération 125 (stub MVP)
- /admin/ - Django admin
"""
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    # Admin Django
    path("admin/", admin.site.urls),
    # API v1 endpoints
    path("api/v1/health/", include("apps.health.urls")),
    path("api/v1/contact/", include("apps.contact.urls")),
    path("api/v1/resources/", include("apps.resources.urls")),
    path("api/v1/gate125/", include("apps.gate125.urls")),
]
