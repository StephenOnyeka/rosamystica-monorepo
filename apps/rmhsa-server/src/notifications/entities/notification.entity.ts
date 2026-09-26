import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  desc?: string;

  @Column({ type: 'text', nullable: true })
  body?: string;

  @Column({ type: 'varchar', nullable: true })
  type?: string;

  @Column({ type: 'varchar', nullable: true })
  relatedBlogId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
