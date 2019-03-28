import { Component } from "@angular/core";
import { CommunicationService } from "./communication.service";

@Component({
  selector: "app-root",
  template: `
    <!--The content below is only a placeholder and can be replaced.-->
    <div style="text-align:center">
      <h1>Welcome to {{ title }}!</h1>
      <h1>Message: {{ msg }}</h1>
      <input type="text" #msgInput name="" value="" />
      <button
        (mousedown)="sendMsg(msgInput.value)"
        (mouseup)="sendMsg(msgInput.value)"
      >
        Send
      </button>
      <img
        width="300"
        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTAgMjUwIj4KICAgIDxwYXRoIGZpbGw9IiNERDAwMzEiIGQ9Ik0xMjUgMzBMMzEuOSA2My4ybDE0LjIgMTIzLjFMMTI1IDIzMGw3OC45LTQzLjcgMTQuMi0xMjMuMXoiIC8+CiAgICA8cGF0aCBmaWxsPSIjQzMwMDJGIiBkPSJNMTI1IDMwdjIyLjItLjFWMjMwbDc4LjktNDMuNyAxNC4yLTEyMy4xTDEyNSAzMHoiIC8+CiAgICA8cGF0aCAgZmlsbD0iI0ZGRkZGRiIgZD0iTTEyNSA1Mi4xTDY2LjggMTgyLjZoMjEuN2wxMS43LTI5LjJoNDkuNGwxMS43IDI5LjJIMTgzTDEyNSA1Mi4xem0xNyA4My4zaC0zNGwxNy00MC45IDE3IDQwLjl6IiAvPgogIDwvc3ZnPg=="
      />
    </div>
    <h2>Here are some links to help you start:</h2>
    <ul>
      <li>
        <h2>
          <a target="_blank" rel="noopener" href="https://angular.io/tutorial"
            >Tour of Heroes</a
          >
        </h2>
      </li>
      <li>
        <h2>
          <a target="_blank" rel="noopener" href="https://angular.io/cli"
            >CLI Documentation</a
          >
        </h2>
      </li>
      <li>
        <h2>
          <a target="_blank" rel="noopener" href="https://blog.angular.io/"
            >Angular blog</a
          >
        </h2>
      </li>
    </ul>
  `,
  providers: [CommunicationService],
  styles: []
})
export class AppComponent {
  msg: string;
  title = "rhythmic-dishwashing-app";

  constructor(private communicationService: CommunicationService) {}

  ngOnInit() {
    const bass = new Audio("assets/sounds/bass.wav");
    const clap = new Audio("assets/sounds/clap.wav");
    const brass = new Audio("assets/sounds/brass.wav");
    const synth = new Audio("assets/sounds/synth.wav");
    const noot = new Audio("assets/sounds/noot.mp4");

    const connectionSound = new Map([
      [3, noot],
      [4, bass],
      [5, clap],
      [6, brass],
      [7, synth]
    ]);

    this.communicationService.getMessage().subscribe(msg => {
      console.log(msg);
      this.msg = "1st " + msg;
    });

    this.communicationService.connectionState().subscribe(state => {
      console.log("connection", state);
      this.playSound(connectionSound.get(state.pin));
    });
  }

  playSound(sound: HTMLAudioElement) {
    sound.pause();
    sound.currentTime = 0;
    sound.play();
  }

  sendMsg(msg) {
    this.communicationService.sendMessage(msg);
  }
}
