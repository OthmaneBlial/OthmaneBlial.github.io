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
