import { Seed } from './entities/seed.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSeedDto } from './dto/create-seed.dto';
import { UpdateSeedDto } from './dto/update-seed.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Seed)
    private seedRepository: Repository<Seed>,
  ) {}

  async create(createSeedDto: CreateSeedDto): Promise<Seed> {
    const newSeed = this.seedRepository.create(createSeedDto);
    return await this.seedRepository.save(newSeed);
  }

  async findAll(): Promise<Seed[]> {
    return await this.seedRepository.find();
  }

  async findOne(seedId: number): Promise<Seed> {
    const seed = await this.seedRepository.findOne({
      where: { id: seedId },
    });
    if (!seed) {
      throw new NotFoundException(`Seed with ID ${seedId} not found`);
    }
    return seed;
  }

  async update(seedId: number, updateSeedDto: UpdateSeedDto): Promise<Seed> {
    const seed = await this.seedRepository.findOne({
      where: { id: seedId },
    });
    if (!seed) {
      throw new NotFoundException(`Seed with ID ${seedId} not found`);
    }
    Object.assign(seed, updateSeedDto);

    return await this.seedRepository.save(seed);
  }

  async remove(seedId: number): Promise<void> {
    const seed = await this.seedRepository.findOne({
      where: { id: seedId },
    });
    if (!seed) {
      throw new NotFoundException(`Seed with ID ${seedId} not found`);
    }
    await this.seedRepository.remove(seed);
  }
}
