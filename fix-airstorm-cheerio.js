const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('airton.shop/index.html', 'utf8');
const $ = cheerio.load(html, { decodeEntities: false });

// Find all product cards
$('.product-card').each((i, el) => {
    const titleText = $(el).find('.reversed-link__text').text().trim();
    
    let correctUrl = null;
    if (titleText.includes('AIRSTORM')) {
        correctUrl = 'products/climatiseur-reversible-airstorm-pompe-a-chaleur-air-air-pac.html';
    } else if (titleText.includes('monobloc 2,4 kW')) {
        correctUrl = 'products/monobloc-star-12hp-2-4-kw.html';
    }
    
    if (correctUrl) {
        // Fix all links in this card
        $(el).find('a').each((j, aEl) => {
            const href = $(aEl).attr('href');
            if (href === 'products/climatiseur-fixe-reversible.html') {
                $(aEl).attr('href', correctUrl);
            }
        });
    }
});

fs.writeFileSync('airton.shop/index.html', $.html(), 'utf8');
console.log('Fixed Airstorm and Monobloc links.');
