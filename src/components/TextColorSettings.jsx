import { useLayoutSelection } from "./Playground.jsx";
export function foreground(background) {
  const value = background.trim();
  let rgb;
  const hex = value.match(/^#([a-f0-9]{3}|[a-f0-9]{6})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = [...h].map((x) => x + x).join("");
    rgb = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  } else {
    const match = value.match(/^rgba?\(\s*(\d+)[, ]+\s*(\d+)[, ]+\s*(\d+)/i);
    rgb = match ? match.slice(1, 4).map(Number) : [255, 255, 255];
  }
  const linear = rgb.map((x) => {
    const v = x / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2] > 0.179
    ? "#18291f"
    : "#ffffff";
}
export default function TextColorSettings({ index, autoStyle }) {
  const { textSettings, setTextSettings } = useLayoutSelection();
  const record = textSettings[index] || {},
    auto = record.mode !== "custom",
    color = record.color || "#263b35";
  const save = (mode, value) =>
    setTextSettings((previous) => ({
      ...previous,
      [index]: { mode, color: value },
    }));
  return (
    <div className="text-color-controls">
      <strong>Text on page background</strong>
      <p>
        Automatic chooses light or dark text to suit the background. Navigation,
        cards, updates and buttons adapt to their own backgrounds.
      </p>
      <label>
        <input
          type="checkbox"
          className="text-auto"
          checked={auto}
          onChange={(event) =>
            save(event.target.checked ? "auto" : "custom", color)
          }
        />{" "}
        Choose text color automatically
      </label>
      <label className="custom-text">
        Custom text color{" "}
        <input
          type="color"
          className="text-custom"
          value={color}
          disabled={auto}
          aria-label="Custom page text color"
          onChange={(event) => save("custom", event.target.value)}
        />{" "}
        <output>
          {(autoStyle["--auto-page-text"] || color).toUpperCase()} ·{" "}
          {auto ? "automatic" : "custom"}
        </output>
      </label>
    </div>
  );
}
