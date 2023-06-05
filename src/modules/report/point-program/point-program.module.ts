import { Module } from '@nestjs/common';
import { PointProgramService } from './point-program.service';
import { PointProgramController } from './point-program.controller';

@Module({
  controllers: [PointProgramController],
  providers: [PointProgramService]
})
export class PointProgramModule {}
