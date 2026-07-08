import os

file_path = '/Users/nimeshranjan/Downloads/us.sitesucker.mac.sitesucker-pro/airton.shop/checkout.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add CSS for cross-sell
css_to_add = """        .cross-sell-container {
            display: flex;
            gap: 15px;
        }
        @media(max-width: 600px) {
            .cross-sell-container {
                flex-direction: column;
            }
        }
    </style>"""

content = content.replace('    </style>', css_to_add)

# Replace inline style with class
content = content.replace('<div style="display: flex; gap: 15px;">', '<div class="cross-sell-container">')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Added cross-sell CSS")
