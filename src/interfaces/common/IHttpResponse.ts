import { MULTITYPE } from '../../shared/constants/dataType'

export interface IHttpResponse {
    statuscode?: number;
    status?: string;
    result?: MULTITYPE;
    message?: string;
}
