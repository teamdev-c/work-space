export class SoundView {
  static switchToVolumeOn() {
    const soundButton = document.getElementById("js-audio-button");
    soundButton.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
  }

  static switchToVolumeOff() {
    const soundButton = document.getElementById("js-audio-button");
    soundButton.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
  }
}
