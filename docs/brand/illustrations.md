# People illustrations

Netpoc is an Afrocentric brand. The people illustrations show who we build for, and they appear across the site alongside the Nsibidi and Ankara pattern system.

## Inventory

| Name | Subject | Animated part |
|---|---|---|
| `woman-waving` | Woman in a beaded collar and Ankara-print dress, waving | `wave`: forearm and hand, pivot at the elbow |
| `man-headdress` | Man in a feathered headdress, orange wrap | `feathers`: crown, pivot at the headband |
| `family` | Father (headdress), mother with baby, child | `feathers` |
| `man-standing` | Man in a red wrap, hands on hips | — |
| `couple-with-pots` | Couple with clay pots, woman in a headwrap | — |

Sources: `src/assets/illustrations/source/{name}.svg`, from the original Figma exports.

## How it works

The sources are flat Figma exports with no named layers. `npm run figures` (`scripts/build-figures.mjs`) turns them into Vue components in `src/components/figures/`:

1. **SVGO optimise.** Files shrink by 26–39%. Ids get a per-figure prefix, so two figures on one page never share a mask or clip id. Paths are kept separate.
2. **Colour roles.** Every fill maps to a role in `scripts/figures.config.mjs`: `skin`, `cloth-a` (reds), `cloth-b` (oranges), `gold` (beads, feathers, pots), `accent` (teal, blue and green cloth), `metal`, `white`. Each path also gets `--k`, its lightness relative to the role's base colour, so recolouring keeps the folds and shadows.
3. **Parts.** Region rules (role + bounding box) tag animatable pieces with `part-*` classes. Each part has a pivot point.

Never edit `src/components/figures/*`. Edit the config or the source, then rerun the build. The output is deterministic.

## Using a figure

```vue
<CultureFigure name="woman-waving" animate height="420px" />
<CultureFigure name="family" palette="ankara" />
<CultureFigure name="family" infill="ankara" />
<CultureFigure name="man-standing" palette="night" :ground="false" mirror />
```

| Prop | Values | Use |
|---|---|---|
| `palette` | `heritage` (default) | The artwork's own colours. Use it for signature moments. |
| | `ankara` | Cloth recoloured into the site accents: emerald, saffron, violet, gold. Use it where a figure sits next to brand-coloured UI. |
| | `night` | Dusk silhouette with a saffron rim light. Use sparingly: it reads as muddy on dark purple backgrounds. |
| `infill` | `none` / `ankara` | Fills the cloth with a wax-print tile. |
| `animate` | boolean | Plays the figure's gesture only while it's on screen. Turned off under reduced motion. |
| `height`, `mirror`, `ground` | | Size; flip to face into the content; contact shadow. |

Preview every combination at **`/__figures`** (dev server only).

## Placement rules

- **Layering:** the pattern field goes behind, the figure sits on top of it, and glass panels and text stay in front. A figure never sits behind body text.
- **Never hard-crop a figure mid-body.** Show it whole, or crop deliberately at the shoulders (as in the footer bust). A figure clipped at the knees by a section edge looks broken.
- **`woman-waving` stays in `heritage`.** Her facial detail shares the blue accent colour, so `ankara` would tint her face.
- **One figure per spot, no repeats within a page,** and at most one *animated* figure per viewport. Motion is saved for one moment.
- **Mobile (≤760px):** only signature figures show (Home hero, About). Accent figures hide so they don't crowd content or slow low-end phones.
- **Contrast:** any text overlapping a `night` silhouette keeps 4.5:1 contrast.
- **Respect:** figures represent people. Don't crop through faces, distort proportions, or use a figure as a joke or a prop for a technical claim.

### Current placements

| Page | Figure | Treatment |
|---|---|---|
| Home hero | `woman-waving` | heritage, waving, in front of the Ankara sun |
| Home CTA | `man-standing` | ankara palette, mirrored, peeking from the left |
| Services header | `man-headdress` + `woman-waving` | full figures flanking the headline on a shared ground line; heritage, woman mirrored to face inward, feather sway (≥1100px) |
| About intro | `family` | Ankara infill, feather sway, in front of the Ankara sun |
| Contact | `couple-with-pots` | heritage, under the email link (desktop) |
| Footer (all pages) | `man-headdress` | bust rising from the edge, feather sway (desktop) |
| FuelPay final CTA | `family` | ankara palette, peeking from the right (wide screens) |

## Adding a figure

1. Export the SVG from Figma. Flatten it, but don't merge paths.
2. Save it as `src/assets/illustrations/source/{subject}.svg`, named in kebab-case after what it shows.
3. Add new fill colours to `ROLES` and the figure to `FIGURES` in `scripts/figures.config.mjs`.
4. Run `npm run figures -- --debug` and open `node_modules/.figures-debug-{subject}.html` to check the roles (false colours) and parts (magenta).
5. Check the new figure in `/__figures`.
