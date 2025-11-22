import React from 'react';
import { SignIn as ClerkSignIn } from '@clerk/clerk-react';

const SignIn = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#CFCFCF] px-4">
      <ClerkSignIn 
        path="/login" 
        routing="path" 
        signUpUrl="/register" 
        forceRedirectUrl="/assign-role"
        appearance={{
          elements: {
            rootBox: "w-full",

            // CARD
            card: "bg-[#F2F2F2] border border-[#D0D0D0] shadow-md w-full max-w-md mx-auto rounded-xl",

            // TITRE
            headerTitle: "text-[#2A800A] font-extrabold",
            headerSubtitle: "text-gray-700",

            // BOUTONS SOCIAUX
            socialButtonsBlockButton:
              "bg-white border border-[#D0D0D0] text-[#2A800A] hover:border-[#2A800A] hover:bg-gray-100",

            dividerLine: "bg-[#D0D0D0]",
            dividerText: "text-gray-600",

            // LABEL DES INPUTS
            formFieldLabel: "text-gray-700",

            // INPUTS
            formFieldInput:
              "bg-white border border-[#D0D0D0] text-[#2A800A] focus:border-[#2A800A] focus:ring-[#2A800A]",

            // LIEN BAS DE FORMULAIRE
            footerActionText: "text-gray-700",
            footerActionLink: "text-[#2A800A] font-semibold hover:underline",

            // BOUTON PRINCIPAL (LOGIN)
            formButtonPrimary:
              "bg-[#2A800A] hover:bg-[#256E08] text-white font-semibold",
          }
        }}
      />
    </div>
  );
};

export default SignIn;

