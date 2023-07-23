import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto, UpdateProductDto } from './product.dto';

@Controller('product')
export class ProductController {

    constructor(private readonly productService: ProductService) {}

    @Post('/add')
    async addProduct(@Body() productDto: ProductDto): Promise<any> {
        try {
            const msg = await this.productService.addProduct(productDto);
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
