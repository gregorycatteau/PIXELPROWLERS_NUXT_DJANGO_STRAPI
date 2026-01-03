"""
Paramètres de test pour pytest-django.

Utilise SQLite en mémoire pour des tests rapides.
"""
from __future__ import annotations

import os
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Security - clés de test (ne pas utiliser en production)
SECRET_KEY = "test-secret-key-for-testing-only"
DEBUG = False

ALLOWED_HOSTS = ["testserver", "localhost"]

# Apps
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    # PixelProwlers apps
    "apps.core",
    "apps.health",
    "apps.contact",
    "apps.resources",
    "apps.gate125",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "pixel_backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "pixel_backend.wsgi.application"

# SQLite en mémoire pour les tests (pas besoin de PostgreSQL)
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}

# Validation désactivée pour les tests
AUTH_PASSWORD_VALIDATORS = []

# Internationalization
LANGUAGE_CODE = "fr-fr"
TIME_ZONE = "Europe/Paris"
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# DRF
REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "DEFAULT_PARSER_CLASSES": ["rest_framework.parsers.JSONParser"],
}

# Cache
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "pixel_backend_test",
    }
}

PX_CACHE_FAIL_CLOSED = False
PX_CACHE_FAIL_RETRY_AFTER = 60
PX_HEALTH_CHECK_CACHE = False

PX_CONTACT_RATE_LIMITS = {
    "minute": {"limit": 5, "window": 60},
    "hour": {"limit": 20, "window": 3600},
}
PX_CONTACT_MIN_SECONDS = 3
CONTACT_SUPPORT_EMAIL = "support@example.com"
CONTACT_FROM_EMAIL = "no-reply@example.com"
CONTACT_RETENTION_DAYS = 180

EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"

# CORS
CORS_ALLOW_ALL_ORIGINS = True

# Logging silencieux pour les tests
LOGGING = {
    "version": 1,
    "disable_existing_loggers": True,
    "handlers": {
        "null": {
            "class": "logging.NullHandler",
        }
    },
    "loggers": {
        "apps.contact": {
            "handlers": ["null"],
            "level": "CRITICAL",
        }
    },
}
