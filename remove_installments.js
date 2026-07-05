const fs = require('fs');
const path = require('path');

function updateFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Remove "Paiement en plusieurs fois" feature block
    // It's a bit long, so I'll use a regex that captures from <div class="f-column relative multicolumn-card-wrapper color-scheme-inherit" to </div></div></div></div></div>
    // Actually, I'll match starting from `<div[^>]*class="f-column[^>]*>` up to `Paiement en plusieurs fois[\s\S]*?</div>\s*</div>\s*</div>\s*(?:<div[^>]*></div>\s*)?</div>`
    const pBlockRegex = /<div\s+class="f-column relative multicolumn-card-wrapper color-scheme-inherit"[\s\S]{1,1500}Paiement en plusieurs fois[\s\S]{1,200}<\/div>\s*<\/div>\s*<\/div>\s*(?:<div\s+class="multicolumn-card__divider[^>]*><\/div>\s*)?<\/div>/g;
    
    if (content.match(pBlockRegex)) {
        content = content.replace(pBlockRegex, '');
        modified = true;
    }

    // 2. Replace cart drawer payment icons (Visa, Mastercard, Alma, etc.) with Bank Transfer text
    const listPaymentRegex = /<ul class="list-payment list-unstyled flex flex-wrap gap-2" role="list">[\s\S]{1,5000}?<\/ul>/g;
    if (content.match(listPaymentRegex)) {
        content = content.replace(listPaymentRegex, `<div style="font-size: 14px; font-weight: 500; display:flex; align-items:center; gap:8px;">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
    Virement Bancaire
</div>`);
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
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
