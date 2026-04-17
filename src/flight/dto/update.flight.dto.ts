import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateFlightDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly pilot!: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly airplane!: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly destinationCity!: string;
  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly flightDate!: Date;
}
