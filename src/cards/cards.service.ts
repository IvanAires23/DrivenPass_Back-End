import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardsRepository } from './cards.repository';
import { CryptrService } from '../crypto/cryptr.service';

@Injectable()
export class CardsService {

  constructor(
    private readonly repository: CardsRepository,
    private readonly cryptrService: CryptrService
  ) { }

  async create(body: CreateCardDto, userId: number) {
    const { title, cvv, number, password, type } = body
    this.isNumber(number)
    const cardNameAndUser = await this.repository.findByTitleAndUser(title, userId)
    if (cardNameAndUser) throw new ConflictException('Title already in use')
    if (type !== "CREDIT" && type !== "DEBIT" && type !== "CREDITDEBIT") {
      throw new UnprocessableEntityException("The type must CREDIT, DEBIT OR CREDITDEBIT")
    }

    const cryptCvv = this.cryptrService.encrypt(cvv)
    const cryptPassword = this.cryptrService.encrypt(password)


    return await this.repository.createCreditCard({ ...body, password: cryptPassword, cvv: cryptCvv }, userId)
  }

  async findAll(userId: number) {
    return await this.repository.findAll(userId);
  }

  async findOne(id: number, userId: number) {
    const creditCard = await this.repository.findOne(id)
    if (!creditCard) throw new NotFoundException('Not Found creditCard')
    if (creditCard.userId !== userId) throw new ForbiddenException()

    return creditCard
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId)
    return await this.repository.delete(id)
  }

  private isNumber(cardNumber: string) {
    const number = parseInt(cardNumber)
    if (isNaN(number)) throw new BadRequestException()
  }
}
