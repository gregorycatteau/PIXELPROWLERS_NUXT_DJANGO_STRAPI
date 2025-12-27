"""
Tests unitaires pour les utilitaires de sanitization.

Vérifie le comportement de apps.core.sanitizers selon API_SPEC_V1.md.
"""
import pytest

from apps.core.sanitizers import (
    sanitize_email,
    sanitize_string,
    validate_in_allowlist,
)


class TestSanitizeString:
    """Tests pour sanitize_string()."""

    def test_empty_string_returns_empty(self):
        """Une chaîne vide retourne une chaîne vide."""
        assert sanitize_string("") == ""

    def test_none_returns_empty(self):
        """None retourne une chaîne vide."""
        assert sanitize_string(None) == ""

    def test_strips_whitespace(self):
        """Les espaces en début/fin sont supprimés."""
        assert sanitize_string("  hello world  ") == "hello world"

    def test_clamps_length(self):
        """La longueur est limitée à max_length."""
        long_string = "a" * 2000
        result = sanitize_string(long_string, max_length=100)
        assert len(result) == 100

    def test_removes_zero_width_characters(self):
        """Les caractères zero-width sont supprimés."""
        # ZWSP (U+200B), ZWNJ (U+200C), ZWJ (U+200D), WJ (U+2060), BOM (U+FEFF)
        input_str = "hel\u200blo\u200cwo\u200drld\u2060test\ufeff"
        result = sanitize_string(input_str)
        assert result == "helloworldtest"

    def test_nfkc_normalization(self):
        """La normalisation NFKC est appliquée."""
        # ﬁ (U+FB01) -> fi
        assert sanitize_string("ﬁle") == "file"
        # ① (U+2460) -> 1
        assert sanitize_string("test①") == "test1"


class TestSanitizeEmail:
    """Tests pour sanitize_email()."""

    def test_lowercase_email(self):
        """L'email est converti en lowercase."""
        assert sanitize_email("Test@EXAMPLE.COM") == "test@example.com"

    def test_clamps_to_254_chars(self):
        """L'email est limité à 254 caractères (RFC 5321)."""
        long_email = "a" * 300 + "@example.com"
        result = sanitize_email(long_email)
        assert len(result) <= 254

    def test_removes_zero_width_in_email(self):
        """Les caractères zero-width sont supprimés de l'email."""
        assert sanitize_email("test\u200b@example.com") == "test@example.com"


class TestValidateInAllowlist:
    """Tests pour validate_in_allowlist()."""

    def test_valid_value_returns_true(self):
        """Une valeur dans l'allowlist retourne True."""
        allowlist = frozenset(["a", "b", "c"])
        assert validate_in_allowlist("a", allowlist) is True

    def test_invalid_value_returns_false(self):
        """Une valeur hors allowlist retourne False."""
        allowlist = frozenset(["a", "b", "c"])
        assert validate_in_allowlist("d", allowlist) is False

    def test_empty_value_returns_false(self):
        """Une valeur vide retourne False."""
        allowlist = frozenset(["a", "b", "c"])
        assert validate_in_allowlist("", allowlist) is False

    def test_case_sensitive(self):
        """La validation est case-sensitive."""
        allowlist = frozenset(["question_generale"])
        assert validate_in_allowlist("question_generale", allowlist) is True
        assert validate_in_allowlist("QUESTION_GENERALE", allowlist) is False
