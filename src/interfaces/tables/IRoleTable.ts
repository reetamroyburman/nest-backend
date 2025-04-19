export interface IPermissionTable {
  actionModuleId: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface IRoleTable {
  uuid?: any,
  name: string;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  permission: IPermissionTable[]
}
