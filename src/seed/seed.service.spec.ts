import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from './seed.service';
import { CreateSeedDto } from './dto/create-seed.dto';
import { Seed, SeedType } from './entities/seed.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateSeedDto } from './dto/update-seed.dto';
import { NotFoundException } from '@nestjs/common';

describe('SeedService', () => {
  let seedService: SeedService;
  let seedRepository: Repository<Seed>;

  const targetSeedId = 1;
  const nonExistingSeedId = 999;

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

      await expect(seedService.create(createSeedDto)).resolves.toEqual(
        createdSeed,
      );
      expect(seedRepository.create).toHaveBeenCalledWith(createSeedDto);
      expect(seedRepository.save).toHaveBeenCalledWith(createdSeed);
    });
  });

  describe('findAll', () => {
    it('should return an array of seeds', async () => {
      jest.spyOn(seedRepository, 'find').mockResolvedValue(mockSeedData);

      await expect(seedService.findAll()).resolves.toEqual(mockSeedData);
      expect(seedRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a seed data', async () => {
      const targetSeed: Seed = mockSeedData.find(
        (seed) => seed.id === targetSeedId,
      );

      jest.spyOn(seedRepository, 'findOne').mockResolvedValue(targetSeed);

      await expect(seedService.findOne(targetSeedId)).resolves.toEqual(
        targetSeed,
      );
      expect(seedRepository.findOne).toHaveBeenCalledWith({
        where: { id: targetSeedId },
      });
    });

    it('should throw NotFoundException when finding a non-existing seed', async () => {
      jest.spyOn(seedRepository, 'findOne').mockResolvedValue(null);

      await expect(seedService.findOne(nonExistingSeedId)).rejects.toThrow(
        new NotFoundException(`Seed with ID ${nonExistingSeedId} not found`),
      );
      expect(seedRepository.findOne).toHaveBeenCalledWith({
        where: { id: nonExistingSeedId },
      });
    });
  });

  describe('update', () => {
    const updateSeedDTO: UpdateSeedDto = {
      name: 'updated test seed',
      type: SeedType.FLOWER,
      availability: false,
    };
    const seedToUpdate: Seed = mockSeedData.find(
      (seed) => seed.id === targetSeedId,
    );
    it('should update and return updated seed', async () => {
      jest.spyOn(seedRepository, 'findOne').mockResolvedValue(seedToUpdate);
      jest
        .spyOn(seedRepository, 'save')
        .mockResolvedValue({ ...seedToUpdate, ...updateSeedDTO });

      await expect(
        seedService.update(targetSeedId, updateSeedDTO),
      ).resolves.toMatchObject({
        name: 'updated test seed',
        type: SeedType.FLOWER,
        availability: false,
      });
      expect(seedRepository.findOne).toHaveBeenCalledWith({
        where: { id: targetSeedId },
      });
      expect(seedRepository.save).toHaveBeenCalledWith({
        ...seedToUpdate,
        ...updateSeedDTO,
      });
    });
    it('should throw NotFoundException when updating a non-existing seed', async () => {
      jest.spyOn(seedRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(seedRepository, 'update');

      await expect(
        seedService.update(nonExistingSeedId, { ...updateSeedDTO }),
      ).rejects.toThrow(
        new NotFoundException(`Seed with ID ${nonExistingSeedId} not found`),
      );
      expect(seedRepository.findOne).toHaveBeenCalledWith({
        where: { id: nonExistingSeedId },
      });
      expect(seedRepository.update).not.toHaveBeenCalledWith({
        id: nonExistingSeedId,
      });
    });
  });

  describe('delete', () => {
    it('should delete a seed data', async () => {
      jest.spyOn(seedRepository, 'findOne').mockResolvedValue({
        id: targetSeedId,
      } as Seed);
      jest.spyOn(seedRepository, 'remove').mockResolvedValue(undefined);

      await seedService.remove(targetSeedId);

      expect(seedRepository.findOne).toHaveBeenCalledWith({
        where: { id: targetSeedId },
      });
      expect(seedRepository.remove).toHaveBeenCalledWith({
        id: targetSeedId,
      });
    });

    it('should throw NotFoundException when removing a non-existing seed', async () => {
      jest.spyOn(seedRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(seedRepository, 'remove');

      await expect(seedService.remove(nonExistingSeedId)).rejects.toThrow(
        new NotFoundException(`Seed with ID ${nonExistingSeedId} not found`),
      );
      expect(seedRepository.findOne).toHaveBeenCalledWith({
        where: { id: nonExistingSeedId },
      });
      expect(seedRepository.remove).not.toHaveBeenCalledWith({
        id: nonExistingSeedId,
      });
    });
  });
});
