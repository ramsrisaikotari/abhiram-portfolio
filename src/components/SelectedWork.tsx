import { selectedWork } from "../data/siteContent";

export default function SelectedWork() {
  return (
    <section id="work" className="section" aria-labelledby="work-title">
      <div className="section-shell">
        <div className="section-heading">
          <p className="section-kicker"><span>02</span> / Selected work</p>
          <h2 id="work-title">Reliability work in production</h2>
          <p className="section-note">{selectedWork.note}</p>
        </div>

        <div className="case-study-list">
          {selectedWork.items.map((item, index) => (
            <article className="case-study" key={item.title}>
              <header className="case-study-header">
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
              </header>
              <div className="case-study-grid">
                <div className="case-study-context">
                  <h4>Context</h4>
                  <p>{item.context}</p>
                </div>
                <div className="case-study-actions">
                  <h4>What I did</h4>
                  <ul>
                    {item.actions.map((action) => (
                      <li key={action}>{action}</li>
                    ))}
                  </ul>
                </div>
                <div className="case-study-outcome">
                  <h4>Outcome</h4>
                  <p>{item.outcome}</p>
                </div>
                <div className="case-study-stack">
                  <h4>Stack</h4>
                  <p>{item.stack}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
