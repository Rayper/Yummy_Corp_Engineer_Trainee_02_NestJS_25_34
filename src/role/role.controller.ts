import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { HasPermission } from 'src/permission/has-permission.decorator';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
    constructor(private roleService: RoleService) {

    }

    @Get()
    @HasPermission('roles')
    async all() {
        return this.roleService.all();
    }

    @Post()
    @HasPermission('roles')
    async create(
        @Body('name') name: string,
        @Body('permissions') ids: number[]
    ) {
        // mapping menjadi seperti ini
        // [1,2]
        // jadi object seperti ini
        // [
        //     {id: 1}, {id: 2}
        // ]
        return this.roleService.create({
            name,
            permissions: ids.map(id => ({id}))
        });
    }

    @Get(':id')
    @HasPermission('roles')
    async get(@Param('id') id: number) {
        return this.roleService.findOne({id}, ['permissions']);
    }

    @Put(':id')
    @HasPermission('roles')
    async update(
        @Param('id') id: number,
        @Body('name') name: string,
        @Body('permissions') ids: number[]
    ) {
        // tunggu data-nya diupdate, setelah itu di return kembali
        await this.roleService.update(id, {name});

        // dapetin role-nya
        const role = await this.roleService.findOne({id});

        // copy semua data dari role, jadiin data baru
        return this.roleService.create({
            ...role,
            permissions: ids.map(id => ({id}))
        })
    }

    @Delete(':id')
    @HasPermission('roles')
    async delete(@Param('id') id: number) {
        return this.roleService.delete(id);
    }
}
