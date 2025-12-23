import { RoleType } from "@/type/schema/jwt.type";
import { Socket } from "socket.io-client";
import { create } from "zustand";

interface IAppState {
  isAuth: boolean;
  role: RoleType | undefined;
  setRole: (role: RoleType | undefined) => void;
  socket: Socket | undefined;
  setSocket: (socket: Socket | undefined) => void;
  disconnectSocket: () => void;
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
}));
