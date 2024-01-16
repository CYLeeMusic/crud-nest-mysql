import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from './seed.service';
import { CreateSeedDto } from './dto/create-seed.dto';
import { Seed, SeedType } from './entities/seed.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('SeedService', () => {
  let seedService: SeedService;
  let seedRepository: Repository<Seed>;

  const mockSeedData: Seed[] = [
    {
      id: 1,
      name: 'test seed01 ',
      type: SeedType.FLOWER,
      producer: 'tester',
      origin: 'test',
      availability: true,
      harvestDate: new Date('2023-01-15'),
      growingConditions: ['winter', 'cold', 'wet'],
    },
    {
      id: 2,
      name: 'test seed 02',
      type: SeedType.VEG,
      producer: 'tester',
      origin: 'test',
      availability: true,
      harvestDate: new Date('2023-01-15'),
      growingConditions: ['winter', 'cold', 'wet'],
    },
  ];

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
        id: 3,
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

  describe('findAll', () => {
    it('should return an array of seeds', async () => {
      jest.spyOn(seedRepository, 'find').mockResolvedValue(mockSeedData);

      const result = await seedService.findAll();

      expect(result).toEqual(mockSeedData);
      expect(seedRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a seed data', async () => {
      const targetSeedId = 1;
      const targetSeed: Seed = mockSeedData.find(
        (seed) => seed.id === targetSeedId,
      );
      jest.spyOn(seedRepository, 'findOne').mockResolvedValue(targetSeed);

      const result = await seedService.findOne(targetSeedId);

      expect(result).toEqual(targetSeed);
      expect(seedRepository.findOne).toHaveBeenCalledWith({
        where: { id: targetSeedId },
      });
    });

    it('should throw NotFoundException for non-existing seed', async () => {
      const nonExistingSeedId = 999;
      jest.spyOn(seedRepository, 'findOne').mockResolvedValue(null);

      try {
        await seedService.findOne(nonExistingSeedId);
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual(
          `Seed with ID ${nonExistingSeedId} not found`,
        );
        expect(seedRepository.findOne).toHaveBeenCalledWith({
          where: { id: nonExistingSeedId },
        });
      }
    });
  });
});
