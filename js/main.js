/**
 * ESTUDIO CREATIVO ID - MAIN SCRIPT (js/main.js)
 * Versión completa y optimizada para producción y desarrollo local.
 * Incluye: Control de navegación móvil con bloqueo de scroll, observador de animaciones,
 * decodificador de texto cinético, consola HUD de telemetría, detector de adblock para Pinterest
 * y procesador de formulario de contacto.
 */

// Notifica inmediatamente al CSS que JavaScript está habilitado
document.documentElement.classList.add('js-ready');

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgressBar();
  initScrollObserver();
  initNavbar();
  initTextScramble();
  initHudTypewriter();
  initContactForm();
  setCurrentYear();
  initPinterestDetector();

  // Margen de seguridad: asegura que los elementos del Hero sean visibles
  // incluso si la carga de red o el IntersectionObserver presentan demora
  setTimeout(() => {
    document.querySelectorAll('#hero [data-reveal]').forEach((el) => {
      el.classList.add('is-revealed');
    });
  }, 250);
});

/**
 * 1. Barra de progreso superior en tiempo real según el scroll
 */
function initScrollProgressBar() {
  const progressBar = document.getElementById('scrollProgress');
  if (!progressBar) return;

  const updateProgress = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) {
      progressBar.style.width = '0%';
      return;
    }
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/**
 * 2. Motor de Animaciones de Scroll con IntersectionObserver
 */
function initScrollObserver() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;

  // Revela inmediatamente los elementos que ya están en el viewport al cargar
  elements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 30) {
      el.classList.add('is-revealed');
    }
  });

  if (!('IntersectionObserver' in window)) {
    // Fallback para navegadores antiguos sin soporte de IntersectionObserver
    elements.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const observerOptions = {
    root: null,
    threshold: 0.08,
    rootMargin: '0px 0px -20px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
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

        obs.unobserve(el);
      }
    });
  }, observerOptions);

  elements.forEach((el) => observer.observe(el));
}

/**
 * 3. Barra de Navegación y Menú Móvil con Bloqueo de Scroll
 */
function initNavbar() {
  const navbarWrap = document.querySelector('.navbar-wrapper');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link, .btn-nav-cta');

  // Control de sombra y fondo al deslizar la página
  if (navbarWrap) {
    const handleNavbarScroll = () => {
      if (window.scrollY > 30) {
        navbarWrap.classList.add('scrolled');
      } else {
        navbarWrap.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll();
  }

  // Comportamiento del Drawer móvil
  if (navToggle && navMenu) {
    const closeMenu = () => {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      document.body.classList.remove('menu-open');
    };

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('active');
      navToggle.classList.toggle('active', isOpen);
      document.body.classList.toggle('menu-open', isOpen);
    });

    // Cerrar al pulsar cualquier enlace de navegación
    navLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Cerrar automáticamente si se redimensiona la pantalla a tamaño desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  }
}

/**
 * 4. Efecto de Decodificación Cinética (Text Scramble) en el Titular
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
 * 5. Consola HUD de Telemetría (Lógica industrial en tiempo real)
 */
function initHudTypewriter() {
  const hudElement = document.getElementById('hudTypewriter');
  if (!hudElement) return;

  const logs = [
    'Ciclo de escaneo PLC OK (Tiempo: 1.1ms)',
    'Conexión Modbus-TCP en puerto 502 establecida',
    'PID de posición calibrado: Error < 0.05%',
    'Auditando segmentación de red OT/IT...',
    'Telemetría en vivo lista para exportar a SCADA',
    'Servidor local WebSocket: 0 paquetes perdidos'
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
 * 6. Manejo del Formulario de Contacto
 * Registro estructurado para depuración local y feedback visual
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Registro en la consola para desarrollo local
    console.group('🚀 [Estudio Creativo ID] Solicitud Registrada:');
    console.table(data);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();

    feedback.textContent = `¡Gracias, ${data.name}! Hemos registrado tu solicitud para "${data.service}". Analizaremos los requerimientos técnicos y te responderemos a la brevedad.`;
    feedback.className = 'form-feedback success';

    form.reset();

    setTimeout(() => {
      feedback.style.display = 'none';
      feedback.className = 'form-feedback';
    }, 6000);
  });
}

/**
 * 7. Actualización dinámica del año en el footer
 */
function setCurrentYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/**
 * 8. Detector de Bloqueo de Pinterest (Fallback Inteligente para Adblock / Shields)
 */
function initPinterestDetector() {
  const containers = document.querySelectorAll('.pinterest-embed-container');
  if (!containers.length) return;

  // Espera 2.2 segundos para verificar si el SDK de Pinterest (pinit.js) renderizó el iframe
  setTimeout(() => {
    containers.forEach((container) => {
      const hasRendered = container.querySelector('span[data-pin-do], iframe, .pin-embed');
      const rawLink = container.querySelector('a[data-pin-do]');
      const wasBlocked = rawLink && (!hasRendered || hasRendered.offsetHeight === 0);

      if (wasBlocked) {
        container.classList.add('blocked');
      }
    });
  }, 2200);
}
