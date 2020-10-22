
import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { AccountService } from '../account/account.service'
import { AccountPayloadDto } from '../account/account-payload.dto'
import { LoginAccountDto } from '../account/login-account.dto'
import { ConfigService } from '../config/config.service'
import { EmailGatewayService } from '../emailgateway/emailgateway.service'
import { RecordKeeperService } from '../recordkeeper/recordkeeper.service'
import { OAuthPayloadDto } from '../account/oauth-payload.dto'
import axios from 'axios'

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailGatewayService,
    private readonly recordService: RecordKeeperService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.accountService.findOneByEmail(email)
    if (user) {
      const match = await bcrypt.compare(password, user.passwordHash)
      if (match) {
        return user
      }
    }
    return null
  }

  async userExists(email: string): Promise<boolean> {
    const user = await this.accountService.findOneByEmail(email)
    return user !== null
  }

  async createUser(payloadAccountDto: AccountPayloadDto): Promise<any> {
    const saltRounds = 10
    const hash = await bcrypt.hash(payloadAccountDto.password, saltRounds)
    const passwordHash = hash
    return await this.accountService.create(payloadAccountDto, passwordHash)
  }

  async checkOAuth(payload: OAuthPayloadDto) {
    const googleResponse = await axios.post(`https://oauth2.googleapis.com/tokeninfo?id_token=${payload.tokenId}`)
    const { data: { email } } = googleResponse
    return email === payload.email
  }

  async checkOAuthExt(payload: OAuthPayloadDto) {
    const googleResponse = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${payload.tokenId}`)
    console.log('google repsonse', googleResponse)
    const { data: { email } } = googleResponse
    return email === payload.email
  }

  async createUserOAuth(payload: OAuthPayloadDto) {
    return await this.accountService.createAccountFromOAuth(payload)
  }

  async login(account: LoginAccountDto) {
    const payload = { email: account.email, sub: 'the_secret_sauce_09013?//1' }
    const user = await this.accountService.findOneByEmail(account.email)
    return {
      userId: user._id,
      username: user.username,
      lastUpdated: user.lastUpdated,
      access_token: this.jwtService.sign(payload),
      orgs: user.orgs,
    }
  }

  async grabNewToken(email: string, jwt: string) {

    const jwtDetails = this.jwtService.decode(jwt)
    console.log('jwt Details', jwtDetails)

    // const payload = { email, sub: 'the_secret_sauce_09013?//1' }

    // const payload =

  }

  async generateResetLink(email: string, ip: string, device: string) {
    const record = await this.recordService.createPasswordChangeRecord(email, ip, device)
    const payload = { refId: record._id }
    const baseUrl = this.configService.get('WEBSITE_URL')
    const token = this.jwtService.sign(payload, { expiresIn: '20m'})
    const url = `${baseUrl}/new-password/${token}`
    this.emailService.sendEmailRequest(email, url)
    return true
  }

  async resetPassword(newPassword: string, theRecordId: string, ip: string, device: string) {
    const theRecord = await this.recordService.getPasswordChangeRecordById(theRecordId)
    const theAccount = await this.accountService.findOneByEmail(theRecord.email)
    if (!theRecord.completed) {
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(newPassword, saltRounds)
      // send email
      const baseUrl = this.configService.get('WEBSITE_URL')
      const url = `${baseUrl}/password-reset`
      this.emailService.sendEmailPasswordChangeConfirm(theAccount.email, url)
      const theResponse = await this.accountService.setNewPassword(theAccount._id, passwordHash)
      await this.recordService.completePasswordChangeRecord(theRecordId, ip, device)
      return theResponse
    } else {
      return false
    }
  }

}