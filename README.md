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

Practice gives feedback and optional landmarks. Correct answers with a hint do not count as unaided recall. Rehearsal withholds feedback and progress updates until the end. Optional 30-second stations record an unanswered question as a miss. Answers are selected from a dropdown containing all six muscle names; spelling is not tested. The learner can choose “I’m not sure yet.” Missed or assisted answers can be rematched.

Progress is stored only in localStorage on the current browser/device, without accounts or microphone recording. Storage failure falls back to session state. Previously missed items remain eligible for review even after later successes; this is a conservative review queue, not a spaced repetition algorithm or mastery assessment.

## Sources and boundaries

The pilot includes only rectus femoris, vastus lateralis, vastus medialis, vastus intermedius, sartorius and gracilis. It is not the full weeks 8–10 exam list. Course requirements and cadaver identification should be verified with the instructor.

Images are served directly from BYU–Idaho's original course host; the original demonstration page is embedded, with a direct-link fallback. No course images or videos are copied into this repository. Their rights remain with their respective owners; verify reuse terms before broader distribution or making local copies. Course availability and embedding policies can affect image/video loading.

Anatomy location reference: https://openstax.org/books/anatomy-and-physiology/pages/11-6-appendicular-muscles-of-the-pelvic-girdle-and-lower-limbs

Course source: https://content.byui.edu/file/dc5a9585-91a1-40dd-b73e-0d17e0ba9594/1/leg-muscles-lab/index.html

The course filename `Vastus Medius Anterior.png` supplies the vastus medialis illustration; display text uses the anatomical name. Pin locations were visually checked against all six source images. Highlighted illustrations provide scaffolded identification, not a realistic cadaver practical. No generated anatomy is used.

## Animated tour revision

The six approved scripts now teach identity, location, recognition, action and word meaning in that order. The BYU–Idaho written introduction is the course reference: https://content.byui.edu/file/dc5a9585-91a1-40dd-b73e-0d17e0ba9594/1/leg-muscles-lab/Pages/10_1_1_intro_legs.html. `src/muscleDetails.ts` records a plain-language course cross-check for each muscle and the additional movement/name explanations.

`generate-audio.mjs` uses ElevenLabs' timestamped TTS response. `measure-audio.mjs` measures the resulting files and derives caption and scene-change timing; run it after regenerating audio. `src/timing/` holds character alignment; `tour-timing.json` holds runtime captions and phase starts. No credentials appear in these files.

`MemoryTour.tsx` animates source-image focus outlines, arrows, close-ups, simplified movement sketches, name breakdowns, and a comparison with a second illustration. Outlines are instructional focus regions, not exact muscle segmentations. Movement sketches show one action, not a full biomechanical model. Reduced motion and chapter buttons are provided.

Additional images: Henry Vandyke Carter's public-domain Gray's Anatomy drawings, retrieved from Wikimedia Commons after image search. Original images are retained unmodified; overlays are separate. The gallery and `public/reference/ATTRIBUTION.md` link their source and reuse information. These are illustrations, not specimen photographs.

Watch & Listen offers 0.85×, 1×, 1.25×, 1.5×, 1.75× and 2× tour playback. The selected rate is remembered on the device. Remotion's Player playbackRate drives audio and frames together so captions and annotations remain synchronized.

The six course-model outlines and arrow points were recalculated from the colored muscle pixels in each original image. Actual source dimensions are used, including the 546 × 690 sartorius illustration. This corrects the previously offset diagonal-strap outline. All native dropdowns use one inset SVG chevron with reserved text spacing.

Pitch preservation is explicitly enabled both on Remotion Player (for the selected viewing speed) and each Audio clip, including the native-audio fallback. This avoids the default pitch increase at 1.5× or 2×. Reference: https://www.remotion.dev/docs/player/player#preservepitch

## Presentation order

Learn the landmarks, Watch & Listen, and pin-round setup each offer **In order / Shuffle**. Ordered mode follows the original six-muscle presentation. Shuffling keeps every muscle exactly once, and **Shuffle again** always changes the current sequence. The overview remains first in the tour; chapter buttons, narration, captions and muscle numbering follow the selected muscle order. Changing tour order pauses playback and restarts the reordered tour. Speed and pitch preservation remain active. Single-muscle review rounds remain valid.

## Hosting and mobile playback

Canonical repository: https://github.com/rvanarsdall/muscle-lab. GitHub Pages is deployed by `.github/workflows/pages.yml`; enable GitHub Actions as the Pages publishing source. The earlier ChatGPT Sites pilot can remain available during migration.

**Expand lesson** opens a screen-filling player overlay that also works when a phone browser does not support native element fullscreen. The overlay keeps speed controls available, supports Escape/Close, and keeps keyboard focus inside while open. Turning the phone sideways gives a larger landscape view.
