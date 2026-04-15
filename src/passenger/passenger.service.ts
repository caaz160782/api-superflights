import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IPassenger } from 'src/common/interfaces/passenger.interface';
import { PASSENGER } from 'src/common/models/models';
import { PassengerDTO } from './dto/passenger.dto';
import { UpdatePassengerDTO } from './dto/update.passenger.dto';

@Injectable()
export class PassengerService {

    constructor(@InjectModel(PASSENGER.name) private readonly model:Model<IPassenger>){}

    async create(passangerDTO: PassengerDTO):Promise<IPassenger>{
      const newPassanger = new this.model(passangerDTO);
      return await newPassanger.save();
    }

    async findAll(): Promise<IPassenger[]> {
       return await this.model
             .find()
             .sort({ createdAt: -1 })
             .lean()
             .exec();
    }

    async findOneById(id: string): Promise<IPassenger> {
        // Validar si el ID es un ObjectId válido
        if (!Types.ObjectId.isValid(id)) {
          throw new BadRequestException('El ID proporcionado no es válido');
        }
    
        const passanger = await this.model
          .findById(id)        
          .lean()
          .exec();
    
        if (!passanger) {
          throw new NotFoundException(`Passanger con ID ${id} no encontrado`);
        }
    
        return passanger;
     }

    async update(id: string, passangerDTO: UpdatePassengerDTO): Promise<IPassenger> {
             if (!Types.ObjectId.isValid(id)) {
                 throw new BadRequestException('El ID proporcionado no es válido');
             }
     
             let updateData: Partial<IPassenger> = { ...passangerDTO };
     
             const updatedPassenger = await this.model
                 .findByIdAndUpdate(id, updateData, {
                 new: true,
                 runValidators: true,
                 })               
                 .exec();
     
             if (!updatedPassenger) {
                 throw new NotFoundException(`Passenger con ID ${id} no encontrado`);
             }
     
             return updatedPassenger;
    }

    async delete(id: string): Promise<{ message: string }> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('El ID proporcionado no es válido');
        }

        const result = await this.model.deleteOne({ _id: id }).exec();

        if (result.deletedCount === 0) {
            throw new NotFoundException(`Passanger con ID ${id} no encontrado`);
        }

        return { message: 'Passanger eliminado correctamente' };
    }
}
