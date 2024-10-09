"use client"; 

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import illustration from "@/public/signup.jpg";

interface FormErrors {
  nom?: string;
  prenom?: string;
  dateNaissance?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  password?: string;
}

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
  const [isAddressValid, setIsAddressValid] = useState<boolean | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const fetchAddressCoordinates = async (address: string) => {
    try {
      const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(address)}`);
      if (!response.ok) {
        console.warn("Erreur de réponse de l'API adresse.data.gouv.fr");
        return null;
      }
      const data = await response.json();
      if (data.features.length > 0) {
        const [longitude, latitude] = data.features[0].geometry.coordinates;
        return { latitude, longitude };
      }
      return null;
    } catch (error) {
      console.error("Erreur lors de la requête à l'API adresse.data.gouv.fr :", error);
      return null;
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Rayon de la Terre en km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance en km
  };

  const validateAddress = async (address: string) => {
    const userCoordinates = await fetchAddressCoordinates(address);
    const parisCoordinates = { latitude: 48.8566, longitude: 2.3522 };

    if (userCoordinates) {
      const dist = calculateDistance(
        userCoordinates.latitude,
        userCoordinates.longitude,
        parisCoordinates.latitude,
        parisCoordinates.longitude
      );

      setIsAddressValid(dist <= 50);
      setDistance(dist);
    } else {
      setIsAddressValid(false);
      setDistance(null);
    }
  };

  const validateFields = () => {
    const tempErrors: FormErrors = {};
    if (!formData.nom.trim()) tempErrors.nom = "Le nom est requis.";
    if (!formData.prenom.trim()) tempErrors.prenom = "Le prénom est requis.";
    if (!formData.dateNaissance) tempErrors.dateNaissance = "La date de naissance est requise.";
    if (!formData.adresse.trim()) tempErrors.adresse = "L'adresse est requise.";
    if (!formData.telephone.trim() || !/^\d{10}$/.test(formData.telephone)) {
      tempErrors.telephone = "Le numéro de téléphone doit comporter exactement 10 chiffres.";
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "L'email est invalide.";
    }
    if (!formData.password || formData.password.length < 6) {
      tempErrors.password = "Le mot de passe doit comporter au moins 6 caractères.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "adresse") {
      await validateAddress(value);
    }
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      alert("Veuillez corriger les erreurs de saisie.");
      return;
    }

    if (!isAddressValid) {
      alert("L'adresse doit être située à moins de 50 km de Paris !");
      return;
    }

    try {
      const response = await fetch("https://superiamo-backend-ademnsir-production.up.railway.app/api/auth/register", {
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
            className="w-full h-12 px-4 mt-4 border border-gray-300 rounded-md"
            onChange={handleChange}
          />
          {errors.nom && <p className="text-red-600">{errors.nom}</p>}
          <input
            type="text"
            name="prenom"
            placeholder="Prénom"
            className="w-full h-12 px-4 mt-4 border border-gray-300 rounded-md"
            onChange={handleChange}
          />
          {errors.prenom && <p className="text-red-600">{errors.prenom}</p>}
          <input
            type="date"
            name="dateNaissance"
            placeholder="Date de naissance"
            className="w-full h-12 px-4 mt-4 border border-gray-300 rounded-md"
            onChange={handleChange}
          />
          {errors.dateNaissance && <p className="text-red-600">{errors.dateNaissance}</p>}
          <input
            type="text"
            name="adresse"
            placeholder="Adresse"
            className="w-full h-12 px-4 mt-4 border border-gray-300 rounded-md"
            onChange={handleChange}
          />
          <p className={`text-sm ${isAddressValid ? "text-green-600" : "text-red-600"}`}>
            {formData.adresse === "" ? "" : isAddressValid === null
              ? "Adresse en cours de validation..."
              : isAddressValid
              ? `Adresse valide (${distance?.toFixed(2)} km de Paris)`
              : "Adresse invalide (doit être à moins de 50 km de Paris)"}
          </p>
          <input
            type="tel"
            name="telephone"
            placeholder="Numéro de téléphone"
            className="w-full h-12 px-4 mt-4 border border-gray-300 rounded-md"
            onChange={handleChange}
          />
          {errors.telephone && <p className="text-red-600">{errors.telephone}</p>}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full h-12 px-4 mt-4 border border-gray-300 rounded-md"
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-600">{errors.email}</p>}
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            className="w-full h-12 px-4 mt-4 border border-gray-300 rounded-md"
            onChange={handleChange}
          />
          {errors.password && <p className="text-red-600">{errors.password}</p>}
          <button onClick={handleSubmit} className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6">
            Créer le compte
          </button>
          <p className="mt-6 text-gray-500">
            Vous avez déjà un compte ?{" "}
            <span onClick={() => router.push("/")} className="text-blue-600 underline cursor-pointer">
              Connectez-vous
            </span>
          </p>
        </div>
        <div className="w-1/2 flex items-center justify-center relative overflow-hidden bg-transparent">
          <Image src={illustration} alt="Illustration" fill className="object-cover" />
        </div>
      </div>
    </div>
  );
}
