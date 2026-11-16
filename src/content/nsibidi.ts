/**
 * Nsibidi glyph library — see docs/brand/nsibidi.md.
 *
 * Every glyph is a real entry in Resource/nsibidi dictionary.pdf (the neo-Nsibidi
 * "Nsịbịrị" dictionary, rev. 23, 2015), identified by its entry number. Shapes are
 * our own line drawings of each symbol's structure on a 48×48 grid — uniform
 * 3-unit round strokes — not traces of the dictionary's typeface.
 *
 * `origin` follows the dictionary's classification (§3.1):
 *   original — "O": pre-1900 Nsibidi, the historically attested ideographs
 *   modified — "M/MM/MF": an original symbol modified in form or meaning
 *   compound — "C": a neo-Nsibidi compound built from original radicals
 * Never present a compound as ancient: the glossary shows the origin.
 */

export type GlyphOrigin = 'original' | 'modified' | 'compound'

export interface Glyph {
  /** Dictionary entry number. */
  entry: string
  meaning: string
  origin: GlyphOrigin
  /** Stroked paths, 48×48 grid. */
  d: string
  /** Optional filled dots (cx, cy, r). */
  dots?: [number, number, number][]
}

export const GLYPHS = {
  /* ---- original, pre-1900 ---- */
  leopard: { entry: '0001', meaning: 'leopard, brave', origin: 'original', d: 'M11 11 L37 37 M37 11 L11 37' },
  water: {
    entry: '0011',
    meaning: 'water',
    origin: 'original',
    d: 'M12 20 L24 10 L36 20 M12 27 L24 17 L36 27 M12 34 L24 24 L36 34 M12 41 L24 31 L36 41',
  },
  human: { entry: '0017', meaning: 'person, mankind', origin: 'original', d: 'M14 9 H34 M24 9 V39 M14 39 H34' },
  iron: { entry: '0024', meaning: 'rod, iron', origin: 'original', d: 'M16 40 V21 A8 8 0 0 1 32 21 V40' },
  star: {
    entry: '0059',
    meaning: 'star, cosmos',
    origin: 'original',
    d: 'M15 15 H33 M19.5 7.2 L28.5 22.8 M28.5 7.2 L19.5 22.8 M15 33 H33 M19.5 25.2 L28.5 40.8 M28.5 25.2 L19.5 40.8',
  },
  unity: {
    entry: '0078',
    meaning: 'link, join, unity',
    origin: 'original',
    // Two strands that loop through each other near the top, then part.
    d: 'M9 10 C17 8 25 11 27 16 C29 22 21 23 21 17 C21 13 26 12 30 16 L39 38 M39 10 C31 8 26 10 25 13 M21 18 L9 38 M7 14 L11 8 M41 14 L37 8 M7 34 L11 40 M41 34 L37 40',
  },
  road: {
    entry: '0082',
    meaning: 'road, path, way, direction',
    origin: 'original',
    d: 'M9 9 V39 M17 9 V39 M31 9 V39 M39 9 V39 M9 16 L17 18 M9 24 L17 26 M9 32 L17 34 M31 16 L39 18 M31 24 L39 26 M31 32 L39 34',
  },
  message: {
    entry: '0085',
    meaning: 'message, news, teachings',
    origin: 'original',
    d: 'M18 8 H30 M24 8 V40 M18 40 H30 M38 18 L11 31 L11 24',
  },
  ladder: {
    entry: '0097',
    meaning: 'ladder',
    origin: 'original',
    d: 'M12 9 V39 H36 V9 M12 16 H36 M12 22 H36 M12 28 H36 M12 34 H36',
  },
  bridge: {
    entry: '0098',
    meaning: 'bridge',
    origin: 'original',
    d: 'M9 12 H39 M9 36 H39 M15 12 V36 M22 12 V36 M29 12 V36 M36 12 V36 M9 8 V16 M39 8 V16 M9 32 V40 M39 32 V40',
  },
  currency: {
    entry: '0150',
    meaning: 'currency',
    origin: 'original',
    d: 'M13 38 V25 A11 11 0 0 1 35 25 V38 M9 38 H17 M31 38 H39',
  },
  fire: {
    entry: '0159',
    meaning: 'fire, heat',
    origin: 'original',
    d: 'M27 40 V11 C27 7 38 7 38 13 C38 19 30 18 26 18 H19 C16 18 15 21 15 24 V40 M12 40 H18 M24 40 H30',
    dots: [[27, 18, 2.6]],
  },
  welcome: {
    entry: '0161',
    meaning: 'welcome, hello',
    origin: 'original',
    d: 'M31 8 A17 17 0 0 0 31 40 M33 18 C30 15 25 17 24 21 A9.5 9.5 0 0 0 33 34',
  },
  drum: {
    entry: '0179',
    meaning: 'drum',
    origin: 'original',
    d: 'M38 24 A14 14 0 1 1 10 24 A14 14 0 1 1 38 24 M33 24 A9 9 0 1 1 15 24 A9 9 0 1 1 33 24 M28 24 A4 4 0 1 1 20 24 A4 4 0 1 1 28 24',
  },
  trade: {
    entry: '0409',
    meaning: 'trade, market, industry',
    origin: 'original',
    d: 'M11 17 V31 M11 24 H23 M26 9 C41 15 41 33 26 39 M24 9 H30 M24 39 H30',
  },
  loom: { entry: '0414', meaning: 'weaving frame, loom', origin: 'original', d: 'M12 9 V39 M36 9 V39 M12 9 L36 39 M36 9 L12 39' },

  /* ---- modified original ---- */
  wealth: {
    entry: '0063',
    meaning: 'wealth, riches, treasure',
    origin: 'modified',
    d: 'M18 9 A15 15 0 0 1 18 39 M18 14 A10 10 0 0 1 18 34 M18 19 A5 5 0 0 1 18 29',
  },
  system: {
    entry: '0341',
    meaning: 'order, arrangement, system',
    origin: 'modified',
    d: 'M12 11 H36 V37 H12 M12 20 H36 M12 28 H36 M12 8 V14 M12 17 V23 M12 25 V31 M12 34 V40',
  },

  /* ---- neo-Nsibidi compounds ---- */
  land: { entry: '0073', meaning: 'land, earth, planet', origin: 'compound', d: 'M20 9 H28 M24 9 V37 M11 37 H37 M11 33 V41 M37 33 V41' },
  light: {
    entry: '0094',
    meaning: 'light, glow',
    origin: 'compound',
    d: 'M13 15 H35 M24 15 V7 M24 15 L15 9 M24 15 L33 9 M20 21 H28 M24 21 V37 M11 37 H37 M11 33 V41 M37 33 V41',
  },
  join: {
    entry: '0139',
    meaning: 'join, pair, come together',
    origin: 'compound',
    d: 'M15 13 H33 M18 6 L30 20 M30 6 L18 20 M24 5 V21 M16 29 H32 M16 38 H32 M24 21 V38 M16 26 V32 M32 26 V32 M16 35 V41 M32 35 V41',
  },
  greet: {
    entry: '0141',
    meaning: 'greet, welcome',
    origin: 'compound',
    d: 'M31 8 V31 A6 6 0 0 1 19 31 V28 M19 7 Q20 13 25 14 Q20 15 19 21 Q18 15 13 14 Q18 13 19 7 Z',
  },
  work: {
    entry: '0177',
    meaning: 'work, build',
    origin: 'compound',
    d: 'M24 8 H32 M28 8 V38 M11 38 H38 M11 34 V42 M38 34 V42 M28 17 H16 V27 H28 M16 22 H28',
  },
  thanks: {
    entry: '0294',
    meaning: 'greeting, thank you, goodbye',
    origin: 'compound',
    d: 'M24 5 V11 M16 7 L20 12 M32 7 L28 12 M24 15 Q25 24 36 26 Q25 28 24 38 Q23 28 12 26 Q23 24 24 15 Z',
  },
  learn: {
    entry: '0348',
    meaning: 'know, learn',
    origin: 'compound',
    d: 'M24 6 V42 M12 21 H36 M12 29 H36 M12 18 V24 M36 18 V24 M12 26 V32 M36 26 V32 M15 9 L21 14 M33 9 L27 14',
  },
  machine: {
    entry: '0432',
    meaning: 'metal, iron, machine',
    origin: 'compound',
    d: 'M16 27 V17 A8 8 0 0 1 32 17 V27 M14 35 H34 M14 31 V39 M34 31 V39',
  },
} satisfies Record<string, Glyph>

export type GlyphName = keyof typeof GLYPHS

/**
 * Themed sets. Each page's background field is built from one set, so the
 * pattern carries a message; the footer glossary names it.
 */
export const NSIBIDI_SETS = {
  welcome: { glyphs: ['welcome', 'thanks', 'unity', 'star', 'leopard', 'greet'] },
  craft: { glyphs: ['iron', 'machine', 'system', 'bridge', 'ladder', 'loom', 'work', 'light'] },
  people: { glyphs: ['human', 'unity', 'join', 'learn', 'message', 'drum'] },
  dialogue: { glyphs: ['welcome', 'message', 'road', 'unity', 'thanks', 'greet'] },
  value: { glyphs: ['fire', 'water', 'trade', 'currency', 'wealth', 'land'] },
} as const satisfies Record<string, { glyphs: readonly GlyphName[] }>

export type NsibidiSet = keyof typeof NSIBIDI_SETS
