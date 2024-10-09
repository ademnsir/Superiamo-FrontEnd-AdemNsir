import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Auth from "@/app/service/auth";

// Initialisation du service d'authentification
const auth = new Auth();

// Configuration d'options NextAuth
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string, // Mise à jour pour correspondre à votre .env
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.email = profile.email;
        token.nom = profile.given_name || profile.name?.split(" ")[0] || "";
        token.prenom = profile.family_name || profile.name?.split(" ")[1] || "";

        // Enregistrer l'utilisateur dans le backend
        try {
          await auth.registerUser(profile);
        } catch (error) {
          console.error("Error registering user:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      try {
        const user = await auth.getUserByEmail(token.email);
        if (user) {
          session.user.nom = user.nom || null;
          session.user.email = user.email || null;
          session.user.prenom = user.prenom || null;
          session.user.telephone = user.telephone || null;
          session.user.adresse = user.adresse || null;
          session.user.datenaissance = user.datenaissance || null;
        }
        return session;
      } catch (error) {
        console.error("Error retrieving user:", error);
      }
    },
  },
};

// Fonction pour forcer la connexion de l'utilisateur si non authentifié
export async function loginIsRequiredServer() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/signin"); // Redirige vers la page de connexion si l'utilisateur n'est pas connecté
  }
}
