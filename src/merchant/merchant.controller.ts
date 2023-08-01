import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MerchantService } from './merchant.service';

import {Request, Response} from 'express'

@Controller('merchant')
export class MerchantController {
    constructor(private readonly merchantService: MerchantService, private prismaMongo: PrismaService) { }

    @Get()
    async getAllMerchant(@Req() req: Request, @Res() res: Response) {
        const merchants = await this.merchantService.getMerchants();
        return res.json({
            merchants
        })
    }

    @Post("create")
    async createMerchant(@Body() body, @Req() req: Request, @Res() res: Response) {
        return await this.merchantService.createMerchant(body).then(() => {
            return res.json({
                message: "Merchant created"
            })
        }).catch(err => {
            return res.status(403).json({
                message: err.message
            })
        })
    }

}
