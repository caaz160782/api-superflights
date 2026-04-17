import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { PassengerDTO } from './dto/passenger.dto';
import { UpdatePassengerDTO } from './dto/update.passenger.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('passenger')
@Controller('api/v1/passenger')
export class PassengerController {
  constructor(private readonly passengerService: PassengerService) {}

  @Post()
  create(@Body() passangerDTO: PassengerDTO) {
    return this.passengerService.create(passangerDTO);
  }

  @Get()
  finAll() {
    return this.passengerService.findAll();
  }

  @Get(':id')
  async findOneById(@Param('id') id: string) {
    return this.passengerService.findOneById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() passangerDTO: UpdatePassengerDTO,
  ) {
    return this.passengerService.update(id, passangerDTO);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.passengerService.delete(id);
  }
}
