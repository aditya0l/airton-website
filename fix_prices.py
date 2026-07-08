import os
import re

files_prices = {
    'airton.shop/products/climatiseur-mobile-reversible-3500w-2500w-12000btu.html': '399.90',
    'airton.shop/products/climatiseur-mobile-reversible-2000w-1700w-7000btu.html': '299.90',
    'airton.shop/products/climatiseur-mobile-reversible-2600w-2000w-9000btu.html': '240.00'
}

for file_path, new_price in files_prices.items():
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        continue
        
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Replace all instances of 19.99 and 19990
    content = content.replace('19.99', new_price)
    
    new_price_cents = str(int(float(new_price) * 100))
    content = content.replace('19990', new_price_cents)
    
    # Hide variant selects by injecting display: none;
    content = re.sub(r'(<variant-selects[^>]*)>', r'\1 style="display: none;">', content)
    
    # Hide any div containing "Modèles:" or "Couleur:" if needed, but hiding variant-selects is enough
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {file_path}")

