import { defineCollection, z } from 'astro:content'

const posts = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      excerpt: z.string(),
      date: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      draft: z.boolean().default(false),
      author: z.object({ name: z.string() }),
      coverImage: image(),
      ogImage: z
        .object({
          url: z.string(),
          width: z.number().int().positive().optional(),
          height: z.number().int().positive().optional(),
        })
        .optional(),
      keywords: z.array(z.string()).optional(),
    }),
})

export const collections = { posts }
