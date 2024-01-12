import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Seed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  producer: string;

  @Column()
  origin: string;

  @Column()
  availability: boolean;

  @Column('jsonb')
  qualityMetrics: { moisture: number; germinationRate: number };

  @Column()
  price: number;

  @Column({ type: 'date' })
  releaseDate: Date;

  @Column({ type: 'date' })
  expiryDate: Date;

  @Column('simple-array')
  growingConditions: string[];
}
