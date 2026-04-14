import { PartialType } from '@nestjs/mapped-types';
import { UserDTO } from './user.dto';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateUserDTO extends PartialType(UserDTO) {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly username?: string;

  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @IsString()
  readonly password?: string;
}