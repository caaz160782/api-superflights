import { PartialType } from '@nestjs/mapped-types';
import { UserDTO } from './user.dto';
import { IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDTO extends PartialType(UserDTO) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly name?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly username?: string;
  @ApiProperty()
  @IsOptional()
  @IsEmail()
  readonly email?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly password?: string;
}
