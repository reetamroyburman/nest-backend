import { MULTITYPE } from '../../constants/dataType'

export interface IApiResponse {
    statuscode?: number;
    status?: string;
    result?: MULTITYPE;
    message?: string;
}
