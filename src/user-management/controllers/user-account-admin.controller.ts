import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserAccountAdminService } from '../services/user-account-admin.service';
import { UserAccountAuditService } from '../services/user-account-audit.service';
import { CreateUserAccountDto } from '../dto/create-user-account.dto';
import { UpdateUserAccountDto } from '../dto/update-user-account.dto';
import { UserPaginationQueryDto } from '../dto/user-pagination-query.dto';
import { UserJwtAuthGuard } from '../guards/user-jwt-auth.guard';
import { UserManagementRolesGuard } from '../guards/user-management-roles.guard';
import { UserRoles } from '../decorators/user-roles.decorator';
import { UserManagementRole } from '../enums/user-management-role.enum';
import { CurrentAccount } from '../decorators/current-account.decorator';
import { UserAccount } from '../entities/user-account.entity';

@ApiTags('User Management Admin API')
@ApiBearerAuth()
@UseGuards(UserJwtAuthGuard, UserManagementRolesGuard)
@Controller('user-management/users')
export class UserAccountAdminController {
  constructor(
    private readonly adminService: UserAccountAdminService,
    private readonly auditService: UserAccountAuditService,
  ) {}

  @ApiOperation({ summary: 'Create user account (Admin / Superadmin)' })
  @Post()
  @UserRoles(UserManagementRole.SUPERADMIN, UserManagementRole.ADMIN)
  async create(
    @Body() dto: CreateUserAccountDto,
    @CurrentAccount() adminAccount: UserAccount,
  ) {
    const user = await this.adminService.create(dto, adminAccount);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User account created successfully',
      data: user,
    };
  }

  @ApiOperation({ summary: 'List user accounts with pagination & filters' })
  @Get()
  @UserRoles(UserManagementRole.SUPERADMIN, UserManagementRole.ADMIN)
  async findAll(@Query() query: UserPaginationQueryDto) {
    const [users, total] = await this.adminService.findAll(query);
    return {
      statusCode: HttpStatus.OK,
      message: 'User accounts retrieved successfully',
      data: users,
      meta: {
        total,
        page: Math.floor((query.skip || 0) / (query.limit || 10)) + 1,
        limit: query.limit || 10,
      },
    };
  }

  @ApiOperation({ summary: 'Get single user account by ID' })
  @Get(':id')
  @UserRoles(UserManagementRole.SUPERADMIN, UserManagementRole.ADMIN)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.adminService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User details fetched successfully',
      data: user,
    };
  }

  @ApiOperation({ summary: 'Update user account profile or role' })
  @Patch(':id')
  @UserRoles(UserManagementRole.SUPERADMIN, UserManagementRole.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserAccountDto,
    @CurrentAccount() adminAccount: UserAccount,
  ) {
    const user = await this.adminService.update(id, dto, adminAccount);
    return {
      statusCode: HttpStatus.OK,
      message: 'User account updated successfully',
      data: user,
    };
  }

  @ApiOperation({ summary: 'Activate or deactivate user account' })
  @Patch(':id/status')
  @UserRoles(UserManagementRole.SUPERADMIN, UserManagementRole.ADMIN)
  async toggleActive(
    @Param('id', ParseIntPipe) id: number,
    @Body('isActive') isActive: boolean,
    @CurrentAccount() adminAccount: UserAccount,
  ) {
    const user = await this.adminService.toggleActive(id, isActive, adminAccount);
    return {
      statusCode: HttpStatus.OK,
      message: `User status changed to ${isActive ? 'active' : 'inactive'}`,
      data: user,
    };
  }

  @ApiOperation({ summary: 'Soft delete user account' })
  @Delete(':id')
  @UserRoles(UserManagementRole.SUPERADMIN, UserManagementRole.ADMIN)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentAccount() adminAccount: UserAccount,
  ) {
    await this.adminService.remove(id, adminAccount);
    return {
      statusCode: HttpStatus.OK,
      message: 'User account soft deleted successfully',
    };
  }

  @ApiOperation({ summary: 'Get user account audit logs' })
  @Get(':id/audit-logs')
  @UserRoles(UserManagementRole.SUPERADMIN, UserManagementRole.ADMIN)
  async getAuditLogs(@Param('id', ParseIntPipe) id: number) {
    const logs = await this.auditService.getAuditLogsForUser(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User audit logs retrieved successfully',
      data: logs,
    };
  }
}
