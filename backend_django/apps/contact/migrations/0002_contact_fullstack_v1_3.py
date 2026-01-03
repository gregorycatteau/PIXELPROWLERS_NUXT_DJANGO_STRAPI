from __future__ import annotations

import uuid

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("contact", "0001_initial"),
    ]

    operations = [
        migrations.DeleteModel(
            name="ContactMessage",
        ),
        migrations.DeleteModel(
            name="Prospect",
        ),
        migrations.CreateModel(
            name="ContactMessage",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("ticket_id", models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ("first_name", models.CharField(blank=True, max_length=80)),
                ("last_name", models.CharField(blank=True, max_length=80)),
                ("email", models.EmailField(max_length=120)),
                ("message", models.TextField()),
                ("consent", models.BooleanField(default=False)),
                ("consented_at", models.DateTimeField()),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("new", "Nouveau"),
                            ("seen", "Vu"),
                            ("replied", "Répondu"),
                            ("spam", "Spam"),
                        ],
                        default="new",
                        max_length=16,
                    ),
                ),
                ("ip_prefix", models.CharField(blank=True, max_length=64)),
                ("ip_hash", models.CharField(blank=True, max_length=64)),
                ("user_agent_hash", models.CharField(blank=True, max_length=64)),
                ("created_at", models.DateTimeField(auto_now_add=True, db_index=True)),
            ],
            options={"ordering": ("-created_at",)},
        ),
    ]
