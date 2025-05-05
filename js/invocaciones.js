// Estado centralizado del juego
const gameState = {
    characters: [
      { id: 1, name: "Guerrero de Fuego", rank: "C", level: 12, attack: 3, health: 18, maxHealth: 20, defense: 2, element: "Fuego", skills: "Golpe Ígneo", description: "Un guerrero básico pero valiente.", image: "character1.png" },
      { id: 2, name: "Mago de Hielo", rank: "A", level: 15, attack: 5, health: 15, maxHealth: 15, defense: 1, element: "Hielo", skills: "Tormenta Helada", description: "Domina las artes arcanas.", image: "character2.png" },
      { id: 3, name: "Arquero del Bosque", rank: "B", level: 14, attack: 4, health: 16, maxHealth: 18, defense: 2, element: "Tierra", skills: "Flecha Rápida", description: "Un arquero ágil.", image: "character3.png" },
      { id: 4, name: "Clérigo de Luz", rank: "S", level: 16, attack: 2, health: 20, maxHealth: 20, defense: 3, element: "Luz", skills: "Sanación Divina", description: "Cura a sus aliados.", image: "character4.png" },
      { id: 5, name: "Ladrón Sombrío", rank: "B", level: 13, attack: 5, health: 14, maxHealth: 16, defense: 1, element: "Oscuridad", skills: "Ataque Furtivo", description: "Ataca desde las sombras.", image: "character5.png" },
      { id: 6, name: "Berserker de Acero", rank: "A", level: 15, attack: 6, health: 17, maxHealth: 22, defense: 4, element: "Fuego", skills: "Furia Salvaje", description: "Un guerrero implacable.", image: "character6.png" },
      { id: 7, name: "Nigromante Oscuro", rank: "SS", level: 18, attack: 7, health: 13, maxHealth: 15, defense: 2, element: "Oscuridad", skills: "Invocar Esqueletos", description: "Domina la muerte.", image: "character7.png" },
      { id: 8, name: "Druida de la Tormenta", rank: "S", level: 17, attack: 4, health: 18, maxHealth: 18, defense: 3, element: "Trueno", skills: "Llamada del Trueno", description: "Controla la naturaleza.", image: "character8.png" },
      { id: 9, name: "Paladín Sagrado", rank: "A", level: 16, attack: 5, health: 20, maxHealth: 25, defense: 5, element: "Luz", skills: "Escudo Sagrado", description: "Un defensor de la luz.", image: "character9.png" }
    ],
    stones: [
      { id: 1, name: "Piedra de Fuego", rank: "C", element: "Fuego", uses: 3, maxUses: 5, description: "Invoca con poder ígneo.", image: "stone1.png" },
      { id: 2, name: "Piedra de Hielo", rank: "B", element: "Hielo", uses: 1, maxUses: 1, description: "Invoca con magia helada.", image: "stone2.png" }
    ],
    equipables: [
      { id: 1, name: "Espada de Fuego", type: "Arma", rank: "B", effect: "Ataque: +20", description: "Aumenta el ataque del equipo.", image: "equipable1.png" },
      { id: 2, name: "Armadura de Hielo", type: "Armadura", rank: "A", effect: "Defensa: +15", description: "Aumenta la defensa del equipo.", image: "equipable2.png" }
    ],
    consumibles: [
      { id: 1, name: "Poción de Vida", rank: "C", effect: "Vida: +15", specialEffect: "Restaura vida gradualmente", duration: "30 min", description: "Restaura vida durante un tiempo.", image: "consumable1.png" },
      { id: 2, name: "Elixir de Mana", rank: "B", effect: "Ataque: +10", specialEffect: "Aumenta el ataque temporalmente", duration: "15 min", description: "Aumenta el ataque por un tiempo.", image: "consumable2.png" }
    ],
    summonableCharacters: [
      { id: 10, name: "Dragón Ancestral", rank: "SS", level: 20, attack: 10, health: 25, maxHealth: 30, defense: 5, element: "Fuego", skills: "Aliento de Fuego", description: "Una bestia legendaria.", image: "character10.png" },
      { id: 11, name: "Fénix de Luz", rank: "S", level: 18, attack: 8, health: 20, maxHealth: 20, defense: 3, element: "Luz", skills: "Renacer Llameante", description: "Renace de sus cenizas.", image: "character11.png" }
    ],
    selectedCharacters: [],
    selectedStone: null,
    selectedEquipables: [],
    selectedConsumibles: [],
    teamPower: 0,
    playerCurrencies: { umbra: 0, mythar: 500, miningPower: 0, diamonds: 0 },
    playerInventory: []
  };
  
  // Inicializar el inventario
  gameState.playerInventory = [...gameState.characters];
  
  // Función para debounce
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
  
  // Cargar datos iniciales
  document.addEventListener("DOMContentLoaded", () => {
    // Mostrar portada introductoria
    const introCover = document.querySelector(".intro-cover");
    gsap.to(introCover, {
      opacity: 0,
      duration: 1,
      delay: 2,
      onComplete: () => introCover.style.display = "none"
    });
  
    // Actualizar monedas en el nav
    updateCurrencies();
  
    // Cargar personajes dinámicamente
    const charactersGrid = document.getElementById("characters-grid");
    charactersGrid.innerHTML = "";
    gameState.characters.forEach(character => {
      const card = document.createElement("div");
      card.classList.add("character-card");
      card.dataset.id = character.id;
      card.setAttribute("tabindex", "0");
      const healthPercent = (character.health / character.maxHealth) * 100;
      const healthClass = healthPercent > 50 ? "green" : healthPercent > 25 ? "amber" : "red";
      card.innerHTML = `
        <div class="character-image" style="background-image: url('assets/images/${character.image}');"></div>
        <span class="character-title">${character.name}</span>
        <div class="rank">${character.rank}</div>
        <div class="stats">Ataque: ${character.attack} | Defensa: ${character.defense}</div>
        <div class="health-bar">
          <div class="health-fill ${healthClass}" style="width: ${healthPercent}%"></div>
        </div>
        <div class="health-text">Vida: ${character.health}/${character.maxHealth}</div>
        <button class="select-btn" onclick="selectCharacter(${character.id})" aria-label="Seleccionar ${character.name}">Seleccionar</button>
        <div class="info-icon" onclick="showCharacterDetails(${character.id})" tabindex="0" aria-label="Ver detalles de ${character.name}">i</div>
        <div class="check-icon">✔</div>
      `;
      card.addEventListener("click", (e) => {
        if (e.target.classList.contains("select-btn") || e.target.classList.contains("info-icon")) return;
        selectCharacter(character.id);
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectCharacter(character.id);
        }
      });
      charactersGrid.appendChild(card);
    });
  
    // Cargar piedras dinámicamente
    const stonesList = document.getElementById("stones-list");
    stonesList.innerHTML = "";
    gameState.stones.forEach(stone => {
      const item = document.createElement("div");
      item.classList.add("stone-item");
      if (stone.uses === 0) item.classList.add("disabled");
      item.dataset.id = stone.id;
      item.setAttribute("tabindex", "0");
      let usesHTML = "";
      for (let i = 0; i < stone.maxUses; i++) {
        usesHTML += `<div class="use-circle ${i < stone.uses ? 'filled' : ''}"></div>`;
      }
      item.innerHTML = `
        <img src="assets/images/${stone.image}" alt="${stone.name}">
        <div class="details">
          <span>${stone.name}</span>
          <p>Rango: ${stone.rank} | Elemento: ${stone.element}</p>
          <div class="uses">${usesHTML} Usos: ${stone.uses}/${stone.maxUses}</div>
          <button class="select-btn" onclick="selectStone(${stone.id})" aria-label="Seleccionar ${stone.name}" ${stone.uses === 0 ? 'disabled' : ''}>Seleccionar</button>
        </div>
        <div class="required-label">Obligatorio</div>
        <div class="check-icon">✔</div>
      `;
      if (stone.uses > 0) {
        item.addEventListener("click", (e) => {
          if (e.target.classList.contains("select-btn")) return;
          selectStone(stone.id);
        });
        item.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            selectStone(stone.id);
          }
        });
      }
      stonesList.appendChild(item);
    });
  
    // Cargar equipables dinámicamente
    const equipablesList = document.getElementById("equipables-list");
    equipablesList.innerHTML = "";
    gameState.equipables.forEach(equipable => {
      const item = document.createElement("div");
      item.classList.add("equipable-item");
      item.dataset.id = equipable.id;
      item.setAttribute("tabindex", "0");
      item.innerHTML = `
        <img src="assets/images/${equipable.image}" alt="${equipable.name}">
        <div class="details">
          <span>${equipable.name}</span>
          <p>${equipable.effect}</p>
          <button class="select-btn" onclick="selectEquipable(${equipable.id})" aria-label="Seleccionar ${equipable.name}">Seleccionar</button>
        </div>
        <div class="check-icon">✔</div>
      `;
      item.addEventListener("click", (e) => {
        if (e.target.classList.contains("select-btn")) return;
        selectEquipable(equipable.id);
      });
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectEquipable(equipable.id);
        }
      });
      equipablesList.appendChild(item);
    });
  
    // Cargar consumibles dinámicamente
    const consumiblesList = document.getElementById("consumables-list");
    consumiblesList.innerHTML = "";
    gameState.consumibles.forEach(consumible => {
      const item = document.createElement("div");
      item.classList.add("consumable-item");
      item.dataset.id = consumible.id;
      item.setAttribute("tabindex", "0");
      item.innerHTML = `
        <img src="assets/images/${consumible.image}" alt="${consumible.name}">
        <div class="details">
          <span>${consumible.name}</span>
          <p>${consumible.effect} | Duración: ${consumible.duration}</p>
          <button class="select-btn" onclick="selectConsumible(${consumible.id})" aria-label="Seleccionar ${consumible.name}">Seleccionar</button>
        </div>
        <div class="check-icon">✔</div>
      `;
      item.addEventListener("click", (e) => {
        if (e.target.classList.contains("select-btn")) return;
        selectConsumible(consumible.id);
      });
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectConsumible(consumible.id);
        }
      });
      consumiblesList.appendChild(item);
    });
  
    // Asignar eventos a botones
    document.getElementById("invoke-btn").addEventListener("click", showInvokeModal);
    document.querySelector(".deselect-btn").addEventListener("click", deselectAllCharacters);
  
    // Soporte para cerrar modales con tecla Esc
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const modals = ["invoke-modal", "result-modal", "dungeons-confirm-modal"];
        modals.forEach(modalId => {
          const modal = document.getElementById(modalId);
          if (modal && modal.style.display === "flex") {
            closeModal(modalId);
          }
        });
      }
    });
  });
  
  // Actualizar monedas en el nav
  function updateCurrencies() {
    document.getElementById("umbra-coin").textContent = gameState.playerCurrencies.umbra;
    document.getElementById("mythar-coin").textContent = gameState.playerCurrencies.mythar;
    document.getElementById("mining-coin").textContent = gameState.playerCurrencies.miningPower;
    document.getElementById("diamonds-coin").textContent = gameState.playerCurrencies.diamonds;
    document.getElementById("mobile-umbra-coin").textContent = gameState.playerCurrencies.umbra;
    document.getElementById("mobile-mythar-coin").textContent = gameState.playerCurrencies.mythar;
    document.getElementById("mobile-mining-coin").textContent = gameState.playerCurrencies.miningPower;
    document.getElementById("mobile-diamonds-coin").textContent = gameState.playerCurrencies.diamonds;
  }
  
  // Selección de personajes
  function selectCharacter(id) {
    const character = gameState.characters.find(c => c.id === id);
    const index = gameState.selectedCharacters.findIndex(c => c.id === id);
    if (index === -1) {
      if (gameState.selectedCharacters.length < 9) {
        gameState.selectedCharacters.push(character);
        document.querySelector(`.character-card[data-id="${id}"]`).classList.add("selected");
      } else {
        alert("Máximo 9 personajes.");
      }
    } else {
      gameState.selectedCharacters.splice(index, 1);
      document.querySelector(`.character-card[data-id="${id}"]`).classList.remove("selected");
    }
    updateSelection();
  }
  
  function deselectAllCharacters() {
    gameState.selectedCharacters = [];
    document.querySelectorAll(".character-card").forEach(card => card.classList.remove("selected"));
    updateSelection();
  }
  
  // Selección de piedra (selección única)
  function selectStone(id) {
    const stone = gameState.stones.find(s => s.id === id);
    if (gameState.selectedStone && gameState.selectedStone.id === id) {
      gameState.selectedStone = null;
      document.querySelector(`.stone-item[data-id="${id}"]`).classList.remove("selected");
    } else {
      gameState.selectedStone = stone;
      document.querySelectorAll(".stone-item").forEach(item => item.classList.remove("selected"));
      document.querySelector(`.stone-item[data-id="${id}"]`).classList.add("selected");
    }
    updateSelection();
  }
  
  // Selección de equipables (selección múltiple)
  function selectEquipable(id) {
    const equipable = gameState.equipables.find(e => e.id === id);
    const index = gameState.selectedEquipables.findIndex(e => e.id === id);
    if (index === -1) {
      gameState.selectedEquipables.push(equipable);
      document.querySelector(`.equipable-item[data-id="${id}"]`).classList.add("selected");
    } else {
      gameState.selectedEquipables.splice(index, 1);
      document.querySelector(`.equipable-item[data-id="${id}"]`).classList.remove("selected");
    }
    updateSelection();
  }
  
  // Selección de consumibles (selección múltiple)
  function selectConsumible(id) {
    const consumible = gameState.consumibles.find(c => c.id === id);
    const index = gameState.selectedConsumibles.findIndex(c => c.id === id);
    if (index === -1) {
      gameState.selectedConsumibles.push(consumible);
      document.querySelector(`.consumable-item[data-id="${id}"]`).classList.add("selected");
    } else {
      gameState.selectedConsumibles.splice(index, 1);
      document.querySelector(`.consumable-item[data-id="${id}"]`).classList.remove("selected");
    }
    updateSelection();
  }
  
  // Actualizar selección y estado (con debounce)
  const updateSelection = debounce(() => {
    // Actualizar contador de personajes seleccionados
    document.getElementById("selected-count").textContent = `Seleccionados: ${gameState.selectedCharacters.length}/9`;
  
    // Actualizar barra de progreso
    const steps = document.querySelectorAll(".progress-step");
    steps.forEach(step => step.classList.remove("active"));
    if (gameState.selectedCharacters.length > 0) steps[0].classList.add("active");
    if (gameState.selectedStone) steps[1].classList.add("active");
    if (gameState.selectedEquipables.length > 0 || gameState.selectedConsumibles.length > 0) steps[2].classList.add("active");
  
    // Calcular poder total del equipo
    let power = gameState.selectedCharacters.reduce((total, char) => total + char.attack + char.defense + (char.health / char.maxHealth * 50), 0);
    gameState.selectedEquipables.forEach(equip => {
      if (equip.effect.includes("Ataque")) power += parseInt(equip.effect.split(": +")[1]);
      if (equip.effect.includes("Defensa")) power += parseInt(equip.effect.split(": +")[1]);
    });
    gameState.selectedConsumibles.forEach(cons => {
      if (cons.effect.includes("Ataque")) power += parseInt(cons.effect.split(": +")[1]);
      if (cons.effect.includes("Vida")) power += parseInt(cons.effect.split(": +")[1]) / 2;
    });
    gameState.teamPower = Math.round(power);
    document.getElementById("team-power").textContent = gameState.teamPower;
  
    // Habilitar/deshabilitar botón de invocar
    const invokeBtn = document.getElementById("invoke-btn");
    const hasEnoughMythar = gameState.playerCurrencies.mythar >= 100;
    invokeBtn.disabled = !(gameState.selectedCharacters.length > 0 && gameState.selectedStone && gameState.selectedStone.uses > 0 && hasEnoughMythar);
    if (gameState.selectedCharacters.length > 0 && gameState.selectedStone && gameState.selectedStone.uses > 0) steps[3].classList.add("active");
  
    // Actualizar personaje seleccionado
    updateSelectedCharacter();
  }, 100);
  
  // Mostrar personaje seleccionado
  function updateSelectedCharacter() {
    const selected = gameState.selectedCharacters[gameState.selectedCharacters.length - 1];
    const image = document.getElementById('selected-character-image');
    const name = document.getElementById('selected-character-name');
    const details = document.getElementById('selected-character-details');
    if (selected) {
      image.style.backgroundImage = `url('assets/images/${selected.image}')`;
      name.textContent = selected.name;
      details.innerHTML = `Rango: ${selected.rank}<br>Elemento: ${selected.element}`;
    } else {
      image.style.backgroundImage = 'none';
      name.textContent = 'Selecciona un personaje';
      details.innerHTML = '';
    }
  }
  
  // Mostrar detalles del personaje
  function showCharacterDetails(id) {
    const character = gameState.characters.find(c => c.id === id);
    alert(`Nombre: ${character.name}\nRango: ${character.rank}\nNivel: ${character.level}\nAtaque: ${character.attack}\nVida: ${character.health}/${character.maxHealth}\nDefensa: ${character.defense}\nElemento: ${character.element}\nHabilidad: ${character.skills}\nDescripción: ${character.description}`);
  }
  
  // Mostrar modal de confirmación
  function showInvokeModal() {
    const summary = `
      Personajes seleccionados: ${gameState.selectedCharacters.length} (Poder total: ${gameState.teamPower})<br>
      Piedra: ${gameState.selectedStone.name} (Usos: ${gameState.selectedStone.uses}/${gameState.selectedStone.maxUses})<br>
      Equipables: ${gameState.selectedEquipables.length > 0 ? gameState.selectedEquipables.map(e => e.name).join(", ") : "Ninguno"}<br>
      Consumibles: ${gameState.selectedConsumibles.length > 0 ? gameState.selectedConsumibles.map(c => c.name).join(", ") : "Ninguno"}
    `;
    document.getElementById("invoke-summary").innerHTML = summary;
    document.getElementById("invoke-modal").style.display = "flex";
    gsap.from(".modal-content", { scale: 0.9, opacity: 0, duration: 0.3, ease: "back.out(1.7)" });
    document.querySelector("#invoke-modal .modal-content button:first-child").focus();
  }
  
  // Cerrar modal
  function closeModal(modalId) {
    gsap.to(`#${modalId} .modal-content`, {
      scale: 0.9,
      opacity: 0,
      duration: 0.3,
      ease: "back.in(1.7)",
      onComplete: () => {
        document.getElementById(modalId).style.display = "none";
        document.querySelector(".invocaciones-content").style.overflowY = "auto";
      }
    });
  }
  
  // Confirmar invocación
  function confirmInvoke() {
    gameState.playerCurrencies.mythar -= 100;
    gameState.selectedStone.uses -= 1;
    if (gameState.selectedStone.uses === 0) {
      document.querySelector(`.stone-item[data-id="${gameState.selectedStone.id}"]`).classList.add("disabled");
      gameState.selectedStone = null;
    }
  
    updateCurrencies();
    closeModal("invoke-modal");
  
    const resultModal = document.getElementById("result-modal");
    const resultContent = document.getElementById("invoke-result");
    const summonedCharacter = gameState.summonableCharacters[Math.floor(Math.random() * gameState.summonableCharacters.length)];
    
    gameState.playerInventory.push(summonedCharacter);
    
    resultContent.innerHTML = `
      <p>¡Has invocado a ${summonedCharacter.name} (${summonedCharacter.rank})!</p>
      <img src="assets/images/${summonedCharacter.image}" alt="${summonedCharacter.name}" style="width: 100px; height: 100px;">
      <p>Ataque: ${summonedCharacter.attack} | Defensa: ${summonedCharacter.defense} | Vida: ${summonedCharacter.health}/${summonedCharacter.maxHealth}</p>
    `;
  
    const animationDiv = document.createElement("div");
    animationDiv.id = "invocation-animation";
    animationDiv.innerHTML = `
      <div class="rune-circle" id="rune-circle">
        <div class="rune rune1"></div>
        <div class="rune rune2"></div>
        <div class="rune rune3"></div>
        <div class="rune rune4"></div>
      </div>
    `;
    document.body.appendChild(animationDiv);
    animationDiv.style.display = "flex";
  
    gsap.to("#rune-circle", { rotation: 360, duration: 3, repeat: 1, ease: "linear" });
    gsap.to(".rune1", { x: 50, y: 50, rotation: 360, duration: 1.5, repeat: 1, ease: "power1.inOut" });
    gsap.to(".rune2", { x: -50, y: 50, rotation: 360, duration: 1.5, repeat: 1, ease: "power1.inOut" });
    gsap.to(".rune3", { x: 50, y: -50, rotation: 360, duration: 1.5, repeat: 1, ease: "power1.inOut" });
    gsap.to(".rune4", { x: -50, y: -50, rotation: 360, duration: 1.5, repeat: 1, ease: "power1.inOut" });
  
    setTimeout(() => {
      animationDiv.remove();
      resultModal.style.display = "flex";
      gsap.from(".modal-content", { scale: 0.9, opacity: 0, duration: 0.3, ease: "back.out(1.7)" });
      document.querySelector("#result-modal .modal-content button:first-child").focus();
    }, 3000);
  }
  
  // Cerrar modal de resultado y restablecer
  function closeResultModal() {
    closeModal("result-modal");
    gameState.selectedCharacters = [];
    gameState.selectedStone = null;
    gameState.selectedEquipables = [];
    document.querySelectorAll(".character-card").forEach(card => card.classList.remove("selected"));
    document.querySelectorAll(".stone-item").forEach(item => item.classList.remove("selected"));
    document.querySelectorAll(".equipable-item").forEach(item => item.classList.remove("selected"));
    updateSelection();
    document.querySelector(".invocaciones-content").scrollTo({ top: 0, behavior: "smooth" });
  }
  
  // Invocar de nuevo
  function invokeAgain() {
    closeModal("result-modal");
    gameState.selectedCharacters = [];
    gameState.selectedStone = null;
    gameState.selectedEquipables = [];
    document.querySelectorAll(".character-card").forEach(card => card.classList.remove("selected"));
    document.querySelectorAll(".stone-item").forEach(item => item.classList.remove("selected"));
    document.querySelectorAll(".equipable-item").forEach(item => item.classList.remove("selected"));
    updateSelection();
    document.querySelector(".invocaciones-content").scrollTo({ top: 0, behavior: "smooth" });
    showInvokeModal();
  }
  
  // Ir a Mazmorras (guardar equipo)
  function goToDungeons() {
    const modal = document.createElement("div");
    modal.id = "dungeons-confirm-modal";
    modal.classList.add("modal");
    modal.innerHTML = `
      <div class="modal-content">
        <h3>¿Confirmar equipo para Mazmorras?</h3>
        <p>Personajes: ${gameState.selectedCharacters.length}<br>
        Piedra: ${gameState.selectedStone ? gameState.selectedStone.name : "Ninguna"}<br>
        Poder total: ${gameState.teamPower}</p>
        <div class="modal-buttons">
          <button type="button" onclick="confirmGoToDungeons()">Confirmar</button>
          <button type="button" onclick="closeModal('dungeons-confirm-modal')">Cancelar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = "flex";
    gsap.from(".modal-content", { scale: 0.9, opacity: 0, duration: 0.3, ease: "back.out(1.7)" });
  }
  
  function confirmGoToDungeons() {
    const currentTeam = {
      characters: gameState.selectedCharacters,
      stone: gameState.selectedStone,
      equipables: gameState.selectedEquipables,
      consumibles: gameState.selectedConsumibles,
      teamPower: gameState.teamPower,
      playerCurrencies: gameState.playerCurrencies,
      inventory: gameState.playerInventory
    };
    try {
      localStorage.setItem("currentTeam", JSON.stringify(currentTeam));
    } catch (e) {
      console.error("Error al guardar en localStorage:", e);
      alert("No se pudo guardar el equipo. Es posible que el almacenamiento esté lleno.");
      return;
    }
  
    const feedback = document.createElement("div");
    feedback.classList.add("feedback-message");
    feedback.textContent = "Equipo guardado";
    document.body.appendChild(feedback);
    gsap.from(feedback, { opacity: 0, y: -20, duration: 0.5 });
    gsap.to(feedback, { opacity: 0, duration: 0.5, delay: 1.5, onComplete: () => feedback.remove() });
  
    closeModal("dungeons-confirm-modal");
    navigateWithTransition("mazmorras.html");
  }