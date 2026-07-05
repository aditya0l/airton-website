const fs = require('fs');
const path = require('path');

function updateFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Remove Paiement en plusieurs fois block
    // We use a regex that looks for the multicolumn-card-wrapper containing "Paiement en plusieurs fois"
    const paiementBlock = /<div\s+class="f-column relative multicolumn-card-wrapper[^>]*>[\s\S]{1,500}?Paiement en plusieurs fois[\s\S]{1,500}?<div class="multicolumn-card__divider[^>]*><\/div>\s*<\/div>/g;
    if (content.match(paiementBlock)) {
        content = content.replace(paiementBlock, '');
        modified = true;
    }

    // Fallback if the divider is not there
    const paiementBlockFallback = /<div\s+class="f-column relative multicolumn-card-wrapper[^>]*>[\s\S]{1,500}?Paiement en plusieurs fois[\s\S]{1,500}?<\/div>\s*<\/div>/g;
    if (content.match(paiementBlockFallback)) {
        content = content.replace(paiementBlockFallback, '');
        modified = true;
    }

    // 2. Change SAV phone to Mail
    const savBlock = /(Service Après-Vente[\s\S]{1,300}?)<p><a href="tel:\+33745446306" title="tel:\+33745446306">\+33 7 45 44 63 06<\/a><\/p>/g;
    if (content.match(savBlock)) {
        content = content.replace(savBlock, '$1<p><a href="mailto:sav@airton.shop" title="sav@airton.shop">sav@airton.shop</a></p>');
        modified = true;
    }

    // 3. Remove Devis installation from menu
    // Regex to remove the <li> wrapper
    const devisLi = /<li[^>]*>[\s\S]{1,200}?[^>]*Devis installation[\s\S]{1,300}?<\/li>/gi;
    if (content.match(devisLi)) {
        content = content.replace(devisLi, '');
        modified = true;
    }
    
    // Regex to remove standalone links
    const devisLink = /<a[^>]*href="[^"]*devis-installation\.html"[^>]*>[\s\S]{1,300}Devis installation[\s\S]{1,100}<\/a>/gi;
    if (content.match(devisLink)) {
        content = content.replace(devisLink, '');
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
