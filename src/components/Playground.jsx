import { createContext, useContext, useEffect, useMemo, useState } from "react";
import parse from "html-react-parser";
import shell from "../playground.html?raw";
import { GalleryControls, layouts } from "./gallery.jsx";
import ListSettings from "./ListSettings.jsx";

const previews = import.meta.glob("./previews/*.jsx", {
  eager: true,
  import: "default",
});
export const LayoutContext = createContext(null);

const initializeControllers = async () => {
  await import("../../assets/controllers/palettes.js");
  await import("../../assets/controllers/palette-editor.js");
  await import("../../assets/controllers/layout-editor.js");
  await import("../../assets/controllers/automatic-text-colors.js");
  await import("../../assets/controllers/heading-colors.js");
  await import("../../assets/controllers/button-colors.js");
  await import("../../assets/controllers/element-editor.js");
  await import("../../assets/controllers/component-editor.js");
  await import("../../assets/controllers/shadow-editor.js");
  await import("../../assets/controllers/table-editor.js");
  await import("../../assets/controllers/sample-lists-and-icons.js");
  await import("../../assets/controllers/footer-editor.js");
  await import("../../assets/controllers/css-export.js");
  await import("../../assets/controllers/mini-preview.js");
};

export default function Playground() {
  const [selected, setSelected] = useState(0);
  const [listSettings, setListSettings] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("sheklei-list-styles-v1") || "{}") || {}
      );
    } catch {
      return {};
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(
        "sheklei-list-styles-v1",
        JSON.stringify(listSettings),
      );
    } catch {
      /* Settings remain available during this session. */
    }
  }, [listSettings]);
  const content = useMemo(
    () =>
      parse(shell, {
        replace(node) {
          if (node.attribs?.class === "gallery-controls")
            return (
              <GalleryControls selected={selected} onSelect={setSelected} />
            );
          if (node.attribs?.id === "list-settings") return <ListSettings />;
          if (node.attribs?.["data-preview"])
            return <Preview name={node.attribs["data-preview"]} />;
        },
      }),
    [],
  );

  useEffect(() => {
    initializeControllers().catch((error) =>
      console.error("Could not initialize playground controls:", error),
    );
  }, []);

  return (
    <LayoutContext.Provider
      value={{ selected, setSelected, listSettings, setListSettings }}
    >
      {content}
    </LayoutContext.Provider>
  );
}

export function useLayoutSelection() {
  return useContext(LayoutContext);
}

function Preview({ name }) {
  const { selected, listSettings } = useLayoutSelection();
  const index = layouts.findIndex((layout) => layout.id === name);
  const listStyle = Object.fromEntries(
    Object.entries(listSettings[index] || {}).map(([name, value]) => [
      `--list-${name}`,
      value,
    ]),
  );
  const Component = previews[`./previews/${name}.jsx`];
  if (!Component) throw new Error(`Missing preview: ${name}`);
  return <Component hidden={index !== selected} listStyle={listStyle} />;
}
