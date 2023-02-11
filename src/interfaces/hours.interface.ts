export interface Hours {
  _id: string;
  initial: number;
  final: number;
  adjustment: number;
  relClient: {
    _id: string;
    name: string;
    valueClient: number;
    gpClient: {
      _id: string;
      name: string;
      surname: string;
    };
  };
  relProject: {
    _id: string;
    title: string;
    valueProject: number;
    gpProject: {
      _id: string;
      name: string;
      surname: string;
    };
  };
  relActivity: {
    _id: string;
    title: string;
    valueActivity: number;
    gpActivity: {
      _id: string;
      name: string;
      surname: string;
    };
    closedScope: boolean;
  };
  relUser: {
    _id: string;
    name: string;
    surname: string;
  };
  approvedGP: boolean;
  billable: boolean;
  released: boolean;
  approved: boolean;
  releasedCall: string;
  activityDesc: string;
  createdAt: number;
  updatedAt: number;
}

export interface RegisterHours {
  initial: number;
  final: number;
  relActivity: string;
  relUser: string;
  activityDesc: string;
  adjustment: number;
}

export interface PatchHour {
  _id: string;
  field: string;
  value: boolean;
}

export interface UpdateHoursProps {
  initial: number;
  final: number;
  adjustment: number;
  relActivity: string;
  relUser: string;
  activityDesc: string;
}
