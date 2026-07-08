const fs = require('fs');
const cheerio = require('cheerio');

let html = fs.readFileSync('airton.shop/checkout.html', 'utf8');
const $ = cheerio.load(html, { decodeEntities: false });

// 1. Add Billing Address UI after Delivery Address block
const billingHtml = `
<h2 style="margin-top: 40px;">Adresse de facturation</h2>
<div class="form-group" style="border: 1px solid #ddd; border-radius: 4px; padding: 15px;">
    <div style="margin-bottom: 10px;">
        <input type="radio" name="billing" id="billing_same" value="same" checked style="width: auto;">
        <label for="billing_same" style="display: inline; margin-left: 5px;">Identique à l'adresse de livraison</label>
    </div>
    <div>
        <input type="radio" name="billing" id="billing_diff" value="diff" style="width: auto;">
        <label for="billing_diff" style="display: inline; margin-left: 5px;">Utiliser une adresse de facturation différente</label>
    </div>
</div>
<div id="billingFields" style="display: none;">
    <div class="form-row">
        <div class="form-group"><input type="text" id="b_firstName" placeholder="Prénom"></div>
        <div class="form-group"><input type="text" id="b_lastName" placeholder="Nom"></div>
    </div>
    <div class="form-group"><input type="text" id="b_address" placeholder="Adresse (ex: 12 rue de la Paix)"></div>
    <div class="form-row">
        <div class="form-group"><input type="text" id="b_zipcode" placeholder="Code postal"></div>
        <div class="form-group"><input type="text" id="b_city" placeholder="Ville"></div>
    </div>
</div>
`;

// Insert after the country select group
if ($('#billingFields').length === 0) {
    $('#country').parent().after(billingHtml);
}

// 2. Add Upsell UI above CGV
const upsellHtml = `
<div id="dynamicUpsells" style="margin-top: 40px; margin-bottom: 20px;">
    <!-- Rendered via JS -->
</div>
`;
if ($('#dynamicUpsells').length === 0) {
    $('#cgv').parent().before(upsellHtml);
}

// 3. Add Cross-sell UI below Total in right column
const crosssellHtml = `
<div style="margin-top: 40px;">
    <h3 style="font-size: 1.1rem; margin-bottom: 15px;">Complétez votre installation en 1 clic</h3>
    <div style="display: flex; gap: 15px;">
        <div style="flex: 1; border: 1px solid #ddd; padding: 15px; border-radius: 8px; background: white; display: flex; flex-direction: column;">
            <img src="https://airton.shop/cdn/shop/files/AIRSTORM-WIFI.png?v=1719299498" style="width: 100%; height: 100px; object-fit: contain; margin-bottom: 10px;">
            <p style="font-weight: bold; font-size: 0.9rem; margin: 0 0 5px 0;">Clé Wifi Airton</p>
            <p style="color: #555; margin: 0 0 10px 0;">99,90 €</p>
            <select id="cs1_model" style="margin-bottom: 10px; padding: 5px;"><option value="Monosplit">Modèle Monosplit</option></select>
            <div style="display: flex; gap: 10px; margin-top: auto;">
                <input type="number" id="cs1_qty" value="1" min="1" style="width: 60px; padding: 5px;">
                <button type="button" onclick="addCrossSell('Clé Wifi Airton', 99.90, 'https://airton.shop/cdn/shop/files/AIRSTORM-WIFI.png?v=1719299498', 'cs1_qty')" class="btn-submit" style="margin-top: 0; padding: 5px 10px; font-size: 0.9rem;">Ajouter</button>
            </div>
        </div>
        <div style="flex: 1; border: 1px solid #ddd; padding: 15px; border-radius: 8px; background: white; display: flex; flex-direction: column;">
            <img src="https://airton.shop/cdn/shop/products/0e5b721e-d456-42b7-bdc6-7de85e499d3e.jpg?v=1667926839" style="width: 100%; height: 100px; object-fit: contain; margin-bottom: 10px;">
            <p style="font-weight: bold; font-size: 0.9rem; margin: 0 0 5px 0;">Bande isolante blanche</p>
            <p style="color: #555; margin: 0 0 10px 0;">9,90 €</p>
            <select id="cs2_model" style="margin-bottom: 10px; padding: 5px;"><option value="10m">10m</option></select>
            <div style="display: flex; gap: 10px; margin-top: auto;">
                <input type="number" id="cs2_qty" value="1" min="1" style="width: 60px; padding: 5px;">
                <button type="button" onclick="addCrossSell('Bande isolante', 9.90, 'https://airton.shop/cdn/shop/products/0e5b721e-d456-42b7-bdc6-7de85e499d3e.jpg?v=1667926839', 'cs2_qty')" class="btn-submit" style="margin-top: 0; padding: 5px 10px; font-size: 0.9rem;">Ajouter</button>
            </div>
        </div>
    </div>
</div>
`;
if ($('h3:contains("Complétez")').length === 0) {
    $('.checkout-right').append(crosssellHtml);
}

// 4. Update the script block with the massive new logic
const newScript = `
        const upsellPricing = {
            'Monosplit': { maint: 199.00, warranty: 59.90, serenity: 249.00 },
            'Bisplit': { maint: 349.00, warranty: 89.90, serenity: 429.00 },
            'Trisplit': { maint: 449.00, warranty: 109.90, serenity: 549.00 },
            'Quadrisplit': { maint: 549.00, warranty: 129.90, serenity: 654.00 }
        };

        let activeUpsells = {
            maint: false,
            warranty: false,
            serenity: false
        };

        let currentSystemType = 'Monosplit';

        function getSystemType(cart) {
            for (const item of cart) {
                const name = (item.name || '').toLowerCase();
                if (name.includes('quadri')) return 'Quadrisplit';
                if (name.includes('tri')) return 'Trisplit';
                if (name.includes('bi')) return 'Bisplit';
                if (name.includes('mono')) return 'Monosplit';
            }
            return 'Monosplit';
        }

        function toggleUpsell(type) {
            activeUpsells[type] = !activeUpsells[type];
            // If serenity is checked, uncheck others. If others checked, uncheck serenity.
            if (type === 'serenity' && activeUpsells.serenity) {
                activeUpsells.maint = false;
                activeUpsells.warranty = false;
            } else if ((type === 'maint' || type === 'warranty') && activeUpsells[type]) {
                activeUpsells.serenity = false;
            }
            renderUpsellUI();
            loadCheckoutCart();
        }

        function renderUpsellUI() {
            const prices = upsellPricing[currentSystemType];
            const html = \`
                <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; margin-bottom: 10px; background: white; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <p style="margin:0; font-weight: bold; font-size:0.95rem;">Évitez les pannes</p>
                        <p style="margin:5px 0 0 0; color:#555; font-size:0.85rem;">Contrat d'entretien annuel pour \${currentSystemType}</p>
                        <p style="margin:5px 0 0 0; font-weight: bold;">\${prices.maint.toFixed(2).replace('.',',')} €</p>
                    </div>
                    <div>
                        <input type="checkbox" onchange="toggleUpsell('maint')" \${activeUpsells.maint ? 'checked' : ''} style="width: 20px; height: 20px;">
                    </div>
                </div>
                <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; margin-bottom: 10px; background: white; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <p style="margin:0; font-weight: bold; font-size:0.95rem;">Couvrez l'imprévu</p>
                        <p style="margin:5px 0 0 0; color:#555; font-size:0.85rem;">Garantie Premium Annuelle pour \${currentSystemType}</p>
                        <p style="margin:5px 0 0 0; font-weight: bold;">\${prices.warranty.toFixed(2).replace('.',',')} €</p>
                    </div>
                    <div>
                        <input type="checkbox" onchange="toggleUpsell('warranty')" \${activeUpsells.warranty ? 'checked' : ''} style="width: 20px; height: 20px;">
                    </div>
                </div>
                <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; margin-bottom: 10px; background: white; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <p style="margin:0; font-weight: bold; font-size:0.95rem;">L'option tout-en-un</p>
                        <p style="margin:5px 0 0 0; color:#555; font-size:0.85rem;">Pack Sérénité pour \${currentSystemType}</p>
                        <p style="margin:5px 0 0 0; font-weight: bold;">\${prices.serenity.toFixed(2).replace('.',',')} €</p>
                    </div>
                    <div>
                        <input type="checkbox" onchange="toggleUpsell('serenity')" \${activeUpsells.serenity ? 'checked' : ''} style="width: 20px; height: 20px;">
                    </div>
                </div>
            \`;
            document.getElementById('dynamicUpsells').innerHTML = html;
        }

        function addCrossSell(name, price, img, qtyId) {
            let cart = [];
            try {
                cart = JSON.parse(localStorage.getItem('airton_cart') || '[]');
            } catch(e) {}
            
            const qty = parseInt(document.getElementById(qtyId).value) || 1;
            cart.push({
                id: 'cs_' + Date.now(),
                name: name,
                price: price,
                quantity: qty,
                image_url: img
            });
            localStorage.setItem('airton_cart', JSON.stringify(cart));
            loadCheckoutCart();
            alert(name + " ajouté au panier !");
        }

        function getFullItemsList() {
            let cart = [];
            try {
                cart = JSON.parse(localStorage.getItem('airton_cart') || '[]');
            } catch(e) {}
            
            const prices = upsellPricing[currentSystemType];
            
            if (activeUpsells.maint) {
                cart.push({ id: 'maint', name: "Contrat d'entretien annuel - " + currentSystemType, price: prices.maint, quantity: 1 });
            }
            if (activeUpsells.warranty) {
                cart.push({ id: 'warranty', name: "Garantie Premium Annuelle - " + currentSystemType, price: prices.warranty, quantity: 1 });
            }
            if (activeUpsells.serenity) {
                cart.push({ id: 'serenity', name: "Pack Sérénité - " + currentSystemType, price: prices.serenity, quantity: 1 });
            }
            
            return cart;
        }

        function loadCheckoutCart() {
            let cart = [];
            try {
                cart = JSON.parse(localStorage.getItem('airton_cart') || '[]');
            } catch(e) {}
            
            currentSystemType = getSystemType(cart);
            if (document.getElementById('dynamicUpsells').innerHTML.trim() === '') {
                renderUpsellUI();
            }
            
            const fullItems = getFullItemsList();
            
            const container = document.getElementById('checkoutCartItems');
            const taxEl = document.getElementById('checkoutTax');
            const totalEl = document.getElementById('checkoutTotal');
            
            if (fullItems.length === 0) {
                container.innerHTML = '<p>Votre panier est vide.</p>';
                document.getElementById('payButton').disabled = true;
                return;
            }
            
            document.getElementById('payButton').disabled = false;
            
            let subtotal = 0;
            container.innerHTML = fullItems.map(item => {
                subtotal += item.price * item.quantity;
                return \`
                    <div class="cart-item">
                        <img src="\${item.image_url || 'https://via.placeholder.com/64'}" alt="\${item.name}">
                        <div class="cart-item-details">
                            <p class="cart-item-title">\${item.name}</p>
                            <span class="cart-item-price">\${item.quantity} x \${item.price.toFixed(2).replace('.',',')} €</span>
                        </div>
                    </div>
                \`;
            }).join('');
            
            const tax = subtotal * 0.166;
            const total = subtotal + tax;
            
            taxEl.textContent = tax.toFixed(2).replace('.', ',') + ' €';
            totalEl.textContent = total.toFixed(2).replace('.', ',') + ' €';
        }

        document.addEventListener('DOMContentLoaded', () => {
            loadCheckoutCart();
            
            // Toggle billing fields
            document.querySelectorAll('input[name="billing"]').forEach(radio => {
                radio.addEventListener('change', (e) => {
                    document.getElementById('billingFields').style.display = (e.target.value === 'diff') ? 'block' : 'none';
                });
            });
        });

        // Handle Payment Submit
        document.getElementById('payButton').addEventListener('click', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const address = document.getElementById('address').value;
            const city = document.getElementById('city').value;
            const zipcode = document.getElementById('zipcode').value;
            const cgv = document.getElementById('cgv').checked;
            
            if (!email || !firstName || !lastName || !address || !city || !zipcode) {
                alert('Veuillez remplir tous les champs obligatoires.');
                return;
            }
            
            if (document.getElementById('billing_diff').checked) {
                if (!document.getElementById('b_firstName').value || !document.getElementById('b_lastName').value || 
                    !document.getElementById('b_address').value || !document.getElementById('b_city').value || !document.getElementById('b_zipcode').value) {
                    alert('Veuillez remplir les champs de facturation obligatoires.');
                    return;
                }
            }
            
            if (!cgv) {
                alert('Veuillez accepter les Conditions Générales de Vente.');
                return;
            }
            
            const items = getFullItemsList();
            
            const btn = document.getElementById('payButton');
            btn.textContent = 'Traitement...';
            btn.disabled = true;

            try {
                const response = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items: items })
                });
                
                const data = await response.json();
                if (response.ok && data.url) {
                    window.location.href = data.url;
                } else {
                    alert('Erreur: ' + (data.error || 'Paiement refusé'));
                    btn.textContent = 'Valider le paiement';
                    btn.disabled = false;
                }
            } catch (err) {
                alert('Erreur de connexion au serveur.');
                btn.textContent = 'Valider le paiement';
                btn.disabled = false;
            }
        });
`;

$('script:not([src])').text(newScript);

fs.writeFileSync('airton.shop/checkout.html', $.html(), 'utf8');
console.log('Update complete');
