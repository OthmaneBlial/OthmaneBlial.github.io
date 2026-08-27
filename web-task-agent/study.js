(() => {
  "use strict";

  const materials = window.WEB_TASK_AGENT_REVIEWER_STUDY;
  const byId = (id) => document.getElementById(id);
  const setupPanel = byId("setup-panel");
  const trialPanel = byId("trial-panel");
  const finishPanel = byId("finish-panel");
  const announcer = byId("study-announcer");
  const state = { currentTrial: 0, trialStartedAt: null, timerHandle: null, trials: [] };

  function announce(message) {
    announcer.textContent = message;
  }

  function participantId() {
    const bytes = new Uint8Array(4);
    crypto.getRandomValues(bytes);
    return `p-${Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("")}`;
  }

  function selected(name) {
    return document.querySelector(`input[name="${name}"]:checked`);
  }

  function trialAssignment() {
    const group = selected("orderGroup")?.value || "AB";
    return materials.assignments.groups[group][state.currentTrial];
  }

  function secondsSinceStart() {
    if (!state.trialStartedAt) return 0;
    return Math.max(0, Math.floor((Date.now() - Date.parse(state.trialStartedAt)) / 1000));
  }

  function renderTimer() {
    const seconds = secondsSinceStart();
    byId("trial-timer").textContent = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  }

  function base64Bytes(value) {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return bytes;
  }

  function downloadBlob(filename, content, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  function resetTrialForm() {
    byId("trial-form").reset();
    byId("trial-abandoned").checked = false;
  }

  function renderTrial() {
    const assignment = trialAssignment();
    const studyCase = materials.cases[assignment.caseId];
    const isReceipt = assignment.condition === "receipt";
    byId("trial-position").textContent = `TRIAL ${state.currentTrial + 1} / 2`;
    byId("trial-condition").textContent = isReceipt ? "DECISION RECEIPT" : "MARKDOWN ONLY";
    byId("trial-condition").classList.toggle("is-receipt", isReceipt);
    byId("trial-title").textContent = studyCase.title;
    byId("trial-question").textContent = studyCase.question;
    byId("trial-case-mark").textContent = assignment.caseId.endsWith("a") ? "A" : "B";
    byId("material-title").textContent = isReceipt ? "Verifiable receipt bundle" : "Standalone Markdown report";
    byId("material-mode-note").textContent = isReceipt ? "valid ZIP + controlled tamper" : "no manifest available";
    byId("markdown-material").hidden = isReceipt;
    byId("receipt-material").hidden = !isReceipt;
    byId("markdown-material").textContent = studyCase.report;
    resetTrialForm();
    state.trialStartedAt = new Date().toISOString();
    clearInterval(state.timerHandle);
    renderTimer();
    state.timerHandle = setInterval(renderTimer, 1000);
    trialPanel.hidden = false;
    trialPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    announce(`Trial ${state.currentTrial + 1} started in ${isReceipt ? "Decision Receipt" : "Markdown-only"} condition.`);
  }

  function currentAnswers(abandoned) {
    if (abandoned) {
      return { supportingEvidenceId: null, contradictedClaimId: null, staleSourceId: null, tamperResult: null };
    }
    return {
      supportingEvidenceId: byId("answer-supporting").value.trim(),
      contradictedClaimId: byId("answer-contradicted").value.trim(),
      staleSourceId: byId("answer-stale").value.trim(),
      tamperResult: byId("answer-tamper").value.trim()
    };
  }

  function validateTrial() {
    const abandoned = byId("trial-abandoned").checked;
    const answers = currentAnswers(abandoned);
    const confidence = selected("confidence");
    if (!confidence) {
      announce("Choose a confidence score before completing the trial.");
      return null;
    }
    if (!abandoned && Object.values(answers).some((answer) => !answer)) {
      announce("Complete all four exact-answer tasks, or mark the trial abandoned.");
      return null;
    }
    const friction = byId("trial-friction").value.split("\n").map((item) => item.trim()).filter(Boolean);
    if (friction.length > 10 || friction.some((item) => item.length > 300)) {
      announce("Friction is limited to 10 lines of 300 characters each.");
      return null;
    }
    return { abandoned, answers, confidence: Number(confidence.value), friction };
  }

  function renderExportSummary() {
    const group = selected("orderGroup")?.value || "AB";
    const completed = state.trials.filter((trial) => !trial.abandoned).length;
    byId("export-summary").replaceChildren(...[
      ["Anonymous ID", byId("participant-id").value],
      ["Order", group],
      ["Completed", `${completed}/2 trials`]
    ].map(([label, value]) => {
      const card = document.createElement("div");
      card.className = "summary-card";
      const labelNode = document.createElement("span");
      const valueNode = document.createElement("strong");
      labelNode.textContent = label;
      valueNode.textContent = value;
      card.append(labelNode, valueNode);
      return card;
    }));
  }

  function responsePayload() {
    const publicQuote = byId("consent-quote").checked;
    const quote = byId("publication-quote").value.trim();
    return {
      schemaVersion: 1,
      studyVersion: materials.studyVersion,
      fixture: false,
      participantId: byId("participant-id").value,
      orderGroup: selected("orderGroup")?.value || "AB",
      participantRole: byId("participant-role").value,
      priorFamiliarity: byId("prior-familiarity").value,
      consent: {
        participation: true,
        anonymizedMeasures: byId("consent-measures").checked,
        publishAnonymizedRow: byId("consent-row").checked,
        publicQuote,
        identityAttribution: false,
        recordedAt: new Date().toISOString()
      },
      trials: state.trials,
      criticalFeedback: byId("critical-feedback").value.trim(),
      ...(publicQuote && quote ? { quoteForPublication: quote } : {})
    };
  }

  function startStudy(event) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    setupPanel.hidden = true;
    state.currentTrial = 0;
    state.trials = [];
    renderTrial();
  }

  function completeTrial(event) {
    event.preventDefault();
    const result = validateTrial();
    if (!result) return;
    const assignment = trialAssignment();
    const startedMilliseconds = Date.parse(state.trialStartedAt);
    const finishedAt = new Date(Math.max(Date.now(), startedMilliseconds + 1)).toISOString();
    state.trials.push({
      caseId: assignment.caseId,
      condition: assignment.condition,
      startedAt: state.trialStartedAt,
      finishedAt,
      answers: result.answers,
      confidence: result.confidence,
      friction: result.friction,
      abandoned: result.abandoned
    });
    clearInterval(state.timerHandle);
    state.currentTrial += 1;
    if (state.currentTrial < 2) {
      renderTrial();
      return;
    }
    trialPanel.hidden = true;
    finishPanel.hidden = false;
    renderExportSummary();
    finishPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    announce("Both trials are recorded locally. Add critical feedback and export the anonymous JSON response.");
  }

  function receiptDownload(tampered) {
    const assignment = trialAssignment();
    const studyCase = materials.cases[assignment.caseId];
    const bytes = base64Bytes(tampered ? studyCase.tamperedReceiptZipBase64 : studyCase.receiptZipBase64);
    const filename = tampered ? studyCase.tamperedFilename : studyCase.receiptFilename;
    downloadBlob(filename, bytes, "application/zip");
    announce(`${filename} downloaded locally.`);
  }

  byId("participant-id").value = participantId();
  byId("regenerate-id").addEventListener("click", () => {
    byId("participant-id").value = participantId();
    announce("A new anonymous participant ID was generated in this tab.");
  });
  byId("consent-measures").addEventListener("change", (event) => {
    byId("consent-row").disabled = !event.currentTarget.checked;
    if (!event.currentTarget.checked) byId("consent-row").checked = false;
  });
  byId("consent-quote").addEventListener("change", (event) => {
    byId("publication-quote").disabled = !event.currentTarget.checked;
    if (!event.currentTarget.checked) byId("publication-quote").value = "";
  });
  byId("trial-abandoned").addEventListener("change", (event) => {
    ["answer-supporting", "answer-contradicted", "answer-stale", "answer-tamper"].forEach((id) => {
      byId(id).disabled = event.currentTarget.checked;
    });
  });
  byId("setup-form").addEventListener("submit", startStudy);
  byId("trial-form").addEventListener("submit", completeTrial);
  byId("download-valid-receipt").addEventListener("click", () => receiptDownload(false));
  byId("download-tampered-receipt").addEventListener("click", () => receiptDownload(true));
  byId("download-response").addEventListener("click", () => {
    if (!byId("critical-feedback").reportValidity()) {
      announce("Add critical feedback before exporting the response.");
      return;
    }
    const payload = responsePayload();
    downloadBlob(`${payload.participantId}-reviewer-study.json`, `${JSON.stringify(payload, null, 2)}\n`, "application/json");
    announce("Anonymous response JSON downloaded. Nothing was submitted by this page.");
  });
  byId("restart-study").addEventListener("click", () => window.location.reload());

  if (!materials || materials.studyVersion !== "1.0.0") {
    announce("Study materials are unavailable or use an unsupported version.");
    byId("setup-form").querySelector("button[type=submit]").disabled = true;
  }
})();
