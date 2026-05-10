import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { IHttpResponse } from '../../interfaces/common/IHttpResponse';
import { UserService } from './user.service';
import { FilterUserDto } from './infrastructure/dto/filter-user.dto';
import { Request, Response } from 'express';
import { RegisterUserDto } from './infrastructure/dto/register-user.dto';
import { LoginUserDto } from './infrastructure/dto/login-user.dto';

@Controller('user')
export class UserController {

  constructor (private readonly usersService: UserService) {}

  @Post('register')
  async register(
    @Body() body: RegisterUserDto,
    @Res() response: Response
  ) {

    const result = await this.usersService.register(body);

    return response.status(201).json({
      status: 'SUCCESS',
      statusCode: 201,
      result,
    });
  }

    @Post('/login')
  async login(
    @Body() body: LoginUserDto,
    @Res() response: Response
  ) {

    const result = await this.usersService.login(body);

    return response.status(200).json({
      status: 'SUCCESS',
      statusCode: 200,
      result,
    });
  }


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
