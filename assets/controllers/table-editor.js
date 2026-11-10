const tableEditorController = (() => {
  const key = "sheklei-table-styles-v1",
    pages = [...document.querySelectorAll(".direction")],
    layout = document.querySelector("#layout-select"),
    panel = document.createElement("fieldset");
  panel.className = "table-settings extra-settings";
  panel.innerHTML =
    '<legend>Table settings</legend><p class="hint">Show a sample table to adjust its appearance in this design.</p>';
  document.querySelector("#list-settings").before(panel);
  let data = {};
  try {
    data = JSON.parse(localStorage.getItem(key) || "{}") || {};
  } catch (e) {}
  const grid = document.createElement("div");
  grid.className = "extra-grid";
  const toggleLabel = document.createElement("label");
  toggleLabel.className = "inline-toggle";
  const show = document.createElement("input");
  show.type = "checkbox";
  show.setAttribute("aria-label", "Show table preview");
  toggleLabel.append(show, document.createTextNode("Show table preview"));
  panel.append(toggleLabel, grid);
  function field(text, type, aria) {
    const label = document.createElement("label");
    label.textContent = text;
    let el = document.createElement("input");
    el.type = type;
    el.setAttribute("aria-label", aria);
    label.append(el);
    grid.append(label);
    return { el, label };
  }
  const fields = {};
  [
    ["size", "Font size (px)", 14],
    ["padding", "Cell padding (px)", 12],
    ["borderWidth", "Border width (px)", 1],
    ["radius", "Corner radius (px)", 8],
  ].forEach(([name, label, def]) => {
    const { el } = field(label, "number", "Table " + label.toLowerCase());
    el.min = "0";
    el.step = "1";
    el.dataset.default = def;
    fields[name] = el;
  });
  [
    ["border", "Border color", "#d6dfd9"],
    ["headerBg", "Header background", "#e7eeea"],
    ["headerColor", "Header text color", "#263b35"],
    ["rowBg", "Row background", "#ffffff"],
    ["rowColor", "Row text color", "#263b35"],
    ["stripeBg", "Alternate row background", "#f2f7f3"],
  ].forEach(([name, label, def]) => {
    const { el, label: wrapper } = field(
      label,
      "color",
      "Table " + label.toLowerCase(),
    );
    wrapper.className = "color-field";
    el.dataset.default = def;
    fields[name] = el;
  });
  const stripeLabel = document.createElement("label");
  stripeLabel.className = "inline-toggle color-field";
  const stripe = document.createElement("input");
  stripe.type = "checkbox";
  stripe.setAttribute("aria-label", "Table alternate row colors");
  stripeLabel.append(stripe, document.createTextNode("Alternate row colors"));
  panel.append(stripeLabel);
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
        "Table settings saved in this browser.";
    } catch (e) {
      document.querySelector("#layout-save-status").textContent =
        "Table settings are visible but could not be saved.";
    }
  }
  function apply(i) {
    const p = pages[i],
      ui = p.querySelector(".ui"),
      main = ui.querySelector(".main"),
      c = state(i);
    ui.dataset.tableEditor = i;
    let wrapper = main.querySelector(".table-preview");
    if (!c.show) {
      if (wrapper) wrapper.remove();
      p.querySelector(".table-style-rules").textContent = "";
      return;
    }
    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.className = "table-preview";
      wrapper.innerHTML =
        '<h4 class="table-title">School schedule</h4><table aria-label="School schedule"><thead><tr><th scope="col">Activity</th><th scope="col">Day</th><th scope="col">Time</th></tr></thead><tbody><tr><td>Class meeting</td><td>Monday</td><td>09:00</td></tr><tr><td>Library visit</td><td>Wednesday</td><td>14:00</td></tr><tr><td>School assembly</td><td>Friday</td><td>10:00</td></tr></tbody></table>';
      main.append(wrapper);
    }
    const n = (k, d) =>
      Number.isFinite(Number(c[k])) && Number(c[k]) >= 0 ? Number(c[k]) : d;
    const col = (k, d) => (/^#[0-9a-f]{6}$/i.test(c[k] || "") ? c[k] : d);
    const pre = '.ui[data-table-editor="' + i + '"] .table-preview',
      bw = n("borderWidth", 1),
      pad = n("padding", 12);
    p.querySelector(".table-style-rules").textContent =
      pre +
      " {border:" +
      bw +
      "px solid " +
      col("border", "#d6dfd9") +
      ";border-radius:" +
      n("radius", 8) +
      "px}\n" +
      pre +
      " table {font-size:" +
      n("size", 14) +
      "px}\n" +
      pre +
      " .table-title {padding:" +
      pad +
      "px;margin:0}\n" +
      pre +
      " th, " +
      pre +
      " td {padding:" +
      pad +
      "px;border-bottom:" +
      bw +
      "px solid " +
      col("border", "#d6dfd9") +
      "}\n" +
      pre +
      " th {background:" +
      col("headerBg", "#e7eeea") +
      ";color:" +
      col("headerColor", "#263b35") +
      "}\n" +
      pre +
      " td {background:" +
      col("rowBg", "#ffffff") +
      ";color:" +
      col("rowColor", "#263b35") +
      "}\n" +
      (c.stripe
        ? pre +
          " tbody tr:nth-child(even) td {background:" +
          col("stripeBg", "#f2f7f3") +
          "}\n"
        : "");
  }
  function refresh() {
    const c = state(idx());
    show.checked = !!c.show;
    stripe.checked = !!c.stripe;
    for (const [name, el] of Object.entries(fields))
      el.value = c[name] ?? el.dataset.default;
  }
  function update() {
    let i = idx(),
      c = state(i);
    c.show = show.checked;
    c.stripe = stripe.checked;
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
  const reset = document.createElement("button");
  reset.type = "button";
  reset.textContent = "Reset table settings";
  reset.addEventListener("click", () => {
    let i = idx();
    delete data[i];
    apply(i);
    refresh();
    save();
  });
  panel.append(reset);
  show.addEventListener("change", update);
  stripe.addEventListener("change", update);
  Object.values(fields).forEach((el) => el.addEventListener("input", update));
  pages.forEach((p, i) => {
    let st = document.createElement("style");
    st.className = "table-style-rules";
    p.append(st);
    apply(i);
  });
  layout.addEventListener("change", refresh);
  document.querySelector("#prev").addEventListener("click", refresh);
  document.querySelector("#next").addEventListener("click", refresh);
  refresh();
  return { apply, refresh };
})();
