"use client";

import React, { useState, useEffect } from "react";
import { FaCog } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import bgprofile from "@/public/profile.png";


function DashboardNavbar() {
  const { data: session, status } = useSession();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    adresse: "",
    numeroTelephone: "",
    email: "",
  });
  const [isAddressValid, setIsAddressValid] = useState<boolean | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  const router = useRouter();

  // Utiliser useEffect pour Google seulement
  useEffect(() => {
    if (session?.user?.email) {
      const userData = { email: session.user.email };

      fetch(`https://superiamo-backend-ademnsir-production.up.railway.app/api/auth/google-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            const formattedDateNaissance = data.user.dateNaissance
              ? new Date(data.user.dateNaissance).toISOString().split("T")[0]
              : "";
            setFormData({
              nom: data.user.nom || "",
              prenom: data.user.prenom || "",
              dateNaissance: formattedDateNaissance,
              adresse: data.user.adresse || "",
              numeroTelephone: data.user.numeroTelephone || "",
              email: data.user.email || "",
            });
          }
        })
        .catch((error) => console.error("Erreur lors de la requête API Google:", error));
    }
  }, [session?.user?.email]);

  return (
    <div className={`flex flex-col items-center justify-between h-screen ${editMode ? "w-full" : "w-80"} bg-gradient-to-r from-gray-100 to-gray-200 shadow-lg shadow-gray-500 transition-all duration-500`}>
      {/* Section avec l'image de fond */}
      <div className="w-full h-48 relative rounded-b-2xl shadow-md">
        <Image
          src={bgprofile} // Utilisation de bgprofile comme image de fond
          alt="Background Image"
          fill
          className="object-cover rounded-b-2xl"
        />
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="User profile"
              width={100}
              height={100}
              className="rounded-full border-4 border-white shadow-xl"
            />
          ) : (
            <div className="w-36 h-36 bg-gray-200 rounded-full border-4 border-white shadow-xl"></div>
          )}
  
          {/* Afficher l'e-mail sous l'image quand on n'est pas en mode édition */}
          {!editMode && (
            <p className="text-lg font-semibold text-gray-700 mt-4">
              {formData.email || session?.user?.email || ""}
            </p>
          )}
        </div>
      </div>
  
      <div className="flex flex-col items-center mt-20 mb-8 w-full px-6">
        {editMode ? (
          <div className="flex flex-col items-center mb-4 w-full max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-700 mb-8">Modifier le profil</h2>
            <div className="space-y-4 w-full">
              <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
              <input type="text" name="prenom" placeholder="Prénom" value={formData.prenom} onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
              <input type="date" name="dateNaissance" value={formData.dateNaissance} onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
              <input type="text" name="adresse" placeholder="Adresse" value={formData.adresse} onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
              <input type="tel" name="numeroTelephone" placeholder="Numéro de téléphone" value={formData.numeroTelephone} onChange={(e) => setFormData({ ...formData, numeroTelephone: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
            </div>
            <div className="flex gap-4 justify-center mt-8">
              <button onClick={() => setEditMode(false)} className="bg-blue-600 text-white py-2 px-6 rounded-md">Enregistrer</button>
              <button onClick={() => setEditMode(false)} className="bg-gray-500 text-white py-2 px-4 rounded-md">Annuler</button>
            </div>
          </div>
        ) : (
          <>
            <nav className="mb-4">
              <NavItem icon={<FaCog className="text-xl text-gray-800" />} label="Modifier le profil" onClick={() => setEditMode(true)} />
            </nav>
            <button
              className="bg-white rounded-full border border-gray-200 text-gray-800 px-4 py-2 flex items-center space-x-2 hover:bg-gray-200 transform hover:scale-105 transition-all duration-300"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              {session?.user?.image && <Image src={session.user.image} alt="User profile" width={32} height={32} className="rounded-full shadow-md" />}
              <span className="font-semibold">Déconnexion</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
  
}

const NavItem = ({ icon, label, onClick }) => (
  <div onClick={onClick} className="mb-2 hover:bg-gray-300 rounded-full py-2 px-4 flex items-center space-x-2 shadow-sm">
    {icon}
    <span className="font-semibold text-gray-800">{label}</span>
  </div>
);

export default DashboardNavbar;
