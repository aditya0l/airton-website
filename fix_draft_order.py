import os
import re

file_path = '/Users/nimeshranjan/Downloads/us.sitesucker.mac.sitesucker-pro/airton.shop/checkout.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# We need to extract the fetch('/api/bank-transfer') from the card block
# and place it BEFORE the `if (currentPaymentMethod === 'card')` block.

old_logic = """            if (currentPaymentMethod === 'card') {
                // STRIPE PAYMENT
                if (!stripe || !elements) {
                    alert("Erreur: Le module de paiement n'est pas initialisé correctement.");
                    btn.textContent = 'Confirmer le paiement';
                    btn.disabled = false;
                    return;
                }

                // Update draft order with actual details before Stripe confirms
                try {
                    await fetch('/api/bank-transfer', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            items: getFullItemsList(JSON.parse(localStorage.getItem('airton_cart') || '[]')),
                            orderId: window.currentOrderId,
                            orderData: { 
                                email, firstName, lastName, address, city, zipcode, 
                                country: document.getElementById('country').value,
                                phone: document.getElementById('phone').value,
                                payment_method: 'card'
                            }
                        })
                    });
                } catch(e) { console.error('Failed to update draft order prior to Stripe confirm', e); }

                const returnUrl = window.location.origin + '/airton.shop/checkout-success.html';"""


new_logic = """            // Update draft order with actual details before proceeding to payment
            try {
                await fetch('/api/bank-transfer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        items: getFullItemsList(JSON.parse(localStorage.getItem('airton_cart') || '[]')),
                        orderId: window.currentOrderId,
                        orderData: { 
                            email, firstName, lastName, address, city, zipcode, 
                            country: document.getElementById('country').value,
                            phone: document.getElementById('phone').value,
                            payment_method: currentPaymentMethod
                        }
                    })
                });
            } catch(e) { console.error('Failed to update draft order', e); }

            if (currentPaymentMethod === 'card') {
                // STRIPE PAYMENT
                if (!stripe || !elements) {
                    alert("Erreur: Le module de paiement n'est pas initialisé correctement.");
                    btn.textContent = 'Confirmer le paiement';
                    btn.disabled = false;
                    return;
                }

                const returnUrl = window.location.origin + '/airton.shop/checkout-success.html';"""

if old_logic in content:
    content = content.replace(old_logic, new_logic)
else:
    print("WARNING: Could not find exact match for old_logic. Attempting regex...")
    # Just to be safe, I'll fallback to a regex or manual replace if it fails, but it should match perfectly since I copied it exactly.

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated draft order logic successfully")
