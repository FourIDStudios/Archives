import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ArchivedMessage as IArchivedMessage, MessageAttachment, MessageEmbed, MessageReaction } from '@discord-archive/shared';

@Entity('archived_messages')
export class ArchivedMessage implements IArchivedMessage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { length: 255 })
  messageId!: string;

  @Column('varchar', { length: 255 })
  channelId!: string;

  @Column('varchar', { length: 255 })
  guildId!: string;

  @Column('varchar', { length: 255 })
  authorId!: string;

  @Column('varchar', { length: 255 })
  authorUsername!: string;

  @Column('varchar', { length: 255, nullable: true })
  authorDisplayName?: string;

  @Column('varchar', { length: 500, nullable: true })
  authorAvatar?: string;

  @Column('text')
  content!: string;

  @Column('datetime')
  timestamp!: Date;

  @Column('datetime', { nullable: true })
  editedTimestamp?: Date;

  @Column('json')
  attachments!: MessageAttachment[];

  @Column('json')
  embeds!: MessageEmbed[];

  @Column('json', { nullable: true })
  reactions?: MessageReaction[];

  @Column('boolean', { default: true })
  archived!: boolean;

  @Column('datetime')
  archivedAt!: Date;

  @Column('varchar', { length: 255 })
  archivedBy!: string;

  @Column('varchar', { length: 500 })
  messageUrl!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}