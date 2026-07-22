import { defineConfig } from 'vite';
import { resolve, basename, extname } from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';

// Build only the reviewed customer-facing allowlist. New root HTML files never
// become public accidentally; add them to this file after review and testing.
const files = JSON.parse(fs.readFileSync(resolve(__dirname, 'config/public-pages.json'), 'utf8'));
const input = {};

function deploymentCommitSha() {
    const candidate = process.env.YARDGUARD_COMMIT_SHA || process.env.GITHUB_SHA;
    if (candidate && /^[0-9a-f]{40}$/i.test(candidate)) return candidate;
    return candidate === 'local' ? 'local' : 'unknown';
}

files.forEach(file => {
    if (!fs.existsSync(resolve(__dirname, file))) {
        throw new Error(`Public page does not exist: ${file}`);
    }
    const name = basename(file, extname(file));
    input[name] = resolve(__dirname, file);
});

export default defineConfig({
    plugins: [{
        name: 'yardguard-sites-worker',
        configureServer(server) {
            server.middlewares.use('/api/quote', (request, response, next) => {
                if (request.method !== 'POST') return next();

                let body = '';
                request.on('data', (chunk) => {
                    body += chunk;
                    if (body.length > 16 * 1024) request.destroy();
                });
                request.on('end', () => {
                    try {
                        const payload = JSON.parse(body || '{}');
                        const required = ['firstName', 'lastName', 'email', 'phone', 'package', 'city'];
                        const missing = required.filter((key) => !String(payload[key] || '').trim());
                        if (!Array.isArray(payload.project_type) || !payload.project_type.length) missing.push('project_type');

                        response.statusCode = missing.length ? 400 : 201;
                        response.setHeader('Content-Type', 'application/json');
                        response.setHeader('Cache-Control', 'no-store');
                        response.end(JSON.stringify(missing.length
                            ? { error: `Please fill in: ${missing.join(', ')}.` }
                            : { ok: true, leadId: `local-${randomUUID()}`, mocked: true }));
                    } catch {
                        response.statusCode = 400;
                        response.setHeader('Content-Type', 'application/json');
                        response.end(JSON.stringify({ error: 'Invalid JSON.' }));
                    }
                });
            });
        },
        closeBundle() {
            const serverDir = resolve(__dirname, 'dist/server');
            fs.mkdirSync(serverDir, { recursive: true });
            fs.writeFileSync(
                resolve(__dirname, 'dist/deployment.json'),
                `${JSON.stringify({
                    schemaVersion: 1,
                    commitSha: deploymentCommitSha(),
                    publicPageCount: files.length,
                    builtAt: new Date().toISOString(),
                }, null, 2)}\n`,
            );
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
});
