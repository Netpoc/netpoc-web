# Nsibidi patterns

Nsibidi is the indigenous ideographic script of the Cross River region of south-eastern Nigeria and south-western Cameroon. The oldest evidence is on pottery from around Calabar, dated to the 4th century. On this site it is writing, not decoration: every background pattern is built from real Nsibidi glyphs grouped by meaning, and the footer tells visitors what each page's pattern says.

## Source

All glyphs come from `Resource/nsibidi dictionary.pdf`, the neo-Nsibidi (Nsịbịrị) dictionary: revision 23, draft 25, 2015, 1,400 entries. The dictionary sorts every entry by origin (§3.1). We carry that over:

| Our `origin` | Dictionary code | Meaning |
|---|---|---|
| `original` | O | Pre-1900 Nsibidi, the historically attested ideographs |
| `modified` | M, MM, MF | An original symbol modified in form or meaning |
| `compound` | C (also PC, N) | A modern neo-Nsibidi character built from the original radicals |

**Rule:** never present a compound as ancient. The footer glossary marks compounds as "neo".

### Licence and credit

The dictionary is published under CC BY-NC-SA 3.0. Netpoc's position, decided by the business: as a Nigerian, Afrocentric company we use the symbols on this site and **always credit the source**. The credit is on every page, in the footer glossary:

> Symbols and meanings after the Nsịbịrị (neo-Nsibidi) dictionary, revision 23, 2015.

Keep that line wherever Nsibidi glyphs appear, including print, decks and social graphics. We still redraw each symbol's structure in our own stroke style rather than copying the dictionary's artwork, so the glyphs match the site and stay consistent.

## Library

`src/content/nsibidi.ts` holds 26 glyphs. Each has its dictionary entry number, meaning, origin and path.

| Theme | Original | Modified / compound |
|---|---|---|
| Salutation | 0161 welcome, hello | 0141 greet, welcome · 0294 greeting, thank you |
| Unity | 0078 link, join, unity | 0139 join, pair |
| Knowledge | 0085 message, teachings | 0348 know, learn |
| Craft and engineering | 0024 iron · 0098 bridge · 0097 ladder · 0414 loom | 0432 metal, machine · 0341 order, system · 0177 work, build · 0094 light |
| Value | 0159 fire · 0011 water · 0409 trade, market · 0150 currency | 0063 wealth · 0073 land |
| Identity | 0001 leopard, brave · 0059 star · 0017 person · 0082 road, way · 0179 drum | |

### Sets (one per page, set in the route's `meta.nsibidi`)

| Set | Page | Glyphs |
|---|---|---|
| `welcome` | Home | welcome, greeting, unity, star, leopard, greet |
| `craft` | Services | iron, machine, system, bridge, ladder, loom, work, light |
| `people` | About | person, unity, join, learn, message, drum |
| `dialogue` | Contact | welcome, message, road, link, thank you, greet |
| `value` | FuelPay | fire, water, trade, currency, wealth, land |

## Patterns

`<NsibidiPattern>` draws the page's set. Pass `set` to override it.

- **`variant="print"`** (default): two staggered rows of glyphs with cowrie-dot spacers, like a printed cloth. This is the quiet, everyday field.
- **`variant="ukara"`**: after ukara, the indigo cloth of the Ekpe society. Glyphs sit in a grid of squares that alternate with hatched and dotted squares. It is the bolder field, so use it sparingly. It currently runs only on the Home hero and the Contact page.

Rules:

- **Glyphs are writing.** Never rotate, mirror or distort them.
- Keep fields faint (opacity 0.04–0.08) behind text. Body text must keep WCAG AA contrast.
- One set per page. The footer glossary reads the same set.

Preview every glyph and every set in both variants at `/__figures` (dev server only).

## Adding a glyph

1. Find the entry in the dictionary and note its number and origin code. The dictionary pages are scanned images, so read them visually.
2. Redraw its structure on a 48×48 grid in `GLYPHS`, using the stroke style above. Don't trace.
3. Add it to a set. Check it in `/__figures` beside the dictionary entry.
