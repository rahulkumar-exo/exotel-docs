---
id: contributing-to-docs
title: Contributing to Developer Documentation
description: Step-by-step guide for Exotel team members to add or update pages on the developer documentation portal.
sidebar_label: Contributing to Docs
---

# Contributing to Developer Documentation

This guide is for Exotel team members who need to add or update pages on the developer documentation portal (`developer.exotel.com`).

There are two ways to make changes — pick the one that suits you.

---

## Option A — Via CMS (No Git required)

Best for: small edits, updating copy, adding a new page.

1. Go to [developer.exotel.com/admin](https://developer.exotel.com/admin)
2. Log in with your Exotel email and password
   :::warning
   Use the **email/password form** — do not click the GitHub button
   :::
3. Browse the **Collections** list and find the page you want to edit
4. Make your changes in the editor
5. Click **Publish** — changes go live automatically within ~2 minutes

---

## Option B — Via GitHub (Recommended for larger changes)

Best for: new sections, restructuring, multiple pages at once.

### One-time setup

```bash
git clone https://github.com/rahulkumar-exo/exotel-docs.git
cd exotel-docs
npm install
npm start        # Preview runs at http://localhost:3335
```

### Making a change

1. Create a branch for your work:
   ```bash
   git checkout -b your-name/describe-change
   ```

2. Find the relevant doc under `/docs/` — organised by product:
   ```
   /docs/lead-assist/         ← Lead Assist (GreenPin)
   /docs/lead-assist-greenvn/ ← Lead Assist (GreenVN)
   /docs/voice-api/           ← Voice v2
   /docs/sms-api/             ← SMS
   /docs/whatsapp-api/        ← WhatsApp
   ... etc.
   ```

3. Edit the `.md` file — standard Markdown. Useful extras:
   ```md
   :::note
   A note box
   :::

   :::info
   An info box
   :::

   :::warning
   A warning box
   :::
   ```

4. **If adding a new page**, also add it to `sidebars.ts` in the relevant sidebar section.

5. Check your changes look right at `http://localhost:3335`

6. Commit and push your branch:
   ```bash
   git add <your-file>
   git commit -m "Brief description of change"
   git push origin your-name/describe-change
   ```

7. Open a Pull Request on GitHub and tag **Rahul Kumar** for review

8. Once merged to `main`, the site deploys automatically within ~2 minutes

---

## Important notes

- All doc content lives in the `/docs/` folder as `.md` files
- Sidebar navigation is controlled by `sidebars.ts` — only edit this if you're adding a brand new page
- If you ever see a merge conflict in `data/ai-search-logs.json`, always accept the remote version:
  ```bash
  git checkout --theirs data/ai-search-logs.json
  ```
- The live site is at `https://developer.exotel.com` — changes reflect after Vercel builds (~2 min after merge)

---

## Questions?

Reach out to the Foundations team or ping **Rahul Kumar**.
