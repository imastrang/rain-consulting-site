// Smooth scrolling for nav links
const navLinks = document.querySelectorAll('nav a[href^="#"]');
navLinks.forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    }
  });
});

// Card hover effect (JS toggles a class; CSS styles it)
const insightCards = document.querySelectorAll('#insights .card');
insightCards.forEach(card => {
  card.addEventListener('mouseenter', () => card.classList.add('hover-effect'));
  card.addEventListener('mouseleave', () => card.classList.remove('hover-effect'));
});

// Animate-on-scroll using IntersectionObserver
const appearTargets = document.querySelectorAll('#experience .animate-on-scroll, #skills .grid-item');
appearTargets.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(14px)'; });

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (!prefersReduced) entry.target.style.transition = 'opacity .6s ease, transform .6s ease';
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

appearTargets.forEach(t => observer.observe(t));

// Current year in footer
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

