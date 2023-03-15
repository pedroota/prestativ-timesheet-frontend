export interface Activities {
  title: string;
  project: {
    _id: string;
    title: string;
  };
  valueActivity: number;
  gpActivity: [
    {
      _id: string;
      name: string;
      surname: string;
    }
  ];
  businessUnit?: {
    _id: string;
    nameBU: string;
    relUser: string;
  };
  description: string;
  users: [
    {
      _id: string;
      name: string;
      surname: string;
    }
  ];
  closedScope: boolean;
  activityValidity?: number;
}

export interface ActivitiesInfo {
  _id: string;
  title: string;
  project: {
    _id: string;
    title: string;
    idClient: {
      _id: string;
      name: string;
    };
  };
  valueActivity: number;
  gpActivity: [
    {
      _id: string;
      name: string;
      surname: string;
    }
  ];
  businessUnit?: {
    _id: string;
    nameBU: string;
    relUser: string;
  };
  description: string;
  users: [
    {
      _id: string;
      name: string;
      surname: string;
    }
  ];
  closedScope: boolean;
  activityValidity: number;
}

export interface PatchActivities {
  _id: string;
  value: boolean;
}

export interface PatchActivityValidity {
  idActivity: string;
  activityValidity: number;
}

export interface RegisterActivity {
  title: string;
  project: string;
  valueActivity: number;
  gpActivity: string[];
  businessUnit?: string;
  description: string;
  users: string[];
  closedScope: boolean;
  activityValidity?: number;
}
