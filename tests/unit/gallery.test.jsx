import { useState } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { LayoutContext } from "../../src/components/Playground.jsx";
import {
  GalleryControls,
  layouts,
  wrapLayout,
} from "../../src/components/gallery.jsx";

const values = new Map();
Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    clear: () => values.clear(),
  },
});

function Harness() {
  const [selected, setSelected] = useState(0);
  return (
    <LayoutContext.Provider value={{ selected, setSelected }}>
      <GalleryControls />
    </LayoutContext.Provider>
  );
}
afterEach(() => {
  cleanup();
  localStorage.clear();
  document.body.classList.remove("colors-disabled");
});

describe("gallery controls", () => {
  it("wraps navigation at either end of the layout list", () => {
    expect(wrapLayout(-1)).toBe(layouts.length - 1);
    expect(wrapLayout(layouts.length)).toBe(0);
  });
  it("updates the selected layout and counter when navigating", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Next design" }));
    expect(
      screen.getByRole("combobox", { name: "Choose a layout" }).value,
    ).toBe("1");
    expect(screen.getByText("2 / 14")).toBeTruthy();
    fireEvent.change(
      screen.getByRole("combobox", { name: "Choose a layout" }),
      { target: { value: "5" } },
    );
    expect(screen.getByText("6 / 14")).toBeTruthy();
  });
  it("restores and updates the color-scheme preference", () => {
    localStorage.setItem("sheklei-disable-color-scheme-v1", "true");
    render(<Harness />);
    const toggle = screen.getByRole("checkbox", {
      name: "Disable color scheme",
    });
    expect(toggle.checked).toBe(true);
    expect(document.body.classList.contains("colors-disabled")).toBe(true);
    fireEvent.click(toggle);
    expect(localStorage.getItem("sheklei-disable-color-scheme-v1")).toBe(
      "false",
    );
    expect(document.body.classList.contains("colors-disabled")).toBe(false);
  });
});
