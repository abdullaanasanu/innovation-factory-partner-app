import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { HttpService } from '@nestjs/axios';
import * as jwt from 'jsonwebtoken'
import axios from 'axios';

@Injectable()
export class SubscriptionService {
    constructor(private httpService: HttpService, private prismaMongo: PrismaService) { }

    subscribeService(token: any, identifier: string) {
        return new Promise(async (resolve, reject) => {
            const merchant = await this.prismaMongo.merchant.findFirst({
                where: {
                    identifier
                }
            })
            // console.log("mmm ", merchant);

            const decoded = jwt.verify(token, merchant.publicKey, { algorithms: ['RS256'] })
            console.log("ddd ", decoded);

            const previousSubsciprtion = await this.prismaMongo.subscription.findFirst({
                where: {
                    serviceId: decoded.serviceId,
                    merhcantId: merchant.id,
                    userId: String(decoded.sub)
                }
            })

            if (decoded.action == "sub") {
                if (previousSubsciprtion) {
                    reject({
                        message: "Already Subscribed"
                    })
                }

                this.prismaMongo.subscription.create({
                    data: {
                        serviceId: decoded.serviceId,
                        merhcantId: merchant.id,
                        userId: String(decoded.sub),
                        subscriptionId: decoded.subscriptionId
                    }
                }).then(data => {
                    let payloadData = {
                        subscriptionId: decoded.subscriptionId,
                        action: 'sub',
                        aud: merchant.identifier,
                        iss: "samsung",
                        jti: "subscription-notification",
                        iat: Math.floor(Date.now() / 1000),
                        exp: Math.floor(Date.now() / 1000) + 600
                    }

                    const token = jwt.sign(payloadData, merchant.privateKey, { algorithm: 'RS256' });


                    axios.post(merchant.url, {
                        identifier: "samsung"
                    }, {
                        headers: {
                            Authorization: token
                        }
                    }).then(() => {
                        console.log("Updated")
                    }).catch(err => {
                        console.log("Error", err);

                    })
                    resolve(data)
                }).catch(err => {
                    console.log("eee ", err);

                    reject(err)
                })
            } else if (decoded.action == "unsub") {
                if (!previousSubsciprtion) {
                    reject({
                        message: "Not Subscribed"
                    })
                }

                this.prismaMongo.subscription.delete({
                    where: {
                        id: previousSubsciprtion.id,
                    }
                }).then(data => {
                    let payloadData = {
                        subscriptionId: decoded.subscriptionId,
                        action: 'unsub',
                        sub: decoded.sub,
                        aud: merchant.identifier,
                        iss: "samsung",
                        jti: "subscription-notification",
                        iat: Math.floor(Date.now() / 1000),
                        exp: Math.floor(Date.now() / 1000) + 600
                    }

                    const token = jwt.sign(payloadData, merchant.privateKey, { algorithm: 'RS256' });


                    axios.post(merchant.url, {
                        identifier: "samsung"
                    }, {
                        headers: {
                            Authorization: token
                        }
                    }).then(() => {
                        console.log("Updated")
                    }).catch(err => {
                        console.log("Error", err);

                    })
                    resolve(data)
                }).catch(err => {
                    console.log("eee ", err);

                    reject(err)
                })
            }


        })

    }
}
