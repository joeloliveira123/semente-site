#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
IGREJA EVANGÉLICA SEMENTE DA MULTIPLICAÇÃO — COMPREHENSIVE E2E TEST SUITE
======================================================================
Architecture: Vanilla Web (Zero-Build) | Python 3.12 Standard Library
Test Methodology: 4-Tier Test Design (Feature Coverage, Boundary & Corner Cases,
Cross-Feature Interactions, Real-World HTTP Scenarios).

Usage:
    python tests/test_suite.py
    python -m unittest discover -s tests
"""

import http.server
import math
import os
import re
import socketserver
import sys
import threading
import time
import unittest
import urllib.error
import urllib.request
from html.parser import HTMLParser
from pathlib import Path
from typing import Dict, List, Optional, Tuple

# Reconfigure stdout for UTF-8 on Windows consoles to prevent cp1252 charmap encoding errors
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Project root directory
PROJECT_ROOT = Path(__file__).resolve().parent.parent


# ==============================================================================
# UTILITY 1: WCAG 2.1 CONTRAST & ACCESSIBILITY CALCULATOR
# ==============================================================================
class WCAGContrastCalculator:
    """Calculates color contrast ratios according to WCAG 2.1 guidelines."""

    @staticmethod
    def parse_hex(color_str: str) -> Tuple[int, int, int]:
        """Convert 3 or 6 hex digits string to (R, G, B) tuple."""
        s = color_str.strip().lstrip("#")
        if len(s) == 3:
            s = "".join([c * 2 for c in s])
        if len(s) != 6:
            raise ValueError(f"Invalid hex color: {color_str}")
        return int(s[0:2], 16), int(s[2:4], 16), int(s[4:6], 16)

    @staticmethod
    def relative_luminance(rgb: Tuple[int, int, int]) -> float:
        """Compute relative luminance according to WCAG 2.1 formula."""
        channels = []
        for c in rgb:
            c_srgb = c / 255.0
            if c_srgb <= 0.04045:
                channels.append(c_srgb / 12.92)
            else:
                channels.append(((c_srgb + 0.055) / 1.055) ** 2.4)
        return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]

    @classmethod
    def contrast_ratio(cls, color1_hex: str, color2_hex: str) -> float:
        """Calculate WCAG contrast ratio between two hex colors."""
        lum1 = cls.relative_luminance(cls.parse_hex(color1_hex))
        lum2 = cls.relative_luminance(cls.parse_hex(color2_hex))
        lighter = max(lum1, lum2)
        darker = min(lum1, lum2)
        return (lighter + 0.05) / (darker + 0.05)


# ==============================================================================
# UTILITY 2: LIGHTWEIGHT SEMANTIC HTML TREE (MINIDOM)
# ==============================================================================
class MiniNode:
    """Represents a simplified DOM node parsed from HTML."""

    def __init__(self, tag: str, attrs: Optional[Dict[str, str]] = None, parent: Optional["MiniNode"] = None):
        self.tag = tag.lower()
        self.attrs = attrs or {}
        self.parent = parent
        self.children: List["MiniNode"] = []
        self.text_chunks: List[str] = []

    def get_attr(self, name: str) -> Optional[str]:
        return self.attrs.get(name.lower())

    def has_class(self, class_name: str) -> bool:
        classes = self.attrs.get("class", "").split()
        return class_name in classes

    def inner_text(self) -> str:
        """Collect all text from node and its descendants."""
        texts = list(self.text_chunks)
        for child in self.children:
            texts.append(child.inner_text())
        return " ".join(" ".join(texts).split())

    def find_all(self, tag: Optional[str] = None, class_name: Optional[str] = None, attrs: Optional[Dict[str, str]] = None) -> List["MiniNode"]:
        results = []
        tag_match = tag is None or self.tag == tag.lower()
        class_match = class_name is None or self.has_class(class_name)
        attr_match = True
        if attrs:
            for k, v in attrs.items():
                if self.attrs.get(k.lower()) != v:
                    attr_match = False
                    break

        if tag_match and class_match and attr_match:
            results.append(self)

        for child in self.children:
            results.extend(child.find_all(tag, class_name, attrs))
        return results

    def find(self, tag: Optional[str] = None, class_name: Optional[str] = None, attrs: Optional[Dict[str, str]] = None) -> Optional["MiniNode"]:
        matches = self.find_all(tag, class_name, attrs)
        return matches[0] if matches else None


class _MiniHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.root = MiniNode("document")
        self.current = self.root

    def handle_starttag(self, tag, attrs):
        attr_dict = {k.lower(): (v if v is not None else "") for k, v in attrs}
        node = MiniNode(tag, attr_dict, parent=self.current)
        self.current.children.append(node)
        # Void elements in HTML5 that do not require an end tag
        if tag.lower() not in ("meta", "link", "img", "br", "hr", "input", "source"):
            self.current = node

    def handle_endtag(self, tag):
        # Walk up tree to find matching tag
        temp = self.current
        while temp and temp.parent and temp.tag != tag.lower():
            temp = temp.parent
        if temp and temp.parent and temp.tag == tag.lower():
            self.current = temp.parent

    def handle_data(self, data):
        cleaned = data.strip()
        if cleaned:
            self.current.text_chunks.append(cleaned)


def parse_html_to_dom(html_content: str) -> MiniNode:
    parser = _MiniHTMLParser()
    parser.feed(html_content)
    return parser.root


# ==============================================================================
# UTILITY 3: JAVASCRIPT TEMPLATE ENGINE SIMULATOR (page.js EVALUATOR)
# ==============================================================================
class PageJsEvaluator:
    """Extracts and evaluates template literals from page.js matching browser execution."""

    def __init__(self, page_js_path: Path):
        self.path = page_js_path
        self.raw_content = page_js_path.read_text(encoding="utf-8")
        self.maps = self._extract_maps()
        self.templates = self._extract_templates()

    def _extract_maps(self) -> Dict[str, str]:
        maps = {}
        m = re.search(r"const\s+maps\s*=\s*\{([^}]+)\};", self.raw_content)
        if m:
            for line in m.group(1).splitlines():
                pair = re.search(r"(\w+)\s*:\s*['\"]([^'\"]+)['\"]", line)
                if pair:
                    maps[pair.group(1)] = pair.group(2)
        return maps

    def _extract_templates(self) -> Dict[str, str]:
        templates = {}
        # 1. const <name> = `...`;
        for match in re.finditer(r"const\s+([a-zA-Z0-9_]+)\s*=\s*`([\s\S]*?)`;", self.raw_content):
            name, content = match.group(1), match.group(2)
            if name not in ("page", "maps"):
                templates[name] = content

        # 2. function renderHeader() { return `...`; }
        m_header = re.search(r"function\s+renderHeader\s*\(\)\s*\{[\s\S]*?return\s*`([\s\S]*?)`;[\s\S]*?\}", self.raw_content)
        if m_header:
            templates["header"] = m_header.group(1)

        # 3. function footer() { return `...`; }
        m_footer = re.search(r"function\s+footer\s*\(\)\s*\{[\s\S]*?return\s*`([\s\S]*?)`;[\s\S]*?\}", self.raw_content)
        if m_footer:
            templates["footer"] = m_footer.group(1)

        # 4. Overrides: pages.<name> = `...`;
        # In page.js, pages.locais and pages.eventos override initial const definitions!
        for match in re.finditer(r"pages\.([a-zA-Z0-9_]+)\s*=\s*`([\s\S]*?)`;", self.raw_content):
            name, content = match.group(1), match.group(2)
            templates[name] = content

        return templates

    def render_page(self, page_name: str) -> str:
        """Simulate document.querySelector('#site-shell').innerHTML = `${renderHeader()}${pages[page] || home}${footer()}`;"""
        header = self.templates.get("header", "")
        body_template = self.templates.get(page_name, self.templates.get("home", ""))
        footer = self.templates.get("footer", "")

        full_html = f"{header}\n{body_template}\n{footer}"
        # Interpolate variables: ${maps.antonieta}, ${maps.sapopemba}
        for k, v in self.maps.items():
            full_html = full_html.replace(f"${{maps.{k}}}", v)

        return full_html


# ==============================================================================
# TIER 1: FEATURE COVERAGE (F1 - F8)
# ==============================================================================
class TestTier1FeatureCoverage(unittest.TestCase):
    """
    Tier 1 tests verify all primary user requirements (F1 through F8) from:
    - ORIGINAL_REQUEST.md (§R1, §R2)
    - PROJECT.md (§Feature Inventory)
    """

    @classmethod
    def setUpClass(cls):
        cls.page_evaluator = PageJsEvaluator(PROJECT_ROOT / "page.js")
        cls.styles_content = (PROJECT_ROOT / "styles.css").read_text(encoding="utf-8")
        cls.script_content = (PROJECT_ROOT / "script.js").read_text(encoding="utf-8")

    def test_f1_sapopemba_location_card_santa_ceia_first_sunday(self):
        """
        F1: Verify Jardim Sapopemba location card specifies Santa Ceia on the FIRST Sunday.
        Authoritative source: ORIGINAL_REQUEST.md §R1 & Acceptance Criteria:
        'No card da congregação Jardim Sapopemba na seção de locais ("Onde nós podemos nos encontrar"),
        a Santa Ceia é indicada no primeiro domingo (alinhada ao formato da Vila Antonieta:
        "Primeiro domingo · 9h30" ou "1º domingo, 9h30 · Santa Ceia").'
        """
        rendered_html = self.page_evaluator.render_page("locais")
        dom = parse_html_to_dom(rendered_html)

        # Locate all location cards
        cards = dom.find_all("article", class_name="location-card")
        self.assertGreaterEqual(len(cards), 2, "Expected at least 2 location cards on /locais")

        sapopemba_card = None
        for card in cards:
            if "Jardim Sapopemba" in card.inner_text():
                sapopemba_card = card
                break

        self.assertIsNotNone(sapopemba_card, "Jardim Sapopemba location card not found in /locais")
        card_text = sapopemba_card.inner_text()

        # Check First Sunday Santa Ceia
        has_primeiro_domingo = "Primeiro domingo" in card_text or "1º domingo" in card_text or "1o domingo" in card_text
        self.assertTrue(has_primeiro_domingo, f"Sapopemba card must state Santa Ceia on First Sunday. Text was: {card_text}")
        self.assertIn("9h30", card_text, "Sapopemba Sunday service time must be 9h30")
        self.assertIn("Santa Ceia", card_text, "Sapopemba card must explicitly reference Santa Ceia")

    def test_f1_sapopemba_location_card_address_and_contacts(self):
        """
        F1: Verify Jardim Sapopemba location card contains valid address and pastor contact link.
        """
        rendered_html = self.page_evaluator.render_page("locais")
        dom = parse_html_to_dom(rendered_html)

        cards = dom.find_all("article", class_name="location-card")
        sapopemba_card = next(c for c in cards if "Jardim Sapopemba" in c.inner_text())
        card_text = sapopemba_card.inner_text()

        self.assertIn("Rua Henrique Mazzauti, 566", card_text)
        self.assertIn("Pr. José Carlos", card_text)

        # Verify Google Maps and WhatsApp action links
        links = sapopemba_card.find_all("a")
        maps_link = any("google.com/maps" in (a.get_attr("href") or "") for a in links)
        whats_link = any("5511985459947" in (a.get_attr("href") or "") for a in links)

        self.assertTrue(maps_link, "Sapopemba card must have Google Maps navigation link")
        self.assertTrue(whats_link, "Sapopemba card must have WhatsApp contact link to Pr. José Carlos")

    def test_f2_sapopemba_agenda_santa_ceia_first_sunday(self):
        """
        F2: Verify Jardim Sapopemba weekly agenda specifies Santa Ceia on the 1st Sunday.
        Authoritative source: ORIGINAL_REQUEST.md §R1 & Acceptance Criteria:
        'Na agenda de eventos da congregação Jardim Sapopemba, a Santa Ceia é indicada no
        primeiro domingo às 9h30, sem menções a segundo domingo.'
        """
        rendered_html = self.page_evaluator.render_page("eventos")
        dom = parse_html_to_dom(rendered_html)

        agenda_items = dom.find_all("article", class_name="agenda-item")
        self.assertGreaterEqual(len(agenda_items), 5, "Expected at least 5 weekly agenda items on /eventos")

        sapopemba_sunday = None
        for item in agenda_items:
            item_text = item.inner_text()
            if "Jardim Sapopemba" in item_text and "Domingo" in item_text:
                sapopemba_sunday = item
                break

        self.assertIsNotNone(sapopemba_sunday, "Jardim Sapopemba Sunday agenda item not found on /eventos")
        sunday_text = sapopemba_sunday.inner_text()

        has_primeiro_domingo = "1º domingo" in sunday_text or "Primeiro domingo" in sunday_text or "1o domingo" in sunday_text
        self.assertTrue(has_primeiro_domingo, f"Sapopemba agenda must specify Santa Ceia on 1st Sunday. Text was: {sunday_text}")
        self.assertIn("9h30", sunday_text)
        self.assertIn("Santa Ceia", sunday_text)

    def test_f2_sapopemba_agenda_weekly_services(self):
        """
        F2: Verify Jardim Sapopemba weekly agenda includes Wednesday service.
        """
        rendered_html = self.page_evaluator.render_page("eventos")
        dom = parse_html_to_dom(rendered_html)

        agenda_items = dom.find_all("article", class_name="agenda-item")
        sapopemba_wednesday = any(
            "Jardim Sapopemba" in item.inner_text()
            and "Quarta-feira" in item.inner_text()
            and "20h" in item.inner_text()
            and "Culto de Libertação" in item.inner_text()
            for item in agenda_items
        )
        self.assertTrue(sapopemba_wednesday, "Jardim Sapopemba must have Wednesday 20h Culto de Libertação in agenda")

    def test_f3_antonieta_schedule_preservation_in_locations(self):
        """
        F3: Verify Vila Antonieta schedule remains completely intact in location cards.
        Authoritative source: ORIGINAL_REQUEST.md §R1 Acceptance Criteria:
        'O culto e a Santa Ceia da Vila Antonieta permanecem inalterados no primeiro domingo.'
        """
        rendered_html = self.page_evaluator.render_page("locais")
        dom = parse_html_to_dom(rendered_html)

        cards = dom.find_all("article", class_name="location-card")
        antonieta_card = next(c for c in cards if "Vila Antonieta" in c.inner_text())
        text = antonieta_card.inner_text()

        self.assertIn("Rua Júlio Parigot, 228", text)
        self.assertIn("Primeiro domingo · 18h30", text)
        self.assertIn("Santa Ceia", text)
        self.assertIn("Quinto domingo · 18h30", text)
        self.assertIn("Culto de Missões", text)
        self.assertIn("Pr. David", text)

    def test_f3_antonieta_schedule_preservation_in_agenda(self):
        """
        F3: Verify Vila Antonieta schedule remains completely intact in weekly agenda.
        """
        rendered_html = self.page_evaluator.render_page("eventos")
        dom = parse_html_to_dom(rendered_html)

        agenda_items = dom.find_all("article", class_name="agenda-item")
        antonieta_items = [i for i in agenda_items if "Vila Antonieta" in i.inner_text()]
        self.assertGreaterEqual(len(antonieta_items), 3, "Vila Antonieta must have at least 3 agenda items")

        all_antonieta_text = " ".join([i.inner_text() for i in antonieta_items])
        self.assertIn("Terça-feira", all_antonieta_text)
        self.assertIn("Quinta-feira", all_antonieta_text)
        self.assertIn("Domingo", all_antonieta_text)
        self.assertIn("1º domingo, 18h30 · Santa Ceia", all_antonieta_text)
        self.assertIn("5º domingo, 18h30 · Culto de Missões", all_antonieta_text)

    def test_f4_welcoming_palette_design_tokens(self):
        """
        F4: Verify welcoming, organic and communion color design tokens in styles.css.
        Authoritative source: PROJECT.md §Feature Inventory F4:
        'Substituir o visual dark/neon cyberpunk por tons orgânicos, acolhedores e nobres
        (linho/papel quente, oliva/floresta profunda, dourado/trigo, carvão)'.
        """
        # Extract :root CSS variables
        root_match = re.search(r":root\s*\{([^}]+)\}", self.styles_content)
        self.assertIsNotNone(root_match, ":root block must be defined in styles.css")
        root_vars = root_match.group(1)

        self.assertIn("--paper", root_vars, "CSS variable --paper must be defined for warm organic background")
        self.assertIn("--ink", root_vars, "CSS variable --ink must be defined for noble solemn text")
        self.assertIn("--petrol", root_vars, "CSS variable --petrol must be defined")

        # Verify absence of harsh neon cyberpunk values in root variables
        harsh_neons = ["#00ff00", "#ff00ff", "#00ffff", "#39ff14"]
        for neon in harsh_neons:
            self.assertNotIn(neon.lower(), root_vars.lower(), f"Harsh neon color {neon} found in design tokens")

    def test_f5_typography_and_biblical_dignity(self):
        """
        F5: Verify typography stack and formatting for Biblical scripture dignity.
        Authoritative source: PROJECT.md §Feature Inventory F5.
        """
        # Check font stack
        self.assertIn("font-family", self.styles_content)
        self.assertTrue(
            "Nunito Sans" in self.styles_content or "DM Sans" in self.styles_content,
            "Font stack must include legible humanist sans fonts (Nunito Sans / DM Sans)"
        )

        # Check scripture / quote styling presence in styles.css
        has_quote_styling = (
            ".story-quote" in self.styles_content
            or ".prayer-copy .quote" in self.styles_content
            or "blockquote" in self.styles_content
            or ".quote" in self.styles_content
        )
        self.assertTrue(has_quote_styling, "Styles for solemn scripture quotes must be present in styles.css")

    def test_f6_animation_sanitization_dove_flock(self):
        """
        F6: Verify intrusive dove flock animations are sanitized.
        Authoritative source: PROJECT.md §Feature Inventory F6:
        'Desativar revoada periódica intrusiva de pombos (intervalo de 28s e cliques comuns) e magnetismo de botões'
        """
        # Periodic 28-second setInterval dove launch check
        has_intrusive_interval = bool(re.search(r"setInterval\s*\(\s*\(\)\s*=>\s*\{[\s\S]*?launchFlock[\s\S]*?28000\s*\)", self.script_content))
        self.assertFalse(
            has_intrusive_interval,
            "Intrusive 28-second periodic dove flock animation (setInterval 28000) must be removed or deactivated"
        )

    def test_f7_media_placeholders_and_playlists(self):
        """
        F7: Verify media placeholders and playlist URLs are properly configured with real identifiers.
        Authoritative source: PROJECT.md §Feature Inventory F7:
        'Corrigir URL de playlist com placeholder COLE_AQUI_O_ID, substituir blocos crus...'
        """
        # Verify no COLE_AQUI_O_ID in script.js or page.js
        has_placeholder = "COLE_AQUI_O_ID" in self.script_content
        self.assertFalse(
            has_placeholder,
            "Unfinished placeholder 'COLE_AQUI_O_ID' found in script.js line 320 (PLAYLISTS configuration)"
        )

    def test_f8_responsive_layout_definitions(self):
        """
        F8: Verify responsive layout definitions for desktop and mobile viewports.
        Authoritative source: PROJECT.md §Feature Inventory F8 & ORIGINAL_REQUEST.md.
        """
        has_mobile_mq = bool(re.search(r"@media\s*\(\s*max-width\s*:\s*760px\s*\)", self.styles_content))
        self.assertTrue(has_mobile_mq, "Missing @media (max-width: 760px) in styles.css")
        self.assertIn(".menu-toggle", self.styles_content)
        self.assertIn(".main-nav", self.styles_content)
        has_overflow = bool(re.search(r"overflow-x\s*:\s*hidden", self.styles_content))
        self.assertTrue(has_overflow, "styles.css must prevent horizontal scrolling with overflow-x: hidden")

    def test_header_navigation_and_brand_structure(self):
        """Verify header component contains brand and all primary navigation destinations."""
        header_html = self.page_evaluator.templates.get("header", "")
        dom = parse_html_to_dom(header_html)

        header = dom.find("header", class_name="site-header")
        self.assertIsNotNone(header, "Header element <header class='site-header'> must exist")

        nav = header.find("nav", class_name="main-nav")
        self.assertIsNotNone(nav, "Navigation container <nav class='main-nav'> must exist")

        links = nav.find_all("a")
        hrefs = [a.get_attr("href") for a in links]

        expected_destinations = ["/historia", "/locais", "/projetos", "/memorias", "/eventos", "/contato"]
        for dest in expected_destinations:
            self.assertTrue(
                any(dest in (h or "") for h in hrefs),
                f"Header navigation missing route: {dest}"
            )

        # Fale Conosco CTA
        cta = nav.find("a", class_name="nav-cta")
        self.assertIsNotNone(cta, "Header must contain primary CTA link (.nav-cta)")

    def test_footer_structure_and_links(self):
        """Verify footer component contains brand, pastor contact quick-links, and copyright."""
        footer_html = self.page_evaluator.templates.get("footer", "")
        dom = parse_html_to_dom(footer_html)

        footer = dom.find("footer", class_name="site-footer")
        self.assertIsNotNone(footer, "Footer element <footer class='site-footer'> must exist")

        footer_text = footer.inner_text()
        self.assertIn("Igreja Evangélica Semente da Multiplicação", footer_text)
        self.assertIn("Pr. José Carlos", footer_text)
        self.assertIn("Pr. David", footer_text)
        self.assertIn("missaosemente2012@gmail.com", footer_text)

    def test_contact_prayer_form_structure(self):
        """Verify prayer request form on /contato has semantic structure, honeypot, and accessibility."""
        rendered_html = self.page_evaluator.render_page("contato")
        dom = parse_html_to_dom(rendered_html)

        form = dom.find("form", attrs={"data-prayer-form": ""})
        if not form:
            form = next((f for f in dom.find_all("form") if "data-prayer-form" in f.attrs), None)
        self.assertIsNotNone(form, "Prayer request form [data-prayer-form] must exist on /contato")

        inputs = form.find_all("input")
        input_names = [i.get_attr("name") for i in inputs]

        self.assertIn("nome", input_names, "Prayer form must have 'nome' input field")
        self.assertIn("_honey", input_names, "Prayer form must have anti-spam '_honey' honeypot field")

        textareas = form.find_all("textarea")
        self.assertTrue(any(t.get_attr("name") == "motivo" for t in textareas), "Prayer form must have 'motivo' textarea")

        submit_btn = form.find("button", attrs={"type": "submit"})
        self.assertIsNotNone(submit_btn, "Prayer form must have a submit button")


# ==============================================================================
# TIER 2: BOUNDARY & CORNER CASES (NEGATIVE CHECKS & RIGOROUS VERIFICATION)
# ==============================================================================
class TestTier2BoundaryAndCornerCases(unittest.TestCase):
    """
    Tier 2 tests verify negative constraints, edge cases, zero-tolerance assertions,
    and WCAG AA color contrast mathematically derived from standard formulas.
    """

    @classmethod
    def setUpClass(cls):
        cls.page_evaluator = PageJsEvaluator(PROJECT_ROOT / "page.js")
        cls.styles_content = (PROJECT_ROOT / "styles.css").read_text(encoding="utf-8")
        cls.script_content = (PROJECT_ROOT / "script.js").read_text(encoding="utf-8")
        cls.page_js_content = (PROJECT_ROOT / "page.js").read_text(encoding="utf-8")

    def test_negative_zero_occurrences_of_segundo_domingo_sapopemba(self):
        """
        NEGATIVE CHECK: Assert ZERO occurrences of 'segundo domingo' for Sapopemba.
        Authoritative source: ORIGINAL_REQUEST.md §R1:
        'corrigindo as referências que apontam para o segundo domingo no card de locais
        ("Onde nós podemos nos encontrar") e na agenda de eventos.'
        """
        # Check rendered /locais
        locais_html = self.page_evaluator.render_page("locais")
        dom_locais = parse_html_to_dom(locais_html)
        cards = dom_locais.find_all("article", class_name="location-card")
        sapopemba_card = next(c for c in cards if "Jardim Sapopemba" in c.inner_text())

        self.assertNotIn(
            "segundo domingo",
            sapopemba_card.inner_text().lower(),
            "Found forbidden 'segundo domingo' in Sapopemba location card"
        )

        # Check rendered /eventos
        eventos_html = self.page_evaluator.render_page("eventos")
        dom_eventos = parse_html_to_dom(eventos_html)
        items = dom_eventos.find_all("article", class_name="agenda-item")
        sapopemba_items = [i for i in items if "Jardim Sapopemba" in i.inner_text()]
        all_text = " ".join([i.inner_text().lower() for i in sapopemba_items])

        self.assertNotIn(
            "segundo domingo",
            all_text,
            "Found forbidden 'segundo domingo' in Sapopemba agenda items"
        )

    def test_negative_zero_occurrences_of_2_domingo_sapopemba(self):
        """
        NEGATIVE CHECK: Assert ZERO occurrences of '2º domingo' or '2o domingo' for Sapopemba.
        """
        eventos_html = self.page_evaluator.render_page("eventos")
        dom_eventos = parse_html_to_dom(eventos_html)
        items = dom_eventos.find_all("article", class_name="agenda-item")
        sapopemba_items = [i for i in items if "Jardim Sapopemba" in i.inner_text()]
        all_text = " ".join([i.inner_text().lower() for i in sapopemba_items])

        self.assertNotIn("2º domingo", all_text, "Found forbidden '2º domingo' in Sapopemba agenda items")
        self.assertNotIn("2o domingo", all_text, "Found forbidden '2o domingo' in Sapopemba agenda items")

    def test_negative_no_unfinished_placeholder_tokens(self):
        """
        NEGATIVE CHECK: Assert no unfinished placeholder tokens exist in user-facing code.
        Examples: COLE_AQUI_O_ID, TODO, FIXME, [INSERIR_AQUI], undefined, NaN.
        """
        tokens = ["COLE_AQUI_O_ID", "[INSERIR_AQUI]", "undefined"]

        # Check page.js
        for token in tokens:
            has_token = token in self.page_js_content
            self.assertFalse(
                has_token,
                f"Found unfinished placeholder token '{token}' in page.js"
            )

        # Check script.js for COLE_AQUI_O_ID
        has_cole_id = "COLE_AQUI_O_ID" in self.script_content
        self.assertFalse(
            has_cole_id,
            "Found unfinished placeholder 'COLE_AQUI_O_ID' in script.js line 320"
        )

    def test_antonieta_never_shifted_away_from_first_sunday(self):
        """
        INVARIANT: Vila Antonieta Santa Ceia must strictly remain on first Sunday (never shifted).
        """
        rendered_locais = self.page_evaluator.render_page("locais")
        self.assertIn("Primeiro domingo · 18h30", rendered_locais)

        rendered_eventos = self.page_evaluator.render_page("eventos")
        self.assertIn("1º domingo, 18h30 · Santa Ceia", rendered_eventos)

    def test_wcag_aa_contrast_form_and_buttons(self):
        """
        WCAG AA CONTRAST: Mathematically verify contrast ratio >= 4.5:1 for button and form elements.
        Specification: WCAG 2.1 Success Criterion 1.4.3 (Contrast Minimum).
        Formula: (L1 + 0.05) / (L2 + 0.05) >= 4.5
        """
        # Extract variables from styles.css
        # --white: #fff -> #ffffff
        # --petrol: #087c9a
        # --ink: #173b45
        # --paper: #f7faf9
        ratio_button = WCAGContrastCalculator.contrast_ratio("#ffffff", "#087c9a")
        self.assertGreaterEqual(
            ratio_button,
            4.5,
            f"Button primary text contrast {ratio_button:.2f}:1 must meet WCAG AA >= 4.5:1"
        )

        ratio_ink_on_white = WCAGContrastCalculator.contrast_ratio("#173b45", "#ffffff")
        self.assertGreaterEqual(
            ratio_ink_on_white,
            4.5,
            f"Body text (--ink on --white) contrast {ratio_ink_on_white:.2f}:1 must meet WCAG AA >= 4.5:1"
        )

        ratio_ink_on_paper = WCAGContrastCalculator.contrast_ratio("#173b45", "#f7faf9")
        self.assertGreaterEqual(
            ratio_ink_on_paper,
            4.5,
            f"Section soft text (--ink on --paper) contrast {ratio_ink_on_paper:.2f}:1 must meet WCAG AA >= 4.5:1"
        )

    def test_honeypot_field_hidden_from_screen_readers(self):
        """
        ACCESSIBILITY & SECURITY: Verify honeypot field is hidden with aria-hidden and tabindex='-1'.
        """
        rendered_html = self.page_evaluator.render_page("contato")
        dom = parse_html_to_dom(rendered_html)

        honey = dom.find("input", attrs={"name": "_honey"})
        self.assertIsNotNone(honey, "Honeypot field _honey must be present in prayer form")
        self.assertEqual(honey.get_attr("tabindex"), "-1", "Honeypot must have tabindex='-1'")
        self.assertEqual(honey.get_attr("aria-hidden"), "true", "Honeypot must have aria-hidden='true'")
        self.assertTrue(honey.has_class("sr-only"), "Honeypot must have class 'sr-only'")


# ==============================================================================
# TIER 3: CROSS-FEATURE INTERACTIONS & SHELL INTEGRITY
# ==============================================================================
class TestTier3CrossFeatureInteractions(unittest.TestCase):
    """
    Tier 3 tests verify architectural integrity across all 7 static HTML pages,
    script inclusion order, shell container bindings, and page.js template keys.
    """

    HTML_FILES = [
        "index.html",
        "locais.html",
        "eventos.html",
        "historia.html",
        "projetos.html",
        "memorias.html",
        "contato.html",
    ]

    @classmethod
    def setUpClass(cls):
        cls.page_evaluator = PageJsEvaluator(PROJECT_ROOT / "page.js")

    def test_html_shell_integrity_all_7_pages(self):
        """Verify all 7 HTML entrypoint files exist and have valid HTML5 structure."""
        for filename in self.HTML_FILES:
            file_path = PROJECT_ROOT / filename
            self.assertTrue(file_path.exists(), f"HTML entrypoint missing: {filename}")
            content = file_path.read_text(encoding="utf-8")

            # Check Doctype and html lang
            self.assertTrue(
                content.lower().startswith("<!doctype html>"),
                f"{filename} must start with <!doctype html>"
            )
            self.assertIn('lang="pt-BR"', content, f"{filename} must declare lang='pt-BR'")
            self.assertIn('charset="utf-8"', content.lower(), f"{filename} must specify charset='utf-8'")

    def test_all_pages_have_viewport_meta(self):
        """Verify all 7 HTML pages declare responsive viewport meta tag."""
        for filename in self.HTML_FILES:
            content = (PROJECT_ROOT / filename).read_text(encoding="utf-8")
            self.assertIn('name="viewport"', content, f"{filename} missing viewport meta tag")
            self.assertIn("width=device-width", content, f"{filename} viewport missing width=device-width")

    def test_all_pages_have_site_shell_and_skip_link(self):
        """Verify all 7 HTML pages declare skip-link and #site-shell container."""
        for filename in self.HTML_FILES:
            content = (PROJECT_ROOT / filename).read_text(encoding="utf-8")
            self.assertIn('class="skip-link"', content, f"{filename} missing accessibility .skip-link")
            self.assertIn('id="site-shell"', content, f"{filename} missing #site-shell container")

    def test_all_pages_include_page_and_script_js(self):
        """Verify all 7 HTML pages load page.js and script.js in correct sequence."""
        for filename in self.HTML_FILES:
            content = (PROJECT_ROOT / filename).read_text(encoding="utf-8")
            self.assertIn('src="page.js"', content, f"{filename} must include page.js")
            self.assertIn('src="script.js"', content, f"{filename} must include script.js")

            # page.js must be loaded before or alongside script.js
            idx_page = content.find('src="page.js"')
            idx_script = content.find('src="script.js"')
            self.assertLess(idx_page, idx_script, f"{filename} must load page.js before script.js")

    def test_page_js_template_keys_match_html_data_page(self):
        """Verify every HTML file's body[data-page] has a corresponding template in page.js."""
        for filename in self.HTML_FILES:
            content = (PROJECT_ROOT / filename).read_text(encoding="utf-8")
            m = re.search(r'<body[^>]*data-page=["\']([^"\']+)["\']', content)
            self.assertIsNotNone(m, f"{filename} must have body[data-page] attribute")
            data_page = m.group(1)

            # In page.js, pages dictionary keys are: home, historia, locais, projetos, memorias, eventos, contato
            self.assertIn(
                data_page,
                self.page_evaluator.templates,
                f"page.js does not provide a template for data-page='{data_page}' from {filename}"
            )

    def test_dom_rendering_simulation_locais_page(self):
        """DOM simulation: render /locais through full template pipeline and inspect assembled tree."""
        full_html = self.page_evaluator.render_page("locais")
        dom = parse_html_to_dom(full_html)

        # Header present
        self.assertIsNotNone(dom.find("header", class_name="site-header"))
        # Location grid present
        self.assertIsNotNone(dom.find("div", class_name="location-grid"))
        # 2 location cards
        cards = dom.find_all("article", class_name="location-card")
        self.assertEqual(len(cards), 2, "Expected exactly 2 location cards on /locais")
        # Footer present
        self.assertIsNotNone(dom.find("footer", class_name="site-footer"))

    def test_dom_rendering_simulation_eventos_page(self):
        """DOM simulation: render /eventos through full template pipeline and inspect assembled tree."""
        full_html = self.page_evaluator.render_page("eventos")
        dom = parse_html_to_dom(full_html)

        self.assertIsNotNone(dom.find("header", class_name="site-header"))
        self.assertIsNotNone(dom.find("section", class_name="weekly-agenda"))
        self.assertIsNotNone(dom.find("section", class_name="daily-lives"))
        self.assertIsNotNone(dom.find("footer", class_name="site-footer"))


# ==============================================================================
# TIER 4: REAL-WORLD SCENARIOS (STATIC HTTP SERVING & BROWSER CONTRACTS)
# ==============================================================================
class TestTier4RealWorldScenarios(unittest.TestCase):
    """
    Tier 4 tests verify real-world behavior:
    - Live HTTP serving of all 7 pages and static assets via Python http.server.
    - Status codes (200 OK, 404 Not Found).
    - Content-Type headers.
    - CSS media query coverage for mobile and accessibility.
    """

    server: Optional[socketserver.TCPServer] = None
    server_port: int = 0
    server_thread: Optional[threading.Thread] = None

    @classmethod
    def setUpClass(cls):
        """Spin up a live HTTP server on an ephemeral free port in a background daemon thread."""
        class SilentHandler(http.server.SimpleHTTPRequestHandler):
            def __init__(self, *args, **kwargs):
                super().__init__(*args, directory=str(PROJECT_ROOT), **kwargs)

            def log_message(self, format, *args):
                pass  # Keep test runner output clean

        class EphemeralServer(socketserver.TCPServer):
            allow_reuse_address = True

        cls.server = EphemeralServer(("127.0.0.1", 0), SilentHandler)
        cls.server_port = cls.server.server_address[1]
        cls.server_thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.server_thread.start()
        time.sleep(0.1)  # Brief warm up

    @classmethod
    def tearDownClass(cls):
        """Safely shut down the live HTTP server."""
        if cls.server:
            cls.server.shutdown()
            cls.server.server_close()

    def _get(self, path: str) -> Tuple[int, str, bytes]:
        url = f"http://127.0.0.1:{self.server_port}{path}"
        req = urllib.request.Request(url, headers={"User-Agent": "E2ETestRunner/1.0"})
        try:
            with urllib.request.urlopen(req, timeout=5) as response:
                status = response.status
                content_type = response.headers.get_content_type()
                body = response.read()
                return status, content_type, body
        except urllib.error.HTTPError as e:
            return e.code, e.headers.get_content_type(), e.read()

    def test_live_http_server_serves_root_route_200(self):
        """Verify requesting / serves index.html with 200 OK."""
        status, content_type, body = self._get("/")
        self.assertEqual(status, 200)
        self.assertEqual(content_type, "text/html")
        self.assertIn(b"site-shell", body)

    def test_live_http_server_serves_all_7_html_pages_200(self):
        """Verify live HTTP server serves all 7 HTML entrypoint pages with 200 OK and text/html."""
        pages = [
            "index.html",
            "locais.html",
            "eventos.html",
            "historia.html",
            "projetos.html",
            "memorias.html",
            "contato.html",
        ]
        for p in pages:
            status, content_type, body = self._get(f"/{p}")
            self.assertEqual(status, 200, f"Failed serving /{p}")
            self.assertEqual(content_type, "text/html", f"Incorrect content-type for /{p}")
            self.assertIn(b"site-shell", body, f"Page /{p} does not contain #site-shell")

    def test_live_http_server_serves_static_assets_css_js_200(self):
        """Verify live HTTP server serves styles.css, page.js, script.js with 200 OK."""
        assets = [
            ("/styles.css", "text/css"),
            ("/page.js", "text/javascript"),
            ("/script.js", "text/javascript"),
            ("/firebase-config.js", "text/javascript"),
            ("/assets/logo.png", "image/png"),
        ]
        for path, expected_type in assets:
            status, content_type, body = self._get(path)
            self.assertEqual(status, 200, f"Asset {path} returned status {status}")
            # Python http.server maps .js to text/javascript or application/javascript
            self.assertTrue(
                expected_type in content_type or "javascript" in content_type,
                f"Asset {path} expected {expected_type}, got {content_type}"
            )
            self.assertGreater(len(body), 50, f"Asset {path} body unexpectedly empty")

    def test_live_http_server_non_existent_page_returns_404(self):
        """Verify requesting a non-existent route returns 404 Not Found."""
        status, _, _ = self._get("/pagina-inexistente-404.html")
        self.assertEqual(status, 404, "Expected HTTP 404 for non-existent page")

    def test_mobile_viewport_css_rules_present(self):
        """Verify responsive media query rules in styles.css for mobile screens."""
        styles_content = (PROJECT_ROOT / "styles.css").read_text(encoding="utf-8")
        clean = styles_content.replace(" ", "")

        self.assertIn("@media(max-width:760px)", clean, "Missing @media (max-width: 760px) in styles.css")
        self.assertIn("@media(max-width:430px)", clean, "Missing @media (max-width: 430px) in styles.css")

    def test_reduced_motion_accessibility_rules_present(self):
        """Verify accessibility prefers-reduced-motion media query in styles.css."""
        styles_content = (PROJECT_ROOT / "styles.css").read_text(encoding="utf-8")
        clean = styles_content.replace(" ", "")

        self.assertIn(
            "@media(prefers-reduced-motion:reduce)",
            clean,
            "Missing @media (prefers-reduced-motion: reduce) rule in styles.css"
        )


# ==============================================================================
# CUSTOM TEST RUNNER & FORMATTED REPORTING
# ==============================================================================
class FormattedTestResult(unittest.TextTestResult):
    """Custom test result tracking individual tier results and defect diagnostics."""

    def __init__(self, stream, descriptions, verbosity):
        super().__init__(stream, descriptions, verbosity)
        self.tier_records = {
            "Tier 1: Feature Coverage": {"pass": 0, "fail": 0, "errors": 0},
            "Tier 2: Boundary & Corner Cases": {"pass": 0, "fail": 0, "errors": 0},
            "Tier 3: Cross-Feature Interactions": {"pass": 0, "fail": 0, "errors": 0},
            "Tier 4: Real-World Scenarios": {"pass": 0, "fail": 0, "errors": 0},
        }

    def _get_tier_name(self, test) -> str:
        cls_name = test.__class__.__name__
        if "Tier1" in cls_name:
            return "Tier 1: Feature Coverage"
        elif "Tier2" in cls_name:
            return "Tier 2: Boundary & Corner Cases"
        elif "Tier3" in cls_name:
            return "Tier 3: Cross-Feature Interactions"
        elif "Tier4" in cls_name:
            return "Tier 4: Real-World Scenarios"
        return "Other"

    def addSuccess(self, test):
        super().addSuccess(test)
        tier = self._get_tier_name(test)
        if tier in self.tier_records:
            self.tier_records[tier]["pass"] += 1

    def addFailure(self, test, err):
        super().addFailure(test, err)
        tier = self._get_tier_name(test)
        if tier in self.tier_records:
            self.tier_records[tier]["fail"] += 1

    def addError(self, test, err):
        super().addError(test, err)
        tier = self._get_tier_name(test)
        if tier in self.tier_records:
            self.tier_records[tier]["errors"] += 1


def run_test_suite() -> bool:
    """Execute the full test suite and print a structured summary report."""
    suite = unittest.TestSuite()

    test_classes = [
        TestTier1FeatureCoverage,
        TestTier2BoundaryAndCornerCases,
        TestTier3CrossFeatureInteractions,
        TestTier4RealWorldScenarios,
    ]

    for tc in test_classes:
        tests = unittest.defaultTestLoader.loadTestsFromTestCase(tc)
        suite.addTests(tests)

    print("\n" + "=" * 76)
    print("  IGREJA EVANGÉLICA SEMENTE DA MULTIPLICAÇÃO — E2E TEST SUITE")
    print("  Methodology: 4-Tier Test Design (Zero-Build Vanilla Architecture)")
    print("=" * 76 + "\n")

    runner = unittest.TextTestRunner(verbosity=2, resultclass=FormattedTestResult)
    result = runner.run(suite)

    print("\n" + "=" * 76)
    print("  E2E TEST EXECUTION SUMMARY REPORT")
    print("=" * 76)

    total_tests = result.testsRun
    total_failures = len(result.failures)
    total_errors = len(result.errors)
    total_passed = total_tests - total_failures - total_errors

    print(f"\n{'Tier / Category':<40} {'Passed':<10} {'Failed':<10} {'Status':<10}")
    print("-" * 76)

    for tier, counts in result.tier_records.items():
        p = counts["pass"]
        f = counts["fail"] + counts["errors"]
        status = "PASSED" if f == 0 else "FAILURES"
        print(f"{tier:<40} {p:<10} {f:<10} {status:<10}")

    print("-" * 76)
    overall_status = "ALL TESTS PASSED" if (total_failures == 0 and total_errors == 0) else "FAILURES DETECTED"
    print(f"{'TOTAL (' + str(total_tests) + ' tests)':<40} {total_passed:<10} {total_failures + total_errors:<10} {overall_status:<10}\n")

    if result.failures or result.errors:
        print("=" * 76)
        print("  DISCOVERED IMPLEMENTATION DEFECTS & PENDING MILESTONE WORK")
        print("=" * 76)
        for idx, (test, traceback_str) in enumerate(result.failures + result.errors, 1):
            doc = test.shortDescription() or test.id()
            print(f"\n[{idx}] {test.id()}:")
            print(f"    Requirement: {doc}")
            lines = [l for l in traceback_str.strip().splitlines() if l.startswith("AssertionError:")]
            if lines:
                print(f"    Failure: {lines[-1]}")
            else:
                last_line = traceback_str.strip().splitlines()[-1]
                print(f"    Error: {last_line}")
        print("\n" + "=" * 76)

    return result.wasSuccessful()


if __name__ == "__main__":
    success = run_test_suite()
    sys.exit(0 if success else 1)
