# Engineering rules for coding agents

This file is read by coding agents such as Claude Code and Cursor. It tells them how to work in this repo under Exotel's engineering rules.

## Where the rules live

Exotel's engineering rules are indexed on one Confluence page, [Engineering Rules](https://exotel.atlassian.net/wiki/pages/viewpage.action?pageId=99462198). Each topic there names the one page that governs it. A page that is not in the index is not policy.

If you are connected to the Production Engineering MCP server (`prodengg`), call `engineering_rules` with no topic to list the topics, then with a topic such as `logging` to read the governing page. Otherwise open the index through the Atlassian connector.

Before you change how this repo builds, tests, logs, deploys, stores data or grants access, read the governing page for that topic.

## Rules for every change

1. Ship every change through a pull request. Put a Jira key in the branch name, the commit message and the PR title, as `EN-1234: short description`.
2. Never put a password, API key or token in the repo, on any branch, including tests and examples. Secrets live in AWS Secrets Manager.
3. Take base images, libraries and install packages from Nexus (`nexus.corp.exotel.in`). Never download them straight from the internet in a build, and never copy third-party source into the repo.
4. Never add a dependency version that is end-of-life, or one with a known critical or high vulnerability.
5. Never log passwords, API keys, tokens, full card numbers or the content of a customer's conversation. In logs, mask end-customer phone numbers to the last four digits.
6. Tag every cloud resource you create with `meta_service`, `meta_team` and `owner_email`. A customer-specific resource also carries `customer_name` and `expiry`.
7. Keep `README.md` at the root current: what this repo does, how to build and test it, what it depends on, and what depends on it.
