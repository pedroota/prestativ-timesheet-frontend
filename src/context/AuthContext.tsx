import { User, UserRegister } from "interfaces/users.interface";
import { createContext, useState } from "react";
import { signin, signup } from "services/auth.service";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { Api } from "services/api.service";

type AuthContextType = {
  isAuthenticated: boolean;
  user: string | null;
  setUser: React.Dispatch<React.SetStateAction<string | null>>;
  signIn: ({ email, password }: User) => Promise<void>;
  signUp: ({
    name,
    surname,
    email,
    password,
    role,
  }: UserRegister) => Promise<void>;
};

type AuthContextProps = {
  children: React.ReactNode;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: AuthContextProps) {
  const [user, setUser] = useState<string | null>(null);

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

  async function signUp({
    name,
    surname,
    email,
    password,
    role,
  }: UserRegister) {
    await signup({
      name,
      surname,
      email,
      password,
      role,
    })
      .then(({ data }) =>
        toast.success(data?.message || "Usuário criado com sucesso", {
          autoClose: 1500,
        })
      )
      .catch(({ data }) =>
        toast.error(data?.message || "Ocorreu um erro ao criar o usuário", {
          autoClose: 1500,
        })
      );
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, isAuthenticated, signIn, signUp }}
    >
      {children}
    </AuthContext.Provider>
  );
}
