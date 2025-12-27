"""
Tests unitaires pour les utilitaires de logging sécurisé.

Vérifie le comportement de apps.core.logging selon API_SPEC_V1.md.
"""
import pytest

from apps.core.logging import (
    categorize_user_agent,
    hash_ip,
    redact_payload,
)


class TestHashIp:
    """Tests pour hash_ip()."""

    def test_returns_16_char_hash(self):
        """Le hash retourné fait 16 caractères."""
        result = hash_ip("192.168.1.1")
        assert len(result) == 16

    def test_empty_ip_returns_unknown(self):
        """Une IP vide retourne 'unknown'."""
        assert hash_ip("") == "unknown"
        assert hash_ip(None) == "unknown"

    def test_same_ip_same_hash(self):
        """La même IP produit le même hash (déterministe)."""
        ip = "192.168.1.1"
        assert hash_ip(ip) == hash_ip(ip)

    def test_different_ip_different_hash(self):
        """Des IPs différentes produisent des hashs différents."""
        assert hash_ip("192.168.1.1") != hash_ip("192.168.1.2")


class TestRedactPayload:
    """Tests pour redact_payload()."""

    def test_redacts_email(self):
        """Le champ email est redacté."""
        data = {"email": "test@example.com", "other": "visible"}
        result = redact_payload(data)
        assert result["email"] == "[REDACTED]"
        assert result["other"] == "visible"

    def test_redacts_password(self):
        """Le champ password est redacté."""
        data = {"password": "secret123"}
        result = redact_payload(data)
        assert result["password"] == "[REDACTED]"

    def test_redacts_message(self):
        """Le champ message est redacté."""
        data = {"message": "Hello world"}
        result = redact_payload(data)
        assert result["message"] == "[REDACTED]"

    def test_redacts_subject(self):
        """Le champ subject est redacté."""
        data = {"subject": "question_generale"}
        result = redact_payload(data)
        assert result["subject"] == "[REDACTED]"

    def test_case_insensitive(self):
        """La redaction est case-insensitive."""
        data = {"EMAIL": "test@example.com", "Message": "hello"}
        result = redact_payload(data)
        assert result["EMAIL"] == "[REDACTED]"
        assert result["Message"] == "[REDACTED]"

    def test_empty_payload_returns_empty(self):
        """Un payload vide retourne un dict vide."""
        assert redact_payload({}) == {}
        assert redact_payload(None) == {}

    def test_preserves_non_sensitive_fields(self):
        """Les champs non sensibles sont préservés."""
        data = {"endpoint": "/api/v1/contact/", "status": 201}
        result = redact_payload(data)
        assert result["endpoint"] == "/api/v1/contact/"
        assert result["status"] == 201


class TestCategorizeUserAgent:
    """Tests pour categorize_user_agent()."""

    def test_chrome_desktop(self):
        """Chrome desktop est catégorisé comme browser_desktop."""
        ua = "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 Chrome/91.0.4472.124"
        assert categorize_user_agent(ua) == "browser_desktop"

    def test_firefox_desktop(self):
        """Firefox desktop est catégorisé comme browser_desktop."""
        ua = "Mozilla/5.0 (X11; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0"
        assert categorize_user_agent(ua) == "browser_desktop"

    def test_mobile_android(self):
        """Android mobile est catégorisé comme browser_mobile."""
        ua = "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Mobile Safari/537.36"
        assert categorize_user_agent(ua) == "browser_mobile"

    def test_mobile_iphone(self):
        """iPhone est catégorisé comme browser_mobile."""
        ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6) AppleWebKit/605.1.15 Mobile"
        assert categorize_user_agent(ua) == "browser_mobile"

    def test_curl_is_bot(self):
        """curl est catégorisé comme bot."""
        ua = "curl/7.64.1"
        assert categorize_user_agent(ua) == "bot"

    def test_python_is_bot(self):
        """Python requests est catégorisé comme bot."""
        ua = "python-requests/2.25.1"
        assert categorize_user_agent(ua) == "bot"

    def test_googlebot_is_bot(self):
        """Googlebot est catégorisé comme bot."""
        ua = "Googlebot/2.1 (+http://www.google.com/bot.html)"
        assert categorize_user_agent(ua) == "bot"

    def test_empty_ua_returns_unknown(self):
        """Un User-Agent vide retourne 'unknown'."""
        assert categorize_user_agent("") == "unknown"
        assert categorize_user_agent(None) == "unknown"

    def test_unknown_ua_returns_unknown(self):
        """Un User-Agent non reconnu retourne 'unknown'."""
        ua = "CustomApp/1.0"
        assert categorize_user_agent(ua) == "unknown"
