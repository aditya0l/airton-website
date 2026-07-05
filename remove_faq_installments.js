const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function updateFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    const $ = cheerio.load(content, { decodeEntities: false, recognizeSelfClosing: true });

    // 1. Remove from FAQ accordion
    $('h2').each(function() {
        if ($(this).text().includes('Puis-je payer en plusieurs fois ?') || $(this).text().includes('Paiement en plusieurs fois')) {
            const accordionItem = $(this).closest('.accordion-item');
            if (accordionItem.length > 0) {
                accordionItem.remove();
                modified = true;
            }
        }
    });

    // 2. Remove any <li> that contains "Paiement en plusieurs fois" (found in monobloc page)
    $('li').each(function() {
        if ($(this).text().includes('Paiement en plusieurs fois')) {
            $(this).remove();
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(filePath, $.html(), 'utf8');
        console.log('Updated:', filePath);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            updateFile(fullPath);
        }
    }
}

walkDir('./airton.shop');
console.log('Done.');
