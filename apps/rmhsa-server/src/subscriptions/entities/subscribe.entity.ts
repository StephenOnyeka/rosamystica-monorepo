import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('subscribes')
export class Subscribe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  email?: string;
}
