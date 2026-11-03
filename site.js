/* ============================================================
   The CEO Channel — shared page behaviour
   1. Hamburger menu on phones
   2. Nav shadow once the page scrolls
   3. Pop-ups: SUBSCRIBE and search (open/close)
   4. Sign-up forms before Mailchimp is connected
   5. Search (only when switched on in Site settings)
   6. Share buttons on articles (fills in the current page link)
   ============================================================ */
(function () {
  /* ---------- 1–2. Menu bar ---------- */
  var nav = document.getElementById('nav');
  if (nav) {
    var toggle = nav.querySelector('.nav__toggle');
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('nav--open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    window.addEventListener('scroll', function () {
      nav.classList.toggle('nav--scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  /* ---------- 3. Pop-ups ---------- */
  var searchStarted = false;
  document.querySelectorAll('[data-open]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var dialog = document.getElementById(btn.getAttribute('data-open'));
      if (!dialog || !dialog.showModal) return;
      if (nav) nav.classList.remove('nav--open');
      dialog.showModal();
      if (dialog.id === 'search-dialog') startSearch(dialog);
      var field = dialog.querySelector('input');
      if (field) setTimeout(function () { field.focus(); }, 50);
    });
  });
  document.querySelectorAll('dialog.modal').forEach(function (dialog) {
    dialog.querySelector('[data-close]').addEventListener('click', function () { dialog.close(); });
    // Click on the dark area outside the box closes it
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
  });

  /* ---------- 4. Sign-up forms not yet connected to Mailchimp ---------- */
  document.querySelectorAll('form[data-not-connected]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.querySelector('.subscribe__note').hidden = false;
    });
  });

  /* ---------- 5. Search ---------- */
  function startSearch(dialog) {
    if (searchStarted || typeof PagefindUI === 'undefined') return;
    searchStarted = true;
    new PagefindUI({
      element: '#search',
      showSubResults: false,
      showImages: true,
      resetStyles: false,
      translations: { placeholder: 'Search The CEO Channel' }
    });
    setTimeout(function () {
      var field = dialog.querySelector('input');
      if (field) field.focus();
    }, 100);
  }

  /* ---------- 6. Share buttons ---------- */
  var share = document.querySelector('.share');
  if (share) {
    var url = encodeURIComponent(window.location.href);
    var title = encodeURIComponent(document.querySelector('h1').textContent.trim());
    var targets = {
      whatsapp: 'https://wa.me/?text=' + title + '%20' + url,
      telegram: 'https://t.me/share/url?url=' + url + '&text=' + title,
      facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + url,
      linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + url,
      x:        'https://x.com/intent/post?url=' + url + '&text=' + title,
      email:    'mailto:?subject=' + title + '&body=' + url
    };
    share.querySelectorAll('[data-share]').forEach(function (a) {
      var t = targets[a.getAttribute('data-share')];
      if (t) a.href = t;
    });

    var copy = share.querySelector('[data-copy]');
    var note = share.querySelector('.share__copied');
    if (copy) {
      copy.addEventListener('click', function () {
        try {
          navigator.clipboard.writeText(window.location.href).then(function () {
            note.hidden = false;
            setTimeout(function () { note.hidden = true; }, 2000);
          });
        } catch (err) { /* older browsers: do nothing */ }
      });
    }
  }
})();
