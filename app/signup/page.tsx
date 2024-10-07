"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import illustration from "@/public/signup.jpg";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    adresse: "",
    telephone: "",
    email: "", 
    password: "",
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //consomation
  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Utilisateur créé avec succès !");
        router.push("/"); 
      } else {
        alert("Erreur lors de la création de l'utilisateur");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur :", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="flex w-[1200px] h-[700px] bg-transparent rounded-2xl overflow-hidden border border-gray-300">
        <div className="w-1/2 p-10 flex flex-col items-center justify-center bg-white">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Créer votre compte</h1>

          <input
            type="text"
            name="nom"
            placeholder="Nom"
            className="w-full h-12 px-4 mt-4 border border-gray-300 rounded-md text-lg focus:border-blue-500 focus:outline-none"
            onChange={handleChange}
          />

          <input
            type="text"
            name="prenom"
            placeholder="Prénom"
            className="w-full h-12 px-4 mt-4 border border-gray-300 rounded-md text-lg focus:border-blue-500 focus:outline-none"
            onChange={handleChange}
          />

          <input
            type="date"
            name="dateNaissance"
            placeholder="Date de naissance"
            className="w-full h-12 px-4 mt-4 border border-gray-300 rounded-md text-lg focus:border-blue-500 focus:outline-none"
            onChange={handleChange}
          />

          <input
            type="text"
            name="adresse"
            placeholder="Adresse"
            className="w-full h-12 px-4 mt-4 border border-gray-300 rounded-md text-lg focus:border-blue-500 focus:outline-none"
            onChange={handleChange}
          />

          <input
            type="tel"
            name="telephone"
            placeholder="Numéro de téléphone"
            className="w-full h-12 px-4 mt-4 border border-gray-300 rounded-md text-lg focus:border-blue-500 focus:outline-none"
            onChange={handleChange}
          />

        
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full h-12 px-4 mt-4 border border-gray-300 rounded-md text-lg focus:border-blue-500 focus:outline-none"
            onChange={handleChange}
          />

      
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            className="w-full h-12 px-4 mt-4 border border-gray-300 rounded-md text-lg focus:border-blue-500 focus:outline-none"
            onChange={handleChange}
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mt-6 shadow-lg hover:bg-blue-700 transition-all duration-300"
          >
            Créer le compte
          </button>

          <p className="mt-6 text-gray-500">
            Vous avez déjà un compte ?{" "}
            <span
              onClick={() => router.push("/")}
              className="text-blue-600 underline cursor-pointer"
            >
              Connectez-vous
            </span>
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-center relative overflow-hidden bg-transparent">
          <Image src={illustration} alt="Illustration" fill className="object-cover" />
          <div className="absolute bottom-4 flex flex-col items-center"></div>
        </div>
      </div>
    </div>
  );
}
