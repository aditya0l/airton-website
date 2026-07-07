const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function injectCart(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            injectCart(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Check if already injected
            if (content.includes('/js/cart.js')) {
                continue;
            }

            const $ = cheerio.load(content, { decodeEntities: false, recognizeSelfClosing: true });
            
            // Append script to body
            $('body').append('\n<script src="/airton.shop/js/cart.js"></script>\n');
            
            fs.writeFileSync(fullPath, $.html(), 'utf8');
            console.log('Injected cart.js into:', fullPath);
        }
    }
}

injectCart('./airton.shop');
console.log('Done.');
