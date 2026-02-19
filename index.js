const express = require('express');
const http = require('node:http');
const { Ultraviolet } = require('@titaniumnetwork-dev/ultraviolet');
const app = express();
const server = http.createServer(app);

// Ultravioletの設定
const uv = new Ultraviolet({
    prefix: '/service/', // 前回のHTMLコードで指定したパス
    bare: '/bare/',
    encodeUrl: Ultraviolet.codec.base64.encode,
    decodeUrl: Ultraviolet.codec.base64.decode,
    handler: '/uv/uv.handler.js',
    client: '/uv/uv.client.js',
    bundle: '/uv/uv.bundle.js',
    config: '/uv/uv.config.js',
    sw: '/uv/uv.sw.js'
});

// 静的ファイルの提供（UVのスクリプトなど）
app.use(express.static('public'));

// プロキシリクエストの処理
app.use((req, res) => {
    if (uv.requiresRoute(req)) {
        uv.handleRequest(req, res);
    } else {
        res.status(404).send('Not Found');
    }
});

// Koyebのポート設定に対応（デフォルト8080）
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});
