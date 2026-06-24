
(function() {
  const THEME_KEY = 'aelish-theme';
  const root = document.body;

  function setTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
    const btn = document.querySelector('[data-theme-toggle]');
    if (btn) {
      const isMidnight = theme === 'midnight';
      btn.innerHTML = isMidnight
        ? '<span class="theme-icon" aria-hidden="true"></span><span>Midnight</span>'
        : '<span class="theme-icon" aria-hidden="true"></span><span>Aurora</span>';
      btn.setAttribute('aria-label', isMidnight ? 'Switch to Aurora theme' : 'Switch to Midnight theme');
    }
  }

  const saved = localStorage.getItem(THEME_KEY) || 'aurora';
  setTheme(saved);

  document.addEventListener('click', function(e) {
    const toggle = e.target.closest('[data-theme-toggle]');
    if (toggle) {
      const next = root.dataset.theme === 'aurora' ? 'midnight' : 'aurora';
      setTheme(next);
      return;
    }

    const card = e.target.closest('[data-modal-src]');
    if (card) {
      const src = card.getAttribute('data-modal-src');
      const title = card.getAttribute('data-modal-title') || 'Preview';
      openMediaModal(src, title, card.getAttribute('data-modal-type') || 'image');
      return;
    }

    if (e.target.matches('[data-open-resume]')) {
      e.preventDefault();
      openMediaModal(e.target.getAttribute('href'), 'Resume Preview', 'pdf');
      return;
    }

    const closeBtn = e.target.closest('[data-modal-close]');
    if (closeBtn) {
      closeModal();
      return;
    }

    if (e.target.classList.contains('modal')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });

  function openMediaModal(src, title, type) {
    let modal = document.querySelector('#mediaModal');
    if (!modal) return;
    const head = modal.querySelector('[data-modal-title]');
    const body = modal.querySelector('[data-modal-content]');
    head.textContent = title;
    body.innerHTML = '';
    if (type === 'pdf') {
      const iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.title = title;
      body.appendChild(iframe);
    } else {
      const img = document.createElement('img');
      img.src = src;
      img.alt = title;
      body.appendChild(img);
    }
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const modal = document.querySelector('#mediaModal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Highlight current page nav based on body data-page or pathname
  const page = document.body.dataset.page;
  document.querySelectorAll('[data-page-link]').forEach(link => {
    if (link.getAttribute('data-page-link') === page) {
      link.classList.add('active');
    }
  });
})();
