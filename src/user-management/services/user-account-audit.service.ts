import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAuditAction } from '../entities/user-audit-action.entity';

@Injectable()
export class UserAccountAuditService {
  private readonly logger = new Logger(UserAccountAuditService.name);

  constructor(
    @InjectRepository(UserAuditAction)
    private readonly auditRepository: Repository<UserAuditAction>,
  ) {}

  async logAction(options: {
    userAccountId?: number | null;
    action: string;
    description?: string;
    metadata?: Record<string, any>;
    ipAddress?: string | null;
  }): Promise<UserAuditAction> {
    try {
      const log = this.auditRepository.create({
        userAccountId: options.userAccountId ?? null,
        action: options.action,
        module: 'UserManagement',
        description: options.description ?? '',
        metadata: options.metadata ?? null,
        ipAddress: options.ipAddress ?? null,
      });

      return await this.auditRepository.save(log);
    } catch (error) {
      this.logger.error(`Failed to log audit action: ${options.action}`, error);
      return this.auditRepository.create(options);
    }
  }

  async getAuditLogsForUser(
    userAccountId: number,
    limit = 20,
    skip = 0,
  ): Promise<[UserAuditAction[], number]> {
    return this.auditRepository.findAndCount({
      where: { userAccountId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip,
    });
  }
}
