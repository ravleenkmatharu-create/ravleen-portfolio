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

// ── Parallax tilt on interactive elements ─────────────────────
function enableParallaxTilt(selector, shadowColor = 'rgba(0, 0, 0, 0.09)', maxTilt = 4) {
  const element = document.querySelector(selector);

  if (element && window.matchMedia('(hover: hover)').matches) {
    element.addEventListener('mousemove', (e) => {
      const rect   = element.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotX   = (-dy * maxTilt).toFixed(2);
      const rotY   = ( dx * maxTilt).toFixed(2);
      element.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      element.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
      element.style.boxShadow = `0 20px 60px ${shadowColor}, 0 0 40px ${shadowColor}`;
    });

    element.addEventListener('mouseleave', () => {
      element.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
      element.style.transform  = '';
      element.style.boxShadow = '';
      setTimeout(() => { element.style.transition = ''; }, 800);
    });
  }
}

// Apply parallax to hero card with purple glow
enableParallaxTilt('.hero-card', 'rgba(124, 58, 237, 0.25)');

// Theme-based parallax for case study hero images
// Consistent parallax: maxTilt=2 (smooth), theme-specific shadows
if (document.body.classList.contains('theme-security')) {
  // ExacqGo — blue shadow
  enableParallaxTilt('.cs-hero-image', 'rgba(51, 85, 181, 0.40)', 2);
} else if (document.body.classList.contains('theme-eco')) {
  // EcoWise — green shadow
  enableParallaxTilt('.cs-hero-image', 'rgba(10, 107, 53, 0.35)', 2);
} else if (document.querySelector('.cs-hero--light')) {
  // Extinguish — orange shadow
  enableParallaxTilt('.cs-hero--light .cs-hero-image', 'rgba(232, 149, 109, 0.40)', 2);
} else {
  // Other dark pages
  const darkHeroImg = document.querySelector('.cs-hero:not(.cs-hero--light) .cs-hero-image');
  if (darkHeroImg) {
    enableParallaxTilt('.cs-hero:not(.cs-hero--light) .cs-hero-image', 'rgba(0, 0, 0, 0.09)', 2);
  }
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

// ── Clickable Project Cards ────────────────────────────────────
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
  const link = card.querySelector('.project-link');
  if (!link) return;

  card.style.cursor = 'pointer';

  card.addEventListener('click', (e) => {
    // Don't double-navigate if clicking the link itself
    if (e.target.closest('.project-link')) return;

    const href = link.getAttribute('href');
    if (href) window.location.href = href;
  });

  // Add hover effect
  card.addEventListener('mouseenter', () => {
    card.style.opacity = '0.85';
  });

  card.addEventListener('mouseleave', () => {
    card.style.opacity = '1';
  });
});

// ── Carousel functionality ──────────────────────────────────────
const carousels = document.querySelectorAll('.cs-carousel');

carousels.forEach(carousel => {
  const track = carousel.querySelector('.cs-carousel-track');
  const slides = carousel.querySelectorAll('.cs-carousel-slide');
  const dots = carousel.querySelectorAll('.cs-carousel-dot');
  const prevBtn = carousel.querySelector('.cs-carousel-prev');
  const nextBtn = carousel.querySelector('.cs-carousel-next');

  let currentSlide = 0;

  function updateCarousel() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarousel();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateCarousel();
  }

  prevBtn?.addEventListener('click', prevSlide);
  nextBtn?.addEventListener('click', nextSlide);

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide = index;
      updateCarousel();
    });
  });
});
