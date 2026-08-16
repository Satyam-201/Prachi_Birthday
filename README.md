# Prachi's Birthday Movie

A three-part site, all reachable from one link:

1. **`index.html`** — opens with a countdown to 18 August (or, if it's
   already her birthday, straight to a wax-seal envelope). This is the
   link you send her.
2. **`movie.html`** — the movie: your real photos and song clips,
   a timeline built from the actual dates in your letter, a "reasons I
   love you" chapter, a playful "guess our story" quiz, and a
   make-a-wish candle finale.
3. **`letter.html`** — the royal, scroll-unrolling letter with your
   actual words, typed out on screen, with a button to play your
   recorded voice once you add it.

## Already done for you

- All 9 photos you sent and their matching song clips are already
  wired in (`images/ph1.jpg`…`ph11.jpg`, `audio/song1.mp3`…`song11.mp3`).
  Since your song files were already trimmed to the right length, each
  one just plays fully on its photo, then the movie moves to the next.
- The full text of your letter is in `letter-data.js`, exactly as you
  wrote it.

## What you still need to do

### 1. Add memories 2 and 3
You mentioned a couple of photos/songs are still missing. In
`movie-data.js`, find:
```js
{ id: 2, ready: false, image: "", audio: "", label: "Memory 02" },
{ id: 3, ready: false, image: "", audio: "", label: "Memory 03" },
```
Drop `ph2.jpg` / `song2.mp3` (and 3) into `/images` and `/audio`, then
update those two lines to match, e.g.:
```js
{ id: 2, ready: true, image: "images/ph2.jpg", audio: "audio/song2.mp3", label: "Memory 02" },
```
Until you do, the movie shows a tasteful "this memory is still being
written" placeholder in their place — nothing breaks.

### 2. Add your recorded voice
Put your voice recording in `/audio` named `voice-letter.mp3` (or edit
`VOICE_FILE` at the top of `letter-data.js` to match your filename).
Once it's there, the "Play Guru's Voice" button on the letter page
works, and the text automatically paces its typing to match how long
your recording runs.

### 3. One line I couldn't finish for you
In your letter, this line seems to cut off mid-sentence:
*"बस मेरे लिए तू मालप…"* — I kept it exactly as you wrote it in
`letter-data.js`. If it was meant to continue, finish it there before
sending.

### 4. Duplicate slide
`images/ph8.jpg` and `images/ph9.jpg` look like the same "Outfit Check"
design (same background, same text) — just flagging it in case it
wasn't intentional. If you meant them to be two different moments,
swap in the other photo; otherwise it's fine as-is, the audio clips
are still different for each.

## Preview it on your own computer

Double-click `index.html`. Everything works locally except that some
browsers block audio autoplay from `file://` pages — it'll all work
correctly once hosted (step below), and the movie already has a
"Press Play" tap-to-start screen specifically to get around that.

## Host it for free on GitHub Pages

1. Create a new GitHub repository (e.g. `for-prachi`), public is fine.
2. Upload every file and folder here into that repository.
3. **Settings → Pages** → Source: `Deploy from a branch`, branch
   `main`, folder `/ (root)`. Save.
4. After a minute or two you'll get a link like
   `https://yourusername.github.io/for-prachi/` — that's what you send.

## A quick honest note on scope

Your song clips currently total about 5–6 minutes, so the pure
slideshow part of the movie isn't 30 minutes on its own — I didn't
want to pad it with dead air or repeated content just to hit a number,
since that tends to feel boring rather than special. Instead I built
in real, interactive minutes: the timeline, the reasons carousel, and
the quiz. Once memories 2 and 3 are added and if you want to go
further, the easiest ways to genuinely extend the runtime are:

- Add more photo/song chapters (each is just one entry in
  `movie-data.js` — there's no limit on how many you add).
- Add more entries to `REASONS` and `TIMELINE` — each one adds real
  seconds of something to read, not filler.
- Use longer song clips, or clips from more of the song.

## Customizing the look

All colors, fonts, and timing come from the `:root { ... }` block at
the top of `style.css` — change a value there and it updates
everywhere. Ken Burns pan/zoom speed, per-reason display time, and
placeholder duration are all called out with comments in `movie.js`
and `movie-data.js` if you want to tune the pacing.
