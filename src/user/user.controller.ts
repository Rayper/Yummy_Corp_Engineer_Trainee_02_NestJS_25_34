import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { User } from './models/user.enitity';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateUserDto } from './models/update_user.dto';
import { CreateUserDto } from './models/user_create.dto';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';   
import { HasPermission } from 'src/permission/has-permission.decorator';


@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {

    constructor(
        private userService: UserService,
        private authService: AuthService
        ) {
 
    }

    @Get()
    @HasPermission('users') 
    async all(@Query('page') page = 1) {
        return this.userService.paginate(page, ['role']);
    }

    @Post()
    @HasPermission('users') 
    async create(@Body() body: CreateUserDto): Promise<User> {
        // hash('default valuenya', 12);
        const password = await bcrypt.hash('1234', 12);

        const {role_id, ...data} = body;

        return this.userService.create({
            ...data,
            password,
            role: {id: role_id}
        });
    }
    
    @Put('updateInfo')
    async updateInfo(
        @Req() request: Request,
        @Body() body: UpdateUserDto
        ) {

        const id = await this.authService.userId(request);

        await this.userService.update(id, body);

        return this.userService.findOne({id});
    }

    @Put('updatePassword')
    async updatePassword(
        @Req() request: Request,
        @Body('password') password: string,
        @Body('password_confirm') password_confirm: string
    ) {

        if(password !== password_confirm) {
            throw new BadRequestException('Password do not match!');
        } 

        const id = await this.authService.userId(request);

        const hashed = await bcrypt.hash(password, 12);

        await this.userService.update(id, {
            password: hashed
        });

        return this.userService.findOne({id});
    }


    @Get(':id')
    @HasPermission('users') 
    async get(@Param('id') id: number) {
        return this.userService.findOne({id}, ['role']);
    }

    @Put(':id')
    @HasPermission('users') 
    async update(
        @Param('id') id: number,
        @Body() body: UpdateUserDto
    ) {
        // dapetin role id nya untuk diupdate
        const {role_id, ...data} = body;

        // tunggu data-nya diupdate, setelah itu di return kembali
        await this.userService.update(id, {
            ...data,
            role: {id: role_id}
        });

        return this.userService.findOne({id});
    }

    @Delete(':id')
    @HasPermission('users') 
    async delete(@Param('id') id: number) {
        return this.userService.delete(id);
    }

}
