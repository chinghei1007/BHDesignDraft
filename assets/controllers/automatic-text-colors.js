const automaticTextColorsController = (() => {
  const key = "sheklei-text-color-v1",
    pages = [...document.querySelectorAll(".direction")];
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(key) || "{}") || {};
  } catch (e) {}
  function toRgb(value) {
    const v = value.trim();
    let match = v.match(/^#([a-f0-9]{3}|[a-f0-9]{6})$/i);
    if (match) {
      let x = match[1];
      if (x.length === 3) x = [...x].map((c) => c + c).join("");
      return [0, 2, 4].map((i) => parseInt(x.slice(i, i + 2), 16));
    }
    match = v.match(/^rgba?\(\s*(\d+)[, ]+\s*(\d+)[, ]+\s*(\d+)/i);
    return match
      ? [Number(match[1]), Number(match[2]), Number(match[3])]
      : [255, 255, 255];
  }
  function foreground(background) {
    let rgb = toRgb(background).map((v) => {
      v /= 255;
      return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    let lum = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    return lum > 0.179 ? "#18291f" : "#ffffff";
  }
  function set(ui, key, value) {
    if (ui.style.getPropertyValue(key) !== value)
      ui.style.setProperty(key, value);
  }
  function save() {
    try {
      localStorage.setItem(key, JSON.stringify(saved));
      document.querySelector("#layout-save-status").textContent =
        "Text color saved in this browser.";
    } catch (e) {
      document.querySelector("#layout-save-status").textContent =
        "Text color is visible but could not be saved.";
    }
  }
  pages.forEach((page, i) => {
    const ui = page.querySelector(".ui"),
      tools = page.querySelector(".play-tools"),
      controls = document.createElement("div");
    controls.className = "text-color-controls";
    controls.innerHTML =
      '<strong>Text on page background</strong><p>Automatic chooses light or dark text to suit the background. Navigation, cards, updates and buttons adapt to their own backgrounds.</p><label><input type="checkbox" class="text-auto"> Choose text color automatically</label><label class="custom-text">Custom text color <input type="color" class="text-custom" value="#263b35" aria-label="Custom page text color"> <output></output></label>';
    tools.prepend(controls);
    let checkbox = controls.querySelector(".text-auto"),
      picker = controls.querySelector(".text-custom"),
      output = controls.querySelector("output");
    if (!saved[i]) {
      try {
        let old = JSON.parse(
          localStorage.getItem("sheklei-design-playground-v1") || "{}",
        );
        if (old[i] && old[i]["--ink"])
          saved[i] = { mode: "custom", color: old[i]["--ink"] };
      } catch (e) {}
    }
    function sync() {
      let record = saved[i] || {},
        auto = record.mode !== "custom";
      checkbox.checked = auto;
      picker.disabled = auto;
      if (record.color) picker.value = record.color;
      let styles = getComputedStyle(ui);
      let bg = styles.getPropertyValue("--bg"),
        nav = styles.getPropertyValue("--nav"),
        soft = styles.getPropertyValue("--soft"),
        accent = styles.getPropertyValue("--accent");
      let text = auto ? foreground(bg) : picker.value;
      set(ui, "--auto-page-text", text);
      set(ui, "--auto-nav-text", foreground(nav));
      set(ui, "--auto-panel-text", foreground("#ffffff"));
      set(ui, "--auto-soft-text", foreground(soft));
      set(ui, "--auto-accent-text", foreground(accent));
      output.textContent =
        text.toUpperCase() + (auto ? " · automatic" : " · custom");
    }
    checkbox.addEventListener("change", () => {
      saved[i] = {
        mode: checkbox.checked ? "auto" : "custom",
        color: picker.value,
      };
      sync();
      save();
    });
    picker.addEventListener("input", () => {
      saved[i] = { mode: "custom", color: picker.value };
      sync();
      save();
    });
    const oldPicker = tools.querySelector('input[aria-label="Text"]');
    if (oldPicker)
      oldPicker.addEventListener("input", () => {
        saved[i] = { mode: "custom", color: oldPicker.value };
        picker.value = oldPicker.value;
        sync();
        save();
      });
    new MutationObserver(sync).observe(ui, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });
    sync();
  });
  return { set };
})();
