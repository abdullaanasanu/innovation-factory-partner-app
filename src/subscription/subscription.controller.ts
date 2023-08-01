import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SubscriptionService } from './subscription.service';

import {Request, Response} from 'express'

@Controller('subscription')
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService, private prismaService: PrismaService) { }

    @Post("subscribe")
    async subscribe(@Body() body, @Req() req: Request, @Res() res: Response) {
        const token = req.headers.authorization;
        const {identifier } = body
        
        return await this.subscriptionService.subscribeService(token, identifier).then(() => {
            return res.json({
                message: "Subscription Initiated"
            })
        }).catch(err => {
            return res.status(403).json({
                message: err.message
            })
        })
    }
}
