"""URLs pour l'app resources."""
from django.urls import path

from .views import ResourcesListView

urlpatterns = [
    path("", ResourcesListView.as_view(), name="resources_list"),
]
