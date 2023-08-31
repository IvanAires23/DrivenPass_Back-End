import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotesRepository } from './notes.repository';

@Injectable()
export class NotesService {

  constructor(private readonly repository: NotesRepository) { }

  async create(body: CreateNoteDto, userId: number) {
    const { title } = body
    const titleAndUser = await this.repository.findByTitleAndUser(title, userId)
    if (titleAndUser) throw new ConflictException('Title already in use')

    return await this.repository.createNotes(body, userId)
  }

  async findAll(userId: number) {
    return await this.repository.findAll(userId);
  }

  async findOne(id: number, userId: number) {
    const note = await this.repository.findOne(id)
    if (!note) throw new NotFoundException('Not Found note')
    if (note.userId !== userId) throw new ForbiddenException()

    return note
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId)
    return await this.repository.delete(id)
  }
}
