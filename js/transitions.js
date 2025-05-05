// js/transitions.js
function navigateWithTransition(url) {
    const overlay = document.createElement('div');
    overlay.className = 'transition-overlay';
    document.body.appendChild(overlay);
  
    const logo = document.createElement('img');
    logo.src = 'Png/Logos/Exploradores de Valnor.png';
    logo.className = 'transition-logo';
    overlay.appendChild(logo);
  
    gsap.to(overlay, {
      opacity: 1,
      duration: 0.5,
      onComplete: () => {
        setTimeout(() => {
          window.location.href = url;
        }, 3000); // Tiempo máximo de 3 segundos
      }
    });
  
    gsap.to(logo, {
      rotation: 360,
      duration: 1.5,
      repeat: -1,
      ease: 'linear'
    });
  }
  
  window.addEventListener('pageshow', () => {
    const overlay = document.querySelector('.transition-overlay');
    if (overlay) {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          overlay.remove();
        }
      });
    }
  });