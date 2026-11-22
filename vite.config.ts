import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { DEFAULT_OG_IMAGE, ROUTE_SEO, type PageSeo } from './src/content/seo'
import { organizationLd } from './src/content/company'

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function headTags(site: string, path: string, seo: PageSeo) {
  const url = site + (path === '/' ? '/' : path)
  const image = site + (seo.ogImage ?? DEFAULT_OG_IMAGE)
  const t = escape(seo.title)
  const d = escape(seo.description)
  return [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Netpoc" />`,
    `<meta property="og:locale" content="en_NG" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${d}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<script type="application/ld+json">${JSON.stringify(organizationLd(site)).replace(/</g, '\\u003c')}</script>`,
  ].join('\n    ')
}

const SEO_BLOCK = /<!--seo-->[\s\S]*?<!--\/seo-->/

/**
 * Social scrapers don't run JS, so write each route's title/description/OG
 * tags into static HTML: `index.html` for `/`, `<route>/index.html` for the
 * rest. Also emits robots.txt and sitemap.xml.
 */
function seoPages(site: string): Plugin {
  return {
    name: 'netpoc:seo-pages',
    transformIndexHtml: (html) =>
      html.replace(SEO_BLOCK, `<!--seo-->\n    ${headTags(site, '/', ROUTE_SEO['/'])}\n    <!--/seo-->`),
    // After write, so the final index.html (with hashed asset links) exists.
    writeBundle({ dir = 'dist' }) {
      const html = readFileSync(join(dir, 'index.html'), 'utf8')
      const out = (file: string, source: string) => {
        mkdirSync(join(dir, file, '..'), { recursive: true })
        writeFileSync(join(dir, file), source)
      }
      for (const [path, seo] of Object.entries(ROUTE_SEO)) {
        if (path === '/') continue
        out(
          `${path.slice(1)}/index.html`,
          html.replace(SEO_BLOCK, `<!--seo-->\n    ${headTags(site, path, seo)}\n    <!--/seo-->`),
        )
      }
      out('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`)
      const urls = Object.keys(ROUTE_SEO)
        .map((p) => `  <url><loc>${site}${p}</loc></url>`)
        .join('\n')
      out(
        'sitemap.xml',
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  let site = env.VITE_SITE_URL?.replace(/\/$/, '')
  if (!site) {
    site = 'https://netpoc.com'
    if (command === 'build')
      console.warn(`\n⚠  VITE_SITE_URL is not set; canonical/OG URLs default to ${site}. See .env.example.\n`)
  }

  return {
    plugins: [vue(), tailwindcss(), seoPages(site)],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
