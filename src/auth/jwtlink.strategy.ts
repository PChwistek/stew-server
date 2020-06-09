
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, BadGatewayException, BadRequestException } from '@nestjs/common'
import { ConfigService } from '../config/config.service'

@Injectable()
export class JwtLinkStrategy extends PassportStrategy(Strategy, 'jwt-link') {

  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    })
  }

  async validate(payload: any) {
    const { refId } = payload

    if (!refId) {
      throw new BadRequestException()
    }

    const tokenPayload = {
      refId,
    }
    return tokenPayload
  }
}