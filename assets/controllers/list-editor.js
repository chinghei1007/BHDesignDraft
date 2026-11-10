const listEditorController = (() => {
  const key = "sheklei-list-styles-v1",
    pages = [...document.querySelectorAll(".direction")],
    layout = document.querySelector("#layout-select"),
    panel = document.querySelector("#list-settings");
  let data = {};
  try {
    data = JSON.parse(localStorage.getItem(key) || "{}") || {};
  } catch (e) {}
  const fields = {
    marker: "--list-marker",
    size: "--list-size",
    weight: "--list-weight",
    padding: "--list-padding",
    radius: "--list-radius",
    color: "--list-color",
    bg: "--list-bg",
  };
  function index() {
    return Number(layout.value) || 0;
  }
  function apply(i) {
    const ui = pages[i].querySelector(".ui"),
      state = data[i] || {};
    Object.entries(fields).forEach(([name, prop]) =>
      state[name]
        ? ui.style.setProperty(prop, state[name])
        : ui.style.removeProperty(prop),
    );
  }
  function refresh() {
    const i = index(),
      ui = pages[i].querySelector(".ui"),
      d = data[i] || {};
    panel.hidden = false;
    ["marker", "size", "weight", "padding", "radius"].forEach(
      (n) => (document.getElementById("li-" + n).value = d[n] || ""),
    );
    ["color", "bg"].forEach((n) => {
      document.getElementById("li-custom-" + n).checked = !!d[n];
      document.getElementById("li-" + n).value =
        d[n] || (n === "color" ? "#263b35" : "#d9e9df");
    });
  }
  function save() {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      document.querySelector("#layout-save-status").textContent =
        "List styles saved in this browser.";
    } catch (e) {
      document.querySelector("#layout-save-status").textContent =
        "List changes are visible but could not be saved.";
    }
  }
  function update(name, value) {
    const i = index();
    data[i] = data[i] || {};
    if (value) data[i][name] = value;
    else delete data[i][name];
    apply(i);
    save();
  }
  ["marker", "size", "weight", "padding", "radius"].forEach((n) =>
    document
      .getElementById("li-" + n)
      .addEventListener("change", (e) => update(n, e.target.value)),
  );
  ["color", "bg"].forEach((n) => {
    const toggle = document.getElementById("li-custom-" + n),
      picker = document.getElementById("li-" + n);
    toggle.addEventListener("change", () =>
      update(n, toggle.checked ? picker.value : ""),
    );
    picker.addEventListener("input", () => {
      toggle.checked = true;
      update(n, picker.value);
    });
  });
  document.getElementById("li-reset").addEventListener("click", () => {
    delete data[index()];
    apply(index());
    save();
    refresh();
  });
  pages.forEach((_, i) => apply(i));
  layout.addEventListener("change", refresh);
  document.querySelector("#prev").addEventListener("click", refresh);
  document.querySelector("#next").addEventListener("click", refresh);
  refresh();
  return { apply, refresh };
})();
