export class SoundModel {
  #isAllowed;
  #bgm;
  #landEffect;
  #clearEffect;

  constructor() {
    this.#isAllowed = false;
    this.#bgm = new Audio("/bgm.mp3");
    this.#landEffect = new Audio("/block.mp3");
    this.#clearEffect = new Audio("/disappear.mp3");
  }

  getIsAllowed() {
    return this.#isAllowed;
  }

  updateIsAllowed() {
    this.#isAllowed = !this.#isAllowed;
  }

  playBgm() {
    this.#bgm.play();
    this.#bgm.volume = 0.1;
    this.#bgm.loop = true;
  }

  stopBgm() {
    this.#bgm.pause();
  }

  playLandEffect() {
    this.#landEffect.play();
    this.#landEffect.volume = 1.0;
  }

  playClearEffect() {
    this.#clearEffect.play();
    this.#clearEffect.volume = 1.0;
  }
}
