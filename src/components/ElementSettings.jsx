import { useEffect, useState } from "react";
import { useLayoutSelection } from "./Playground.jsx";
export const targets = {
  "heading-1": ["Main heading / H1", ".main h1, .main > h3"],
  "heading-2": ["Heading level 2", ".main h2, .panel h4"],
  "heading-3": [
    "Heading level 3",
    ".main h3:not(:first-of-type):not(.main > h3)",
  ],
  "heading-4": ["Heading level 4", ".main h4:not(.panel h4)"],
  body: ["Body paragraphs", ".main p:not(.sub), .update"],
  muted: ["Muted text", ".main .sub, .main small, .main .bar"],
  navigation: ["Navigation text", ".nav .item"],
  links: ["Quick link text", ".links span"],
  list: ["List item text", ".main li"],
  button: ["Button text", ".cta"],
};
const containers = {
  main: ".main",
  navigation: ".nav",
  columns: ".columns",
  cards: ".panel",
  rows: ".row",
  update: ".update",
  links: ".links",
  button: ".cta",
};
const spacingModes = {
  all: [""],
  horizontal: ["left", "right"],
  vertical: ["top", "bottom"],
  top: ["top"],
  right: ["right"],
  bottom: ["bottom"],
  left: ["left"],
};
const steps = [
  0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24,
];
const spacingMap = (value) =>
  value && typeof value === "object" ? value : value ? { all: value } : {};
export function elementCss(index, config = {}) {
  const prefix = `.ui[data-element-editor="${index}"]`;
  const rule = (selectors, prop, value) =>
    value && CSS.supports(prop, value)
      ? `${selectors}{${prop}:${value} !important}\n`
      : "";
  let css = config.globalFont
    ? rule(`${prefix},${prefix} *`, "font-family", config.globalFont)
    : "";
  for (const [name, [, selectors]] of Object.entries(targets)) {
    const current = config.targets?.[name] || {},
      scoped = selectors
        .split(",")
        .map((s) => `${prefix} ${s.trim()}`)
        .join(",");
    for (const [key, prop] of Object.entries({
      size: "font-size",
      lineHeight: "line-height",
      font: "font-family",
    }))
      css += rule(scoped, prop, current[key]);
    for (const prop of ["padding", "margin"])
      for (const [mode, sides] of Object.entries(spacingModes))
        for (const side of sides)
          css += rule(
            scoped,
            prop + (side ? "-" + side : ""),
            spacingMap(current[prop])[mode],
          );
  }
  for (const [name, value] of Object.entries(config.radii || {}))
    if (containers[name])
      css += rule(`${prefix} ${containers[name]}`, "border-radius", value);
  return css;
}
function useElement(index) {
  const { elementSettings, setElementSettings } = useLayoutSelection();
  const current = elementSettings[index] || {};
  const update = (callback) =>
    setElementSettings((previous) => ({
      ...previous,
      [index]: callback(previous[index] || {}),
    }));
  return [current, update];
}
export function ElementSettings({ index }) {
  const [config, update] = useElement(index),
    [target, setTarget] = useState("heading-1"),
    [modes, setModes] = useState({ padding: "all", margin: "all" });
  const current = config.targets?.[target] || {};
  const updateTarget = (key, value) =>
    update((previous) => ({
      ...previous,
      targets: {
        ...previous.targets,
        [target]: { ...previous.targets?.[target], [key]: value },
      },
    }));
  const updateSpacing = (prop, value) => {
    const next = { ...spacingMap(current[prop]) };
    if (value) next[modes[prop]] = value;
    else delete next[modes[prop]];
    updateTarget(prop, next);
  };
  return (
    <>
      <p className="element-description">
        Set type and spacing for each text role. Individual sides override
        horizontal, vertical and all-side values. Blank fields use the layout
        default.
      </p>
      <div className="element-style-fields">
        <label className="wide">
          Global font family
          <input
            aria-label="Global font family"
            placeholder="Layout default, e.g. Arial, sans-serif"
            value={config.globalFont || ""}
            onChange={(event) => {
              const value = event.target.value;
              event.target.setCustomValidity(
                value && !CSS.supports("font-family", value)
                  ? "Enter a valid CSS font family."
                  : "",
              );
              update((previous) => ({ ...previous, globalFont: value }));
            }}
          />
        </label>
        <label className="wide">
          Text role
          <select
            aria-label="Text role"
            value={target}
            onChange={(event) => setTarget(event.target.value)}
          >
            {Object.entries(targets).map(([key, [label]]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Font size (px)
          <input
            aria-label="Text role font size in pixels"
            type="number"
            min="1"
            step="1"
            placeholder="Default"
            value={current.size ? parseFloat(current.size) : ""}
            onChange={(event) =>
              updateTarget(
                "size",
                event.target.value && Number(event.target.value) > 0
                  ? `${Number(event.target.value)}px`
                  : "",
              )
            }
          />
        </label>
        <label>
          Line height
          <input
            aria-label="Text role line height"
            type="number"
            min="0.1"
            step="0.1"
            placeholder="Default"
            value={current.lineHeight || ""}
            onChange={(event) =>
              updateTarget(
                "lineHeight",
                event.target.value && Number(event.target.value) > 0
                  ? event.target.value
                  : "",
              )
            }
          />
        </label>
        <label className="wide">
          Font family
          <input
            aria-label="Text role font family"
            placeholder="Inherit global font"
            value={current.font || ""}
            onChange={(event) => {
              const value = event.target.value;
              event.target.setCustomValidity(
                value && !CSS.supports("font-family", value)
                  ? "Enter a valid CSS font family."
                  : "",
              );
              updateTarget("font", value);
            }}
          />
        </label>
        {["padding", "margin"].map((prop) => (
          <div key={prop} style={{ display: "contents" }}>
            <label>
              {prop[0].toUpperCase() + prop.slice(1)} sides
              <select
                aria-label={`Text role ${prop} sides`}
                value={modes[prop]}
                onChange={(event) =>
                  setModes((previous) => ({
                    ...previous,
                    [prop]: event.target.value,
                  }))
                }
              >
                {Object.keys(spacingModes).map((mode) => (
                  <option key={mode} value={mode}>
                    {mode === "all"
                      ? "All sides"
                      : mode[0].toUpperCase() + mode.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {prop[0].toUpperCase() + prop.slice(1)} value
              <select
                aria-label={`Text role ${prop}`}
                value={spacingMap(current[prop])[modes[prop]] ?? ""}
                onChange={(event) => updateSpacing(prop, event.target.value)}
              >
                <option value="">Layout default</option>
                {steps.map((n) => (
                  <option key={n} value={`${n * 0.25}rem`}>
                    {n} · {n * 4}px
                  </option>
                ))}
              </select>
            </label>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="element-reset"
        onClick={() =>
          update((previous) => {
            const next = { ...previous.targets };
            delete next[target];
            return { ...previous, targets: next };
          })
        }
      >
        Reset selected text role
      </button>
    </>
  );
}
export function RadiusEditor({ index, name }) {
  const [config, update] = useElement(index),
    value = config.radii?.[name] || "",
    match = value.match(/^(\d*\.?\d+)(px|%|rem|em)$/),
    [unit, setUnit] = useState(match?.[2] || "px");
  useEffect(() => setUnit(match?.[2] || "px"), [index, name]);
  function setRadius(next) {
    update((previous) => {
      const radii = { ...previous.radii };
      if (next) radii[name] = next;
      else delete radii[name];
      return { ...previous, radii };
    });
  }
  return (
    <div className="radius-editor">
      <span className="radius-title">Border radius</span>
      <label>
        Value
        <input
          type="number"
          min="0"
          step="0.5"
          placeholder="Default"
          aria-label={`${name} border radius value`}
          value={match?.[1] || ""}
          onChange={(event) =>
            setRadius(
              event.target.value !== "" && Number(event.target.value) >= 0
                ? `${Number(event.target.value)}${unit}`
                : "",
            )
          }
        />
      </label>
      <label>
        Unit
        <select
          aria-label={`${name} border radius unit`}
          value={unit}
          onChange={(event) => {
            setUnit(event.target.value);
            if (match) setRadius(`${match[1]}${event.target.value}`);
          }}
        >
          {["px", "%", "rem", "em"].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
export function ContainerRadius() {
  const { selected, container } = useLayoutSelection();
  return (
    <div>
      <RadiusEditor index={selected} name={container} />
    </div>
  );
}
