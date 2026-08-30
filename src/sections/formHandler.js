const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxCRQzzPNm10klK3p_3GyukNaP4avDFapie8CuWD763k_mXSjJeOs89Ml7JnY-ltkUyxw/exec";

async function submitToSheet(sheetName, data) {
  if (!APPS_SCRIPT_URL) {
    console.info(`[demo] ${sheetName} submission (Apps Script URL not configured yet):`, data);
    return { ok: true, demo: true };
  }

  // Content-Type: text/plain — "простой" заголовок без CORS-preflight (OPTIONS),
  // который Apps Script Web App не умеет обрабатывать. doPost всё равно
  // парсит тело как JSON независимо от заявленного типа.
  const response = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ sheet: sheetName, ...data }),
  });

  if (!response.ok) {
    throw new Error(`Submit failed with status ${response.status}`);
  }

  return response.json().catch(() => ({ ok: true }));
}

function setStatus(el, message, state) {
  el.textContent = message;
  el.dataset.state = state;
}

function initForm({ formId, statusId, sheetName, successMessage }) {
  const form = document.getElementById(formId);
  const status = document.getElementById(statusId);
  if (!form || !status) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Honeypot: если заполнено — тихо "успешно" завершаем, не отправляя данные.
    const honeypot = form.querySelector('input[name="company"]');
    if (honeypot && honeypot.value) {
      setStatus(status, successMessage, "success");
      form.reset();
      return;
    }

    if (!form.reportValidity()) return;

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    setStatus(status, "Отправляем…", "pending");

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    delete data.company;

    // Чекбоксы с одинаковым name (напр. drinks) — собираем все отмеченные значения в массив
    form.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      const values = formData.getAll(checkbox.name);
      if (values.length > 1) data[checkbox.name] = values;
    });

    try {
      await submitToSheet(sheetName, data);
      setStatus(status, successMessage, "success");
      form.reset();
    } catch (error) {
      console.error(error);
      setStatus(status, "Не получилось отправить. Попробуйте ещё раз чуть позже.", "error");
    } finally {
      submitButton.disabled = false;
    }
  });
}

export function initForms() {
  initForm({
    formId: "rsvp-form",
    statusId: "rsvp-status",
    sheetName: "RSVP",
    successMessage: "Спасибо! Ваш ответ получен.",
  });

  initForm({
    formId: "survey-form",
    statusId: "survey-status",
    sheetName: "Survey",
    successMessage: "Спасибо за ответы!",
  });

  // "Буду с детьми" — включаем поле с количеством только при выборе "Да"
  const kidsRadios = document.querySelectorAll('input[name="withKids"]');
  const kidsCountInput = document.querySelector('input[name="kidsCount"]');
  if (kidsRadios.length && kidsCountInput) {
    kidsRadios.forEach((radio) => {
      radio.addEventListener("change", () => {
        const isYes = document.querySelector('input[name="withKids"]:checked')?.value === "yes";
        kidsCountInput.disabled = !isYes;
        if (!isYes) kidsCountInput.value = "";
      });
    });
  }
}
