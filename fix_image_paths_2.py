import os

base_dir = '/Users/nimeshranjan/Downloads/us.sitesucker.mac.sitesucker-pro'
product_files = [
    'airton.shop/products/climatiseur-mobile-reversible-3500w-2500w-12000btu.html',
    'airton.shop/products/climatiseur-mobile-reversible-2000w-1700w-7000btu.html',
    'airton.shop/products/climatiseur-mobile-reversible-2600w-2000w-9000btu.html'
]

for p in product_files:
    p_path = os.path.join(base_dir, p)
    if os.path.exists(p_path):
        with open(p_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace the relative URL with an absolute URL path from the root
        content = content.replace(
            '"../cdn/shop/products/clim-mobile-409612-mise-en-situation_120x@2x.avif"',
            '"/airton.shop/cdn/shop/products/clim-mobile-409612-mise-en-situation_120x@2x.avif"'
        )
        
        with open(p_path, 'w', encoding='utf-8') as f:
            f.write(content)

print("Updated image URLs to absolute path")
