
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '../config/config.service'
import { AccountService } from '../account/account.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

  constructor(config: ConfigService, private readonly accountService: AccountService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    })
  }

  async validate(payload: any) {
    const { email, sub } = payload

    if (!email || !sub) {
      throw new UnauthorizedException()
    }

    const user = await this.accountService.findOneByEmail(email)

    if (!user) {
      throw new UnauthorizedException()
    }

    const tokenPayload = {
      account: user,
      sub,
    }
    return tokenPayload
  }
}