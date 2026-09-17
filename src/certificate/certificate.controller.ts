import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { Certificate } from './entities/certificate.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../user/entities/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';

@Controller('certificate')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateCertificateDto): Promise<Certificate> {
    return this.certificateService.create(dto);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  findMine(@Request() req: AuthenticatedRequest): Promise<Certificate[]> {
    return this.certificateService.findMine(req.user.id);
  }

  @Get('verify/:certificateNumber')
  verify(
    @Param('certificateNumber') certificateNumber: string,
  ): Promise<Certificate | null> {
    return this.certificateService.verify(certificateNumber);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCertificateDto,
  ): Promise<Certificate> {
    return this.certificateService.update(id, dto);
  }
}
