import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { getPublishedPosts } from '../helpers/content'

const DIST_DIR = path.resolve(process.cwd(), 'dist')

describe('rendered route smoke checks', () => {
  it('renders the home page with expected copy', () => {
    const html = readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8')
    expect(html).toContain('Decoding Disney')
    expect(html).toContain('Latest articles')
  })

  it('renders each post page with its title', () => {
    for (const post of getPublishedPosts()) {
      const outputPath = path.join(DIST_DIR, 'posts', post.slug, 'index.html')
      expect(existsSync(outputPath)).toBe(true)
      const html = readFileSync(outputPath, 'utf8')
      expect(html).toContain(post.data.title as string)
      expect(html).toContain('"@type":"Article"')
    }
  })

  it('renders feed and sitemap files', () => {
    const feed = readFileSync(path.join(DIST_DIR, 'feed.xml'), 'utf8')
    const sitemap = readFileSync(path.join(DIST_DIR, 'sitemap-index.xml'), 'utf8')
    expect(feed).toContain('<rss')
    expect(sitemap).toContain('<sitemapindex')
  })

  it('renders the 404 page', () => {
    const html = readFileSync(path.join(DIST_DIR, '404.html'), 'utf8')
    expect(html).toContain('Page not found')
  })
})
