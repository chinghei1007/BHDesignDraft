import { useEffect, useState } from "react";
import { layouts } from "./gallery.jsx";
import { useLayoutSelection } from "./Playground.jsx";

export const typeScale = [
  ["xs", 12],
  ["sm", 14],
  ["base", 16],
  ["lg", 18],
  ["xl", 20],
  ["2xl", 24],
  ["3xl", 30],
];
export const containers = {
  main: "Main content",
  navigation: "Navigation",
  columns: "Dashboard columns",
  cards: "Cards",
  rows: "List rows",
  update: "School update",
  links: "Quick links",
};
const sides = [
  "all",
  "horizontal",
  "vertical",
  "top",
  "right",
  "bottom",
  "left",
];
const steps = [
  0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24,
];
export const spacingMap = (value) =>
  value && typeof value === "object"
    ? value
    : value !== undefined && value !== null && value !== ""
      ? { all: value }
      : {};

export function layoutStyles(config = {}) {
  const typography = Object.fromEntries(
    typeScale.map(([name, fallback]) => {
      const number = Number(config.font?.[name]);
      return [
        `--ed-${name}`,
        `${Number.isFinite(number) && number >= 8 && number <= 96 ? number : fallback}px`,
      ];
    }),
  );
  const elements = {};
  for (const name of Object.keys(containers)) {
    const settings = config.spacing?.[name] || {},
      style = {};
    for (const property of ["padding", "margin"]) {
      const values = spacingMap(settings[property]);
      for (const [mode, targets] of Object.entries({
        all: ["Top", "Right", "Bottom", "Left"],
        horizontal: ["Left", "Right"],
        vertical: ["Top", "Bottom"],
        top: ["Top"],
        right: ["Right"],
        bottom: ["Bottom"],
        left: ["Left"],
      })) {
        const value = values[mode],
          number = Number(value);
        if (
          value !== undefined &&
          value !== "" &&
          Number.isFinite(number) &&
          number >= 0 &&
          number <= 24
        )
          for (const side of targets)
            style[property + side] = `${number * 0.25}rem`;
      }
    }
    const gap = settings.gap,
      number = Number(gap);
    if (
      gap !== undefined &&
      gap !== "" &&
      Number.isFinite(number) &&
      number >= 0 &&
      number <= 24
    ) {
      style.gap = `${number * 0.25}rem`;
      style["--editor-gap"] = style.gap;
    }
    elements[name] = style;
  }
  return { typography, elements };
}

function TypeField({ name, fallback, value, onChange }) {
  const [draft, setDraft] = useState(String(value ?? fallback));
  useEffect(() => setDraft(String(value ?? fallback)), [value, fallback]);
  return (
    <label className="type-field">
      <span>text-{name}</span>
      <input
        type="number"
        min="8"
        max="96"
        step="1"
        aria-label={`text-${name} size in pixels`}
        value={draft}
        onChange={(event) => {
          const text = event.target.value;
          setDraft(text);
          const number = Number(text);
          event.target.setCustomValidity(
            text && (!Number.isFinite(number) || number < 8 || number > 96)
              ? "Choose a size between 8 and 96 pixels."
              : "",
          );
          if (text && Number.isFinite(number) && number >= 8 && number <= 96)
            onChange(number);
        }}
      />
    </label>
  );
}
export function TypeEditor() {
  const { selected, layoutSettings, setLayoutSettings } = useLayoutSelection();
  const font = layoutSettings[selected]?.font || {};
  const update = (name, value) =>
    setLayoutSettings((previous) => ({
      ...previous,
      [selected]: {
        ...previous[selected],
        font: { ...previous[selected]?.font, [name]: value },
      },
    }));
  return (
    <div id="type-editor" className="type-grid">
      {typeScale.map(([name, fallback]) => (
        <TypeField
          key={`${selected}-${name}`}
          name={name}
          fallback={fallback}
          value={font[name]}
          onChange={(value) => update(name, value)}
        />
      ))}
    </div>
  );
}
export function ContainerSelect() {
  const { container, setContainer } = useLayoutSelection();
  return (
    <select
      id="container-select"
      value={container}
      onChange={(event) => setContainer(event.target.value)}
    >
      {Object.entries(containers).map(([value, label]) => (
        <option value={value} key={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
export function SpacingEditor() {
  const { selected, container, layoutSettings, setLayoutSettings } =
    useLayoutSelection();
  const [modes, setModes] = useState({ padding: "all", margin: "all" });
  useEffect(
    () => setModes({ padding: "all", margin: "all" }),
    [selected, container],
  );
  const cfg = layoutSettings[selected]?.spacing?.[container] || {};
  function update(prop, value) {
    setLayoutSettings((previous) => {
      const design = previous[selected] || {},
        spacing = { ...design.spacing },
        current = { ...spacing[container] };
      if (prop === "gap") {
        if (value === "") delete current.gap;
        else current.gap = value;
      } else {
        const values = { ...spacingMap(current[prop]) };
        if (value === "") delete values[modes[prop]];
        else values[modes[prop]] = value;
        current[prop] = values;
      }
      spacing[container] = current;
      return { ...previous, [selected]: { ...design, spacing } };
    });
  }
  return (
    <div id="spacing-editor" className="space-fields">
      {["padding", "gap", "margin"].map((prop) => (
        <label className="space-field" key={prop}>
          <span>{prop[0].toUpperCase() + prop.slice(1)}</span>
          {prop !== "gap" && (
            <select
              aria-label={`${prop} sides for ${container}`}
              value={modes[prop]}
              onChange={(event) =>
                setModes((previous) => ({
                  ...previous,
                  [prop]: event.target.value,
                }))
              }
            >
              {sides.map((side) => (
                <option key={side} value={side}>
                  {side === "all"
                    ? "All sides"
                    : side[0].toUpperCase() + side.slice(1)}
                </option>
              ))}
            </select>
          )}
          <select
            aria-label={`${prop} for ${container}`}
            value={
              prop === "gap"
                ? (cfg.gap ?? "")
                : (spacingMap(cfg[prop])[modes[prop]] ?? "")
            }
            onChange={(event) => update(prop, event.target.value)}
          >
            <option value="">Default for this layout</option>
            {steps.map((step) => (
              <option key={step} value={step}>
                {prop === "padding" ? "p" : prop === "margin" ? "m" : "gap"}-
                {step} · {step * 4}px
              </option>
            ))}
          </select>
        </label>
      ))}
    </div>
  );
}
export function EditorTitle() {
  const { selected } = useLayoutSelection();
  const item = layouts[selected];
  const label =
    item.group === "Original concepts"
      ? `Original · ${item.label}`
      : `${item.group} · ${item.label}`;
  return (
    <div className="editor-title" id="editor-current" aria-live="polite">
      Editing: {label}
    </div>
  );
}
export function ResetLayout() {
  const { selected, setLayoutSettings, setShadowSettings, setElementSettings } =
    useLayoutSelection();
  return (
    <button
      type="button"
      id="reset-layout"
      onClick={() => {
        setElementSettings((previous) => {
          const next = { ...previous };
          delete next[selected];
          return next;
        });
        setShadowSettings((previous) => {
          const next = { ...previous };
          delete next[selected];
          return next;
        });
        setLayoutSettings((previous) => {
          const next = { ...previous };
          delete next[selected];
          return next;
        });
      }}
    >
      Reset typography and spacing
    </button>
  );
}
