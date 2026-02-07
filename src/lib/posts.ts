import { getCollection, type CollectionEntry } from 'astro:content'

export type PostEntry = CollectionEntry<'posts'>

function sortByDateDesc(a: PostEntry, b: PostEntry): number {
  return b.data.date.getTime() - a.data.date.getTime()
}

export async function getAllPostsSorted(): Promise<PostEntry[]> {
  const posts = await getCollection('posts')
  return posts.filter((post) => !post.data.draft).sort(sortByDateDesc)
}

export async function getPostBySlug(slug: string): Promise<PostEntry | undefined> {
  const posts = await getAllPostsSorted()
  return posts.find((post) => post.slug === slug)
}
