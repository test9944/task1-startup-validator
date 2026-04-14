import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        return;
      }

      router.push(`/ideas/${data._id}`);
    } catch {
      setError('Failed to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>ValidateAI — Startup Idea Validator</title>
      </Head>
      <div className="container">
        <p className="page-title">Validate Your<br />Startup Idea</p>
        <p className="page-subtitle">Get an AI-generated report on market fit, competitors, risk, and more.</p>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <label>Idea Title</label>
            <input
              type="text"
              placeholder="e.g. AI-powered meal planner for athletes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <label>Description</label>
            <textarea
              placeholder="Describe your startup idea in detail. What problem does it solve? Who are your target customers?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
            />

            {error && <p className="error">{error}</p>}

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
              <button className="btn" type="submit" disabled={loading}>
                {loading ? 'Analyzing...' : 'Validate Idea →'}
              </button>
              {loading && <span style={{ color: 'var(--muted)', fontSize: '13px' }}>This may take 10–15 seconds</span>}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
