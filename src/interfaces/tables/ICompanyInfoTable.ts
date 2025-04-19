import { MULTITYPE } from '../../constants/dataType'
import { ICompanyModulePermissionTable, ICompanyModulePermissionUpdateTable } from './ICompanyModulePermissionTable'

export interface ICompanyInfoTable {
  email: string;
  workspacePath: string;
  parentDetails: MULTITYPE,
  permission: ICompanyModulePermissionTable[]
}

export interface ICompanyInfoUpdateTable {
  status: string;
  permission: ICompanyModulePermissionUpdateTable[]
}
