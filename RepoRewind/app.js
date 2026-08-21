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

const tourViews = {
  city: {
    image: './assets/screenshots/city-timeline.png',
    alt: 'RepoRewind city timeline',
    plate: 'Plate 01',
    title: 'Replay the living city',
    description:
      'Scrub, play, pause, jump to landmarks, orbit the camera, and select any building without losing geographic continuity.',
    points: ['Stable district layout', 'Keyboard-accessible landmarks', 'Contributor travelers'],
  },
  search: {
    image: './assets/screenshots/search-archive.png',
    alt: 'RepoRewind archive search finding film-export history',
    plate: 'Plate 02',
    title: 'Find any trace',
    description:
      'Search paths, commits, contributors, releases, and branch tips. A result travels to the right moment and opens its building when possible.',
    points: ['⌘K or Ctrl K', 'Scoped query filters', 'Indexed archive search'],
  },
  compare: {
    image: './assets/screenshots/temporal-diff.png',
    alt: 'RepoRewind temporal comparison between repository eras',
    plate: 'Plate 03',
    title: 'Compare two eras',
    description:
      'Pin one moment, travel elsewhere, and inspect rename-aware construction, demolition, rebuilding, and line-count changes.',
    points: ['Rename chain tracking', 'Consequential sites ranked', 'Live diff recoloring'],
  },
  film: {
    image: './assets/screenshots/film-export.png',
    alt: 'RepoRewind browser film export controls',
    plate: 'Plate 04',
    title: 'Export the history film',
    description:
      'Render a fixed-timeline 1080p or 4K film with dates, commit titles, statistics, merges, and releases—entirely inside the browser tab.',
    points: ['Runtime MP4 probe', 'WebM compatibility path', 'Cancelable local render'],
  },
}

const tourTabs = [...document.querySelectorAll('[data-view]')]
const tourPanel = document.querySelector('#tour-panel')
const tourImage = document.querySelector('[data-tour-image]')
const tourPlate = document.querySelector('[data-tour-plate]')
const tourTitle = document.querySelector('[data-tour-title]')
const tourDescription = document.querySelector('[data-tour-description]')
const tourPoints = document.querySelector('[data-tour-points]')

function selectTour(viewName, focus = false) {
  const view = tourViews[viewName]
  if (!view || !tourImage || !tourPanel) return

  const activeTab = tourTabs.find((tab) => tab.dataset.view === viewName)
  tourTabs.forEach((tab) => {
    const selected = tab === activeTab
    tab.setAttribute('aria-selected', String(selected))
    tab.tabIndex = selected ? 0 : -1
  })
  tourPanel.setAttribute('aria-labelledby', activeTab?.id ?? 'tab-city')

  tourImage.classList.add('is-changing')
  window.setTimeout(() => {
    tourImage.src = view.image
    tourImage.alt = view.alt
    if (tourPlate) tourPlate.textContent = view.plate
    if (tourTitle) tourTitle.textContent = view.title
    if (tourDescription) tourDescription.textContent = view.description
    if (tourPoints) {
      tourPoints.replaceChildren(
        ...view.points.map((point) => {
          const item = document.createElement('li')
          item.textContent = point
          return item
        }),
      )
    }
    tourImage.classList.remove('is-changing')
  }, 160)

  if (focus) activeTab?.focus()
}

tourTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTour(tab.dataset.view))
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    let nextIndex = index
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tourTabs.length) % tourTabs.length
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tourTabs.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = tourTabs.length - 1
    selectTour(tourTabs[nextIndex].dataset.view, true)
  })
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
