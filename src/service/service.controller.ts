import { Controller, Get, Req, Res, Post, Body } from '@nestjs/common';
import { ServiceService } from './service.service';
import { PrismaService } from 'src/prisma.service';

import {Request, Response} from 'express'

@Controller('service')
export class ServiceController {
    constructor(private readonly serviceService: ServiceService, private prismaMongo: PrismaService) { }

    @Get()
    async getAllService(@Req() req: Request, @Res() res: Response) {
        const services = await this.serviceService.getServices()
        return res.json({
            services
        })
    }

    @Post("create")
    async createService(@Body() body, @Req() req: Request, @Res() res: Response) {
        return await this.serviceService.createService(body).then(() => {
            return res.json({
                message: "Service created"
            })
        }).catch(err => {
            return res.status(403).json({
                message: err.message
            })
        })
    }
}
