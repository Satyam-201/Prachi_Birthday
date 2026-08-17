(function () {
  const sealOverlay = document.getElementById('sealOverlay');
  const bigSeal = document.getElementById('bigSeal');
  const scroll = document.getElementById('scroll');
  const greetingEl = document.getElementById('greeting');
  const bodyEl = document.getElementById('letterBody');
  const signoffEl = document.getElementById('signoff');
  const voiceBtn = document.getElementById('voiceBtn');
  const replayBtn = document.getElementById('replayBtn');
  const voiceNote = document.getElementById('voiceNote');
  const voiceAudio = document.getElementById('voiceAudio');

  if (typeof LETTER_BLOCKS === 'undefined') return;

  let typing = false;
  let typeTimer = null;
  let charDelay = null;
  let voiceAvailable = false;
  let letterOpened = false;

  // =========================
  // OPEN LETTER + AUTOPLAY VOICE
  // =========================
  function openLetter() {
    if (letterOpened) return;
    letterOpened = true;

    sealOverlay.classList.add('hide');
    scroll.classList.add('unrolled');

    // Start typing after the scroll opens
    setTimeout(() => typeLetter(), 900);

    // Start voice automatically
    playVoice();
  }

  bigSeal.addEventListener('click', openLetter);

  bigSeal.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLetter();
    }
  });

  // =========================
  // BUILD TYPING QUEUE
  // =========================
  function buildQueue() {
    const queue = [];

    for (const ch of LETTER_GREETING) {
      queue.push({
        el: greetingEl,
        ch
      });
    }

    LETTER_BLOCKS.forEach((block) => {
      const p = document.createElement('p');
      p.className = block.type;
      bodyEl.appendChild(p);

      const text = block.text;

      for (const ch of text) {
        if (ch === '\n') {
          queue.push({
            el: p,
            br: true
          });
        } else {
          queue.push({
            el: p,
            ch
          });
        }
      }

      queue.push({
        el: p,
        ch: '\u200b',
        pause: 240
      });
    });

    for (const ch of LETTER_SIGNOFF) {
      if (ch === '\n') {
        queue.push({
          el: signoffEl,
          br: true
        });
      } else {
        queue.push({
          el: signoffEl,
          ch
        });
      }
    }

    return queue;
  }

  // =========================
  // TYPE LETTER
  // =========================
  function typeLetter() {
    if (typing) return;

    typing = true;

    clearTimeout(typeTimer);

    greetingEl.textContent = '';
    bodyEl.innerHTML = '';
    signoffEl.textContent = '';

    const queue = buildQueue();
    const perChar = charDelay || null;

    let i = 0;

    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';

    function step() {
      if (i >= queue.length) {
        cursor.remove();
        typing = false;
        return;
      }

      const item = queue[i];

      if (item.br) {
        item.el.appendChild(
          document.createElement('br')
        );
      } else if (item.ch !== '\u200b') {
        item.el.appendChild(
          document.createTextNode(item.ch)
        );
      }

      if (cursor.parentNode !== item.el) {
        item.el.appendChild(cursor);
      }

      i++;

      const delay = item.pause
        ? item.pause
        : (perChar || (16 + Math.random() * 20));

      typeTimer = setTimeout(step, delay);
    }

    step();
  }

  // =========================
  // COUNT CHARACTERS
  // =========================
  function totalCharCount() {
    let n =
      LETTER_GREETING.length +
      LETTER_SIGNOFF.replace(/\n/g, '').length;

    LETTER_BLOCKS.forEach((b) => {
      n += b.text.replace(/\n/g, '').length;
    });

    return n;
  }

  // =========================
  // PLAY VOICE
  // =========================
  function playVoice() {
    voiceAudio.src = VOICE_FILE;
    voiceAudio.currentTime = 0;

    voiceAudio.play()
      .then(() => {
        voiceAvailable = true;

        voiceBtn.innerHTML =
          '&#10074;&#10074; Pause Voice';

        voiceNote.textContent =
          "listening — the letter is pacing itself to the voice";
      })
      .catch((error) => {
        console.log("Autoplay blocked:", error);

        voiceNote.textContent =
          "Click Play Guru's Voice to hear the letter read aloud";
      });
  }

  // =========================
  // VOICE BUTTON
  // =========================
  voiceBtn.addEventListener('click', () => {

    if (!voiceAudio.paused) {
      voiceAudio.pause();

      voiceBtn.innerHTML =
        '&#9835; Play Guru’s Voice';

      return;
    }

    playVoice();
  });

  // =========================
  // REPLAY
  // =========================
  replayBtn.addEventListener('click', () => {

    if (!voiceAudio.paused) {
      voiceAudio.currentTime = 0;

      voiceAudio.play().catch(() => {});
    } else {
      playVoice();
    }

    typeLetter();
  });

  // =========================
  // SYNC TYPING WITH VOICE
  // =========================
  voiceAudio.addEventListener('loadedmetadata', () => {

    if (
      voiceAudio.duration &&
      isFinite(voiceAudio.duration)
    ) {
      const total = totalCharCount();

      charDelay =
        (voiceAudio.duration * 1000) / total;

      // If the letter is already open,
      // restart typing with synchronized speed.
      if (letterOpened) {
        typeLetter();
      }
    }
  });

  // =========================
  // VOICE ENDED
  // =========================
  voiceAudio.addEventListener('ended', () => {

    voiceBtn.innerHTML =
      '&#9835; Play Guru’s Voice';

    voiceNote.textContent =
      "voice finished — replay anytime";
  });

  // =========================
  // AUDIO ERROR
  // =========================
  voiceAudio.addEventListener('error', () => {

    voiceNote.textContent =
      "add audio/voice-letter.mp3 to hear this read aloud";
  });

})();
