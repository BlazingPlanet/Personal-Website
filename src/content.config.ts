import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// A project date is either a full date (2024-06-01, shown as "Jun 2024") or just a year
// (2019, shown as "2019") for when the exact dates aren't known.
const projectDate = z.union([
  z
    .number()
    .int()
    .transform((year) => ({ date: new Date(Date.UTC(year, 0, 1)), yearOnly: true })),
  z.coerce.date().transform((date) => ({ date, yearOnly: false })),
]);

// Each Markdown file in src/content/projects/ becomes one project.
// The schema validates frontmatter at build time, so a missing or mistyped field fails the build.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      startDate: projectDate,
      // Leave out for an ongoing project; it displays as "Present".
      endDate: projectDate.optional(),
      // Path relative to the Markdown file, e.g. ../../assets/projects/tvc-cover.jpg
      cover: image().optional(),
      coverAlt: z.string().optional(),
    }),
});

export const collections = { projects };
