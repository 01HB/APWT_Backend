import { Controller, Get, Post, Delete, Put, Patch, UsePipes, ValidationPipe, Body, Param, ParseIntPipe, Req, Res, Session, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { CustomerService } from 'src/customer/customer.service'
import { CustomerSignUpDto, CustomerLoginDto, CustomerChangePassDto, CustomerUpdateInfoDto, CustomerMailDto } from './customer.dto';
import { CSessionGuard } from './csession.guard';
import { ProductService } from 'src/product/product.service';
import { WishlistService } from 'src/wishlist/wishlist.service';
import { OrderService } from 'src/order/order.service';
import { CartService } from 'src/cart/cart.service';
import { OrderDto, PaymentDto } from '../order/order.dto';


@Controller()
export class CustomerController {
    constructor(private readonly customerService: CustomerService,
        private productService: ProductService,
        private wishlistService: WishlistService,
        private orderService: OrderService,
        private cartService: CartService ) {}

    @Get('/account')
    @UseGuards(CSessionGuard)
    async customerDashboard(): Promise<any> {
        try {
            return await this.customerService.customerAccDashboard();
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    @Get('/account/info')
    @UseGuards(CSessionGuard)
    async customerAccountInfo(@Session() session): Promise<any> {
        try {
            return await this.customerService.customerAccountInfo(session.email);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Post('/signup')
    @UsePipes(new ValidationPipe())
    async customerSignUp(@Body() customerdto: CustomerSignUpDto): Promise<any> {
        try {
            if ( customerdto.password !== customerdto.confirm_password ){
                return 'passwords do not match';
            } else {
                const msg = await this.customerService.customerSignUp(customerdto);
                if (msg){
                    return 'successfully signed up';
                } else if (!msg){
                    return 'email already exists';
                }
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Post('/login')
    @UsePipes(new ValidationPipe())
    async customerLogin(@Body() customerdto: CustomerLoginDto, @Session() session, @Res() res): Promise<any> {
        try {
            const result = await this.customerService.customerLogin(customerdto);
            if(result == 'login successful'){
                session.email = customerdto.email;
                if (session.email !== undefined){
                    res.redirect('/account');
                } else {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'something went wrong while logging in' });
                }
            } else if(result == 'incorrect password' || result == 'email does not exist') {
                res.send(result);
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Get('/account/logout')
    @UseGuards(CSessionGuard)
    async customerLogout(@Session() session): Promise<any> {
        try {
            if(await session.destroy()) {
                return 'you have been logged out';
            }
            else {
                throw new HttpException("something went wrong while logging out", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Patch('/account/change-pass')
    @UsePipes(new ValidationPipe())
    @UseGuards(CSessionGuard)
    async customerChangePass(@Body() customerdto: CustomerChangePassDto, @Session() session): Promise<any> {
        try {
            const result = await this.customerService.customerChangePass(customerdto, session.email);
            if(result == 'new passwords do not match' || result == 'current password is incorrect' || result == 'password changed successfully' || result == 'new password cannot be same as old'){
                return result;
            } else {
                throw new HttpException("something went wrong while changing password", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Patch('/account/info/update')
    @UsePipes(new ValidationPipe())
    @UseGuards(CSessionGuard)
    async updateCustomerInfo(@Body() customerdto: CustomerUpdateInfoDto, @Session() session): Promise<any> {
        try {
            const result = await this.customerService.updateCustomerInfo(customerdto, session.email);
            if(result == 'email already exists, use another') {
                return result;
            } else if(result == 'acc updated with new email') {
                session.email = customerdto.email;
                return 'account updated successfully';
            } else if(result == 'account updated successfully') {
                return result;
            } else {
                throw new HttpException("something went wrong while updating account info", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Get('/home')
    async viewAllProducts(): Promise<any> {
        try {
            return await this.productService.viewAllProducts();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Get('/products/category/:category')
    async viewProductsByCategory(@Param('category') category: string): Promise<any> {
        try {
            return await this.productService.viewProductsByCategory(category);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Get('/products/:id')
    async viewProductByID(@Param('id', ParseIntPipe) id: number): Promise<any> {
        try {
            return await this.productService.viewProductByID(id);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Post('/account/wishlist/add/:id')
    @UseGuards(CSessionGuard)
    async addItemsToWishlist(@Param('id', ParseIntPipe) id: number, @Session() session): Promise<any> {
        try {
            return await this.wishlistService.addToWishlist(session.email, id);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Get('/account/wishlist')
    @UseGuards(CSessionGuard)
    async viewWishlist(@Session() session): Promise<any> {
        try {
            return await this.wishlistService.viewWishlist(session.email);
        } catch (error) {
            throw new Error(error.message);
        }
    }


    @Delete('/account/wishlist/remove/:id')
    @UseGuards(CSessionGuard)
    async removeItemsFromWishlist(@Param('id', ParseIntPipe) id: number, @Session() session): Promise<any> {
        try {
            const result = await this.wishlistService.removeFromWishlist(session.email, id);
            if(result){
                return 'item removed from wishlist';
            } else if (!result){
                return 'item not found in wishlist';
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }


    @Post('/cart/add/:id')
    @UseGuards(CSessionGuard)
    async addItemsToCart(@Param('id', ParseIntPipe) id: number, @Body('quantity') quantity: number,  @Session() session): Promise<any> {
        try {
            return await this.cartService.addToCart(session.email, id, quantity);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Get('/cart/viewitems')
    @UseGuards(CSessionGuard)
    async viewCart(@Session() session): Promise<any> {
        try {
            return await this.cartService.getCartItems(session.email);
        } catch (error) {
            throw new Error(error.message);
        }
    }


    @Delete('/cart/remove/:id')
    @UseGuards(CSessionGuard)
    async removeItemsFromCart(@Param('id', ParseIntPipe) id: number, @Session() session): Promise<any> {
        try {
            const result = await this.cartService.removeFromCart(session.email, id);
            if(result){
                return 'item removed from cart';
            } else if (!result){
                return 'item not found in cart';
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Post('/checkout')
    @UseGuards(CSessionGuard)
    async checkout(@Session() session): Promise<any> {
        try {
            const result = await this.orderService.checkoutFromCart(session.email);
            if(result == false){
                return 'nothing in cart to checkout';
            } else if (typeof result === 'object') {
                session.checkout = result;
                return 'Item(s):\n' + result.items + '\nSubtotal: ' + result.total + ' BDT\n\n-> provide address for placing order';
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Post('/checkout/payment')
    @UsePipes(new ValidationPipe())
    @UseGuards(CSessionGuard)
    async proceedToPayment(@Body() orderdto: OrderDto, @Session() session): Promise<any> {
        try {
            if(session.checkout !== undefined){
                const result = await this.orderService.proceedToPayment(session.checkout, orderdto);
                session.checkoutfull = result;
                return 'select payment method to proceed:\n\n-> cash on delivery\n-> card\n-> mfs (mobile financial service)';
            } else {
                return 'nothing in cart to pay for';
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Post('/checkout/confirm-order')
    @UsePipes(new ValidationPipe())
    @UseGuards(CSessionGuard)
    async confirmOrder(@Body() paymentdto: PaymentDto, @Session() session): Promise<any> {
        try {
            if(session.checkoutfull !== undefined){
                const result = await this.orderService.placeOrder(session.email, session.checkoutfull, paymentdto);
                if(result == 'order placed successfully') {
                    delete session.checkout;
                    delete session.checkoutfull;
                }
                return result;
            } else {
                return 'complete the checkout procedure first';
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Get('/account/orders')
    @UseGuards(CSessionGuard)
    async viewOrders(@Session() session): Promise<any> {
        try {
            return await this.orderService.getOrders(session.email);
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    @Post('/account/contact/send')
    @UsePipes(new ValidationPipe())
    @UseGuards(CSessionGuard)
    async sendMessage(@Body() maildto: CustomerMailDto): Promise<any> {
        try {
            const result = await this.customerService.sendMessage(maildto);
            if(result) {
                return 'your message is sent';
            } else {
                throw new HttpException("something went wrong while sending message", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // @Delete('/account/delete')
    // deleteCustomer(@Param('id', ParseIntPipe) id: number): object {
    //     return this.customerService.deleteCustomer(id);
    // }

}
