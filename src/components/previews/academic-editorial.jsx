export default function AcademicEditorialPreview({ hidden, listStyle }) {
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
        <div className="ui editorial" style={listStyle}>
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
                <span className="pill">Viewing as: Parent ▾</span>
              </div>
              <h3>Welcome, families.</h3>
              <p className="sub">
                Stay connected with your child’s learning and school life.
              </p>
              <div className="columns">
                <section className="panel">
                  <h4>Your child</h4>
                  <div className="row">
                    <strong>Avery Chen · Grade 10</strong>
                    <small>›</small>
                  </div>
                  <div className="row">
                    <strong>Academics</strong>
                    <small>›</small>
                  </div>
                  <div className="row">
                    <strong>Teacher updates</strong>
                    <small>›</small>
                  </div>
                </section>
                <section className="panel">
                  <span className="chip">Upcoming event</span>
                  <h4 style={{ marginTop: "16px", fontSize: "1.15rem" }}>
                    Winter choir concert
                  </h4>
                  <div>An evening celebrating our school community.</div>
                  <span className="cta">View details →</span>
                </section>
              </div>
              <div className="update">
                <strong>Teacher update</strong>
                <br />
                Avery’s essay draft shows strong ideas. View feedback for the
                next step.
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
    </section>
  );
}
