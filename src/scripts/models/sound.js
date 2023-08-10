export class SoundModel {
  #isAllowed;
  #bgm;
  #soundEffect;
  #disappearEffect;

  constructor() {
    this.#isAllowed = false;
    this.#bgm = new Audio("/bgm.mp3");
    this.#soundEffect = new Audio("/block.mp3");
    this.#disappearEffect = new Audio("/disappear.mp3");
  }

  getIsAllowed() {
    return this.#isAllowed;
  }

  updateSound() {
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

  playSoundEffect() {
    this.#soundEffect.play();
    this.#soundEffect.volume = 1.0;
  }

  playDisappearEffect() {
    this.#disappearEffect.play();
    this.#disappearEffect.volume = 1.0;
  }
}
