const layoutEditorController = (() => {
  const storageKey = "sheklei-design-layout-v1";
  const definitions = [
    ["xs", 12],
    ["sm", 14],
    ["base", 16],
    ["lg", 18],
    ["xl", 20],
    ["2xl", 24],
    ["3xl", 30],
  ];
  const containers = {
    main: ".main",
    navigation: ".nav",
    columns: ".columns",
    cards: ".panel",
    rows: ".row",
    update: ".update",
    links: ".links",
  };
  const pages = Array.from(document.querySelectorAll(".direction"));
  const selector = document.querySelector("#layout-select");
  const container = document.querySelector("#container-select");
  const typeEditor = document.querySelector("#type-editor");
  const spacingEditor = document.querySelector("#spacing-editor");
  const status = document.querySelector("#layout-save-status");
  let data = {};
  let storageAvailable = true;
  try {
    data = JSON.parse(localStorage.getItem(storageKey) || "{}") || {};
  } catch (e) {
    data = {};
    storageAvailable = false;
  }
  function getIndex() {
    return Number(selector.value) || 0;
  }
  function state(i = getIndex()) {
    if (!data[i]) data[i] = { font: {}, spacing: {} };
    data[i].font = data[i].font || {};
    data[i].spacing = data[i].spacing || {};
    return data[i];
  }
  function save() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
      status.textContent = "Saved in this browser.";
      storageAvailable = true;
    } catch (e) {
      storageAvailable = false;
      status.textContent =
        "Changes are visible, but this browser could not save them.";
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
      : value !== undefined && value !== null && value !== ""
        ? { all: value }
        : {};
  }
  function apply(i) {
    const page = pages[i],
      ui = page.querySelector(".ui"),
      d = state(i);
    definitions.forEach(([name, def]) => {
      let v = Number(d.font[name]);
      ui.style.setProperty(
        "--ed-" + name,
        (Number.isFinite(v) && v >= 8 && v <= 96 ? v : def) + "px",
      );
    });
    Object.entries(containers).forEach(([name, sel]) => {
      const cfg = d.spacing[name] || {};
      ui.querySelectorAll(sel).forEach((el) => {
        ["padding", "margin"].forEach((prop) => {
          el.style.removeProperty(prop);
          Object.entries(spacingModes).forEach(([mode, sides]) => {
            const val = spacingMap(cfg[prop])[mode],
              num = Number(val);
            if (
              val !== undefined &&
              val !== "" &&
              Number.isFinite(num) &&
              num >= 0 &&
              num <= 24
            )
              sides.forEach((side) =>
                el.style.setProperty(
                  prop + (side ? "-" + side : ""),
                  num * 0.25 + "rem",
                ),
              );
          });
        });
        let gap = cfg.gap;
        if (
          gap !== undefined &&
          gap !== "" &&
          Number.isFinite(Number(gap)) &&
          Number(gap) >= 0 &&
          Number(gap) <= 24
        ) {
          el.style.setProperty("gap", Number(gap) * 0.25 + "rem");
          el.setAttribute("data-editor-gap", "");
          el.style.setProperty("--editor-gap", Number(gap) * 0.25 + "rem");
        } else {
          el.style.removeProperty("gap");
          el.removeAttribute("data-editor-gap");
          el.style.removeProperty("--editor-gap");
        }
      });
    });
  }
  function buildType() {
    typeEditor.replaceChildren();
    const d = state();
    definitions.forEach(([name, def]) => {
      const label = document.createElement("label");
      label.className = "type-field";
      const title = document.createElement("span");
      title.textContent = "text-" + name;
      const input = document.createElement("input");
      input.type = "number";
      input.min = "8";
      input.max = "96";
      input.step = "1";
      input.value = d.font[name] ?? def;
      input.setAttribute("aria-label", "text-" + name + " size in pixels");
      input.addEventListener("input", () => {
        if (input.value === "") return;
        const num = Number(input.value);
        if (!Number.isFinite(num) || num < 8 || num > 96) {
          input.setCustomValidity("Choose a size between 8 and 96 pixels.");
          return;
        }
        input.setCustomValidity("");
        state().font[name] = num;
        apply(getIndex());
        save();
      });
      label.append(title, input);
      typeEditor.append(label);
    });
  }
  const steps = [
    0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20,
    24,
  ];
  function buildSpacing() {
    spacingEditor.replaceChildren();
    const name = container.value;
    const cfg = state().spacing[name] || {};
    ["padding", "gap", "margin"].forEach((prop) => {
      const label = document.createElement("label");
      label.className = "space-field";
      const title = document.createElement("span");
      title.textContent = prop.charAt(0).toUpperCase() + prop.slice(1);
      label.append(title);
      let mode;
      if (prop !== "gap") {
        mode = document.createElement("select");
        mode.setAttribute("aria-label", prop + " sides for " + name);
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
        label.append(mode);
      }
      const select = document.createElement("select");
      select.setAttribute("aria-label", prop + " for " + name);
      select.add(new Option("Default for this layout", ""));
      steps.forEach((step) =>
        select.add(
          new Option(
            (prop === "padding" ? "p" : prop === "margin" ? "m" : "gap") +
              "-" +
              step +
              " · " +
              step * 4 +
              "px",
            String(step),
          ),
        ),
      );
      function refreshValue() {
        let current = state().spacing[name] || {};
        select.value =
          prop === "gap"
            ? (current.gap ?? "")
            : (spacingMap(current[prop])[mode.value] ?? "");
      }
      if (mode) mode.addEventListener("change", refreshValue);
      select.addEventListener("change", () => {
        let d = state();
        d.spacing[name] = d.spacing[name] || {};
        let c = d.spacing[name];
        if (prop === "gap") {
          if (select.value === "") delete c.gap;
          else c.gap = select.value;
        } else {
          c[prop] = { ...spacingMap(c[prop]) };
          if (select.value === "") delete c[prop][mode.value];
          else c[prop][mode.value] = select.value;
        }
        apply(getIndex());
        save();
      });
      label.append(select);
      spacingEditor.append(label);
      refreshValue();
    });
  }
  function refresh() {
    const i = getIndex();
    document.querySelector("#editor-current").textContent =
      "Editing: " + pages[i].dataset.label;
    buildType();
    buildSpacing();
    status.textContent = storageAvailable
      ? "Changes save in this browser."
      : "Storage is unavailable in this browser.";
  }
  pages.forEach((_, i) => apply(i));
  refresh();
  container.addEventListener("change", buildSpacing);
  selector.addEventListener("change", refresh);
  document.querySelector("#prev").addEventListener("click", refresh);
  document.querySelector("#next").addEventListener("click", refresh);
  document.querySelector("#reset-layout").addEventListener("click", () => {
    const i = getIndex();
    delete data[i];
    apply(i);
    save();
    refresh();
  });
  return { apply, refresh };
})();
