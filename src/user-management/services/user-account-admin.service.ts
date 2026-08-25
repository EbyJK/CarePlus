import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserAccount } from '../entities/user-account.entity';
import { CreateUserAccountDto } from '../dto/create-user-account.dto';
import { UpdateUserAccountDto } from '../dto/update-user-account.dto';
import { UserPaginationQueryDto } from '../dto/user-pagination-query.dto';
import { UserAccountAuditService } from './user-account-audit.service';
import { UserManagementRole } from '../enums/user-management-role.enum';

@Injectable()
export class UserAccountAdminService {
  constructor(
    @InjectRepository(UserAccount)
    private readonly userRepository: Repository<UserAccount>,
    private readonly auditService: UserAccountAuditService,
  ) {}

  async create(
    dto: CreateUserAccountDto,
    performedByUserId?: number,
  ): Promise<UserAccount> {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = this.userRepository.create({
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phoneNumber: dto.phoneNumber || null,
      passwordHash,
      role: dto.role || UserManagementRole.USER,
      isActive: true,
      isVerified: true,
    });

    const savedUser = await this.userRepository.save(user);

    await this.auditService.logAction({
      userAccountId: performedByUserId || savedUser.id,
      action: 'USER_CREATED',
      description: `User account created for ${savedUser.email}`,
      metadata: { targetUserId: savedUser.id, role: savedUser.role },
    });

    delete (savedUser as any).passwordHash;
    return savedUser;
  }

  async findAll(
    query: UserPaginationQueryDto,
  ): Promise<[UserAccount[], number]> {
    const { skip = 0, limit = 10, search, role } = query;

    const qb = this.userRepository
      .createQueryBuilder('user')
      .where('user.isDeleted = :isDeleted', { isDeleted: false });

    if (search) {
      qb.andWhere(
        '(LOWER(user.firstName) LIKE LOWER(:search) OR LOWER(user.lastName) LIKE LOWER(:search) OR LOWER(user.email) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    if (role) {
      qb.andWhere('user.role = :role', { role });
    }

    qb.orderBy('user.createdAt', 'DESC')
      .skip(Number(skip))
      .take(Number(limit));

    return qb.getManyAndCount();
  }

  async findOne(id: number): Promise<UserAccount> {
    const user = await this.userRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!user) {
      throw new NotFoundException(`User with ID #${id} not found`);
    }

    return user;
  }

  async update(
    id: number,
    dto: UpdateUserAccountDto,
    performedByUserId?: number,
  ): Promise<UserAccount> {
    const user = await this.findOne(id);

    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Email address is already in use');
      }
      user.email = dto.email;
    }

    if (dto.firstName !== undefined) user.firstName = dto.firstName;
    if (dto.lastName !== undefined) user.lastName = dto.lastName;
    if (dto.phoneNumber !== undefined) user.phoneNumber = dto.phoneNumber;
    if (dto.role !== undefined) user.role = dto.role;
    if (dto.isActive !== undefined) user.isActive = dto.isActive;

    const updatedUser = await this.userRepository.save(user);

    await this.auditService.logAction({
      userAccountId: performedByUserId || id,
      action: 'USER_UPDATED',
      description: `Updated profile details for user #${id}`,
      metadata: { targetUserId: id, updatedFields: Object.keys(dto) },
    });

    return updatedUser;
  }

  async toggleActive(
    id: number,
    isActive: boolean,
    performedByUserId?: number,
  ): Promise<UserAccount> {
    const user = await this.findOne(id);
    user.isActive = isActive;
    const updated = await this.userRepository.save(user);

    await this.auditService.logAction({
      userAccountId: performedByUserId || id,
      action: isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
      description: `User account #${id} ${isActive ? 'activated' : 'deactivated'}`,
      metadata: { targetUserId: id, isActive },
    });

    return updated;
  }

  async remove(id: number, performedByUserId?: number): Promise<boolean> {
    const user = await this.findOne(id);

    user.isDeleted = true;
    user.isActive = false;
    user.deletedAt = new Date();

    await this.userRepository.save(user);

    await this.auditService.logAction({
      userAccountId: performedByUserId || id,
      action: 'USER_SOFT_DELETED',
      description: `Soft deleted user account #${id}`,
      metadata: { targetUserId: id },
    });

    return true;
  }
}
