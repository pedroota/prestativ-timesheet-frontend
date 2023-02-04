export interface Logs {
  _id: string;
  name: string;
  surname: string;
  role: {
    _id: string;
    name: string;
  };
  action: string;
  createdAt: number;
}
