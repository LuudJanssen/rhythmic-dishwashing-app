import { Component } from "@angular/core";
import { CommunicationService } from "./communication.service";

interface PinSounds {
  pin: number;
  sound: string;
  variants: number[];
  loaded?: HTMLAudioElement[];
  rhythm: number[];
  rhythmIndex: number;
}

const pinSoundMappings: PinSounds[] = [
  {
    pin: 2,
    sound: "human",
    variants: [1, 2, 3, 4],
    rhythm: [0, 1, 2, 3],
    rhythmIndex: 0
  },
  {
    pin: 4,
    sound: "snap",
    variants: [1],
    rhythm: [0],
    rhythmIndex: 0
  },
  {
    pin: 7,
    sound: "shout",
    variants: [1, 2, 3, 4],
    rhythm: [0, 1, 2, 3],
    rhythmIndex: 0
  },
  {
    pin: 8,
    sound: "bass",
    variants: [1, 2, 3, 4],
    rhythm: [0, 1, 2, 3],
    rhythmIndex: 0
  },
  {
    pin: 12,
    sound: "scratch",
    variants: [1, 2, 3, 4],
    rhythm: [0, 1, 2, 3],
    rhythmIndex: 0
  }
];

pinSoundMappings.forEach(pinSoundMapping => {
  const { variants, sound } = pinSoundMapping;
  pinSoundMapping.loaded = variants.map(variant => {
    const audio = new Audio(`assets/sounds/${sound}-${variant}.wav`);
    audio.preload = "auto";
    return audio;
  });
});

const pinSoundMap = new Map();

pinSoundMappings.forEach(pinSoundMappings =>
  pinSoundMap.set(pinSoundMappings.pin, pinSoundMappings)
);

const music = new Audio("assets/sounds/music.wav");
music.loop = true;
music.volume = 0.6;
music.preload = "auto";

let beat = 0;

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
  beatInterval: any;

  constructor(private communicationService: CommunicationService) {}

  ngOnInit() {
    this.communicationService.getMessage().subscribe(msg => {
      console.log(msg);
      this.msg = "1st " + msg;
    });

    this.communicationService.connectionState().subscribe(state => {
      console.log("connection", state);

      const pinSoundMapping = pinSoundMap.get(state.pin);
      const variantToPlay = pinSoundMapping.rhythm[pinSoundMapping.rhythmIndex];

      console.log(pinSoundMapping.loaded[variantToPlay]);

      this.playSound(pinSoundMapping.loaded[variantToPlay]);

      if (pinSoundMapping.rhythmIndex === pinSoundMapping.rhythm.length - 1) {
        pinSoundMapping.rhythmIndex = 0;
      } else {
        pinSoundMapping.rhythmIndex++;
      }
    });

    this.communicationService.startState().subscribe(({ start }) => {
      console.log("start", start);

      if (start && music.currentTime === 0) {
        this.playSound(music);
        this.watchBeats(music);
        this.startTimer();
      }
    });
  }

  playSound(sound: HTMLAudioElement) {
    sound.pause();
    sound.currentTime = 0;
    sound.play();
  }

  watchBeats(sound: HTMLAudioElement) {
    let previousIndex = 0;

    sound.addEventListener("timeupdate", () => {
      const time = sound.currentTime;

      if (time < previousIndex) {
        this.startTimer();
      }

      previousIndex = time;
    });
  }

  startTimer() {
    console.log("(re)started timer");
    beat = 0;
    clearInterval(this.beatInterval);
    this.sendBeat();
    this.beatInterval = setInterval(() => this.sendBeat(), 500);
  }

  sendMsg(msg) {
    this.communicationService.sendMessage(msg);
  }

  sendBeat() {
    this.communicationService.sendBeat(beat);

    if (beat === 3) {
      beat = 0;
    } else {
      beat++;
    }
  }
}
