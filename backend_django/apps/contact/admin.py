from django.contrib import admin

from .models import ContactMessage, Prospect


@admin.register(Prospect)
class ProspectAdmin(admin.ModelAdmin):
    list_display = ("email", "name", "organisation", "created_at")
    search_fields = ("email", "name", "organisation")


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("prospect", "created_at")
    search_fields = ("prospect__email",)
    list_filter = ("created_at",)
