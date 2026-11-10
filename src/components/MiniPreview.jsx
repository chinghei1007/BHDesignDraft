import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLayoutSelection } from "./Playground.jsx";

export default function MiniPreview() {
  const { selected } = useLayoutSelection();
  const viewport = useRef(null),
    frame = useRef(null),
    source = useRef(null),
    raf = useRef(null);
  const [visible, setVisible] = useState(false),
    [snapshot, setSnapshot] = useState({ html: "", height: 0 });
  function renderSnapshot() {
    const ui = source.current,
      box = viewport.current;
    if (!ui || !box) return;
    const rect = ui.getBoundingClientRect(),
      width = box.clientWidth;
    if (!rect.width || !rect.height || !width) return;
    const scale = Math.min(width / rect.width, 180 / rect.height),
      clone = ui.cloneNode(true);
    clone.classList.add("mini-clone");
    clone.setAttribute("aria-hidden", "true");
    clone.setAttribute("inert", "");
    clone.removeAttribute("id");
    clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
    clone.style.width = `${rect.width}px`;
    clone.style.transform = `scale(${scale})`;
    clone.style.left = `${Math.max(0, (width - rect.width * scale) / 2)}px`;
    const next = {
      html: clone.outerHTML,
      height: Math.max(1, Math.ceil(rect.height * scale)),
    };
    setSnapshot((previous) =>
      previous.html === next.html && previous.height === next.height
        ? previous
        : next,
    );
  }
  function queue() {
    if (raf.current !== null) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = null;
      renderSnapshot();
    });
  }
  useEffect(() => {
    const page = document.querySelectorAll(".direction")[selected];
    if (!page) return;
    source.current = page.querySelector(".ui");
    frame.current = page.querySelector(".frame");
    setVisible(false);
    const intersection = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.target === frame.current) {
            setVisible(!entry.isIntersecting);
            queue();
          }
      },
      { root: null, rootMargin: "-100px 0px 0px", threshold: 0 },
    );
    const mutations = new MutationObserver(queue);
    mutations.observe(page, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true,
    });
    const resize = new ResizeObserver(queue);
    resize.observe(source.current);
    intersection.observe(frame.current);
    window.addEventListener("resize", queue);
    return () => {
      intersection.disconnect();
      mutations.disconnect();
      resize.disconnect();
      window.removeEventListener("resize", queue);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
      raf.current = null;
    };
  }, [selected]);
  useLayoutEffect(() => {
    if (visible) queue();
  }, [visible]);
  function goToPreview() {
    frame.current?.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  }
  return (
    <div
      className="mini-preview"
      hidden={!visible}
      tabIndex={0}
      role="button"
      aria-label="Return to full design preview"
      onClick={goToPreview}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          goToPreview();
        }
      }}
    >
      <div className="mini-preview-title">
        <span>Live preview</span>
        <span aria-hidden="true">Back to full preview ↑</span>
      </div>
      <div
        ref={viewport}
        className="mini-preview-viewport"
        aria-hidden="true"
        style={{ height: snapshot.height || undefined }}
        dangerouslySetInnerHTML={{ __html: snapshot.html }}
      />
    </div>
  );
}
