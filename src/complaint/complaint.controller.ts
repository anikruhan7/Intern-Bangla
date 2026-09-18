import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { ResolveComplaintDto } from './dto/resolve-complaint.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User, UserRole } from '../user/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('complaint')
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  @Post()
  create(@Body() dto: CreateComplaintDto, @GetUser() user: User) {
    return this.complaintService.create(dto, user.id);
  }

  @Get('mine')
  findMine(@GetUser() user: User) {
    return this.complaintService.findMine(user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.complaintService.findAll();
  }

  @Patch(':id/resolve')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  resolve(@Param('id', ParseIntPipe) id: number, @Body() dto: ResolveComplaintDto) {
    return this.complaintService.resolve(id, dto);
  }

  @Patch(':id/dismiss')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  dismiss(@Param('id', ParseIntPipe) id: number, @Body('adminNotes') adminNotes?: string) {
    return this.complaintService.dismiss(id, adminNotes);
  }
}
