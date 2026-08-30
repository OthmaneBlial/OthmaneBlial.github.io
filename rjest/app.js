const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".site-nav");
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    navigation.classList.toggle("is-open", open);
  });

  navigation.addEventListener("click", (event) => {
    if (!event.target.closest("a")) return;
    menuButton.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  });
}

const matrix = document.querySelector(".scenario-grid");
if (matrix) {
  for (let index = 0; index < 30; index += 1) {
    const cell = document.createElement("span");
    cell.className = "scenario-cell";
    cell.style.animationDelay = reduceMotion
      ? "0ms"
      : String(index * 18) + "ms";
    cell.setAttribute("aria-hidden", "true");
    matrix.append(cell);
  }
}

const revealTargets = document.querySelectorAll(".reveal");
if (reduceMotion || !("IntersectionObserver" in window)) {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  revealTargets.forEach((target) => observer.observe(target));
}

const numberFormatter = new Intl.NumberFormat("en-US");
const counters = document.querySelectorAll(".count-up");
const animateCounter = (target) => {
  const total = Number(target.dataset.count);
  if (!Number.isFinite(total) || reduceMotion) {
    target.textContent = numberFormatter.format(total);
    return;
  }

  const start = performance.now();
  const duration = Math.min(1400, 700 + Math.sqrt(total) * 8);
  const tick = (current) => {
    const elapsed = Math.min(1, (current - start) / duration);
    const eased = 1 - Math.pow(1 - elapsed, 3);
    target.textContent = numberFormatter.format(Math.round(total * eased));
    if (elapsed < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

if ("IntersectionObserver" in window && !reduceMotion) {
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        countObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.7 }
  );
  counters.forEach((counter) => countObserver.observe(counter));
} else {
  counters.forEach(animateCounter);
}

document.querySelectorAll(".copy-button").forEach((button) => {
  button.addEventListener("click", async () => {
    const original = button.textContent;
    try {
      await navigator.clipboard.writeText(button.dataset.copy || "");
      button.textContent = "Copied";
    } catch {
      button.textContent = "Select commands";
    }
    window.setTimeout(() => {
      button.textContent = original;
    }, 1800);
  });
});

const progress = document.querySelector(".progress-line span");
const updateProgress = () => {
  if (!progress) return;
  const available = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = available > 0 ? Math.min(1, window.scrollY / available) : 0;
  progress.style.transform = "scaleX(" + ratio + ")";
};
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());
