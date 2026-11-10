export default function ModernSchoolCommonsPreview({ hidden, listStyle }) {
  return (
    <section
      className="direction"
      data-label="Original · 3 · Modern School Commons"
      hidden={hidden}
    >
      <div className="heading">
        <div>
          <div className="eyebrow">Direction 03 · Student example</div>
          <h2>Modern School Commons</h2>
          <p>A role-specific view within a shared school identity.</p>
        </div>
        <span className="badge">HTML design preview</span>
      </div>
      <div className="frame">
        <div className="ui commons" style={listStyle}>
          <aside className="nav">
            <div className="brand">
              Rivermere
              <br />
              Secondary School
              <br />
              <small>School community</small>
            </div>
            <ul className="nav-list" aria-label="Preview navigation">
              <li className="item active">⌂ &nbsp; Dashboard</li>
              <li className="item">▤ &nbsp; Classes</li>
              <li className="item">▢ &nbsp; Assignments</li>
              <li className="item">◷ &nbsp; Calendar</li>
              <li className="item">✉ &nbsp; Messages</li>
              <li className="item">▧ &nbsp; Resources</li>
              <li className="item">◎ &nbsp; Community</li>
            </ul>
          </aside>
          <div className="ui-content">
            <main className="main">
              <div className="bar">
                <span>School portal</span>
                <span className="pill">Viewing as: Student ▾</span>
              </div>
              <h3>Welcome back, Jordan.</h3>
              <p className="sub">
                Your classes, assignments, updates and resources in one place.
              </p>
              <div className="columns">
                <section className="panel">
                  <h4>Today’s classes</h4>
                  <div className="row">
                    <strong>English Language Arts · Room 204</strong>
                    <small>›</small>
                  </div>
                  <div className="row">
                    <strong>Mathematics · Room 118</strong>
                    <small>›</small>
                  </div>
                  <div className="row">
                    <strong>Science · Room 221</strong>
                    <small>›</small>
                  </div>
                </section>
                <section className="panel">
                  <span className="chip">Upcoming assignment</span>
                  <h4 style={{ marginTop: "16px", fontSize: "1.15rem" }}>
                    Science: Ecosystems project
                  </h4>
                  <div>Create a short presentation about an ecosystem.</div>
                  <span className="cta">View details →</span>
                </section>
              </div>
              <div className="update">
                <strong>School update</strong>
                <br />
                New clubs and activities are open for sign-up.
              </div>
              <div className="links">
                <span>My schedule →</span>
                <span>School calendar →</span>
                <span>Learning resources →</span>
              </div>
            </main>
          </div>
        </div>
      </div>
      <div className="palette">
        <span style={{ width: "100%", fontWeight: "700", color: "#53645d" }}>
          Original design palette
        </span>
        <div className="swatch">
          <i style={{ background: "#20365C" }}></i>
          <b>Navy</b>
          <br />
          #20365C
        </div>
        <div className="swatch">
          <i style={{ background: "#168C86" }}></i>
          <b>Teal</b>
          <br />
          #168C86
        </div>
        <div className="swatch">
          <i style={{ background: "#E87965" }}></i>
          <b>Coral</b>
          <br />
          #E87965
        </div>
        <div className="swatch">
          <i style={{ background: "#E9B84D" }}></i>
          <b>Gold</b>
          <br />
          #E9B84D
        </div>
        <div className="swatch">
          <i style={{ background: "#F7F8F5" }}></i>
          <b>Background</b>
          <br />
          #F7F8F5
        </div>
        <div className="swatch">
          <i style={{ background: "#253044" }}></i>
          <b>Text</b>
          <br />
          #253044
        </div>
      </div>
    </section>
  );
}
