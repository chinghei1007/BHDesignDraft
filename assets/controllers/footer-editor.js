const footerEditorController = (() => {
  const key = "sheklei-footer-styles-v1",
    pages = [...document.querySelectorAll(".direction")],
    layout = document.querySelector("#layout-select");
  let data = {};
  try {
    data = JSON.parse(localStorage.getItem(key) || "{}") || {};
  } catch (e) {}
  const panel = document.createElement("fieldset");
  panel.className = "footer-settings extra-settings";
  panel.innerHTML =
    '<legend>Footer settings</legend><p class="hint">Choose a simple copyright footer or show an expanded example.</p>';
  document.querySelector("#list-settings").before(panel);
  const toggleLabel = document.createElement("label");
  toggleLabel.className = "inline-toggle";
  const details = document.createElement("input");
  details.type = "checkbox";
  details.setAttribute("aria-label", "Show additional footer information");
  toggleLabel.append(
    details,
    document.createTextNode("Show additional footer information"),
  );
  panel.append(toggleLabel);
  const grid = document.createElement("div");
  grid.className = "extra-grid";
  panel.append(grid);
  const fields = {};
  function field(labelText, type, aria, def) {
    let label = document.createElement("label");
    label.textContent = labelText;
    const el = document.createElement("input");
    el.type = type;
    el.setAttribute("aria-label", aria);
    el.dataset.default = def;
    if (type === "number") {
      el.min = "0";
      el.step = "1";
    } else label.className = "color-field";
    label.append(el);
    grid.append(label);
    return el;
  }
  [
    ["size", "Font size (px)", 14],
    ["padding", "Padding (px)", 20],
    ["margin", "Top margin (px)", 24],
    ["radius", "Corner radius (px)", 0],
    ["borderWidth", "Top border width (px)", 1],
  ].forEach(
    ([name, label, def]) =>
      (fields[name] = field(
        label,
        "number",
        "Footer " + label.toLowerCase(),
        def,
      )),
  );
  [
    ["bg", "Background", "#f7f9f6"],
    ["text", "Text color", "#283b38"],
    ["border", "Border color", "#d6dfd9"],
  ].forEach(
    ([name, label, def]) =>
      (fields[name] = field(
        label,
        "color",
        "Footer " + label.toLowerCase(),
        def,
      )),
  );
  function idx() {
    return Number(layout.value) || 0;
  }
  function state(i) {
    return data[i] || (data[i] = {});
  }
  function save() {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      document.querySelector("#layout-save-status").textContent =
        "Footer settings saved in this browser.";
    } catch (e) {
      document.querySelector("#layout-save-status").textContent =
        "Footer settings are visible but could not be saved.";
    }
  }
  function apply(i) {
    const page = pages[i],
      ui = page.querySelector(".ui"),
      content = ui.querySelector(".ui-content"),
      c = state(i);
    ui.dataset.footerEditor = i;
    let footer = content.querySelector(":scope > .footer");
    if (!footer) {
      footer = document.createElement("footer");
      footer.className = "footer";
      content.append(footer);
    }
    const year = new Date().getFullYear();
    footer.innerHTML =
      '<div class="footer-inner">' +
      (c.details
        ? '<div class="footer-grid"><div class="footer-brand"><span class="footer-brand-name">Rivermere Secondary School</span><p class="footer-tagline">Learning together, every day.</p><div class="footer-social"><span class="footer-social-icon" role="img" aria-label="GitHub icon (example)"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 .75A11.25 11.25 0 0 0 8.44 22.67c.56.1.77-.24.77-.54v-2.1c-3.14.68-3.8-1.33-3.8-1.33-.52-1.3-1.27-1.65-1.27-1.65-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.66 1.23 3.3.94.11-.73.4-1.23.73-1.51-2.5-.29-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.02-.12-.29-.5-1.44.11-2.99 0 0 .95-.3 3.1 1.15a10.77 10.77 0 0 1 5.64 0c2.15-1.46 3.1-1.15 3.1-1.15.61 1.55.23 2.7.11 2.99.72.79 1.16 1.79 1.16 3.03 0 4.31-2.63 5.26-5.14 5.54.4.35.77 1.03.77 2.08v3.1c0 .3.2.65.78.54A11.25 11.25 0 0 0 12 .75z"/></svg></span></div></div><div><h4 class="footer-heading">About</h4><ul class="footer-links"><li>Our school</li><li>Contact the school</li></ul></div></div>'
        : "") +
      '<div class="footer-bottom"><p>© ' +
      year +
      " Rivermere Secondary School. All rights reserved.</p></div></div>";
    const n = (k, d) =>
        Number.isFinite(Number(c[k])) && Number(c[k]) >= 0 ? Number(c[k]) : d,
      col = (k, d) => (/^#[0-9a-f]{6}$/i.test(c[k] || "") ? c[k] : d);
    page.querySelector(".footer-style-rules").textContent =
      '.ui[data-footer-editor="' +
      i +
      '"] .footer {font-size:' +
      n("size", 14) +
      "px;padding:" +
      n("padding", 20) +
      "px;margin-top:" +
      n("margin", 24) +
      "px;border-radius:" +
      n("radius", 0) +
      "px;border-top:" +
      n("borderWidth", 1) +
      "px solid " +
      col("border", "#d6dfd9") +
      ";background:" +
      col("bg", "#f7f9f6") +
      ";color:" +
      col("text", "#283b38") +
      "}\n";
  }
  function refresh() {
    const c = state(idx());
    details.checked = !!c.details;
    Object.entries(fields).forEach(
      ([name, el]) => (el.value = c[name] ?? el.dataset.default),
    );
  }
  function update() {
    let i = idx(),
      c = state(i);
    c.details = details.checked;
    for (const [name, el] of Object.entries(fields)) {
      if (el.type === "color") {
        c[name] = el.value;
        continue;
      }
      if (
        el.value === "" ||
        !Number.isFinite(Number(el.value)) ||
        Number(el.value) < 0
      )
        return;
      c[name] = Number(el.value);
    }
    apply(i);
    save();
  }
  details.addEventListener("change", update);
  Object.values(fields).forEach((el) => el.addEventListener("input", update));
  const reset = document.createElement("button");
  reset.type = "button";
  reset.textContent = "Reset footer settings";
  reset.addEventListener("click", () => {
    let i = idx();
    delete data[i];
    apply(i);
    refresh();
    save();
  });
  panel.append(reset);
  pages.forEach((p, i) => {
    let style = document.createElement("style");
    style.className = "footer-style-rules";
    p.append(style);
    apply(i);
  });
  layout.addEventListener("change", refresh);
  document.querySelector("#prev").addEventListener("click", refresh);
  document.querySelector("#next").addEventListener("click", refresh);
  refresh();
  return { apply, refresh };
})();
