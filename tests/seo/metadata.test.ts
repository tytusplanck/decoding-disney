import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { getPublishedPosts } from '../helpers/content'

const DIST_DIR = path.resolve(process.cwd(), 'dist')
const SITE_URL = 'https://decodingdisney.com'

function parseAttributes(tag: string): Map<string, string> {
  const attributes = new Map<string, string>()
  const attrPattern = /([a-zA-Z:-]+)=(["'])([\s\S]*?)\2/g
  let match: RegExpExecArray | null

  while ((match = attrPattern.exec(tag)) !== null) {
    attributes.set(match[1], match[3])
  }

  return attributes
}

function findMetaContent(
  html: string,
  key: 'name' | 'property',
  value: string
): string | undefined {
  const tagPattern = /<meta\b[^>]*>/gi
  let tagMatch: RegExpExecArray | null

  while ((tagMatch = tagPattern.exec(html)) !== null) {
    const attrs = parseAttributes(tagMatch[0])
    if (attrs.get(key) === value) {
      return attrs.get('content')
    }
  }

  return undefined
}

function findCanonicalHref(html: string): string | undefined {
  const linkPattern = /<link\b[^>]*>/gi
  let tagMatch: RegExpExecArray | null

  while ((tagMatch = linkPattern.exec(html)) !== null) {
    const attrs = parseAttributes(tagMatch[0])
    if (attrs.get('rel') === 'canonical') {
      return attrs.get('href')
    }
  }

  return undefined
}

function extractArticleJsonLd(html: string): Record<string, unknown> | undefined {
  const scriptPattern = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let scriptMatch: RegExpExecArray | null

  while ((scriptMatch = scriptPattern.exec(html)) !== null) {
    const text = scriptMatch[1].trim()
    try {
      const parsed = JSON.parse(text) as Record<string, unknown>
      if (parsed['@type'] === 'Article') {
        return parsed
      }
    } catch {
      // Ignore malformed script blocks and continue scanning.
    }
  }

  return undefined
}

describe('seo metadata regression checks', () => {
  it('renders canonical and social metadata on home page', () => {
    const homeHtml = readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8')
    const canonical = findCanonicalHref(homeHtml)
    const ogUrl = findMetaContent(homeHtml, 'property', 'og:url')
    const ogImage = findMetaContent(homeHtml, 'property', 'og:image')
    const ogImageWidth = findMetaContent(homeHtml, 'property', 'og:image:width')
    const ogImageHeight = findMetaContent(homeHtml, 'property', 'og:image:height')
    const twitterImage = findMetaContent(homeHtml, 'name', 'twitter:image')

    expect(canonical).toBe(`${SITE_URL}/`)
    expect(ogUrl).toBe(canonical)
    expect(ogImage).toBe(`${SITE_URL}/og/default-og.svg`)
    expect(ogImageWidth).toBe('1200')
    expect(ogImageHeight).toBe('630')
    expect(twitterImage).toBe(ogImage)
  })

  it('renders canonical, article, and structured metadata on post pages', () => {
    for (const post of getPublishedPosts()) {
      const postHtml = readFileSync(path.join(DIST_DIR, 'posts', post.slug, 'index.html'), 'utf8')
      const canonical = findCanonicalHref(postHtml)
      const description = findMetaContent(postHtml, 'name', 'description')
      const ogUrl = findMetaContent(postHtml, 'property', 'og:url')
      const ogImage = findMetaContent(postHtml, 'property', 'og:image')
      const ogImageWidth = findMetaContent(postHtml, 'property', 'og:image:width')
      const ogImageHeight = findMetaContent(postHtml, 'property', 'og:image:height')
      const articleAuthor = findMetaContent(postHtml, 'property', 'article:author')
      const keywordsMeta = findMetaContent(postHtml, 'name', 'keywords')
      const jsonLd = extractArticleJsonLd(postHtml)

      expect(canonical?.includes(`/posts/${post.slug}`)).toBe(true)
      expect(ogUrl).toBe(canonical)
      expect(description).toBe(post.data.excerpt)
      expect(ogImage?.startsWith(`${SITE_URL}/`)).toBe(true)

      const ogImageData = post.data.ogImage as
        | { width?: number; height?: number; url?: string }
        | undefined
      const expectedWidth = ogImageData?.url ? String(ogImageData.width ?? 1200) : '512'
      const expectedHeight = ogImageData?.url ? String(ogImageData.height ?? 630) : '512'
      expect(ogImageWidth).toBe(expectedWidth)
      expect(ogImageHeight).toBe(expectedHeight)

      expect(articleAuthor).toBe((post.data.author as { name: string }).name)

      if (Array.isArray(post.data.keywords) && post.data.keywords.length > 0) {
        expect(keywordsMeta).toBe(post.data.keywords.join(', '))
      } else {
        expect(keywordsMeta).toBeUndefined()
      }

      expect(jsonLd?.headline).toBe(post.data.title)
      expect(jsonLd?.description).toBe(post.data.excerpt)
      expect(String(jsonLd?.mainEntityOfPage).includes(`/posts/${post.slug}`)).toBe(true)
    }
  })

  it('keeps robots and web manifest SEO assets valid', () => {
    const robots = readFileSync(path.join(DIST_DIR, 'robots.txt'), 'utf8')
    const manifestRaw = readFileSync(path.join(DIST_DIR, 'favicon', 'site.webmanifest'), 'utf8')
    const manifest = JSON.parse(manifestRaw) as {
      name: string
      short_name: string
      icons: Array<{ src: string }>
    }

    expect(robots).toContain('Sitemap: https://decodingdisney.com/sitemap-index.xml')
    expect(manifest.name).toBe('Decoding Disney')
    expect(manifest.short_name).toBe('DecodingDisney')
    expect(manifest.icons.every((icon) => icon.src.startsWith('/favicon/'))).toBe(true)
  })
})
