import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ServiceService {
    constructor(private prismaMongo: PrismaService) { }

    createService(serviceData: any) {
        return new Promise((resolve, reject) => {
            const { name, description, image } = serviceData
            this.prismaMongo.service.create({
                data: {
                    name,
                    description,
                    image
                }
            }).then(data => {
                resolve(data)
            }).catch(err => {
                console.log("eee ", err);
                
                reject(err)
            })
        })
        
    }

    async getServices() {
        return await this.prismaMongo.service.findMany();
    }
}
