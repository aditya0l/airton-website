const fs = require('fs');
const path = require('path');

function updateFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Remove the <li> containing the jobs link
    const jobsLiRegex = /<li[^>]*>[\s\S]{1,100}?<a\s+href="https:\/\/airton\.shop\/pages\/jobs"[^>]*>[\s\S]{1,100}?<\/a>[\s\S]{1,50}?<\/li>/g;
    if (content.match(jobsLiRegex)) {
        content = content.replace(jobsLiRegex, '');
        modified = true;
    }

    // 2. Remove the <a> standalone if there's no <li>
    const jobsARegex = /<a\s+href="https:\/\/airton\.shop\/pages\/jobs"[^>]*>[\s\S]{1,100}?<\/a>/g;
    if (content.match(jobsARegex)) {
        content = content.replace(jobsARegex, '');
        modified = true;
    }

    // 3. Change domain in footer to airton.eu
    const footerDomainRegex = />Airton\.fr<\/a>/g;
    if (content.match(footerDomainRegex)) {
        content = content.replace(footerDomainRegex, '>Airton.eu</a>');
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
