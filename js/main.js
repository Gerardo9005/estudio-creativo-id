/**
 * ESTUDIO CREATIVO ID - CYBERNETIC CONTROLLER (js/main.js)
 * Orquestador: Animaciones cinéticas del hero, decodificador de texto,
 * observador de scroll, spotlight interactivo, HUD y telemetría.
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgressBar();
  initScrollObserver();
  initNavbar();
  initTextScramble();
  initHeroHologramParallax();
  initSpotlightEffect();
  initHudTypewriter();
  initContactForm();
  setCurrentYear();
  initPinterestDetector();
});

/**
 * 1. Barra de progreso superior según posición de scroll
 */
function initScrollProgressBar() {
  const progressBar = document.getElementById('scrollProgress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${progress}%`;
  });
}

/**
 * 2. Motor de Animaciones en Scroll (IntersectionObserver escalonado)
 */
function initScrollObserver() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;

  const observerOptions = {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

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
  }, observerOptions);

  elements.forEach(el => observer.observe(el));
}

/**
 * 3. Barra de Navegación y Menú Móvil
 */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link, .btn-nav');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
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
 * 4. Efecto de Decodificación Cibernética (Text Scramble) en el Hero
 */
function initTextScramble() {
  const target = document.getElementById('scrambleTarget');
  if (!target) return;

  const finalPhrase = 'INGENIERÍA DIGITAL';
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
    }, 45);
  }

  // Ejecución con ligero retraso al cargar
  setTimeout(runScramble, 300);
}

/**
 * 5. Inclinación 3D (Parallax Tilt) en el Emblema Central del Hero
 */
function initHeroHologramParallax() {
  const centerpiece = document.getElementById('heroCenterpiece');
  if (!centerpiece) return;

  const stage = centerpiece.querySelector('.hologram-stage');
  if (!stage) return;

  window.addEventListener('mousemove', (e) => {
    const rect = centerpiece.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
    const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);

    const rotateX = -deltaY * 18;
    const rotateY = deltaX * 18;

    stage.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  centerpiece.addEventListener('mouseleave', () => {
    stage.style.transform = `rotateX(0deg) rotateY(0deg)`;
  });
}

/**
 * 6. Efecto Spotlight dinámico (haz de luz siguiendo el cursor en Bento Cards)
 */
function initSpotlightEffect() {
  const cards = document.querySelectorAll('.bento-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/**
 * 7. Typewriter cibernético en la consola HUD de Telemetría
 */
function initHudTypewriter() {
  const hudElement = document.getElementById('hudTypewriter');
  if (!hudElement) return;

  const logs = [
    'syncing PLC rack I/O modules with SCADA web daemon...',
    'monitoring structured text loop [Scan: 1.2ms | OK]',
    'encrypting telemetric tunnel AES-GCM (Port 502/TCP)...',
    'executing automated data pipeline scripts in Python...',
    'validating state machine & interlock routines...'
  ];

  let logIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const speed = 55;

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
 * 8. Manejo del Formulario de Contacto en Terminal
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    console.group('🚀 [Estudio Creativo ID] Transmisión de Requerimiento:');
    console.table(data);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();

    feedback.textContent = `[OK] Solicitud registrada para "${data.service}". Iniciando evaluación técnica.`;
    feedback.className = 'form-feedback success';

    form.reset();

    setTimeout(() => {
      feedback.style.display = 'none';
      feedback.className = 'form-feedback';
    }, 6000);
  });
}

/**
 * 9. Actualización de Año
 */
function setCurrentYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/**
 * 10. Detector de Bloqueo de Pinterest (Fallback Inteligente)
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
