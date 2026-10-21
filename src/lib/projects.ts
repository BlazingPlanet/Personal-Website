import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;
export type ProjectDate = Project['data']['startDate'];

// Newest first: ongoing projects (no end date) on top, then by most recent end date,
// with start date as the tiebreaker.
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection('projects');
  const endTime = (p: Project) => p.data.endDate?.date.getTime() ?? Infinity;
  return projects.sort(
    (a, b) =>
      endTime(b) - endTime(a) ||
      b.data.startDate.date.getTime() - a.data.startDate.date.getTime(),
  );
}

// Frontmatter dates are parsed as UTC midnight, so format in UTC to avoid
// a date like 2024-03-01 showing as "Feb 2024" in a US timezone.
const monthYear = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const formatDate = ({ date, yearOnly }: ProjectDate) =>
  yearOnly ? String(date.getUTCFullYear()) : monthYear.format(date);

// "Jun 2024 – Present", "Jan 2024 – May 2024", or just "2019" when start and end match
export function formatDateRange(start: ProjectDate, end?: ProjectDate): string {
  const from = formatDate(start);
  if (!end) return `${from} – Present`;
  const to = formatDate(end);
  return from === to ? from : `${from} – ${to}`;
}
