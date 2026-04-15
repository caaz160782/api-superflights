import { PartialType } from '@nestjs/mapped-types';
import { PassengerDTO } from './passenger.dto';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdatePassengerDTO extends PartialType(PassengerDTO) {
  @IsOptional()
  @IsString()
  readonly name?: string;
  
  @IsOptional()
  @IsEmail()
  readonly email?: string;


}