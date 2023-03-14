export interface BusinessUnit {
  _id?: string;
  nameBU: string;
  relUser: {
    _id: string;
    name: string;
    surname: string;
  };
}

export interface BusinessUnitRegister {
  nameBU: string;
  relUser: string;
}
