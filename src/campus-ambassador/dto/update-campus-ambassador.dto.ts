import { IsEnum } from 'class-validator';
import { CampusAmbassadorStatus } from '../entities/campus-ambassador.entity';

export class UpdateCampusAmbassadorDto {
  @IsEnum(CampusAmbassadorStatus)
  status: CampusAmbassadorStatus;
}
