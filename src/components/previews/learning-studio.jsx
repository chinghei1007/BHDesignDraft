export default function LearningStudioPreview({ hidden, listStyle }) {
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
        <div className="ui studio" style={listStyle}>
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
                <span className="pill">Viewing as: Teacher ▾</span>
              </div>
              <h3>Welcome, Ms. Brooks.</h3>
              <p className="sub">
                Your teaching workspace for classes and communication.
              </p>
              <div className="columns">
                <section className="panel">
                  <h4>My teaching schedule</h4>
                  <div className="row">
                    <strong>English 7 · Room 204</strong>
                    <small>›</small>
                  </div>
                  <div className="row">
                    <strong>English 9 · Room 206</strong>
                    <small>›</small>
                  </div>
                  <div className="row">
                    <strong>Literature 12 · Room 208</strong>
                    <small>›</small>
                  </div>
                </section>
                <section className="panel">
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
              <div className="update">
                <strong>Class updates</strong>
                <br />
                Essay drafts have been submitted and are ready to review.
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
    </section>
  );
}
