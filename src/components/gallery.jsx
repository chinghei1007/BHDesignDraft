import { useEffect, useLayoutEffect, useState } from "react";
import { useLayoutSelection } from "./Playground.jsx";

export const layouts = [
  ["academic-editorial", "Original concepts", "1 · Academic Editorial"],
  ["learning-studio", "Original concepts", "2 · Learning Studio"],
  ["modern-school-commons", "Original concepts", "3 · Modern School Commons"],
  ["soft-school-commons", "Original concepts", "4 · Soft School Commons"],
  ["horizontal-navigation", "Navigation", "Horizontal navigation"],
  ["compact-icon-rail", "Navigation", "Compact icon rail"],
  ["split-workspace", "Columns", "Split workspace"],
  ["focus-first", "Columns", "Focus first"],
  ["card-grid", "Grouped", "Card grid"],
  ["daily-agenda", "Time", "Daily agenda"],
  ["classroom-board", "Workflow", "Classroom board"],
  ["school-magazine", "Editorial", "School magazine"],
  ["resource-hub", "Navigation", "Resource hub"],
  ["learning-timeline", "Time", "Learning timeline"],
].map(([id, group, label]) => ({ id, group, label }));

export function wrapLayout(index) {
  return (index + layouts.length) % layouts.length;
}

export function GalleryControls() {
  const { selected, setSelected } = useLayoutSelection();
  const [disabled, setDisabled] = useState(() => {
    try {
      return localStorage.getItem("sheklei-disable-color-scheme-v1") === "true";
    } catch {
      return false;
    }
  });
  useEffect(() => {
    document.body.classList.toggle("colors-disabled", disabled);
    try {
      localStorage.setItem("sheklei-disable-color-scheme-v1", String(disabled));
    } catch {
      /* Browser storage may be unavailable. */
    }
  }, [disabled]);
  // Legacy editors still listen to the native layout change event.
  useLayoutEffect(() => {
    document
      .getElementById("layout-select")
      ?.dispatchEvent(new Event("change", { bubbles: false }));
  }, [selected]);
  const groups = [...new Set(layouts.map((layout) => layout.group))];
  return (
    <div className="gallery-controls" aria-label="Design gallery navigation">
      <button
        id="prev"
        type="button"
        aria-label="Previous design"
        onClick={() => setSelected((index) => wrapLayout(index - 1))}
      >
        ←
      </button>
      <label htmlFor="layout-select">Layout</label>
      <select
        id="layout-select"
        aria-label="Choose a layout"
        value={selected}
        onChange={(event) => setSelected(Number(event.target.value))}
      >
        {groups.map((group) => (
          <optgroup key={group} label={group}>
            {layouts.map(
              (layout, index) =>
                layout.group === group && (
                  <option value={index} key={layout.id}>
                    {layout.label}
                  </option>
                ),
            )}
          </optgroup>
        ))}
      </select>
      <button
        id="next"
        type="button"
        aria-label="Next design"
        onClick={() => setSelected((index) => wrapLayout(index + 1))}
      >
        →
      </button>
      <label htmlFor="palette-select">Palette</label>
      <select
        id="palette-select"
        aria-label="Choose color palette"
        defaultValue="original"
      >
        <option value="original">Original for each design</option>
        <optgroup label="Soft and light">
          <option value="sage">Soft sage</option>
          <option value="coastal">Coastal blue</option>
          <option value="lavender">Lavender and plum</option>
          <option value="sand">Warm sand</option>
        </optgroup>
        <optgroup label="Higher contrast">
          <option value="navy">Navy and teal</option>
          <option value="indigo">Indigo and gold</option>
          <option value="forest">Forest and terracotta</option>
          <option value="plum">Plum and rose</option>
          <option value="slate">Slate and cobalt</option>
        </optgroup>
      </select>
      <output id="counter" aria-live="polite">
        {selected + 1} / {layouts.length}
      </output>
      <label className="color-scheme-toggle">
        <input
          type="checkbox"
          id="disable-color-scheme"
          checked={disabled}
          onChange={(event) => setDisabled(event.target.checked)}
        />
        Disable color scheme
      </label>
    </div>
  );
}
