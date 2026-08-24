import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SmsStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

@Entity('sms_logs')
export class SmsLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  recipient: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: 'twilio' })
  provider: string;

  @Column({ nullable: true })
  providerMessageId?: string;

  @Column({
    type: 'simple-enum',
    enum: SmsStatus,
    default: SmsStatus.PENDING,
  })
  status: SmsStatus;

  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
