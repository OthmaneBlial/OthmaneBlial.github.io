document.documentElement.classList.add("js");

const header = document.querySelector("[data-site-header]");

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealItems = [...document.querySelectorAll("[data-reveal]")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (!("IntersectionObserver" in window) || reducedMotion.matches) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const copyStatus = document.querySelector("[data-copy-status]");
let copyStatusTimer;

const showCopyStatus = (message) => {
  if (!copyStatus) return;
  window.clearTimeout(copyStatusTimer);
  copyStatus.textContent = message;
  copyStatus.classList.add("is-visible");
  copyStatusTimer = window.setTimeout(() => {
    copyStatus.classList.remove("is-visible");
  }, 1800);
};

const fallbackCopy = (text) => {
  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.append(input);
  input.select();
  const copied = document.execCommand("copy");
  input.remove();
  if (!copied) throw new Error("The browser did not accept the copy command");
};

const copyText = async (text) => {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  fallbackCopy(text);
};

document.querySelectorAll(".copy-button").forEach((button) => {
  const initialLabel = button.textContent?.trim() || "COPY";

  button.addEventListener("click", async () => {
    const targetId = button.dataset.copyTarget;
    const target = targetId ? document.getElementById(targetId) : null;
    const text = button.dataset.copyText ?? target?.innerText?.trim();

    if (!text) {
      showCopyStatus("Nothing to copy");
      return;
    }

    try {
      await copyText(text);
      button.textContent = "COPIED";
      button.classList.add("is-copied");
      showCopyStatus("Copied to clipboard");
    } catch {
      button.textContent = "SELECT TEXT";
      showCopyStatus("Copy unavailable — select the snippet");
    }

    window.setTimeout(() => {
      button.textContent = initialLabel;
      button.classList.remove("is-copied");
    }, 1800);
  });
});

const imageViewer = document.getElementById("image-viewer");
const viewerImage = imageViewer?.querySelector("[data-viewer-image]");
const viewerCaption = imageViewer?.querySelector("[data-viewer-caption]");
let viewerReturnFocus;

document.querySelectorAll(".media-open").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const source = trigger.dataset.image;
    const caption =
      trigger.dataset.caption ?? "Runtime Atlas product screenshot";
    if (!source || !imageViewer || !viewerImage || !viewerCaption) return;

    if (typeof imageViewer.showModal !== "function") {
      window.open(source, "_blank", "noopener,noreferrer");
      return;
    }

    viewerImage.src = source;
    viewerImage.alt = caption;
    viewerCaption.textContent = caption;
    viewerReturnFocus = trigger;
    imageViewer.showModal();
  });
});

imageViewer
  ?.querySelector("[data-dialog-close]")
  ?.addEventListener("click", () => {
    imageViewer.close();
  });

imageViewer?.addEventListener("click", (event) => {
  if (event.target === imageViewer) imageViewer.close();
});

imageViewer?.addEventListener("close", () => {
  if (viewerReturnFocus instanceof HTMLElement) viewerReturnFocus.focus();
});

const tourTabs = [...document.querySelectorAll("[data-tour-step]")];
const tourPlay = document.querySelector("[data-tour-play]");
const tourPlayLabel = document.querySelector("[data-tour-play-label]");
const tourStage = document.getElementById("walkthrough-stage");
const tourMedia = document.querySelector("[data-tour-media]");
const tourImage = document.querySelector("[data-tour-image]");
const tourCounter = document.querySelector("[data-tour-counter]");
const tourTitle = document.querySelector("[data-tour-title]");
const tourDescription = document.querySelector("[data-tour-description]");
const tourLink = document.querySelector("[data-tour-link]");

const tourSteps = [
  {
    image: "assets/runtime-atlas-checkout.png",
    alt: "A completed checkout request moving across the Runtime Atlas application map",
    label: "Enlarge the completed checkout request capture",
    caption:
      "Follow a completed checkout across the source-backed application map.",
    title: "Watch the causal path light up.",
    description:
      "Route, middleware, services, databases, queue, and external calls appear in execution order—not as an aggregate diagram.",
    link: "Run this scenario locally →",
  },
  {
    image: "assets/runtime-atlas-inspector.png",
    alt: "Runtime Atlas source inspector opened on the Orders DB declaration",
    label: "Enlarge the Orders DB source inspection capture",
    caption:
      "Open the exact TypeScript declaration behind a measured Orders DB span.",
    title: "Move from a span to the code behind it.",
    description:
      "Select a proven node to see its approved source window, measured latency, call count, runtime state, and safe metadata in one place.",
    link: "See the source model →",
  },
  {
    image: "assets/runtime-atlas-failure.png",
    alt: "Runtime Atlas stopped on a failed Payment API span and its source declaration",
    label: "Enlarge the Payment API failure diagnosis capture",
    caption:
      "Stop on the failing Payment API span and inspect its causal source context.",
    title: "Stop where the dependency failed.",
    description:
      "The deterministic outage path preserves the parent-child chain, marks the failing edge, and keeps the declaration beside the runtime error.",
    link: "Run the failure locally →",
  },
];

if (tourTabs.length) {
  const preloadTourImages = () => {
    tourSteps.slice(1).forEach(({ image: source }) => {
      const preload = new Image();
      preload.src = source;
    });
  };
  window.addEventListener(
    "load",
    () => {
      if ("requestIdleCallback" in window)
        window.requestIdleCallback(preloadTourImages, { timeout: 1200 });
      else window.setTimeout(preloadTourImages, 250);
    },
    { once: true },
  );
}

let activeTourStep = 0;
let tourTimer;
let tourTransitionTimer;

const stopTour = () => {
  window.clearTimeout(tourTimer);
  window.clearTimeout(tourTransitionTimer);
  tourPlay?.classList.remove("is-playing");
  if (tourPlayLabel) tourPlayLabel.textContent = "Play tour";
};

const commitTourStep = (index) => {
  const step = tourSteps[index];
  if (!step) return;
  activeTourStep = index;

  tourTabs.forEach((tab, tabIndex) => {
    const selected = tabIndex === index;
    tab.setAttribute("aria-selected", String(selected));
    tab.setAttribute("tabindex", selected ? "0" : "-1");
  });
  if (tourStage && tourTabs[index]?.id)
    tourStage.setAttribute("aria-labelledby", tourTabs[index].id);
  if (tourImage instanceof HTMLImageElement) {
    tourImage.src = step.image;
    tourImage.alt = step.alt;
  }
  if (tourMedia instanceof HTMLElement) {
    tourMedia.dataset.image = step.image;
    tourMedia.dataset.caption = step.caption;
    tourMedia.setAttribute("aria-label", step.label);
    tourMedia.classList.remove("is-changing");
  }
  if (tourCounter)
    tourCounter.textContent = `${String(index + 1).padStart(2, "0")} / 03`;
  if (tourTitle) tourTitle.textContent = step.title;
  if (tourDescription) tourDescription.textContent = step.description;
  if (tourLink) tourLink.textContent = step.link;
};

const showTourStep = (index, focusTab = false) => {
  window.clearTimeout(tourTransitionTimer);
  if (index === activeTourStep || reducedMotion.matches) {
    commitTourStep(index);
  } else {
    tourMedia?.classList.add("is-changing");
    tourTransitionTimer = window.setTimeout(() => commitTourStep(index), 180);
  }
  if (focusTab) tourTabs[index]?.focus();
};

const playTourFrom = (index) => {
  showTourStep(index);
  if (index >= tourSteps.length - 1) {
    tourTimer = window.setTimeout(stopTour, 2600);
    return;
  }
  tourTimer = window.setTimeout(() => playTourFrom(index + 1), 3000);
};

tourPlay?.addEventListener("click", () => {
  stopTour();
  tourPlay.classList.add("is-playing");
  if (tourPlayLabel) tourPlayLabel.textContent = "Playing tour";
  playTourFrom(0);
});

tourTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    stopTour();
    showTourStep(index);
  });
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    stopTour();
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? tourTabs.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + tourTabs.length) %
            tourTabs.length;
    showTourStep(nextIndex, true);
  });
});

const scrollableCandidates = [
  ...document.querySelectorAll("pre, .table-wrap, .event-sequence"),
];

const labelScrollableRegion = (element) => {
  if (element.getAttribute("aria-label")) return;
  const sectionTitle = element
    .closest("[data-doc-section]")
    ?.querySelector("h2, h3")
    ?.textContent?.trim();
  const codeTitle = element
    .closest(".code-shell")
    ?.querySelector(".code-head span")
    ?.textContent?.trim();
  const kind = element.matches("pre")
    ? `${codeTitle || "Code sample"}`
    : element.matches(".table-wrap")
      ? `${sectionTitle || "Data"} table`
      : sectionTitle || "Scrollable content";
  element.setAttribute("aria-label", `${kind}, scroll horizontally`);
};

const updateScrollableRegions = () => {
  for (const element of scrollableCandidates) {
    const scrollable = element.scrollWidth > element.clientWidth + 1;
    if (scrollable) {
      element.dataset.scrollableRegion = "";
      element.setAttribute("role", "region");
      element.setAttribute("tabindex", "0");
      labelScrollableRegion(element);
    } else if (element.hasAttribute("data-scrollable-region")) {
      delete element.dataset.scrollableRegion;
      element.removeAttribute("role");
      element.removeAttribute("tabindex");
      if (
        element.getAttribute("aria-label")?.endsWith(", scroll horizontally")
      ) {
        element.removeAttribute("aria-label");
      }
    }
  }
};

updateScrollableRegions();
if ("ResizeObserver" in window) {
  const scrollabilityObserver = new ResizeObserver(updateScrollableRegions);
  scrollableCandidates.forEach((element) =>
    scrollabilityObserver.observe(element),
  );
} else {
  window.addEventListener("resize", updateScrollableRegions, { passive: true });
}

const docsSearch = document.querySelector("[data-docs-search]");
const docSections = [...document.querySelectorAll("[data-doc-section]")];
const docLinks = [...document.querySelectorAll("[data-doc-link]")];
const docsSummary = document.querySelector("[data-docs-summary]");
const docsEmpty = document.querySelector("[data-docs-empty]");
const clearDocsSearch = document.querySelector("[data-clear-docs-search]");

const normalizeSearch = (value) =>
  value
    .toLocaleLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const sectionForLink = (link) => {
  const id = link.getAttribute("href")?.replace(/^#/, "");
  return id ? document.getElementById(id) : null;
};

const filterDocumentation = () => {
  if (!(docsSearch instanceof HTMLInputElement)) return;
  const query = normalizeSearch(docsSearch.value);
  const tokens = query.split(/\s+/).filter(Boolean);
  let visibleCount = 0;

  for (const section of docSections) {
    const haystack = normalizeSearch(
      `${section.dataset.docTitle ?? ""} ${section.textContent ?? ""}`,
    );
    const matches = tokens.every((token) => haystack.includes(token));
    const isIntroduction = section.id === "introduction";
    section.hidden = Boolean(query) && !matches && !isIntroduction;
    if (!query || matches) visibleCount += 1;
  }

  for (const link of docLinks) {
    const section = sectionForLink(link);
    link.hidden = Boolean(section?.hidden);
  }

  if (docsSummary) {
    docsSummary.classList.toggle("is-visible", Boolean(query));
    docsSummary.textContent = query
      ? `${visibleCount} section${visibleCount === 1 ? "" : "s"} matching “${docsSearch.value.trim()}”`
      : "";
  }

  if (docsEmpty) docsEmpty.hidden = !query || visibleCount > 0;
};

docsSearch?.addEventListener("input", filterDocumentation);

clearDocsSearch?.addEventListener("click", () => {
  if (!(docsSearch instanceof HTMLInputElement)) return;
  docsSearch.value = "";
  filterDocumentation();
  docsSearch.focus();
});

document.addEventListener("keydown", (event) => {
  if (!(docsSearch instanceof HTMLInputElement)) return;
  const activeElement = document.activeElement;
  const isTyping =
    activeElement instanceof HTMLInputElement ||
    activeElement instanceof HTMLTextAreaElement ||
    activeElement?.getAttribute("contenteditable") === "true";

  if (event.key === "/" && !isTyping) {
    event.preventDefault();
    docsSearch.focus();
  }

  if (
    event.key === "Escape" &&
    activeElement === docsSearch &&
    docsSearch.value
  ) {
    docsSearch.value = "";
    filterDocumentation();
  }
});

if (docSections.length && "IntersectionObserver" in window) {
  const setActiveDocLink = (sectionId) => {
    for (const link of docLinks) {
      const active = link.getAttribute("href") === `#${sectionId}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting && !entry.target.hidden)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]?.target.id) setActiveDocLink(visible[0].target.id);
    },
    { rootMargin: "-18% 0px -68%", threshold: [0, 0.1, 0.4] },
  );

  docSections.forEach((section) => sectionObserver.observe(section));
}
