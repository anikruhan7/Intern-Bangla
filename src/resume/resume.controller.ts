import {
  Controller,
  Post,
  UseInterceptors,
  BadRequestException,
  ForbiddenException,
  Body,
  UploadedFile,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ResumeService } from './resume.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Resume } from './entities/resume.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User, UserRole } from '../user/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const fileName = Date.now() + '_' + file.originalname;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(pdf)$/)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException('file not satisfied the accepted types'),
            false,
          );
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  createResume(
    @Body() createResumeDto: CreateResumeDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ): Promise<Resume> {
    if (!file) {
      throw new BadRequestException('A PDF file is required');
    }
    return this.resumeService.createResume(createResumeDto, file, user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.HR)
  getAllResumes(): Promise<Resume[]> {
    return this.resumeService.getAllResumes();
  }

  @Get('mine')
  getMyResumes(@GetUser() user: User): Promise<Resume[]> {
    return this.resumeService.getResumesForStudent(user.id);
  }

  @Get(':id')
  async getResumeById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Resume | null> {
    const resume = await this.resumeService.getResumeById(id);
    const isOwner = resume?.student?.id === user.id;
    const canView = isOwner || user.role === UserRole.ADMIN || user.role === UserRole.HR;
    if (!canView) {
      throw new ForbiddenException('You cannot view this resume');
    }
    return resume;
  }

  @Patch(':id')
  async updateResume(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateResumeDto: UpdateResumeDto,
    @GetUser() user: User,
  ): Promise<Resume> {
    const resume = await this.resumeService.getResumeById(id);
    const isOwner = resume?.student?.id === user.id;
    if (!isOwner && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only edit your own resume');
    }
    return this.resumeService.updateResume(id, updateResumeDto);
  }

  @Delete(':id')
  async deleteResume(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<string> {
    const resume = await this.resumeService.getResumeById(id);
    const isOwner = resume?.student?.id === user.id;
    if (!isOwner && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own resume');
    }
    return this.resumeService.deleteResume(id);
  }
}
