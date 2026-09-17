import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { CourseDomain } from '../../common/enums/course-domain.enum';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsEnum(CourseDomain)
  domain: CourseDomain;

  @IsString()
  summary: string;

  @IsInt()
  @Min(1)
  durationWeeks: number;

  @IsOptional()
  @IsBoolean()
  isFree?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString({ each: true })
  curriculum?: string[];
}
