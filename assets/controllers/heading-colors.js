(() => {
  const key = "sheklei-heading-colors-v1",
    pages = [...document.querySelectorAll(".direction")];
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(key) || "{}") || {};
  } catch (e) {}
  const options = [
    ["heading-1", "Main heading / H1"],
    ["heading-2", "Heading level 2"],
    ["heading-3", "Heading level 3"],
    ["heading-4", "Heading level 4"],
    ["muted", "Muted text"],
  ];
  function save() {
    try {
      localStorage.setItem(key, JSON.stringify(saved));
      document.querySelector("#layout-save-status").textContent =
        "Heading colors saved in this browser.";
    } catch (e) {
      document.querySelector("#layout-save-status").textContent =
        "Heading colors are visible but could not be saved.";
    }
  }
  pages.forEach((page, i) => {
    const ui = page.querySelector(".ui"),
      tools = page.querySelector(".play-tools"),
      box = document.createElement("div");
    box.className = "heading-color-controls";
    let heading = document.createElement("strong");
    heading.textContent = "Heading and muted text colors";
    let note = document.createElement("p");
    note.textContent =
      "Auto inherits a readable color from the surrounding surface. Some heading levels appear only in certain layouts.";
    box.append(heading, note);
    options.forEach(([name, title]) => {
      const row = document.createElement("label");
      row.className = "heading-color-row";
      const label = document.createElement("span");
      label.textContent = title;
      const mode = document.createElement("select");
      mode.setAttribute("aria-label", title + " color mode");
      for (const [value, text] of [
        ["auto", "Auto"],
        ["custom", "Custom"],
      ]) {
        const o = document.createElement("option");
        o.value = value;
        o.textContent = text;
        mode.append(o);
      }
      const color = document.createElement("input");
      color.type = "color";
      color.value = "#263b35";
      color.setAttribute("aria-label", title + " color");
      let val = (saved[i] || {})[name];
      mode.value = val ? "custom" : "auto";
      if (val) color.value = val;
      color.disabled = !val;
      if (val) ui.style.setProperty("--custom-" + name, val);
      function update() {
        saved[i] = saved[i] || {};
        if (mode.value === "custom") {
          saved[i][name] = color.value;
          ui.style.setProperty("--custom-" + name, color.value);
        } else {
          delete saved[i][name];
          ui.style.removeProperty("--custom-" + name);
        }
        color.disabled = mode.value !== "custom";
        save();
      }
      mode.addEventListener("change", update);
      color.addEventListener("input", update);
      row.append(label, mode, color);
      box.append(row);
    });
    tools.querySelector(".text-color-controls").after(box);
  });
})();
