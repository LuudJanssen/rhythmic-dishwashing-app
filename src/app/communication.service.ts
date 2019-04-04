import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { map } from "rxjs/operators";
import { Subscribable } from "rxjs";

interface IMessage {
  msg: any;
}

interface IConnectionState {
  pin: number;
  state: boolean;
}

@Injectable({
  providedIn: "root"
})
export class CommunicationService {
  constructor(private socket: Socket) {}

  sendMessage(data: IMessage) {
    this.socket.emit("test-backward", data);
  }

  sendBeat(beat: number) {
    this.socket.emit("beat", beat);
  }

  getMessage() {
    return this.socket.fromEvent("test-forward");
  }

  startState() {
    return this.socket.fromEvent("start-state");
  }

  connectionState(): Subscribable<IConnectionState> {
    return this.socket.fromEvent("connection-state");
  }
}
