import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User, UserRole } from '../user/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  @Roles(UserRole.STUDENT) //Student
  createApplication(@Body() dto: CreateApplicationDto, @GetUser() user: User) {
    return this.applicationService.createApplication(dto, user.id);
  }

  @Get('mine')
  @Roles(UserRole.STUDENT) //Student
  findMine(@GetUser() user: User) {
    return this.applicationService.findMineForStudent(user.id);
  }

  @Get()
  @Roles(UserRole.HR, UserRole.ADMIN) //HR //Admin
  findAllApplications(@GetUser() user: User) {
    return this.applicationService.findAllApplications(user);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.applicationService.findByIdForViewer(id, user);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.HR) //Admin //HR
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateApplicationDto,
    @GetUser() user: User,
  ) {
    return this.applicationService.updateStatus(dto, id, user);
  }

  @Delete(':id')
  @Roles(UserRole.STUDENT) //Student
  deleteApplication(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return this.applicationService.removeApplication(id, user.id);
  }
}
