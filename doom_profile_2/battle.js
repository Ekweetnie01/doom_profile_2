document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const slayerNameEl = document.getElementById('slayer-name');
  const slayerHpEl = document.getElementById('slayer-hp');
  const slayerHealthBar = document.getElementById('slayer-health-bar');
  const demonNameEl = document.getElementById('demon-name');
  const demonHpEl = document.getElementById('demon-hp');
  const demonHealthBar = document.getElementById('demon-health-bar');
  const battleLog = document.getElementById('battle-log');
  const attackBtn = document.getElementById('attack-btn');
  const specialAttackBtn = document.getElementById('special-attack-btn');
  const healBtn = document.getElementById('heal-btn');
  const slayerFighterEl = document.getElementById('slayer-fighter');
  const demonFighterEl = document.getElementById('demon-fighter');

  // --- Game State ---
  const slayer = {
    name: sessionStorage.getItem('username') || 'Slayer',
    maxHp: 100,
    currentHp: 100,
    attackPower: 15,
    specialPower: 40,
    healAmount: 25,
    specialUsed: false,
  };

  const demon = {
    name: 'Imp',
    maxHp: 80,
    currentHp: 80,
    attackPower: 10,
  };

  // --- Initialization ---
  function initializeBattle() {
    slayerNameEl.textContent = slayer.name;
    updateHealthUI('slayer', slayer.currentHp, slayer.maxHp);

    demonNameEl.textContent = demon.name;
    updateHealthUI('demon', demon.currentHp, demon.maxHp);

    logMessage(`A wild ${demon.name} appears!`, 'system-message');
  }

  // --- UI Update Functions ---
  function updateHealthUI(character, currentHp, maxHp) {
    const hpEl = character === 'slayer' ? slayerHpEl : demonHpEl;
    const healthBar = character === 'slayer' ? slayerHealthBar : demonHealthBar;

    const healthPercentage = Math.max(0, (currentHp / maxHp) * 100);
    hpEl.textContent = Math.max(0, currentHp);
    healthBar.style.width = `${healthPercentage}%`;

    // Change health bar color based on percentage
    const backgroundPosition = 100 - healthPercentage;
    healthBar.style.backgroundPosition = `${backgroundPosition}%`;
  }

  function logMessage(message, className) {
    const p = document.createElement('p');
    p.textContent = message;
    if (className) {
      p.classList.add(className);
    }
    battleLog.prepend(p); // Add new messages to the top
  }

  function toggleButtons(disabled) {
    attackBtn.disabled = disabled;
    specialAttackBtn.disabled = disabled || slayer.specialUsed;
    healBtn.disabled = disabled;
  }

  // --- Animation ---
  function playHitAnimation(character) {
      const targetElement = character === 'slayer' ? slayerFighterEl : demonFighterEl;
      targetElement.classList.add('hit');
      setTimeout(() => {
          targetElement.classList.remove('hit');
      }, 300); // Duration of the shake animation
  }

  // --- Battle Logic ---
  function playerTurn(action) {
    if (checkGameOver()) return;
    toggleButtons(true); // Disable buttons during the turn

    if (action === 'attack') {
      const damage = Math.floor(Math.random() * slayer.attackPower) + 5;
      demon.currentHp -= damage;
      playHitAnimation('demon');
      updateHealthUI('demon', demon.currentHp, demon.maxHp);
      logMessage(`${slayer.name} attacks for ${damage} damage!`, 'player-turn');
    } else if (action === 'special' && !slayer.specialUsed) {
      const damage = Math.floor(Math.random() * slayer.specialPower) + 20;
      demon.currentHp -= damage;
      playHitAnimation('demon');
      updateHealthUI('demon', demon.currentHp, demon.maxHp);
      logMessage(`${slayer.name} uses BFG Blast for a massive ${damage} damage!`, 'player-turn');
      slayer.specialUsed = true;
      specialAttackBtn.disabled = true; // Permanently disable for this battle
    } else if (action === 'heal') {
      const healed = Math.floor(Math.random() * slayer.healAmount) + 10;
      slayer.currentHp = Math.min(slayer.maxHp, slayer.currentHp + healed);
      updateHealthUI('slayer', slayer.currentHp, slayer.maxHp);
      logMessage(`${slayer.name} finds a health pack and recovers ${healed} HP.`, 'player-turn');
    }

    if (checkGameOver()) return;

    // Demon's turn after a short delay
    setTimeout(demonTurn, 1000);
  }

  function demonTurn() {
    if (checkGameOver()) return;

    const damage = Math.floor(Math.random() * demon.attackPower) + 5;
    slayer.currentHp -= damage;
    playHitAnimation('slayer');
    updateHealthUI('slayer', slayer.currentHp, slayer.maxHp);
    logMessage(`${demon.name} retaliates, dealing ${damage} damage!`, 'enemy-turn');

    if (checkGameOver()) return;

    toggleButtons(false); // Re-enable player buttons
  }

  function checkGameOver() {
    if (demon.currentHp <= 0) {
      logMessage(`${demon.name} has been defeated! YOU ARE VICTORIOUS!`, 'system-message');
      toggleButtons(true);
      return true;
    } else if (slayer.currentHp <= 0) {
      logMessage(`${slayer.name} has fallen. The demons have won...`, 'system-message');
      toggleButtons(true);
      return true;
    }
    return false;
  }

  // --- Event Listeners ---
  attackBtn.addEventListener('click', () => playerTurn('attack'));
  specialAttackBtn.addEventListener('click', () => playerTurn('special'));
  healBtn.addEventListener('click', () => playerTurn('heal'));

  // --- Start the battle ---
  initializeBattle();
});