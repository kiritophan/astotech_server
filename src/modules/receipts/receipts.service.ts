import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Receipt } from './entities/receipt.entity';
import { Repository } from 'typeorm';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ReceiptStatus } from './receipt.enum';

@Injectable()
export class ReceiptsService {
  constructor(@InjectRepository(Receipt) private readonly receipts: Repository<Receipt>) { }

  addToCart(newReceipt: AddToCartDto) {

    return 'This action adds a new receipt';
  }

  async findShoppingCart(userId: string) {
    try {
      let shoppingCart = await this.receipts.find({
        where: {
          userId,
          status: ReceiptStatus.SHOPPING
        }
      })

      if (shoppingCart.length == 0) {
        return false
      }

      return shoppingCart[0]
    } catch (err) {
      return false
    }
  }
}