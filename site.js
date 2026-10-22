/* ============================================================
   The CEO Channel — shared page behaviour
   1. Hamburger menu on phones
   2. Section menus: click a section to open its sub-sections,
      click again (or press Esc, or click elsewhere) to close.
      Only one open at a time.
   3. Nav shadow once the page scrolls
   4. Share buttons on articles (fills in the current page link)
   ============================================================ */
(function () {
  var nav = document.getElementById('nav');
  if (nav) {
    var toggle = nav.querySelector('.nav__toggle');
    var buttons = nav.querySelectorAll('.menu__btn');

    function closeAll(except) {
      buttons.forEach(function (b) {
        if (b === except) return;
        b.setAttribute('aria-expanded', 'false');
        document.getElementById(b.getAttribute('aria-controls')).hidden = true;
      });
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = btn.getAttribute('aria-expanded') === 'true';
        closeAll(btn);
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        document.getElementById(btn.getAttribute('aria-controls')).hidden = open;
      });
    });

    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) closeAll();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll();
    });

    // Following a sub-section link closes everything
    nav.addEventListener('click', function (e) {
      if (e.target.closest('.menu__panel a')) {
        closeAll();
        nav.classList.remove('nav--open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('nav--open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    window.addEventListener('scroll', function () {
      nav.classList.toggle('nav--scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  /* ---------- Share buttons ---------- */
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
