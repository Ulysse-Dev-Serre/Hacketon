import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { SignIn, SignUp } from "@clerk/clerk-react";

function Ligues() {
  return <h1 className="text-2xl">Page Ligues</h1>;
}

function Equipes() {
  return <h1 className="text-2xl">Page Équipes</h1>;
}

function Matchs() {
  return <h1 className="text-2xl">Page Matchs</h1>;
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Ligues />} />
        <Route path="/equipes" element={<Equipes />} />
        <Route path="/matchs" element={<Matchs />} />

        {/* Formulaires centrés DANS la page */}
        <Route
          path="/sign-in"
          element={
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
              <SignIn routing="path" path="/sign-in" />
            </div>
          }
        />

        <Route
          path="/sign-up"
          element={
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
              <SignUp routing="path" path="/sign-up" />
            </div>
          }
        />
      </Routes>
    </Layout>
  );
}
