# WidgetMaker AI

Create and manage intelligent chat widgets for your website.

## Features

- **Dashboard**: Mange multiple chat bots.
- **Customizable**: Set branding colors, simple text, and system prompts.
- **AI Powered**: Uses OpenRouter (Liquid LFM-40B by default) for intelligent answers.
- **Knowledge Base**: Add FAQ pairs that are injected into the context.
- **Analytics**: basic conversation tracking.
- **Embeddable**: Simple JS snippet to put on any site.

## Setup

1. Copy `.env` and add your `OPENROUTER_API_KEY`.
2. Run database setup:
   ```bash
   npx prisma db push
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

## Installation

Go to the "Install" tab of your widget to get the code snippet.
