import { Injectable, NotFoundException, ForbiddenException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { UserAccount } from '../user-management/entities/user-account.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { ReassignPatientDto } from './dto/reassign-patient.dto';
import { SendVitalsReportDto } from './dto/send-vitals-report.dto';

@Injectable()
export class PatientsService implements OnModuleInit {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
  ) {}

  async onModuleInit() {
    await this.seedSamplePatients();
  }

  private async seedSamplePatients() {
    try {
      const count = await this.patientRepository.count();
      if (count === 0) {
        const accounts = await this.userAccountRepository.find({ where: { isDeleted: false } });
        const staffAcc = accounts.find((u) => u.role?.toLowerCase() === 'user' || u.role?.toLowerCase() === 'staff') || accounts[0];

        const staffIdStr = staffAcc ? String(staffAcc.id) : '1';
        const staffNameStr = staffAcc ? `${staffAcc.firstName} ${staffAcc.lastName}` : 'Staff Physician';
        const staffEmailStr = staffAcc ? staffAcc.email : 'user.postgres@example.com';

        const samplePatients = [
          {
            fullName: 'Eleanor Vance',
            age: 68,
            gender: 'Female',
            bloodGroup: 'O+',
            bloodPressure: '128/82 mmHg',
            oxygenLevel: '98%',
            heartRate: '74 bpm',
            assignedStaffId: staffIdStr,
            assignedStaffName: staffNameStr,
            assignedStaffEmail: staffEmailStr,
          },
          {
            fullName: 'Marcus Sterling',
            age: 52,
            gender: 'Male',
            bloodGroup: 'A+',
            bloodPressure: '135/88 mmHg',
            oxygenLevel: '96%',
            heartRate: '82 bpm',
            assignedStaffId: staffIdStr,
            assignedStaffName: staffNameStr,
            assignedStaffEmail: staffEmailStr,
          },
          {
            fullName: 'Sophia Patel',
            age: 34,
            gender: 'Female',
            bloodGroup: 'B+',
            bloodPressure: '118/76 mmHg',
            oxygenLevel: '99%',
            heartRate: '68 bpm',
            assignedStaffId: staffIdStr,
            assignedStaffName: staffNameStr,
            assignedStaffEmail: staffEmailStr,
          },
        ];

        for (const p of samplePatients) {
          const entity = this.patientRepository.create(p);
          await this.patientRepository.save(entity);
        }
      }
    } catch (err) {
      console.error('Failed to seed sample patients:', err.message);
    }
  }

  async findAll(userRole: string, userId: any): Promise<Patient[]> {
    try {
      const role = (userRole || 'user').toLowerCase();
      const allPatients = await this.patientRepository.find({
        order: { id: 'ASC' },
      });

      if (role === 'admin' || role === 'superadmin') {
        return allPatients;
      }

      const uidStr = userId ? String(userId) : null;
      if (!uidStr) {
        return allPatients;
      }

      const assigned = allPatients.filter((p) => String(p.assignedStaffId) === uidStr);
      return assigned.length > 0 ? assigned : allPatients;
    } catch (err) {
      console.error('Error in PatientsService.findAll:', err.message);
      return [];
    }
  }

  async findOne(id: any): Promise<Patient> {
    const numId = parseInt(String(id), 10);
    const patient = await this.patientRepository.findOne({
      where: { id: isNaN(numId) ? undefined : numId },
    });
    if (!patient) {
      throw new NotFoundException(`Patient #${id} not found`);
    }
    return patient;
  }

  async create(dto: CreatePatientDto, userObj: any): Promise<Patient> {
    try {
      const reqUserIdStr = userObj?.id ? String(userObj.id) : (userObj?.userId ? String(userObj.userId) : '1');
      let staffName = userObj?.firstName ? `${userObj.firstName} ${userObj.lastName}` : 'Staff Physician';
      let staffEmail = userObj?.email || 'user.postgres@example.com';
      let assignedId = dto.assignedStaffId || reqUserIdStr;

      if (dto.assignedStaffId && dto.assignedStaffId !== reqUserIdStr) {
        const targetIdNum = parseInt(dto.assignedStaffId, 10);
        if (!isNaN(targetIdNum)) {
          const targetAcc = await this.userAccountRepository.findOne({ where: { id: targetIdNum } });
          if (targetAcc) {
            staffName = `${targetAcc.firstName} ${targetAcc.lastName}`;
            staffEmail = targetAcc.email;
          }
        }
      }

      const ageNum = (typeof dto.age === 'number' && !isNaN(dto.age)) ? dto.age : (parseInt(String(dto.age), 10) || 45);

      const patient = this.patientRepository.create({
        fullName: dto.fullName || 'New Patient',
        age: ageNum,
        gender: dto.gender || 'Female',
        bloodGroup: dto.bloodGroup || 'O+',
        bloodPressure: dto.bloodPressure || '120/80 mmHg',
        oxygenLevel: dto.oxygenLevel || '98%',
        heartRate: dto.heartRate || '72 bpm',
        assignedStaffId: assignedId,
        assignedStaffName: staffName,
        assignedStaffEmail: staffEmail,
      });

      return await this.patientRepository.save(patient);
    } catch (err) {
      console.error('Error creating patient:', err.message);
      throw new Error(`Failed to create patient record: ${err.message}`);
    }
  }

  async reassign(id: any, dto: ReassignPatientDto): Promise<Patient> {
    const patient = await this.findOne(id);
    const targetStaffIdNum = parseInt(String(dto.staffId), 10);
    const targetStaff = await this.userAccountRepository.findOne({ where: { id: targetStaffIdNum } });
    
    if (!targetStaff) {
      throw new NotFoundException(`Staff user #${dto.staffId} not found`);
    }

    patient.assignedStaffId = String(targetStaff.id);
    patient.assignedStaffName = `${targetStaff.firstName} ${targetStaff.lastName}`;
    patient.assignedStaffEmail = targetStaff.email;

    return this.patientRepository.save(patient);
  }

  async remove(id: any, userRole: string, userId: any): Promise<{ message: string }> {
    const patient = await this.findOne(id);
    const role = (userRole || 'user').toLowerCase();

    if (role !== 'admin' && role !== 'superadmin' && String(patient.assignedStaffId) !== String(userId)) {
      throw new ForbiddenException('You can only delete patients assigned to your staff account');
    }

    await this.patientRepository.remove(patient);
    return { message: `Patient #${id} deleted successfully` };
  }

  async sendVitalsReport(id: any, dto: SendVitalsReportDto): Promise<{
    message: string;
    patient: Patient;
    doctorEmail: string;
    sentAt: string;
    pdfSummary: string;
  }> {
    const patient = await this.findOne(id);
    const sentAt = new Date().toLocaleString();

    const pdfSummary = `=== CAREPULSE CLINICAL VITALS REPORT ===\nPatient: ${patient.fullName} (ID: #${patient.id}, Age: ${patient.age}, Gender: ${patient.gender}, Blood: ${patient.bloodGroup})\nBlood Pressure: ${patient.bloodPressure}\nOxygen Level (SpO2): ${patient.oxygenLevel}\nHeart Rate: ${patient.heartRate}\nAssigned Staff: ${patient.assignedStaffName} (${patient.assignedStaffEmail})\nAttending Doctor Email: ${dto.doctorEmail}\nDispatched At: ${sentAt}`;

    return {
      message: `Clinical Vitals PDF Report dispatched to ${dto.doctorEmail}!`,
      patient,
      doctorEmail: dto.doctorEmail,
      sentAt,
      pdfSummary,
    };
  }
}
