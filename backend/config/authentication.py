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

        # Récupération des infos du token
        # Clerk envoie parfois l'email directement ou dans un objet identities
        # Structure typique Clerk : {'email': '...', 'name': '...'} ou via des clés custom
        
        # Adaptez ces clés selon la config exacte de votre session Clerk (Email, Name)
        # Par défaut Clerk ne met pas toujours l'email dans le JWT racine sans configuration "Session tokens"
        # Mais supposons qu'on les ait configurés ou qu'on les récupère.
        
        email = payload.get('email', '')
        # Fallback si l'email n'est pas direct (dépend de la config Clerk Dashboard)
        if not email and 'email_addresses' in payload: 
             # Parfois Clerk envoie une liste
             emails = payload.get('email_addresses', [])
             if emails: email = emails[0].get('email_address', '')

        full_name = payload.get('name')
        if not full_name:
             # Fallback nom : combinaison first/last
             full_name = f"{payload.get('given_name', '')} {payload.get('family_name', '')}".strip()
        
        if not full_name:
            full_name = email.split('@')[0] if email else "Utilisateur Inconnu"

        # Synchronisation DB
        user, created = User.objects.get_or_create(
            clerk_id=clerk_id,
            defaults={
                'email': email,
                'full_name': full_name,
                'role': 'player' # Rôle par défaut
            }
        )

        # Si l'utilisateur existait déjà mais que ses infos ont changé dans Clerk (ex: nom),
        # on peut vouloir les mettre à jour ici.
        if not created:
            if user.email != email or user.full_name != full_name:
                user.email = email
                user.full_name = full_name
                user.save()

        return (user, None) # (User instance, Token)
