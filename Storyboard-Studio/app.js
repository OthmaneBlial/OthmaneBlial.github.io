"use strict";

const slides = [
  {
    title: "The first-week gap",
    body: "New teammates need confidence and context before they can contribute meaningful work.",
    points: ["Make belonging visible", "Reduce uncertainty", "Build early momentum"],
  },
  {
    title: "Design the first 30 days",
    body: "A repeatable rhythm turns onboarding from a checklist into a shared experience.",
    points: ["Create a human welcome", "Pair guided practice", "Reflect on ownership"],
  },
  {
    title: "One shared signal",
    body: "Measure whether people feel equipped to make a useful contribution, not just whether tasks were assigned.",
    points: ["Ask early", "Look for behavior", "Improve the system"],
  },
];

let index = 0;
const byId = (id) => document.getElementById(id);

function renderSlide() {
  const slide = slides[index];
  byId("sampleNumber").textContent = String(index + 1).padStart(2, "0");
  byId("sampleAsideNumber").textContent = String(index + 1).padStart(2, "0");
  byId("sampleTitle").textContent = slide.title;
  byId("sampleAsideTitle").textContent = slide.title;
  byId("sampleBody").textContent = slide.body;
  byId("slideCounter").textContent = `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  const list = byId("samplePoints");
  list.replaceChildren(...slide.points.map((point) => {
    const item = document.createElement("li");
    item.textContent = point;
    return item;
  }));
}

if (byId("nextSlide")) {
  byId("nextSlide").addEventListener("click", () => { index = (index + 1) % slides.length; renderSlide(); });
  byId("previousSlide").addEventListener("click", () => { index = (index + slides.length - 1) % slides.length; renderSlide(); });
  renderSlide();
}

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy || "");
      const status = byId("copyStatus");
      if (status) status.textContent = "Command copied to your clipboard.";
      button.textContent = "Copied";
      window.setTimeout(() => { button.textContent = "Copy"; }, 1400);
    } catch {
      const status = byId("copyStatus");
      if (status) status.textContent = "Copy the command directly from the code block.";
    }
  });
});
