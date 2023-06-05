import { Controller } from '@nestjs/common';
import { PointProgramService } from './point-program.service';

@Controller('point-program')
export class PointProgramController {
  constructor(private readonly pointProgramService: PointProgramService) {}
}
