import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnalysisModule } from './modules/analysis/analysis.module';
import { ChartsModule } from './modules/charts/charts.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    AnalysisModule,
    ChartsModule,
  ],
})
export class AppModule {}
