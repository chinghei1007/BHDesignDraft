const sampleListsAndIconsController = (() => {
  const pages = [...document.querySelectorAll(".direction")],
    layout = document.querySelector("#layout-select"),
    listKey = "sheklei-sample-list-visibility-v1",
    iconKey = "sheklei-sidebar-icons-v1",
    show = document.querySelector("#show-sample-lists");
  let listVisibility = {},
    icons = {};
  try {
    listVisibility = JSON.parse(localStorage.getItem(listKey) || "{}") || {};
    icons = JSON.parse(localStorage.getItem(iconKey) || "{}") || {};
  } catch (e) {}
  const paths = [
    "M3 10 12 3l9 7M5 9v11h14V9M9 20v-7h6v7",
    "M4 4h16v16H4zM8 4v16M11 8h6M11 12h6M11 16h4",
    "M6 3h12v18H6zM9 7h6M9 11h6M9 15h4",
    "M5 5h14v15H5zM8 3v4M16 3v4M5 9h14M8 12h2M13 12h2M8 16h2",
    "M3 6h18v12H3zM3 7l9 7 9-7",
    "M4 4h14a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2zM4 17h16M8 8h8",
    "M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8M5 21a7 7 0 0 1 14 0",
  ];
  function save(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
      document.querySelector("#layout-save-status").textContent =
        "Preview settings saved in this browser.";
    } catch (e) {
      document.querySelector("#layout-save-status").textContent =
        "Preview settings are visible but could not be saved.";
    }
  }
  function render(i) {
    let ui = pages[i].querySelector(".ui"),
      main = ui.querySelector(".main"),
      sample = main.querySelector(".sample-lists"),
      visible = listVisibility[i] !== false;
    if (visible && !sample) {
      sample = document.createElement("section");
      sample.className = "sample-lists";
      sample.setAttribute("aria-label", "Sample lists");
      sample.innerHTML =
        "<h4>Unordered list</h4><ul><li>School announcements</li><li>Learning resources</li><li>Community events</li></ul><h4>Ordered list</h4><ol><li>Read the update</li><li>Review the schedule</li><li>Prepare for class</li></ol>";
      main.append(sample);
    } else if (!visible && sample) sample.remove();
    ui.classList.toggle("nav-icons-hidden", icons[i] === false);
  }
  pages.forEach((page, i) => {
    const ui = page.querySelector(".ui");
    ui.querySelectorAll(".nav .item").forEach((item, n) => {
      const text = [...item.childNodes].find(
        (node) => node.nodeType === Node.TEXT_NODE,
      );
      if (text) text.nodeValue = text.nodeValue.replace(/^\s*\S+\s*/u, "");
      let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("class", "nav-icon");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("fill", "none");
      svg.setAttribute("stroke", "currentColor");
      svg.setAttribute("stroke-width", "1.8");
      svg.setAttribute("stroke-linecap", "round");
      svg.setAttribute("stroke-linejoin", "round");
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("focusable", "false");
      let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", paths[n % paths.length]);
      svg.append(path);
      item.prepend(svg);
    });
    const box = [...page.querySelectorAll(".component-controls")].find(
      (el) => el.querySelector("strong")?.textContent === "Navigation styles",
    );
    if (box) {
      let label = document.createElement("label");
      label.className = "nav-icon-toggle";
      let toggle = document.createElement("input");
      toggle.type = "checkbox";
      toggle.setAttribute("aria-label", "Show sidebar icons");
      toggle.checked = icons[i] !== false;
      label.append(toggle, document.createTextNode("Show sidebar icons"));
      box.append(label);
      toggle.addEventListener("change", () => {
        icons[i] = toggle.checked;
        render(i);
        save(iconKey, icons);
      });
    }
    render(i);
  });
  function refresh() {
    show.checked = listVisibility[Number(layout.value) || 0] !== false;
  }
  show.addEventListener("change", () => {
    let i = Number(layout.value) || 0;
    listVisibility[i] = show.checked;
    render(i);
    save(listKey, listVisibility);
  });
  layout.addEventListener("change", refresh);
  document.querySelector("#prev").addEventListener("click", refresh);
  document.querySelector("#next").addEventListener("click", refresh);
  refresh();
  return { render, refresh };
})();
