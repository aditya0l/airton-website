document.addEventListener('DOMContentLoaded', async () => {
    // 1. Identify the product slug from the URL
    // e.g. /products/climatiseur-fixe-reversible.html -> "climatiseur-fixe-reversible"
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    const slug = filename.replace('.html', '');

    if (!slug) return;

    try {
        const response = await fetch(`/api/products?slug=${slug}`);
        if (!response.ok) {
            // Product not in DB, fallback to static HTML content
            console.log('No dynamic data found for this product, using static content.');
            return; 
        }

        const product = await response.json();
        
        // Export to global scope for cart.js to access
        window.airtonCurrentProduct = product;
        window.airtonCurrentProduct.slug = slug;
        
        // Grab image URL from meta tags if not present in DB
        if (!window.airtonCurrentProduct.image_url) {
            const imgMeta = document.querySelector('meta[property="og:image:secure_url"]') || document.querySelector('meta[property="og:image"]');
            if (imgMeta && imgMeta.content) {
                window.airtonCurrentProduct.image_url = imgMeta.content;
            }
        }
        
        // 2. Populate Data in DOM
        
        // Update Titles (assume h1 with class product__title or similar)
        document.querySelectorAll('h1').forEach(h1 => {
            // Very naive replacement, assuming the main H1 is the product title
            // In a real scenario, you'd add specific IDs or classes (e.g. data-dynamic="title") to the exact elements
            if(h1.textContent.trim().length > 0) {
                 h1.textContent = product.name;
            }
        });

        // Update Prices
        // Assuming price classes like .price-item--regular
        document.querySelectorAll('.price-item--regular').forEach(priceEl => {
            priceEl.textContent = `€${product.price}`;
        });
        
        // If there's a discount price
        if (product.discount_price) {
            document.querySelectorAll('.price-item--sale').forEach(priceEl => {
                priceEl.textContent = `€${product.discount_price}`;
            });
            // Show sale badge if applicable
        }

        // Update Stock Status
        // Assuming an element with id="dynamic-stock" or class "product-form__inventory"
        document.querySelectorAll('.product-form__inventory, #dynamic-stock').forEach(stockEl => {
            if (product.stock > 10) {
                stockEl.textContent = 'En stock';
                stockEl.style.color = 'green';
            } else if (product.stock > 0) {
                stockEl.textContent = `Plus que ${product.stock} en stock!`;
                stockEl.style.color = 'orange';
            } else {
                stockEl.textContent = 'Rupture de stock';
                stockEl.style.color = 'red';
            }
        });
        
        // Re-enable Add to Cart buttons if stock > 0
        if (product.stock > 0) {
            document.querySelectorAll('[type="submit"], [name="add"], .configurator-sticky-btn, .product-form__submit, .configurator-content-footer-add-to-cart').forEach(btn => {
                if (btn.disabled || btn.classList.contains('disabled')) {
                    btn.disabled = false;
                    btn.classList.remove('disabled');
                    
                    // Update text if it's currently showing "Rupture de stock" or similar
                    const textSpan = btn.querySelector('.btn__text');
                    if (textSpan) {
                        textSpan.textContent = 'Ajouter au panier';
                    } else if (btn.tagName === 'BUTTON') {
                        // Some buttons don't have .btn__text spans
                        if (!btn.querySelector('.spinner')) {
                            btn.textContent = 'Ajouter au panier';
                        } else {
                            // If it has a spinner, only replace the text nodes
                            for (let i = 0; i < btn.childNodes.length; i++) {
                                if (btn.childNodes[i].nodeType === Node.TEXT_NODE && btn.childNodes[i].nodeValue.trim() !== '') {
                                    btn.childNodes[i].nodeValue = 'Ajouter au panier ';
                                }
                            }
                        }
                    }
                }
            });
        }

        // Parse features if it's JSON
        if (product.features) {
            try {
                const featuresObj = JSON.parse(product.features);
                const featuresContainer = document.querySelector('#dynamic-features');
                if (featuresContainer) {
                    let html = '<ul>';
                    for (const [key, value] of Object.entries(featuresObj)) {
                        html += `<li><strong>${key}:</strong> ${value}</li>`;
                    }
                    html += '</ul>';
                    featuresContainer.innerHTML = html;
                }
            } catch (e) {
                // Not JSON, just text
                const featuresContainer = document.querySelector('#dynamic-features');
                if (featuresContainer) {
                    featuresContainer.textContent = product.features;
                }
            }
        }

        console.log('Dynamic product data loaded successfully.');

    } catch (error) {
        console.error('Error loading dynamic product data:', error);
    }
});
