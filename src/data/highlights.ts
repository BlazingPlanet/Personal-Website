import type { ImageMetadata } from 'astro';
import ogRocketFrame2 from '../assets/media/OG_Rocket_Frame2.JPG';

// Items shown in the Highlights section on the Home page, in this order.
// Highlights are photos and short silent looping clips only; longer videos go on project pages.
//
// - Photos: put the file in src/assets/media/, import it above, and add a `photo` entry.
// - Clips: convert to a small .mp4 with ffmpeg into public/media/, plus a poster .jpg (the still
//   shown while it loads). They play silently on repeat, like a GIF. width/height are the clip's
//   pixel size, which reserves the right amount of space before it loads.
// - `project` is a file name from src/content/projects/ (without .md) and adds a link to that page.
export type Highlight = {
  caption: string;
  project?: string;
} & (
  | { type: 'photo'; image: ImageMetadata; alt: string }
  | { type: 'clip'; src: string; poster: string; width: number; height: number }
);

export const highlights: Highlight[] = [
  {
    type: 'photo',
    image: ogRocketFrame2,
    alt: 'Rocket lifting off from a dry lakebed on a column of white smoke',
    caption: 'Liftoff',
  },
  {
    type: 'clip',
    src: '/media/static-fire.mp4',
    poster: '/media/static-fire.jpg',
    width: 720,
    height: 1280,
    caption: 'Static fire',
    project: 'srm-build-test',
  },
];
