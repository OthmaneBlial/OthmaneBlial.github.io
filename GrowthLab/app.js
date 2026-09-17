"use strict";

// This website reads a published snapshot, never the visitor's local product data.
const gallery = Object.freeze({
  desktop: { src: "assets/candidate-desktop.jpg", width: 1280, height: 626, alt: "Actual desktop candidate preview with the Faster first success homepage and three onboarding steps.", caption: "Actual desktop view of a verified archived candidate source document." },
  failed: { src: "assets/candidate-failed.jpg", width: 1280, height: 626, alt: "Actual failed candidate preview: prominent text remains but the primary h1 heading is missing.", caption: "The deliberately failed candidate still has an inspectable source preview. Its missing h1 keeps it ineligible." },
  phone: { src: "assets/candidate-phone.jpg", width: 390, height: 844, alt: "Actual 390px phone dashboard showing a restricted preview of the archived Outcome-first candidate homepage.", caption: "Actual phone dashboard and archived-source preview. This documentation capture is not an automatic run screenshot." }
});

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((element) => { element.textContent = String(value); });
}

function replaceList(selector, values) {
  document.querySelectorAll(selector).forEach((list) => {
    const nodes = values.map((value) => {
      const item = document.createElement("li");
      item.textContent = value;
      return item;
    });
    list.replaceChildren(...nodes);
  });
}

function validStrings(values) {
  return Array.isArray(values) && values.length <= 30 && values.every((value) => typeof value === "string" && value.length <= 2000);
}

function validStatus(status) {
  return status && status.schemaVersion === 1
    && typeof status.stage === "string" && typeof status.milestone === "string"
    && typeof status.progressEstimate === "number" && Number.isFinite(status.progressEstimate)
    && status.progressEstimate >= 0 && status.progressEstimate <= 100
    && typeof status.updated === "string" && /^\d{4}-\d{2}-\d{2}$/.test(status.updated)
    && typeof status.validatedSourceCommit === "string" && /^[a-f0-9]{40}$/.test(status.validatedSourceCommit)
    && validStrings(status.delivered) && validStrings(status.pending)
    && Array.isArray(status.validation) && status.validation.length <= 60
    && status.validation.every((entry) => entry && typeof entry.name === "string" && typeof entry.detail === "string" && ["passed", "disabled", "unverified", "blocked", "pending"].includes(entry.status));
}

function renderStatus(status) {
  setText("[data-stage]", status.stage);
  setText("[data-milestone]", status.milestone);
  setText("[data-progress]", status.progressEstimate);
  const date = new Date(`${status.updated}T12:00:00Z`);
  const dateLabel = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date);
  setText("[data-updated]", dateLabel);
  document.querySelectorAll("time[data-updated]").forEach((element) => { element.dateTime = status.updated; });
  document.querySelectorAll("[data-progress-bar]").forEach((element) => { element.style.width = `${status.progressEstimate}%`; });
  document.querySelectorAll("[data-source-commit]").forEach((link) => {
    link.textContent = status.validatedSourceCommit.slice(0, 7);
    link.href = `https://github.com/OthmaneBlial/GrowthLab/commit/${status.validatedSourceCommit}`;
  });
  replaceList("[data-delivered]", status.delivered);
  replaceList("[data-pending]", status.pending);
  if (typeof status.provenance === "string") setText("[data-provenance]", status.provenance);
  document.querySelectorAll("[data-validation]").forEach((list) => {
    const nodes = status.validation.map((entry) => {
      const item = document.createElement("li");
      const name = document.createElement("span");
      const result = document.createElement("strong");
      const detail = document.createElement("p");
      name.textContent = entry.name;
      result.textContent = entry.status.charAt(0).toUpperCase() + entry.status.slice(1);
      if (entry.status !== "passed") result.classList.add("validation-disabled");
      detail.textContent = entry.detail;
      item.append(name, result, detail);
      return item;
    });
    list.replaceChildren(...nodes);
  });
  const release = status.release;
  if (release && release.published === true && typeof release.version === "string" && typeof release.url === "string") {
    const url = new URL(release.url);
    if (url.origin === "https://github.com" && url.pathname.startsWith("/OthmaneBlial/GrowthLab/releases/tag/")) {
      setText("[data-release-title]", `${release.version}${typeof release.platform === "string" ? ` · ${release.platform}` : ""}`);
      setText("[data-release-limitation]", typeof release.limitation === "string" ? release.limitation : "Inspect the release notes for its exact scope and platform limitations.");
      document.querySelectorAll("[data-release-link]").forEach((link) => { link.href = url.href; });
      document.querySelectorAll("[data-release]").forEach((element) => { element.hidden = false; });
    }
  }
  setText("#status-fetch-note", "Published progress snapshot loaded");
}

async function loadStatus() {
  try {
    const response = await fetch(new URL("status.json", window.location.href), { cache: "no-store", credentials: "same-origin" });
    if (!response.ok) throw new Error("Status snapshot unavailable");
    const status = await response.json();
    if (!validStatus(status)) throw new Error("Status snapshot format unavailable");
    renderStatus(status);
  } catch {
    // Static copy remains useful when offline or when a snapshot cannot be read.
    setText("#status-fetch-note", "Showing embedded snapshot; published status could not be refreshed");
  }
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("Copy unavailable");
}

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const source = document.getElementById(button.dataset.copy);
    if (!source) return;
    const originalLabel = button.textContent;
    button.disabled = true;
    try {
      await copyText(source.textContent.trim());
      button.textContent = "Copied ✓";
      setText("#copy-feedback", "Command copied to clipboard.");
    } catch {
      button.textContent = "Select text";
      setText("#copy-feedback", "Clipboard unavailable. Select and copy the command text directly.");
    }
    window.setTimeout(() => { button.textContent = originalLabel; button.disabled = false; }, 1800);
  });
});

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.getElementById("navigation");
function closeMenu() {
  if (!menuToggle || !navigation) return;
  navigation.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
}
if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(open));
    navigation.classList.toggle("is-open", open);
  });
  navigation.querySelectorAll("a").forEach((link) => { link.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuToggle.focus();
    }
  });
}

document.querySelectorAll("[data-gallery]").forEach((button) => {
  button.addEventListener("click", () => {
    const choice = gallery[button.dataset.gallery];
    const image = document.getElementById("preview-image");
    const opener = document.getElementById("preview-open");
    if (!choice || !image || !opener) return;
    image.src = choice.src;
    image.alt = choice.alt;
    image.width = choice.width;
    image.height = choice.height;
    opener.dataset.lightbox = choice.src;
    opener.dataset.caption = choice.caption;
    document.querySelector(".gallery-stage").classList.toggle("is-phone", button.dataset.gallery === "phone");
    document.querySelectorAll("[data-gallery]").forEach((item) => { item.setAttribute("aria-pressed", String(item === button)); });
    setText("#gallery-caption", choice.caption);
  });
});

const imageDialog = document.getElementById("image-dialog");
let previousFocus = null;
if (imageDialog) {
  document.querySelectorAll("[data-lightbox]").forEach((opener) => {
    opener.addEventListener("click", () => {
      const image = document.getElementById("dialog-image");
      const sourceImage = opener.querySelector("img");
      image.src = opener.dataset.lightbox;
      image.alt = sourceImage ? sourceImage.alt : opener.dataset.caption;
      setText("#image-dialog-caption", opener.dataset.caption);
      imageDialog.classList.toggle("is-phone", opener.dataset.lightbox === gallery.phone.src);
      previousFocus = opener;
      imageDialog.showModal();
      imageDialog.querySelector(".dialog-close").focus();
    });
  });
  imageDialog.querySelector(".dialog-close").addEventListener("click", () => { imageDialog.close(); });
  imageDialog.addEventListener("click", (event) => {
    const box = imageDialog.getBoundingClientRect();
    if (event.target === imageDialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) imageDialog.close();
  });
  imageDialog.addEventListener("close", () => { if (previousFocus) previousFocus.focus(); });
}

const docsSearch = document.getElementById("docs-search");
const docsLinks = [...document.querySelectorAll(".docs-nav a")];
if (docsSearch) {
  docsSearch.addEventListener("input", () => {
    const query = docsSearch.value.trim().toLowerCase();
    let matches = 0;
    docsLinks.forEach((link) => {
      const match = `${link.textContent} ${link.dataset.search}`.toLowerCase().includes(query);
      link.hidden = !match;
      if (match) matches += 1;
    });
    document.querySelector(".docs-no-results").hidden = matches > 0;
  });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting);
      if (!visible.length) return;
      const current = visible[0].target.id;
      docsLinks.forEach((link) => {
        const active = link.hash === `#${current}`;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "location"); else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-10% 0px -65% 0px" });
    document.querySelectorAll(".doc-section").forEach((section) => { observer.observe(section); });
  }
}

void loadStatus();
