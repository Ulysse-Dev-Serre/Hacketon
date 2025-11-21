import os
import django
from django.db import connection

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def reset_database():
    print("💣 DESTRUCTION DE LA BASE DE DONNEES EN COURS...")
    
    with connection.cursor() as cursor:
        # Désactiver les contraintes de clé étrangère pour permettre la suppression
        if connection.vendor == 'sqlite':
            cursor.execute('PRAGMA foreign_keys = OFF;')
        
        # Récupérer toutes les tables
        table_names = connection.introspection.table_names()
        
        if not table_names:
            print("ℹ️  Aucune table trouvée.")
        else:
            print(f"🗑️  Suppression de {len(table_names)} tables...")
            
            if connection.vendor == 'postgresql':
                # Pour Postgres : DROP SCHEMA public CASCADE; CREATE SCHEMA public;
                # C'est la méthode la plus rapide et propre pour tout nettoyer sur Neon/Postgres
                print("🐘 Mode PostgreSQL détecté.")
                cursor.execute("DROP SCHEMA public CASCADE;")
                cursor.execute("CREATE SCHEMA public;")
                # Restaurer les permissions par défaut
                cursor.execute("GRANT ALL ON SCHEMA public TO public;")
                print("✅ Schéma public recréé.")
            else:
                # Pour SQLite ou autres : Drop table par table
                for table in table_names:
                    try:
                        cursor.execute(f'DROP TABLE IF EXISTS "{table}" CASCADE')
                    except:
                         cursor.execute(f'DROP TABLE IF EXISTS "{table}"')
                    print(f"   - Table {table} supprimée")

    print("\n✅ Base de données vide.")
    
    print("\n🔄 Application des migrations (recréation des tables)...")
    os.system('python manage.py migrate')
    
    print("\n✨ Base de données réinitialisée avec succès !")

if __name__ == '__main__':
    # Confirmation de sécurité
    confirm = input("⚠️  ATTENTION : Cela va effacer TOUTES les données. Êtes-vous sûr ? (oui/non) : ")
    if confirm.lower() == "oui":
        reset_database()
    else:
        print("❌ Opération annulée.")
