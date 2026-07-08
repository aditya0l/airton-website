const fs = require('fs');
let index = fs.readFileSync('airton.shop/index.html', 'utf8');

// Airstorm main link
index = index.replace(
  /<a href="products\/climatiseur-fixe-reversible\.html" aria-label="Climatiseur réversible AIRSTORM - Pompe à chaleur Air Air \(PAC\) - 3400W - Wifi Intégré" tabindex="-1">/g,
  '<a href="products/climatiseur-reversible-airstorm-pompe-a-chaleur-air-air-pac.html" aria-label="Climatiseur réversible AIRSTORM - Pompe à chaleur Air Air (PAC) - 3400W - Wifi Intégré" tabindex="-1">'
);

// Airstorm title link
index = index.replace(
  /<a class="reversed-link block " href="products\/climatiseur-fixe-reversible\.html">\s*<span class="reversed-link__text">Climatiseur réversible AIRSTORM - Pompe à chaleur Air Air \(PAC\) - 3400W - Wifi Intégré<\/span>/g,
  '<a class="reversed-link block " href="products/climatiseur-reversible-airstorm-pompe-a-chaleur-air-air-pac.html">\n          <span class="reversed-link__text">Climatiseur réversible AIRSTORM - Pompe à chaleur Air Air (PAC) - 3400W - Wifi Intégré</span>'
);

// Airstorm list-actions button
// The list actions for Airstorm is around line 4219.
// But we need to target it specifically. We know it's in the Airstorm product card.
// Let's just use string replacement on a larger block if needed, or we can use cheerio.
