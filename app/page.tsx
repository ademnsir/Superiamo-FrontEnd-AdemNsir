"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import googleLogo from "@/public/google.png";
import gitLogo from "@/public/github.png";
import illustration from "@/public/signin.jpg";
import { GoogleSignInButton, GithubSignInButton } from "@/components/authButtons";

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      // Enregistrer l'utilisateur dans la base de données après authentification réussie
      registerUser(session.user.email, session.user.name);
      router.replace("/timeline");
    } else if (status !== "loading") {
      setIsLoading(false);
    }
  }, [status, router, session]);

  const registerUser = async (email, name) => {
    try {
      const [prenom, nom] = name.split(" "); // Divisez le nom complet en nom et prénom
      const response = await fetch("/api/registerUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, nom, prenom }),
      });
      if (response.ok) {
        console.log("Utilisateur enregistré avec succès !");
      } else {
        console.error("Erreur lors de l'enregistrement de l'utilisateur");
      }
    } catch (error) {
      console.error("Erreur lors de l'appel de l'API :", error);
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
          <GithubSignInButton />
          <div className="flex items-center justify-center space-x-4 mt-6 w-full">
            <span className="border-t border-gray-300 flex-grow"></span>
            <span className="text-gray-500 font-medium">OU</span>
            <span className="border-t border-gray-300 flex-grow"></span>
          </div>
        </div>
        <div className="w-1/2 flex items-center justify-center relative overflow-hidden bg-transparent">
          <Image src={illustration} alt="Illustration" fill className="object-cover" />
          <div className="absolute bottom-4 flex flex-col items-center"></div>
        </div>
      </div>
    </div>
  );
}
