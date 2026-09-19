// Example interactions only. PhoenixCSS does not ship a JavaScript runtime.
const dialog = document.getElementById("exampleModal");
const openDialog = document.getElementById("openModal");
const closeDialog = document.getElementById("closeModal");
const modalAction = document.getElementById("modalAction");

let dialogOpener;
openDialog.addEventListener("click", () => {
  dialogOpener = openDialog;
  dialog.showModal();
  closeDialog.focus();
});

closeDialog.addEventListener("click", () => dialog.close());
modalAction.addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => dialogOpener?.focus());

const navToggle = document.getElementById("exampleNavToggle");
const navMenu = document.getElementById("exampleNavMenu");
const compactNavigation = window.matchMedia("(max-width: 767px)");

function setNavigationOpen(open) {
  navMenu.hidden = !open;
  navToggle.setAttribute("aria-expanded", String(open));
}

function syncNavigation() {
  const compact = compactNavigation.matches;
  navToggle.hidden = !compact;
  setNavigationOpen(!compact);
}

navToggle.addEventListener("click", () => {
  setNavigationOpen(navMenu.hidden);
});

navMenu.addEventListener("click", (event) => {
  if (compactNavigation.matches && event.target.closest("a")) {
    setNavigationOpen(false);
  }
});

compactNavigation.addEventListener("change", syncNavigation);
syncNavigation();

const docsToggle = document.getElementById("menuToggle");
const docsSidebar = document.getElementById("sidebar");
const compactDocs = window.matchMedia("(max-width: 800px)");

function setDocsSidebarOpen(open) {
  docsSidebar.classList.toggle("active", open);
  docsSidebar.inert = compactDocs.matches && !open;
  docsToggle.setAttribute("aria-expanded", String(open));
}

function syncDocsSidebar() {
  const compact = compactDocs.matches;
  document.body.classList.toggle("docs-enhanced", compact);
  docsToggle.hidden = !compact;
  setDocsSidebarOpen(false);
}

docsToggle.addEventListener("click", () => {
  setDocsSidebarOpen(!docsSidebar.classList.contains("active"));
});

docsSidebar.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (compactDocs.matches && link) {
    setDocsSidebarOpen(false);
    const target = link.hash && document.getElementById(link.hash.slice(1));
    if (target) {
      target.tabIndex = -1;
      target.focus({ preventScroll: true });
    } else {
      docsToggle.focus();
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && docsSidebar.classList.contains("active")) {
    setDocsSidebarOpen(false);
    docsToggle.focus();
  }
});

compactDocs.addEventListener("change", syncDocsSidebar);
syncDocsSidebar();

for (const button of document.querySelectorAll("[data-copy-target]")) {
  button.addEventListener("click", async () => {
    const source = document.getElementById(button.dataset.copyTarget);
    try {
      await navigator.clipboard.writeText(source.textContent.trim());
      button.textContent = "Copied";
    } catch {
      button.textContent = "Select text";
    }
    window.setTimeout(() => {
      button.textContent = "Copy";
    }, 2000);
  });
}
