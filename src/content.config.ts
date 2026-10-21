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
      // Photo for the project's card on the Projects page (cropped to 3:2).
      // Path relative to the Markdown file, e.g. ../../assets/media/tvc-cover.jpg
      cover: image().optional(),
      coverAlt: z.string().optional(),
      // Which part of the cover photo to keep when it's cropped: "center" (default), "top",
      // "bottom", or a CSS object-position value like "center 30%"
      coverPosition: z.string().default('center'),
    }),
});

export const collections = { projects };
