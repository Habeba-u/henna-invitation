const body = document.body;
const scene = document.getElementById("scene");
const seal = document.getElementById("seal");
const scrollBtn = document.getElementById("scrollBtn");
const bgMusic = document.getElementById("bgMusic");

const brideMessage = document.getElementById("brideMessage");
const previewText = document.getElementById("previewText");
const messagePreview = document.getElementById("messagePreview");

const bgButtons = document.querySelectorAll(".color-btn");
const fontButtons = document.querySelectorAll(".font-btn");
const fontFamily = document.getElementById("fontFamily");
const fontSize = document.getElementById("fontSize");

const revealEls = document.querySelectorAll(".reveal");

const messageForm = document.getElementById("messageForm");
const sendBtn = document.getElementById("sendBtn");
const successModal = document.getElementById("successModal");
const successClose = document.getElementById("successClose");
const successBackdrop = document.getElementById("successBackdrop");

const targetDate = new Date("2026-06-24T00:00:00");
const monthsEl = document.getElementById("months");
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function openInvitation() {
  if (!scene || scene.classList.contains("opened")) return;

  scene.classList.add("opened");

  setTimeout(() => {
    body.classList.remove("is-locked");
    scrollBtn?.classList.remove("hidden");
  }, 900);

  if (bgMusic) {
    bgMusic.volume = 0.45;
    bgMusic.play().catch(() => {});
  }
}

seal?.addEventListener("click", openInvitation);
seal?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openInvitation();
  }
});

scrollBtn?.addEventListener("click", () => {
  document.getElementById("mainContent")?.scrollIntoView({ behavior: "smooth" });
});

function updateCountdown() {
  const now = new Date();

  if (now >= targetDate) {
    monthsEl.textContent = "0";
    daysEl.textContent = "0";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    return;
  }

  let years = targetDate.getFullYear() - now.getFullYear();
  let months = targetDate.getMonth() - now.getMonth();
  let days = targetDate.getDate() - now.getDate();

  if (days < 0) {
    months -= 1;
    const previousMonthDays = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0).getDate();
    days += previousMonthDays;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalMonths = years * 12 + months;
  const diff = targetDate - now;
  const totalSeconds = Math.floor(diff / 1000);

  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  monthsEl.textContent = totalMonths;
  daysEl.textContent = days;
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

brideMessage?.addEventListener("input", () => {
  const value = brideMessage.value.trim();
  previewText.textContent = value || "اكتبي رسالة جميلة للعروسة… ✨";
});

bgButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    bgButtons.forEach((item) => item.classList.remove("is-active"));
    btn.classList.add("is-active");

    const bg = btn.dataset.bg;
    messagePreview.style.background = bg;

    if (bg === "#5a1630") {
      previewText.style.color = "#ffffff";
    }
  });
});

fontButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    fontButtons.forEach((item) => item.classList.remove("is-active"));
    btn.classList.add("is-active");
    previewText.style.color = btn.dataset.color;
  });
});

fontFamily?.addEventListener("change", () => {
  previewText.style.fontFamily = fontFamily.value;
});

fontSize?.addEventListener("input", () => {
  previewText.style.fontSize = `${fontSize.value}px`;
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
    }
  });
}, { threshold: 0.12 });

revealEls.forEach((el) => observer.observe(el));

function showSuccessModal() {
  successModal?.classList.add("show");
  successModal?.setAttribute("aria-hidden", "false");
}

function hideSuccessModal() {
  successModal?.classList.remove("show");
  successModal?.setAttribute("aria-hidden", "true");
}

successClose?.addEventListener("click", hideSuccessModal);
successBackdrop?.addEventListener("click", hideSuccessModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") hideSuccessModal();
});

messageForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const messageValue = brideMessage?.value.trim();
  if (!messageValue) {
    brideMessage?.focus();
    return;
  }

  sendBtn?.classList.add("is-loading");
  if (sendBtn) sendBtn.disabled = true;

  const formData = new FormData(messageForm);

  try {
    const response = await fetch(messageForm.action, {
      method: messageForm.method,
      body: formData,
      headers: {
        Accept: "application/json"
      }
    });

    if (response.ok) {
      messageForm.reset();

      previewText.textContent = "اكتبي رسالة جميلة للعروسة… ✨";
      previewText.style.color = "#5a1630";
      previewText.style.fontFamily = "";
      previewText.style.fontSize = "24px";
      messagePreview.style.background = "";

      bgButtons.forEach((item) => item.classList.remove("is-active"));
      fontButtons.forEach((item) => item.classList.remove("is-active"));

      bgButtons[0]?.classList.add("is-active");
      fontButtons[0]?.classList.add("is-active");

      showSuccessModal();
    } else {
      alert("حصلت مشكلة بسيطة في إرسال الرسالة. حاولي مرة تانية.");
    }
  } catch (error) {
    alert("تعذر الإرسال حاليًا. تأكدي من الاتصال بالإنترنت وحاولي مرة أخرى.");
  } finally {
    sendBtn?.classList.remove("is-loading");
    if (sendBtn) sendBtn.disabled = false;
  }
});