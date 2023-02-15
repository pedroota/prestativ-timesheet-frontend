export interface Projects {
  title: string;
  idClient: {
    _id: string;
    name: string;
  };
  valueProject: number;
  gpProject: {
    _id: string;
    name: string;
    surname: string;
  };
  description: string;
}

export interface ProjectsInfo {
  _id: string;
  title: string;
  idClient: {
    _id: string;
    name: string;
  };
  valueProject: number;
  gpProject: {
    _id: string;
    name: string;
    surname: string;
  };
  description: string;
}
export interface RegisterProject {
  _id?: string;
  title: string;
  idClient: string;
  valueProject: number;
  gpProject: string;
  description: string;
}
