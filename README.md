# WhatsApp Business Dashboard

A responsive React emulation of a WhatsApp Business home dashboard, featuring
daily insights and suggested agent actions.

## Run locally

```bash
npm install
npm run dev
```

Run `npm run build` to create a production bundle.

## API server

The Express server exposes a health check and an OpenAI Responses API proxy.

```bash
cp .env.example .env
# Add your OPENAI_API_KEY to .env
npm run server:dev
```

- `GET /health`
- `GET /api/ai/status`
- `POST /api/ai/respond` with `{ "message": "...", "businessContext": "..." }`

Set `OPENAI_BASE_URL` when connecting to a compatible hosted OpenAI instance.
