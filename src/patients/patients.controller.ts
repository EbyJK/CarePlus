import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { ReassignPatientDto } from './dto/reassign-patient.dto';
import { SendVitalsReportDto } from './dto/send-vitals-report.dto';
import { UserJwtAuthGuard } from '../user-management/guards/user-jwt-auth.guard';
import { UserManagementRolesGuard } from '../user-management/guards/user-management-roles.guard';
import { UserRoles } from '../user-management/decorators/user-roles.decorator';
import { UserManagementRole } from '../user-management/enums/user-management-role.enum';

@ApiTags('Patients & Vitals Management')
@ApiBearerAuth()
@UseGuards(UserJwtAuthGuard, UserManagementRolesGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) { }

  @Get()
  @ApiOperation({ summary: 'Get patients (Staff receives assigned roster; Admin receives master roster)' })
  findAll(@Req() req: any) {
    const userRole = req.user?.role || 'user';
    const userId = req.user?.id || req.user?.userId;
    return this.patientsService.findAll(userRole, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single patient details' })
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create and assign a new patient' })
  create(@Body() dto: CreatePatientDto, @Req() req: any) {
    return this.patientsService.create(dto, req.user);
  }

  @Patch(':id/reassign')
  @UserRoles(UserManagementRole.ADMIN, UserManagementRole.SUPERADMIN)
  @ApiOperation({ summary: 'Reassign patient to another staff member (Admin only)' })
  reassign(@Param('id') id: string, @Body() dto: ReassignPatientDto) {
    return this.patientsService.reassign(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete patient record' })
  remove(@Param('id') id: string, @Req() req: any) {
    const userRole = req.user?.role || 'user';
    const userId = req.user?.id || req.user?.userId;
    return this.patientsService.remove(id, userRole, userId);
  }

  @Post(':id/send-vitals-report')
  @ApiOperation({ summary: 'Send clinical Vitals PDF Report to doctor email' })
  sendVitalsReport(@Param('id') id: string, @Body() dto: SendVitalsReportDto) {
    return this.patientsService.sendVitalsReport(id, dto);
  }
}
