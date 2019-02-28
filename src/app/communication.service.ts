import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

interface IMessage {
  msg: any
}

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  constructor(private socket: Socket) { }

  sendMessage(data: IMessage) {
    this.socket.emit('test-backward', data)
  }

  getMessage() {
    return this.socket
      .fromEvent('test-forward')
  }
}
