import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const event = this.eventRepo.create(createEventDto);
    return await this.eventRepo.save(event);
  }

  async findAll(): Promise<Event[]> {
    return await this.eventRepo.find({ order: { startAt: 'ASC' } });
  }

  async findOne(id: number): Promise<Event | null> {
    return await this.eventRepo.findOne({ where: { id } });
  }

  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);
    if (!event) {
      throw new BadRequestException('Event not found');
    }
    Object.assign(event, updateEventDto);
    return await this.eventRepo.save(event);
  }

  async remove(id: number): Promise<string> {
    const result = await this.eventRepo.delete(id);
    if (result.affected === 0) {
      return 'Event not found';
    }
    return `Event deleted with id ${id}`;
  }
}
