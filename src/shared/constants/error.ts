import { type MULTITYPE } from './dataType'

export default class Error {
  Code: string
  Message: MULTITYPE

  constructor (Code: string, Message: MULTITYPE) {
    this.Code = Code
    this.Message = Message
  }
}
