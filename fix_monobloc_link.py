import os
import re

# Fix the monobloc link - it was incorrectly set to climatiseurs-mobiles.html
# by the previous script. The monobloc card (identified by monobloc_produit image)
# should point to the monobloc product page.
# The nav link labeled "Climatiseur monobloc - Sans unité extérieure" should also point there.

MONOBLOC_PRODUCT = "/products/monobloc-star-12hp-2-4-kw.html"
WRONG_TARGET = "/collections/climatiseurs-mobiles.html"

def fix_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content

    # 1. Fix collection card links - only those immediately followed by monobloc_produit image
    # Pattern: the href to wrong target AND the image contains monobloc_produit
    # We'll do it in two stages: find all collection-card blocks with monobloc_produit image
    # and fix only their href
    
    # Strategy: replace collection-card anchor that contains monobloc_produit
    def fix_monobloc_card(m):
        block = m.group(0)
        if 'monobloc_produit' in block:
            # Replace the href in this block only
            return block.replace(
                f'href="{WRONG_TARGET}" class="collection-card__wrapper',
                f'href="{MONOBLOC_PRODUCT}" class="collection-card__wrapper'
            )
        return block
    
    # Match each collection-card div
    new_content = re.sub(
        r'<div class="collection-card[^"]*"[^>]*>.*?</div>\s*\n</div>',
        fix_monobloc_card,
        new_content,
        flags=re.DOTALL
    )
    
    # 2. Fix nav menu text link "Climatiseur monobloc - Sans unité extérieure"
    # Match the <a> tag followed by reversed-link__text span containing monobloc text
    def fix_nav_link(m):
        block = m.group(0)
        if 'monobloc' in block.lower() and 'climatiseur mobile' not in block.lower():
            return block.replace(
                f'href="{WRONG_TARGET}"',
                f'href="{MONOBLOC_PRODUCT}"'
            )
        return block

    # Match li > a.text-subtext blocks  
    new_content = re.sub(
        r'<a href="[^"]*" class="text-subtext block">.*?</a>',
        fix_nav_link,
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
                print(f"Fixed {path}")
                fixed += 1

print(f"\nDone. Fixed {fixed} files.")
