const http = require('http');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const root = __dirname;
const port = 8765;
const types = {
  '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.json':'application/json; charset=utf-8', '.css':'text/css; charset=utf-8',
  '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp',
  '.mp3':'audio/mpeg', '.wav':'audio/wav', '.woff2':'font/woff2'
};
function openGame(){ cp.exec('start "" "http://127.0.0.1:' + port + '/"'); }
const server = http.createServer((req,res) => {
  let urlPath;
  try { urlPath = decodeURIComponent(req.url.split('?')[0]); } catch(e) { res.writeHead(400); return res.end('Bad request'); }
  if (urlPath === '/') urlPath = '/index.html';
  const file = path.resolve(root, '.' + urlPath);
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(file, (err,data) => {
    if (err) { res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); return res.end('File not found'); }
    res.writeHead(200, {'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control':'no-cache'});
    res.end(data);
  });
});
server.on('error', err => {
  if (err.code === 'EADDRINUSE') { openGame(); process.exit(0); }
  console.error(err); process.exit(1);
});
server.listen(port, '127.0.0.1', () => {
  console.log('Game is running: http://127.0.0.1:' + port + '/');
  console.log('Keep this window open. Close it to stop the game server.');
  openGame();
});
