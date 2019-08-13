
import { Controller, Get } from '@nestjs/common'
import { SocketService } from './socket.service'

@Controller('socket')
export class SocketController {
  constructor(private readonly socketService: SocketService) {}

  @Get('/connect')
  connect(): string {
    return this.socketService.connect()
  }
}