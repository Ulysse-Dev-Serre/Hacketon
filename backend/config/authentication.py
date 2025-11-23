import jwt
import os
from django.conf import settings
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed
from accounts.models import User

class ClerkAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        # 1. Récupérer le header Authorization
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None  # Pas de token, on laisse passer (DRF gérera les permissions plus tard)

        try:
            # Le format est "Bearer <token>"
            token = auth_header.split(' ')[1]
        except IndexError:
            raise AuthenticationFailed('Invalid token header. No credentials provided.')

        # 2. Décoder le JWT
        # NOTE: En production, il FAUT vérifier la signature avec la clé publique de Clerk.
        # Pour ce hackathon, nous allons décoder le token pour récupérer les infos.
        # Si vous avez la CLERK_PEM_PUBLIC_KEY, on peut l'ajouter à la vérification.
        try:
            # decode sans verification de signature pour l'instant (si pas de clé publique configurée)
            # ou avec verification si on configure la clé.
            # Ici je mets verify=False pour que ça marche immédiatement en dev sans config complexe de clés RSA.
            # TODO: Sécuriser avec verify=True et la clé publique pour la prod.
            payload = jwt.decode(token, options={"verify_signature": False})
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.DecodeError:
            raise AuthenticationFailed('Error decoding token')
        except Exception as e:
            raise AuthenticationFailed(f'Authentication Error: {str(e)}')

        # 3. Logique "Get or Create" (Synchronisation)
        clerk_id = payload.get('sub')
        if not clerk_id:
            raise AuthenticationFailed('Token contains no "sub" (user id)')

        # Récupération de l'email
        email = payload.get('email')
        if not email and 'email_addresses' in payload:
             emails = payload.get('email_addresses', [])
             if isinstance(emails, list) and len(emails) > 0:
                 # Format parfois: [{'email_address': '...'}]
                 first = emails[0]
                 if isinstance(first, dict):
                    email = first.get('email_address')
                 else:
                    email = str(first)
        
        # Si toujours pas d'email, on regarde dans 'identifiers'
        if not email and 'identifiers' in payload:
             identifiers = payload.get('identifiers', [])
             for ident in identifiers:
                 if isinstance(ident, dict) and ident.get('type') == 'email_address':
                     email = ident.get('value')
                     break

        # CRASH FIX: Si vraiment aucun email n'est trouvé, on génère un email unique factice
        # pour satisfaire la contrainte UNIQUE de la base de données.
        if not email:
            email = f"{clerk_id}@no-email.clerk"

        # Récupération du nom
        full_name = payload.get('name') or payload.get('full_name')
        if not full_name:
             first = payload.get('given_name', '')
             last = payload.get('family_name', '')
             if first or last:
                 full_name = f"{first} {last}".strip()
        
        if not full_name:
            # Si pas de nom, on garde l'existant en base s'il est "valide" (pas un ID clerk)
            # Sinon on fallback sur l'email
            pass

        # Synchronisation DB
        try:
            user, created = User.objects.get_or_create(
                clerk_id=clerk_id,
                defaults={
                    'email': email,
                    'full_name': full_name or email.split('@')[0], # Fallback initial
                    'role': 'player'
                }
            )

            # Mise à jour si les infos ont changé
            if not created:
                save_needed = False
                # On ne met à jour l'email que s'il est valide (pas un placeholder)
                if email and not email.endswith('@no-email.clerk') and user.email != email:
                    user.email = email
                    save_needed = True
                
                # LOGIQUE DE PROTECTION DES DONNÉES
                # On ne met à jour le nom que si le nouveau nom semble "meilleur" ou si l'ancien était "mauvais".
                
                # Fix crash si user.full_name est None
                current_name = user.full_name or ""
                new_name = full_name or ""

                is_new_name_bad = new_name.startswith('user_') or '@' in new_name
                is_current_name_bad = current_name.startswith('user_') or '@' in current_name or not current_name
                
                should_update_name = False

                if full_name and current_name != full_name:
                    if is_current_name_bad:
                        # Si le nom actuel est "moche" (ID/Email) ou vide, on prend n'importe quoi de nouveau
                        should_update_name = True
                    elif not is_new_name_bad:
                        # Si le nom actuel est "bien", on ne met à jour QUE si le nouveau est "bien" aussi
                        should_update_name = True
                
                if should_update_name:
                    user.full_name = full_name
                    save_needed = True
                
                if save_needed:
                    user.save()
                    
        except Exception as e:
            # Debug: Afficher le payload si ça plante encore
            print(f"Error syncing user: {e}")
            print(f"Payload was: {payload}")
            raise AuthenticationFailed(f'Database sync error: {str(e)}')

        return (user, None)
