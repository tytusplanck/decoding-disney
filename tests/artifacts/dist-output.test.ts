import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { getPostSlugs } from '../helpers/content'

const DIST_DIR = path.resolve(process.cwd(), 'dist')

describe('build artifacts', () => {
  it('creates the dist directory', () => {
    expect(existsSync(DIST_DIR)).toBe(true)
  })

  it('generates required top-level pages and feeds', () => {
    const requiredFiles = [
      'index.html',
      '404.html',
      'feed.xml',
      'sitemap-index.xml',
      'sitemap-0.xml',
    ]

    for (const file of requiredFiles) {
      expect(existsSync(path.join(DIST_DIR, file))).toBe(true)
    }
  })

  it('generates a static HTML page for every post slug', () => {
    for (const slug of getPostSlugs()) {
      const outputPath = path.join(DIST_DIR, 'posts', slug, 'index.html')
      expect(existsSync(outputPath)).toBe(true)
    }
  })

  it('includes every post in RSS and sitemap', () => {
    const rss = readFileSync(path.join(DIST_DIR, 'feed.xml'), 'utf8')
    const sitemap = readFileSync(path.join(DIST_DIR, 'sitemap-0.xml'), 'utf8')

    for (const slug of getPostSlugs()) {
      const route = `/posts/${slug}`
      expect(rss).toContain(route)
      expect(sitemap).toContain(route)
    }
  })
})
