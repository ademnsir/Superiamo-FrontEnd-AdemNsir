"use client";
import React, { useState, useEffect } from "react";
import { FaCog } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

  // Utiliser useEffect pour GitHub seulement
  useEffect(() => {
    if (session?.user?.name && session.user.name.split(" ").length === 2) {
      const userData = {
        nom: session.user.name.split(" ")[0],
        prenom: session.user.name.split(" ")[1],
      };

      fetch(`https://superiamo-backend-ademnsir-production.up.railway.app/api/auth/github-user`, {
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
        .catch((error) => console.error("Erreur lors de la requête API GitHub:", error));
    }
  }, [session?.user?.name]);

  const fetchAddressCoordinates = async (address) => {
    try {
      const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(address)}`);
      if (!response.ok) {
        console.warn("Erreur lors de la requête à l'API.");
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

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Rayon de la terre en km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance en km
  };

  const validateAddress = async (address) => {
    if (!address) return; // Ne pas valider si l'adresse est vide

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

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "adresse" && value.trim() !== "") {
      await validateAddress(value);
    } else if (name === "adresse" && value.trim() === "") {
      setIsAddressValid(null); // Réinitialiser si le champ d'adresse est vide
      setDistance(null);
    }
  };

  const handleSubmit = async () => {
    if (!isAddressValid) {
      alert("L'adresse doit être située à moins de 50 km de Paris !");
      return;
    }

    try {
      const response = await fetch("https://superiamo-backend-ademnsir-production.up.railway.app/api/auth/update-profile", {
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
      <div className="w-full h-48 bg-gradient-to-r from-indigo-500 to-purple-600 relative rounded-b-2xl shadow-md">
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="User profile"
              width={150}
              height={150}
              className="rounded-full border-4 border-white shadow-xl"
            />
          ) : (
            <div className="w-36 h-36 bg-gray-200 rounded-full border-4 border-white shadow-xl"></div>
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
              {formData.adresse && (
                <p className={`text-sm ${isAddressValid ? "text-green-600" : "text-red-600"}`}>
                  {isAddressValid === null
                    ? ""
                    : isAddressValid
                    ? `Adresse valide (${distance?.toFixed(2)} km de Paris)`
                    : "Adresse invalide (doit être à moins de 50 km, essayez Paris, Île-de-France...)"}
                </p>
              )}
              <input type="tel" name="numeroTelephone" placeholder="Numéro de téléphone" value={formData.numeroTelephone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
            </div>
            <div className="flex gap-4 justify-center mt-8">
              <button onClick={handleSubmit} className="bg-blue-600 text-white py-2 px-6 rounded-md">Mettre à jour</button>
              <button onClick={() => setEditMode(false)} className="bg-gray-500 text-white py-2 px-4 rounded-md">Annuler</button>
            </div>
          </div>
        ) : (
          <>
            <nav className="mb-4">
              <NavItem icon={<FaCog className="text-xl text-gray-800" />} label="Edit Profile" onClick={() => setEditMode(true)} />
            </nav>
            <button
              className="bg-white rounded-full border border-gray-200 text-gray-800 px-4 py-2 flex items-center space-x-2 hover:bg-gray-200 transform hover:scale-105 transition-all duration-300"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              {session?.user?.image && <Image src={session.user.image} alt="User profile" width={32} height={32} className="rounded-full shadow-md" />}
              <span className="font-semibold">Logout</span>
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
