const navToggle = document.querySelector('[data-nav-toggle]')
const navigation = document.querySelector('[data-nav]')

function setNavigation(open) {
  if (!navToggle || !navigation) return
  navToggle.setAttribute('aria-expanded', String(open))
  navigation.classList.toggle('is-open', open)
  document.body.classList.toggle('nav-open', open)
}

navToggle?.addEventListener('click', () => {
  setNavigation(navToggle.getAttribute('aria-expanded') !== 'true')
})

navigation?.addEventListener('click', (event) => {
  if (event.target instanceof HTMLAnchorElement) setNavigation(false)
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setNavigation(false)
})

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const field = document.createElement('textarea')
  field.value = text
  field.setAttribute('readonly', '')
  field.style.position = 'fixed'
  field.style.opacity = '0'
  document.body.append(field)
  field.select()
  const copied = document.execCommand('copy')
  field.remove()
  if (!copied) throw new Error('Copy was not accepted by this browser.')
}

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const target = document.querySelector(button.dataset.copy)
    if (!target) return
    const label = button.querySelector('[data-copy-label]')
    const original = label?.textContent ?? 'Copy'
    try {
      await copyText(target.textContent.trim())
      button.dataset.state = 'copied'
      if (label) label.textContent = 'Copied'
    } catch {
      button.dataset.state = 'error'
      if (label) label.textContent = 'Select text'
    }
    window.setTimeout(() => {
      delete button.dataset.state
      if (label) label.textContent = original
    }, 1800)
  })
})

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const revealItems = document.querySelectorAll('.reveal')

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'))
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  )
  revealItems.forEach((item) => revealObserver.observe(item))
}

const docLinks = [...document.querySelectorAll('[data-doc-link]')]
const docSections = [...document.querySelectorAll('.doc-section[id]')]

if (docLinks.length && docSections.length && 'IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (!visible) return
      docLinks.forEach((link) => {
        link.classList.toggle('is-current', link.getAttribute('href') === `#${visible.target.id}`)
      })
    },
    { rootMargin: '-12% 0px -72% 0px', threshold: [0, 0.2, 0.6] },
  )
  docSections.forEach((section) => sectionObserver.observe(section))
}
