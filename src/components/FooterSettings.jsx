import { useLayoutSelection } from "./Playground.jsx";
const fields = [
  ["size", "Font size (px)", 14, "number"],
  ["padding", "Padding (px)", 20, "number"],
  ["margin", "Top margin (px)", 24, "number"],
  ["radius", "Corner radius (px)", 0, "number"],
  ["borderWidth", "Top border width (px)", 1, "number"],
  ["bg", "Background", "#f7f9f6", "color"],
  ["text", "Text color", "#283b38", "color"],
  ["border", "Border color", "#d6dfd9", "color"],
];
const defaults = Object.fromEntries(
  fields.map(([name, , value]) => [name, value]),
);
export default function FooterSettings() {
  const { selected, footerSettings, setFooterSettings } = useLayoutSelection();
  const current = footerSettings[selected] || {};
  const update = (name, value) =>
    setFooterSettings((previous) => ({
      ...previous,
      [selected]: { ...previous[selected], [name]: value },
    }));
  return (
    <fieldset className="footer-settings extra-settings">
      <legend>Footer settings</legend>
      <p className="hint">
        Choose a simple copyright footer or show an expanded example.
      </p>
      <label className="inline-toggle">
        <input
          type="checkbox"
          aria-label="Show additional footer information"
          checked={Boolean(current.details)}
          onChange={(event) => update("details", event.target.checked)}
        />
        Show additional footer information
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
              aria-label={`Footer ${label.toLowerCase()}`}
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
      <button
        type="button"
        onClick={() =>
          setFooterSettings((previous) => {
            const next = { ...previous };
            delete next[selected];
            return next;
          })
        }
      >
        Reset footer settings
      </button>
    </fieldset>
  );
}
export function footerCss(index, config = {}) {
  const data = { ...defaults, ...config };
  const n = (key) =>
    Number.isFinite(Number(data[key])) && Number(data[key]) >= 0
      ? Number(data[key])
      : defaults[key];
  const color = (key) =>
    /^#[0-9a-f]{6}$/i.test(data[key]) ? data[key] : defaults[key];
  return `.ui[data-footer-editor="${index}"] .footer {font-size:${n("size")}px;padding:${n("padding")}px;margin-top:${n("margin")}px;border-radius:${n("radius")}px;border-top:${n("borderWidth")}px solid ${color("border")};background:${color("bg")};color:${color("text")}}\n`;
}
export function FooterPreview({ config = {} }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {config.details && (
          <div className="footer-grid">
            <div className="footer-brand">
              <span className="footer-brand-name">
                Rivermere Secondary School
              </span>
              <p className="footer-tagline">Learning together, every day.</p>
              <div className="footer-social">
                <span
                  className="footer-social-icon"
                  role="img"
                  aria-label="GitHub icon (example)"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M12 .75A11.25 11.25 0 0 0 8.44 22.67c.56.1.77-.24.77-.54v-2.1c-3.14.68-3.8-1.33-3.8-1.33-.52-1.3-1.27-1.65-1.27-1.65-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.66 1.23 3.3.94.11-.73.4-1.23.73-1.51-2.5-.29-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.02-.12-.29-.5-1.44.11-2.99 0 0 .95-.3 3.1 1.15a10.77 10.77 0 0 1 5.64 0c2.15-1.46 3.1-1.15 3.1-1.15.61 1.55.23 2.7.11 2.99.72.79 1.16 1.79 1.16 3.03 0 4.31-2.63 5.26-5.14 5.54.4.35.77 1.03.77 2.08v3.1c0 .3.2.65.78.54A11.25 11.25 0 0 0 12 .75z" />
                  </svg>
                </span>
              </div>
            </div>
            <div>
              <h4 className="footer-heading">About</h4>
              <ul className="footer-links">
                <li>Our school</li>
                <li>Contact the school</li>
              </ul>
            </div>
          </div>
        )}
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Rivermere Secondary School. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
