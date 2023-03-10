import { Roles } from "interfaces/roles.interface";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  _id: string;
  email: string;
  name: string;
  surname: string;
  role: Roles;
  typeField?: string;
}

export interface UserStore {
  user: User;
  handleAddUser: (data: User) => void;
  handleRemoveUser: () => void;
}

export const useAuthStore = create<UserStore>()(
  persist(
    (set) => ({
      user: {} as User,

      handleAddUser: ({ _id, name, surname, email, role, typeField }: User) => {
        set({
          user: { _id, name, surname, email, role, typeField },
        });
      },

      handleRemoveUser: () => set({}, true),
    }),
    { name: "prestativ-user" }
  )
);
