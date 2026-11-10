import { useLayoutSelection } from "./Playground.jsx";

const definitions = [
  [
    "marker",
    "Marker",
    [
      ["", "Default"],
      ["none", "None"],
      ["disc", "Disc"],
      ["circle", "Circle"],
      ["square", "Square"],
      ["decimal", "Number"],
    ],
  ],
  [
    "size",
    "Text size",
    [
      ["", "Use typography scale"],
      ["12px", "xs · 12px"],
      ["14px", "sm · 14px"],
      ["16px", "base · 16px"],
      ["18px", "lg · 18px"],
      ["20px", "xl · 20px"],
    ],
  ],
  [
    "weight",
    "Font weight",
    [
      ["", "Default"],
      ["400", "Regular"],
      ["500", "Medium"],
      ["600", "Semibold"],
      ["700", "Bold"],
    ],
  ],
  [
    "padding",
    "Item padding",
    [
      ["", "Default"],
      ["0.25rem", "p-1 · 4px"],
      ["0.5rem", "p-2 · 8px"],
      ["0.75rem", "p-3 · 12px"],
      ["1rem", "p-4 · 16px"],
      ["1.5rem", "p-6 · 24px"],
    ],
  ],
  [
    "radius",
    "Corner radius",
    [
      ["", "Default"],
      ["0px", "None"],
      ["4px", "Small"],
      ["8px", "Medium"],
      ["16px", "Large"],
      ["999px", "Pill"],
    ],
  ],
];

export default function ListSettings() {
  const {
    selected,
    listSettings,
    setListSettings,
    listVisibility,
    setListVisibility,
  } = useLayoutSelection();
  const current = listSettings[selected] || {};
  function update(name, value) {
    setListSettings((previous) => {
      const next = { ...previous, [selected]: { ...previous[selected] } };
      if (value) next[selected][name] = value;
      else delete next[selected][name];
      return next;
    });
  }
  return (
    <fieldset className="list-settings" id="list-settings">
      <legend>Sample list styles</legend>
      <p className="hint">
        Changes apply to the unordered and ordered sample lists, independently
        of the sidebar.
      </p>
      <label className="inline-toggle">
        <input
          type="checkbox"
          id="show-sample-lists"
          checked={listVisibility[selected] !== false}
          onChange={(event) =>
            setListVisibility((previous) => ({
              ...previous,
              [selected]: event.target.checked,
            }))
          }
        />{" "}
        Show sample lists
      </label>
      <div className="list-fields">
        {definitions.map(([name, label, options]) => (
          <label className="space-field" key={name}>
            <span>{label}</span>
            <select
              id={`li-${name}`}
              value={current[name] || ""}
              onChange={(event) => update(name, event.target.value)}
            >
              {options.map(([value, text]) => (
                <option key={value} value={value}>
                  {text}
                </option>
              ))}
            </select>
          </label>
        ))}
        {[
          ["color", "Custom text color", "#263b35", "List item text color"],
          [
            "bg",
            "Custom item background",
            "#d9e9df",
            "List item background color",
          ],
        ].map(([name, label, fallback, aria]) => (
          <label className="toggle-color" key={name}>
            <input
              type="checkbox"
              id={`li-custom-${name}`}
              checked={Boolean(current[name])}
              onChange={(event) =>
                update(name, event.target.checked ? fallback : "")
              }
            />{" "}
            {label}{" "}
            <input
              type="color"
              id={`li-${name}`}
              value={current[name] || fallback}
              aria-label={aria}
              onChange={(event) => update(name, event.target.value)}
            />
          </label>
        ))}
      </div>
      <button
        type="button"
        id="li-reset"
        onClick={() =>
          setListSettings((previous) => {
            const next = { ...previous };
            delete next[selected];
            return next;
          })
        }
      >
        Reset list styles
      </button>
    </fieldset>
  );
}
