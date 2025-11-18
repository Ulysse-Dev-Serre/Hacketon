import os
import django
import random

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from products.models import Product

def seed_products():
    print("Seeding products...")
    
    products_data = [
        {
            "name": "Premium Wireless Headphones",
            "description": "High-quality noise cancelling headphones with 30h battery life.",
            "price": 299.99,
            "stock": 50,
            "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60"
        },
        {
            "name": "Ergonomic Office Chair",
            "description": "Comfortable mesh chair with lumbar support and adjustable height.",
            "price": 199.50,
            "stock": 20,
            "image_url": "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&auto=format&fit=crop&q=60"
        },
        {
            "name": "Mechanical Keyboard",
            "description": "RGB backlit mechanical keyboard with Cherry MX Blue switches.",
            "price": 129.99,
            "stock": 35,
            "image_url": "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&auto=format&fit=crop&q=60"
        },
        {
            "name": "Smart Watch Series 5",
            "description": "Fitness tracker, heart rate monitor, and water resistant up to 50m.",
            "price": 349.00,
            "stock": 15,
            "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60"
        },
        {
            "name": "4K Ultra HD Monitor",
            "description": "27-inch IPS display with 144Hz refresh rate for gaming and work.",
            "price": 450.00,
            "stock": 10,
            "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=60"
        },
        {
            "name": "Minimalist Desk Lamp",
            "description": "LED desk lamp with adjustable brightness and color temperature.",
            "price": 49.99,
            "stock": 100,
            "image_url": "https://images.unsplash.com/photo-1534073828943-ef801eae83a1?w=800&auto=format&fit=crop&q=60"
        }
    ]

    count = 0
    for item in products_data:
        # Check if product already exists to avoid duplicates
        if not Product.objects.filter(name=item["name"]).exists():
            Product.objects.create(**item)
            print(f"Created: {item['name']}")
            count += 1
        else:
            print(f"Skipped (already exists): {item['name']}")
    
    print(f"\nSuccessfully seeded {count} new products!")

if __name__ == '__main__':
    seed_products()
