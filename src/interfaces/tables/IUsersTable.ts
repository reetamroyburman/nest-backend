export interface ICustomerUserAddresses {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  }

export interface IUsersTable {
    email: string;
    role: string;
}

export interface IProfileUpdate {
  name: string,
  phoneNo?: string,
  address: ICustomerUserAddresses
}

export interface IUserRefreshTokenUpdateUpdate {
  refreshToken: string
}

export interface IUsersUpdateTable {
    status: 'ACTIVE' | 'INACTIVE';
    role: string;
}

export interface IUsersQueryData {
    name: string;
    email: string;
    phoneNo?: string;
    status: 'ACTIVE' | 'INACTIVE';
    isRoot: boolean;
    level: number;
    type: string;
    isVerified: boolean;
    uuid: string;
    password: string
  }
