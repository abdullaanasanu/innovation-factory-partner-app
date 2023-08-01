import { Injectable } from '@nestjs/common';
import axios from 'axios';
import slugify from 'slugify'
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MerchantService {
    constructor(private prismaMongo: PrismaService) { }

    createMerchant(merchantData: any) {
        return new Promise((resolve, reject) => {
            const { name, description, image, publicKey, privateKey, url, identifier } = merchantData
            this.prismaMongo.merchant.create({
                data: {
                    name,
                    description,
                    image,
                    publicKey,
                    privateKey,
                    url,
                    identifier
                }
            }).then(data => {
                resolve(data)
            }).catch(err => {
                console.log("eee ", err);
                
                reject(err)
            })
        })
        
    }

    async getMerchants() {
        return await this.prismaMongo.service.findMany();
    }
}
