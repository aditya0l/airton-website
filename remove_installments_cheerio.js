const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function updateFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Load HTML into cheerio
    // Using xmlMode: false, decodeEntities: false to try to preserve the existing HTML format as much as possible
    const $ = cheerio.load(content, { decodeEntities: false, recognizeSelfClosing: true });

    // 1. Remove Paiement en plusieurs fois
    // We look for h3 tags that contain "Paiement en plusieurs fois"
    $('h3').each(function() {
        if ($(this).text().includes('Paiement en plusieurs fois')) {
            // Find the closest .f-column wrapper and remove it
            const col = $(this).closest('.f-column');
            if (col.length > 0) {
                col.remove();
                modified = true;
            }
        }
    });

    // 2. Replace payment icons in the cart drawer (or anywhere else that has .cart-drawer__payment-methods)
    $('.cart-drawer__payment-methods').each(function() {
        const paymentList = $(this).find('ul.list-payment');
        if (paymentList.length > 0) {
            paymentList.replaceWith(`<div style="display:flex; align-items:center; gap:8px;">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
    <span style="font-size: 14px; font-weight: 500;">Virement Bancaire</span>
</div>`);
            modified = true;
        }
    });

    if (modified) {
        // Cheerio might slightly reformat things, but it's okay for HTML
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
