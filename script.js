// Jaroor Fitness — script.js
'use strict';

document.addEventListener('DOMContentLoaded', function () {

  /* ── NAVBAR SCROLL ───────────────────────────── */
  var navbar = document.getElementById('navbar');
  if (navbar) {
    function setScroll() {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }
    setScroll();
    window.addEventListener('scroll', setScroll, { passive: true });
  }

  /* ── MOBILE HAMBURGER ────────────────────────── */
  var hb   = document.getElementById('hamburger');
  var menu = document.getElementById('navMenu');

  function openNav() {
    if (!hb || !menu) return;
    hb.classList.add('active');
    menu.classList.add('active');
    // Prevent page scroll while menu is open
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    if (!hb || !menu) return;
    hb.classList.remove('active');
    menu.classList.remove('active');
    document.body.style.overflow = '';
  }

  function toggleNav() {
    if (!menu) return;
    if (menu.classList.contains('active')) {
      closeNav();
    } else {
      openNav();
    }
  }

  if (hb && menu) {
    // Hamburger click
    hb.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleNav();
    });

    // Click on any link or button inside menu → close
    menu.addEventListener('click', function (e) {
      var el = e.target;
      if (el.tagName === 'A' || el.tagName === 'BUTTON') {
        closeNav();
      }
    });

    // Click outside menu → close
    document.addEventListener('click', function (e) {
      if (menu.classList.contains('active') &&
          !menu.contains(e.target) &&
          !hb.contains(e.target)) {
        closeNav();
      }
    });

    // ESC key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ── BACK TO TOP ─────────────────────────────── */
  var btt = document.getElementById('btt') || document.getElementById('backToTop');
  if (btt) {
    window.addEventListener('scroll', function () {
      btt.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });
    btt.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── SCROLL REVEAL ───────────────────────────── */
  if ('IntersectionObserver' in window) {
    // Single elements with .reveal
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      revObs.observe(el);
    });

    // Groups — stagger children
    var groupObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var children = entry.target.querySelectorAll('.svc-card, .why-card, .plan-box');
          children.forEach(function (child) {
            child.classList.add('visible');
          });
          groupObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06 });

    document.querySelectorAll('.reveal-group').forEach(function (g) {
      groupObs.observe(g);
    });
  }

  /* ── COUNT-UP ────────────────────────────────── */
  var countEls = document.querySelectorAll('.count-up');
  if (countEls.length && 'IntersectionObserver' in window) {
    var cntObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animCount(entry.target);
          cntObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    countEls.forEach(function (el) { cntObs.observe(el); });
  }

  function animCount(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var supMatch = el.innerHTML.match(/<sup>.*?<\/sup>/);
    var suffix   = supMatch ? supMatch[0] : '';
    var dur = 1800, t0 = null;
    function ease(t) { return 1 - Math.pow(1 - t, 3); }
    function step(ts) {
      if (!t0) t0 = ts;
      var p   = Math.min((ts - t0) / dur, 1);
      var val = Math.floor(ease(p) * target);
      el.innerHTML = (val >= 1000 ? val.toLocaleString('en-IN') : val) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ── CONTACT PAGE FORM ───────────────────────── */
  var cf = document.getElementById('contactForm');
  if (cf) {
    cf.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = (cf.querySelector('#name')    || { value: '' }).value.trim();
      var m = (cf.querySelector('#email')   || { value: '' }).value.trim();
      var p = (cf.querySelector('#phone')   || { value: '' }).value.trim();
      var t = (cf.querySelector('#message') || { value: '' }).value.trim();
      var old = cf.parentElement && cf.parentElement.querySelector('.form-msg');
      if (old) old.remove();
      if (!n || !m || !p || !t) { flashMsg(cf, 'Please fill in all required fields.', 'error'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m)) { flashMsg(cf, 'Please enter a valid email address.', 'error'); return; }
      flashMsg(cf, 'Thank you! We will get back to you within 2 hours.', 'success');
      cf.reset();
    });
  }

  function flashMsg(form, text, type) {
    var d = document.createElement('div');
    d.style.cssText = [
      'margin-top:12px', 'padding:12px 16px',
      "font-family:'Barlow Condensed',sans-serif",
      'font-size:14px', 'font-weight:600', 'letter-spacing:.06em',
      'border:1px solid ' + (type === 'success' ? 'rgba(232,92,26,.4)' : '#c0392b'),
      'background:'      + (type === 'success' ? 'rgba(232,92,26,.08)' : 'rgba(192,57,43,.1)'),
      'color:'           + (type === 'success' ? '#e85c1a' : '#c0392b')
    ].join(';');
    d.textContent = text;
    form.insertAdjacentElement('afterend', d);
    setTimeout(function () { if (d.parentNode) d.remove(); }, 6000);
  }

});
