import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class InventorySapxstoreDTO {
  @ApiPropertyOptional()
  @IsOptional()
  storeInfoId: string;

  @ApiPropertyOptional()
  @IsOptional()
  year: string;

  @ApiPropertyOptional()
  @IsOptional()
  productId: string;
}
