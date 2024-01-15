import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from './seed.service';
import { CreateSeedDto } from './dto/create-seed.dto';
import { Seed, SeedType } from './entities/seed.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('SeedService', () => {
  let seedService: SeedService;
  let seedRepository: Repository<Seed>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        {
          provide: getRepositoryToken(Seed),
          useClass: Repository,
        },
      ],
    }).compile();

    seedService = module.get<SeedService>(SeedService);
    seedRepository = module.get<Repository<Seed>>(getRepositoryToken(Seed));
  });

  describe('create', () => {
    it('should create and save a new seed in the database', async () => {
      const createSeedDto: CreateSeedDto = {
        name: 'test seed',
        type: SeedType.FLOWER,
        producer: 'tester',
        origin: 'test',
        availability: true,
        harvestDate: new Date('2023-01-15'),
        growingConditions: ['winter', 'cold', 'wet'],
      };

      const createdSeed: Seed = {
        id: 1,
        ...createSeedDto,
      };

      jest.spyOn(seedRepository, 'create').mockReturnValue(createdSeed);
      jest.spyOn(seedRepository, 'save').mockResolvedValue(createdSeed);

      const result = await seedService.create(createSeedDto);

      expect(result).toEqual(createdSeed);
      expect(seedRepository.create).toHaveBeenCalledWith(createSeedDto);
      expect(seedRepository.save).toHaveBeenCalledWith(createdSeed);
    });
  });
});
