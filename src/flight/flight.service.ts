import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IFlight } from 'src/common/interfaces/flight.interface';
import { FLIGHT } from 'src/common/models/models';
import { FlightDTO } from './dto/flight.dto';
import { UpdateFlightDTO } from './dto/update.flight.dto';

@Injectable()
export class FlightService {
  constructor(
    @InjectModel(FLIGHT.name) private readonly model: Model<IFlight>,
  ) {}

  async create(flightDTO: FlightDTO): Promise<IFlight> {
    const newFlight = new this.model(flightDTO);
    return await newFlight.save();
  }

  async findAll(): Promise<IFlight[]> {
    return await this.model.find().lean().populate('passengers').exec();
  }

  async findOneById(id: string): Promise<IFlight> {
    // Validar si el ID es un ObjectId válido
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('El ID proporcionado no es válido');
    }

    const flight = await this.model
      .findById(id)
      .lean()
      .populate('passengers')
      .exec();

    if (!flight) {
      throw new NotFoundException(`Flight con ID ${id} no encontrado`);
    }

    return flight;
  }

  async update(id: string, flightDTO: UpdateFlightDTO): Promise<IFlight> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('El ID proporcionado no es válido');
    }

    let updateData: Partial<IFlight> = { ...flightDTO };

    const updatedUser = await this.model
      .findByIdAndUpdate(id, updateData, {
        returnDocument: 'after',
        runValidators: true,
      })
      .populate('passengers')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return updatedUser;
  }

  async delete(id: string): Promise<{ message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('El ID proporcionado no es válido');
    }

    const result = await this.model.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Vuelo con ID ${id} no encontrado`);
    }
    return { message: 'Vuelo eliminado correctamente' };
  }

  async addPassenger(flightId: string, passengerId: string): Promise<IFlight> {
    const flight = await this.model
      .findByIdAndUpdate(
        flightId,
        {
          $addToSet: { passengers: passengerId },
        },
        { returnDocument: 'after', runValidators: true },
      )
      .populate('passengers');

    if (!flight) {
      throw new NotFoundException(`Flight with ID ${flightId} not found`);
    }

    return flight;
  }
}
