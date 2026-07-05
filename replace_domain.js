const fs = require('fs');
const path = require('path');

function updateFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Replace all emails matching *@airton.shop with service-client@airton-shop.eu
    const emailRegex = /[a-zA-Z0-9._%+-]+@airton\.shop/g;
    if (content.match(emailRegex)) {
        content = content.replace(emailRegex, 'service-client@airton-shop.eu');
        modified = true;
    }

    // 2. Replace Airton.eu with airton-shop.eu
    const domainRegex = /Airton\.eu/g;
    if (content.match(domainRegex)) {
        content = content.replace(domainRegex, 'airton-shop.eu');
        modified = true;
    }

    // 3. Replace >www.airton.shop< with >www.airton-shop.eu< (e.g. in Trustpilot widget)
    const tpRegex = />www\.airton\.shop</g;
    if (content.match(tpRegex)) {
        content = content.replace(tpRegex, '>www.airton-shop.eu<');
        modified = true;
    }

    // 4. Also replace the domain in the under-construction page text just in case
    const ucRegex = />airton\.shop</g;
    if (content.match(ucRegex)) {
        content = content.replace(ucRegex, '>airton-shop.eu<');
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
        } else if (fullPath.endsWith('.html') || fullPath.endsWith('.js')) {
            updateFile(fullPath);
        }
    }
}

walkDir('./airton.shop');
console.log('Done.');
