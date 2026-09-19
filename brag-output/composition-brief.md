# Hyperframes Composition Brief: Pact

## Objective
Create a short launch-style brag video for Pact — the agent-to-agent marketplace where AI agents propose deals and humans approve them.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: ~19.5s (within 15–25s)

## Source Material
- Project root: `D:\code\Pact`
- Primary files read: `index.html`, `src/styles/base.css`, `src/styles/nav-hero.css`, `src/styles/sections.css`, `src/styles/how.css`, `src/components/Hero.tsx`, `src/components/TwoAgents.tsx`, `src/components/NegotiationDemo.tsx`, `src/components/how/stages.tsx`, `src/components/FinalCTA.tsx`
- Product name: Pact
- Tagline / strongest claim: "AI agents propose. Humans approve." / "Let agents land deals. You decide."
- Key UI or visual moment to recreate: the tilted paper workspace card ("Exhibit 001", pipeline C → PACT → B, checklist log, campaign proposal $4,500 / 7 days / +$1,000 bonus) and the approval stamp moment ("Your decision" → "Approved by you")
- Copy that must appear verbatim:
  - "Let agents land deals." / "You decide."
  - "AI agents propose. Humans approve." (or the paired "AI proposes. / You approve.")
  - "1 Instagram Reel", "$4,500", "7 days", "+$1,000" (illustrative demo values)
  - "Approved by you", "Approve deal"
  - "Scout / Match / Negotiate / Approve / Protect / Deliver / Verify / Get paid"
  - "Your agent. Your next deal."

## Creative Direction
- Tone preset: `polished`
- Creative direction: "quiet premium product film — cobalt field, paper artifacts, pixel-type confidence"
- Interpretation: fewer scenes, longer holds, deliberate entrances; hard cuts only at the stamp and the workflow acceleration; no feature-list montage
- Angle: agents do the work, humans keep the pen — a deal assembles itself, then waits for the human stamp
- Hook: cobalt field, pixel-type "LET AGENTS / LAND DEALS." clip-reveal, then "YOU DECIDE." in periwinkle
- Outro / punchline: workflow strip accelerates through all 8 stages (APPROVE held in accent) → PACT mark + "Your agent. Your next deal." + "Payment protected. Outcomes verified."
- Avoid: generic SaaS language, abstract filler visuals, crypto/Web3 vibes, unrelated redesign, invented traction/claims

## Visual Identity
- Background: cobalt `#1520b8` (hi `#2e3ae8`, deep `#0c148c`), faint white dotted grid texture
- Paper surface: `#f4f3ee`; ink `#171818`; accent periwinkle `#ccdbff`; secondary `#a8aed9`
- Display font: Geist Pixel Square — `public/fonts/GeistPixel-Square.woff2` (copy into composition assets; @font-face required by lint)
- Body font: DM Sans — `public/fonts/DMSans-Variable.woff2`; metadata/labels: Geist Mono — `public/fonts/GeistMono-Variable.woff2`
- Visual references: the tilted paper workspace card with offset cobalt shadow (`rotate(-3deg)`, `box-shadow: -10px 10px 0 #0c148c`), thin hairline borders, square corners, mono micro-labels, dashed dividers, the "Approved by you" stamp chip, the workflow marquee strip

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract.

Scene summary:
1. The thesis — 3.5s — pixel-type "LET AGENTS / LAND DEALS." / "YOU DECIDE." line-by-line clip reveal on cobalt
2. The deal assembles itself — 5s — paper workspace card lands; pipeline C→PACT→B connects; 3 log events tick to Done; proposal block materializes ($4,500 · 7 days · +$1,000); status flips "Preparing" → "Your review"
3. The negotiation — 3s — CREATOR AGENT / BRAND AGENT headers; 3 alternating proposal chips ("$3,800 flat" → "$4,500 + $1,000 bonus" → "Agreed") arrive like dealt cards
4. The human in the loop — 3.5s — decision row: "Your decision" chip + Decline / Request changes / Approve deal; cursor glides, clicks Approve; held breath; "✓ Approved by you" stamp slams; "AI proposes. / You approve." resolves
5. The machine, named — 4.5s — workflow strip runs SCOUT→…→GET PAID accelerating, APPROVE held in accent; resolves to PACT mark + "Your agent. Your next deal." + "Payment protected. Outcomes verified."

## Audio
- Audio role: warm confident bed + restrained motion-matched SFX
- Audio arc: bed enters with scene 1 headline → ticks along the assembling deal → drops for a half-beat before the stamp → lifts into the logo resolve → fades under logo hold
- Music: `happy-beats-business-moves-vol-12-by-ende-dot-app.mp3` at ~0.32 volume, fast fade-in, fade-out over final ~1.5s
- Music cue guidance: bundled preset `.devin/skills/brag/assets/music/cues/happy-beats-business-moves-vol-12-by-ende-dot-app.music-cues.json` — ~110 BPM, beat grid from 0.56s (~0.55s spacing), strong cues at 8.74 / 10.93 / 13.11 / 17.47 / 18.56 / 22.93s. Strong-cue locks (≤3): scene-1 "YOU DECIDE." (~1.64s), scene-4 stamp (nearest strong cue to the click), scene-5 logo resolve (~17.47–18.56s).
- Audio-reactive treatment: subtle — at most a faint glow/presence breathe on the cobalt field behind the workspace card via RMS; no waveform/equalizer visuals. If extraction is unavailable, skip and document.
- Audio-coupled moments:
  - Scene 1 — headline line slams (low confident hits per line)
  - Scene 2 — card-place on the document landing; dry tick per checklist item; soft rise on proposal reveal
  - Scene 3 — alternating soft card-slide/card-place per proposal chip
  - Scene 4 — mouse click on the button; paper/impact thunk on the stamp (the one big SFX)
  - Scene 5 — beat-grid word ticks during the accelerating strip; one clean accent on the logo resolve
- SFX selection guidance: prefer low/medium HF-risk files (see `.devin/skills/brag/assets/sfx/sfx-analysis.md`); casino/card family fits the "deal" motif; impactSoft for the stamp; interface/ui clicks for cursor
- Exact SFX choice: Hyperframes chooses filenames, timestamps, density, volume after visuals exist
- Audio files: copy music + chosen SFX into `brag-output/composition/assets/`; relative paths only

## Hyperframes Instructions
Load the composition-building HyperFrames domain skills — `hyperframes-core`, `hyperframes-animation`, `hyperframes-creative`, `hyperframes-keyframes`, `hyperframes-cli`. /brag is its own workflow: do not enter the `hyperframes` entry-point intent interview and do not route into its generic promo / launch-video workflow.

Requirements:
- Show at least one real UI/copy/visual element from the project (the workspace card and approval moment are the recreated surfaces).
- Keep all text readable in the final render (see reading-time floor in the plan).
- Total duration 15–25s.
- Include the music + SFX layer per the audio section.
- Music cue metadata is optional timing hints — ignore cues that hurt readability or pacing.
- Use local assets for audio and fonts; relative paths.
- Run `hyperframes check` before render — the single gate.
