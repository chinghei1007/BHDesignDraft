const shadowEditorController = (() => {
  const key = "sheklei-container-shadow-v1",
    pages = [...document.querySelectorAll(".direction")],
    layout = document.querySelector("#layout-select"),
    container = document.querySelector("#container-select"),
    host = document.createElement("div");
  host.className = "shadow-settings extra-settings";
  document.querySelector("#spacing-editor").after(host);
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(key) || "{}") || {};
  } catch (e) {}
  const selectors = {
    main: ".main",
    navigation: ".nav",
    columns: ".columns",
    cards: ".panel",
    rows: ".row",
    update: ".update",
    links: ".links",
  };
  function index() {
    return Number(layout.value) || 0;
  }
  function save() {
    try {
      localStorage.setItem(key, JSON.stringify(saved));
      document.querySelector("#layout-save-status").textContent =
        "Container shadow saved in this browser.";
    } catch (e) {
      document.querySelector("#layout-save-status").textContent =
        "Shadow is visible but could not be saved.";
    }
  }
  function apply(i) {
    const ui = pages[i].querySelector(".ui"),
      styles = pages[i].querySelector(".shadow-style-rules");
    let css = "";
    Object.entries(saved[i] || {}).forEach(([name, c]) => {
      if (!selectors[name] || !c || !["none", "custom"].includes(c.mode))
        return;
      let value = "none";
      if (c.mode === "custom") {
        let values = ["x", "y", "blur", "spread"].map((k) => Number(c[k]));
        if (
          values.some((v) => !Number.isFinite(v)) ||
          values[2] < 0 ||
          !/^#[0-9a-f]{6}$/i.test(c.color) ||
          !Number.isFinite(Number(c.opacity))
        )
          return;
        let h = c.color.slice(1),
          rgb = [0, 2, 4].map((n) => parseInt(h.slice(n, n + 2), 16));
        value =
          values.map((n) => n + "px").join(" ") +
          " rgba(" +
          rgb.join(",") +
          "," +
          Math.min(1, Math.max(0, Number(c.opacity) / 100)) +
          ")";
      }
      if (CSS.supports("box-shadow", value))
        css +=
          '.ui[data-shadow-editor="' +
          i +
          '"] ' +
          selectors[name] +
          " {box-shadow:" +
          value +
          " !important}\n";
    });
    ui.dataset.shadowEditor = i;
    styles.textContent = css;
  }
  pages.forEach((p, i) => {
    const style = document.createElement("style");
    style.className = "shadow-style-rules";
    p.append(style);
    apply(i);
  });
  function refresh() {
    host.replaceChildren();
    const i = index(),
      name = container.value,
      c = (saved[i] || {})[name] || {},
      title = document.createElement("strong");
    title.textContent = "Drop shadow";
    host.append(title);
    const grid = document.createElement("div");
    grid.className = "extra-grid";
    host.append(grid);
    function field(labelText, type, aria) {
      const label = document.createElement("label");
      label.textContent = labelText;
      let el = document.createElement(type);
      el.setAttribute("aria-label", aria);
      label.append(el);
      grid.append(label);
      return el;
    }
    const mode = field("Shadow", "select", "Container shadow mode");
    mode.parentElement.className = "wide";
    [
      ["default", "Layout default"],
      ["none", "None"],
      ["custom", "Custom"],
    ].forEach(([v, t]) => mode.add(new Option(t, v)));
    mode.value = c.mode || "default";
    const inputs = {};
    [
      ["x", "Horizontal offset (px)", 0],
      ["y", "Vertical offset (px)", 4],
      ["blur", "Blur (px)", 12],
      ["spread", "Spread (px)", 0],
      ["opacity", "Opacity (%)", 20],
    ].forEach(([name, label, def]) => {
      let el = field(label, "input", "Container shadow " + name);
      el.type = "number";
      el.step = "1";
      if (name === "blur" || name === "opacity") el.min = "0";
      if (name === "opacity") el.max = "100";
      el.value = c[name] ?? def;
      inputs[name] = el;
    });
    const color = field("Shadow color", "input", "Container shadow color");
    color.type = "color";
    color.value = c.color || "#000000";
    inputs.color = color;
    function update() {
      let val = { mode: mode.value };
      for (const [name, el] of Object.entries(inputs)) {
        if (name === "color") {
          val.color = el.value;
          continue;
        }
        let n = Number(el.value);
        if (
          el.value === "" ||
          !Number.isFinite(n) ||
          (name === "blur" && n < 0) ||
          (name === "opacity" && (n < 0 || n > 100))
        )
          return;
        val[name] = n;
      }
      saved[i] = saved[i] || {};
      if (val.mode === "default") delete saved[i][name];
      else saved[i][name] = val;
      Object.values(inputs).forEach(
        (el) => (el.disabled = val.mode !== "custom"),
      );
      apply(i);
      save();
    }
    mode.addEventListener("change", update);
    Object.values(inputs).forEach((el) => el.addEventListener("input", update));
    Object.values(inputs).forEach(
      (el) => (el.disabled = mode.value !== "custom"),
    );
  }
  container.addEventListener("change", refresh);
  layout.addEventListener("change", refresh);
  document.querySelector("#prev").addEventListener("click", refresh);
  document.querySelector("#next").addEventListener("click", refresh);
  document.querySelector("#reset-layout").addEventListener("click", () => {
    let i = index();
    delete saved[i];
    apply(i);
    save();
    refresh();
  });
  refresh();
  return { apply, refresh };
})();
