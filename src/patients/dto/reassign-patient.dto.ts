import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReassignPatientDto {
  @ApiProperty({ example: 'uuid-string', description: 'Target Staff user ID to assign this patient to' })
  @IsString()
  @IsNotEmpty()
  staffId: string;
}
