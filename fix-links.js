const fs = require('fs');

let index = fs.readFileSync('airton.shop/index.html', 'utf8');

// 1. Remove the "Épuisé" tags from index.html
index = index.replace(/<span class="f-badge f-badge--soldout" aria-hidden="true">Épuisé<\/span>/g, '');

// 2. Fix the Monobloc link
// We need to find the specific block for Monobloc and replace its link
// Monobloc has aria-label="Climatiseur réversible monobloc 2,4 kW"
index = index.replace(
  /<a href="products\/climatiseur-fixe-reversible\.html" aria-label="Climatiseur réversible monobloc 2,4 kW"/g,
  '<a href="products/monobloc-star-12hp-2-4-kw.html" aria-label="Climatiseur réversible monobloc 2,4 kW"'
);

// There are a few other places in the Monobloc card that might link to climatiseur-fixe-reversible.html.
// Let's replace the link right after the monobloc image:
// We know it's around line 4077 and 4109.
// But we need to be careful not to replace the actual Airstorm links.
// So let's use a regex to replace hrefs within the Monobloc product card.
// A product card starts with <div class="f-column swiper-slide">...
// Let's do a simple regex: find the Monobloc card and replace the links inside it.

const monoblocRegex = /(<h3 class="product-card__title text-pcard-title">\s*<a class="reversed-link block " href=")products\/climatiseur-fixe-reversible\.html(">\s*<span class="reversed-link__text">2.4 kW Monobloc Reversible Air Conditioner<\/span>)/i;
// Actually, in the HTML, the text is "Climatiseur réversible monobloc 2,4 kW"
// Let's just do a specific string replace:
index = index.replace(
  /<a class="reversed-link block " href="products\/climatiseur-fixe-reversible\.html">\s*<span class="reversed-link__text">Climatiseur réversible monobloc 2,4 kW<\/span>/g,
  '<a class="reversed-link block " href="products/monobloc-star-12hp-2-4-kw.html">\n          <span class="reversed-link__text">Climatiseur réversible monobloc 2,4 kW</span>'
);

// Also the Quick View button for Monobloc:
// It might be <a href="products/climatiseur-fixe-reversible.html" class="btn btn--secondary">
// But it's hard to target. Let's just use string replacement on a larger block.

fs.writeFileSync('airton.shop/index.html', index, 'utf8');
console.log("Updated index.html");
