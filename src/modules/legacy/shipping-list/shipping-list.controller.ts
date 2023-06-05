import { ShippingListDTO } from './shipping-list.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ShippingListService } from './shipping-list.service';
@ApiTags('shipping-list')
@Controller('shipping-list')
export class ShippingListController {
  constructor(private shippingListService: ShippingListService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  report(@Body() data: ShippingListDTO) {
    // return this.shippingListService.report(data);
  }
}
