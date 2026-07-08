import os
import re

# Fix: the "Climatiseur mobile réversible silencieux" collection card was wrongly changed to
# monobloc link. Fix it back to the climatiseurs-mobiles collection.
# Identify by the image: kit-calfeutrage-clim-mobile-fenetre.jpg

MOBILE_COLLECTION = "/collections/climatiseurs-mobiles.html"
MONOBLOC_PRODUCT = "/products/monobloc-star-12hp-2-4-kw.html"

def fix_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content

    # Fix collection card - identified by mobile image but has monobloc link
    def fix_mobile_card(m):
        block = m.group(0)
        if 'kit-calfeutrage-clim-mobile' in block or 'climatiseur-mobile-reversible' in block.lower() or 'Climatiseur mobile réversible' in block:
            return block.replace(
                f'href="{MONOBLOC_PRODUCT}" class="collection-card__wrapper',
                f'href="{MOBILE_COLLECTION}" class="collection-card__wrapper'
            )
        return block

    # Match each collection-card div block
    new_content = re.sub(
        r'<div class="collection-card[^"]*"[^>]*>.*?</div>\s*\n</div>',
        fix_mobile_card,
        new_content,
        flags=re.DOTALL
    )

    # Also fix the nav menu link "Climatiseur mobile" that may have been incorrectly changed
    def fix_mobile_nav(m):
        block = m.group(0)
        if ('climatiseur mobile' in block.lower() or 'mobile réversible' in block.lower()) and MONOBLOC_PRODUCT in block:
            return block.replace(
                f'href="{MONOBLOC_PRODUCT}"',
                f'href="{MOBILE_COLLECTION}"'
            )
        return block

    new_content = re.sub(
        r'<a href="[^"]*" class="text-subtext block">.*?</a>',
        fix_mobile_nav,
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
