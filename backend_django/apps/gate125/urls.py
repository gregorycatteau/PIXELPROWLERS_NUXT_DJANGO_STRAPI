"""URLs pour l'app gate125."""
from django.urls import path

from .views import Gate125RegisterView

urlpatterns = [
    path("register/", Gate125RegisterView.as_view(), name="gate125_register"),
]
