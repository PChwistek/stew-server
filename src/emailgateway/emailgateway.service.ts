import { Injectable, BadRequestException } from '@nestjs/common'
import { ConfigService } from '../config/config.service'
import * as AWS from 'aws-sdk'

@Injectable()
export class EmailGatewayService {
  constructor(
  private readonly configService: ConfigService) {}

  async sendEmailRequest(sendTo: string) {

    AWS.config.credentials = {
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    }

    const SESConfig = {
      apiVersion: '2010-12-01',
      region: this.configService.get('AWS_SES_REGION'),
    }

    const params = {
      Source: 'support@getstew.com',
      Destination: {
        ToAddresses: [
          sendTo,
        ],
      },
      ReplyToAddresses: [
        'support@getstew.com',
      ],
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: 'IT IS WORKING!',
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Testing',
        },
      },
    }

    new AWS.SES(SESConfig).sendEmail(params).promise().then(() => {
    }).catch(err => {
      console.log('error', err)
    })

  }
}
