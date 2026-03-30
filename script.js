/* ─── FAIRPLAY STUDIOS — JS ───────────────────────────────── */

const isTouchDevice = () => window.matchMedia('(hover: none)').matches;

/* ─── Custom cursor (desktop only) ─────────── */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let rx = 0, ry = 0, cx = 0, cy = 0;

if (!isTouchDevice() && cursor) {
  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
  });
  (function animRing() {
    rx += (cx - rx) * 0.1;
    ry += (cy - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();
  document.querySelectorAll('a, button, .pillar, .vid-card, .full-grid-item, .featured-player, .filter-tab').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('link-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('link-hover'));
  });
}

/* ─── Hamburger / mobile drawer ─────────────── */
const hamburger = document.getElementById('hamburger');
const drawer    = document.getElementById('mobile-drawer');

if (hamburger && drawer) {
  hamburger.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  // Close on link click
  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      drawer.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
  // Close on backdrop tap
  drawer.addEventListener('click', e => {
    if (e.target === drawer) {
      drawer.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ─── Nav scroll ────────────────────────────── */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ─── Scroll reveals ────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.08 });
revealEls.forEach(el => revealObs.observe(el));

/* ─── Manifesto word reveal ─────────────────── */
const mBody = document.querySelector('.manifesto-body');
if (mBody) {
  const raw = mBody.innerHTML;
  mBody.innerHTML = raw.replace(/(\S+)/g, m =>
    `<span class="word"><span class="word-inner">${m}</span></span>`
  );
  const words = mBody.querySelectorAll('.word');
  const wordObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        words.forEach((w, i) => setTimeout(() => w.classList.add('in'), i * 38));
        wordObs.disconnect();
      }
    });
  }, { threshold: 0.2 });
  wordObs.observe(mBody);
}

/* ─── Filter tabs ───────────────────────────── */
const tabs  = document.querySelectorAll('.filter-tab');
const cards = document.querySelectorAll('.full-grid-item');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    cards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.display = match ? '' : 'none';
      // reset span-2 on mobile
      if (window.innerWidth <= 768) card.classList.remove('span-2');
    });
    // Scroll active tab into view on mobile
    tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  });
});

/* ─── Page transitions ──────────────────────── */
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('http')) return;
  link.addEventListener('click', e => {
    e.preventDefault();
    document.body.classList.add('page-leave');
    setTimeout(() => { window.location.href = href; }, 480);
  });
});

/* ─── Counter animation ─────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.textContent);
  if (isNaN(target)) return;
  const suffix = el.textContent.replace(/[0-9]/g, '');
  let current = 0;
  const step = Math.max(target / 50, 1);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.round(current) + suffix;
    if (current >= target) clearInterval(timer);
  }, 30);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-num').forEach(animateCounter);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.stats-bar').forEach(el => counterObs.observe(el));

/* ─── Video play toggle ─────────────────────── */
document.querySelectorAll('.featured-player').forEach(player => {
  const video  = player.querySelector('video');
  const playBtn = player.querySelector('.featured-big-play');
  if (!video) return;
  player.addEventListener('click', () => {
    if (video.paused) { video.play(); if (playBtn) playBtn.style.opacity = '0'; }
    else              { video.pause(); if (playBtn) playBtn.style.opacity = ''; }
  });
});

/* ─── Parallax hero (desktop only) ─────────── */
if (!isTouchDevice()) {
  const heroBg = document.querySelector('.hero-video');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      heroBg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
    }, { passive: true });
  }
}

/* ─── Touch: add active states for cards ────── */
if (isTouchDevice()) {
  document.querySelectorAll('.vid-card, .full-grid-item').forEach(el => {
    el.addEventListener('touchstart', () => el.classList.add('touched'), { passive: true });
    el.addEventListener('touchend', () => setTimeout(() => el.classList.remove('touched'), 300));
  });
}
