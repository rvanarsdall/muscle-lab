# Muscle Lab

A React + TypeScript + Vite pilot for BIO 264 muscle identification. Six anterior-thigh muscles, narrated mnemonic lessons, a Remotion memory tour, and shuffled pin rounds.

## Run

```sh
npm ci
npm run dev
npm test
npm run build
```

The production output is `dist/`. Relative asset URLs support GitHub Pages project paths and ordinary static hosting. A GitHub Pages Actions workflow is included; select GitHub Actions as the Pages source in the destination repository. No server or runtime API keys are required.

## Content and components

- `src/content.ts`: names, source image URLs, normalized pin coordinates, landmarks, memory hooks, scripts.
- `src/App.tsx`: lessons, reusable image/audio components, practice and rehearsal modes.
- `src/WatchPane.tsx`: lazy-loaded video activities and original course demonstration.
- `src/MemoryTour.tsx`: Remotion Player composition using the same content and voice clips.
- `src/quiz.ts`: answer checking, shuffling and progress storage.
- `public/audio/`: generated ElevenLabs narration with expressive delivery and pause tags.
- `src/audio-durations.json`: measured clip lengths used for the tour timeline.

Audio generation is an offline authoring operation. `scripts/generate-audio.mjs` uses the owner's existing local ElevenLabs config, never ships credentials, and skips existing clips. It uses the configured Rob Clone with `eleven_v3`. Review new pronunciations by listening before broader use. If scripts or audio change, remeasure durations with ffprobe and update the JSON.

## Learning behavior

Practice gives feedback and optional landmarks. Correct answers with a hint do not count as unaided recall. Rehearsal withholds feedback and progress updates until the end. Optional 30-second stations record an unanswered question as a miss. Full names are required; capitalization, punctuation and spacing are ignored. Spelling is strict. Missed or assisted answers can be rematched.

Progress is stored only in localStorage on the current browser/device, without accounts or microphone recording. Storage failure falls back to session state. Previously missed items remain eligible for review even after later successes; this is a conservative review queue, not a spaced repetition algorithm or mastery assessment.

## Sources and boundaries

The pilot includes only rectus femoris, vastus lateralis, vastus medialis, vastus intermedius, sartorius and gracilis. It is not the full weeks 8–10 exam list. Course requirements and cadaver identification should be verified with the instructor.

Images are served directly from BYU–Idaho's original course host; the original demonstration page is embedded, with a direct-link fallback. No course images or videos are copied into this repository. Their rights remain with their respective owners; verify reuse terms before broader distribution or making local copies. Course availability and embedding policies can affect image/video loading.

Anatomy location reference: https://openstax.org/books/anatomy-and-physiology/pages/11-6-appendicular-muscles-of-the-pelvic-girdle-and-lower-limbs

Course source: https://content.byui.edu/file/dc5a9585-91a1-40dd-b73e-0d17e0ba9594/1/leg-muscles-lab/index.html

The course filename `Vastus Medius Anterior.png` supplies the vastus medialis illustration; display text uses the anatomical name. Pin locations were visually checked against all six source images. Highlighted illustrations provide scaffolded identification, not a realistic cadaver practical. No generated anatomy is used.
