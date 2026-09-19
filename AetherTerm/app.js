(function () {
  "use strict";

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.top = "-1000px";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy") ? resolve() : reject(new Error("copy rejected"));
      } catch (error) {
        reject(error);
      } finally {
        document.body.removeChild(area);
      }
    });
  }

  function snippetFor(button) {
    var block = button.closest(".code") || document;
    var code = block.querySelector("pre code");
    return code ? code.textContent.replace(/\s+$/, "") : "";
  }

  document.querySelectorAll("button[data-copy]").forEach(function (button) {
    button.addEventListener("click", function () {
      var text = snippetFor(button);
      if (!text) {
        return;
      }
      copyText(text).then(function () {
        button.dataset.state = "done";
        button.textContent = "Copied";
        window.setTimeout(function () {
          button.dataset.state = "";
          button.textContent = "Copy";
        }, 1600);
      }).catch(function () {
        button.textContent = "Select manually";
        window.setTimeout(function () {
          button.textContent = "Copy";
        }, 2200);
      });
    });
  });

  document.querySelectorAll(".nav a[href^='#']").forEach(function (link) {
    link.addEventListener("click", function () {
      document.querySelectorAll(".nav a").forEach(function (other) {
        other.removeAttribute("aria-current");
      });
      link.setAttribute("aria-current", "true");
    });
  });
})();
