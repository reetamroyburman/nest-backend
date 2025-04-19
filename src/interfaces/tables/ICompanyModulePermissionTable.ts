export interface ICompanyModulePermissionTable {
  actionModuleId: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ICompanyModulePermissionUpdateTable {
  actionModuleId: number;
  status: 'ACTIVE' | 'INACTIVE';
}
