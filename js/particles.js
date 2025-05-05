// js/particles.js
document.addEventListener('DOMContentLoaded', () => {
    particlesJS('particles-container', {
      particles: {
        number: { value: window.innerWidth <= 768 ? 30 : 80 }, // Más partículas
        color: { value: '#ffffff' },
        shape: { type: 'image', image: { src: 'assets/images/snowflake.png', width: 32, height: 32 } },
        opacity: { value: 0.7, random: true }, // Mayor opacidad
        size: { value: 6, random: true }, // Tamaño más grande
        move: { enable: true, speed: 3, direction: 'bottom', random: true } // Movimiento más dinámico
      },
      interactivity: { enable: false }
    });
  });