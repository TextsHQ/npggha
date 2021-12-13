#!/usr/bin/env node
'use strict';

const http = require('http')
const url = require('url')
const axios = require('axios').default;

const port = process.env.NPGGHA_PORT || 9191

function main() {
    const TOKEN = process.env.NPGGHA_TOKEN;

    if (!TOKEN)
        return;

    const server = http.createServer(async (req, res) => {
        const paths = url.parse(req.url, true).pathname.split('/');

        let [, org, repo,,, tag, asset ] = paths;

        const release = await axios(`https://api.github.com/repos/${org}/${repo}/releases/tags/${tag}`, {
            headers: {
                'Authorization': `token ${TOKEN}`,
            },
        });

        const assetUrl = release.data.assets.find(a => a.name === asset).url;

        const response = await axios(assetUrl, {
            headers: {
                'Accept': 'application/octet-stream',
                'Authorization': `token ${TOKEN}`,
            },
            responseType: 'stream',
        });

        res.writeHead(response.status, response.statusText);

        if (response.status === 200) {
            response.data.pipe(res);
            response.data.on('end', () => res.end());
        } else {
            res.end(response.data);
        }

        // Serves single request
        server.close();
    });

    server.listen(port, (err) => {
        if (err)
            return console.error(err);

        console.log(`Proxy listening on port ${port}`);
    });
}

main();
