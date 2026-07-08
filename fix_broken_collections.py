import os
import glob

# The mapping of broken links to actual local HTML files
replacements = {
    "https://airton.shop/collections/climatiseurs-sans-evacuation": "/collections/climatiseurs-mobiles.html",
    "https://airton.shop/collections/climatiseur-mobile-reversible-silencieux-sans-travaux-airton": "/collections/climatiseurs-mobiles.html",
    "https://airton.shop/collections/clim-reversible-mural": "/collections/climatiseur-reversible-pompe-chaleur-air-air.html",
    "https://airton.shop/collections/climatiseur-split": "/collections/climatiseur-reversible-pompe-chaleur-air-air.html",
    "https://airton.shop/collections/appareils-mobiles-climatiseur-mobile": "/collections/climatiseurs-mobiles.html",
    "https://airton.shop/collections/climatiseurs-par-surface": "/collections/climatiseur-reversible-pompe-chaleur-air-air.html"
}

# Also handle cases without domain
replacements.update({
    "/collections/climatiseurs-sans-evacuation": "/collections/climatiseurs-mobiles.html",
    "/collections/climatiseur-mobile-reversible-silencieux-sans-travaux-airton": "/collections/climatiseurs-mobiles.html",
    "/collections/clim-reversible-mural": "/collections/climatiseur-reversible-pompe-chaleur-air-air.html",
    "/collections/climatiseur-split": "/collections/climatiseur-reversible-pompe-chaleur-air-air.html",
    "/collections/appareils-mobiles-climatiseur-mobile": "/collections/climatiseurs-mobiles.html",
    "/collections/climatiseurs-par-surface": "/collections/climatiseur-reversible-pompe-chaleur-air-air.html"
})

def fix_files(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = content
                for old_link, new_link in replacements.items():
                    # We are replacing exactly the href values to avoid matching substrings incorrectly
                    new_content = new_content.replace(f'href="{old_link}"', f'href="{new_link}"')
                    # Just in case there are single quotes
                    new_content = new_content.replace(f"href='{old_link}'", f"href='{new_link}'")

                if new_content != content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Fixed {path}")

fix_files('/Users/nimeshranjan/Downloads/us.sitesucker.mac.sitesucker-pro/airton.shop')
print("Done fixing broken collection links!")
