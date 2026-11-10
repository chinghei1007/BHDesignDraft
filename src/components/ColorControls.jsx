import { useState } from "react";
import { useLayoutSelection } from "./Playground.jsx";
import { ElementSettings, RadiusEditor } from "./ElementSettings.jsx";
const options = [
  ["heading-1", "Main heading / H1"],
  ["heading-2", "Heading level 2"],
  ["heading-3", "Heading level 3"],
  ["heading-4", "Heading level 4"],
  ["muted", "Muted text"],
];
export function HeadingColors({ index }) {
  const { headingColors, setHeadingColors } = useLayoutSelection();
  const current = headingColors[index] || {};
  function update(name, value) {
    setHeadingColors((previous) => {
      const design = { ...previous[index] };
      if (value) design[name] = value;
      else delete design[name];
      return { ...previous, [index]: design };
    });
  }
  return (
    <div className="heading-color-controls">
      <strong>Heading and text styles</strong>
      <p>
        Auto inherits a readable color from the surrounding surface. Some
        heading levels appear only in certain layouts.
      </p>
      {options.map(([name, title]) => (
        <label className="heading-color-row" key={name}>
          <span>{title}</span>
          <select
            aria-label={`${title} color mode`}
            value={current[name] ? "custom" : "auto"}
            onChange={(event) =>
              update(name, event.target.value === "custom" ? "#263b35" : "")
            }
          >
            <option value="auto">Auto</option>
            <option value="custom">Custom</option>
          </select>
          <input
            type="color"
            aria-label={`${title} color`}
            disabled={!current[name]}
            value={current[name] || "#263b35"}
            onChange={(event) => update(name, event.target.value)}
          />
        </label>
      ))}
      <ElementSettings index={index} />
    </div>
  );
}
export function ButtonColors({ index }) {
  const { buttonColors, setButtonColors } = useLayoutSelection();
  const saved = buttonColors[index];
  const [draft, setDraft] = useState(saved || "#08766f");
  function update(value) {
    setButtonColors((previous) => {
      const next = { ...previous };
      if (value) next[index] = value;
      else delete next[index];
      return next;
    });
  }
  return (
    <div className="button-color-controls">
      <strong>Button settings</strong>
      <p>
        Choose a custom button background or use the palette accent. Button text
        adjusts automatically.
      </p>
      <label>
        <input
          type="checkbox"
          className="button-custom"
          checked={Boolean(saved)}
          onChange={(event) => update(event.target.checked ? draft : "")}
        />{" "}
        Custom button background{" "}
        <input
          type="color"
          className="button-picker"
          aria-label="Button background color"
          disabled={!saved}
          value={saved || draft}
          onChange={(event) => {
            setDraft(event.target.value);
            update(event.target.value);
          }}
        />
      </label>
      <RadiusEditor index={index} name="button" />
    </div>
  );
}
