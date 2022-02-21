import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { OrderController } from './order.controller';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { OrderItem } from './order_item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    CommonModule
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
