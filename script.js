/* ─── FAIRPLAY STUDIOS — JS ───────────────────────────────── */

/* Custom cursor */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let rx = 0, ry = 0, cx = 0, cy = 0;

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

/* Nav scroll */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* Scroll reveals */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); } });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObs.observe(el));

/* Manifesto word-by-word */
const mBody = document.querySelector('.manifesto-body');
if (mBody) {
  const raw = mBody.innerHTML;
  mBody.innerHTML = raw.replace(/(\S+)/g, match =>
    `<span class="word"><span class="word-inner">${match}</span></span>`
  );
  const words = mBody.querySelectorAll('.word');
  const wordObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        words.forEach((w, i) => setTimeout(() => w.classList.add('in'), i * 38));
        wordObs.disconnect();
      }
    });
  }, { threshold: 0.3 });
  wordObs.observe(mBody);
}

/* Filter tabs (media page) */
const tabs = document.querySelectorAll('.filter-tab');
const cards = document.querySelectorAll('.full-grid-item');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    cards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.display = match ? '' : 'none';
    });
    // reflow grid
    const grid = document.querySelector('.full-grid');
    if (grid) { grid.style.display = 'none'; grid.offsetHeight; grid.style.display = ''; }
  });
});

/* Page transitions */
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('http')) return;
  link.addEventListener('click', e => {
    e.preventDefault();
    document.body.classList.add('page-leave');
    setTimeout(() => { window.location.href = href; }, 480);
  });
});

/* Counter animation */
function animateCounter(el) {
  const target = parseInt(el.textContent);
  const suffix = el.textContent.replace(/[0-9]/g, '');
  let current = 0;
  const step = target / 50;
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
}, { threshold: 0.4 });
document.querySelectorAll('.stats-bar').forEach(el => counterObs.observe(el));

/* Video play toggle */
document.querySelectorAll('.featured-player').forEach(player => {
  const video = player.querySelector('video');
  const playBtn = player.querySelector('.featured-big-play');
  if (!video) return;
  player.addEventListener('click', () => {
    if (video.paused) { video.play(); if (playBtn) playBtn.style.opacity = '0'; }
    else { video.pause(); if (playBtn) playBtn.style.opacity = ''; }
  });
});

/* Parallax on hero bg */
const heroBg = document.querySelector('.hero-video');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBg.style.transform = `translateY(${y * 0.25}px)`;
  }, { passive: true });
}
