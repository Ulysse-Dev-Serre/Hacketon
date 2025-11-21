import { Link } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { isSignedIn } = useUser();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-[#2E9906] h-20 shadow-lg px-8 flex items-center justify-between">

      {/* LOGO + TEXTE */}
      <div className="flex items-center gap-4">
        <img
          src={logo}
          alt="LigueSport Logo"
          className="w-16 h-16 object-contain drop-shadow-md"
        />

        <Link
          to="/"
          className="text-3xl font-extrabold text-white tracking-wide drop-shadow-lg"
        >
          LigueSport
        </Link>
      </div>

      {/* MENU DROIT */}
      <div className="flex items-center gap-8 text-lg relative">

        {/* HOME */}
        <Link
          to="/"
          className="text-lg text-white/90 hover:text-white transition font-medium"
        >
          Home
        </Link>

        {/* MENU DÉROULANT “Rejoindre comme :” */}
        {!isSignedIn && (
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1 text-white/90 hover:text-white transition"
            >
              Rejoindre comme
              <ChevronDown
                size={18}
                className={`transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {open && (
              <div className="absolute right-0 bg-white shadow-xl mt-3 rounded-xl w-56 overflow-hidden animate-fadeIn">
                <Link
                  to="/sign-up?role=joueur"
                  className="block px-6 py-3 hover:bg-gray-100 transition text-gray-700 font-medium"
                  onClick={() => setOpen(false)}
                >
                  🎽 Joueur
                </Link>

                <Link
                  to="/sign-up?role=organisateur"
                  className="block px-6 py-3 hover:bg-gray-100 transition text-gray-700 font-medium"
                  onClick={() => setOpen(false)}
                >
                  🧑‍💼 Organisateur
                </Link>
              </div>
            )}
          </div>
        )}

        {/* BOUTON CONNEXION / USERBUTTON */}
        {!isSignedIn ? (
          <Link
            to="/sign-in"
            className="px-6 py-2 bg-white text-blue-700 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition"
          >
            Connexion
          </Link>
        ) : (
          <UserButton />
        )}
      </div>
    </nav>
  );
}
