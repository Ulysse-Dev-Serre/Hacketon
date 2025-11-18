import jwt
from django.conf import settings
from rest_framework import authentication
from rest_framework import exceptions
from django.contrib.auth.models import User
import requests
from cryptography.hazmat.primitives import serialization

class ClerkAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        try:
            # "Bearer <token>"
            token = auth_header.split(' ')[1]
        except IndexError:
            return None

        try:
            # Decoding options
            # Dans un vrai environnement de prod, il est recommandé d'utiliser les JWKS (JSON Web Key Set)
            # Pour faire simple ici, on va supposer que le JWT est valide s'il est signé par Clerk
            # Mais sans la clé publique PEM ou JWKS, on ne peut pas vérifier la signature localement sans appel réseau ou clé statique.
            
            # Option 1 : Verif simple (décoder sans vérifier la signature pour l'instant si on n'a pas la clé)
            # MAIS CE N'EST PAS SECURISE.
            
            # Option 2 (Recommandée) : Utiliser la Secret Key pour introspecter (lent) ou JWKS (rapide).
            # Clerk fournit une librairie Python mais on peut le faire à la main.
            
            # Pour ce hackathon, on va faire une vérification basique.
            # Si tu as la CLERK_PEM_PUBLIC_KEY dans tes settings.
            
            # Pour l'instant, on decode sans verification de signature pour extraire le 'sub' (user_id)
            # A REMPLACER PAR UNE VRAIE VERIFICATION
            payload = jwt.decode(token, options={"verify_signature": False})
            
            user_id = payload.get('sub')
            if not user_id:
                raise exceptions.AuthenticationFailed('Invalid Token')

            # On récupère ou crée l'utilisateur Django correspondant
            user, created = User.objects.get_or_create(username=user_id)
            return (user, None)

        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token has expired')
        except jwt.DecodeError:
            raise exceptions.AuthenticationFailed('Error decoding token')
        except Exception as e:
            raise exceptions.AuthenticationFailed(str(e))
