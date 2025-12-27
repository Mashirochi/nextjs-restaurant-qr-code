import { RoleType } from "@/type/schema/jwt.type";
import { Socket } from "socket.io-client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import CryptoJS from "crypto-js";
interface IAppState {
  isAuth: boolean;
  role: RoleType | undefined;
  setRole: (role?: RoleType | undefined) => void;
  socket: Socket | undefined;
  setSocket: (socket: Socket | undefined) => void;
  disconnectSocket: () => void;
  user: {
    id: number;
    name: string;
    email: string;
  } | null;
  setUser: (
    user: {
      id: number;
      name: string;
      email: string;
    } | null
  ) => void;
  clearUser: () => void;
}

const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY!;

const encrypt = (data: string): string => {
  try {
    const encrypted = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
    return encrypted;
  } catch (e) {
    console.error("Encryption failed:", e);
    return data;
  }
};

const decrypt = (data: string): string => {
  try {
    const decrypted = CryptoJS.AES.decrypt(data, SECRET_KEY);
    return decrypted?.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.error("Decryption failed:", e);
    return data;
  }
};

const encryptedStorage = {
  getItem: (name: string): any => {
    try {
      if (typeof window === "undefined" || !window.localStorage) {
        return null;
      }
      const str = window.localStorage.getItem(name);
      if (!str) return null;
      const decryptedStr = decrypt(str);
      return JSON.parse(decryptedStr);
    } catch (e) {
      console.error("Error getting item from encrypted storage:", e);
      return null;
    }
  },
  setItem: (name: string, value: any): void => {
    try {
      if (typeof window === "undefined" || !window.localStorage) {
        return;
      }
      const str = JSON.stringify(value);
      const encryptedStr = encrypt(str);
      window.localStorage.setItem(name, encryptedStr);
    } catch (e) {
      console.error("Error setting item to encrypted storage:", e);
    }
  },
  removeItem: (name: string): void => {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(name);
    }
  },
};

export const useAppStore = create<IAppState>()(
  persist(
    (set) => ({
      isAuth: false,
      role: undefined as RoleType | undefined,
      setRole: (role: RoleType | undefined) => set({ role, isAuth: !!role }),
      socket: undefined,
      setSocket: (socket: Socket | undefined) => set({ socket }),
      disconnectSocket: () =>
        set((state) => {
          state.socket?.disconnect();
          return { socket: undefined };
        }),
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "app-storage", // name of the item in the storage (must be unique)
      storage: encryptedStorage,
      partialize: (state) => ({
        // Only persist these fields
        isAuth: state.isAuth,
        role: state.role,
        user: state.user,
      }),
    }
  )
);
