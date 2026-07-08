const fs = require('fs');

let index = fs.readFileSync('airton.shop/index.html', 'utf8');

// Replace mega menu links pointing to the Airstorm product with the correct collection
// The mega menu has an aria-label="Climatiseur réversible - Pompe à chaleur Air Air (PAC)"
index = index.replace(
  /<a href="products\/climatiseur-fixe-reversible\.html" aria-label="Climatiseur réversible - Pompe à chaleur Air Air \(PAC\)"/g,
  '<a href="collections/climatiseur-reversible-pompe-chaleur-air-air.html" aria-label="Climatiseur réversible - Pompe à chaleur Air Air (PAC)"'
);

index = index.replace(
  /<a class="reversed-link block " href="products\/climatiseur-fixe-reversible\.html">\s*<span class="reversed-link__text">Climatiseur réversible - Pompe à chaleur Air Air \(PAC\)<\/span>/g,
  '<a class="reversed-link block " href="collections/climatiseur-reversible-pompe-chaleur-air-air.html">\n          <span class="reversed-link__text">Climatiseur réversible - Pompe à chaleur Air Air (PAC)</span>'
);

// We need to do the same across all HTML files for the "Épuisé" (Exhausted) tag just in case
// I'll run a sed command to remove "Épuisé" from all html files in airton.shop/
fs.writeFileSync('airton.shop/index.html', index, 'utf8');
