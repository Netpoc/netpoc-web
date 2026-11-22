# UTM convention for social and campaign links

Every link we post (LinkedIn, X, Instagram, WhatsApp, email, events) carries UTM
parameters, so leads in the form inbox and GA4 show where they came from.

## The rules

- **Lowercase only**, words joined with `-`. `LinkedIn` and `linkedin` count as two sources in GA4.
- **Always set** `utm_source`, `utm_medium`, `utm_campaign`. Add `utm_content` when one campaign has several posts or creatives.
- **Link to the page the post is about**, usually `/fuelpay` or a segment such as `/fuelpay#towers`. Don't send everyone to the homepage.

| Parameter | What it records | Allowed values |
|---|---|---|
| `utm_source` | The platform | `linkedin`, `x`, `instagram`, `whatsapp`, `facebook`, `email`, `event`, `partner-<name>` |
| `utm_medium` | How it was posted | `social` (organic post), `paid-social`, `bio` (profile link), `dm`, `email`, `qr` |
| `utm_campaign` | The push it belongs to | `<product>-<topic>-<yyyy-mm>`, e.g. `fuelpay-launch-2026-12`, `fuelpay-towers-2027-01` |
| `utm_content` | Which post or creative | Short slug: `diesel-theft-carousel`, `ceo-video`, `calc-stat` |

## Examples

```
https://<site>/fuelpay?utm_source=linkedin&utm_medium=social&utm_campaign=fuelpay-launch-2026-12&utm_content=diesel-theft-carousel
https://<site>/fuelpay?utm_source=x&utm_medium=social&utm_campaign=fuelpay-tractors-2027-01#tractors
https://<site>/?utm_source=linkedin&utm_medium=bio&utm_campaign=always-on
```

The `#segment` goes **after** the UTMs (`?utm_…#tractors`); anything after `#` is never sent as a query, so UTMs placed there are lost.

Profile "website" fields use `utm_medium=bio&utm_campaign=always-on`.

## What the site does with them

- On a visitor's first page in a session, the site stores their UTMs, landing page and referrer (`src/lib/attribution.ts`, sessionStorage, no personal data).
- If they then move to another page and submit the **PoC form** or the **Contact form**, those values go with the lead as `utm_*`, `landing_page`, `referrer` and `page_url`.
- UTMs on the current URL take priority over the first-touch ones.
- GA4 also records UTMs on page views, but only for visitors who allow analytics.
