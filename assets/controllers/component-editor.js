const componentEditorController = (() => {
  const key = "sheklei-component-styles-v1",
    pages = [...document.querySelectorAll(".direction")];
  let data = {};
  try {
    data = JSON.parse(localStorage.getItem(key) || "{}") || {};
  } catch (e) {}
  const props = {
    background: "background-color",
    color: "color",
    size: "font-size",
    weight: "font-weight",
    radius: "border-radius",
    padding: "padding",
  };
  function state(i) {
    return data[i] || (data[i] = { button: {}, navbar: {} });
  }
  function save() {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      document.querySelector("#layout-save-status").textContent =
        "Button and navigation styles saved in this browser.";
    } catch (e) {
      document.querySelector("#layout-save-status").textContent =
        "Changes are visible but could not be saved.";
    }
  }
  function path(el, ui, prefix) {
    let parts = [];
    while (el !== ui) {
      parts.unshift(
        el.tagName.toLowerCase() +
          ":nth-child(" +
          (Array.prototype.indexOf.call(el.parentElement.children, el) + 1) +
          ")",
      );
      el = el.parentElement;
    }
    return prefix + " > " + parts.join(" > ");
  }
  function makeRule(selector, cfg) {
    let declarations = "";
    for (const [key, prop] of Object.entries(props)) {
      let value = cfg[key];
      if (value && CSS.supports(prop, value))
        declarations += prop + ":" + value + " !important;";
    }
    if (cfg.border && CSS.supports("border-color", cfg.border))
      declarations += "border:1px solid " + cfg.border + " !important;";
    return declarations ? selector + "{" + declarations + "}\n" : "";
  }
  pages.forEach((page, i) => {
    const ui = page.querySelector(".ui");
    ui.dataset.componentEditor = i;
    const prefix = '.ui[data-component-editor="' + i + '"]',
      styles = document.createElement("style");
    styles.className = "component-style-rules";
    page.append(styles);
    const buttons = [...ui.querySelectorAll(".cta, button")],
      items = [...ui.querySelectorAll(".nav .item")];
    function apply() {
      const d = state(i);
      let css = "";
      const button = d.button || {},
        nav = d.navbar || {};
      css += makeRule(
        prefix + " .cta, " + prefix + " button",
        button.global || {},
      );
      buttons.forEach((el, n) => {
        css += makeRule(path(el, ui, prefix), (button.items || {})[n] || {});
      });
      css += makeRule(prefix + " .nav", nav.global || {});
      const navFont = nav.global || {};
      let textOnly = {};
      ["color", "size", "weight"].forEach((k) => {
        if (navFont[k]) textOnly[k] = navFont[k];
      });
      css += makeRule(prefix + " .nav .item", textOnly);
      items.forEach((el, n) => {
        css += makeRule(path(el, ui, prefix), (nav.items || {})[n] || {});
      });
      styles.textContent = css;
    }
    function createPanel(kind, title, elements, anchor) {
      const box = document.createElement("div");
      box.className = "component-controls";
      const h = document.createElement("strong");
      h.textContent = title;
      const info = document.createElement("p");
      info.textContent =
        kind === "button"
          ? "Set defaults for all preview buttons, then override individual buttons. These controls override the base settings above."
          : "Set the navigation bar style, then override individual navigation items. Container spacing remains available in Layout settings.";
      box.append(h, info);
      const fields = document.createElement("div");
      fields.className = "component-fields";
      box.append(fields);
      function field(labelText, type, aria) {
        const label = document.createElement("label");
        label.textContent = labelText;
        const el = document.createElement(type);
        el.setAttribute("aria-label", aria);
        label.append(el);
        fields.append(label);
        return el;
      }
      const scope = field("Apply to", "select", title + " apply to");
      scope.parentElement.className = "wide";
      scope.add(
        new Option(
          kind === "button" ? "All buttons" : "Navigation bar",
          "global",
        ),
      );
      elements.forEach((el, n) =>
        scope.add(
          new Option(
            el.textContent.trim().replace(/\s+/g, " ").slice(0, 55) ||
              "Item " + (n + 1),
            String(n),
          ),
        ),
      );
      const colorInputs = {};
      for (const [name, label] of [
        ["background", "Background"],
        ["border", "Border color"],
        ["color", "Font color"],
      ]) {
        const wrapper = document.createElement("label");
        wrapper.className = "color-field";
        wrapper.textContent = label;
        const sub = document.createElement("span");
        sub.className = "color-setting";
        const toggle = document.createElement("input");
        toggle.type = "checkbox";
        toggle.setAttribute(
          "aria-label",
          title + " custom " + label.toLowerCase(),
        );
        const picker = document.createElement("input");
        picker.type = "color";
        picker.value = "#263b35";
        picker.setAttribute("aria-label", title + " " + label.toLowerCase());
        sub.append(toggle, document.createTextNode("Custom"), picker);
        wrapper.append(sub);
        fields.append(wrapper);
        colorInputs[name] = { toggle, picker };
      }
      const size = field("Font size (px)", "input", title + " font size");
      size.type = "number";
      size.min = "1";
      size.step = "1";
      size.placeholder = "Default";
      const weight = field("Font weight", "select", title + " font weight");
      [
        ["", "Default"],
        ["400", "Regular"],
        ["700", "Bold"],
      ].forEach(([v, l]) => weight.add(new Option(l, v)));
      const radius = field("Border radius", "input", title + " border radius");
      radius.type = "number";
      radius.min = "0";
      radius.step = "0.5";
      radius.placeholder = "Default";
      const unit = field("Radius unit", "select", title + " radius unit");
      ["px", "%", "rem", "em"].forEach((v) => unit.add(new Option(v, v)));
      const padding = field("Padding (px)", "input", title + " padding");
      padding.type = "number";
      padding.min = "0";
      padding.step = "1";
      padding.placeholder = "Default";
      function config() {
        const d = state(i);
        d[kind] = d[kind] || {};
        if (scope.value === "global")
          return d[kind].global || (d[kind].global = {});
        d[kind].items = d[kind].items || {};
        return d[kind].items[scope.value] || (d[kind].items[scope.value] = {});
      }
      function refresh() {
        let c = config();
        for (const [name, { toggle, picker }] of Object.entries(colorInputs)) {
          toggle.checked = !!c[name];
          picker.disabled = !toggle.checked;
          picker.value = c[name] || "#263b35";
        }
        size.value = c.size ? parseFloat(c.size) : "";
        weight.value = c.weight || "";
        let m = (c.radius || "").match(/^(\d*\.?\d+)(px|%|rem|em)$/);
        radius.value = m ? m[1] : "";
        unit.value = m ? m[2] : "px";
        padding.value = c.padding ? parseFloat(c.padding) : "";
      }
      function update() {
        let c = config();
        for (const [name, { toggle, picker }] of Object.entries(colorInputs)) {
          if (toggle.checked) c[name] = picker.value;
          else delete c[name];
          picker.disabled = !toggle.checked;
        }
        if (size.value !== "" && Number(size.value) > 0)
          c.size = Number(size.value) + "px";
        else delete c.size;
        if (weight.value) c.weight = weight.value;
        else delete c.weight;
        if (radius.value !== "" && Number(radius.value) >= 0)
          c.radius = Number(radius.value) + unit.value;
        else delete c.radius;
        if (padding.value !== "" && Number(padding.value) >= 0)
          c.padding = Number(padding.value) + "px";
        else delete c.padding;
        apply();
        save();
      }
      scope.addEventListener("change", refresh);
      for (const { toggle, picker } of Object.values(colorInputs)) {
        toggle.addEventListener("change", update);
        picker.addEventListener("input", update);
      }
      [size, radius, padding].forEach((e) =>
        e.addEventListener("input", update),
      );
      [weight, unit].forEach((e) => e.addEventListener("change", update));
      const reset = document.createElement("button");
      reset.type = "button";
      reset.textContent =
        "Reset selected " +
        (kind === "button" ? "button style" : "navigation style");
      reset.addEventListener("click", () => {
        let d = state(i)[kind];
        if (scope.value === "global") delete d.global;
        else delete d.items[scope.value];
        refresh();
        apply();
        save();
      });
      box.append(reset);
      anchor.after(box);
      refresh();
      return box;
    }
    const buttonPanel = createPanel(
      "button",
      "Button styles",
      buttons,
      page.querySelector(".button-color-controls"),
    );
    createPanel("navbar", "Navigation styles", items, buttonPanel);
    apply();
  });
  return { makeRule };
})();
