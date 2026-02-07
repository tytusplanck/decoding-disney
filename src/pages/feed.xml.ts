import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { getAllPostsSorted } from '../lib/posts'

export async function GET(context: APIContext) {
  const posts = await getAllPostsSorted()
  return rss({
    title: 'Decoding Disney',
    description: 'Your ultimate guide to Disney parks, with tips, reviews, and insider knowledge.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: post.data.date,
      link: `/posts/${post.slug}`,
    })),
  })
}
