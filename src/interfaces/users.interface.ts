export interface User {
  email: string;
  password: string;
}

export interface UserRegister {
  _id?: string;
  name?: string;
  surname?: string;
  email: string;
  password: string;
  role?: string;
  token?: string;
}

export interface UserInfo {
  _id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  role: string;
}
