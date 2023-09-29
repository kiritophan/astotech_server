import { OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { JwtService } from "src/modules/jwts/jwt.service";
import { ReceiptDetail } from "src/modules/receipt-detail/entities/receipt-detail.entity";
import { Receipt } from "src/modules/receipts/entities/receipt.entity";
import { PayMode, ReceiptStatus } from "src/modules/receipts/receipt.enum";
import { User } from "src/modules/users/entities/user.entity";
import { Repository } from "typeorm";

interface ReceiptType {
    userId?: string;
    guestName?: string;
    guestEmail?: string;
    guestPhoneNumber?: string;
    status?: ReceiptStatus;
    payMode: PayMode;
    paid?: boolean;
    paidTime?: string;
    total?: number;
}

@WebSocketGateway(3001, {
    cors: true
})
export class PurchaseSocket implements OnModuleInit {
    @WebSocketServer()
    server: Server

    clients: {
        user: User,
        socket: Socket
    }[] = [];

    constructor(
        private readonly jwt: JwtService,
        @InjectRepository(Receipt) private readonly receipts: Repository<Receipt>,
        @InjectRepository(ReceiptDetail) private readonly receiptDetail: Repository<ReceiptDetail>
    ) { }

    onModuleInit() {
        console.log("Purchase Socket Đã Mở!")
        this.server.on("connect", async (socket: Socket) => {
            // this.server.emit("onMessage", "đã có người connect")
            /* Xóa người dùng khỏi clients nếu disconnect */
            socket.on("disconnect", () => {
                this.clients = this.clients.filter(client => client.socket.id != socket.id)
            })

            /* Xác thực người dùng */
            let token: string = String(socket.handshake.query.token);
            let user = (this.jwt.verifyToken(token) as User);
            if (token == "undefined" || !user) {
                // thất bại
                socket.disconnect();
            } else {
                // thành công
                if (!this.clients.find(client => client.user.id == user.id)) {
                    let oldCart = await this.findShoppingCart(user.id);
                    if (!oldCart) {
                        let newCart = await this.registerCart({
                            payMode: PayMode.CASH,
                            userId: user.id,
                            total: 0
                        })
                        if (newCart) {
                            socket.emit("onCart", newCart)
                        }
                    } else {
                        socket.emit("onCart", oldCart)
                    }

                    socket.on("addToCart", async (newItem: { receiptId: string, optionId: string, quantity: number }) => {
                        console.log("newItem", newItem)
                        let result = await this.addToCart(newItem);
                        if (result) {
                            socket.emit("onCart", result)
                        }
                    })

                    this.clients.push({
                        socket,
                        user
                    })
                }
            }
        })
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

    async registerCart(newCart: ReceiptType) {
        try {
            let cart = this.receipts.create(newCart);
            let shoppingCart = await this.receipts.save(cart);
            let shoppingCartDetail = await this.receipts.findOne({
                where: {
                    id: shoppingCart.id
                },
                relations: {
                    detail: true
                }
            })
            if (!shoppingCartDetail) return false
            return shoppingCartDetail
        } catch (err) {
            console.log("err", err)
            return false
        }
    }

    async addToCart(newItem: { receiptId: string, optionId: string, quantity: number }) {
        let item = await this.receiptDetail.save(newItem);
        if (!item) return false
        let cart = await this.receipts.findOne({
            where: {
                id: item.receiptId
            },
            relations: {
                detail: true
            }
        })
        if (!cart) return false

        return cart
    }
}