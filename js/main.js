/**
 * ESTUDIO CREATIVO ID - ARCHIVO PRINCIPAL (js/main.js)
 * Versión: Producción / Desarrollo Local
 * 
 * Módulos integrados:
 *  - 1. Motor de scroll 60fps (requestAnimationFrame para barra de lectura y navbar).
 *  - 2. Observador de animaciones de entrada escalonadas [data-reveal].
 *  - 3. Barra de navegación y menú drawer móvil con bloqueo de scroll nativo.
 *  - 4. Decodificador cinético de texto (Text Scramble) para el titular.
 *  - 5. Consola HUD de telemetría industrial en tiempo real (Typewriter).
 *  - 6. Controlador y diagnóstico avanzado de videos HTML5 locales (Detección MediaError,
 *       autoplay silenciado forzado, fallback de asignación directa y pausa fuera de pantalla).
 *  - 7. Gestor del formulario de contacto técnico con log estructurado y feedback dinámico.
 *  - 8. Actualizador automático del año en footer.
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
  // ante redes con latencia o carga diferida de estilos
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

    // Actualización fluida de la barra de lectura superior
    if (progressBar) {
      if (totalHeight <= 0) {
        progressBar.style.width = '0%';
      } else {
        const progress = Math.min(100, Math.max(0, (scrollY / totalHeight) * 100));
        progressBar.style.width = `${progress}%`;
      }
    }

    // Efecto de fondo y sombra en la barra de navegación
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

  onScroll();
}

/**
 * 2. Motor de Animaciones de Scroll [data-reveal]
 */
function initScrollObserver() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;

  // Revelar inmediatamente elementos visibles en el viewport inicial
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

  // Cerrar al pulsar cualquier enlace de la lista
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

  // Cerrar automáticamente si el viewport supera el tamaño móvil
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
 * 6. Manejador y Diagnóstico de Videos Técnicos HTML5 Locales
 *  - Forzado de silencio a nivel propiedad y atributo (requerimiento de autoplay).
 *  - Detección precisa de código MediaError (códec incompatible vs error de red).
 *  - Fallback con asignación directa de src si la etiqueta <source> es rechazada.
 *  - Pausa inteligente fuera del viewport (IntersectionObserver) para ahorro de GPU/batería.
 *  - Rescate de autoplay ante el primer tap/scroll si el SO tiene ahorro estricto de energía.
 */
function initTechVideos() {
  const videos = document.querySelectorAll('.tech-video');
  if (!videos.length) return;

  const errorDescriptions = {
    1: 'MEDIA_ERR_ABORTED: La descarga fue cancelada por el usuario o navegador.',
    2: 'MEDIA_ERR_NETWORK: Error de conexión de red durante la transferencia.',
    3: 'MEDIA_ERR_DECODE: Error de decodificación interna. Archivo dañado o parámetros inválidos.',
    4: 'MEDIA_ERR_SRC_NOT_SUPPORTED: Códec no compatible con este navegador (Típico de videos exportados por IA en H.265/HEVC o 10-bit; requiere transcodificación a H.264 / YUV420p).'
  };

  // Observador de visibilidad: sólo reproduce cuando la tarjeta está en pantalla
  const videoVisibilityObserver = ('IntersectionObserver' in window)
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const vid = entry.target;
            if (entry.isIntersecting) {
              if (vid.paused && vid.readyState >= 2) {
                const playPromise = vid.play();
                if (playPromise !== undefined) {
                  playPromise.catch(() => {});
                }
              }
            } else {
              if (!vid.paused) {
                vid.pause();
              }
            }
          });
        },
        { threshold: 0.15 }
      )
    : null;

  videos.forEach((video, index) => {
    // Configuración estricta para bypass de directivas de autoplay en navegadores móviles
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('loop', '');
    video.setAttribute('autoplay', '');

    const sourceEl = video.querySelector('source');
    const sourceUrl = sourceEl ? sourceEl.getAttribute('src') : video.getAttribute('src');

    // Detección detallada en etiqueta <source>
    if (sourceEl) {
      sourceEl.addEventListener('error', () => {
        const err = video.error;
        const detail = err
          ? (errorDescriptions[err.code] || `Código ${err.code}`)
          : 'El navegador recibió el stream (Status 206) pero rechazó el códec o perfil de color.';

        console.error(
          `❌ [Video ${index + 1} Rechazado]: "${sourceUrl}"\n` +
          `   Causa: ${detail}\n` +
          `   Acción: Si el video proviene de IA, conviértelo a formato web estándar H.264 (perfil YUV420p) sin audio.`
        );

        // Intento de fallback: asignar src directo a la etiqueta video si falló el source
        if (!video.src && sourceUrl) {
          video.src = sourceUrl;
          video.load();
        }
      });
    }

    // Detección directa en etiqueta <video>
    video.addEventListener('error', () => {
      const err = video.error;
      const detail = err
        ? (errorDescriptions[err.code] || `Código ${err.code}`)
        : 'Fallo al procesar recurso multimedia.';
      console.error(`❌ [Error Video ${index + 1}]: ${detail}`);
    });

    video.addEventListener('loadeddata', () => {
      console.log(`✅ [Video ${index + 1} Decodificado OK]: ${sourceUrl}`);
    });

    // Conectar observador de reproducción bajo demanda
    if (videoVisibilityObserver) {
      videoVisibilityObserver.observe(video);
    }

    // Intentar reproducción inmediata
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // En caso de bloqueo por ahorro de energía del dispositivo, iniciar al primer contacto
        const unlock = () => {
          if (video.paused) {
            video.play().catch(() => {});
          }
          window.removeEventListener('touchstart', unlock);
          window.removeEventListener('click', unlock);
          window.removeEventListener('scroll', unlock);
        };
        window.addEventListener('touchstart', unlock, { once: true, passive: true });
        window.addEventListener('click', unlock, { once: true });
        window.addEventListener('scroll', unlock, { once: true, passive: true });
      });
    }
  });
}

/**
 * 7. Manejo del Formulario de Contacto Técnico
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Registro estructurado para depuración y auditoría local
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
