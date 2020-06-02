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
            <p>You can reset your password <a href=${url}>here.</a> This link is valid for twenty minutes. </p>
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
    }).catch(err => {
      console.log('error', err)
    })
  }

  async sendNewAdminNotice(changedByEmail: string, sendTo: string) {

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
            Data: `<p>You've been added as an admin to a Stew organization by ${changedByEmail}</p>
            <p>If you have any questions or concerns, you can reply to this email.</p>`,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'You have been added as an admin for your Stew organization',
        },
      },
    }

    new AWS.SES(SESConfig).sendEmail(params).promise().then(res => {
    }).catch(err => {
      console.log('error', err)
    })
  }

  async sendRemovedFromOrganization(removedBy: string, sendTo: string) {

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
            Data: `<p>You've been removed from a Stew organization by ${removedBy}</p>
            <p>If you have any questions or concerns, you can reply to this email.</p>`,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Stew Organization Removal',
        },
      },
    }

    new AWS.SES(SESConfig).sendEmail(params).promise().then(res => {
    }).catch(err => {
      console.log('error', err)
    })
  }

  async sendOrganizationInvite(invitedBy: string, sendTo: string, url: string) {

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
            Data: `<p>You've been invited to a Stew organization by ${invitedBy}</p>
            Click <a href='${url}'> here </a> to accept the invite. If you do not have a Stew account,
            you can <a href='${this.configService.get('WEBSITE_URL')}/sign-up'>create one.</a></p>
            <p>If you have any questions or concerns, you can reply to this email.</p>`,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'You have been removed from a Stew organization',
        },
      },
    }

    new AWS.SES(SESConfig).sendEmail(params).promise().then(res => {
    }).catch(err => {
      console.log('error', err)
    })
  }


}
