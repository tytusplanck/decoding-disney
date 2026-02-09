import type { PostEntry } from './posts'

const DEFAULT_POST_COVER_IMAGE_DIMENSION = 512

export interface OpenGraphDefaults {
  path: string
  width: number
  height: number
}

export interface PostOpenGraph {
  imageUrl: string
  imageWidth: number
  imageHeight: number
  publishedTime: string
  modifiedTime: string
  authorName?: string
}

export interface ArticleJsonLd {
  '@context': 'https://schema.org'
  '@type': 'Article'
  headline: string
  description: string
  datePublished: string
  dateModified: string
  image: string
  mainEntityOfPage: string
  author?: {
    '@type': 'Person'
    name: string
  }
}

function buildAbsoluteUrl(pathname: string, siteOrigin: string): string {
  return new URL(pathname, siteOrigin).toString()
}

export function buildCanonicalUrl(pathname: string, siteOrigin: string): string {
  return buildAbsoluteUrl(pathname, siteOrigin)
}

export function buildPostOpenGraph(
  post: PostEntry,
  siteOrigin: string,
  defaults: OpenGraphDefaults
): PostOpenGraph {
  const modifiedDate = post.data.updatedDate ?? post.data.date
  if (post.data.ogImage?.url) {
    return {
      imageUrl: buildAbsoluteUrl(post.data.ogImage.url, siteOrigin),
      imageWidth: post.data.ogImage.width ?? defaults.width,
      imageHeight: post.data.ogImage.height ?? defaults.height,
      publishedTime: post.data.date.toISOString(),
      modifiedTime: modifiedDate.toISOString(),
      authorName: post.data.author.name,
    }
  }

  const coverImagePath = post.data.coverImage?.src ?? defaults.path
  return {
    imageUrl: buildAbsoluteUrl(coverImagePath, siteOrigin),
    imageWidth: DEFAULT_POST_COVER_IMAGE_DIMENSION,
    imageHeight: DEFAULT_POST_COVER_IMAGE_DIMENSION,
    publishedTime: post.data.date.toISOString(),
    modifiedTime: modifiedDate.toISOString(),
    authorName: post.data.author.name,
  }
}

export function buildArticleJsonLd(
  post: PostEntry,
  canonicalUrl: string,
  ogImageUrl: string
): ArticleJsonLd {
  const modifiedDate = post.data.updatedDate ?? post.data.date
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.data.title,
    description: post.data.excerpt,
    datePublished: post.data.date.toISOString(),
    dateModified: modifiedDate.toISOString(),
    image: ogImageUrl,
    mainEntityOfPage: canonicalUrl,
    author: post.data.author?.name ? { '@type': 'Person', name: post.data.author.name } : undefined,
  }
}
