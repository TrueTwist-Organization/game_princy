const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

http.createServer((req, res) => {
    // Decode URI to handle spaces/special characters
    let decodedUrl = decodeURIComponent(req.url);
    let filePath = path.join(__dirname, decodedUrl === '/' ? 'index.php' : decodedUrl);
    
    // Remove query strings or hashes
    filePath = filePath.split('?')[0].split('#')[0];

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath);
        let contentType = 'text/html';
        
        if (ext === '.css') contentType = 'text/css';
        else if (ext === '.js') contentType = 'text/javascript';
        else if (ext === '.png') contentType = 'image/png';
        else if (ext === '.svg') contentType = 'image/svg+xml';
        else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
        else if (ext === '.ico') contentType = 'image/x-icon';

        // Strip the PHP opening tag for local preview if needed, or just serve it directly
        // Browsers ignore <?php ?> tags in HTML anyway, but serving directly is cleanest.
        res.writeHead(200, { 
            'Content-Type': contentType,
            'Cache-Control': 'no-store, must-revalidate' // Disable caching completely
        });

        if (ext === '.php') {
            let content = fs.readFileSync(filePath, 'utf8');
            // Remove <?php ... ?> tags so browser doesn't get confused and render a stray <
            content = content.replace(/<\?php[\s\S]*?\?>/g, '');
            res.end(content);
        } else {
            fs.createReadStream(filePath).pipe(res);
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
}).listen(PORT, () => {
    console.log(`PHP-compatible server running at http://127.0.0.1:${PORT}`);
});
