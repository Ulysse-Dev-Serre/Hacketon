import React from 'react';
import { SignUp as ClerkSignUp } from '@clerk/clerk-react';

const SignUp = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#CFCFCF] px-4">
      <ClerkSignUp
        path="/register"
        routing="path"
        signInUrl="/login"
        forceRedirectUrl="/assign-role"
        appearance={{
          elements: {
            rootBox: "w-full",

            // CARTE
            card: "bg-[#F2F2F2] border border-[#D0D0D0] shadow-md w-full max-w-md mx-auto rounded-xl",

            // TITRE
            headerTitle: "text-[#2A800A] font-extrabold",
            headerSubtitle: "text-gray-700",

            // BOUTONS SOCIAUX
            socialButtonsBlockButton:
              "bg-white border border-[#D0D0D0] text-[#2A800A] hover:border-[#2A800A] hover:bg-gray-100",

            dividerLine: "bg-[#D0D0D0]",
            dividerText: "text-gray-600",

            // LABEL INPUTS
            formFieldLabel: "text-gray-700",

            // INPUTS
            formFieldInput:
              "bg-white border border-[#D0D0D0] text-[#2A800A] focus:border-[#2A800A] focus:ring-[#2A800A]",

            // BOUTON PRIMARY (Continue)
            formButtonPrimary:
              "bg-[#2A800A] hover:bg-[#256E08] text-white font-semibold",

            // FOOTER
            footerActionText: "text-gray-700",
            footerActionLink: "text-[#2A800A] font-semibold hover:underline",
          }
        }}
      />
    </div>
  );
};

export default SignUp;

