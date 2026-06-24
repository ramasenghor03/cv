document.addEventListener("DOMContentLoaded", function () {
  /* Gestion du thème sombre et clair avec sauvegarde dans localStorage */

  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const body = document.body;

  function applyTheme(theme) {
    if (theme === "dark") {
      body.classList.add("dark-mode");
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
    } else {
      body.classList.remove("dark-mode");
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
    }
  }

  const savedTheme = localStorage.getItem("cv-theme") || "light";
  applyTheme(savedTheme);

  themeToggle.addEventListener("click", function () {
    const currentTheme = body.classList.contains("dark-mode")
      ? "dark"
      : "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem("cv-theme", newTheme);
    applyTheme(newTheme);
  });

  /* Menu hamburger pour la navigation mobile */

  const sidebarNav = document.getElementById("sidebar-nav");
  const hamburger = document.getElementById("menu-toggle");
  const mobileOverlay = document.getElementById("mobile-nav-overlay");

  function closeMobileMenu() {
    if (!sidebarNav || !hamburger) return;
    sidebarNav.classList.remove("open");
    document.body.classList.remove("menu-open");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Ouvrir le menu de navigation");
    if (mobileOverlay) {
      mobileOverlay.setAttribute("aria-hidden", "true");
    }
    const icon = hamburger.querySelector("i");
    if (icon) {
      icon.classList.add("fa-bars");
      icon.classList.remove("fa-times");
    }
    const label = hamburger.querySelector(".hamburger-text");
    if (label) label.textContent = "Menu";
  }

  function openMobileMenu() {
    sidebarNav.classList.add("open");
    document.body.classList.add("menu-open");
    hamburger.setAttribute("aria-expanded", "true");
    hamburger.setAttribute("aria-label", "Fermer le menu de navigation");
    if (mobileOverlay) {
      mobileOverlay.setAttribute("aria-hidden", "false");
    }
    const icon = hamburger.querySelector("i");
    if (icon) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-times");
    }
    const label = hamburger.querySelector(".hamburger-text");
    if (label) label.textContent = "Fermer";
  }

  if (hamburger && sidebarNav) {
    hamburger.addEventListener("click", function () {
      if (sidebarNav.classList.contains("open")) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    if (mobileOverlay) {
      mobileOverlay.addEventListener("click", closeMobileMenu);
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    });

    document.querySelectorAll(".sidebar-nav a").forEach(function (link) {
      link.addEventListener("click", closeMobileMenu);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) {
        closeMobileMenu();
      }
    });
  }

  /* Animation des barres de compétences au scroll avec IntersectionObserver */

  const skillFills = document.querySelectorAll(".skill-fill");

  function animateSkills(entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const targetWidth = fill.getAttribute("data-width");
        fill.style.width = targetWidth + "%";
        observer.unobserve(fill);
      }
    });
  }

  const skillObserver = new IntersectionObserver(animateSkills, {
    threshold: 0.3,
  });

  skillFills.forEach(function (fill) {
    skillObserver.observe(fill);
  });

  /* Bouton retour en haut de page */

  const backToTop = document.getElementById("back-to-top");
  const pageTop = document.getElementById("page-top");

  function getScrollPosition() {
    return (
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0
    );
  }

  function getBackToTopThreshold() {
    return window.matchMedia("(max-width: 768px)").matches ? 60 : 250;
  }

  function updateBackToTopVisibility() {
    if (!backToTop) return;
    const show = getScrollPosition() > getBackToTopThreshold();
    backToTop.classList.toggle("visible", show);
  }

  function scrollToPageTop() {
    closeMobileMenu();

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const behavior = prefersReducedMotion ? "auto" : "smooth";

    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      sidebar.scrollTop = 0;
    }

    if (pageTop) {
      pageTop.scrollIntoView({ behavior: behavior, block: "start" });
    }

    window.scrollTo({ top: 0, left: 0, behavior: behavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    if (!prefersReducedMotion) {
      window.setTimeout(function () {
        if (window.scrollY > 0) {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }
        if (sidebar) {
          sidebar.scrollTop = 0;
        }
      }, 600);
    }
  }

  window.addEventListener("scroll", updateBackToTopVisibility, {
    passive: true,
  });
  window.addEventListener("resize", updateBackToTopVisibility);
  window.addEventListener("orientationchange", updateBackToTopVisibility);
  document.addEventListener("touchend", updateBackToTopVisibility, {
    passive: true,
  });
  updateBackToTopVisibility();

  backToTop.addEventListener("click", scrollToPageTop);

  /* Gestion de la photo de profil : affichage si elle se charge correctement */

  const profilePhoto = document.getElementById("profile-photo");

  if (profilePhoto) {
    function showProfilePhoto() {
      profilePhoto.classList.add("loaded");
    }

    profilePhoto.addEventListener("load", showProfilePhoto);

    profilePhoto.addEventListener("error", function () {
      profilePhoto.classList.remove("loaded");
    });

    if (profilePhoto.complete && profilePhoto.naturalHeight > 0) {
      showProfilePhoto();
    }
  }

  /* Validation et soumission du formulaire de contact */

  const form = document.getElementById("contact-form");
  const CONTACT_EMAIL = "rmtlsnghr@gmail.com";
  // Clé de formulaire de contact sur https://web3forms.com pour mon email
  const WEB3FORMS_ACCESS_KEY = "bcb77325-df48-4429-863c-3ef03d4bef12";

  if (form) {
    const web3formsKeyInput = document.getElementById("web3forms-key");
    if (web3formsKeyInput && WEB3FORMS_ACCESS_KEY) {
      web3formsKeyInput.value = WEB3FORMS_ACCESS_KEY;
    }

    const nom = document.getElementById("contact-nom");
    const email = document.getElementById("contact-email");
    const message = document.getElementById("contact-message");
    const successMsg = document.getElementById("form-success");
    const submitBtn = form.querySelector(".btn-submit");
    const errorNom = document.getElementById("error-nom");
    const errorEmail = document.getElementById("error-email");
    const errorMessage = document.getElementById("error-message");
    const fields = [nom, email, message];

    function clearFormErrors() {
      errorNom.textContent = "";
      errorEmail.textContent = "";
      errorMessage.textContent = "";
      successMsg.textContent = "";
      fields.forEach(function (field) {
        field.classList.remove("invalid");
        field.removeAttribute("aria-invalid");
      });
    }

    function setFieldError(field, errorEl, errorText) {
      field.classList.add("invalid");
      field.setAttribute("aria-invalid", "true");
      errorEl.textContent = errorText;
    }

    fields.forEach(function (field) {
      field.addEventListener("input", function () {
        field.classList.remove("invalid");
        field.removeAttribute("aria-invalid");
        if (field === nom) errorNom.textContent = "";
        if (field === email) errorEmail.textContent = "";
        if (field === message) errorMessage.textContent = "";
        successMsg.textContent = "";
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearFormErrors();

      let isValid = true;
      let firstInvalidField = null;

      if (nom.value.trim() === "") {
        setFieldError(nom, errorNom, "Veuillez entrer votre nom.");
        firstInvalidField = nom;
        isValid = false;
      } else if (nom.value.trim().length < 2) {
        setFieldError(
          nom,
          errorNom,
          "Le nom doit contenir au moins 2 caractères.",
        );
        firstInvalidField = nom;
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email.value.trim() === "") {
        setFieldError(email, errorEmail, "Veuillez entrer votre e-mail.");
        firstInvalidField = firstInvalidField || email;
        isValid = false;
      } else if (!emailRegex.test(email.value.trim())) {
        setFieldError(email, errorEmail, "Le format de l'e-mail est invalide.");
        firstInvalidField = firstInvalidField || email;
        isValid = false;
      }

      if (message.value.trim() === "") {
        setFieldError(message, errorMessage, "Veuillez entrer votre message.");
        firstInvalidField = firstInvalidField || message;
        isValid = false;
      } else if (message.value.trim().length < 10) {
        setFieldError(
          message,
          errorMessage,
          "Le message doit contenir au moins 10 caractères.",
        );
        firstInvalidField = firstInvalidField || message;
        isValid = false;
      }

      if (!isValid) {
        firstInvalidField.focus();
        return;
      }

      if (WEB3FORMS_ACCESS_KEY) {
        submitBtn.disabled = true;

        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            name: nom.value.trim(),
            email: email.value.trim(),
            message: message.value.trim(),
            subject: "Contact CV - " + nom.value.trim(),
          }),
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            if (data.success) {
              successMsg.textContent =
                "Message envoyé avec succès ! Je vous répondrai bientôt.";
              form.reset();
            } else {
              successMsg.textContent =
                "Envoi impossible pour le moment. Écrivez à " +
                CONTACT_EMAIL +
                ".";
            }
          })
          .catch(function () {
            successMsg.textContent =
              "Erreur réseau. Écrivez directement à " + CONTACT_EMAIL + ".";
          })
          .finally(function () {
            submitBtn.disabled = false;
          });

        return;
      }

      const subject = encodeURIComponent("Contact CV - " + nom.value.trim());
      const body = encodeURIComponent(
        "Nom : " +
          nom.value.trim() +
          "\n" +
          "E-mail : " +
          email.value.trim() +
          "\n\n" +
          message.value.trim(),
      );

      window.location.href =
        "mailto:" + CONTACT_EMAIL + "?subject=" + subject + "&body=" + body;

      successMsg.textContent =
        "Votre client de messagerie va s'ouvrir. Pour un envoi direct, configurez Web3Forms dans script.js.";
      form.reset();
    });
  }
});
