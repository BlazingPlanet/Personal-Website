import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

// Newest first: ongoing projects (no end date) on top, then by most recent end date,
// with start date as the tiebreaker.
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection('projects');
  const endTime = (p: Project) => p.data.endDate?.getTime() ?? Infinity;
  return projects.sort(
    (a, b) =>
      endTime(b) - endTime(a) || b.data.startDate.getTime() - a.data.startDate.getTime(),
  );
}

// Frontmatter dates are parsed as UTC midnight, so format in UTC to avoid
// a date like 2024-03-01 showing as "Feb 2024" in a US timezone.
const monthYear = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatDateRange(start: Date, end?: Date): string {
  return `${monthYear.format(start)} – ${end ? monthYear.format(end) : 'Present'}`;
}
