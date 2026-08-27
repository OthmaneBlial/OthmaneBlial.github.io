(() => {
  "use strict";

  const Core = globalThis.DecisionReceiptVerifier;
  const fixtures = globalThis.WEB_VERIFIER_FIXTURES || {};
  const decoder = new TextDecoder();
  const state = { primary: null, comparison: null };
  const MAX_FILES = 500;
  const MAX_FILE_BYTES = 10 * 1024 * 1024;
  const MAX_TOTAL_BYTES = 50 * 1024 * 1024;

  const byId = (id) => document.getElementById(id);
  const announcer = byId("verifier-announcer");

  function element(tag, className, text) {
    const item = document.createElement(tag);
    if (className) item.className = className;
    if (text !== undefined) item.textContent = String(text);
    return item;
  }

  function announce(message) {
    if (announcer) announcer.textContent = message;
  }

  function safePath(value) {
    if (!value || value.includes("\\") || value.startsWith("/") || /^[a-zA-Z]:/.test(value)) return false;
    return !value.split("/").some((part) => !part || part === "." || part === "..");
  }

  function stripCommonRoot(bundle) {
    const entries = Object.entries(bundle);
    const roots = new Set(entries.map(([name]) => name.split("/")[0]));
    if (roots.size !== 1 || entries.some(([name]) => !name.includes("/"))) return bundle;
    return Object.fromEntries(entries.map(([name, value]) => [name.slice(name.indexOf("/") + 1), value]));
  }

  function toText(value) {
    if (typeof value === "string") return value;
    if (value instanceof Uint8Array) return decoder.decode(value);
    return decoder.decode(new Uint8Array(value));
  }

  function previewText(value, limit = 1200) {
    const text = String(value || "");
    return text.length > limit ? `${text.slice(0, limit)}\n… [preview truncated locally]` : text;
  }

  async function readFileEntries(entries) {
    if (entries.length > MAX_FILES) throw new Error(`Folder exceeds the ${MAX_FILES}-file limit.`);
    const bundle = {};
    let total = 0;
    for (const entry of entries) {
      const relative = String(entry.path || entry.file.webkitRelativePath || entry.file.name).replace(/^\.\//, "");
      if (!safePath(relative)) throw new Error(`Folder contains an unsafe path: ${relative}.`);
      if (entry.file.size > MAX_FILE_BYTES) throw new Error(`File exceeds the 10 MB limit: ${relative}.`);
      total += entry.file.size;
      if (total > MAX_TOTAL_BYTES) throw new Error("Folder exceeds the 50 MB total limit.");
      bundle[relative] = new Uint8Array(await entry.file.arrayBuffer());
    }
    return stripCommonRoot(bundle);
  }

  function readDirectoryBatch(reader) {
    return new Promise((resolve, reject) => reader.readEntries(resolve, reject));
  }

  function readEntryFile(entry) {
    return new Promise((resolve, reject) => entry.file(resolve, reject));
  }

  async function walkDroppedEntry(entry, parent = "") {
    const relative = parent ? `${parent}/${entry.name}` : entry.name;
    if (entry.isFile) return [{ file: await readEntryFile(entry), path: relative }];
    if (!entry.isDirectory) return [];
    const reader = entry.createReader();
    const children = [];
    while (true) {
      const batch = await readDirectoryBatch(reader);
      if (batch.length === 0) break;
      for (const child of batch) children.push(...await walkDroppedEntry(child, relative));
      if (children.length > MAX_FILES) throw new Error(`Folder exceeds the ${MAX_FILES}-file limit.`);
    }
    return children;
  }

  async function droppedFileEntries(dataTransfer) {
    const items = Array.from(dataTransfer.items || []);
    const webkitEntries = items.map((item) => item.webkitGetAsEntry?.()).filter(Boolean);
    if (webkitEntries.length > 0) {
      const output = [];
      for (const entry of webkitEntries) output.push(...await walkDroppedEntry(entry));
      return output;
    }
    return Array.from(dataTransfer.files || []).map((file) => ({ file, path: file.webkitRelativePath || file.name }));
  }

  async function bundleFromFiles(entries) {
    if (entries.length === 1 && entries[0].file.name.toLowerCase().endsWith(".zip")) {
      announce("Reading ZIP locally…");
      return Core.unpackReceiptZip(await entries[0].file.arrayBuffer());
    }
    announce("Reading receipt folder locally…");
    return readFileEntries(entries);
  }

  async function structuralReceipt(bundle) {
    const raw = bundle["receipt.json"];
    if (raw === undefined) return null;
    try {
      const result = Core.validateDecisionReceipt(JSON.parse(toText(raw)));
      return result.receipt;
    } catch {
      return null;
    }
  }

  async function receiptState(name, bundle) {
    const verification = await Core.verifyReceiptBundle(bundle);
    const receipt = verification.receipt || await structuralReceipt(bundle);
    const snapshotHashes = {};
    if (receipt) {
      for (const source of receipt.sources) {
        if (source.snapshotPath && bundle[source.snapshotPath] !== undefined) {
          snapshotHashes[source.snapshotPath] = await Core.sha256Hex(bundle[source.snapshotPath]);
        }
      }
    }
    return { name, bundle, verification, receipt, snapshotHashes };
  }

  function ageInDays(value) {
    if (!value) return null;
    const timestamp = Date.parse(value);
    if (!Number.isFinite(timestamp)) return null;
    return Math.max(0, Math.floor((Date.now() - timestamp) / 86_400_000));
  }

  function freshnessThreshold() {
    const value = Number(byId("freshness-days")?.value || 180);
    return Number.isFinite(value) ? Math.min(3650, Math.max(1, Math.floor(value))) : 180;
  }

  function freshnessSummary(receipt) {
    const threshold = freshnessThreshold();
    const ages = receipt.sources.map((source) => ageInDays(source.collectedAt));
    return {
      stale: ages.filter((age) => age !== null && age > threshold).length,
      unknown: ages.filter((age) => age === null).length
    };
  }

  function metric(value, label) {
    const card = element("div", "result-metric");
    card.append(element("strong", "", value), element("span", "", label));
    return card;
  }

  function renderMetrics(current) {
    const target = byId("result-metrics");
    if (!target) return;
    target.replaceChildren();
    const receipt = current.receipt;
    const statuses = { supported: 0, contradicted: 0, insufficient: 0 };
    receipt?.claims.forEach((claim) => { if (claim.status in statuses) statuses[claim.status] += 1; });
    const freshness = receipt ? freshnessSummary(receipt) : { stale: 0, unknown: 0 };
    target.append(
      metric(current.verification.checkedFiles, "files checked"),
      metric(receipt ? `v${receipt.specVersion}` : "—", "spec"),
      metric(statuses.supported, "supported"),
      metric(statuses.contradicted + statuses.insufficient, "needs review"),
      metric(freshness.stale || freshness.unknown, freshness.stale ? "stale sources" : "unknown dates")
    );
  }

  function renderClaims(current) {
    const target = byId("claims-list");
    if (!target) return;
    target.replaceChildren();
    const receipt = current.receipt;
    if (!receipt || receipt.claims.length === 0) {
      target.append(element("p", "empty-note", "No structurally valid claims are available."));
      return;
    }
    const sources = new Map(receipt.sources.map((source) => [source.id, source]));
    receipt.claims.slice(0, 200).forEach((claim, index) => {
      const details = element("details", "claim-card");
      if (index === 0) details.open = true;
      const summary = element("summary");
      const status = element("span", `status-pill is-${claim.status}`, claim.status);
      summary.append(element("span", "claim-index", String(index + 1).padStart(2, "0")), element("span", "claim-text", previewText(claim.text, 500)), status);
      const body = element("div", "claim-body");
      if (claim.limitation) body.append(element("p", "limitation-item", previewText(claim.limitation)));
      claim.evidence.slice(0, 100).forEach((evidence) => {
        const source = sources.get(evidence.sourceId);
        const card = element("div", `evidence-card${evidence.relation === "contradicts" ? " is-contrary" : ""}`);
        card.append(
          element("p", "", previewText(evidence.excerpt)),
          element("div", "evidence-meta", `${evidence.relation} · ${source?.title || evidence.sourceId} · ${evidence.id}`)
        );
        if (source?.snapshotPath) {
          const actualHash = current.snapshotHashes[source.snapshotPath] || "not available";
          card.append(element("div", "snapshot-meta", `snapshot ${source.snapshotPath} · SHA-256 ${actualHash}`));
          const snapshot = current.bundle[source.snapshotPath];
          if (snapshot !== undefined) card.append(element("pre", "snapshot-view", previewText(toText(snapshot), 4000)));
        }
        body.append(card);
      });
      details.append(summary, body);
      target.append(details);
    });
    if (receipt.claims.length > 200) target.append(element("p", "empty-note", `${receipt.claims.length - 200} additional claims are omitted from this bounded browser view.`));
  }

  function renderSources(current) {
    const target = byId("sources-list");
    if (!target) return;
    target.replaceChildren();
    const receipt = current.receipt;
    if (!receipt || receipt.sources.length === 0) {
      target.append(element("p", "empty-note", "No source metadata is available."));
      return;
    }
    const threshold = freshnessThreshold();
    receipt.sources.slice(0, 200).forEach((source) => {
      const age = ageInDays(source.collectedAt);
      const stale = age !== null && age > threshold;
      const label = age === null ? "date unknown" : stale ? `stale · ${age}d` : `fresh · ${age}d`;
      const card = element("article", "source-card-local");
      card.append(
        element("strong", "", previewText(source.title, 300)),
        element("span", `freshness-pill${stale ? " is-stale" : ""}`, label),
        element("span", "source-url", `${source.url}\n${source.publisher} · ${source.captureType} · ${source.snapshotPath || "no snapshot"}`)
      );
      target.append(card);
    });
  }

  function renderIssues(current) {
    const target = byId("issues-list");
    if (!target) return;
    target.replaceChildren();
    if (current.verification.issues.length === 0) {
      const list = element("div", "issue-list");
      const item = element("div", "issue-item");
      item.append(element("strong", "", "NO_MISMATCH"), document.createTextNode(`Structure, references, and ${current.verification.checkedFiles} manifest file checks match.`));
      list.append(item);
      target.append(list);
      return;
    }
    const list = element("div", "issue-list");
    current.verification.issues.slice(0, 100).forEach((issue) => {
      const item = element("div", "issue-item");
      item.append(element("strong", "", `${issue.code} · ${issue.path}`), document.createTextNode(previewText(issue.message, 800)));
      list.append(item);
    });
    target.append(list);
  }

  function renderLimitations(current) {
    const target = byId("limitations-list");
    if (!target) return;
    target.replaceChildren();
    const list = element("div", "limitation-list");
    list.append(element("div", "limitation-item", "Integrity verifies contract and bytes. It does not prove source truth, completeness, authorization, representativeness, or freshness."));
    for (const limitation of current.receipt?.limitations || []) list.append(element("div", "limitation-item", previewText(limitation)));
    target.append(list);
  }

  function renderPrimary() {
    const current = state.primary;
    const results = byId("verification-results");
    if (!current || !results) return;
    results.hidden = false;
    const valid = current.verification.valid;
    const banner = byId("result-banner");
    banner.classList.toggle("is-valid", valid);
    banner.classList.toggle("is-invalid", !valid);
    byId("result-title").textContent = valid ? "Integrity verified" : "Integrity check failed";
    byId("result-subtitle").textContent = valid
      ? `${current.name}: the available bytes match the declared contract. This is not a truth judgment.`
      : `${current.name}: ${current.verification.issues.length} exact issue(s) need review before relying on this bundle.`;
    byId("result-badge").textContent = valid ? "integrity verified" : "do not rely";
    renderMetrics(current);
    renderClaims(current);
    renderSources(current);
    renderIssues(current);
    renderLimitations(current);
    byId("download-report").disabled = false;
    results.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }

  function renderComparison() {
    const target = byId("comparison-result");
    if (!target) return;
    target.replaceChildren();
    if (!state.primary?.receipt || !state.comparison?.receipt) {
      target.append(element("p", "", "Load a primary receipt, then a second receipt to see the decision diff."));
      return;
    }
    const comparison = Core.compareDecisionReceipts(state.primary.receipt, state.comparison.receipt);
    const heading = element("div", "comparison-heading");
    heading.append(
      element("h3", "", `${previewText(comparison.earlierTitle, 120)} → ${previewText(comparison.laterTitle, 120)}`),
      element("span", `result-badge ${state.comparison.verification.valid ? "" : "is-invalid"}`, state.comparison.verification.valid ? "second integrity verified" : "second integrity failed")
    );
    const signals = element("div", "comparison-signals");
    const signalItems = [
      ["Sources", comparison.changes.sources],
      ["Policy", comparison.changes.policy],
      ["Model", comparison.changes.model],
      ["Synthesis / claims", comparison.changes.claims],
      ["Decision", comparison.changes.decision]
    ];
    for (const [label, changed] of signalItems) {
      const card = element("div", `comparison-signal${changed ? " is-changed" : ""}`);
      card.append(element("span", "", label), element("strong", "", changed ? "Changed" : "Unchanged"));
      signals.append(card);
    }
    const reasons = element("ul", "comparison-reasons");
    comparison.changedBecause.forEach((reason) => reasons.append(element("li", "", reason)));
    target.append(heading, signals, reasons);
  }

  async function loadBundle(slot, name, bundle) {
    try {
      announce(`Verifying ${name} entirely in this tab…`);
      state[slot] = await receiptState(name, bundle);
      if (slot === "primary") renderPrimary();
      renderComparison();
      const result = state[slot].verification;
      announce(`${name}: ${result.valid ? "integrity verified" : `${result.issues.length} issue(s) found`}. No files were uploaded.`);
    } catch (error) {
      announce(`Could not read ${name}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async function handleInput(input, slot) {
    const files = Array.from(input.files || []);
    if (files.length === 0) return;
    const entries = files.map((file) => ({ file, path: file.webkitRelativePath || file.name }));
    try {
      const bundle = await bundleFromFiles(entries);
      await loadBundle(slot, files.length === 1 ? files[0].name : `${files.length}-file folder`, bundle);
    } catch (error) {
      announce(`Import refused: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      input.value = "";
    }
  }

  async function loadFixture(name, slot = "primary") {
    const fixture = fixtures[name];
    if (!fixture) return;
    if (slot === "comparison" && !state.primary) await loadFixture("valid", "primary");
    const bundle = Object.fromEntries(Object.entries(fixture.files).map(([filePath, content]) => [filePath, String(content)]));
    await loadBundle(slot, fixture.label, bundle);
  }

  function reportData(includePrivate) {
    const current = state.primary;
    if (!current) return null;
    const receipt = current.receipt;
    const statuses = { supported: 0, contradicted: 0, insufficient: 0 };
    receipt?.claims.forEach((claim) => { if (claim.status in statuses) statuses[claim.status] += 1; });
    const report = {
      type: "decision-receipt-verification-report",
      reportVersion: "1.0.0",
      generatedAt: new Date().toISOString(),
      integrityVerified: current.verification.valid,
      truthBoundary: "Integrity and signatures do not prove source or decision truth, completeness, authorization, representativeness, or freshness.",
      checkedFiles: current.verification.checkedFiles,
      signatureVerified: current.verification.signatureVerified,
      issues: current.verification.issues.map(({ path, code, message }) => ({ path, code, message })),
      receipt: receipt ? {
        schemaVersion: receipt.schemaVersion,
        specVersion: receipt.specVersion,
        profile: receipt.profile,
        provenanceKind: receipt.provenance.kind,
        claimCounts: statuses,
        sourceCount: receipt.sources.length,
        staleSourceCount: freshnessSummary(receipt).stale,
        ...(includePrivate ? {
          decision: receipt.decision,
          claims: receipt.claims,
          sources: receipt.sources,
          contradictions: receipt.contradictions,
          limitations: receipt.limitations,
          nextValidation: receipt.nextValidation
        } : {})
      } : null,
      comparison: state.comparison?.receipt && receipt
        ? Core.compareDecisionReceipts(receipt, state.comparison.receipt).changes
        : null,
      privacy: { privateReceiptDataIncluded: includePrivate, persistedByVerifier: false, uploadedByVerifier: false }
    };
    return report;
  }

  function downloadReport() {
    const report = reportData(Boolean(byId("include-private-data")?.checked));
    if (!report) return;
    const url = URL.createObjectURL(new Blob([`${JSON.stringify(report, null, 2)}\n`], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "verification-report.json";
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    announce("verification-report.json generated locally.");
  }

  function setup() {
    document.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));
    if (!Core) {
      announce("The local verifier core did not load. Reload this page from the same static directory.");
      return;
    }
    const dropZone = byId("receipt-drop-zone");
    dropZone.addEventListener("click", () => byId("primary-folder-input").click());
    dropZone.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        byId("primary-folder-input").click();
      }
    });
    for (const eventName of ["dragenter", "dragover"]) {
      dropZone.addEventListener(eventName, (event) => { event.preventDefault(); dropZone.classList.add("is-dragging"); });
    }
    for (const eventName of ["dragleave", "drop"]) {
      dropZone.addEventListener(eventName, (event) => { event.preventDefault(); dropZone.classList.remove("is-dragging"); });
    }
    dropZone.addEventListener("drop", async (event) => {
      try {
        const entries = await droppedFileEntries(event.dataTransfer);
        const bundle = await bundleFromFiles(entries);
        await loadBundle("primary", entries.length === 1 ? entries[0].file.name : `${entries.length}-file drop`, bundle);
      } catch (error) {
        announce(`Drop refused: ${error instanceof Error ? error.message : String(error)}`);
      }
    });
    byId("primary-folder-input").addEventListener("change", (event) => handleInput(event.currentTarget, "primary"));
    byId("primary-zip-input").addEventListener("change", (event) => handleInput(event.currentTarget, "primary"));
    byId("comparison-folder-input").addEventListener("change", (event) => handleInput(event.currentTarget, "comparison"));
    byId("comparison-zip-input").addEventListener("change", (event) => handleInput(event.currentTarget, "comparison"));
    document.querySelectorAll("[data-fixture]").forEach((button) => button.addEventListener("click", () => loadFixture(button.dataset.fixture, button.dataset.slot || "primary")));
    byId("freshness-days").addEventListener("change", () => { if (state.primary) { renderMetrics(state.primary); renderSources(state.primary); } });
    byId("download-report").addEventListener("click", downloadReport);
    announce("Ready. Choose a local receipt or load a safe fixture; nothing will be uploaded.");
  }

  setup();
})();
