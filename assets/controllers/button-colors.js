(() => {
  const key = "sheklei-button-colors-v1",
    pages = [...document.querySelectorAll(".direction")];
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(key) || "{}") || {};
  } catch (e) {}
  function fg(hex) {
    let h = hex.slice(1);
    let rgb = [0, 2, 4]
      .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
      .map((v) =>
        v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4),
      );
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2] > 0.179
      ? "#18291f"
      : "#ffffff";
  }
  function save() {
    try {
      localStorage.setItem(key, JSON.stringify(saved));
      document.querySelector("#layout-save-status").textContent =
        "Button color saved in this browser.";
    } catch (e) {
      document.querySelector("#layout-save-status").textContent =
        "Button color is visible but could not be saved.";
    }
  }
  pages.forEach((page, i) => {
    const ui = page.querySelector(".ui"),
      box = document.createElement("div");
    box.className = "button-color-controls";
    box.innerHTML =
      '<strong>Button settings</strong><p>Choose a custom button background or use the palette accent. Button text adjusts automatically.</p><label><input type="checkbox" class="button-custom"> Custom button background <input type="color" class="button-picker" value="#08766f" aria-label="Button background color"></label>';
    page.querySelector(".heading-color-controls").after(box);
    const toggle = box.querySelector(".button-custom"),
      picker = box.querySelector(".button-picker");
    if (saved[i]) picker.value = saved[i];
    toggle.checked = !!saved[i];
    picker.disabled = !toggle.checked;
    function apply() {
      picker.disabled = !toggle.checked;
      if (toggle.checked) {
        ui.style.setProperty("--custom-button-bg", picker.value);
        ui.style.setProperty("--custom-button-text", fg(picker.value));
      } else {
        ui.style.removeProperty("--custom-button-bg");
        ui.style.removeProperty("--custom-button-text");
      }
    }
    toggle.addEventListener("change", () => {
      if (toggle.checked) saved[i] = picker.value;
      else delete saved[i];
      apply();
      save();
    });
    picker.addEventListener("input", () => {
      saved[i] = picker.value;
      apply();
      save();
    });
    apply();
  });
})();
