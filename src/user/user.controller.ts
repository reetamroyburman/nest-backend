import { Controller, Get, Req, Res } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { IApiResponse } from 'src/interfaces/common/IApiResponse';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

  constructor (private readonly usersService: UserService) {}

  @Get()
  async fetchAll ( @Req() request: Request, @Res() response: Response) {
    try {
        // return {
        //     statuscode: 200,
        //     status: 'success',
        //     message: 'Users fetched successfully.',
        //     result: [
        //         {
        //             id: 1,
        //             name: 'John Doe',
        //             email: 'reetam@gmail.com'
        //         }
        //     ]
        // }  

      const fetchAllUsersResponse: IApiResponse = await this.usersService.fetchAll()

      return fetchAllUsersResponse

    } catch (error) {
      console.error('[UserController] [fetch] Some error occurred while fetching users ::', { error })
        return {
            statuscode: 500,
            status: 'error',
            message: 'An error occurred while fetching users.',
            result: null
        }
    }
  }

  @Get('/one')
  async fetchUser ( @Req() request: Request, @Res() response: Response) {
    try {
        // return {
        //     statuscode: 200,
        //     status: 'success',
        //     message: 'Users fetched successfully.',
        //     result: [
        //         {
        //             id: 1,
        //             name: 'John Doe',
        //             email: 'reetam@gmail.com'
        //         }
        //     ]
        // }  

      return this.usersService.fetchOne()


    } catch (error) {
      console.error('[UserController] [fetch] Some error occurred while fetching users ::', { error })
        return {
            statuscode: 500,
            status: 'error',
            message: 'An error occurred while fetching users.',
            result: null
        }
    }
  }
}
