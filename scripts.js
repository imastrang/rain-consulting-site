/* rAIn Consulting — scripts.js */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Footer year ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Mobile nav toggle ---- */
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.querySelector('.menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close menu when a non-dropdown link is clicked (mobile)
    menu.querySelectorAll('a:not(.btn)').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 900) {
          menu.classList.remove('open');
          toggle.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    });
  }

  /* ---- Dropdown menus ---- */
  const dropdowns = document.querySelectorAll('.menu-dropdown');

  dropdowns.forEach(dd => {
    const caret = dd.querySelector('.menu-caret');
    if (!caret) return;

    // Desktop: hover on the whole li
    dd.addEventListener('mouseenter', () => {
      if (window.innerWidth > 900) openDropdown(dd, caret);
    });
    dd.addEventListener('mouseleave', () => {
      if (window.innerWidth > 900) closeDropdown(dd, caret);
    });

    // Caret click toggles dropdown
    caret.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dd.classList.contains('open');
      // Close all others
      dropdowns.forEach(other => {
        if (other !== dd) {
          other.classList.remove('open');
          const oc = other.querySelector('.menu-caret');
          if (oc) oc.setAttribute('aria-expanded', 'false');
        }
      });
      isOpen ? closeDropdown(dd, caret) : openDropdown(dd, caret);
    });

    // Close on outside click
    document.addEventListener('click', () => closeDropdown(dd, caret));

    // Keyboard: Escape
    dd.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDropdown(dd, caret);
    });
  });

  function openDropdown(dd, caret) {
    dd.classList.add('open');
    caret.setAttribute('aria-expanded', 'true');
  }
  function closeDropdown(dd, caret) {
    dd.classList.remove('open');
    caret.setAttribute('aria-expanded', 'false');
  }

  /* ---- Smooth-scroll anchor links with header offset ---- */
  const HEADER_H = () => parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--header-h')
  ) || 56;

  function scrollToHash(hash, instant) {
    const target = document.querySelector(hash);
    if (!target) return;
    const offset = 28;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: instant ? 'instant' : 'smooth' });
  }

  // Intercept same-page anchor clicks
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const hash = a.getAttribute('href');
      if (hash && hash.length > 1 && document.querySelector(hash)) {
        e.preventDefault();
        scrollToHash(hash, false);
        history.pushState(null, '', hash);
      }
    });
  });

  // Handle page load with a hash (cross-page anchor navigation)
  if (window.location.hash) {
    // Use instant so browser's initial scroll doesn't fight ours
    setTimeout(() => scrollToHash(window.location.hash, true), 50);
  }

  /* ---- Thank-you message after form redirect ---- */
  const params = new URLSearchParams(window.location.search);
  if (params.get('sent') === '1') {
    const status = document.getElementById('form-status');
    if (status) {
      status.textContent = '✓ Message sent! We\'ll be in touch soon.';
      status.classList.remove('error');
    }
    // Scroll to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      setTimeout(() => contactSection.scrollIntoView({ behavior: 'smooth' }), 300);
    }
    // Clean URL
    window.history.replaceState({}, '', window.location.pathname);
  }

  /* ---- Active nav link for current page ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Map top-level menu links to the pages that should activate them
  const navSections = {
    'what-we-do': ['ai.html', 'supply-chain.html', 'project-management.html', 'strategy-operations.html', 'technology.html', 'footwear-apparel.html', 'people-change.html'],
    'how-we-work': ['success-stories.html', 'story-sap-ibp.html', 'story-plm-costing.html', 'story-factory-operations.html', 'story-domestic-supply-chain.html', 'story-otif-improvement.html', 'story-supply-chain-digitization.html', 'story-samples-digitization.html', 'story-logistics-ap.html', 'story-carrier-renegotiation.html', 'story-cost-teardown.html', 'story-lead-time-reengineering.html', 'story-cost-transparency.html', 'story-supply-chain-optimization.html', 'story-footwear-innovation.html', 'story-robotic-manufacturing.html'],
    'who-we-are': ['our-mission.html', 'meet-the-team.html']
  };

  // Collect top-level nav links for reuse
  const navLinks = document.querySelectorAll('.menu > li > a.menu-link');

  function setActiveLink(matchFn) {
    navLinks.forEach(link => {
      if (matchFn(link.getAttribute('href') || '')) {
        link.classList.add('nav-active');
      } else {
        link.classList.remove('nav-active');
      }
    });
  }

  // Bold based on current page (non-index pages)
  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    let isActive = false;
    if (href.includes('#services'))    isActive = navSections['what-we-do'].includes(currentPage);
    else if (href.includes('#how-we-work')) isActive = navSections['how-we-work'].includes(currentPage);
    else if (href === 'our-mission.html')   isActive = navSections['who-we-are'].includes(currentPage);
    if (isActive) link.classList.add('nav-active');
  });

  // On index.html: watch sections and bold the matching nav item as user scrolls
  if (currentPage === 'index.html' || currentPage === '') {
    const sectionMap = [
      { id: 'services',    test: h => h.includes('#services') },
      { id: 'how-we-work', test: h => h.includes('#how-we-work') },
    ];

    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const match = sectionMap.find(s => s.id === entry.target.id);
          if (match) setActiveLink(match.test);
        }
      });
    }, { threshold: 0.3 });

    sectionMap.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });
  }


  /* ---- Intersection observer: fade-in sections ---- */
  if ('IntersectionObserver' in window) {
    const style = document.createElement('style');
    style.textContent = `
      .fade-in { opacity: 0; transform: translateY(24px); transition: opacity .55s ease, transform .55s ease; }
      .fade-in.visible { opacity: 1; transform: none; }
    `;
    document.head.appendChild(style);

    const targets = document.querySelectorAll(
      '.service-card, .step, .team-card, .feature-item, .stat__num'
    );
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    targets.forEach((el, i) => {
      el.classList.add('fade-in');
      el.style.transitionDelay = `${(i % 4) * 80}ms`;
      io.observe(el);
    });
  }

});
