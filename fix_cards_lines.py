import os
import re

# Direct line-based fix using precise context strings
# Each replacement is a unique 2-line sequence: the <a href> line + the next div line

files_to_fix = [
    '/Users/nimeshranjan/Downloads/us.sitesucker.mac.sitesucker-pro/airton.shop/collections/catalogue-airton.html',
    '/Users/nimeshranjan/Downloads/us.sitesucker.mac.sitesucker-pro/airton.shop/collections/climatiseur-reversible-pompe-chaleur-air-air.html',
]

# Card 1: Wall-mounted mural (BundelAirtonmono image) → wall AC collection
# Card 2: Mobile reversible (kit-calfeutrage image) → mobile collection
# Card 3: Monobloc (monobloc_produit image) → monobloc product

def fix_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    changed = False
    i = 0
    while i < len(lines):
        line = lines[i]
        # Check if this is a collection-card wrapper anchor
        if 'class="collection-card__wrapper' in line:
            # Look ahead in the next 5 lines to find the image
            context = ''.join(lines[i:min(i+5, len(lines))])
            if 'monobloc_produit' in context:
                # Should link to monobloc product
                new_line = re.sub(r'href="[^"]*"', 'href="/products/monobloc-star-12hp-2-4-kw.html"', line)
                if new_line != line:
                    lines[i] = new_line
                    changed = True
            elif 'kit-calfeutrage-clim-mobile' in context:
                # Should link to mobile collection
                new_line = re.sub(r'href="[^"]*"', 'href="/collections/climatiseurs-mobiles.html"', line)
                if new_line != line:
                    lines[i] = new_line
                    changed = True
            elif 'BundelAirtonmono' in context:
                # Should link to wall-mounted AC collection
                new_line = re.sub(r'href="[^"]*"', 'href="/collections/climatiseur-reversible-pompe-chaleur-air-air.html"', line)
                if new_line != line:
                    lines[i] = new_line
                    changed = True
        i += 1

    if changed:
        with open(path, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        return True
    return False

for path in files_to_fix:
    if os.path.exists(path):
        if fix_file(path):
            print(f"Fixed: {path}")
        else:
            print(f"No changes needed: {path}")

print("\nDone!")
