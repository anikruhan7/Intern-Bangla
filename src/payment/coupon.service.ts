import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './entities/coupon.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepo: Repository<Coupon>,
  ) {}

  async create(createCouponDto: CreateCouponDto): Promise<Coupon> {
    const coupon = this.couponRepo.create(createCouponDto);
    return await this.couponRepo.save(coupon);
  }

  async findAll(): Promise<Coupon[]> {
    return await this.couponRepo.find();
  }

  async update(id: number, updateCouponDto: UpdateCouponDto): Promise<Coupon> {
    const coupon = await this.couponRepo.findOne({ where: { id } });
    if (!coupon) {
      throw new BadRequestException('Coupon not found');
    }
    Object.assign(coupon, updateCouponDto);
    return await this.couponRepo.save(coupon);
  }

  async remove(id: number): Promise<string> {
    const result = await this.couponRepo.delete(id);
    if (result.affected === 0) {
      return 'Coupon not found';
    }
    return `Coupon deleted with id ${id}`;
  }
}
