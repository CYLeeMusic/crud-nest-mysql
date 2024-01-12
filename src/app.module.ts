import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedModule } from './seed/seed.module';
import ormConfig from 'ormconfig';

@Module({
  imports: [TypeOrmModule.forRootAsync({ useFactory: () => ormConfig }), SeedModule],
})
export class AppModule {}
