import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

function riskBadge(risk) {
  const map = { Low: 'badge-low', Medium: 'badge-medium', High: 'badge-high' };
  return map[risk] || 'badge-score';
}

export default function IdeaDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/ideas/${id}`)
      .then((r) => r.json())
      .then((data) => setIdea(data))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!confirm('Delete this idea?')) return;
    setDeleting(true);
    await fetch(`/api/ideas/${id}`, { method: 'DELETE' });
    router.push('/dashboard');
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        Loading report...
      </div>
    );
  }

  if (!idea || idea.error) {
    return (
      <div className="container">
        <p className="error">Idea not found.</p>
      </div>
    );
  }

  const { report } = idea;

  return (
    <>
      <Head>
        <title>{idea.title} — ValidateAI</title>
      </Head>
      <div className="container">
        <Link href="/dashboard" className="back-link">← Back to Dashboard</Link>

        <div className="row" style={{ marginBottom: '32px' }}>
          <div>
            <h1 className="page-title" style={{ marginBottom: '8px' }}>{idea.title}</h1>
            <p style={{ color: 'var(--muted)', fontSize: '15px' }}>{idea.description}</p>
          </div>
          <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>

        <div className="badges" style={{ marginBottom: '40px', gap: '12px' }}>
          <span className={`badge ${riskBadge(report.risk_level)}`} style={{ fontSize: '14px', padding: '6px 14px' }}>
            {report.risk_level} Risk
          </span>
          <span className="badge badge-score" style={{ fontSize: '14px', padding: '6px 14px' }}>
            Profitability: {report.profitability_score}/100
          </span>
        </div>

        <div className="card" style={{ marginBottom: '16px' }}>
          <div className="report-section">
            <h3>Profitability Score</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="score-bar" style={{ flex: 1 }}>
                <div className="score-fill" style={{ width: `${report.profitability_score}%` }} />
              </div>
              <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '18px' }}>{report.profitability_score}</span>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '16px' }}>
          <div className="report-section">
            <h3>Problem</h3>
            <p className="report-value">{report.problem}</p>
          </div>
          <hr className="divider" />
          <div className="report-section">
            <h3>Target Customer</h3>
            <p className="report-value">{report.customer}</p>
          </div>
          <hr className="divider" />
          <div className="report-section" style={{ marginBottom: 0 }}>
            <h3>Market Overview</h3>
            <p className="report-value">{report.market}</p>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '16px' }}>
          <div className="report-section">
            <h3>Competitors</h3>
            {report.competitor && report.competitor.map((c, i) => (
              <div key={i} className="competitor-item">
                <p className="competitor-name">{c.name || c}</p>
                {c.differentiation && <p className="competitor-diff">{c.differentiation}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginBottom: '16px' }}>
          <div className="report-section" style={{ marginBottom: 0 }}>
            <h3>Suggested Tech Stack</h3>
            <div className="tech-tags">
              {report.tech_stack && report.tech_stack.map((t, i) => (
                <span key={i} className="tech-tag">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {report.justification && (
          <div className="card">
            <div className="report-section" style={{ marginBottom: 0 }}>
              <h3>Analyst Justification</h3>
              <div className="justification-box">{report.justification}</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
