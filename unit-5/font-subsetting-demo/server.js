/* Tiny local server for the font subsetting demo.
 *
 *   node server.js          serve everything at full speed
 *   node server.js 150      serve font files at 150 KB/s (slow on purpose)
 *
 * It serves the whole portfolio folder (two levels up) so the shared
 * css/main.css loads, and turns off caching so every reload re-downloads fonts.
 * Open http://localhost:8080/unit-5/font-subsetting-demo/
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const PORT = 8080;
const KBPS = Number(process.argv[2]) || 0;

const TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
};

http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    let file = path.join(ROOT, urlPath);
    if (!file.startsWith(ROOT)) {
        res.writeHead(403);
        return res.end('Forbidden');
    }
    if (file.endsWith(path.sep) || (fs.existsSync(file) && fs.statSync(file).isDirectory())) {
        file = path.join(file, 'index.html');
    }

    fs.readFile(file, (error, data) => {
        if (error) {
            res.writeHead(404);
            return res.end('Not found');
        }
        const ext = path.extname(file);
        res.writeHead(200, {
            'Content-Type': TYPES[ext] || 'application/octet-stream',
            'Content-Length': data.length,
            'Cache-Control': 'no-store'
        });

        if (!KBPS || ext !== '.woff2') {
            return res.end(data);
        }

        /* Throttle fonts: send a slice every 50 ms */
        const chunk = Math.max(1, Math.round((KBPS * 1024) / 20));
        let offset = 0;
        const timer = setInterval(() => {
            res.write(data.subarray(offset, offset + chunk));
            offset += chunk;
            if (offset >= data.length) {
                clearInterval(timer);
                res.end();
            }
        }, 50);
        res.on('close', () => clearInterval(timer));
    });
}).listen(PORT, () => {
    console.log(`Serving ${ROOT} at http://localhost:${PORT}/unit-5/font-subsetting-demo/`);
    console.log(KBPS ? `Font files throttled to ${KBPS} KB/s` : 'No throttling');
});
