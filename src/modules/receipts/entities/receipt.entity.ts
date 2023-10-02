import { IsEmail, IsNotEmpty } from "class-validator";
import { User } from "src/modules/users/entities/user.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PayMode, ReceiptStatus } from "../receipt.enum";
import { ReceiptDetail } from "src/modules/receipt-detail/entities/receipt-detail.entity";
import { Guest } from "src/modules/guest/entities/guest.entity";



@Entity()
export class Receipt {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: true
    })
    userId: string;

    @Column({
        nullable: true
    })
    guestId: string;

    @ManyToOne(() => User, (user) => user.receipts)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Guest, (guest) => guest.receipts)
    @JoinColumn({ name: 'guestId' })
    guest: Guest;
    @Column({
        nullable: true
    })
    guestName: string;

    @Column({
        nullable: true
    })
    guestEmail: string;

    @Column({
        nullable: true
    })
    guestPhoneNumber: string;



    @Column({
        type: "enum",
        enum: ReceiptStatus,
        default: ReceiptStatus.SHOPPING
    })
    status: ReceiptStatus

    @Column({
        type: "enum",
        enum: PayMode,
        default: PayMode.CASH
    })
    payMode: PayMode

    @Column({
        default: false
    })
    paid: boolean



    @Column({
        nullable: true
    })
    paidTime: string;


    @OneToMany(() => ReceiptDetail, (detail) => detail.receipt)
    detail: ReceiptDetail[];

    @Column()
    creatAt: string;

    @Column()
    total: number;

    @BeforeInsert()
    setCreateTime() {
        this.creatAt = String(Date.now())
    }
}

export { ReceiptStatus };
