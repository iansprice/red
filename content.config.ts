import {defineContentConfig, defineCollection, z} from "@nuxt/content";

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md'
    }),
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md'
    }),
    projects: defineCollection({
      type: 'page',
      source: 'projects/*.md',
      schema: {
        techStack: z.array(z.string()).optional(),
        links: z.object({
          live: z.string().optional(),
          github: z.string().optional()
        }).optional(),
        logo: z.string(),
        role: z.string()
      }
    })
  }
})
