'use strict';

function readMilestones(data) {
  if (!data || !Array.isArray(data.milestones) || data.milestones.length !== 8) {
    throw new Error('Expected eight roadmap milestones.');
  }
  const milestones = data.milestones.map((milestone) => {
    if (typeof milestone.name !== 'string' || !milestone.name || !milestone.gates || typeof milestone.gates !== 'object' || Array.isArray(milestone.gates)) {
      throw new Error('Invalid roadmap milestone.');
    }
    const gates = Object.entries(milestone.gates);
    if (gates.length !== 5 || gates.some(([name, done]) => !name || typeof done !== 'boolean')) {
      throw new Error('Expected five boolean verification gates per milestone.');
    }
    return { name: milestone.name, gates, complete: gates.filter(([, done]) => done).length };
  });
  return { milestones, complete: milestones.reduce((sum, milestone) => sum + milestone.complete, 0), total: 40 };
}

function renderProgress(data) {
  const progress = readMilestones(data);
  const percentage = progress.complete / progress.total * 100;
  const formatted = percentage.toFixed(1).replace(/\.0$/, '') + '%';
  document.querySelectorAll('[data-progress-percentage]').forEach((element) => { element.textContent = formatted; });
  document.querySelectorAll('[data-progress-caption]').forEach((element) => { element.textContent = `${progress.complete} / ${progress.total} gates verified. Planned work earns no credit.`; });
  document.querySelectorAll('[data-progress-fill]').forEach((element) => { element.style.width = `${percentage}%`; });
  document.querySelectorAll('[role="progressbar"]').forEach((element) => {
    element.setAttribute('aria-valuenow', String(percentage));
    element.setAttribute('aria-valuetext', `${progress.complete} of ${progress.total} gates verified`);
  });
  document.querySelectorAll('[data-milestones]').forEach((container) => {
    container.replaceChildren();
    progress.milestones.forEach((milestone, index) => {
      const details = document.createElement('details');
      details.className = 'milestone' + (milestone.complete === 5 ? ' complete' : '');
      const summary = document.createElement('summary');
      const number = document.createElement('span');
      number.className = 'milestone-number';
      number.textContent = String(index + 1).padStart(2, '0');
      const name = document.createElement('span');
      name.className = 'milestone-name';
      name.textContent = milestone.name;
      const count = document.createElement('span');
      count.className = 'milestone-count';
      count.textContent = `${milestone.complete}/5`;
      count.setAttribute('aria-label', `${milestone.complete} of 5 gates verified`);
      const toggle = document.createElement('span');
      toggle.className = 'milestone-toggle';
      toggle.setAttribute('aria-hidden', 'true');
      summary.append(number, name, count, toggle);
      const gates = document.createElement('ul');
      gates.className = 'gates';
      milestone.gates.forEach(([label, done]) => {
        const item = document.createElement('li');
        const mark = document.createElement('span');
        mark.className = 'gate-mark' + (done ? ' gate-done' : '');
        mark.textContent = done ? '✓' : '○';
        mark.setAttribute('aria-hidden', 'true');
        const text = document.createElement('span');
        text.textContent = `${label} — ${done ? 'verified' : 'pending'}`;
        item.append(mark, text);
        gates.append(item);
      });
      details.append(summary, gates);
      container.append(details);
    });
  });
}

async function copyCode(button) {
  const target = document.getElementById(button.dataset.copy);
  if (!target) return;
  const text = target.textContent;
  const status = document.getElementById('copy-status');
  const original = button.textContent;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const field = document.createElement('textarea');
      field.value = text;
      field.className = 'sr-only';
      document.body.append(field);
      field.select();
      const copied = document.execCommand('copy');
      field.remove();
      button.focus();
      if (!copied) throw new Error('Clipboard unavailable.');
    }
    button.textContent = 'Copied ✓';
    if (status) status.textContent = 'Commands copied to clipboard.';
  } catch {
    button.textContent = 'Select text to copy';
    if (status) status.textContent = 'Clipboard unavailable. Select and copy the commands manually.';
  }
  window.setTimeout(() => { button.textContent = original; }, 2400);
}

if (typeof document !== 'undefined') {
  document.querySelectorAll('[data-copy]').forEach((button) => { button.addEventListener('click', () => copyCode(button)); });
  document.querySelectorAll('.screen-image img').forEach((image) => {
    const showFallback = () => { image.hidden = true; image.style.display = 'none'; const fallback = image.nextElementSibling; if (fallback) fallback.hidden = false; };
    image.addEventListener('error', showFallback);
    if (image.complete && !image.naturalWidth) showFallback();
  });
  fetch('./progress.json', { cache: 'no-store' })
    .then((response) => { if (!response.ok) throw new Error('Roadmap data unavailable.'); return response.json(); })
    .then(renderProgress)
    .catch(() => {
      document.querySelectorAll('[data-progress-caption]').forEach((element) => { element.textContent = 'Roadmap data unavailable. Check the source roadmap for current progress.'; });
      document.querySelectorAll('[data-milestones]').forEach((element) => { element.textContent = 'Roadmap data unavailable. The source repository has the current verification gates.'; });
    });
}

if (typeof module !== 'undefined') module.exports = { readMilestones };
