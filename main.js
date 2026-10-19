/**
 * ESTUDIO CREATIVO ID
 * Script principal: Efectos dinámicos, navegación y formulario local
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTypewriter();
  initContactForm();
  setCurrentYear();
});

/**
 * 1. Control de barra de navegación y menú móvil
 */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-btn');

  // Efecto blur/background al hacer scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Toggle Menú Móvil
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  // Cerrar menú al hacer clic en un enlace
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });
}

/**
 * 2. Efecto de escritura en la terminal de la sección Hero
 */
function initTypewriter() {
  const typewriterElement = document.getElementById('typewriter');
  if (!typewriterElement) return;

  const messages = [
    'polling PLC registers via Modbus TCP [Port 502]...',
    'monitoring digital I/O rack status: ALL NORMAL',
    'deploying desktop SCADA telemetry application...',
    'python scripts/batch_sensor_logging.py --active',
    'verifying VPN isolation for industrial OT network...'
  ];

  let messageIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function typeLoop() {
    const currentMessage = messages[messageIndex];

    if (!isDeleting) {
      // Escribiendo
      typewriterElement.textContent = currentMessage.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentMessage.length) {
        isDeleting = true;
        setTimeout(typeLoop, 2000); // Pausa al completar la frase
        return;
      }
    } else {
      // Borrando
      typewriterElement.textContent = currentMessage.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        messageIndex = (messageIndex + 1) % messages.length;
        setTimeout(typeLoop, 500); // Pausa antes de la siguiente frase
        return;
      }
    }

    const currentSpeed = isDeleting ? typingSpeed / 2 : typingSpeed;
    setTimeout(typeLoop, currentSpeed);
  }

  typeLoop();
}

/**
 * 3. Manejador del Formulario de Contacto (Orientado a desarrollo local)
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Registro en la consola para depuración local
    console.group('🚀 [Estudio Creativo ID] Nueva Consulta Recibida:');
    console.table(data);
    console.groupEnd();

    // Feedback visual al usuario
    feedback.textContent = `¡Gracias, ${data.name}! Hemos registrado tu solicitud para "${data.service}". Te responderemos a la brevedad.`;
    feedback.className = 'form-feedback success';

    form.reset();

    // Ocultar mensaje tras 6 segundos
    setTimeout(() => {
      feedback.style.display = 'none';
      feedback.className = 'form-feedback';
    }, 6000);
  });
}

/**
 * 4. Actualizar año de copyright automáticamente
 */
function setCurrentYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
