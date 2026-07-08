import os

file_path = '/Users/nimeshranjan/Downloads/us.sitesucker.mac.sitesucker-pro/airton.shop/checkout.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the SEPA Error UI header
old_sepa_header = """        <div class="m-title">Simon Profi-Technik GmbH</div>
        <div class="m-amount" id="sepaErrorAmount">124,37 €</div>"""
new_sepa_header = """        <div class="m-title" style="margin-bottom: 25px;">
            <img src="https://airton.shop/cdn/shop/files/Logo_Airton_2025_Noir_2.svg" alt="Airton" style="height: 35px; object-fit: contain;">
        </div>
        <div style="font-size: 0.95rem; color: #666; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px;">Montant Total</div>
        <div class="m-amount" id="sepaErrorAmount" style="color: #016FD0; font-size: 2.2rem; margin-bottom: 10px;">124,37 €</div>"""
content = content.replace(old_sepa_header, new_sepa_header)

# Replace the Bank Transfer UI header
old_mollie_header = """        <div class="m-title">Simon Profi-Technik GmbH</div>
        <div class="m-amount" id="mTransferAmount">124,37 €</div>"""
new_mollie_header = """        <div class="m-title" style="margin-bottom: 25px;">
            <img src="https://airton.shop/cdn/shop/files/Logo_Airton_2025_Noir_2.svg" alt="Airton" style="height: 35px; object-fit: contain;">
        </div>
        <div style="font-size: 0.95rem; color: #666; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px;">Montant Total à Régler</div>
        <div class="m-amount" id="mTransferAmount" style="color: #016FD0; font-size: 2.2rem; margin-bottom: 10px;">124,37 €</div>"""
content = content.replace(old_mollie_header, new_mollie_header)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated header and total amount display")
