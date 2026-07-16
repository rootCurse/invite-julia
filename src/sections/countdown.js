export function initCountdown() {
  const row = document.getElementById("countdown-row");
  if (!row) return;

  const target = new Date(row.dataset.target).getTime();
  const numEls = {
    days: row.querySelector('[data-unit="days"]'),
    hours: row.querySelector('[data-unit="hours"]'),
    minutes: row.querySelector('[data-unit="minutes"]'),
    seconds: row.querySelector('[data-unit="seconds"]'),
  };

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      numEls.days.textContent = "00";
      numEls.hours.textContent = "00";
      numEls.minutes.textContent = "00";
      numEls.seconds.textContent = "00";
      clearInterval(intervalId);
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    numEls.days.textContent = pad(days);
    numEls.hours.textContent = pad(hours);
    numEls.minutes.textContent = pad(minutes);
    numEls.seconds.textContent = pad(seconds);
  }

  tick();
  const intervalId = setInterval(tick, 1000);
}
