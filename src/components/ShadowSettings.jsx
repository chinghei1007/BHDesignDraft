import { useLayoutSelection } from "./Playground.jsx";
const fields = [
  ["x", "Horizontal offset (px)", 0],
  ["y", "Vertical offset (px)", 4],
  ["blur", "Blur (px)", 12],
  ["spread", "Spread (px)", 0],
  ["opacity", "Opacity (%)", 20],
  ["color", "Shadow color", "#000000"],
];
const initial = {
  mode: "custom",
  x: 0,
  y: 4,
  blur: 12,
  spread: 0,
  opacity: 20,
  color: "#000000",
};
const selectors = {
  main: ".main",
  navigation: ".nav",
  columns: ".columns",
  cards: ".panel",
  rows: ".row",
  update: ".update",
  links: ".links",
};
export function shadowCss(index, config = {}) {
  return Object.entries(config)
    .map(([name, c]) => {
      if (!selectors[name] || !c || !["none", "custom"].includes(c.mode))
        return "";
      let value = "none";
      if (c.mode === "custom") {
        const nums = ["x", "y", "blur", "spread"].map((key) => Number(c[key]));
        if (
          nums.some((x) => !Number.isFinite(x)) ||
          nums[2] < 0 ||
          !/^#[0-9a-f]{6}$/i.test(c.color) ||
          !Number.isFinite(Number(c.opacity))
        )
          return "";
        const rgb = [1, 3, 5].map((i) => parseInt(c.color.slice(i, i + 2), 16));
        value = `${nums.map((x) => `${x}px`).join(" ")} rgba(${rgb.join(",")},${Math.min(1, Math.max(0, Number(c.opacity) / 100))})`;
      }
      return `.ui[data-shadow-editor="${index}"] ${selectors[name]} {box-shadow:${value} !important}\n`;
    })
    .join("");
}
export default function ShadowSettings() {
  const { selected, container, shadowSettings, setShadowSettings } =
    useLayoutSelection();
  const current = shadowSettings[selected]?.[container] || {};
  function update(name, value) {
    setShadowSettings((previous) => {
      const design = { ...previous[selected] };
      if (name === "mode" && value === "default") delete design[container];
      else
        design[container] = { ...initial, ...design[container], [name]: value };
      return { ...previous, [selected]: design };
    });
  }
  return (
    <div className="shadow-settings extra-settings">
      <strong>Drop shadow</strong>
      <div className="extra-grid">
        <label className="wide">
          Shadow
          <select
            aria-label="Container shadow mode"
            value={current.mode || "default"}
            onChange={(event) => update("mode", event.target.value)}
          >
            <option value="default">Layout default</option>
            <option value="none">None</option>
            <option value="custom">Custom</option>
          </select>
        </label>
        {fields.map(([name, label, fallback]) => (
          <label key={name}>
            {label}
            <input
              type={name === "color" ? "color" : "number"}
              aria-label={`Container shadow ${name}`}
              disabled={current.mode !== "custom"}
              min={name === "blur" || name === "opacity" ? 0 : undefined}
              max={name === "opacity" ? 100 : undefined}
              step={name === "color" ? undefined : 1}
              value={current[name] ?? fallback}
              onChange={(event) => {
                const value = event.target.value;
                if (name === "color") update(name, value);
                else if (
                  value !== "" &&
                  Number.isFinite(Number(value)) &&
                  (name !== "blur" || Number(value) >= 0) &&
                  (name !== "opacity" ||
                    (Number(value) >= 0 && Number(value) <= 100))
                )
                  update(name, Number(value));
              }}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
