import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { ModerateUserDto } from './dto/moderate-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User, UserRole, VerificationStatus } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) //Admin
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const fileName = Date.now() + '_' + file.originalname;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|jpeg|png|webp)$/i)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('File type not supported'), false);
        }
      },
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB max for profile images
      },
    }),
  )
  create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createUserDto.profilePictureUrl = file.path;
    }
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) //Admin
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser() requester: User) {
    if (requester.role !== UserRole.ADMIN && requester.id !== id) {
      throw new ForbiddenException('You can only view your own profile');
    }
    return this.usersService.findOne(id);
  }

  @Patch(':id/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) //Admin
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return this.usersService.updateRole(id, updateUserRoleDto.role);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const fileName = Date.now() + '_' + file.originalname;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|jpeg|png|webp)$/i)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('File type not supported'), false);
        }
      },
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB max for profile images
      },
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() requester: User,
  ) {
    if (requester.role !== UserRole.ADMIN && requester.id !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    if (file) {
      updateUserDto.profilePictureUrl = file.path;
    }
    // Email changes always go through /auth/request-email-change +
    // /auth/confirm-email-change instead, so the address is verified
    // before it takes effect - never applied directly from this endpoint.
    delete updateUserDto.email;
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) //Admin
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Patch(':id/warn')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  warn(@Param('id', ParseIntPipe) id: number, @Body() dto: ModerateUserDto) {
    return this.usersService.warn(id, dto.reason);
  }

  @Patch(':id/ban')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  ban(@Param('id', ParseIntPipe) id: number, @Body() dto: ModerateUserDto) {
    return this.usersService.ban(id, dto.reason);
  }

  @Patch(':id/lift-ban')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  liftBan(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.liftBan(id);
  }

  @Patch(':id/resolve-appeal')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  resolveAppeal(
    @Param('id', ParseIntPipe) id: number,
    @Body('approve') approve: boolean,
  ) {
    return this.usersService.resolveAppeal(id, approve);
  }

  @Patch(':id/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  verifyStudent(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.setVerificationStatus(
      id,
      VerificationStatus.VERIFIED,
    );
  }
}
