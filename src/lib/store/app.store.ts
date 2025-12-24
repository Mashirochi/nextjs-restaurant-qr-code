import { RoleType } from "@/type/schema/jwt.type";
import { Socket } from "socket.io-client";
import { create } from "zustand";

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

export const useAppStore = create<IAppState>((set) => ({
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
}));
