import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './users/entities/user.entity';
import { SmsLog } from './sms/entities/sms-log.entity';
import { Patient } from './patients/entities/patient.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'nest_modules_db',
  entities: [User, SmsLog, Patient],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
