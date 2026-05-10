import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { IHttpResponse } from '../../interfaces/common/IHttpResponse'
import { FilterUserDto } from './infrastructure/dto/filter-user.dto';
import {Users} from './infrastructure/persistence/models/IUsers'
import { UsersQueryExecution } from './infrastructure/persistence/repositories/user.repository';
import { UserAddress } from './infrastructure/persistence/models/IUserAddresses';
import { LoginUserDto } from './infrastructure/dto/login-user.dto';
import { RegisterUserDto } from './infrastructure/dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UserService {

  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCK_TIME_MINUTES = 30;
  // constructor(private readonly repo: Users) {}
  constructor(
  private readonly mailService: MailService,
) {}

  async getUsers(filters: FilterUserDto) {
    const whereUser: any = {};
    const whereAddress: any = {};

    if (filters.email) whereUser.email = filters.email;
    if (filters.phone_number) whereUser.phone_number = filters.phone_number;
    if (filters.username) whereUser.username = filters.username;
    if (filters.first_name) whereUser.first_name = filters.first_name;
    if (filters.last_name) whereUser.last_name = filters.last_name;
    if (filters.role) whereUser.role = filters.role;
    if (filters.is_active !== undefined) whereUser.is_active = filters.is_active;

    // Address filters
    if (filters.country) whereAddress.country = filters.country;
    if (filters.state) whereAddress.state = filters.state;
    if (filters.city) whereAddress.city = filters.city;
    if (filters.postal_code) whereAddress.postal_code = filters.postal_code;
    if (filters.address_type) whereAddress.address_type = filters.address_type;
    if (filters.user_type) whereAddress.user_type = filters.user_type;

        const hasAddressFilters = Object.keys(whereAddress).length > 0;

    return Users.findAll({
      where: whereUser,
      include: [
        {
          model: UserAddress,
          as: 'user_addresses',
          where: hasAddressFilters ? whereAddress : undefined,
          required: hasAddressFilters, // Makes INNER JOIN only if address filters exist
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async register(body: RegisterUserDto) {

    const existingUser = await Users.findOne({
      where: {
        email: body.email,
      },
    });

    if (existingUser) {
      throw new BadRequestException(
        'Email already exists'
      );
    }

    const hashedPassword = await bcrypt.hash(
      body.password,
      10
    );

    const user = await Users.create({
      first_name: body.first_name,
      last_name: body.last_name,
      username: body.username,
      email: body.email,
      phone_number: body.phone_number,
      password_hash: hashedPassword,
      role: 'user',
    } as any);

    return {
      id: user.getDataValue('id'),
      email: user.getDataValue('email'),
      username: user.getDataValue('username'),
    };
  }

  async login(body: LoginUserDto) {

    const user: any = await Users.findOne({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password'
      );
    }

    // Check account lock
    if (
      user.account_locked_until &&
      new Date(user.account_locked_until) > new Date()
    ) {
      throw new UnauthorizedException(
        'Account locked for 30 minutes due to multiple failed login attempts'
      );
    }

    const isPasswordValid = await bcrypt.compare(
      body.password,
      user.password_hash
    );

    // Wrong password
    if (!isPasswordValid) {

      console.log("user", user.failed_login_attempts)

      const attempts =
        (user.failed_login_attempts || 0) + 1;

      // Lock account
      if (attempts >= this.MAX_LOGIN_ATTEMPTS) {

        const lockUntil = new Date();

        lockUntil.setMinutes(
          lockUntil.getMinutes() +
            this.LOCK_TIME_MINUTES
        );

        await user.update({
          failed_login_attempts: 0,
          account_locked_until: lockUntil,
        });

          // Send alert email
        await this.mailService.sendAccountLockedEmail(
          user.email,
          user.first_name,
        );

        throw new UnauthorizedException(
          'Too many failed attempts. Account locked for 30 minutes.'
        );
      }

      await user.update({
        failed_login_attempts: attempts,
      });

      console.log('attempts', attempts);

      throw new UnauthorizedException(
        `Invalid email or password. ${
          this.MAX_LOGIN_ATTEMPTS - attempts
        } attempts remaining.`
      );
    }

    // Success login
    await user.update({
      failed_login_attempts: 0,
      account_locked_until: null,
    });

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'SECRET_KEY',
      {
        expiresIn: '1d',
      }
    );

    return {
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      },
    };
  }

}
