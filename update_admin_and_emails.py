import os

# 1. Update admin/index.html
index_path = '/Users/nimeshranjan/Downloads/us.sitesucker.mac.sitesucker-pro/airton.shop/admin/index.html'
with open(index_path, 'r', encoding='utf-8') as f:
    index_content = f.read()

index_content = index_content.replace('<th>Montant</th>\n                            <th>Statut</th>', '<th>Montant</th>\n                            <th>Paiement</th>\n                            <th>Statut</th>')

with open(index_path, 'w', encoding='utf-8') as f:
    f.write(index_content)

# 2. Update admin/admin.js
admin_js_path = '/Users/nimeshranjan/Downloads/us.sitesucker.mac.sitesucker-pro/airton.shop/admin/admin.js'
with open(admin_js_path, 'r', encoding='utf-8') as f:
    admin_js_content = f.read()

admin_js_content = admin_js_content.replace('<td>${o.total_amount} €</td>\n                    <td>', '<td>${o.total_amount} €</td>\n                    <td>${o.order_data && o.order_data.payment_method === \'bank\' ? \'Virement\' : (o.order_data && o.order_data.payment_method === \'card\' ? \'Carte\' : \'-\')}</td>\n                    <td>')

with open(admin_js_path, 'w', encoding='utf-8') as f:
    f.write(admin_js_content)


# 3. Update emails
email_files = [
    '/Users/nimeshranjan/Downloads/us.sitesucker.mac.sitesucker-pro/api/confirm-order.js',
    '/Users/nimeshranjan/Downloads/us.sitesucker.mac.sitesucker-pro/api/webhook.js',
    '/Users/nimeshranjan/Downloads/us.sitesucker.mac.sitesucker-pro/api/test-order.js'
]

card_block = """
                                ${orderData.order_data?.payment_method === 'card' ? `
                                <!-- Card Payment Steps -->
                                <h3 style="font-size: 16px; color: #28a745; margin-bottom: 20px;">Paiement par carte bancaire validé.</h3>
                                <div style="background: #ffffff; border-radius: 8px; display: table; width: 100%; padding: 20px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
                                    <div style="display: table-cell; text-align: center; vertical-align: middle; padding: 0 10px;">
                                        <p style="margin: 0; font-size: 13px; font-weight: bold; color: #555;">Votre commande a été réglée avec succès par carte bancaire.</p>
                                    </div>
                                </div>
                                ` : ''}
"""

for file_path in email_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We will insert it right before: ${orderData.order_data?.payment_method === 'bank_transfer'
    search_str = "${(orderData.order_data?.payment_method === 'bank_transfer' || orderData.order_data?.payment_method === 'bank') ? `"
    
    # For test-order.js it might not have the bank transfer condition, so we check
    if search_str in content:
        content = content.replace(search_str, card_block + search_str)
    else:
        # In test-order.js, we can put it right before <!-- Action Button -->
        search_str2 = "<!-- Action Button -->"
        if search_str2 in content:
             content = content.replace(search_str2, card_block + search_str2)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done updating admin UI and email templates.")
