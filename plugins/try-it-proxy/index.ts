import type { Plugin } from '@docusaurus/types';
import type { IncomingMessage, ServerResponse } from 'http';

type ExpressLike = {
  post: (
    path: string,
    handler: (req: IncomingMessage & { body?: unknown }, res: ServerResponse) => void,
  ) => void;
};

function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function loadLocalEnv(): void {
  const fs = require('fs') as typeof import('fs');
  const path = require('path') as typeof import('path');
  for (const name of ['.env.local', '.env']) {
    const file = path.join(process.cwd(), name);
    if (!fs.existsSync(file)) {
      continue;
    }
    for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }
      const eq = trimmed.indexOf('=');
      if (eq < 1) {
        continue;
      }
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

function mountLocalApi(app: ExpressLike): void {
  loadLocalEnv();

  const proxyHandler = require('../../api/proxy.js') as (
    req: IncomingMessage & { body?: unknown; method?: string; query?: Record<string, string> },
    res: ServerResponse,
  ) => unknown;
  const chatHandler = require('../../api/chat.js') as (
    req: IncomingMessage & { body?: unknown; method?: string; query?: Record<string, string> },
    res: ServerResponse,
  ) => unknown;

  const post = (
    route: string,
    handler: (
      req: IncomingMessage & { body?: unknown; method?: string; query?: Record<string, string> },
      res: ServerResponse,
    ) => unknown,
  ) => {
    app.post(route, (req, res) => {
      void (async () => {
        try {
          req.body = await readJsonBody(req);
          await handler(req, res);
        } catch (err) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              error: err instanceof Error ? err.message : 'Invalid request body',
            }),
          );
        }
      })();
    });
  };

  post('/api/proxy', proxyHandler);
  post('/api/chat', chatHandler);
}

export default function tryItProxyPlugin(): Plugin<null> {
  return {
    name: 'try-it-proxy',
    configureWebpack(config, isServer) {
      if (isServer) {
        return {};
      }

      const previous = config.devServer?.setupMiddlewares;

      return {
        mergeStrategy: { 'devServer.setupMiddlewares': 'replace' },
        devServer: {
          setupMiddlewares(middlewares, devServer) {
            if (devServer?.app) {
              mountLocalApi(devServer.app as ExpressLike);
            }
            if (typeof previous === 'function') {
              return previous(middlewares, devServer);
            }
            return middlewares;
          },
        },
      };
    },
  };
}
