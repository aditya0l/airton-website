import os
import re

# Precise card link mapping based on unique image filenames:
# BundelAirtonmono image → wall-mounted AC collection (climatiseur-reversible)
# kit-calfeutrage image → mobile AC collection
# monobloc_produit image → monobloc product page

WALL_COLLECTION = "/collections/climatiseur-reversible-pompe-chaleur-air-air.html"
MOBILE_COLLECTION = "/collections/climatiseurs-mobiles.html"
MONOBLOC_PRODUCT = "/products/monobloc-star-12hp-2-4-kw.html"

def fix_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content

    def fix_card(m):
        block = m.group(0)
        # Monobloc card - identified by its unique image
        if 'monobloc_produit' in block:
            return re.sub(
                r'href="[^"]*" class="collection-card__wrapper',
                f'href="{MONOBLOC_PRODUCT}" class="collection-card__wrapper',
                block, count=1
            )
        # Mobile reversible card - identified by calfeutrage/mobile image
        elif 'kit-calfeutrage-clim-mobile' in block:
            return re.sub(
                r'href="[^"]*" class="collection-card__wrapper',
                f'href="{MOBILE_COLLECTION}" class="collection-card__wrapper',
                block, count=1
            )
        # Wall-mounted AC card - identified by BundelAirtonmono image
        elif 'BundelAirtonmono' in block:
            return re.sub(
                r'href="[^"]*" class="collection-card__wrapper',
                f'href="{WALL_COLLECTION}" class="collection-card__wrapper',
                block, count=1
            )
        return block

    new_content = re.sub(
        r'<div class="collection-card[^"]*"[^>]*>.*?</div>\s*\n</div>',
        fix_card,
        new_content,
        flags=re.DOTALL
    )

    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

fixed = 0
for root, dirs, files in os.walk('/Users/nimeshranjan/Downloads/us.sitesucker.mac.sitesucker-pro/airton.shop'):
    for file in files:
        if file.endswith('.html'):
            path = os.path.join(root, file)
            if fix_file(path):
                print(f"Fixed: {path}")
                fixed += 1

print(f"\nDone. Fixed {fixed} files.")
