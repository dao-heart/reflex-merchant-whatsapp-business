# WhatsApp Business Dashboard

A responsive React emulation of a WhatsApp Business home dashboard, featuring
daily insights and suggested agent actions.

## Run locally

```bash
cd client
npm install
npm run dev
```

Run `npm run build` from `client/` to create a production bundle.

## API server

The Express server exposes a health check and an OpenAI Responses API proxy.

```bash
cp .env.example .env
# Add your OPENAI_API_KEY to .env
npm install
npm run server:dev
```

- `GET /health`
- `GET /api/ai/status`
- `POST /api/ai/respond` with `{ "message": "...", "businessContext": "..." }`
- `POST /chat` with `{ "conversation": [{ "sender": "customer", "text": "..." }] }`
- `GET /api/mock-data/dashboard`
- `GET /api/mock-data/conversations`
- `GET /api/mock-data/artifacts`
- `GET /api/mock-data/artifacts/:name`

Set `OPENAI_BASE_URL` when connecting to a compatible hosted OpenAI instance.

The client fetches dashboard and conversation data from the Express API. During
local development, Vite proxies `/api` requests to `http://localhost:3001`.
