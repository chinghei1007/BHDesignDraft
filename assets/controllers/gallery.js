const galleryController = (() => {
  const pages = [...document.querySelectorAll(".direction")],
    select = document.getElementById("layout-select"),
    prev = document.getElementById("prev"),
    next = document.getElementById("next"),
    counter = document.getElementById("counter");
  let current = 0;
  let groups = {};
  pages.forEach((page, i) => {
    let [category, name] = page.dataset.label.split(" · ", 2);
    if (category === "Original") {
      category = "Original concepts";
      name = page.dataset.label.slice("Original · ".length);
    }
    if (!groups[category]) {
      groups[category] = document.createElement("optgroup");
      groups[category].label = category;
      select.append(groups[category]);
    }
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = name;
    groups[category].append(opt);
  });
  function show(i) {
    current = (i + pages.length) % pages.length;
    pages.forEach((p, j) => (p.hidden = j !== current));
    select.value = String(current);
    counter.textContent = current + 1 + " / " + pages.length;
  }
  prev.addEventListener("click", () => show(current - 1));
  next.addEventListener("click", () => show(current + 1));
  select.addEventListener("change", () => show(Number(select.value)));
  show(0);
  return { show };
})();
