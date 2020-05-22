import { Injectable, BadRequestException } from '@nestjs/common'
import { ConfigService } from '../config/config.service'
import * as AWS from 'aws-sdk'

@Injectable()
export class EmailGatewayService {
  constructor(
  private readonly configService: ConfigService) {}

  async sendEmailRequest(sendTo: string, url: string) {

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
            Data: `<p> Hello,\r\n we've received a request to change the password associated with ${sendTo}.</p>
            <p>You can reset your password <a href=${url}>here.</a></p>
            <p>If you did not request a new password, please let us know immediately by replying to this email.</p>`,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Reset your Stew password',
        },
      },
    }

    new AWS.SES(SESConfig).sendEmail(params).promise().then(res => {
      console.log('res', res)
    }).catch(err => {
      console.log('error', err)
    })
  }

  async sendEmailPasswordChangeConfirm(sendTo: string, url: string) {

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
            Data: `<p>Your Stew password was successfully changed.</p>
            If you did not perform this action, you should go <a href='${url}'> here </a>
            immediately to reset your password.</p>`,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Your Stew password has been changed',
        },
      },
    }

    new AWS.SES(SESConfig).sendEmail(params).promise().then(res => {
      console.log('res', res)
    }).catch(err => {
      console.log('error', err)
    })
  }


}
