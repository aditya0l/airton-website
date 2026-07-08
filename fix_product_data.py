import os
import re

files_info = {
    'airton.shop/products/climatiseur-mobile-reversible-3500w-2500w-12000btu.html': {
        'id': 'climatiseur-mobile-reversible-3500w-2500w-12000btu',
        'title': 'Climatiseur mobile réversible 3500W/2500W 12000BTU',
        'price': '399.90'
    },
    'airton.shop/products/climatiseur-mobile-reversible-2000w-1700w-7000btu.html': {
        'id': 'climatiseur-mobile-reversible-2000w-1700w-7000btu',
        'title': 'Climatiseur mobile réversible 2000W/1700W 7000BTU',
        'price': '299.90'
    },
    'airton.shop/products/climatiseur-mobile-reversible-2600w-2000w-9000btu.html': {
        'id': 'climatiseur-mobile-reversible-2600w-2000w-9000btu',
        'title': 'Climatiseur mobile réversible 2600W/2000W 9000BTU',
        'price': '240.00'
    }
}

for file_path, info in files_info.items():
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        continue
        
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Replace the window.airtonCurrentProduct block
    pattern = r'(window\.airtonCurrentProduct\s*=\s*\{).*?(\};)'
    
    replacement = f"""\\1
                id: "{info['id']}",
                title: "{info['title']}",
                price: {info['price']},
                handle: "{info['id']}",
                image: "https://airton.shop/cdn/shop/products/409612_airton_120x@2x.avif"
            \\2"""
            
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {file_path}")
