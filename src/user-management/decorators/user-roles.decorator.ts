import { SetMetadata } from '@nestjs/common';
import { UserManagementRole } from '../enums/user-management-role.enum';

export const USER_ROLES_KEY = 'user_management_roles';
export const UserRoles = (...roles: UserManagementRole[]) =>
  SetMetadata(USER_ROLES_KEY, roles);
