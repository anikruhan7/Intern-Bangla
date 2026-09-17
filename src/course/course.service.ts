import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.courseRepo.create(createCourseDto);
    return await this.courseRepo.save(course);
  }

  async findAll(): Promise<Course[]> {
    return await this.courseRepo.find();
  }

  async findOne(id: number): Promise<Course | null> {
    return await this.courseRepo.findOne({ where: { id } });
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);
    if (!course) {
      throw new BadRequestException('Course not found');
    }
    Object.assign(course, updateCourseDto);
    return await this.courseRepo.save(course);
  }

  async remove(id: number): Promise<string> {
    const result = await this.courseRepo.delete(id);
    if (result.affected === 0) {
      return 'Course not found';
    }
    return `Course deleted with id ${id}`;
  }
}
