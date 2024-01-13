import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seed } from './entities/seed.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Seed])],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
