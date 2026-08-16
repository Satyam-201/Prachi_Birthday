/* ============================================================
   EDIT ME — everything shown in the movie is driven from here.

   PHOTO CHAPTERS
   Each entry needs:
     image  -> file in /images
     audio  -> file in /audio (the song clip for this photo — these
               already auto-play for their own length, then move on)
     label  -> small "Memory 0X" tag shown briefly on screen
     ready  -> set to true once image+audio exist. Chapters 2 and 3
               are placeholders below — as soon as you add
               images/ph2.jpg + audio/song2.mp3 (and same for 3),
               flip ready to true and fill in image/audio.
   ============================================================ */

const PHOTO_CHAPTERS = [
  { id: 1,  ready: true,  image: "images/ph1.jpg",  audio: "audio/song1.mp3",  label: "Memory 01",
    caption: "It wasn't loud. It wasn't dramatic. But somehow, in that one glance, you became the most beautiful distraction of my entire day." },
  { id: 2,  ready: true, image: "images/ph2.jpg",                 audio: "audio/song2.mp3",                 label: "Memory 02", caption: "Somewhere between fear and hope, I chose you—and I’ve never looked back." },
  { id: 3,  ready: true, image: "images/ph3.jpg",                 audio: "audio/song3.mp3",                 label: "Memory 03", caption: "Those late-night visits to your profile quietly became the beginning of my favourite story." },
  { id: 4,  ready: true,  image: "images/ph4.jpg",  audio: "audio/song4.mp3",  label: "Memory 04",
    caption: "That was the day my favourite chapter began." },
  { id: 5,  ready: true,  image: "images/ph5.jpg",  audio: "audio/song5.mp3",  label: "Memory 05",
    caption: "It wasn't always easy, but it was real." },
  { id: 6,  ready: true,  image: "images/ph6.jpg",  audio: "audio/song6.mp3",  label: "Memory 06",
    caption: "That wasn't just a video call — it was the beginning of something real." },
  { id: 7,  ready: true,  image: "images/ph7.jpg",  audio: "audio/song7.mp3",  label: "Memory 07",
    caption: "We didn't just get comfortable talking to each other, we got comfortable being real." },
  { id: 8,  ready: true,  image: "images/ph8.jpg",  audio: "audio/song8.mp3",  label: "Memory 08",
    caption: "You don't just wear outfits, you wear moments." },
  { id: 9,  ready: true,  image: "images/ph9.jpg",  audio: "audio/song9.mp3",  label: "Memory 09",
    caption: "Every outfit becomes my favorite when it's you wearing it." },
  { id: 10, ready: true,  image: "images/ph10.jpg", audio: "audio/song10.mp3", label: "Memory 10",
    caption: "Every time I see you, my heart whispers, \u201cthis is the one.\u201d" },
  { id: 11, ready: true,  image: "images/ph11.jpg", audio: "audio/song11.mp3", label: "Memory 11",
    caption: "This is not just a dream anymore. This is our goal." },
   { id: 12, ready: true,  image: "images/ph12.jpg", audio: "audio/song12.mp3", label: "Memory 12",
    caption: "Different moments, one journey, two hearts—and one beautiful future we’re building together." },
{ id: 13, ready: true,  image: "images/ph13.jpg", audio: "audio/song13.mp3", label: "Memory 13",
    caption: "“If I could live this life a thousand times, I’d still choose you—in every one of them.” ❤️" }
];

/* Placeholder screen time (seconds) for any chapter that isn't ready yet */
const PLACEHOLDER_DURATION = 6;

/* ============================================================
   OUR TIMELINE — pulled straight from your letter's real dates.
   Edit freely; add more events any time.
   ============================================================ */
const TIMELINE = [
  { date: "13 April", text: "Vrindavan. Standing in front of Banke Bihari ji, one quiet wish was made." },
  { date: "6 May", text: "A wedding, a living room, and a girl in a blue kurta walked in." },
  { date: "7 May", text: "The dance night. A phone taken away, mid-scold — and somehow that was the moment." },
  { date: "8 May", text: "She walked into the venue and, for a second, the whole world paused." },
  { date: "9 May", text: "An Instagram handle asked for. A handshake that carried more than either of them knew." },
  { date: "17 May", text: "The day it all officially began." }
];

/* ============================================================
   REASONS I LOVE YOU — edit / add as many as you want.
   ============================================================ */
const REASONS = [
  "The way you go quiet right before saying something you've been thinking about all day.",
  "How you steal the blanket and still complain that you're cold.",
  "You always save me the last bite, even when you swear you won't.",
  "The way you tease me and somehow it still feels like affection.",
  "You made an entire lost version of me want to be found again.",
  "Your laugh — the real one, not the polite one.",
  "How ordinary days turned into favorite memories, just because you were in them.",
  "The way you say sorry with your eyes before you say it with words.",
  "You listen like it actually matters. Because to you, it does.",
  "You picked me. Out of everyone, every day, you keep picking me."
];

/* ============================================================
   GUESS OUR STORY — a playful little quiz. Edit questions,
   options, and correctIndex (0-based) freely.
   ============================================================ */
const QUIZ = [
  {
    question: "Where did Guru first make a wish about you (without knowing it)?",
    options: ["Goa", "Vrindavan", "Manali"],
    correctIndex: 1
  },
  {
    question: "What was Prachi wearing the first time Guru saw her?",
    options: ["A blue kurta", "A red saree", "A white dress"],
    correctIndex: 0
  },
  {
    question: "What did Guru ask for on 9 May?",
    options: ["Her phone number", "Her Instagram", "Her home address"],
    correctIndex: 1
  },
  {
    question: "On what date did \"it\" officially begin?",
    options: ["6 May", "8 May", "17 May"],
    correctIndex: 2
  }
];
