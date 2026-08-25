import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserAccount } from './user-account.entity';

@Entity('user_management_audit_actions')
export class UserAuditAction {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'integer', nullable: true })
  userAccountId: number | null;

  @ManyToOne(() => UserAccount, (account) => account.auditLogs, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'userAccountId' })
  userAccount: UserAccount | null;

  @Column({ type: 'varchar', length: 100, nullable: false })
  action: string;

  @Column({ type: 'varchar', length: 100, nullable: false, default: 'UserManagement' })
  module: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-json', nullable: true })
  metadata: Record<string, any> | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ipAddress: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
