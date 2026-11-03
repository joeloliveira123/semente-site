#!/usr/bin/env python3
import sys
from pathlib import Path
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parent))

class TestSyntaxAndIntegrity(unittest.TestCase):
    def test_brackets_balance(self):
        for fname in ['styles.css', 'script.js', 'page.js']:
            content = Path(fname).read_text(encoding='utf-8')
            stack = []
            pairs = {')': '(', '}': '{', ']': '['}
            in_string = False
            str_char = ''
            in_comment = False
            in_line_comment = False
            in_regex = False

            i = 0
            while i < len(content):
                c = content[i]
                if in_line_comment:
                    if c == '\n':
                        in_line_comment = False
                    i += 1
                    continue
                if in_comment:
                    if c == '*' and i + 1 < len(content) and content[i + 1] == '/':
                        in_comment = False
                        i += 2
                        continue
                    i += 1
                    continue
                if in_string:
                    if c == '\\':
                        i += 2
                        continue
                    elif c == str_char:
                        in_string = False
                    i += 1
                    continue
                if in_regex:
                    if c == '\\':
                        i += 2
                        continue
                    elif c == '/':
                        in_regex = False
                    i += 1
                    continue

                # Check comment starts
                if c == '/' and i + 1 < len(content):
                    if content[i + 1] == '*':
                        in_comment = True
                        i += 2
                        continue
                    elif content[i + 1] == '/' and not fname.endswith('.css'):
                        in_line_comment = True
                        i += 2
                        continue
                    elif not fname.endswith('.css') and (i == 0 or content[i-1] in ('(', '=', ',', ':', '[', '!')):
                        # Regex start
                        in_regex = True
                        i += 1
                        continue

                # Check string starts
                if c in ('"', "'", '`'):
                    in_string = True
                    str_char = c
                    i += 1
                    continue

                if c in ('(', '{', '['):
                    stack.append((c, i))
                elif c in (')', '}', ']'):
                    self.assertTrue(bool(stack), f"Unmatched {c} at {i} in {fname}")
                    top, pos = stack.pop()
                    self.assertEqual(top, pairs[c], f"Mismatched {top} at {pos} with {c} at {i} in {fname}")
                i += 1

            self.assertEqual(len(stack), 0, f"Unclosed brackets in {fname}: {stack}")

    def test_wcag_contrast_and_accessibility(self):
        """Mathematical verification of WCAG contrast for all colors."""
        from test_suite import WCAGContrastCalculator

        # Normal text ink on paper & white
        cr_ink_paper = WCAGContrastCalculator.contrast_ratio("#1F2926", "#FAF8F5")
        self.assertGreaterEqual(cr_ink_paper, 4.5, "Ink on paper must meet WCAG AA")

        cr_ink_white = WCAGContrastCalculator.contrast_ratio("#1F2926", "#FFFFFF")
        self.assertGreaterEqual(cr_ink_white, 4.5, "Ink on white must meet WCAG AA")

        # Muted text on white & paper
        cr_muted_white = WCAGContrastCalculator.contrast_ratio("#51645D", "#FFFFFF")
        self.assertGreaterEqual(cr_muted_white, 4.5, "Muted text on white must meet WCAG AA (>= 4.5:1)")

        cr_muted_paper = WCAGContrastCalculator.contrast_ratio("#51645D", "#FAF8F5")
        self.assertGreaterEqual(cr_muted_paper, 4.5, "Muted text on paper must meet WCAG AA (>= 4.5:1)")

        # Button primary (white text on forest green)
        cr_button = WCAGContrastCalculator.contrast_ratio("#FFFFFF", "#1E3F33")
        self.assertGreaterEqual(cr_button, 4.5, "Primary button contrast must meet WCAG AA")

        # Gold dark kicker on paper
        cr_gold_paper = WCAGContrastCalculator.contrast_ratio("#8C5E15", "#FAF8F5")
        self.assertGreaterEqual(cr_gold_paper, 4.5, "Gold kicker on paper must meet WCAG AA (>= 4.5:1)")


if __name__ == '__main__':
    unittest.main()
