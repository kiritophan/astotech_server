import { OnModuleInit } from "@nestjs/common";
import { JwtService } from "../../jwts/jwt.service";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { User } from "src/modules/users/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Receipt, ReceiptStatus } from "src/modules/receipts/entities/receipt.entity";
import { Repository } from "typeorm";
import { ReceiptDetail } from "src/modules/receipt-detail/entities/receipt-detail.entity";

interface ClientType {
    user: User,
    socket: Socket
}
@WebSocketGateway(3001, { cors: true })
export class UserSocketGateway implements OnModuleInit {
    @WebSocketServer()
    server: Server
    clients: ClientType[] = [];

    constructor(
        private readonly jwt: JwtService,
        @InjectRepository(Receipt) private readonly receipts: Repository<Receipt>,
        @InjectRepository(ReceiptDetail) private readonly receiptDetail: Repository<ReceiptDetail>
    ) { }

    onModuleInit() {
        this.server.on("connect", async (socket: Socket) => {
            console.log("Đã có người connect")
            /* Xóa người dùng khỏi clients nếu disconnect */
            socket.on("disconnect", () => {
                console.log("có 1 user đã out!")
                this.clients = this.clients.filter(client => client.socket.id != socket.id)
            })

            /* Xác thực người dùng */
            let token: string = String(socket.handshake.query.token);
            let user = (this.jwt.verifyToken(token) as User);
            if (token == "undefined" || !user) {
                socket.emit("connectStatus", {
                    message: "Đăng nhập thất bại",
                    status: false
                })
                socket.disconnect();
            } else {
                // if(this.clients.find(client => client.user.id == user.id)) {
                //     socket.emit("connectStatus", {
                //         message: "Đã đăng nhập ở 1 thiết bị khác!",
                //         status: false
                //     })
                //     socket.disconnect()
                //     return
                // } 
                /* Lưu trữ thông tin người dùng vừa kết nối để tương tác về sau */
                this.clients.push({
                    socket,
                    user
                })

                socket.emit("connectStatus", {
                    message: "Đăng nhập thành công",
                    status: true
                })

                socket.emit("receiveUserData", user)

                let receipt = await this.findReceiptByAuthId({
                    userId: user.id,
                    guestId: null
                });

                socket.emit("receiveReceipt", receipt ? receipt : [])

                let cart = await this.getCartByUserId(user.id);
                if (cart) {
                    socket.emit("receiveCart", cart)
                }

                socket.on("addToCart", async (newItem: { receiptId: string, optionId: string, quantity: number }) => {
                    console.log("đã vào", newItem)
                    let cart = await this.addToCart(newItem)
                    if (cart) {
                        socket.emit("receiveCart", cart)
                    }
                })
            }
        })
    }

    async findReceiptByAuthId(data: {
        userId: string | null,
        guestId: string | null
    }) {
        try {
            if (data.userId == null && data.guestId == null) return false
            let receipts = await this.receipts.find({
                where: data.userId ? {
                    userId: data.userId
                } : {
                    guestId: data.guestId
                },
                relations: {
                    detail: {
                        option: {
                            product: true,
                            pictures: true
                        }
                    }
                }
            })

            if (!receipts) return false

            if (receipts.length == 0) return false

            return receipts
        } catch (err) {
            return false
        }
    }

    async getCartByUserId(userId: string) {
        try {
            let oldCart = await this.receipts.find({
                where: {
                    userId,
                    status: ReceiptStatus.SHOPPING
                },
                relations: {
                    detail: {
                        option: {
                            product: true,
                            pictures: true
                        }
                    }
                }
            })
            if (!oldCart || oldCart.length == 0) { // nếu tìm giỏ hàng cũ bị lỗi
                // tạo giỏ hàng
                let newCartChema = this.receipts.create({
                    userId,

                })
                let newCart = await this.receipts.save(newCartChema);

                if (!newCart) return false

                let newCartRelation = await this.receipts.findOne({
                    where: {
                        id: newCart.id,
                    },
                    relations: {
                        detail: {
                            option: {
                                product: true,
                                pictures: true
                            }
                        }
                    }
                })
                console.log("tới 2")
                if (!newCartRelation) return false
                return newCartRelation
            }
            return oldCart[0]
        } catch (err) {
            console.log("err", err)
            return false
        }
    }

    async addToCart(newItem: { receiptId: string, optionId: string, quantity: number }) {
        try {
            let items = await this.receiptDetail.find({
                where: {
                    receiptId: newItem.receiptId
                }
            })
            if (!items) return false
            if (items.length == 0) {
                await this.receiptDetail.save(newItem)
            } else {
                let check = items.find(item => item.optionId == newItem.optionId);
                if (check) {
                    let itemUpdate = this.receiptDetail.merge(items.find(item => item.optionId == newItem.optionId), {
                        quantity: newItem.quantity
                    })
                    await this.receiptDetail.save(itemUpdate)
                } else {
                    await this.receiptDetail.save(newItem)
                }
            }

            let cart = await this.receipts.findOne({
                where: {
                    id: newItem.receiptId
                },
                relations: {
                    detail: {
                        option: {
                            product: true,
                            pictures: true
                        }
                    }
                }
            })

            if (!cart) return false
            return cart
        } catch (err) {
            return false
        }
    }
} 