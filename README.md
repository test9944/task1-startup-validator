# ValidateAI — AI-Powered Startup Idea Validator

A full-stack Next.js application that uses Claude AI to generate structured validation reports for startup ideas.

## Tech Stack

- **Frontend & Backend**: Next.js 14 (App Router + API Routes)
- **Database**: MongoDB Atlas
- **AI**: Anthropic Claude API (`claude-3-5-haiku-20241022`)
- **Deployment**: Vercel (frontend + backend), MongoDB Atlas (DB)

## Setup & Installation

### 1. Clone and install

```bash
git clone <your-repo-url>
cd startup-validator
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ideas` | List all ideas |
| POST | `/api/ideas` | Submit idea + trigger AI analysis |
| GET | `/api/ideas/:id` | Get full report for one idea |
| DELETE | `/api/ideas/:id` | Delete an idea |

## AI Prompt Used

```
You are an expert startup consultant. Analyze the given startup idea
and return a structured JSON object with the fields: problem, customer,
market, competitor, tech_stack, risk_level, profitability_score, justification.
Rules:
- Keep answers concise and realistic.
- 'competitor' should contain exactly 3 competitors with one-line differentiation each.
- 'tech_stack' should be 4–6 practical technologies for MVP.
- 'profitability_score' must be an integer between 0–100.
- 'risk_level' must be one of: Low, Medium, High.
Return ONLY JSON, no markdown, no backticks.
Input: { "title": "", "description": "" }
```

## Deployment (Vercel)

1. Push repository to GitHub
2. Go to [vercel.com](https://vercel.com) → Import repository
3. Add environment variables in Vercel project settings
4. Deploy — Vercel handles both frontend and API routes automatically

## Architecture Notes

This project uses Next.js as a unified full-stack framework, which serves both the React frontend and the REST API routes from a single codebase. This eliminates the need for a separate Express server and simplifies deployment to a single Vercel project. MongoDB Atlas is used for persistent storage with a connection-pooling pattern optimized for serverless environments. The AI analysis is triggered synchronously on idea submission and the structured JSON report is stored alongside the idea document in MongoDB.
