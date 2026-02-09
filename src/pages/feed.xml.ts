import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { getPublishedPostsSorted } from '../lib/posts'
import { SITE_DESCRIPTION, SITE_NAME } from '../lib/site'

export async function GET(context: APIContext) {
  const posts = await getPublishedPostsSorted()
  return rss({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: post.data.date,
      link: `/posts/${post.slug}`,
    })),
  })
}
