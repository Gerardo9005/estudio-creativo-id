/**
 * ESTUDIO CREATIVO ID - MAIN SCRIPT
 * Identidad Editorial: Obsidiana & Naranja Neón
 */

// Notifica al CSS que JS está activo
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

  // Asegura la visibilidad del Hero a los 300ms
  setTimeout(() => {
    document.querySelectorAll('#hero [data-reveal]').forEach(el => el.classList.add('is-revealed'));
  }, 300);
});

/**
 * 1. Barra de progreso superior al hacer scroll
 */
function initScrollProgressBar() {
  const progressBar = document.getElementById('scrollProgress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${progress}%`;
  });
}

/**
 * 2. Motor de Animaciones en Scroll [data-reveal]
 */
function initScrollObserver() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;

  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('is-revealed');
    }
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.getAttribute('data-delay') || 0;
        setTimeout(() => {
          el.classList.add('is-revealed');
        }, parseInt(delay, 10));
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

  elements.forEach(el => observer.observe(el));
}

/**
 * 3. Barra de Navegación y Menú Móvil
 */
function initNavbar() {
  const navbarWrap = document.querySelector('.navbar-wrapper');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link, .btn-nav-cta');

  if (navbarWrap) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbarWrap.classList.add('scrolled');
      } else {
        navbarWrap.classList.remove('scrolled');
      }
    });
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }
}

/**
 * 4. Efecto de Decodificación de Texto en el Titular
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
    'Telemetría lista para exportar a SCADA'
  ];

  let logIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const speed = 50;

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

    const currentSpeed = isDeleting ? speed / 2 : speed;
    setTimeout(typeCycle, currentSpeed);
  }

  typeCycle();
}

/**
 * 6. Manejo del Formulario de Contacto
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    console.group('🚀 [Estudio Creativo ID] Solicitud Registrada:');
    console.table(data);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();

    feedback.textContent = `¡Gracias, ${data.name}! Hemos registrado tu solicitud para "${data.service}". Te responderemos en breve.`;
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
 * 8. Detector de Bloqueo de Pinterest (Fallback)
 */
function initPinterestDetector() {
  const containers = document.querySelectorAll('.pinterest-embed-container');
  if (!containers.length) return;

  setTimeout(() => {
    containers.forEach(container => {
      const hasRendered = container.querySelector('span[data-pin-do], iframe, .pin-embed');
      const rawLink = container.querySelector('a[data-pin-do]');
      const wasBlocked = rawLink && (!hasRendered || hasRendered.offsetHeight === 0);

      if (wasBlocked) {
        container.classList.add('blocked');
      }
    });
  }, 2200);
}
