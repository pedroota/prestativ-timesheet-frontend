export interface Hours {
  _id: string;
  initial: number;
  final: number;
  adjustment: number;
  relClient: {
    _id: string;
    name: string;
  };
  relProject: {
    _id: string;
    title: string;
  };
  relActivity: {
    _id: string;
    title: string;
  };
  relUser: {
    _id: string;
    name: string;
    surname: string;
  };
  closedScope: boolean;
  billable: boolean;
  released: boolean;
  approved: boolean;
  callNumber: string;
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
  callNumber: string;
  adjustment: number;
}
