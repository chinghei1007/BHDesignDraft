import { NavigationIcon, SampleLists } from "../NavigationPreview.jsx";
import { elementCss } from "../ElementSettings.jsx";
import { componentCss } from "../ComponentSettings.jsx";
import { shadowCss } from "../ShadowSettings.jsx";
import PaletteEditor from "../PaletteEditor.jsx";
import { FooterPreview, footerCss } from "../FooterSettings.jsx";
import { TablePreview, tableCss } from "../TableSettings.jsx";

export default function AcademicEditorialPreview({
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
      data-label="Original · 1 · Academic Editorial"
      hidden={hidden}
    >
      <div className="heading">
        <div>
          <div className="eyebrow">Direction 01 · Parent example</div>
          <h2>Academic Editorial</h2>
          <p>A role-specific view within a shared school identity.</p>
        </div>
        <span className="badge">HTML design preview</span>
      </div>
      <div className="frame">
        <div
          className={`ui editorial ${paletteClass}`}
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
                <span className="pill">Viewing as: Parent ▾</span>
              </div>
              <h3>Welcome, families.</h3>
              <p className="sub">
                Stay connected with your child’s learning and school life.
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
                  <h4>Your child</h4>
                  <div
                    className="row"
                    style={layoutStyles.rows}
                    data-editor-gap={layoutStyles.rows.gap ? "" : undefined}
                  >
                    <strong>Avery Chen · Grade 10</strong>
                    <small>›</small>
                  </div>
                  <div
                    className="row"
                    style={layoutStyles.rows}
                    data-editor-gap={layoutStyles.rows.gap ? "" : undefined}
                  >
                    <strong>Academics</strong>
                    <small>›</small>
                  </div>
                  <div
                    className="row"
                    style={layoutStyles.rows}
                    data-editor-gap={layoutStyles.rows.gap ? "" : undefined}
                  >
                    <strong>Teacher updates</strong>
                    <small>›</small>
                  </div>
                </section>
                <section
                  className="panel"
                  style={layoutStyles.cards}
                  data-editor-gap={layoutStyles.cards.gap ? "" : undefined}
                >
                  <span className="chip">Upcoming event</span>
                  <h4 style={{ marginTop: "16px", fontSize: "1.15rem" }}>
                    Winter choir concert
                  </h4>
                  <div>An evening celebrating our school community.</div>
                  <span className="cta">View details →</span>
                </section>
              </div>
              <div
                className="update"
                style={layoutStyles.update}
                data-editor-gap={layoutStyles.update.gap ? "" : undefined}
              >
                <strong>Teacher update</strong>
                <br />
                Avery’s essay draft shows strong ideas. View feedback for the
                next step.
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
          <i style={{ background: "#244B40" }}></i>
          <b>Forest</b>
          <br />
          #244B40
        </div>
        <div className="swatch">
          <i style={{ background: "#C66A4A" }}></i>
          <b>Terracotta</b>
          <br />
          #C66A4A
        </div>
        <div className="swatch">
          <i style={{ background: "#C9A45C" }}></i>
          <b>Gold</b>
          <br />
          #C9A45C
        </div>
        <div className="swatch">
          <i style={{ background: "#F7F4EC" }}></i>
          <b>Cream</b>
          <br />
          #F7F4EC
        </div>
        <div className="swatch">
          <i style={{ background: "#202D2A" }}></i>
          <b>Ink</b>
          <br />
          #202D2A
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
