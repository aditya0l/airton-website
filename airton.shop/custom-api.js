

function interceptExternalLinks() {
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link) {
            const href = link.getAttribute('href') || '';
            
            // Intercept absolute URLs to airton.shop or root-relative URLs
            if (href.includes('airton.shop') || href.startsWith('/')) {
                e.preventDefault();
                
                try {
                    // Try to parse the URL
                    const url = new URL(href, window.location.origin);
                    let pathname = url.pathname;
                    
                    // If the original URL had airton.shop, the pathname is just the path part.
                    // If it was already a local root-relative path (e.g. /products/...), same thing.
                    
                    // Specific overrides for pages we built from scratch
                    if (pathname.includes('/account/login') || pathname.includes('/customer_authentication')) {
                        window.location.href = '/airton.shop/login.html';
                        return;
                    } else if (pathname.includes('/checkout') || pathname.includes('/cart')) {
                        window.location.href = '/airton.shop/checkout.html';
                        return;
                    }
                    
                    // For everything else, SiteSucker probably downloaded it as a .html file.
                    // E.g., /collections/cache-climatiseur -> /airton.shop/collections/cache-climatiseur.html
                    
                    // Clean up the pathname
                    if (pathname.endsWith('/')) {
                        pathname = pathname.slice(0, -1);
                    }
                    if (!pathname.endsWith('.html') && pathname !== '' && pathname !== '/airton.shop') {
                        pathname += '.html';
                    }
                    
                    // Construct the local path
                    let localPath = pathname;
                    if (!localPath.startsWith('/airton.shop')) {
                         localPath = '/airton.shop' + localPath;
                    }
                    
                    console.log(`Routing external link ${href} to local path: ${localPath}`);
                    window.location.href = localPath;
                    
                } catch(err) {
                    console.error("Error parsing intercepted link:", err);
                }
            }
        }
    });
}

function interceptForms() {
    document.addEventListener('submit', (e) => {
        const form = e.target;
        if (form && form.tagName === 'FORM') {
            const action = form.getAttribute('action') || '';
            if (action.includes('airton.shop/localization') || action.includes('/localization')) {
                e.preventDefault();
                console.log('Intercepted localization form submit');
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Custom API script loaded.');
    interceptExternalLinks();
    interceptForms();
});
