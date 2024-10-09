// firebase.js
import { initializeApp } from "firebase/app";
import { getMetadata, getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB5krGSrH9mO408AoaEzDAfWi4-FZk6Yes",
  authDomain: "frontend-web-e454c.firebaseapp.com",
  projectId: "frontend-web-e454c",
  storageBucket: "frontend-web-e454c.appspot.com",
  messagingSenderId: "477577416048",
  appId: "1:477577416048:web:a9acef3ba4e0058f9fd3b5",
  measurementId: "G-PVHD7MMLSV",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const isImageOrVideo = async (url: string): Promise<string | null> => {
  try {
    const httpsReference = ref(storage, url);
    const metadata = await getMetadata(httpsReference);

    // Check the content type (e.g., "image/jpeg" or "video/mp4")
    const contentType = metadata.contentType;

    if (contentType.startsWith("image/")) {
      return "image";
    } else if (contentType.startsWith("video/")) {
      return "video";
    } else {
      return null; // Not an image or video
    }
  } catch (error) {
    console.error("Error getting metadata:", error);
    return null;
  }
};
