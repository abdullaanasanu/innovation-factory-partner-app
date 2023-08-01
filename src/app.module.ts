import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServiceModule } from './service/service.module';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { SubscriptionModule } from './subscription/subscription.module';
import { MerchantModule } from './merchant/merchant.module';

@Module({
  imports: [ServiceModule, SubscriptionModule, MerchantModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
