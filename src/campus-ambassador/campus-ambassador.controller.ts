import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CampusAmbassadorService } from './campus-ambassador.service';
import { CreateCampusAmbassadorDto } from './dto/create-campus-ambassador.dto';
import { UpdateCampusAmbassadorDto } from './dto/update-campus-ambassador.dto';
import { CampusAmbassador } from './entities/campus-ambassador.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../user/entities/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('campus-ambassador')
export class CampusAmbassadorController {
  constructor(private readonly service: CampusAmbassadorService) {}

  @Post()
  create(@Body() dto: CreateCampusAmbassadorDto): Promise<CampusAmbassador> {
    return this.service.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll(): Promise<CampusAmbassador[]> {
    return this.service.findAll();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCampusAmbassadorDto,
  ): Promise<CampusAmbassador> {
    return this.service.update(id, dto);
  }
}
