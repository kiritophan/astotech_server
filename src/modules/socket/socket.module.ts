import { Module } from "@nestjs/common";
import { DiscordBotSocket } from "./discord.bot.socket";
import { CustomerChatSocket } from "./customer.chat.socket";
import { CustomerChatService } from "./customers/customer.chat.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerChats } from "./customers/entities/customer.chat.entity";
import { JwtService } from "../jwts/jwt.service";
import { PurchaseSocket } from "./customers/purchase.socket";
import { Receipt } from "../receipts/entities/receipt.entity";
import { ReceiptDetail } from "../receipt-detail/entities/receipt-detail.entity";
import { UserSocketGateway } from "./users/user.socket";

@Module({
    imports: [
        TypeOrmModule.forFeature([CustomerChats, Receipt, ReceiptDetail])
    ],
    providers: [DiscordBotSocket, CustomerChatSocket, CustomerChatService, JwtService, PurchaseSocket, UserSocketGateway]
})
export class SocketModule { }