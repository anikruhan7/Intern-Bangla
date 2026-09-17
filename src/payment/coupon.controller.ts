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
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Coupon } from './entities/coupon.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../user/entities/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('coupon')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  create(@Body() createCouponDto: CreateCouponDto): Promise<Coupon> {
    return this.couponService.create(createCouponDto);
  }

  @Get()
  findAll(): Promise<Coupon[]> {
    return this.couponService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCouponDto: UpdateCouponDto,
  ): Promise<Coupon> {
    return this.couponService.update(id, updateCouponDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.couponService.remove(id);
  }
}
