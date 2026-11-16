#!/usr/bin/env node
/**
 * Builds part-aware Vue components from the illustration sources.
 *
 *   npm run figures            regenerate src/components/figures/*
 *   npm run figures -- --debug also write a role-highlight preview HTML
 *
 * Pipeline per figure: SVGO (prefixed ids, paths kept separate) → tag each
 * path with its colour role + shade → tag animatable parts by region →
 * emit a Vue SFC. Output is deterministic.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { optimize } from 'svgo'
import { FIGURES, ROLES } from './figures.config.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = resolve(root, 'src/assets/illustrations/source')
const OUT = resolve(root, 'src/components/figures')
const DEBUG = process.argv.includes('--debug')

/* ---------- colour helpers ---------- */

const ROLE_OF = new Map()
for (const [role, hexes] of Object.entries(ROLES)) for (const h of hexes) ROLE_OF.set(h.toUpperCase(), role)

function normHex(v) {
  if (!v) return null
  let h = v.trim().toUpperCase()
  if (h === 'WHITE') return '#FFFFFF'
  if (h === 'BLACK') return '#000000'
  if (/^#[0-9A-F]{3}$/.test(h)) h = '#' + [...h.slice(1)].map((c) => c + c).join('')
  return /^#[0-9A-F]{6}$/.test(h) ? h : null
}

/** OKLab lightness (0–1) — perceptual, so shade ratios survive recolouring. */
function oklabL(hex) {
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  const [r, g, b] = [1, 3, 5].map((i) => lin(parseInt(hex.slice(i, i + 2), 16) / 255))
  const l = Math.cbrt(0.4122214708 * r + 0.5363288850 * g + 0.0514459183 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
}

/** Reference lightness per role = its most-used (base) colour's lightness. */
function roleBases(paths) {
  const counts = {}
  for (const p of paths) {
    if (!p.hex) continue
    counts[p.role] ??= {}
    counts[p.role][p.hex] = (counts[p.role][p.hex] ?? 0) + 1
  }
  const bases = {}
  for (const [role, c] of Object.entries(counts)) {
    const top = Object.entries(c).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0][0]
    bases[role] = oklabL(top)
  }
  return bases
}

/* ---------- path bbox (handles all commands, abs + rel) ---------- */

function pathBBox(d) {
  const tokens = d.match(/[a-zA-Z]|-?(?:\d*\.\d+|\d+\.?)(?:e[-+]?\d+)?/g) ?? []
  let i = 0, cmd = '', x = 0, y = 0, sx = 0, sy = 0
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  const add = (px, py) => {
    minX = Math.min(minX, px); maxX = Math.max(maxX, px)
    minY = Math.min(minY, py); maxY = Math.max(maxY, py)
  }
  const num = () => parseFloat(tokens[i++])
  const ARGS = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 }
  while (i < tokens.length) {
    if (/[a-zA-Z]/.test(tokens[i])) cmd = tokens[i++]
    const up = cmd.toUpperCase()
    const rel = cmd !== up
    if (up === 'Z') { x = sx; y = sy; continue }
    const n = ARGS[up]
    if (n === undefined || i + n > tokens.length) break
    const a = Array.from({ length: n }, num)
    const ox = rel ? x : 0, oy = rel ? y : 0
    switch (up) {
      case 'M': x = a[0] + ox; y = a[1] + oy; sx = x; sy = y; add(x, y); cmd = rel ? 'l' : 'L'; break
      case 'L': case 'T': x = a[0] + ox; y = a[1] + oy; add(x, y); break
      case 'H': x = a[0] + (rel ? x : 0); add(x, y); break
      case 'V': y = a[0] + (rel ? y : 0); add(x, y); break
      case 'C': add(a[0] + ox, a[1] + oy); add(a[2] + ox, a[3] + oy); x = a[4] + ox; y = a[5] + oy; add(x, y); break
      case 'S': case 'Q': add(a[0] + ox, a[1] + oy); x = a[2] + ox; y = a[3] + oy; add(x, y); break
      case 'A': x = a[5] + ox; y = a[6] + oy; add(x, y); break
    }
  }
  return { minX, minY, maxX, maxY, cx: (minX + maxX) / 2, cy: (minY + maxY) / 2 }
}

/* ---------- build ---------- */

const report = []
const index = []
mkdirSync(OUT, { recursive: true })

for (const [name, cfg] of Object.entries(FIGURES)) {
  const raw = readFileSync(resolve(SRC, `${name}.svg`), 'utf8')
  const { data } = optimize(raw, {
    multipass: true,
    floatPrecision: 2,
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            mergePaths: false, // keep paths separate — they are our "parts"
            convertColors: { shorthex: false, shortname: false },
            removeHiddenElems: false,
          },
        },
      },
      { name: 'prefixIds', params: { prefix: `fig-${name}`, delim: '-' } },
      { name: 'removeDimensions' },
    ],
  })

  const viewBox = data.match(/viewBox="([^"]+)"/)[1]
  const [, , vbW, vbH] = viewBox.split(/\s+/).map(Number)

  // Collect drawable paths (skip mask definitions — they must stay untouched).
  const paths = []
  const body = data.replace(/<mask[\s\S]*?<\/mask>/g, (m) => `\u0000${Buffer.from(m).toString('base64')}\u0000`)
  body.replace(/<path\b[^>]*?\/>/g, (tag) => {
    const fill = tag.match(/\sfill="([^"]+)"/)?.[1]
    const hex = normHex(fill)
    const d = tag.match(/\sd="([^"]+)"/)?.[1] ?? ''
    paths.push({ tag, hex, role: (hex && ROLE_OF.get(hex)) || 'other', box: pathBBox(d) })
    return tag
  })
  const bases = roleBases(paths)

  const stats = { paths: paths.length, roles: {}, parts: {} }
  let k = 0
  let out = body.replace(/<path\b[^>]*?\/>/g, () => {
    const p = paths[k++]
    const classes = [`fp-${p.role}`]
    for (const rule of cfg.parts) {
      const [x1, y1, x2, y2] = rule.box
      const inBox = p.box.cx >= x1 && p.box.cx <= x2 && p.box.cy >= y1 && p.box.cy <= y2
      if (inBox && (!rule.roles || rule.roles.includes(p.role))) {
        classes.push(`part-${rule.part}`)
        stats.parts[rule.part] = (stats.parts[rule.part] ?? 0) + 1
      }
    }
    stats.roles[p.role] = (stats.roles[p.role] ?? 0) + 1
    // Shade relative to the role's base colour; clamp to keep recolours sane.
    const shade = p.hex && bases[p.role] ? Math.min(Math.max(oklabL(p.hex) / bases[p.role], 0.35), 1.8) : 1
    const style = p.role === 'other' ? '' : ` style="--k:${shade.toFixed(3)}"`
    return p.tag.replace(/^<path/, `<path class="${classes.join(' ')}"${style}`)
  })
  out = out.replace(/\u0000([^\u0000]+)\u0000/g, (_, b64) => Buffer.from(b64, 'base64').toString())

  // Root: drop xmlns noise Vue doesn't need, add pivots for animated parts.
  const origins = cfg.parts
    .filter((r) => r.origin)
    .map((r) => `--${r.part}-origin:${r.origin[0]}px ${r.origin[1]}px`)
    .join(';')
  out = out.replace(
    /^<svg[^>]*>/,
    `<svg class="fig-svg" viewBox="${viewBox}" fill="none" aria-hidden="true" focusable="false"${origins ? ` style="${origins}"` : ''}>`,
  )

  writeFileSync(
    resolve(OUT, `${cfg.component}.vue`),
    `<!-- GENERATED by scripts/build-figures.mjs from src/assets/illustrations/source/${name}.svg — do not edit; run \`npm run figures\`. -->\n<template>\n  ${out}\n</template>\n`,
  )
  index.push({ name, component: cfg.component, width: vbW, height: vbH })
  report.push({ name, bytes: { source: raw.length, out: out.length }, ...stats })

  if (DEBUG) {
    const HL = { skin: '#7c5', 'cloth-a': '#f33', 'cloth-b': '#fa0', gold: '#ff0', accent: '#0cf', metal: '#ccc', white: '#f0f', other: '#000' }
    const css = Object.entries(HL).map(([r, c]) => `.role .fp-${r}{fill:${c}!important}`).join('')
      + '.parts path{opacity:.15}.parts [class*="part-"]{opacity:1;fill:#f0f!important}'
    writeFileSync(
      resolve(root, `node_modules/.figures-debug-${name}.html`),
      `<style>body{margin:0;display:flex;background:#222}svg{height:100vh}${css}</style>${out}<div class="role">${out}</div><div class="parts">${out}</div>`,
    )
  }
}

writeFileSync(
  resolve(OUT, 'index.ts'),
  `// GENERATED by scripts/build-figures.mjs — do not edit; run \`npm run figures\`.
import { defineAsyncComponent } from 'vue'

export const FIGURES = {
${index
  .map(
    (f) =>
      `  '${f.name}': { width: ${f.width}, height: ${f.height}, component: defineAsyncComponent(() => import('./${f.component}.vue')) },`,
  )
  .join('\n')}
} as const

export type FigureName = keyof typeof FIGURES
`,
)

for (const r of report) {
  const pct = Math.round((1 - r.bytes.out / r.bytes.source) * 100)
  console.log(
    `${r.name.padEnd(17)} ${String(r.paths).padStart(3)} paths  ${(r.bytes.source / 1024).toFixed(0)}→${(r.bytes.out / 1024).toFixed(0)} KB (-${pct}%)  roles ${JSON.stringify(r.roles)}  parts ${JSON.stringify(r.parts)}`,
  )
}
