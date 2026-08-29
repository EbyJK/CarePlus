import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ type: 'int', default: 45 })
  age: number;

  @Column({ default: 'Female' })
  gender: string;

  @Column({ default: 'O+' })
  bloodGroup: string;

  @Column({ default: '120/80 mmHg' })
  bloodPressure: string;

  @Column({ default: '98%' })
  oxygenLevel: string;

  @Column({ default: '72 bpm' })
  heartRate: string;

  @Column({ type: 'varchar', nullable: true, default: '1' })
  assignedStaffId: string;

  @Column({ type: 'varchar', nullable: true, default: 'Staff Physician' })
  assignedStaffName: string;

  @Column({ type: 'varchar', nullable: true, default: 'user.postgres@example.com' })
  assignedStaffEmail: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
