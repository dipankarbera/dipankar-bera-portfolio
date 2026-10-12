// Zero-dependency Node.js server: static files + small JSON API.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, 'public');
const DATA = path.join(__dirname, 'data');
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.pdf': 'application/pdf', '.webp': 'image/webp', '.woff2': 'font/woff2'
};
const SECURITY = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

const send = (res, status, body, headers = {}) => {
  res.writeHead(status, { ...SECURITY, ...headers });
  res.end(body);
};
const sendJSON = (res, status, obj) =>
  send(res, status, JSON.stringify(obj), { 'Content-Type': MIME['.json'] });

// very small in-memory rate limit: 5 messages / 10 min / IP
const hits = new Map();
function limited(ip) {
  const now = Date.now(), win = 10 * 60 * 1000;
  const list = (hits.get(ip) || []).filter(t => now - t < win);
  list.push(now); hits.set(ip, list);
  return list.length > 5;
}

function readBody(req, max = 10_000) {
  return new Promise((resolve, reject) => {
    let size = 0, chunks = [];
    req.on('data', c => { size += c.length; if (size > max) { reject(new Error('too large')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

async function api(req, res, pathname) {
  if (pathname === '/api/portfolio' && req.method === 'GET') {
    const file = path.join(DATA, 'portfolio.json');
    return send(res, 200, fs.readFileSync(file), { 'Content-Type': MIME['.json'], 'Cache-Control': 'no-cache' });
  }
  if (pathname === '/api/contact' && req.method === 'POST') {
    const ip = req.socket.remoteAddress || 'unknown';
    if (limited(ip)) return sendJSON(res, 429, { ok: false, error: 'Too many messages. Try again later.' });
    let data;
    try { data = JSON.parse(await readBody(req)); }
    catch { return sendJSON(res, 400, { ok: false, error: 'Invalid request.' }); }
    const name = String(data.name || '').trim().slice(0, 100);
    const email = String(data.email || '').trim().slice(0, 150);
    const subject = String(data.subject || '').trim().slice(0, 150);
    const message = String(data.message || '').trim().slice(0, 3000);
    if (data.website) return sendJSON(res, 200, { ok: true }); // honeypot: silently drop bots
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !subject || message.length < 10)
      return sendJSON(res, 400, { ok: false, error: 'Enter your name, a valid email, a subject, and a message of at least 10 characters.' });
    const file = path.join(DATA, 'messages.json');
    const all = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8') || '[]') : [];
    all.push({ name, email, subject, message, at: new Date().toISOString() });
    fs.writeFileSync(file, JSON.stringify(all, null, 2));
    return sendJSON(res, 201, { ok: true });
  }
  return sendJSON(res, 404, { ok: false, error: 'Not found' });
}

const server = http.createServer(async (req, res) => {
  try {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    if (pathname.startsWith('/api/')) return await api(req, res, pathname);
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed');

    let rel = decodeURIComponent(pathname);
    if (rel.endsWith('/')) rel += 'index.html';
    const file = path.normalize(path.join(PUBLIC, rel));
    if (!file.startsWith(PUBLIC)) return send(res, 403, 'Forbidden'); // block path traversal

    fs.stat(file, (err, st) => {
      if (err || !st.isFile()) return send(res, 404, 'Not found', { 'Content-Type': 'text/plain' });
      const ext = path.extname(file).toLowerCase();
      send(res, 200, req.method === 'HEAD' ? '' : fs.readFileSync(file), {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
      });
    });
  } catch (e) {
    console.error(e);
    sendJSON(res, 500, { ok: false, error: 'Server error' });
  }
});

server.listen(PORT, () => console.log(`Portfolio running → http://localhost:${PORT}`));
