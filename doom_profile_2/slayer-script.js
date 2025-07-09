document.addEventListener('DOMContentLoaded', () => {

  function doomLog(message) {
    const timestamp = new Date().toLocaleTimeString();

    console.log(`%c[${timestamp}] DOOM SYSTEM: ${message}`, 'color: #ff4500; font-weight: bold;');
  }

  doomLog("Character creation system initialized");

  const username = sessionStorage.getItem('slayerUsername');
  const selectedWeaponJSON = sessionStorage.getItem('selectedWeapon');
  const selectedWeapon = selectedWeaponJSON ? JSON.parse(selectedWeaponJSON) : null;

  const displayUsernameElement = document.getElementById('display-username');
  const displayWeaponElement = document.getElementById('display-weapon');

  if (displayUsernameElement && username) {
    displayUsernameElement.textContent = username;
  }

  if (displayWeaponElement && selectedWeapon) {
    displayWeaponElement.textContent = selectedWeapon.name;
  } else if (displayWeaponElement) {
    displayWeaponElement.textContent = "None! (Return to choose)";
  }

  const slayersContainer = document.getElementById('slayers-container');
  const slayerCardTemplate = document.getElementById('slayer-card-template');
  const createdSlayers = [];

  /**
   * Creates a slayer card element from a data object using the template.
   * @param {object} slayerData - The data for the slayer to display.
   * @returns {HTMLElement} The populated slayer card element.
   */
  function createSlayerCard(slayerData) {
    const cardClone = slayerCardTemplate.content.cloneNode(true);
    const card = cardClone.querySelector('.slayer-card');
    const nameEl = card.querySelector('.slayer-name');
    const weaponEl = card.querySelector('.slayer-weapon');
    const bioEl = card.querySelector('.slayer-bio');
    const statsEl = card.querySelector('.slayer-stats');

    nameEl.textContent = slayerData.name;
    weaponEl.innerHTML = `<strong>Weapon:</strong> ${slayerData.weapon.name}`;
    bioEl.textContent = slayerData.bio;

    statsEl.innerHTML = `
        <p>Strength: ${slayerData.stats.strength}</p>
        <p>Speed: ${slayerData.stats.speed}</p>
        <p>Experience: ${slayerData.stats.experience}</p>
    `;

    return card;
  }

  /**
   * Renders all created slayers into the container.
   */
  function renderSlayers() {
    slayersContainer.innerHTML = '';
    const fragment = document.createDocumentFragment();
    createdSlayers.forEach(slayer => {
      const card = createSlayerCard(slayer);
      fragment.appendChild(card);
    });
    slayersContainer.appendChild(fragment);
  }

  const creationForm = document.querySelector('.container.card form');

  if (creationForm) {
    
    creationForm.addEventListener('submit', function (event) {
      event.preventDefault(); 

    
      const slayerNameInput = document.getElementById('name');
      const slayerName = slayerNameInput.value.trim();
      const ageSelected = document.querySelector('input[name="age"]:checked');
      const gender = document.getElementById('gender').value;
      const bio = document.getElementById('bio').value.trim();



     
      if (slayerName === "") {
        alert("Your Slayer needs a name!");
        slayerNameInput.focus(); 
        return;
      }

      if (!ageSelected) {
        alert("Please select your Slayer's age range!");
        return;
      }

      if (!selectedWeapon) {
        alert("Your Slayer has no weapon! Go back and choose one from the arsenal.");
        return;
      }

      const slayerData = {
        name: slayerName,
        age: ageSelected.value,
        gender: gender,
        bio: bio,
        weapon: selectedWeapon,
        stats: statsManager.currentStats
      };

      createdSlayers.push(slayerData);
      renderSlayers();
     
      doomLog("New Slayer registered: " + slayerName);
      creationForm.reset();
      // Reset the stats panel to its initial state
      statsManager.updateStats({ target: { value: '' } });
    });
  }

  /**
   * Manages the real-time update of the Slayer stats preview panel.
   */
  class SlayerStatsManager {
    constructor() {
      // Store all necessary DOM elements
      this.ageRadios = document.querySelectorAll('input[name="age"]');
      this.strengthFill = document.getElementById('strength-fill');
      this.strengthValue = document.getElementById('strength-value');
      this.speedFill = document.getElementById('speed-fill');
      this.speedValue = document.getElementById('speed-value');
      this.experienceFill = document.getElementById('experience-fill');
      this.experienceValue = document.getElementById('experience-value');
      this.totalPowerValue = document.getElementById('total-power-value');
      this.liveMotivation = document.getElementById('live-motivation');

      this.currentStats = { strength: 0, speed: 0, experience: 0 };
      // Stat data
      this.statsByAge = {
        "19-25": { strength: 85, speed: 95, experience: 60 },
        "26-45": { strength: 95, speed: 80, experience: 85 },
        "50+":   { strength: 70, speed: 60, experience: 100 },
      };

      this.init();
    }

    /**
     * Initializes event listeners and sets the initial state.
     */
    init() {
      this.ageRadios.forEach(radio => {
        radio.addEventListener('change', (event) => this.updateStats(event));
      });

      // Check if an age is already selected on page load
      const checkedAge = document.querySelector('input[name="age"]:checked');
      if (checkedAge) {
        this.updateStats({ target: checkedAge }); // Simulate an event object
      }
    }

    /**
     * Calculates stats based on the selected age and updates the UI.
     * @param {Event} event - The change event from the radio button.
     */
    updateStats(event) {
      const ageValue = event.target.value;
      const stats = this.statsByAge[ageValue] || { strength: 0, speed: 0, experience: 0 };
      this.currentStats = stats;
      const totalPower = stats.strength + stats.speed + stats.experience;

      this.animateStatBars(stats);

      // Update text values
      this.strengthValue.textContent = stats.strength;
      this.speedValue.textContent = stats.speed;
      this.experienceValue.textContent = stats.experience;
      this.totalPowerValue.textContent = totalPower;

      // Update motivation message
      if (totalPower >= 250) {
        this.liveMotivation.textContent = "You are UNSTOPPABLE! Rip and tear!";
      } else if (totalPower >= 200) {
        this.liveMotivation.textContent = "A formidable Slayer indeed!";
      } else {
        this.liveMotivation.textContent = "Keep training, warrior!";
      }
    }

    /**
     * Updates the width of the stat bars for a smooth animation.
     * @param {object} stats - The object containing strength, speed, and experience.
     */
    animateStatBars(stats) {
      this.strengthFill.style.width = `${stats.strength}%`;
      this.speedFill.style.width = `${stats.speed}%`;
      this.experienceFill.style.width = `${stats.experience}%`;
    }
  }

  // Instantiate the manager to activate the live stats panel
  window.statsManager = new SlayerStatsManager();
  
  const bioTextarea = document.getElementById('bio');
  const maxChars = 200;

  if (bioTextarea) {
    
    const counterDiv = document.createElement('div');
    counterDiv.id = 'char-counter';
    counterDiv.textContent = `0/${maxChars} characters`;
    
    counterDiv.style.textAlign = 'right';
    counterDiv.style.fontSize = '0.8em';
    counterDiv.style.marginTop = '4px';
    counterDiv.style.color = 'red';
    
    bioTextarea.parentNode.insertBefore(counterDiv, bioTextarea.nextSibling);

    
    bioTextarea.addEventListener('input', () => {
      let currentLength = bioTextarea.value.length;

      
      if (currentLength > maxChars) {
        bioTextarea.value = bioTextarea.value.substring(0, maxChars);
        currentLength = maxChars; 
      }

      counterDiv.textContent = `${currentLength}/${maxChars} characters`;

    });
  }
});