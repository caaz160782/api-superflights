import { PartialType } from '@nestjs/mapped-types';
import { PassengerDTO } from './passenger.dto';
import { IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePassengerDTO extends PartialType(PassengerDTO) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly name?: string;
  @ApiProperty()
  @IsOptional()
  @IsEmail()
  readonly email?: string;
}
