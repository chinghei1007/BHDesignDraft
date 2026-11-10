const elementEditorController = (() => {
  const key = "sheklei-element-styles-v1",
    pages = [...document.querySelectorAll(".direction")],
    layout = document.querySelector("#layout-select"),
    container = document.querySelector("#container-select"),
    status = document.querySelector("#layout-save-status");
  let data = {};
  try {
    data = JSON.parse(localStorage.getItem(key) || "{}") || {};
  } catch (e) {}
  const targets = {
    "heading-1": ["Main heading / H1", ".main h1, .main > h3"],
    "heading-2": ["Heading level 2", ".main h2, .panel h4"],
    "heading-3": [
      "Heading level 3",
      ".main h3:not(:first-of-type):not(.main > h3)",
    ],
    "heading-4": ["Heading level 4", ".main h4:not(.panel h4)"],
    body: ["Body paragraphs", ".main p:not(.sub), .update"],
    muted: ["Muted text", ".main .sub, .main small, .main .bar"],
    navigation: ["Navigation text", ".nav .item"],
    links: ["Quick link text", ".links span"],
    list: ["List item text", ".main li"],
    button: ["Button text", ".cta"],
  };
  const containers = {
    main: ".main",
    navigation: ".nav",
    columns: ".columns",
    cards: ".panel",
    rows: ".row",
    update: ".update",
    links: ".links",
  };
  const steps = [
    0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20,
    24,
  ];
  function state(i) {
    return data[i] || (data[i] = {});
  }
  function save() {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      status.textContent = "Element styles saved in this browser.";
    } catch (e) {
      status.textContent = "Element styles are visible but could not be saved.";
    }
  }
  const spacingModes = {
    all: [""],
    horizontal: ["left", "right"],
    vertical: ["top", "bottom"],
    top: ["top"],
    right: ["right"],
    bottom: ["bottom"],
    left: ["left"],
  };
  function spacingMap(value) {
    return value && typeof value === "object"
      ? value
      : value
        ? { all: value }
        : {};
  }
  function rule(selectors, prop, value) {
    if (!value || !CSS.supports(prop, value)) return "";
    const probe = document.createElement("span");
    probe.style.setProperty(prop, value);
    if (!probe.style.getPropertyValue(prop)) return "";
    return (
      selectors +
      "{" +
      prop +
      ":" +
      probe.style.getPropertyValue(prop) +
      " !important}\n"
    );
  }
  function apply(i) {
    const ui = pages[i].querySelector(".ui"),
      d = state(i),
      prefix = '.ui[data-element-editor="' + i + '"]';
    let css = "";
    ui.dataset.elementEditor = i;
    if (d.globalFont)
      css += rule(prefix + "," + prefix + " *", "font-family", d.globalFont);
    Object.entries(targets).forEach(([name, [, selectors]]) => {
      let t = (d.targets || {})[name] || {};
      let scoped = selectors
        .split(",")
        .map((s) => prefix + " " + s.trim())
        .join(",");
      Object.entries({
        size: "font-size",
        lineHeight: "line-height",
        font: "font-family",
      }).forEach(([field, prop]) => (css += rule(scoped, prop, t[field])));
      ["padding", "margin"].forEach((prop) =>
        Object.entries(spacingModes).forEach(([mode, sides]) =>
          sides.forEach(
            (side) =>
              (css += rule(
                scoped,
                prop + (side ? "-" + side : ""),
                spacingMap(t[prop])[mode],
              )),
          ),
        ),
      );
    });
    Object.entries(d.radii || {}).forEach(([name, value]) => {
      let selector = name === "button" ? ".cta" : containers[name];
      if (selector)
        css += rule(prefix + " " + selector, "border-radius", value);
    });
    pages[i].querySelector(".element-style-rules").textContent = css;
  }
  function field(parent, labelText, kind, aria) {
    const label = document.createElement("label");
    label.textContent = labelText;
    const el = document.createElement(kind);
    el.setAttribute("aria-label", aria);
    label.append(el);
    parent.append(label);
    return el;
  }
  function radiusEditor(parent, i, getName) {
    const wrap = document.createElement("div");
    wrap.className = "radius-editor";
    wrap.innerHTML = '<span class="radius-title">Border radius</span>';
    const value = field(wrap, "Value", "input", "Border radius value");
    value.type = "number";
    value.min = "0";
    value.step = "0.5";
    value.placeholder = "Default";
    const unit = field(wrap, "Unit", "select", "Border radius unit");
    ["px", "%", "rem", "em"].forEach((v) => unit.add(new Option(v, v)));
    parent.append(wrap);
    function refresh() {
      const val = ((state(i).radii || {})[getName()] || "").match(
        /^(\d*\.?\d+)(px|%|rem|em)$/,
      );
      value.value = val ? val[1] : "";
      unit.value = val ? val[2] : "px";
      value.setAttribute("aria-label", getName() + " border radius value");
      unit.setAttribute("aria-label", getName() + " border radius unit");
    }
    function change() {
      let d = state(i);
      d.radii = d.radii || {};
      let n = Number(value.value);
      if (value.value === "" || !Number.isFinite(n) || n < 0) {
        delete d.radii[getName()];
      } else d.radii[getName()] = n + unit.value;
      apply(i);
      save();
    }
    value.addEventListener("input", change);
    unit.addEventListener("change", change);
    refresh();
    return refresh;
  }
  pages.forEach((page, i) => {
    const box = page.querySelector(".heading-color-controls");
    box.querySelector("strong").textContent = "Heading and text styles";
    const style = document.createElement("style");
    style.className = "element-style-rules";
    page.append(style);
    const description = document.createElement("p");
    description.className = "element-description";
    description.textContent =
      "Set type and spacing for each text role. Individual sides override horizontal, vertical and all-side values. Blank fields use the layout default.";
    box.append(description);
    const fields = document.createElement("div");
    fields.className = "element-style-fields";
    box.append(fields);
    const global = field(
      fields,
      "Global font family",
      "input",
      "Global font family",
    );
    global.placeholder = "Layout default, e.g. Arial, sans-serif";
    global.parentElement.className = "wide";
    global.value = state(i).globalFont || "";
    global.addEventListener("input", () => {
      let v = global.value.trim();
      if (v && !CSS.supports("font-family", v)) {
        global.setCustomValidity("Enter a valid CSS font family.");
        return;
      }
      global.setCustomValidity("");
      state(i).globalFont = v;
      apply(i);
      save();
    });
    const target = field(fields, "Text role", "select", "Text role");
    target.parentElement.className = "wide";
    Object.entries(targets).forEach(([name, [label]]) =>
      target.add(new Option(label, name)),
    );
    const size = field(
      fields,
      "Font size (px)",
      "input",
      "Text role font size in pixels",
    );
    size.type = "number";
    size.min = "1";
    size.step = "1";
    size.placeholder = "Default";
    const line = field(fields, "Line height", "input", "Text role line height");
    line.type = "number";
    line.min = "0.1";
    line.step = "0.1";
    line.placeholder = "Default";
    const font = field(fields, "Font family", "input", "Text role font family");
    font.placeholder = "Inherit global font";
    font.parentElement.className = "wide";
    function spacingControl(prop) {
      const mode = field(
        fields,
        prop + " sides",
        "select",
        "Text role " + prop.toLowerCase() + " sides",
      );
      Object.keys(spacingModes).forEach((key) =>
        mode.add(
          new Option(
            key === "all"
              ? "All sides"
              : key.charAt(0).toUpperCase() + key.slice(1),
            key,
          ),
        ),
      );
      const value = field(
        fields,
        prop + " value",
        "select",
        "Text role " + prop.toLowerCase(),
      );
      value.add(new Option("Layout default", ""));
      steps.forEach((n) =>
        value.add(new Option(n + " · " + n * 4 + "px", n * 0.25 + "rem")),
      );
      return { mode, value, key: prop.toLowerCase() };
    }
    const spacing = [spacingControl("Padding"), spacingControl("Margin")];
    function refreshSpacing(control) {
      const t = (state(i).targets || {})[target.value] || {};
      control.value.value =
        spacingMap(t[control.key])[control.mode.value] ?? "";
    }
    function refresh() {
      const t = (state(i).targets || {})[target.value] || {};
      size.value = t.size ? parseFloat(t.size) : "";
      line.value = t.lineHeight || "";
      font.value = t.font || "";
      spacing.forEach(refreshSpacing);
    }
    function change() {
      const d = state(i);
      d.targets = d.targets || {};
      const t = d.targets[target.value] || (d.targets[target.value] = {});
      const n = Number(size.value),
        l = Number(line.value);
      t.size = size.value && n > 0 ? n + "px" : "";
      t.lineHeight = line.value && l > 0 ? String(l) : "";
      let f = font.value.trim();
      if (f && !CSS.supports("font-family", f)) {
        font.setCustomValidity("Enter a valid CSS font family.");
      } else {
        font.setCustomValidity("");
        t.font = f;
      }
      apply(i);
      save();
    }
    target.addEventListener("change", refresh);
    [size, line, font].forEach((el) => el.addEventListener("input", change));
    spacing.forEach((control) => {
      control.mode.addEventListener("change", () => refreshSpacing(control));
      control.value.addEventListener("change", () => {
        const d = state(i);
        d.targets = d.targets || {};
        const t = d.targets[target.value] || (d.targets[target.value] = {});
        t[control.key] = { ...spacingMap(t[control.key]) };
        if (control.value.value === "")
          delete t[control.key][control.mode.value];
        else t[control.key][control.mode.value] = control.value.value;
        apply(i);
        save();
      });
    });
    const reset = document.createElement("button");
    reset.type = "button";
    reset.className = "element-reset";
    reset.textContent = "Reset selected text role";
    reset.addEventListener("click", () => {
      delete (state(i).targets || {})[target.value];
      refresh();
      apply(i);
      save();
    });
    box.append(reset);
    refresh();
    const refreshButtonRadius = radiusEditor(
      page.querySelector(".button-color-controls"),
      i,
      () => "button",
    );
    page.addEventListener("element-style-reset", () => {
      global.value = "";
      target.value = "heading-1";
      refresh();
      refreshButtonRadius();
      apply(i);
    });
    apply(i);
  });
  let currentRadiusRefresh = () => {};
  const radiusHost = document.createElement("div");
  document.querySelector("#spacing-editor").after(radiusHost);
  function refreshContainerRadius() {
    radiusHost.replaceChildren();
    const i = Number(layout.value) || 0;
    currentRadiusRefresh = radiusEditor(radiusHost, i, () => container.value);
  }
  container.addEventListener("change", () => currentRadiusRefresh());
  layout.addEventListener("change", refreshContainerRadius);
  document
    .querySelector("#prev")
    .addEventListener("click", refreshContainerRadius);
  document
    .querySelector("#next")
    .addEventListener("click", refreshContainerRadius);
  document.querySelector("#reset-layout").addEventListener("click", () => {
    const i = Number(layout.value) || 0;
    delete data[i];
    pages[i].dispatchEvent(new Event("element-style-reset"));
    refreshContainerRadius();
    save();
  });
  refreshContainerRadius();
  return { apply, refreshContainerRadius };
})();
