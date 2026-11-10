import { describe, expect, it } from "vitest";
import { foreground } from "../../src/components/TextColorSettings.jsx";
import { layoutStyles } from "../../src/components/LayoutSettings.jsx";
import { tableCss } from "../../src/components/TableSettings.jsx";

describe("style models", () => {
  it("chooses contrasting text for light and dark backgrounds", () => {
    expect(foreground("#ffffff")).toBe("#18291f");
    expect(foreground("#000000")).toBe("#ffffff");
  });
  it("applies side-specific spacing over broader values", () => {
    const result = layoutStyles({
      font: { base: 19 },
      spacing: { main: { padding: { all: "4", horizontal: "3", left: "2" } } },
    });
    expect(result.typography["--ed-base"]).toBe("19px");
    expect(result.elements.main).toMatchObject({
      paddingTop: "1rem",
      paddingRight: "0.75rem",
      paddingLeft: "0.5rem",
    });
  });
  it("generates scoped table rules only when the table is enabled", () => {
    expect(tableCss(3, {})).toBe("");
    expect(tableCss(3, { show: true, padding: 21 })).toContain(
      '.ui[data-table-editor="3"] .table-preview th',
    );
    expect(tableCss(3, { show: true, padding: 21 })).toContain("padding:21px");
  });
});
