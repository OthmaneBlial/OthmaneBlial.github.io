const DOC_PAGES = [
  {
    slug: "platform",
    section: "Guides",
    title: "Platform",
    summary: "The finished local research system in one concise page.",
    path: "content/platform.md"
  },
  {
    slug: "overview",
    section: "Guides",
    title: "Overview",
    summary: "What the project is, what it does today, and who it is for.",
    path: "content/overview.md"
  },
  {
    slug: "getting-started",
    section: "Guides",
    title: "Getting Started",
    summary: "Environment, install, first run, and where outputs land.",
    path: "content/getting-started.md"
  },
  {
    slug: "pipeline-and-storage",
    section: "Guides",
    title: "Pipeline And Storage",
    summary: "Search, fetch, extract, synthesize, evidence storage, and reuse.",
    path: "content/pipeline-and-storage.md"
  },
  {
    slug: "workflows",
    section: "Guides",
    title: "Workflow Templates",
    summary: "How the built-in workflow templates and presets are shaped.",
    path: "content/workflows.md"
  },
  {
    slug: "cli-reference",
    section: "Reference",
    title: "CLI Reference",
    summary: "Top-level command families, common commands, and output conventions.",
    path: "content/cli-reference.md"
  },
  {
    slug: "test-suite-map",
    section: "Reference",
    title: "Test Suite Map",
    summary: "Product surfaces and the tests that cover them.",
    path: "content/test-suite-map.md"
  },
  {
    slug: "privacy",
    section: "Operations",
    title: "Privacy And Source Acquisition",
    summary: "What stays local, what a live job can send, and the source boundaries enforced before browser work.",
    path: "content/privacy.md"
  },
  {
    slug: "project-charter",
    section: "Reference",
    title: "Project Charter",
    summary: "North star, vocabulary, architecture map, maintenance rules, and quality gate.",
    path: "content/project-charter.md"
  },
  {
    slug: "queue-worker-controls",
    section: "Operations",
    title: "Queue, Worker, And Controls",
    summary: "Queued execution, worker mode, pause, cancel, resume, retry, rerun, and logs.",
    path: "content/queue-worker-controls.md"
  },
  {
    slug: "api-dashboard",
    section: "Operations",
    title: "API And Dashboard",
    summary: "Management server endpoints, control room behavior, and live event streams.",
    path: "content/api-dashboard.md"
  },
  {
    slug: "examples",
    section: "Use Cases",
    title: "Examples",
    summary: "Concrete operator scenarios built from the current repo commands and workflows.",
    path: "content/examples.md"
  },
  {
    slug: "project-layout",
    section: "Reference",
    title: "Project Layout",
    summary: "Key source files and where responsibilities live in the codebase.",
    path: "content/project-layout.md"
  },
  {
    slug: "testing-and-hardening",
    section: "Reference",
    title: "Testing And Hardening",
    summary: "Current automated coverage and what remains to harden the platform.",
    path: "content/testing-and-hardening.md"
  },
  {
    slug: "repo-readme",
    section: "Repo Sources",
    title: "Repo README",
    summary: "Copied repository README for offline use inside the site.",
    path: "content/repo-readme.md"
  },
  {
    slug: "repo-roadmap",
    section: "Repo Sources",
    title: "Repo Roadmap",
    summary: "Copied macro roadmap from the repository.",
    path: "content/repo-roadmap.md"
  },
  {
    slug: "example-android-opportunity",
    section: "Repo Sources",
    title: "Android Workflow Example",
    summary: "Copied workflow example from the repository.",
    path: "content/example-android-opportunity.md"
  },
  {
    slug: "example-article-research",
    section: "Repo Sources",
    title: "Article Workflow Example",
    summary: "Copied workflow example from the repository.",
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
  return params.get("page") || "overview";
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
      const items = pages
        .map((page) => {
          const activeClass = page.slug === activeSlug ? "is-active" : "";
          return `<a class="${activeClass}" href="docs.html#page=${page.slug}">
            <span>${page.title}</span>
            <small>${page.summary}</small>
          </a>`;
        })
        .join("");
      return `<div class="docs-nav-section">
        <p class="docs-nav-label">${section}</p>
        ${items}
      </div>`;
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
    const response = await fetch(page.path);
    if (!response.ok) {
      throw new Error(`Failed to load ${page.path}`);
    }
    const markdown = await response.text();
    article.innerHTML = renderMarkdown(markdown);
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
    setCurrentDocSlug("overview");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  enhanceCodeBlocks();
  setupReveals();

  if (document.body.dataset.page === "docs") {
    initDocsPage();
  }
});
