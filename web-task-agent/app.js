const DOC_CONTENT_VERSION = "plain-docs-20260928-v2";

const DOC_PAGES = [
  {
    slug: "getting-started",
    section: "Start",
    title: "Quick start",
    summary: "Try a sample, then run research.",
    path: "content/getting-started.md"
  },
  {
    slug: "overview",
    section: "Start",
    title: "Your results",
    summary: "See what a finished run creates.",
    path: "content/overview.md"
  },
  {
    slug: "platform",
    section: "Start",
    title: "How it works",
    summary: "The main parts of a local research run.",
    path: "content/platform.md"
  },
  {
    slug: "pipeline-and-storage",
    section: "Guides",
    title: "A research run",
    summary: "How research moves from search to report.",
    path: "content/pipeline-and-storage.md"
  },
  {
    slug: "workflows",
    section: "Guides",
    title: "Choose a workflow",
    summary: "Find and preview a starting point.",
    path: "content/workflows.md"
  },
  {
    slug: "cli-reference",
    section: "Reference",
    title: "Commands",
    summary: "Terminal commands and options.",
    path: "content/cli-reference.md"
  },
  {
    slug: "test-suite-map",
    section: "Reference",
    title: "Test coverage",
    summary: "What the local checks cover.",
    path: "content/test-suite-map.md"
  },
  {
    slug: "privacy",
    section: "Guides",
    title: "Privacy",
    summary: "What stays local and what a live run sends.",
    path: "content/privacy.md"
  },
  {
    slug: "trust-model",
    section: "Reference",
    title: "What checks prove",
    summary: "What verification checks and cannot prove.",
    path: "content/trust-model.md"
  },
  {
    slug: "decision-receipt-spec",
    section: "Reference",
    title: "Receipt format",
    summary: "Receipt fields and integrity rules.",
    path: "content/decision-receipt-spec.md"
  },
  {
    slug: "project-charter",
    section: "Reference",
    title: "Project overview",
    summary: "Project goals and architecture.",
    path: "content/project-charter.md"
  },
  {
    slug: "queue-worker-controls",
    section: "Guides",
    title: "Background jobs",
    summary: "Queue, pause, resume, and retry work.",
    path: "content/queue-worker-controls.md"
  },
  {
    slug: "api-dashboard",
    section: "Guides",
    title: "Local dashboard",
    summary: "Dashboard and API details.",
    path: "content/api-dashboard.md"
  },
  {
    slug: "examples",
    section: "Guides",
    title: "Examples",
    summary: "Common tasks with commands.",
    path: "content/examples.md"
  },
  {
    slug: "case-studies",
    section: "Guides",
    title: "Worked examples",
    summary: "Three sample research decisions.",
    path: "content/case-studies.md"
  },
  {
    slug: "project-layout",
    section: "Reference",
    title: "Code layout",
    summary: "Where the main code lives.",
    path: "content/project-layout.md"
  },
  {
    slug: "testing-and-hardening",
    section: "Reference",
    title: "Local checks",
    summary: "Run tests and security checks.",
    path: "content/testing-and-hardening.md"
  },
  {
    slug: "repo-readme",
    section: "Reference",
    title: "Project README",
    summary: "Project README.",
    path: "content/repo-readme.md"
  },
  {
    slug: "repo-roadmap",
    section: "Reference",
    title: "Project roadmap",
    summary: "Project roadmap.",
    path: "content/repo-roadmap.md"
  },
  {
    slug: "example-android-opportunity",
    section: "Reference",
    title: "Android example",
    summary: "An Android app research workflow.",
    path: "content/example-android-opportunity.md"
  },
  {
    slug: "example-article-research",
    section: "Reference",
    title: "Article example",
    summary: "An article research workflow.",
    path: "content/example-article-research.md"
  }
];

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatInline(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let paragraph = [];
  let listType = null;
  let listItems = [];
  let codeFence = null;
  let codeLines = [];
  let blockquote = [];

  function flushParagraph() {
    if (paragraph.length === 0) {
      return;
    }
    html.push(`<p>${formatInline(paragraph.join(" "))}</p>`);
    paragraph = [];
  }

  function flushList() {
    if (!listType || listItems.length === 0) {
      return;
    }
    html.push(
      `<${listType}>${listItems.map((item) => `<li>${formatInline(item)}</li>`).join("")}</${listType}>`
    );
    listType = null;
    listItems = [];
  }

  function flushCode() {
    if (codeFence === null) {
      return;
    }
    const className = codeFence ? ` class="language-${escapeHtml(codeFence)}"` : "";
    html.push(`<pre><code${className}>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
    codeFence = null;
    codeLines = [];
  }

  function flushBlockquote() {
    if (blockquote.length === 0) {
      return;
    }
    html.push(`<blockquote>${formatInline(blockquote.join(" "))}</blockquote>`);
    blockquote = [];
  }

  lines.forEach((line) => {
    const fenceMatch = line.match(/^```([\w-]+)?\s*$/);
    if (fenceMatch) {
      flushParagraph();
      flushList();
      flushBlockquote();
      if (codeFence !== null) {
        flushCode();
      } else {
        codeFence = fenceMatch[1] || "";
      }
      return;
    }

    if (codeFence !== null) {
      codeLines.push(line);
      return;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      flushBlockquote();
      return;
    }

    if (/^---+$/.test(line.trim())) {
      flushParagraph();
      flushList();
      flushBlockquote();
      html.push("<hr />");
      return;
    }

    const headingMatch = line.match(/^(#{1,4})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      flushBlockquote();
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const id = slugify(text);
      html.push(`<h${level} id="${id}">${formatInline(text)}</h${level}>`);
      return;
    }

    const blockquoteMatch = line.match(/^>\s?(.*)$/);
    if (blockquoteMatch) {
      flushParagraph();
      flushList();
      blockquote.push(blockquoteMatch[1]);
      return;
    }

    const unorderedMatch = line.match(/^-\s+(.*)$/);
    if (unorderedMatch) {
      flushParagraph();
      flushBlockquote();
      if (listType && listType !== "ul") {
        flushList();
      }
      listType = "ul";
      listItems.push(unorderedMatch[1]);
      return;
    }

    const orderedMatch = line.match(/^\d+\.\s+(.*)$/);
    if (orderedMatch) {
      flushParagraph();
      flushBlockquote();
      if (listType && listType !== "ol") {
        flushList();
      }
      listType = "ol";
      listItems.push(orderedMatch[1]);
      return;
    }

    paragraph.push(line.trim());
  });

  flushParagraph();
  flushList();
  flushCode();
  flushBlockquote();

  return html.join("\n");
}

async function copyText(text, button) {
  try {
    await navigator.clipboard.writeText(text);
    if (button) {
      const previous = button.textContent;
      button.textContent = "Copied";
      button.classList.add("is-copied");
      window.setTimeout(() => {
        button.textContent = previous;
        button.classList.remove("is-copied");
      }, 1400);
    }
  } catch {
    if (button) {
      button.textContent = "Copy failed";
      window.setTimeout(() => {
        button.textContent = "Copy";
      }, 1400);
    }
  }
}

function enhanceCodeBlocks(scope = document) {
  const blocks = scope.querySelectorAll("pre");
  blocks.forEach((pre) => {
    if (pre.parentElement && pre.parentElement.classList.contains("code-shell")) {
      return;
    }
    const wrapper = document.createElement("div");
    wrapper.className = "code-shell";
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-button";
    button.textContent = "Copy";
    button.addEventListener("click", () => copyText(pre.innerText.trimEnd(), button));
    wrapper.appendChild(button);
  });
}

function setupReveals() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach((item) => observer.observe(item));
}

function groupedPages(filter = "") {
  const normalized = filter.trim().toLowerCase();
  const filtered = DOC_PAGES.filter((page) => {
    if (!normalized) {
      return true;
    }
    return `${page.title} ${page.summary} ${page.section}`.toLowerCase().includes(normalized);
  });

  return filtered.reduce((groups, page) => {
    if (!groups[page.section]) {
      groups[page.section] = [];
    }
    groups[page.section].push(page);
    return groups;
  }, {});
}

function currentDocSlug() {
  const hash = window.location.hash.replace(/^#/, "");
  const params = new URLSearchParams(hash);
  return params.get("page") || "getting-started";
}

function setCurrentDocSlug(slug) {
  const params = new URLSearchParams();
  params.set("page", slug);
  window.location.hash = params.toString();
}

function renderNav(filter = "") {
  const nav = document.querySelector("#docs-nav");
  if (!nav) {
    return;
  }

  const activeSlug = currentDocSlug();
  const groups = groupedPages(filter);
  nav.innerHTML = Object.entries(groups)
    .map(([section, pages]) => {
      const isOpen = Boolean(filter.trim()) || section === "Start" || pages.some((page) => page.slug === activeSlug);
      const items = pages
        .map((page) => {
          const activeClass = page.slug === activeSlug ? "is-active" : "";
          return `<a class="${activeClass}" href="docs.html#page=${page.slug}">
            <span>${page.title}</span>
          </a>`;
        })
        .join("");
      return `<details class="docs-nav-section"${isOpen ? " open" : ""}>
        <summary>${section}</summary>
        <div class="docs-nav-links">${items}</div>
      </details>`;
    })
    .join("");
}

async function loadDoc(slug) {
  const page = DOC_PAGES.find((entry) => entry.slug === slug) || DOC_PAGES[0];
  const title = document.querySelector("#docs-title");
  const summary = document.querySelector("#docs-summary");
  const article = document.querySelector("#docs-article");

  if (!page || !article || !title || !summary) {
    return;
  }

  title.textContent = page.title;
  summary.textContent = page.summary;
  article.innerHTML = "<p>Loading documentation…</p>";

  try {
    const response = await fetch(`${page.path}?v=${DOC_CONTENT_VERSION}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${page.path}`);
    }
    const markdown = await response.text();
    article.innerHTML = renderMarkdown(markdown.replace(/^# .+\r?\n+/, ""));
    enhanceCodeBlocks(article);
    renderNav(document.querySelector("#docs-search")?.value || "");
  } catch (error) {
    article.innerHTML = `<p>Unable to load this document. ${
      error instanceof Error ? escapeHtml(error.message) : "Unknown error."
    }</p>`;
  }
}

function initDocsPage() {
  const search = document.querySelector("#docs-search");
  if (!search) {
    return;
  }

  renderNav();
  loadDoc(currentDocSlug());

  search.addEventListener("input", () => {
    renderNav(search.value);
  });

  window.addEventListener("hashchange", () => {
    renderNav(search.value);
    loadDoc(currentDocSlug());
  });

  if (!window.location.hash) {
    setCurrentDocSlug("getting-started");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  enhanceCodeBlocks();
  setupReveals();

  if (document.body.dataset.page === "docs") {
    initDocsPage();
  }
});
