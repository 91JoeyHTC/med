import { Module } from '@nestjs/common';
import { ChartsController } from './charts.controller';
import { ChartsService } from './charts.service';
import { AuthModule } from '../auth/auth.module';
import { EngineModule } from '../../engine/engine.module';

@Module({
  imports: [AuthModule, EngineModule],
  controllers: [ChartsController],
  providers: [ChartsService],
})
export class ChartsModule {}
