import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class SalesInfoDTO {
  @ApiPropertyOptional()
  @IsOptional()
  storeInfoId: string;

  @ApiPropertyOptional()
  @IsOptional()
  businessDate: string;
}
