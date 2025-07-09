class BattleSystem {
  constructor() {
    this.slayer = null;
    this.currentEnemy = null;
    this.battleActive = false;

    // DOM elements for the simulator
    this.dom = {
      slayerName: document.getElementById('slayer-name-display'),
      slayerHealthBar: document.getElementById('slayer-health'),
      slayerStatsMini: document.getElementById('slayer-stats-mini'),
      enemyName: document.getElementById('enemy-name'),
      enemyHealthBar: document.getElementById('enemy-health'),
      startBtn: document.getElementById('start-battle'),
      attackBtn: document.getElementById('use-weapon'),
      specialBtn: document.getElementById('use-ability'),
      resetBtn: document.getElementById('reset-battle'),
      logContent: document.getElementById('log-content'),
      enemyGrid: document.getElementById('enemy-grid'),
    };

    // Enemy data with different types
    this.enemies = [
      { name: 'Imp', maxHp: 80, attack: 12, image: 'public/imp-sprite.png' },
      { name: 'Pinky', maxHp: 150, attack: 25, image: 'public/pinky-sprite.png' },
      { name: 'Cacodemon', maxHp: 120, attack: 18, image: 'public/cacodemon-sprite.png' },
      { name: 'Revenant', maxHp: 100, attack: 22, image: 'public/revenant-sprite.png' } // Assuming you have this image
    ];

    this.initializeEventListeners();
    this.createEnemyGrid();
    this.resetBattle(); // Set the initial state
  }

  initializeEventListeners() {
    this.dom.startBtn.addEventListener('click', () => this.startBattle());
    this.dom.attackBtn.addEventListener('click', () => this.playerAttack('attack'));
    this.dom.specialBtn.addEventListener('click', () => this.playerAttack('special'));
    this.dom.resetBtn.addEventListener('click', () => this.resetBattle());
  }

  createEnemyGrid() {
    this.dom.enemyGrid.innerHTML = ''; // Clear grid before populating
    this.enemies.forEach(enemyData => {
      const enemyCard = document.createElement('div');
      // Re-use the .weapon-card style for consistency
      enemyCard.className = 'weapon-card';
      enemyCard.style.cursor = 'pointer';
      enemyCard.innerHTML = `<img src="${enemyData.image}" alt="${enemyData.name}"><p>${enemyData.name}</p>`;
      enemyCard.addEventListener('click', () => this.selectEnemy(enemyData.name));
      this.dom.enemyGrid.appendChild(enemyCard);
    });
  }

  selectEnemy(enemyName) {
    if (this.battleActive) return;

    const enemyData = this.enemies.find(e => e.name === enemyName);
    if (!enemyData) return;

    // Create a fresh instance of the enemy for the battle
    this.currentEnemy = { ...enemyData, currentHp: enemyData.maxHp };

    this.dom.enemyName.textContent = this.currentEnemy.name;
    this.updateHealthBars();
    this.addBattleLog(`Selected enemy: ${this.currentEnemy.name}.`);
    this.dom.startBtn.disabled = false;

    // Highlight the selected enemy card
    Array.from(this.dom.enemyGrid.children).forEach(card => {
      card.classList.remove('selected');
      if (card.textContent.includes(enemyName)) {
        card.classList.add('selected');
      }
    });
  }

  startBattle() {
    if (!this.currentEnemy) {
      this.addBattleLog('Please select an enemy to fight!');
      return;
    }
    if (this.battleActive) return;

    // Fetch the Slayer's current stats from the live stats panel
    this.slayer = {
      name: document.getElementById('display-username').textContent || 'Slayer',
      maxHp: 100, // Base HP for the Slayer
      currentHp: 100,
      strength: parseInt(document.getElementById('strength-value').textContent) || 10,
      experience: parseInt(document.getElementById('experience-value').textContent) || 10,
      specialUsed: false
    };

    this.dom.slayerName.textContent = this.slayer.name;
    this.dom.slayerStatsMini.innerHTML = `Str: ${this.slayer.strength} | Exp: ${this.slayer.experience}`;

    this.battleActive = true;
    this.dom.startBtn.disabled = true;
    this.toggleActionButtons(false);

    // Disable enemy selection during battle
    this.dom.enemyGrid.style.pointerEvents = 'none';
    this.dom.enemyGrid.style.opacity = '0.5';

    this.updateHealthBars();
    this.addBattleLog(`Battle started against ${this.currentEnemy.name}!`);
  }

  playerAttack(type) {
    if (!this.battleActive) return;

    this.toggleActionButtons(true); // Prevent spamming

    let damage = 0;
    let logMessage = '';

    if (type === 'attack') {
      // Damage is based on a random base value plus a bonus from Strength
      damage = Math.floor(Math.random() * 6) + 5 + Math.floor(this.slayer.strength / 5);
      logMessage = `${this.slayer.name} attacks for ${damage} damage.`;
    } else if (type === 'special' && !this.slayer.specialUsed) {
      // Special damage is higher and based on Experience
      damage = Math.floor(Math.random() * 11) + 15 + Math.floor(this.slayer.experience / 4);
      logMessage = `${this.slayer.name} uses a special ability for a massive ${damage} damage!`;
      this.slayer.specialUsed = true;
      this.dom.specialBtn.disabled = true; // Special can only be used once
    } else {
      this.toggleActionButtons(false); // Re-enable if action was invalid (e.g., used special twice)
      return;
    }

    this.currentEnemy.currentHp -= damage;
    this.addBattleLog(logMessage);
    this.updateHealthBars();

    if (this.checkBattleEnd()) return;

    // The enemy attacks after a short delay
    setTimeout(() => this.enemyAttack(), 1000);
  }

  enemyAttack() {
    if (!this.battleActive) return;

    // Enemy damage has a small random variance
    const damageVariance = this.currentEnemy.attack * 0.2;
    const damage = Math.floor(this.currentEnemy.attack - damageVariance + Math.random() * (damageVariance * 2));

    this.slayer.currentHp -= damage;
    this.addBattleLog(`${this.currentEnemy.name} retaliates for ${damage} damage.`);
    this.updateHealthBars();

    if (this.checkBattleEnd()) return;

    this.toggleActionButtons(false); // Re-enable player buttons for their turn
  }

  updateHealthBars() {
    const slayerHpPercent = this.slayer ? Math.max(0, (this.slayer.currentHp / this.slayer.maxHp) * 100) : 100;
    this.dom.slayerHealthBar.style.width = `${slayerHpPercent}%`;

    const enemyHpPercent = this.currentEnemy ? Math.max(0, (this.currentEnemy.currentHp / this.currentEnemy.maxHp) * 100) : 100;
    this.dom.enemyHealthBar.style.width = `${enemyHpPercent}%`;
  }

  addBattleLog(message) {
    const p = document.createElement('p');
    p.textContent = `> ${message}`;
    this.dom.logContent.prepend(p); // Add new messages to the top
  }

  checkBattleEnd() {
    if (this.currentEnemy && this.currentEnemy.currentHp <= 0) {
      this.addBattleLog(`VICTORY! ${this.currentEnemy.name} has been defeated.`);
      this.battleActive = false;
      this.toggleActionButtons(true);
      return true;
    }
    if (this.slayer && this.slayer.currentHp <= 0) {
      this.addBattleLog(`DEFEAT! ${this.slayer.name} has fallen.`);
      this.battleActive = false;
      this.toggleActionButtons(true);
      return true;
    }
    return false;
  }

  toggleActionButtons(disabled) {
    this.dom.attackBtn.disabled = disabled;
    // Special button stays disabled if it has been used
    this.dom.specialBtn.disabled = disabled || (this.slayer && this.slayer.specialUsed);
  }

  resetBattle() {
    this.battleActive = false;
    this.slayer = null;
    this.currentEnemy = null;

    this.dom.slayerName.textContent = 'Your Slayer';
    this.dom.enemyName.textContent = 'Select Enemy';
    this.dom.slayerStatsMini.innerHTML = '';
    this.dom.logContent.innerHTML = '<p>> Ready for battle...</p>';
    this.updateHealthBars();

    this.dom.startBtn.disabled = true;
    this.toggleActionButtons(true);

    this.dom.enemyGrid.style.pointerEvents = 'auto';
    this.dom.enemyGrid.style.opacity = '1';
    Array.from(this.dom.enemyGrid.children).forEach(card => card.classList.remove('selected'));
  }
}

// Initialize the BattleSystem when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  window.battleSystem = new BattleSystem();
});