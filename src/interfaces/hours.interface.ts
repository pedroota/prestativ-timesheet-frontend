export interface Hours {
  _id: string;
  initial: number;
  final: number;
  adjustment: number;
  relClient: {
    _id: string;
    name: string;
    valueClient: number;
    gpClient: string;
  };
  relProject: {
    _id: string;
    title: string;
    valueProject: number;
    gpProject: string;
  };
  relActivity: {
    _id: string;
    title: string;
    valueActivity: number;
    gpActivity: string;
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
  relClient: string;
  relProject: string;
  relActivity: string;
  relUser: string;
  activityDesc: string;
  adjustment: number;
}
