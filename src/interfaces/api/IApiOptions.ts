import { MULTITYPE } from '../../constants/dataType'

interface IHeaders {
  [key: string]: string;
}

export interface IApiOption {
  url: string;
  headers?: IHeaders;
  body?: any;
  params?: any;
  payload?: MULTITYPE
}

