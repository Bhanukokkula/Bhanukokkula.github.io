# Bhanuprasad Kokkula — Portfolio

Personal portfolio site built with Next.js 14, Tailwind CSS, and Framer Motion.

## Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Theme:** next-themes (dark-mode first, light toggle)
- **Deployment:** Vercel

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Updating Content

**All content lives in one file:** [`src/data/profile.ts`](src/data/profile.ts)

Edit that file — every section on the site updates automatically.

Key fields to fill in before launch:

| Field | Location in profile.ts | What to add |
|---|---|---|
| Email | `contact.email` | Your real email address |
| LinkedIn | `contact.linkedin` | Your LinkedIn profile URL |
| GitHub | `contact.github` | Your GitHub profile URL |
| MARS repo | `projects[0].githubUrl` | GitHub URL for MARS |
| PharmaAI repo | `projects[1].githubUrl` | GitHub URL for PharmaAI |
| MARS demo | `projects[0].demoUrl` | Live demo URL (optional) |
| MARS image | `projects[0].imageUrl` | `/mars-diagram.png` or similar |
| PharmaAI image | `projects[1].imageUrl` | `/pharmaai-screenshot.png` or similar |

---

## Adding Public Assets

Place these files in the `/public` directory:

- **`/public/resume.pdf`** — your resume (the Download Resume button links here)
- **`/public/profile.jpg`** — profile photo (not currently used, reserved for future use)
- **`/public/mars-diagram.png`** — MARS architecture diagram (optional; shown in project card)
- **`/public/pharmaai-screenshot.png`** — PharmaAI screenshot (optional)

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          ← root layout, SEO metadata, JSON-LD
│   ├── page.tsx            ← assembles all sections
│   └── globals.css
├── data/
│   └── profile.ts          ← single source of truth for all content
└── components/
    ├── layout/
    │   ├── Header.tsx      ← sticky nav with scroll detection + mobile drawer
    │   └── Footer.tsx
    ├── sections/
    │   ├── Hero.tsx
    │   ├── About.tsx
    │   ├── Experience.tsx
    │   ├── Projects.tsx
    │   ├── Skills.tsx
    │   ├── Research.tsx    ← Research interests + Certifications
    │   └── Contact.tsx
    ├── ui/
    │   ├── Chip.tsx        ← skill/stack badge
    │   ├── SectionWrapper.tsx  ← fade-in animation + anchor offset
    │   ├── ThemeToggle.tsx
    │   └── ProjectCard.tsx ← MARS / PharmaAI card with expandable detail
    └── providers/
        └── ThemeProvider.tsx
```

---

## Deployment (Vercel)

```bash
# Push to GitHub, then connect repo in Vercel dashboard
# Or deploy directly:
npx vercel
```

No environment variables required for the base build.

---

## SEO

- `<title>` and `<meta description>` set in `src/app/layout.tsx`
- OpenGraph + Twitter card meta tags included
- JSON-LD `Person` schema in `<head>` — update `sameAs` with your LinkedIn/GitHub after filling in `profile.ts`
