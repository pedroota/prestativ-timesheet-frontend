export interface Activities {
  title: string;
  project: {
    _id: string;
    title: string;
  };
  valueActivity: number;
  gpActivity: {
    _id: string;
    name: string;
    surname: string;
  };
  description: string;
  users: [
    {
      name: string;
      surname: string;
    }
  ];
}

export interface ActivitiesInfo {
  _id: string;
  title: string;
  project: {
    _id: string;
    title: string;
  };
  valueActivity: number;
  gpActivity: {
    _id: string;
    name: string;
    surname: string;
  };
  description: string;
  users: [
    {
      name: string;
      surname: string;
    }
  ];
}
