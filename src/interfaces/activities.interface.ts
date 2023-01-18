export interface Activities {
  title: string;
  project: string;
  valueActivity: number;
  gpActivity: string;
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
  project: string;
  valueActivity: number;
  gpActivity: string;
  description: string;
  users: [
    {
      name: string;
      surname: string;
    }
  ];
}
