import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('user_management_otps')
export class UserOtp {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  otpCode: string;

  @Column({ type: 'varchar', length: 50, default: 'PASSWORD_RESET' })
  purpose: string;

  @Column({ type: 'boolean', default: false })
  isUsed: boolean;

  @Column({ type: 'datetime', nullable: false })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
