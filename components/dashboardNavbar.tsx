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

  const router = useRouter();

  useEffect(() => {
    if (session?.user?.email) {
      const userData = { email: session.user.email };

      fetch(`/api/auth/user-data`, {
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
        .catch((error) => console.error("Erreur lors de la requête API :", error));
    }
  }, [session?.user?.email]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Profil mis à jour avec succès !");
        setEditMode(false);
      } else {
        alert("Erreur lors de la mise à jour du profil");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-between h-screen ${editMode ? "w-full" : "w-80"} bg-gradient-to-r from-gray-100 to-gray-200 shadow-lg shadow-gray-500 transition-all duration-500`}>
      <div className="w-full h-48 relative rounded-b-2xl shadow-md">
        <Image src={bgprofile} alt="Background Image" fill className="object-cover rounded-b-2xl" />
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
          {!editMode && (
            <p className="text-sm font-medium text-gray-600 mt-2">
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
              <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
              <input type="text" name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
              <input type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
              <input type="text" name="adresse" placeholder="Adresse" value={formData.adresse} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
              <input type="tel" name="numeroTelephone" placeholder="Numéro de téléphone" value={formData.numeroTelephone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
            </div>
            <div className="flex gap-4 justify-center mt-8">
              <button onClick={handleSubmit} className="bg-blue-600 text-white py-2 px-6 rounded-md">Mettre à jour</button>
              <button onClick={() => setEditMode(false)} className="bg-gray-500 text-white py-2 px-4 rounded-md">Annuler</button>
            </div>
          </div>
        ) : (
          <button className="bg-blue-500 text-white rounded-lg py-2 px-4" onClick={() => setEditMode(true)}>
            Modifier le profil
          </button>
        )}
      </div>
    </div>
  );
}

export default DashboardNavbar;
