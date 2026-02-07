import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { getDraftSlugs, getPublishedSlugs } from '../helpers/content'

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

  it('generates a static HTML page for every published post slug', () => {
    for (const slug of getPublishedSlugs()) {
      const outputPath = path.join(DIST_DIR, 'posts', slug, 'index.html')
      expect(existsSync(outputPath)).toBe(true)
    }
  })

  it('includes every published post in RSS and sitemap', () => {
    const rss = readFileSync(path.join(DIST_DIR, 'feed.xml'), 'utf8')
    const sitemap = readFileSync(path.join(DIST_DIR, 'sitemap-0.xml'), 'utf8')

    for (const slug of getPublishedSlugs()) {
      const route = `/posts/${slug}`
      expect(rss).toContain(route)
      expect(sitemap).toContain(route)
    }
  })

  it('excludes draft posts from generated routes and feeds', () => {
    const draftSlugs = getDraftSlugs()
    const rss = readFileSync(path.join(DIST_DIR, 'feed.xml'), 'utf8')
    const sitemap = readFileSync(path.join(DIST_DIR, 'sitemap-0.xml'), 'utf8')

    for (const slug of draftSlugs) {
      const route = `/posts/${slug}`
      const outputPath = path.join(DIST_DIR, 'posts', slug, 'index.html')
      expect(existsSync(outputPath)).toBe(false)
      expect(rss).not.toContain(route)
      expect(sitemap).not.toContain(route)
    }
  })
})
