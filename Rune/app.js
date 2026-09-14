(function () {
  "use strict";

  var revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  function fallbackCopy(value) {
    var input = document.createElement("textarea");
    input.value = value;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.select();
    var copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }
    document.body.removeChild(input);
    return copied;
  }

  document.querySelectorAll("[data-copy]").forEach(function (button) {
    button.addEventListener("click", function () {
      var value = button.getAttribute("data-copy") || "";
      var result = window.navigator.clipboard
        ? window.navigator.clipboard.writeText(value)
        : Promise.resolve(fallbackCopy(value));
      Promise.resolve(result).then(function () {
        var original = button.textContent;
        button.textContent = "COPIED";
        window.setTimeout(function () {
          button.textContent = original;
        }, 1400);
      }).catch(function () {
        button.textContent = "SELECT";
        window.setTimeout(function () {
          button.textContent = "COPY";
        }, 1400);
      });
    });
  });

  var filterNote = document.getElementById("filter-note");
  var filterLabels = {
    all: "Showing the complete evidence map.",
    shell: "Shell workflow: parser, pipelines, scripts, filters, history.",
    filesystem: "VFS workflow: confined paths, archives, persistence.",
    bridge: "Bridge workflow: events, cancellation, and host providers.",
    native: "Apple surface: SwiftUI source boundary; runtime still pending."
  };
  document.querySelectorAll(".capability-row").forEach(function (row) {
    row.addEventListener("click", function () {
      document.querySelectorAll(".capability-row").forEach(function (item) {
        item.classList.remove("is-active");
      });
      row.classList.add("is-active");
      if (filterNote) {
        filterNote.textContent = filterLabels[row.getAttribute("data-filter")] || filterLabels.all;
      }
    });
  });
})();
