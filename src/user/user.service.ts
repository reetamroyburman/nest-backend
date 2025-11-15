import { Injectable } from '@nestjs/common'
import { IApiResponse } from 'src/interfaces/common/IApiResponse'

@Injectable()
export class UserService {

    async fetchAll() : Promise<IApiResponse>{
        const response: IApiResponse = {}
        try {

            response.statuscode = 200
            response.status = 'success'
            response.result = [
                    {
                        id: 1,
                        name: 'John Doe',
                        email: 'reetam@gmail.com'
                    }
                ]
            return response
        } catch (error) {
            console.error('[UserService] [fetchAll] Some error occurred while fetching users ::', { error })
            throw new Error('An error occurred while fetching users.')
        }
    }

    fetchOne () {
        return 'Hello World!';
  }
}
