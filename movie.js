(function () {
  const sceneRoot = document.getElementById('sceneRoot');
  const startOverlay = document.getElementById('startOverlay');
  const startBtn = document.getElementById('startBtn');
  const soundToggle = document.getElementById('soundToggle');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const overallFill = document.getElementById('overallFill');
  const song = document.getElementById('song');

  let muted = false;
  let current = -1;
  let scenes = []; // { el, onEnter, onExit }

  /* ============================================================
     Scene builders
     ============================================================ */

  function makeSceneShell(extraClass) {
    const el = document.createElement('div');
    el.className = 'scene' + (extraClass ? ' ' + extraClass : '');
    sceneRoot.appendChild(el);
    return el;
  }

  // ---------- Timeline scene ----------
  function buildTimelineScene() {
    const el = makeSceneShell();
    el.innerHTML = `
      <div class="timeline-wrap">
        <div class="eyebrow">before it had a name</div>
        <h2>Our Timeline</h2>
        <div class="tl-events">
          ${TIMELINE.map(ev => `
            <div class="tl-event">
              <div class="tl-date">${ev.date}</div>
              <div class="tl-text">${ev.text}</div>
            </div>`).join('')}
        </div>
      </div>`;
    const events = el.querySelectorAll('.tl-event');
    let timers = [];
    return {
      el,
      onEnter() {
        events.forEach(e => e.classList.remove('show'));
        events.forEach((e, i) => {
          timers.push(setTimeout(() => e.classList.add('show'), 400 + i * 850));
        });
        timers.push(setTimeout(() => next(), 400 + events.length * 850 + 1800));
      },
      onExit() { timers.forEach(clearTimeout); timers = []; }
    };
  }

  // ---------- Photo scene (ready) ----------
  function animateCaption(el, text) {
    el.innerHTML = '';
    if (!text) return;
    const words = text.split(' ');
    words.forEach((w, i) => {
      const span = document.createElement('span');
      span.className = 'cap-word';
      span.textContent = w + '\u00A0';
      span.style.animationDelay = (0.5 + i * 0.05) + 's';
      el.appendChild(span);
    });
  }

  function buildPhotoScene(chapter) {
    const el = makeSceneShell();
    el.innerHTML = `
      <div class="photo-scene">
        <div class="photo-backdrop" style="background-image:url('${chapter.image}')"></div>
        <div class="chapter-tag">${chapter.label}</div>
        <div class="photo-frame"><img src="${chapter.image}" alt="A memory of us"></div>
        <div class="photo-caption" id="cap-${chapter.id}"></div>
      </div>`;
    const captionEl = el.querySelector('.photo-caption');
    let fallbackTimer = null;
    function onEnded() { next(); }
    return {
      el,
      onEnter() {
        animateCaption(captionEl, chapter.caption);
        song.pause();
        song.src = chapter.audio;
        song.currentTime = 0;
        song.muted = muted;
        song.addEventListener('ended', onEnded);
        const p = song.play();
        if (p && p.catch) p.catch(() => {});
        // Safety net in case audio fails to fire 'ended' (blocked, missing, etc.)
        fallbackTimer = setTimeout(() => next(), 60000);
      },
      onExit() {
        song.removeEventListener('ended', onEnded);
        song.pause();
        if (fallbackTimer) clearTimeout(fallbackTimer);
      }
    };
  }

  // ---------- Photo scene (placeholder / not yet added) ----------
  function buildPlaceholderScene(chapter) {
    const el = makeSceneShell();
    el.innerHTML = `
      <div class="placeholder-card">
        <div class="glyph">&#10022;</div>
        <h3>${chapter.label} is still being written&hellip;</h3>
        <p>This memory hasn't been added yet — check back soon.</p>
      </div>`;
    let timer = null;
    return {
      el,
      onEnter() { timer = setTimeout(() => next(), PLACEHOLDER_DURATION * 1000); },
      onExit() { if (timer) clearTimeout(timer); }
    };
  }

  // ---------- Reasons scene ----------
  function buildReasonsScene() {
    const el = makeSceneShell();
    el.innerHTML = `
      <div class="reasons-wrap">
        <div class="glyph">&#10084;</div>
        <h2>A few reasons, among many</h2>
        <div class="reason-text" id="reasonText"></div>
        <div class="reason-counter" id="reasonCounter"></div>
      </div>`;
    const textEl = el.querySelector('#reasonText');
    const counterEl = el.querySelector('#reasonCounter');
    let i = 0;
    let interval = null;

    function show(i) {
      textEl.style.opacity = 0;
      setTimeout(() => {
        textEl.textContent = REASONS[i];
        counterEl.textContent = (i + 1) + ' / ' + REASONS.length;
        textEl.style.transition = 'opacity 0.5s ease';
        textEl.style.opacity = 1;
      }, 260);
    }

    return {
      el,
      onEnter() {
        i = 0;
        show(i);
        interval = setInterval(() => {
          i++;
          if (i >= REASONS.length) {
            clearInterval(interval);
            setTimeout(() => next(), 1600);
            return;
          }
          show(i);
        }, 3600);
      },
      onExit() { if (interval) clearInterval(interval); }
    };
  }

  // ---------- Quiz scene ----------
  function buildQuizScene() {
    const el = makeSceneShell();
    el.innerHTML = `<div class="quiz-wrap" id="quizWrap"></div>`;
    const wrap = el.querySelector('#quizWrap');
    let qIndex = 0;
    let score = 0;
    let timer = null;

    function renderQuestion() {
      const q = QUIZ[qIndex];
      wrap.innerHTML = `
        <div class="eyebrow">guess our story &middot; ${qIndex + 1} / ${QUIZ.length}</div>
        <h2>${q.question}</h2>
        <div class="quiz-options">
          ${q.options.map((opt, i) => `<button class="quiz-opt" data-i="${i}">${opt}</button>`).join('')}
        </div>
        <div class="quiz-feedback" id="quizFeedback"></div>
      `;
      const buttons = wrap.querySelectorAll('.quiz-opt');
      const feedback = wrap.querySelector('#quizFeedback');
      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          buttons.forEach(b => b.disabled = true);
          const chosen = parseInt(btn.dataset.i, 10);
          if (chosen === q.correctIndex) {
            btn.classList.add('correct');
            score++;
            feedback.textContent = "That's right. &#10084;".replace('&#10084;', '\u2764');
          } else {
            btn.classList.add('wrong');
            buttons[q.correctIndex].classList.add('correct');
            feedback.textContent = 'Close — but not quite.';
          }
          timer = setTimeout(() => {
            qIndex++;
            if (qIndex < QUIZ.length) renderQuestion(); else renderResult();
          }, 1500);
        });
      });
    }

    function renderResult() {
      wrap.innerHTML = `
        <div class="quiz-result">
          <div class="glyph" style="font-size:1.6rem;color:var(--gold-light);margin-bottom:0.8rem;">&#10022;</div>
          <h2>${score} / ${QUIZ.length} &mdash; you know us well</h2>
          <p style="color:var(--cream-dim);font-size:0.85rem;margin-bottom:1.6rem;">every answer was written the day it happened.</p>
          <button class="btn" id="quizContinue">Continue</button>
        </div>`;
      wrap.querySelector('#quizContinue').addEventListener('click', () => next());
    }

    return {
      el,
      onEnter() { qIndex = 0; score = 0; renderQuestion(); },
      onExit() { if (timer) clearTimeout(timer); }
    };
  }

  // ---------- Finale scene ----------
  function buildFinaleScene() {
    const el = makeSceneShell();
    el.innerHTML = `
      <div class="finale-wrap">
        <div class="candle" id="candle">
          <div class="flame" id="flame"></div>
          <div class="candle-body"></div>
        </div>
        <h2>Make a wish</h2>
        <p>tap the candle, love</p>
        <div class="finale-msg" id="finaleMsg">
          <div class="eyebrow">happy birthday</div>
          <h2 style="margin-top:0.6rem;">Here's to every birthday from now on</h2>
          <p style="max-width:420px;margin:0 auto 2rem;">being spent finding new reasons to love you. One more chapter of this movie is still left &mdash; the letter.</p>
          <a class="btn" href="letter.html">Open Your Letter</a>
        </div>
      </div>`;
    const candle = el.querySelector('#candle');
    const flame = el.querySelector('#flame');
    const msg = el.querySelector('#finaleMsg');
    let bound = false;

    function blowOut() {
      flame.classList.add('out');
      burstConfetti();
      setTimeout(() => msg.classList.add('show'), 700);
    }

    return {
      el,
      onEnter() {
        if (!bound) {
          candle.addEventListener('click', blowOut);
          bound = true;
        }
      },
      onExit() {}
    };
  }

  function burstConfetti() {
    const colors = ['#c9a24c', '#eab3a3', '#a8425a', '#f7ecdd'];
    for (let i = 0; i < 40; i++) {
      setTimeout(() => {
        const c = document.createElement('div');
        c.className = 'confetti-piece';
        const size = 6 + Math.random() * 6;
        c.style.left = Math.random() * 100 + 'vw';
        c.style.width = size + 'px';
        c.style.height = size * 0.4 + 'px';
        c.style.background = colors[Math.floor(Math.random() * colors.length)];
        c.style.borderRadius = '2px';
        c.style.animation = `confettiFall ${2.5 + Math.random() * 2}s ease-in forwards`;
        c.style.transform = `rotate(${Math.random() * 360}deg)`;
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 5000);
      }, i * 40);
    }
  }
  const styleEl = document.createElement('style');
  styleEl.textContent = `@keyframes confettiFall { to { transform: translateY(100vh) rotate(400deg); opacity: 0.2; } }`;
  document.head.appendChild(styleEl);

  /* ============================================================
     Assemble scene list
     ============================================================ */
  scenes.push(buildTimelineScene());
  PHOTO_CHAPTERS.forEach((chapter, idx) => {
    scenes.push(chapter.ready ? buildPhotoScene(chapter, idx) : buildPlaceholderScene(chapter));
  });
  scenes.push(buildReasonsScene());
  scenes.push(buildQuizScene());
  scenes.push(buildFinaleScene());

  /* ============================================================
     Navigation
     ============================================================ */
  function showScene(i) {
    if (i < 0) i = 0;
    if (i >= scenes.length) i = scenes.length - 1;
    if (current >= 0 && scenes[current]) {
      scenes[current].el.classList.remove('active');
      scenes[current].onExit && scenes[current].onExit();
    }
    current = i;
    scenes[current].el.classList.add('active');
    scenes[current].onEnter && scenes[current].onEnter();
    overallFill.style.width = ((current + 1) / scenes.length * 100) + '%';
  }

  function next() { if (current < scenes.length - 1) showScene(current + 1); }
  function prev() { if (current > 0) showScene(current - 1); }

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  document.addEventListener('keydown', (e) => {
    if (!startOverlay.classList.contains('hide')) return;
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  let touchStartX = null;
  document.getElementById('stage').addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  document.getElementById('stage').addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
    touchStartX = null;
  }, { passive: true });

  soundToggle.addEventListener('click', () => {
    muted = !muted;
    song.muted = muted;
    soundToggle.innerHTML = muted ? '&#128263;' : '&#9834;';
  });

  startBtn.addEventListener('click', () => {
    startOverlay.classList.add('hide');
    showScene(0);
  });
})();
