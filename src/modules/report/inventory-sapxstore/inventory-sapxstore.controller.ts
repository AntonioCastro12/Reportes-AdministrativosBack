import { InventorySapxstoreService } from './inventory-sapxstore.service';
import { InventorySapxstoreDTO } from './inventory-sapxstore.dto';
import { ValidationPipe } from './../../../shared/pipes/validation.pipe';
import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';

@ApiTags('inventory-sapxstore')
@Controller('inventory-sapxstore')
export class InventorySapxstoreController {
  constructor(private inventorySapxstoreService: InventorySapxstoreService) { }

  @Post()
  @UsePipes(new ValidationPipe())
  report(@Body() data: InventorySapxstoreDTO) {
    // return this.inventorySapxstoreService.report(data);
  }
}
