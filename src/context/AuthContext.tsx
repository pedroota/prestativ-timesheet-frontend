import { User, UserRegister } from "interfaces/users.interface";
import { createContext } from "react";
import { signin, signup } from "services/auth.service";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useAuthStore } from "stores/userStore";

type AuthContextType = {
  signIn: ({ email, password }: User) => Promise<void>;
  signUp: ({
    name,
    surname,
    email,
    password,
    role,
    typeField,
  }: UserRegister) => Promise<void>;
};

type AuthContextProps = {
  children: React.ReactNode;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: AuthContextProps) {
  const { handleAddUser } = useAuthStore((state) => state);

  async function signIn({ email, password }: User) {
    await signin({
      email,
      password,
    })
      .then(({ data }) => {
        Cookies.set("token", data?.token, { expires: 1 });
        handleAddUser(data.user);
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
    typeField,
  }: UserRegister) {
    await signup({
      name,
      surname,
      email,
      password,
      role,
      typeField,
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
    <AuthContext.Provider value={{ signIn, signUp }}>
      {children}
    </AuthContext.Provider>
  );
}
