import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class TransactionMonitorDTO {
  @ApiProperty()
  @IsNotEmpty()
  storeInfoId: string;

  @ApiProperty()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty()
  @IsNotEmpty()
  type: 'Ventas' | 'Devoluciones';
}
