import type { LoadContext, Plugin } from '@docusaurus/types';
import fs from 'fs/promises';
import path from 'path';

interface PluginOptions {
  docsDir?: string;
  routeBasePath?: string;
}

interface Entry {
  relPath: string;
  permalinks: string[];
  rawUrl: string;
  source: string;
  title: string;
}

interface Content {
  entries: Entry[];
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function parseFrontmatter(src: string): { title: string; slug: string; body: string } {
  const m = src.match(FRONTMATTER);
  let title = '';
  let slug = '';
  const body = m ? m[2] : src;
  if (m) {
    for (const line of m[1].split(/\r?\n/)) {
      const kv = line.match(/^(title|slug):\s*(.*)$/);
      if (!kv) continue;
      const value = kv[2].trim().replace(/^["']|["']$/g, '');
      if (kv[1] === 'title' && !title) title = value;
      if (kv[1] === 'slug' && !slug) slug = value;
    }
  }
  if (!title) {
    const h = body.match(/^\s*#\s+(.+)$/m);
    if (h) title = h[1].trim();
  }
  return { title, slug, body };
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (e.isFile() && /\.(md|mdx)$/.test(e.name)) {
      out.push(full);
    }
  }
  return out;
}

async function writeIfChanged(target: string, content: string): Promise<void> {
  try {
    const existing = await fs.readFile(target, 'utf8');
    if (existing === content) return;
  } catch {
    // file doesn't exist yet
  }
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, content, 'utf8');
}

export default function copyPageSourcePlugin(
  context: LoadContext,
  options: PluginOptions = {},
): Plugin<Content> {
  const docsDir = path.resolve(context.siteDir, options.docsDir ?? 'docs');
  const routeBasePath = (options.routeBasePath ?? 'docs').replace(/^\/+|\/+$/g, '');
  const staticDir = path.resolve(context.siteDir, 'static');
  const llmsTxtPath = path.resolve(staticDir, 'llms.txt');

  return {
    name: 'docusaurus-plugin-copy-page-source',

    getPathsToWatch() {
      return [
        path.join(docsDir, '**/*.md'),
        path.join(docsDir, '**/*.mdx'),
      ];
    },

    async loadContent(): Promise<Content> {
      const files = await walk(docsDir);
      const entries: Entry[] = await Promise.all(
        files.map(async (abs) => {
          const rel = path.relative(docsDir, abs).replace(/\\/g, '/');
          const relNoExt = rel.replace(/\.(md|mdx)$/, '');
          const source = await fs.readFile(abs, 'utf8');
          const { title, slug } = parseFrontmatter(source);
          const filePermalink = `/${routeBasePath}/${relNoExt}`;
          let canonical = filePermalink;
          const permalinks = [filePermalink];
          if (slug) {
            const normalized = slug.startsWith('/') ? slug : `/${slug}`;
            const slugPermalink = `/${routeBasePath}${normalized}`;
            if (slugPermalink !== filePermalink) {
              canonical = slugPermalink;
              permalinks.push(slugPermalink);
            }
          }
          return {
            relPath: rel,
            permalinks,
            rawUrl: `${canonical}.md`,
            source,
            title: title || relNoExt,
          };
        }),
      );
      return { entries };
    },

    async contentLoaded({ content, actions }) {
      const { setGlobalData } = actions;

      const sourceUrlByPermalink: Record<string, string> = {};
      for (const e of content.entries) {
        for (const p of e.permalinks) sourceUrlByPermalink[p] = e.rawUrl;
      }
      setGlobalData({ sourceUrlByPermalink });

      await Promise.all(
        content.entries.map(async (e) => {
          const target = path.join(staticDir, e.rawUrl.replace(/^\/+/, ''));
          await writeIfChanged(target, e.source);
        }),
      );

      const siteUrl = context.siteConfig.url.replace(/\/+$/, '');
      const baseUrl = context.baseUrl.replace(/\/+$/, '');
      const header = [
        `# ${context.siteConfig.title}`,
        '',
        (context.siteConfig.tagline as string | undefined) ?? '',
        '',
        'Every documentation page is also available as raw markdown at the same URL with `.md` appended.',
        '',
      ].join('\n');
      const list = [...content.entries]
        .sort((a, b) => a.permalinks[0].localeCompare(b.permalinks[0]))
        .map((e) => `- [${e.title}](${siteUrl}${baseUrl}${e.rawUrl})`)
        .join('\n');
      await writeIfChanged(llmsTxtPath, `${header}${list}\n`);
    },
  };
}
