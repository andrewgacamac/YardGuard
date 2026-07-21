import { defineConfig } from 'vite';
import { resolve, basename, extname } from 'path';
import fs from 'fs';

// Build customer-facing pages only; keep local diagnostics and working files out
// of the production bundle.
const excludedPages = new Set([
    'debug_upload.html',
    'strategy_presentation.html',
]);
const files = fs.readdirSync(__dirname).filter(file =>
    file.endsWith('.html') &&
    !file.includes('_backup') &&
    !excludedPages.has(file)
);
const input = {};

files.forEach(file => {
    const name = basename(file, extname(file));
    input[name] = resolve(__dirname, file);
});

export default defineConfig({
    plugins: [{
        name: 'yardguard-sites-worker',
        closeBundle() {
            const serverDir = resolve(__dirname, 'dist/server');
            fs.mkdirSync(serverDir, { recursive: true });
            fs.writeFileSync(
                resolve(serverDir, 'index.js'),
                `export default {\n  async fetch(request, env) {\n    return env.ASSETS.fetch(request);\n  },\n};\n`
            );
        },
    }],
    build: {
        rollupOptions: {
            input,
        },
    },
    server: {
        // Dev only: proxy /api to the local function wrapper
        // (functions/dev-server.mjs). Production uses window.QUOTE_ENDPOINT
        // pointed at the deployed DigitalOcean Function URL instead.
        proxy: {
            '/api': 'http://localhost:3000',
        },
    },
});
