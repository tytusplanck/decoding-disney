import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  // Keep this aligned with SITE_ORIGIN in src/lib/site.ts (validated in tests/seo/metadata.test.ts).
  site: 'https://decodingdisney.com',
  integrations: [tailwind(), sitemap()],
})
