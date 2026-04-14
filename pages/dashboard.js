import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

function riskBadge(risk) {
  const map = { Low: 'badge-low', Medium: 'badge-medium', High: 'badge-high' };
  return map[risk] || 'badge-score';
}

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function Dashboard() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/ideas')
      .then((r) => r.json())
      .then((data) => setIdeas(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard — ValidateAI</title>
      </Head>
      <div className="container">
        <div className="row" style={{ marginBottom: '48px' }}>
          <div>
            <p className="page-title">Dashboard</p>
            <p className="page-subtitle" style={{ marginBottom: 0 }}>{ideas.length} idea{ideas.length !== 1 ? 's' : ''} validated</p>
          </div>
          <Link href="/" className="btn">+ New Idea</Link>
        </div>

        {loading && (
          <div className="loading">
            <div className="spinner" />
            Loading ideas...
          </div>
        )}

        {!loading && ideas.length === 0 && (
          <div className="empty-state">
            <h3>No ideas yet</h3>
            <p style={{ marginBottom: '24px' }}>Submit your first startup idea to get started.</p>
            <Link href="/" className="btn">Validate an Idea</Link>
          </div>
        )}

        {!loading && ideas.length > 0 && (
          <div className="grid">
            {ideas.map((idea) => (
              <Link key={idea._id} href={`/ideas/${idea._id}`} className="idea-card">
                <p className="idea-title">{idea.title}</p>
                <p className="idea-desc">{idea.description}</p>
                <div className="badges">
                  {idea.report?.risk_level && (
                    <span className={`badge ${riskBadge(idea.report.risk_level)}`}>
                      {idea.report.risk_level} Risk
                    </span>
                  )}
                  {idea.report?.profitability_score != null && (
                    <span className="badge badge-score">
                      Score: {idea.report.profitability_score}/100
                    </span>
                  )}
                  <span className="meta" style={{ marginLeft: 'auto' }}>{timeAgo(idea.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
