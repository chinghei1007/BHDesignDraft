import { useLayoutSelection } from "./Playground.jsx";

const fields = [
  ["size", "Font size (px)", 14, "number"],
  ["padding", "Cell padding (px)", 12, "number"],
  ["borderWidth", "Border width (px)", 1, "number"],
  ["radius", "Corner radius (px)", 8, "number"],
  ["border", "Border color", "#d6dfd9", "color"],
  ["headerBg", "Header background", "#e7eeea", "color"],
  ["headerColor", "Header text color", "#263b35", "color"],
  ["rowBg", "Row background", "#ffffff", "color"],
  ["rowColor", "Row text color", "#263b35", "color"],
  ["stripeBg", "Alternate row background", "#f2f7f3", "color"],
];
export const defaults = Object.fromEntries(
  fields.map(([name, , value]) => [name, value]),
);

export default function TableSettings() {
  const { selected, tableSettings, setTableSettings } = useLayoutSelection();
  const current = tableSettings[selected] || {};
  function update(name, value) {
    setTableSettings((previous) => ({
      ...previous,
      [selected]: { ...previous[selected], [name]: value },
    }));
  }
  return (
    <fieldset className="table-settings extra-settings">
      <legend>Table settings</legend>
      <p className="hint">
        Show a sample table to adjust its appearance in this design.
      </p>
      <label className="inline-toggle">
        <input
          type="checkbox"
          aria-label="Show table preview"
          checked={Boolean(current.show)}
          onChange={(event) => update("show", event.target.checked)}
        />
        Show table preview
      </label>
      <div className="extra-grid">
        {fields.map(([name, label, fallback, type]) => (
          <label
            key={name}
            className={type === "color" ? "color-field" : undefined}
          >
            {label}
            <input
              type={type}
              aria-label={`Table ${label.toLowerCase()}`}
              min={type === "number" ? 0 : undefined}
              step={type === "number" ? 1 : undefined}
              value={current[name] ?? fallback}
              onChange={(event) => {
                const value = event.target.value;
                if (type === "color") update(name, value);
                else if (value !== "" && Number(value) >= 0)
                  update(name, Number(value));
              }}
            />
          </label>
        ))}
      </div>
      <label className="inline-toggle color-field">
        <input
          type="checkbox"
          aria-label="Table alternate row colors"
          checked={Boolean(current.stripe)}
          onChange={(event) => update("stripe", event.target.checked)}
        />
        Alternate row colors
      </label>
      <button
        type="button"
        onClick={() =>
          setTableSettings((previous) => {
            const next = { ...previous };
            delete next[selected];
            return next;
          })
        }
      >
        Reset table settings
      </button>
    </fieldset>
  );
}

export function tableCss(index, config) {
  if (!config?.show) return "";
  const data = { ...defaults, ...config };
  const number = (key) =>
    Number.isFinite(Number(data[key])) && Number(data[key]) >= 0
      ? Number(data[key])
      : defaults[key];
  const color = (key) =>
    /^#[0-9a-f]{6}$/i.test(data[key]) ? data[key] : defaults[key];
  const pre = `.ui[data-table-editor="${index}"] .table-preview`,
    bw = number("borderWidth"),
    pad = number("padding");
  return `${pre} {border:${bw}px solid ${color("border")};border-radius:${number("radius")}px}\n${pre} table {font-size:${number("size")}px}\n${pre} .table-title {padding:${pad}px;margin:0}\n${pre} th, ${pre} td {padding:${pad}px;border-bottom:${bw}px solid ${color("border")}}\n${pre} th {background:${color("headerBg")};color:${color("headerColor")}}\n${pre} td {background:${color("rowBg")};color:${color("rowColor")}}\n${config.stripe ? `${pre} tbody tr:nth-child(even) td {background:${color("stripeBg")}}\n` : ""}`;
}

export function TablePreview({ config }) {
  if (!config?.show) return null;
  return (
    <div className="table-preview">
      <h4 className="table-title">School schedule</h4>
      <table aria-label="School schedule">
        <thead>
          <tr>
            <th scope="col">Activity</th>
            <th scope="col">Day</th>
            <th scope="col">Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Class meeting</td>
            <td>Monday</td>
            <td>09:00</td>
          </tr>
          <tr>
            <td>Library visit</td>
            <td>Wednesday</td>
            <td>14:00</td>
          </tr>
          <tr>
            <td>School assembly</td>
            <td>Friday</td>
            <td>10:00</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
