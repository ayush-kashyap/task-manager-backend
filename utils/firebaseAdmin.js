import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

let app = null;
let authInstance = null;

const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
    const apps = getApps();
    app = apps.length === 0 ? initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
        })
    }) : apps[0];
    authInstance = getAuth(app);
    console.log("Firebase Admin SDK successfully initialized.");
} else {
    console.warn("Firebase Admin SDK is not fully initialized. Please set the environment variables: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY");
}

const admin = {
    get apps() {
        return getApps();
    },
    auth: () => {
        if (!authInstance) {
            throw new Error("Firebase Auth is not initialized. Check environment variables.");
        }
        return authInstance;
    }
};

export default admin;
