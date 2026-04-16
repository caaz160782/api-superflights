import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

export class UpdateFlightDTO {
    
    @IsOptional()
    @IsString()
    readonly pilot!: string;    

    @IsOptional()
    @IsString()
    readonly airplane!: string;    

    @IsOptional()
    @IsString()
    readonly destinationCity!: string;    

    @IsOptional()
    @Type(()=>Date)    
    @IsDate()
    readonly flightDate!: Date;    
    
}