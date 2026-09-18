import type { LoadContext, Plugin } from '@docusaurus/types';
import type { LoadedContent } from '@docusaurus/plugin-content-docs';
import fs from 'fs/promises';
import path from 'path';

interface PluginOptions {
  docsDir?: string;
}

interface DocEntry {
  permalink: string;
  rawUrl: string;
  sourcePath: string;
  title: string;
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

function stripTrailingSlash(url: string): string {
  if (url.length > 1 && url.endsWith('/')) return url.slice(0, -1);
  return url;
}

export default function copyPageSourcePlugin(
  context: LoadContext,
  options: PluginOptions = {},
): Plugin<null> {
  const docsDir = path.resolve(context.siteDir, options.docsDir ?? 'docs');
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

    async allContentLoaded({ allContent, actions }) {
      const { setGlobalData } = actions;
      const docsByPlugin = allContent['docusaurus-plugin-content-docs'];
      if (!docsByPlugin) {
        setGlobalData({ sourceUrlByPermalink: {} });
        return;
      }

      const entries: DocEntry[] = [];
      for (const pluginContent of Object.values(docsByPlugin)) {
        const loaded = pluginContent as LoadedContent;
        for (const version of loaded.loadedVersions ?? []) {
          for (const doc of version.docs) {
            if (doc.draft) continue;
            const permalink = stripTrailingSlash(doc.permalink);
            const sourcePath = path.join(
              context.siteDir,
              doc.source.replace(/^@site\//, ''),
            );
            entries.push({
              permalink,
              rawUrl: `${permalink}.md`,
              sourcePath,
              title: doc.title,
            });
          }
        }
      }

      const sourceUrlByPermalink: Record<string, string> = {};
      for (const e of entries) {
        sourceUrlByPermalink[e.permalink] = e.rawUrl;
        sourceUrlByPermalink[`${e.permalink}/`] = e.rawUrl;
      }
      setGlobalData({ sourceUrlByPermalink });

      await Promise.all(
        entries.map(async (e) => {
          const source = await fs.readFile(e.sourcePath, 'utf8');
          const target = path.join(staticDir, e.rawUrl.replace(/^\/+/, ''));
          await writeIfChanged(target, source);
        }),
      );

      const siteUrl = context.siteConfig.url.replace(/\/+$/, '');
      const baseUrl = context.baseUrl === '/' ? '' : context.baseUrl.replace(/\/+$/, '');
      const header = [
        `# ${context.siteConfig.title}`,
        '',
        (context.siteConfig.tagline as string | undefined) ?? '',
        '',
        'Every documentation page is also available as raw markdown at the same URL with `.md` appended.',
        '',
      ].join('\n');
      const list = [...entries]
        .sort((a, b) => a.permalink.localeCompare(b.permalink))
        .map((e) => `- [${e.title}](${siteUrl}${baseUrl}${e.rawUrl})`)
        .join('\n');
      await writeIfChanged(llmsTxtPath, `${header}${list}\n`);
    },
  };
}
