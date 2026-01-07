from django.contrib import admin

from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("ticket_id", "email", "status", "created_at")
    search_fields = ("email", "ticket_id")
    list_filter = ("status", "created_at")
