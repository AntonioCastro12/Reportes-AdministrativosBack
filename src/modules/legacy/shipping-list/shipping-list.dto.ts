import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ShippingListDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  documentType: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  documentId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  storeInfoId: string;
}
