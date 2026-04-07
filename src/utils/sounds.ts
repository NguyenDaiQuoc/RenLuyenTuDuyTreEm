const SOUNDS = {
  correct: "https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3",
  wrong: "https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3",
  click: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
  levelUp: "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3",
};

export const playSound = (type: keyof typeof SOUNDS) => {
  const audio = new Audio(SOUNDS[type]);
  audio.volume = 0.5;
  audio.play().catch(err => console.log("Sound blocked by browser:", err));
};
