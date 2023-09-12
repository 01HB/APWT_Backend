import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, UploadedFile, UseInterceptors, } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto, UpdateProductDto } from './product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('product')
export class ProductController {

    constructor(private readonly productService: ProductService) {}

    @Post('/add')
    @UseInterceptors(
        FileInterceptor('p_image', {
            storage: diskStorage({
                destination: './uploads/products',
                filename: (req, file, cb) => {
                    // const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                    return cb(null, `${Date.now()}${file.originalname}`);
                },
            }),
        }),
    )
    async addProduct(@Body() productDto: ProductDto, @UploadedFile( new ParseFilePipe(
        {
          validators: [
            new MaxFileSizeValidator({ maxSize: 10737418240 }),
            new FileTypeValidator({ fileType: 'png|jpg|jpeg|' }),
          ],
        }
        ),) p_image: Express.Multer.File ): Promise<any> {
        try {
            const msg = await this.productService.addProduct(productDto, p_image.filename);
            if (msg){
                return 'a new product has been added';
            } else if (!msg){
                return 'product already exists';
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }



    @Patch('/update/:pid')
    async updateProduct(@Param('pid', ParseIntPipe) pid: number, @Body() updateDto: UpdateProductDto): Promise<any> {
        try {
            const msg = await this.productService.updateProduct(pid, updateDto);
            if (msg){
                return 'product updated successfully';
            } else if (!msg){
                return 'product does not exist';
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Delete('/delete')
    async deleteProduct(@Body('pname') pname: string): Promise<any> {
        try {
            const msg = await this.productService.deleteProduct(pname);
            if (msg){
                return 'product deleted successfully';
            } else if (!msg){
                return 'product not found';
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

}
