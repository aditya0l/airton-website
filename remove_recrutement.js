const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function removeRecrutementFromHtml(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(content, { decodeEntities: false, recognizeSelfClosing: true });
    
    let modified = false;

    // Find all 'li' elements
    $('li.reversed-link').each(function() {
        // If it contains an 'a' with href pointing to jobs or text "Recrutement"
        const htmlContent = $(this).html();
        if (htmlContent && (htmlContent.includes('Recrutement') || htmlContent.includes('pages/jobs'))) {
            $(this).remove();
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(filePath, $.html(), 'utf8');
        console.log('Removed Recrutement from:', filePath);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            removeRecrutementFromHtml(fullPath);
        }
    }
}

walkDir('./airton.shop');
console.log('Done.');
