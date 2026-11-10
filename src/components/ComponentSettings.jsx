import { useEffect, useState } from "react";
import { useLayoutSelection } from "./Playground.jsx";
const properties = {
  background: "background-color",
  color: "color",
  size: "font-size",
  weight: "font-weight",
  radius: "border-radius",
  padding: "padding",
};
export function componentCss(
  index,
  config = {},
  paths = { buttons: [], items: [] },
) {
  const prefix = `.ui[data-component-editor="${index}"]`;
  const rule = (selector, values = {}) => {
    let declarations = "";
    for (const [key, prop] of Object.entries(properties))
      if (values[key] && CSS.supports(prop, values[key]))
        declarations += `${prop}:${values[key]} !important;`;
    if (values.border && CSS.supports("border-color", values.border))
      declarations += `border:1px solid ${values.border} !important;`;
    return declarations ? `${selector}{${declarations}}\n` : "";
  };
  const button = config.button || {},
    nav = config.navbar || {},
    navFont = nav.global || {};
  return (
    rule(`${prefix} .cta, ${prefix} button`, button.global) +
    paths.buttons
      .map((path, n) => rule(prefix + path, button.items?.[n]))
      .join("") +
    rule(`${prefix} .nav`, nav.global) +
    rule(
      `${prefix} .nav .item`,
      Object.fromEntries(
        ["color", "size", "weight"]
          .filter((k) => navFont[k])
          .map((k) => [k, navFont[k]]),
      ),
    ) +
    paths.items.map((path, n) => rule(prefix + path, nav.items?.[n])).join("")
  );
}
export function readComponentTargets(ui) {
  if (!ui) return { buttons: [], items: [], buttonLabels: [], itemLabels: [] };
  const path = (el) => {
    let parts = [];
    while (el !== ui) {
      parts.unshift(
        `${el.tagName.toLowerCase()}:nth-child(${Array.prototype.indexOf.call(el.parentElement.children, el) + 1})`,
      );
      el = el.parentElement;
    }
    return " > " + parts.join(" > ");
  };
  const buttons = [...ui.querySelectorAll(".cta, button")],
    items = [...ui.querySelectorAll(".nav .item")];
  const label = (el, n) =>
    el.textContent.trim().replace(/\s+/g, " ").slice(0, 55) || `Item ${n + 1}`;
  return {
    buttons: buttons.map(path),
    items: items.map(path),
    buttonLabels: buttons.map(label),
    itemLabels: items.map(label),
  };
}
export default function ComponentSettings({ index, kind, title, labels }) {
  const { componentSettings, setComponentSettings, icons, setIcons } =
    useLayoutSelection();
  const [scope, setScope] = useState("global");
  const [radiusUnit, setRadiusUnit] = useState("px");
  const design = componentSettings[index]?.[kind] || {},
    current =
      scope === "global" ? design.global || {} : design.items?.[scope] || {};
  const radius = (current.radius || "").match(/^(\d*\.?\d+)(px|%|rem|em)$/),
    unit = radius?.[2] || radiusUnit;
  useEffect(() => {
    setRadiusUnit(radius?.[2] || "px");
  }, [scope, index]);
  function update(key, value) {
    setComponentSettings((previous) => {
      const entry = { ...previous[index] },
        category = { ...entry[kind] },
        values = {
          ...(scope === "global" ? category.global : category.items?.[scope]),
        };
      if (value) values[key] = value;
      else delete values[key];
      if (scope === "global") category.global = values;
      else category.items = { ...category.items, [scope]: values };
      entry[kind] = category;
      return { ...previous, [index]: entry };
    });
  }
  function reset() {
    setComponentSettings((previous) => {
      const entry = { ...previous[index] },
        category = { ...entry[kind] };
      if (scope === "global") delete category.global;
      else {
        category.items = { ...category.items };
        delete category.items[scope];
      }
      entry[kind] = category;
      return { ...previous, [index]: entry };
    });
  }
  return (
    <div className="component-controls">
      <strong>{title}</strong>
      <p>
        {kind === "button"
          ? "Set defaults for all preview buttons, then override individual buttons. These controls override the base settings above."
          : "Set the navigation bar style, then override individual navigation items. Container spacing remains available in Layout settings."}
      </p>
      <div className="component-fields">
        <label className="wide">
          Apply to
          <select
            aria-label={`${title} apply to`}
            value={scope}
            onChange={(event) => setScope(event.target.value)}
          >
            <option value="global">
              {kind === "button" ? "All buttons" : "Navigation bar"}
            </option>
            {labels.map((label, n) => (
              <option key={n} value={n}>
                {label}
              </option>
            ))}
          </select>
        </label>
        {[
          ["background", "Background"],
          ["border", "Border color"],
          ["color", "Font color"],
        ].map(([name, label]) => (
          <label className="color-field" key={name}>
            {label}
            <span className="color-setting">
              <input
                type="checkbox"
                aria-label={`${title} custom ${label.toLowerCase()}`}
                checked={Boolean(current[name])}
                onChange={(event) =>
                  update(name, event.target.checked ? "#263b35" : "")
                }
              />
              Custom
              <input
                type="color"
                aria-label={`${title} ${label.toLowerCase()}`}
                disabled={!current[name]}
                value={current[name] || "#263b35"}
                onChange={(event) => update(name, event.target.value)}
              />
            </span>
          </label>
        ))}
        <label>
          Font size (px)
          <input
            aria-label={`${title} font size`}
            type="number"
            min="1"
            step="1"
            placeholder="Default"
            value={current.size ? parseFloat(current.size) : ""}
            onChange={(event) =>
              update(
                "size",
                event.target.value && Number(event.target.value) > 0
                  ? `${Number(event.target.value)}px`
                  : "",
              )
            }
          />
        </label>
        <label>
          Font weight
          <select
            aria-label={`${title} font weight`}
            value={current.weight || ""}
            onChange={(event) => update("weight", event.target.value)}
          >
            <option value="">Default</option>
            <option value="400">Regular</option>
            <option value="700">Bold</option>
          </select>
        </label>
        <label>
          Border radius
          <input
            aria-label={`${title} border radius`}
            type="number"
            min="0"
            step="0.5"
            placeholder="Default"
            value={radius?.[1] || ""}
            onChange={(event) =>
              update(
                "radius",
                event.target.value !== "" && Number(event.target.value) >= 0
                  ? `${Number(event.target.value)}${unit}`
                  : "",
              )
            }
          />
        </label>
        <label>
          Radius unit
          <select
            aria-label={`${title} radius unit`}
            value={unit}
            onChange={(event) => {
              setRadiusUnit(event.target.value);
              if (radius) update("radius", `${radius[1]}${event.target.value}`);
            }}
          >
            {["px", "%", "rem", "em"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          Padding (px)
          <input
            aria-label={`${title} padding`}
            type="number"
            min="0"
            step="1"
            placeholder="Default"
            value={current.padding ? parseFloat(current.padding) : ""}
            onChange={(event) =>
              update(
                "padding",
                event.target.value !== "" && Number(event.target.value) >= 0
                  ? `${Number(event.target.value)}px`
                  : "",
              )
            }
          />
        </label>
      </div>
      {kind === "navbar" && (
        <label className="nav-icon-toggle">
          <input
            type="checkbox"
            aria-label="Show sidebar icons"
            checked={icons[index] !== false}
            onChange={(event) =>
              setIcons((previous) => ({
                ...previous,
                [index]: event.target.checked,
              }))
            }
          />
          Show sidebar icons
        </label>
      )}
      <button type="button" onClick={reset}>
        Reset selected {kind === "button" ? "button style" : "navigation style"}
      </button>
    </div>
  );
}
