import { Exclude, Expose } from "class-transformer";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order_item.entity";

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Exclude()
    first_name: string;

    @Column()
    @Exclude()
    last_name: string;

    @Column()
    email: string; 

    // auto generate
    @CreateDateColumn()
    created_at: string;

    // 1 order punya banyak order items
    // order items hanya punya 1 order
    @OneToMany(() => OrderItem, orderItem => orderItem.order)
    order_items: OrderItem[];

    @Expose()
    get fullname(): string{
        return `${this.first_name} ${this.last_name}`;
    }

    @Expose()
    get total_price(): number{
        // Reduce adalah sebuah fungsi yang digunakan untuk mengeksekusi nilai pada setiap element dengan tipe array dan menampilkan dalam sebuah nilai saja.
        // initialize i nya dari 0, lalu loop sesuai dengan totalnya
        return this.order_items.reduce((sum,i) => sum + i.price * i.quantity,0);
    }
}