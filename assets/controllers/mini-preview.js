const miniPreviewController = (() => {
  const settings = document.querySelector(".settings-panel"),
    pages = [...document.querySelectorAll(".direction")],
    layout = document.querySelector("#layout-select");
  const preview = document.createElement("div");
  preview.className = "mini-preview";
  preview.hidden = true;
  preview.tabIndex = 0;
  preview.setAttribute("role", "button");
  preview.setAttribute("aria-label", "Return to full design preview");
  preview.innerHTML =
    '<div class="mini-preview-title"><span>Live preview</span><span aria-hidden="true">Back to full preview ↑</span></div><div class="mini-preview-viewport" aria-hidden="true"></div>';
  settings.prepend(preview);
  const viewport = preview.querySelector(".mini-preview-viewport");
  let source = null,
    frame = null,
    offscreen = false,
    pending = false,
    observer = null,
    resizeObserver = null;
  function queue() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      render();
    });
  }
  function render() {
    if (!source || !offscreen) {
      preview.hidden = true;
      return;
    }
    const rect = source.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      preview.hidden = true;
      return;
    }
    preview.hidden = false;
    const width = viewport.clientWidth;
    if (!width) return;
    const scale = Math.min(width / rect.width, 180 / rect.height),
      clone = source.cloneNode(true);
    clone.classList.add("mini-clone");
    clone.setAttribute("aria-hidden", "true");
    clone.setAttribute("inert", "");
    clone.removeAttribute("id");
    clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
    clone.style.width = rect.width + "px";
    clone.style.transform = "scale(" + scale + ")";
    clone.style.left = Math.max(0, (width - rect.width * scale) / 2) + "px";
    viewport.replaceChildren(clone);
    viewport.style.height = Math.max(1, Math.ceil(rect.height * scale)) + "px";
  }
  const intersection = new IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        if (entry.target === frame) {
          offscreen = !entry.isIntersecting;
          queue();
        }
    },
    { root: null, rootMargin: "-100px 0px 0px 0px", threshold: 0 },
  );
  function select() {
    if (frame) intersection.unobserve(frame);
    if (observer) observer.disconnect();
    if (resizeObserver) resizeObserver.disconnect();
    const page = pages[Number(layout.value) || 0];
    source = page.querySelector(".ui");
    frame = page.querySelector(".frame");
    offscreen = false;
    preview.hidden = true;
    observer = new MutationObserver(queue);
    observer.observe(source, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true,
    });
    resizeObserver = new ResizeObserver(queue);
    resizeObserver.observe(source);
    intersection.observe(frame);
  }
  function goToPreview() {
    if (!frame) return;
    frame.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  }
  preview.addEventListener("click", goToPreview);
  preview.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goToPreview();
    }
  });
  layout.addEventListener("change", () => requestAnimationFrame(select));
  document
    .querySelector("#prev")
    .addEventListener("click", () => requestAnimationFrame(select));
  document
    .querySelector("#next")
    .addEventListener("click", () => requestAnimationFrame(select));
  window.addEventListener("resize", queue);
  select();
  return { render, goToPreview };
})();
