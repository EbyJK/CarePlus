import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePatientDto {
  @ApiProperty({ example: 'Eleanor Vance', description: 'Patient full name' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiPropertyOptional({ example: 45, description: 'Patient age' })
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiPropertyOptional({ example: 'Female', description: 'Gender' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ example: 'O+', description: 'Blood group' })
  @IsOptional()
  @IsString()
  bloodGroup?: string;

  @ApiPropertyOptional({ example: '120/80 mmHg', description: 'Blood pressure' })
  @IsOptional()
  @IsString()
  bloodPressure?: string;

  @ApiPropertyOptional({ example: '98%', description: 'Oxygen level SpO2' })
  @IsOptional()
  @IsString()
  oxygenLevel?: string;

  @ApiPropertyOptional({ example: '72 bpm', description: 'Heart rate' })
  @IsOptional()
  @IsString()
  heartRate?: string;

  @ApiPropertyOptional({ example: '1', description: 'Assigned staff user ID' })
  @IsOptional()
  @IsString()
  assignedStaffId?: string;
}
