import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets'
import { from, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Client, Server } from 'socket.io'

@WebSocketGateway(3008)
export class DeviceGateway {
  @WebSocketServer()
  server: Server

  @SubscribeMessage('events')
  handleEvent(client: Client, data: unknown): WsResponse<unknown> {
    const event = 'events'
    console.log('some event', event)
    return { event, data }
  }

  @SubscribeMessage('identity')
  async identity(client: Client, data: number): Promise<number> {
    console.log('fetching identity')
    return data
  }

  @SubscribeMessage('onConnect')
   connect(client: Client, data: number): string {
    console.log('connected')
    return 'connected'
  }
}