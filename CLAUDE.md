# trevorwtaylor.com — Personal Website

Personal portfolio site for Trevor Taylor, aerospace engineer. Showcases rocketry projects, resume, and contact info.

## Stack and hosting
- Astro (static site), started from the minimal template, no UI framework
- Hosted on GitHub Pages, built and deployed by GitHub Actions (`.github/workflows/deploy.yml`) on every push to `main`
- Domain: trevorwtaylor.com (Cloudflare DNS, DNS-only records → GitHub Pages)
- twtaylor.com redirects to trevorwtaylor.com via a Cloudflare redirect rule
- Email: trevor@twtaylor.com via Cloudflare Email Routing (forward-only to Gmail)
- `public/CNAME` must stay in place for the custom domain

## Structure
- `src/layouts/BaseLayout.astro` — shared head, header nav (Home, Projects, Contact in the top right), footer
- `src/styles/global.css` — site-wide styles
- `src/pages/index.astro` — Home: banner, About Me with headshot, and a resume download button (the full web resume was removed; it's in git history at commit aac0ede)
- `src/pages/projects/index.astro` — Projects list as cards; `src/pages/projects/[id].astro` renders each project's detail page
- `src/content.config.ts` + `src/content/projects/*.md` — projects content collection; `src/lib/projects.ts` has sorting and date formatting
- `src/data/highlights.ts` — list of items in the Home page Highlights section (rendered by `src/components/Highlights.astro`). Highlights are photos and short silent looping clips only; longer videos and build/process photos go on the project pages
- `src/assets/media/` — Highlights photos; `public/media/` — converted Highlights videos (.mp4) and their poster .jpg
- `src/pages/contact.astro` — Contact page
- `src/assets/headshot.jpg` — photo, rendered with `Image` from `astro:assets`
- `public/resume.pdf` — public resume PDF (phone number intentionally removed)

## Projects
Current: Class K Rocket; SRM Build + Test; TVC Rocket + Launch Pad.
Future: Tripoli Level 1 and Level 2 certification builds.
Plan: each project as a Markdown file in an Astro content collection, with its own detail page linked from the Projects list.

## Conventions
- Page-specific styles go in scoped `<style>` blocks; shared styles in `global.css`
- Keep the site fully static (no server code); contact is via mailto link
- Images go through `astro:assets` for optimization
- Videos: short clips are converted with ffmpeg (installed via winget) to small H.264 .mp4 files in `public/media/`; long videos go on YouTube. Never commit raw .mov originals; they live outside the repo in `C:\Users\trevo\OneDrive\Desktop\Personal_Website_Media`

## Working with Trevor
- He's an experienced engineer but newer to web development, so briefly explain what each change does and why
- Make focused changes; do not commit or push unless asked
- Dev server: `npm run dev` → http://localhost:4321