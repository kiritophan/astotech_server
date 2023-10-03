import { UserAddresses } from "src/modules/user-addresses/entities/user-address.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as  bcrypt from 'bcrypt'
import { UserRole, UserStatus } from "../users.enum";
import { CustomerChats } from "src/modules/socket/customers/entities/customer.chat.entity";
@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: "https://png.pngtree.com/png-clipart/20210608/ourmid/pngtree-gray-silhouette-avatar-png-image_3418406.jpg" })
    avatar: string;

    @Column({ unique: true, length: 150 })
    email: string;

    @Column({ default: false })
    emailAuthentication: boolean;

    @Column({ default: "phan" })
    firstName: string;

    @Column({ default: "dau" })
    lastName: string;

    @Column({ unique: true, length: 50 })
    userName: string;

    @Column()
    password: string;
    receipts: any;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    @Column({ type: 'enum', enum: UserRole, default: UserRole.MEMBER })
    role: UserRole;

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
    status: UserStatus;

    @Column({
        default: String(Date.now())
    })
    createAt: String;

    @Column({
        default: String(Date.now())
    })
    updateAt: String;

    @BeforeUpdate()
    async setUpdateTime() {
        this.updateAt = String(Date.now());
    }

    @OneToMany(() => UserAddresses, (userAddresses) => userAddresses.user)
    userAddresses: UserAddresses[];

    @OneToMany(() => CustomerChats, (customerChats) => customerChats.user)
    customerChats: CustomerChats[];

    @OneToMany(() => CustomerChats, (customerChats) => customerChats.admin)
    adminChats: CustomerChats[];
}

