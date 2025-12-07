import { Injectable } from '@nestjs/common'
import { IHttpResponse } from '../../interfaces/common/IHttpResponse'
import { FilterUserDto } from './infrastructure/dto/filter-user.dto';
import {Users} from './infrastructure/persistence/models/IUsers'
import { UsersQueryExecution } from './infrastructure/persistence/repositories/user.repository';
import { UserAddress } from './infrastructure/persistence/models/IUserAddresses';

@Injectable()
export class UserService {
    // constructor(private readonly repo: Users) {}

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
}
