import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';


@Controller()
export class UploadController {

    @Post('upload')
    //FileInterceptor('harus sama keynya dengan di postman')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads', // biar kalau upload image di taro di folder uploads
            filename(_, file, callback) {
                //generate nama random
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                
                // ambil randomname nya
                return callback(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
        uploadFile(@UploadedFile() file) {
        
            return {
                url: `http://localhost:8000/api/${file.path}`
            }
    }

    @Get('uploads/:path')
    async getImage(
        @Param('path') path,
        @Res() res: Response
    ) {
        res.sendFile(path, {root: 'uploads'});
    }

}
