(function () {
  const STORAGE_KEY = "intel-site-lang";
  const htmlEl = document.documentElement;
  const langToggle = document.getElementById("langToggle");
  const langToggleLabel = document.getElementById("langToggleLabel");

  /**
   * Apply a language: sets <html lang> + dir, swaps every
   * data-i18n tagged element's text, and updates the toggle button.
   */
  function applyLanguage(lang) {
    const dict = translations[lang] || translations.en;
    const isRTL = lang === "ar";

    htmlEl.setAttribute("lang", lang);
    htmlEl.setAttribute("dir", isRTL ? "rtl" : "ltr");

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    // Toggle button always shows the *other* language as the action
    langToggleLabel.textContent = dict.langToggleLabel;
    langToggle.setAttribute(
      "aria-label",
      isRTL ? "Switch to English" : "التبديل إلى العربية"
    );

    localStorage.setItem(STORAGE_KEY, lang);
  }

  /**
   * BONUS: LevelUp - Auto-Detect Language & Adjust Layout.
   * On first visit (no saved preference), detect the browser's
   * language and switch to Arabic/RTL automatically if it matches.
   */
  function detectInitialLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;

    const browserLang = (navigator.language || navigator.userLanguage || "en").toLowerCase();
    return browserLang.startsWith("ar") ? "ar" : "en";
  }

  langToggle.addEventListener("click", () => {
    const current = htmlEl.getAttribute("lang") === "ar" ? "ar" : "en";
    applyLanguage(current === "ar" ? "en" : "ar");
  });

  applyLanguage(detectInitialLanguage());

  // ---------- Accessible newsletter form handling ----------
  const form = document.getElementById("newsletterForm");
  const status = document.getElementById("formStatus");
  const nameInput = document.getElementById("newsletterName");
  const emailInput = document.getElementById("newsletterEmail");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const lang = htmlEl.getAttribute("lang") === "ar" ? "ar" : "en";
    const dict = translations[lang];
    const nameValid = nameInput.value.trim().length > 0;
    const emailValid = emailInput.checkValidity();

    if (!nameValid || !emailValid) {
      status.textContent = dict.formError;
      status.classList.remove("form-status-success");
      status.classList.add("form-status-error");
      if (!nameValid) {
        nameInput.focus();
      } else {
        emailInput.focus();
      }
      return;
    }

    status.textContent = dict.formSuccess;
    status.classList.remove("form-status-error");
    status.classList.add("form-status-success");
    form.reset();
  });
})();