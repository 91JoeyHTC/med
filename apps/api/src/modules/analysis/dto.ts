import { IsArray, IsIn, IsInt, IsOptional, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class NatalDto {
  @IsInt() @Min(1) @Max(12) month!: number;
  @IsInt() @Min(1) @Max(31) day!: number;
}

export class GuardianDto {
  @IsIn(['天', '地', '北', '東', '南', '西']) dir!: string;
  @IsOptional() animal?: string;
  @IsArray() @IsInt({ each: true }) positions!: number[];
}

export class PersonChartDto {
  @IsOptional() nickname?: string;
  @IsOptional() natal?: Record<string, unknown> | null;
  @IsOptional() birth?: { month: number; day: number };
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => GuardianDto)
  guardians?: GuardianDto[];
}

export class AnalyzeDto {
  @IsIn(['personal', 'composite']) type!: 'personal' | 'composite';
  @IsArray() @ValidateNested({ each: true }) @Type(() => PersonChartDto)
  people!: PersonChartDto[];
}
