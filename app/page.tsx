"use client"; 

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import googleLogo from "@/public/google.png";
import gitLogo from "@/public/github.png";
import illustration from "@/public/sign in.jpg";
import { GoogleSignInButton } from "@/components/authButtons";

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/timeline");
    } else if (status !== "loading") {
      setIsLoading(false);
    }
  }, [status, router]);

  //consomation
  const handleLogin = async () => {
    try {
      const response = await fetch("https://superiamo-backend-ademnsir-production.up.railway.app/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.replace("/timeline"); 
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Erreur lors de la connexion");
        console.error("Erreur lors de la connexion :", errorData);
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      setErrorMessage("Impossible de se connecter. Veuillez réessayer plus tard.");
    }
  };

  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="flex w-[1200px] h-[700px] bg-transparent rounded-2xl overflow-hidden border border-gray-300">
     
        <div className="w-1/2 p-10 flex flex-col items-center justify-center bg-white">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Connexion</h1>

          <GoogleSignInButton />

          <button className="flex items-center justify-center w-full h-12 mt-6 text-lg bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-all duration-300">
            <Image src={gitLogo} alt="Logo Github" width={20} height={20} />
            <span className="ml-2">Continuer avec GitHub</span>
          </button>

          <div className="flex items-center justify-center space-x-4 mt-6 w-full">
            <span className="border-t border-gray-300 flex-grow"></span>
            <span className="text-gray-500 font-medium">OU</span>
            <span className="border-t border-gray-300 flex-grow"></span>
          </div>

        
          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 px-4 mt-4 border border-gray-300 rounded-md text-lg focus:border-blue-500 focus:outline-none"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 px-4 mt-4 border border-gray-300 rounded-md text-lg focus:border-blue-500 focus:outline-none"
          />

      
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mt-6 shadow-lg hover:bg-blue-700 transition-all duration-300"
          >
            Se connecter
          </button>

          {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}

          <p className="mt-6 text-gray-500">
            Vous n'avez pas encore de compte ?{" "}
            <span onClick={() => router.push("/signup")} className="text-blue-600 underline cursor-pointer">
              Inscrivez-vous
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
