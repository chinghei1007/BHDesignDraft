import { useLayoutEffect, useState } from "react";
import { useLayoutSelection } from "./Playground.jsx";
import TextColorSettings from "./TextColorSettings.jsx";
import { HeadingColors, ButtonColors } from "./ColorControls.jsx";
import ComponentSettings from "./ComponentSettings.jsx";

const fields = [
  ["--nav", "Navigation"],
  ["--accent", "Accent"],
  ["--soft", "Supporting surface"],
  ["--bg", "Background"],
  ["--ink", "Text"],
  ["--highlight", "Highlight"],
];
function toHex(value) {
  const hex = value.trim().match(/^#([a-f0-9]{3}|[a-f0-9]{6})$/i);
  if (hex)
    return (
      "#" +
      (hex[1].length === 3
        ? [...hex[1]].map((x) => x + x).join("")
        : hex[1]
      ).toLowerCase()
    );
  const rgb = value.match(/\d+/g);
  return rgb && rgb.length >= 3
    ? "#" +
        rgb
          .slice(0, 3)
          .map((x) => Number(x).toString(16).padStart(2, "0"))
          .join("")
    : "#000000";
}
export default function PaletteEditor({ index, autoStyle, componentTargets }) {
  const { palette, customColors, setCustomColors, setTextSettings } =
    useLayoutSelection();
  const [computed, setComputed] = useState({});
  useLayoutEffect(() => {
    const ui = document
      .querySelectorAll(".direction")
      [index]?.querySelector(".ui");
    if (!ui) return;
    const styles = getComputedStyle(ui);
    setComputed(
      Object.fromEntries(
        fields.map(([key]) => [key, toHex(styles.getPropertyValue(key))]),
      ),
    );
  }, [index, palette, customColors]);
  function update(key, value) {
    if (key === "--ink")
      setTextSettings((previous) => ({
        ...previous,
        [index]: { mode: "custom", color: value },
      }));
    setCustomColors((previous) => ({
      ...previous,
      [index]: { ...previous[index], [key]: value },
    }));
  }
  function reset() {
    setCustomColors((previous) => {
      const next = { ...previous };
      delete next[index];
      return next;
    });
  }
  return (
    <div className="play-tools">
      <TextColorSettings index={index} autoStyle={autoStyle} />
      <HeadingColors index={index} />
      <ButtonColors index={index} />
      <ComponentSettings
        index={index}
        kind="button"
        title="Button styles"
        labels={componentTargets.buttonLabels}
      />
      <ComponentSettings
        index={index}
        kind="navbar"
        title="Navigation styles"
        labels={componentTargets.itemLabels}
      />
      <h3>Customize this design</h3>
      <p>
        Choose colors for each part of the dashboard. Changes save automatically
        on this device.
      </p>
      <div className="picker-grid">
        {fields.map(([key, name]) => {
          const value =
            customColors[index]?.[key] || computed[key] || "#000000";
          return (
            <label className="picker" key={key}>
              <input
                type="color"
                aria-label={name}
                value={value}
                onChange={(event) => update(key, event.target.value)}
              />
              <span>{name}</span>
              <code>{value.toUpperCase()}</code>
            </label>
          );
        })}
      </div>
      <button type="button" onClick={reset}>
        Reset this design
      </button>
    </div>
  );
}
