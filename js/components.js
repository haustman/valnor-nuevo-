// js/components.js
async function loadComponent(id, url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al cargar ${url}: ${response.statusText}`);
    }
    const content = await response.text();
    document.getElementById(id).innerHTML = content;
    document.getElementById(id).dispatchEvent(new Event('componentLoaded'));
    console.log(`Componente ${id} cargado correctamente desde ${url}`);
  } catch (error) {
    console.error(error);
    document.getElementById(id).innerHTML = `<p>Error al cargar el componente: ${error.message}</p>`;
  }
}

function loadComponents() {
  loadComponent('footer', 'components/footer.html');
  if (window.location.pathname !== '/inicio.html' && !window.location.pathname.endsWith('inicio.html')) {
    loadComponent('buttons', 'components/buttons.html');
  }
}

document.addEventListener('DOMContentLoaded', loadComponents);