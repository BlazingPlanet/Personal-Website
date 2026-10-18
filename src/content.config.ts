import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Each Markdown file in src/content/projects/ becomes one project.
// The schema validates frontmatter at build time, so a missing or mistyped field fails the build.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      startDate: z.coerce.date(),
      // Leave out for an ongoing project; it displays as "Present".
      endDate: z.coerce.date().optional(),
      // Path relative to the Markdown file, e.g. ../../assets/projects/tvc-cover.jpg
      cover: image().optional(),
      coverAlt: z.string().optional(),
      tags: z.array(z.string()).default([]),
    }),
});

export const collections = { projects };
