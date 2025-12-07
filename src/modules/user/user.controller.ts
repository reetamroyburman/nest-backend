import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { IHttpResponse } from '../../interfaces/common/IHttpResponse';
import { UserService } from './user.service';
import { FilterUserDto } from './infrastructure/dto/filter-user.dto';
import { Request, Response } from 'express';

@Controller('user')
export class UserController {

  constructor (private readonly usersService: UserService) {}

 @Get()
  async find(@Query() filters: FilterUserDto, @Req() request: Request, @Res() response: Response) {
     const data = await this.usersService.getUsers(filters);
    return response.status(200).json({
      status: 'SUCCESS',
      statusCode: 200,
      result: data
    });
  }
}
