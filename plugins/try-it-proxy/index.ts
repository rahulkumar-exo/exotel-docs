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

function mountTryItProxy(app: ExpressLike): void {
  const proxyHandler = require('../../api/proxy.js') as (
    req: IncomingMessage & { body?: unknown; method?: string },
    res: ServerResponse,
  ) => unknown;

  app.post('/api/proxy', (req, res) => {
    void (async () => {
      try {
        req.body = await readJsonBody(req);
        await proxyHandler(req, res);
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
              mountTryItProxy(devServer.app as ExpressLike);
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
