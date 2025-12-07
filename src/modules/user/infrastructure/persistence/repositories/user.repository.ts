import HttpStatus from 'http-status-codes'


import { Transaction } from 'sequelize'
import { ResponseStatus } from '../../../../../shared/constants/responseStatus'
import { MULTITYPE } from '../../../../../shared/constants/dataType'
import { IHttpResponse } from '../../../../../interfaces/common/IHttpResponse'
import { Users } from '../models/IUsers'

export class UsersQueryExecution  {

  private handleError (error: any, operation: string, response: IHttpResponse) {
    console.error(`[UsersQueryExecution] [handleError] ${operation}`, { error })
    response.statuscode = HttpStatus.SERVICE_UNAVAILABLE
    response.status = ResponseStatus.ERROR
    return response
  }

  async create (data: MULTITYPE, trx?: Transaction, many?:boolean): Promise<IHttpResponse> {
    const response: IHttpResponse = {}
    try {
      const createData = many
        ? await Users.bulkCreate(data, { transaction: trx })
        : await Users.create(data, { transaction: trx })

      console.log('[UsersQueryExecution] [create] success')
      response.statuscode = HttpStatus.CREATED
      response.status = ResponseStatus.SUCCESS
      response.result = JSON.parse(JSON.stringify(createData))
      return response
    } catch (error) {
      return this.handleError(error, '[UsersQueryExecution] [create]', response)
    }
  }

  async fetch ({
    id,
    where,
    include,
    pagination,
    attributes,
    count,
    order,
    group,
    replacements,
    many,
    raw,
    distinct
  }:{
    id?: number,
    where?:MULTITYPE,
    include?: MULTITYPE,
    pagination?: MULTITYPE,
    attributes?: MULTITYPE,
    count?: boolean,
    order?: MULTITYPE,
    group?: MULTITYPE,
    replacements?: MULTITYPE,
    many?: boolean,
    raw?: boolean,
    distinct?: boolean
  }): Promise<IHttpResponse> {
    const response: IHttpResponse = {}
    try {
      const whereClause: any = {}
      if (id !== undefined) {
        whereClause.id = id
      }
      if (where) {
        Object.assign(whereClause, where)
      }

      const data = many === undefined || many === true ?
        await Users.findAll({ where: whereClause, order, include, ...pagination, attributes, group, replacements, raw }) :
        await Users.findOne({ where: whereClause, include, attributes, raw })
      const totalData = count ? await Users.count({ where: whereClause, include, distinct }) : null
      console.log('[UserInfoQueryExecution] [fetch] success')
      response.statuscode = HttpStatus.OK
      response.status = ResponseStatus.SUCCESS
      response.result = count ?
        {
          data: JSON.parse(JSON.stringify(data)),
          total: totalData
        } :
        JSON.parse(JSON.stringify(data))
      return response
    } catch (error) {
      return this.handleError(error, '[UserInfoQueryExecution] [fetch]', response)
    }
  }

  async update (data:any, where:any, trx?:Transaction): Promise<IHttpResponse> {
    const response: IHttpResponse = {}
    try {
      const updateResponse = await Users.update(data, { where, transaction: trx })
      console.log('[UsersQueryExecution] [update] success')
      response.statuscode = HttpStatus.OK
      response.status = ResponseStatus.SUCCESS
      response.result = updateResponse
      return response
    } catch (error) {
      return this.handleError(error, '[UsersQueryExecution] [update]', response)
    }
  }

  async delete (where: any, trx:Transaction): Promise<IHttpResponse> {
    const response: IHttpResponse = {}
    try {
      const data = await Users.update({ deleted_at: new Date()}, { where, transaction: trx })
      console.log('[UsersQueryExecution] [delete] success')
      response.statuscode = HttpStatus.OK
      response.status = ResponseStatus.SUCCESS
      response.result = data
      return response
    } catch (error) {
      return this.handleError(error, '[UsersQueryExecution] [delete]', response)
    }
  }

  async count (query: any) : Promise<IHttpResponse> {
    const response: IHttpResponse = {}
    try {
      const data = await Users.count({ where: query })
      console.log('[UsersQueryExecution] [count] success')
      response.statuscode = HttpStatus.OK
      response.status = ResponseStatus.SUCCESS
      response.result = data
      return response
    } catch (error) {
      return this.handleError(error, '[UsersQueryExecution] [count]', response)
    }
  }

}
