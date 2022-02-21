import { ClassSerializerInterceptor, Controller, Get, Post, Query, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { Parser } from 'json2csv';
import { AuthGuard } from 'src/auth/auth.guard';
import { HasPermission } from 'src/permission/has-permission.decorator';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { OrderItem } from './order_item.entity';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller()
export class OrderController {
    constructor(private orderService: OrderService) {

    }

    @Get('orders')
    @HasPermission('orders')
    async all(@Query('page') page = 1) {
        return this.orderService.paginate(page, ['order_items']);
    }

    @Post('export')
    @HasPermission('orders')
    async export(@Res() res: Response) {
        const parser = new Parser({
            fields: ['ID', 'Name', 'Email', 'Product Title', 'Price', 'Quantity'] 
        });

        // dapetin semua data order-nya
        const orders = await this.orderService.all(['order_items']);

        // buat variable json untuk nampung data-nya dlm bentuk array
        const json = [];

        // ambil data ordernya
        orders.forEach((o: Order) => {
            json.push({
                ID: o.id,
                Name: o.fullname,
                Email: o.email,
                // karena pake spasi, jadi pakai petik
                'Product Title': '',
                Price: '',
                Quantity: ''
            });

            // ambil data order_items allu masukin ke array json
            o.order_items.forEach((i: OrderItem) => {
                json.push({
                    ID: '',
                    Name: '',
                    Email: '',
                    // karena pake spasi, jadi pakai petik
                    'Product Title': i.product_title,
                    Price: i.price,
                    Quantity: i.quantity
                });
            })
        });

        const csv = parser.parse(json);
        // jenis file nya
        res.header('Content-Type', 'text/csv');
        // nama file-nya bakal jadi orders.csv
        res.attachment('orders.csv');
        return res.send(csv);
    }

    @Get('chart') 
    @HasPermission('orders')
    async chart() {
        return this.orderService.chart();
    }
}
