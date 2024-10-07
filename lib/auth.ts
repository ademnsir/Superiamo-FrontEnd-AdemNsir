import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";
import { GetServerSidePropsContext } from "next";

// Configuration d'authentification NextAuth
export const authConfig: NextAuthOptions = {
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
  pages: {
    signIn: "/signin", // Page de connexion personnalisée
  },
};

// Fonction qui nécessite `req` et `res` pour vérifier la session
export async function loginIsRequiredServer(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authConfig);
  if (!session) {
    // Redirection vers la page de connexion si la session n'est pas présente
    context.res.writeHead(302, { Location: "/signin" });
    context.res.end();
  }
  return session;
}
