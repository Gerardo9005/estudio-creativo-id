/**
 * ESTUDIO CREATIVO ID - ARCHIVO PRINCIPAL (js/main.js)
 * Control de navegación, consola animada, formulario local,
 * actualización de año y detector de bloqueo para videos de Pinterest.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTypewriter();
  initContactForm();
  setCurrentYear();
  initPinterestDetector();
});

/**
 * 1. Control de barra de navegación y menú móvil
 */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-btn');

  if (!navbar) return;

  // Efecto glassmorphism y cambio de altura al hacer scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Alternar apertura y cierre del menú móvil
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    // Cerrar menú móvil al seleccionar cualquier enlace
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }
}

/**
 * 2. Efecto de escritura en la consola del Hero (Enfoque OT / IT)
 */
function initTypewriter() {
  const typewriterElement = document.getElementById('typewriter');
  if (!typewriterElement) return;

  const messages = [
    'polling PLC registers via Modbus TCP [Port 502]...',
    'monitoring digital I/O rack status: ALL NORMAL',
    'deploying desktop SCADA telemetry application...',
    'python scripts/batch_sensor_logging.py --active',
    'verifying VPN isolation for industrial OT network...',
    'compiling multiplatform_solution (C++ / Python / TS)...'
  ];

  let messageIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 65;

  function typeLoop() {
    const currentMessage = messages[messageIndex];

    if (!isDeleting) {
      // Escribiendo caracter por caracter
      typewriterElement.textContent = currentMessage.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentMessage.length) {
        isDeleting = true;
        setTimeout(typeLoop, 2200); // Pausa con la frase completa en pantalla
        return;
      }
    } else {
      // Borrando texto
      typewriterElement.textContent = currentMessage.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        messageIndex = (messageIndex + 1) % messages.length;
        setTimeout(typeLoop, 450); // Breve pausa antes de escribir la siguiente línea
        return;
      }
    }

    const currentSpeed = isDeleting ? typingSpeed / 2 : typingSpeed;
    setTimeout(typeLoop, currentSpeed);
  }

  typeLoop();
}

/**
 * 3. Manejador del Formulario de Contacto
 * Optimizado para captura y depuración en entorno local
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');

  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Registro estructurado en consola de desarrollo
    console.group('🚀 [Estudio Creativo ID] Nueva Solicitud Técnica:');
    console.table(data);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();

    // Notificación en pantalla para el usuario
    feedback.textContent = `¡Gracias, ${data.name}! Hemos registrado tu solicitud para "${data.service}". Analizaremos tus requerimientos técnicos de inmediato.`;
    feedback.className = 'form-feedback success';

    form.reset();

    // Ocultar notificación tras 6 segundos
    setTimeout(() => {
      feedback.style.display = 'none';
      feedback.className = 'form-feedback';
    }, 6000);
  });
}

/**
 * 4. Actualización dinámica del año para el pie de página
 */
function setCurrentYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/**
 * 5. Detector de bloqueo de Pinterest (Fallback para navegadores con Adblock / Shields)
 */
function initPinterestDetector() {
  const containers = document.querySelectorAll('.pinterest-embed-container');
  if (!containers.length) return;

  // Margen de 2.2 segundos para permitir la ejecución de pinit.js antes del chequeo
  setTimeout(() => {
    containers.forEach(container => {
      // Si Pinterest renderiza con éxito, inyecta un span con clase o un iframe dentro
      const hasRendered = container.querySelector('span[data-pin-do], iframe, .pin-embed');
      
      // Si el enlace original sigue intacto y no hay nodo renderizado con altura real, se activa el fallback
      const rawLink = container.querySelector('a[data-pin-do]');
      const wasBlocked = rawLink && (!hasRendered || hasRendered.offsetHeight === 0);

      if (wasBlocked) {
        container.classList.add('blocked');
      }
    });
  }, 2200);
}
