import os

files = [
    '/Users/nimeshranjan/Downloads/us.sitesucker.mac.sitesucker-pro/api/confirm-order.js',
    '/Users/nimeshranjan/Downloads/us.sitesucker.mac.sitesucker-pro/api/webhook.js'
]

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update all mailto links and text to info@airton.shop
    content = content.replace('service-client@airton-shop.eu', 'info@airton.shop')
    
    # But revert the from: address back so Brevo doesn't fail
    content = content.replace('from: \'"Airton Shop" <info@airton.shop>\'', 'from: \'"Airton Shop" <service-client@airton-shop.eu>\'')

    # 2. Update the reference part
    old_ref_html = 'Faire le virement<br>avec la référence <span style="color: #016FD0;">#${orderData.id}</span>'
    new_ref_html = 'Faire le virement<br>avec la référence <span style="color: #016FD0;">${orderData.order_data?.bank_reference || \'#\' + orderData.id}</span>'
    content = content.replace(old_ref_html, new_ref_html)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Updated emails.")
