
import { Injectable } from '@nestjs/common'

@Injectable()
export class SocketService {

  connect(): string{
    return 'connected'
  }
}