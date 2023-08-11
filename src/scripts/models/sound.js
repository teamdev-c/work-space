import bgm from "/bgm.mp3";
import landEffect from "/landEffect.mp3";
import clearEffect from "/clearEffect.mp3";
export class SoundModel {
  #isAllowed;
  #bgm;
  #landEffect;
  #clearEffect;

  constructor() {
    this.#isAllowed = false;
    this.#bgm = new Audio(bgm);
    this.#landEffect = new Audio(landEffect);
    this.#clearEffect = new Audio(clearEffect);
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
