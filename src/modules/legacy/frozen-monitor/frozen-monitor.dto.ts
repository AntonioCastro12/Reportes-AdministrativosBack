import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FrozenMonitorDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  storeInfoId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  dateSelected: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  invCountId: string;
}
