import { IsOptional, IsString, IsEmail, IsEnum, IsBoolean } from 'class-validator';

export class FilterUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  postal_code?: string;


  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsEnum(['user', 'admin', 'super_admin'])
  role?: 'user' | 'admin' | 'super_admin';

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  // ─────────────────────────────
  // Address fields
  // ─────────────────────────────

  @IsOptional()
  @IsString()
  city?: string;
  
  @IsOptional()
  @IsEnum([
    'home',
    'office',
    'billing',
    'shipping',
    'headquarters',
    'branch',
    'warehouse',
    'remote',
    'registered_office',
    'legal_address',
    'tax_address',
    'operations_center',
    'fulfillment_center',
    'support_center',
    'manufacturing_site',
    'data_center'
  ])
  address_type?: string;

  @IsOptional()
  @IsEnum(['professional', 'business', 'personal'])
  user_type?: string;
}
