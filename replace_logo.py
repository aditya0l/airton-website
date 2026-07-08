import os

files = [
    '/Users/nimeshranjan/Downloads/us.sitesucker.mac.sitesucker-pro/api/confirm-order.js',
    '/Users/nimeshranjan/Downloads/us.sitesucker.mac.sitesucker-pro/api/webhook.js'
]

old_logo = '<h1 style="font-size: 24px; font-weight: 800; letter-spacing: 2px; margin-bottom: 20px;">AÏRTON</h1>'
new_logo = '<img src="https://airton.shop/cdn/shop/files/Logo_Airton_2025_Noir_2.svg" alt="Airton" style="height: 35px; margin-bottom: 20px;">'

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if old_logo in content:
        content = content.replace(old_logo, new_logo)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Replaced in {file_path}")
    else:
        print(f"Not found in {file_path}")
