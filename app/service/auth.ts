import axios from "axios";

// Classe de service d'authentification pour interagir avec votre backend
class Auth {
  private api;

  constructor() {
    this.api = axios.create({
      baseURL: "https://superiamo-backend-ademnsir-production.up.railway.app", // URL de votre backend
    });
  }

  // Enregistrer l'utilisateur dans la base de données
  async registerUser(profile: any) {
    try {
      const response = await this.api.post("/auth/register", {
        email: profile.email ?? "",
        nom: profile.given_name ?? profile.nom ?? "",
        prenom: profile.family_name ?? profile.prenom ?? "",
        adresse: "",
        telephone: "",
        datenaissance: "",
      });

      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'utilisateur :", error);
      throw error;
    }
  }

  // Récupérer l'utilisateur par email depuis la base de données
  async getUserByEmail(email: string) {
    try {
      const response = await this.api.get(`/auth/getuser`, {
        params: { email },
      });
      return response.data.user;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur par email :", error);
      throw error;
    }
  }

  // Mettre à jour le profil utilisateur
  async updateUserProfile(userData: any) {
    try {
      const response = await this.api.put(`/auth/update`, userData);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil de l'utilisateur :", error);
      throw error;
    }
  }
}

export default Auth;
