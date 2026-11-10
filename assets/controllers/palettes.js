const palettesController = (() => {
  const palettes = {
    sage: [
      "Soft sage",
      "#e7eeea",
      "#f7f9f6",
      "#283b38",
      "#42736a",
      "#e7f0e9",
      "light",
    ],
    coastal: [
      "Coastal blue",
      "#e0edf3",
      "#f5fafb",
      "#263e4b",
      "#326d87",
      "#e2f1f4",
      "light",
    ],
    lavender: [
      "Lavender and plum",
      "#eee9f3",
      "#faf8fb",
      "#40364a",
      "#735687",
      "#f0e8f2",
      "light",
    ],
    sand: [
      "Warm sand",
      "#f1e9dc",
      "#fcfaf5",
      "#493b31",
      "#8b5c3c",
      "#f4ebe0",
      "light",
    ],
    navy: [
      "Navy and teal",
      "#20365c",
      "#f7f8f5",
      "#253044",
      "#08766f",
      "#e4f1e9",
      "dark",
    ],
    indigo: [
      "Indigo and gold",
      "#202b48",
      "#f4f7fc",
      "#202b48",
      "#3c4f9b",
      "#fff0c9",
      "dark",
    ],
    forest: [
      "Forest and terracotta",
      "#244b40",
      "#f7f4ec",
      "#202d2a",
      "#a74f32",
      "#eee6d9",
      "dark",
    ],
    plum: [
      "Plum and rose",
      "#49334f",
      "#fbf7f9",
      "#3d3040",
      "#974b69",
      "#f5e5ec",
      "dark",
    ],
    slate: [
      "Slate and cobalt",
      "#293c50",
      "#f5f8fb",
      "#263a4a",
      "#285c9a",
      "#e5edf8",
      "dark",
    ],
  };
  const sel = document.querySelector("#palette-select"),
    info = document.querySelector("#active-palette");
  function apply() {
    const p = palettes[sel.value];
    document.querySelectorAll(".ui").forEach((el) => {
      ["--nav", "--bg", "--ink", "--accent", "--soft"].forEach((key, i) =>
        p ? el.style.setProperty(key, p[i + 1]) : el.style.removeProperty(key),
      );
      el.classList.toggle("palette-override", !!p);
      el.classList.toggle("palette-light", !!p && p[6] === "light");
      el.classList.toggle("palette-dark", !!p && p[6] === "dark");
    });
    info.replaceChildren();
    if (!p) {
      info.textContent =
        "Original palette: see the swatches below the selected design.";
      return;
    }
    ["Navigation", "Background", "Text", "Accent", "Surface"].forEach(
      (label, i) => {
        let d = document.createElement("div");
        d.className = "swatch";
        let box = document.createElement("i");
        box.style.background = p[i + 1];
        d.append(
          box,
          document.createTextNode(label + " " + p[i + 1].toUpperCase()),
        );
        info.append(d);
      },
    );
  }
  sel.addEventListener("change", apply);
  apply();
  return { apply };
})();
