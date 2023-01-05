import { User } from "interfaces/users.interface";
import { createContext, useState } from "react";
import { signin } from "services/auth.service";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { Api } from "services/api.service";

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  signIn: ({ email, password }: User) => Promise<void>;
};

type AuthContextProps = {
  children: any;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: AuthContextProps) {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  async function signIn({ email, password }: User) {
    await signin({
      email,
      password,
    })
      .then(({ data }) => {
        toast.success(data?.message || "Seja bem-vindo.", {
          autoClose: 1500,
        });
        setUser(data?.token);
        Cookies.set("token", data?.token, { expires: 1 });

        // Already sets the Authorization as the user token
        Api.defaults.headers["Authorization"] = `Bearer ${data?.token}`;
      })
      .catch(({ data }) => {
        toast.error(data?.message || "Ocorreu um erro na autenticação.", {
          autoClose: 1500,
        });
      });
  }

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}
