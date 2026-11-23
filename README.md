# COS 333 · Exam Study Hub

A study website for COS 333 (Programming Languages, University of Pretoria): in-depth and brief notes for all examinable chapters (1, 2, 5, 6, 7, 8, 9, 12, 15, 16), a Scheme & Prolog workbook built from every past paper (model answers tested in Racket and SWI-Prolog), a question bank, flashcards and a mock exam in the 2026 format.

Stack: React + Vite + TypeScript, Tailwind CSS with shadcn-style components, ApexCharts, hash routing (works on GitHub Pages). Progress is saved in the browser (localStorage).

## Deploy to GitHub Pages

1. Create a new **public** repository on GitHub (e.g. `cos333`).
2. Upload the contents of this folder (everything except `node_modules` / `dist`), either:
   - **In the browser:** on the empty repo page click *uploading an existing file*, drag in all files and folders, and commit. (Make sure the hidden `.github` folder is included — if your file manager hides it, use the git option.)
   - **With git:**
     ```bash
     git init
     git add .
     git commit -m "COS 333 study hub"
     git branch -M main
     git remote add origin https://github.com/<your-username>/cos333.git
     git push -u origin main
     ```
3. In the repo go to **Settings → Pages** and set **Source** to **GitHub Actions** (one time only).
4. Open the **Actions** tab and wait for "Deploy to GitHub Pages" to go green (~1–2 minutes).
5. Your site is live at `https://<your-username>.github.io/cos333/`.

Every later push to `main` redeploys automatically.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

## Editing the content

All study content is plain Markdown in `src/content/`:

| File | What it holds |
|---|---|
| `chapters/chXX.md` | `# Notes` (each `##` is a section; `<!-- diagram:key -->` inserts a diagram), `# Brief`, `# Traps`, `# Flashcards` (`Q:` / `A:` pairs) |
| `questions/chXX.md` | `### id \| mcq\|multi\|fill \| source`, then the prompt, `- [ ]` / `- [x]` options (or `= answer` for fill-ins), `>` explanation |
| `coding-scheme.md`, `coding-prolog.md` | `### id \| lang \| name \| source \| pattern` with `#### spec / hint / solution / explanation / tests / facts / attempt` |
| `patterns.md` | The pattern cheat sheet |

Chapter titles, colours and scope notes are in `src/data/chapters.ts`.

## Testing the model answers

With [Racket](https://racket-lang.org) and [SWI-Prolog](https://www.swi-prolog.org) installed:

```bash
npm run test:solutions
```

Runs every Scheme and Prolog model answer against its test cases (Prolog tests collect *all* answers, so invalid instantiations on re-query are caught).

## A note on answers

Past-paper answers are study answers worked out from the slides and textbook. Where the marked 2026 paper confirms an answer, the explanation says so.
