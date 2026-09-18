import { IsArray, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

// Deliberately no studentId here - a resume always belongs to whoever is
// authenticated when it's created (see ResumeController), never a
// client-supplied id, or any student could attach a resume to someone else.
export class CreateResumeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  skills?: string[];
}
