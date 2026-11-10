(() => {
  const KEY = "sheklei-design-playground-v1",
    keys = ["--nav", "--accent", "--soft", "--bg", "--ink", "--highlight"],
    names = [
      "Navigation",
      "Accent",
      "Supporting surface",
      "Background",
      "Text",
      "Highlight",
    ];
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch (e) {
    saved = {};
  }
  const panels = [...document.querySelectorAll(".direction")];
  panels.forEach((panel, index) => {
    const ui = panel.querySelector(".ui"),
      original = panel.querySelector(".palette");
    let tools = document.createElement("div");
    tools.className = "play-tools";
    tools.innerHTML =
      '<h3>Customize this design</h3><p>Choose colors for each part of the dashboard. Changes save automatically on this device.</p><div class="picker-grid"></div><button type="button">Reset this design</button>';
    original.before(tools);
    let grid = tools.querySelector(".picker-grid");
    function hex(v) {
      let c = document.createElement("span");
      c.style.color = v;
      document.body.append(c);
      let rgb = getComputedStyle(c).color.match(/\d+/g);
      c.remove();
      return rgb && rgb.length >= 3
        ? "#" +
            rgb
              .slice(0, 3)
              .map((x) => Number(x).toString(16).padStart(2, "0"))
              .join("")
        : "#000000";
    }
    let inputs = keys.map((key, i) => {
      let label = document.createElement("label");
      label.className = "picker";
      let input = document.createElement("input");
      input.type = "color";
      input.setAttribute("aria-label", names[i]);
      let title = document.createElement("span");
      title.textContent = names[i];
      let code = document.createElement("code");
      label.append(input, title, code);
      grid.append(label);
      input.addEventListener("input", () => {
        ui.style.setProperty(key, input.value);
        code.textContent = input.value.toUpperCase();
        saved[index] = saved[index] || {};
        saved[index][key] = input.value;
        try {
          localStorage.setItem(KEY, JSON.stringify(saved));
        } catch (e) {}
        if (key === "--nav") {
          let h = input.value.slice(1),
            r = parseInt(h.slice(0, 2), 16),
            g = parseInt(h.slice(2, 4), 16),
            b = parseInt(h.slice(4, 6), 16);
          ui.classList.add("palette-override");
          ui.classList.toggle(
            "palette-light",
            0.2126 * r + 0.7152 * g + 0.0722 * b > 150,
          );
          ui.classList.toggle(
            "palette-dark",
            0.2126 * r + 0.7152 * g + 0.0722 * b <= 150,
          );
        }
      });
      return { input, code, key };
    });
    function sync() {
      inputs.forEach(({ input, code, key }) => {
        input.value = hex(getComputedStyle(ui).getPropertyValue(key).trim());
        code.textContent = input.value.toUpperCase();
      });
    }
    if (saved[index])
      Object.entries(saved[index]).forEach(([k, v]) =>
        ui.style.setProperty(k, v),
      );
    sync();
    tools.querySelector("button").addEventListener("click", () => {
      delete saved[index];
      try {
        localStorage.setItem(KEY, JSON.stringify(saved));
      } catch (e) {}
      document
        .querySelector("#palette-select")
        .dispatchEvent(new Event("change"));
      panels.forEach((panel, i) => {
        if (saved[i])
          Object.entries(saved[i]).forEach(([k, v]) =>
            panel.querySelector(".ui").style.setProperty(k, v),
          );
      });
      panels.forEach((p) => p.dispatchEvent(new Event("palette-sync")));
    });
    panel.addEventListener("palette-sync", sync);
  });
  document.querySelector("#palette-select").addEventListener("change", () => {
    panels.forEach((p, i) => {
      if (saved[i])
        Object.entries(saved[i]).forEach(([k, v]) =>
          p.querySelector(".ui").style.setProperty(k, v),
        );
      p.dispatchEvent(new Event("palette-sync"));
    });
  });
})();
