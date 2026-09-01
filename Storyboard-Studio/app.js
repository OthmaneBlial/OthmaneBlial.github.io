"use strict";

const slides = [
  {
    title: "Name the decision",
    body: "Make the choice explicit before visual polish can obscure it.",
    points: ["One decision", "One audience", "One desired outcome"],
  },
  {
    title: "Expose the trade-off",
    body: "The Narrative Doctor keeps options, missing evidence, and unresolved gaps visible for review.",
    points: ["Compare options", "Challenge claims", "Assign ownership"],
  },
  {
    title: "Carry the proof",
    body: "Export the reviewed story as native PowerPoint plus a receipt whose hashes can be checked locally.",
    points: ["Editable PPTX", "Diffable story", "Verifiable receipt"],
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
