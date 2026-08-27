import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './src/users/entities/user.entity';
import { SmsLog } from './src/sms/entities/sms-log.entity';
import { UserAccount } from './src/user-management/entities/user-account.entity';
import { UserAuditAction } from './src/user-management/entities/user-audit-action.entity';
import { UserOtp } from './src/user-management/entities/user-otp.entity';
import { UserManagementRole } from './src/user-management/enums/user-management-role.enum';

async function seed() {
  console.log('Connecting to PostgreSQL database nest_modules...');
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'pgadmin2',
    database: process.env.DB_NAME || 'nest_modules',
    entities: [User, SmsLog, UserAccount, UserAuditAction, UserOtp],
    synchronize: true,
    logging: true,
  });

  await dataSource.initialize();
  console.log('✅ Connected & synchronized PostgreSQL schema successfully!');

  const userAccRepo = dataSource.getRepository(UserAccount);
  const auditRepo = dataSource.getRepository(UserAuditAction);
  const userRepo = dataSource.getRepository(User);

  // Check if admin already exists
  const existingAdmin = await userAccRepo.findOne({ where: { email: 'admin.postgres@example.com' } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('AdminPassword123!', 10);
    const admin = userAccRepo.create({
      email: 'admin.postgres@example.com',
      firstName: 'Postgres',
      lastName: 'Admin',
      phoneNumber: '+14155559999',
      passwordHash,
      role: UserManagementRole.ADMIN,
      isActive: true,
      isVerified: true,
    });
    const savedAdmin = await userAccRepo.save(admin);
    console.log('✅ Created Admin in user_management_accounts:', savedAdmin.email, '(ID:', savedAdmin.id, ')');

    await auditRepo.save({
      userAccount: savedAdmin,
      action: 'USER_CREATED',
      description: `Admin account created for ${savedAdmin.email}`,
      metadata: { role: savedAdmin.role },
    });
  }

  const existingUser = await userAccRepo.findOne({ where: { email: 'user.postgres@example.com' } });
  if (!existingUser) {
    const passwordHash = await bcrypt.hash('UserPassword123!', 10);
    const user = userAccRepo.create({
      email: 'user.postgres@example.com',
      firstName: 'Postgres',
      lastName: 'User',
      phoneNumber: '+14155558888',
      passwordHash,
      role: UserManagementRole.USER,
      isActive: true,
      isVerified: true,
    });
    const savedUser = await userAccRepo.save(user);
    console.log('✅ Created Regular User in user_management_accounts:', savedUser.email, '(ID:', savedUser.id, ')');

    await auditRepo.save({
      userAccount: savedUser,
      action: 'USER_CREATED',
      description: `User account created for ${savedUser.email}`,
      metadata: { role: savedUser.role },
    });
  }

  const existingStandard = await userRepo.findOne({ where: { email: 'standard.postgres@example.com' } });
  if (!existingStandard) {
    const hashedPassword = await bcrypt.hash('StandardPassword123!', 10);
    const stdUser = userRepo.create({
      email: 'standard.postgres@example.com',
      password: hashedPassword,
      firstName: 'Standard',
      lastName: 'Admin',
      role: 'ADMIN' as any,
    });
    const savedStd = await userRepo.save(stdUser);
    console.log('✅ Created Admin in users table:', savedStd.email, '(ID:', savedStd.id, ')');
  }

  console.log('\n--- PostgreSQL Verification Summary ---');
  const accounts = await userAccRepo.find();
  console.log(`user_management_accounts count: ${accounts.length}`);
  console.table(accounts.map(a => ({ id: a.id, email: a.email, role: a.role, firstName: a.firstName, lastName: a.lastName })));

  const users = await userRepo.find();
  console.log(`users count: ${users.length}`);
  console.table(users.map(u => ({ id: u.id, email: u.email, role: u.role, firstName: u.firstName, lastName: u.lastName })));

  const auditLogs = await auditRepo.find();
  console.log(`user_audit_actions count: ${auditLogs.length}`);
  console.table(auditLogs.map(l => ({ id: l.id, action: l.action, description: l.description })));

  await dataSource.destroy();
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
