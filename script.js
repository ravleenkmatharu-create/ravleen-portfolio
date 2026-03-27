/* ─────────────────────────────────────────────────────────────
   RAVLEEN MATHARU — Portfolio Scripts
   ───────────────────────────────────────────────────────────── */

// ── Sticky Nav ────────────────────────────────────────────────
const navWrapper = document.querySelector('.nav-wrapper');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navWrapper.classList.add('scrolled');
  } else {
    navWrapper.classList.remove('scrolled');
  }
}, { passive: true });

// ── Mobile Hamburger ──────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!navWrapper.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

// ── Active Nav Link on Scroll ─────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinkEls.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-50% 0px -50% 0px' });

sections.forEach(section => sectionObserver.observe(section));

// ── Scroll Reveal ─────────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // fire once
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

// ── Smooth scroll offset for fixed nav ───────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const navH = navWrapper.offsetHeight;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Parallax tilt on Hero Card ────────────────────────────────
const heroCard = document.querySelector('.hero-card');

if (heroCard && window.matchMedia('(hover: hover)').matches) {
  heroCard.addEventListener('mousemove', (e) => {
    const rect   = heroCard.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    const rotX   = (-dy * 8).toFixed(2);
    const rotY   = ( dx * 8).toFixed(2);
    heroCard.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
  });

  heroCard.addEventListener('mouseleave', () => {
    heroCard.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
    heroCard.style.transform  = '';
    setTimeout(() => { heroCard.style.transition = ''; }, 500);
  });
}

// ── Counter animation on stat numbers ────────────────────────
function animateCounter(el, target, duration = 1200) {
  const isDecimal = target.toString().includes('.');
  const end   = parseFloat(target);
  const start = 0;
  const step  = 16;
  const steps = Math.ceil(duration / step);
  let   count = 0;

  const suffix = el.textContent.replace(/[\d.]/g, '');
  const prefix = '';

  const timer = setInterval(() => {
    count++;
    const progress = count / steps;
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    const value    = start + (end - start) * eased;

    el.textContent = isDecimal
      ? prefix + value.toFixed(1) + suffix
      : prefix + Math.ceil(value) + suffix;

    if (count >= steps) {
      el.textContent = prefix + target + suffix;
      clearInterval(timer);
    }
  }, step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const numEls = entry.target.querySelectorAll('.stat-num');
    numEls.forEach(el => {
      const raw    = el.textContent.trim();
      const num    = raw.replace(/[^0-9.]/g, '');
      const suffix = raw.replace(/[0-9.]/g, '');
      if (num) {
        el.textContent = '0' + suffix;
        animateCounter(el, num + suffix, 1000);
      }
    });

    statsObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);
