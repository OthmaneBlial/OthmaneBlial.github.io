(function (root) {
  "use strict";

  var REPO = "https://github.com/OthmaneBlial/AetherTerm";
  var REPO_BLOB = REPO + "/blob/main/";
  var CODE_TOKEN = "\u0001";

  var REGISTRY = [
    { id: "quickstart", name: "Local quickstart", group: "Start here", file: "docs/QUICKSTART.md", path: "docs/QUICKSTART.md" },
    { id: "install", name: "Installation", group: "Start here", file: "docs/INSTALL.md", path: "docs/INSTALL.md" },
    { id: "product", name: "Product contract", group: "Product", file: "docs/PRODUCT.md", path: "docs/PRODUCT.md" },
    { id: "positioning", name: "Positioning notes", group: "Product", file: "docs/POSITIONING.md", path: "docs/POSITIONING.md" },
    { id: "research_status", name: "Research status", group: "Product", file: "docs/RESEARCH_STATUS.md", path: "docs/RESEARCH_STATUS.md" },
    { id: "demo_script", name: "Demo script", group: "Product", file: "docs/DEMO_SCRIPT.md", path: "docs/DEMO_SCRIPT.md" },
    { id: "architecture", name: "Architecture", group: "Systems", file: "docs/ARCHITECTURE.md", path: "docs/ARCHITECTURE.md" },
    { id: "security", name: "Security guide", group: "Systems", file: "docs/SECURITY.md", path: "docs/SECURITY.md" },
    { id: "threat_model", name: "Threat model", group: "Systems", file: "docs/THREAT_MODEL.md", path: "docs/THREAT_MODEL.md" },
    { id: "deployment", name: "Deployment and TLS", group: "Systems", file: "docs/DEPLOYMENT.md", path: "docs/DEPLOYMENT.md" },
    { id: "operations", name: "Operations", group: "Systems", file: "docs/OPERATIONS.md", path: "docs/OPERATIONS.md" },
    { id: "systemd", name: "systemd units", group: "Systems", file: "docs/SYSTEMD.md", path: "docs/SYSTEMD.md" },
    { id: "test_matrix", name: "Test matrix", group: "Quality", file: "docs/TEST_MATRIX.md", path: "docs/TEST_MATRIX.md" },
    { id: "screenshots", name: "Screenshot provenance", group: "Quality", file: "docs/SCREENSHOTS.md", path: "docs/SCREENSHOTS.md" },
    { id: "release_checklist", name: "Release checklist", group: "Quality", file: "docs/RELEASE_CHECKLIST.md", path: "docs/RELEASE_CHECKLIST.md" },
    { id: "roadmap", name: "Roadmap", group: "Quality", file: "ROADMAP.md", path: "ROADMAP.md" },
    { id: "changelog", name: "Changelog", group: "Quality", file: "CHANGELOG.md", path: "CHANGELOG.md" }
  ];

  var BY_ID = {};
  REGISTRY.forEach(function (entry) { BY_ID[entry.id] = entry; });

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function slug(value) {
    return String(value)
      .toLowerCase()
      .replace(/[`*_]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 70);
  }

  var currentBase = "docs/";

  function resolveRepoPath(href) {
    var target = href.split("#")[0];
    if (target.indexOf("/") === -1) {
      return currentBase + target;
    }
    while (target.indexOf("../") === 0) {
      target = target.slice(3);
    }
    return target.replace(/^\.\//, "");
  }

  function rewriteHref(href) {
    if (/^(https?:|mailto:|#)/.test(href)) {
      return href;
    }
    var resolved = resolveRepoPath(href);
    if (/^readme\.md$/i.test(resolved)) {
      return "index.html";
    }
    var localDoc = /^([A-Za-z0-9_.-]+)\.md$/i.exec(resolved);
    if (localDoc && BY_ID[localDoc[1].toLowerCase()]) {
      return "docs.html#" + localDoc[1].toLowerCase();
    }
    return REPO_BLOB + resolved;
  }

  function rewriteSrc(src) {
    return src.replace(/^(\.\.\/)+/, "");
  }

  function inline(text) {
    var codes = [];
    var work = String(text).replace(/`([^`]+)`/g, function (match, code) {
      codes.push(code);
      return CODE_TOKEN + (codes.length - 1) + CODE_TOKEN;
    });
    work = escapeHtml(work);
    work = work.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, function (match, alt, src) {
      return '<img src="' + rewriteSrc(src) + '" alt="' + alt + '" loading="lazy">';
    });
    work = work.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (match, label, href) {
      var external = /^https?:/.test(href) ? ' rel="noopener"' : "";
      return '<a href="' + rewriteHref(href) + '"' + external + ">" + label + "</a>";
    });
    work = work.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    work = work.replace(/(^|[\s(])_([^_\n]+)_(?=[\s).,;:!?]|$)/g, "$1<em>$2</em>");
    work = work.replace(new RegExp(CODE_TOKEN + "(\\d+)" + CODE_TOKEN, "g"), function (match, index) {
      return "<code>" + escapeHtml(codes[Number(index)]) + "</code>";
    });
    return work;
  }

  function isBlank(line) { return /^\s*$/.test(line); }

  function indentOf(line) {
    var match = /^(\s*)/.exec(line);
    return match[1].replace(/\t/g, "  ").length;
  }

  function isBlockStart(lines, index) {
    var line = lines[index];
    if (isBlank(line)) { return true; }
    if (/^\s*(```|~~~)/.test(line)) { return true; }
    if (/^#{1,6}\s+/.test(line)) { return true; }
    if (/^\s*>/.test(line)) { return true; }
    if (/^\s*([-*_])\s*(\1\s*){2,}$/.test(line)) { return true; }
    if (/^\s*([-*+]|\d+[.)])\s+/.test(line)) { return true; }
    if (isTableStart(lines, index)) { return true; }
    return false;
  }

  function isTableStart(lines, index) {
    var next = lines[index + 1];
    if (!next || lines[index].indexOf("|") === -1) { return false; }
    return /^\s*\|?[\s:|-]*-[\s:|-]*\|?\s*$/.test(next) && next.indexOf("|") !== -1;
  }

  function splitRow(row) {
    return row.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(function (cell) {
      return cell.trim();
    });
  }

  function renderTable(lines, start) {
    var header = splitRow(lines[start]);
    var rows = [];
    var index = start + 2;
    while (index < lines.length && !isBlank(lines[index]) && lines[index].indexOf("|") !== -1) {
      rows.push(splitRow(lines[index]));
      index++;
    }
    var html = '<div class="md-table-scroll"><table><thead><tr>';
    header.forEach(function (cell) { html += "<th>" + inline(cell) + "</th>"; });
    html += "</tr></thead><tbody>";
    rows.forEach(function (row) {
      html += "<tr>";
      header.forEach(function (cell, position) {
        html += "<td>" + inline(row[position] === undefined ? "" : row[position]) + "</td>";
      });
      html += "</tr>";
    });
    html += "</tbody></table></div>";
    return { html: html, next: index };
  }

  function renderCode(code, language) {
    var label = language ? escapeHtml(language) : "shell";
    return '<figure class="md-code"><figcaption><span class="code-label">' + label +
      '</span><button type="button" class="copy" data-copy>Copy</button></figcaption><pre><code>' +
      escapeHtml(code) + "</code></pre></figure>";
  }

  function renderList(lines, start, baseIndent) {
    var ordered = /^\s*\d+[.)]\s/.test(lines[start]);
    var items = [];
    var index = start;
    while (index < lines.length) {
      var marker = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(lines[index]);
      if (!marker || indentOf(lines[index]) !== baseIndent) { break; }
      if (/\d/.test(marker[2]) !== ordered) { break; }
      var parts = [marker[3]];
      index++;
      while (index < lines.length) {
        var current = lines[index];
        if (isBlank(current)) {
          var lookahead = index;
          while (lookahead < lines.length && isBlank(lines[lookahead])) { lookahead++; }
          if (lookahead < lines.length && indentOf(lines[lookahead]) >= baseIndent + 2) {
            index = lookahead;
            continue;
          }
          break;
        }
        if (indentOf(current) < baseIndent + 2) { break; }
        if (/^\s*([-*+]|\d+[.)])\s+/.test(current)) {
          var nested = renderList(lines, index, indentOf(current));
          parts.push({ html: nested.html });
          index = nested.next;
          continue;
        }
        parts.push(current.trim());
        index++;
      }
      items.push(parts);
    }

    var html = ordered ? "<ol>" : "<ul>";
    items.forEach(function (parts) {
      var text = parts.filter(function (part) { return typeof part === "string"; }).join(" ").trim();
      var inner = text ? inline(text) : "";
      parts.forEach(function (part) {
        if (typeof part !== "string") { inner += part.html; }
      });
      html += "<li>" + inner + "</li>";
    });
    html += ordered ? "</ol>" : "</ul>";
    return { html: html, next: index };
  }

  function renderBlocks(lines) {
    var html = "";
    var index = 0;
    while (index < lines.length) {
      var line = lines[index];
      if (isBlank(line)) { index++; continue; }

      var fence = /^\s*(```|~~~)\s*([A-Za-z0-9+#._-]*)\s*$/.exec(line);
      if (fence) {
        var closer = new RegExp("^\\s*" + fence[1]);
        var buffer = [];
        index++;
        while (index < lines.length && !closer.test(lines[index])) {
          buffer.push(lines[index]);
          index++;
        }
        index++;
        html += renderCode(buffer.join("\n"), fence[2]);
        continue;
      }

      var heading = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(line);
      if (heading) {
        var level = heading[1].length;
        html += "<h" + level + ' id="' + slug(heading[2]) + '">' + inline(heading[2]) + "</h" + level + ">";
        index++;
        continue;
      }

      if (/^\s*([-*_])\s*(\1\s*){2,}$/.test(line)) {
        html += "<hr>";
        index++;
        continue;
      }

      if (/^\s*>/.test(line)) {
        var quote = [];
        while (index < lines.length && !isBlank(lines[index]) && /^\s*>/.test(lines[index])) {
          quote.push(lines[index].replace(/^\s*>\s?/, ""));
          index++;
        }
        html += "<blockquote>" + renderBlocks(quote) + "</blockquote>";
        continue;
      }

      if (isTableStart(lines, index)) {
        var table = renderTable(lines, index);
        html += table.html;
        index = table.next;
        continue;
      }

      if (/^\s*([-*+]|\d+[.)])\s+/.test(line)) {
        var list = renderList(lines, index, indentOf(line));
        html += list.html;
        index = list.next;
        continue;
      }

      var paragraph = [line.trim()];
      index++;
      while (index < lines.length && !isBlockStart(lines, index)) {
        paragraph.push(lines[index].trim());
        index++;
      }
      html += "<p>" + inline(paragraph.join(" ")) + "</p>";
    }
    return html;
  }

  function renderMarkdown(markdown, base) {
    currentBase = base || "docs/";
    var lines = String(markdown).replace(/\r\n?/g, "\n").split("\n");
    var firstHeading = null;
    for (var i = 0; i < lines.length; i++) {
      var match = /^#\s+(.*)$/.exec(lines[i]);
      if (match) { firstHeading = match[1]; break; }
    }
    return { html: renderBlocks(lines), title: firstHeading };
  }

  var api = {
    registry: REGISTRY,
    renderMarkdown: renderMarkdown,
    rewriteHref: rewriteHref,
    slug: slug
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
    return;
  }
  root.AetherTermDocs = api;

  if (typeof document === "undefined") { return; }

  var list = document.getElementById("doc-list");
  var title = document.getElementById("doc-title");
  var content = document.getElementById("doc-content");
  var group = document.getElementById("doc-group");
  var source = document.getElementById("doc-source");
  var empty = document.getElementById("doc-empty");
  var filter = document.getElementById("doc-filter");
  var links = {};

  REGISTRY.forEach(function (entry) {
    if (!links[entry.group]) {
      var groupLabel = document.createElement("p");
      groupLabel.className = "docs-group-label";
      groupLabel.textContent = entry.group;
      list.appendChild(groupLabel);
      links[entry.group] = true;
    }
    var anchor = document.createElement("a");
    anchor.href = "docs.html#" + entry.id;
    anchor.dataset.doc = entry.id;
    anchor.dataset.search = (entry.name + " " + entry.id + " " + entry.group).toLowerCase();
    anchor.textContent = entry.name;
    anchor.addEventListener("click", function (event) {
      event.preventDefault();
      show(entry.id, true);
    });
    list.appendChild(anchor);
  });

  function currentId() {
    return (location.hash || "").replace(/^#/, "") || "quickstart";
  }

  function setActive(id) {
    Object.keys(BY_ID).forEach(function (key) {
      var anchor = list.querySelector('[data-doc="' + key + '"]');
      if (!anchor) { return; }
      if (key === id) {
        anchor.setAttribute("aria-current", "true");
      } else {
        anchor.removeAttribute("aria-current");
      }
    });
  }

  function bindCopies(scope) {
    scope.querySelectorAll("button[data-copy]").forEach(function (button) {
      button.addEventListener("click", function () {
        var code = button.closest(".md-code").querySelector("pre code");
        var text = code ? code.textContent.replace(/\s+$/, "") : "";
        var write = navigator.clipboard && navigator.clipboard.writeText
          ? navigator.clipboard.writeText(text)
          : Promise.reject(new Error("clipboard unavailable"));
        write.then(function () {
          button.textContent = "Copied";
          window.setTimeout(function () { button.textContent = "Copy"; }, 1600);
        }).catch(function () {
          button.textContent = "Select manually";
          window.setTimeout(function () { button.textContent = "Copy"; }, 2200);
        });
      });
    });
  }

  function show(id, push) {
    var entry = BY_ID[id] || BY_ID.quickstart;
    setActive(entry.id);
    title.textContent = entry.name;
    group.textContent = entry.group;
    source.href = REPO_BLOB + entry.path;
    content.classList.remove("md");
    content.innerHTML = '<p class="md-loading">Fetching ' + escapeHtml(entry.path) + " …</p>";
    if (push && location.hash !== "#" + entry.id) {
      history.pushState(null, "", "#" + entry.id);
    }
    fetch("docs/" + entry.id + ".md", { cache: "no-cache" }).then(function (response) {
      if (!response.ok) { throw new Error("HTTP " + response.status); }
      return response.text();
    }).then(function (markdown) {
      var rendered = renderMarkdown(markdown, entry.path.replace(/[^/]+$/, ""));
      content.innerHTML = rendered.html;
      content.classList.add("md");
      if (rendered.title) {
        title.textContent = rendered.title;
      }
      bindCopies(content);
      document.title = entry.name + " · AetherTerm documentation";
    }).catch(function (error) {
      content.classList.add("md");
      content.innerHTML = '<p class="md-error">Could not load ' + escapeHtml(entry.path) +
        " (" + escapeHtml(error.message) + "). The authoritative copy lives at " +
        '<a href="' + REPO_BLOB + entry.path + '">' + REPO_BLOB + entry.path + "</a>.</p>";
    });
  }

  if (filter) {
    filter.addEventListener("input", function () {
      var query = filter.value.trim().toLowerCase();
      var visible = 0;
      list.querySelectorAll("a[data-doc]").forEach(function (anchor) {
        var match = !query || anchor.dataset.search.indexOf(query) !== -1;
        anchor.hidden = !match;
        if (match) { visible++; }
      });
      list.querySelectorAll(".docs-group-label").forEach(function (label) {
        var anyVisible = false;
        var node = label.nextElementSibling;
        while (node && !node.classList.contains("docs-group-label")) {
          if (node.matches("a[data-doc]") && !node.hidden) { anyVisible = true; }
          node = node.nextElementSibling;
        }
        label.hidden = !anyVisible;
      });
      empty.hidden = visible !== 0;
    });
  }

  window.addEventListener("hashchange", function () { show(currentId(), false); });
  show(currentId(), false);
})(typeof globalThis !== "undefined" ? globalThis : this);
