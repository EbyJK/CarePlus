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

@ApiTags('2. User Management - Admin')
@ApiBearerAuth()
@Controller('user-management/users')
@UseGuards(UserJwtAuthGuard, UserManagementRolesGuard)
export class UserAccountAdminController {
  constructor(
    private readonly adminService: UserAccountAdminService,
    private readonly auditService: UserAccountAuditService,
  ) {}

  @ApiOperation({ summary: 'Create a new user account (Admin only)' })
  @Post()
  @UserRoles(UserManagementRole.SUPERADMIN, UserManagementRole.ADMIN)
  async create(
    @Body() dto: CreateUserAccountDto,
    @CurrentAccount('id') adminId: number,
  ) {
    const user = await this.adminService.create(dto, adminId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User account created successfully',
      data: user,
    };
  }

  @ApiOperation({ summary: 'List all users with pagination and search' })
  @Get()
  @UserRoles(
    UserManagementRole.SUPERADMIN,
    UserManagementRole.ADMIN,
    UserManagementRole.SUPERVISOR,
  )
  async findAll(@Query() query: UserPaginationQueryDto) {
    const [users, total] = await this.adminService.findAll(query);
    return {
      statusCode: HttpStatus.OK,
      message: 'User list fetched successfully',
      data: users,
      pagination: {
        total,
        limit: Number(query.limit || 10),
        skip: Number(query.skip || 0),
      },
    };
  }

  @ApiOperation({ summary: 'Get user details by ID' })
  @Get(':id')
  @UserRoles(
    UserManagementRole.SUPERADMIN,
    UserManagementRole.ADMIN,
    UserManagementRole.SUPERVISOR,
  )
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
    @CurrentAccount('id') adminId: number,
  ) {
    const user = await this.adminService.update(id, dto, adminId);
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
    @CurrentAccount('id') adminId: number,
  ) {
    const user = await this.adminService.toggleActive(id, isActive, adminId);
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
    @CurrentAccount('id') adminId: number,
  ) {
    await this.adminService.remove(id, adminId);
    return {
      statusCode: HttpStatus.OK,
      message: 'User account soft deleted successfully',
      data: null,
    };
  }

  @ApiOperation({ summary: 'Get user action audit logs' })
  @Get(':id/audit-logs')
  @UserRoles(UserManagementRole.SUPERADMIN, UserManagementRole.ADMIN)
  async getAuditLogs(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit') limit = 20,
    @Query('skip') skip = 0,
  ) {
    const [logs, total] = await this.auditService.getAuditLogsForUser(
      id,
      Number(limit),
      Number(skip),
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'User audit logs fetched successfully',
      data: logs,
      pagination: { total, limit: Number(limit), skip: Number(skip) },
    };
  }
}
