import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { CustomerSignUpDto, CustomerLoginDto, CustomerChangePassDto, CustomerUpdateInfoDto, CustomerMailDto } from './customer.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

const dashboard_options = [
    { label: 'Account Information'},
    { label: 'Change Password'},
    { label: 'Wishlist'},
    { label: 'Orders'},
];

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(CustomerEntity)
        private customerRepo: Repository<CustomerEntity>,
        private mailerService: MailerService,
    ) {}

    async customerAccDashboard(): Promise<any> {
        const labels = dashboard_options.map((option) => option.label);
        return labels;
    }

    async customerAccountInfo(email: string): Promise<CustomerEntity> {
        const entry = await this.customerRepo
            .createQueryBuilder('customer')
            .select(['customer.name', 'customer.email', 'customer.contact', 'customer.gender', 'customer.address', 'customer.photo',])
            .where('customer.email = :email', { email })
            .getOne();
        return entry;
    }

    async customerSignUp(customer: CustomerSignUpDto): Promise<any> {
        const data = await this.customerRepo.findOneBy({email: customer.email});
        if(data) {
            return false;
        }
        else {
            const salt = await bcrypt.genSalt();
            customer.password = await bcrypt.hash(customer.password, salt);
            const { name, email, password, contact, gender } = customer;
            const newcustomer = { name, email, password, contact, gender };
            await this.customerRepo.save(newcustomer);
            return true;
        }
    }

    async customerLogin(customer: CustomerLoginDto): Promise<any> {
        const data = await this.customerRepo.findOneBy({email: customer.email});
        if(data) {
            const isMatch = await bcrypt.compare(customer.password, data.password);
            if(isMatch) {
                return 'login successful';
            }
            else {
                return 'incorrect password';
            }
        }
        else {
            return 'email does not exist';
        }
    }

    async customerChangePass(customer: CustomerChangePassDto, email: string): Promise<any> {
        const data = await this.customerRepo.findOneBy({email: email});
        const isMatch = await bcrypt.compare(customer.password, data.password);
        if(isMatch) {
            if ( customer.password === customer.new_password ) {
                return 'new password cannot be same as old';
            } 
            else {
                if(customer.new_password !== customer.confirm_password) {
                    return 'new passwords do not match';
                }
                else {
                    const salt = await bcrypt.genSalt();
                    customer.new_password = await bcrypt.hash(customer.new_password, salt);
                    await this.customerRepo.update(data.id, {password: customer.new_password});
                    return 'password changed successfully';
                }
            }
        } else {
            return 'current password is incorrect';
        }
    }

    async updateCustomerInfo(customer: CustomerUpdateInfoDto, email: string): Promise<any> {
        const data = await this.customerRepo.findOneBy({email: email});
        const newcustomer = Object.fromEntries(
            Object.entries(customer).filter(([key, val]) => val !== null && val !== undefined && val.trim() !== '')
        );
        if('email' in newcustomer) {
            const check = await this.customerRepo.findOneBy({email: newcustomer.email});
            if(check && check.email !== email) {
                return 'email already exists, use another';
            } else {
                await this.customerRepo.update(data.id, newcustomer);
                return 'acc updated with new email';
            }
        } else {
            await this.customerRepo.update(data.id, newcustomer);
            return 'account updated successfully';
        }
    }

    async sendMessage(maildto: CustomerMailDto): Promise<any> {
        const messagebody = '<p>' + maildto.message + '</p>' + '<br><br><h4><b>' + maildto.s_name + '</b></h4><br><h4>' + maildto.s_email + '</h4>';
        await this.mailerService.sendMail({
            to: 'hasanbithto2@gmail.com',
            subject: maildto.subject,
            html: messagebody,
        });
        return true;
    }

    // async deleteCustomer(id: number): Promise<any> {
    //     await this.customerRepo.delete({id});
    //     return 'deleted successfully';
    // }
}
