const colorSchemeController = (() => {
  const key = "sheklei-disable-color-scheme-v1",
    label = document.createElement("label"),
    toggle = document.createElement("input");
  label.className = "color-scheme-toggle";
  toggle.type = "checkbox";
  toggle.id = "disable-color-scheme";
  label.append(toggle, document.createTextNode("Disable color scheme"));
  const controls = document.querySelector(".gallery-controls");
  controls.append(label);
  try {
    toggle.checked = localStorage.getItem(key) === "true";
  } catch (e) {}
  function apply() {
    document.body.classList.toggle("colors-disabled", toggle.checked);
  }
  toggle.addEventListener("change", () => {
    apply();
    try {
      localStorage.setItem(key, String(toggle.checked));
    } catch (e) {}
  });
  apply();
  return { apply };
})();
