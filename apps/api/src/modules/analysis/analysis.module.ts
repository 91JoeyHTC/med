import { Module } from '@nestjs/common';
import { AnalysisController } from './analysis.controller';
import { EngineModule } from '../../engine/engine.module';

@Module({
  imports: [EngineModule],
  controllers: [AnalysisController],
})
export class AnalysisModule {}
