#!/usr/bin/env node
'use strict';

const fs = require('fs');

// Simple script that replaces node-pre-gyp host and replace it with Github token counterpart.
function main() {
    const TOKEN = process.env.NPGGHA_TOKEN;

    if (!TOKEN)
        return;

    const packageFile = JSON.parse(fs.readFileSync('package.json', 'utf8'));
}

main();
