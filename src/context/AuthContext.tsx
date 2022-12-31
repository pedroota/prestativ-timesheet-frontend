import { User } from "interfaces/users.interface";
import { createContext, useEffect, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  // signIn: (data: User) => Promise<void>;
};

type AuthContextProps = {
  children: any;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: AuthContextProps) {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  // useEffect(() => {
  //   const { 'nextauth.token': token } = parseCookies()

  //   if (token) {
  //     recoverUserInformation().then(response => {
  //       setUser(response.user)
  //     })
  //   }
  // }, [])

  // async function signIn({ email, password }: User) {
  //   const { token, user } = await signInRequest({
  //     email,
  //     password,
  //   });

  //   setCookie(undefined, "nextauth.token", token, {
  //     maxAge: 60 * 60 * 1, // 1 hour
  //   });

  //   api.defaults.headers["Authorization"] = `Bearer ${token}`;

  //   setUser(user);

  //   Router.push("/dashboard");
  // }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
