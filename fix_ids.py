import os
import re

files_info = {
    'airton.shop/products/climatiseur-mobile-reversible-3500w-2500w-12000btu.html': {
        'old_var_id': '44127816646699',
        'new_var_id': '44127816646691',
        'old_prod_id': '7930081771563',
        'new_prod_id': '7930081771561',
        'handle': 'climatiseur-mobile-reversible-3500w-2500w-12000btu'
    },
    'airton.shop/products/climatiseur-mobile-reversible-2000w-1700w-7000btu.html': {
        'old_var_id': '44127816646699',
        'new_var_id': '44127816646692',
        'old_prod_id': '7930081771563',
        'new_prod_id': '7930081771562',
        'handle': 'climatiseur-mobile-reversible-2000w-1700w-7000btu'
    },
    'airton.shop/products/climatiseur-mobile-reversible-2600w-2000w-9000btu.html': {
        'old_var_id': '44127816646699',
        'new_var_id': '44127816646693',
        'old_prod_id': '7930081771563',
        'new_prod_id': '7930081771563',
        'handle': 'climatiseur-mobile-reversible-2600w-2000w-9000btu'
    }
}

base_dir = '/Users/nimeshranjan/Downloads/us.sitesucker.mac.sitesucker-pro'

for filepath, info in files_info.items():
    full_path = os.path.join(base_dir, filepath)
    if not os.path.exists(full_path):
        print(f"File not found: {full_path}")
        continue
        
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Replace the exact variant ID
    content = content.replace('44127816646699', info['new_var_id'])
    
    # Replace the exact product ID (except for the 9000btu which we can leave as is or update to 3, but the 9000btu has old_prod_id = new_prod_id)
    if info['old_prod_id'] != info['new_prod_id']:
        content = content.replace(info['old_prod_id'], info['new_prod_id'])
        
    # Also update the title in the big JSON blob so the cart finds it!
    # Let's use a regex to fix the "title" inside the __AW__itemVariant
    content = re.sub(
        r'(__AW__itemVariant\s*=\s*\{[^\}]*"title":")[^"]+(")',
        r'\1' + info['handle'].replace('-', ' ').title() + r'\2',
        content,
        count=1
    )

    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Updated IDs")
