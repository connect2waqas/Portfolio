/* ============================================================
   Portfolio – script.js
   Handles: sticky nav, mobile menu, typed text, scroll animations,
            active nav links, contact form, and footer year.
   ============================================================ */

(function () {
  'use strict';

  /* ---- Sticky navbar ---- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ---- Mobile nav toggle ---- */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  /* Close mobile nav when a link is clicked */
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---- Active nav link on scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = navLinks.querySelectorAll('a');

  function setActiveLink() {
    var scrollPos = window.scrollY + 80;
    sections.forEach(function (section) {
      if (
        scrollPos >= section.offsetTop &&
        scrollPos < section.offsetTop + section.offsetHeight
      ) {
        allNavLinks.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + section.id);
        });
      }
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ---- Typed-text hero animation ---- */
  var phrases = [
    'AI Engineer',
    'ML Practitioner',
    'LLM Builder',
    'Data Scientist',
    'Deep Learning Dev',
  ];

  var typedEl  = document.getElementById('typedText');
  var phraseIdx = 0;
  var charIdx   = 0;
  var isDeleting = false;
  var typeDelay  = 110;

  function type() {
    var current = phrases[phraseIdx];
    if (isDeleting) {
      typedEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      typeDelay = 55;
    } else {
      typedEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      typeDelay = 110;
    }

    if (!isDeleting && charIdx === current.length) {
      isDeleting = true;
      typeDelay = 1800; /* pause before deleting */
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx  = (phraseIdx + 1) % phrases.length;
      typeDelay  = 400; /* pause before next phrase */
    }

    setTimeout(type, typeDelay);
  }

  setTimeout(type, 600);

  /* ---- Scroll-in fade animations ---- */
  var animTargets = document.querySelectorAll(
    '.skill-card, .project-card, .about-grid, .contact-grid, .about-stats, .contact-item'
  );

  animTargets.forEach(function (el) {
    el.classList.add('fade-in');
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  animTargets.forEach(function (el) {
    observer.observe(el);
  });

  /* ---- Contact form ---- */
  var form       = document.getElementById('contactForm');
  var formStatus = document.getElementById('formStatus');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name    = form.name.value.trim();
    var email   = form.email.value.trim();
    var message = form.message.value.trim();

    /* Basic validation */
    if (!name || !email || !message) {
      showStatus('Please fill in all fields.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }

    /* Simulate sending (replace with your own backend/service) */
    var submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    setTimeout(function () {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message ✉️';
      showStatus('Thanks! Your message has been sent. I\'ll be in touch soon.', 'success');
    }, 1200);
  });

  function showStatus(msg, type) {
    formStatus.textContent = msg;
    formStatus.className = 'form-status ' + type;
    setTimeout(function () {
      formStatus.textContent = '';
      formStatus.className = 'form-status';
    }, 5000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ---- Footer year ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();
