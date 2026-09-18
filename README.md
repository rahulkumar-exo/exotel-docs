# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
yarn
```

## Local Development

```bash
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Ask AI (local)

Create `.env.local` in the repo root and set your key:

```bash
printf 'GEMINI_API_KEY=<your_key>\n' > .env.local
```

Then build the knowledge base and start the site:

```bash
node scripts/build-knowledge-base.js
yarn start
```

Do not commit `.env.local`. `GEMINI_MODEL` is optional and local-only. Do not set it in production.

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

A merge to `main` builds the site and deploys it to Vercel.

- Production: https://developer.exotel.com
- Origin: https://exotel-docs.vercel.app
