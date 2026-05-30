import admin from "firebase-admin";
import { env } from "./env.js";

const firebaseConfig = {
  type: "service_account",
  project_id: env.firebaseProjectId,
  private_key_id: "key-id",
  private_key: env.firebasePrivateKey?.replace(/\\n/g, "\n"),
  client_email: env.firebaseClientEmail,
  client_id: "client-id",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "cert-url"
};

try {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig)
  });
} catch (error) {
  console.error("Firebase initialization error:", error.message);
}

export const firebaseAuth = admin.auth();
export const firebaseDb = admin.firestore();
