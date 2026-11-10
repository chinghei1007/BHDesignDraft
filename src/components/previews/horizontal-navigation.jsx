import { NavigationIcon, SampleLists } from "../NavigationPreview.jsx";
import { elementCss } from "../ElementSettings.jsx";
import { componentCss } from "../ComponentSettings.jsx";
import { shadowCss } from "../ShadowSettings.jsx";
import PaletteEditor from "../PaletteEditor.jsx";
import { FooterPreview, footerCss } from "../FooterSettings.jsx";
import { TablePreview, tableCss } from "../TableSettings.jsx";

export default function HorizontalNavigationPreview({
  hidden,
  listStyle,
  uiRef,
  autoStyle,
  layoutStyles,
  paletteClass,
  tableConfig,
  footerConfig,
  shadowConfig,
  componentConfig,
  showLists,
  elementConfig,
  componentTargets,
  index,
}) {
  return (
    <section
      className="direction"
      data-label="Navigation · Horizontal navigation"
      hidden={hidden}
    >
      <div className="heading">
        <div>
          <div className="eyebrow">Direction 05 · Navigation layout</div>
          <h2>Horizontal navigation</h2>
          <p>
            All primary destinations sit in a compact top bar, leaving the full
            width for content.
          </p>
        </div>
        <span className="badge">HTML design preview</span>
      </div>
      <div className="frame">
        <div
          className={`ui soft topnav ${paletteClass}`}
          style={listStyle}
          ref={uiRef}
          data-table-editor={index}
          data-footer-editor={index}
          data-shadow-editor={index}
          data-component-editor={index}
          data-element-editor={index}
        >
          <aside
            className="nav"
            style={layoutStyles.navigation}
            data-editor-gap={layoutStyles.navigation.gap ? "" : undefined}
          >
            <div className="brand">
              Rivermere
              <br />
              Secondary School
              <br />
              <small>School community</small>
            </div>
            <ul className="nav-list" aria-label="Preview navigation">
              <li className="item active">
                <NavigationIcon index={0} /> Dashboard
              </li>
              <li className="item">
                <NavigationIcon index={1} /> Classes
              </li>
              <li className="item">
                <NavigationIcon index={2} /> Assignments
              </li>
              <li className="item">
                <NavigationIcon index={3} /> Calendar
              </li>
              <li className="item">
                <NavigationIcon index={4} /> Messages
              </li>
              <li className="item">
                <NavigationIcon index={5} /> Resources
              </li>
              <li className="item">
                <NavigationIcon index={6} /> Community
              </li>
            </ul>
          </aside>
          <div className="ui-content">
            <main
              className="main"
              style={layoutStyles.main}
              data-editor-gap={layoutStyles.main.gap ? "" : undefined}
            >
              <div className="bar">
                <span>School portal</span>
                <span className="pill">Viewing as: Student ▾</span>
              </div>
              <h3>Welcome back, Jordan.</h3>
              <p className="sub">
                Your classes, assignments, updates and resources in one place.
              </p>
              <div
                className="columns"
                style={layoutStyles.columns}
                data-editor-gap={layoutStyles.columns.gap ? "" : undefined}
              >
                <section
                  className="panel"
                  style={layoutStyles.cards}
                  data-editor-gap={layoutStyles.cards.gap ? "" : undefined}
                >
                  <h4>Today’s classes</h4>
                  <div
                    className="row"
                    style={layoutStyles.rows}
                    data-editor-gap={layoutStyles.rows.gap ? "" : undefined}
                  >
                    <strong>English Language Arts · Room 204</strong>
                    <small>›</small>
                  </div>
                  <div
                    className="row"
                    style={layoutStyles.rows}
                    data-editor-gap={layoutStyles.rows.gap ? "" : undefined}
                  >
                    <strong>Mathematics · Room 118</strong>
                    <small>›</small>
                  </div>
                  <div
                    className="row"
                    style={layoutStyles.rows}
                    data-editor-gap={layoutStyles.rows.gap ? "" : undefined}
                  >
                    <strong>Science · Room 221</strong>
                    <small>›</small>
                  </div>
                </section>
                <section
                  className="panel"
                  style={layoutStyles.cards}
                  data-editor-gap={layoutStyles.cards.gap ? "" : undefined}
                >
                  <span className="chip">Upcoming assignment</span>
                  <h4 style={{ marginTop: "16px", fontSize: "1.15rem" }}>
                    Science: Ecosystems project
                  </h4>
                  <div>Create a short presentation about an ecosystem.</div>
                  <span className="cta">View details →</span>
                </section>
              </div>
              <div
                className="update"
                style={layoutStyles.update}
                data-editor-gap={layoutStyles.update.gap ? "" : undefined}
              >
                <strong>School update</strong>
                <br />
                New clubs and activities are open for sign-up.
              </div>
              <div
                className="links"
                style={layoutStyles.links}
                data-editor-gap={layoutStyles.links.gap ? "" : undefined}
              >
                <span>My schedule →</span>
                <span>School calendar →</span>
                <span>Learning resources →</span>
              </div>
              <TablePreview config={tableConfig} />
              <SampleLists visible={showLists} />
            </main>
            <FooterPreview config={footerConfig} />
          </div>
        </div>
      </div>
      <PaletteEditor
        index={index}
        autoStyle={autoStyle}
        componentTargets={componentTargets}
      />
      <div className="palette">
        <span style={{ width: "100%", fontWeight: "700", color: "#53645d" }}>
          Original design palette
        </span>
        <div className="swatch">
          <i style={{ background: "#E7EEEA" }}></i>
          <b>Sage</b>
          <br />
          #E7EEEA
        </div>
        <div className="swatch">
          <i style={{ background: "#42736A" }}></i>
          <b>Teal</b>
          <br />
          #42736A
        </div>
        <div className="swatch">
          <i style={{ background: "#E7F0E9" }}></i>
          <b>Mint</b>
          <br />
          #E7F0E9
        </div>
        <div className="swatch">
          <i style={{ background: "#F7F9F6" }}></i>
          <b>Background</b>
          <br />
          #F7F9F6
        </div>
        <div className="swatch">
          <i style={{ background: "#283B38" }}></i>
          <b>Text</b>
          <br />
          #283B38
        </div>
      </div>
      <style className="element-style-rules">
        {elementCss(index, elementConfig)}
      </style>
      <style className="component-style-rules">
        {componentCss(index, componentConfig, componentTargets)}
      </style>
      <style className="shadow-style-rules">
        {shadowCss(index, shadowConfig)}
      </style>
      <style className="footer-style-rules">
        {footerCss(index, footerConfig)}
      </style>
      <style className="table-style-rules">
        {tableCss(index, tableConfig)}
      </style>
    </section>
  );
}
