import { createReadStream, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';

const root = join(fileURLToPath(new URL('.', import.meta.url)), 'dist');
const host = '127.0.0.1';
const startingPort = 4173;
const maxPort = 4180;

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

if (!existsSync(join(root, 'index.html'))) {
  console.error('The built portfolio is missing. Run "npm install" and "npm run build", then try again.');
  process.exitCode = 1;
} else {
  const server = createServer((request, response) => {
    const requestUrl = new URL(request.url ?? '/', `http://${host}`);
    const decodedPath = decodeURIComponent(requestUrl.pathname);
    const requestedFile = decodedPath === '/' ? 'index.html' : decodedPath.replace(/^\/+/, '');
    let filePath = normalize(join(root, requestedFile));

    if (relative(root, filePath).startsWith('..')) {
      response.writeHead(403).end('Forbidden');
      return;
    }

    if (!existsSync(filePath) || extname(filePath) === '') filePath = join(root, 'index.html');

    response.setHeader('Content-Type', contentTypes[extname(filePath)] ?? 'application/octet-stream');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Referrer-Policy', 'no-referrer');
    createReadStream(filePath)
      .on('error', () => response.writeHead(500).end('Unable to load the portfolio.'))
      .pipe(response);
  });

  const listen = (port) => {
    server.once('error', (error) => {
      if (error.code === 'EADDRINUSE' && port < maxPort) {
        listen(port + 1);
        return;
      }
      console.error(`Unable to start the portfolio: ${error.message}`);
      process.exitCode = 1;
    });

    server.listen(port, host, () => {
      const url = `http://${host}:${port}/`;
      console.log('');
      console.log('Akther V N portfolio is running.');
      console.log(url);
      console.log('Keep this window open. Press Ctrl+C to stop.');
      console.log('');
      execFile('cmd.exe', ['/c', 'start', '', url], { windowsHide: true });
    });
  };

  listen(startingPort);
}
