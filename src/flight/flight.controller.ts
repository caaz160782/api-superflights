import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FlightDTO } from './dto/flight.dto';
import { FlightService } from './flight.service';
import { PassengerService } from 'src/passenger/passenger.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAutHGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('flight')
@ApiBearerAuth()
@UseGuards(JwtAutHGuard)
@Controller('api/v1/flight')
export class FlightController {
  constructor(
    private readonly flightService: FlightService,
    private readonly passengerService: PassengerService,
  ) {}
  @Post()
  create(@Body() flightDTO: FlightDTO) {
    return this.flightService.create(flightDTO);
  }

  @Post(':flightId/passenger/:passsengerId')
  async addPassenger(
    @Param('flightId') flightId: string,
    @Param('passsengerId') passsengerId: string,
  ) {
    const passanger = await this.passengerService.findOneById(passsengerId);
    if (!passanger)
      throw new HttpException('Passsenger NOT FOUND', HttpStatus.NOT_FOUND);

    return this.flightService.addPassenger(flightId, passsengerId);
  }

  @Get()
  finAll() {
    return this.flightService.findAll();
  }

  @Get(':id')
  async findOneById(@Param('id') id: string) {
    return this.flightService.findOneById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() flightDTO: FlightDTO) {
    return this.flightService.update(id, flightDTO);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.flightService.delete(id);
  }
}
