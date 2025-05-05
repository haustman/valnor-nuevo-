// js/menu.js
async function fetchUserData() {
  try {
    const response = await fetch('https://api.valnor.com/user');
    if (!response.ok) {
      throw new Error('Error al obtener datos del usuario');
    }
    const data = await response.json();
    return {
      username: data.username || 'Usuario',
      umbra: data.umbra || 0,
      mythar: data.mythar || 500,
      mining: data.mining || 0,
      diamonds: data.diamonds || 0
    };
  } catch (error) {
    console.error('Error al conectar con la API:', error);
    return {
      username: 'Usuario',
      umbra: 0,
      mythar: 500,
      mining: 0,
      diamonds: 0
    };
  }
}

function initializeMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeButtons = document.querySelectorAll('.close-btn');
  let helpButtons = document.querySelectorAll('.help-btn');
  let soundButtons = document.querySelectorAll('.sound-btn');
  const soundToggles = document.querySelectorAll('.sound-toggle');

  console.log('Inicializando menú...');
  console.log('Hamburger:', hamburger);
  console.log('Mobile Menu:', mobileMenu);

  if (!hamburger || !mobileMenu) {
    console.error('No se encontraron los elementos del menú hamburguesa:', { hamburger, mobileMenu });
    return;
  }

  // Obtener datos del usuario y monedas
  fetchUserData().then(data => {
    // Actualizar nombre del usuario
    const usernameElement = document.getElementById('username');
    const usernameMobileElement = document.getElementById('username-mobile');
    if (usernameElement) usernameElement.textContent = data.username;
    if (usernameMobileElement) usernameMobileElement.textContent = data.username;

    // Actualizar monedas en el navbar
    const umbraCoin = document.getElementById('umbra-coin');
    const mytharCoin = document.getElementById('mythar-coin');
    const miningCoin = document.getElementById('mining-coin');
    const diamondsCoin = document.getElementById('diamonds-coin');
    if (umbraCoin) umbraCoin.textContent = data.umbra;
    if (mytharCoin) mytharCoin.textContent = data.mythar;
    if (miningCoin) miningCoin.textContent = data.mining;
    if (diamondsCoin) diamondsCoin.textContent = data.diamonds;

    // Actualizar monedas en el menú hamburguesa
    const mobileUmbraCoin = document.getElementById('mobile-umbra-coin');
    const mobileMytharCoin = document.getElementById('mobile-mythar-coin');
    const mobileMiningCoin = document.getElementById('mobile-mining-coin');
    const mobileDiamondsCoin = document.getElementById('mobile-diamonds-coin');
    if (mobileUmbraCoin) mobileUmbraCoin.textContent = data.umbra;
    if (mobileMytharCoin) mobileMytharCoin.textContent = data.mythar;
    if (mobileMiningCoin) mobileMiningCoin.textContent = data.mining;
    if (mobileDiamondsCoin) mobileDiamondsCoin.textContent = data.diamonds;
  });

  // Menú hamburguesa
  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = mobileMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    console.log('Menú hamburguesa toggled:', isOpen ? 'Abierto' : 'Cerrado');

    // Reasignar eventos a los botones del menú hamburguesa al abrirlo
    if (isOpen) {
      helpButtons = document.querySelectorAll('.help-btn');
      soundButtons = document.querySelectorAll('.sound-btn');

      helpButtons.forEach(button => {
        button.removeEventListener('click', openHelpModal);
        button.removeEventListener('touchstart', openHelpModal);
        button.addEventListener('click', (e) => {
          openHelpModal(e);
          mobileMenu.classList.remove('active');
          hamburger.classList.remove('active');
          console.log('Menú cerrado por clic en ayuda');
        });
        button.addEventListener('touchstart', (e) => {
          openHelpModal(e);
          mobileMenu.classList.remove('active');
          hamburger.classList.remove('active');
          console.log('Menú cerrado por touch en ayuda');
        });
      });

      soundButtons.forEach(button => {
        button.removeEventListener('click', openSoundModal);
        button.removeEventListener('touchstart', openSoundModal);
        button.addEventListener('click', (e) => {
          openSoundModal(e);
          mobileMenu.classList.remove('active');
          hamburger.classList.remove('active');
          console.log('Menú cerrado por clic en sonido');
        });
        button.addEventListener('touchstart', (e) => {
          openSoundModal(e);
          mobileMenu.classList.remove('active');
          hamburger.classList.remove('active');
          console.log('Menú cerrado por touch en sonido');
        });
      });
    }
  };

  // Cerrar menú al hacer clic en el fondo
  const closeMenu = (e) => {
    console.log('Evento closeMenu disparado:', e.target);
    if (e.target === mobileMenu) {
      mobileMenu.classList.remove('active');
      hamburger.classList.remove('active');
      console.log('Menú cerrado por clic en fondo');
    }
  };

  hamburger.addEventListener('click', toggleMenu);
  hamburger.addEventListener('touchstart', toggleMenu);
  mobileMenu.addEventListener('click', closeMenu);
  mobileMenu.addEventListener('touchstart', closeMenu);

  // Funciones para abrir modales
  function openHelpModal(e) {
    e.preventDefault();
    e.stopPropagation();
    const modal = document.getElementById('help-modal');
    if (modal) {
      const openModal = document.querySelector('.modal[style*="display: flex"]');
      if (openModal && openModal !== modal) {
        openModal.style.display = 'none';
      }
      modal.style.display = 'flex';
      console.log('Modal de ayuda abierto');
    }
  }

  function openSoundModal(e) {
    e.preventDefault();
    e.stopPropagation();
    const modal = document.getElementById('sound-modal');
    if (modal) {
      const openModal = document.querySelector('.modal[style*="display: flex"]');
      if (openModal && openModal !== modal) {
        openModal.style.display = 'none';
      }
      modal.style.display = 'flex';
      console.log('Modal de sonido abierto');
    }
  }

  // Botones de cerrar modal
  closeButtons.forEach(button => {
    const closeModal = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const modal = button.closest('.modal');
      if (modal) {
        modal.style.display = 'none';
        console.log('Modal cerrado:', modal.id);
      }
    };
    button.addEventListener('click', closeModal);
    button.addEventListener('touchstart', closeModal);
  });

  // Botones de ayuda (navbar)
  helpButtons.forEach(button => {
    button.removeEventListener('click', openHelpModal);
    button.removeEventListener('touchstart', openHelpModal);
    button.addEventListener('click', openHelpModal);
    button.addEventListener('touchstart', openHelpModal);
  });

  // Botones de sonido (navbar)
  soundButtons.forEach(button => {
    button.removeEventListener('click', openSoundModal);
    button.removeEventListener('touchstart', openSoundModal);
    button.addEventListener('click', openSoundModal);
    button.addEventListener('touchstart', openSoundModal);
  });

  // Inicializar sonidos
  const ambientSound = new Audio('assets/audio/ambient.mp3');
  const generalSound = new Audio('assets/audio/general.mp3');
  ambientSound.loop = true;
  generalSound.loop = true;

  // Cargar estado inicial de los sonidos desde localStorage
  const ambientActive = localStorage.getItem('ambientSound') !== 'off';
  const generalActive = localStorage.getItem('generalSound') !== 'off';
  if (ambientActive) {
    ambientSound.play().catch(error => console.error('Error al reproducir sonido ambiente:', error));
  }
  if (generalActive) {
    generalSound.play().catch(error => console.error('Error al reproducir sonido general:', error));
  }

  // Alternar sonido
  soundToggles.forEach(button => {
    const type = button.classList.contains('ambient-toggle') ? 'ambient' : 'general';
    const isActive = localStorage.getItem(`${type}Sound`) !== 'off';
    if (isActive) {
      button.classList.add('active');
    }

    const toggleSound = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isNowActive = button.classList.toggle('active');
      localStorage.setItem(`${type}Sound`, isNowActive ? 'on' : 'off');
      console.log(`Sonido ${type} toggled: ${isNowActive}`);

      if (type === 'ambient') {
        if (isNowActive) {
          ambientSound.play().catch(error => console.error('Error al reproducir sonido ambiente:', error));
        } else {
          ambientSound.pause();
        }
      } else {
        if (isNowActive) {
          generalSound.play().catch(error => console.error('Error al reproducir sonido general:', error));
        } else {
          generalSound.pause();
        }
      }
    };

    button.removeEventListener('click', toggleSound);
    button.removeEventListener('touchstart', toggleSound);
    button.addEventListener('click', toggleSound);
    button.addEventListener('touchstart', toggleSound);
  });

  console.log('Eventos asignados correctamente.');
}

// Ejecutar directamente al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  initializeMenu();
});