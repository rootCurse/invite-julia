export function initMusicPlayer() {
  const audio = document.getElementById("music-audio");
  const toggle = document.getElementById("music-toggle");
  if (!audio || !toggle) return;

  // Плейсхолдер-файл ещё не добавлен (см. TODO у <audio> в index.html) —
  // отключаем кнопку вместо того, чтобы она молча ничего не делала по клику.
  audio.addEventListener("error", () => {
    toggle.disabled = true;
    toggle.title = "Трек ещё не добавлен";
    toggle.setAttribute("aria-label", "Музыка недоступна: трек ещё не добавлен");
  });

  toggle.addEventListener("click", async () => {
    if (audio.paused) {
      try {
        await audio.play();
        toggle.setAttribute("aria-pressed", "true");
        toggle.setAttribute("aria-label", "Выключить музыку");
      } catch (error) {
        console.error("Не удалось запустить трек:", error);
      }
    } else {
      audio.pause();
      toggle.setAttribute("aria-pressed", "false");
      toggle.setAttribute("aria-label", "Включить музыку");
    }
  });
}
