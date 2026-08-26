import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { removeFileFromDisk } from './config/avatar-storage.config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const saved = await this.userRepository.save(user);
    delete saved.password;
    return saved;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    const updated = await this.userRepository.save(user);
    delete updated.password;
    return updated;
  }

  async uploadAvatar(id: string, file?: Express.Multer.File): Promise<User> {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const user = await this.findOne(id);

    // If user already has an existing avatar, clean up old file from disk
    if (user.avatarUrl) {
      removeFileFromDisk(user.avatarUrl);
    }

    const relativeAvatarUrl = `/uploads/avatars/${file.filename}`;
    user.avatarUrl = relativeAvatarUrl;

    const updated = await this.userRepository.save(user);
    delete updated.password;
    return updated;
  }

  async removeAvatar(id: string): Promise<User> {
    const user = await this.findOne(id);

    if (user.avatarUrl) {
      removeFileFromDisk(user.avatarUrl);
      user.avatarUrl = null;
      await this.userRepository.save(user);
    }

    delete user.password;
    return user;
  }

  async remove(id: string): Promise<{ message: string }> {
    const user = await this.findOne(id);
    if (user.avatarUrl) {
      removeFileFromDisk(user.avatarUrl);
    }
    await this.userRepository.remove(user);
    return { message: `User with ID ${id} deleted successfully` };
  }
}
