(() => {
  "use strict";

  const Core = globalThis.DecisionReceiptVerifier;
  const fixture = globalThis.WEB_VERIFIER_FIXTURES?.tampered;
  const state = {
    startedAt: null,
    elapsedMs: 0,
    timer: null,
    expectedIssue: null,
    answered: false
  };

  const byId = (id) => document.getElementById(id);
  const formatTime = (elapsedMs) => {
    const safe = Math.max(0, elapsedMs);
    const minutes = Math.floor(safe / 60_000);
    const seconds = Math.floor((safe % 60_000) / 1_000);
    const tenths = Math.floor((safe % 1_000) / 100);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;
  };

  function announce(message) {
    byId("challenge-announcer").textContent = message;
  }

  function updateTimer() {
    if (state.startedAt === null) return;
    state.elapsedMs = performance.now() - state.startedAt;
    byId("challenge-timer").textContent = formatTime(state.elapsedMs);
    if (state.elapsedMs >= 60_000) byId("timer-state").textContent = "OVERTIME";
  }

  function stopTimer() {
    updateTimer();
    window.clearInterval(state.timer);
    state.timer = null;
    byId("timer-state").textContent = "LOCKED";
  }

  function exactFile(issue) {
    const path = String(issue?.path || "").replace(/^\/files\//, "").replace(/^\//, "");
    if (path && path !== "integrity-manifest.json") return path;
    const match = String(issue?.message || "").match(/[A-Za-z0-9_.-]+\/[A-Za-z0-9_./-]+/);
    return match?.[0] || "evidence/source.md";
  }

  function publicResultText(correct) {
    const seconds = (state.elapsedMs / 1_000).toFixed(1);
    const lead = correct ? `I caught the changed evidence file in ${seconds}s.` : `The local verifier caught what I missed in ${seconds}s.`;
    return `${lead} ${exactFile(state.expectedIssue)} failed SHA-256 in the 60-second Decision Receipt challenge: https://othmaneblial.github.io/web-task-agent/challenge.html`;
  }

  async function copyResult() {
    const text = byId("copy-result").dataset.result || "";
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.append(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    byId("copy-result").textContent = "Result copied";
  }

  function answer(event) {
    if (state.answered || !state.expectedIssue) return;
    state.answered = true;
    stopTimer();
    const selected = event.currentTarget.dataset.answer;
    const correct = selected === state.expectedIssue.code;
    document.querySelectorAll("[data-answer]").forEach((button) => {
      button.disabled = true;
      button.classList.toggle("is-correct", button.dataset.answer === state.expectedIssue.code);
      button.classList.toggle("is-selected-wrong", button === event.currentTarget && !correct);
    });

    const seconds = (state.elapsedMs / 1_000).toFixed(1);
    const result = byId("challenge-result");
    result.hidden = false;
    result.classList.toggle("is-correct", correct);
    result.classList.toggle("is-missed", !correct);
    byId("result-kicker").textContent = correct ? `CAUGHT IN ${seconds} SECONDS` : `LOCAL VERIFIER · ${seconds} SECONDS`;
    byId("result-heading").textContent = correct ? "You found the broken boundary." : "Plausible is not the same as intact.";
    byId("result-summary").textContent = correct
      ? "The receipt still reads coherently, but its current evidence bytes no longer match the signed-off manifest."
      : "Your answer described a possible review concern, but the deterministic failure is byte-level integrity.";
    byId("result-code").textContent = state.expectedIssue.code;
    byId("result-file").textContent = exactFile(state.expectedIssue);
    byId("result-detail").textContent = state.expectedIssue.message;
    byId("copy-result").dataset.result = publicResultText(correct);
    announce(`${correct ? "Correct" : "Not this time"}. The local verifier found ${state.expectedIssue.code} in ${exactFile(state.expectedIssue)}.`);
    result.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
  }

  function start() {
    if (!state.expectedIssue) {
      announce("The local verifier is not ready. Reload this static page and try again.");
      return;
    }
    state.answered = false;
    state.elapsedMs = 0;
    state.startedAt = performance.now();
    byId("challenge-case").hidden = false;
    byId("challenge-result").hidden = true;
    byId("challenge-start").disabled = true;
    byId("challenge-start").textContent = "Clock running";
    byId("timer-state").textContent = "RUNNING";
    document.querySelectorAll("[data-answer]").forEach((button) => {
      button.disabled = false;
      button.classList.remove("is-correct", "is-selected-wrong");
    });
    window.clearInterval(state.timer);
    state.timer = window.setInterval(updateTimer, 100);
    updateTimer();
    announce("Clock running. Inspect the three files and choose one answer.");
    byId("challenge-case").scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }

  function reset() {
    window.clearInterval(state.timer);
    state.timer = null;
    state.startedAt = null;
    state.elapsedMs = 0;
    state.answered = false;
    byId("challenge-timer").textContent = "00:00.0";
    byId("timer-state").textContent = "READY";
    byId("challenge-start").disabled = false;
    byId("challenge-start").textContent = "Start the clock";
    byId("challenge-case").hidden = true;
    byId("challenge-result").hidden = true;
    byId("copy-result").textContent = "Copy my result";
    byId("challenge-start").focus();
  }

  async function setup() {
    if (!Core || !fixture) {
      byId("challenge-start").disabled = true;
      byId("timer-state").textContent = "UNAVAILABLE";
      return;
    }
    const verification = await Core.verifyReceiptBundle(fixture.files);
    state.expectedIssue = verification.issues.find((issue) => issue.code === "integrity_hash_mismatch") || null;
    if (!state.expectedIssue) {
      byId("challenge-start").disabled = true;
      byId("timer-state").textContent = "FIXTURE DRIFT";
      return;
    }
    byId("challenge-start").addEventListener("click", start);
    byId("challenge-reset").addEventListener("click", reset);
    byId("copy-result").addEventListener("click", copyResult);
    document.querySelectorAll("[data-answer]").forEach((button) => button.addEventListener("click", answer));
  }

  setup();
})();
