import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";

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
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) return null;

        // Custom logic to validate the credentials
        return { id: "1", name: "John Doe", email: credentials.email };
      },
    }),
  ],
  pages: {
    signIn: "/signin", // Optional: custom sign in page
  },
};

// Fonction pour vérifier la session côté serveur
export async function loginIsRequiredServer(context: any) {
  const session = await getServerSession(context.req, context.res, authConfig);
  if (!session) {
    redirect("/signin");
  }
  return session;
}
