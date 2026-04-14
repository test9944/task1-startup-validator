import clientPromise from '../../../lib/mongodb';

async function analyzeIdea(title, description) {
  const prompt = `You are an expert startup consultant. Analyze the given startup idea and return a structured JSON object with the fields: problem, customer, market, competitor, tech_stack, risk_level, profitability_score, justification. Rules: - Keep answers concise and realistic. - 'competitor' should contain exactly 3 competitors with one-line differentiation each. - 'tech_stack' should be 4–6 practical technologies for MVP. - 'profitability_score' must be an integer between 0–100. - 'risk_level' must be one of: Low, Medium, High. Return ONLY JSON, no markdown, no backticks. Input: ${JSON.stringify({ title, description })}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await res.json();
  const text = data.content[0].text.replace(/```json|```/g, '').trim();
  return JSON.parse(text);
}

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('startup_validator');
  const ideas = db.collection('ideas');

  if (req.method === 'GET') {
    const data = await ideas
      .find({}, { projection: { title: 1, description: 1, createdAt: 1, 'report.risk_level': 1, 'report.profitability_score': 1 } })
      .sort({ createdAt: -1 })
      .toArray();
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required.' });
    }

    const report = await analyzeIdea(title, description);
    const doc = { title, description, report, createdAt: new Date() };
    const result = await ideas.insertOne(doc);

    return res.status(201).json({ _id: result.insertedId, ...doc });
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}
