import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SeedService } from './seed.service';
import { CreateSeedDto } from './dto/create-seed.dto';
import { UpdateSeedDto } from './dto/update-seed.dto';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  create(@Body() createSeedDto: CreateSeedDto) {
    return this.seedService.create(createSeedDto);
  }

  @Get()
  findAll() {
    return this.seedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') seedId: number) {
    return this.seedService.findOne(+seedId);
  }

  @Patch(':id')
  update(@Param('id') seedId: number, @Body() updateSeedDto: UpdateSeedDto) {
    return this.seedService.update(+seedId, updateSeedDto);
  }

  @Delete(':id')
  remove(@Param('id') seedId: number) {
    return this.seedService.remove(+seedId);
  }
}
