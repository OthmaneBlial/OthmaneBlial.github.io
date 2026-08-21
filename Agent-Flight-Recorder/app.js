(() => {
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');

  if (menuToggle && menu) {
    const closeMenu = () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menu.removeAttribute('data-open');
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menu.toggleAttribute('data-open', !isOpen);
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 800) closeMenu();
    });
  }

  const toast = document.querySelector('[data-toast]');
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.dataset.visible = 'true';
    toastTimer = window.setTimeout(() => {
      delete toast.dataset.visible;
    }, 2200);
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const helper = document.createElement('textarea');
    helper.value = text;
    helper.setAttribute('readonly', '');
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    document.body.appendChild(helper);
    helper.select();
    document.execCommand('copy');
    helper.remove();
  }

  document.querySelectorAll('[data-copy-target]').forEach((button) => {
    button.addEventListener('click', async () => {
      const target = document.getElementById(button.dataset.copyTarget || '');
      if (!target) return;
      const label = button.querySelector('[data-copy-label]');

      try {
        await copyText(target.textContent || '');
        if (label) label.textContent = 'Copied';
        showToast('Command copied to clipboard');
        window.setTimeout(() => {
          if (label) label.textContent = 'Copy';
        }, 1800);
      } catch (_error) {
        showToast('Copy failed — select the command manually');
      }
    });
  });

  const proofData = {
    replay: {
      src: 'assets/replay-console.png',
      width: 1440,
      height: 960,
      alt: 'Replay console with flight list, filtered event timeline, and detailed event inspector',
      kicker: 'Replay / evidence timeline',
      caption: 'Step through normalized events, filter operational signals, inspect raw provenance, and compare the current flight with an earlier attempt.',
    },
    diff: {
      src: 'assets/code-evolution.png',
      width: 1440,
      height: 960,
      alt: 'Code evolution panel showing exact before and after source with a generated diff',
      kicker: 'Evolution / exact boundary',
      caption:
        'Inspect a content-addressed before and after boundary, capture assurance, selected file path, and the bounded unified diff produced from synthetic source.',
    },
    mobile: {
      src: 'assets/mobile-replay.png',
      width: 390,
      height: 844,
      alt: 'Phone-sized Agent Flight Recorder replay console showing flight details and controls',
      kicker: 'Responsive / phone replay',
      caption: 'The same replay controls, lineage, tests, and status remain usable at a 390 by 844 pixel viewport without horizontal overflow.',
    },
  };

  const proofSwitcher = document.querySelector('[data-proof-switcher]');

  if (proofSwitcher) {
    const tabs = [...proofSwitcher.querySelectorAll('[data-proof-tab]')];
    const image = proofSwitcher.querySelector('[data-proof-image]');
    const kicker = proofSwitcher.querySelector('[data-proof-kicker]');
    const caption = proofSwitcher.querySelector('[data-proof-caption]');
    const expand = proofSwitcher.querySelector('[data-expand-image]');

    function selectProof(tab, shouldFocus) {
      const key = tab.dataset.proofTab;
      const data = key ? proofData[key] : null;
      if (!data || !image || !kicker || !caption) return;

      tabs.forEach((candidate) => {
        const selected = candidate === tab;
        candidate.setAttribute('aria-selected', String(selected));
        candidate.tabIndex = selected ? 0 : -1;
      });

      image.classList.add('is-switching');
      window.setTimeout(() => {
        image.src = data.src;
        image.width = data.width;
        image.height = data.height;
        image.alt = data.alt;
        image.classList.toggle('is-phone', key === 'mobile');
        image.classList.remove('is-switching');
      }, 130);
      kicker.textContent = data.kicker;
      caption.textContent = data.caption;
      if (expand) expand.setAttribute('aria-label', `Open ${data.kicker.toLowerCase()} image at full size`);
      if (shouldFocus) tab.focus();
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectProof(tab, false));
      tab.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let nextIndex = index;
        if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = tabs.length - 1;
        selectProof(tabs[nextIndex], true);
      });
    });
  }

  const imageDialog = document.querySelector('[data-image-dialog]');
  const dialogImage = document.querySelector('[data-dialog-image]');
  const expandImage = document.querySelector('[data-expand-image]');
  const dialogClose = document.querySelector('[data-dialog-close]');

  if (imageDialog && dialogImage && expandImage && dialogClose) {
    expandImage.addEventListener('click', () => {
      const source = expandImage.querySelector('img');
      if (!source) return;
      dialogImage.src = source.src;
      dialogImage.alt = source.alt;
      imageDialog.showModal();
    });
    dialogClose.addEventListener('click', () => imageDialog.close());
    imageDialog.addEventListener('click', (event) => {
      if (event.target === imageDialog) imageDialog.close();
    });
  }

  const docSearch = document.querySelector('[data-doc-search]');
  const docSections = [...document.querySelectorAll('[data-doc-section]')];
  const searchStatus = document.querySelector('[data-doc-search-status]');
  const emptyState = document.querySelector('[data-doc-empty]');

  if (docSearch && docSections.length) {
    const filterDocs = () => {
      const query = docSearch.value.trim().toLowerCase();
      let visible = 0;
      docSections.forEach((section) => {
        const haystack = `${section.dataset.search || ''} ${section.textContent || ''}`.toLowerCase();
        const matches = !query || haystack.includes(query);
        section.hidden = !matches;
        if (matches) visible += 1;
      });
      if (searchStatus) searchStatus.textContent = `${visible} ${visible === 1 ? 'section' : 'sections'}`;
      if (emptyState) emptyState.hidden = visible !== 0;
    };
    docSearch.addEventListener('input', filterDocs);
  }

  const tocLinks = [...document.querySelectorAll('.docs-toc a')];
  const observedSections = [...document.querySelectorAll('.doc-section')];
  if (tocLinks.length && observedSections.length && 'IntersectionObserver' in window) {
    const tocObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        tocLinks.forEach((link) => {
          link.toggleAttribute('aria-current', link.getAttribute('href') === `#${visible.target.id}`);
        });
      },
      { rootMargin: '-18% 0px -62%', threshold: [0.05, 0.25, 0.6] },
    );
    observedSections.forEach((section) => {
      tocObserver.observe(section);
    });
  }

  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.dataset.revealed = 'true';
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );
    reveals.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    reveals.forEach((element) => {
      element.dataset.revealed = 'true';
    });
  }
})();
