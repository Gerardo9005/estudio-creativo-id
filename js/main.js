/**
 * ESTUDIO CREATIVO ID - ARCHIVO PRINCIPAL OPTIMIZADO (js/main.js)
 * Versión: Producción / Desarrollo Local
 * Características:
 *  - Orquestación 60fps con requestAnimationFrame para scroll y progreso.
 *  - IntersectionObserver de doble propósito: animaciones de entrada y reproducción
 *    inteligente de videos (pausa fuera de pantalla para ahorro de batería/GPU).
 *  - Decodificación cinética de texto con caracteres monoespaciados.
 *  - Consola HUD de telemetría industrial en tiempo real.
 *  - Drawer de navegación táctil con bloqueo de scroll nativo y accesibilidad ARIA.
 *  - Manejador de videos HTML5 locales con soporte estricto para iOS/Android.
 */

// Notifica inmediatamente al DOM para habilitar transiciones controladas por JS
document.documentElement.classList.add('js-ready');

document.addEventListener('DOMContentLoaded', () => {
  initScrollEngine();
  initScrollObserver();
  initNavbar();
  initTextScramble();
  initHudTypewriter();
  initTechVideos();
  initContactForm();
  setCurrentYear();

  // Margen de seguridad: Garantiza la visibilidad de la sección Hero
  // ante redes de baja latencia o renderizado inicial diferido
  setTimeout(() => {
    document.querySelectorAll('#hero [data-reveal]').forEach((el) => {
      el.classList.add('is-revealed');
    });
  }, 250);
});

/**
 * 1. Motor de Scroll: Barra de Lectura y Navbar Dinámica (requestAnimationFrame)
 */
function initScrollEngine() {
  const progressBar = document.getElementById('scrollProgress');
  const navbarWrap = document.querySelector('.navbar-wrapper');
  let isTicking = false;

  const onScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Actualización de la barra de progreso
    if (progressBar) {
      if (totalHeight <= 0) {
        progressBar.style.width = '0%';
      } else {
        const progress = Math.min(100, Math.max(0, (scrollY / totalHeight) * 100));
        progressBar.style.width = `${progress}%`;
      }
    }

    // Efecto de contraste y sombra en navbar
    if (navbarWrap) {
      if (scrollY > 30) {
        if (!navbarWrap.classList.contains('scrolled')) {
          navbarWrap.classList.add('scrolled');
        }
      } else {
        if (navbarWrap.classList.contains('scrolled')) {
          navbarWrap.classList.remove('scrolled');
        }
      }
    }

    isTicking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!isTicking) {
        window.requestAnimationFrame(onScroll);
        isTicking = true;
      }
    },
    { passive: true }
  );

  // Ejecución inicial preventiva
  onScroll();
}

/**
 * 2. Motor de Animaciones de Scroll [data-reveal]
 */
function initScrollObserver() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;

  // Revelar de inmediato elementos visibles en el viewport inicial
  elements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 30) {
      el.classList.add('is-revealed');
    }
  });

  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const observerOptions = {
    root: null,
    threshold: 0.08,
    rootMargin: '0px 0px -20px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.getAttribute('data-delay') || '0', 10);

        if (delay > 0) {
          setTimeout(() => {
            el.classList.add('is-revealed');
          }, delay);
        } else {
          el.classList.add('is-revealed');
        }

        observer.unobserve(el);
      }
    });
  }, observerOptions);

  elements.forEach((el) => revealObserver.observe(el));
}

/**
 * 3. Barra de Navegación, Menú Drawer Móvil y Bloqueo de Scroll
 */
function initNavbar() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link, .btn-nav-cta');

  if (!navToggle || !navMenu) return;

  const toggleMenu = (forceState) => {
    const isOpening = forceState !== undefined ? forceState : !navMenu.classList.contains('active');
    
    navMenu.classList.toggle('active', isOpening);
    navToggle.classList.toggle('active', isOpening);
    document.body.classList.toggle('menu-open', isOpening);
    navToggle.setAttribute('aria-expanded', isOpening ? 'true' : 'false');
  };

  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Cerrar al pulsar un enlace de navegación
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMenu(false);
      }
    });
  });

  // Cerrar al pulsar fuera del menú en pantallas táctiles
  document.addEventListener('click', (e) => {
    if (
      navMenu.classList.contains('active') &&
      !navMenu.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      toggleMenu(false);
    }
  });

  // Cerrar automáticamente si el viewport supera el punto de ruptura móvil (768px)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
      toggleMenu(false);
    }
  });
}

/**
 * 4. Efecto de Decodificación Cinética (Text Scramble)
 */
function initTextScramble() {
  const target = document.getElementById('scrambleTarget');
  if (!target) return;

  const finalPhrase = 'DIGITALES & MECÁNICAS.';
  const chars = '01#@%&<>*+-/[]{}_~!';
  let iteration = 0;
  let interval = null;

  function runScramble() {
    clearInterval(interval);

    interval = setInterval(() => {
      target.innerText = finalPhrase
        .split('')
        .map((char, index) => {
          if (index < iteration) {
            return finalPhrase[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iteration >= finalPhrase.length) {
        clearInterval(interval);
      }

      iteration += 1 / 2;
    }, 40);
  }

  setTimeout(runScramble, 250);
}

/**
 * 5. Consola HUD de Telemetría Industrial (Typewriter Loop)
 */
function initHudTypewriter() {
  const hudElement = document.getElementById('hudTypewriter');
  if (!hudElement) return;

  const logs = [
    'Ciclo de escaneo PLC OK (Tiempo: 1.1ms)',
    'Conexión Modbus-TCP en puerto 502 establecida',
    'Lazo PID calibrado: Margen de error < 0.05%',
    'Segmentación de red industrial OT/IT: ACTIVA',
    'Telemetría de actuadores lista para SCADA',
    'Servidor WebSocket local: 0 paquetes perdidos'
  ];

  let logIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 50;

  function typeCycle() {
    const current = logs[logIndex];

    if (!isDeleting) {
      hudElement.textContent = current.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(typeCycle, 2400);
        return;
      }
    } else {
      hudElement.textContent = current.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        logIndex = (logIndex + 1) % logs.length;
        setTimeout(typeCycle, 400);
        return;
      }
    }

    const currentSpeed = isDeleting ? typingSpeed / 2 : typingSpeed;
    setTimeout(typeCycle, currentSpeed);
  }

  typeCycle();
}

/**
 * 6. Manejador de Videos Técnicos HTML5 Locales
 * Optimización:
 *  - Autoplay forzado con mute a nivel propiedad y atributo.
 *  - Pausa inteligente cuando el video sale del campo visual (ahorro de batería y GPU).
 *  - Desbloqueo ante primera interacción si el navegador aplica directiva de ahorro de datos.
 */
function initTechVideos() {
  const videos = document.querySelectorAll('.tech-video');
  if (!videos.length) return;

  // Observador para reproducir sólo cuando el contenedor sea visible
  const videoVisibilityObserver = ('IntersectionObserver' in window)
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const vid = entry.target;
            if (entry.isIntersecting) {
              const playPromise = vid.play();
              if (playPromise !== undefined) {
                playPromise.catch(() => {});
              }
            } else {
              vid.pause();
            }
          });
        },
        { threshold: 0.15 }
      )
    : null;

  videos.forEach((video, index) => {
    // Requisitos universales de autoplay en navegadores modernos
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

    const sourceEl = video.querySelector('source');
    const sourceUrl = sourceEl ? sourceEl.getAttribute('src') : video.getAttribute('src');

    // Detección y log de carga
    if (sourceEl) {
      sourceEl.addEventListener('error', () => {
        console.error(
          `❌ [Video ${index + 1}]: No se encontró o falló el archivo en: "${sourceUrl}".`
        );
      });
    }

    video.addEventListener('loadeddata', () => {
      console.log(`✅ [Video ${index + 1} OK]: ${sourceUrl}`);
    });

    // Conectar observador de visibilidad
    if (videoVisibilityObserver) {
      videoVisibilityObserver.observe(video);
    } else {
      video.play().catch(() => {});
    }

    // Fallback: Si el sistema operativo tiene activado modo de ahorro de batería estricto
    const unlockAutoplay = () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
      window.removeEventListener('touchstart', unlockAutoplay);
      window.removeEventListener('click', unlockAutoplay);
    };

    window.addEventListener('touchstart', unlockAutoplay, { once: true, passive: true });
    window.addEventListener('click', unlockAutoplay, { once: true });
  });
}

/**
 * 7. Manejo del Formulario de Contacto
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Registro estructurado para desarrollo y auditoría local
    console.group('🚀 [Estudio Creativo ID] Solicitud de Proyecto Recibida:');
    console.table(data);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();

    feedback.textContent = `¡Gracias, ${data.name}! Hemos registrado tu solicitud para "${data.service}". Analizaremos tus parámetros técnicos y nos pondremos en contacto.`;
    feedback.className = 'form-feedback success';

    form.reset();

    setTimeout(() => {
      feedback.style.display = 'none';
      feedback.className = 'form-feedback';
    }, 6000);
  });
}

/**
 * 8. Actualización Dinámica del Año de Copyright
 */
function setCurrentYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
