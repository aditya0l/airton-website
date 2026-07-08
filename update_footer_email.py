import glob

files = glob.glob('/Users/nimeshranjan/Downloads/us.sitesucker.mac.sitesucker-pro/api/*.js')

for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to replace it in the HTML, so we just replace all occurrences of service-client except for the "from:" field.
    # Actually, replacing all is fine, but to be safe let's replace "service-client@airton-shop.eu" with "info@airton.shop" everywhere,
    # then revert the "from:" field just in case SMTP depends on it.
    
    content = content.replace('service-client@airton-shop.eu', 'info@airton.shop')
    # Revert the FROM address to avoid SMTP errors just in case
    content = content.replace("from: '\"Airton Shop\" <info@airton.shop>'", "from: '\"Airton Shop\" <service-client@airton-shop.eu>'")
    content = content.replace('from: \'"Airton Shop" <info@airton.shop>\'', 'from: \'"Airton Shop" <service-client@airton-shop.eu>\'')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updated footer emails to info@airton.shop in all API files.")
