/* =========================================================================
   [Your Name] — Portfolio interactions
   Vanilla JS, no dependencies. Every feature degrades gracefully:
   content is visible and navigable without JavaScript.
   ========================================================================= */
(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------------------------------------------------------------- nav */
  var header = $('#siteHeader');
  var nav = $('#primaryNav');
  var navToggle = $('#navToggle');
  var navOpen = false;

  function setNav(open, returnFocus) {
    navOpen = open;
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('nav-open', open);
    if (open) {
      var firstLink = nav.querySelector('a[href]');
      if (firstLink) {
        // Wait for the panel's visibility change to apply before moving focus.
        window.setTimeout(function () { firstLink.focus(); }, 80);
      }
    } else if (returnFocus) {
      navToggle.focus();
    }
  }

  if (nav && navToggle) {
    navToggle.addEventListener('click', function () { setNav(!navOpen); });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setNav(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navOpen) {
        setNav(false, true);
        return;
      }
      // The panel covers the page, so keep Tab inside it while it is open.
      if (event.key !== 'Tab' || !navOpen) return;
      var links = $$('a[href]', nav);
      if (!links.length) return;
      var first = links[0];
      var last = navToggle;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 980 && navOpen) setNav(false);
    });
  }

  /* ------------------------------------------------ scroll progress + spy */
  var progressBar = $('#progressBar');
  var navLinks = $$('.nav__link');
  var sections = navLinks.map(function (link) {
    return { link: link, section: document.getElementById(link.getAttribute('href').slice(1)) };
  }).filter(function (item) { return item.section; });

  function updateScrollUI() {
    var root = document.documentElement;
    var max = root.scrollHeight - root.clientHeight;
    var ratio = max > 0 ? Math.min(root.scrollTop / max, 1) : 0;

    if (progressBar) progressBar.style.transform = 'scaleX(' + ratio + ')';
    if (header) header.classList.toggle('is-scrolled', root.scrollTop > 8);

    var marker = root.scrollTop + window.innerHeight * 0.35;
    var active = null;
    sections.forEach(function (item) {
      if (item.section.getBoundingClientRect().top + root.scrollTop <= marker) active = item.link;
    });
    navLinks.forEach(function (link) { link.removeAttribute('aria-current'); });
    if (active && root.scrollTop > 160) active.setAttribute('aria-current', 'location');
  }

  var scrollQueued = false;
  window.addEventListener('scroll', function () {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(function () {
      updateScrollUI();
      scrollQueued = false;
    });
  }, { passive: true });
  updateScrollUI();

  /* ------------------------------------------------------------- reveals */
  var revealEls = $$('[data-reveal]');
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-inview'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-inview');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ------------------------------------------------------- case dialogs */
  var dialogs = $$('.case-dialog');
  var triggers = $$('[data-case]');
  var lastTrigger = null;

  function closeDialog(dialog) {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var dialog = document.getElementById(trigger.getAttribute('data-case'));
      if (!dialog) return;
      lastTrigger = trigger;
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
      document.body.classList.add('dialog-open');
      var scroller = $('.case-dialog__inner', dialog);
      if (scroller) scroller.scrollTop = 0;
    });
  });

  dialogs.forEach(function (dialog) {
    dialog.addEventListener('close', function () {
      document.body.classList.remove('dialog-open');
      if (lastTrigger) {
        lastTrigger.focus();
        lastTrigger = null;
      }
    });

    dialog.addEventListener('cancel', function () {
      document.body.classList.remove('dialog-open');
    });

    // A click that lands on the <dialog> itself (not its content) is a backdrop click.
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) closeDialog(dialog);
    });

    var closeBtn = $('[data-close]', dialog);
    if (closeBtn) closeBtn.addEventListener('click', function () { closeDialog(dialog); });
  });

  /* ---------------------------------------------------------- copy email */
  var copyBtn = $('#copyEmail');
  var copyStatus = $('#copyStatus');

  function legacyCopy(text) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (error) { ok = false; }
    document.body.removeChild(area);
    return ok;
  }

  if (copyBtn) {
    var copyLabel = $('.copy-btn__label', copyBtn);
    var originalLabel = copyLabel ? copyLabel.textContent : '';
    var resetTimer = null;

    copyBtn.addEventListener('click', function () {
      var email = copyBtn.getAttribute('data-email') || '';
      var announce = function (message) {
        if (copyStatus) copyStatus.textContent = message;
      };
      var confirmCopy = function () {
        copyBtn.classList.add('is-copied');
        if (copyLabel) copyLabel.textContent = 'Copied';
        announce('Email address copied to clipboard.');
        window.clearTimeout(resetTimer);
        resetTimer = window.setTimeout(function () {
          copyBtn.classList.remove('is-copied');
          if (copyLabel) copyLabel.textContent = originalLabel;
          announce('');
        }, 2600);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(confirmCopy, function () {
          if (legacyCopy(email)) confirmCopy();
          else announce('Copy failed. The address is ' + email);
        });
      } else if (legacyCopy(email)) {
        confirmCopy();
      } else {
        announce('Copy failed. The address is ' + email);
      }
    });
  }

  /* --------------------------------------------------------------- form */
  var form = $('#contactForm');
  if (form) {
    var emailLink = $('#emailLink');
    var formStatus = $('#formStatus');
    var fields = [
      { input: $('#name'), error: $('#nameError'), valid: function (v) { return v.trim().length > 0; } },
      { input: $('#email'), error: $('#emailError'), valid: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); } },
      { input: $('#message'), error: $('#messageError'), valid: function (v) { return v.trim().length > 3; } }
    ].filter(function (field) { return field.input && field.error; });

    fields.forEach(function (field) {
      field.input.addEventListener('input', function () {
        field.input.removeAttribute('aria-invalid');
        field.error.hidden = true;
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var firstInvalid = null;

      fields.forEach(function (field) {
        var isValid = field.valid(field.input.value);
        field.input.setAttribute('aria-invalid', String(!isValid));
        field.error.hidden = isValid;
        if (!isValid && !firstInvalid) firstInvalid = field.input;
      });

      if (firstInvalid) {
        if (formStatus) formStatus.textContent = 'Please fix the highlighted fields.';
        firstInvalid.focus();
        return;
      }

      var to = emailLink ? emailLink.getAttribute('href').replace(/^mailto:/, '') : '';
      var name = $('#name').value.trim();
      var email = $('#email').value.trim();
      var message = $('#message').value.trim();
      var subject = 'Portfolio enquiry — ' + name;
      var body = 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message;

      window.location.href = 'mailto:' + to +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      if (formStatus) formStatus.textContent = 'Opening your email app… If nothing happens, email ' + to + ' directly.';
    });
  }

  /* ------------------------------------------------ cursor label on cards */
  var cursorTag = $('#cursorTag');
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  if (cursorTag && finePointer && !reduceMotion.matches) {
    var cards = $$('.case-card');
    var frame = null;
    var pointerX = 0;
    var pointerY = 0;

    window.addEventListener('pointermove', function (event) {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (frame) return;
      frame = window.requestAnimationFrame(function () {
        cursorTag.style.setProperty('--x', pointerX + 'px');
        cursorTag.style.setProperty('--y', pointerY + 'px');
        frame = null;
      });
    }, { passive: true });

    cards.forEach(function (card) {
      card.addEventListener('pointerenter', function () { cursorTag.classList.add('is-visible'); });
      card.addEventListener('pointerleave', function () { cursorTag.classList.remove('is-visible'); });
    });
  }

  /* --------------------------------------------------------------- year */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
