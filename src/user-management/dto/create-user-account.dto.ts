import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserManagementRole } from '../enums/user-management-role.enum';

export class CreateUserAccountDto {
  @ApiProperty({ example: 'admin@example.com', description: 'User email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'Password123!', description: 'Password (min 6 chars)' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({ example: '+14155552671', description: 'Mobile phone number' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ enum: UserManagementRole, default: UserManagementRole.USER, example: UserManagementRole.ADMIN })
  @IsOptional()
  @IsEnum(UserManagementRole)
  role?: UserManagementRole;
}
