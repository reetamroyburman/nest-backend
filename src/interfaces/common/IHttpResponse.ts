import { MULTITYPE } from '../../constants/dataType'

export interface IHttpResponse {
    statuscode?: number;
    status?: string;
    result?: MULTITYPE;
    message?: string;
}
