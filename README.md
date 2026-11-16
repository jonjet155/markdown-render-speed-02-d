# markdown-render-speed-02 — Candidate D

[![make.fun](https://make.fun/bounty/markdown-render-speed-02/badge.svg)](https://make.fun/bounty/markdown-render-speed-02)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A fast, dependency-free Markdown renderer for the
[markdown-render-speed-02](https://make.fun/bounty/markdown-render-speed-02)
bounty on [make.fun](https://make.fun/bounty/markdown-render-speed-02).

`parse.js` exports `parse(markdown)`, which returns exactly the HTML that
marked 18.1.3 produces with its default options (GFM on). `main.ts` is the
driver: it reads every case from `$MAKEFUN_INPUT_DIR/cases.json` (or
`/input/cases.json`), renders each one alone with `parse()`, and writes
`$MAKEFUN_OUTPUT_DIR/html.json` (or `/output/html.json`) as a JSON array of
HTML strings, in order.

## Design

A stride scanner, no token tree:

- **Block layer:** one walk over the lines with a container stack
  (blockquote / list / item), tab-aware column tracking with pending-space
  handling, lazy continuation, and tight/loose list detection. Paragraphs,
  headings and tables are held as placeholders until the end, because link
  reference definitions anywhere in the document can affect them.
- **Inline layer:** a single stride over the text with delimiter and bracket
  stacks — CommonMark flanking rules, the odd-match rule, link-boundary
  rules, reference/inline/collapsed/shortcut links, images, code spans,
  entities, autolinks (angle, `www.`, scheme, email) and raw HTML.
- Fenced code is verbatim: tabs inside code blocks are preserved, never
  pre-expanded.

## Files

- `parse.js` — the renderer (dependency-free ES module)
- `main.ts` — the driver
- `package.json` — `{"type": "module"}`
- `LICENSE` — MIT
