import { NavigationIcon, SampleLists } from "../NavigationPreview.jsx";
import { elementCss } from "../ElementSettings.jsx";
import { componentCss } from "../ComponentSettings.jsx";
import { shadowCss } from "../ShadowSettings.jsx";
import PaletteEditor from "../PaletteEditor.jsx";
import { FooterPreview, footerCss } from "../FooterSettings.jsx";
import { TablePreview, tableCss } from "../TableSettings.jsx";

export default function LearningStudioPreview({
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
      data-label="Original · 2 · Learning Studio"
      hidden={hidden}
    >
      <div className="heading">
        <div>
          <div className="eyebrow">Direction 02 · Teacher example</div>
          <h2>Learning Studio</h2>
          <p>A role-specific view within a shared school identity.</p>
        </div>
        <span className="badge">HTML design preview</span>
      </div>
      <div className="frame">
        <div
          className={`ui studio ${paletteClass}`}
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
                <span className="pill">Viewing as: Teacher ▾</span>
              </div>
              <h3>Welcome, Ms. Brooks.</h3>
              <p className="sub">
                Your teaching workspace for classes and communication.
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
                  <h4>My teaching schedule</h4>
                  <div
                    className="row"
                    style={layoutStyles.rows}
                    data-editor-gap={layoutStyles.rows.gap ? "" : undefined}
                  >
                    <strong>English 7 · Room 204</strong>
                    <small>›</small>
                  </div>
                  <div
                    className="row"
                    style={layoutStyles.rows}
                    data-editor-gap={layoutStyles.rows.gap ? "" : undefined}
                  >
                    <strong>English 9 · Room 206</strong>
                    <small>›</small>
                  </div>
                  <div
                    className="row"
                    style={layoutStyles.rows}
                    data-editor-gap={layoutStyles.rows.gap ? "" : undefined}
                  >
                    <strong>Literature 12 · Room 208</strong>
                    <small>›</small>
                  </div>
                </section>
                <section
                  className="panel"
                  style={layoutStyles.cards}
                  data-editor-gap={layoutStyles.cards.gap ? "" : undefined}
                >
                  <span className="chip">Next up</span>
                  <h4 style={{ marginTop: "16px", fontSize: "1.15rem" }}>
                    Review student work
                  </h4>
                  <div>
                    Check submissions, give feedback and return work to
                    students.
                  </div>
                  <span className="cta">View details →</span>
                </section>
              </div>
              <div
                className="update"
                style={layoutStyles.update}
                data-editor-gap={layoutStyles.update.gap ? "" : undefined}
              >
                <strong>Class updates</strong>
                <br />
                Essay drafts have been submitted and are ready to review.
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
          <i style={{ background: "#3C4F9B" }}></i>
          <b>Indigo</b>
          <br />
          #3C4F9B
        </div>
        <div className="swatch">
          <i style={{ background: "#19A39A" }}></i>
          <b>Turquoise</b>
          <br />
          #19A39A
        </div>
        <div className="swatch">
          <i style={{ background: "#8A6DC1" }}></i>
          <b>Violet</b>
          <br />
          #8A6DC1
        </div>
        <div className="swatch">
          <i style={{ background: "#F2C65C" }}></i>
          <b>Yellow</b>
          <br />
          #F2C65C
        </div>
        <div className="swatch">
          <i style={{ background: "#F4F7FC" }}></i>
          <b>Background</b>
          <br />
          #F4F7FC
        </div>
        <div className="swatch">
          <i style={{ background: "#202B48" }}></i>
          <b>Navy</b>
          <br />
          #202B48
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
