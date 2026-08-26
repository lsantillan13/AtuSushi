/* =========================================================
   ATU SUSHI — INTERACTIONS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =========================================================
     CONFIGURACIÓN DEL NEGOCIO
     Reemplazá estos datos por los reales de ATU.
     ========================================================= */

  const BUSINESS = {
    whatsapp: "5492990000000",
    email: "hola@atusushi.com.ar",
    pedidosYa: "#",
    rappi: "#"
  };

  /* =========================================================
     HELPERS
     ========================================================= */

  const qs = (selector, parent = document) =>
    parent.querySelector(selector);

  const qsa = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  const safeText = (value) =>
    String(value ?? "").trim();

  /* =========================================================
     AÑO AUTOMÁTICO
     ========================================================= */

  qsa("[data-current-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  /* =========================================================
     SCROLL PROGRESS
     ========================================================= */

  const progressBar = qs("[data-scroll-progress]");

  const updateScrollProgress = () => {
    if (!progressBar) return;

    const documentHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress =
      documentHeight > 0
        ? (window.scrollY / documentHeight) * 100
        : 0;

    progressBar.style.width = `${Math.min(progress, 100)}%`;
  };

  window.addEventListener("scroll", updateScrollProgress, {
    passive: true
  });

  updateScrollProgress();

  /* =========================================================
     MOBILE MENU
     ========================================================= */

  const menuButton = qs("[data-menu-toggle]");
  const mobileMenu = qs("[data-mobile-menu]");
  const mobileMenuLinks = qsa("[data-mobile-link]");

  const setMenuState = (open) => {
    if (!menuButton || !mobileMenu) return;

    menuButton.setAttribute("aria-expanded", String(open));
    mobileMenu.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  };

  menuButton?.addEventListener("click", () => {
    const isOpen =
      menuButton.getAttribute("aria-expanded") === "true";

    setMenuState(!isOpen);
  });

  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuState(false);
    }
  });

  /* =========================================================
     HEADER AL HACER SCROLL
     ========================================================= */

  const header = qs("[data-header]");

  const updateHeader = () => {
    if (!header) return;

    header.classList.toggle(
      "is-scrolled",
      window.scrollY > 50
    );
  };

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  updateHeader();

  /* =========================================================
     INTERSECTION OBSERVER
     ========================================================= */

  const animatedElements = qsa(
    "[data-reveal], .reveal, .fade-up"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");

          observerInstance.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    animatedElements.forEach((element) => {
      observer.observe(element);
    });
  } else {
    animatedElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  /* =========================================================
     MENÚ — FILTROS
     ========================================================= */

  const filterButtons = qsa("[data-filter]");
  const menuItems = qsa("[data-category]");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-pressed", "false");
      });

      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      menuItems.forEach((item) => {
        const category = item.dataset.category;

        const shouldShow =
          filter === "all" || category === filter;

        item.classList.toggle(
          "is-hidden",
          !shouldShow
        );
      });
    });
  });

  /* =========================================================
     SMOOTH SCROLL
     ========================================================= */

  qsa('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (
        !targetId ||
        targetId === "#" ||
        targetId.length < 2
      ) {
        return;
      }

      const target = qs(targetId);

      if (!target) return;

      event.preventDefault();

      const headerHeight =
        header?.offsetHeight || 0;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    });
  });

  /* =========================================================
     MARQUEE DINÁMICO
     ========================================================= */

  qsa("[data-marquee]").forEach((marquee) => {
    const track = qs("[data-marquee-track]", marquee);

    if (!track) return;

    const content = track.innerHTML;

    track.innerHTML = `${content}${content}`;
  });

  /* =========================================================
     BOTONES DE WHATSAPP
     ========================================================= */

  const whatsappBase =
    `https://wa.me/${BUSINESS.whatsapp}`;

  const createWhatsAppUrl = (message) => {
    return `${whatsappBase}?text=${encodeURIComponent(message)}`;
  };

  qsa("[data-whatsapp]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      const message =
        button.dataset.whatsapp ||
        "Hola ATU Sushi, quiero hacer una consulta.";

      window.open(
        createWhatsAppUrl(message),
        "_blank",
        "noopener,noreferrer"
      );
    });
  });

  /* =========================================================
     PEDIR UN PRODUCTO
     ========================================================= */

  qsa("[data-order-item]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      const item =
        safeText(button.dataset.orderItem) ||
        "un producto";

      const message =
        `Hola ATU Sushi 👋\n\n` +
        `Quiero pedir: ${item}.\n\n` +
        `¿Me pueden pasar disponibilidad y precio?`;

      window.open(
        createWhatsAppUrl(message),
        "_blank",
        "noopener,noreferrer"
      );
    });
  });

  /* =========================================================
     FORMULARIO DE RESERVAS
     ========================================================= */

  const reservationForm =
    qs("[data-reservation-form]");

  reservationForm?.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const formData =
        new FormData(reservationForm);

      const name =
        safeText(formData.get("name"));

      const date =
        safeText(formData.get("date"));

      const time =
        safeText(formData.get("time"));

      const guests =
        safeText(formData.get("guests"));

      const message =
        safeText(formData.get("message"));

      let whatsappMessage =
        `Hola ATU Sushi 👋\n\n` +
        `Quiero consultar por una reserva.\n\n` +
        `Nombre: ${name || "No indicado"}\n` +
        `Fecha: ${date || "No indicada"}\n` +
        `Hora: ${time || "No indicada"}\n` +
        `Personas: ${guests || "No indicado"}`;

      if (message) {
        whatsappMessage +=
          `\nMensaje: ${message}`;
      }

      window.open(
        createWhatsAppUrl(whatsappMessage),
        "_blank",
        "noopener,noreferrer"
      );
    }
  );

  /* =========================================================
     VALIDACIÓN DE FECHA
     ========================================================= */

  const reservationDate =
    qs('input[name="date"]');

  if (reservationDate) {
    const today =
      new Date().toISOString().split("T")[0];

    reservationDate.min = today;
  }

  /* =========================================================
     DELIVERY
     ========================================================= */

  qsa("[data-delivery-link]").forEach((link) => {
    const platform = link.dataset.deliveryLink;

    if (platform === "pedidosya") {
      link.href = BUSINESS.pedidosYa;
    }

    if (platform === "rappi") {
      link.href = BUSINESS.rappi;
    }
  });

  /* =========================================================
     RESEÑAS — SLIDER
     ========================================================= */

  const reviews =
    qsa("[data-review]");

  const reviewDots =
    qsa("[data-review-dot]");

  let currentReview = 0;
  let reviewInterval = null;

  const showReview = (index) => {
    if (!reviews.length) return;

    currentReview =
      (index + reviews.length) %
      reviews.length;

    reviews.forEach((review, i) => {
      const active = i === currentReview;

      review.classList.toggle(
        "active",
        active
      );

      review.setAttribute(
        "aria-hidden",
        String(!active)
      );
    });

    reviewDots.forEach((dot, i) => {
      const active = i === currentReview;

      dot.classList.toggle(
        "active",
        active
      );

      dot.setAttribute(
        "aria-selected",
        String(active)
      );
    });
  };

  const startReviewAutoplay = () => {
    if (reviews.length <= 1) return;

    clearInterval(reviewInterval);

    reviewInterval = setInterval(() => {
      showReview(currentReview + 1);
    }, 5000);
  };

  reviewDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showReview(index);
      startReviewAutoplay();
    });
  });

  showReview(0);
  startReviewAutoplay();

  /* =========================================================
     PAUSAR AUTOPLAY CUANDO EL USUARIO INTERACTÚA
     ========================================================= */

  const reviewContainer =
    qs("[data-reviews-slider]");

  reviewContainer?.addEventListener(
    "mouseenter",
    () => {
      clearInterval(reviewInterval);
    }
  );

  reviewContainer?.addEventListener(
    "mouseleave",
    () => {
      startReviewAutoplay();
    }
  );

  /* =========================================================
     LIGHTBOX DE GALERÍA
     ========================================================= */

  const galleryItems =
    qsa("[data-gallery-item]");

  const lightbox =
    qs("[data-lightbox]");

  const lightboxImage =
    qs("[data-lightbox-image]");

  const lightboxClose =
    qs("[data-lightbox-close]");

  const lightboxCaption =
    qs("[data-lightbox-caption]");

  const openLightbox = (item) => {
    if (!lightbox || !lightboxImage) return;

    const image =
      item.querySelector("img");

    if (!image) return;

    const source =
      image.currentSrc ||
      image.src;

    lightboxImage.src = source;

    lightboxImage.alt =
      image.alt || "";

    if (lightboxCaption) {
      lightboxCaption.textContent =
        image.alt || "";
    }

    lightbox.classList.add("is-open");
    lightbox.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "lightbox-open"
    );
  };

  const closeLightbox = () => {
    if (!lightbox) return;

    lightbox.classList.remove(
      "is-open"
    );

    lightbox.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove(
      "lightbox-open"
    );

    if (lightboxImage) {
      lightboxImage.src = "";
    }
  };

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      openLightbox(item);
    });

    item.addEventListener("keydown", (event) => {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        openLightbox(item);
      }
    });
  });

  lightboxClose?.addEventListener(
    "click",
    closeLightbox
  );

  lightbox?.addEventListener(
    "click",
    (event) => {
      if (
        event.target === lightbox
      ) {
        closeLightbox();
      }
    }
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Escape" &&
        lightbox?.classList.contains(
          "is-open"
        )
      ) {
        closeLightbox();
      }
    }
  );

  /* =========================================================
     IMÁGENES — FALLBACK
     ========================================================= */

  qsa("img").forEach((image) => {
    image.addEventListener(
      "error",
      () => {
        image.classList.add(
          "image-error"
        );
      },
      { once: true }
    );
  });

  /* =========================================================
     REDUCED MOTION
     ========================================================= */

  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  if (prefersReducedMotion) {
    document.documentElement.classList.add(
      "reduced-motion"
    );

    clearInterval(reviewInterval);
  }

  /* =========================================================
     STICKY CTA MOBILE
     ========================================================= */

  const stickyCta =
    qs("[data-sticky-cta]");

  const hero =
    qs("#inicio");

  const updateStickyCta = () => {
    if (!stickyCta || !hero) return;

    const heroBottom =
      hero.getBoundingClientRect().bottom;

    const isMobile =
      window.innerWidth <= 768;

    stickyCta.classList.toggle(
      "is-visible",
      isMobile && heroBottom < 0
    );
  };

  window.addEventListener(
    "scroll",
    updateStickyCta,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    updateStickyCta
  );

  updateStickyCta();

  /* =========================================================
     CONTACTO — EMAIL
     ========================================================= */

  qsa("[data-email-link]").forEach((link) => {
    link.href =
      `mailto:${BUSINESS.email}`;
  });

  /* =========================================================
     LOG DE DESARROLLO
     ========================================================= */

  console.log(
    "%cATU Sushi",
    "font-size: 20px; font-weight: bold;"
  );

  console.log(
    "Web cargada correctamente."
  );
});