import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { getParsedPosts, getPostSlugs } from '../helpers/content'

function asNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

describe('content invariants', () => {
  it('has at least one post', () => {
    const slugs = getPostSlugs()
    expect(slugs.length).toBeGreaterThan(0)
  })

  it('uses unique slugs', () => {
    const slugs = getPostSlugs()
    const unique = new Set(slugs)
    expect(unique.size).toBe(slugs.length)
  })

  it('requires complete frontmatter and body for each post', () => {
    for (const post of getParsedPosts()) {
      expect(asNonEmptyString(post.data.title)).toBe(true)
      expect(asNonEmptyString(post.data.excerpt)).toBe(true)

      const parsedDate = new Date(post.data.date as string | Date)
      expect(Number.isNaN(parsedDate.getTime())).toBe(false)

      if (post.data.updatedDate !== undefined) {
        const updatedDate = new Date(post.data.updatedDate as string | Date)
        expect(Number.isNaN(updatedDate.getTime())).toBe(false)
        expect(updatedDate.getTime()).toBeGreaterThanOrEqual(parsedDate.getTime())
      }

      if (post.data.draft !== undefined) {
        expect(typeof post.data.draft).toBe('boolean')
      }

      expect(typeof post.data.author).toBe('object')
      expect(post.data.author).not.toBeNull()
      expect(asNonEmptyString((post.data.author as { name?: unknown }).name)).toBe(true)

      if (post.data.keywords !== undefined) {
        expect(Array.isArray(post.data.keywords)).toBe(true)
      }

      if (post.data.ogImage !== undefined) {
        expect(typeof post.data.ogImage).toBe('object')
      }

      expect(post.body.trim().length).toBeGreaterThan(0)
    }
  })

  it('keeps a colocated cover image for every post', () => {
    for (const post of getParsedPosts()) {
      expect(existsSync(post.coverImagePath)).toBe(true)
    }
  })
})
