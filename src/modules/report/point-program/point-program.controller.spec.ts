import { Test, TestingModule } from '@nestjs/testing';
import { PointProgramController } from './point-program.controller';
import { PointProgramService } from './point-program.service';

describe('PointProgramController', () => {
  let controller: PointProgramController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointProgramController],
      providers: [PointProgramService],
    }).compile();

    controller = module.get<PointProgramController>(PointProgramController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
