import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { UserManagementRole } from '../enums/user-management-role.enum';
import { UserAuditAction } from './user-audit-action.entity';

@Entity('user_management_accounts')
export class UserAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: 255, nullable: false, select: false })
  passwordHash: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: UserManagementRole.USER,
  })
  role: UserManagementRole;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'integer', default: 0 })
  failedLoginAttempts: number;

  @Column({ nullable: true })
  lockedUntil: Date | null;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  refreshTokenHash: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => UserAuditAction, (log) => log.userAccount)
  auditLogs: UserAuditAction[];
}
