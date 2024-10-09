import { authOptions, loginIsRequiredServer } from "@/lib/auth"; // Import correct
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const wait = (ms: number) => new Promise((rs) => setTimeout(rs, ms));

export default async function Page() {
  await loginIsRequiredServer(); // Vérification de connexion
  const session = await getServerSession(authOptions); // Utilisation d'authOptions pour récupérer la session

  await wait(1000);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl font-bold text-white">Welcome to Dashboard</h1>
      <p className="text-xl mt-4">Nom: {session?.user?.nom}</p>
      <p className="text-xl">Prénom: {session?.user?.prenom}</p>
      <p className="text-xl">Email: {session?.user?.email}</p>
    </div>
  );
}
