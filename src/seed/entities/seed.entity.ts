import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum SeedType {
  FLOWER = 'flower',
  FRUIT = 'fruit',
  LEAF = 'leaf',
  ROOT = 'root',
  VEG = 'vegetable',
}

@Entity()
export class Seed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: SeedType,
  })
  type: SeedType;

  @Column()
  producer: string;

  @Column()
  origin: string;

  @Column()
  availability: boolean;

  @Column({ type: 'date' })
  harvestDate: Date;

  @Column('simple-array')
  growingConditions: string[];
}
