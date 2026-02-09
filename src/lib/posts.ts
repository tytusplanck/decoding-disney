import { getCollection, type CollectionEntry } from 'astro:content'

export type PostEntry = CollectionEntry<'posts'>
export interface PostStaticPathEntry {
  params: { slug: string }
  props: { entry: PostEntry }
}

function sortByDateDesc(a: PostEntry, b: PostEntry): number {
  return b.data.date.getTime() - a.data.date.getTime()
}

let allPostsPromise: Promise<PostEntry[]> | undefined
let publishedPostsSortedPromise: Promise<PostEntry[]> | undefined

async function getAllPosts(): Promise<PostEntry[]> {
  if (!allPostsPromise) {
    allPostsPromise = getCollection('posts')
  }

  return allPostsPromise
}

export async function getPublishedPostsSorted(): Promise<PostEntry[]> {
  if (!publishedPostsSortedPromise) {
    publishedPostsSortedPromise = getAllPosts().then((posts) =>
      posts.filter((post) => !post.data.draft).sort(sortByDateDesc)
    )
  }

  return publishedPostsSortedPromise
}

export async function getPostStaticPathEntries(): Promise<PostStaticPathEntry[]> {
  const posts = await getPublishedPostsSorted()
  return posts.map((entry) => ({ params: { slug: entry.slug }, props: { entry } }))
}

export async function getAllPostsSorted(): Promise<PostEntry[]> {
  return getPublishedPostsSorted()
}

export async function getPostBySlug(slug: string): Promise<PostEntry | undefined> {
  const posts = await getPublishedPostsSorted()
  return posts.find((post) => post.slug === slug)
}
