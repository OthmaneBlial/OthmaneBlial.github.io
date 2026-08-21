const menuToggle = document.querySelector("[data-menu-toggle]");
const siteNav = document.querySelector("[data-site-nav]");

if (menuToggle && siteNav) {
  const setMenu = (open) => {
    menuToggle.setAttribute("aria-expanded", String(open));
    siteNav.classList.toggle("open", open);
  };

  menuToggle.addEventListener("click", () => {
    setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
  });
  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) setMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });
}

for (const year of document.querySelectorAll("[data-year]")) {
  year.textContent = String(new Date().getFullYear());
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const temporary = document.createElement("textarea");
  temporary.value = text;
  temporary.setAttribute("readonly", "");
  temporary.style.position = "fixed";
  temporary.style.opacity = "0";
  document.body.append(temporary);
  temporary.select();
  document.execCommand("copy");
  temporary.remove();
}

for (const button of document.querySelectorAll("[data-copy]")) {
  button.addEventListener("click", async () => {
    const target = document.getElementById(button.dataset.copy || "");
    if (!target) return;
    const original =
      button.querySelector("span")?.textContent || button.textContent || "Copy";
    try {
      await copyText(target.textContent || "");
      button.classList.add("copied");
      if (button.querySelector("span"))
        button.querySelector("span").textContent = "Copied";
      else button.textContent = "Copied";
      window.setTimeout(() => {
        button.classList.remove("copied");
        if (button.querySelector("span"))
          button.querySelector("span").textContent = original;
        else button.textContent = original;
      }, 1_700);
    } catch {
      if (button.querySelector("span"))
        button.querySelector("span").textContent = "Copy failed";
      else button.textContent = "Copy failed";
    }
  });
}

const scenes = {
  movie: {
    name: "Movie Night",
    status: "Movie Night · deterministic browser-only preview",
    centerLabel: "HOME / LIVING ROOM",
    devices: [
      { name: "Living room TV", x: 0.49, y: 0.37 },
      { name: "Studio MacBook", x: 0.45, y: 0.69 },
      { name: "Home router", x: 0.31, y: 0.6 },
    ],
    flows: [
      {
        region: "US · AS2906",
        service: "Netflix Open Connect",
        org: "Netflix, Inc.",
        transport: "QUIC · HTTPS/3",
        device: "Living room TV",
        confidence: "99%",
        x: 0.81,
        y: 0.31,
        color: "mint",
      },
      {
        region: "SE · AS8403",
        service: "Spotify Edge",
        org: "Spotify AB",
        transport: "TCP · HTTPS",
        device: "Studio MacBook",
        confidence: "95%",
        x: 0.76,
        y: 0.68,
        color: "mint",
      },
      {
        region: "US · AS13335",
        service: "Public DNS",
        org: "Cloudflare, Inc.",
        transport: "UDP · DNS",
        device: "Home router",
        confidence: "100%",
        x: 0.63,
        y: 0.19,
        color: "amber",
      },
      {
        region: "US · AS2906",
        service: "Netflix Open Connect",
        org: "Netflix, Inc.",
        transport: "QUIC · HTTPS/3",
        device: "Living room TV",
        confidence: "97%",
        x: 0.88,
        y: 0.52,
        color: "mint",
      },
    ],
  },
  developer: {
    name: "Developer Laptop",
    status: "Developer Laptop · deterministic browser-only preview",
    centerLabel: "HOME / WORKROOM",
    devices: [
      { name: "Studio MacBook", x: 0.46, y: 0.42 },
      { name: "Build server", x: 0.5, y: 0.72 },
      { name: "Home router", x: 0.32, y: 0.61 },
    ],
    flows: [
      {
        region: "US · AS36459",
        service: "Git provider",
        org: "GitHub, Inc.",
        transport: "TCP · HTTPS",
        device: "Studio MacBook",
        confidence: "96%",
        x: 0.82,
        y: 0.28,
        color: "mint",
      },
      {
        region: "US · AS16509",
        service: "Container registry",
        org: "Cloud infrastructure",
        transport: "TCP · HTTPS",
        device: "Build server",
        confidence: "88%",
        x: 0.72,
        y: 0.72,
        color: "amber",
      },
      {
        region: "DE · AS24940",
        service: "Package mirror",
        org: "Hetzner Online",
        transport: "TCP · HTTPS",
        device: "Studio MacBook",
        confidence: "79%",
        x: 0.62,
        y: 0.2,
        color: "mint",
      },
      {
        region: "US · AS15169",
        service: "Public DNS",
        org: "Google LLC",
        transport: "UDP · DNS",
        device: "Home router",
        confidence: "100%",
        x: 0.88,
        y: 0.53,
        color: "mint",
      },
    ],
  },
  beacon: {
    name: "Regular Beacon",
    status: "Regular Beacon · low-confidence synthetic preview",
    centerLabel: "HOME / NIGHT MODE",
    devices: [
      { name: "Smart hub", x: 0.48, y: 0.41 },
      { name: "Security camera", x: 0.46, y: 0.7 },
      { name: "Home router", x: 0.31, y: 0.59 },
    ],
    flows: [
      {
        region: "DE · AS24940",
        service: "Possible VPS beacon",
        org: "Hetzner Online",
        transport: "TCP · TLS",
        device: "Smart hub",
        confidence: "62%",
        x: 0.82,
        y: 0.27,
        color: "danger",
      },
      {
        region: "US · AS13335",
        service: "Public DNS",
        org: "Cloudflare, Inc.",
        transport: "UDP · DNS",
        device: "Home router",
        confidence: "100%",
        x: 0.74,
        y: 0.7,
        color: "mint",
      },
      {
        region: "IE · AS16509",
        service: "Camera relay",
        org: "Cloud infrastructure",
        transport: "TCP · TLS",
        device: "Security camera",
        confidence: "71%",
        x: 0.62,
        y: 0.18,
        color: "amber",
      },
      {
        region: "DE · AS24940",
        service: "Possible VPS beacon",
        org: "Hetzner Online",
        transport: "TCP · TLS",
        device: "Smart hub",
        confidence: "62%",
        x: 0.88,
        y: 0.5,
        color: "danger",
      },
    ],
  },
};

const canvas = document.querySelector("#halo-demo");

if (canvas instanceof HTMLCanvasElement) {
  const context = canvas.getContext("2d", { alpha: false });
  const sceneButtons = [...document.querySelectorAll("[data-scene]")];
  const motionButton = document.querySelector("[data-motion-toggle]");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  let sceneKey = "movie";
  let paused = reducedMotion;
  let width = 1;
  let height = 1;
  let frozenTimestamp = 0;
  let pausedDuration = 0;
  let observationIndex = 0;
  let lastObservationAt = 0;

  const color = {
    mint: "#7be7cc",
    amber: "#efd49b",
    danger: "#dd8178",
  };

  const observationFields = {
    region: document.querySelector("[data-observation-region]"),
    service: document.querySelector("[data-observation-service]"),
    org: document.querySelector("[data-observation-org]"),
    transport: document.querySelector("[data-observation-transport]"),
    device: document.querySelector("[data-observation-device]"),
    confidence: document.querySelector("[data-observation-confidence]"),
    status: document.querySelector("[data-scene-status]"),
  };

  function setObservation(index) {
    const scene = scenes[sceneKey];
    const flow = scene.flows[index % scene.flows.length];
    observationFields.region.textContent = flow.region;
    observationFields.service.textContent = flow.service;
    observationFields.org.textContent = flow.org;
    observationFields.transport.textContent = flow.transport;
    observationFields.device.textContent = flow.device;
    observationFields.confidence.textContent = flow.confidence;
    observationFields.status.textContent = scene.status;
  }

  function setScene(nextScene) {
    if (!scenes[nextScene]) return;
    sceneKey = nextScene;
    observationIndex = 0;
    lastObservationAt = 0;
    setObservation(0);
    for (const button of sceneButtons) {
      const active = button.dataset.scene === nextScene;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    }
  }

  for (const button of sceneButtons) {
    button.addEventListener("click", () =>
      setScene(button.dataset.scene || "movie"),
    );
  }

  function updateMotionButton() {
    if (!(motionButton instanceof HTMLButtonElement)) return;
    const label = motionButton.querySelector("[data-motion-label]");
    motionButton.setAttribute("aria-pressed", String(paused));
    if (reducedMotion) {
      motionButton.disabled = true;
      if (label) label.textContent = "Reduced motion";
    } else if (label) {
      label.textContent = paused ? "Resume light" : "Pause light";
    }
  }

  motionButton?.addEventListener("click", () => {
    if (reducedMotion) return;
    if (paused) {
      pausedDuration += performance.now() - frozenTimestamp;
      paused = false;
    } else {
      frozenTimestamp = performance.now();
      paused = true;
    }
    updateMotionButton();
  });

  function resize() {
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    const bounds = canvas.getBoundingClientRect();
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function stableNumber(seed) {
    let hash = 2166136261;
    for (let index = 0; index < seed.length; index += 1) {
      hash ^= seed.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) / 4_294_967_295;
  }

  const stars = Array.from({ length: 100 }, (_, index) => ({
    x: stableNumber(`packet-x-${index}`),
    y: stableNumber(`halo-y-${index}`),
    size: 0.3 + stableNumber(`light-s-${index}`) * 0.8,
  }));

  function quadraticPoint(progress, start, control, end) {
    const inverse = 1 - progress;
    return {
      x:
        inverse * inverse * start.x +
        2 * inverse * progress * control.x +
        progress * progress * end.x,
      y:
        inverse * inverse * start.y +
        2 * inverse * progress * control.y +
        progress * progress * end.y,
    };
  }

  function draw(timestamp) {
    const scene = scenes[sceneKey];
    const motionTime = paused
      ? frozenTimestamp - pausedDuration
      : timestamp - pausedDuration;
    context.fillStyle = "#050807";
    context.fillRect(0, 0, width, height);

    const halo = context.createRadialGradient(
      width * 0.62,
      height * 0.49,
      0,
      width * 0.62,
      height * 0.49,
      Math.max(width, height) * 0.5,
    );
    halo.addColorStop(0, "rgba(31, 84, 69, 0.16)");
    halo.addColorStop(0.45, "rgba(13, 35, 29, 0.06)");
    halo.addColorStop(1, "rgba(5, 8, 7, 0)");
    context.fillStyle = halo;
    context.fillRect(0, 0, width, height);

    for (const star of stars) {
      context.fillStyle = "rgba(185, 218, 205, 0.16)";
      context.fillRect(star.x * width, star.y * height, star.size, star.size);
    }

    const center = {
      x: width < 860 ? width * 0.48 : width * 0.57,
      y: width < 860 ? height * 0.55 : height * 0.49,
    };

    context.save();
    context.strokeStyle = "rgba(123, 231, 204, 0.06)";
    context.lineWidth = 0.7;
    for (let ring = 1; ring <= 4; ring += 1) {
      context.beginPath();
      context.ellipse(
        center.x,
        center.y,
        ring * 42,
        ring * 27,
        -0.2,
        0,
        Math.PI * 2,
      );
      context.stroke();
    }
    context.restore();

    for (const [index, flow] of scene.flows.entries()) {
      const destination = { x: flow.x * width, y: flow.y * height };
      const curve = {
        x: (center.x + destination.x) / 2 + Math.sin(index * 2.1) * 80,
        y: Math.min(center.y, destination.y) - (90 + index * 18),
      };
      const flowColor = color[flow.color];

      context.save();
      context.globalCompositeOperation = "lighter";
      for (let trail = 0; trail < 5; trail += 1) {
        context.beginPath();
        context.moveTo(center.x + trail * 1.3, center.y + trail * 0.5);
        context.quadraticCurveTo(
          curve.x + trail * 3,
          curve.y - trail * 2,
          destination.x,
          destination.y,
        );
        context.strokeStyle = flowColor;
        context.globalAlpha = 0.07 + trail * 0.015;
        context.lineWidth = 0.6 + trail * 0.35;
        context.stroke();
      }

      const progress =
        (((motionTime / (3_200 + index * 310) + index * 0.23) % 1) + 1) % 1;
      const particle = quadraticPoint(progress, center, curve, destination);
      context.globalAlpha = 0.95;
      context.fillStyle = flowColor;
      context.shadowColor = flowColor;
      context.shadowBlur = 14;
      context.beginPath();
      context.arc(
        particle.x,
        particle.y,
        index % 2 === 0 ? 2.3 : 1.7,
        0,
        Math.PI * 2,
      );
      context.fill();

      context.globalAlpha = 0.65;
      context.shadowBlur = 18;
      context.beginPath();
      context.arc(destination.x, destination.y, 3.4, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }

    for (const [index, device] of scene.devices.entries()) {
      const angle = motionTime * (index % 2 ? -0.00005 : 0.00004) + index * 2.2;
      const radius = 56 + index * 36;
      const orbit = {
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius * 0.56,
      };
      context.save();
      context.strokeStyle = "rgba(123, 231, 204, 0.42)";
      context.fillStyle = "#07100d";
      context.lineWidth = 1;
      context.beginPath();
      context.arc(orbit.x, orbit.y, 5, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      if (width > 760) {
        context.fillStyle = "rgba(193, 207, 201, 0.54)";
        context.font = "500 8px Manrope, sans-serif";
        context.fillText(device.name.toUpperCase(), orbit.x + 10, orbit.y + 3);
      }
      context.restore();
    }

    const homeGlow = context.createRadialGradient(
      center.x,
      center.y,
      0,
      center.x,
      center.y,
      44,
    );
    homeGlow.addColorStop(0, "rgba(255, 247, 204, 0.98)");
    homeGlow.addColorStop(0.14, "rgba(239, 212, 155, 0.7)");
    homeGlow.addColorStop(1, "rgba(239, 212, 155, 0)");
    context.fillStyle = homeGlow;
    context.beginPath();
    context.arc(center.x, center.y, 44, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#f8efd3";
    context.beginPath();
    context.arc(center.x, center.y, 4.2, 0, Math.PI * 2);
    context.fill();

    if (!paused && timestamp - lastObservationAt > 3_000) {
      observationIndex = (observationIndex + 1) % scene.flows.length;
      setObservation(observationIndex);
      lastObservationAt = timestamp;
    }

    window.requestAnimationFrame(draw);
  }

  new ResizeObserver(resize).observe(canvas);
  resize();
  setScene("movie");
  updateMotionButton();
  if (reducedMotion) frozenTimestamp = 2_400;
  window.requestAnimationFrame(draw);
}

const searchInput = document.querySelector("[data-doc-search]");

if (searchInput instanceof HTMLInputElement) {
  const sections = [...document.querySelectorAll(".doc-section")];
  const searchStatus = document.querySelector("[data-search-status]");
  const noResults = document.querySelector("[data-no-results]");

  function filterDocumentation() {
    const query = searchInput.value.trim().toLocaleLowerCase();
    let visible = 0;
    for (const section of sections) {
      const haystack =
        `${section.dataset.title || ""} ${section.textContent || ""}`.toLocaleLowerCase();
      const match = !query || haystack.includes(query);
      section.hidden = !match;
      if (match) visible += 1;
    }
    if (searchStatus)
      searchStatus.textContent = `${visible} ${visible === 1 ? "section" : "sections"}`;
    if (noResults instanceof HTMLElement) noResults.hidden = visible !== 0;
  }

  searchInput.addEventListener("input", filterDocumentation);

  const tocLinks = [...document.querySelectorAll(".docs-toc a")];
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (first, second) =>
            first.boundingClientRect.top - second.boundingClientRect.top,
        )[0];
      if (!visible) return;
      for (const link of tocLinks) {
        if (link.getAttribute("href") === `#${visible.target.id}`)
          link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      }
    },
    { rootMargin: "-20% 0px -68% 0px", threshold: 0 },
  );
  for (const section of sections) observer.observe(section);
}
