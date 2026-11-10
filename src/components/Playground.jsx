import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import parse, { domToReact } from "html-react-parser";
import MiniPreview from "./MiniPreview.jsx";
import shell from "../playground.html?raw";
import { GalleryControls, layouts } from "./gallery.jsx";
import ListSettings from "./ListSettings.jsx";
import PaletteInfo from "./PaletteInfo.jsx";
import { foreground } from "./TextColorSettings.jsx";
import TableSettings from "./TableSettings.jsx";
import FooterSettings from "./FooterSettings.jsx";
import ShadowSettings from "./ShadowSettings.jsx";
import { ContainerRadius } from "./ElementSettings.jsx";
import { readComponentTargets } from "./ComponentSettings.jsx";
import {
  TypeEditor,
  ContainerSelect,
  SpacingEditor,
  EditorTitle,
  ResetLayout,
  layoutStyles,
} from "./LayoutSettings.jsx";
import { palettes } from "./palette-data.js";

const previews = import.meta.glob("./previews/*.jsx", {
  eager: true,
  import: "default",
});
export const LayoutContext = createContext(null);

export default function Playground() {
  const [saveStatus, setSaveStatus] = useState("Changes save in this browser.");
  const [selected, setSelected] = useState(0);
  const [container, setContainer] = useState("main");
  const [shadowSettings, setShadowSettings] = useState(() => {
    try {
      return (
        JSON.parse(
          localStorage.getItem("sheklei-container-shadow-v1") || "{}",
        ) || {}
      );
    } catch {
      return {};
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(
        "sheklei-container-shadow-v1",
        JSON.stringify(shadowSettings),
      );
    } catch {
      setSaveStatus(
        "Changes are visible, but this browser could not save them.",
      );
    }
  }, [shadowSettings]);
  const [layoutSettings, setLayoutSettings] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("sheklei-design-layout-v1") || "{}") ||
        {}
      );
    } catch {
      return {};
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(
        "sheklei-design-layout-v1",
        JSON.stringify(layoutSettings),
      );
    } catch {
      setSaveStatus(
        "Changes are visible, but this browser could not save them.",
      );
    }
  }, [layoutSettings]);
  const [palette, setPalette] = useState("original");
  const [colorsDisabled, setColorsDisabled] = useState(() => {
    try {
      return localStorage.getItem("sheklei-disable-color-scheme-v1") === "true";
    } catch {
      return false;
    }
  });
  useEffect(() => {
    document.body.classList.toggle("colors-disabled", colorsDisabled);
    try {
      localStorage.setItem(
        "sheklei-disable-color-scheme-v1",
        String(colorsDisabled),
      );
    } catch {
      setSaveStatus(
        "Changes are visible, but this browser could not save them.",
      );
    }
  }, [colorsDisabled]);
  const [customColors, setCustomColors] = useState(() => {
    try {
      return (
        JSON.parse(
          localStorage.getItem("sheklei-design-playground-v1") || "{}",
        ) || {}
      );
    } catch {
      return {};
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(
        "sheklei-design-playground-v1",
        JSON.stringify(customColors),
      );
    } catch {
      setSaveStatus(
        "Changes are visible, but this browser could not save them.",
      );
    }
  }, [customColors]);
  const [textSettings, setTextSettings] = useState(() => {
    try {
      const saved =
        JSON.parse(localStorage.getItem("sheklei-text-color-v1") || "{}") || {};
      Object.entries(customColors).forEach(([index, values]) => {
        if (!saved[index] && values["--ink"])
          saved[index] = { mode: "custom", color: values["--ink"] };
      });
      return saved;
    } catch {
      return {};
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(
        "sheklei-text-color-v1",
        JSON.stringify(textSettings),
      );
    } catch {
      setSaveStatus(
        "Changes are visible, but this browser could not save them.",
      );
    }
  }, [textSettings]);
  const [headingColors, setHeadingColors] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("sheklei-heading-colors-v1") || "{}") ||
        {}
      );
    } catch {
      return {};
    }
  });
  const [buttonColors, setButtonColors] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("sheklei-button-colors-v1") || "{}") ||
        {}
      );
    } catch {
      return {};
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(
        "sheklei-heading-colors-v1",
        JSON.stringify(headingColors),
      );
    } catch {
      setSaveStatus(
        "Changes are visible, but this browser could not save them.",
      );
    }
  }, [headingColors]);
  useEffect(() => {
    try {
      localStorage.setItem(
        "sheklei-button-colors-v1",
        JSON.stringify(buttonColors),
      );
    } catch {
      setSaveStatus(
        "Changes are visible, but this browser could not save them.",
      );
    }
  }, [buttonColors]);
  const [listVisibility, setListVisibility] = useState(() => {
    try {
      return (
        JSON.parse(
          localStorage.getItem("sheklei-sample-list-visibility-v1") || "{}",
        ) || {}
      );
    } catch {
      return {};
    }
  });
  const [icons, setIcons] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("sheklei-sidebar-icons-v1") || "{}") ||
        {}
      );
    } catch {
      return {};
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(
        "sheklei-sample-list-visibility-v1",
        JSON.stringify(listVisibility),
      );
      localStorage.setItem("sheklei-sidebar-icons-v1", JSON.stringify(icons));
    } catch {
      setSaveStatus(
        "Changes are visible, but this browser could not save them.",
      );
    }
  }, [listVisibility, icons]);
  const [elementSettings, setElementSettings] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("sheklei-element-styles-v1") || "{}") ||
        {}
      );
    } catch {
      return {};
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(
        "sheklei-element-styles-v1",
        JSON.stringify(elementSettings),
      );
    } catch {
      setSaveStatus(
        "Changes are visible, but this browser could not save them.",
      );
    }
  }, [elementSettings]);
  const [componentSettings, setComponentSettings] = useState(() => {
    try {
      return (
        JSON.parse(
          localStorage.getItem("sheklei-component-styles-v1") || "{}",
        ) || {}
      );
    } catch {
      return {};
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(
        "sheklei-component-styles-v1",
        JSON.stringify(componentSettings),
      );
    } catch {
      setSaveStatus(
        "Changes are visible, but this browser could not save them.",
      );
    }
  }, [componentSettings]);
  const [footerSettings, setFooterSettings] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("sheklei-footer-styles-v1") || "{}") ||
        {}
      );
    } catch {
      return {};
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(
        "sheklei-footer-styles-v1",
        JSON.stringify(footerSettings),
      );
    } catch {
      setSaveStatus(
        "Changes are visible, but this browser could not save them.",
      );
    }
  }, [footerSettings]);
  const [tableSettings, setTableSettings] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("sheklei-table-styles-v1") || "{}") ||
        {}
      );
    } catch {
      return {};
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(
        "sheklei-table-styles-v1",
        JSON.stringify(tableSettings),
      );
    } catch {
      setSaveStatus(
        "Changes are visible, but this browser could not save them.",
      );
    }
  }, [tableSettings]);
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
      setSaveStatus(
        "Changes are visible, but this browser could not save them.",
      );
    }
  }, [listSettings]);
  const content = useMemo(() => {
    const options = {
      replace(node) {
        if (node.attribs?.class === "settings-panel")
          return (
            <aside
              className="settings-panel"
              aria-label="Typography and spacing settings"
            >
              <MiniPreview />
              {domToReact(node.children, options)}
            </aside>
          );
        if (node.attribs?.class === "gallery-controls")
          return <GalleryControls />;
        if (node.attribs?.id === "type-editor") return <TypeEditor />;
        if (node.attribs?.id === "spacing-editor")
          return (
            <>
              <SpacingEditor />
              <ContainerRadius />
              <ShadowSettings />
            </>
          );
        if (node.attribs?.id === "container-select") return <ContainerSelect />;
        if (node.attribs?.id === "editor-current") return <EditorTitle />;
        if (node.attribs?.id === "reset-layout") return <ResetLayout />;
        if (node.attribs?.id === "layout-save-status") return <SaveStatus />;
        if (node.attribs?.id === "active-palette") return <PaletteInfo />;
        if (node.attribs?.id === "list-settings")
          return (
            <>
              <TableSettings />
              <FooterSettings />
              <ListSettings />
            </>
          );
        if (node.attribs?.["data-preview"])
          return <Preview name={node.attribs["data-preview"]} />;
      },
    };
    return parse(shell, options);
  }, []);

  return (
    <LayoutContext.Provider
      value={{
        selected,
        setSelected,
        saveStatus,
        container,
        setContainer,
        shadowSettings,
        setShadowSettings,
        layoutSettings,
        setLayoutSettings,
        listSettings,
        setListSettings,
        palette,
        setPalette,
        colorsDisabled,
        setColorsDisabled,
        customColors,
        setCustomColors,
        textSettings,
        setTextSettings,
        headingColors,
        setHeadingColors,
        buttonColors,
        setButtonColors,
        componentSettings,
        setComponentSettings,
        elementSettings,
        setElementSettings,
        listVisibility,
        setListVisibility,
        icons,
        setIcons,
        tableSettings,
        setTableSettings,
        footerSettings,
        setFooterSettings,
      }}
    >
      {content}
    </LayoutContext.Provider>
  );
}

export function useLayoutSelection() {
  return useContext(LayoutContext);
}

function Preview({ name }) {
  const {
    selected,
    listSettings,
    palette,
    tableSettings,
    footerSettings,
    layoutSettings,
    customColors,
    shadowSettings,
    textSettings,
    headingColors,
    buttonColors,
    componentSettings,
    elementSettings,
    listVisibility,
    icons,
  } = useLayoutSelection();
  const index = layouts.findIndex((layout) => layout.id === name);
  const listStyle = Object.fromEntries(
    Object.entries(listSettings[index] || {}).map(([name, value]) => [
      `--list-${name}`,
      value,
    ]),
  );
  const designLayout = layoutStyles(layoutSettings[index]);
  const chosen = palettes[palette];
  const paletteStyle = chosen
    ? Object.fromEntries(
        ["--nav", "--bg", "--ink", "--accent", "--soft"].map((key, i) => [
          key,
          chosen[i + 1],
        ]),
      )
    : {};
  const nav = customColors[index]?.["--nav"];
  const brightness =
    nav && /^#[0-9a-f]{6}$/i.test(nav)
      ? [1, 3, 5]
          .map((i) => parseInt(nav.slice(i, i + 2), 16))
          .reduce(
            (sum, value, i) => sum + value * [0.2126, 0.7152, 0.0722][i],
            0,
          )
      : null;
  const colorClass =
    brightness !== null
      ? `palette-override palette-${brightness > 150 ? "light" : "dark"}`
      : chosen
        ? `palette-override palette-${chosen[6]}`
        : "";
  const paletteClass = `${colorClass} ${icons[index] === false ? "nav-icons-hidden" : ""}`;
  const uiRef = useRef(null);
  const [autoStyle, setAutoStyle] = useState({});
  const [componentTargets, setComponentTargets] = useState({
    buttons: [],
    items: [],
    buttonLabels: [],
    itemLabels: [],
  });
  useLayoutEffect(() => {
    setComponentTargets(readComponentTargets(uiRef.current));
  }, []);
  useLayoutEffect(() => {
    if (!uiRef.current) return;
    const style = getComputedStyle(uiRef.current);
    const record = textSettings[index] || {};
    const next = {
      "--auto-page-text":
        record.mode === "custom"
          ? record.color
          : foreground(style.getPropertyValue("--bg")),
      "--auto-nav-text": foreground(style.getPropertyValue("--nav")),
      "--auto-panel-text": foreground("#ffffff"),
      "--auto-soft-text": foreground(style.getPropertyValue("--soft")),
      "--auto-accent-text": foreground(style.getPropertyValue("--accent")),
    };
    setAutoStyle((previous) =>
      Object.keys(next).every((key) => previous[key] === next[key])
        ? previous
        : next,
    );
  }, [palette, customColors[index], textSettings[index], index]);
  const headingStyle = Object.fromEntries(
    Object.entries(headingColors[index] || {}).map(([name, value]) => [
      `--custom-${name}`,
      value,
    ]),
  );
  const buttonStyle = buttonColors[index]
    ? {
        "--custom-button-bg": buttonColors[index],
        "--custom-button-text": foreground(buttonColors[index]),
      }
    : {};
  const Component = previews[`./previews/${name}.jsx`];
  if (!Component) throw new Error(`Missing preview: ${name}`);
  return (
    <Component
      hidden={index !== selected}
      listStyle={{
        ...listStyle,
        ...paletteStyle,
        ...customColors[index],
        ...designLayout.typography,
        ...autoStyle,
        ...headingStyle,
        ...buttonStyle,
      }}
      layoutStyles={designLayout.elements}
      uiRef={uiRef}
      autoStyle={autoStyle}
      componentConfig={componentSettings[index]}
      elementConfig={elementSettings[index]}
      showLists={listVisibility[index] !== false}
      componentTargets={componentTargets}
      paletteClass={paletteClass}
      tableConfig={tableSettings[index]}
      footerConfig={footerSettings[index]}
      shadowConfig={shadowSettings[index]}
      index={index}
    />
  );
}

function SaveStatus() {
  const { saveStatus } = useLayoutSelection();
  return (
    <p id="layout-save-status" className="save-status" aria-live="polite">
      {saveStatus}
    </p>
  );
}
