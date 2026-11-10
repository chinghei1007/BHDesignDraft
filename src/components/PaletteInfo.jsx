import { palettes } from "./palette-data.js";
import { useLayoutSelection } from "./Playground.jsx";

export default function PaletteInfo() {
  const { palette } = useLayoutSelection();
  const colors = palettes[palette];
  return (
    <div id="active-palette" className="palette" aria-live="polite">
      {colors
        ? ["Navigation", "Background", "Text", "Accent", "Surface"].map(
            (label, index) => (
              <div className="swatch" key={label}>
                <i style={{ background: colors[index + 1] }} />
                {label} {colors[index + 1].toUpperCase()}
              </div>
            ),
          )
        : "Original palette: see the swatches below the selected design."}
    </div>
  );
}
