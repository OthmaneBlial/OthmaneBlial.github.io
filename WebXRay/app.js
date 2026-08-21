(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('[data-header]');
  const progress = document.querySelector('.page-progress span');

  const updateScrollState = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    if (progress) progress.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
    header?.classList.toggle('compact', window.scrollY > 20);
  };

  updateScrollState();
  window.addEventListener('scroll', updateScrollState, { passive: true });

  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  navToggle?.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    siteNav?.classList.toggle('open', !isOpen);
  });
  siteNav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle?.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('open');
    });
  });

  const reveals = [...document.querySelectorAll('.reveal')];
  if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
    reveals.forEach((element) => element.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -5%' },
    );
    reveals.forEach((element) => revealObserver.observe(element));
  }

  const copyText = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch {
        // Sandboxed browsers can expose the Clipboard API but deny the write.
        // Fall through to the user-gesture-backed selection path.
      }
    }
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const copied = document.execCommand('copy');
    area.remove();
    if (!copied) throw new Error('Clipboard write was refused');
  };

  document.querySelectorAll('[data-copy]').forEach((button) => {
    const initialText = button.querySelector('span')?.textContent || button.textContent || 'Copy';
    button.addEventListener('click', async () => {
      const label = button.querySelector('span');
      button.classList.add('copied');
      if (label) label.textContent = 'Copying…';
      else button.textContent = 'Copying…';
      try {
        await copyText(button.dataset.copy || '');
        if (label) label.textContent = 'Copied';
        else button.textContent = 'Copied';
        window.setTimeout(() => {
          button.classList.remove('copied');
          if (label) label.textContent = initialText;
          else button.textContent = initialText;
        }, 1600);
      } catch {
        button.classList.remove('copied');
        if (label) label.textContent = 'Copy failed';
        else button.textContent = 'Copy failed';
      }
    });
  });

  const scenes = {
    organism: {
      src: 'assets/webxray-organism.png',
      alt: 'Organism lens grouping a dense observation into semantic orbits',
      index: '01 / WHO IS HERE?',
      title: 'See the whole dependency ecology.',
      copy: 'Site core, non-recognition supply chain, and recognition frontier settle into deterministic orbits. Hundreds of requests collapse into weighted relationships.',
    },
    focus: {
      src: 'assets/webxray-causal-focus.png',
      alt: 'A selected WebXRay service with its causal neighborhood highlighted',
      index: '02 / WHY IS IT HERE?',
      title: 'Pull one causal route forward.',
      copy: 'Select a service and unrelated signals recede. Its inviter, descendants, storage changes, and recognition evidence remain visible as one answerable route.',
    },
    lineage: {
      src: 'assets/webxray-lineage.png',
      alt: 'Lineage lens showing inviter relationships by causal depth',
      index: '03 / WHO INVITED WHOM?',
      title: 'Read the load as ancestry.',
      copy: 'Redirects and sanitized initiators become a depth map. Follow the site into its direct dependencies and the services those dependencies invite.',
    },
  };

  const specimen = document.querySelector('[data-specimen]');
  if (specimen) {
    const image = specimen.querySelector('[data-scene-image]');
    const title = specimen.querySelector('[data-scene-title]');
    const copy = specimen.querySelector('[data-scene-copy]');
    const index = specimen.querySelector('[data-scene-index]');
    const buttons = [...specimen.querySelectorAll('[data-scene]')];
    buttons.forEach((button, buttonIndex) => {
      button.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault();
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        buttons[(buttonIndex + direction + buttons.length) % buttons.length].focus();
      });
      button.addEventListener('click', () => {
        const scene = scenes[button.dataset.scene];
        if (!scene || !image) return;
        buttons.forEach((entry) => entry.setAttribute('aria-selected', String(entry === button)));
        image.classList.add('switching');
        window.setTimeout(
          () => {
            image.src = scene.src;
            image.alt = scene.alt;
            if (title) title.textContent = scene.title;
            if (copy) copy.textContent = scene.copy;
            if (index) index.textContent = scene.index;
            image.classList.remove('switching');
          },
          prefersReducedMotion.matches ? 0 : 170,
        );
      });
    });
  }

  const canvas = document.querySelector('[data-orbit-field]');
  if (canvas && !prefersReducedMotion.matches) {
    const context = canvas.getContext('2d');
    let frame = 0;
    let width = 0;
    let height = 0;
    let ratio = 1;
    const particles = Array.from({ length: 34 }, (_, index) => ({
      angle: (index / 34) * Math.PI * 2,
      radius: 0.5 + ((index * 37) % 47) / 100,
      speed: 0.00004 + ((index * 13) % 9) * 0.000006,
      size: index % 7 === 0 ? 1.8 : 0.7,
      type: index % 11 === 0 ? 'ember' : index % 5 === 0 ? 'blue' : 'acid',
    }));

    const resize = () => {
      ratio = Math.min(2, window.devicePixelRatio || 1);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (time) => {
      context.clearRect(0, 0, width, height);
      const cx = width * (width < 900 ? 0.78 : 0.72);
      const cy = height * 0.5;
      const rx = Math.min(width * 0.32, 490);
      const ry = Math.min(height * 0.38, 360);
      particles.forEach((particle) => {
        const angle = particle.angle + time * particle.speed;
        const x = cx + Math.cos(angle) * rx * particle.radius;
        const y = cy + Math.sin(angle) * ry * particle.radius;
        const colors = { acid: '201,255,39', blue: '112,206,255', ember: '255,101,66' };
        context.beginPath();
        context.strokeStyle = `rgba(${colors[particle.type]},0.055)`;
        context.moveTo(cx, cy);
        context.lineTo(x, y);
        context.stroke();
        context.beginPath();
        context.fillStyle = `rgba(${colors[particle.type]},0.6)`;
        context.shadowBlur = particle.size * 8;
        context.shadowColor = `rgba(${colors[particle.type]},0.55)`;
        context.arc(x, y, particle.size, 0, Math.PI * 2);
        context.fill();
      });
      context.shadowBlur = 0;
      frame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    frame = window.requestAnimationFrame(draw);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) window.cancelAnimationFrame(frame);
      else frame = window.requestAnimationFrame(draw);
    });
  }

  const docsSearch = document.querySelector('[data-docs-search]');
  if (docsSearch) {
    const sections = [...document.querySelectorAll('[data-docs-section]')];
    const empty = document.querySelector('[data-docs-empty]');
    const result = document.querySelector('[data-search-result]');
    const filterTitle = document.querySelector('[data-filter-title]');
    docsSearch.addEventListener('input', () => {
      const query = docsSearch.value.trim().toLowerCase();
      let visible = 0;
      sections.forEach((section) => {
        const matches = !query || section.textContent.toLowerCase().includes(query);
        section.hidden = !matches;
        if (matches) visible += 1;
      });
      if (filterTitle) {
        const visibleTitle = sections.some((section) => !section.hidden && section.querySelector('h1'));
        filterTitle.hidden = visibleTitle;
      }
      if (empty) empty.hidden = visible !== 0;
      if (result) result.textContent = query ? `${visible} section${visible === 1 ? '' : 's'} found` : '';
    });

    if ('IntersectionObserver' in window) {
      const links = [...document.querySelectorAll('.docs-sidebar nav a')];
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (!visible) return;
          links.forEach((link) => link.classList.toggle('active', link.hash === `#${visible.target.id}`));
        },
        { rootMargin: '-15% 0px -70%', threshold: [0, 0.2, 0.7] },
      );
      sections.forEach((section) => observer.observe(section));
    }
  }
})();
