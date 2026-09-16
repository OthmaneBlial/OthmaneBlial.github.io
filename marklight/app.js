'use strict';

const copyStatus = document.getElementById('copy-status');
for (const snippet of document.querySelectorAll('.code-snippet')) {
  const code = snippet.querySelector('code');
  if (!code) continue;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'copy-button';
  button.textContent = 'Copy';
  button.setAttribute('aria-label', 'Copy code snippet');
  const toolbar = document.createElement('div');
  toolbar.className = 'snippet-toolbar';
  const label = document.createElement('span');
  label.textContent = 'COPY & PASTE';
  toolbar.append(label, button);
  snippet.prepend(toolbar);
  let reset;
  button.addEventListener('click', async () => {
    clearTimeout(reset);
    try {
      await navigator.clipboard.writeText(code.textContent);
      button.textContent = 'Copied ✓';
      if (copyStatus) copyStatus.textContent = 'Code snippet copied.';
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(code);
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = 'Select & copy';
      if (copyStatus) copyStatus.textContent = 'Clipboard unavailable. The code is selected; use your keyboard copy command.';
    }
    reset = setTimeout(() => { button.textContent = 'Copy'; }, 2200);
  });
}

const preview = document.getElementById('reader-preview');
if (preview) {
  const controls = document.querySelector('.preview-control');
  if (controls) controls.hidden = false;
  for (const button of document.querySelectorAll('[data-preview]')) {
    button.addEventListener('click', () => {
      const theme = button.dataset.preview;
      preview.src = `images/reader-${theme}.png`;
      preview.alt = `Marklight reader in ${theme} theme, showing a document outline, task list, highlighted Rust code and reading progress.`;
      const caption = document.getElementById('preview-caption');
      if (caption) caption.textContent = theme;
      for (const control of document.querySelectorAll('[data-preview]')) {
        control.setAttribute('aria-pressed', String(control === button));
      }
    });
  }
}

const contentsLinks = [...document.querySelectorAll('.docs-sidebar nav a')];
if (contentsLinks.length && 'IntersectionObserver' in window) {
  const sections = contentsLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const visible = new Set();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    }
    const current = sections.find(section => visible.has(section));
    if (!current) return;
    for (const link of contentsLinks) {
      if (link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }, { rootMargin: '-12% 0px -62% 0px' });
  sections.forEach(section => observer.observe(section));
}
