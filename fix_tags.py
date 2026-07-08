import os

file_path = '/Users/nimeshranjan/Downloads/us.sitesucker.mac.sitesucker-pro/airton.shop/checkout.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_tail = """            </div>
        </div>
    </div>
</div>
</div>
    </div>

    
        </div>
    </div>

    </div>
    </div>
<!-- Stripe JS -->
    <script src="https://js.stripe.com/v3/"></script>
    </div>"""

new_tail = """            </div>
        </div>
    </div>
</div>
</div>
</div>
</div>
<!-- Stripe JS -->
    <script src="https://js.stripe.com/v3/"></script>"""

content = content.replace(old_tail, new_tail)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed closing tags")
