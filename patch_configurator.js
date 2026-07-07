const fs = require('fs');
const file = './airton.shop/cdn/shop/t/284/assets/configurator-core\uFE56v=153782232501578721231782916797.js';
let content = fs.readFileSync(file, 'utf8');

const regex = /_hasUnavailableItems\(\)\{.*return\{any:anyUnavailable,clim:climUnavailable\}\}/;
content = content.replace(regex, '_hasUnavailableItems(){return {any:!1,clim:!1}}');

fs.writeFileSync(file, content, 'utf8');
console.log('Patched successfully');
