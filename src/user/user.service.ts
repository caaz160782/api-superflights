import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { IUser } from 'src/common/interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { USER } from 'src/common/models/models';
import { Model, Types } from 'mongoose';
import { UpdateUserDTO } from './dto/ppdate.user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(USER.name) private readonly model: Model<IUser>) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async checkPassword(password: string, passwordDB: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordDB);
  }

  async create(userDTO: UserDTO): Promise<IUser> {
    const hash = await this.hashPassword(userDTO.password);
    const newUser = new this.model({ ...userDTO, password: hash });
    return await newUser.save();
  }

  async findAll(): Promise<IUser[]> {
    return await this.model
      .find()
      .select('-password')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async findOneById(id: string): Promise<IUser> {
    // Validar si el ID es un ObjectId válido
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('El ID proporcionado no es válido');
    }

    const user = await this.model
      .findById(id)
      .select('-password')
      .lean()
      .exec();

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  async update(id: string, userDTO: UpdateUserDTO): Promise<IUser> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('El ID proporcionado no es válido');
    }

    let updateData: Partial<IUser> = { ...userDTO };

    // Hashear la contraseña solo si se proporciona
    if (userDTO.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userDTO.password, salt);
      updateData = { ...updateData, password: hashedPassword };
    }

    const updatedUser = await this.model
      .findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })
      .select('-password')
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
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return { message: 'Usuario eliminado correctamente' };
  }

  async finByUsername(username: string): Promise<IUser> {
    const user = await this.model.findOne({ username });

    if (!user) {
      throw new NotFoundException(`Usuario ${username} no encontrado`);
    }

    return user;
  }
}
