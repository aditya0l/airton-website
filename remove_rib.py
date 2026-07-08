import glob
import re

files = glob.glob('/Users/nimeshranjan/Downloads/us.sitesucker.mac.sitesucker-pro/api/*.js')

for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update info@airton.shop to service-client@airton-shop.eu
    content = content.replace('info@airton.shop', 'service-client@airton-shop.eu')
    
    # 2. Remove the RIB cell
    cell_pattern = r'<div style="display: table-cell; width: 33%; text-align: center; border-right: 1px solid #e0e0e0; vertical-align: middle; padding: 0 10px;">\s*<p style="margin: 0; font-size: 11px; font-weight: bold;">Téléchargez<br>notre RIB <a href="mailto:service-client@airton-shop\.eu\?subject=Demande%20de%20RIB"[^>]*>ici</a></p>\s*</div>'
    
    new_content = re.sub(cell_pattern, '', content)
    
    if new_content != content:
        # replace width 33% with 50%
        new_content = new_content.replace('width: 33%;', 'width: 50%;')
        
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {path}")

print("Done updating email and removing RIB cell")
