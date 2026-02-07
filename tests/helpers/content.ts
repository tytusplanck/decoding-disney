import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

interface PostData {
  title?: unknown
  excerpt?: unknown
  date?: unknown
  updatedDate?: unknown
  draft?: unknown
  author?: unknown
  keywords?: unknown
  ogImage?: unknown
}

export interface ParsedPost {
  slug: string
  filePath: string
  coverImagePath: string
  body: string
  data: PostData
}

const POSTS_DIR = path.resolve(process.cwd(), 'src/content/posts')

export function getPostSlugs(): string[] {
  if (!existsSync(POSTS_DIR)) {
    throw new Error(`Posts directory not found: ${POSTS_DIR}`)
  }

  return readdirSync(POSTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
}

export function getParsedPosts(): ParsedPost[] {
  return getPostSlugs().map((slug) => {
    const postDir = path.join(POSTS_DIR, slug)
    const filePath = path.join(postDir, 'index.md')
    const coverImagePath = path.join(postDir, 'cover.jpg')
    const source = readFileSync(filePath, 'utf8')
    const parsed = matter(source)

    return {
      slug,
      filePath,
      coverImagePath,
      body: parsed.content,
      data: parsed.data as PostData,
    }
  })
}

export function getDraftSlugs(): string[] {
  return getParsedPosts()
    .filter((post) => post.data.draft === true)
    .map((post) => post.slug)
    .sort()
}

export function getPublishedPosts(): ParsedPost[] {
  return getParsedPosts().filter((post) => post.data.draft !== true)
}

export function getPublishedSlugs(): string[] {
  return getPublishedPosts()
    .map((post) => post.slug)
    .sort()
}
